import React, { useState } from 'react';
import {
  Cpu,
  Lock,
  Mail,
  Key,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Building,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface LoginPageProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  theme = 'light',
  onToggleTheme
}) => {
  const { login, register, loginWithSSO } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'personas' | 'sso' | 'register'>('signin');

  // Sign In Form State
  const [email, setEmail] = useState('executive@aetheris.ai');
  const [password, setPassword] = useState('Aetheris2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOrg, setRegOrg] = useState('Precision Industrial Global Ltd.');
  const [regDept, setRegDept] = useState('Global Trade & Supply Operations');
  const [regRole, setRegRole] = useState<UserRole>('executive');

  // Feedback & Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const demoPersonas = [
    {
      id: 'exec',
      name: 'Elena Rostova',
      email: 'executive@aetheris.ai',
      role: 'executive' as UserRole,
      badge: 'COMMAND // L0',
      title: 'Executive Board & Investment Committee',
      color: '#2563eb',
      desc: 'Full autonomous governance, capital allocation, and mission dispatch authority.'
    },
    {
      id: 'comp',
      name: 'Dr. Marcus Vance',
      email: 'compliance@aetheris.ai',
      role: 'compliance_officer' as UserRole,
      badge: 'GOVERNANCE // L1',
      title: 'Global Regulatory & Statutory Governance',
      color: '#0284c7',
      desc: 'Zero-drift oversight, statutory remediation authority, and sanction audits.'
    },
    {
      id: 'ops',
      name: 'Kavita Sharma',
      email: 'operations@aetheris.ai',
      role: 'operations_director' as UserRole,
      badge: 'LOGISTICS // L1',
      title: 'Multi-Modal Logistics & Supply Chain',
      color: '#ff6b00',
      desc: 'Dynamic corridor routing, freight arbitrage, and multimodal resilience.'
    },
    {
      id: 'audit',
      name: 'Satoshi Lin',
      email: 'auditor@aetheris.ai',
      role: 'auditor' as UserRole,
      badge: 'INTEGRITY // L2',
      title: 'Independent Cryptographic Attestation',
      color: '#6366f1',
      desc: 'Ed25519 signature sealing and SHA-256 Merkle root verification.'
    }
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(`Session authenticated. Initializing workspace for ${res.user?.name}...`);
    } else {
      setErrorMessage(res.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickPersonaLogin = async (personaEmail: string, personaName: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(`Authenticating session as ${personaName}...`);

    const res = await login(personaEmail, 'Aetheris2026!');
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.message || 'Persona login failed.');
      setSuccessMessage(null);
    }
  };

  const handleSSOLogin = async (provider: string, demoEmail: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(`Connecting to ${provider} Identity Provider...`);

    const res = await loginWithSSO(provider, demoEmail);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(`Handshake verified via ${provider}! Welcome, ${res.user?.name}.`);
    } else {
      setErrorMessage(res.message || 'SSO handshake failed.');
      setSuccessMessage(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      organization: regOrg,
      department: regDept
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(`Account created for ${res.user?.name}! Cryptographic key issued.`);
    } else {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="login-portal-container">
      {/* Ambient Atmospheric Light Orbs & Matrix */}
      <div className="ambient-background-canvas" aria-hidden="true">
        <div className="ambient-light-orb orb-cobalt" />
        <div className="ambient-light-orb orb-amber" />
        <div className="ambient-light-orb orb-emerald" />
        <div className="ambient-dot-matrix" />
      </div>

      {/* Top Utility Bar — slides down on load */}
      <div className="login-top-bar anim-fade-in-up delay-0">
        <div className="login-brand-chip">
          <Cpu size={16} className="brand-logo-icon spin-icon-slow" />
          <span>AETHERIS AEOS v2.6</span>
        </div>

        {onToggleTheme && (
          <button
            className="topbar-theme-toggle btn-premium focus-glow"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Studio Light' : 'Switch to Obsidian Dark'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}
      </div>

      {/* Main Authentication Card — springs up from bottom */}
      <div className="login-card-wrapper login-card-enter border-beam-card">
        <div className="login-card-glow-accent" />

        <div className="login-card-inner">
          {/* Header */}
          <div className="login-header-section login-hero-brand">
            <div className="login-brand-mark anim-float">
              <Cpu size={24} color="#ffffff" />
              <div className="mark-glow" />
            </div>

            <h1 className="login-title text-gradient-animated">AETHERIS</h1>
            <p className="login-tagline login-tagline-enter">
              Autonomous Enterprise Operating System
            </p>
            <div className="login-trust-pill anim-fade-in-up delay-300">
              <Shield size={12} className="trust-icon" />
              <span>256-Bit Encrypted Session • SHA-256 Merkle Proof • Ed25519 Signed</span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="login-alert-box error">
              <AlertCircle size={15} className="alert-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-alert-box success">
              <CheckCircle2 size={15} className="alert-icon" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="login-mode-tabs">
            <button
              className={`mode-tab-btn ${authMode === 'signin' ? 'active' : ''}`}
              onClick={() => { setAuthMode('signin'); setErrorMessage(null); }}
            >
              <Key size={13} />
              <span>Sign In</span>
            </button>
            <button
              className={`mode-tab-btn ${authMode === 'personas' ? 'active' : ''}`}
              onClick={() => { setAuthMode('personas'); setErrorMessage(null); }}
            >
              <Sparkles size={13} />
              <span>Demo Roles</span>
            </button>
            <button
              className={`mode-tab-btn ${authMode === 'sso' ? 'active' : ''}`}
              onClick={() => { setAuthMode('sso'); setErrorMessage(null); }}
            >
              <Building size={13} />
              <span>SSO</span>
            </button>
            <button
              className={`mode-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
            >
              <UserIcon size={13} />
              <span>Register</span>
            </button>
          </div>

          {/* TAB 1: STANDARD SIGN IN */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="login-form">
              <div className="form-field-group">
                <label className="form-field-label">Enterprise Work Email</label>
                <div className="form-input-box">
                  <Mail size={15} className="input-leading-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="executive@aetheris.ai"
                    className="form-text-input"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <div className="password-label-row">
                  <label className="form-field-label">Workstation Password</label>
                  <span className="form-field-hint">Default: Aetheris2026!</span>
                </div>
                <div className="form-input-box">
                  <Lock size={15} className="input-leading-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="form-text-input"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-options-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-checkbox"
                  />
                  <span>Remember this terminal session</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-login-submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Operating System'}</span>
                <ArrowRight size={16} />
              </button>

              {/* Quick Persona Pills for fast testing */}
              <div className="quick-persona-shortcuts">
                <span className="shortcuts-label">Instant 1-Click Login:</span>
                <div className="shortcuts-chips">
                  <button
                    type="button"
                    className="shortcut-persona-chip"
                    onClick={() => handleQuickPersonaLogin('executive@aetheris.ai', 'Elena Rostova')}
                  >
                    👑 Elena Rostova (Exec)
                  </button>
                  <button
                    type="button"
                    className="shortcut-persona-chip"
                    onClick={() => handleQuickPersonaLogin('compliance@aetheris.ai', 'Dr. Marcus Vance')}
                  >
                    🛡️ Marcus Vance (Compliance)
                  </button>
                  <button
                    type="button"
                    className="shortcut-persona-chip"
                    onClick={() => handleQuickPersonaLogin('operations@aetheris.ai', 'Kavita Sharma')}
                  >
                    ⚡ Kavita Sharma (Ops)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: DEMO PERSONAS */}
          {authMode === 'personas' && (
            <div className="personas-selector-grid">
              <p className="personas-instructions">
                Select a simulated enterprise persona to inspect role-based access control (RBAC), multi-agent deliberation, and cryptographic signatures:
              </p>

              <div className="persona-cards-list">
                {demoPersonas.map((p) => (
                  <div
                    key={p.id}
                    className="persona-card-item"
                    onClick={() => handleQuickPersonaLogin(p.email, p.name)}
                  >
                    <div className="persona-card-top">
                      <div className="persona-avatar-box" style={{ background: `${p.color}15`, color: p.color }}>
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="persona-meta">
                        <div className="persona-name-row">
                          <span className="persona-name">{p.name}</span>
                          <span className="persona-badge" style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}10` }}>
                            {p.badge}
                          </span>
                        </div>
                        <span className="persona-title">{p.title}</span>
                      </div>
                    </div>

                    <p className="persona-desc">{p.desc}</p>

                    <div className="persona-action-footer">
                      <span className="persona-email font-mono">{p.email}</span>
                      <span className="persona-launch-text">
                        Sign In <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ENTERPRISE SSO */}
          {authMode === 'sso' && (
            <div className="sso-provider-list">
              <p className="sso-desc">
                Federated single sign-on with enterprise SAML 2.0 / OIDC identity providers:
              </p>

              <button
                className="sso-provider-btn"
                onClick={() => handleSSOLogin('Okta SAML 2.0', 'executive@aetheris.ai')}
                disabled={isSubmitting}
              >
                <div className="sso-icon-box okta">O</div>
                <div className="sso-btn-text">
                  <span className="sso-provider-name">Okta Universal Directory</span>
                  <span className="sso-provider-detail">SAML 2.0 • Corporate IdP</span>
                </div>
                <ArrowRight size={15} />
              </button>

              <button
                className="sso-provider-btn"
                onClick={() => handleSSOLogin('Microsoft Entra ID', 'compliance@aetheris.ai')}
                disabled={isSubmitting}
              >
                <div className="sso-icon-box ms">M</div>
                <div className="sso-btn-text">
                  <span className="sso-provider-name">Microsoft Entra ID (Azure AD)</span>
                  <span className="sso-provider-detail">OIDC • Conditional Access Enforced</span>
                </div>
                <ArrowRight size={15} />
              </button>

              <button
                className="sso-provider-btn"
                onClick={() => handleSSOLogin('Google Workspace', 'operations@aetheris.ai')}
                disabled={isSubmitting}
              >
                <div className="sso-icon-box google">G</div>
                <div className="sso-btn-text">
                  <span className="sso-provider-name">Google Workspace Enterprise</span>
                  <span className="sso-provider-detail">OAuth 2.0 • BeyondCorp Verified</span>
                </div>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* TAB 4: REGISTER */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="login-form">
              <div className="form-field-group">
                <label className="form-field-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="form-text-input no-icon"
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Enterprise Work Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="v.singhania@tataglobal.com"
                  className="form-text-input no-icon"
                />
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Workstation Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Choose a strong passphrase"
                  className="form-text-input no-icon"
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-field-group">
                  <label className="form-field-label">Organization Name</label>
                  <input
                    type="text"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    className="form-text-input no-icon"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Department / Unit</label>
                  <input
                    type="text"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="form-text-input no-icon"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">RBAC Role Assignment</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="form-select-input"
                >
                  <option value="executive">Executive Board (L0)</option>
                  <option value="compliance_officer">Compliance Sentinel (L1)</option>
                  <option value="operations_director">Operations Conductor (L1)</option>
                  <option value="auditor">Cryptographic Auditor (L2)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-login-submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Creating Enterprise Account...' : 'Issue Ed25519 Key & Register'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Quick Direct Launch Option */}
          <div className="login-quick-launch-footer">
            <span>Need immediate access for evaluation?</span>
            <button
              type="button"
              className="quick-launch-link"
              onClick={() => handleQuickPersonaLogin('executive@aetheris.ai', 'Elena Rostova')}
            >
              ⚡ Launch Instant Executive Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
