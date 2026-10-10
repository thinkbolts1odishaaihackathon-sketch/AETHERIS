import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  DollarSign
} from 'lucide-react';

interface ActionGateProps {
  thresholdAmount: number;
  currentAmount: number;
  poNumber: string;
  vendorName: string;
  itemDescription: string;
  requiresDirectorSignoff: boolean;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISMISSED';
  onApprove: () => void;
  onInspectDetails: () => void;
}

export const ActionGateBanner: React.FC<ActionGateProps> = ({
  thresholdAmount = 5000,
  currentAmount = 10800,
  poNumber = 'PO-2026-8821',
  vendorName = 'Bavaria Precision Metallics GmbH',
  itemDescription = '200x TF-700 High-Grade Titanium Flanges for Airbus Defense & Space',
  requiresDirectorSignoff = true,
  status = 'PENDING_APPROVAL',
  onApprove,
  onInspectDetails
}) => {
  if (status === 'DISMISSED') return null;

  return (
    <div className="action-gate-container">
      <div className={`action-gate-card ${status === 'APPROVED' ? 'approved' : 'pending'}`}>
        {/* Glow ambient bar */}
        <div className="action-gate-glow" />

        {/* Left: Indicator & Context */}
        <div className="action-gate-left">
          <div className="action-gate-icon-box">
            {status === 'APPROVED' ? (
              <CheckCircle2 size={24} className="emerald" />
            ) : (
              <AlertTriangle size={24} className="amber pulse-icon" />
            )}
          </div>

          <div className="action-gate-info">
            <div className="action-gate-header-line">
              <span className={`action-gate-tag ${status === 'APPROVED' ? 'emerald' : 'amber'}`}>
                {status === 'APPROVED' ? 'ACTION GATE CLEARED' : 'ACTION GATE // HUMAN APPROVAL REQUIRED'}
              </span>
              <span className="action-gate-statute-pill">
                <Lock size={11} />
                Dual-Control Governance
              </span>
              <span className="action-gate-currency font-mono tabular-nums">
                <DollarSign size={12} />
                Ceiling: ${thresholdAmount.toLocaleString()} USD
              </span>
            </div>

            <h3 className="action-gate-headline">
              {status === 'APPROVED' ? (
                <>Purchase Order <strong>{poNumber}</strong> Authorized by Executive Director</>
              ) : (
                <>Autonomous Procurement Triggered: Purchase Order <strong>{poNumber}</strong> exceeds statutory ceiling</>
              )}
            </h3>

            <p className="action-gate-description">
              {itemDescription} via <strong>{vendorName}</strong>. Total value:{' '}
              <span className="font-mono tabular-nums font-bold text-highlight">
                ${currentAmount.toLocaleString()}.00 USD
              </span>
              . {requiresDirectorSignoff && 'EU AI Act Article 14 mandatory human intervention engaged.'}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="action-gate-actions">
          {status === 'PENDING_APPROVAL' ? (
            <>
              <button
                id="btn-action-gate-inspect"
                className="btn-action-secondary"
                onClick={onInspectDetails}
                title="Inspect cryptographic Merkle leaf & supplier quote"
              >
                <ShieldCheck size={14} />
                <span>Inspect Merkle Leaf</span>
              </button>

              <button
                id="btn-action-gate-approve"
                className="btn-action-primary"
                onClick={onApprove}
                title="Authorize purchase order & advance execution mesh"
              >
                <span>Authorize $10,800 PO</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <div className="approved-seal font-mono">
              <CheckCircle2 size={16} className="emerald" />
              <span>Ed25519 Signed by Director</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
