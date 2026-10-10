import React, { useState } from 'react';
import { Layers, ShieldAlert, Target, Award, DollarSign, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';
import type { CompetitorVector } from '../types';
import { COMPETITOR_VECTORS } from '../data/mockEnterpriseData';

export const CompetitiveAlpha: React.FC = () => {
  const [competitors, setCompetitors] = useState<CompetitorVector[]>(COMPETITOR_VECTORS);
  const [autonomousOverheadAdvantage, setAutonomousOverheadAdvantage] = useState<number>(34);
  const [simulatingCounter, setSimulatingCounter] = useState(false);
  const [counterStatus, setCounterStatus] = useState<string | null>(null);

  // Computed live metrics from the elasticity slider
  const dynamicSpreadBps = (autonomousOverheadAdvantage * 5.4).toFixed(0);
  const projectedTenderWinRate = Math.min(94, 62 + Math.floor(autonomousOverheadAdvantage * 0.7));
  const annualEbitdaProtection = ((autonomousOverheadAdvantage / 100) * 142).toFixed(1);

  const handleSimulateCounter = () => {
    setSimulatingCounter(true);
    setCounterStatus('Market Alpha Strategist scraping real-time tender feeds in London & Frankfurt...');

    setTimeout(() => {
      setCompetitors((prev) =>
        prev.map((c) => ({
          ...c,
          detectedPrice: c.id === 'comp-1' ? '6.15% (Compressed by -25 bps)' : c.detectedPrice,
          ourOptimizedPrice: c.id === 'comp-1' ? '8.40% Net IRR (+225 bps Alpha)' : c.ourOptimizedPrice,
          marketShareShielded: '$42M Tender Pre-empted & Locked'
        }))
      );
      setSimulatingCounter(false);
      setCounterStatus('Autonomous Alpha Defense Locked: Countered European REIT bid with 225 bps spread advantage.');
    }, 1600);
  };

  return (
    <div className="competitive-alpha-container fade-in-up">
      {/* Top Banner & High-Level Metrics */}
      <div className="premium-card competitive-header-card">
        <div className="competitive-header-row">
          <div className="competitive-header-text">
            <div className="badge-icon-wrap orange">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="section-title">Global Market Alpha &amp; Competitive Differentiation</h2>
              <p className="section-subtitle">
                Modeled sensitivity curve, simulated competitor elasticity counter-moves, and localized margin positioning [Calibrated Simulation Model].
              </p>
            </div>
          </div>

          <div className="competitive-header-cta">
            <button
              id="simulate-counter-btn"
              className="btn-simulate-counter"
              onClick={handleSimulateCounter}
              disabled={simulatingCounter}
            >
              <RefreshCw size={14} className={simulatingCounter ? 'spin-icon' : ''} />
              <span>{simulatingCounter ? 'Computing Counter...' : 'Simulate Competitor Counter-Move'}</span>
            </button>
          </div>
        </div>

        {counterStatus && (
          <div className="statutory-event-alert warning">
            <Target size={14} className="icon-orange flex-shrink" />
            <span>{counterStatus}</span>
          </div>
        )}

        <div className="radar-stats-grid">
          <div className="radar-stat-card">
            <span className="stat-card-label">Monitored Vectors</span>
            <span className="stat-card-number text-blue">3 Sectors</span>
            <span className="stat-card-sub">Real Estate, Heavy Eng &amp; SaaS</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Modeled Margin Spread</span>
            <span className="stat-card-number text-emerald">+{dynamicSpreadBps} bps</span>
            <span className="stat-card-sub text-emerald">Spread = Overhead% × 5.4 bps</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Projected Win Rate</span>
            <span className="stat-card-number text-orange">{projectedTenderWinRate}%</span>
            <span className="stat-card-sub">Modeled Sensitivity Curve</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Modeled EBITDA Delta</span>
            <span className="stat-card-number text-purple">${annualEbitdaProtection}M</span>
            <span className="stat-card-sub">Overhead% × $142M Portfolio Base</span>
          </div>
        </div>
      </div>

      {/* Interactive Elasticity Simulator Sandbox */}
      <div className="premium-card elasticity-sandbox-card">
        <div className="sandbox-header-line">
          <div className="badge-icon-wrap blue">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="section-title-sm">Interactive Operating Overhead Advantage Sandbox</h3>
            <p className="section-subtitle-sm">
              Multinationals carry 25% to 40% SG&amp;A overhead in foreign regional offices. By replacing foreign administrative bureaucracy with autonomous multi-agent swarms, model how much margin you can pass to the client while expanding retained earnings:
            </p>
          </div>
        </div>

        <div className="sandbox-controls-row">
          <div className="sandbox-slider-box">
            <div className="slider-header">
              <span className="slider-label">Autonomous Operational Lean Advantage:</span>
              <span className="slider-readout blue">{autonomousOverheadAdvantage}% Lower SG&amp;A</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={autonomousOverheadAdvantage}
              onChange={(e) => setAutonomousOverheadAdvantage(Number(e.target.value))}
              className="modern-range-slider blue"
            />
          </div>

          <div className="sandbox-results-pills">
            <div className="sandbox-result-pill">
              <span className="pill-metric-label">Alpha Spread Created</span>
              <span className="pill-metric-value text-emerald">+{dynamicSpreadBps} bps</span>
            </div>

            <div className="sandbox-result-pill">
              <span className="pill-metric-label">Customer Conversion</span>
              <span className="pill-metric-value text-orange">+{(autonomousOverheadAdvantage / 14).toFixed(1)}x Delta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Matrix Table */}
      <div className="premium-card competitor-table-card">
        <h3 className="section-title-sm">Autonomous Competitive Counter-Strategy Matrix</h3>
        <p className="section-subtitle-sm">Real-time vulnerability interception and asymmetric counter-maneuvers against legacy incumbents.</p>

        <div className="competitor-cards-stack">
          {competitors.map((comp) => {
            return (
              <div key={comp.id} className="competitor-matrix-item">
                <div className="competitor-matrix-top">
                  <div>
                    <div className="competitor-title-row">
                      <h4 className="competitor-name">{comp.competitorName}</h4>
                      <span className="competitor-tier-badge">{comp.tier}</span>
                    </div>
                    <div className="competitor-market-line">
                      Target Corridor / Industry: <strong>{comp.market}</strong>
                    </div>
                  </div>

                  <div>
                    <span className={`threat-badge ${comp.threatLevel.toLowerCase()}`}>
                      THREAT LEVEL: {comp.threatLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="vulnerability-callout">
                  <ShieldAlert size={15} className="icon-amber flex-shrink" />
                  <span><strong>Incumbent Vulnerability Intercepted:</strong> {comp.recentManeuver}</span>
                </div>

                <div className="price-arbitrage-comparison">
                  <div className="price-column">
                    <span className="price-column-label">Competitor Pricing / Yield</span>
                    <span className="price-column-value text-muted">{comp.detectedPrice}</span>
                  </div>
                  <div className="price-column">
                    <span className="price-column-label">Autonomous Arbitrage Price / Yield</span>
                    <span className="price-column-value text-emerald">
                      <DollarSign size={15} style={{ display: 'inline' }} />
                      {comp.ourOptimizedPrice}
                    </span>
                  </div>
                </div>

                <div className="counter-strategy-callout">
                  <div className="counter-strategy-title">
                    <Award size={14} />
                    <span>Autonomous Market Alpha Maneuver:</span>
                  </div>
                  <div className="counter-strategy-desc">{comp.autonomousCounterStrategy}</div>
                  <div className="counter-strategy-outcome">
                    <CheckCircle2 size={13} className="icon-blue" />
                    <span>Strategic Outcome: {comp.marketShareShielded}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
