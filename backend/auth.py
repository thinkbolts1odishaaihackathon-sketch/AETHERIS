"""AETHERIS AEOS Authentication & Role-Based Access Control (RBAC).

Enforces backend authorization, token verification, secret management,
and organization-level data isolation.
"""

import os
import time
from typing import List, Optional
import jwt
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
try:
    from .database import SessionLocal, get_db, User as DBUser
    from .models import UserPublicProfile, UserRole
except (ImportError, ValueError):
    from database import SessionLocal, get_db, User as DBUser
    from models import UserPublicProfile, UserRole

JWT_SECRET = os.environ.get("JWT_SECRET", "aetheris_super_secret_jwt_key_2026_enterprise_production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_SECONDS = 86400  # 24 hours

bearer_scheme = HTTPBearer(auto_error=False)


def generate_token(user: UserPublicProfile) -> str:
    """Generate a signed JWT token with user identity and organization bounds."""
    payload = {
        "userId": user.id,
        "email": user.email,
        "role": user.role,
        "organization": user.organization,
        "exp": int(time.time()) + JWT_EXPIRATION_SECONDS,
        "iat": int(time.time())
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    authorization: Optional[str] = Header(None)
) -> UserPublicProfile:
    """
    Authenticate the incoming request from the Authorization header.
    Validates token signature, expiration, and user persistence in the relational DB.
    """
    token: Optional[str] = None
    if auth and auth.credentials:
        token = auth.credentials
    elif authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "message": "Authentication token required. Please sign in to access enterprise endpoints."}
        )

    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = decoded.get("userId")

        with SessionLocal() as db:
            db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
            if not db_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={"success": False, "message": "Invalid session: User no longer exists."}
                )
            return UserPublicProfile(
                id=db_user.id,
                email=db_user.email,
                name=db_user.name,
                role=db_user.role,
                organization=db_user.organization_id,
                department=db_user.department or "Operations",
                avatarColor=db_user.avatar_color,
                publicKey=db_user.public_key,
                lastLoginAt=db_user.last_login_at
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": "Session expired or token invalid. Please re-authenticate."}
        )


def require_role(allowed_roles: List[str]):
    """Enforce that the authenticated user possesses one of the allowed roles."""
    def role_checker(current_user: UserPublicProfile = Depends(get_current_user)) -> UserPublicProfile:
        if current_user.role not in allowed_roles:
            roles_str = ", ".join(allowed_roles)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": f"Forbidden: Role '{current_user.role}' lacks authorization for this action. Required: [{roles_str}]"
                }
            )
        return current_user
    return role_checker
