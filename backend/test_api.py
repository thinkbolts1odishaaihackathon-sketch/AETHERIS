"""AETHERIS AEOS Comprehensive Backend Test Suite.

Tests:
1. Health & Telemetry Endpoints
2. Authentication, Argon2/bcrypt Password Hashing, JWT Issuance & Session Verification
3. Role-Based Access Control (RBAC) & Authorization Boundaries
4. Deterministic Inventory Shortage Calculation & Multi-Factor Supplier Comparison
5. End-to-End Operational Recovery Workflow (500 units order, 300 units stock, 200 shortage)
6. Autonomous Spending Threshold & Separation of Duties Policy Enforcement
7. Unauthorized vs Authorized Approval Attempts (Role restriction & Four-Eyes Principle)
8. In-Transit Purchase Order Execution & Physical Goods Receipt Lifecycle (300 -> 500 units)
9. Mathematical SHA-256 Merkle Tree & Ed25519 Digital Signature Verification
10. Negative Cryptographic Attack Tests (Tampered payloads, invalid proofs, forged signatures)
11. Relational Database Persistence Across Application Sessions
"""

import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient

try:
    from main import app
    from database import (
        SessionLocal, Order, Inventory, PurchaseOrder, MerkleBlock, User, AuditEvent, init_db
    )
    from crypto_engine import (
        generate_ed25519_keypair, sign_message, verify_signature,
        compute_chained_hash, build_merkle_tree, generate_merkle_proof,
        verify_merkle_proof, sha256_hex
    )
except ImportError:
    from backend.main import app
    from backend.database import (
        SessionLocal, Order, Inventory, PurchaseOrder, MerkleBlock, User, AuditEvent, init_db
    )
    from backend.crypto_engine import (
        generate_ed25519_keypair, sign_message, verify_signature,
        compute_chained_hash, build_merkle_tree, generate_merkle_proof,
        verify_merkle_proof, sha256_hex
    )

client = TestClient(app)


def test_health_endpoints():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "FastAPI" in data["service"]

    sys_res = client.get("/api/system/health")
    assert sys_res.status_code == 200
    sys_data = sys_res.json()
    assert sys_data["status"] == "healthy"
    assert sys_data["activeAgents"] == 5
    assert "merkleHeight" in sys_data
    print("[PASS] Health & telemetry endpoints verified.")


def test_auth_and_rbac():
    # 1. Login with Executive account
    login_res = client.post("/api/auth/login", json={
        "email": "executive@aetheris.ai",
        "password": "Aetheris2026!"
    })
    assert login_res.status_code == 200, login_res.text
    auth_data = login_res.json()
    assert auth_data["success"] is True
    assert "token" in auth_data
    assert auth_data["user"]["role"] == "executive"
    token = auth_data["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["user"]["email"] == "executive@aetheris.ai"

    # 3. Executive can seal block (auditor or executive required)
    seal_res = client.post("/api/swarm/blocks/seal", headers=headers, json={
        "missionId": "test-mission",
        "missionTitle": "Cross-Border Settlement Pipeline",
        "leafCount": 5
    })
    assert seal_res.status_code == 201
    assert "0x" in seal_res.json()["block"]["rootHash"]

    # 4. Switch role to compliance_officer
    switch_res = client.post("/api/auth/switch-role", headers=headers, json={
        "role": "compliance_officer"
    })
    assert switch_res.status_code == 200
    comp_token = switch_res.json()["token"]
    comp_headers = {"Authorization": f"Bearer {comp_token}"}

    # 5. Verify RBAC restriction: compliance officer cannot seal block
    comp_seal_res = client.post("/api/swarm/blocks/seal", headers=comp_headers, json={
        "missionId": "unauthorized-mission"
    })
    assert comp_seal_res.status_code == 403
    assert "Forbidden" in comp_seal_res.json()["message"]

    # 6. Switch back to executive
    client.post("/api/auth/switch-role", headers=comp_headers, json={"role": "executive"})

    print("[PASS] Authentication & RBAC enforcement verified.")


def test_end_to_end_operational_recovery_scenario():
    """
    Demonstrates the complete 500-unit operational scenario:
    - Customer order requires 500 units, 300 units physical on-hand stock.
    - System detects 200 unit shortage.
    - Coordinates Apex, Conductor, Sentinel, Alpha.
    - Bavarian supplier selected ($48/unit + $1,200 air freight = $10,800).
    - Exceeds $5,000 threshold -> pauses at approval gate.
    - Unauthorized user cannot approve (auditor role rejected).
    - Separation of duties: run initiator (operations director) cannot self-approve without override.
    - Authorized Executive approves as independent second party.
    - Purchase order executed -> status 'issued', order status 'awaiting_receipt', on-order: 200.
    - Physical goods receipt executed -> inventory on-hand increases 300 -> 500, order status 'fulfilled'.
    - Merkle block sealed with Ed25519 digital signature.
    - Cryptographic verification independently recomputes root and validates inclusion proof.
    """
    # 0. Reset benchmark baseline state for repeatable deterministic testing
    with SessionLocal() as db:
        order = db.query(Order).filter(Order.id == "ord-2026-500").first()
        if order:
            order.status = "shortage_detected"
            order.required_quantity = 500
        inv = db.query(Inventory).filter(Inventory.id == "inv-hub-frankfurt-01").first()
        if inv:
            inv.quantity_on_hand = 300
            inv.on_order_quantity = 0
            inv.reserved_quantity = 0
        db.commit()

    # 1. Login as Operations Director (Initiator)
    ops_res = client.post("/api/auth/login", json={
        "email": "operations@aetheris.ai",
        "password": "Aetheris2026!"
    })
    assert ops_res.status_code == 200
    ops_token = ops_res.json()["token"]
    ops_headers = {"Authorization": f"Bearer {ops_token}"}

    # 2. Check initial inventory state
    inv_res = client.get("/api/orchestration/inventory", headers=ops_headers)
    assert inv_res.status_code == 200
    inv_data = inv_res.json()
    order = next(o for o in inv_data["orders"] if o["id"] == "ord-2026-500")
    inv_item = next(i for i in inv_data["inventory"] if i["sku"] == order["sku"])
    assert order["requiredQuantity"] == 500
    assert inv_item["quantityOnHand"] == 300

    # 3. Start Recovery Mission (initiated by usr-ops-03)
    start_res = client.post("/api/orchestration/runs/start-recovery", headers=ops_headers, json={
        "orderId": "ord-2026-500"
    })
    assert start_res.status_code == 200, start_res.text
    run_result = start_res.json()
    assert run_result["success"] is True
    assert run_result["status"] == "waiting_for_approval"
    assert run_result["shortage_units"] == 200
    assert run_result["total_cost_usd"] == 10800.0  # 200 * $48 + $1200
    assert run_result["threshold_usd"] == 5000.0
    approval_id = run_result["approval_id"]
    run_id = run_result["run_id"]

    # 4. Verify run details
    detail_res = client.get(f"/api/orchestration/runs/{run_id}", headers=ops_headers)
    assert detail_res.status_code == 200
    run_detail = detail_res.json()["run"]
    assert run_detail["status"] == "waiting_for_approval"
    assert len(run_detail["tasks"]) == 4  # Apex, Conductor, Sentinel, Alpha

    # 5. Test unauthorized role approval attempt (Auditor role cannot approve PO)
    auditor_res = client.post("/api/auth/login", json={
        "email": "auditor@aetheris.ai",
        "password": "Aetheris2026!"
    })
    assert auditor_res.status_code == 200
    auditor_token = auditor_res.json()["token"]
    auditor_headers = {"Authorization": f"Bearer {auditor_token}"}

    unauth_approval_res = client.post(
        f"/api/orchestration/approvals/{approval_id}/decide",
        headers=auditor_headers,
        json={"decision": "approved"}
    )
    assert unauth_approval_res.status_code == 403
    assert "Forbidden" in unauth_approval_res.json()["message"]

    # 6. Test Separation of Duties: Initiator cannot self-approve without explicit override
    self_approval_res = client.post(
        f"/api/orchestration/approvals/{approval_id}/decide",
        headers=ops_headers,
        json={"decision": "approved", "comments": "Self-approval attempt"}
    )
    assert self_approval_res.status_code == 403
    self_json = self_approval_res.json()
    assert self_json.get("code") == "SEPARATION_OF_DUTIES_VIOLATION" or "Separation of duties" in str(self_json)

    # 7. Authorized Approval by Executive (Independent second party, enforcing four-eyes principle)
    exec_res = client.post("/api/auth/login", json={
        "email": "executive@aetheris.ai",
        "password": "Aetheris2026!"
    })
    assert exec_res.status_code == 200
    exec_token = exec_res.json()["token"]
    exec_headers = {"Authorization": f"Bearer {exec_token}"}

    auth_approval_res = client.post(
        f"/api/orchestration/approvals/{approval_id}/decide",
        headers=exec_headers,
        json={"decision": "approved", "comments": "Authorized for critical customer SLA protection."}
    )
    assert auth_approval_res.status_code == 200, auth_approval_res.text
    exec_data = auth_approval_res.json()
    assert exec_data["status"] == "succeeded"
    assert exec_data["verification"]["verified"] is True
    assert exec_data["verification"]["shortage_resolved"] is True
    assert exec_data["verification"]["total_allocated_units"] == 500
    po_id = exec_data["purchase_order"]["id"]
    block_number = exec_data["merkle_block"]["block_number"]

    # 8. Verify In-Transit / Awaiting Receipt State in Relational DB
    with SessionLocal() as db:
        inv_check = db.query(Inventory).filter(Inventory.id == "inv-hub-frankfurt-01").first()
        assert inv_check.quantity_on_hand == 300, f"Expected 300 physical on hand, got {inv_check.quantity_on_hand}"
        assert inv_check.on_order_quantity == 200, f"Expected 200 on order, got {inv_check.on_order_quantity}"
        po_check = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        assert po_check.status in ("executed", "issued")
        order_check = db.query(Order).filter(Order.id == "ord-2026-500").first()
        assert order_check.status == "awaiting_receipt"

    # 9. Confirm Physical Goods Receipt at Logistics Hub (300 -> 500 units)
    receipt_res = client.post(
        "/api/orchestration/receipts/confirm",
        headers=ops_headers,
        json={"purchaseOrderId": po_id, "warehouseLocation": "Frankfurt Air Logistics Hub (FRA-01)"}
    )
    assert receipt_res.status_code == 200, receipt_res.text
    receipt_data = receipt_res.json()
    assert receipt_data["success"] is True
    assert receipt_data["quantity_received"] == 200
    assert receipt_data["physical_on_hand"] == 500
    assert receipt_data["on_order_quantity"] == 0
    assert receipt_data["order_status"] == "fulfilled"

    # Verify directly against database session
    with SessionLocal() as db:
        inv_post = db.query(Inventory).filter(Inventory.id == "inv-hub-frankfurt-01").first()
        assert inv_post.quantity_on_hand == 500
        assert inv_post.on_order_quantity == 0
        order_post = db.query(Order).filter(Order.id == "ord-2026-500").first()
        assert order_post.status == "fulfilled"
        po_post = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        assert po_post.status == "received"

    # 10. Mathematical Merkle & Ed25519 Verification
    verify_res = client.get(f"/api/orchestration/merkle/verify/{block_number}")
    assert verify_res.status_code == 200, verify_res.text
    verify_data = verify_res.json()
    assert verify_data["rootMatches"] is True
    assert verify_data["inclusionProofValid"] is True
    assert verify_data["signatureValid"] is True
    assert verify_data["overallCryptographicIntegrity"] == "VERIFIED_TAMPER_PROOF"

    # 11. Check Compliance Documents & Evaluations
    comp_docs_res = client.get("/api/orchestration/compliance/documents", headers=ops_headers)
    assert comp_docs_res.status_code == 200
    docs = comp_docs_res.json()["documents"]
    assert len(docs) >= 3

    comp_evals_res = client.get("/api/orchestration/compliance/evaluations", headers=ops_headers)
    assert comp_evals_res.status_code == 200
    evals = comp_evals_res.json()["evaluations"]
    assert len(evals) >= 3
    assert any(e["documentId"] in ("DOC-US-EAR99", "DOC-EU-CBAM-2023") or "15 CFR" in e["citation"] for e in evals)

    print("[PASS] End-to-end 500-unit operational recovery scenario & goods receipt verified.")


def test_cryptographic_tamper_resistance():
    """
    Validates mathematical tamper-resistance with negative attack vectors:
    1. Tampered payload fails hash-chain verification.
    2. Tampered leaf node fails Merkle root recalculation.
    3. Corrupted Merkle inclusion proof fails verification.
    4. Forged/tampered Ed25519 digital signature fails verification.
    5. Mismatched public key fails verification.
    """
    # 1. Negative Hash Chaining Test
    prev_hash = "0x" + "a" * 64
    seq = 42
    evt_type = "PURCHASE_ORDER_EXECUTED"
    valid_payload_hash = sha256_hex(b'{"order_id": "ord-2026-500", "units": 200}')
    valid_chain_hash = compute_chained_hash(prev_hash, seq, evt_type, valid_payload_hash)

    # Attack: Attacker alters payload (e.g. units: 500)
    tampered_payload_hash = sha256_hex(b'{"order_id": "ord-2026-500", "units": 500}')
    tampered_chain_hash = compute_chained_hash(prev_hash, seq, evt_type, tampered_payload_hash)
    assert valid_chain_hash != tampered_chain_hash, "Chained hash must detect payload tampering"

    # 2. Negative Merkle Root & Leaf Tampering Test
    leaves = [sha256_hex(f"leaf_{i}".encode("utf-8")) for i in range(8)]
    tree = build_merkle_tree(leaves)
    legit_root = tree["rootHash"]

    # Attacker alters leaf #3
    tampered_leaves = list(leaves)
    tampered_leaves[3] = sha256_hex(b"malicious_fraudulent_event")
    tampered_tree = build_merkle_tree(tampered_leaves)
    assert tampered_tree["rootHash"] != legit_root, "Tampered leaf must alter Merkle root"

    # 3. Inclusion Proof Verification and Tampering
    # Legitimate proof for leaf #2
    proof_2 = generate_merkle_proof(tree["levels"], 2)
    assert verify_merkle_proof(leaves[2], proof_2, legit_root) is True, "Valid proof must pass"

    # Attack: Attacker presents proof for leaf #2 but substitutes tampered leaf #2 content
    fake_leaf = sha256_hex(b"spoofed_leaf_content")
    assert verify_merkle_proof(fake_leaf, proof_2, legit_root) is False, "Proof must fail for tampered leaf"

    # Attack: Attacker corrupts one of the sibling hashes in proof
    corrupted_proof = [{"position": p["position"], "hash": p["hash"]} for p in proof_2]
    corrupted_proof[0]["hash"] = "0x" + "f" * 64
    assert verify_merkle_proof(leaves[2], corrupted_proof, legit_root) is False, "Proof must fail with corrupted sibling hash"

    # 4. Ed25519 Digital Signature Verification and Forgery Attacks
    priv_a, pub_a = generate_ed25519_keypair()
    priv_b, pub_b = generate_ed25519_keypair()

    message = legit_root.encode("utf-8")
    valid_sig = sign_message(priv_a, message)

    # Valid signature passes
    assert verify_signature(pub_a, message, valid_sig) is True

    # Attack: Attacker tampers with signed message (root)
    tampered_message = tampered_tree["rootHash"].encode("utf-8")
    assert verify_signature(pub_a, tampered_message, valid_sig) is False, "Signature must fail on altered message"

    # Attack: Signature created by party B presented as party A's signature
    forged_sig = sign_message(priv_b, message)
    assert verify_signature(pub_a, message, forged_sig) is False, "Signature from key B must fail verification under key A"

    # Attack: Corrupted signature bytes
    corrupted_sig = valid_sig[:-4] + "0000"
    assert verify_signature(pub_a, message, corrupted_sig) is False, "Corrupted signature bytes must fail verification"

    print("[PASS] Cryptographic tamper-resistance & attack tests passed.")


def test_database_persistence():
    """Verify that restarting the session reads persisted data from the relational DB."""
    with SessionLocal() as db:
        order = db.query(Order).filter(Order.id == "ord-2026-500").first()
        assert order is not None
        assert order.status in ("awaiting_receipt", "fulfilled")

        inv = db.query(Inventory).filter(Inventory.id == "inv-hub-frankfurt-01").first()
        assert inv is not None
        assert inv.quantity_on_hand == 500
        assert inv.on_order_quantity == 0

        blocks = db.query(MerkleBlock).all()
        assert len(blocks) >= 1
    print("[PASS] Relational persistence across sessions verified.")


if __name__ == "__main__":
    init_db()
    # Ensure baseline role for usr-exec-01 is executive
    with SessionLocal() as s:
        exec_user = s.query(User).filter(User.id == "usr-exec-01").first()
        if exec_user:
            exec_user.role = "executive"
            s.commit()
    test_health_endpoints()
    test_auth_and_rbac()
    test_end_to_end_operational_recovery_scenario()
    test_cryptographic_tamper_resistance()
    test_database_persistence()
    print("\n=======================================================")
    print("ALL AETHERIS AEOS ARCHITECTURAL VERIFICATION TESTS PASSED!")
    print("=======================================================\n")
