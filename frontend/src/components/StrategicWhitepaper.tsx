import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  ChevronRight,
  Zap,
  ShieldCheck,
  Layers,
  FileText,
  Workflow,
  Network,
  Sliders,
  Boxes,
  Sparkles
} from 'lucide-react';

export const StrategicWhitepaper: React.FC = () => {
  // Interactive Calculator State
  const [revenue, setRevenue] = useState<number>(120); // in Millions USD
  const [complianceSpend, setComplianceSpend] = useState<number>(850); // in Thousands USD
  const [cycleMonths, setCycleMonths] = useState<number>(9); // in Months

  // Calculated metrics
  const projectedUnlockMillions = (revenue * 0.14).toFixed(2);
  const complianceSavedThousands = (complianceSpend * 0.82).toFixed(0);
  const compressedCycle = (cycleMonths / 4.1).toFixed(1);
  const multiplierFactor = (
    (parseFloat(projectedUnlockMillions) * 1000 + parseFloat(complianceSavedThousands)) /
    (complianceSpend || 1)
  ).toFixed(1);

  return (
    <div className="strategic-whitepaper-container fade-in-up">
      {/* Editorial Hero */}
      <section className="whitepaper-hero-section">
        <div className="hero-meta-badge">
          <FileText size={13} className="hero-badge-icon" />
          <span>Executive Strategic Monograph &amp; 2026 Enterprise Blueprint</span>
        </div>

        <h1 className="hero-headline">
          How Local Enterprises Leverage Autonomous AI Agents to Scale Globally
        </h1>

        <p className="hero-lead-text">
          A quantitative and architectural framework on breaking the "Scale Trilemma", automating cross-border regulatory compliance, and beating incumbent multinationals through supervised multi-agent systems powered by Google Gemini.
        </p>
      </section>

      {/* Interactive ROI Calculator */}
      <div className="premium-card roi-calculator-container">
        <div className="calculator-header-row">
          <div className="badge-icon-wrap orange">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="section-title-sm">Interactive Enterprise Autonomous Multiplier Calculator</h3>
            <p className="section-subtitle-sm">
              Model the economic impact of deploying an autonomous multi-agent operating system across your enterprise operations:
            </p>
          </div>
        </div>

        <div className="calc-inputs-row">
          <div className="calc-input-cell">
            <label className="calc-cell-label">Annual Enterprise Revenue ($M USD)</label>
            <input
              type="number"
              value={revenue}
              min="1"
              max="10000"
              onChange={(e) => setRevenue(Math.max(1, Number(e.target.value)))}
              className="calc-number-input"
            />
          </div>

          <div className="calc-input-cell">
            <label className="calc-cell-label">Cross-Border Legal &amp; Compliance ($K USD)</label>
            <input
              type="number"
              value={complianceSpend}
              min="10"
              max="100000"
              onChange={(e) => setComplianceSpend(Math.max(10, Number(e.target.value)))}
              className="calc-number-input"
            />
          </div>

          <div className="calc-input-cell">
            <label className="calc-cell-label">Current Cross-Border Cycle Time (Months)</label>
            <input
              type="number"
              value={cycleMonths}
              min="1"
              max="36"
              onChange={(e) => setCycleMonths(Math.max(1, Number(e.target.value)))}
              className="calc-number-input"
            />
          </div>
        </div>

        <div className="calc-metrics-grid">
          <div className="calc-stat-box">
            <span className="calc-stat-label">Projected Annual Value Unlock</span>
            <span className="calc-stat-val text-blue">+${projectedUnlockMillions}M</span>
          </div>

          <div className="calc-stat-box">
            <span className="calc-stat-label">Compliance Overhead Slashed</span>
            <span className="calc-stat-val text-emerald">-${complianceSavedThousands}K</span>
          </div>

          <div className="calc-stat-box">
            <span className="calc-stat-label">Time-To-Market Compressed</span>
            <span className="calc-stat-val text-orange">{compressedCycle} Months (from {cycleMonths}m)</span>
          </div>
        </div>

        <div className="calc-summary-footer">
          <span>Modeled Capital Efficiency Multiplier: </span>
          <strong className="text-emerald">{multiplierFactor}x ROI</strong>
          <span> (Exploratory sensitivity simulation — see breakdown below).</span>
        </div>

        {/* Formula & Provenance Disclosure Box */}
        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Underlying Mathematical Assumptions &amp; Provenance:</strong>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <li><strong>Value Unlock:</strong> Revenue ($M) × 14.0% assumed working capital release across cross-border accounts.</li>
            <li><strong>Compliance Savings:</strong> Legal Spend ($K) × 82.0% modeled reduction in routine manual clause matching hours.</li>
            <li><strong>Cycle Compression:</strong> Baseline Cycle ÷ 4.1x modeled acceleration from automated statutory pre-clearance.</li>
            <li><strong>Notice:</strong> Output is a quantitative planning model, not a guaranteed financial return or audited balance sheet projection. See <a href="#metrics" style={{ color: '#2563eb' }}>docs/metrics-and-evidence.md</a>.</li>
          </ul>
        </div>
      </div>

      {/* Monograph Section 1 */}
      <div className="premium-card monograph-body-section">
        <h2 className="monograph-section-title">
          <Zap size={18} className="icon-orange" />
          <span>1. The Trilemma of Global Scale for Local Enterprises</span>
        </h2>
        <p className="monograph-paragraph">
          Historically, regional champions—whether premier infrastructure conglomerates, mid-market advanced precision manufacturers, or specialized engineering exporters—confronted an asymmetrical barrier when attempting global expansion. This barrier consists of three interdependent friction points:
        </p>

        <div className="trilemma-summary-grid">
          <div className="trilemma-summary-item blue">
            <h4>Operational Asymmetry</h4>
            <p>
              Global multinationals maintain regional administrative offices in dozens of hubs. For a local enterprise, adding headcount in London, Dubai, Frankfurt, and New York results in runaway SG&amp;A overhead and communication latency.
            </p>
          </div>

          <div className="trilemma-summary-item emerald">
            <h4>The Compliance Chasm</h4>
            <p>
              Entering the EU requires GDPR, CSRD Scope-3 carbon tracing, and AI Act conformity. Entering the US requires EAR dual-use export classification and OFAC sanctions checks. Legal review cycles take weeks and cost hundreds of thousands of dollars per deal.
            </p>
          </div>

          <div className="trilemma-summary-item orange">
            <h4>Incumbent Moats</h4>
            <p>
              Entrenched global players have institutional brand recognition and extensive lobby power. Local enterprises competing on standard terms are pushed down to low-margin subcontractor roles.
            </p>
          </div>
        </div>
      </div>

      {/* Monograph Section 2 */}
      <div className="premium-card monograph-body-section">
        <h2 className="monograph-section-title">
          <ShieldCheck size={18} className="icon-blue" />
          <span>2. Autonomous Multi-Agent Swarms: The Paradigm Shift</span>
        </h2>
        <p className="monograph-paragraph">
          Autonomous AI Agent Systems represent a structural break from legacy Robotic Process Automation (RPA) or isolated chatbots. RPA executes rigid, hard-coded workflows that break when an API or regulation changes. Conversational chatbots answer questions but cannot take verifiable action.
        </p>
        <p className="monograph-paragraph">
          In contrast, an <strong>Autonomous Multi-Agent Swarm</strong> operates on <em>goal-oriented decentralized cognition</em>:
        </p>

        <div className="monograph-callout-quote">
          <strong className="quote-header">The Autonomous Leverage Formula:</strong>
          <p className="quote-body">
            "A local enterprise can now deploy specialized cognitive pods (Apex Orchestrator, Regulatory Sentinel, Operations Conductor, Market Alpha Strategist) that continuously deliberate, identify risks, and execute verifiable transactions without human intervention bottlenecks."
          </p>
        </div>

        <div className="monograph-bullet-list">
          <div className="bullet-row">
            <CheckCircle2 size={16} className="icon-emerald bullet-icon" />
            <div>
              <strong>Continuous Zero-Day Drift Governance:</strong> While humans audit quarterly, the Regulatory Sentinel monitors statutory feeds 24/7. When the EU amends CBAM or the US BIS alters entity lists, the agent automatically redrafts contract clauses and updates supplier requirements within seconds.
            </div>
          </div>
          <div className="bullet-row">
            <CheckCircle2 size={16} className="icon-emerald bullet-icon" />
            <div>
              <strong>Self-Healing Supply Chains:</strong> When maritime choke points arise (e.g. Red Sea delays), the Operations Conductor immediately computes multimodal alternatives (Eurasian rail vs air freight vs bonded transshipment) and dynamically reallocates inventory to preserve customer SLAs.
            </div>
          </div>
          <div className="bullet-row">
            <CheckCircle2 size={16} className="icon-emerald bullet-icon" />
            <div>
              <strong>Dynamic Competitive Arbitrage:</strong> By running zero-overhead autonomous operations, local enterprises operate at a 30% to 50% lower cost structure than bloated multinationals. The Market Alpha Strategist translates this cost advantage into dynamic tender undercutting and localized go-to-market strategies.
            </div>
          </div>
        </div>
      </div>

      {/* Monograph Section 3 */}
      <div className="premium-card monograph-body-section">
        <h2 className="monograph-section-title">
          <Layers size={18} className="icon-purple" />
          <span>3. Why the Google Gemini API Makes This Possible</span>
        </h2>
        <p className="monograph-paragraph">
          Building enterprise-grade autonomous agents requires more than generic language generation; it requires specific structural capabilities uniquely offered by the Google Gemini API:
        </p>

        <div className="gemini-advantages-stack">
          <div className="advantage-block">
            <div className="advantage-title">
              <ChevronRight size={15} /> 1. Massive 1M+ Token Context Window
            </div>
            <p>
              Cross-border enterprise compliance requires digesting entire legislative frameworks (EU CSRD, US CFR Title 15), 200-page EPC construction contracts, and complete multi-year ERP transaction logs. Gemini’s massive context eliminates fragmentation and hallucination caused by naive RAG chunking.
            </p>
          </div>

          <div className="advantage-block">
            <div className="advantage-title">
              <ChevronRight size={15} /> 2. Sub-Second Consensus Latency
            </div>
            <p>
              With models like <code>gemini-1.5-flash</code> and <code>gemini-2.0-flash</code>, multi-agent debates (Orchestrator -&gt; Sentinel -&gt; Conductor -&gt; Alpha -&gt; Auditor) conclude in under 2 seconds, making autonomous real-time supply chain re-routing and customs clearance viable during live operations.
            </p>
          </div>

          <div className="advantage-block">
            <div className="advantage-title">
              <ChevronRight size={15} /> 3. Deterministic Structured Tool Calling
            </div>
            <p>
              Gemini guarantees JSON schema compliance for tool calling, enabling direct integration into enterprise ERPs (SAP/Oracle), banking APIs, and government customs portals with zero JSON parse failures.
            </p>
          </div>
        </div>
      </div>

      {/* Monograph Section 4: The 2026 Shift */}
      <div className="premium-card monograph-body-section">
        <h2 className="monograph-section-title">
          <Workflow size={18} className="icon-orange" />
          <span>4. The 2026 Reality: Pivot to Supervised, High-ROI Autonomy</span>
        </h2>
        <p className="monograph-paragraph">
          In 2026, autonomous AI agents have crossed the chasm from experimental curiosity to boardroom mandate. However, a stark divide has emerged: <strong>over 80% of enterprise AI projects fail before reaching production</strong> when companies attempt the "Automate Everything" trap.
        </p>
        <p className="monograph-paragraph">
          Local enterprises succeed by pivoting from selling "full, unchecked autonomy" to deploying <strong>"supervised, high-ROI autonomy"</strong> grounded in three strategic principles:
        </p>

        <div className="principles-cards-grid">
          <div className="principle-card">
            <div className="principle-icon-wrap blue">
              <ShieldCheck size={20} />
            </div>
            <h4>1. Compliance-by-Design</h4>
            <p>
              Regulatory guardrails must not be an afterthought. Rules are baked directly into the agent’s decision-making loop. Every autonomous step generates an immutable, cryptographically verifiable audit trail before execution.
            </p>
            <div className="principle-tag">Verifiable Audit Proof</div>
          </div>

          <div className="principle-card">
            <div className="principle-icon-wrap orange">
              <Sliders size={20} />
            </div>
            <h4>2. Low-Code / No-Code Orchestration</h4>
            <p>
              SMEs cannot afford specialized ML engineering teams. Visual workflow orchestration, modular directive templates, and intuitive mission controls allow existing operations managers to configure and steer the agent workforce.
            </p>
            <div className="principle-tag">No ML Headcount Required</div>
          </div>

          <div className="principle-card">
            <div className="principle-icon-wrap emerald">
              <Boxes size={20} />
            </div>
            <h4>3. Modular "Plug-and-Play" Architecture</h4>
            <p>
              Enterprises achieve early ROI by deploying a single high-value agent pod (e.g., Compliance Reporting Sentinel) in days, validating business value before scaling horizontally into multi-agent cross-functional swarms.
            </p>
            <div className="principle-tag">Low-Risk Phased Onboarding</div>
          </div>
        </div>

        {/* 3 Next-Gen Differentiation Engines */}
        <div className="a2a-differentiation-block">
          <h3 className="section-title-sm" style={{ marginTop: '28px' }}>
            Next-Gen Differentiation: The 3 Global Market Catalysts
          </h3>
          <p className="section-subtitle-sm">
            How autonomous agents enable regional champions to outmaneuver multinational incumbents:
          </p>

          <div className="trilemma-summary-grid">
            <div className="trilemma-summary-item purple">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Network size={16} />
                <h4 style={{ margin: 0 }}>Agentic Commerce (A2A)</h4>
              </div>
              <p>
                Agents negotiate, verify credentials, and settle RFQs directly with external enterprise agents at machine speed, unlocking global supply chains without foreign commercial offices.
              </p>
            </div>

            <div className="trilemma-summary-item orange">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} />
                <h4 style={{ margin: 0 }}>Hyper-Personalization at Scale</h4>
              </div>
              <p>
                Local customer data is analyzed in real time to generate adaptive proposals and localized contracts matching native jurisdictional conventions (UK, Germany, UAE, India) dynamically.
              </p>
            </div>

            <div className="trilemma-summary-item emerald">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={16} />
                <h4 style={{ margin: 0 }}>Compliance as a Competitive Moat</h4>
              </div>
              <p>
                Zero-drift statutory adherence (GDPR, EU CBAM, US EAR, DORA) becomes an instant trust badge, enabling local firms to win tier-1 government and multinational contracts over slower rivals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monograph Section 5: The Strategic 4-Layer Blueprint */}
      <div className="premium-card monograph-body-section">
        <h2 className="monograph-section-title">
          <Workflow size={18} className="icon-emerald" />
          <span>5. The Strategic 4-Layer Architecture &amp; Phased Rollout Blueprint</span>
        </h2>
        <p className="monograph-paragraph">
          A successful enterprise autonomous deployment follows a rigorous 4-layer architectural hierarchy designed to mitigate integration risk, enforce strict security, and ensure executive trust:
        </p>

        <div className="arch-monograph-stack">
          <div className="arch-layer-step-card blue">
            <div className="step-badge">LAYER 1 // THE FOUNDATION</div>
            <h4>Data &amp; Integration Layer</h4>
            <p>
              API-first connectors to SME systems (QuickBooks, Odoo, SAP Business One, HubSpot, Shopify, banking APIs) + Live Regulatory RAG continuously ingesting statutory gazettes and sanctions lists.
            </p>
          </div>

          <div className="arch-layer-step-card orange">
            <div className="step-badge">LAYER 2 // MULTI-AGENT SYSTEM (MAS)</div>
            <h4>Specialized Cognitive Pods</h4>
            <p>
              Decentralized peer-review network: Operations Agent (inventory, dynamic routing), Compliance Agent (real-time statutory auditor), and Market Intelligence Agent (global price &amp; tender scanning).
            </p>
          </div>

          <div className="arch-layer-step-card emerald">
            <div className="step-badge">LAYER 3 // THE TRUST LAYER</div>
            <h4>Governance, OWASP Guardrails &amp; HITL Protocols</h4>
            <p>
              OWASP AI Top 10 security firewalls (prompt injection defenses, data leakage prevention) + Human-in-the-Loop approval gateways where high-stakes actions require explicit human cryptographic sign-off.
            </p>
          </div>

          <div className="arch-layer-step-card purple">
            <div className="step-badge">LAYER 4 // ADOPTION STRATEGY</div>
            <h4>Phased Rollout: Quick Win to Full Agentic Ecosystem</h4>
            <p>
              Phase 1 Quick Win (Days 1–30: single-task compliance document sorting) &rarr; Phase 2 Workflow Expansion (Days 31–90: cross-functional routing &amp; auditing) &rarr; Phase 3 Full Agentic Ecosystem (Days 90+: A2A commerce &amp; self-healing operations).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
