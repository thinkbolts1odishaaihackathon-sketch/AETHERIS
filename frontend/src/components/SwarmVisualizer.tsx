import React, { useState } from 'react';
import type { Agent } from '../types';
import { Shield, Cpu, Activity, Zap, CheckCircle2, Radio, Layers, ExternalLink } from 'lucide-react';

interface SwarmVisualizerProps {
  agents: Agent[];
  activeAgentId?: string;
  isExecuting: boolean;
  onSelectAgent?: (id: string) => void;
  onOpenInspector?: (content: any) => void;
}

export const SwarmVisualizer: React.FC<SwarmVisualizerProps> = ({
  agents,
  activeAgentId,
  isExecuting,
  onSelectAgent,
  onOpenInspector
}) => {
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  // Coordinates in a 1000x260 viewBox
  const coords: Record<string, { x: number; y: number }> = {
    'agent-apex': { x: 500, y: 55 },
    'agent-sentinel': { x: 190, y: 130 },
    'agent-conductor': { x: 810, y: 130 },
    'agent-alpha': { x: 340, y: 215 },
    'agent-auditor': { x: 660, y: 215 }
  };

  const links = [
    { id: 'link-1', from: 'agent-apex', to: 'agent-sentinel', label: 'Statutory Verification', color: '#00f2fe' },
    { id: 'link-2', from: 'agent-apex', to: 'agent-conductor', label: 'Logistics Orchestration', color: '#3b82f6' },
    { id: 'link-3', from: 'agent-apex', to: 'agent-alpha', label: 'Alpha Directives', color: '#f59e0b' },
    { id: 'link-4', from: 'agent-apex', to: 'agent-auditor', label: 'Proof Sealing', color: '#10b981' },
    { id: 'link-5', from: 'agent-sentinel', to: 'agent-conductor', label: 'Regulatory Constraints', color: '#00f2fe' },
    { id: 'link-6', from: 'agent-conductor', to: 'agent-alpha', label: 'Margin & Capacity', color: '#3b82f6' },
    { id: 'link-7', from: 'agent-alpha', to: 'agent-auditor', label: 'Pricing Merkle Leaf', color: '#f59e0b' },
    { id: 'link-8', from: 'agent-sentinel', to: 'agent-auditor', label: 'Compliance Merkle Leaf', color: '#10b981' }
  ];

  const currentInspectedId = hoveredAgentId || activeAgentId || 'agent-apex';
  const inspectedAgent = agents.find((a) => a.id === currentInspectedId) || agents[0];

  const handleNodeClick = (agent: Agent) => {
    if (onSelectAgent) onSelectAgent(agent.id);
    if (onOpenInspector) {
      onOpenInspector({ type: 'agent', agent });
    }
  };

  return (
    <div className="premium-topology-card glass-panel interactive-glow">
      <div className="topology-header-row">
        <div className="topology-title-area">
          <div className="topology-title-line">
            <div className="pulse-indicator-badge">
              <Activity size={15} />
            </div>
            <h3 className="topology-heading">
              Autonomous Multi-Agent Swarm DAG Visualizer
            </h3>
            {isExecuting ? (
              <span className="topology-live-badge active font-mono">
                <Radio size={11} className="spin-icon-slow" />
                <span>SWARM PROPAGATION ACTIVE</span>
              </span>
            ) : (
              <span className="topology-live-badge synced font-mono">
                <span className="micro-dot emerald" />
                <span>DAG CONSENSUS SYNCHRONIZED</span>
              </span>
            )}
          </div>
          <p className="topology-caption">
            Hierarchical task propagation graph between L0 Apex Orchestrator and L1 specialized agents with Ed25519 Merkle proof anchoring. Click any agent node to slide in runtime telemetry.
          </p>
        </div>

        <div className="topology-legend-cluster">
          <button
            className="legend-node-chip"
            style={{ '--chip-color': '#2563eb' } as React.CSSProperties}
            onMouseEnter={() => setHoveredAgentId('agent-apex')}
            onMouseLeave={() => setHoveredAgentId(null)}
            onClick={() => {
              const a = agents.find((ag) => ag.id === 'agent-apex');
              if (a) handleNodeClick(a);
            }}
          >
            <span className="legend-node-dot" />
            <span className="font-mono">Orchestration (L0)</span>
          </button>

          <button
            className="legend-node-chip"
            style={{ '--chip-color': '#0284c7' } as React.CSSProperties}
            onMouseEnter={() => setHoveredAgentId('agent-sentinel')}
            onMouseLeave={() => setHoveredAgentId(null)}
            onClick={() => {
              const a = agents.find((ag) => ag.id === 'agent-sentinel');
              if (a) handleNodeClick(a);
            }}
          >
            <span className="legend-node-dot" />
            <span className="font-mono">Governance (L1)</span>
          </button>

          <button
            className="legend-node-chip"
            style={{ '--chip-color': '#f59e0b' } as React.CSSProperties}
            onMouseEnter={() => setHoveredAgentId('agent-conductor')}
            onMouseLeave={() => setHoveredAgentId(null)}
            onClick={() => {
              const a = agents.find((ag) => ag.id === 'agent-conductor');
              if (a) handleNodeClick(a);
            }}
          >
            <span className="legend-node-dot" />
            <span className="font-mono">Operations (L1)</span>
          </button>

          <button
            className="legend-node-chip"
            style={{ '--chip-color': '#10b981' } as React.CSSProperties}
            onMouseEnter={() => setHoveredAgentId('agent-auditor')}
            onMouseLeave={() => setHoveredAgentId(null)}
            onClick={() => {
              const a = agents.find((ag) => ag.id === 'agent-auditor');
              if (a) handleNodeClick(a);
            }}
          >
            <span className="legend-node-dot" />
            <span className="font-mono">Merkle Auditor (L2)</span>
          </button>
        </div>
      </div>

      <div className="topology-canvas-wrapper">
        <svg className="swarm-svg-canvas" viewBox="0 0 1000 270">
          <defs>
            <filter id="glowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <pattern id="svgDotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" className="svg-grid-dot" />
            </pattern>

            {/* Gradient Definitions */}
            <linearGradient id="linkGradL0" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="270" fill="url(#svgDotGrid)" rx="12" />

          {/* Links & Live Animated Signal Photons */}
          {links.map((link, idx) => {
            const start = coords[link.from];
            const end = coords[link.to];
            if (!start || !end) return null;

            const isLinkActive =
              isExecuting ||
              activeAgentId === link.from ||
              activeAgentId === link.to ||
              hoveredAgentId === link.from ||
              hoveredAgentId === link.to;

            const pathId = `link-path-${idx}`;
            const pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

            return (
              <g key={`link-${idx}`}>
                <path
                  id={pathId}
                  d={pathD}
                  className={isLinkActive ? 'swarm-link-active' : 'swarm-link-inactive'}
                  stroke={isLinkActive ? link.color : undefined}
                  strokeWidth={isLinkActive ? 2.4 : 1.2}
                  strokeDasharray={isLinkActive ? '6,4' : undefined}
                  fill="none"
                  opacity={isLinkActive ? 0.95 : 0.5}
                >
                  {isLinkActive && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="20"
                      to="0"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  )}
                </path>

                {(isExecuting || isLinkActive) && (
                  <circle r="3.5" fill={link.color} filter="url(#glowFilter)">
                    <animateMotion
                      dur={`${1.6 + (idx % 3) * 0.3}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {agents.map((agent) => {
            const pt = coords[agent.id] || { x: 500, y: 130 };
            const isActive = agent.id === activeAgentId || isExecuting;
            const isHovered = agent.id === hoveredAgentId;
            const nodeColor = agent.avatarColor;

            return (
              <g
                key={agent.id}
                className="agent-svg-node"
                transform={`translate(${pt.x}, ${pt.y})`}
                onClick={() => handleNodeClick(agent)}
                onMouseEnter={() => setHoveredAgentId(agent.id)}
                onMouseLeave={() => setHoveredAgentId(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Rotating Signal Radar Halo */}
                {isActive && (
                  <circle
                    r="38"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                    opacity="0.6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Concentric Ripple */}
                {isActive && (
                  <circle
                    r="34"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="2"
                    opacity="0.35"
                  >
                    <animate attributeName="r" values="32;42;32" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node Core */}
                <circle
                  r="28"
                  className="svg-node-core"
                  fill="var(--bg-card)"
                  stroke={isActive || isHovered ? nodeColor : 'var(--border-subtle)'}
                  strokeWidth={isActive || isHovered ? '2.5' : '1.5'}
                />

                {/* Inner Accent Ring */}
                <circle
                  r="24"
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="0.8"
                  strokeOpacity={isHovered ? 0.8 : 0.3}
                />

                {/* Agent Icon inside Node */}
                <g transform="translate(-10, -10)">
                  {agent.role === 'orchestrator' && <Cpu size={20} color={nodeColor} />}
                  {agent.role === 'compliance' && <Shield size={20} color={nodeColor} />}
                  {agent.role === 'operations' && <Zap size={20} color={nodeColor} />}
                  {agent.role === 'competitive' && <Layers size={20} color={nodeColor} />}
                  {agent.role === 'auditor' && <CheckCircle2 size={20} color={nodeColor} />}
                </g>

                {/* Agent Label Pill under Node */}
                <g transform="translate(0, 44)">
                  <rect
                    x="-68"
                    y="-11"
                    width="136"
                    height="22"
                    rx="6"
                    className="svg-node-pill-rect"
                    fill="var(--bg-elevated)"
                    stroke={isHovered ? nodeColor : 'var(--border-subtle)'}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    y="3"
                    className="svg-node-label font-mono"
                    fill="var(--text-primary)"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {agent.name.split(' ')[0]} {agent.role === 'orchestrator' ? '(L0)' : '(L1)'}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Quick Inspector Footer Bar */}
      {inspectedAgent && (
        <div className="topology-agent-footer">
          <div className="footer-left">
            <span
              className="footer-dot"
              style={{ backgroundColor: inspectedAgent.avatarColor }}
            />
            <span className="footer-agent-name">{inspectedAgent.name}</span>
            <span className="footer-badge font-mono">{inspectedAgent.badge}</span>
            <span className="footer-thought">"{inspectedAgent.currentThought}"</span>
          </div>

          <button
            className="btn-inspect-drawer"
            onClick={() => {
              if (onOpenInspector) {
                onOpenInspector({ type: 'agent', agent: inspectedAgent });
              }
            }}
          >
            <span>Inspect Runtime Telemetry</span>
            <ExternalLink size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
