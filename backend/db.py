import json
import os
import time
import hmac
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import bcrypt
try:
    from .models import User, UserPublicProfile, AuditLogEntry, MerkleBlockRecord, UserRole
except (ImportError, ValueError):
    from models import User, UserPublicProfile, AuditLogEntry, MerkleBlockRecord, UserRole

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "server", "data"))
DB_FILE = os.path.join(DATA_DIR, "db.json")

def get_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

def get_role_color(role: UserRole) -> str:
    colors = {
        "executive": "#2563eb",
        "compliance_officer": "#0284c7",
        "operations_director": "#ff6b00",
        "auditor": "#4f46e5"
    }
    return colors.get(role, "#64748b")

class Database:
    def __init__(self):
        self.data: Dict[str, Any] = self._load()

    def _load(self) -> Dict[str, Any]:
        os.makedirs(DATA_DIR, exist_ok=True)
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[FastAPI DB] Error reading {DB_FILE}, seeding fresh database: {e}")

        # Initial seed
        initial = {
            "users": self._create_seed_users(),
            "auditLogs": [],
            "merkleBlocks": self._create_seed_blocks(),
            "activeMissions": [],
            "remediatedFrameworks": [],
            "reroutedCorridors": []
        }
        self._save(initial)
        return initial

    def _save(self, data: Optional[Dict[str, Any]] = None) -> None:
        if data is None:
            data = self.data
        os.makedirs(DATA_DIR, exist_ok=True)
        try:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[FastAPI DB] Error saving db: {e}")

    def _create_seed_users(self) -> List[Dict[str, Any]]:
        now = get_iso_now()
        pw_hash = bcrypt.hashpw(b"Aetheris2026!", bcrypt.gensalt()).decode("utf-8")
        return [
            {
                "id": "usr-exec-01",
                "email": "executive@aetheris.ai",
                "passwordHash": pw_hash,
                "name": "Elena Rostova",
                "role": "executive",
                "organization": "Aetheris Global Holdings Ltd.",
                "department": "Executive Board & Investment Committee",
                "avatarColor": "#2563eb",
                "publicKey": "ed25519:pub_7f81a93b22e1c0849201a4bc88e100f2",
                "createdAt": now,
                "lastLoginAt": now
            },
            {
                "id": "usr-comp-02",
                "email": "compliance@aetheris.ai",
                "passwordHash": pw_hash,
                "name": "Dr. Marcus Vance",
                "role": "compliance_officer",
                "organization": "Aetheris Global Holdings Ltd.",
                "department": "Global Regulatory & Trade Governance",
                "avatarColor": "#0284c7",
                "publicKey": "ed25519:pub_1c42b88f44d93eaa2099e1cbb3700f4a",
                "createdAt": now,
                "lastLoginAt": now
            },
            {
                "id": "usr-ops-03",
                "email": "operations@aetheris.ai",
                "passwordHash": pw_hash,
                "name": "Kavita Sharma",
                "role": "operations_director",
                "organization": "Aetheris Global Holdings Ltd.",
                "department": "Multi-Modal Logistics & Supply Chain",
                "avatarColor": "#ff6b00",
                "publicKey": "ed25519:pub_4d93eaa2099e1cbb3700f4acc1988e12",
                "createdAt": now,
                "lastLoginAt": now
            },
            {
                "id": "usr-audit-04",
                "email": "auditor@aetheris.ai",
                "passwordHash": pw_hash,
                "name": "Satoshi Lin",
                "role": "auditor",
                "organization": "Aetheris Global Holdings Ltd.",
                "department": "Independent Cryptographic Attestation",
                "avatarColor": "#4f46e5",
                "publicKey": "ed25519:pub_99e1cbb3700f4acc1988e127f81a93b2",
                "createdAt": now,
                "lastLoginAt": now
            }
        ]

    def _create_seed_blocks(self) -> List[Dict[str, Any]]:
        now_ts = int(time.time() * 1000)
        t1 = datetime.fromtimestamp((now_ts - 3600000) / 1000, tz=timezone.utc).isoformat().replace("+00:00", "Z")
        t2 = datetime.fromtimestamp((now_ts - 1200000) / 1000, tz=timezone.utc).isoformat().replace("+00:00", "Z")
        return [
            {
                "blockNumber": 849201,
                "rootHash": "0x8f4c1e92b3a04e5781d0923f112e76aa8c29184b238f90241eab",
                "sealedAt": t1,
                "sealedBy": "Cryptographic Auditor (Node #04)",
                "signerPublicKey": "ed25519:pub_99e1cbb3700f4acc1988e127f81a93b2",
                "leafCount": 4,
                "missionId": "mission-industrial-export",
                "missionTitle": "Advanced Industrial Manufacturing & Export Network",
                "status": "sealed",
                "validatorSignatures": [
                    "ed25519:sig_849201_apex_valid",
                    "ed25519:sig_849201_sentinel_valid",
                    "ed25519:sig_849201_conductor_valid",
                    "ed25519:sig_849201_auditor_valid"
                ]
            },
            {
                "blockNumber": 849202,
                "rootHash": "0x93b7f14e59c218d098e4f2105ca2374d924158e0a3c26781fbc0d859e924a712",
                "sealedAt": t2,
                "sealedBy": "Cryptographic Auditor (Node #04)",
                "signerPublicKey": "ed25519:pub_99e1cbb3700f4acc1988e127f81a93b2",
                "leafCount": 5,
                "missionId": "mission-dlf-global",
                "missionTitle": "Global Infrastructure & Asset Syndication",
                "status": "sealed",
                "validatorSignatures": [
                    "ed25519:sig_849202_apex_valid",
                    "ed25519:sig_849202_sentinel_valid",
                    "ed25519:sig_849202_alpha_valid",
                    "ed25519:sig_849202_conductor_valid",
                    "ed25519:sig_849202_auditor_valid"
                ]
            }
        ]

    def find_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        target = email.strip().lower()
        for u in self.data.get("users", []):
            if u.get("email", "").strip().lower() == target:
                return u
        return None

    def find_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        for u in self.data.get("users", []):
            if u.get("id") == user_id:
                return u
        return None

    def create_user(
        self,
        email: str,
        password_clear: str,
        name: str,
        role: UserRole,
        organization: str,
        department: Optional[str] = None
    ) -> Dict[str, Any]:
        now = get_iso_now()
        pw_hash = bcrypt.hashpw(password_clear.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        random_suffix = secrets.token_hex(4)
        pub_key = f"ed25519:pub_{secrets.token_hex(16)}"
        user_id = f"usr-{int(time.time()):x}-{random_suffix}"

        new_user = {
            "id": user_id,
            "email": email.strip().lower(),
            "passwordHash": pw_hash,
            "name": name.strip(),
            "role": role,
            "organization": organization,
            "department": department or "Operations",
            "avatarColor": get_role_color(role),
            "publicKey": pub_key,
            "createdAt": now,
            "lastLoginAt": now
        }
        self.data.setdefault("users", []).append(new_user)
        self._save()
        return new_user

    def update_user_last_login(self, user_id: str) -> None:
        user = self.find_user_by_id(user_id)
        if user:
            user["lastLoginAt"] = get_iso_now()
            self._save()

    def update_user_role(self, user_id: str, new_role: UserRole) -> Optional[Dict[str, Any]]:
        user = self.find_user_by_id(user_id)
        if user:
            user["role"] = new_role
            user["avatarColor"] = get_role_color(new_role)
            self._save()
            return user
        return None

    def to_public_profile(self, user: Dict[str, Any]) -> UserPublicProfile:
        return UserPublicProfile(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            role=user["role"],
            organization=user["organization"],
            department=user.get("department", "Operations"),
            avatarColor=user.get("avatarColor", "#2563eb"),
            publicKey=user.get("publicKey", "ed25519:pub_unknown"),
            lastLoginAt=user.get("lastLoginAt", get_iso_now())
        )

    def verify_password(self, clear_password: str, password_hash: str) -> bool:
        try:
            return bcrypt.checkpw(clear_password.encode("utf-8"), password_hash.encode("utf-8"))
        except Exception as e:
            print(f"[FastAPI Auth] Password verification error: {e}")
            return False

    def log_audit(
        self,
        user_id: str,
        user_email: str,
        user_role: UserRole,
        action: str,
        entity_type: str,
        details: str,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        secret = b"aetheris_audit_signing_secret_2026"
        ts_now = int(time.time() * 1000)
        message = f"{user_id}:{action}:{ts_now}".encode("utf-8")
        sig = hmac.new(secret, message, hashlib.sha256).hexdigest()

        entry = {
            "id": f"audit-{ts_now}-{secrets.token_hex(3)}",
            "timestamp": get_iso_now(),
            "userId": user_id,
            "userEmail": user_email,
            "userRole": user_role,
            "action": action,
            "entityType": entity_type,
            "details": details,
            "ipAddress": ip_address,
            "cryptographicSignature": f"0x{sig}"
        }

        logs = self.data.setdefault("auditLogs", [])
        logs.insert(0, entry)
        if len(logs) > 500:
            self.data["auditLogs"] = logs[:500]
        self._save()
        return entry

    def get_audit_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.data.get("auditLogs", [])[:limit]

    def get_merkle_blocks(self) -> List[Dict[str, Any]]:
        return self.data.get("merkleBlocks", [])

    def add_merkle_block(
        self,
        root_hash: str,
        sealed_by: str,
        signer_public_key: str,
        leaf_count: int,
        mission_id: str,
        mission_title: str,
        validator_signatures: List[str]
    ) -> Dict[str, Any]:
        blocks = self.data.setdefault("merkleBlocks", [])
        highest_num = blocks[0]["blockNumber"] if blocks else 849200
        new_block_num = highest_num + 1

        new_block = {
            "blockNumber": new_block_num,
            "rootHash": root_hash,
            "sealedAt": get_iso_now(),
            "sealedBy": sealed_by,
            "signerPublicKey": signer_public_key,
            "leafCount": leaf_count,
            "missionId": mission_id,
            "missionTitle": mission_title,
            "status": "sealed",
            "validatorSignatures": validator_signatures
        }
        blocks.insert(0, new_block)
        self._save()
        return new_block

    def record_compliance_remediation(self, framework_id: str) -> None:
        remediated = self.data.setdefault("remediatedFrameworks", [])
        if framework_id not in remediated:
            remediated.append(framework_id)
            self._save()

    def record_corridor_reroute(self, corridor_id: str) -> None:
        rerouted = self.data.setdefault("reroutedCorridors", [])
        if corridor_id not in rerouted:
            rerouted.append(corridor_id)
            self._save()

db = Database()
