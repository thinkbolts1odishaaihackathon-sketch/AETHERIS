"""AETHERIS AEOS Cryptographic Engine.

Provides mathematically verified cryptographic primitives:
1. Canonical JSON serialization (deterministic RFC 8785 subset).
2. Deterministic SHA-256 event hashing.
3. Cryptographic hash chaining between chronological audit events.
4. Binary SHA-256 Merkle tree calculation with inclusion proof generation & verification.
5. Ed25519 digital keypair generation, message signing, and signature verification
   using python's `cryptography` library.
"""

import json
import hashlib
from typing import Any, Dict, List, Optional, Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization


def canonical_json(obj: Any) -> str:
    """Serialize an object into deterministic canonical JSON (sorted keys, compact)."""
    return json.dumps(obj, sort_keys=True, separators=(',', ':'), ensure_ascii=True)


def sha256_hex(data: bytes) -> str:
    """Compute standard SHA-256 digest formatted as a 0x-prefixed hex string."""
    return f"0x{hashlib.sha256(data).hexdigest()}"


def hash_object(obj: Any) -> str:
    """Compute SHA-256 hash of a canonicalized JSON object."""
    return sha256_hex(canonical_json(obj).encode("utf-8"))


# --- Ed25519 Digital Signature Functions ---

def generate_ed25519_keypair() -> Tuple[str, str]:
    """
    Generate a new Ed25519 keypair.
    Returns (private_key_hex, public_key_hex).
    """
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    priv_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption()
    )
    pub_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )
    return priv_bytes.hex(), pub_bytes.hex()


def sign_message(private_key_hex: str, message_bytes: bytes) -> str:
    """Sign message bytes using Ed25519 private key. Returns signature as hex."""
    priv_bytes = bytes.fromhex(private_key_hex)
    private_key = ed25519.Ed25519PrivateKey.from_private_bytes(priv_bytes)
    signature = private_key.sign(message_bytes)
    return signature.hex()


def verify_signature(public_key_hex: str, message_bytes: bytes, signature_hex: str) -> bool:
    """Verify an Ed25519 signature against message bytes and public key."""
    try:
        # Strip optional "ed25519:" or "pub_" prefix if present
        clean_pub = public_key_hex
        if clean_pub.startswith("ed25519:"):
            clean_pub = clean_pub[len("ed25519:"):]
        if clean_pub.startswith("pub_"):
            clean_pub = clean_pub[len("pub_"):]

        pub_bytes = bytes.fromhex(clean_pub)
        sig_bytes = bytes.fromhex(signature_hex)
        public_key = ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
        public_key.verify(sig_bytes, message_bytes)
        return True
    except Exception:
        return False


# --- Audit Hash Chaining ---

def compute_chained_hash(
    previous_hash: str,
    sequence_number: int,
    event_type: str,
    payload_hash: str
) -> str:
    """
    Compute chained hash for continuous immutable event logging.
    H_n = SHA256(H_{n-1} || sequence || event_type || payload_hash)
    """
    chain_material = f"{previous_hash}|{sequence_number}|{event_type}|{payload_hash}"
    return sha256_hex(chain_material.encode("utf-8"))


# --- Binary SHA-256 Merkle Tree ---

def _hash_pair(left: str, right: str) -> str:
    """Hash two node hashes together deterministically."""
    combined = (left + right).encode("utf-8")
    return sha256_hex(combined)


def build_merkle_tree(leaf_hashes: List[str]) -> Dict[str, Any]:
    """
    Build a complete binary Merkle tree from a list of leaf hashes.
    Handles duplicate odd leaf padding.
    Returns:
    {
        "rootHash": str,
        "leafCount": int,
        "leaves": List[str],
        "levels": List[List[str]]
    }
    """
    if not leaf_hashes:
        empty_root = sha256_hex(b"EMPTY_MERKLE_TREE")
        return {
            "rootHash": empty_root,
            "leafCount": 0,
            "leaves": [],
            "levels": [[empty_root]]
        }

    # Ensure all leaves are 0x formatted
    leaves = [h if h.startswith("0x") else f"0x{h}" for h in leaf_hashes]
    current_level = list(leaves)
    levels = [current_level]

    while len(current_level) > 1:
        next_level = []
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            # If odd number of nodes, duplicate last node
            right = current_level[i + 1] if i + 1 < len(current_level) else left
            parent = _hash_pair(left, right)
            next_level.append(parent)
        current_level = next_level
        levels.append(current_level)

    root_hash = levels[-1][0]
    return {
        "rootHash": root_hash,
        "leafCount": len(leaves),
        "leaves": leaves,
        "levels": levels
    }


def generate_merkle_proof(levels: List[List[str]], leaf_index: int) -> List[Dict[str, str]]:
    """
    Generate an inclusion proof path for a given leaf index.
    Returns list of {"position": "left" | "right", "hash": str}.
    """
    proof = []
    idx = leaf_index
    for level in levels[:-1]:
        if idx % 2 == 0:
            # Current node is left child; sibling is right child
            sibling_idx = idx + 1 if idx + 1 < len(level) else idx
            proof.append({"position": "right", "hash": level[sibling_idx]})
        else:
            # Current node is right child; sibling is left child
            proof.append({"position": "left", "hash": level[idx - 1]})
        idx = idx // 2
    return proof


def verify_merkle_proof(leaf_hash: str, proof: List[Dict[str, str]], expected_root: str) -> bool:
    """
    Verify whether a given leaf hash and sibling proof path reproduces the expected root hash.
    """
    current = leaf_hash if leaf_hash.startswith("0x") else f"0x{leaf_hash}"
    for step in proof:
        sibling = step["hash"] if step["hash"].startswith("0x") else f"0x{step['hash']}"
        if step["position"] == "left":
            current = _hash_pair(sibling, current)
        else:
            current = _hash_pair(current, sibling)

    expected = expected_root if expected_root.startswith("0x") else f"0x{expected_root}"
    return current.lower() == expected.lower()
