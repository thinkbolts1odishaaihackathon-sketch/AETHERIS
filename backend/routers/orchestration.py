"""AETHERIS AEOS Autonomous Orchestration Router.

Exposes typed API endpoints for:
- Operational recovery scenario execution
- Multi-agent state monitoring (Apex, Sentinel, Conductor, Alpha, Auditor)
- Human-in-the-loop approval workflows with RBAC enforcement
- Live inventory, order, and supplier telemetry
- Mathematical Merkle proof and Ed25519 signature verification
"""

import json
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

try:
    from ..database import (
        get_db, Order, Inventory, Supplier, PurchaseOrder,
        AgentRun, AgentTask, ApprovalRequest, MerkleBlock,
        ComplianceDocument, ComplianceEvaluation, User
    )
    from ..auth import get_current_user, require_role, UserPublicProfile
    from ..crypto_engine import verify_signature, build_merkle_tree, generate_merkle_proof, verify_merkle_proof
    from ..services.orchestrator import (
        start_operational_recovery_mission, decide_approval_request, cancel_agent_run
    )
    from ..services.operations import receive_goods_shipment
except (ImportError, ValueError):
    from database import (
        get_db, Order, Inventory, Supplier, PurchaseOrder,
        AgentRun, AgentTask, ApprovalRequest, MerkleBlock,
        ComplianceDocument, ComplianceEvaluation, User
    )
    from auth import get_current_user, require_role, UserPublicProfile
    from crypto_engine import verify_signature, build_merkle_tree, generate_merkle_proof, verify_merkle_proof
    from services.orchestrator import (
        start_operational_recovery_mission, decide_approval_request, cancel_agent_run
    )
    from services.operations import receive_goods_shipment

router = APIRouter(prefix="/api/orchestration", tags=["Autonomous Multi-Agent Orchestration"])


# --- Request Schemas ---

class StartRecoveryRequest(BaseModel):
    orderId: Optional[str] = "ord-2026-500"
    directive: Optional[str] = None


class DecideApprovalRequest(BaseModel):
    decision: str = Field(..., pattern="^(approved|rejected)$")
    comments: Optional[str] = None
    allowSelfApproval: Optional[bool] = False


class ConfirmReceiptRequest(BaseModel):
    purchaseOrderId: str
    receiptNotes: Optional[str] = None


# --- Endpoints ---

@router.post("/runs/start-recovery")
async def start_recovery(
    req: StartRecoveryRequest,
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initiate the full autonomous operational recovery workflow.
    Detects shortage -> Co-ordinates agents -> Checks compliance -> Enforces spending threshold.
    """
    try:
        result = start_operational_recovery_mission(
            db=db,
            organization_id=current_user.organization,
            actor_id=current_user.id,
            actor_role=current_user.role,
            order_id=req.orderId or "ord-2026-500",
            directive_override=req.directive
        )
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail={"success": False, "message": str(e)})


@router.get("/runs")
async def list_runs(
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all agent runs for the user's organization."""
    runs = db.query(AgentRun).filter(
        AgentRun.organization_id == current_user.organization
    ).order_by(AgentRun.created_at.desc()).limit(30).all()

    items = []
    for r in runs:
        task_count = db.query(AgentTask).filter(AgentTask.run_id == r.id).count()
        items.append({
            "id": r.id,
            "missionTitle": r.mission_title,
            "directive": r.directive,
            "status": r.status,
            "currentPhase": r.current_phase,
            "summary": r.summary,
            "taskCount": task_count,
            "createdAt": r.created_at,
            "completedAt": r.completed_at
        })
    return {"success": True, "runs": items}


@router.get("/runs/{run_id}")
async def get_run_details(
    run_id: str,
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve full details of an agent run including all agent tasks and tool traces."""
    run = db.query(AgentRun).filter(
        AgentRun.id == run_id,
        AgentRun.organization_id == current_user.organization
    ).first()
    if not run:
        raise HTTPException(status_code=404, detail={"success": False, "message": f"Run '{run_id}' not found."})

    tasks = db.query(AgentTask).filter(AgentTask.run_id == run.id).all()
    approvals = db.query(ApprovalRequest).filter(ApprovalRequest.run_id == run.id).all()

    formatted_tasks = []
    for t in tasks:
        try:
            thought_chain = json.loads(t.thought_chain_json)
        except Exception:
            thought_chain = []
        try:
            tool_input = json.loads(t.tool_input_json)
        except Exception:
            tool_input = {}
        try:
            tool_output = json.loads(t.tool_output_json)
        except Exception:
            tool_output = {}

        formatted_tasks.append({
            "id": t.id,
            "agentRole": t.agent_role,
            "agentName": t.agent_name,
            "objective": t.objective,
            "status": t.status,
            "thoughtChain": thought_chain,
            "toolName": t.tool_name,
            "toolInput": tool_input,
            "toolOutput": tool_output,
            "consensusVote": t.consensus_vote,
            "cryptographicHash": t.cryptographic_hash,
            "durationMs": t.duration_ms,
            "createdAt": t.created_at,
            "completedAt": t.completed_at
        })

    formatted_approvals = [
        {
            "id": a.id,
            "requestedAction": a.requested_action,
            "reason": a.reason,
            "amountUsd": a.amount_usd,
            "thresholdUsd": a.threshold_usd,
            "status": a.status,
            "requiredRole": a.required_role,
            "decidedBy": a.decided_by_user_id,
            "decidedAt": a.decided_at,
            "createdAt": a.created_at
        }
        for a in approvals
    ]

    return {
        "success": True,
        "run": {
            "id": run.id,
            "missionTitle": run.mission_title,
            "directive": run.directive,
            "status": run.status,
            "currentPhase": run.current_phase,
            "summary": run.summary,
            "createdAt": run.created_at,
            "completedAt": run.completed_at,
            "tasks": formatted_tasks,
            "approvals": formatted_approvals
        }
    }


@router.post("/runs/{run_id}/cancel")
async def cancel_run(
    run_id: str,
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Safely cancel an active run."""
    try:
        result = cancel_agent_run(db, run_id, current_user.id)
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=400, detail={"success": False, "message": str(e)})


@router.get("/approvals")
async def list_approvals(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List pending or historic approval requests."""
    query = db.query(ApprovalRequest).filter(
        ApprovalRequest.organization_id == current_user.organization
    )
    if status_filter:
        query = query.filter(ApprovalRequest.status == status_filter)

    approvals = query.order_by(ApprovalRequest.created_at.desc()).all()
    return {
        "success": True,
        "approvals": [
            {
                "id": a.id,
                "runId": a.run_id,
                "purchaseOrderId": a.purchase_order_id,
                "requestedAction": a.requested_action,
                "reason": a.reason,
                "amountUsd": a.amount_usd,
                "thresholdUsd": a.threshold_usd,
                "status": a.status,
                "requiredRole": a.required_role,
                "decidedBy": a.decided_by_user_id,
                "decidedAt": a.decided_at,
                "createdAt": a.created_at
            }
            for a in approvals
        ]
    }


@router.post("/approvals/{approval_id}/decide")
async def decide_approval(
    approval_id: str,
    req: DecideApprovalRequest,
    current_user: UserPublicProfile = Depends(require_role(["operations_director", "executive"])),
    db: Session = Depends(get_db)
):
    """
    Designated human approver decides on a privileged threshold action.
    Requires role: 'operations_director' or 'executive'.
    Enforces separation of duties unless allowSelfApproval override is explicitly supplied.
    """
    try:
        result = decide_approval_request(
            db=db,
            organization_id=current_user.organization,
            approval_id=approval_id,
            decision=req.decision,
            user_id=current_user.id,
            user_role=current_user.role,
            allow_self_approval=bool(req.allowSelfApproval)
        )
        return {"success": True, **result}
    except PermissionError as pe:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"success": False, "message": str(pe), "code": "SEPARATION_OF_DUTIES_VIOLATION"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail={"success": False, "message": str(e)})


@router.post("/receipts/confirm")
async def confirm_goods_receipt(
    req: ConfirmReceiptRequest,
    current_user: UserPublicProfile = Depends(require_role(["operations_director", "executive"])),
    db: Session = Depends(get_db)
):
    """
    Warehouse check-in & goods receipt confirmation.
    Transitions inventory from on-order to physical on-hand stock and satisfies customer order.
    """
    try:
        result = receive_goods_shipment(
            db=db,
            organization_id=current_user.organization,
            purchase_order_id=req.purchaseOrderId,
            actor_id=current_user.id,
            actor_role=current_user.role,
            receipt_notes=req.receiptNotes
        )
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=400, detail={"success": False, "message": str(e)})


@router.get("/inventory")
async def get_inventory_status(
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch live operational inventory, customer orders, and supplier catalogs."""
    orders = db.query(Order).filter(Order.organization_id == current_user.organization).all()
    inventory = db.query(Inventory).filter(Inventory.organization_id == current_user.organization).all()
    suppliers = db.query(Supplier).filter(Supplier.organization_id == current_user.organization).all()
    pos = db.query(PurchaseOrder).filter(PurchaseOrder.organization_id == current_user.organization).all()

    return {
        "success": True,
        "orders": [
            {
                "id": o.id,
                "orderNumber": o.order_number,
                "customerName": o.customer_name,
                "sku": o.product_sku,
                "requiredQuantity": o.required_quantity,
                "unitPriceUsd": o.unit_price_usd,
                "destinationJurisdiction": o.destination_jurisdiction,
                "status": o.status,
                "deadlineDays": o.deadline_days,
                "createdAt": o.created_at
            }
            for o in orders
        ],
        "inventory": [
            {
                "id": i.id,
                "sku": i.product_sku,
                "location": i.warehouse_location,
                "quantityOnHand": i.quantity_on_hand,
                "reservedQuantity": i.reserved_quantity,
                "onOrderQuantity": i.on_order_quantity,
                "availableQuantity": max(0, i.quantity_on_hand - i.reserved_quantity),
                "minSafetyStock": i.min_safety_stock,
                "updatedAt": i.updated_at
            }
            for i in inventory
        ],
        "suppliers": [
            {
                "id": s.id,
                "name": s.name,
                "country": s.country,
                "unitCostUsd": s.unit_cost_usd,
                "leadTimeDays": s.lead_time_days,
                "freightCostUsd": s.freight_cost_usd,
                "transitMode": s.freight_mode,
                "complianceCertified": s.compliance_certified,
                "reliabilityScore": s.reliability_score
            }
            for s in suppliers
        ],
        "purchaseOrders": [
            {
                "id": p.id,
                "orderId": p.order_id,
                "supplierId": p.supplier_id,
                "quantity": p.quantity,
                "totalCostUsd": p.total_cost_usd,
                "transitMode": p.transit_mode,
                "status": p.status,
                "trackingReference": p.tracking_reference,
                "createdAt": p.created_at,
                "executedAt": p.executed_at
            }
            for p in pos
        ]
    }


@router.get("/merkle/blocks")
async def get_merkle_blocks(
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List real sealed Merkle blocks."""
    blocks = db.query(MerkleBlock).filter(
        MerkleBlock.organization_id == current_user.organization
    ).order_by(MerkleBlock.block_number.desc()).limit(20).all()

    items = []
    for b in blocks:
        try:
            leaves = json.loads(b.leaf_hashes_json)
        except Exception:
            leaves = []
        try:
            sigs = json.loads(b.signatures_json)
        except Exception:
            sigs = []

        items.append({
            "id": b.id,
            "blockNumber": b.block_number,
            "rootHash": b.root_hash,
            "previousBlockHash": b.previous_block_hash,
            "leafCount": b.leaf_count,
            "leaves": leaves,
            "signatures": sigs,
            "sealedBy": b.sealed_by,
            "signerPublicKey": b.signer_public_key,
            "missionId": b.mission_id,
            "missionTitle": b.mission_title,
            "status": b.status,
            "sealedAt": b.sealed_at
        })
    return {"success": True, "blocks": items}


@router.get("/merkle/verify/{block_number}")
async def verify_merkle_block(
    block_number: int,
    db: Session = Depends(get_db)
):
    """
    Perform independent mathematical verification of a stored Merkle Block:
    1. Recompute binary SHA-256 tree from stored leaves.
    2. Verify matching root hash.
    3. Generate inclusion proof for leaf 0.
    4. Verify Ed25519 digital signature against public key.
    """
    block = db.query(MerkleBlock).filter(MerkleBlock.block_number == block_number).first()
    if not block:
        raise HTTPException(status_code=404, detail={"success": False, "message": f"Block #{block_number} not found."})

    try:
        leaves = json.loads(block.leaf_hashes_json)
        sigs = json.loads(block.signatures_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "message": f"Malformed block data: {e}"})

    # 1. Recompute tree
    tree = build_merkle_tree(leaves)
    recalculated_root = tree["rootHash"]
    root_matches = (recalculated_root.lower() == block.root_hash.lower())

    # 2. Generate inclusion proof for leaf 0
    proof = generate_merkle_proof(tree["levels"], 0) if leaves else []
    proof_valid = verify_merkle_proof(leaves[0], proof, recalculated_root) if leaves else True

    # 3. Verify digital signature
    sig_valid = False
    signer_info = ""
    if sigs:
        sig_entry = sigs[0]
        parts = sig_entry.split(":")
        sig_hex = parts[-1]
        pub_key = block.signer_public_key
        sig_valid = verify_signature(pub_key, block.root_hash.encode("utf-8"), sig_hex)
        signer_info = f"Public Key: {pub_key}"

    all_verified = root_matches and proof_valid and sig_valid

    return {
        "success": True,
        "blockNumber": block.block_number,
        "rootHash": block.root_hash,
        "recalculatedRoot": recalculated_root,
        "rootMatches": root_matches,
        "inclusionProofValid": proof_valid,
        "signatureValid": sig_valid,
        "signer": block.sealed_by,
        "signerPublicKey": block.signer_public_key,
        "overallCryptographicIntegrity": "VERIFIED_TAMPER_PROOF" if all_verified else "VERIFICATION_FAILED",
        "leafCount": len(leaves),
        "inclusionProofSample": proof
    }


@router.get("/compliance/documents")
async def list_compliance_documents(
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List approved compliance documents with versions, passages, and citations."""
    docs = db.query(ComplianceDocument).filter(
        ComplianceDocument.organization_id == current_user.organization,
        ComplianceDocument.is_active == True
    ).all()

    return {
        "success": True,
        "documents": [
            {
                "id": d.id,
                "frameworkId": d.framework_id,
                "frameworkName": d.framework_name,
                "jurisdiction": d.jurisdiction,
                "version": d.version,
                "sourceTitle": d.source_title,
                "passageText": d.passage_text,
                "effectiveDate": d.effective_date
            }
            for d in docs
        ]
    }


@router.get("/compliance/evaluations")
async def list_compliance_evaluations(
    current_user: UserPublicProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List evidence-backed compliance findings with source citations."""
    evals = db.query(ComplianceEvaluation).filter(
        ComplianceEvaluation.organization_id == current_user.organization
    ).order_by(ComplianceEvaluation.evaluated_at.desc()).limit(50).all()

    return {
        "success": True,
        "evaluations": [
            {
                "id": e.id,
                "runId": e.run_id,
                "documentId": e.document_id,
                "requirementKey": e.requirement_key,
                "status": e.status,
                "evidenceExcerpt": e.evidence_excerpt,
                "citation": e.citation,
                "evaluatedAt": e.evaluated_at
            }
            for e in evals
        ]
    }
