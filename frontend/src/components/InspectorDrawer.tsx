import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Terminal,
  ChevronRight,
  ChevronDown,
  Lock,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { Agent } from '../types';
import type { MerkleBlockItem } from '../types/auth';

export type DrawerContentType =
  | { type: 'agent'; agent: Agent }
  | { type: 'merkle'; block?: MerkleBlockItem | any }
  | { type: 'compliance'; corridorId?: string }
  | null;

interface InspectorDrawerProps {
  isOpen: boolean;
  content: DrawerContentType;
  onClose: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const InspectorDrawer: React.FC<InspectorDrawerProps> = ({
  isOpen,
  content,
  onClose,
  onNavigateToTab
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root: true,
    branch_left: true,
    branch_right: true
  });

  if (!isOpen || !content) return null;

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  const handleCopy = (text: string, type: 'hash' | 'proof') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedProof(true);
      setTimeout(() => setCopiedProof(false), 2000);
    }
  };

  return (
    <div className="inspector-drawer-overlay" onClick={onClose}>
      <aside
        className="inspector-drawer-panel glass-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="High Density Inspector Drawer"
      >
        {/* Drawer Header */}
        <div className="inspector-drawer-header">
          <div className="drawer-header-meta">
            <span className="drawer-badge">
              {content.type === 'agent' && 'AGENT REAL-TIME RUNTIME'}
              {content.type === 'merkle' && 'CRYPTOGRAPHIC MERKLE PROOF'}
              {content.type === 'compliance' && 'STATUTORY COMPLIANCE CITATION'}
            </span>
            <h3 className="drawer-title">
              {content.type === 'agent' && content.agent.name}
              {content.type === 'merkle' && `Merkle Block #${content.block?.blockNumber || '849,202'}`}
              {content.type === 'compliance' && 'Zero-Drift Regulatory Protocol'}
            </h3>
          </div>

          <button
            className="drawer-close-btn"
            onClick={onClose}
            title="Close Inspector (Esc)"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="inspector-drawer-body">
          {/* ===================== AGENT RUNTIME VIEW ===================== */}
          {content.type === 'agent' && (
            <div className="drawer-agent-section">
              <div
                className="agent-hero-banner"
                style={{
                  borderLeft: `4px solid ${content.agent.avatarColor}`
                }}
              >
                <div className="agent-badge-row">
                  <span
                    className="agent-role-pill"
                    style={{
                      background: `${content.agent.avatarColor}20`,
                      color: content.agent.avatarColor,
                      borderColor: `${content.agent.avatarColor}40`
                    }}
                  >
                    {content.agent.badge}
                  </span>
                  <span className={`agent-live-status-pill ${content.agent.status}`}>
                    <span className="pulsing-dot" />
                    {content.agent.status.toUpperCase()}
                  </span>
                </div>
                <p className="agent-desc-text">{content.agent.description}</p>
              </div>

              {/* Cognitive State Box */}
              <div className="inspector-card">
                <div className="card-header-sm">
                  <Terminal size={14} className="accent-icon" />
                  <span>Current Deliberation State</span>
                </div>
                <div className="agent-thought-stream">
                  <code>{content.agent.currentThought}</code>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="inspector-metrics-grid">
                <div className="inspector-metric-card">
                  <span className="metric-label">Confidence Score</span>
                  <span className="metric-value font-mono tabular-nums emerald">
                    {content.agent.confidence}%
                  </span>
                </div>
                <div className="inspector-metric-card">
                  <span className="metric-label">Consensus Weight</span>
                  <span className="metric-value font-mono tabular-nums cyan">
                    L{content.agent.role === 'orchestrator' ? '0 / 1.00' : '1 / 0.85'}
                  </span>
                </div>
                <div className="inspector-metric-card">
                  <span className="metric-label">Cryptographic Identity</span>
                  <span className="metric-value font-mono text-truncate">
                    0x7F...9A4E
                  </span>
                </div>
                <div className="inspector-metric-card">
                  <span className="metric-label">Statutory Alignment</span>
                  <span className="metric-value font-mono tabular-nums emerald">
                    100.0%
                  </span>
                </div>
              </div>

              {/* Autonomous Capabilities */}
              <div className="inspector-card">
                <div className="card-header-sm">
                  <Sparkles size={14} className="accent-icon" />
                  <span>Autonomous Core Capabilities</span>
                </div>
                <div className="capabilities-tags-list">
                  {content.agent.capabilities.map((cap, i) => (
                    <span key={i} className="capability-tag">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sandboxed Tool Manifest */}
              <div className="inspector-card">
                <div className="card-header-sm">
                  <Lock size={14} className="accent-icon" />
                  <span>Permitted Sandboxed Tools</span>
                </div>
                <div className="tools-code-list">
                  {content.agent.tools.map((t, i) => (
                    <div key={i} className="tool-row">
                      <ChevronRight size={12} className="tool-arrow" />
                      <code className="font-mono">{t}</code>
                      <span className="tool-scope-badge">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== MERKLE PROOF VIEW ===================== */}
          {content.type === 'merkle' && (
            <div className="drawer-merkle-section">
              {/* Root Anchor Card */}
              <div className="merkle-anchor-card">
                <div className="anchor-header">
                  <div className="anchor-title-box">
                    <ShieldCheck size={16} className="emerald" />
                    <span className="anchor-title">Root State Anchor</span>
                  </div>
                  <span className="anchor-status-pill verified">
                    <CheckCircle2 size={12} />
                    TAMPER-PROOF VERIFIED
                  </span>
                </div>

                <div className="hash-display-box">
                  <span className="hash-type-label">SHA-256 Root Hash:</span>
                  <div className="hash-row">
                    <code className="font-mono text-break">
                      {content.block?.rootHash ||
                        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </code>
                    <button
                      className="copy-chip-btn"
                      onClick={() =>
                        handleCopy(
                          content.block?.rootHash ||
                            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                          'hash'
                        )
                      }
                      title="Copy Hash"
                    >
                      {copiedHash ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="merkle-substats">
                  <span>
                    Block Height: <strong className="font-mono tabular-nums">#{content.block?.blockNumber || '849,202'}</strong>
                  </span>
                  <span>
                    Consensus Leaves: <strong className="font-mono tabular-nums">16 Signed Events</strong>
                  </span>
                </div>
              </div>

              {/* Interactive Merkle DAG Tree */}
              <div className="inspector-card">
                <div className="card-header-sm">
                  <Layers size={14} className="accent-icon" />
                  <span>Interactive Binary Merkle DAG Tree</span>
                </div>

                <div className="merkle-dag-tree">
                  {/* Root Node */}
                  <div className="dag-node dag-root">
                    <button
                      className="dag-node-header"
                      onClick={() => toggleNode('root')}
                    >
                      {expandedNodes.root ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="dag-node-type">ROOT [Level 0]</span>
                      <code className="font-mono dag-mini-hash">
                        {content.block?.rootHash?.slice(0, 16) || 'e3b0c44298fc1c14...'}
                      </code>
                    </button>

                    {expandedNodes.root && (
                      <div className="dag-children-branch">
                        {/* Branch Left */}
                        <div className="dag-node dag-branch">
                          <button
                            className="dag-node-header"
                            onClick={() => toggleNode('branch_left')}
                          >
                            {expandedNodes.branch_left ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            <span className="dag-node-type">BRANCH_L [Level 1]</span>
                            <code className="font-mono dag-mini-hash">7c4a8d09...</code>
                          </button>

                          {expandedNodes.branch_left && (
                            <div className="dag-leaf-group">
                              <div className="dag-leaf-item verified">
                                <span className="leaf-dot emerald" />
                                <div className="leaf-info">
                                  <span className="leaf-label">Leaf 0: Shortage Detection Deficit</span>
                                  <code className="font-mono leaf-hash">sha256: 3a9f02...e41c</code>
                                </div>
                                <span className="leaf-status-tag">Verified</span>
                              </div>
                              <div className="dag-leaf-item verified">
                                <span className="leaf-dot emerald" />
                                <div className="leaf-info">
                                  <span className="leaf-label">Leaf 1: Vendor Arbitrage Bavaria Met.</span>
                                  <code className="font-mono leaf-hash">sha256: d81a7b...c099</code>
                                </div>
                                <span className="leaf-status-tag">Verified</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Branch Right */}
                        <div className="dag-node dag-branch">
                          <button
                            className="dag-node-header"
                            onClick={() => toggleNode('branch_right')}
                          >
                            {expandedNodes.branch_right ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            <span className="dag-node-type">BRANCH_R [Level 1]</span>
                            <code className="font-mono dag-mini-hash">f29e1c45...</code>
                          </button>

                          {expandedNodes.branch_right && (
                            <div className="dag-leaf-group">
                              <div className="dag-leaf-item verified">
                                <span className="leaf-dot emerald" />
                                <div className="leaf-info">
                                  <span className="leaf-label">Leaf 2: Statutory EAR99 Clearance</span>
                                  <code className="font-mono leaf-hash">sha256: 9b2d88...17a3</code>
                                </div>
                                <span className="leaf-status-tag">Verified</span>
                              </div>
                              <div className="dag-leaf-item verified">
                                <span className="leaf-dot amber" />
                                <div className="leaf-info">
                                  <span className="leaf-label">Leaf 3: PO Approval Sign-off ($10,800)</span>
                                  <code className="font-mono leaf-hash">sha256: 41c590...fa22</code>
                                </div>
                                <span className="leaf-status-tag">Dual-Key</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Button Cluster */}
              <div className="drawer-actions-footer">
                <button
                  className="btn-drawer-action primary"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(
                        {
                          rootHash: content.block?.rootHash || '0xRootProof',
                          blockHeight: 849202,
                          timestamp: new Date().toISOString(),
                          algorithm: 'SHA-256 + Ed25519',
                          signature:
                            '3045022100e4b85c3917d057cd426d11a9134547901844bda23bfcf8d0672776c2d1b702202685933a39e99a8f'
                        },
                        null,
                        2
                      ),
                      'proof'
                    )
                  }
                >
                  <Copy size={14} />
                  <span>{copiedProof ? 'Proof Copied!' : 'Copy Verification Proof'}</span>
                </button>

                <button
                  className="btn-drawer-action secondary"
                  onClick={() => {
                    const blob = new Blob(
                      [
                        JSON.stringify(
                          {
                            certificate: 'AETHERIS AEOS CRYPTOGRAPHIC AUDIT CERTIFICATE',
                            blockHeight: 849202,
                            merkleRoot: content.block?.rootHash || 'e3b0c442...',
                            status: 'TAMPER_PROOF_CERTIFIED',
                            timestamp: new Date().toISOString()
                          },
                          null,
                          2
                        )
                      ],
                      { type: 'application/json' }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `AETHERIS-Audit-Cert-${Date.now()}.json`;
                    a.click();
                  }}
                >
                  <Download size={14} />
                  <span>Export Audit Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================== COMPLIANCE CITATION VIEW ===================== */}
          {content.type === 'compliance' && (
            <div className="drawer-compliance-section">
              <div className="compliance-hero-card">
                <ShieldCheck size={28} className="emerald" />
                <div>
                  <h4 className="compliance-hero-title">Continuous Zero-Drift Guardrails</h4>
                  <p className="compliance-hero-sub">
                    Harmonized statutory parsing spanning US Export Controls, EU ESG Due Diligence, and Indian Cross-Border RBI regulations.
                  </p>
                </div>
              </div>

              <div className="inspector-card">
                <div className="card-header-sm">
                  <ExternalLink size={14} className="accent-icon" />
                  <span>Active Statutory Corridors</span>
                </div>
                <div className="corridor-statute-list">
                  <div className="corridor-statute-row">
                    <span className="statute-badge">🇪🇺 EU AI ACT & CSRD</span>
                    <div className="statute-details">
                      <strong>Article 14 Human Oversight Compliance</strong>
                      <p>Full autonomous fail-safe triggers activated on transactions &gt; $5,000 threshold.</p>
                    </div>
                  </div>
                  <div className="corridor-statute-row">
                    <span className="statute-badge">🇺🇸 US EAR99 / BIS</span>
                    <div className="statute-details">
                      <strong>Dual-Use Export Classification Verified</strong>
                      <p>Titanium Flanges certified for non-military commercial aviation delivery.</p>
                    </div>
                  </div>
                  <div className="corridor-statute-row">
                    <span className="statute-badge">🇩🇪 GERMAN LkSG</span>
                    <div className="statute-details">
                      <strong>Supply Chain Due Diligence Act</strong>
                      <p>Tier-1 to Tier-3 supplier ESG audits verified with zero labor or carbon infractions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  className="btn-drawer-action primary"
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={() => {
                    onNavigateToTab('compliance');
                    onClose();
                  }}
                >
                  <span>Open Full Compliance Sentinel</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
