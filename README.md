# AETHERIS AEOS — Autonomous Enterprise Operating System

> **Production Deployment Architecture**  
> **Backend:** FastAPI (Python 3.10+) configured for **Render**  
> **Frontend:** React 19 + TypeScript + Vite configured for **Vercel**

---

## 📁 Project Directory Structure

```text
├── backend/                       # Authoritative FastAPI Backend (Deploy to Render)
│   ├── routers/                   # API routes (/api/auth, /api/swarm, /api/orchestration)
│   ├── services/                  # Business logic (orchestrator, operations, compliance)
│   ├── main.py                    # Server entrypoint with CORS & lifespan handlers
│   ├── database.py                # ACID SQLAlchemy models & schema initializers
│   ├── crypto_engine.py           # RFC 8785 canonical JSON, SHA-256 Merkle trees & Ed25519 signatures
│   ├── models.py                  # Pydantic schemas & enums
│   ├── auth.py                    # JWT authentication & RBAC dependencies
│   ├── test_api.py                # 11-step architectural verification test suite
│   ├── aetheris.db                # SQLite database (auto-seeded on cold start)
│   ├── requirements.txt           # Python dependencies for Render
│   ├── Procfile                   # Web process definition for Render
│   ├── render.yaml                # Render Blueprint configuration
│   └── .env.example               # Backend environment variables template
│
├── frontend/                      # React 19 Client SPA (Deploy to Vercel)
│   ├── src/
│   │   ├── components/            # UI dashboards, action gate modals, visualizers
│   │   ├── services/
│   │   │   └── api.ts             # API client resolving VITE_API_URL
│   │   ├── context/               # AuthContext & session management
│   │   └── ...
│   ├── public/                    # Static assets & icons
│   ├── package.json               # Frontend dependencies & build scripts
│   ├── vite.config.ts             # Vite configuration with local /api proxy
│   ├── vercel.json                # Vercel SPA rewrite routing configuration
│   └── .env.example               # Frontend environment variables template (VITE_API_URL)
│
├── package.json                   # Workspace root script runner
└── README.md                      # Deployment & Operations Guide
```

---

## 🚀 1. Backend Deployment (Render)

### Step 1: Connect Repository to Render
1. Go to the [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.

### Step 2: Configure Service Settings
- **Name:** `aetheris-backend` (or your preferred name)
- **Region:** Frankfurt / Oregon / Ohio (choose closest to your users)
- **Root Directory:** `backend` ⚠️ *(Crucial: set to `backend`)*
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Set Environment Variables
In the Render Web Service dashboard, go to the **Environment** tab and add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `10000` | (Render sets this automatically, but safe to set) |
| `CORS_ORIGINS` | `https://your-frontend-app.vercel.app` | Your Vercel frontend URL (or `*` to allow any origin) |
| `JWT_SECRET` | `generate-a-secure-random-string-here` | Secret key for JWT signing |
| `DATABASE_URL` | `postgresql://user:password@host/dbname` | **PostgreSQL Connection String** (Render injects this if you attach a Render PostgreSQL database. If omitted, uses local SQLite.) |

### Step 4: Deploy & Copy URL
- Click **Deploy Web Service**.
- Once deployed, copy your Render Web Service URL (e.g., `https://aetheris-backend.onrender.com`).

---

## ⚡ 2. Frontend Deployment (Vercel)

### Step 1: Import Project into Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository.

### Step 2: Configure Project Settings
- **Framework Preset:** `Vite`
- **Root Directory:** Click **Edit** and select `frontend` ⚠️ *(Crucial: select `frontend`)*
- **Build Command:** `npm run build` (default)
- **Output Directory:** `dist` (default)

### Step 3: Add Frontend Environment Variables
Under **Environment Variables**, add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://aetheris-backend.onrender.com` | **Your Render Backend URL** (without `/api` or with `/api`, both are supported automatically) |
| `VITE_GEMINI_API_KEY` | `AIzaSy...` | **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey) for real-time multi-agent intelligence) |

> 💡 **How `VITE_API_URL` works:**  
> The API client in `frontend/src/services/api.ts` automatically reads `import.meta.env.VITE_API_URL`.  
> - When set to `https://aetheris-backend.onrender.com`, requests target `https://aetheris-backend.onrender.com/api/...`.  
> - When running locally (unset), requests automatically fallback to `/api` and are proxied to `http://localhost:3001` via Vite.

### Step 4: Deploy
- Click **Deploy**.
- Vercel will build and publish your application with full client-side SPA routing powered by `vercel.json`.

---

## 💻 3. Local Development

You can run both services locally from the workspace root or inside individual directories:

```bash
# 1. Install frontend dependencies
npm --prefix frontend install

# 2. Run backend architectural test suite
npm run test:py

# 3. Start Python FastAPI backend server (http://localhost:3001)
npm run server

# 4. In a second terminal, start Vite frontend dev server (http://localhost:5173)
npm run dev
```

### Default Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| `executive` (CEO) | `elena@aetheris.ai` | `Executive2026!` |
| `operations_director` | `marcus@aetheris.ai` | `Operations2026!` |
| `compliance_officer` | `sophia@aetheris.ai` | `Compliance2026!` |
| `analyst` | `jordan@aetheris.ai` | `Analyst2026!` |
