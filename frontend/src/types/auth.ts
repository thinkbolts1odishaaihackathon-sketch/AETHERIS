export type UserRole = 'executive' | 'compliance_officer' | 'operations_director' | 'auditor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  department: string;
  avatarColor: string;
  publicKey: string;
  lastLoginAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  entityType: 'mission' | 'compliance' | 'operations' | 'auth' | 'ledger';
  details: string;
  cryptographicSignature: string;
}

export interface MerkleBlockItem {
  blockNumber: number;
  rootHash: string;
  sealedAt: string;
  sealedBy: string;
  signerPublicKey: string;
  leafCount: number;
  missionId: string;
  missionTitle: string;
  status: 'sealed' | 'verified';
  validatorSignatures: string[];
}
