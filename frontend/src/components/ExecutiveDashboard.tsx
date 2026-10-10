import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  PackageCheck,
  Layers,
  Play,
  Activity,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ActionGateBanner } from './ActionGateBanner';
import type { OperationalInventoryState, Agent } from '../types';

interface ExecutiveDashboardProps {
  onNavigateToTab: (tabId: string) => void;
  agents: Agent[];
  onOpenInspector?: (content: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onNavigateToTab,
  agents: _agents,
  onOpenInspector
}) => {
  const { user } = useAuth();
  const [inventoryState, setInventoryState] = useState<OperationalInventoryState | null>(null);
  const [latestRunStatus, setLatestRunStatus] = useState<string>('Ready');
  const [actionGateStatus, setActionGateStatus] = useState<'PENDING_APPROVAL' | 'APPROVED' | 'DISMISSED'>('PENDING_APPROVAL');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.getInventoryStatus();
        if (res.success && res.inventory) {
          setInventoryState({
            orders: res.orders || [],
            inventory: res.inventory,
            suppliers: res.suppliers || [],
            purchaseOrders: res.purchaseOrders || []
          });
        }
        const runs = await api.getRuns();
        if (runs.success && runs.runs.length > 0) {
          setLatestRunStatus(runs.runs[0].status);
        }
      } catch (e) {
        console.warn('Dashboard fetch notice', e);
      }
    };
    fetchStatus();
  }, []);

  const primaryOrder = inventoryState?.orders?.find((o) => o.id === 'ord-2026-500');

  const handleApprovePO = () => {
    setActionGateStatus('APPROVED');
  };

  return (
    <div className="executive-dashboard-container page-enter">
      {/* ===================== DECISION-FIRST HERO (5-SECOND OPERATIONAL RULE) ===================== */}
      <section className="dashboard-hero-decision-card glass-panel glass-sheen border-beam-card" aria-label="Operational Status Hero">
        <div className="hero-decision-top anim-fade-in-up delay-0">
          <div className="hero-badge-cluster">
            <span className="hero-status-pill font-mono">
              <span className="live-pulse-dot" />
              L0 APEX ORCHESTRATION ACTIVE
            </span>
            <span className="hero-workspace-pill font-mono">
              MUNICH-PLANT-01
            </span>
          </div>

          <div className="hero-user-meta">
            <span>Operating as <strong>{user?.name || 'Executive Director'}</strong></span>
            <span className="user-role-badge font-mono">{user?.role?.toUpperCase() || 'EXECUTIVE'}</span>
          </div>
        </div>

        {/* 3-Part Operational Triad: What is happening? Why does it matter? What action is required next? */}
        <div className="operational-triad-grid stagger-children">
          {/* Card 1: What is happening? */}
          <div className="triad-card hover-lift glass-sheen">
            <div className="triad-card-label">
              <span className="triad-step-num font-mono">01</span>
              <span>WHAT IS HAPPENING?</span>
            </div>
            <h4 className="triad-headline">
              Airbus Titanium Flange Shortage Detected
            </h4>
            <p className="triad-body">
              Order ORD-2026-500 requests 500 TF-700 units; Munich on-hand inventory is 300 units. Immediate 200-unit operational deficit identified.
            </p>
          </div>

          {/* Card 2: Why does it matter? */}
          <div className="triad-card hover-lift glass-sheen">
            <div className="triad-card-label">
              <span className="triad-step-num font-mono">02</span>
              <span>WHY DOES IT MATTER?</span>
            </div>
            <h4 className="triad-headline">
              $1.2M Contract Penalty &amp; Demurrage At Risk
            </h4>
            <p className="triad-body">
              Late delivery breaches SLA within 72 hours. Automated vendor arbitrage selected Bavaria Precision Metallics ($10,800.00 / 3 days delivery).
            </p>
          </div>

          {/* Card 3: What action is required next? */}
          <div className="triad-card highlight hover-lift glass-sheen">
            <div className="triad-card-label">
              <span className="triad-step-num font-mono">03</span>
              <span>WHAT ACTION IS REQUIRED NEXT?</span>
            </div>
            <h4 className="triad-headline">
              Action Gate: Human Dual-Signoff &gt; $5,000
            </h4>
            <p className="triad-body">
              Autonomous safety barrier paused execution. Executive Director authorization required to issue $10,800 PO and seal cryptographic Merkle block.
            </p>
          </div>
        </div>

        {/* Hero Quick Controls */}
        <div className="hero-action-footer">
          <div className="hero-stats-quick">
            <span className="stat-pill font-mono tabular-nums">
              <Activity size={12} className="cyan" /> Latency: 24ms
            </span>
            <span className="stat-pill font-mono tabular-nums">
              <ShieldCheck size={12} className="emerald" /> Zero-Drift: 99.7%
            </span>
            <span className="stat-pill font-mono tabular-nums">
              <Sparkles size={12} className="amber" /> Arbitrage: +$3.4M
            </span>
          </div>

          <div className="hero-button-group">
            <button
              id="btn-hero-launch-swarm"
              className="btn-hero-primary"
              onClick={() => onNavigateToTab('mission')}
            >
              <Play size={15} fill="currentColor" />
              <span>Launch Live Swarm Mission</span>
              <ArrowRight size={14} />
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => onNavigateToTab('operations')}
            >
              <Zap size={14} className="amber" />
              <span>Inspect Corridors</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== ACTION GATE BANNER (HIGH-PRIORITY APPROVAL) ===================== */}
      <ActionGateBanner
        thresholdAmount={5000}
        currentAmount={10800}
        poNumber="PO-2026-8821"
        vendorName="Bavaria Precision Metallics GmbH"
        itemDescription="200x TF-700 High-Grade Titanium Flanges for Airbus Defense & Space"
        requiresDirectorSignoff={true}
        status={actionGateStatus}
        onApprove={handleApprovePO}
        onInspectDetails={() => {
          if (onOpenInspector) {
            onOpenInspector({ type: 'merkle' });
          }
        }}
      />

      {/* ===================== HIGH-DENSITY KPI SPARKLINES GRID ===================== */}
      <div className="kpi-sparkline-grid kpi-card-grid">
        {/* KPI 1: Active Swarm Agents */}
        <div
          className="kpi-stat-card glass-panel interactive-glow glass-sheen hover-lift"
          onClick={() => onNavigateToTab('mission')}
        >
          <div className="kpi-top-row">
            <span className="kpi-label">AUTONOMOUS SWARM</span>
            <div className="kpi-icon-box blue">
              <Cpu size={16} />
            </div>
          </div>
          <div className="kpi-main-val font-mono tabular-nums">
            5 / 5 <span className="kpi-badge emerald">Online</span>
          </div>
          <div className="kpi-sparkline-box">
            {/* Sparkline SVG */}
            <svg className="sparkline-svg" viewBox="0 0 120 28">
              <path
                className="sparkline-path"
                d="M 0 20 L 20 18 L 40 12 L 60 14 L 80 8 L 100 10 L 120 4"
                fill="none"
                stroke="var(--accent-blue)"
                strokeWidth="2"
              />
            </svg>
            <span className="sparkline-label font-mono tabular-nums">100% Mesh Health</span>
          </div>
          <div className="kpi-footer-sub">
            L0 Apex, Conductor, Sentinel, Alpha, Auditor
          </div>
        </div>

        {/* KPI 2: Order Fulfillment */}
        <div
          className="kpi-stat-card glass-panel interactive-glow glass-sheen hover-lift"
          onClick={() => onNavigateToTab('operations')}
        >
          <div className="kpi-top-row">
            <span className="kpi-label">AIRBUS FULFILLMENT</span>
            <div className="kpi-icon-box amber">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="kpi-main-val font-mono tabular-nums">
            {primaryOrder?.status === 'fulfilled' ? '500 / 500' : '300 / 500'}
            <span className={`kpi-badge ${primaryOrder?.status === 'fulfilled' ? 'emerald' : 'amber'}`}>
              {primaryOrder?.status === 'fulfilled' ? 'Dispatched' : 'Shortage Mitigated'}
            </span>
          </div>
          <div className="kpi-sparkline-box">
            <svg className="sparkline-svg" viewBox="0 0 120 28">
              <path
                className="sparkline-path"
                d="M 0 24 L 25 22 L 50 18 L 75 14 L 100 8 L 120 4"
                fill="none"
                stroke="var(--accent-amber)"
                strokeWidth="2"
              />
            </svg>
            <span className="sparkline-label font-mono tabular-nums">+200 Inbound</span>
          </div>
          <div className="kpi-footer-sub">
            TF-700 Flanges (ORD-2026-500)
          </div>
        </div>

        {/* KPI 3: Statutory Compliance */}
        <div
          className="kpi-stat-card glass-panel interactive-glow glass-sheen hover-lift"
          onClick={() => {
            if (onOpenInspector) {
              onOpenInspector({ type: 'compliance' });
            } else {
              onNavigateToTab('compliance');
            }
          }}
        >
          <div className="kpi-top-row">
            <span className="kpi-label">STATUTORY COMPLIANCE</span>
            <div className="kpi-icon-box emerald">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="kpi-main-val font-mono tabular-nums">
            99.7% <span className="kpi-badge emerald">Zero-Drift</span>
          </div>
          <div className="kpi-sparkline-box">
            <svg className="sparkline-svg" viewBox="0 0 120 28">
              <path
                className="sparkline-path"
                d="M 0 10 L 20 8 L 40 10 L 60 6 L 80 8 L 100 4 L 120 4"
                fill="none"
                stroke="var(--accent-emerald)"
                strokeWidth="2"
              />
            </svg>
            <span className="sparkline-label font-mono tabular-nums">4 Corridors Cleared</span>
          </div>
          <div className="kpi-footer-sub">
            EAR99 Verified • EU CBAM Offset • LkSG
          </div>
        </div>

        {/* KPI 4: Arbitrage Savings */}
        <div
          className="kpi-stat-card glass-panel interactive-glow glass-sheen hover-lift"
          onClick={() => onNavigateToTab('competitive')}
        >
          <div className="kpi-top-row">
            <span className="kpi-label">ARBITRAGE CAPITAL SAVED</span>
            <div className="kpi-icon-box cyan">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="kpi-main-val font-mono tabular-nums">
            $3.4M <span className="kpi-badge cyan">YTD</span>
          </div>
          <div className="kpi-sparkline-box">
            <svg className="sparkline-svg" viewBox="0 0 120 28">
              <path
                className="sparkline-path"
                d="M 0 26 L 20 22 L 40 18 L 60 14 L 80 8 L 100 6 L 120 2"
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="2"
              />
            </svg>
            <span className="sparkline-label font-mono tabular-nums">+18.4% MoM</span>
          </div>
          <div className="kpi-footer-sub">
            Demurrage Bypass &amp; Dynamic Supplier Bids
          </div>
        </div>
      </div>

      {/* ===================== WORKSPACE DATA GRID & QUICK ACTION STAGE ===================== */}
      <div className="dashboard-grid-split">
        {/* Left: Actionable Operational Execution Pipeline */}
        <div className="pipeline-card glass-panel">
          <div className="pipeline-header">
            <div>
              <h3 className="pipeline-title">Autonomous Execution Pipeline &amp; Audit Trail</h3>
              <p className="pipeline-subtitle font-mono">
                Mission Execution ORD-2026-500 // Airbus Defense High-Grade Alloy Shortage
              </p>
            </div>
            <button
              className="btn-quick-inspect"
              onClick={() => {
                if (onOpenInspector) {
                  onOpenInspector({ type: 'merkle' });
                }
              }}
              title="Side-by-side inspect Merkle ledger"
            >
              <span>Inspect DAG Proof</span>
              <ExternalLink size={13} />
            </button>
          </div>

          <div className="pipeline-stages-list">
            {/* Step 1 */}
            <div className="pipeline-step-item completed">
              <div className="step-badge font-mono">01</div>
              <div className="step-info">
                <div className="step-title-line">
                  <span className="step-name">Deficit Identification &amp; Swarm Deliberation</span>
                  <span className="step-time font-mono tabular-nums">T+0.04s</span>
                </div>
                <p className="step-desc">
                  Apex Orchestrator identified 200-unit physical deficit on Airbus contract ORD-2026-500. Formulated task manifest across 4 L1 specialist agents.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="pipeline-step-item completed">
              <div className="step-badge font-mono">02</div>
              <div className="step-info">
                <div className="step-title-line">
                  <span className="step-name">Multi-Vendor Arbitrage &amp; EAR99 Pre-Clearance</span>
                  <span className="step-time font-mono tabular-nums">T+0.12s</span>
                </div>
                <p className="step-desc">
                  Selected <strong>Bavaria Precision Metallics</strong> ($10,800.00 @ 3 days). Compliance Sentinel affirmed EAR99 commercial certification &amp; CBAM carbon footprint offset.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`pipeline-step-item ${actionGateStatus === 'APPROVED' ? 'completed' : 'active'}`}>
              <div className={`step-badge font-mono ${actionGateStatus === 'APPROVED' ? '' : 'amber'}`}>03</div>
              <div className="step-info">
                <div className="step-title-line">
                  <span className="step-name">Human-in-the-Loop Approval Gate ($5,000 Threshold)</span>
                  <span className={`step-time font-mono ${actionGateStatus === 'APPROVED' ? 'emerald' : 'amber'}`}>
                    {actionGateStatus === 'APPROVED' ? 'AUTHORIZED' : 'AWAITING SIGN-OFF'}
                  </span>
                </div>
                <p className="step-desc">
                  Procurement value ($10,800) exceeds autonomous spending threshold. Dual-key cryptographic approval gate activated for Director signature.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`pipeline-step-item ${actionGateStatus === 'APPROVED' ? 'completed' : 'pending'}`}>
              <div className="step-badge font-mono">04</div>
              <div className="step-info">
                <div className="step-title-line">
                  <span className="step-name">Goods Receipt Notice (GRN) &amp; Ed25519 Merkle Seal</span>
                  <span className="step-time font-mono tabular-nums">
                    {actionGateStatus === 'APPROVED' ? 'SEALED' : 'PENDING'}
                  </span>
                </div>
                <p className="step-desc">
                  Warehouse stock increments from 300 to 500 units. Cryptographic Auditor commits block #849,202 to the immutable SHA-256 binary tree.
                </p>
              </div>
            </div>
          </div>

          <div className="pipeline-footer-row">
            <span className="pipeline-run-status font-mono">
              STATUS: <strong className={actionGateStatus === 'APPROVED' ? 'text-emerald' : 'text-amber'}>{latestRunStatus.toUpperCase()}</strong>
            </span>
            <button
              className="btn-launch-cockpit"
              onClick={() => onNavigateToTab('mission')}
            >
              <span>Open Swarm Mission Cockpit</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Quick Command Corridors & System Links */}
        <div className="dashboard-side-column">
          {/* Quick Navigator Card */}
          <div className="side-nav-card glass-panel">
            <h4 className="side-card-title">Direct Workspace Links</h4>
            <div className="side-action-buttons">
              <button
                className="side-nav-btn"
                onClick={() => onNavigateToTab('mission')}
              >
                <div className="btn-icon-title">
                  <Cpu size={16} className="blue" />
                  <div className="btn-text-block">
                    <span className="btn-title">Swarm Mission Control</span>
                    <span className="btn-sub">Run multi-agent disruption scenarios</span>
                  </div>
                </div>
                <ChevronRight size={15} className="arrow-icon" />
              </button>

              <button
                className="side-nav-btn"
                onClick={() => {
                  if (onOpenInspector) {
                    onOpenInspector({ type: 'compliance' });
                  } else {
                    onNavigateToTab('compliance');
                  }
                }}
              >
                <div className="btn-icon-title">
                  <ShieldCheck size={16} className="emerald" />
                  <div className="btn-text-block">
                    <span className="btn-title">Compliance Sentinel</span>
                    <span className="btn-sub">EU AI Act, CSRD &amp; EAR99 radar</span>
                  </div>
                </div>
                <ChevronRight size={15} className="arrow-icon" />
              </button>

              <button
                className="side-nav-btn"
                onClick={() => onNavigateToTab('operations')}
              >
                <div className="btn-icon-title">
                  <Zap size={16} className="amber" />
                  <div className="btn-text-block">
                    <span className="btn-title">Operations Conductor</span>
                    <span className="btn-sub">Warehouse stocks &amp; freight rerouting</span>
                  </div>
                </div>
                <ChevronRight size={15} className="arrow-icon" />
              </button>

              <button
                className="side-nav-btn"
                onClick={() => onNavigateToTab('competitive')}
              >
                <div className="btn-icon-title">
                  <Layers size={16} className="cyan" />
                  <div className="btn-text-block">
                    <span className="btn-title">Competitive Alpha Intel</span>
                    <span className="btn-sub">Arbitrage moats vs legacy SAP/Oracle</span>
                  </div>
                </div>
                <ChevronRight size={15} className="arrow-icon" />
              </button>
            </div>
          </div>

          {/* Quick Strategic Monograph CTA */}
          <div className="side-monograph-card glass-panel">
            <div className="monograph-top">
              <span className="monograph-tag font-mono">2026 ARCHITECTURE</span>
              <h5 className="monograph-heading">Empirical Scale Trilemma &amp; ROI Monograph</h5>
              <p className="monograph-p">
                Review theoretical foundation, 10x ROI multipliers, and why legacy ERP systems fail under poly-crisis supply chain disruptions.
              </p>
            </div>
            <button
              className="btn-read-monograph"
              onClick={() => onNavigateToTab('whitepaper')}
            >
              <span>Read Monograph</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
