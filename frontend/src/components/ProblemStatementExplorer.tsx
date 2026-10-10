import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sliders,
  XCircle,
  Scale,
  Compass,
  Workflow,
  ShieldAlert,
  Database,
  Network,
  UserCheck,
  Boxes,
  Layers as LayersIcon
} from 'lucide-react';

interface ProblemStatementExplorerProps {
  onDispatchToMission: (customDirective: string) => void;
}

export const ProblemStatementExplorer: React.FC<ProblemStatementExplorerProps> = ({
  onDispatchToMission
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'pain_points' | 'pillars' | 'architecture' | 'adoption' | 'matrix' | 'simulator'
  >('pain_points');

  // Interactive 5 Ps State
  const [selectedPainPoint, setSelectedPainPoint] = useState<number>(0);

  // Interactive Architecture Layer State
  const [activeArchLayer, setActiveArchLayer] = useState<1 | 2 | 3 | 4>(1);

  // Simulator State
  const [sectorType, setSectorType] = useState<'industrial' | 'realestate' | 'chemicals' | 'fintech'>('industrial');
  const [annualRevenue, setAnnualRevenue] = useState<number>(180); // in $M
  const [targetCountries, setTargetCountries] = useState<number>(4);
  const [volatilityLevel, setVolatilityLevel] = useState<'moderate' | 'high' | 'severe'>('high');

  // Computed metrics for the simulator
  const volatilityMultiplier = volatilityLevel === 'severe' ? 1.45 : volatilityLevel === 'high' ? 1.2 : 1.0;
  const legacySgaCost = ((annualRevenue * 0.12 * (targetCountries / 3)) * volatilityMultiplier).toFixed(1);
  const swarmSgaCost = (parseFloat(legacySgaCost) * 0.22).toFixed(1);
  const netSgaSavings = (parseFloat(legacySgaCost) - parseFloat(swarmSgaCost)).toFixed(1);
  const complianceRiskScore =
    volatilityLevel === 'severe'
      ? '88% High Penalty Risk'
      : volatilityLevel === 'high'
      ? '64% Moderate Risk'
      : '42% Guarded Risk';
  const velocityGain = (2.8 + targetCountries * 0.45).toFixed(1);

  const getSectorPrompt = () => {
    switch (sectorType) {
      case 'industrial':
        return `Autonomously coordinate precision industrial export across ${targetCountries} global jurisdictions with high US EAR dual-use licensing compliance, calculate EU CBAM embedded emissions, and dynamically route maritime containers around global choke points with zero demurrage penalties.`;
      case 'realestate':
        return `Autonomously structure a $${annualRevenue}M cross-border syndicated commercial real estate fund across ${targetCountries} hubs, ensuring full UK FCA SDR ESG green-labeling compliance and RBI-FEMA ODI clearances while beating European REIT yields by 180 bps.`;
      case 'chemicals':
        return `Autonomously audit specialty chemical supply chains entering the EU and US, recalculating carbon tariffs under CBAM Regulation 2026/112, verifying German Supply Chain Act (LkSG) tier-3 supplier human rights audits, and securing dynamic bulk purchasing discounts.`;
      case 'fintech':
        return `Autonomously manage liquidity corridors across ${targetCountries} central banks, enforcing FATF Travel Rule compliance, real-time DORA operational resilience verification, and dynamic cross-border FX spread arbitrage.`;
    }
  };

  const PAIN_POINTS = [
    {
      id: 'automate-everything',
      title: '1. The "Automate Everything" Trap',
      shortTag: 'Over-Scoping Risk',
      metric: '80%+ AI Projects Fail',
      metricSubtitle: 'Fail before reaching production',
      icon: AlertTriangle,
      accent: 'orange',
      problem:
        'Many local enterprises attempt to automate too much too quickly without clear bounding contexts. This leads to runaway complexity, brittle agent breakdowns, and project abandonment before reaching production.',
      rootCause:
        'Treating autonomous AI as an all-or-nothing silver bullet rather than a stage-gated, supervised cognitive workforce with bounded tools and clear interfaces.',
      enterpriseImpact:
        'Wasted executive capital, disillusioned operational teams, and institutional fear of deploying AI for critical commercial processes.',
      aetherisRemedy:
        'Supervised, High-ROI Autonomy: Stage-gated deployment starting with narrow, deterministic pods, strict SLA boundaries, and multi-agent peer consensus verification.'
    },
    {
      id: 'fragmented-data',
      title: '2. Fragmented Data & Legacy Systems',
      shortTag: 'Integration Friction',
      metric: '68% Data Fragmentation',
      metricSubtitle: 'In siloed on-prem SME ERPs',
      icon: Database,
      accent: 'blue',
      problem:
        'Autonomous agents require clean, unified, contextual data to act reliably. Local enterprises frequently operate on shaky data foundations and siloed legacy systems (QuickBooks, Tally, legacy SAP, fragmented CRMs).',
      rootCause:
        'Lack of unified API middleware and standardized semantic data contracts across operational departments.',
      enterpriseImpact:
        'Agent hallucinations, stalled tool execution, and inability to reconcile real-time inventory, pricing, and bank accounts.',
      aetherisRemedy:
        'Layer 1 API-First SME Connectors paired with Google Gemini’s massive context window, ingesting structured and semi-structured legacy schemas directly without brittle ETL overhauls.'
    },
    {
      id: 'compliance-gaps',
      title: '3. Compliance & Governance Gaps',
      shortTag: 'Regulatory Spike',
      metric: 'Only 21% Governance Ready',
      metricSubtitle: 'Prepared for autonomous actions',
      icon: ShieldAlert,
      accent: 'red',
      problem:
        'As agents execute autonomously across borders, regulatory liability spikes exponentially. With fast-shifting statutory mandates (EU AI Act, EU CBAM, US EAR/OFAC), unmonitored agent actions can trigger severe statutory penalties.',
      rootCause:
        'Absence of real-time legal cross-checks in the agent decision loop and reliance on manual quarterly outside counsel reviews.',
      enterpriseImpact:
        'Customs seizures, regulatory fines up to 7% of revenue, and reputational blacklisting from global enterprise procurement lists.',
      aetherisRemedy:
        'Compliance-by-Design: The Regulatory Sentinel agent acts as a live statutory auditor validating all operations against legal registries before execution, sealed in an immutable SHA-256 Merkle audit ledger.'
    },
    {
      id: 'resource-constraints',
      title: '4. Resource & Skill Constraints',
      shortTag: 'Talent & CapEx Gap',
      metric: '1/10th Multinational Budget',
      metricSubtitle: 'Zero in-house ML researchers',
      icon: Boxes,
      accent: 'purple',
      problem:
        'Mid-market and regional firms lack the dedicated machine learning research teams, multi-million dollar GPU clusters, and prompt engineering staff that multinational conglomerates possess.',
      rootCause:
        'High total cost of ownership (TCO) and extreme scarcity of specialized AI/ML engineering talent in regional markets.',
      enterpriseImpact:
        'Custom bespoke AI development projects drag on for 12–18 months, run over budget, or produce unmaintainable spaghetti code.',
      aetherisRemedy:
        'Low-Code/No-Code Orchestration & Modular Plug-and-Play Architecture: Pre-trained cognitive pods that business domain operators can deploy and modify in minutes without touching Python or ML infrastructure.'
    },
    {
      id: 'trust-accountability',
      title: '5. Trust & Accountability Deficit',
      shortTag: 'Black-Box Hesitation',
      metric: '92% Demand HITL Guardrails',
      metricSubtitle: 'For high-stakes decisions',
      icon: UserCheck,
      accent: 'emerald',
      problem:
        'Executive leadership and business owners are rightly hesitant to trust opaque, fully autonomous "black box" systems with critical financial transactions, legally binding contracts, or key customer communications.',
      rootCause:
        'Unsupervised agent hallucination risk and lack of transparent, verifiable reasoning chains.',
      enterpriseImpact:
        'Executive veto of AI deployments; paralysis where agents are relegated to useless chatbots rather than true operational workers.',
      aetherisRemedy:
        'Human-in-the-Loop (HITL) Tiered Protocols: Swarms prepare, cross-check, draft, and risk-score actions, but route high-stakes decisions to human executives for one-click cryptographic approval.'
    }
  ];

  const ARCH_LAYERS = [
    {
      layer: 1 as const,
      title: 'Layer 1: Data & Integration (The Foundation)',
      subtitle: 'API-First Connectors & Live Grounded Intelligence',
      icon: Database,
      accent: 'blue',
      description:
        'Connects the autonomous swarm to common SME business infrastructure while feeding agents with grounded, real-time international trade intelligence.',
      components: [
        {
          name: 'API-First SME Connectors',
          desc: 'Pre-built adapters for QuickBooks, Xero, Odoo, SAP Business One, HubSpot, Zoho, Shopify, and regional bank APIs.',
          badge: 'Plug-and-Play'
        },
        {
          name: 'Live Regulatory RAG Pipeline',
          desc: 'Vectorized statutory feeds continuously ingesting EU CBAM emissions databases, US EAR dual-use classifications, and international sanctions registries.',
          badge: 'Zero-Drift'
        },
        {
          name: 'Semantic Normalization Layer',
          desc: 'Transforms fragmented, messy SME operational records into standardized JSON schemas ready for agent reasoning.',
          badge: 'Clean Data'
        }
      ],
      sampleDirective:
        'Layer 1 Test: Ingest transaction records from SME ERP, vectorize latest EU CBAM regulation amendments, and normalize export data for cross-border review.'
    },
    {
      layer: 2 as const,
      title: 'Layer 2: Multi-Agent System (MAS) Design',
      subtitle: 'Specialized Collaborative Cognitive Pods',
      icon: Network,
      accent: 'orange',
      description:
        'Instead of a brittle monolithic AI, AETHERIS deploys specialized, domain-expert agents that deliberate, cross-examine, and peer-review each other.',
      components: [
        {
          name: 'Operations Agent (The Conductor)',
          desc: 'Scales routine workflows: dynamic inventory management, multimodal freight rerouting, delivery scheduling, and supplier coordination.',
          badge: 'Operations'
        },
        {
          name: 'Compliance Agent (The Sentinel)',
          desc: 'Acts as an automated in-house auditor, validating the Operations Agent’s proposed actions against regulatory databases before any execution occurs.',
          badge: 'Audit Gate'
        },
        {
          name: 'Market Intelligence Agent (The Alpha Strategist)',
          desc: 'Scans global procurement gazettes, competitor pricing, currency spreads, and commodity indices to uncover high-margin commercial opportunities.',
          badge: 'Market Alpha'
        }
      ],
      sampleDirective:
        'Layer 2 Test: Operations Agent plans multimodal cargo dispatch, Compliance Agent audits export compliance against EAR sanctions, and Market Intelligence Agent benchmarks pricing.'
    },
    {
      layer: 3 as const,
      title: 'Layer 3: Governance & Guardrails (The Trust Layer)',
      subtitle: 'OWASP Security & Human-in-the-Loop Safeguards',
      icon: ShieldCheck,
      accent: 'emerald',
      description:
        'Guarantees safety, security, and accountability across every autonomous decision, preventing runaway execution and rogue actions.',
      components: [
        {
          name: 'OWASP AI Agent Guardrails',
          desc: 'Real-time firewalls preventing prompt injection, toxic input jailbreaks, unauthorized API calls, and sensitive data leakage (PII/financial data).',
          badge: 'OWASP Top 10'
        },
        {
          name: 'Human-in-the-Loop (HITL) Protocols',
          desc: 'Tiered autonomy: Agents prepare, draft, and risk-score actions, but require explicit human executive cryptographic sign-off for financial transactions or legal filings.',
          badge: 'Executive Sign-off'
        },
        {
          name: 'Cryptographic SHA-256 Merkle Ledger',
          desc: 'Every tool execution, deliberation debate, and statutory reference is immutably hashed and recorded for audit compliance.',
          badge: 'Tamper-Proof'
        }
      ],
      sampleDirective:
        'Layer 3 Test: Verify OWASP input sanitize guardrail, execute multi-agent compliance review, and generate high-stakes HITL sign-off request with Merkle audit proof.'
    },
    {
      layer: 4 as const,
      title: 'Layer 4: Phased Rollout Strategy',
      subtitle: 'From Quick Win to Full Agentic Ecosystem',
      icon: Workflow,
      accent: 'purple',
      description:
        'A practical, low-risk adoption path for local enterprises to achieve immediate ROI without getting caught in the "Automate Everything" trap.',
      components: [
        {
          name: 'Phase 1: Quick Win (Days 1–30)',
          desc: 'Deploy a narrow, high-ROI, low-risk single agent use case (e.g., automated export document sorting, 24/7 multilingual customer inquiries, or customs classification).',
          badge: 'Phase 1: Quick Win'
        },
        {
          name: 'Phase 2: Workflow Expansion (Days 31–90)',
          desc: 'Expand to multi-step cross-functional workflows (e.g. logistics rerouting + automated compliance checks) once organizational trust and data foundations are solid.',
          badge: 'Phase 2: Expansion'
        },
        {
          name: 'Phase 3: Full Agentic Ecosystem (Days 90+)',
          desc: 'Activate cross-agent peer communication (A2A commerce), dynamic tender bidding, and end-to-end self-healing operations with supervised executive oversight.',
          badge: 'Phase 3: Full Mesh'
        }
      ],
      sampleDirective:
        'Layer 4 Test: Execute Phase 1 Quick-Win customs document audit, benchmark readiness for Phase 2 workflow expansion, and simulate Phase 3 cross-agent negotiation.'
    }
  ];

  return (
    <div className="problem-explorer-container">
      {/* Editorial Executive Hero */}
      <section className="executive-brief-hero">
        <div className="hero-meta-badge">
          <Compass size={13} className="hero-badge-icon" />
          <span>Strategic Framework &amp; 2026 Enterprise Blueprint</span>
        </div>

        <h1 className="hero-headline">
          The Scale Asymmetry: How Local Enterprises Break Multinational Moats
        </h1>

        <p className="hero-lead-text">
          In 2026, autonomous AI agents are shifting from experimental pilots to enterprise imperatives. While large corporations deploy massive bespoke models, local enterprises and SMEs use supervised multi-agent systems to scale operations without proportional headcount increases—delivering Fortune 500 capabilities at lean unit economics.
        </p>

        {/* High-Level Value Levers Banner */}
        <div className="strategic-levers-ribbon">
          <div className="lever-item">
            <span className="lever-kpi-badge orange">-78%</span>
            <div className="lever-info">
              <span className="lever-title">Overhead Drag Erased</span>
              <span className="lever-subtitle">Replaces heavy foreign office SG&amp;A</span>
            </div>
          </div>
          <div className="lever-divider" />
          <div className="lever-item">
            <span className="lever-kpi-badge blue">Zero-Drift</span>
            <div className="lever-info">
              <span className="lever-title">Statutory Governance</span>
              <span className="lever-subtitle">Continuous sub-second legal ingestion</span>
            </div>
          </div>
          <div className="lever-divider" />
          <div className="lever-item">
            <span className="lever-kpi-badge emerald">+185 bps</span>
            <div className="lever-info">
              <span className="lever-title">Competitive Alpha Spread</span>
              <span className="lever-subtitle">Pricing power unlocked via lean infrastructure</span>
            </div>
          </div>
        </div>

        {/* 6-Part Segmented Navigation */}
        <div className="modern-segmented-control">
          <button
            className={`seg-tab-btn ${activeSubTab === 'pain_points' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pain_points')}
          >
            <Scale size={15} />
            <span>1. The 5 "Ps" &amp; Asymmetry</span>
          </button>

          <button
            className={`seg-tab-btn ${activeSubTab === 'pillars' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pillars')}
          >
            <Zap size={15} />
            <span>2. Pillars &amp; A2A Alpha</span>
          </button>

          <button
            className={`seg-tab-btn highlight ${activeSubTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('architecture')}
          >
            <Workflow size={15} />
            <span>3. 4-Layer Architecture</span>
            <span className="seg-pulse-dot" />
          </button>

          <button
            className={`seg-tab-btn ${activeSubTab === 'adoption' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('adoption')}
          >
            <TrendingUp size={15} />
            <span>4. Empirical 2026 Adoption</span>
          </button>

          <button
            className={`seg-tab-btn ${activeSubTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('matrix')}
          >
            <LayersIcon size={15} />
            <span>5. Paradigm Matrix</span>
          </button>

          <button
            className={`seg-tab-btn highlight ${activeSubTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('simulator')}
          >
            <Sliders size={15} />
            <span>6. Enterprise Simulator</span>
          </button>
        </div>
      </section>

      {/* SUBTAB 1: THE 5 "Ps" & SCALE ASYMMETRY */}
      {activeSubTab === 'pain_points' && (
        <div className="tab-pane-content fade-in-up">
          {/* Main Problem Thesis */}
          <div className="premium-card">
            <div className="card-header-line">
              <div className="badge-icon-wrap orange">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="section-title">
                  The Core Friction: The 5 "Ps" Local Enterprises Face When Adopting AI
                </h2>
                <p className="section-subtitle">
                  Understanding why over 80% of enterprise AI projects fail before production is the foundation for building solutions that achieve lasting product-market fit.
                </p>
              </div>
            </div>

            {/* Interactive 5 Ps Tab Selector */}
            <div className="pain-points-selector-row">
              {PAIN_POINTS.map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = selectedPainPoint === idx;
                return (
                  <button
                    key={item.id}
                    className={`pain-point-pill ${item.accent} ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedPainPoint(idx)}
                  >
                    <IconComponent size={15} />
                    <span className="pill-title">{item.shortTag}</span>
                    <span className="pill-metric">{item.metric}</span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Active Pain Point Card */}
            {(() => {
              const currentP = PAIN_POINTS[selectedPainPoint];
              const IconComp = currentP.icon;
              return (
                <div className={`pain-point-detail-card ${currentP.accent} fade-in-up`}>
                  <div className="detail-card-header">
                    <div className="detail-badge-group">
                      <div className={`badge-icon-wrap ${currentP.accent}`}>
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h3 className="detail-headline">{currentP.title}</h3>
                        <span className="detail-metric-badge">
                          <strong>{currentP.metric}</strong> — {currentP.metricSubtitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-body-grid">
                    <div className="detail-column">
                      <span className="column-label red">THE PROBLEM STATEMENT</span>
                      <p className="column-text">{currentP.problem}</p>

                      <span className="column-label orange">ROOT CAUSE</span>
                      <p className="column-text sub">{currentP.rootCause}</p>
                    </div>

                    <div className="detail-column">
                      <span className="column-label purple">ENTERPRISE IMPACT</span>
                      <p className="column-text">{currentP.enterpriseImpact}</p>

                      <span className="column-label emerald">THE AETHERIS REMEDY</span>
                      <p className="column-text highlighted">{currentP.aetherisRemedy}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Trilemma Cards Grid */}
          <div className="premium-card">
            <h3 className="section-title-sm">The 3 Structural Dimensions of the Scale Asymmetry</h3>
            <p className="section-subtitle-sm">
              Mid-market champions ($50M to $1B revenue) produce world-class products, yet face an insurmountable barrier when attempting to compete against multinational conglomerates:
            </p>

            <div className="trilemma-cards-grid">
              <div className="trilemma-feature-card">
                <div className="feature-card-header">
                  <span className="friction-badge blue">FRICTION I</span>
                  <Zap size={18} className="icon-blue" />
                </div>
                <h3>The Operational Asymmetry</h3>
                <p>
                  Global conglomerates maintain subsidiary offices in dozens of trade capitals (London, Frankfurt, Singapore, Dubai, New York). For a local enterprise, opening overseas offices triggers runaway SG&amp;A overhead, bureaucratic coordination latency, and fragile human logistics desks that collapse during geopolitical freight chokepoints.
                </p>
                <div className="feature-stat-box blue">
                  <span className="stat-label">SG&amp;A Burden:</span>
                  <span className="stat-number">12–18% of Topline</span>
                </div>
              </div>

              <div className="trilemma-feature-card">
                <div className="feature-card-header">
                  <span className="friction-badge emerald">FRICTION II</span>
                  <ShieldCheck size={18} className="icon-emerald" />
                </div>
                <h3>The Regulatory Death Valley</h3>
                <p>
                  Cross-border trade is no longer governed by simple tariffs. It is governed by thousands of continuous statutory mandates: the <strong>EU AI Act, EU CSRD Scope-3 carbon tracing, EU CBAM, US EAR/OFAC sanctions, India FEMA ODI, and EU DORA</strong>. A single drafting error incurs fines up to 7% of revenue or customs seizures.
                </p>
                <div className="feature-stat-box emerald">
                  <span className="stat-label">Compliance Cycle:</span>
                  <span className="stat-number">4 to 8 Weeks per Deal</span>
                </div>
              </div>

              <div className="trilemma-feature-card">
                <div className="feature-card-header">
                  <span className="friction-badge orange">FRICTION III</span>
                  <Layers size={18} className="icon-orange" />
                </div>
                <h3>Entrenched Incumbent Moats</h3>
                <p>
                  Multinationals leverage institutional brand familiarity, preferred vendor vendor-lock agreements, and aggressive pricing strategies. Local champions entering tenders are relegated to low-margin tier-3 subcontractors unless they can price dynamically with instant execution speed and zero operational drag.
                </p>
                <div className="feature-stat-box orange">
                  <span className="stat-label">Margin Compression:</span>
                  <span className="stat-number">-35% vs Incumbents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Archetypes Comparison Table */}
          <div className="premium-card">
            <h3 className="section-title-sm">
              Structural Archetypes: Headcount Drag vs. Autonomous Leverage
            </h3>
            <p className="section-subtitle-sm">
              Comparing organizational overhead, speed-to-market, and statutory resilience across business tiers.
            </p>

            <div className="modern-table-container">
              <table className="modern-enterprise-table">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Unassisted Local Champion</th>
                    <th>Global Multinational Incumbent</th>
                    <th className="highlighted-header">AETHERIS Autonomous Swarm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Global Workforce Model</strong></td>
                    <td>Domestic core team; outsourced foreign agents</td>
                    <td>10,000+ staff across 40 regional offices</td>
                    <td className="highlighted-cell"><strong>5 Autonomous Agent Pods + Lean Executive Board</strong></td>
                  </tr>
                  <tr>
                    <td><strong>SG&amp;A Overhead Ratio</strong></td>
                    <td>Moderate (12–15%) but cannot scale abroad</td>
                    <td>Heavy (22–30% global administrative drag)</td>
                    <td className="highlighted-cell"><strong>Ultra-Lean (4–6% software &amp; inference cost)</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Regulatory Drift Response</strong></td>
                    <td>Quarterly manual reviews with outside law firms</td>
                    <td>Dedicated 50-person legal &amp; compliance teams</td>
                    <td className="highlighted-cell"><strong>Sub-Second Continuous Semantic Monitoring (Zero-Drift)</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Supply Chain Resilience</strong></td>
                    <td>Reactive expediting when ships are delayed</td>
                    <td>Redundant multi-warehouse holding inventory</td>
                    <td className="highlighted-cell"><strong>Self-Healing Dynamic Rerouting &amp; Instant Arbitrage</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Pricing Agility in Tenders</strong></td>
                    <td>Rigid cost-plus model; easily undercut</td>
                    <td>Bureaucratic regional pricing committees</td>
                    <td className="highlighted-cell"><strong>Real-Time Dynamic Elasticity &amp; 180+ bps Yield Moat</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Auditability &amp; Liability</strong></td>
                    <td>Scattered email chains &amp; paper signatures</td>
                    <td>Document vaults with manual auditor sampling</td>
                    <td className="highlighted-cell"><strong>Immutable SHA-256 Merkle Ledger with Ed25519 Signatures</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: THE 3 AUTONOMOUS PILLARS & A2A ALPHA */}
      {activeSubTab === 'pillars' && (
        <div className="tab-pane-content fade-in-up">
          {/* Section: 3 Pillars */}
          <div className="pillar-showcase-card">
            <div className="pillar-badge-strip orange">
              <Zap size={16} />
              <span>PILLAR 1 // OPERATIONS SCALING</span>
            </div>
            <h3 className="pillar-card-title">Autonomously Scaling Complex Global Operations</h3>
            <p className="pillar-card-desc">
              How does a 150-person precision manufacturer fulfill orders across 30 countries without hiring dozens of foreign freight coordinators? The <strong>Operations Conductor</strong> transforms linear supply chains into dynamic, self-healing cognitive networks.
            </p>

            <div className="pillar-mechanisms-grid">
              <div className="mechanism-item">
                <div className="mechanism-icon orange"><Zap size={15} /></div>
                <div>
                  <h4>Self-Healing Multimodal Logistics</h4>
                  <p>When geopolitical choke points trigger delays and insurance spikes, the agent autonomously re-solves the transport graph, routing containers via overland rail or bonded air freight before demurrage penalties kick in.</p>
                </div>
              </div>

              <div className="mechanism-item">
                <div className="mechanism-icon orange"><Zap size={15} /></div>
                <div>
                  <h4>Autonomous Supplier Arbitrage</h4>
                  <p>The swarm continuously scrapes spot commodity indexes, currency volatility feeds, and port wait-times to execute automated micro-procurement, saving an average of 14–18% on landed container costs.</p>
                </div>
              </div>

              <div className="mechanism-item">
                <div className="mechanism-icon orange"><Zap size={15} /></div>
                <div>
                  <h4>24/7 Zero-Latency Execution</h4>
                  <p>Unlike human freight desks bound by office hours and time zone gaps, the swarm operates continuously across UTC+0 to UTC+12, settling customs documents in seconds.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar-showcase-card">
            <div className="pillar-badge-strip blue">
              <ShieldCheck size={16} />
              <span>PILLAR 2 // GOVERNANCE &amp; COMPLIANCE</span>
            </div>
            <h3 className="pillar-card-title">Automating Multi-Jurisdiction Compliance &amp; Zero-Drift Governance</h3>
            <p className="pillar-card-desc">
              Global compliance is a moving target. In 2024–2026 alone, the European Union updated CBAM reporting rules, rolled out the Corporate Sustainability Due Diligence Directive (CSDDD), and implemented the EU AI Act. The <strong>Regulatory Sentinel</strong> agent eliminates human compliance lag entirely.
            </p>

            <div className="pillar-mechanisms-grid">
              <div className="mechanism-item">
                <div className="mechanism-icon blue"><ShieldCheck size={15} /></div>
                <div>
                  <h4>Zero-Day Regulatory Ingestion</h4>
                  <p>Using Google Gemini's 1M+ token context window, the agent ingests hundreds of pages of daily statutory gazettes and international trade registers, immediately calculating exposure for every active contract and bill-of-lading.</p>
                </div>
              </div>

              <div className="mechanism-item">
                <div className="mechanism-icon blue"><ShieldCheck size={15} /></div>
                <div>
                  <h4>Autonomous Clause Redrafting</h4>
                  <p>When statutory thresholds shift (e.g. embedded emissions rules or ESG definitions), the Sentinel automatically redrafts contract clauses to conform, requesting cryptographic peer consensus before filing.</p>
                </div>
              </div>

              <div className="mechanism-item">
                <div className="mechanism-icon blue"><ShieldCheck size={15} /></div>
                <div>
                  <h4>Cryptographic Merkle Audit Trails</h4>
                  <p>Every decision, statutory cross-reference, and tool call is sealed by the Cryptographic Auditor into an immutable SHA-256 Merkle tree with Ed25519 validator signatures, delivering tamper-proof evidence for government audits and bank syndication.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar-showcase-card">
            <div className="pillar-badge-strip emerald">
              <Layers size={16} />
              <span>PILLAR 3 // COMPETITIVE ALPHA</span>
            </div>
            <h3 className="pillar-card-title">Driving Competitive Differentiation &amp; Global Market Alpha</h3>
            <p className="pillar-card-desc">
              How does a mid-market enterprise win contracts against entrenched Fortune 500 giants? By turning its structural overhead advantage into pricing power and speed. The <strong>Market Alpha Strategist</strong> agent discovers and exploits market inefficiencies in real time.
            </p>

            <div className="pillar-mechanisms-grid">
              <div className="mechanism-item">
                <div className="mechanism-icon emerald"><Layers size={15} /></div>
                <div>
                  <h4>Dynamic Tender Interception</h4>
                  <p>The agent monitors public procurement gazettes and institutional tender feeds across Frankfurt, London, and Dubai. It reverse-engineers incumbent cost structures and generates aggressive, winning bids within minutes.</p>
                </div>
              </div>

              <div className="mechanism-item">
                <div className="mechanism-icon emerald"><Layers size={15} /></div>
                <div>
                  <h4>Translating 35% Cost Advantage into Spread Alpha</h4>
                  <p>Because the local enterprise carries zero bureaucratic foreign office drag, it can offer customers higher yields (e.g. +185 bps on real estate syndication) or 15–20% lower component unit prices while preserving healthy EBITDA margins.</p>
                </div>
              </div>

              <div className="mechanism-item">
                <div className="mechanism-icon emerald"><Layers size={15} /></div>
                <div>
                  <h4>Hyper-Localized Go-To-Market Precision</h4>
                  <p>Autonomous agents generate tailored, jurisdiction-specific marketing and commercial documentation in native business conventions (UK FCA vs German BaFin vs Dubai DIFC), giving a local firm the polish of a premier global institution.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: 3 Global Market Differentiators */}
          <div className="premium-card">
            <h3 className="section-title-sm">
              The 3 Next-Gen Differentiators: How Local Champions Punch Above Their Weight
            </h3>
            <p className="section-subtitle-sm">
              Autonomous agents do not merely speed up internal operations; they unlock brand new commercial surfaces that legacy multinationals cannot execute at machine speed.
            </p>

            <div className="trilemma-cards-grid">
              <div className="trilemma-feature-card">
                <div className="feature-card-header">
                  <span className="friction-badge purple">A2A ENGINE</span>
                  <Network size={18} className="icon-purple" />
                </div>
                <h3>Agentic Commerce (A2A)</h3>
                <p>
                  Agents coordinate, negotiate RFQs, verify supplier credentials, and settle transactions directly with other corporate agents across global B2B networks at machine speed—opening international supply chains without foreign sales reps.
                </p>
                <div className="feature-stat-box purple">
                  <span className="stat-label">Negotiation Latency:</span>
                  <span className="stat-number">Seconds vs. Weeks</span>
                </div>
              </div>

              <div className="trilemma-feature-card">
                <div className="feature-card-header">
                  <span className="friction-badge orange">LOCAL-TO-GLOBAL</span>
                  <Sparkles size={18} className="icon-orange" />
                </div>
                <h3>Hyper-Personalization at Scale</h3>
                <p>
                  Agents analyze local counterparty context to generate tailored commercial proposals, contract clauses, and multilingual negotiations that match the cultural and legal norms of any buyer in Tokyo, Berlin, or São Paulo.
                </p>
                <div className="feature-stat-box orange">
                  <span className="stat-label">Conversion Lift:</span>
                  <span className="stat-number">+42% Tender Win Rate</span>
                </div>
              </div>

              <div className="trilemma-feature-card">
                <div className="feature-card-header">
                  <span className="friction-badge emerald">TRUST AS AN ASSET</span>
                  <ShieldCheck size={18} className="icon-emerald" />
                </div>
                <h3>Compliance as a Competitive Feature</h3>
                <p>
                  Instead of viewing compliance as a cost center, agents turn real-time statutory adherence (GDPR, EU CBAM carbon proofing, US EAR) into a certified trust badge that outbids slow, non-compliant competitors in tier-1 enterprise tenders.
                </p>
                <div className="feature-stat-box emerald">
                  <span className="stat-label">Audit Readiness:</span>
                  <span className="stat-number">100% Instant Proof</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: THE STRATEGIC 4-LAYER ARCHITECTURE */}
      {activeSubTab === 'architecture' && (
        <div className="tab-pane-content fade-in-up">
          <div className="premium-card">
            <div className="card-header-line">
              <div className="badge-icon-wrap blue">
                <Workflow size={18} />
              </div>
              <div>
                <h2 className="section-title">
                  Strategic Blueprint: 4-Layer Architecture for Local Enterprise Agents
                </h2>
                <p className="section-subtitle">
                  A production-grade, phased blueprint moving local enterprises from fragile ad-hoc scripts to an enterprise-grade, supervised autonomous operating system.
                </p>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="arch-layer-selector-row">
              {ARCH_LAYERS.map((layerObj) => {
                const IconComp = layerObj.icon;
                const isSelected = activeArchLayer === layerObj.layer;
                return (
                  <button
                    key={layerObj.layer}
                    className={`arch-layer-pill ${layerObj.accent} ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveArchLayer(layerObj.layer)}
                  >
                    <IconComp size={15} />
                    <span className="layer-pill-step">LAYER {layerObj.layer}</span>
                    <span className="layer-pill-title">{layerObj.title.split(':')[1]?.split('(')[0] || layerObj.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Layer Deep Dive Card */}
            {(() => {
              const layer = ARCH_LAYERS.find((l) => l.layer === activeArchLayer)!;
              const LayerIcon = layer.icon;
              return (
                <div className={`arch-layer-detail-card ${layer.accent} fade-in-up`}>
                  <div className="layer-detail-header">
                    <div className="layer-header-left">
                      <div className={`badge-icon-wrap ${layer.accent}`}>
                        <LayerIcon size={22} />
                      </div>
                      <div>
                        <h3 className="layer-headline">{layer.title}</h3>
                        <p className="layer-subhead">{layer.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <p className="layer-description-lead">{layer.description}</p>

                  <div className="layer-components-grid">
                    {layer.components.map((comp, idx) => (
                      <div key={idx} className="layer-component-box">
                        <div className="comp-box-header">
                          <span className="comp-badge">{comp.badge}</span>
                        </div>
                        <h4 className="comp-name">{comp.name}</h4>
                        <p className="comp-desc">{comp.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Dispatch Layer Test to Mission Control */}
                  <div className="layer-dispatch-strip">
                    <div className="strip-info">
                      <span className="strip-label">DIRECTIVE DISPATCH READY:</span>
                      <p className="strip-text">"{layer.sampleDirective}"</p>
                    </div>
                    <button
                      className="btn-dispatch-layer"
                      onClick={() => onDispatchToMission(layer.sampleDirective)}
                    >
                      <Sparkles size={14} />
                      <span>Test in Mission Control</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Strategic Improvement Levers for Solution Builders */}
          <div className="premium-card">
            <h3 className="section-title-sm">
              The 3 Principles of "Supervised, High-ROI Autonomy"
            </h3>
            <p className="section-subtitle-sm">
              To make your solution irresistible to local enterprises, pivot from selling "full, unchecked autonomy" to selling supervised, measurable autonomy:
            </p>

            <div className="principles-cards-grid">
              <div className="principle-card">
                <div className="principle-icon-wrap blue">
                  <ShieldCheck size={20} />
                </div>
                <h4>1. Compliance-by-Design</h4>
                <p>
                  Embed regulatory validation directly into the agent’s deliberation loop. Every autonomous tool execution must generate an immutable, machine-readable cryptographic audit trail before actions can execute.
                </p>
                <div className="principle-tag">Zero Unchecked Actions</div>
              </div>

              <div className="principle-card">
                <div className="principle-icon-wrap orange">
                  <Sliders size={20} />
                </div>
                <h4>2. Low-Code / No-Code Orchestration</h4>
                <p>
                  Local enterprises do not employ AI researchers. Provide visual workflow orchestration, pre-built domain templates, and conversational directive injection so operations managers can guide agents effortlessly.
                </p>
                <div className="principle-tag">No ML Headcount Required</div>
              </div>

              <div className="principle-card">
                <div className="principle-icon-wrap emerald">
                  <Boxes size={20} />
                </div>
                <h4>3. Modular "Plug-and-Play" Architecture</h4>
                <p>
                  Allow businesses to activate one single high-value pod (e.g. Compliance Reporting Sentinel) for immediate ROI before committing to a full multi-agent cross-functional ecosystem.
                </p>
                <div className="principle-tag">Incremental Risk-Free Adoption</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: EMPIRICAL 2026 ADOPTION */}
      {activeSubTab === 'adoption' && (
        <div className="tab-pane-content fade-in-up">
          <div className="premium-card">
            <div className="card-header-line">
              <div className="badge-icon-wrap blue">
                <TrendingUp size={18} />
              </div>
              <div>
                <h2 className="section-title">
                  Empirical Reality: How Local Enterprises Actually Leverage AI Agents in 2026
                </h2>
                <p className="section-subtitle">
                  Separating market reality from hype: As of 2026, enterprise AI has moved past single-prompt chat windows and isolated coding copilots. Mid-market champions are deploying supervised multi-agent swarms as synthetic workforces.
                </p>
              </div>
            </div>

            {/* Adoption Waves Progression */}
            <div className="adoption-waves-container">
              <div className="wave-card">
                <span className="wave-time">2024 (Wave 1)</span>
                <span className="wave-stat grey">4.2% Adoption</span>
                <h4>Experimental Pilots &amp; Copilots</h4>
                <p>Isolated chatbots for document summarization. Zero autonomous execution or agency.</p>
              </div>

              <div className="wave-card">
                <span className="wave-time">2025 (Wave 2)</span>
                <span className="wave-stat blue">14.8% Adoption</span>
                <h4>Task-Specific Vertical Agents</h4>
                <p>Single agents with API hooks for customer inquiries and simple billing. Fragile on edge cases.</p>
              </div>

              <div className="wave-card active-wave">
                <span className="wave-pill-current">CURRENT STATE</span>
                <span className="wave-time">2026 (Wave 3)</span>
                <span className="wave-stat orange">29.4% Adoption</span>
                <h4>Decentralized Multi-Agent Swarms</h4>
                <p>Peer-consensus swarms coordinating cross-border routing, zero-drift compliance, and tender arbitrage.</p>
              </div>

              <div className="wave-card future-wave">
                <span className="wave-time">2027 (Wave 4 - Projected)</span>
                <span className="wave-stat emerald">56.1% Adoption</span>
                <h4>Autonomous Enterprise OS</h4>
                <p>Autonomous AI operating systems become standard infrastructure. Traditional firms priced out.</p>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="premium-card">
            <h3 className="section-title-sm">Enterprise Department Deployment Breakdown (2026 Benchmark)</h3>
            <p className="section-subtitle-sm">Survey of 1,200 mid-market international enterprises with $50M–$1B annual revenue.</p>

            <div className="dept-bars-wrapper">
              <div className="dept-bar-row">
                <div className="bar-header">
                  <span className="bar-title">Cross-Border Logistics &amp; Dynamic Routing</span>
                  <span className="bar-val orange">44% Deployed</span>
                </div>
                <div className="modern-meter-track">
                  <div className="modern-meter-fill orange" style={{ width: '44%' }} />
                </div>
                <span className="bar-desc">Multimodal dynamic rerouting, container spot arbitrage, and customs bond automation.</span>
              </div>

              <div className="dept-bar-row">
                <div className="bar-header">
                  <span className="bar-title">Statutory Compliance, CBAM &amp; Export Controls</span>
                  <span className="bar-val blue">38% Deployed</span>
                </div>
                <div className="modern-meter-track">
                  <div className="modern-meter-fill blue" style={{ width: '38%' }} />
                </div>
                <span className="bar-desc">EU AI Act compliance, CSRD Scope-3 carbon tracing, OFAC sanction checks.</span>
              </div>

              <div className="dept-bar-row">
                <div className="bar-header">
                  <span className="bar-title">Tender Surveillance &amp; Dynamic Pricing</span>
                  <span className="bar-val emerald">29% Deployed</span>
                </div>
                <div className="modern-meter-track">
                  <div className="modern-meter-fill emerald" style={{ width: '29%' }} />
                </div>
                <span className="bar-desc">Competitor bid reverse-engineering, yield spread arbitrage, localized proposal generation.</span>
              </div>

              <div className="dept-bar-row">
                <div className="bar-header">
                  <span className="bar-title">Automated Audit Trails &amp; Cryptographic Ledgers</span>
                  <span className="bar-val purple">22% Deployed</span>
                </div>
                <div className="modern-meter-track">
                  <div className="modern-meter-fill purple" style={{ width: '22%' }} />
                </div>
                <span className="bar-desc">SHA-256 Merkle block proofing, regulatory pack compaction, board certification.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: TECHNOLOGY PARADIGM MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="tab-pane-content fade-in-up">
          <div className="premium-card">
            <div className="card-header-line">
              <div className="badge-icon-wrap purple">
                <LayersIcon size={18} />
              </div>
              <div>
                <h2 className="section-title">Why Legacy Automation Fails: The Evolution to Multi-Agent Swarms</h2>
                <p className="section-subtitle">
                  Enterprises frequently confuse Autonomous Multi-Agent Systems with legacy RPA or single-agent LLM chatbots. The difference is foundational:
                </p>
              </div>
            </div>

            <div className="modern-table-container">
              <table className="modern-enterprise-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Manual Human Teams</th>
                    <th>Legacy RPA (UiPath)</th>
                    <th>Single-Agent LLM</th>
                    <th className="highlighted-header">AETHERIS Multi-Agent Swarm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Dynamic Problem Solving</strong></td>
                    <td>High (but slow &amp; expensive)</td>
                    <td><XCircle size={14} className="icon-red" /> Zero (breaks on UI/schema shift)</td>
                    <td>Moderate (single context window)</td>
                    <td className="highlighted-cell"><CheckCircle2 size={15} className="icon-emerald" /> <strong>Decentralized Goal Cognition</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Execution Latency</strong></td>
                    <td>Days to weeks</td>
                    <td>Minutes (if rigid rule applies)</td>
                    <td>Seconds (text only)</td>
                    <td className="highlighted-cell"><CheckCircle2 size={15} className="icon-emerald" /> <strong>Sub-2s Consensus &amp; Direct Tool Execution</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Cross-Border Statutory Adaptation</strong></td>
                    <td>Manual legal reviews ($500/hr)</td>
                    <td><XCircle size={14} className="icon-red" /> Requires code rewrite</td>
                    <td>Hallucination risk on statutory nuance</td>
                    <td className="highlighted-cell"><CheckCircle2 size={15} className="icon-emerald" /> <strong>Continuous 1M+ Token Legal Ingestion</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Hallucination Resistance</strong></td>
                    <td>Human fatigue (~3–5%)</td>
                    <td>Deterministic (rigid)</td>
                    <td><XCircle size={14} className="icon-red" /> High risk in unvalidated output</td>
                    <td className="highlighted-cell"><CheckCircle2 size={15} className="icon-emerald" /> <strong>5/5 Peer Consensus &amp; Auditor Verification</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Auditability &amp; Legal Proof</strong></td>
                    <td>Scattered emails, paper logs</td>
                    <td>System execution logs</td>
                    <td>Ephemeral chat logs</td>
                    <td className="highlighted-cell"><CheckCircle2 size={15} className="icon-emerald" /> <strong>Immutable SHA-256 Merkle Ledger</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Enterprise Scalability Cost</strong></td>
                    <td>Linear with headcount ($$$)</td>
                    <td>Expensive maintenance per bot</td>
                    <td>Per-token API without goal autonomy</td>
                    <td className="highlighted-cell"><CheckCircle2 size={15} className="icon-emerald" /> <strong>Scale Multiplier: 10x output at 1/5th cost</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: INTERACTIVE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="tab-pane-content fade-in-up">
          <div className="premium-card">
            <div className="card-header-line">
              <div className="badge-icon-wrap orange">
                <Sliders size={18} />
              </div>
              <div>
                <h2 className="section-title">
                  Interactive Enterprise Asymmetry &amp; Autonomous Leverage Simulator
                </h2>
                <p className="section-subtitle">
                  Model your enterprise parameters to calculate the exact operational overhead eliminated, compliance drift prevented, and velocity unlocked by deploying an autonomous multi-agent swarm:
                </p>
              </div>
            </div>

            {/* Sector Selector */}
            <div className="sim-sector-section">
              <span className="sim-field-label">Select Enterprise Industry Profile</span>
              <div className="sector-pills-row">
                <button
                  className={`modern-sector-pill ${sectorType === 'industrial' ? 'active' : ''}`}
                  onClick={() => setSectorType('industrial')}
                >
                  <Cpu size={14} />
                  <span>Precision Engineering &amp; Defense Tier-2</span>
                </button>
                <button
                  className={`modern-sector-pill ${sectorType === 'realestate' ? 'active' : ''}`}
                  onClick={() => setSectorType('realestate')}
                >
                  <Globe size={14} />
                  <span>Commercial Real Estate &amp; Infra</span>
                </button>
                <button
                  className={`modern-sector-pill ${sectorType === 'chemicals' ? 'active' : ''}`}
                  onClick={() => setSectorType('chemicals')}
                >
                  <Zap size={14} />
                  <span>Specialty Chemicals &amp; Raw Material</span>
                </button>
                <button
                  className={`modern-sector-pill ${sectorType === 'fintech' ? 'active' : ''}`}
                  onClick={() => setSectorType('fintech')}
                >
                  <Layers size={14} />
                  <span>Cross-Border FinTech &amp; Remittance</span>
                </button>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="sim-sliders-grid">
              <div className="slider-control-card">
                <div className="slider-header">
                  <span className="slider-label">Annual Enterprise Revenue</span>
                  <span className="slider-readout orange">${annualRevenue}M USD</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="modern-range-slider orange"
                />
                <div className="slider-ticks">
                  <span>$20M Mid-Market</span>
                  <span>$500M Champion</span>
                  <span>$1B Conglomerate</span>
                </div>
              </div>

              <div className="slider-control-card">
                <div className="slider-header">
                  <span className="slider-label">Target Global Corridors</span>
                  <span className="slider-readout blue">{targetCountries} Jurisdictions</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={targetCountries}
                  onChange={(e) => setTargetCountries(Number(e.target.value))}
                  className="modern-range-slider blue"
                />
                <div className="slider-ticks">
                  <span>1 Regional</span>
                  <span>4 Transcontinental</span>
                  <span>8 Global</span>
                </div>
              </div>

              <div className="slider-control-card">
                <div className="slider-header">
                  <span className="slider-label">Statutory &amp; Trade Volatility Risk</span>
                  <span className="slider-readout red capitalize">{volatilityLevel} Shock</span>
                </div>
                <div className="volatility-button-group">
                  {(['moderate', 'high', 'severe'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      className={`volatility-btn ${volatilityLevel === lvl ? 'active ' + lvl : ''}`}
                      onClick={() => setVolatilityLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Impact Dashboard */}
            <div className="sim-financial-impact-grid">
              <div className="impact-card">
                <span className="impact-label">Annual Human SG&amp;A Drag</span>
                <span className="impact-number text-red">${legacySgaCost}M</span>
                <span className="impact-caption">Cost of regional foreign offices</span>
              </div>

              <div className="impact-card">
                <span className="impact-label">Autonomous Swarm TCO</span>
                <span className="impact-number text-blue">${swarmSgaCost}M</span>
                <span className="impact-caption">Cloud inference &amp; swarm nodes</span>
              </div>

              <div className="impact-card highlight-emerald">
                <span className="impact-label">Net Capital Preserved</span>
                <span className="impact-number text-emerald">+${netSgaSavings}M / yr</span>
                <span className="impact-caption">Direct EBITDA margin accretion</span>
              </div>

              <div className="impact-card">
                <span className="impact-label">Cycle Time Compression</span>
                <span className="impact-number text-orange">{velocityGain}x Faster</span>
                <span className="impact-caption">Autonomous deal clearance</span>
              </div>

              <div className="impact-card">
                <span className="impact-label">Regulatory Risk Profile</span>
                <span className="impact-number text-blue-muted">{complianceRiskScore}</span>
                <span className="impact-caption">Auto-neutralized by Sentinel</span>
              </div>
            </div>

            {/* Action Callout & Mission Dispatch */}
            <div className="dispatch-action-card">
              <div className="action-card-text">
                <h4 className="action-title">Ready to Execute This Strategy Autonomously?</h4>
                <p className="action-desc">
                  Inject this tailored corporate scenario into the 5-Agent Mission Control to watch the Swarm deliberate, remediate statutory drift, and seal cryptographic consensus in real time.
                </p>
              </div>

              <button
                id="btn-dispatch-simulator-swarm"
                className="btn-dispatch-swarm"
                onClick={() => onDispatchToMission(getSectorPrompt())}
              >
                <Sparkles size={16} />
                <span>Dispatch Directive to Swarm</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
