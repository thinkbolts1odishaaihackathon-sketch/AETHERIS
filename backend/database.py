"""AETHERIS AEOS Relational Database Layer.

Implements an ACID-compliant schema with SQLAlchemy supporting PostgreSQL
and SQLite (for development/testing), relational constraints, foreign keys,
indices, and transaction boundaries.
"""

import os
import json
import bcrypt
from datetime import datetime, timezone
from typing import Generator, List, Dict, Any, Optional

from sqlalchemy import (
    create_engine, Column, String, Integer, Float, Boolean, Text,
    ForeignKey, DateTime, Index, text
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session
try:
    from .crypto_engine import generate_ed25519_keypair, sha256_hex, compute_chained_hash
except (ImportError, ValueError):
    from crypto_engine import generate_ed25519_keypair, sha256_hex, compute_chained_hash

Base = declarative_base()

# Configure Database URL: Defaults to SQLite in backend/aetheris.db or env DATABASE_URL
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "aetheris.db"))
raw_db_url = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}").strip()

# Render & cloud providers supply 'postgres://' which SQLAlchemy requires as 'postgresql://'
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

# Ensure dialect driver compatibility:
# In SQLAlchemy 2.1+, 'postgresql://' defaults to 'psycopg' (psycopg 3).
# If only psycopg2 is available, explicitly use 'postgresql+psycopg2://'.
if raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+"):
    try:
        import psycopg
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)
    except ImportError:
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
else:
    DATABASE_URL = raw_db_url

# Connection arguments: SQLite requires check_same_thread=False; PostgreSQL uses connection pooling
engine_kwargs: Dict[str, Any] = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_iso_now() -> str:
    """Return current UTC timestamp in ISO 8601 with Z suffix."""
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


# --- Relational Models ---

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(128), unique=True, nullable=False, index=True)
    max_autonomous_spend_usd = Column(Float, default=5000.0, nullable=False)
    created_at = Column(String(64), default=get_iso_now, nullable=False)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="organization", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="organization", cascade="all, delete-orphan")
    inventory_items = relationship("Inventory", back_populates="organization", cascade="all, delete-orphan")
    suppliers = relationship("Supplier", back_populates="organization", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="organization", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="organization", cascade="all, delete-orphan")
    merkle_blocks = relationship("MerkleBlock", back_populates="organization", cascade="all, delete-orphan")
    compliance_documents = relationship("ComplianceDocument", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(64), nullable=False, index=True)  # executive, compliance_officer, operations_director, auditor
    department = Column(String(255), nullable=True)
    avatar_color = Column(String(32), default="#2563eb", nullable=False)
    public_key = Column(String(128), nullable=False)
    private_key = Column(String(128), nullable=True)  # Secure server-side storage for agent signing
    created_at = Column(String(64), default=get_iso_now, nullable=False)
    last_login_at = Column(String(64), default=get_iso_now, nullable=False)

    organization = relationship("Organization", back_populates="users")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    sku = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    unit = Column(String(32), default="units", nullable=False)

    organization = relationship("Organization", back_populates="products")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    product_sku = Column(String(64), nullable=False, index=True)
    warehouse_location = Column(String(255), nullable=False)
    quantity_on_hand = Column(Integer, default=0, nullable=False)
    reserved_quantity = Column(Integer, default=0, nullable=False)
    on_order_quantity = Column(Integer, default=0, nullable=False)
    min_safety_stock = Column(Integer, default=50, nullable=False)
    updated_at = Column(String(64), default=get_iso_now, nullable=False)

    organization = relationship("Organization", back_populates="inventory_items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    order_number = Column(String(64), unique=True, nullable=False, index=True)
    customer_name = Column(String(255), nullable=False)
    product_sku = Column(String(64), nullable=False, index=True)
    required_quantity = Column(Integer, nullable=False)
    unit_price_usd = Column(Float, nullable=False)
    destination_jurisdiction = Column(String(64), nullable=False)
    status = Column(String(64), default="shortage_detected", nullable=False, index=True)  # shortage_detected, processing, fulfilled, cancelled
    deadline_days = Column(Integer, default=5, nullable=False)
    created_at = Column(String(64), default=get_iso_now, nullable=False)
    updated_at = Column(String(64), default=get_iso_now, nullable=False)

    organization = relationship("Organization", back_populates="orders")
    purchase_orders = relationship("PurchaseOrder", back_populates="order", cascade="all, delete-orphan")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    country = Column(String(64), nullable=False)
    unit_cost_usd = Column(Float, nullable=False)
    lead_time_days = Column(Integer, nullable=False)
    freight_cost_usd = Column(Float, nullable=False)
    freight_mode = Column(String(64), nullable=False)  # Air Cargo, Multimodal Rail, Maritime
    compliance_certified = Column(Boolean, default=True, nullable=False)
    reliability_score = Column(Float, default=95.0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    organization = relationship("Organization", back_populates="suppliers")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    order_id = Column(String(64), ForeignKey("orders.id"), nullable=False, index=True)
    supplier_id = Column(String(64), ForeignKey("suppliers.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    unit_cost_usd = Column(Float, nullable=False)
    total_cost_usd = Column(Float, nullable=False)
    transit_mode = Column(String(64), nullable=False)
    status = Column(String(64), default="proposed", nullable=False, index=True)  # proposed, pending_approval, approved, executed, verified, rejected
    tracking_reference = Column(String(128), nullable=True)
    created_at = Column(String(64), default=get_iso_now, nullable=False)
    executed_at = Column(String(64), nullable=True)

    order = relationship("Order", back_populates="purchase_orders")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    order_id = Column(String(64), ForeignKey("orders.id"), nullable=True, index=True)
    mission_title = Column(String(255), nullable=False)
    directive = Column(Text, nullable=False)
    status = Column(String(64), default="queued", nullable=False, index=True)  # queued, running, waiting_for_approval, succeeded, failed, cancelled
    current_phase = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    initiated_by_user_id = Column(String(64), nullable=False)
    created_at = Column(String(64), default=get_iso_now, nullable=False)
    completed_at = Column(String(64), nullable=True)

    organization = relationship("Organization", back_populates="agent_runs")
    tasks = relationship("AgentTask", back_populates="run", cascade="all, delete-orphan")
    approvals = relationship("ApprovalRequest", back_populates="run", cascade="all, delete-orphan")
    compliance_evaluations = relationship("ComplianceEvaluation", back_populates="run", cascade="all, delete-orphan")


class AgentTask(Base):
    __tablename__ = "agent_tasks"

    id = Column(String(64), primary_key=True)
    run_id = Column(String(64), ForeignKey("agent_runs.id"), nullable=False, index=True)
    agent_role = Column(String(64), nullable=False, index=True)  # orchestrator, compliance, operations, competitive, auditor
    agent_name = Column(String(255), nullable=False)
    objective = Column(String(255), nullable=False)
    status = Column(String(64), default="pending", nullable=False)  # pending, executing, completed, failed
    thought_chain_json = Column(Text, nullable=False, default="[]")
    tool_name = Column(String(128), nullable=False)
    tool_input_json = Column(Text, nullable=False, default="{}")
    tool_output_json = Column(Text, nullable=False, default="{}")
    consensus_vote = Column(String(32), default="approve", nullable=False)
    cryptographic_hash = Column(String(128), nullable=False)
    duration_ms = Column(Integer, default=0, nullable=False)
    created_at = Column(String(64), default=get_iso_now, nullable=False)
    completed_at = Column(String(64), nullable=True)

    run = relationship("AgentRun", back_populates="tasks")


class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    run_id = Column(String(64), ForeignKey("agent_runs.id"), nullable=False, index=True)
    purchase_order_id = Column(String(64), ForeignKey("purchase_orders.id"), nullable=True, index=True)
    requested_action = Column(String(255), nullable=False)
    reason = Column(Text, nullable=False)
    amount_usd = Column(Float, nullable=False)
    threshold_usd = Column(Float, nullable=False)
    status = Column(String(64), default="pending", nullable=False, index=True)  # pending, approved, rejected, cancelled
    required_role = Column(String(64), default="operations_director", nullable=False)
    decided_by_user_id = Column(String(64), nullable=True)
    decided_at = Column(String(64), nullable=True)
    created_at = Column(String(64), default=get_iso_now, nullable=False)

    run = relationship("AgentRun", back_populates="approvals")


class ComplianceDocument(Base):
    __tablename__ = "compliance_documents"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    framework_id = Column(String(64), nullable=False, index=True)
    framework_name = Column(String(255), nullable=False)
    jurisdiction = Column(String(64), nullable=False)
    version = Column(String(32), nullable=False)
    source_title = Column(String(255), nullable=False)
    passage_text = Column(Text, nullable=False)
    effective_date = Column(String(64), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    organization = relationship("Organization", back_populates="compliance_documents")


class ComplianceEvaluation(Base):
    __tablename__ = "compliance_evaluations"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    run_id = Column(String(64), ForeignKey("agent_runs.id"), nullable=False, index=True)
    document_id = Column(String(64), ForeignKey("compliance_documents.id"), nullable=False)
    requirement_key = Column(String(128), nullable=False)
    status = Column(String(64), nullable=False)  # compliant, non_compliant, inconclusive
    evidence_excerpt = Column(Text, nullable=False)
    citation = Column(String(255), nullable=False)
    evaluated_at = Column(String(64), default=get_iso_now, nullable=False)

    run = relationship("AgentRun", back_populates="compliance_evaluations")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    sequence_number = Column(Integer, nullable=False, index=True)
    previous_hash = Column(String(128), nullable=False)
    event_hash = Column(String(128), unique=True, nullable=False, index=True)
    event_type = Column(String(64), nullable=False, index=True)
    entity_type = Column(String(64), nullable=False)
    entity_id = Column(String(64), nullable=False)
    actor_id = Column(String(64), nullable=False)
    actor_role = Column(String(64), nullable=False)
    details = Column(Text, nullable=False)
    canonical_payload = Column(Text, nullable=False)
    created_at = Column(String(64), default=get_iso_now, nullable=False)

    organization = relationship("Organization", back_populates="audit_events")


class MerkleBlock(Base):
    __tablename__ = "merkle_blocks"

    id = Column(String(64), primary_key=True)
    organization_id = Column(String(64), ForeignKey("organizations.id"), nullable=False, index=True)
    block_number = Column(Integer, unique=True, nullable=False, index=True)
    root_hash = Column(String(128), unique=True, nullable=False, index=True)
    previous_block_hash = Column(String(128), nullable=False)
    leaf_count = Column(Integer, nullable=False)
    leaf_hashes_json = Column(Text, nullable=False)
    signatures_json = Column(Text, nullable=False)
    sealed_by = Column(String(255), nullable=False)
    signer_public_key = Column(String(128), nullable=False)
    mission_id = Column(String(64), nullable=False)
    mission_title = Column(String(255), nullable=False)
    status = Column(String(64), default="sealed", nullable=False)
    sealed_at = Column(String(64), default=get_iso_now, nullable=False)

    organization = relationship("Organization", back_populates="merkle_blocks")


# --- Database Session Dependency ---

def get_db() -> Generator[Session, None, None]:
    """Yield a database session within an explicit transaction boundary."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Database Initializer & Seeder ---

def init_db():
    """Create all tables and seed initial operational state."""
    Base.metadata.create_all(bind=engine)
    if engine.dialect.name == "sqlite":
        with engine.connect() as conn:
            try:
                cursor = conn.execute(text("PRAGMA table_info(inventory)"))
                cols = [row[1] for row in cursor.fetchall()]
                if "on_order_quantity" not in cols and len(cols) > 0:
                    conn.execute(text("ALTER TABLE inventory ADD COLUMN on_order_quantity INTEGER NOT NULL DEFAULT 0"))
                    conn.commit()
            except Exception as e:
                print(f"[AETHERIS DB] Schema check notice: {e}")
    with SessionLocal() as db:
        seed_database(db)


def seed_database(db: Session):
    """Seed the database with deterministic baseline data if empty."""
    # Check if organization exists
    org = db.query(Organization).filter(Organization.id == "org-aetheris-01").first()
    if org:
        return  # Already seeded

    # 1. Create Organization
    org = Organization(
        id="org-aetheris-01",
        name="Aetheris Global Holdings Ltd.",
        slug="aetheris-global",
        max_autonomous_spend_usd=5000.0,
        created_at=get_iso_now()
    )
    db.add(org)
    db.flush()  # Persist organization first so all foreign key constraints are satisfied

    # 2. Seed Users with real Ed25519 keypairs and bcrypt password hashes
    default_pw_hash = bcrypt.hashpw(b"Aetheris2026!", bcrypt.gensalt()).decode("utf-8")
    now = get_iso_now()

    users_seed_data = [
        ("usr-exec-01", "executive@aetheris.ai", "Elena Rostova", "executive", "Executive Board & Investment Committee", "#2563eb"),
        ("usr-comp-02", "compliance@aetheris.ai", "Dr. Marcus Vance", "compliance_officer", "Global Regulatory & Trade Governance", "#0284c7"),
        ("usr-ops-03", "operations@aetheris.ai", "Kavita Sharma", "operations_director", "Multi-Modal Logistics & Supply Chain", "#ff6b00"),
        ("usr-audit-04", "auditor@aetheris.ai", "Satoshi Lin", "auditor", "Independent Cryptographic Attestation", "#4f46e5"),
    ]

    for uid, email, name, role, dept, color in users_seed_data:
        priv_hex, pub_hex = generate_ed25519_keypair()
        user = User(
            id=uid,
            organization_id=org.id,
            email=email,
            password_hash=default_pw_hash,
            name=name,
            role=role,
            department=dept,
            avatar_color=color,
            public_key=f"ed25519:pub_{pub_hex}",
            private_key=priv_hex,
            created_at=now,
            last_login_at=now
        )
        db.add(user)

    # 3. Seed Products
    product = Product(
        id="prod-aero-flanges",
        organization_id=org.id,
        sku="SKU-AERO-TI500",
        name="Aerospace Titanium Precision Flanges",
        description="Dual-use aerospace grade precision forged titanium mounting flanges.",
        unit="units"
    )
    db.add(product)
    db.flush()  # Persist users and products

    # 4. Seed Inventory: 300 units on hand (Shortage Scenario: Order requires 500 units)
    inventory = Inventory(
        id="inv-hub-frankfurt-01",
        organization_id=org.id,
        product_sku="SKU-AERO-TI500",
        warehouse_location="Frankfurt Air Logistics Hub (FRA-01)",
        quantity_on_hand=300,
        reserved_quantity=0,
        on_order_quantity=0,
        min_safety_stock=50,
        updated_at=now
    )
    db.add(inventory)

    # 5. Seed Customer Order: Requires 500 units, resulting in 200 units shortage
    order = Order(
        id="ord-2026-500",
        organization_id=org.id,
        order_number="ORD-2026-500",
        customer_name="Airbus Defense & Space (Munich Facility)",
        product_sku="SKU-AERO-TI500",
        required_quantity=500,
        unit_price_usd=85.0,
        destination_jurisdiction="Germany (DE)",
        status="shortage_detected",
        deadline_days=5,
        created_at=now,
        updated_at=now
    )
    db.add(order)

    # 6. Seed Suppliers with realistic constraints & trade-offs
    suppliers_data = [
        (
            "sup-bavaria-01",
            "Bavaria Precision Metallics",
            "Germany (DE)",
            48.0,
            3,
            1200.0,
            "Air Cargo",
            True,
            98.5
        ),
        (
            "sup-nordic-02",
            "Nordic Aerospace Forgings",
            "Sweden (SE)",
            42.0,
            8,
            600.0,
            "Multimodal Rail",
            True,
            94.0
        ),
        (
            "sup-transpac-03",
            "Trans-Pacific Alloy Dynamics",
            "South Korea (KR)",
            38.0,
            19,
            350.0,
            "Maritime",
            False,
            89.0
        )
    ]

    for sid, name, country, unit_cost, lead_time, freight, mode, cert, rel in suppliers_data:
        sup = Supplier(
            id=sid,
            organization_id=org.id,
            name=name,
            country=country,
            unit_cost_usd=unit_cost,
            lead_time_days=lead_time,
            freight_cost_usd=freight,
            freight_mode=mode,
            compliance_certified=cert,
            reliability_score=rel,
            is_active=True
        )
        db.add(sup)
    db.flush()  # Persist inventory, order, and suppliers

    # 7. Seed Approved Compliance Documents
    compliance_docs = [
        (
            "DOC-US-EAR99",
            "cf-us-ear",
            "US Export Administration Regulations (EAR) / BIS",
            "US",
            "2026.1",
            "15 CFR Parts 730-774 & Commerce Control List (CCL)",
            "Commercial aerospace mounting brackets under ECCN 9A991 are classified under NLR (No License Required) for consignees certified on the Consolidated Screening List (CSL) without SDN flags.",
            "2026-01-01"
        ),
        (
            "DOC-EU-CBAM-2023",
            "cf-global-cbam",
            "EU Carbon Border Adjustment Mechanism (CBAM)",
            "EU",
            "Regulation (EU) 2023/956",
            "Article 6: Embedded Emissions & Declarations",
            "Importers of iron, steel, and aluminum commodities must verify embedded emissions in quarterly customs filings. Suppliers utilizing certified green hydrogen smelting are exempt from punitive carbon levy penalties.",
            "2026-01-15"
        ),
        (
            "DOC-DE-LKSG",
            "cf-de-lksg",
            "German Supply Chain Due Diligence Act (LkSG)",
            "EU",
            "BGBI. I S. 2959",
            "Section 5: Environmental & Human Rights Due Diligence",
            "Tier-1 and Tier-2 suppliers servicing German industrial primes must maintain verified environmental certificates and active compliance monitoring to prevent statutory supply line stops.",
            "2026-02-01"
        )
    ]

    for did, fid, fname, jur, ver, stitle, passage, eff in compliance_docs:
        doc = ComplianceDocument(
            id=did,
            organization_id=org.id,
            framework_id=fid,
            framework_name=fname,
            jurisdiction=jur,
            version=ver,
            source_title=stitle,
            passage_text=passage,
            effective_date=eff,
            is_active=True
        )
        db.add(doc)

    # 8. Seed Initial Genesis Audit Event
    genesis_payload = {"genesis": "AETHERIS_AEOS_STATE_GENESIS", "organization": org.name, "timestamp": now}
    payload_hash = sha256_hex(json.dumps(genesis_payload, sort_keys=True).encode("utf-8"))
    genesis_hash = compute_chained_hash("0x0000000000000000000000000000000000000000000000000000000000000000", 1, "SYSTEM_GENESIS", payload_hash)

    audit_event = AuditEvent(
        id="evt-genesis-001",
        organization_id=org.id,
        sequence_number=1,
        previous_hash="0x0000000000000000000000000000000000000000000000000000000000000000",
        event_hash=genesis_hash,
        event_type="SYSTEM_GENESIS",
        entity_type="system",
        entity_id="aetheris-node-01",
        actor_id="system",
        actor_role="system",
        details="AETHERIS AEOS Relational State Initialized with ACID Persistence.",
        canonical_payload=json.dumps(genesis_payload),
        created_at=now
    )
    db.add(audit_event)
    db.flush()  # Persist compliance docs and genesis audit event

    # 9. Commit transaction atomically
    db.commit()
    print("[AETHERIS DB] Database initialized and seeded successfully.")
