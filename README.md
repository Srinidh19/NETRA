# NETRA — Blockchain Investigation, VASP Attribution & SAHYOG Intelligence Platform

A modern visual investigation operating environment built specifically for professional cyber-financial intelligence teams.

NETRA replaces traditional static dashboards and technical clutter with a streamlined investigator workflow:

```
EXPLORE  →  INVESTIGATE  →  NETWORKS  →  CASES  →  ACTIONS
```

Everything else is contextual.

---

## The Core Product Principles

### 1. Primary Workflow Destinations (Only 5)
- **`EXPLORE`**: The New Home. A Pinterest-inspired editorial visual discovery surface answering *What's happening? What's new? What needs attention? What can I investigate?* Includes the **"WHAT MATTERS NOW"** operational strip replacing KPI bloat.
- **`INVESTIGATE`**: The core contextual investigation workspace. Answers four fundamental questions:
  - *What happened?*
  - *Where did the money go?*
  - *What did NETRA find?*
  - *What can I do next?*
  Contextual tabs: `[Overview] [Trace] [Network] [Evidence] [Actions]`.
- **`NETWORKS`**: Visual intelligence combining the **India Network Map** (geographic cybercrime corridors) with **Emerging Scam Networks** (topological clusters).
- **`CASES`**: Modern case docket collections with switchable **Visual Grid** and **Compact Docket** modes.
- **`ACTIONS`**: Operational command center managing high-conviction interventions and one-click SAHYOG notice approvals.

### 2. Contextual Right-Side Inspector
Clicking any wallet, transaction, or VASP opens a non-disruptive right-hand inspector panel detailing:
- Observed balance, active chain, and entity attribution
- **Risk Intelligence**: Explainable factors with zero fake percentage scores
- **Observed Typologies**: Rapid layering, fan-in consolidation, cross-chain bridge hopping, and mixer/privacy service interactions
- **Operational Actions**: *Investigate in Desk*, *Trace Flow*, *Prepare SAHYOG Notice*, *Save to Collection*

### 3. Nearest Direct Deposit Engine
Rather than relying on naive "fewest blockchain hops", the engine computes direct deposit probability based on:
- Path continuity (`0.92`)
- Temporal synchronization (`16-minute sweep`)
- Institutional gas relayer matching
- `100%` sweep ratio into verified exchange hot clusters

### 4. Authorized SAHYOG Integration & Response Loop
- Implements official `SahyogProvider` interface (`SahyogProductionProvider` and `SahyogSandboxProvider`).
- **Production Guardrail**: Refuses to spoof government endpoints; enforces official mTLS LEA certificates.
- **Authorized Sandbox Protocol**: Clearly labeled with `SANDBOX MODE ACTIVE`, generates statutory Section 91 CrPC and Section 102 CrPC notices, issues receipts (`I4C-ACK-2026-XXXXX`), and receives simulated VASP responses (masked KYC, Bank IFSC, UPI VPA, and frozen assets).
- **Direct Feedback Loop**: Statutory responses automatically attach as new verified evidence exhibits and update the investigation graph.

### 5. Evidence-Backed Forensic Report Generator
Clicking **Generate Forensic Report** compiles an evidence-provenanced brief detailing:
- Case synopsis and FIR metadata
- Fund-flow reconstruction table
- VASP attribution findings and acknowledged limitations
- Observed typologies and risk factors
- Attached SAHYOG orders and cryptographic SHA-256 audit logs
- Instant export options: **Print / Save as PDF** and **Export JSON**.

### 6. Choreographed 7-Second Motion Landing Page
- Hero: **"THE WALLET IS ONLY THE BEGINNING."**
- 7-second progression:
  `0s: Single Tx` → `1s: Victim-Facing Wallet` → `2s: Automated Fan-In` → `3s: Consolidation Network` → `4s: Cross-Chain Bridge` → `5s: VASP Deposit Match` → `6s: Defensible Finding` → `7s: Statutory Action`.

---

## Architecture

```
Frontend (React 19 + TypeScript + Vite + Tailwind CSS)
   │  Port 5173
   ▼
API Gateway / Investigation Kernel (FastAPI + Pydantic + NetworkX)
   │  Port 8000
   ├── Graph Intelligence Engine (Hidden Structure Discovery, Multi-Path Scoring)
   ├── VASP Attribution Engine (Multi-Signal Evidence, Limitations, Counterfactuals)
   ├── Risk & Typology Engine (Rapid Layering, Fan-In, Privacy Service Detection)
   ├── Forensic Report Generator (Printable PDF & JSON Exports)
   ├── SAHYOG Integration Adapter (Sandbox Protocol v1.2 & Production mTLS Guardrail)
   ├── Blockchain Provider Abstraction (Bitquery v2, Ethereum RPC, TronGrid, Bitcoin)
   └── Cryptographic Evidence Vault (SHA-256 Provenance & Tamper-Evident Ledger)
```

---

## Running the Automated Test Suite

```bash
# Run all 16 unit, risk intelligence, report generator, and end-to-end integration tests
python -m unittest discover -s backend/tests
```
```text
................
----------------------------------------------------------------------
Ran 16 tests in 0.045s

OK
```
