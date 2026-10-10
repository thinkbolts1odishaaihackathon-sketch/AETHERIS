import React, { useState, useEffect } from 'react';
import {
  Play, RotateCcw, ShieldCheck, Sparkles, AlertTriangle,
  CheckCircle, Copy, Check, Zap, Target, Lock, XCircle, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Agent, EnterpriseMission, SwarmMessage, GeminiConfig, OrchestrationTask } from '../types';
import { PRESET_MISSIONS } from '../data/mockEnterpriseData';
import { ConsensusVotingMatrix } from './ConsensusVotingMatrix';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface MissionControlProps {
  agents: Agent[];
  onAgentsUpdate: React.Dispatch<React.SetStateAction<Agent[]>>;
  activeAgentId?: string;
  onActiveAgentChange: (id: string | undefined) => void;
  geminiConfig: GeminiConfig;
  onOpenPromptModal?: () => void;
  injectedDirective?: string;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  agents,
  onAgentsUpdate,
  activeAgentId: _activeAgentId,
  onActiveAgentChange,
  geminiConfig: _geminiConfig,
  onOpenPromptModal: _onOpenPromptModal,
  injectedDirective
}) => {
  const { user } = useAuth();
  const [selectedMission, setSelectedMission] = useState<EnterpriseMission>(PRESET_MISSIONS[0]);
  const [customDirective, setCustomDirective] = useState('');
  const [prevInjectedDirective, setPrevInjectedDirective] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<SwarmMessage[]>(PRESET_MISSIONS[0].presetMessages);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionPhase, setExecutionPhase] = useState<string>('Ready for autonomous dispatch');
  const [consensusAchieved, setConsensusAchieved] = useState<boolean>(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Live Backend Orchestration State
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState<{
    id: string;
    purchaseOrderId?: string;
    amount: number;
    threshold: number;
    supplier: string;
    action: string;
    reason: string;
  } | null>(null);
  const [verifiedOutcome, setVerifiedOutcome] = useState<{
    verified: boolean;
    orderId: string;
    totalAllocatedUnits: number;
    physicalOnHand: number;
    onOrderUnits: number;
    orderStatus: string;
    poId: string;
    actualPoId?: string;
    blockNumber: number;
    rootHash: string;
    stage: string;
  } | null>(null);
  const [isReceivingGoods, setIsReceivingGoods] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (injectedDirective !== prevInjectedDirective) {
    setPrevInjectedDirective(injectedDirective);
    if (injectedDirective) {
      setCustomDirective(injectedDirective);
    }
  }

  const mapRunToMessages = (tasks: OrchestrationTask[]): SwarmMessage[] => {
    const roleToAgentId: Record<string, string> = {
      orchestrator: 'agent-apex',
      compliance: 'agent-sentinel',
      operations: 'agent-conductor',
      competitive: 'agent-alpha',
      auditor: 'agent-auditor'
    };

    return tasks.map((t) => ({
      id: t.id,
      agentId: roleToAgentId[t.agentRole] || 'agent-apex',
      agentName: t.agentName,
      role: t.agentRole,
      timestamp: t.createdAt ? new Date(t.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
      phase: `${t.agentName} Execution`,
      thoughtChain: t.thoughtChain || [],
      message: t.objective || 'Task completed.',
      action: {
        tool: t.toolName,
        input: JSON.stringify(t.toolInput, null, 2),
        output: JSON.stringify(t.toolOutput, null, 2),
        status: t.status === 'failed' ? 'alert' : 'success'
      },
      cryptographicHash: t.cryptographicHash,
      consensusVote: t.consensusVote === 'reject' ? 'escalate' : 'approve'
    }));
  };

  const handleSelectMission = (mission: EnterpriseMission) => {
    setSelectedMission(mission);
    setMessages(mission.presetMessages);
    setConsensusAchieved(true);
    setPendingApproval(null);
    setVerifiedOutcome(null);
    setErrorMessage(null);
    setExecutionPhase('Synchronized with historical ledger');
  };

  // Load latest run from backend on initial mount
  useEffect(() => {
    const fetchLatestRun = async () => {
      const runsRes = await api.getRuns();
      if (runsRes.success && runsRes.runs.length > 0) {
        const latest = runsRes.runs[0];
        if (latest.status === 'waiting_for_approval') {
          setActiveRunId(latest.id);
          const details = await api.getRunDetails(latest.id);
          if (details.success && details.run) {
            mapRunToMessages(details.run.tasks || []);
            const pending = details.run.approvals?.find((a) => a.status === 'pending');
            if (pending) {
              setPendingApproval({
                id: pending.id,
                amount: pending.amountUsd,
                threshold: pending.thresholdUsd,
                supplier: 'Bavaria Precision Metallics',
                action: pending.requestedAction,
                reason: pending.reason
              });
            }
          }
        }
      }
    };
    fetchLatestRun();
  }, []);

  const executeOperationalRecovery = async (directiveText?: string) => {
    setIsExecuting(true);
    setMessages([]);
    setPendingApproval(null);
    setVerifiedOutcome(null);
    setErrorMessage(null);
    setConsensusAchieved(false);
    onActiveAgentChange(undefined);
    setExecutionPhase('Initiating backend multi-agent orchestration...');

    // Reset agents to deliberating
    onAgentsUpdate((prev) => prev.map((a) => ({ ...a, status: 'deliberating' as const })));

    try {
      // 1. Call real backend orchestration API
      const res = await api.startOperationalRecovery('ord-2026-500', directiveText);

      if (!res.success) {
        setErrorMessage(res.message || 'Failed to start recovery.');
        setExecutionPhase('Execution halted: Backend rejected request');
        setIsExecuting(false);
        return;
      }

      setActiveRunId(res.run_id || null);

      // Fetch task details directly from authoritative database
      if (res.run_id) {
        const details = await api.getRunDetails(res.run_id);
        if (details.success && details.run?.tasks) {
          const swarmMsgs = mapRunToMessages(details.run.tasks);
          setMessages(swarmMsgs);

          // Update agent states based on real tasks
          onAgentsUpdate((prev) =>
            prev.map((a) => {
              const matchedTask = details.run?.tasks?.find((t) => t.agentRole === a.role);
              if (matchedTask) {
                return {
                  ...a,
                  status: 'consensus' as const,
                  currentThought: matchedTask.thoughtChain[0] || a.currentThought
                };
              }
              return a;
            })
          );
        }
      }

      // Check if paused at approval gate
      if (res.status === 'waiting_for_approval') {
        setPendingApproval({
          id: res.approval_id || '',
          purchaseOrderId: res.purchase_order_id,
          amount: res.total_cost_usd || 10800,
          threshold: res.threshold_usd || 5000,
          supplier: res.recommended_supplier || 'Bavaria Precision Metallics',
          action: `Execute PO for ${res.shortage_units} units with ${res.recommended_supplier}`,
          reason: `Total procurement cost ($${res.total_cost_usd?.toLocaleString()}) exceeds autonomous threshold ($${res.threshold_usd?.toLocaleString()}). Designated human executive approval required.`
        });
        setExecutionPhase('Action paused at Policy Threshold Gate // Human Approval Required');
      } else if (res.status === 'succeeded') {
        setConsensusAchieved(true);
        setExecutionPhase('Autonomous Mission Succeeded & State Verified');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (e: any) {
      console.error('Error during operational recovery', e);
      setErrorMessage(e?.message || 'Unexpected execution error.');
      setExecutionPhase('Execution halted with exception');
    } finally {
      setIsExecuting(false);
      onActiveAgentChange(undefined);
    }
  };

  const handleDecideApproval = async (decision: 'approved' | 'rejected') => {
    if (!pendingApproval) return;
    setIsExecuting(true);
    setExecutionPhase(decision === 'approved' ? 'Authorizing & executing purchase order...' : 'Rejecting proposal...');

    try {
      const res = await api.decideApproval(
        pendingApproval.id,
        decision,
        `Decided by ${user?.name || 'User'} (${user?.role || 'Executive'})`,
        true // allowSelfApproval override enabled for interactive UI demo
      );

      if (res.success && res.status === 'succeeded') {
        setPendingApproval(null);
        setConsensusAchieved(true);
        setExecutionPhase('Purchase Order Executed // Awaiting Physical Freight Delivery');

        if (res.verification) {
          setVerifiedOutcome({
            verified: res.verification.verified,
            orderId: res.verification.order_id,
            totalAllocatedUnits: res.verification.total_allocated_units || 500,
            physicalOnHand: res.verification.physical_on_hand ?? 300,
            onOrderUnits: res.verification.on_order_quantity ?? 200,
            orderStatus: res.verification.final_order_status || 'awaiting_receipt',
            poId: res.merkle_block?.block_number ? `PO-${res.merkle_block.block_number}` : 'PO-EXECUTED',
            actualPoId: pendingApproval.purchaseOrderId || res.purchase_order?.id || 'po-bavaria-01',
            blockNumber: res.merkle_block?.block_number || 849203,
            rootHash: res.merkle_block?.root_hash || '0x...',
            stage: res.verification.stage || 'procured_awaiting_receipt'
          });
        }

        // Refresh task list
        if (activeRunId) {
          const details = await api.getRunDetails(activeRunId);
          if (details.success && details.run?.tasks) {
            setMessages(mapRunToMessages(details.run.tasks));
          }
        }

        confetti({ particleCount: 90, spread: 65, origin: { y: 0.7 } });
      } else if (decision === 'rejected') {
        setPendingApproval(null);
        setExecutionPhase('Mission Cancelled by Human Approver');
      } else {
        setErrorMessage(res.message || 'Approval action failed.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Error processing approval.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleConfirmGoodsReceipt = async () => {
    if (!verifiedOutcome?.actualPoId) return;
    setIsReceivingGoods(true);
    try {
      const res = await api.confirmGoodsReceipt(
        verifiedOutcome.actualPoId,
        'Physical check-in at FRA-01 Hub. 200 units inspected & allocated to customer order ORD-2026-500.'
      );
      if (res.success && res.received) {
        setVerifiedOutcome((prev) => prev ? ({
          ...prev,
          physicalOnHand: res.physical_on_hand || 500,
          onOrderUnits: 0,
          orderStatus: 'fulfilled',
          stage: 'fulfilled'
        }) : null);
        setExecutionPhase('Goods Receipt Verified // Customer Order ORD-2026-500 100% Fulfilled');
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        setErrorMessage(res.message || 'Failed to confirm goods receipt.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Error confirming goods receipt.');
    } finally {
      setIsReceivingGoods(false);
    }
  };

  const handleCancelRun = async () => {
    if (!activeRunId) return;
    try {
      await api.cancelRun(activeRunId);
      setPendingApproval(null);
      setExecutionPhase('Mission safely cancelled by operator.');
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to cancel mission.');
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const canApprove = user?.role === 'operations_director' || user?.role === 'executive';

  return (
    <div className="mission-control-wrapper">
      {/* Top Directive Stage */}
      <div className="premium-card mission-hero-card">
        <div className="mission-hero-header">
          <div className="hero-title-group">
            <div className="badge-icon-wrap blue">
              <Target size={20} />
            </div>
            <div>
              <div className="mission-badge-row">
                <span className="mission-phase-badge">MISSION EXECUTION PIPELINE</span>
                <span className={`mission-status-pill ${isExecuting ? 'running' : pendingApproval ? 'pending-approval' : 'ready'}`}>
                  {isExecuting ? 'EXECUTING LIVE' : pendingApproval ? 'AWAITING APPROVAL' : 'AUTHORITATIVE BACKEND'}
                </span>
              </div>
              <h2 className="mission-headline">Autonomous Multi-Agent Operational Recovery</h2>
            </div>
          </div>

          <div className="mission-controls-cluster">
            {activeRunId && pendingApproval && (
              <button
                className="btn-action-cancel"
                onClick={handleCancelRun}
                title="Cancel ongoing mission safely"
              >
                <XCircle size={14} />
                <span>Cancel Mission</span>
              </button>
            )}

            <button
              id="dispatch-recovery-btn"
              className="btn-dispatch-swarm"
              onClick={() => executeOperationalRecovery(customDirective || undefined)}
              disabled={isExecuting}
            >
              <Play size={15} fill="currentColor" />
              <span>{isExecuting ? 'Orchestrating Agents...' : 'Dispatch Operational Recovery (500 Units)'}</span>
            </button>
          </div>
        </div>

        {/* Preset Mission & Scenario Selector */}
        <div className="mission-scenario-selector-row">
          <span className="selector-label">SELECT OPERATIONAL SCENARIO:</span>
          <div className="scenario-pills-list">
            <button
              type="button"
              className={`scenario-pill-btn ${selectedMission.id === 'benchmark-500' ? 'active' : ''}`}
              onClick={() => {
                setSelectedMission({
                  id: 'benchmark-500',
                  title: 'Airbus 500-Unit Shortage Recovery (Benchmark)',
                  subtitle: 'Operational Shortage Recovery & Supplier Arbitrage',
                  sector: 'Aerospace & Defense',
                  targetJurisdictions: ['Germany', 'European Union', 'United States'],
                  objective: 'Resolve 200-unit shortage on ORD-2026-500 under $5,000 policy gate.',
                  budgetCap: '$5,000 Autonomous Threshold',
                  slaTarget: '5 Days Strict SLA',
                  keyChallenge: 'Shortage of 200 units, Bavaria quote $10,800 exceeds $5k threshold.',
                  impactMetrics: {
                    velocityGain: '94% Faster Recovery',
                    complianceScore: '100% EAR99/CBAM',
                    costArbitrage: '$1,200 vs baseline',
                    autonomousInterventions: 5
                  },
                  presetMessages: []
                });
                setMessages([]);
                setPendingApproval(null);
                setVerifiedOutcome(null);
                setErrorMessage(null);
                setExecutionPhase('Ready for 500-unit recovery dispatch');
              }}
            >
              <Target size={13} />
              <span>Airbus 500-Unit Shortage (Live Benchmark)</span>
            </button>
            {PRESET_MISSIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`scenario-pill-btn ${selectedMission.id === m.id ? 'active' : ''}`}
                onClick={() => handleSelectMission(m)}
              >
                <span>{m.title}</span>
              </button>
            ))}
            <button
              type="button"
              className="scenario-pill-btn reset"
              onClick={() => handleSelectMission(PRESET_MISSIONS[0])}
              title="Reset scenario telemetry"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Operational Context Banner: The 500-unit Shortage Benchmark */}
        <div className="operational-scenario-banner">
          <div className="scenario-tag">REQUIRED BENCHMARK SCENARIO</div>
          <div className="scenario-details-grid">
            <div className="scenario-item">
              <span className="label">Customer Order:</span>
              <strong className="value">ORD-2026-500 (Airbus Defense)</strong>
            </div>
            <div className="scenario-item">
              <span className="label">Required Quantity:</span>
              <strong className="value">500 units (Titanium Flanges)</strong>
            </div>
            <div className="scenario-item">
              <span className="label">Physical Inventory:</span>
              <strong className="value text-amber">300 units available</strong>
            </div>
            <div className="scenario-item">
              <span className="label">Calculated Shortage:</span>
              <strong className="value text-orange">200 units deficit</strong>
            </div>
            <div className="scenario-item">
              <span className="label">Customer Deadline:</span>
              <strong className="value text-blue">5 Days (Strict SLA)</strong>
            </div>
          </div>
        </div>

        {/* Custom Directive Input */}
        <div className="directive-input-bar">
          <input
            type="text"
            className="input-custom-directive"
            placeholder="Optional custom operational constraint (e.g. 'Prioritize CBAM green hydrogen certified suppliers with lead time < 4 days')"
            value={customDirective}
            onChange={(e) => setCustomDirective(e.target.value)}
            disabled={isExecuting}
          />
        </div>

        {/* Status & Error Display */}
        {errorMessage && (
          <div className="statutory-event-alert warning" style={{ marginTop: '12px' }}>
            <AlertTriangle size={15} className="icon-orange" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Current Execution Phase Readout */}
        <div className="execution-phase-strip">
          <Zap size={14} className="icon-blue spin-icon-slow" />
          <span className="phase-text">{executionPhase}</span>
        </div>
      </div>

      {/* Human-in-the-Loop Approval Gate Card */}
      {pendingApproval && (
        <div className="premium-card approval-gate-card fade-in-up">
          <div className="approval-gate-header">
            <div className="gate-icon-badge">
              <Lock size={20} color="#f59e0b" />
            </div>
            <div>
              <div className="gate-title-row">
                <h3 className="gate-title">Autonomous Policy Gate // Human Authorization Required</h3>
                <span className="gate-pill">THRESHOLD EXCEEDED</span>
              </div>
              <p className="gate-subtitle">{pendingApproval.reason}</p>
            </div>
          </div>

          <div className="gate-metrics-grid">
            <div className="gate-metric-box">
              <span className="gate-label">Proposed Action</span>
              <span className="gate-value">{pendingApproval.action}</span>
            </div>
            <div className="gate-metric-box">
              <span className="gate-label">Total Procurement Cost</span>
              <span className="gate-value text-orange">${pendingApproval.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
            </div>
            <div className="gate-metric-box">
              <span className="gate-label">Autonomous Threshold</span>
              <span className="gate-value text-blue">${pendingApproval.threshold.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
            </div>
            <div className="gate-metric-box">
              <span className="gate-label">Required Authorization Role</span>
              <span className="gate-value text-purple">Operations Director or Executive</span>
            </div>
          </div>

          <div className="gate-actions-row">
            {canApprove ? (
              <>
                <button
                  id="approve-action-btn"
                  className="btn-gate-approve"
                  onClick={() => handleDecideApproval('approved')}
                  disabled={isExecuting}
                >
                  <CheckCircle size={15} />
                  <span>Authorize &amp; Execute Purchase Order (${pendingApproval.amount.toLocaleString()})</span>
                </button>
                <button
                  id="reject-action-btn"
                  className="btn-gate-reject"
                  onClick={() => handleDecideApproval('rejected')}
                  disabled={isExecuting}
                >
                  <XCircle size={15} />
                  <span>Reject Proposal</span>
                </button>
              </>
            ) : (
              <div className="gate-unauthorized-note">
                <ShieldAlert size={15} className="icon-amber" />
                <span>You are currently signed in as <strong>{user?.name} ({user?.role})</strong>. Authorization requires an <strong>operations_director</strong> or <strong>executive</strong>. Use the Role Switcher in the top right to switch roles.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verified Outcome Banner */}
      {verifiedOutcome && (
        <div className="premium-card outcome-verified-card fade-in-up">
          <div className="outcome-header">
            <div className={`badge-icon-wrap ${verifiedOutcome.orderStatus === 'fulfilled' ? 'emerald' : 'blue'}`}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="outcome-title">
                  {verifiedOutcome.orderStatus === 'fulfilled'
                    ? 'Physical Delivery & Fulfillment Complete'
                    : 'Autonomous Procurement Verified // Awaiting Delivery'}
                </h3>
                <span className={`outcome-pill ${verifiedOutcome.orderStatus === 'fulfilled' ? 'emerald' : 'blue'}`}>
                  {verifiedOutcome.orderStatus === 'fulfilled' ? '100% FULFILLED' : 'AWAITING GOODS RECEIPT'}
                </span>
              </div>
              <p className="outcome-subtitle">
                {verifiedOutcome.orderStatus === 'fulfilled'
                  ? '200 units received, physical inventory reached 500 units, customer order ORD-2026-500 fulfilled.'
                  : 'PO executed with Bavaria Precision. 200 units in transit; on-hand stock: 300; on-order: 200. Total allocated: 500 units.'}
              </p>
            </div>
          </div>

          <div className="outcome-stats-row">
            <div className="outcome-stat">
              <span className="label">Order Status:</span>
              <strong className={`value ${verifiedOutcome.orderStatus === 'fulfilled' ? 'text-emerald' : 'text-blue'}`}>
                {verifiedOutcome.orderStatus.toUpperCase()}
              </strong>
            </div>
            <div className="outcome-stat">
              <span className="label">Physical On-Hand:</span>
              <strong className="value text-orange">{verifiedOutcome.physicalOnHand} Units</strong>
            </div>
            <div className="outcome-stat">
              <span className="label">Inventory On-Order:</span>
              <strong className="value text-purple">{verifiedOutcome.onOrderUnits} Units</strong>
            </div>
            <div className="outcome-stat">
              <span className="label">Total Allocated:</span>
              <strong className="value">{verifiedOutcome.totalAllocatedUnits} / 500 Units</strong>
            </div>
            <div className="outcome-stat">
              <span className="label">Cryptographic Anchor:</span>
              <strong className="value text-purple">Block #{verifiedOutcome.blockNumber}</strong>
            </div>
            <div className="outcome-stat">
              <span className="label">Root Hash:</span>
              <code className="value-code">{verifiedOutcome.rootHash.slice(0, 16)}...</code>
            </div>
          </div>

          {verifiedOutcome.orderStatus !== 'fulfilled' && (
            <div className="outcome-receipt-action-bar">
              <div className="receipt-transit-info">
                <Zap size={14} className="icon-blue" />
                <span>
                  Air freight tracking assigned. 200 units en route from Bavaria (DE). Click below to simulate physical freight arrival &amp; warehouse check-in.
                </span>
              </div>
              <button
                id="confirm-goods-receipt-btn"
                className="btn-confirm-receipt"
                onClick={handleConfirmGoodsReceipt}
                disabled={isReceivingGoods}
              >
                <CheckCircle size={15} />
                <span>{isReceivingGoods ? 'Checking In Freight...' : 'Confirm Goods Receipt (FRA-01 Hub Check-in)'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Consensus Voting Matrix Component */}
      <ConsensusVotingMatrix
        agents={agents}
        messages={messages}
        isExecuting={isExecuting}
        consensusAchieved={consensusAchieved}
      />

      {/* Structured Agent Deliberation Feed */}
      <div className="deliberation-feed-card">
        <div className="feed-header">
          <div className="feed-title">
            <Zap size={15} color="#2563eb" />
            <span>Autonomous Agent Deliberation &amp; Tool Execution Stream</span>
          </div>
          <span className="feed-count-pill">{messages.length} Recorded Steps</span>
        </div>

        <div className="deliberation-timeline">
          {messages.length === 0 ? (
            <div className="empty-timeline-state">
              <Sparkles size={24} className="icon-blue" />
              <h4>Standing by for mission dispatch</h4>
              <p>Click "Dispatch Operational Recovery" above to trigger backend multi-agent coordination.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id || idx} className="timeline-event-card">
                <div className="event-header-row">
                  <div className="event-agent-info">
                    <span className="event-agent-name">{msg.agentName}</span>
                    <span className="event-agent-role">({msg.role.toUpperCase()})</span>
                    <span className="event-phase-tag">{msg.phase}</span>
                  </div>
                  <div className="event-meta">
                    <span className="event-time">{msg.timestamp}</span>
                    {msg.consensusVote && (
                      <span className={`event-vote-chip ${msg.consensusVote}`}>
                        {msg.consensusVote.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thought Chain */}
                {msg.thoughtChain && msg.thoughtChain.length > 0 && (
                  <div className="event-thought-chain">
                    <span className="thought-label">Cognitive Deliberation:</span>
                    <ul className="thought-list">
                      {msg.thoughtChain.map((thought, tIdx) => (
                        <li key={tIdx}>{thought}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Synthesis Message */}
                <div className="event-message-text">
                  <p>{msg.message}</p>
                </div>

                {/* Executed Tool Call */}
                {msg.action && (
                  <div className="event-tool-call-box">
                    <div className="tool-call-header">
                      <span className="tool-name">Tool: <code>{msg.action.tool}</code></span>
                      <span className={`tool-status ${msg.action.status}`}>{msg.action.status.toUpperCase()}</span>
                    </div>
                    {msg.action.input && (
                      <pre className="tool-io-pre"><strong>Input:</strong> {msg.action.input}</pre>
                    )}
                    {msg.action.output && (
                      <pre className="tool-io-pre"><strong>Output:</strong> {msg.action.output}</pre>
                    )}
                  </div>
                )}

                {/* Cryptographic Hash Badge */}
                {msg.cryptographicHash && (
                  <div className="event-hash-row" onClick={() => handleCopyHash(msg.cryptographicHash!)}>
                    <span className="hash-label">Event Digest:</span>
                    <code className="hash-code">{msg.cryptographicHash}</code>
                    {copiedHash === msg.cryptographicHash ? (
                      <Check size={12} color="#10b981" />
                    ) : (
                      <Copy size={12} color="#64748b" />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
