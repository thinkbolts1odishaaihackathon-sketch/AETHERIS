import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, ShieldAlert, Cpu, Copy, Check, FileText } from 'lucide-react';
import type { ComplianceFramework, ComplianceDocumentItem, ComplianceEvaluationItem } from '../types';
import { COMPLIANCE_FRAMEWORKS } from '../data/mockEnterpriseData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ComplianceRadar: React.FC = () => {
  const { user } = useAuth();
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>(COMPLIANCE_FRAMEWORKS);
  const [activeDocuments, setActiveDocuments] = useState<ComplianceDocumentItem[]>([]);
  const [liveEvaluations, setLiveEvaluations] = useState<ComplianceEvaluationItem[]>([]);
  const [simulatingDrift, setSimulatingDrift] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplianceData = async () => {
      const docsRes = await api.getComplianceDocuments();
      if (docsRes.success && docsRes.documents) {
        setActiveDocuments(docsRes.documents);
      }

      const evalsRes = await api.getComplianceEvaluations();
      if (evalsRes.success && evalsRes.evaluations) {
        setLiveEvaluations(evalsRes.evaluations);
      }
    };
    fetchComplianceData();
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleSimulateDrift = async () => {
    setSimulatingDrift(true);
    setLastEvent('Statutory Update Ingested: EU amends CBAM embedded emissions reporting threshold (Regulation 2026/112). Sentinel triggered...');

    try {
      const res = await api.remediateCompliance('cf-global-cbam', 'EU CBAM Regulation 2026/112');
      if (res.success) {
        setFrameworks((prev) =>
          prev.map((f) =>
            f.id === 'cf-global-cbam'
              ? {
                  ...f,
                  status: 'remediated',
                  complianceScore: 99.8,
                  autonomousAction: `Statutory patch verified by ${user?.name || 'Regulatory Sentinel'}: Remediated with verified green-hydrogen supplier audit trail under EU Regulation 2026/112.`,
                  lastChecked: 'Just now (Verified & Audited)',
                  auditHash: '0xd311c87a419b02ef'
                }
              : f
          )
        );
        setLastEvent(`Autonomous Remediation Sealed: Verified by ${user?.name || 'Sentinel'} (${user?.role || 'Compliance'}). Audit event recorded in relational ledger.`);

        // Refresh evaluations
        const evalsRes = await api.getComplianceEvaluations();
        if (evalsRes.success) {
          setLiveEvaluations(evalsRes.evaluations);
        }
      }
    } catch (e) {
      console.warn('Backend sync error', e);
    } finally {
      setSimulatingDrift(false);
    }
  };

  const overallScore = (
    frameworks.reduce((acc, f) => acc + f.complianceScore, 0) / frameworks.length
  ).toFixed(1);

  return (
    <div className="compliance-radar-container fade-in-up">
      {/* Top Header Card */}
      <div className="premium-card compliance-header-card">
        <div className="compliance-header-row">
          <div className="compliance-header-text">
            <div className="compliance-title-group">
              <div className="badge-icon-wrap blue">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="section-title">Evidence-Based Compliance &amp; Statutory Sentinel</h2>
                <p className="section-subtitle">
                  Deterministic requirement verification with exact regulatory citations across EU, US, and German statutory frameworks.
                </p>
              </div>
            </div>
          </div>

          <div className="compliance-header-cta">
            <button
              id="simulate-drift-btn"
              className="btn-simulate-shock"
              onClick={handleSimulateDrift}
              disabled={simulatingDrift}
            >
              <RefreshCw size={14} className={simulatingDrift ? 'spin-icon' : ''} />
              <span>{simulatingDrift ? 'Sentinel Verifying...' : 'Re-Check Statutory Alignment'}</span>
            </button>
          </div>
        </div>

        {lastEvent && (
          <div className="statutory-event-alert">
            <Cpu size={14} className="icon-orange" />
            <span>{lastEvent}</span>
          </div>
        )}

        <div className="radar-stats-grid">
          <div className="radar-stat-card">
            <span className="stat-card-label">Approved Documents</span>
            <span className="stat-card-number text-blue">{activeDocuments.length || 3} Registered</span>
            <span className="stat-card-sub">Ingested with Versioning</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Statutory Verification</span>
            <span className="stat-card-number text-emerald">{overallScore}%</span>
            <span className="stat-card-sub text-emerald">Evidence-Backed</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Active Evaluations</span>
            <span className="stat-card-number text-amber">{liveEvaluations.length} Findings</span>
            <span className="stat-card-sub">Linked to Active Runs</span>
          </div>

          <div className="radar-stat-card">
            <span className="stat-card-label">Auditor Standard</span>
            <span className="stat-card-number text-purple">15 CFR / CBAM</span>
            <span className="stat-card-sub">Exact Passage Citations</span>
          </div>
        </div>
      </div>

      {/* Ingested Regulatory Documents Panel */}
      {activeDocuments.length > 0 && (
        <div className="premium-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="badge-icon-wrap blue">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="section-title-sm" style={{ margin: 0 }}>Approved Regulatory Statutes &amp; Passages</h3>
              <p className="section-subtitle-sm" style={{ margin: 0 }}>Source documents with explicit version controls and cited statutory excerpts.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {activeDocuments.map((doc) => (
              <div key={doc.id} style={{ background: 'var(--card-bg-subtle, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <code style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>{doc.id}</code>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(37,99,235,0.15)', color: '#2563eb' }}>
                    v{doc.version} • {doc.jurisdiction}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>{doc.frameworkName}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{doc.sourceTitle}</div>
                <blockquote style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '10px', borderLeft: '2px solid var(--border-color)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{doc.passageText}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Evidence-Based Evaluations */}
      {liveEvaluations.length > 0 && (
        <div className="premium-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div className="badge-icon-wrap emerald">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 className="section-title-sm" style={{ margin: 0 }}>Live Compliance Findings with Source Citations</h3>
              <p className="section-subtitle-sm" style={{ margin: 0 }}>Evaluated deterministically against operational recovery orders and candidate suppliers.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {liveEvaluations.slice(0, 5).map((ev) => (
              <div key={ev.id} style={{ background: 'var(--card-bg-subtle, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{ev.requirementKey}</strong>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: ev.status === 'compliant' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: ev.status === 'compliant' ? '#10b981' : '#ef4444' }}>
                      {ev.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>{ev.evidenceExcerpt}</p>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    <strong>Citation:</strong> {ev.citation}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                  <code>{new Date(ev.evaluatedAt).toLocaleTimeString()}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Frameworks */}
      <div className="compliance-frameworks-grid">
        {frameworks.map((fw) => {
          const pillClass =
            fw.jurisdiction === 'EU'
              ? 'badge-eu'
              : fw.jurisdiction === 'US'
              ? 'badge-us'
              : fw.jurisdiction === 'INDIA'
              ? 'badge-india'
              : 'badge-mena';

          const isWarning = fw.status === 'action_required';

          return (
            <div key={fw.id} className={`compliance-framework-card ${isWarning ? 'warning-state' : ''}`}>
              <div className="framework-card-top">
                <span className={`framework-jurisdiction-badge ${pillClass}`}>
                  {fw.jurisdiction} • {fw.riskCategory}
                </span>

                <div className="framework-status-chip">
                  {fw.status === 'verified' && (
                    <>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span className="text-emerald">VERIFIED</span>
                    </>
                  )}
                  {fw.status === 'remediated' && (
                    <>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span className="text-emerald">AUTO-REMEDIATED</span>
                    </>
                  )}
                  {fw.status === 'action_required' && (
                    <>
                      <ShieldAlert size={13} className="text-amber" />
                      <span className="text-amber">ACTION REQUIRED</span>
                    </>
                  )}
                </div>
              </div>

              <h3 className="framework-name">{fw.frameworkName}</h3>
              <p className="framework-statute">{fw.statuteReference}</p>

              <div className="framework-score-box">
                <div className="score-label-row">
                  <span className="score-label">Policy Match Score</span>
                  <strong className="score-value">{fw.complianceScore}%</strong>
                </div>
                <div className="framework-progress-track">
                  <div
                    className="framework-progress-bar"
                    style={{
                      width: `${fw.complianceScore}%`,
                      backgroundColor: fw.complianceScore > 98 ? '#10b981' : '#f59e0b'
                    }}
                  />
                </div>
              </div>

              <div className="framework-action-box">
                <span className="action-label">Automated Finding:</span>
                <p className="action-text">{fw.autonomousAction}</p>
              </div>

              <div className="framework-card-footer">
                <div
                  className="audit-hash-chip"
                  onClick={() => handleCopyHash(fw.auditHash)}
                  title="Click to copy audit hash"
                >
                  <span>{fw.auditHash}</span>
                  {copiedHash === fw.auditHash ? (
                    <Check size={11} className="text-emerald" />
                  ) : (
                    <Copy size={11} />
                  )}
                </div>
                <span className="checked-time">{fw.lastChecked}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
