import React, { useState } from 'react';
import { Key, Sparkles, X, Check, AlertTriangle, Cpu, ExternalLink } from 'lucide-react';
import type { GeminiConfig } from '../types';
import { testGeminiConnection, saveStoredGeminiConfig } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GeminiConfig;
  onSave: (config: GeminiConfig) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || 'gemini-1.5-flash');
  const [isLive, setIsLive] = useState(config.isLive || false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testGeminiConnection(apiKey, model);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    const updated: GeminiConfig = {
      apiKey: apiKey.trim(),
      model,
      temperature: 0.3,
      isLive: isLive && apiKey.trim().length > 0
    };
    saveStoredGeminiConfig(updated);
    onSave(updated);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: 36, height: 36 }}>
              <Key size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Gemini API Swarm Configuration</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Connect Google Gemini to power live autonomous multi-agent reasoning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-modal-close"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '6px' }}>
              Google Gemini API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="custom-prompt-input"
                style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Key stored locally in your browser (never sent elsewhere)</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}
              >
                Get Free Gemini API Key <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '6px' }}>
                Gemini Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as any)}
                className="custom-prompt-input"
                style={{ width: '100%' }}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '6px' }}>
                Execution Mode
              </label>
              <button
                type="button"
                onClick={() => setIsLive(!isLive)}
                className="custom-prompt-input"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: isLive ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
                  color: isLive ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{isLive ? 'Live Gemini LLM Mode' : 'Autonomous Simulation'}</span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: isLive ? 'var(--accent-emerald-dim)' : 'var(--bg-elevated)', fontWeight: 800, color: isLive ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                  {isLive ? 'ACTIVE' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              id="test-gemini-btn"
              type="button"
              className="btn-secondary"
              onClick={handleTest}
              disabled={testing || !apiKey}
              style={{ opacity: !apiKey ? 0.5 : 1 }}
            >
              <Sparkles size={14} color="#ff6b00" />
              <span>{testing ? 'Pinging Gemini API...' : 'Test API Connection'}</span>
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Runs a live latency check against Google servers
            </span>
          </div>

          {testResult && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                background: testResult.success ? 'var(--accent-emerald-dim)' : 'rgba(244, 63, 94, 0.1)',
                color: testResult.success ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 600
              }}
            >
              {testResult.success ? <Check size={18} /> : <AlertTriangle size={18} />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
              <Cpu size={14} color="#2563eb" /> How Gemini Accelerates Autonomous Enterprise Agents:
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              1. <strong>Massive 1M+ Token Context</strong>: Ingests full cross-border customs codes, 300-page lease deeds, and multi-tier supply contracts in one pass.<br/>
              2. <strong>Low Latency Consensus</strong>: Deliberates across all 4 agents in under 1.8 seconds.<br/>
              3. <strong>Structured Function Calling</strong>: Direct generation of ERP & customs clearance JSON manifests without hallucinations.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button id="save-gemini-config-btn" className="btn-primary" onClick={handleSave}>
            Save & Apply Swarm Config
          </button>
        </div>
      </div>
    </div>
  );
};
