import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Globe,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';

export interface NavDrawerItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  badge?: string;
  highlightBadge?: boolean;
  shortcut: string;
  description: string;
}

export interface NavDrawerSection {
  group: string;
  items: NavDrawerItem[];
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  liveThroughputGain: string;
  complianceScore: string;
  arbitrageSavings: string;
  onOpenAuditModal?: () => void;
  onOpenAuthModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  liveThroughputGain,
  complianceScore,
  arbitrageSavings,
  onOpenAuditModal,
  onOpenAuthModal
}) => {
  const [activeDrawerSection, setActiveDrawerSection] = useState<number | null>(null);

  const navSections: NavDrawerSection[] = [
    {
      group: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Executive Command Hub',
          sublabel: 'Live Operations & KPIs',
          icon: LayoutDashboard,
          badge: 'Overview',
          highlightBadge: true,
          shortcut: '1',
          description: 'High-density decision cockpit with active disruption mitigation and live inventory stream.'
        }
      ]
    },
    {
      group: 'AUTONOMOUS OPERATIONS',
      items: [
        {
          id: 'mission',
          label: 'Swarm Mission Control',
          sublabel: '5-Agent Cognitive Mesh',
          icon: Cpu,
          badge: '5 Agents',
          highlightBadge: true,
          shortcut: '2',
          description: 'Multi-agent orchestration DAG, live deliberation logs, and autonomous mission executions.'
        },
        {
          id: 'compliance',
          label: 'Compliance Sentinel',
          sublabel: 'Statutory Zero-Drift',
          icon: ShieldCheck,
          badge: '99.7%',
          shortcut: '3',
          description: 'Cross-border statutory tracking across EU AI Act, CSRD, US EAR99, and German LkSG.'
        },
        {
          id: 'operations',
          label: 'Operations Conductor',
          sublabel: 'Multimodal Corridors',
          icon: Zap,
          badge: '4 Corridors',
          shortcut: '4',
          description: 'Self-healing corridors, multi-modal rail & maritime bypass, and real-time inventory telemetry.'
        }
      ]
    },
    {
      group: 'MARKET INTELLIGENCE',
      items: [
        {
          id: 'competitive',
          label: 'Market Alpha Intel',
          sublabel: 'Arbitrage & Moats',
          icon: Layers,
          badge: 'Active',
          shortcut: '5',
          description: 'Real-time competitive pricing elasticity, supplier bid arbitrage, and margin optimization.'
        }
      ]
    },
    {
      group: 'STRATEGY & ARCHITECTURE',
      items: [
        {
          id: 'problem',
          label: 'Strategic Briefing',
          sublabel: 'Theoretical Foundation',
          icon: Globe,
          badge: 'Theory',
          shortcut: '6',
          description: 'Empirical scale trilemma analysis, cognitive architecture rationale, and enterprise moats.'
        },
        {
          id: 'whitepaper',
          label: 'Executive Monograph',
          sublabel: 'ROI & Capital Modeling',
          icon: Terminal,
          badge: 'Docs',
          shortcut: '7',
          description: 'Comprehensive financial modeling, 10x ROI multipliers, and statutory compliance framework.'
        }
      ]
    }
  ];

  // Flat items list for keyboard shortcuts [1-7]
  const allItems = navSections.flatMap((s) => s.items);

  // Keyboard shortcut listener [1-7]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= allItems.length) {
          const item = allItems[num - 1];
          if (item) {
            e.preventDefault();
            onTabChange(item.id);
            setActiveDrawerSection(null);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allItems, onTabChange]);

  return (
    <>
      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`} aria-label="Command Dock Navigation">
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand" onClick={() => onTabChange('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-mark">
              <Cpu size={20} className="brand-logo-icon" />
              <span className="logo-glow" />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <div className="brand-title-row">
                  <span className="brand-name">AETHERIS</span>
                  <span className="brand-version-pill font-mono">v2.6</span>
                </div>
                <div className="brand-system-status">
                  <span className="live-dot" />
                  <span className="system-status-text">Autonomous Mesh Active</span>
                </div>
              </div>
            )}
          </div>

          <button
            className="sidebar-collapse-toggle"
            onClick={() => {
              setActiveDrawerSection(null);
              onToggleCollapse();
            }}
            title={isCollapsed ? 'Expand navigation dock' : 'Collapse navigation dock'}
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Rail / List */}
        <nav className="sidebar-nav">
          {navSections.map((section, sIdx) => {
            const isDrawerOpen = activeDrawerSection === sIdx;

            return (
              <div key={sIdx} className="nav-group">
                {!isCollapsed && <div className="nav-group-label">{section.group}</div>}
                
                <div className="nav-group-items">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`sidebar-nav-${item.id}`}
                        className={`sidebar-nav-item hover-lift-sm focus-glow ${isActive ? 'active' : ''} ${isDrawerOpen ? 'drawer-opened' : ''}`}
                        onClick={() => {
                          onTabChange(item.id);
                          if (isCollapsed) {
                            setActiveDrawerSection((prev) => (prev === sIdx ? null : sIdx));
                          }
                        }}
                        title={`${item.label} [${item.shortcut}]`}
                      >
                        <div className="nav-item-icon-box">
                          <Icon size={18} />
                          {isCollapsed && isActive && <span className="dock-active-dot" />}
                        </div>

                        {!isCollapsed && (
                          <>
                            <div className="nav-item-content">
                              <div className="nav-item-header-row">
                                <span className="nav-item-title">{item.label}</span>
                                <kbd className="shortcut-kbd-chip font-mono tabular-nums">{item.shortcut}</kbd>
                              </div>
                              <span className="nav-item-subtitle">{item.sublabel}</span>
                            </div>

                            {item.badge && (
                              <span className={`nav-item-badge ${item.highlightBadge ? 'highlight' : ''}`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {isActive && <span className="active-indicator nav-active-bar" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Health Widget / Quick Merkle Trigger (Only when expanded) */}
        {!isCollapsed && (
          <div className="sidebar-health-widget glass-sheen border-beam-card">
            <div className="health-widget-header">
              <div className="health-title">
                <Sparkles size={12} className="sparkle-tint" />
                <span>Enterprise Swarm Health</span>
              </div>
              <span className="health-status-badge">Nominal</span>
            </div>

            <div className="health-metrics-grid">
              <div className="health-metric">
                <span className="metric-label">Velocity</span>
                <span className="metric-value orange font-mono tabular-nums">{liveThroughputGain}</span>
              </div>
              <div className="health-metric">
                <span className="metric-label">Compliance</span>
                <span className="metric-value blue font-mono tabular-nums">{complianceScore}</span>
              </div>
              <div className="health-metric full-width">
                <span className="metric-label">Arbitrage Capital Saved</span>
                <span className="metric-value emerald font-mono tabular-nums">{arbitrageSavings}</span>
              </div>
            </div>

            {onOpenAuditModal && (
              <button
                id="sidebar-audit-proof-btn"
                className="btn-sidebar-audit"
                onClick={onOpenAuditModal}
                title="Inspect Cryptographic SHA-256 Merkle Ledger"
              >
                <Lock size={12} />
                <span>Merkle Proof Ledger</span>
              </button>
            )}
          </div>
        )}

        {/* Collapsed Compact Merkle Quick Trigger */}
        {isCollapsed && onOpenAuditModal && (
          <div className="collapsed-rail-bottom-actions">
            <button
              className="rail-icon-btn"
              onClick={onOpenAuditModal}
              title="Inspect Merkle Proof Ledger"
            >
              <Lock size={16} />
            </button>
          </div>
        )}

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <UserProfileMenu onOpenAuthModal={onOpenAuthModal} isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* ===================== SLIDE-OUT CONTEXTUAL DRAWER (FOR COLLAPSED DOCK) ===================== */}
      {isCollapsed && activeDrawerSection !== null && (
        <div
          className="dock-contextual-drawer-overlay"
          onClick={() => setActiveDrawerSection(null)}
        >
          <div
            className="dock-contextual-drawer glass-panel anim-slide-bottom"
            onClick={(e) => e.stopPropagation()}
            style={{
              top: `${Math.max(64, activeDrawerSection * 120 + 70)}px`
            }}
          >
            <div className="dock-drawer-header">
              <span className="dock-drawer-section-title">
                {navSections[activeDrawerSection].group}
              </span>
              <kbd className="dock-drawer-close-chip" onClick={() => setActiveDrawerSection(null)}>
                Esc
              </kbd>
            </div>

            <div className="dock-drawer-items">
              {navSections[activeDrawerSection].items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <div
                    key={item.id}
                    className={`dock-drawer-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onTabChange(item.id);
                      setActiveDrawerSection(null);
                    }}
                  >
                    <div className="drawer-item-icon-box">
                      <Icon size={18} />
                    </div>
                    <div className="drawer-item-content">
                      <div className="drawer-item-top">
                        <span className="drawer-item-title">{item.label}</span>
                        <kbd className="font-mono tabular-nums">[{item.shortcut}]</kbd>
                      </div>
                      <p className="drawer-item-desc">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
