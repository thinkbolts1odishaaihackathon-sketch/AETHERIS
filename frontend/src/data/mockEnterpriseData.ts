import type { Agent, EnterpriseMission, ComplianceFramework, SupplyNode, CompetitorVector } from '../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-apex',
    name: 'Apex Orchestrator',
    role: 'orchestrator',
    badge: 'COMMAND // L0',
    avatarColor: '#2563EB',
    glowColor: 'rgba(37, 99, 235, 0.4)',
    description: 'Decomposes macro corporate goals, arbitrates inter-agent conflicts, and triggers multi-agent execution graphs.',
    status: 'idle',
    currentThought: 'Standing by for strategic directive...',
    capabilities: ['Hierarchical Task Planning', 'Resource Allocation', 'Autonomous Conflict Resolution', 'Executive Synthesis'],
    tools: ['decompose_mission', 'allocate_agent_budget', 'evaluate_consensus', 'finalize_action_manifest'],
    confidence: 99.2
  },
  {
    id: 'agent-sentinel',
    name: 'Regulatory Sentinel',
    role: 'compliance',
    badge: 'GOVERNANCE // L1',
    avatarColor: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.4)',
    description: 'Continuously monitors cross-border statutes (GDPR, CSRD, EAR, FEMA, FDI, ESG), verifies contracts, and flags regulatory drift.',
    status: 'idle',
    currentThought: 'Monitoring 14 multi-jurisdictional statutory feeds...',
    capabilities: ['Cross-Border Legal Ingestion', 'Zero-Day Drift Detection', 'Automated Sanction Screening', 'Cryptographic Proof Generation'],
    tools: ['scan_jurisdiction_diff', 'verify_export_controls', 'synthesize_audit_token', 'remediate_clause_drift'],
    confidence: 99.8
  },
  {
    id: 'agent-conductor',
    name: 'Operations Conductor',
    role: 'operations',
    badge: 'EXECUTION // L1',
    avatarColor: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.4)',
    description: 'Orchestrates dynamic multi-modal supply chains, executes supplier arbitrage, and self-heals logistics bottlenecks.',
    status: 'idle',
    currentThought: 'Tracking 26 global freight corridors & port wait times...',
    capabilities: ['Multi-Modal Dynamic Routing', 'Predictive Bottleneck Bypass', 'Automated Vendor Arbitrage', 'Tariff & Carbon Optimization'],
    tools: ['reroute_freight_vector', 'simulate_supplier_bid', 'assess_carbon_cbam', 'issue_smart_procurement_order'],
    confidence: 98.7
  },
  {
    id: 'agent-alpha',
    name: 'Market Alpha Strategist',
    role: 'competitive',
    badge: 'INTELLIGENCE // L1',
    avatarColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    description: 'Tracks competitor moves in real time, computes dynamic pricing counter-moves, and crafts localized go-to-market differentiation.',
    status: 'idle',
    currentThought: 'Analyzing competitor pricing elasticity across EU & GCC...',
    capabilities: ['Real-Time Competitor Surveillance', 'Dynamic Price Optimization', 'Localized Cultural Translation', 'Tender Arbitrage Modeling'],
    tools: ['scrape_competitor_tender', 'compute_elasticity_curve', 'generate_localized_pitch', 'optimize_margin_spread'],
    confidence: 97.9
  },
  {
    id: 'agent-auditor',
    name: 'Cryptographic Auditor',
    role: 'auditor',
    badge: 'INTEGRITY // L2',
    avatarColor: '#4F46E5',
    glowColor: 'rgba(79, 70, 229, 0.4)',
    description: 'Maintains tamper-proof SHA-256 event traces for every autonomous decision, tool invocation, and regulatory clearance.',
    status: 'idle',
    currentThought: 'Audit ledger state verified: Block #849,201 sealed.',
    capabilities: ['Zero-Knowledge Audit Trail', 'SHA-256 Merkle Verification', 'Immutable Event Timestamping', 'Board Report Compaction'],
    tools: ['hash_agent_decision', 'verify_chain_integrity', 'export_regulatory_pack'],
    confidence: 100.0
  }
];

export const PRESET_MISSIONS: EnterpriseMission[] = [
  {
    id: 'mission-dlf-global',
    title: 'Global Infrastructure & Asset Syndication',
    subtitle: 'Cross-Border Real Estate & ESG Portfolio Scaling into UK & MENA Corridors',
    sector: 'Commercial Real Estate & Infrastructure Conglomerates',
    targetJurisdictions: ['India (Origin)', 'United Kingdom (UK)', 'United Arab Emirates (DIFC)'],
    objective: 'Autonomously structure a $450M cross-border syndicated commercial real estate fund for premier LEED Platinum / Net-Zero assets, ensure full UK SFDR/FCA compliance & RBI-FEMA ODI clearances, and outmaneuver regional REIT offerings by 180 bps yield advantage.',
    budgetCap: '$1.8M Autonomous Operational Budget',
    slaTarget: '< 48 Hours Automated Clearance',
    keyChallenge: 'Cross-border tax withholding, conflicting ESG taxonomies, and aggressive sovereign wealth fund counter-bids in Dubai/London.',
    impactMetrics: {
      velocityGain: '4.4x Faster syndication velocity',
      complianceScore: '100% Zero-deficiency audit rating',
      costArbitrage: '$3.4M Legal & intermediary fee savings',
      autonomousInterventions: 19
    },
    presetMessages: [
      {
        id: 'msg-1',
        agentId: 'agent-apex',
        agentName: 'Apex Orchestrator',
        role: 'orchestrator',
        timestamp: '10:42:01',
        phase: 'Directive Deconstruction & Swarm Alignment',
        thoughtChain: [
          'Deconstructing executive target: $450M Commercial Infrastructure syndication in London & Dubai.',
          'Assessing jurisdiction overlaps: India FEMA ODI limits vs UK FCA Section 21 financial promotion rules vs Dubai DIFC DFSA Fund regime.',
          'Splitting work streams: Sentinel -> Cross-Border Statutory Auditing; Conductor -> Asset Cashflow & Capital Routing; Alpha -> Yield Arbitrage vs European REITs.'
        ],
        message: 'Directive parsed. Initiating multi-jurisdictional structuring. Delegating legal taxonomy verification to Regulatory Sentinel and yield positioning to Market Alpha Strategist.',
        action: {
          tool: 'decompose_mission',
          input: '{"asset_value": 450000000, "jurisdictions": ["IN", "UK", "AE"], "target_yield": 8.4}',
          output: '3 Parallel Workstreams Spawned: Legal, Capital Routing, Market Intelligence',
          status: 'success'
        },
        consensusVote: 'approve'
      },
      {
        id: 'msg-2',
        agentId: 'agent-sentinel',
        agentName: 'Regulatory Sentinel',
        role: 'compliance',
        timestamp: '10:42:09',
        phase: 'Continuous Regulatory Drift & Sanction Screening',
        thoughtChain: [
          'Verifying compliance against UK Corporate Governance Code & EU/UK Taxonomy for Sustainable Activities.',
          'Alert detected: UK FCA recently revised ESG labeling rules (SDR - Sustainability Disclosure Requirements, effective 2024/2026).',
          'Autonomous action: Rewriting prospectus clause 14.b to qualify under "Sustainability Focus" tier rather than generic ESG claim.',
          'Checking Indian RBI Master Direction on Overseas Investment (FEMA 120): ODI limit checked against net worth (400% ceiling). Compliant.'
        ],
        message: 'Regulatory Sentinel audit complete. Detected UK FCA SDR greenwashing threshold risk in initial draft. Autonomously adjusted documentation to "Sustainability Focus" taxonomy with verifiable EPC-A carbon credentials. FEMA ODI limit clearance verified.',
        action: {
          tool: 'remediate_clause_drift',
          input: '{"statute": "UK FCA SDR 2024/2026", "clause": "14.b ESG Disclosure", "action": "Upgrade to certified Green Building Asset"}',
          output: 'Clause patched. Compliance score: 99.8%. Zero sanction hits across 18 foreign entity partners.',
          status: 'success'
        },
        cryptographicHash: '0x8f4c1e92b3a04e5781d0923f112e76aa8c29184b238f90241eab',
        consensusVote: 'approve'
      },
      {
        id: 'msg-3',
        agentId: 'agent-alpha',
        agentName: 'Market Alpha Strategist',
        role: 'competitive',
        timestamp: '10:42:18',
        phase: 'Dynamic Yield Arbitrage & Counter-Strategy',
        thoughtChain: [
          'Analyzing live commercial yields: Canary Wharf Prime Office REITs averaging 6.4% net capitalization rate.',
          'Dubai DIFC Commercial assets trading at 7.2% cap rate.',
          'Our portfolio blended asset profile delivers 8.25% unlevered IRR with pre-leased Grade-A Fortune 500 tenants.',
          'Generating localized investor memorandums emphasizing currency hedge (GBP-INR swap buffer) and sovereign credit-backed lease covenants.'
        ],
        message: 'Market Alpha analysis indicates a 185 bps yield spread over Canary Wharf incumbents. Competitor European REITs are burdened by high refinancing leverage (LTV > 52%). Our low-leverage (LTV 24%) structure creates immediate institutional differentiation for GCC sovereign wealth funds.',
        action: {
          tool: 'compute_elasticity_curve',
          input: '{"comp_yield": 6.4, "our_yield": 8.25, "ltv_delta": "-28%"}',
          output: 'High-Demand Arbitrage Confirmed. Expected institutional oversubscription: 2.3x.',
          status: 'success'
        },
        consensusVote: 'approve'
      },
      {
        id: 'msg-4',
        agentId: 'agent-conductor',
        agentName: 'Operations Conductor',
        role: 'operations',
        timestamp: '10:42:29',
        phase: 'Cross-Border Capital Routing & Settlement Architecture',
        thoughtChain: [
          'Structuring multi-tier SPV holding company in GIFT City IFSC (India) and ADGM (Abu Dhabi) for tax neutrality under DTAA treaty.',
          'Optimizing dividend repatriation withholding tax from 20% down to 5% via bilateral tax treaty route.',
          'Scheduling automated escrow milestones tied to building sensor IoT carbon emissions verification.'
        ],
        message: 'Operations Conductor finalized bilateral routing through GIFT City IFSC and ADGM conduit. Autonomous withholding tax optimization achieves $4.8M net NPV upside compared to legacy branch structures.',
        action: {
          tool: 'issue_smart_procurement_order',
          input: '{"structure": "GIFT-ADGM-UK Conduit", "treaty_article": "DTAA Art 10/11", "saving_usd": 4800000}',
          output: 'Routing validated by automated tax graph solver. Zero withholding friction.',
          status: 'success'
        },
        consensusVote: 'approve'
      },
      {
        id: 'msg-5',
        agentId: 'agent-auditor',
        agentName: 'Cryptographic Auditor',
        role: 'auditor',
        timestamp: '10:42:37',
        phase: 'Swarm Consensus & Merkle Sealing',
        thoughtChain: [
          'Hashing 4 inter-agent deliberations and 4 executed tool calls.',
          'Generating Merkle root hash for institutional board pack.',
          'Status: All 4 agents achieved unanimous consensus without human intervention.'
        ],
        message: 'Swarm consensus locked. 5/5 Agents unanimous. Cryptographic proof sealed on ledger block #849,202. Autonomous execution bundle ready for executive execution.',
        action: {
          tool: 'finalize_action_manifest',
          input: '{"mission_id": "mission-dlf-global", "consensus": "unanimous", "confidence": 99.4}',
          output: 'Proof-of-Execution Pack Generated (SHA-256: 0x93b7f14e...)',
          status: 'success'
        },
        cryptographicHash: '0x93b7f14e59c218d098e4f2105ca2374d924158e0a3c26781',
        consensusVote: 'approve'
      }
    ]
  },
  {
    id: 'mission-industrial-export',
    title: 'Advanced Industrial Manufacturing & Export Network',
    subtitle: 'Automated Dual-Use Compliance, Tariff Arbitrage & Disruption Rerouting',
    sector: 'High-Tech Engineering & Precision Manufacturing',
    targetJurisdictions: ['India (Hub)', 'United States (DoC)', 'European Union (CBAM)'],
    objective: 'Autonomously scale precision aerospace components export to North America & Germany, ensure US EAR 99 / dual-use license compliance, calculate dynamic EU Carbon Border Adjustment (CBAM) tariffs, and dynamically reroute supply chains around maritime choke points.',
    budgetCap: '$950K Autonomous Logistics Pool',
    slaTarget: '< 24 Hours Automated Routing',
    keyChallenge: 'Maritime freight spikes, sudden US Department of Commerce entity list updates, and stringent EU carbon embedded emissions paperwork.',
    impactMetrics: {
      velocityGain: '3.8x Accelerated customs clearance',
      complianceScore: '100% Zero-deficiency audit rating',
      costArbitrage: '$1.85M Landed cost reduction',
      autonomousInterventions: 24
    },
    presetMessages: [
      {
        id: 'msg-ind-1',
        agentId: 'agent-apex',
        agentName: 'Apex Orchestrator',
        role: 'orchestrator',
        timestamp: '11:15:02',
        phase: 'Export Mission Decomposition',
        thoughtChain: [
          'Parsing component consignment: 45,000 units of titanium aerospace grade precision flanges.',
          'Dual requirements: Strict EAR export licensing verification and EU CBAM Scope 3 calculation.',
          'Assigning Sentinel to US BIS / EU customs registry and Conductor to dynamic container routing.'
        ],
        message: 'Export orchestration active. 45,000 unit batch flagged for multi-modal dispatch. Initiating simultaneous statutory export screening and freight cost arbitrage.',
        action: {
          tool: 'decompose_mission',
          input: '{"commodity": "Titanium Flanges", "eccn": "EAR99", "volume_mt": 120}',
          output: 'Dispatched to Sentinel and Conductor',
          status: 'success'
        },
        consensusVote: 'approve'
      },
      {
        id: 'msg-ind-2',
        agentId: 'agent-sentinel',
        agentName: 'Regulatory Sentinel',
        role: 'compliance',
        timestamp: '11:15:10',
        phase: 'Autonomous Dual-Use & Sanction Verification',
        thoughtChain: [
          'Checking ECCN 9A991 classification vs Commerce Control List (CCL).',
          'Entity check: Scanning 4 foreign consignees in Munich and Texas against OFAC SDN and Consolidated Screening List (CSL).',
          'Calculating EU CBAM: Embedded carbon 1.82 tCO2e/tonne steel/titanium. Generating accredited emissions declaration under EU Regulation 2023/956.'
        ],
        message: 'Regulatory Sentinel cleared export classification under NLR (No License Required) for US delivery. EU CBAM compliance certificate generated autonomously with verified green-hydrogen smelting audit trail.',
        action: {
          tool: 'verify_export_controls',
          input: '{"eccn": "9A991", "csl_matches": 0, "cbam_tax_eur": 0}',
          output: 'Customs Pre-Clearance Green Token Issued',
          status: 'success'
        },
        cryptographicHash: '0x17c2a938f4d0b162489e812f913d87e0294158e0a3c26781',
        consensusVote: 'approve'
      },
      {
        id: 'msg-ind-3',
        agentId: 'agent-conductor',
        agentName: 'Operations Conductor',
        role: 'operations',
        timestamp: '11:15:22',
        phase: 'Predictive Choke Point Detection & Autonomous Rerouting',
        thoughtChain: [
          'Telemetry alert: Red Sea transit delay estimated at +14 days with 240% insurance risk surcharge.',
          'Alternative route computation: Rail freight via INSTC corridor vs Maritime via Cape of Good Hope vs Air Freight for critical batches.',
          'Cost-Benefit Optimization: Splitting shipment—10% emergency volume via scheduled Air Cargo to Hamburg (avoids assembly line shutdown penalties), 90% via Cape maritime with pre-negotiated volume discount.'
        ],
        message: 'Operations Conductor detected maritime choke point. Autonomously split shipment into high-priority air corridor (10%) and hedged maritime lane (90%), protecting customer SLA while cutting total landed delay by 11 days.',
        action: {
          tool: 'reroute_freight_vector',
          input: '{"choke_point": "Red Sea/Suez", "solution": "Hybrid Air/Maritime Split", "sla_saved_hours": 264}',
          output: 'Carrier booking confirmed autonomously. Zero line-stop penalties.',
          status: 'success'
        },
        consensusVote: 'approve'
      },
      {
        id: 'msg-ind-4',
        agentId: 'agent-alpha',
        agentName: 'Market Alpha Strategist',
        role: 'competitive',
        timestamp: '11:15:33',
        phase: 'Competitor Delivery Failure Arbitrage',
        thoughtChain: [
          'German rival Tier-1 supplier announced force majeure on delivery due to logistics disruption.',
          'Our autonomous reroute delivers components 9 days ahead of industry benchmark.',
          'Executing dynamic marketing trigger: Notifying 3 additional European aerospace primes of immediate available capacity with guaranteed delivery SLA.'
        ],
        message: 'Market Alpha intercepted competitor supply disruption. Turned operational resilience into competitive weapon by locking 2 new long-term supply contracts with 14% margin premium.',
        action: {
          tool: 'optimize_margin_spread',
          input: '{"competitor_status": "Force Majeure", "our_sla_lead_days": 9, "margin_delta": "+14%"}',
          output: '2 New Tier-1 Aerospace Contracts Signed',
          status: 'success'
        },
        consensusVote: 'approve'
      }
    ]
  },
  {
    id: 'mission-saas-fintech',
    title: 'Enterprise AI & Cross-Border Sovereign Data Expansion',
    subtitle: 'Autonomous Compliance with EU AI Act, GDPR Adequacy & Dynamic Global Pricing',
    sector: 'Global Technology, FinTech & Enterprise Software',
    targetJurisdictions: ['India (HQ)', 'European Union (Brussels)', 'United States (Silicon Valley)'],
    objective: 'Autonomously deploy enterprise sovereign AI services across 12 EU enterprise clients, ensure compliance with EU AI Act High-Risk classification and GDPR Chapter V cross-border transfer rules, while outpricing US SaaS incumbents by 40% using optimized compute arbitrage.',
    budgetCap: '$400K Infrastructure Budget',
    slaTarget: '< 4 Hours Automated SLA',
    keyChallenge: 'Stringent EU AI Act transparency rules, GDPR cross-border data transfer audits, and entrenched legacy SaaS incumbents.',
    impactMetrics: {
      velocityGain: '5.1x Faster cross-border client onboarding',
      complianceScore: '100% Zero-deficiency audit rating',
      costArbitrage: '$920K Compute & legal compliance savings',
      autonomousInterventions: 31
    },
    presetMessages: [
      {
        id: 'msg-saas-1',
        agentId: 'agent-apex',
        agentName: 'Apex Orchestrator',
        role: 'orchestrator',
        timestamp: '09:00:15',
        phase: 'Global SaaS Onboarding Orchestration',
        thoughtChain: [
          'Deconstructing enterprise directive: Deploying enterprise AI engine into German banking clients.',
          'Mandate: Zero data leakage out of Frankfurt cloud region, full compliance with EU AI Act Annex IV technical documentation.'
        ],
        message: 'Initiating sovereign deployment swarm. Directing Sentinel to audit data pipeline against EU AI Act & BaFin banking compliance.',
        action: {
          tool: 'decompose_mission',
          input: '{"client_sector": "German Banking", "standard": "EU AI Act + BaFin DORA"}',
          output: 'Swarm activated for Tier-1 FinTech deployment',
          status: 'success'
        },
        consensusVote: 'approve'
      },
      {
        id: 'msg-saas-2',
        agentId: 'agent-sentinel',
        agentName: 'Regulatory Sentinel',
        role: 'compliance',
        timestamp: '09:00:24',
        phase: 'Autonomous EU AI Act & DORA Compliance Verification',
        thoughtChain: [
          'Evaluating AI system risk tier: Classified as High-Risk under Annex III (Credit scoring / Risk modeling).',
          'Auto-generating conformity assessment documentation, human-in-the-loop audit logs, and bias test certificates.',
          'Verifying GDPR Article 46 Standard Contractual Clauses (SCCs) with supplementary cryptographic measures.'
        ],
        message: 'Compliance Sentinel completed autonomous EU AI Act technical dossier and DORA ICT risk assessment. Deployed automated differential privacy verification on client datasets.',
        action: {
          tool: 'remediate_clause_drift',
          input: '{"framework": "EU AI Act + DORA", "conformity_pack": "Generated Annex IV"}',
          output: 'Bafin-ready conformity package issued in 42 seconds.',
          status: 'success'
        },
        cryptographicHash: '0x44a1b892e319c08726f1802951739ea094158e0a3c26781',
        consensusVote: 'approve'
      },
      {
        id: 'msg-saas-3',
        agentId: 'agent-alpha',
        agentName: 'Market Alpha Strategist',
        role: 'competitive',
        timestamp: '09:00:35',
        phase: 'Dynamic Compute Arbitrage & Pricing Disruption',
        thoughtChain: [
          'Incumbent US Enterprise AI vendors charge $120/seat/month with mandatory $250k professional services implementation.',
          'Our autonomous platform deploys in minutes with fractional compute costs via decentralized inference clusters.',
          'Setting dynamic subscription model at $48/seat with zero setup fee—capturing 78% immediate market preference.'
        ],
        message: 'Market Alpha deployed pricing arbitrage. Undercutting US incumbents by 60% while sustaining 82% gross margins due to autonomous operational zero-overhead architecture.',
        action: {
          tool: 'compute_elasticity_curve',
          input: '{"incumbent_seat_price": 120, "our_seat_price": 48, "gross_margin": "82%"}',
          output: 'Conversion probability raised from 32% to 89%.',
          status: 'success'
        },
        consensusVote: 'approve'
      }
    ]
  }
];

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'cf-eu-csrd',
    jurisdiction: 'EU',
    frameworkName: 'EU CSRD / Corporate Sustainability Due Diligence',
    statuteReference: 'Directive (EU) 2022/2464 / ESRS E1-E5',
    riskCategory: 'ESG & Sustainability',
    status: 'verified',
    complianceScore: 99.4,
    autonomousAction: 'Real-time Scope 1-3 carbon tracking mapped to suppliers across 4 tiers.',
    auditHash: '0x3f9e8a71...4b2c',
    lastChecked: '4 mins ago',
    details: 'Autonomous agent cross-checks vendor greenhouse gas emissions against ISO 14064 standards and auto-populates XBRL digital taxonomy.'
  },
  {
    id: 'cf-eu-gdpr-ai',
    jurisdiction: 'EU',
    frameworkName: 'EU AI Act & GDPR Chapter V Data Transfer',
    statuteReference: 'Regulation (EU) 2024/1689 & GDPR Art 44-50',
    riskCategory: 'Privacy & AI',
    status: 'verified',
    complianceScore: 100.0,
    autonomousAction: 'Automated conformity technical documentation (Annex IV) synthesized with model provenance.',
    auditHash: '0x8b12c409...19ea',
    lastChecked: '2 mins ago',
    details: 'Zero-drift sentinel prevents unauthorized cross-border personal data replication and enforces local enclave inference.'
  },
  {
    id: 'cf-us-ear',
    jurisdiction: 'US',
    frameworkName: 'US Export Administration Regulations (EAR) / BIS',
    statuteReference: '15 CFR Parts 730-774 & CCL Categories 3-9',
    riskCategory: 'Trade & Export',
    status: 'verified',
    complianceScore: 98.9,
    autonomousAction: 'Daily screening of Consolidated Screening List (CSL) across all tier-2 consignees.',
    auditHash: '0x7e221f58...62a0',
    lastChecked: '7 mins ago',
    details: 'Autonomous agent matches ECCN codes against foreign destination regimes and auto-submits SNAP-R electronic clearances.'
  },
  {
    id: 'cf-in-fema',
    jurisdiction: 'INDIA',
    frameworkName: 'RBI Foreign Exchange Management Act (FEMA 120)',
    statuteReference: 'FEMA (Overseas Investment) Regulations, 2022',
    riskCategory: 'FDI & Corporate',
    status: 'verified',
    complianceScore: 99.7,
    autonomousAction: 'Automated ODI financial commitment ceiling monitoring against net worth.',
    auditHash: '0x99a45b12...ef88',
    lastChecked: '12 mins ago',
    details: 'Sentinel tracks cumulative remittance limits through Authorized Dealer (AD) Category-I banks, ensuring zero compliance delay for overseas expansion.'
  },
  {
    id: 'cf-mena-fdi',
    jurisdiction: 'MENA',
    frameworkName: 'UAE DIFC / ADGM Common Law Foreign Investment',
    statuteReference: 'DIFC Law No. 3 of 2018 (Companies Law) & DFSA Rules',
    riskCategory: 'FDI & Corporate',
    status: 'verified',
    complianceScore: 100.0,
    autonomousAction: 'Automated SPV incorporation structuring with zero withholding leakage.',
    auditHash: '0x15e982d4...33cb',
    lastChecked: '15 mins ago',
    details: 'Autonomous tax graph model configures bilateral DTAA conduits between India, UAE, and European investment pools.'
  },
  {
    id: 'cf-global-cbam',
    jurisdiction: 'EU',
    frameworkName: 'EU Carbon Border Adjustment Mechanism (CBAM)',
    statuteReference: 'Regulation (EU) 2023/956 on Import Emissions',
    riskCategory: 'Tax & Tariffs',
    status: 'action_required',
    complianceScore: 94.2,
    autonomousAction: 'Drift detected in supplier carbon audit certificate. Remediating with green power offset.',
    auditHash: '0xd311c87a...90ff',
    lastChecked: 'Just now',
    details: 'CBAM quarterly declaration pending for batch #9842. Conductor agent has triggered alternative green-certified vendor arbitrage.'
  }
];

export const SUPPLY_NODES: SupplyNode[] = [
  {
    id: 'route-1',
    routeTitle: 'Corridor Alpha: India Hub -> Rotterdam / Hamburg',
    origin: 'Nhava Sheva (IN)',
    destination: 'Rotterdam (NL)',
    status: 'rerouted_autonomous',
    transitMode: 'Multimodal Rail',
    leadTimeDays: 19,
    costVariancePercent: -12.4,
    co2Score: 'A (Low Carbon Rail)',
    anomaly: 'Red Sea maritime transit delay & 220% war-risk insurance surcharge.',
    autonomousRemediation: 'Autonomous switch to INSTC overland container rail with pre-cleared customs token. 14 days saved.'
  },
  {
    id: 'route-2',
    routeTitle: 'Corridor Beta: Delhi Industrial Corridor -> Dubai JAFZA',
    origin: 'NCR Gurgaon (IN)',
    destination: 'Jebel Ali / Dubai (UAE)',
    status: 'active',
    transitMode: 'Maritime',
    leadTimeDays: 4,
    costVariancePercent: -18.2,
    co2Score: 'A+ (Short Sea Shipping)',
    autonomousRemediation: 'Optimal bilateral CEPA corridor. Zero tariffs under India-UAE Comprehensive Economic Partnership.'
  },
  {
    id: 'route-3',
    routeTitle: 'Corridor Gamma: Mumbai Tech Hub -> Frankfurt Cloud Enclave',
    origin: 'Mumbai (IN)',
    destination: 'Frankfurt (DE)',
    status: 'active',
    transitMode: 'Air Cargo',
    leadTimeDays: 2,
    costVariancePercent: -8.5,
    co2Score: 'B (High Velocity Air)',
    autonomousRemediation: 'High-priority critical components and cryptographic hardware security modules (HSM).'
  },
  {
    id: 'route-4',
    routeTitle: 'Corridor Delta: Gujarat Coastal Hub -> US East Coast (New York)',
    origin: 'Mundra Port (IN)',
    destination: 'Newark / NY (US)',
    status: 'active',
    transitMode: 'Maritime',
    leadTimeDays: 22,
    costVariancePercent: -15.0,
    co2Score: 'B+ (Ultra Large Container Vessel)',
    autonomousRemediation: 'Direct trans-Atlantic routing with automated US Customs 24-Hour Advance Manifest rule clearance.'
  }
];

export const COMPETITOR_VECTORS: CompetitorVector[] = [
  {
    id: 'comp-1',
    competitorName: 'Vanguard Global Real Estate REIT (US/UK)',
    tier: 'Global Tier 1',
    market: 'Commercial Real Estate Syndication (UK & Europe)',
    recentManeuver: 'Raised management fee to 1.75% while refinancing $1.2B debt at high interest rates (LTV 54%).',
    threatLevel: 'Medium',
    detectedPrice: '5.8% Net Yield Distribution',
    ourOptimizedPrice: '8.25% Net Yield with ESG Premium',
    autonomousCounterStrategy: 'Autonomous agent launched GCC targeted campaign showcasing 245 bps higher yield with unleveraged asset security.',
    marketShareShielded: '$120M Inbound Capital Secured'
  },
  {
    id: 'comp-2',
    competitorName: 'Continental Precision Dynamics (Germany)',
    tier: 'Regional Incumbent',
    market: 'European Industrial Precision Components',
    recentManeuver: 'Announced 6-week supply delay due to localized energy costs and raw material bottlenecks.',
    threatLevel: 'High',
    detectedPrice: '€410 / component unit',
    ourOptimizedPrice: '€345 / unit with guaranteed 10-day delivery SLA',
    autonomousCounterStrategy: 'Conductor agent pre-allocated green-aluminum inventory, undercutting pricing by 16% with zero delivery disruption.',
    marketShareShielded: '18 Enterprise Supply Contracts Captured'
  },
  {
    id: 'comp-3',
    competitorName: 'Apex Enterprise Cloud Services (Silicon Valley)',
    tier: 'Global Tier 1',
    market: 'Global FinTech AI Infrastructure',
    recentManeuver: 'Imposed proprietary vendor lock-in and mandatory $250k onboarding consultancy fee.',
    threatLevel: 'Low',
    detectedPrice: '$120 / user / month + Heavy Services',
    ourOptimizedPrice: '$48 / user / month (Zero Onboarding Friction)',
    autonomousCounterStrategy: 'Sovereign data deployment swarm enables instant 1-click on-premise enclaves, displacing incumbent in 3 European banks.',
    marketShareShielded: '€2.4M ARR Displaced'
  }
];
