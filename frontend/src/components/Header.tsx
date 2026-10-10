import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Zap,
  Key,
  Layers,
  Globe,
  Sparkles,
  Search,
  Sun,
  Moon,
  Lock,
  Terminal,
  Activity
} from 'lucide-react';
import type { GeminiConfig } from '../types';
import { UserProfileMenu } from './UserProfileMenu';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  geminiConfig: GeminiConfig;
  onOpenConfig: () => void;
  onOpenPromptModal?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenAuditModal?: () => void;
  onOpenAuthModal: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  liveThroughputGain: string;
  complianceScore: string;
  arbitrageSavings: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  geminiConfig,
  onOpenConfig,
  onOpenPromptModal,
  onOpenCommandPalette,
  onOpenAuditModal,
  onOpenAuthModal,
  theme = 'dark',
  onToggleTheme,
  liveThroughputGain,
  complianceScore,
  arbitrageSavings
}) => {
  return (
    <header className="executive-header">
      <div className="header-top">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 className="brand-title">
                AETHERIS
              </h1>
              <span className="aeos-badge">AEOS v2.6 // PRO</span>
              <span className="status-live-beacon">
                <span className="stitch-beacon" />
                <span>5/5 SWARM SYNCHRONIZED</span>
              </span>
            </div>
            <p className="brand-subtitle">Autonomous Enterprise Operating System • Multi-Agent Cognitive Swarm</p>
          </div>
        </div>

        <div className="header-stats-row">
          <div className="stat-chip hover-lift">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 0, 0.12)' }}>
              <Zap size={14} color="#ff6b00" />
            </div>
            <div>
              <div className="stat-chip-label">Scale Multiplier</div>
              <div className="stat-chip-val" style={{ color: '#ff6b00' }}>{liveThroughputGain}</div>
            </div>
          </div>

          <div className="stat-chip hover-lift">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.12)' }}>
              <ShieldCheck size={14} color="#2563eb" />
            </div>
            <div>
              <div className="stat-chip-label">Compliance Sentinel</div>
              <div className="stat-chip-val" style={{ color: '#2563eb' }}>{complianceScore}</div>
            </div>
          </div>

          <div className="stat-chip hover-lift">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(5, 150, 105, 0.12)' }}>
              <Layers size={14} color="#059669" />
            </div>
            <div>
              <div className="stat-chip-label">Arbitrage Capital Saved</div>
              <div className="stat-chip-val" style={{ color: '#059669' }}>{arbitrageSavings}</div>
            </div>
          </div>
        </div>

        <div className="header-controls">
          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              id="header-cmd-k-btn"
              className="btn-command-palette-trigger"
              onClick={onOpenCommandPalette}
              title="Open Command Palette (⌘K or Ctrl+K)"
            >
              <Search size={13} />
              <span>Search / Actions</span>
              <kbd className="cmd-k-badge font-mono">⌘K</kbd>
            </button>
          )}

          {/* Merkle Audit Ledger Trigger */}
          {onOpenAuditModal && (
            <button
              id="header-audit-ledger-btn"
              className="btn-audit-ledger-trigger"
              onClick={onOpenAuditModal}
              title="Inspect Cryptographic SHA-256 Merkle Ledger"
            >
              <Lock size={13} color="#4f46e5" />
              <span>Merkle Proof</span>
            </button>
          )}

          {/* Master Swarm Prompt */}
          {onOpenPromptModal && (
            <button
              id="header-master-prompt-btn"
              className="btn-master-prompt"
              onClick={onOpenPromptModal}
              title="View & Copy Master Multi-Agent System Prompt"
            >
              <Sparkles size={14} className="sparkle-anim" />
              <span>Master Prompt</span>
            </button>
          )}

          {/* Gemini Live Config */}
          <button
            id="gemini-config-btn"
            className="btn-gemini-live"
            onClick={onOpenConfig}
            title="Configure Google Gemini API Engine"
          >
            <div
              className="pulse-dot"
              style={{
                backgroundColor: geminiConfig.isLive && geminiConfig.apiKey ? '#10b981' : '#0284c7'
              }}
            />
            <Key size={14} />
            <span>
              {geminiConfig.isLive && geminiConfig.apiKey ? 'Gemini 2.0 Live' : 'Gemini Engine'}
            </span>
          </button>

          {/* Dark / Light Mode Switcher */}
          {onToggleTheme && (
            <button
              id="header-theme-toggle-btn"
              className="btn-theme-toggle"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Switch to Apple Light Studio' : 'Switch to Linear Dark Obsidian'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
            </button>
          )}

          {/* User Profile & RBAC Session Menu */}
          <UserProfileMenu onOpenAuthModal={onOpenAuthModal} />
        </div>
      </div>

      <div className="jurisdiction-ribbon">
        <span className="ribbon-label">
          <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Active Cross-Border Corridors:
        </span>
        <span className="jurisdiction-tag ok">🇪🇺 EU CSRD / AI Act: Cleared</span>
        <span className="jurisdiction-tag ok">🇺🇸 US EAR / BIS: Zero Violations</span>
        <span className="jurisdiction-tag ok">🇮🇳 India FEMA ODI: Authorized</span>
        <span className="jurisdiction-tag ok">🇦🇪 UAE DIFC / ADGM: Conduit Active</span>
        <span className="jurisdiction-tag alert">⚡ EU CBAM Carbon: Autonomous Offset Active</span>
      </div>

      <div className="tabs-navigation-wrapper">
        <nav className="nav-tabs">
          <button
            id="nav-tab-problem"
            className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`}
            onClick={() => onTabChange('problem')}
          >
            <Globe size={16} />
            <span>Problem Space &amp; PS</span>
            <span className="tab-counter highlight">Deep-Dive</span>
          </button>

          <button
            id="nav-tab-mission"
            className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
            onClick={() => onTabChange('mission')}
          >
            <Cpu size={16} />
            <span>Swarm Mission Control</span>
            <span className="tab-counter">5 Agents</span>
          </button>

          <button
            id="nav-tab-compliance"
            className={`tab-btn ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => onTabChange('compliance')}
          >
            <ShieldCheck size={16} />
            <span>Autonomous Compliance Sentinel</span>
            <span className="tab-counter">6 Frameworks</span>
          </button>

          <button
            id="nav-tab-operations"
            className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => onTabChange('operations')}
          >
            <Zap size={16} />
            <span>Complex Operations &amp; Routing</span>
            <span className="tab-counter">4 Corridors</span>
          </button>

          <button
            id="nav-tab-competitive"
            className={`tab-btn ${activeTab === 'competitive' ? 'active' : ''}`}
            onClick={() => onTabChange('competitive')}
          >
            <Layers size={16} />
            <span>Market Alpha &amp; Competitor Intel</span>
            <span className="tab-counter">3 Giants Tracked</span>
          </button>

          <button
            id="nav-tab-whitepaper"
            className={`tab-btn ${activeTab === 'whitepaper' ? 'active' : ''}`}
            onClick={() => onTabChange('whitepaper')}
          >
            <Terminal size={16} />
            <span>Strategic Monograph &amp; ROI</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
