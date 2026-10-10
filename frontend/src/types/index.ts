export type AgentRole = 'orchestrator' | 'compliance' | 'operations' | 'competitive' | 'auditor';

export type AgentStatus = 'idle' | 'deliberating' | 'auditing' | 'routing' | 'executing' | 'consensus';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  badge: string;
  avatarColor: string;
  glowColor: string;
  description: string;
  status: AgentStatus;
  currentThought?: string;
  capabilities: string[];
  tools: string[];
  confidence: number;
}

export interface AgentAction {
  tool: string;
  input: string;
  output: string;
  status: 'pending' | 'success' | 'alert';
}

export interface SwarmMessage {
  id: string;
  agentId: string;
  agentName: string;
  role: AgentRole;
  timestamp: string;
  phase: string;
  thoughtChain: string[];
  message: string;
  action?: AgentAction;
  cryptographicHash?: string;
  consensusVote?: 'approve' | 'amend' | 'escalate';
}

export interface EnterpriseMission {
  id: string;
  title: string;
  subtitle: string;
  sector: string;
  targetJurisdictions: string[];
  objective: string;
  budgetCap: string;
  slaTarget: string;
  keyChallenge: string;
  presetMessages: SwarmMessage[];
  impactMetrics: {
    velocityGain: string;
    complianceScore: string;
    costArbitrage: string;
    autonomousInterventions: number;
  };
}

export interface ComplianceFramework {
  id: string;
  jurisdiction: 'EU' | 'US' | 'APAC' | 'MENA' | 'INDIA';
  frameworkName: string;
  statuteReference: string;
  riskCategory: 'Trade & Export' | 'Privacy & AI' | 'FDI & Corporate' | 'ESG & Sustainability' | 'Tax & Tariffs';
  status: 'verified' | 'action_required' | 'remediated';
  complianceScore: number;
  autonomousAction: string;
  auditHash: string;
  lastChecked: string;
  details: string;
}

export interface SupplyNode {
  id: string;
  routeTitle: string;
  origin: string;
  destination: string;
  status: 'active' | 'shock_detected' | 'rerouted_autonomous';
  transitMode: 'Maritime' | 'Air Cargo' | 'Multimodal Rail' | 'Cross-border Road';
  leadTimeDays: number;
  costVariancePercent: number;
  co2Score: string;
  anomaly?: string;
  autonomousRemediation?: string;
}

export interface CompetitorVector {
  id: string;
  competitorName: string;
  tier: 'Global Tier 1' | 'Regional Incumbent' | 'New Entrant';
  market: string;
  recentManeuver: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  detectedPrice: string;
  ourOptimizedPrice: string;
  autonomousCounterStrategy: string;
  marketShareShielded: string;
}

export interface SwarmTelemetry {
  tokensConsumed: number;
  consensusLatencyMs: number;
  activeAgents: number;
  autonomousActionsToday: number;
  cryptographicProofs: number;
  regulatoryChecksSec: number;
}

export interface MerkleProofLeaf {
  agentId: string;
  agentName: string;
  role: AgentRole;
  actionSummary: string;
  timestamp: string;
  hash: string;
  status: 'verified' | 'sealed';
}

export interface MerkleProofBundle {
  rootHash: string;
  blockNumber: number;
  missionId: string;
  missionTitle: string;
  consensusTimestamp: string;
  leaves: MerkleProofLeaf[];
  validatorSignatures: string[];
}

export interface GeminiConfig {
  apiKey: string;
  model: 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  temperature: number;
  isLive: boolean;
}

export interface OrchestrationTask {
  id: string;
  agentRole: AgentRole;
  agentName: string;
  objective: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  thoughtChain: string[];
  toolName: string;
  toolInput: Record<string, any>;
  toolOutput: Record<string, any>;
  consensusVote: 'approve' | 'reject' | 'abstain';
  cryptographicHash: string;
  durationMs: number;
  createdAt: string;
  completedAt?: string;
}

export interface ApprovalRequestItem {
  id: string;
  runId: string;
  purchaseOrderId?: string;
  requestedAction: string;
  reason: string;
  amountUsd: number;
  thresholdUsd: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requiredRole: string;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface OrchestrationRun {
  id: string;
  missionTitle: string;
  directive: string;
  status: 'queued' | 'running' | 'waiting_for_approval' | 'succeeded' | 'failed' | 'cancelled';
  currentPhase: string;
  summary?: string;
  taskCount?: number;
  createdAt: string;
  completedAt?: string;
  tasks?: OrchestrationTask[];
  approvals?: ApprovalRequestItem[];
}

export interface OperationalInventoryState {
  orders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    sku: string;
    requiredQuantity: number;
    unitPriceUsd: number;
    destinationJurisdiction: string;
    status: string;
    deadlineDays: number;
    createdAt: string;
  }>;
  inventory: Array<{
    id: string;
    sku: string;
    location: string;
    quantityOnHand: number;
    reservedQuantity: number;
    onOrderQuantity?: number;
    availableQuantity: number;
    minSafetyStock: number;
    updatedAt: string;
  }>;
  suppliers: Array<{
    id: string;
    name: string;
    country: string;
    unitCostUsd: number;
    leadTimeDays: number;
    freightCostUsd: number;
    transitMode: string;
    complianceCertified: boolean;
    reliabilityScore: number;
  }>;
  purchaseOrders: Array<{
    id: string;
    orderId: string;
    supplierId: string;
    quantity: number;
    totalCostUsd: number;
    transitMode: string;
    status: string;
    trackingReference?: string;
    createdAt: string;
    executedAt?: string;
  }>;
}

export interface MerkleVerificationResult {
  success: boolean;
  blockNumber: number;
  rootHash: string;
  recalculatedRoot: string;
  rootMatches: boolean;
  inclusionProofValid: boolean;
  signatureValid: boolean;
  signer: string;
  signerPublicKey: string;
  overallCryptographicIntegrity: string;
  leafCount: number;
  inclusionProofSample: Array<{ position: 'left' | 'right'; hash: string }>;
}

export interface ComplianceDocumentItem {
  id: string;
  frameworkId: string;
  frameworkName: string;
  jurisdiction: string;
  version: string;
  sourceTitle: string;
  passageText: string;
  effectiveDate: string;
}

export interface ComplianceEvaluationItem {
  id: string;
  runId: string;
  documentId: string;
  requirementKey: string;
  status: 'compliant' | 'non_compliant' | 'inconclusive';
  evidenceExcerpt: string;
  citation: string;
  evaluatedAt: string;
}
