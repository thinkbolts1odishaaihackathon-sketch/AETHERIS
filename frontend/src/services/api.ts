/**
 * AETHERIS AEOS Authoritative API Client.
 *
 * Connects directly to the authoritative FastAPI backend over HTTP / WebSocket proxy.
 * Eliminates client-side security bypasses and enforces typed contracts for:
 * - Authentication & RBAC session management
 * - Multi-agent operational recovery execution
 * - Human-in-the-loop approval workflows
 * - Mathematical Merkle proof & Ed25519 signature verification
 * - Evidence-based compliance telemetry
 */

import type { User, UserRole, AuthResponse, AuditLogItem, MerkleBlockItem } from '../types/auth';
import type {
  OrchestrationRun,
  OperationalInventoryState,
  MerkleVerificationResult,
  ComplianceDocumentItem,
  ComplianceEvaluationItem,
  ApprovalRequestItem
} from '../types';

const TOKEN_KEY = 'aetheris_auth_jwt_token';

/**
 * Resolves the base URL for API requests.
 * - When deployed on Vercel: Reads from environment variable VITE_API_URL
 *   (e.g., https://your-backend-app.onrender.com)
 * - In local development: Falls back to '/api' which Vite proxies to http://localhost:3001
 */
export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBaseUrl();

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const authHeaders = (): HeadersInit => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // --- Authentication API ---

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setStoredToken(data.token);
        localStorage.setItem('aetheris_cached_user', JSON.stringify(data.user));
        return data;
      }
      return {
        success: false,
        message: data.message || 'Invalid enterprise credentials.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network error connecting to backend: ${err?.message || 'Server unreachable'}`
      };
    }
  },

  async register(params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    organization: string;
    department?: string;
  }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setStoredToken(data.token);
        localStorage.setItem('aetheris_cached_user', JSON.stringify(data.user));
        return data;
      }
      return {
        success: false,
        message: data.message || 'Account registration failed.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network error registering user: ${err?.message || 'Server unreachable'}`
      };
    }
  },

  async loginWithSSO(provider: string, email: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/sso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setStoredToken(data.token);
        localStorage.setItem('aetheris_cached_user', JSON.stringify(data.user));
        return data;
      }
      return {
        success: false,
        message: data.message || 'SSO authentication failed.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `SSO connection error: ${err?.message || 'Server unreachable'}`
      };
    }
  },

  async getCurrentUser(): Promise<{ success: boolean; user?: User; message?: string }> {
    const token = getStoredToken();
    if (!token) {
      return { success: false, message: 'No stored token' };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem('aetheris_cached_user', JSON.stringify(data.user));
          return data;
        }
      }
    } catch {
      // Backend temporarily offline; check local cached user for non-privileged offline preview
    }

    try {
      const cached = localStorage.getItem('aetheris_cached_user');
      if (cached) {
        return { success: true, user: JSON.parse(cached) };
      }
    } catch {}

    return { success: false, message: 'Session expired or invalid.' };
  },

  async switchRole(newRole: UserRole): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/auth/switch-role`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setStoredToken(data.token);
        localStorage.setItem('aetheris_cached_user', JSON.stringify(data.user));
        return data;
      }
      return {
        success: false,
        message: data.message || 'Could not switch role.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Role switch error: ${err?.message || 'Server unreachable'}`
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: authHeaders()
      });
    } catch (e) {
      console.warn('Logout notice', e);
    } finally {
      setStoredToken(null);
      localStorage.removeItem('aetheris_cached_user');
    }
  },

  // --- Multi-Agent Orchestration API ---

  async startOperationalRecovery(orderId = 'ord-2026-500', directive?: string): Promise<{
    success: boolean;
    status?: string;
    run_id?: string;
    approval_id?: string;
    shortage_units?: number;
    recommended_supplier?: string;
    total_cost_usd?: number;
    threshold_usd?: number;
    purchase_order_id?: string;
    message?: string;
    tasks?: any[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/runs/start-recovery`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ orderId, directive })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to start recovery' };
    }
  },

  async getRuns(): Promise<{ success: boolean; runs: OrchestrationRun[] }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/runs`, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, runs: [] };
    } catch {
      return { success: false, runs: [] };
    }
  },

  async getRunDetails(runId: string): Promise<{ success: boolean; run?: OrchestrationRun; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/runs/${runId}`, {
        headers: authHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async cancelRun(runId: string): Promise<{ success: boolean; status?: string; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/runs/${runId}/cancel`, {
        method: 'POST',
        headers: authHeaders()
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async getApprovals(status?: string): Promise<{ success: boolean; approvals: ApprovalRequestItem[] }> {
    try {
      const url = status ? `${API_BASE}/orchestration/approvals?status=${status}` : `${API_BASE}/orchestration/approvals`;
      const res = await fetch(url, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, approvals: [] };
    } catch {
      return { success: false, approvals: [] };
    }
  },

  async decideApproval(
    approvalId: string,
    decision: 'approved' | 'rejected',
    comments?: string,
    allowSelfApproval?: boolean
  ): Promise<{
    success: boolean;
    status?: string;
    purchase_order?: any;
    verification?: any;
    merkle_block?: any;
    message?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/approvals/${approvalId}/decide`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ decision, comments, allowSelfApproval: !!allowSelfApproval })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async confirmGoodsReceipt(
    purchaseOrderId: string,
    receiptNotes?: string
  ): Promise<{
    success: boolean;
    received?: boolean;
    purchase_order_id?: string;
    quantity_received?: number;
    warehouse_location?: string;
    physical_on_hand?: number;
    on_order_quantity?: number;
    order_status?: string;
    message?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/receipts/confirm`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ purchaseOrderId, receiptNotes })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async getInventoryStatus(): Promise<{ success: boolean } & Partial<OperationalInventoryState>> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/inventory`, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  async verifyMerkleBlock(blockNumber: number): Promise<MerkleVerificationResult> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/merkle/verify/${blockNumber}`);
      return await res.json();
    } catch {
      return {
        success: false,
        blockNumber,
        rootHash: '',
        recalculatedRoot: '',
        rootMatches: false,
        inclusionProofValid: false,
        signatureValid: false,
        signer: '',
        signerPublicKey: '',
        overallCryptographicIntegrity: 'VERIFICATION_ERROR',
        leafCount: 0,
        inclusionProofSample: []
      };
    }
  },

  async getComplianceDocuments(): Promise<{ success: boolean; documents: ComplianceDocumentItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/compliance/documents`, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, documents: [] };
    } catch {
      return { success: false, documents: [] };
    }
  },

  async getComplianceEvaluations(): Promise<{ success: boolean; evaluations: ComplianceEvaluationItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/orchestration/compliance/evaluations`, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, evaluations: [] };
    } catch {
      return { success: false, evaluations: [] };
    }
  },

  // --- Swarm & Telemetry API ---

  async getAuditLogs(limit = 30): Promise<{ success: boolean; logs: AuditLogItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/swarm/audit-logs?limit=${limit}`, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, logs: [] };
    } catch {
      return { success: false, logs: [] };
    }
  },

  async getMerkleBlocks(): Promise<{ success: boolean; blocks: MerkleBlockItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/swarm/blocks`, {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, blocks: [] };
    } catch {
      return { success: false, blocks: [] };
    }
  },

  async sealMerkleBlock(params: {
    missionId: string;
    missionTitle: string;
    leafCount?: number;
  }): Promise<{ success: boolean; block?: MerkleBlockItem; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/swarm/blocks/seal`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async remediateCompliance(frameworkId: string, statutoryRegulation?: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/swarm/compliance/remediate`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ frameworkId, statutoryRegulation })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async rerouteOperations(corridorId: string, transitMode?: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/swarm/operations/reroute`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ corridorId, transitMode })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async dispatchMission(directive: string, missionId?: string): Promise<{
    success: boolean;
    message?: string;
    dispatchId?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/swarm/dispatch`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ directive, missionId })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  async checkHealth(): Promise<{ status: string; consensusState?: string; merkleHeight?: number } | null> {
    try {
      const res = await fetch(`${API_BASE}/system/health`);
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  }
};
