import React, { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  ChevronDown,
  Key,
  Copy,
  Check,
  Building,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

interface UserProfileMenuProps {
  onOpenAuthModal: () => void;
  isCollapsed?: boolean;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ onOpenAuthModal, isCollapsed = false }) => {
  const { user, isAuthenticated, switchRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [switching, setSwitching] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyKey = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.publicKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRoleSwitch = async (role: UserRole) => {
    setSwitching(true);
    await switchRole(role);
    setSwitching(false);
  };

  if (!isAuthenticated || !user) {
    if (isCollapsed) {
      return (
        <button
          id="btn-header-signin-collapsed"
          className="btn-primary"
          onClick={onOpenAuthModal}
          style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
          title="Enterprise Sign In"
        >
          <Key size={16} />
        </button>
      );
    }
    return (
      <button
        id="btn-header-signin"
        className="btn-primary"
        onClick={onOpenAuthModal}
        style={{ padding: '7px 14px', fontSize: '0.8rem' }}
      >
        <Key size={14} />
        <span>Enterprise Sign In</span>
      </button>
    );
  }

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    executive: { label: 'Executive Board', badge: 'COMMAND // L0', color: '#2563eb' },
    compliance_officer: { label: 'Compliance Officer', badge: 'GOVERNANCE // L1', color: '#0284c7' },
    operations_director: { label: 'Operations Director', badge: 'EXECUTION // L1', color: '#ff6b00' },
    auditor: { label: 'Cryptographic Auditor', badge: 'INTEGRITY // L2', color: '#4f46e5' }
  };

  const currentRoleInfo = roleLabels[user.role] || roleLabels.executive;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`user-profile-menu-container ${isCollapsed ? 'collapsed' : ''}`} ref={menuRef}>
      <button
        className={`user-profile-trigger ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={`${user.name} (${currentRoleInfo.label} - ${currentRoleInfo.badge})`}
        aria-label={`User profile for ${user.name}`}
      >
        <div className="user-avatar-circle" style={{ background: user.avatarColor || currentRoleInfo.color }}>
          {initials}
        </div>
        {!isCollapsed && (
          <>
            <div className="user-info-text">
              <div className="user-display-name">{user.name}</div>
              <div className="user-role-badge" style={{ color: currentRoleInfo.color }}>
                {currentRoleInfo.badge}
              </div>
            </div>
            <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className={`user-profile-dropdown glass-panel ${isCollapsed ? 'flyout-right' : ''}`}>
          {/* Header Info */}
          <div className="dropdown-user-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-avatar-circle large" style={{ background: user.avatarColor || currentRoleInfo.color }}>
                {initials}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.94rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Building size={11} /> {user.organization}
                </div>
              </div>
            </div>

            {/* Public Key Card */}
            <div className="dropdown-key-box font-mono">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ed25519 Public Key</span>
                <button className="btn-mini-copy" onClick={handleCopyKey} title="Copy Key">
                  {copiedKey ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                </button>
              </div>
              <div className="key-snippet">{user.publicKey}</div>
            </div>
          </div>

          {/* Fast RBAC Role Switcher */}
          <div className="dropdown-role-section">
            <span className="role-switch-label">
              <RotateCcw size={11} style={{ display: 'inline', marginRight: '4px' }} />
              Fast Role Switcher (Simulate RBAC Permissions)
            </span>
            <div className="role-pills-list">
              {(['executive', 'compliance_officer', 'operations_director', 'auditor'] as UserRole[]).map((r) => {
                const isSelected = user.role === r;
                const info = roleLabels[r];
                return (
                  <button
                    key={r}
                    className={`role-select-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleRoleSwitch(r)}
                    disabled={switching}
                  >
                    <span className="dot" style={{ background: info.color }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{info.label}</span>
                    {isSelected && <span className="active-tag">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="dropdown-footer">
            <button
              className="dropdown-action-btn logout"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              <LogOut size={14} />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
