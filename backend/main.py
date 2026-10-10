"""AETHERIS AEOS Authoritative FastAPI Backend Server.

Unified, backend-driven multi-agent enterprise operating system engine.
Hosts authentication, real multi-agent orchestration, evidence-based compliance,
and mathematically verifiable cryptographic audit ledgers.
Ready for deployment on Render and integration with Vercel frontend.
"""

import os
import sys
import time
from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Ensure the backend directory is in sys.path for direct module resolution
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

try:
    from .database import init_db, get_iso_now
    from .routers.auth import router as auth_router
    from .routers.swarm import router as swarm_router, health_router as system_health_router
    from .routers.orchestration import router as orchestration_router
except (ImportError, ValueError):
    from database import init_db, get_iso_now
    from routers.auth import router as auth_router
    from routers.swarm import router as swarm_router, health_router as system_health_router
    from routers.orchestration import router as orchestration_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Initialize relational database and seed baseline data on startup
    init_db()
    yield


app = FastAPI(
    title="AETHERIS // AEOS Authoritative Backend",
    description="Autonomous Enterprise AI Operating System Engine — High-concurrency FastAPI Service",
    version="2.6.4",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Dynamic CORS configuration supporting Vercel previews and production
raw_cors = os.environ.get("CORS_ORIGINS", os.environ.get("FRONTEND_URL", "")).strip()

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
]

if raw_cors and raw_cors != "*":
    for origin in raw_cors.split(","):
        clean_origin = origin.strip()
        if clean_origin and clean_origin not in ALLOWED_ORIGINS:
            ALLOWED_ORIGINS.append(clean_origin)

if raw_cors == "*":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_origin_regex=r"^https://.*\.vercel\.app$",
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(_request: Request, exc: HTTPException):
    """Guarantee consistent JSON error schemas across all API responses."""
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": str(exc.detail)}
    )


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start_time) * 1000
    timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    print(f"[FastAPI {timestamp}] {request.method} {request.url.path} -> {response.status_code} ({duration_ms:.1f}ms)")
    return response


# Mount Routers
app.include_router(auth_router)
app.include_router(swarm_router)
app.include_router(orchestration_router)
app.include_router(system_health_router)


# Base health checks
@app.get("/api/health", tags=["Health"])
async def base_health():
    return {
        "status": "online",
        "version": "2.6.4",
        "service": "AETHERIS // Autonomous Enterprise AI Operating System Engine (FastAPI Authoritative)",
        "timestamp": get_iso_now()
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "AETHERIS AEOS FastAPI Authoritative Backend",
        "version": "2.6.4",
        "status": "running",
        "docs": "/docs",
        "timestamp": get_iso_now()
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))
    print("================================================================")
    print(f"🚀 AETHERIS AEOS FastAPI Server running on http://0.0.0.0:{port}")
    print("📡 Endpoints: /api/auth, /api/swarm, /api/orchestration, /api/health, /docs")
    print("🔒 RBAC, Relational ACID Persistence & Cryptographic Ledger: ACTIVE")
    print("================================================================")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
