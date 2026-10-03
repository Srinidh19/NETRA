export interface GraphNode {
  id: string;
  label: string;
  category: 'Wallet' | 'Transaction' | 'Token' | 'Contract' | 'VASP' | 'VASP Infrastructure' | 'Bridge' | 'DEX' | 'Privacy / Mixer Service' | 'Domain' | 'Entity' | 'Case' | 'Evidence' | 'Identifier';
  chain: string;
  risk_level?: string;
  attribution?: string;
  balance_usd?: number;
  first_seen?: string;
  last_active?: string;
  known_relationships: number;
  is_primary: boolean;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  timestamp: string;
  chain: string;
  transaction_hash: string;
  asset: string;
  amount: number;
  usd_value: number;
  direction: string;
  source_provider: string;
  evidence_id: string;
  confidence: string;
  investigative_weight: number;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  total_discovered_nodes: number;
  visible_nodes: number;
  truncated_count: number;
}

export interface SupportingObservation {
  id: string;
  category: string;
  statement: string;
  observed_value: string;
  weight: number;
  evidence_id: string;
  provider: string;
}

export interface Limitation {
  id: string;
  statement: string;
  impact: string;
}

export interface CompetingHypothesis {
  entity_name: string;
  strength: string;
  supporting_points: number;
  contradicting_points: number;
  rationale: string;
}

export interface AttributionFinding {
  target_wallet: string;
  status: 'STRONG SUPPORT' | 'POSSIBLE' | 'INSUFFICIENT EVIDENCE';
  primary_vasp: string;
  vasp_type: string;
  supporting_observations: SupportingObservation[];
  limitations: Limitation[];
  competing_hypotheses: CompetingHypothesis[];
  analyst_note: string;
  recommended_action: string;
}

export interface TraceHop {
  step: number;
  from_entity: string;
  from_category: string;
  to_entity: string;
  to_category: string;
  action: string;
  chain: string;
  amount: string;
  tx_hash: string;
  timestamp: string;
  evidence_id: string;
}

export interface TracePath {
  path_type: 'Primary' | 'Alternative' | 'Ambiguous' | 'Contradictory';
  title: string;
  summary: string;
  investigative_value: number;
  hops: TraceHop[];
  destination_vasp?: string;
  continuity_status: string;
}

export interface ScamTypology {
  id: string;
  name: string;
  status: string;
  supporting_observations_count: number;
  detail: string;
  evidence_ids: string[];
}

export interface ThreatIntelTag {
  category: string;
  source: string;
  timestamp: string;
  evidence_id: string;
  confidence: string;
  notes: string;
}

export interface RiskIndicator {
  overall_level: 'HIGH' | 'MEDIUM' | 'LOW';
  key_factors: string[];
  typologies: ScamTypology[];
  threat_tags: ThreatIntelTag[];
  privacy_mixer_detected: boolean;
  privacy_mixer_notes?: string;
}

export interface CaseRecord {
  id: string;
  title: string;
  fir_number?: string;
  police_station?: string;
  state: string;
  status: string;
  priority: string;
  case_type?: 'CURRENT' | 'PREVIOUS';
  investigator: string;
  created_at: string;
  last_updated: string;
  loss_amount_inr: number;
  recovery_amount_inr?: number;
  accused_count?: number;
  court_name?: string;
  charge_sheet_ref?: string;
  ncrp_ack_number?: string;
  victim_wallet: string;
  identified_vasps: string[];
  evidence_count: number;
  actions_count: number;
  tags: string[];
  synopsis: string;
}

export interface EvidenceItem {
  id: string;
  case_id: string;
  title: string;
  evidence_type: string;
  source_provider: string;
  observed_at: string;
  reference_hash: string;
  block_or_log_id?: string;
  chain: string;
  provenance_hash: string;
  analyst: string;
  verified_tamper_evident: boolean;
  content_summary: string;
  metadata?: Record<string, any>;
}

export interface ActionItem {
  id: string;
  case_id: string;
  urgency: 'URGENT' | 'ACTION_REQUIRED' | 'PENDING_REVIEW' | 'RESOLVED';
  action_type: string;
  title: string;
  detail: string;
  target_entity: string;
  sahyog_ready: boolean;
  status: 'PREPARED' | 'IN_REVIEW' | 'EXECUTED';
  created_at: string;
}

export interface SahyogRequest {
  id: string;
  case_id: string;
  request_type: string;
  vasp_id: string;
  vasp_name: string;
  target_wallet: string;
  chain: string;
  priority: string;
  section_act: string;
  competent_authority: string;
  status: string;
  submission_timestamp?: string;
  acknowledgement_id?: string;
  official_ref_number?: string;
  sandbox_mode: boolean;
  evidence_attachments: string[];
  observations: string;
}

export interface SahyogResponse {
  request_id: string;
  acknowledgement_id: string;
  vasp_name: string;
  status: string;
  kyc_name_masked?: string;
  kyc_pan_masked?: string;
  associated_bank_ifsc?: string;
  associated_upi_vpa?: string;
  frozen_asset_amount?: string;
  internal_account_id?: string;
  response_hash: string;
  received_at: string;
  feedback_applied_to_graph: boolean;
}

export interface SavedCollection {
  id: string;
  title: string;
  description: string;
  category: string;
  items_count: number;
  preview_wallets: string[];
  updated_at: string;
  items: Array<{
    type: string;
    id: string;
    label: string;
  }>;
}

export interface InvestigationReport {
  report_id: string;
  case_id: string;
  title: string;
  generated_at: string;
  investigator: string;
  source_wallet: string;
  observed_loss_inr: number;
  summary: string;
  fund_flow_trace: any[];
  vasp_attribution: any;
  risk_indicators: RiskIndicator;
  evidence_provenance: any[];
  action_history: any[];
  sahyog_references: any[];
  audit_trail: any[];
}

export interface RegionalIntelligence {
  id: string;
  name: string;
  capital: string;
  coordinates: [number, number];
  active_investigations: number;
  observed_scam_networks: number;
  vasp_interactions: number;
  recent_signals: number;
  total_observed_flow_cr: number;
  top_patterns: string[];
  active_cases: string[];
}
