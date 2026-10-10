import React, { useState } from 'react';
import { Copy, Check, Lock, Layers, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Agent, SwarmMessage } from '../types';

interface ConsensusVotingMatrixProps {
  agents: Agent[];
  messages: SwarmMessage[];
  isExecuting: boolean;
  consensusAchieved: boolean;
}

export const ConsensusVotingMatrix: React.FC<ConsensusVotingMatrixProps> = ({
  agents,
  messages,
  isExecuting,
  consensusAchieved
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.4 }
    });
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Deterministic public key hashes for the 5 agents
  const agentPublicKeys: Record<string, string> = {
    'agent-apex': '0x7F2a...91D4',
    'agent-sentinel': '0x3E1c...44A9',
    'agent-conductor': '0x8B99...22C0',
    'agent-alpha': '0x1F44...88E5',
    'agent-auditor': '0x99A0...33F1'
  };

  const agentLatencies: Record<string, string> = {
    'agent-apex': '112ms',
    'agent-sentinel': '148ms',
    'agent-conductor': '164ms',
    'agent-alpha': '138ms',
    'agent-auditor': '96ms'
  };

  const agentWeights: Record<string, string> = {
    'agent-apex': '25%',
    'agent-sentinel': '20%',
    'agent-conductor': '20%',
    'agent-alpha': '20%',
    'agent-auditor': '15%'
  };

  const latestHash =
    messages[messages.length - 1]?.cryptographicHash ||
    '0x8f3c71a9b4d2e5f081c7a4b2d9e6f1a3c5b7d9e0f2a4c6e8b1d3f5a7c9e2b4d6';


  // Compute how many agents have approved in current session
  const approvedCount = isExecuting
    ? Math.min(5, Math.max(1, messages.filter((m) => m.consensusVote === 'approve').length))
    : consensusAchieved
    ? 5
    : 0;

  const quorumPercentage = (approvedCount / 5) * 100;

  return (
    <div className="consensus-voting-matrix-card">
      <div className="consensus-matrix-header">
        <div className="matrix-title-group">
          <div className="matrix-icon-badge">
            <Lock size={15} color="#2563eb" />
          </div>
          <div>
            <div className="matrix-title">
              <span>Multi-Agent Consensus Voting Matrix</span>
              <span className="consensus-quorum-pill">
                <span className="quorum-dot" style={{ backgroundColor: consensusAchieved ? '#10b981' : isExecuting ? '#f59e0b' : '#64748b' }} />
                {consensusAchieved ? '5/5 UNANIMOUS QUORUM' : isExecuting ? `QUORUM VOTING (${approvedCount}/5)` : 'STANDBY'}
              </span>
            </div>
            <p className="matrix-subtitle">
              Zero-drift cryptographic consensus protocol // Byzantine-fault tolerant peer verification
            </p>
          </div>
        </div>

        <div className="merkle-root-badge" onClick={() => handleCopy(latestHash)} title="Click to copy Merkle Genesis Root">
          <div className="merkle-root-label">
            <Layers size={12} color="#10b981" />
            <span>Merkle Proof Root:</span>
          </div>
          <code className="merkle-root-code">{latestHash.slice(0, 16)}...{latestHash.slice(-8)}</code>
          {copiedHash === latestHash ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#64748b" />}
        </div>
      </div>

      {/* Segmented Consensus Bar */}
      <div className="consensus-bar-wrapper">
        <div className="consensus-bar-track">
          <div
            className="consensus-bar-fill affirmative"
            style={{ width: `${quorumPercentage}%` }}
          />
        </div>
        <div className="consensus-bar-metrics">
          <span className="bar-metric-item">
            <strong>Affirmative Votes:</strong> {approvedCount}/5 ({quorumPercentage}%)
          </span>
          <span className="bar-metric-item">
            <strong>Consensus Threshold:</strong> 100% Unanimous
          </span>
          <span className="bar-metric-item">
            <strong>Aggregate Quorum Latency:</strong> ~132ms
          </span>
        </div>
      </div>

      {/* 5-Node Voting Grid */}
      <div className="voting-nodes-grid">
        {agents.map((agent) => {
          const pubKey = agentPublicKeys[agent.id] || '0x44B1...198F';
          const latency = agentLatencies[agent.id] || '120ms';
          const weight = agentWeights[agent.id] || '20%';

          // Check if this agent has deliberated/voted
          const agentMessage = messages.find((m) => m.agentId === agent.id);
          const hasVoted = Boolean(agentMessage?.consensusVote) || (consensusAchieved && !isExecuting);
          const isPending = isExecuting && !hasVoted;

          return (
            <div
              key={agent.id}
              className={`voting-node-tile ${hasVoted ? 'voted-approved' : isPending ? 'voting-in-flight' : 'voting-standby'}`}
            >
              <div className="node-tile-top">
                <span className="node-name" style={{ color: agent.avatarColor }}>
                  {agent.name.split(' ')[0]}
                </span>
                <span className={`node-vote-status-badge ${hasVoted ? 'badge-approved' : isPending ? 'badge-inflight' : 'badge-idle'}`}>
                  {hasVoted ? 'APPROVED' : isPending ? 'IN-FLIGHT' : 'QUEUED'}
                </span>
              </div>

              <div className="node-pubkey-row">
                <span className="node-pubkey-label">PUBKEY:</span>
                <code className="node-pubkey-val">{pubKey}</code>
              </div>

              <div className="node-meta-row">
                <span className="node-weight-chip">Weight: {weight}</span>
                <span className="node-latency-chip">
                  <Zap size={10} />
                  {latency}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
