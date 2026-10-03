import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, Zap, RefreshCw, Activity, Clock, 
  CheckCircle2, AlertCircle, HelpCircle, FileText, Search, 
  ExternalLink, Layers, Printer, Download, Eye, CornerDownRight
} from 'lucide-react';
import { api } from '../api';
import { 
  GraphResponse, GraphNode, GraphEdge, AttributionFinding, 
  TracePath, TraceHop, RiskIndicator, EvidenceItem, ActionItem 
} from '../types';
import { ReportModal } from '../components/ReportModal';

interface InvestigationDeskProps {
  initialWallet?: string;
  onNavigateToSahyog: (walletAddress: string, vaspName: string) => void;
  onOpenCase: (caseId: string) => void;
  onInspect: (type: string, id: string) => void;
}

export const InvestigationDesk: React.FC<InvestigationDeskProps> = ({
  initialWallet = '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
  onNavigateToSahyog,
  onOpenCase,
  onInspect
}) => {
  const [wallet, setWallet] = useState<string>(initialWallet);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRACE' | 'NETWORK' | 'EVIDENCE' | 'ACTIONS'>('OVERVIEW');
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [attribution, setAttribution] = useState<AttributionFinding | null>(null);
  const [riskData, setRiskData] = useState<RiskIndicator | null>(null);
  const [paths, setPaths] = useState<TracePath[]>([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [actionsList, setActionsList] = useState<ActionItem[]>([]);
  const [nextLead, setNextLead] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeTimelineStep, setActiveTimelineStep] = useState<number | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showEvidenceDetailModal, setShowEvidenceDetailModal] = useState<EvidenceItem | null>(null);
  const [expandedNodes, setExpandedNodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInvestigation(wallet);
  }, [wallet, expandedNodes]);

  async function loadInvestigation(addr: string) {
    setIsLoading(true);
    const maxVis = expandedNodes ? 16 : 8;
    const [g, a, r, p, ev, act, l] = await Promise.all([
      api.getWalletGraph(addr, 2, maxVis),
      api.getAttribution(addr),
      api.getWalletRisk(addr),
      api.getPaths(addr),
      api.getEvidence("NTR-DEMO-001"),
      api.getActions(),
      api.getNextLead(addr)
    ]);
    setGraphData(g);
    setAttribution(a);
    setRiskData(r);
    setPaths(p);
    setEvidenceList(ev);
    setActionsList(act);
    setNextLead(l);
    if (g && g.nodes.length > 0) {
      setSelectedNode(g.nodes[0]);
    }
    setIsLoading(false);
  }

  const activePath = paths[selectedPathIndex] || null;

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* CONTEXTUAL BREADCRUMB & INVESTIGATION HEADER */}
      <div className="p-4 rounded-lg bg-warm-paper/70 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-stone">
            <span className="font-bold text-signal-amber">CASE NTR-DEMO-001</span>
            <span>/</span>
            <span>Target Wallet</span>
            <span>/</span>
            <span className="font-semibold text-ink dark:text-porcelain truncate max-w-xs">{wallet}</span>
          </div>
          <h1 className="text-xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain flex items-center gap-3">
            <span>Operation ShadowSiphon: Multi-Chain Mule Syndicate</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-verdigris/15 text-deep-moss dark:text-verdigris">
              ● LIVE
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-1.5 rounded text-xs font-mono font-semibold bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark hover:bg-warm-paper transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-signal-amber" />
            <span>Generate Forensic Report</span>
          </button>

          <button
            onClick={() => onNavigateToSahyog(wallet, attribution?.primary_vasp || 'Binance Global')}
            className="px-3.5 py-1.5 rounded text-xs font-semibold text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-all flex items-center gap-1.5 shadow-subtle cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Prepare SAHYOG Notice</span>
          </button>
        </div>

      </div>

      {/* CONTEXTUAL INVESTIGATION NAVIGATION (Overview, Trace, Network, Evidence, Actions) */}
      <div className="flex items-center gap-2 border-b border-line dark:border-line-dark pb-2 font-mono text-xs overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'OVERVIEW' },
          { id: 'TRACE', label: 'TRACE' },
          { id: 'NETWORK', label: 'NETWORK' },
          { id: 'EVIDENCE', label: `EVIDENCE (${evidenceList.length})` },
          { id: 'ACTIONS', label: `ACTIONS (${actionsList.filter(a => a.urgency === 'URGENT').length} URGENT)` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-ink text-porcelain dark:bg-porcelain dark:text-ink shadow-subtle'
                : 'text-stone hover:text-ink dark:hover:text-porcelain hover:bg-warm-paper/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INVESTIGATION OVERVIEW (Answers the 4 Core Questions) */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: THE 4 CORE ANSWERS (7 COLS) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. WHAT HAPPENED? */}
            <div className="p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-2">
              <div className="font-mono text-[11px] uppercase font-bold text-stone flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal-amber" />
                <span>1. What Happened?</span>
              </div>
              <p className="text-xs text-stone leading-relaxed">
                Complainant induced to invest ₹42.8 Lakh via counterfeit AI algorithmic portal. Stolen capital transferred into primary mule address <span className="font-mono font-semibold text-ink dark:text-porcelain">{wallet}</span> on 14 Sep 2026 18:22 IST.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <span className="text-[10px] text-stone">STOLEN FLOW</span>
                  <div className="font-bold text-signal-amber mt-0.5">₹42.8 Lakh</div>
                </div>
                <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <span className="text-[10px] text-stone">DISPERSION SPEED</span>
                  <div className="font-bold text-ink dark:text-porcelain mt-0.5">14 Minutes</div>
                </div>
                <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <span className="text-[10px] text-stone">CHAINS INVOLVED</span>
                  <div className="font-bold text-ink dark:text-porcelain mt-0.5">3 Networks</div>
                </div>
              </div>
            </div>

            {/* 2. WHERE DID THE MONEY GO? */}
            <div className="p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3">
              <div className="font-mono text-[11px] uppercase font-bold text-stone flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-verdigris" />
                <span>2. Where Did The Money Go?</span>
              </div>
              <p className="text-xs text-stone leading-relaxed">
                Within 43 minutes, funds were bifurcated: 70% consolidated into institutional VASP deposit infrastructure on Ethereum, while 30% crossed through the Stargate Router Bridge onto Tron TRC-20 USDT bound for domestic exchange accounts.
              </p>

              {/* Nearest Direct Deposit Engine Result */}
              <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-deep-moss dark:text-verdigris">
                    MOST SUPPORTED DEPOSIT DESTINATION:
                  </span>
                  <span className="font-bold text-signal-amber">Binance Global</span>
                </div>
                <div className="text-[11px] text-stone">
                  Calculated via: Path continuity (0.92) • Temporal alignment (16 min) • Institutional gas relayer match • 100% sweep ratio.
                </div>
              </div>
            </div>

            {/* 3. WHAT DID NETRA FIND? */}
            {attribution && (
              <div className="p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] uppercase font-bold text-stone flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-copper" />
                    <span>3. What Did NETRA Find?</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-verdigris/15 text-deep-moss dark:text-verdigris">
                    {attribution.status}
                  </span>
                </div>

                <div className="text-xs text-stone font-mono whitespace-pre-line leading-relaxed p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  {attribution.analyst_note}
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                  <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                    <div className="font-bold text-deep-moss dark:text-verdigris">{attribution.supporting_observations.length} Verified</div>
                    <div className="text-[9px] text-stone">Observations</div>
                  </div>
                  <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                    <div className="font-bold text-stone">{attribution.limitations.length} Acknowledged</div>
                    <div className="text-[9px] text-stone">Limitations</div>
                  </div>
                  <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                    <div className="font-bold text-stone">{attribution.competing_hypotheses.length} Competing</div>
                    <div className="text-[9px] text-stone">Hypotheses</div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WHAT CAN I DO? */}
            <div className="p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border-l-4 border-l-signal-amber border-t border-r border-b border-line dark:border-line-dark shadow-subtle space-y-3">
              <div className="font-mono text-[11px] uppercase font-bold text-signal-amber flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>4. What Can I Do Next?</span>
              </div>
              <p className="text-xs text-stone leading-relaxed">
                Evidence is sufficient to issue a formal statutory notice to Binance Global under Section 91 CrPC and execute an emergency asset freeze under Section 102 CrPC on unliquidated balances.
              </p>
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  onClick={() => setActiveTab('TRACE')}
                  className="px-3.5 py-1.5 rounded text-xs font-mono font-medium text-stone hover:text-ink border border-line dark:border-line-dark hover:bg-warm-paper"
                >
                  Inspect Trace Path
                </button>
                <button
                  onClick={() => onNavigateToSahyog(wallet, attribution?.primary_vasp || 'Binance Global')}
                  className="px-4 py-2 rounded text-xs font-semibold text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-all flex items-center gap-1.5 shadow-subtle cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Execute Next Action via SAHYOG</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: RISK INTELLIGENCE & NEXT BEST LEAD (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* NEXT BEST LEAD CARD */}
            {nextLead && (
              <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-signal-amber flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Next Best Investigative Lead
                  </span>
                  <span className="font-mono text-[10px] text-stone">{nextLead.chain}</span>
                </div>

                <div className="font-mono text-xs font-bold text-ink dark:text-porcelain break-all">
                  {nextLead.target_wallet}
                </div>

                <div className="space-y-1.5 text-xs text-stone">
                  {nextLead.reasons.map((r: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-signal-amber font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-line/60 dark:border-line-dark/60">
                  <div className="font-mono text-[11px] text-deep-moss dark:text-verdigris font-semibold">
                    Frozen Potential: {nextLead.estimated_frozen_potential}
                  </div>
                  <button
                    onClick={() => onInspect('Wallet', nextLead.target_wallet)}
                    className="text-xs font-semibold text-signal-amber hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Inspect Lead</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* OBSERVED SCAM TYPOLOGIES */}
            {riskData && (
              <div className="p-5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
                  <span className="font-mono text-xs font-semibold uppercase text-stone">
                    Observed Typologies ({riskData.typologies.length})
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-oxide-red/15 text-oxide-red">
                    {riskData.overall_level} RISK
                  </span>
                </div>

                <div className="space-y-2">
                  {riskData.typologies.map((t) => (
                    <div key={t.id} className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-semibold text-ink dark:text-porcelain">{t.name}</span>
                        <span className="text-[10px] text-stone">{t.supporting_observations_count} supporting</span>
                      </div>
                      <p className="text-[11px] text-stone leading-relaxed">{t.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: TRACE (Dedicated Trace Flow Mode) */}
      {activeTab === 'TRACE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Multi-Path Fund Flow Reconstruction</h3>
              <p className="text-xs text-stone">Highlights the prioritized money trail while fading unrelated network noise.</p>
            </div>

            {/* Path Switchers */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {paths.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPathIndex(idx)}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedPathIndex === idx
                      ? 'bg-ink text-porcelain dark:bg-porcelain dark:text-ink font-semibold'
                      : 'bg-warm-paper dark:bg-night-elevated text-stone'
                  }`}
                >
                  {p.path_type.toUpperCase()} ({p.investigative_value.toFixed(2)})
                </button>
              ))}
            </div>
          </div>

          {activePath && (
            <div className="p-6 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base">{activePath.title}</span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-signal-amber/15 text-signal-amber">
                  {activePath.continuity_status}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {activePath.hops.map((hop) => (
                  <div
                    key={hop.step}
                    className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-warm-paper dark:bg-night-bg flex items-center justify-center font-bold text-xs">
                        {hop.step}
                      </span>
                      <div>
                        <span className="font-semibold">{hop.from_entity}</span>
                        <span className="text-stone mx-2">→</span>
                        <span className="font-semibold text-signal-amber">{hop.to_entity}</span>
                        <span className="text-stone text-[10px] ml-2">({hop.action})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-stone text-[11px]">
                      <span className="font-semibold text-ink dark:text-porcelain">{hop.amount}</span>
                      <span>{hop.chain}</span>
                      <span>{hop.timestamp}</span>
                      <button
                        onClick={() => onInspect('Wallet', hop.to_entity)}
                        className="px-2 py-0.5 rounded bg-warm-paper text-stone hover:text-ink"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NETWORK (Meaningful Structure Graph) */}
      {activeTab === 'NETWORK' && (
        <div className="p-6 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
            <div>
              <span className="font-mono text-xs font-semibold uppercase text-stone">
                Disciplined Network Topology
              </span>
              <p className="text-xs text-stone">Shows only high-conviction relationships without cluttering the canvas.</p>
            </div>
            <button
              onClick={() => setExpandedNodes(!expandedNodes)}
              className="text-xs font-mono px-3 py-1 rounded bg-signal-amber/15 text-signal-amber font-semibold"
            >
              {expandedNodes ? 'Collapse Scope' : '+ 6 more related nodes'}
            </button>
          </div>

          <div className="min-h-[400px] graph-grid-bg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {graphData?.nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => onInspect(node.category, node.id)}
                className="p-3.5 rounded-lg border border-line dark:border-line-dark bg-porcelain dark:bg-night-elevated shadow-subtle hover:border-signal-amber transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-stone">
                  <span>{node.category}</span>
                  <span>{node.chain}</span>
                </div>
                <div className="font-mono font-semibold text-xs text-ink dark:text-porcelain truncate">
                  {node.label}
                </div>
                <div className="text-[11px] text-stone truncate">{node.attribution}</div>
                <div className="pt-2 border-t border-line/40 dark:border-line-dark/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-stone">Balance</span>
                  <span className="font-bold">${(node.balance_usd || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE (Investigation File Format) */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
                <span className="font-bold text-signal-amber">{item.id} • {item.title}</span>
                <span className="text-deep-moss dark:text-verdigris font-semibold text-[11px]">
                  ✓ SHA-256 PROVENANCE VERIFIED
                </span>
              </div>
              <p className="font-sans text-xs text-stone">{item.content_summary}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone">
                <div>PROVIDER: <span className="font-bold text-ink dark:text-porcelain">{item.source_provider}</span></div>
                <div>OBSERVED: <span className="font-bold text-ink dark:text-porcelain">{item.observed_at}</span></div>
                <div>BLOCK: <span className="font-bold text-ink dark:text-porcelain">{item.block_or_log_id || 'N/A'}</span></div>
                <div>ANALYST: <span className="font-bold text-ink dark:text-porcelain">{item.analyst}</span></div>
              </div>
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated text-[11px] text-stone break-all">
                REFERENCE HASH: {item.reference_hash}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: ACTIONS */}
      {activeTab === 'ACTIONS' && (
        <div className="space-y-4">
          {actionsList.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-oxide-red">{act.urgency}</span>
                <span className="text-stone">{act.id}</span>
              </div>
              <h3 className="font-semibold text-sm">{act.title}</h3>
              <p className="text-xs text-stone">{act.detail}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigateToSahyog(act.target_entity, 'Binance Global')}
                  className="px-3.5 py-1.5 rounded font-mono text-xs font-semibold text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-colors"
                >
                  Prepare SAHYOG Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORENSIC REPORT MODAL */}
      <ReportModal
        caseId="NTR-DEMO-001"
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
};
