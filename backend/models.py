from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum

class NodeCategory(str, Enum):
    WALLET = "Wallet"
    TRANSACTION = "Transaction"
    TOKEN = "Token"
    CONTRACT = "Contract"
    VASP = "VASP"
    INFRASTRUCTURE = "VASP Infrastructure"
    BRIDGE = "Bridge"
    DEX = "DEX"
    PRIVACY_MIXER = "Privacy / Mixer Service"
    DOMAIN = "Domain"
    ENTITY = "Entity"
    CASE = "Case"
    EVIDENCE = "Evidence"
    IDENTIFIER = "Identifier"

class RelationType(str, Enum):
    SENT = "SENT"
    RECEIVED = "RECEIVED"
    FUNDED = "FUNDED"
    CONSOLIDATED_TO = "CONSOLIDATED_TO"
    SWEPT_TO = "SWEPT_TO"
    BRIDGED_TO = "BRIDGED_TO"
    SWAPPED_TO = "SWAPPED_TO"
    INTERACTED_WITH = "INTERACTED_WITH"
    ASSOCIATED_WITH = "ASSOCIATED_WITH"
    OBSERVED_IN = "OBSERVED_IN"
    LINKED_BY = "LINKED_BY"

class GraphNode(BaseModel):
    id: str
    label: str
    category: NodeCategory
    chain: str = "Ethereum"
    risk_level: Optional[str] = "unverified"
    attribution: Optional[str] = None
    balance_usd: Optional[float] = 0.0
    first_seen: Optional[str] = None
    last_active: Optional[str] = None
    known_relationships: int = 0
    is_primary: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relation: RelationType
    timestamp: str
    chain: str
    transaction_hash: str
    asset: str
    amount: float
    usd_value: float
    direction: str = "outbound"
    source_provider: str = "Bitquery / Ethereum"
    evidence_id: str
    confidence: str = "VERIFIED"
    investigative_weight: float = 1.0

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_discovered_nodes: int
    visible_nodes: int
    truncated_count: int

class SupportingObservation(BaseModel):
    id: str
    category: str
    statement: str
    observed_value: str
    weight: float
    evidence_id: str
    provider: str

class Limitation(BaseModel):
    id: str
    statement: str
    impact: str

class CompetingHypothesis(BaseModel):
    entity_name: str
    strength: str
    supporting_points: int
    contradicting_points: int
    rationale: str

class AttributionFinding(BaseModel):
    target_wallet: str
    status: str  # "STRONG SUPPORT", "POSSIBLE", "INSUFFICIENT EVIDENCE"
    primary_vasp: str
    vasp_type: str
    supporting_observations: List[SupportingObservation]
    limitations: List[Limitation]
    competing_hypotheses: List[CompetingHypothesis]
    analyst_note: str
    recommended_action: str

class TraceHop(BaseModel):
    step: int
    from_entity: str
    from_category: str
    to_entity: str
    to_category: str
    action: str
    chain: str
    amount: str
    tx_hash: str
    timestamp: str
    evidence_id: str

class TracePath(BaseModel):
    path_type: str  # "Primary", "Alternative", "Ambiguous", "Contradictory"
    title: str
    summary: str
    investigative_value: float
    hops: List[TraceHop]
    destination_vasp: Optional[str] = None
    continuity_status: str

class ScamTypology(BaseModel):
    id: str
    name: str  # e.g. "Rapid layering", "Fan-in", "Consolidation", "Bridge hopping", "Privacy Service Interaction"
    status: str  # "OBSERVED", "SUSPECTED", "ABSENT"
    supporting_observations_count: int
    detail: str
    evidence_ids: List[str] = Field(default_factory=list)

class ThreatIntelTag(BaseModel):
    category: str  # "Fraud", "Ransomware", "Darknet", "Money Laundering", "High-Risk Infrastructure"
    source: str
    timestamp: str
    evidence_id: str
    confidence: str
    notes: str

class RiskIndicator(BaseModel):
    overall_level: str  # "HIGH", "MEDIUM", "LOW"
    key_factors: List[str]
    typologies: List[ScamTypology]
    threat_tags: List[ThreatIntelTag]
    privacy_mixer_detected: bool = False
    privacy_mixer_notes: Optional[str] = None

class CaseRecord(BaseModel):
    id: str
    title: str
    fir_number: Optional[str] = None
    police_station: Optional[str] = None
    state: str
    status: str
    priority: str
    case_type: Optional[str] = "CURRENT"
    investigator: str
    created_at: str
    last_updated: str
    loss_amount_inr: float
    recovery_amount_inr: Optional[float] = 0.0
    accused_count: Optional[int] = 0
    court_name: Optional[str] = None
    charge_sheet_ref: Optional[str] = None
    ncrp_ack_number: Optional[str] = None
    victim_wallet: str
    identified_vasps: List[str]
    evidence_count: int
    actions_count: int
    tags: List[str]
    synopsis: str

class EvidenceItem(BaseModel):
    id: str
    case_id: str
    title: str
    evidence_type: str
    source_provider: str
    observed_at: str
    reference_hash: str
    block_or_log_id: Optional[str] = None
    chain: str
    provenance_hash: str
    analyst: str
    verified_tamper_evident: bool = True
    content_summary: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class SahyogRequest(BaseModel):
    id: str
    case_id: str
    request_type: str
    vasp_id: str
    vasp_name: str
    target_wallet: str
    chain: str
    priority: str
    section_act: str = "Section 91 CrPC / IT Act / PMLA Rule 3(1)(b)"
    competent_authority: str
    status: str
    submission_timestamp: Optional[str] = None
    acknowledgement_id: Optional[str] = None
    official_ref_number: Optional[str] = None
    sandbox_mode: bool = True
    evidence_attachments: List[str] = Field(default_factory=list)
    observations: str

class SahyogResponse(BaseModel):
    request_id: str
    acknowledgement_id: str
    vasp_name: str
    status: str
    kyc_name_masked: Optional[str] = None
    kyc_pan_masked: Optional[str] = None
    associated_bank_ifsc: Optional[str] = None
    associated_upi_vpa: Optional[str] = None
    frozen_asset_amount: Optional[str] = None
    internal_account_id: Optional[str] = None
    response_hash: str
    received_at: str
    feedback_applied_to_graph: bool = False

class ActionItem(BaseModel):
    id: str
    case_id: str
    urgency: str  # "URGENT", "ACTION_REQUIRED", "PENDING_REVIEW", "RESOLVED"
    action_type: str
    title: str
    detail: str
    target_entity: str
    sahyog_ready: bool
    status: str  # "PREPARED", "IN_REVIEW", "EXECUTED"
    created_at: str

class SavedCollection(BaseModel):
    id: str
    title: str
    description: str
    category: str
    items_count: int
    preview_wallets: List[str]
    updated_at: str
    items: List[Dict[str, Any]] = Field(default_factory=list)

class InvestigationReport(BaseModel):
    report_id: str
    case_id: str
    title: str
    generated_at: str
    investigator: str
    source_wallet: str
    observed_loss_inr: float
    summary: str
    fund_flow_trace: List[Dict[str, Any]]
    vasp_attribution: Dict[str, Any]
    risk_indicators: RiskIndicator
    evidence_provenance: List[Dict[str, Any]]
    action_history: List[Dict[str, Any]]
    sahyog_references: List[Dict[str, Any]]
    audit_trail: List[Dict[str, Any]]
