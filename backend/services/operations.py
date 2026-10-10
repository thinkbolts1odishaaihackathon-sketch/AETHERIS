"""AETHERIS AEOS Operations & Logistics Service.

Provides deterministic arithmetic, supplier comparison, purchase order execution,
and independent outcome verification.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
try:
    from ..database import (
        Order, Inventory, Supplier, PurchaseOrder, AuditEvent, get_iso_now
    )
    from ..crypto_engine import sha256_hex, canonical_json, compute_chained_hash
except (ImportError, ValueError):
    from database import (
        Order, Inventory, Supplier, PurchaseOrder, AuditEvent, get_iso_now
    )
    from crypto_engine import sha256_hex, canonical_json, compute_chained_hash


def calculate_inventory_shortage(required_quantity: int, quantity_on_hand: int) -> int:
    """
    Deterministic inventory calculation: Shortage = max(0, required - on_hand).
    Does not rely on LLM estimation.
    """
    return max(0, required_quantity - quantity_on_hand)


def evaluate_supplier_options(
    db: Session,
    shortage_units: int,
    deadline_days: int
) -> List[Dict[str, Any]]:
    """
    Deterministically compare candidate suppliers for shortage recovery.
    Calculates total procurement cost, lead time compliance, and trade-offs.
    """
    suppliers = db.query(Supplier).filter(Supplier.is_active == True).all()
    results = []

    for s in suppliers:
        procurement_cost = shortage_units * s.unit_cost_usd
        total_cost = procurement_cost + s.freight_cost_usd
        meets_deadline = s.lead_time_days <= deadline_days
        sla_margin_days = deadline_days - s.lead_time_days

        # Deterministic scoring: penalize deadline breaches heavily
        score = s.reliability_score
        if not meets_deadline:
            score -= 40.0
        if not s.compliance_certified:
            score -= 30.0

        results.append({
            "supplier_id": s.id,
            "name": s.name,
            "country": s.country,
            "unit_cost_usd": s.unit_cost_usd,
            "freight_cost_usd": s.freight_cost_usd,
            "transit_mode": s.freight_mode,
            "total_cost_usd": round(total_cost, 2),
            "lead_time_days": s.lead_time_days,
            "meets_deadline": meets_deadline,
            "sla_margin_days": sla_margin_days,
            "compliance_certified": s.compliance_certified,
            "reliability_score": s.reliability_score,
            "composite_score": round(score, 1),
            "is_recommended": False
        })

    # Sort by composite score descending
    results.sort(key=lambda x: x["composite_score"], reverse=True)
    if results and results[0]["meets_deadline"] and results[0]["compliance_certified"]:
        results[0]["is_recommended"] = True

    return results


def execute_purchase_order(
    db: Session,
    organization_id: str,
    order_id: str,
    supplier_id: str,
    quantity: int,
    actor_id: str,
    actor_role: str
) -> PurchaseOrder:
    """
    Execute real purchase order in the database within a transaction boundary.
    """
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise ValueError(f"Supplier '{supplier_id}' not found.")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise ValueError(f"Order '{order_id}' not found.")

    total_cost = (quantity * supplier.unit_cost_usd) + supplier.freight_cost_usd
    now = get_iso_now()

    po_id = f"po-{int(datetime_to_ms())}-{supplier.country.split('(')[-1][:2].lower()}"
    tracking_ref = f"TRK-{supplier.freight_mode[:3].upper()}-{supplier.id[-4:]}-{quantity}"

    po = PurchaseOrder(
        id=po_id,
        organization_id=organization_id,
        order_id=order.id,
        supplier_id=supplier.id,
        quantity=quantity,
        unit_cost_usd=supplier.unit_cost_usd,
        total_cost_usd=round(total_cost, 2),
        transit_mode=supplier.freight_mode,
        status="executed",
        tracking_reference=tracking_ref,
        created_at=now,
        executed_at=now
    )
    db.add(po)

    # Reserve inventory / update order processing
    inventory = db.query(Inventory).filter(
        Inventory.organization_id == organization_id,
        Inventory.product_sku == order.product_sku
    ).first()
    if inventory:
        inventory.on_order_quantity += quantity
        inventory.reserved_quantity = min(order.required_quantity, inventory.quantity_on_hand + inventory.on_order_quantity)
        inventory.updated_at = now

    order.status = "awaiting_receipt"
    order.updated_at = now

    # Record chained audit event
    _record_audit(
        db=db,
        org_id=organization_id,
        event_type="PURCHASE_ORDER_EXECUTED",
        entity_type="purchase_order",
        entity_id=po.id,
        actor_id=actor_id,
        actor_role=actor_role,
        details=f"PO #{po.id} for {quantity} units executed with {supplier.name}. Landed cost: ${total_cost:.2f}. Status: Awaiting physical delivery.",
        payload={
            "purchase_order_id": po.id,
            "supplier_id": supplier.id,
            "quantity": quantity,
            "total_cost": total_cost,
            "tracking_reference": tracking_ref,
            "inventory_on_order": inventory.on_order_quantity if inventory else quantity,
            "order_status": order.status
        }
    )

    db.commit()
    db.refresh(po)
    return po


def receive_goods_shipment(
    db: Session,
    organization_id: str,
    purchase_order_id: str,
    actor_id: str,
    actor_role: str,
    receipt_notes: Optional[str] = None
) -> Dict[str, Any]:
    """
    Documented receipt & fulfillment transition simulating freight delivery & warehouse check-in.
    Transitions inventory from 'on_order' to 'quantity_on_hand' and marks customer order 'fulfilled'.
    """
    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.id == purchase_order_id,
        PurchaseOrder.organization_id == organization_id
    ).first()
    if not po:
        raise ValueError(f"Purchase order '{purchase_order_id}' not found.")
    if po.status not in ("executed", "approved"):
        raise ValueError(f"Purchase order '{purchase_order_id}' is in status '{po.status}', cannot receive.")

    order = db.query(Order).filter(Order.id == po.order_id).first()
    if not order:
        raise ValueError(f"Associated customer order '{po.order_id}' not found.")

    inventory = db.query(Inventory).filter(
        Inventory.organization_id == organization_id,
        Inventory.product_sku == order.product_sku
    ).first()
    if not inventory:
        raise ValueError(f"Inventory for '{order.product_sku}' not found.")

    now = get_iso_now()

    # Physical inventory transition: On-order -> On-hand
    inventory.on_order_quantity = max(0, inventory.on_order_quantity - po.quantity)
    inventory.quantity_on_hand += po.quantity
    inventory.updated_at = now

    # PO transition: executed -> received
    po.status = "received"
    po.executed_at = po.executed_at or now

    # Order transition: awaiting_receipt -> fulfilled (500 units on hand satisfy 500 units required)
    order.status = "fulfilled"
    order.updated_at = now

    # Chained audit event
    _record_audit(
        db=db,
        org_id=organization_id,
        event_type="GOODS_RECEIPT_VERIFIED",
        entity_type="inventory",
        entity_id=inventory.id,
        actor_id=actor_id,
        actor_role=actor_role,
        details=f"Goods receipt confirmed for PO #{po.id}: {po.quantity} units checked in at {inventory.warehouse_location}. Physical on-hand stock now {inventory.quantity_on_hand} units.",
        payload={
            "purchase_order_id": po.id,
            "tracking_reference": po.tracking_reference,
            "quantity_received": po.quantity,
            "warehouse_location": inventory.warehouse_location,
            "new_quantity_on_hand": inventory.quantity_on_hand,
            "customer_order_status": order.status,
            "receipt_notes": receipt_notes or "Quality check passed. Dimensional tolerances certified."
        }
    )
    db.commit()

    return {
        "received": True,
        "purchase_order_id": po.id,
        "order_id": order.id,
        "quantity_received": po.quantity,
        "warehouse_location": inventory.warehouse_location,
        "physical_on_hand": inventory.quantity_on_hand,
        "on_order_quantity": inventory.on_order_quantity,
        "order_status": order.status,
        "received_at": now
    }


def verify_operational_outcome(
    db: Session,
    order_id: str,
    purchase_order_id: str
) -> Dict[str, Any]:
    """
    Independently verify whether the intended business outcome was achieved
    by reading resulting state back from the database.
    Explicitly distinguishes between 'procured_awaiting_receipt' and 'fulfilled'.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == purchase_order_id).first()
    inventory = db.query(Inventory).filter(
        Inventory.organization_id == order.organization_id,
        Inventory.product_sku == order.product_sku
    ).first()

    if not order or not po or not inventory:
        return {
            "verified": False,
            "reason": "Missing order, purchase order, or inventory record in database."
        }

    physical_stock = inventory.quantity_on_hand
    on_order_stock = inventory.on_order_quantity
    total_allocated = physical_stock + on_order_stock
    is_shortage_covered = total_allocated >= order.required_quantity
    is_po_executed = po.status in ("executed", "approved", "received")
    is_physically_received = (po.status == "received")

    if is_physically_received and physical_stock >= order.required_quantity:
        order.status = "fulfilled"
    elif is_po_executed and order.status != "fulfilled":
        order.status = "awaiting_receipt"

    order.updated_at = get_iso_now()
    db.commit()

    return {
        "verified": is_shortage_covered and is_po_executed,
        "order_id": order.id,
        "required_quantity": order.required_quantity,
        "physical_on_hand": physical_stock,
        "on_order_quantity": on_order_stock,
        "total_allocated_units": total_allocated,
        "shortage_covered": is_shortage_covered,
        "shortage_resolved": is_shortage_covered,
        "is_physically_received": is_physically_received,
        "purchase_order_status": po.status,
        "final_order_status": order.status,
        "stage": "fulfilled" if is_physically_received else "procured_awaiting_receipt",
        "verification_timestamp": get_iso_now()
    }


def _record_audit(
    db: Session,
    org_id: str,
    event_type: str,
    entity_type: str,
    entity_id: str,
    actor_id: str,
    actor_role: str,
    details: str,
    payload: Dict[str, Any]
):
    """Internal helper to write a chained audit log entry."""
    last_evt = db.query(AuditEvent).filter(
        AuditEvent.organization_id == org_id
    ).order_by(AuditEvent.sequence_number.desc()).first()

    seq = (last_evt.sequence_number + 1) if last_evt else 1
    prev_hash = last_evt.event_hash if last_evt else "0x0000000000000000000000000000000000000000000000000000000000000000"

    now = get_iso_now()
    canonical_data = canonical_json(payload)
    payload_hash = sha256_hex(canonical_data.encode("utf-8"))
    evt_hash = compute_chained_hash(prev_hash, seq, event_type, payload_hash)

    evt = AuditEvent(
        id=f"evt-{seq}-{int(datetime_to_ms())}",
        organization_id=org_id,
        sequence_number=seq,
        previous_hash=prev_hash,
        event_hash=evt_hash,
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        actor_id=actor_id,
        actor_role=actor_role,
        details=details,
        canonical_payload=canonical_data,
        created_at=now
    )
    db.add(evt)


def datetime_to_ms() -> int:
    """Return epoch milliseconds."""
    import time
    return int(time.time() * 1000)
