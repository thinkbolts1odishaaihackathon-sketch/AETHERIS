import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Copy, Check, Lock, CheckCircle2, RefreshCw, Key, Layers } from 'lucide-react';
import { api } from '../services/api';
import type { MerkleBlockItem } from '../types/auth';
import type { MerkleVerificationResult } from '../types';

interface AuditProofModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditProofModal: React.FC<AuditProofModalProps> = ({
  isOpen,
  onClose
}) => {
  const [blocks, setBlocks] = useState<MerkleBlockItem[]>([]);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number | null>(null);
  const [verificationResult, setVerificationResult] = useState<MerkleVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedRoot, setCopiedRoot] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);

  const verifyBlock = async (blockNum: number) => {
    setIsVerifying(true);
    setSelectedBlockNumber(blockNum);
    try {
      const result = await api.verifyMerkleBlock(blockNum);
      setVerificationResult(result);
    } catch (e) {
      console.warn('Verification failed', e);
    } finally {
      setIsVerifying(false);
    }
  };

  const loadBlocks = async () => {
    const res = await api.getMerkleBlocks();
    if (res.success && res.blocks.length > 0) {
      setBlocks(res.blocks);
      const topBlock = res.blocks[0];
      setSelectedBlockNumber(topBlock.blockNumber);
      verifyBlock(topBlock.blockNumber);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBlocks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBlock = blocks.find((b) => b.blockNumber === selectedBlockNumber) || blocks[0];

  const handleCopyRoot = () => {
    if (currentBlock) {
      navigator.clipboard.writeText(currentBlock.rootHash);
      setCopiedRoot(true);
      setTimeout(() => setCopiedRoot(false), 2000);
    }
  };

  const handleCopySig = (sig: string) => {
    navigator.clipboard.writeText(sig);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container audit-modal-box"
        style={{ maxWidth: '860px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="modal-icon-badge" style={{ background: 'rgba(79, 70, 229, 0.12)', color: '#4f46e5' }}>
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Authoritative Cryptographic Merkle Audit Ledger
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Immutable SHA-256 binary Merkle DAG &amp; Ed25519 digital signature attestation
              </p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Block Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Available Ledger Blocks:</span>
            {blocks.map((b) => (
              <button
                key={b.blockNumber}
                onClick={() => verifyBlock(b.blockNumber)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: selectedBlockNumber === b.blockNumber ? '#4f46e5' : 'var(--card-bg-subtle, rgba(255,255,255,0.04))',
                  color: selectedBlockNumber === b.blockNumber ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                #{b.blockNumber}
              </button>
            ))}
            <button
              onClick={() => selectedBlockNumber && verifyBlock(selectedBlockNumber)}
              title="Re-verify mathematical proof"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <RefreshCw size={13} className={isVerifying ? 'spin-icon' : ''} />
            </button>
          </div>

          {currentBlock && (
            <>
              {/* Root Merkle Box */}
              <div className="merkle-root-display-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="merkle-badge-label">
                    <ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    STATE MERKLE ROOT ANCHOR // BLOCK #{currentBlock.blockNumber}
                  </span>
                  {verificationResult && verificationResult.overallCryptographicIntegrity === 'VERIFIED_TAMPER_PROOF' ? (
                    <span className="merkle-verified-chip" style={{ color: '#10b981', background: 'rgba(16,185,129,0.12)' }}>
                      <CheckCircle2 size={12} /> TAMPER-PROOF VERIFIED
                    </span>
                  ) : (
                    <span className="merkle-verified-chip" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.12)' }}>
                      <RefreshCw size={12} className="spin-icon" /> VERIFYING DAG...
                    </span>
                  )}
                </div>

                <div className="merkle-root-hash-row">
                  <code className="font-mono text-break">{currentBlock.rootHash}</code>
                  <button
                    className="btn-copy-hash"
                    onClick={handleCopyRoot}
                    title="Copy SHA-256 Root Hash"
                  >
                    {copiedRoot ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#64748b" />}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>Mission: <strong>{currentBlock.missionTitle}</strong></span>
                  <span>Leaves Anchored: <strong>{currentBlock.leafCount} Events</strong></span>
                </div>
              </div>

              {/* Mathematical Proof Diagnostics */}
              {verificationResult && (
                <div style={{ background: 'var(--card-bg-subtle, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} color="#4f46e5" />
                    Mathematical DAG Proof Diagnostics
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Root Hash Recalculation:</span>
                      <strong style={{ fontSize: '0.8rem', color: verificationResult.rootMatches ? '#10b981' : '#ef4444' }}>
                        {verificationResult.rootMatches ? 'MATCH (100% Deterministic)' : 'MISMATCH'}
                      </strong>
                    </div>

                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Binary Inclusion Proof (Leaf 0):</span>
                      <strong style={{ fontSize: '0.8rem', color: verificationResult.inclusionProofValid ? '#10b981' : '#ef4444' }}>
                        {verificationResult.inclusionProofValid ? 'VALID SIBLING PATH' : 'INVALID PATH'}
                      </strong>
                    </div>

                    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Ed25519 Digital Signature:</span>
                      <strong style={{ fontSize: '0.8rem', color: verificationResult.signatureValid ? '#10b981' : '#ef4444' }}>
                        {verificationResult.signatureValid ? 'VALID PUBLIC KEY SIG' : 'SIGNATURE INVALID'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Signatures List */}
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={14} color="#10b981" />
                  Validator Digital Signatures
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentBlock.validatorSignatures.map((sig, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'var(--card-bg-subtle, rgba(255,255,255,0.02))',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      <code style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{sig}</code>
                      <button
                        onClick={() => handleCopySig(sig)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
                      >
                        {copiedSig ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#64748b" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
