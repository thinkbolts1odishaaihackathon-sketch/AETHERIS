import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Globe,
  FileCode,
  Key,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onOpenPromptModal: () => void;
  onOpenApiKeyModal: () => void;
  onOpenAuditModal: () => void;
  onOpenAuthModal?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onTriggerSimulate?: (simType: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Simulation' | 'System' | 'Theme';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenPromptModal,
  onOpenApiKeyModal,
  onOpenAuditModal,
  onOpenAuthModal,
  theme,
  onToggleTheme,
  onTriggerSimulate
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'nav-problem',
      category: 'Navigation',
      title: 'Problem Statement & Market Asymmetry',
      subtitle: 'Understand the empirical scale trilemma, competitive moats & the autonomous paradigm',
      icon: <Globe size={16} color="#2563eb" />,
      shortcut: 'G P',
      action: () => {
        onSelectTab('problem');
        onClose();
      }
    },
    {
      id: 'nav-mission',
      category: 'Navigation',
      title: 'Swarm Mission Control',
      subtitle: 'Real-time multi-agent deliberation graph and autonomous mission runner',
      icon: <Cpu size={16} color="#2563eb" />,
      shortcut: 'G M',
      action: () => {
        onSelectTab('mission');
        onClose();
      }
    },
    {
      id: 'nav-compliance',
      category: 'Navigation',
      title: 'Autonomous Compliance Sentinel',
      subtitle: 'Cross-border statutory tracking across EU AI Act, CSRD, CBAM & US EAR',
      icon: <ShieldCheck size={16} color="#059669" />,
      shortcut: 'G C',
      action: () => {
        onSelectTab('compliance');
        onClose();
      }
    },
    {
      id: 'nav-operations',
      category: 'Navigation',
      title: 'Complex Operations & Routing Conductor',
      subtitle: 'Self-healing corridors, multi-modal rail & maritime bypass',
      icon: <Zap size={16} color="#ff6b00" />,
      shortcut: 'G O',
      action: () => {
        onSelectTab('operations');
        onClose();
      }
    },
    {
      id: 'nav-competitive',
      category: 'Navigation',
      title: 'Market Alpha & Competitor Intelligence',
      subtitle: 'Autonomous competitor surveillance and dynamic price elasticity undercutting',
      icon: <Layers size={16} color="#ea580c" />,
      shortcut: 'G A',
      action: () => {
        onSelectTab('competitive');
        onClose();
      }
    },
    {
      id: 'nav-whitepaper',
      category: 'Navigation',
      title: 'Strategic Monograph & Executive ROI',
      subtitle: 'Interactive multi-agent ROI calculator & architectural whitepaper',
      icon: <FileCode size={16} color="#4f46e5" />,
      shortcut: 'G W',
      action: () => {
        onSelectTab('whitepaper');
        onClose();
      }
    },
    {
      id: 'sim-drift',
      category: 'Simulation',
      title: 'Simulate EU CBAM Regulatory Drift',
      subtitle: 'Trigger statutory shock and watch Regulatory Sentinel auto-remediate',
      icon: <RotateCcw size={16} color="#0284c7" />,
      shortcut: 'S D',
      action: () => {
        onSelectTab('compliance');
        if (onTriggerSimulate) onTriggerSimulate('drift');
        onClose();
      }
    },
    {
      id: 'sim-choke',
      category: 'Simulation',
      title: 'Simulate Global Choke Point Bottleneck',
      subtitle: 'Simulate Red Sea / Suez blockage and watch Operations Conductor reroute',
      icon: <RotateCcw size={16} color="#ff6b00" />,
      shortcut: 'S C',
      action: () => {
        onSelectTab('operations');
        if (onTriggerSimulate) onTriggerSimulate('choke');
        onClose();
      }
    },
    {
      id: 'sim-counter',
      category: 'Simulation',
      title: 'Simulate Competitor Counter-Move',
      subtitle: 'Trigger Market Alpha Strategist to outmaneuver Tier-1 incumbent bid',
      icon: <RotateCcw size={16} color="#ea580c" />,
      shortcut: 'S M',
      action: () => {
        onSelectTab('competitive');
        if (onTriggerSimulate) onTriggerSimulate('counter');
        onClose();
      }
    },
    {
      id: 'sys-audit',
      category: 'System',
      title: 'Inspect Cryptographic Merkle Ledger',
      subtitle: 'View SHA-256 state proof tree and multi-agent Ed25519 signatures',
      icon: <Lock size={16} color="#4f46e5" />,
      shortcut: '⌘ L',
      action: () => {
        onOpenAuditModal();
        onClose();
      }
    },
    {
      id: 'sys-prompt',
      category: 'System',
      title: 'View Master Swarm System Prompt',
      subtitle: 'Inspect prompt engineering architecture driving all 5 autonomous agents',
      icon: <Sparkles size={16} color="#ff6b00" />,
      shortcut: '⌘ P',
      action: () => {
        onOpenPromptModal();
        onClose();
      }
    },
    {
      id: 'sys-api',
      category: 'System',
      title: 'Configure Google Gemini API Engine',
      subtitle: 'Set API key, model selection (1.5 Flash / 2.0 Flash) and live mode',
      icon: <Key size={16} color="#0284c7" />,
      shortcut: '⌘ K',
      action: () => {
        onOpenApiKeyModal();
        onClose();
      }
    },
    {
      id: 'sys-auth',
      category: 'System',
      title: 'Enterprise Identity & RBAC Sign In',
      subtitle: 'Switch enterprise profile, sign in, or simulate Okta / Azure SSO',
      icon: <ShieldCheck size={16} color="#2563eb" />,
      shortcut: '⌘ U',
      action: () => {
        if (onOpenAuthModal) onOpenAuthModal();
        onClose();
      }
    },
    {
      id: 'sys-theme',
      category: 'Theme',
      title: theme === 'dark' ? 'Switch to Apple Light Studio' : 'Switch to Linear Dark Obsidian',
      subtitle: theme === 'dark' ? 'Clean frosted white & cobalt blue' : 'Deep obsidian backdrop with glowing accents',
      icon: theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#a855f7" />,
      shortcut: '⌘ T',
      action: () => {
        onToggleTheme();
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop command-backdrop" onClick={onClose}>
      <div
        className="command-palette-container"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="command-search-bar">
          <Search size={18} className="command-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="command-search-input"
            placeholder="Type a command, jump to tab, or run simulation..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="command-esc-chip" onClick={onClose}>
            ESC
          </span>
        </div>

        <div className="command-list-wrapper">
          {filteredCommands.length === 0 ? (
            <div className="command-empty-state">
              <p>No matching commands found for "{query}"</p>
            </div>
          ) : (
            <div className="command-results-list">
              {filteredCommands.map((cmd, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    className={`command-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="command-item-icon">{cmd.icon}</div>
                    <div className="command-item-text">
                      <div className="command-item-title-row">
                        <span className="command-item-title">{cmd.title}</span>
                        <span className="command-item-category-tag">{cmd.category}</span>
                      </div>
                      <p className="command-item-subtitle">{cmd.subtitle}</p>
                    </div>
                    {cmd.shortcut && (
                      <div className="command-item-shortcut font-mono">
                        {cmd.shortcut}
                      </div>
                    )}
                    <ArrowRight size={14} className="command-item-enter-icon" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="command-palette-footer">
          <div className="command-footer-hints">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span>
              <kbd>↵</kbd> Select
            </span>
            <span>
              <kbd>ESC</kbd> Close
            </span>
            <span>
              <kbd>⌘K</kbd> Toggle Palette
            </span>
          </div>
          <div className="command-footer-branding">
            AETHERIS // AEOS Command Interface
          </div>
        </div>
      </div>
    </div>
  );
};
