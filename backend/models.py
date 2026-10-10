from typing import List, Optional, Literal
from pydantic import BaseModel, Field

UserRole = Literal['executive', 'compliance_officer', 'operations_director', 'auditor']

class UserPublicProfile(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    organization: str
    department: str
    avatarColor: str
    publicKey: str
    lastLoginAt: str

class User(BaseModel):
    id: str
    email: str
    passwordHash: str
    name: str
    role: UserRole
    organization: str
    department: str
    avatarColor: str
    publicKey: str
    createdAt: str
    lastLoginAt: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: Optional[UserRole] = 'executive'
    organization: Optional[str] = 'Aetheris Enterprise'
    department: Optional[str] = 'Executive Board'

class SSORequest(BaseModel):
    provider: Optional[str] = 'Okta Enterprise SSO'
    email: Optional[str] = 'executive@aetheris.ai'

class SwitchRoleRequest(BaseModel):
    role: UserRole

class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    userId: str
    userEmail: str
    userRole: UserRole
    action: str
    entityType: Literal['mission', 'compliance', 'operations', 'auth', 'ledger']
    details: str
    ipAddress: Optional[str] = None
    cryptographicSignature: str

class MerkleBlockRecord(BaseModel):
    blockNumber: int
    rootHash: str
    sealedAt: str
    sealedBy: str
    signerPublicKey: str
    leafCount: int
    missionId: str
    missionTitle: str
    status: Literal['sealed', 'verified'] = 'sealed'
    validatorSignatures: List[str]

class SealBlockRequest(BaseModel):
    missionId: Optional[str] = 'custom-mission'
    missionTitle: Optional[str] = 'Autonomous Swarm Deliberation Package'
    leafCount: Optional[int] = 5

class RemediateComplianceRequest(BaseModel):
    frameworkId: str
    statutoryRegulation: Optional[str] = 'EU CBAM Regulation 2026/112'

class RerouteOperationsRequest(BaseModel):
    corridorId: Optional[str] = 'route-1'
    transitMode: Optional[str] = 'Multimodal Rail'

class DispatchMissionRequest(BaseModel):
    directive: str
    missionId: Optional[str] = None
