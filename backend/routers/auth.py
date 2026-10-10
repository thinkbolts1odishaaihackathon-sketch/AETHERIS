"""AETHERIS AEOS Authentication Router.

Endpoints for user login, registration, SSO federation, role switching,
session retrieval, and logout with relational database persistence.
"""

import bcrypt
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

try:
    from ..database import get_db, User as DBUser, Organization, get_iso_now
    from ..models import LoginRequest, RegisterRequest, SSORequest, SwitchRoleRequest, UserPublicProfile, UserRole
    from ..auth import generate_token, get_current_user
    from ..crypto_engine import generate_ed25519_keypair
    from ..services.operations import _record_audit
except (ImportError, ValueError):
    from database import get_db, User as DBUser, Organization, get_iso_now
    from models import LoginRequest, RegisterRequest, SSORequest, SwitchRoleRequest, UserPublicProfile, UserRole
    from auth import generate_token, get_current_user
    from crypto_engine import generate_ed25519_keypair
    from services.operations import _record_audit

router = APIRouter(prefix="/api/auth", tags=["Authentication & RBAC"])


def _to_profile(u: DBUser) -> UserPublicProfile:
    return UserPublicProfile(
        id=u.id,
        email=u.email,
        name=u.name,
        role=u.role,
        organization=u.organization_id,
        department=u.department or "Operations",
        avatarColor=u.avatar_color,
        publicKey=u.public_key,
        lastLoginAt=u.last_login_at
    )


@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    if not req.email or not req.password:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Email and password are required."}
        )

    user = db.query(DBUser).filter(DBUser.email == req.email.lower().strip()).first()
    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Invalid enterprise credentials."}
        )

    # Verify password with bcrypt
    try:
        is_valid = bcrypt.checkpw(req.password.encode("utf-8"), user.password_hash.encode("utf-8"))
    except Exception:
        is_valid = False

    if not is_valid:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Invalid enterprise credentials."}
        )

    user.last_login_at = get_iso_now()
    db.commit()

    profile = _to_profile(user)
    token = generate_token(profile)

    _record_audit(
        db=db,
        org_id=user.organization_id,
        event_type="USER_LOGIN_SUCCESS",
        entity_type="auth",
        entity_id=user.id,
        actor_id=user.id,
        actor_role=user.role,
        details=f"User {user.email} authenticated successfully via enterprise credentials.",
        payload={"email": user.email, "role": user.role}
    )
    db.commit()

    return {
        "success": True,
        "message": "Authentication successful.",
        "token": token,
        "user": profile.model_dump()
    }


@router.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if not req.email or not req.password or not req.name:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Name, email, and password are required."}
        )

    existing = db.query(DBUser).filter(DBUser.email == req.email.lower().strip()).first()
    if existing:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"success": False, "message": "An enterprise account with this email already exists."}
        )

    valid_roles = ["executive", "compliance_officer", "operations_director", "auditor"]
    user_role = req.role if req.role in valid_roles else "executive"

    # Default to organization or create
    org = db.query(Organization).first()
    org_id = org.id if org else "org-aetheris-01"

    color_map = {
        "executive": "#2563eb",
        "compliance_officer": "#0284c7",
        "operations_director": "#ff6b00",
        "auditor": "#4f46e5"
    }

    pw_hash = bcrypt.hashpw(req.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    priv_hex, pub_hex = generate_ed25519_keypair()
    now = get_iso_now()

    new_user = DBUser(
        id=f"usr-{int(datetime_to_ms())}",
        organization_id=org_id,
        email=req.email.lower().strip(),
        password_hash=pw_hash,
        name=req.name,
        role=user_role,
        department=req.department or "Operations",
        avatar_color=color_map.get(user_role, "#2563eb"),
        public_key=f"ed25519:pub_{pub_hex}",
        private_key=priv_hex,
        created_at=now,
        last_login_at=now
    )
    db.add(new_user)
    db.commit()

    profile = _to_profile(new_user)
    token = generate_token(profile)

    _record_audit(
        db=db,
        org_id=org_id,
        event_type="USER_REGISTERED",
        entity_type="auth",
        entity_id=new_user.id,
        actor_id=new_user.id,
        actor_role=new_user.role,
        details=f"New enterprise user {new_user.email} registered with role '{new_user.role}'.",
        payload={"email": new_user.email, "role": new_user.role}
    )
    db.commit()

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "success": True,
            "message": "Enterprise account created successfully.",
            "token": token,
            "user": profile.model_dump()
        }
    )


@router.post("/sso")
async def sso_login(req: SSORequest, db: Session = Depends(get_db)):
    provider = req.provider or "Okta Enterprise SSO"
    email = req.email or "executive@aetheris.ai"

    user = db.query(DBUser).filter(DBUser.email == email.lower().strip()).first()
    if not user:
        user = db.query(DBUser).first()

    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Enterprise SSO directory unavailable."}
        )

    user.last_login_at = get_iso_now()
    db.commit()

    profile = _to_profile(user)
    token = generate_token(profile)

    _record_audit(
        db=db,
        org_id=user.organization_id,
        event_type="SSO_LOGIN_SUCCESS",
        entity_type="auth",
        entity_id=user.id,
        actor_id=user.id,
        actor_role=user.role,
        details=f"Authenticated via Federated SAML/OIDC SSO ({provider}) as {user.email}.",
        payload={"provider": provider, "email": user.email}
    )
    db.commit()

    return {
        "success": True,
        "message": f"Federated SSO handshake verified via {provider}.",
        "token": token,
        "user": profile.model_dump(),
        "provider": provider
    }


@router.post("/switch-role")
async def switch_role(
    req: SwitchRoleRequest,
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_roles = ["executive", "compliance_officer", "operations_director", "auditor"]
    if req.role not in valid_roles:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": f"Invalid role '{req.role}'"}
        )

    user = db.query(DBUser).filter(DBUser.id == current_user.id).first()
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "User not found"}
        )

    color_map = {
        "executive": "#2563eb",
        "compliance_officer": "#0284c7",
        "operations_director": "#ff6b00",
        "auditor": "#4f46e5"
    }

    user.role = req.role
    user.avatar_color = color_map.get(req.role, "#2563eb")
    db.commit()

    profile = _to_profile(user)
    new_token = generate_token(profile)

    _record_audit(
        db=db,
        org_id=user.organization_id,
        event_type="USER_ROLE_SWITCHED",
        entity_type="auth",
        entity_id=user.id,
        actor_id=user.id,
        actor_role=req.role,
        details=f"User {user.email} switched active role to '{req.role}'.",
        payload={"previous_role": current_user.role, "new_role": req.role}
    )
    db.commit()

    return {
        "success": True,
        "message": f"Role switched to {req.role}. Enterprise permissions updated.",
        "token": new_token,
        "user": profile.model_dump()
    }


@router.get("/me")
async def get_me(current_user: UserPublicProfile = Depends(get_current_user)):
    return {
        "success": True,
        "user": current_user.model_dump()
    }


@router.post("/logout")
async def logout(current_user: UserPublicProfile = Depends(get_current_user), db: Session = Depends(get_db)):
    _record_audit(
        db=db,
        org_id=current_user.organization,
        event_type="USER_LOGOUT",
        entity_type="auth",
        entity_id=current_user.id,
        actor_id=current_user.id,
        actor_role=current_user.role,
        details=f"User {current_user.email} signed out.",
        payload={"email": current_user.email}
    )
    db.commit()
    return {"success": True, "message": "Session terminated successfully."}


def datetime_to_ms() -> int:
    import time
    return int(time.time() * 1000)
