#!/usr/bin/env python3
"""
AETHERIS AEOS - Technical & Operational Enterprise Manual PDF Generator
Generates a comprehensive, publication-quality PDF manual using ReportLab Platypus.
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and render total page count:
    'Page X of Y' in the running footer along with document metadata.
    """
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Suppress header and footer on the cover page
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header
        self.drawString(40, 810, "AETHERIS AEOS // Comprehensive Enterprise Manual (v2.6.4)")
        self.drawRightString(555, 810, "SPEC-2026-AEOS • FastAPI & React 19 Swarm")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(40, 804, 555, 804)

        # Running Footer
        self.line(40, 42, 555, 42)
        self.drawString(40, 30, "CONFIDENTIAL & PROPRIETARY • © 2026 AETHERIS Systems Core Group")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_text)
        self.restoreState()


def create_callout(text, title="KEY ARCHITECTURAL HIGHLIGHT", alert_type="info", styles=None):
    """Generates a styled callout box wrapped in a single-cell ReportLab Table."""
    bg_color = colors.HexColor("#EFF6FF")
    border_color = colors.HexColor("#2563EB")
    title_color = colors.HexColor("#1E40AF")

    if alert_type == "warning":
        bg_color = colors.HexColor("#FFFBEB")
        border_color = colors.HexColor("#D97706")
        title_color = colors.HexColor("#92400E")
    elif alert_type == "success":
        bg_color = colors.HexColor("#ECFDF5")
        border_color = colors.HexColor("#059669")
        title_color = colors.HexColor("#065F46")
    elif alert_type == "danger":
        bg_color = colors.HexColor("#FEF2F2")
        border_color = colors.HexColor("#DC2626")
        title_color = colors.HexColor("#991B1B")

    callout_content = [
        Paragraph(f"<b>{title}</b>", ParagraphStyle(
            'CalloutTitle', parent=styles['Normal'],
            fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=title_color
        )),
        Spacer(1, 3),
        Paragraph(text, ParagraphStyle(
            'CalloutBody', parent=styles['Normal'],
            fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=colors.HexColor("#1E293B")
        ))
    ]

    t = Table([[callout_content]], colWidths=[515])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_color),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LINELEFT', (0,0), (0,0), 3.5, border_color),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ]))
    return t


def generate_documentation_pdf(output_path: str):
    """Builds and compiles the complete enterprise documentation PDF."""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )

    base_styles = getSampleStyleSheet()
    styles = {}

    # Custom Typography Palette
    styles['Normal'] = base_styles['Normal']

    styles['CoverBadge'] = ParagraphStyle(
        'CoverBadge', fontName='Helvetica-Bold', fontSize=9, leading=12,
        textColor=colors.HexColor("#93C5FD"), textTransform='uppercase', spaceAfter=14
    )
    styles['CoverTitle'] = ParagraphStyle(
        'CoverTitle', fontName='Helvetica-Bold', fontSize=32, leading=36,
        textColor=colors.white, spaceAfter=8
    )
    styles['CoverSub'] = ParagraphStyle(
        'CoverSub', fontName='Helvetica-Bold', fontSize=14, leading=18,
        textColor=colors.HexColor("#38BDF8"), spaceAfter=14
    )
    styles['CoverDesc'] = ParagraphStyle(
        'CoverDesc', fontName='Helvetica', fontSize=10, leading=14,
        textColor=colors.HexColor("#CBD5E1"), spaceAfter=24
    )
    styles['CoverMeta'] = ParagraphStyle(
        'CoverMeta', fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=colors.HexColor("#94A3B8")
    )
    styles['CoverMetaVal'] = ParagraphStyle(
        'CoverMetaVal', fontName='Helvetica-Bold', fontSize=9, leading=12,
        textColor=colors.white
    )

    styles['Heading1'] = ParagraphStyle(
        'DocH1', fontName='Helvetica-Bold', fontSize=16, leading=20,
        textColor=colors.HexColor("#0F172A"), spaceBefore=18, spaceAfter=8,
        keepWithNext=True
    )
    styles['Heading2'] = ParagraphStyle(
        'DocH2', fontName='Helvetica-Bold', fontSize=12, leading=16,
        textColor=colors.HexColor("#1E293B"), spaceBefore=12, spaceAfter=6,
        keepWithNext=True
    )
    styles['Heading3'] = ParagraphStyle(
        'DocH3', fontName='Helvetica-Bold', fontSize=10, leading=13,
        textColor=colors.HexColor("#2563EB"), spaceBefore=8, spaceAfter=4,
        keepWithNext=True
    )
    styles['Body'] = ParagraphStyle(
        'DocBody', fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=colors.HexColor("#334155"), spaceAfter=6
    )
    styles['Bullet'] = ParagraphStyle(
        'DocBullet', fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=colors.HexColor("#334155"), leftIndent=14, firstLineIndent=-8, spaceAfter=3
    )
    styles['Code'] = ParagraphStyle(
        'DocCode', fontName='Courier', fontSize=7.5, leading=9.5,
        textColor=colors.HexColor("#F1F5F9"), backColor=colors.HexColor("#0F172A")
    )
    styles['TableText'] = ParagraphStyle(
        'DocTableText', fontName='Helvetica', fontSize=7.8, leading=10,
        textColor=colors.HexColor("#1E293B")
    )
    styles['TableTextBold'] = ParagraphStyle(
        'DocTableTextBold', fontName='Helvetica-Bold', fontSize=7.8, leading=10,
        textColor=colors.HexColor("#0F172A")
    )
    styles['TableHeader'] = ParagraphStyle(
        'DocTableHeader', fontName='Helvetica-Bold', fontSize=8, leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # =========================================================
    # COVER PAGE BLOCK
    # =========================================================
    cover_data = [
        [
            Paragraph("AETHERIS TECHNICAL PUBLICATION • SPEC-2026-AEOS", styles['CoverBadge']),
        ],
        [
            Paragraph("AETHERIS AEOS", styles['CoverTitle']),
        ],
        [
            Paragraph("Autonomous Enterprise Operating System", styles['CoverSub']),
        ],
        [
            Paragraph(
                "Complete Architectural Specification, Multi-Agent Swarm Dynamics, Cryptographic "
                "Ledger Verification, Statutory Multi-Jurisdictional Regulatory Compliance (EAR99, "
                "EU CBAM, German LkSG), and Enterprise Operational Implementation Manual.",
                styles['CoverDesc']
            ),
        ],
        [
            Spacer(1, 40)
        ],
        [
            Table([
                [
                    Paragraph("DOCUMENT REF", styles['CoverMeta']),
                    Paragraph("PRODUCTION ENGINE", styles['CoverMeta']),
                    Paragraph("AUTHORITATIVE PORT", styles['CoverMeta']),
                    Paragraph("SECURITY MATRIX", styles['CoverMeta'])
                ],
                [
                    Paragraph("AEOS-2.6.4-SPEC-2026", styles['CoverMetaVal']),
                    Paragraph("FastAPI 0.115+ (Python)", styles['CoverMetaVal']),
                    Paragraph("Backend :3001 // Vite :5173", styles['CoverMetaVal']),
                    Paragraph("BFT + Ed25519 Merkle", styles['CoverMetaVal'])
                ]
            ], colWidths=[120, 130, 125, 120])
        ]
    ]

    cover_table = Table(cover_data, colWidths=[515])
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0F172A")),
        ('LEFTPADDING', (0,0), (-1,-1), 24),
        ('RIGHTPADDING', (0,0), (-1,-1), 24),
        ('TOPPADDING', (0,0), (-1,-1), 32),
        ('BOTTOMPADDING', (0,0), (-1,-1), 30),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#1E293B")),
    ]))

    story.append(cover_table)
    story.append(Spacer(1, 14))

    # =========================================================
    # TABLE OF CONTENTS SUMMARY
    # =========================================================
    story.append(Paragraph("Executive Manual Contents", styles['Heading2']))
    toc_data = [
        [
            Paragraph("<b>01.</b> Executive Summary & Core Paradigm", styles['TableText']),
            Paragraph("<b>08.</b> Relational Database Schema (14 Models)", styles['TableText'])
        ],
        [
            Paragraph("<b>02.</b> End-to-End System Architecture", styles['TableText']),
            Paragraph("<b>09.</b> Authoritative REST API Reference", styles['TableText'])
        ],
        [
            Paragraph("<b>03.</b> Full Technology Stack & Dependencies", styles['TableText']),
            Paragraph("<b>10.</b> Enterprise Security, RBAC & Governance", styles['TableText'])
        ],
        [
            Paragraph("<b>04.</b> Frontend Architecture & Views Catalog", styles['TableText']),
            Paragraph("<b>11.</b> Statutory Regulatory Compliance", styles['TableText'])
        ],
        [
            Paragraph("<b>05.</b> UI Components & Interactive Shell", styles['TableText']),
            Paragraph("<b>12.</b> Benchmark Operational Walkthrough", styles['TableText'])
        ],
        [
            Paragraph("<b>06.</b> Multi-Agent Swarm Orchestration Engine", styles['TableText']),
            Paragraph("<b>13.</b> Mathematical Formulations & Resilience", styles['TableText'])
        ],
        [
            Paragraph("<b>07.</b> Cryptographic Engine & Immutable Ledger", styles['TableText']),
            Paragraph("<b>14.</b> Developer Handbook & Deployment", styles['TableText'])
        ],
    ]
    toc_table = Table(toc_data, colWidths=[257, 258])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # =========================================================
    # SECTION 01: EXECUTIVE SUMMARY
    # =========================================================
    story.append(Paragraph("01. Executive Summary & Core Paradigm", styles['Heading1']))
    story.append(Paragraph(
        "<b>AETHERIS AEOS (Autonomous Enterprise Operating System)</b> is a mission-critical, AI-orchestrated "
        "autonomous enterprise governance platform. In contemporary enterprise supply chains, organizations lose "
        "billions of dollars annually due to bureaucratic manual handoffs across disconnected ERP silos (SAP S/4HANA, "
        "Oracle NetSuite, Microsoft Dynamics 365). Procurement delays precipitate massive contractual Service Level "
        "Agreement (SLA) late penalties, illicit export control exposure, and unexpected carbon border liabilities.",
        styles['Body']
    ))
    story.append(Paragraph(
        "AETHERIS AEOS transforms enterprise operating software from a passive relational ledger into an active, "
        "deterministic, multi-agent swarm. When supply chain shocks or inventory shortages emerge, AEOS detects the "
        "deficit within milliseconds, conducts parallel global supplier arbitrage, audits international export and carbon "
        "mandates with explicit statutory citations, enforces cryptographic separation of duties, and produces a mathematically "
        "provable Merkle audit trail.",
        styles['Body']
    ))

    story.append(create_callout(
        "<b>The Autonomous Triad:</b> (1) Deterministic mathematical decisioning over probabilistic hallucination; "
        "(2) Strict four-eyes human governance over high-value capital allocation ($5,000 threshold); "
        "(3) Cryptographic non-repudiation using RFC 8785 canonical JSON, SHA-256 chaining, and Ed25519 digital signatures.",
        title="CORE PARADIGM SHIFT", alert_type="info", styles=styles
    ))
    story.append(Spacer(1, 8))

    # =========================================================
    # SECTION 02: SYSTEM ARCHITECTURE
    # =========================================================
    story.append(Paragraph("02. End-to-End System Architecture", styles['Heading1']))
    story.append(Paragraph(
        "AETHERIS AEOS is structured as a decoupled, high-throughput client-server topology. The backend is powered "
        "by an asynchronous <b>FastAPI (Python 3.11+)</b> engine operating strictly on port <b>3001</b>. The frontend is a "
        "reactive Single Page Application built on <b>React 19, TypeScript, and Vite</b> on port <b>5173</b>.",
        styles['Body']
    ))

    arch_diagram_text = (
        "+---------------------------------------------------------------------------------------------------+\n"
        "|                             AETHERIS CLIENT APPLICATION (PORT 5173)                               |\n"
        "|    React 19 + TypeScript 5.8 + Vite + Tailwind CSS + Lucide Icons + Google GenAI SDK              |\n"
        "|  [Problem Explorer]  [Swarm Visualizer]  [Mission Control]  [Compliance Radar]  [Operations Desk]  |\n"
        "+---------------------------------------------------------------------------------------------------+\n"
        "                                              |  Vite Proxy: /api/* -> :3001\n"
        "                                              v\n"
        "+---------------------------------------------------------------------------------------------------+\n"
        "|                             FASTAPI AUTHORITATIVE BACKEND (PORT 3001)                             |\n"
        "|  [Auth & RBAC /api/auth]   [Swarm Orchestrator]   [Operations Engine]   [Compliance Sentinel]     |\n"
        "|  -----------------------------------------------------------------------------------------------  |\n"
        "|  CRYPTOGRAPHIC ENGINE: RFC 8785 Canonical JSON | SHA-256 Chaining | Ed25519 Merkle Tree Sealing   |\n"
        "|  -----------------------------------------------------------------------------------------------  |\n"
        "|  PERSISTENCE LAYER: SQLAlchemy ORM (14 Relational Models) -> SQLite 3 / PostgreSQL 16             |\n"
        "+---------------------------------------------------------------------------------------------------+"
    )
    pre_table = Table([[Paragraph(f"<pre>{arch_diagram_text}</pre>", styles['Code'])]], colWidths=[515])
    pre_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0F172A")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#1E293B")),
    ]))
    story.append(pre_table)
    story.append(Spacer(1, 6))

    story.append(create_callout(
        "<b>Architectural Retirement:</b> Earlier iterations included an experimental Node/Express server in "
        "<code>server/</code>. This server is formally retired. The authoritative enterprise backend is strictly "
        "<b>FastAPI on port 3001</b>.",
        title="LEGACY SERVER RETIREMENT NOTICE", alert_type="warning", styles=styles
    ))
    story.append(Spacer(1, 10))

    # =========================================================
    # SECTION 03: FULL TECHNOLOGY STACK
    # =========================================================
    story.append(Paragraph("03. Full Technology Stack & Dependencies", styles['Heading1']))
    tech_data = [
        [Paragraph("Tier", styles['TableHeader']), Paragraph("Component", styles['TableHeader']), Paragraph("Version", styles['TableHeader']), Paragraph("Operational Responsibility", styles['TableHeader'])],
        [Paragraph("Frontend", styles['TableTextBold']), Paragraph("React Core", styles['TableText']), Paragraph("19.0.0", styles['TableText']), Paragraph("Concurrent rendering, fine-grained state management, transitions", styles['TableText'])],
        [Paragraph("Frontend", styles['TableTextBold']), Paragraph("TypeScript", styles['TableText']), Paragraph("5.8.2", styles['TableText']), Paragraph("Strict type assertions across API contracts and agent states", styles['TableText'])],
        [Paragraph("Frontend", styles['TableTextBold']), Paragraph("Vite", styles['TableText']), Paragraph("6.2.0", styles['TableText']), Paragraph("Fast HMR dev server, reverse-proxy /api routing to port 3001", styles['TableText'])],
        [Paragraph("Frontend", styles['TableTextBold']), Paragraph("Lucide React", styles['TableText']), Paragraph("^1.16.0", styles['TableText']), Paragraph("Enterprise dashboard iconography across cockpits and radars", styles['TableText'])],
        [Paragraph("Frontend", styles['TableTextBold']), Paragraph("@google/genai", styles['TableText']), Paragraph("^0.1.1", styles['TableText']), Paragraph("Direct client interaction with Gemini 2.5 Flash and Pro models", styles['TableText'])],
        [Paragraph("Backend", styles['TableTextBold']), Paragraph("FastAPI", styles['TableText']), Paragraph("0.115+", styles['TableText']), Paragraph("High-speed async REST endpoints with native OpenAPI validation", styles['TableText'])],
        [Paragraph("Backend", styles['TableTextBold']), Paragraph("Uvicorn", styles['TableText']), Paragraph("0.30+", styles['TableText']), Paragraph("Lightning-fast ASGI production web server running on port 3001", styles['TableText'])],
        [Paragraph("Backend", styles['TableTextBold']), Paragraph("SQLAlchemy", styles['TableText']), Paragraph("2.0+", styles['TableText']), Paragraph("Type-safe Object Relational Mapping governing 14 database models", styles['TableText'])],
        [Paragraph("Backend", styles['TableTextBold']), Paragraph("Pydantic", styles['TableText']), Paragraph("2.0+", styles['TableText']), Paragraph("High-throughput schema serialization and validation", styles['TableText'])],
        [Paragraph("Security", styles['TableTextBold']), Paragraph("cryptography", styles['TableText']), Paragraph("42.0+", styles['TableText']), Paragraph("Ed25519 asymmetric signing & SHA-256 Merkle root computation", styles['TableText'])],
        [Paragraph("Database", styles['TableTextBold']), Paragraph("SQLite / Postgres", styles['TableText']), Paragraph("3.x / 16", styles['TableText']), Paragraph("ACID relational transaction store and immutable audit ledger", styles['TableText'])],
    ]
    tech_table = Table(tech_data, colWidths=[65, 95, 55, 300])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(tech_table)
    story.append(PageBreak())

    # =========================================================
    # SECTION 04: FRONTEND ARCHITECTURE & VIEWS CATALOG
    # =========================================================
    story.append(Paragraph("04. Frontend Architecture & Views Catalog", styles['Heading1']))
    story.append(Paragraph(
        "The AETHERIS AEOS user interface is orchestrated by <code>App.tsx</code> as a high-density, real-time command "
        "cockpit. The platform houses six specialized operational views designed to provide zero-latency situational awareness:",
        styles['Body']
    ))

    views_data = [
        [Paragraph("View Route", styles['TableHeader']), Paragraph("Module Title", styles['TableHeader']), Paragraph("In-Depth Functional Capabilities", styles['TableHeader'])],
        [
            Paragraph("<code>problem</code>", styles['TableTextBold']),
            Paragraph("Problem Statement Explorer", styles['TableTextBold']),
            Paragraph("Quantifies systemic fragility in conventional enterprise resource planning. Models operational breakdown vectors: legacy ERP batch processing latencies (12-36 hrs), manual procurement friction, lack of carbon accounting, and contractual delivery penalty exposure. Features real-time ROI simulation sliders.", styles['TableText'])
        ],
        [
            Paragraph("<code>swarm</code>", styles['TableTextBold']),
            Paragraph("Swarm Visualizer", styles['TableTextBold']),
            Paragraph("Interactive dynamic graph depicting the five active autonomous agent nodes. Displays live inter-agent message propagation, current sub-task dispatch queues, internal memory cache utilization, and real-time voting rounds over the communication bus.", styles['TableText'])
        ],
        [
            Paragraph("<code>mission</code>", styles['TableTextBold']),
            Paragraph("Mission Control Cockpit", styles['TableTextBold']),
            Paragraph("The operational nervous system of AEOS. Displays real-time run IDs, progressive execution timelines, live system logs, agent chain-of-thought streams, BFT consensus voting matrices, and live Merkle block sealing telemetry.", styles['TableText'])
        ],
        [
            Paragraph("<code>compliance</code>", styles['TableTextBold']),
            Paragraph("Regulatory Compliance Radar", styles['TableTextBold']),
            Paragraph("Multi-jurisdictional compliance intelligence desk. Evaluates every supplier and part against US EAR99 export classifications, EU CBAM carbon border tariffs, and German LkSG human rights due diligence. Features instant legal citations and certificate verification.", styles['TableText'])
        ],
        [
            Paragraph("<code>operations</code>", styles['TableTextBold']),
            Paragraph("Operations Conductor", styles['TableTextBold']),
            Paragraph("Tactical procurement and inventory execution desk. Displays real-time warehouse stock, active deficits, supplier bidding comparison grids, purchase order lifecycle progression, goods receipt notes (GRN), and dual-control approval queues.", styles['TableText'])
        ],
        [
            Paragraph("<code>alpha</code> / <code>whitepaper</code>", styles['TableTextBold']),
            Paragraph("Competitive Alpha & Whitepaper", styles['TableTextBold']),
            Paragraph("Empirical benchmark evidence comparing AETHERIS AEOS to legacy incumbents (SAP S/4HANA, Palantir Foundry). Contains rigorous mathematical SLA penalty arbitrage formulas, Byzantine consensus proofs, and downloadable executive whitepapers.", styles['TableText'])
        ],
    ]
    views_table = Table(views_data, colWidths=[75, 120, 320])
    views_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(views_table)
    story.append(Spacer(1, 10))

    # =========================================================
    # SECTION 05: UI COMPONENTS & INTERACTIVE SHELL
    # =========================================================
    story.append(Paragraph("05. UI Components & Interactive Shell", styles['Heading1']))
    story.append(Paragraph(
        "The interface incorporates eighteen specialized React components engineered for responsiveness, high aesthetic density, and strict compliance with defense ergonomics:",
        styles['Body']
    ))

    comp_items = [
        "<b>Sidebar (Sidebar.tsx):</b> Collapsible navigational anchor supporting pinned view states, route badges, and real-time pending approval counters.",
        "<b>TopBar (TopBar.tsx):</b> Global status header displaying backend connection health (:3001), active organization, session role badge, theme switcher, and command palette hotkey.",
        "<b>LoginPage & AuthModal (LoginPage.tsx, AuthModal.tsx):</b> Enterprise authentication gates featuring one-click demo persona switcher, password validation, and token issuance.",
        "<b>UserProfileMenu (UserProfileMenu.tsx):</b> Account management popover indicating user UUID, organization identifier, active permissions, and session logout controls.",
        "<b>CommandPalette (CommandPalette.tsx):</b> Omnipresent modal triggered via <code>Ctrl+K</code> / <code>⌘K</code> allowing rapid navigation, instant recovery triggering, and parts catalog search.",
        "<b>ApiKeyModal (ApiKeyModal.tsx):</b> Client-side Google Gemini API key configuration modal, storing keys safely in browser local storage without server leakage.",
        "<b>MasterPromptModal (MasterPromptModal.tsx):</b> LLM behavioral inspection tool providing full visibility into foundational agent prompts, temperature, and policy instructions.",
        "<b>AuditProofModal (AuditProofModal.tsx):</b> Cryptographic proof inspector rendering visual Merkle tree inclusion paths, sibling hashes, and Ed25519 digital signatures.",
        "<b>ConsensusVotingMatrix (ConsensusVotingMatrix.tsx):</b> Real-time table displaying individual agent votes, confidence weights, mathematical rationale, and quorum thresholds.",
        "<b>Dual Theme Engine:</b> Supports <i>Linear Dark Obsidian</i> (default) and <i>Apple Light Studio</i> via dynamic CSS variable injection and local storage persistence."
    ]
    for ci in comp_items:
        story.append(Paragraph(f"• {ci}", styles['Bullet']))
    story.append(PageBreak())

    # =========================================================
    # SECTION 06: MULTI-AGENT SWARM ORCHESTRATION ENGINE
    # =========================================================
    story.append(Paragraph("06. Multi-Agent Swarm Orchestration Engine", styles['Heading1']))
    story.append(Paragraph(
        "Implemented in <code>server_py/services/orchestrator.py</code>, the autonomous multi-agent swarm operates across "
        "three deterministic tiers to detect, resolve, and seal enterprise supply chain disruptions:",
        styles['Body']
    ))

    agents_data = [
        [Paragraph("Tier", styles['TableHeader']), Paragraph("Agent Name", styles['TableHeader']), Paragraph("Agent ID", styles['TableHeader']), Paragraph("Deterministic Core Responsibility", styles['TableHeader'])],
        [
            Paragraph("L0", styles['TableTextBold']),
            Paragraph("Apex Orchestrator", styles['TableTextBold']),
            Paragraph("<code>apex-orchestrator</code>", styles['TableText']),
            Paragraph("Mission decomposition, task graph generation, shortage identification, inter-agent synchronization, and BFT consensus synthesis.", styles['TableText'])
        ],
        [
            Paragraph("L1", styles['TableTextBold']),
            Paragraph("Operations Conductor", styles['TableTextBold']),
            Paragraph("<code>operations-conductor</code>", styles['TableText']),
            Paragraph("Inventory deficit calculation (Required - OnHand), supplier bid evaluation across lead times and unit costs, PO draft creation.", styles['TableText'])
        ],
        [
            Paragraph("L1", styles['TableTextBold']),
            Paragraph("Regulatory Sentinel", styles['TableTextBold']),
            Paragraph("<code>regulatory-sentinel</code>", styles['TableText']),
            Paragraph("Statutory audit against US EAR99, EU CBAM carbon border tariffs, and German LkSG human rights due diligence with legal citations.", styles['TableText'])
        ],
        [
            Paragraph("L1", styles['TableTextBold']),
            Paragraph("Market Alpha Strategist", styles['TableTextBold']),
            Paragraph("<code>market-alpha-strategist</code>", styles['TableText']),
            Paragraph("Financial arbitrage modeling. Compares daily late-delivery SLA penalties against expedited freight premiums to optimize net profitability.", styles['TableText'])
        ],
        [
            Paragraph("L2", styles['TableTextBold']),
            Paragraph("Cryptographic Auditor", styles['TableTextBold']),
            Paragraph("<code>cryptographic-auditor</code>", styles['TableText']),
            Paragraph("State transformation canonicalization (RFC 8785), SHA-256 event chaining, binary Merkle tree root calculation, and Ed25519 block signing.", styles['TableText'])
        ],
    ]
    agents_table = Table(agents_data, colWidths=[35, 115, 115, 250])
    agents_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(agents_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Swarm Consensus & Fault Tolerance Rules", styles['Heading2']))
    story.append(Paragraph(
        "The swarm enforces a strict <b>67% weighted BFT supermajority quorum</b>. Each agent casts a signed vote "
        "(APPROVE, CONDITIONAL, REJECT) accompanied by a confidence factor (0.00 to 1.00) and mathematical rationale. "
        "If Regulatory Sentinel detects an embargo violation (EAR99 breach), its rejection carries veto power regardless of cost arbitrage.",
        styles['Body']
    ))
    story.append(Spacer(1, 8))

    # =========================================================
    # SECTION 07: CRYPTOGRAPHIC ENGINE & IMMUTABLE LEDGER
    # =========================================================
    story.append(Paragraph("07. Cryptographic Engine & Immutable Ledger", styles['Heading1']))
    story.append(Paragraph(
        "Implemented in <code>server_py/crypto_engine.py</code>, AEOS provides mathematical proof of system integrity "
        "without requiring public blockchain infrastructure. The subsystem utilizes four cryptographic foundations:",
        styles['Body']
    ))

    crypto_pillars = [
        "<b>1. RFC 8785 Canonical JSON Serialization:</b> Standardizes payload serialization by enforcing alphabetical key ordering, zero arbitrary whitespace, and UTF-8 encoding. Eliminates serialization non-determinism across platforms.",
        "<b>2. SHA-256 Cryptographic Hash Chaining:</b> Every audit event records the SHA-256 hash of its predecessor. Any silent tampering or record deletion by database administrators immediately invalidates the entire downward chain.",
        "<b>3. Binary Merkle Tree Construction:</b> Events are organized into binary Merkle trees. If an odd number of leaf nodes exists at any tree level, the final node is duplicated to guarantee balanced binary tree computation.",
        "<b>4. Ed25519 Asymmetric Digital Signatures:</b> Sealed blocks are signed with an Ed25519 private key. Auditors can independently verify the Merkle root and all child inclusion proofs using only the embedded public key."
    ]
    for cp in crypto_pillars:
        story.append(Paragraph(f"• {cp}", styles['Bullet']))

    story.append(Spacer(1, 6))
    story.append(create_callout(
        "<b>Proof of Inclusion Verification:</b> Clients verify that event <i>E</i> was sealed in Block <i>B</i> by providing "
        "a minimal sibling hash path: <code>Path = [(Sibling_1, 'right'), (Sibling_2, 'left'), ...]</code>. Traversal "
        "reconstructs the root hash in O(log N) time, verifying exact cryptographic presence.",
        title="ZERO-KNOWLEDGE AUDIT VERIFICATION", alert_type="success", styles=styles
    ))
    story.append(PageBreak())

    # =========================================================
    # SECTION 08: RELATIONAL DATABASE SCHEMA
    # =========================================================
    story.append(Paragraph("08. Relational Database Schema (14 Models)", styles['Heading1']))
    story.append(Paragraph(
        "Governed by SQLAlchemy ORM in <code>server_py/database.py</code>, the schema consists of fourteen interconnected "
        "tables with enforced foreign key cascades, unique constraints, and audit immutability:",
        styles['Body']
    ))

    schema_data = [
        [Paragraph("Model / Table", styles['TableHeader']), Paragraph("Primary Key", styles['TableHeader']), Paragraph("Key Relational Columns & Data Types", styles['TableHeader']), Paragraph("System Role & Domain Constraints", styles['TableHeader'])],
        [Paragraph("<code>organizations</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("name, code, created_at", styles['TableText']), Paragraph("Multi-tenant organization boundary.", styles['TableText'])],
        [Paragraph("<code>users</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("email, hashed_password, role, org_id", styles['TableText']), Paragraph("Authenticated system actors with RBAC roles.", styles['TableText'])],
        [Paragraph("<code>products</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("sku, name, unit, specs, eccn", styles['TableText']), Paragraph("Item master with export control classification.", styles['TableText'])],
        [Paragraph("<code>inventory</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("product_id, warehouse_code, on_hand, reserved", styles['TableText']), Paragraph("Real-time physical stock across facilities.", styles['TableText'])],
        [Paragraph("<code>orders</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("customer_name, product_id, quantity, status", styles['TableText']), Paragraph("Customer fulfillment demand records.", styles['TableText'])],
        [Paragraph("<code>suppliers</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("name, country, lead_time_days, rating", styles['TableText']), Paragraph("Global vendor master with geographic metadata.", styles['TableText'])],
        [Paragraph("<code>purchase_orders</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("po_number, supplier_id, quantity, total_amount", styles['TableText']), Paragraph("Procurement liabilities with line items.", styles['TableText'])],
        [Paragraph("<code>agent_runs</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("run_number, status, order_id, summary", styles['TableText']), Paragraph("Top-level execution pipeline runs.", styles['TableText'])],
        [Paragraph("<code>agent_tasks</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("run_id, agent_name, status, payload", styles['TableText']), Paragraph("Discrete agent tasks with input/output states.", styles['TableText'])],
        [Paragraph("<code>approval_requests</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("run_id, po_id, status, threshold_amount", styles['TableText']), Paragraph("Human-in-the-loop governance holding records.", styles['TableText'])],
        [Paragraph("<code>compliance_docs</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("supplier_id, doc_type, issuing_authority", styles['TableText']), Paragraph("Certificates of origin, CBAM declarations.", styles['TableText'])],
        [Paragraph("<code>compliance_evals</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("run_id, framework, passed, citations", styles['TableText']), Paragraph("Statutory legal audit reports.", styles['TableText'])],
        [Paragraph("<code>audit_events</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("event_type, actor, payload_hash, prev_hash", styles['TableText']), Paragraph("SHA-256 chained immutable audit ledger.", styles['TableText'])],
        [Paragraph("<code>merkle_blocks</code>", styles['TableTextBold']), Paragraph("<code>id</code> (String)", styles['TableText']), Paragraph("block_number, merkle_root, signature, events_count", styles['TableText']), Paragraph("Sealed cryptographic blocks with Ed25519.", styles['TableText'])],
    ]
    schema_table = Table(schema_data, colWidths=[90, 60, 155, 210])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(schema_table)
    story.append(Spacer(1, 10))

    # =========================================================
    # SECTION 09: REST API REFERENCE
    # =========================================================
    story.append(Paragraph("09. Authoritative REST API Reference", styles['Heading1']))
    story.append(Paragraph(
        "All endpoints are served asynchronously by FastAPI on port <code>3001</code>. The table below details authoritative contracts:",
        styles['Body']
    ))

    api_data = [
        [Paragraph("Method & Endpoint", styles['TableHeader']), Paragraph("Role Required", styles['TableHeader']), Paragraph("Payload / Params", styles['TableHeader']), Paragraph("Response & Functional Behavior", styles['TableHeader'])],
        [
            Paragraph("<b>POST</b> <code>/api/auth/login</code>", styles['TableText']),
            Paragraph("Public", styles['TableText']),
            Paragraph("{ email, password }", styles['TableText']),
            Paragraph("Verifies password against salted bcrypt hash. Returns JWT session token and role profile.", styles['TableText'])
        ],
        [
            Paragraph("<b>POST</b> <code>/api/auth/switch-role</code>", styles['TableText']),
            Paragraph("Authenticated", styles['TableText']),
            Paragraph("{ role }", styles['TableText']),
            Paragraph("Allows authorized tenant switching between demo personas for audit testing.", styles['TableText'])
        ],
        [
            Paragraph("<b>POST</b> <code>/api/orchestration/runs/start-recovery</code>", styles['TableText']),
            Paragraph("Authenticated", styles['TableText']),
            Paragraph("{ order_id, notes }", styles['TableText']),
            Paragraph("Triggers 5-agent swarm disruption recovery. Spawns tasks, runs arbitrage, checks compliance.", styles['TableText'])
        ],
        [
            Paragraph("<b>GET</b> <code>/api/orchestration/runs/{id}</code>", styles['TableText']),
            Paragraph("Authenticated", styles['TableText']),
            Paragraph("Path: id", styles['TableText']),
            Paragraph("Fetches granular run telemetry, agent logs, decision matrices, and task lifecycle statuses.", styles['TableText'])
        ],
        [
            Paragraph("<b>POST</b> <code>/api/orchestration/approvals/{id}/decide</code>", styles['TableText']),
            Paragraph("Director / Exec", styles['TableText']),
            Paragraph("{ decision, reason }", styles['TableText']),
            Paragraph("Approves/rejects PO exceeding $5,000. Rejects analysts and self-approvers with HTTP 403.", styles['TableText'])
        ],
        [
            Paragraph("<b>POST</b> <code>/api/orchestration/receipts/confirm</code>", styles['TableText']),
            Paragraph("Operations Director", styles['TableText']),
            Paragraph("{ po_id, received_qty }", styles['TableText']),
            Paragraph("Creates Goods Receipt Note (GRN), updates warehouse inventory (+200), triggers Merkle seal.", styles['TableText'])
        ],
        [
            Paragraph("<b>GET</b> <code>/api/orchestration/merkle/verify/{block}</code>", styles['TableText']),
            Paragraph("Public", styles['TableText']),
            Paragraph("Path: block_number", styles['TableText']),
            Paragraph("Returns Merkle root, leaf nodes, sibling inclusion paths, and Ed25519 signature validity.", styles['TableText'])
        ],
        [
            Paragraph("<b>GET</b> <code>/api/health</code>", styles['TableText']),
            Paragraph("Public", styles['TableText']),
            Paragraph("None", styles['TableText']),
            Paragraph("Returns system status, active database dialect, agent readiness, and version string.", styles['TableText'])
        ],
    ]
    api_table = Table(api_data, colWidths=[120, 70, 95, 230])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(api_table)
    story.append(PageBreak())

    # =========================================================
    # SECTION 10: ENTERPRISE SECURITY & RBAC
    # =========================================================
    story.append(Paragraph("10. Enterprise Security, RBAC & Governance", styles['Heading1']))
    story.append(Paragraph(
        "AETHERIS AEOS implements zero-trust authorization. Role capabilities and governance boundaries are strictly enforced:",
        styles['Body']
    ))

    rbac_data = [
        [Paragraph("Role Identifier", styles['TableHeader']), Paragraph("Title & Persona", styles['TableHeader']), Paragraph("View Radar & Cockpits", styles['TableHeader']), Paragraph("Trigger Recovery", styles['TableHeader']), Paragraph("Approve PO (&gt;$5k)", styles['TableHeader']), Paragraph("Confirm GRN", styles['TableHeader']), Paragraph("Export Ledger", styles['TableHeader'])],
        [
            Paragraph("<code>executive</code>", styles['TableTextBold']),
            Paragraph("Elena Rostova (COO)", styles['TableText']),
            Paragraph("Full Access", styles['TableText']),
            Paragraph("Yes", styles['TableText']),
            Paragraph("<b>YES</b>", styles['TableTextBold']),
            Paragraph("Yes", styles['TableText']),
            Paragraph("<b>Full Export</b>", styles['TableTextBold'])
        ],
        [
            Paragraph("<code>operations_director</code>", styles['TableTextBold']),
            Paragraph("Marcus Vance (Dir Ops)", styles['TableText']),
            Paragraph("Full Access", styles['TableText']),
            Paragraph("Yes", styles['TableText']),
            Paragraph("<b>YES</b>", styles['TableTextBold']),
            Paragraph("<b>YES</b>", styles['TableTextBold']),
            Paragraph("Full Export", styles['TableText'])
        ],
        [
            Paragraph("<code>compliance_officer</code>", styles['TableTextBold']),
            Paragraph("Sophia Chen (Counsel)", styles['TableText']),
            Paragraph("Full Access", styles['TableText']),
            Paragraph("Read Only", styles['TableText']),
            Paragraph("<font color='#DC2626'>Denied (403)</font>", styles['TableTextBold']),
            Paragraph("<font color='#DC2626'>Denied (403)</font>", styles['TableTextBold']),
            Paragraph("<b>Full Export</b>", styles['TableTextBold'])
        ],
        [
            Paragraph("<code>analyst</code>", styles['TableTextBold']),
            Paragraph("Jordan Taylor (Analyst)", styles['TableText']),
            Paragraph("Full Access", styles['TableText']),
            Paragraph("Yes", styles['TableText']),
            Paragraph("<font color='#DC2626'>Denied (403)</font>", styles['TableTextBold']),
            Paragraph("<font color='#DC2626'>Denied (403)</font>", styles['TableTextBold']),
            Paragraph("View Only", styles['TableText'])
        ],
    ]
    rbac_table = Table(rbac_data, colWidths=[90, 105, 75, 60, 65, 60, 60])
    rbac_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(rbac_table)
    story.append(Spacer(1, 8))

    story.append(create_callout(
        "<b>Separation of Duties (Four-Eyes Principle):</b> If an operations director initiates a procurement recovery run, "
        "the backend cryptographically prevents self-approval. Dual control requires a distinct authorized user to "
        "execute the approval payload.",
        title="DUAL CONTROL ENFORCEMENT", alert_type="warning", styles=styles
    ))
    story.append(Spacer(1, 10))

    # =========================================================
    # SECTION 11: STATUTORY COMPLIANCE FRAMEWORKS
    # =========================================================
    story.append(Paragraph("11. Statutory Regulatory Compliance", styles['Heading1']))
    story.append(Paragraph(
        "Every supplier bid and component procurement is audited against three major global statutory mandates:",
        styles['Body']
    ))

    reg_items = [
        "<b>US Export Administration Regulations (EAR99 - 15 CFR § 734):</b> Aerospace components (such as Titanium Grade 5 Flanges) are audited against the Commerce Control List (CCL) and OFAC Specially Designated Nationals lists to prevent unauthorized re-export or dual-use diversion.",
        "<b>EU Carbon Border Adjustment Mechanism (EU CBAM - Regulation 2023/956):</b> Audits embedded Scope 1 and Scope 2 carbon emissions per metric ton of imported titanium and iron under CN Code 8108.90. Calculates prospective CBAM certificate liabilities prior to purchase commitment.",
        "<b>German Supply Chain Due Diligence Act (LkSG - § 3 LkSG):</b> Mandates continuous human rights and environmental vetting across Tier-1 and direct Tier-2 suppliers. Validates valid ISO 14001:2015 environmental systems and verifies absence of forced labor infractions."
    ]
    for ri in reg_items:
        story.append(Paragraph(f"• {ri}", styles['Bullet']))
    story.append(Spacer(1, 10))

    # =========================================================
    # SECTION 12: BENCHMARK OPERATIONAL WALKTHROUGH
    # =========================================================
    story.append(Paragraph("12. Benchmark Operational Walkthrough", styles['Heading1']))
    story.append(Paragraph(
        "The canonical operational benchmark demonstrates the real-time fulfillment of Order <b>ORD-2026-500</b> "
        "(Airbus Defense & Space requirement for 500 Titanium Flanges):",
        styles['Body']
    ))

    walkthrough_steps = [
        "<b>Step 1 - Shortage Ingestion:</b> Airbus places ORD-2026-500 (500 units TF-700). Inventory holds 300 units in Central Warehouse. Apex Orchestrator detects acute 200-unit deficit.",
        "<b>Step 2 - Market Arbitrage:</b> Operations Conductor queries supplier master. Selects <i>Bavaria Precision Metallics</i> (200 units @ $54.00/unit = $10,800 total; 2-day lead time) over Swedish and Chinese alternatives.",
        "<b>Step 3 - Statutory Vetting:</b> Regulatory Sentinel verifies EAR99 export classification (PASSED), EU CBAM embedded emissions (1.42t CO2 PASSED), and German LkSG human rights certification (PASSED).",
        "<b>Step 4 - Governance Hold:</b> Because PO total ($10,800) exceeds the autonomous $5,000 threshold, execution halts into an escrow approval hold (<code>PENDING_APPROVAL</code>).",
        "<b>Step 5 - RBAC Approval:</b> Marcus Vance (Operations Director) executes cryptographic approval. An attempted approval by Jordan Taylor (Analyst) is rejected with HTTP 403.",
        "<b>Step 6 - Goods Receipt (GRN):</b> Upon delivery, Marcus confirms receipt. Physical inventory increments to 500 units (+200). Order ORD-2026-500 is fully allocated and dispatched.",
        "<b>Step 7 - Merkle Sealing:</b> Cryptographic Auditor bundles all 7 state mutations into canonical JSON, constructs a balanced binary Merkle tree, and seals Block #104 with an Ed25519 signature."
    ]
    for ws in walkthrough_steps:
        story.append(Paragraph(ws, styles['Bullet']))
    story.append(PageBreak())

    # =========================================================
    # SECTION 13: MATHEMATICAL FORMULATIONS & RESILIENCE
    # =========================================================
    story.append(Paragraph("13. Mathematical Formulations & Resilience", styles['Heading1']))
    story.append(Paragraph(
        "Agent decision-making is strictly governed by deterministic mathematical formulations:",
        styles['Body']
    ))

    math_block = (
        "1. Net Arbitrage Utility Function:\n"
        "   U(s) = [ (T_sla - T_lead(s)) * Penalty_daily ] - [ Q * P_unit(s) + C_freight(s) + C_cbam(s) ]\n"
        "   Where:\n"
        "     T_sla = 3 days | T_lead = 2 days | Penalty_daily = $2,500/day | Q = 200 units | P_unit = $54.00\n"
        "     Net Utility = (1 day * $2,500) - ($10,800 + $600 + $150) = +$13,450 relative to SLA default.\n\n"
        "2. Byzantine Consensus Quorum Condition:\n"
        "   Q_bft = Sum(w_i * v_i) / Sum(w_i) >= 0.67 (67% Supermajority requirement)"
    )
    story.append(Table([[Paragraph(f"<pre>{math_block}</pre>", styles['Code'])]], colWidths=[515]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Adversarial Attack Resilience Benchmarks", styles['Heading2']))
    attack_data = [
        [Paragraph("Attack Scenario", styles['TableHeader']), Paragraph("Injected Threat Vector", styles['TableHeader']), Paragraph("Detection Mechanism", styles['TableHeader']), Paragraph("System Defense Response", styles['TableHeader'])],
        [
            Paragraph("SQL Record Mutation", styles['TableTextBold']),
            Paragraph("Malicious DB admin alters unit price from $54 to $40 directly in database.", styles['TableText']),
            Paragraph("SHA-256 canonical hash chain re-computation.", styles['TableText']),
            Paragraph("Chain breaks at block #104. Security alarm raised; transaction rejected.", styles['TableText'])
        ],
        [
            Paragraph("Role Escalation Attempt", styles['TableTextBold']),
            Paragraph("User with Analyst token POSTs to /api/orchestration/approvals/{id}/decide.", styles['TableText']),
            Paragraph("FastAPI dependency authorization gate.", styles['TableText']),
            Paragraph("Immediate HTTP 403 Forbidden. Violation logged into immutable audit chain.", styles['TableText'])
        ],
        [
            Paragraph("Merkle Tree Forgery", styles['TableTextBold']),
            Paragraph("Attacker supplies forged sibling hash to claim false inclusion.", styles['TableText']),
            Paragraph("Binary Merkle root path traversal.", styles['TableText']),
            Paragraph("Calculated root does not match signed Ed25519 root. Proof rejected.", styles['TableText'])
        ],
    ]
    attack_table = Table(attack_data, colWidths=[95, 130, 130, 160])
    attack_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(attack_table)
    story.append(Spacer(1, 10))

    # =========================================================
    # SECTION 14: DEVELOPER HANDBOOK & DEPLOYMENT
    # =========================================================
    story.append(Paragraph("14. Developer Handbook & Deployment", styles['Heading1']))
    story.append(Paragraph(
        "To initialize and run AETHERIS AEOS in local or production development mode, execute the following commands:",
        styles['Body']
    ))

    run_cmd_text = (
        "# 1. Start FastAPI Authoritative Backend (Port 3001)\n"
        "cd \"d:\\DEVLOPEMENT\\2nd project\\2nd project\"\n"
        "python -m uvicorn server_py.main:app --host 0.0.0.0 --port 3001 --reload\n\n"
        "# 2. Start Reactive Vite Frontend (Port 5173)\n"
        "cd \"d:\\DEVLOPEMENT\\2nd project\\2nd project\"\n"
        "npm run dev"
    )
    story.append(Table([[Paragraph(f"<pre>{run_cmd_text}</pre>", styles['Code'])]], colWidths=[515]))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Default Enterprise Seed Credentials", styles['Heading2']))
    creds_data = [
        [Paragraph("Role Title", styles['TableHeader']), Paragraph("Email Identifier", styles['TableHeader']), Paragraph("Default Password", styles['TableHeader']), Paragraph("Governance Scope", styles['TableHeader'])],
        [Paragraph("Executive (COO)", styles['TableTextBold']), Paragraph("elena@aetheris.ai", styles['TableText']), Paragraph("Executive2026!", styles['TableText']), Paragraph("Full oversight, unlimited approval ceiling, audit export", styles['TableText'])],
        [Paragraph("Operations Director", styles['TableTextBold']), Paragraph("marcus@aetheris.ai", styles['TableText']), Paragraph("Operations2026!", styles['TableText']), Paragraph("Procurement lead, PO approval, Goods Receipt (GRN)", styles['TableText'])],
        [Paragraph("Compliance Officer", styles['TableTextBold']), Paragraph("sophia@aetheris.ai", styles['TableText']), Paragraph("Compliance2026!", styles['TableText']), Paragraph("Regulatory radar lead, legal citation auditor", styles['TableText'])],
        [Paragraph("Supply Chain Analyst", styles['TableTextBold']), Paragraph("jordan@aetheris.ai", styles['TableText']), Paragraph("Analyst2026!", styles['TableText']), Paragraph("Shortage initiator, operational reviewer (Read/Propose)", styles['TableText'])],
    ]
    creds_table = Table(creds_data, colWidths=[100, 115, 95, 205])
    creds_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.4, colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ]))
    story.append(creds_table)

    # Build the document using NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated documentation PDF: {output_path}")

if __name__ == "__main__":
    out_pdf = os.path.join(os.path.dirname(__file__), "AETHERIS_AEOS_Documentation.pdf")
    generate_documentation_pdf(out_pdf)
