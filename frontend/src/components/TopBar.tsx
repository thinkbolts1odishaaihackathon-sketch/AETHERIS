import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Key,
  Sparkles,
  Sun,
  Moon,
  Activity,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Shield,
  Cpu,
  Wifi
} from 'lucide-react';
import type { GeminiConfig } from '../types';

interface TopBarProps {
  activeTab: string;
  geminiConfig: GeminiConfig;
  onOpenConfig: () => void;
  onOpenPromptModal?: () => void;
  onOpenCommandPalette?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenInspector?: (content: any) => void;
  apiLatencyMs?: number;
  blockHeight?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  geminiConfig,
  onOpenConfig,
  onOpenPromptModal,
  onOpenCommandPalette,
  theme = 'dark',
  onToggleTheme,
  onOpenInspector,
  apiLatencyMs = 24,
  blockHeight = 849202
}) => {
  const [corridorMenuOpen, setCorridorMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('Production Munich L0');
  const corridorRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (corridorRef.current && !corridorRef.current.contains(e.target as Node)) {
        setCorridorMenuOpen(false);
      }
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabLabels: Record<string, { category: string; title: string }> = {
    dashboard: { category: 'Executive Overview', title: 'Executive Operations Command Hub' },
    mission: { category: 'Autonomous Operations', title: 'Swarm Mission Control' },
    compliance: { category: 'Regulatory Governance', title: 'Autonomous Compliance Sentinel' },
    operations: { category: 'Supply Chain & Logistics', title: 'Complex Operations Conductor' },
    competitive: { category: 'Market Intelligence', title: 'Market Alpha & Arbitrage Intel' },
    problem: { category: 'Strategy & Architecture', title: 'Executive Strategic Briefing' },
    whitepaper: { category: 'Executive Research', title: 'Strategic Monograph & ROI Framework' }
  };

  const currentTabInfo = tabLabels[activeTab] || tabLabels.dashboard;

  const corridors = [
    { id: 'eu', flag: '🇪🇺', name: 'EU CSRD / AI Act', status: 'Cleared', type: 'ok', detail: 'Zero regulatory drift, 100% compliant' },
    { id: 'us', flag: '🇺🇸', name: 'US EAR / BIS Export', status: 'Zero Violations', type: 'ok', detail: 'Dual-use classification verified' },
    { id: 'in', flag: '🇮🇳', name: 'India FEMA / ODI', status: 'Authorized', type: 'ok', detail: 'RBI reporting auto-submitted' },
    { id: 'ae', flag: '🇦🇪', name: 'UAE DIFC / ADGM', status: 'Conduit Active', type: 'ok', detail: 'Low-tax SPV structuring cleared' },
    { id: 'cbam', flag: '⚡', name: 'EU CBAM Carbon Tariff', status: 'Auto-Offset Active', type: 'alert', detail: 'Emissions neutralized in tier-3 supplier' }
  ];

  const workspaces = [
    { id: 'prod-munich', name: 'Production Munich L0', region: 'EU-Central (Frankfurt)', status: 'Live Mesh' },
    { id: 'us-east-staging', name: 'Airbus Defense Staging', region: 'US-East (Virginia)', status: 'Sandboxed' },
    { id: 'apac-singapore', name: 'APAC Logistics Corridor', region: 'AP-Southeast (Singapore)', status: 'Warm Replica' }
  ];

  return (
    <header className="top-command-bar glass-topbar">
      {/* Left: Active Workspace Selector & Breadcrumbs */}
      <div className="topbar-left-cluster">
        {/* Active Workspace Selector */}
        <div className="workspace-selector-wrapper" ref={workspaceRef}>
          <button
            className="workspace-selector-btn"
            onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
            title="Switch Active Autonomous Swarm Workspace"
          >
            <div className="workspace-dot-live" />
            <span className="workspace-label font-mono">{activeWorkspace}</span>
            <ChevronDown size={11} className={`workspace-chevron ${workspaceMenuOpen ? 'open' : ''}`} />
          </button>

          {workspaceMenuOpen && (
            <div className="workspace-dropdown glass-panel anim-fade-in-scale">
              <div className="dropdown-section-title">ACTIVE SWARM WORKSPACES</div>
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className={`workspace-item ${activeWorkspace === ws.name ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    setWorkspaceMenuOpen(false);
                  }}
                >
                  <div className="ws-item-info">
                    <span className="ws-name">{ws.name}</span>
                    <span className="ws-region font-mono">{ws.region}</span>
                  </div>
                  <span className="ws-status-badge">{ws.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="breadcrumb-separator-bar">/</span>

        {/* Breadcrumb Context */}
        <div className="topbar-breadcrumbs">
          <span className="breadcrumb-category font-mono">{currentTabInfo.category}</span>
          <span className="breadcrumb-divider">/</span>
          <h2 className="breadcrumb-current-title">{currentTabInfo.title}</h2>
        </div>
      </div>

      {/* Center: Command Palette Trigger — pulsing cyan glow border */}
      <div className="topbar-center">
        {onOpenCommandPalette && (
          <button
            id="topbar-cmd-k-btn"
            className="topbar-search-trigger glow-cmd-k cmd-trigger-glow btn-premium focus-glow"
            onClick={onOpenCommandPalette}
            title="Open Global Command Palette (⌘K or Ctrl+K)"
          >
            <Search size={14} className="search-icon" />
            <span className="search-placeholder">Quick search actions, agents, Merkle blocks...</span>
            <kbd className="cmd-k-chip font-mono">⌘K</kbd>
          </button>
        )}
      </div>

      {/* Right: Real-time System Pulse, Corridors, & Engine Toggles */}
      <div className="topbar-actions">
        {/* Real-time System Pulse Indicator */}
        <div className="system-pulse-indicator">
          {/* Latency */}
          <div
            className="pulse-chip anim-fade-in-up delay-0"
            title="Mesh API Gateway Latency"
          >
            <Wifi size={12} className="pulse-icon cyan" />
            <span className="pulse-label">API:</span>
            <span className="pulse-val font-mono tabular-nums">{apiLatencyMs}ms</span>
          </div>

          {/* Swarm Health */}
          <div
            className="pulse-chip anim-fade-in-up delay-100"
            title="Autonomous Swarm Agents Online"
          >
            <Cpu size={12} className="pulse-icon emerald" />
            <span className="pulse-label">Swarm:</span>
            <span className="pulse-val font-mono tabular-nums">5/5 Online</span>
          </div>

          {/* Merkle Block Height */}
          <div
            className="pulse-chip clickable anim-fade-in-up delay-200"
            onClick={() => onOpenInspector && onOpenInspector({ type: 'merkle' })}
            title="Inspect Cryptographic Merkle Block Height"
          >
            <Shield size={12} className="pulse-icon blue" />
            <span className="pulse-label">Block:</span>
            <span className="pulse-val font-mono tabular-nums">#{blockHeight.toLocaleString()}</span>
          </div>
        </div>

        {/* Interactive Cross-Border Corridors Dropdown */}
        <div className="corridor-monitor-wrapper" ref={corridorRef}>
          <button
            className="corridor-monitor-pill hover-lift-sm focus-glow"
            onClick={() => setCorridorMenuOpen((prev) => !prev)}
            title="View Active Cross-Border Statutory Corridors"
          >
            <span className="corridor-live-pulse" />
            <span className="corridor-flags">🇪🇺 🇺🇸 🇮🇳 🇦🇪</span>
            <span className="corridor-summary-text">4 Corridors</span>
            <ChevronDown size={12} className={`corridor-chevron ${corridorMenuOpen ? 'open' : ''}`} />
          </button>

          {corridorMenuOpen && (
            <div className="corridor-dropdown-menu glass-panel">
              <div className="corridor-dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={13} color="#2563eb" />
                  <span className="corridor-menu-title">Active Statutory Corridors</span>
                </div>
                <span className="corridor-all-clear-badge">Zero Breaches</span>
              </div>

              <div className="corridor-list">
                {corridors.map((c) => (
                  <div
                    key={c.id}
                    className="corridor-item"
                    onClick={() => {
                      if (onOpenInspector) {
                        onOpenInspector({ type: 'compliance', corridorId: c.id });
                        setCorridorMenuOpen(false);
                      }
                    }}
                  >
                    <span className="corridor-item-flag">{c.flag}</span>
                    <div className="corridor-item-info">
                      <div className="corridor-item-name">{c.name}</div>
                      <div className="corridor-item-detail">{c.detail}</div>
                    </div>
                    <span className={`corridor-status-tag ${c.type}`}>
                      {c.type === 'ok' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Master Swarm Prompt */}
        {onOpenPromptModal && (
          <button
            id="topbar-master-prompt-btn"
            className="topbar-action-btn prompt-btn"
            onClick={onOpenPromptModal}
            title="Inspect Master Multi-Agent Swarm Prompt"
          >
            <Sparkles size={14} className="sparkle-icon" />
            <span>Master Prompt</span>
          </button>
        )}

        {/* Gemini Engine Toggle */}
        <button
          id="topbar-gemini-config-btn"
          className="topbar-action-btn gemini-btn"
          onClick={onOpenConfig}
          title="Configure Google Gemini API Engine"
        >
          <span
            className="gemini-status-dot"
            style={{
              backgroundColor: geminiConfig.isLive && geminiConfig.apiKey ? '#10b981' : '#00f2fe'
            }}
          />
          <Key size={13} />
          <span>{geminiConfig.isLive && geminiConfig.apiKey ? 'Gemini 2.0 Live' : 'Gemini Engine'}</span>
        </button>

        {/* Theme Switcher */}
        {onToggleTheme && (
          <button
            id="topbar-theme-toggle-btn"
            className="topbar-theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Studio Light Mode' : 'Switch to Obsidian Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} className="sun-icon" /> : <Moon size={15} className="moon-icon" />}
          </button>
        )}
      </div>
    </header>
  );
};
