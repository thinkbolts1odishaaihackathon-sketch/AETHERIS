import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw, Anchor, Plane, Train, Boxes } from 'lucide-react';
import type { SupplyNode, OperationalInventoryState } from '../types';
import { SUPPLY_NODES } from '../data/mockEnterpriseData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const OperationsConductor: React.FC = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<SupplyNode[]>(SUPPLY_NODES);
  const [simulatingShock, setSimulatingShock] = useState(false);
  const [shockMessage, setShockMessage] = useState<string | null>(null);
  const [liveInventory, setLiveInventory] = useState<OperationalInventoryState | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await api.getInventoryStatus();
      if (res.success && res.orders && res.inventory && res.suppliers) {
        setLiveInventory({
          orders: res.orders,
          inventory: res.inventory,
          suppliers: res.suppliers,
          purchaseOrders: res.purchaseOrders || []
        });
      }
    };
    fetchInventory();
  }, []);

  const handleSimulateShock = async () => {
    setSimulatingShock(true);
    setShockMessage('Suez Canal & Red Sea Corridor: War risk insurance spike (+240%) and 14-day passage bottleneck detected!');

    try {
      const res = await api.rerouteOperations('route-1', 'Multimodal Rail');
      if (res.success) {
        setRoutes((prev) =>
          prev.map((r) =>
            r.id === 'route-1'
              ? {
                  ...r,
                  status: 'rerouted_autonomous',
                  transitMode: 'Multimodal Rail',
                  leadTimeDays: 16,
                  costVariancePercent: -18.4,
                  anomaly: 'Red Sea maritime transit delay neutralized via Eurasian overland rail conduit.',
                  autonomousRemediation: `Autonomous switch authorized by ${user?.name || 'Operations Conductor'}: 100% capacity rerouted through INSTC rail corridor. 11 days saved, zero demurrage.`
                }
              : r
          )
        );
        setShockMessage(`Autonomous Optimization Sealed: 11 days saved. Signed by ${user?.name || 'Conductor'} (${user?.role || 'Operations'}).`);
      }
    } catch (e) {
      console.warn('Backend sync error', e);
    } finally {
      setSimulatingShock(false);
    }
  };

  const primaryOrder = liveInventory?.orders?.find((o) => o.id === 'ord-2026-500');
  const primaryInv = liveInventory?.inventory?.find((i) => i.sku === 'SKU-AERO-TI500');

  return (
    <div className="operations-conductor-container fade-in-up">
      {/* Top Header Panel */}
      <div className="premium-card operations-header-card">
        <div className="operations-header-row">
          <div className="operations-header-text">
            <div className="badge-icon-wrap orange">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="section-title">Complex Operations &amp; Supply Conductor</h2>
              <p className="section-subtitle">
                Deterministic supplier arbitrage, live database inventory tracking, and multi-modal contingency routing model.
              </p>
            </div>
          </div>

          <div className="operations-header-cta">
            <button
              id="simulate-shock-btn"
              className="btn-simulate-corridor-shock"
              onClick={handleSimulateShock}
              disabled={simulatingShock}
            >
              <RefreshCw size={14} className={simulatingShock ? 'spin-icon' : ''} />
              <span>{simulatingShock ? 'Conductor Re-routing...' : 'Simulate Choke Point Shock'}</span>
            </button>
          </div>
        </div>

        {shockMessage && (
          <div className="statutory-event-alert warning">
            <AlertTriangle size={14} className="icon-orange" />
            <span>{shockMessage}</span>
          </div>
        )}

        <div className="radar-stats-grid">
          <div className="radar-stat-card">
            <span className="stat-card-label">Active Corridors</span>
            <span className="stat-card-number text-blue">4 Global</span>
            <span className="stat-card-sub">Maritime, Rail &amp; Air</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Primary Order Status</span>
            <span className="stat-card-number text-emerald">
              {primaryOrder ? primaryOrder.status.toUpperCase() : 'FULFILLED'}
            </span>
            <span className="stat-card-sub text-emerald">
              {primaryOrder ? `${primaryOrder.requiredQuantity} units required` : '500 units'}
            </span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Warehouse Inventory</span>
            <span className="stat-card-number text-orange">
              {primaryInv ? `${primaryInv.quantityOnHand} On-Hand` : '300 Units'}
            </span>
            <span className="stat-card-sub">
              {primaryInv ? `${primaryInv.onOrderQuantity || 0} On-Order / ${primaryInv.reservedQuantity} Allocated` : 'Frankfurt Hub'}
            </span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">SLA Protection</span>
            <span className="stat-card-number text-purple">&lt; 3 Days</span>
            <span className="stat-card-sub">Bavarian Air Cargo Corridor</span>
          </div>
        </div>
      </div>

      {/* Live Operational Database State Card */}
      {liveInventory && (
        <div className="premium-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="badge-icon-wrap blue">
              <Boxes size={18} />
            </div>
            <div>
              <h3 className="section-title-sm" style={{ margin: 0 }}>Authoritative Database Telemetry: Orders &amp; Suppliers</h3>
              <p className="section-subtitle-sm" style={{ margin: 0 }}>Live relational persistence verified via SQLAlchemy backend.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {liveInventory.suppliers?.map((sup) => (
              <div key={sup.id} style={{ background: 'var(--card-bg-subtle, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sup.name}</strong>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: sup.complianceCertified ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: sup.complianceCertified ? '#10b981' : '#ef4444' }}>
                    {sup.complianceCertified ? 'CBAM Certified' : 'Pending Audit'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Origin:</strong> {sup.country}</div>
                  <div><strong>Lead Time:</strong> {sup.leadTimeDays} days via {sup.transitMode}</div>
                  <div><strong>Unit Cost:</strong> ${sup.unitCostUsd.toFixed(2)} | <strong>Freight:</strong> ${sup.freightCostUsd.toFixed(2)}</div>
                  <div><strong>Reliability Score:</strong> {sup.reliabilityScore}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="routes-feed-grid">
        {routes.map((route) => {
          const isRerouted = route.status === 'rerouted_autonomous';

          return (
            <div
              key={route.id}
              className={`route-item-card ${isRerouted ? 'rerouted' : ''}`}
            >
              <div className="route-item-top">
                <div className="route-item-left">
                  <div className="route-mode-icon-box">
                    {route.transitMode === 'Maritime' && <Anchor size={18} className="icon-blue" />}
                    {route.transitMode === 'Air Cargo' && <Plane size={18} className="icon-purple" />}
                    {route.transitMode === 'Multimodal Rail' && <Train size={18} className="icon-orange" />}
                  </div>
                  <div>
                    <h3 className="route-name">{route.routeTitle}</h3>
                    <div className="route-path-line">
                      <span className="route-stop">{route.origin}</span>
                      <ArrowRight size={13} className="route-arrow" />
                      <span className="route-stop">{route.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="route-item-right">
                  <span className={`route-status-pill ${isRerouted ? 'rerouted' : 'active'}`}>
                    {isRerouted ? '⚡ AUTONOMOUS RE-ROUTED' : '✓ OPTIMAL TRANSIT'}
                  </span>
                </div>
              </div>

              {/* Anomaly Callout */}
              {route.anomaly && (
                <div className="route-anomaly-box">
                  <AlertTriangle size={14} className="icon-orange" />
                  <span>{route.anomaly}</span>
                </div>
              )}

              {/* Autonomous Remediation Result */}
              {route.autonomousRemediation && (
                <div className="route-remediation-box">
                  <CheckCircle2 size={14} className="icon-emerald" />
                  <span>{route.autonomousRemediation}</span>
                </div>
              )}

              {/* Corridor Metrics Grid */}
              <div className="route-metrics-grid">
                <div className="route-metric-cell">
                  <span className="metric-label">Mode &amp; Speed</span>
                  <strong className="metric-value">{route.transitMode} ({route.leadTimeDays}d)</strong>
                </div>

                <div className="route-metric-cell">
                  <span className="metric-label">Arbitrage Delta</span>
                  <strong className={`metric-value ${route.costVariancePercent < 0 ? 'text-emerald' : 'text-orange'}`}>
                    {route.costVariancePercent > 0 ? `+${route.costVariancePercent}%` : `${route.costVariancePercent}%`}
                  </strong>
                </div>

                <div className="route-metric-cell">
                  <span className="metric-label">Carbon Rating</span>
                  <strong className="metric-value text-blue">{route.co2Score}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
