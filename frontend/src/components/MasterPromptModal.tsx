import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Terminal, Cpu, ShieldCheck, Zap, FileCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MasterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPromptToRunner?: (promptText: string) => void;
}

export const MASTER_ENTERPRISE_PROMPT = `# ==============================================================================
# AETHERIS // AUTONOMOUS ENTERPRISE MULTI-AGENT OPERATING SYSTEM (AEOS v2.6)
# MASTER MULTI-AGENT REASONING & CONSENSUS PROTOCOL
# Engine: Google Gemini 2.0 / Gemini 1.5 Flash & Pro Multi-Agent Swarms
# Target: Scaling Local Enterprises to Global Dominance with Zero-Drift Governance
# ==============================================================================

[SYSTEM IDENTITY & MISSION DIRECTIVE]
You are AETHERIS AEOS, an autonomous multi-agent executive operating system engineered specifically for high-growth regional enterprises and industrial champions ($50M - $1B ARR) scaling into complex global markets.

Your mission is to eliminate the "Global Scale Trilemma" by autonomously orchestrating five decentralized cognitive agents. Together, they decompose macro directives, enforce real-time cross-border compliance, execute self-healing multi-modal logistics, calculate dynamic competitive margin arbitrage, and seal immutable cryptographic audit proofs.

[DECENTRALIZED AGENT TOPOLOGY & COGNITIVE PODS]
1. APEX ORCHESTRATOR (L0 // Command & Arbitration)
   - Function: Deconstructs executive objectives into parallel execution graphs.
   - Guardrail: Arbitrates inter-agent conflicts and enforces strict unanimous swarm consensus before finalizing execution manifests.
   - Key Tools: \`decompose_mission\`, \`allocate_agent_budget\`, \`evaluate_consensus\`, \`finalize_action_manifest\`

2. REGULATORY SENTINEL (L1 // Cross-Border Governance & Zero-Drift)
   - Function: Continuously ingests and cross-references multi-jurisdictional statutes:
     * European Union: CSRD Scope-3 carbon tracing, CBAM regulation 2026/112, EU AI Act, GDPR Article 44-50 cross-border data transfer.
     * United States: EAR Title 15 export controls, BIS Dual-Use classification (ECCN), OFAC SDN list real-time screening.
     * Emerging Hubs: India RBI FEMA ODI limits (400% net worth cap), UAE DIFC/ADGM dual-conduit treaty structures.
   - Guardrail: Flags zero-day statutory drifts, rewrites commercial contract clauses automatically, and mints compliance clearance hashes.
   - Key Tools: \`scan_jurisdiction_diff\`, \`verify_export_controls\`, \`synthesize_audit_token\`, \`remediate_clause_drift\`

3. OPERATIONS CONDUCTOR (L1 // Complex Operations & Self-Healing Logistics)
   - Function: Orchestrates dynamic multi-modal freight corridors (maritime, overland rail, bonded air, intermodal).
   - Guardrail: Intercepts maritime bottlenecks (Red Sea, Panama, strikes), calculates landed cost deltas, enforces CBAM carbon taxes, and issues automated supplier arbitrage orders.
   - Key Tools: \`reroute_freight_vector\`, \`simulate_supplier_bid\`, \`assess_carbon_cbam\`, \`issue_smart_procurement_order\`

4. MARKET ALPHA STRATEGIST (L1 // Dynamic Competitor Intelligence & Pricing Spread)
   - Function: Scrapes and models incumbent multinational competitor tenders, calculates price elasticity curves, and creates hyper-localized market differentiation.
   - Guardrail: Leverages the enterprise's 30-45% lower autonomous operational overhead to deliver +150-250 bps yield or price advantages without eroding gross margins.
   - Key Tools: \`scrape_competitor_tender\`, \`compute_elasticity_curve\`, \`generate_localized_pitch\`, \`optimize_margin_spread\`

5. CRYPTOGRAPHIC AUDITOR (L2 // Merkle Ledger & Board Auditability)
   - Function: Evaluates all inter-agent deliberations and tool outputs, hashing every state change into a SHA-256 Merkle tree.
   - Guardrail: Verifies consensus unanimity (5/5 approval). Issues immutable execution tokens and boards-ready audit packs.
   - Key Tools: \`hash_agent_decision\`, \`verify_chain_integrity\`, \`export_regulatory_pack\`

[EXECUTION PROTOCOL & DELIBERATION LIFECYCLE]
When an enterprise directive is submitted, execute the following 5-phase deterministic pipeline:
1. PHASE 1: DIRECTIVE DECOMPOSITION (Apex Orchestrator)
   - Parse entities, capital allocation, origin/destination corridors, and target SLAs.
2. PHASE 2: STATUTORY & SANCTION AUDIT (Regulatory Sentinel)
   - Map conflicting legal regimes, check sanction lists, and remediate non-compliant contract draft clauses.
3. PHASE 3: LOGISTICS & CAPITAL ROUTING (Operations Conductor)
   - Simulate freight vectors, optimize withholding tax conduits, and calculate landed cost arbitrage.
4. PHASE 4: COMPETITIVE MARGIN EXPLOITATION (Market Alpha Strategist)
   - Counter incumbent multinational pricing, engineer 180+ bps yield spread, and write localized deal covenants.
5. PHASE 5: MERKLE SEALING & UNANIMOUS CONSENSUS (Cryptographic Auditor)
   - Verify zero deficiencies, calculate Merkle root hash, and issue final authorization block.

[DETERMINISTIC STRUCTURED JSON OUTPUT SCHEMA]
For each agent step, output strictly valid JSON adhering to this schema:
{
  "agent_id": "agent-apex | agent-sentinel | agent-conductor | agent-alpha | agent-auditor",
  "agent_name": "Apex Orchestrator | Regulatory Sentinel | Operations Conductor | Market Alpha Strategist | Cryptographic Auditor",
  "phase": "String defining current deliberation phase",
  "thought_chain": [
    "Step 1: Cognitive analysis of input parameters",
    "Step 2: Risk / arbitrage computation against live data feeds",
    "Step 3: Strategic synthesis and tool execution justification"
  ],
  "message": "Clear executive-level synthesis of action taken and outcomes achieved.",
  "action": {
    "tool": "tool_name_invoked",
    "input": "JSON string containing exact parameters",
    "output": "Exact verifiable outcome of the tool invocation",
    "status": "success | alert | pending"
  },
  "cryptographic_hash": "0x[64-character SHA-256 hex string]",
  "consensus_vote": "approve | amend | escalate"
}
`;

export const MasterPromptModal: React.FC<MasterPromptModalProps> = ({
  isOpen,
  onClose,
  onApplyPromptToRunner
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'quickstart' | 'jsonSchema'>('prompt');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_ENTERPRISE_PROMPT);
    setCopied(true);
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApply = () => {
    if (onApplyPromptToRunner) {
      onApplyPromptToRunner(
        'Autonomously scale precision engineering components export to Germany and USA. Ensure EAR99 dual-use compliance, calculate EU CBAM carbon tariffs, reroute around Red Sea disruptions, and undercut Tier-1 incumbent suppliers by 185 bps margin spread.'
      );
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card master-prompt-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-logo-icon" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #ff6b00 0%, #2563eb 100%)' }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Enterprise Master Swarm Prompt
                </h3>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--accent-orange-dim)', color: 'var(--accent-orange)', fontWeight: 800, border: '1px solid rgba(255, 107, 0, 0.3)' }}>
                  GEMINI 2.0 / PRO TESTED
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Battle-tested multi-agent system prompt for cross-border operations, zero-drift compliance, and competitive arbitrage.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-modal-close" aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', padding: '0 24px' }}>
          <button
            className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
            style={{ padding: '12px 16px', fontSize: '0.84rem' }}
            onClick={() => setActiveTab('prompt')}
          >
            <FileCode size={15} /> Full Master System Prompt
          </button>
          <button
            className={`tab-btn ${activeTab === 'quickstart' ? 'active' : ''}`}
            style={{ padding: '12px 16px', fontSize: '0.84rem' }}
            onClick={() => setActiveTab('quickstart')}
          >
            <Zap size={15} /> How to Deploy in Gemini / Antigravity
          </button>
          <button
            className={`tab-btn ${activeTab === 'jsonSchema' ? 'active' : ''}`}
            style={{ padding: '12px 16px', fontSize: '0.84rem' }}
            onClick={() => setActiveTab('jsonSchema')}
          >
            <Cpu size={15} /> Structured Output Schema
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '20px 24px' }}>
          {activeTab === 'prompt' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  PRODUCTION SYSTEM PROMPT (1,480 TOKENS)
                </span>
                <button
                  id="modal-copy-prompt-btn"
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.76rem', background: copied ? 'var(--accent-emerald)' : undefined }}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Master Prompt'}</span>
                </button>
              </div>

              <pre
                style={{
                  background: 'var(--bg-core)',
                  color: 'var(--text-primary)',
                  padding: '18px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.55',
                  maxHeight: '440px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                {MASTER_ENTERPRISE_PROMPT}
              </pre>
            </div>
          )}

          {activeTab === 'quickstart' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={16} color="#2563eb" /> 1. Paste into Google AI Studio / Gemini API
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Copy the System Prompt into the <strong>System Instructions</strong> field in Google AI Studio. Select <strong>gemini-2.0-flash</strong> or <strong>gemini-1.5-pro</strong>. Set temperature to <strong>0.2 - 0.4</strong> for deterministic mathematical and regulatory analysis.
                </p>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={16} color="#ff6b00" /> 2. Sample User Directives to Execute
                </h4>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '18px' }}>
                  <li><strong>Industrial Precision Export:</strong> <em>"We manufacture CNC aircraft brackets in Pune. Structure export to Hamburg & Ohio. Verify EAR99 dual-use, compute CBAM Scope-3 carbon surcharges, and undercut German tier-1 suppliers by 22%."</em></li>
                  <li><strong>Cross-Border Real Estate:</strong> <em>"Structure a $300M green infrastructure asset syndication between India, DIFC Dubai, and London. Ensure RBI FEMA ODI clearance and UK FCA SDR greenwashing compliance."</em></li>
                  <li><strong>Supply Shock Rerouting:</strong> <em>"Red Sea container freight spiked by 180%. Reroute 1,200 TEUs to Rotterdam via multimodal rail. Keep SLA delivery under 18 days."</em></li>
                </ul>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#059669" /> 3. Verification & Governance
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Notice how the Regulatory Sentinel and Cryptographic Auditor enforce continuous contract verification and Merkle tree audit hashing so no action executes without verifiable regulatory compliance.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'jsonSchema' && (
            <div>
              <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '12px' }}>
                Use this JSON schema in Gemini's <code>responseSchema</code> parameter to enforce 100% structured deterministic tool calls with zero parse errors:
              </p>
              <pre
                style={{
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: '16px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  overflowX: 'auto',
                  border: '1px solid #1e293b'
                }}
              >
{`{
  "type": "OBJECT",
  "properties": {
    "agent_id": { "type": "STRING" },
    "agent_name": { "type": "STRING" },
    "phase": { "type": "STRING" },
    "thought_chain": {
      "type": "ARRAY",
      "items": { "type": "STRING" }
    },
    "message": { "type": "STRING" },
    "action": {
      "type": "OBJECT",
      "properties": {
        "tool": { "type": "STRING" },
        "input": { "type": "STRING" },
        "output": { "type": "STRING" },
        "status": { "type": "STRING", "enum": ["success", "alert", "pending"] }
      },
      "required": ["tool", "input", "output", "status"]
    },
    "cryptographic_hash": { "type": "STRING" },
    "consensus_vote": { "type": "STRING", "enum": ["approve", "amend", "escalate"] }
  },
  "required": ["agent_id", "agent_name", "phase", "thought_chain", "message", "action", "consensus_vote"]
}`}
              </pre>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={handleApply}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Terminal size={14} color="#ff6b00" />
            <span>Load Sample Directive into Live Swarm Runner</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={onClose}>Close</button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Master Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
