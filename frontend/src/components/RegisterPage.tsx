import React, { useState } from 'react';
import {
  Cpu,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Key,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface RegisterPageProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  theme = 'light',
  onToggleTheme,
  onNavigateToLogin
}) => {
  const { register } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [organization, setOrganization] = useState('Precision Industrial Global Ltd.');
  const [department, setDepartment] = useState('Supply Chain & Autonomous Operations');
  const [role, setRole] = useState<UserRole>('operations_director');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleOptions: Array<{
    id: UserRole;
    name: string;
    level: string;
    description: string;
    color: string;
    icon: string;
  }> = [
    {
      id: 'executive',
      name: 'Executive Board',
      level: 'L0 COMMAND',
      description: 'Capital deployment authority ($5,000+ policy gate overrides) and strategic arbitration.',
      color: '#2563eb',
      icon: '👑'
    },
    {
      id: 'operations_director',
      name: 'Operations Director',
      level: 'L1 EXECUTION',
      description: 'Autonomous inventory calculation, vendor scorecard arbitrage, and purchase order release.',
      color: '#ff6b00',
      icon: '⚡'
    },
    {
      id: 'compliance_officer',
      name: 'Compliance Sentinel',
      level: 'L1 GOVERNANCE',
      description: 'Zero-drift EAR99 export control, EU CBAM carbon tariff, and German LkSG legal vetting.',
      color: '#0284c7',
      icon: '🛡️'
    },
    {
      id: 'auditor',
      name: 'Cryptographic Auditor',
      level: 'L2 VERIFICATION',
      description: 'Ed25519 digital signature signing and RFC 8785 canonical Merkle tree audit inspection.',
      color: '#4f46e5',
      icon: '🔒'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please provide your full name, enterprise email, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      organization: organization.trim(),
      department: department.trim()
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        `Workstation established for ${res.user?.name}! Cryptographic Ed25519 keypair signed and persisted.`
      );
    } else {
      setErrorMessage(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-portal-container">
      {/* Ambient Atmospheric Light Orbs & Dot Matrix */}
      <div className="ambient-background-canvas" aria-hidden="true">
        <div className="ambient-light-orb orb-cobalt" />
        <div className="ambient-light-orb orb-amber" />
        <div className="ambient-light-orb orb-emerald" />
        <div className="ambient-dot-matrix" />
      </div>

      {/* Top Floating Control Bar */}
      <div className="login-top-bar">
        <button
          type="button"
          className="login-top-link flex items-center gap-1.5"
          onClick={onNavigateToLogin}
        >
          <ChevronLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="login-network-badge">
            <span className="network-indicator-dot" />
            <span>POSTGRESQL ACID PERSISTENCE</span>
          </div>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="login-theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="login-card-wrapper login-card-enter border-beam-card" style={{ maxWidth: '640px' }}>
        <div className="login-card-glow-accent" />

        <div className="login-card-inner">
          {/* Header Section */}
          <div className="login-header-section login-hero-brand">
            <div className="login-brand-mark anim-float">
              <Cpu size={24} color="#ffffff" />
              <div className="mark-glow" />
            </div>

            <h1 className="login-title text-gradient-animated">AETHERIS</h1>
            <p className="login-tagline login-tagline-enter">
              Register New Enterprise Workstation
            </p>
            <div className="login-trust-pill anim-fade-in-up delay-300">
              <Shield size={12} className="trust-icon" />
              <span>PostgreSQL ACID Relational Storage • Ed25519 Key Generation • RBAC Enforced</span>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-grid-2col">
              <div className="form-field-group">
                <label className="form-field-label">Full Legal Name</label>
                <div className="form-input-box">
                  <UserIcon size={15} className="input-leading-icon" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="form-text-input"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Enterprise Email</label>
                <div className="form-input-box">
                  <Mail size={15} className="input-leading-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@aetheris.ai"
                    className="form-text-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Workstation Master Password</label>
              <div className="form-input-box">
                <Lock size={15} className="input-leading-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong enterprise passphrase"
                  className="form-text-input"
                  minLength={6}
                />
                <button
                  type="button"
                  className="input-trailing-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Stored as a salted bcrypt hash in PostgreSQL. Never transmitted in plain text.
              </span>
            </div>

            <div className="form-grid-2col">
              <div className="form-field-group">
                <label className="form-field-label">Organization Name</label>
                <div className="form-input-box">
                  <Building size={15} className="input-leading-icon" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="form-text-input"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Department / Unit</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="form-text-input no-icon"
                />
              </div>
            </div>

            {/* Role Selection Grid */}
            <div className="form-field-group">
              <label className="form-field-label flex items-center justify-between">
                <span>RBAC Privilege Level</span>
                <span className="text-xs text-blue-500 font-mono">ENFORCED SERVER-SIDE</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1.5">
                {roleOptions.map((opt) => {
                  const isSelected = role === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setRole(opt.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs flex items-center gap-1.5">
                          <span>{opt.icon}</span>
                          <span>{opt.name}</span>
                        </span>
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                          style={{
                            color: opt.color,
                            borderColor: `${opt.color}40`,
                            backgroundColor: `${opt.color}15`
                          }}
                        >
                          {opt.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-tight line-clamp-2">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cryptographic Key Generation Banner */}
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400 flex items-start gap-2">
              <Key size={14} className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <span className="font-semibold">Automatic Ed25519 Keypair Generation</span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Upon registration, the backend generates an asymmetric Ed25519 keypair for your user.
                  Your public key will be registered to sign and verify multi-agent Merkle DAG state blocks.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="btn-login-submit mt-2"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Provisioning Workstation...' : 'Generate Ed25519 Key & Register'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle to Sign In */}
          <div className="login-quick-launch-footer">
            <span>Already have an enterprise account?</span>
            <button
              type="button"
              className="quick-launch-link"
              onClick={onNavigateToLogin}
            >
              ⚡ Return to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
