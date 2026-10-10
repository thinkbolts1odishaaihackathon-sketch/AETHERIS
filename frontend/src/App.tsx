import { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProblemStatementExplorer } from './components/ProblemStatementExplorer';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { SwarmVisualizer } from './components/SwarmVisualizer';
import { MissionControl } from './components/MissionControl';
import { ComplianceRadar } from './components/ComplianceRadar';
import { OperationsConductor } from './components/OperationsConductor';
import { CompetitiveAlpha } from './components/CompetitiveAlpha';
import { StrategicWhitepaper } from './components/StrategicWhitepaper';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MasterPromptModal } from './components/MasterPromptModal';
import { CommandPalette } from './components/CommandPalette';
import { AuditProofModal } from './components/AuditProofModal';
import { AuthModal } from './components/AuthModal';
import { InspectorDrawer, type DrawerContentType } from './components/InspectorDrawer';
import { INITIAL_AGENTS } from './data/mockEnterpriseData';
import { getStoredGeminiConfig } from './services/geminiService';
import { useAuth } from './context/AuthContext';
import type { Agent, GeminiConfig } from './types';

export function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string | undefined>(undefined);
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>(getStoredGeminiConfig());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [injectedDirective, setInjectedDirective] = useState<string | undefined>(undefined);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Split-Pane / Drawer Workspace State
  const [inspectorContent, setInspectorContent] = useState<DrawerContentType>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Theme Management: Premium Obsidian Dark default
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('aetheris_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('aetheris_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isInspectorOpen) {
        setIsInspectorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInspectorOpen]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleApplyPromptToRunner = (promptText: string) => {
    setActiveTab('mission');
    setInjectedDirective(promptText);
  };

  const handleOpenInspector = (content: any) => {
    setInspectorContent(content);
    setIsInspectorOpen(true);
  };

  // Splash Loading Screen
  if (isLoading) {
    return (
      <div className="app-loading-screen">
        <div className="loading-logo-box">
          <Cpu size={36} className="brand-logo-icon spin-icon-slow" />
          <span className="logo-glow" />
        </div>
        <div className="loading-text-block">
          <h2 className="loading-title">AETHERIS AEOS</h2>
          <p className="loading-subtitle">Verifying enterprise cryptographic session...</p>
        </div>
      </div>
    );
  }

  // Proper Authentication Gate: Require Login or Register if not authenticated
  if (!isAuthenticated || !user) {
    if (authScreen === 'register') {
      return (
        <RegisterPage
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <LoginPage
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigateToRegister={() => setAuthScreen('register')}
      />
    );
  }

  // Authenticated State: Full Executive Workspace
  return (
    <div className="app-shell">
      {/* Ambient Atmospheric Light Orbs & Dot Matrix for Realistic Glassmorphism */}
      <div className="ambient-background-canvas" aria-hidden="true">
        <div className="ambient-light-orb orb-cobalt" />
        <div className="ambient-light-orb orb-amber" />
        <div className="ambient-light-orb orb-emerald" />
        <div className="ambient-dot-matrix" />
      </div>

      {/* Left Collapsible Executive Command Dock */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        liveThroughputGain="+4.2x Velocity"
        complianceScore="99.7% Zero-Drift"
        arbitrageSavings="$3.4M YTD"
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Stage */}
      <div className={`app-main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sleek Top Command Bar */}
        <TopBar
          activeTab={activeTab}
          geminiConfig={geminiConfig}
          onOpenConfig={() => setIsApiKeyModalOpen(true)}
          onOpenPromptModal={() => setIsPromptModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenInspector={handleOpenInspector}
          apiLatencyMs={24}
          blockHeight={849202}
        />

        {/* Viewport Content — each tab wrapped in page-enter for spring transition */}
        <main className="main-viewport">
          {activeTab === 'dashboard' && (
            <div key="dashboard" className="page-enter">
              <ExecutiveDashboard
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
                agents={agents}
                onOpenInspector={handleOpenInspector}
              />
            </div>
          )}

          {activeTab === 'problem' && (
            <div key="problem" className="page-enter">
              <ProblemStatementExplorer onDispatchToMission={handleApplyPromptToRunner} />
            </div>
          )}

          {activeTab === 'mission' && (
            <div key="mission" className="mission-control-view page-enter">
              <SwarmVisualizer
                agents={agents}
                activeAgentId={activeAgentId}
                isExecuting={agents.some((a) => a.status === 'executing' || a.status === 'deliberating')}
                onSelectAgent={(id) => setActiveAgentId(id)}
                onOpenInspector={handleOpenInspector}
              />
              <MissionControl
                agents={agents}
                onAgentsUpdate={setAgents}
                activeAgentId={activeAgentId}
                onActiveAgentChange={setActiveAgentId}
                geminiConfig={geminiConfig}
                onOpenPromptModal={() => setIsPromptModalOpen(true)}
                injectedDirective={injectedDirective}
              />
            </div>
          )}

          {activeTab === 'compliance' && (
            <div key="compliance" className="page-enter"><ComplianceRadar /></div>
          )}

          {activeTab === 'operations' && (
            <div key="operations" className="page-enter"><OperationsConductor /></div>
          )}

          {activeTab === 'competitive' && (
            <div key="competitive" className="page-enter"><CompetitiveAlpha /></div>
          )}

          {activeTab === 'whitepaper' && (
            <div key="whitepaper" className="page-enter"><StrategicWhitepaper /></div>
          )}
        </main>
      </div>

      {/* ===================== SIDE-BY-SIDE INSPECTOR DRAWER ===================== */}
      <InspectorDrawer
        isOpen={isInspectorOpen}
        content={inspectorContent}
        onClose={() => setIsInspectorOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsInspectorOpen(false);
        }}
      />

      {/* Global Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        config={geminiConfig}
        onSave={setGeminiConfig}
      />

      <MasterPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onApplyPromptToRunner={handleApplyPromptToRunner}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <AuditProofModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
