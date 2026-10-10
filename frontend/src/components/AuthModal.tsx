import React, { useState } from 'react';
import {
  Shield,
  X,
  Lock,
  Mail,
  Key,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginWithSSO } = useAuth();
  const [tab, setTab] = useState<'signin' | 'sso' | 'register'>('signin');

  // Sign In Form State
  const [email, setEmail] = useState('executive@aetheris.ai');
  const [password, setPassword] = useState('Aetheris2026!');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOrg, setRegOrg] = useState('Global Conglomerate Corp');
  const [regDept, setRegDept] = useState('Cross-Border Operations');
  const [regRole, setRegRole] = useState<UserRole>('executive');

  // Status & Feedback
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoSelect = (demoEmail: string, demoRoleName: string) => {
    setEmail(demoEmail);
    setPassword('Aetheris2026!');
    setErrorMsg(null);
    setSuccessMsg(`Selected demo profile: ${demoRoleName}. Click 'Sign In' or hit Enter.`);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(`Welcome, ${res.user?.name}! Authenticated with role: ${res.user?.role}.`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    } else {
      setErrorMsg(res.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSSOLogin = async (provider: string, demoEmail: string) => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await loginWithSSO(provider, demoEmail);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(`Handshake verified via ${provider}! Welcome, ${res.user?.name}.`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    } else {
      setErrorMsg(res.message || 'SSO handshake failed.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await register({
      email: regEmail,
      password: regPassword,
      name: regName,
      role: regRole,
      organization: regOrg,
      department: regDept
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(`Account created and session verified for ${res.user?.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 800);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container auth-modal-card"
        style={{ maxWidth: '640px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="modal-icon-badge" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Enterprise Identity &amp; RBAC Access
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                AETHERIS // AEOS Zero-Trust Cognitive Gateway
              </p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-row">
          <button
            className={`auth-tab-btn ${tab === 'signin' ? 'active' : ''}`}
            onClick={() => { setTab('signin'); setErrorMsg(null); }}
          >
            Enterprise Sign In
          </button>
          <button
            className={`auth-tab-btn ${tab === 'sso' ? 'active' : ''}`}
            onClick={() => { setTab('sso'); setErrorMsg(null); }}
          >
            Federated SSO
          </button>
          <button
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setErrorMsg(null); }}
          >
            Register Org Account
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          {errorMsg && (
            <div className="auth-alert error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <div>
              {/* Quick Select Demo Credentials */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  One-Click Demo Profiles (Pre-Configured RBAC Roles)
                </span>
                <div className="demo-credentials-grid">
                  <button
                    type="button"
                    className="demo-profile-chip"
                    onClick={() => handleDemoSelect('executive@aetheris.ai', 'Executive Board')}
                  >
                    <div className="role-color-dot" style={{ background: '#2563eb' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="demo-chip-name">Elena Rostova</div>
                      <div className="demo-chip-role">Executive Board (L0)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="demo-profile-chip"
                    onClick={() => handleDemoSelect('compliance@aetheris.ai', 'Chief Compliance Officer')}
                  >
                    <div className="role-color-dot" style={{ background: '#0284c7' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="demo-chip-name">Dr. Marcus Vance</div>
                      <div className="demo-chip-role">Compliance Officer (L1)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="demo-profile-chip"
                    onClick={() => handleDemoSelect('operations@aetheris.ai', 'Operations Director')}
                  >
                    <div className="role-color-dot" style={{ background: '#ff6b00' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="demo-chip-name">Kavita Sharma</div>
                      <div className="demo-chip-role">Operations Director (L1)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="demo-profile-chip"
                    onClick={() => handleDemoSelect('auditor@aetheris.ai', 'Cryptographic Auditor')}
                  >
                    <div className="role-color-dot" style={{ background: '#4f46e5' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div className="demo-chip-name">Satoshi Lin</div>
                      <div className="demo-chip-role">Cryptographic Auditor (L2)</div>
                    </div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="calc-field">
                  <label>Enterprise Work Email</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. executive@aetheris.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="calc-field">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}
                >
                  {submitting ? <RefreshCw size={15} className="spin-icon" /> : <Key size={15} />}
                  <span>{submitting ? 'Verifying Ed25519 Handshake...' : 'Authenticate & Enter Mission Control'}</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: FEDERATED SSO */}
          {tab === 'sso' && (
            <div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Simulate corporate single sign-on authentication through your organization’s identity provider:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-sso-provider"
                  onClick={() => handleSSOLogin('Okta Enterprise SSO', 'executive@aetheris.ai')}
                  disabled={submitting}
                >
                  <div className="sso-provider-icon" style={{ background: '#007dc1' }}>O</div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Sign In with Okta Identity Engine</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>SAML 2.0 / OIDC Verified Tenant</div>
                  </div>
                  <ArrowRight size={15} color="var(--text-muted)" />
                </button>

                <button
                  type="button"
                  className="btn-sso-provider"
                  onClick={() => handleSSOLogin('Microsoft Entra ID', 'compliance@aetheris.ai')}
                  disabled={submitting}
                >
                  <div className="sso-provider-icon" style={{ background: '#00a4ef' }}>M</div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Sign In with Microsoft Entra ID (Azure AD)</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Corporate Tenant Multi-Factor Clearance</div>
                  </div>
                  <ArrowRight size={15} color="var(--text-muted)" />
                </button>

                <button
                  type="button"
                  className="btn-sso-provider"
                  onClick={() => handleSSOLogin('Google Workspace Enterprise', 'operations@aetheris.ai')}
                  disabled={submitting}
                >
                  <div className="sso-provider-icon" style={{ background: '#ea4335' }}>G</div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Sign In with Google Workspace Enterprise</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>OAuth 2.0 BeyondCorp Security Token</div>
                  </div>
                  <ArrowRight size={15} color="var(--text-muted)" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="calc-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div className="calc-field">
                  <label>Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="s.jenkins@corp.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="calc-field">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Global Engineering"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                  />
                </div>

                <div className="calc-field">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Risk & Compliance"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                  />
                </div>
              </div>

              <div className="calc-field">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>

              <div className="calc-field">
                <label>Assigned RBAC Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.86rem'
                  }}
                >
                  <option value="executive">Executive Board (L0 - Full Autonomous Orchestration)</option>
                  <option value="compliance_officer">Compliance Officer (L1 - Statutory Remediation &amp; CSRD)</option>
                  <option value="operations_director">Operations Director (L1 - Logistics Rerouting &amp; Corridors)</option>
                  <option value="auditor">Cryptographic Auditor (L2 - Merkle Sealing &amp; Attestation)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}
              >
                {submitting ? <RefreshCw size={15} className="spin-icon" /> : <Key size={15} />}
                <span>Create Enterprise Account &amp; Generate Ed25519 Keys</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
