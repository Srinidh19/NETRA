import React, { useState, useEffect } from 'react';
import {
  Search, Shield, ArrowRight, RefreshCw, Clock,
  CheckCircle, AlertCircle, FileText, Eye, Layers,
  Download, ChevronRight, ChevronDown, X, Network,
  Activity, CornerDownRight, AlertTriangle, Info,
  Copy, Check, ExternalLink, Sparkles, Building2,
  DollarSign, ArrowUpRight, ArrowDownLeft, Share2,
  FileCheck, ShieldAlert, Cpu
} from 'lucide-react';
import { api } from '../api';
import {
  GraphResponse, GraphNode, AttributionFinding,
  TracePath, RiskIndicator, EvidenceItem, ActionItem
} from '../types';
import { ExploreBar, FORENSIC_PRESETS } from '../components/ExploreBar';

interface InvestigateViewProps {
  initialWallet?: string;
  onNavigateToSahyog: (walletAddress: string, vaspName: string) => void;
  onOpenCase: (caseId: string) => void;
  onNavigateToNetwork: () => void;
}

const TABS = [
  { id: 'OVERVIEW',  label: 'Intelligence Dossier', icon: Shield },
  { id: 'TRACE',     label: 'Multi-Hop Ledger',     icon: Layers },
  { id: 'EVIDENCE',  label: 'Case Evidence (Sec 65B)', icon: FileText },
  { id: 'ACTIONS',   label: 'CrPC Notices (SAHYOG)', icon: ShieldAlert },
] as const;

type Tab = typeof TABS[number]['id'];

export const InvestigateView: React.FC<InvestigateViewProps> = ({
  initialWallet = '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
  onNavigateToSahyog,
  onOpenCase,
  onNavigateToNetwork,
}) => {
  const [wallet, setWallet] = useState(initialWallet);
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [attribution, setAttribution] = useState<AttributionFinding | null>(null);
  const [riskData, setRiskData] = useState<RiskIndicator | null>(null);
  const [paths, setPaths] = useState<TracePath[]>([]);
  const [selectedPath, setSelectedPath] = useState(0);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [actionsList, setActionsList] = useState<ActionItem[]>([]);
  const [nextLead, setNextLead] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [selectedHopIndex, setSelectedHopIndex] = useState<number | null>(null);

  useEffect(() => {
    loadInvestigation(wallet);
  }, [wallet]);

  async function loadInvestigation(addr: string) {
    setIsLoading(true);
    try {
      const [g, a, r, p, ev, act, l] = await Promise.all([
        api.getWalletGraph(addr, 2, 10),
        api.getAttribution(addr),
        api.getWalletRisk(addr),
        api.getPaths(addr),
        api.getEvidence('NTR-DEMO-001'),
        api.getActions(),
        api.getNextLead(addr),
      ]);
      setGraphData(g);
      setAttribution(a);
      setRiskData(r);
      setPaths(p);
      setEvidenceList(ev);
      setActionsList(act);
      setNextLead(l);
    } catch (e) {
      console.error("Error loading investigation:", e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleExploreSearch = (query: string, chain: string, hops: number) => {
    setWallet(query);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const activePath = paths[selectedPath] || null;

  const riskBadge = (level?: string) => {
    if (level === 'HIGH' || level === 'CRITICAL') return 'badge-red';
    if (level === 'MEDIUM') return 'badge-amber';
    if (level === 'LOW') return 'badge-green';
    return 'badge-gray';
  };

  const attrBadge = (status?: string) => {
    if (status === 'STRONG SUPPORT') return 'badge-green';
    if (status === 'POSSIBLE') return 'badge-amber';
    return 'badge-gray';
  };

  // 4-Stage visual crime pipeline for Operation ShadowSiphon
  const crimeStages = [
    {
      step: '01',
      title: 'Victim Inflow',
      addr: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
      amount: '₹42,80,000',
      crypto: '51.4 ETH',
      tag: 'COMPLAINANT',
      tagColor: 'bg-blue-100 text-blue-800'
    },
    {
      step: '02',
      title: 'Primary Mule Split',
      addr: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
      amount: '₹38,20,000',
      crypto: '45.9 ETH',
      tag: 'ACTIVE TARGET',
      tagColor: 'bg-red-100 text-red-800 font-bold'
    },
    {
      step: '03',
      title: 'Layering Hub',
      addr: '0x28c6c06298d514db089934071355e5743bf21d60',
      amount: '₹32,10,000',
      crypto: '38.5 ETH',
      tag: 'SWEEP CLUSTER',
      tagColor: 'bg-amber-100 text-amber-800'
    },
    {
      step: '04',
      title: 'VASP Liquidation',
      addr: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
      amount: '₹29,96,000',
      crypto: '35.9 ETH',
      tag: 'BINANCE GLOBAL',
      tagColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12">
      {/* Docket Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="gov-container py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <button onClick={() => onOpenCase('NTR-DEMO-001')} className="font-semibold text-gov-blue hover:underline">
                Operation ShadowSiphon (NTR-DEMO-001)
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600 font-mono">FIR 412/2026 (Cyber Police Station, Pune)</span>
              <span className="text-slate-400">/</span>
              <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-red-50 text-red-700 border border-red-200">
                CRITICAL PRIORITY
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToNetwork}
                className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Network className="w-3.5 h-3.5 text-gov-blue" />
                <span>Open in Force Network Graph</span>
              </button>
              <button
                onClick={() => onOpenCase('NTR-DEMO-001')}
                className="px-3 py-1.5 rounded bg-gov-blue hover:bg-gov-blue-2 text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full FIR Docket</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="gov-container mt-5 space-y-5">
        {/* CUSTOM EXPLORE BAR */}
        <ExploreBar
          initialValue={wallet}
          onSearch={handleExploreSearch}
          onNavigateToNetwork={onNavigateToNetwork}
          currentCaseId="NTR-DEMO-001"
        />

        {/* 4-STAGE INTERACTIVE FORENSIC CRIME PIPELINE */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                Syndicate Siphon Pipeline:
              </span>
              <span className="text-xs text-slate-700 font-medium">
                ₹42.8 Lakh stolen via deceptive algorithmic portal, swept in 43 minutes
              </span>
            </div>
            <div className="flex items-center gap-1 text-2xs font-mono text-slate-500">
              <Clock className="w-3 h-3 text-gov-saffron" />
              <span>Velocity: 70% reached VASP in 43 min</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crimeStages.map((stage, idx) => {
              const isActive = wallet.toLowerCase() === stage.addr.toLowerCase();
              return (
                <div
                  key={stage.step}
                  onClick={() => setWallet(stage.addr)}
                  className={`p-3 rounded-md border text-left cursor-pointer transition-all relative ${
                    isActive
                      ? 'bg-blue-50/70 border-gov-blue ring-2 ring-gov-blue/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                >
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xs font-mono font-bold text-slate-400">
                      STAGE {stage.step}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${stage.tagColor}`}>
                      {stage.tag}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 mb-1">{stage.title}</div>
                  <div className="font-mono text-2xs text-slate-500 truncate mb-2">
                    {stage.addr}
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60 text-xs">
                    <span className="font-bold text-slate-800">{stage.amount}</span>
                    <span className="font-mono text-2xs text-slate-500">{stage.crypto}</span>
                  </div>

                  {/* Flow arrow on right for desktop */}
                  {idx < crimeStages.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-500 shadow-xs">
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="bg-white border border-slate-200 rounded-lg p-1.5 flex flex-wrap items-center gap-1 shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const actionBadge = tab.id === 'ACTIONS' && actionsList.filter(a => a.status !== 'EXECUTED').length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gov-blue text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {actionBadge ? (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold">
                    {actionBadge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INTELLIGENCE DOSSIER                                               */}
        {/* ========================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 4 cols: Target Wallet & Risk Indicators */}
            <div className="lg:col-span-4 space-y-5">
              {/* Target Entity Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                    Target Identification
                  </span>
                  <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    ETHEREUM MAINNET
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Checksum Address:</div>
                    <div className="flex items-center gap-1.5 mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="font-mono text-xs text-slate-800 break-all select-all font-semibold">
                        {wallet}
                      </span>
                      <button
                        onClick={() => handleCopy(wallet)}
                        className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                        title="Copy Address"
                      >
                        {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Balance & INR Estimate */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <div className="text-[10px] font-bold uppercase text-slate-500">Observed Balance</div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                        {graphData?.nodes[0]?.balance_usd ? `$${graphData.nodes[0].balance_usd.toLocaleString()}` : '38.45 ETH'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">≈ ₹32,10,000 INR</div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <div className="text-[10px] font-bold uppercase text-slate-500">Cluster Size</div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                        {graphData?.nodes?.length || 10} Wallets
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium">2 Hops Traversed</div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">First Active:</span>
                      <span className="font-mono text-slate-800">14 Sep 2026 19:34 IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Active:</span>
                      <span className="font-mono text-slate-800">14 Sep 2026 20:17 IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Transactions:</span>
                      <span className="font-mono text-slate-800">14 (100% Sweep)</span>
                    </div>
                  </div>

                  {/* External links */}
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`https://etherscan.io/address/${wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 text-center text-2xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={onNavigateToNetwork}
                      className="flex-1 py-1.5 text-center text-2xs font-semibold text-gov-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Network className="w-3 h-3" />
                      <span>Visual Graph</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Box */}
              {riskData && (
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                      Algorithmic Risk Assessment
                    </span>
                    <span className={`badge ${riskBadge(riskData.overall_level)}`}>
                      {riskData.overall_level} RISK (Score 88/100)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {riskData.key_factors?.map((factor, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-snug">{factor}</span>
                      </div>
                    ))}

                    {riskData.privacy_mixer_detected && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                        <span>Mixer interaction flagged: High priority Section 91 dispatch recommended.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Center 5 cols: VASP Attribution & Mathematical Proof */}
            <div className="lg:col-span-5 space-y-5">
              {attribution && (
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gov-blue" />
                      <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                        VASP Attribution &amp; Cluster Analysis
                      </span>
                    </div>
                    <span className={`badge ${attrBadge(attribution.status)}`}>
                      {attribution.status} (94% MATCH)
                    </span>
                  </div>

                  {/* Primary entity */}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 mb-4">
                    <div className="text-2xs font-bold uppercase text-slate-500">Identified Custodian / Exchange</div>
                    <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                      <span>{attribution.primary_vasp || 'Binance Global'}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                        VASP HOT WALLET 6
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {attribution.vasp_type || 'Centralized Exchange (Offshore Jurisdiction)'}
                    </div>
                  </div>

                  {/* Supporting Observations */}
                  <div className="space-y-3">
                    <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                      Evidentiary Observations (Chain Proof)
                    </div>

                    {attribution.supporting_observations?.map((obs) => (
                      <div key={obs.id} className="p-2.5 rounded bg-slate-50/70 border border-slate-100 flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <div className="font-semibold text-slate-900">{obs.statement}</div>
                          <div className="text-slate-500 font-mono text-2xs mt-0.5">{obs.observed_value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analyst Notes */}
                  {attribution.analyst_note && (
                    <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-amber-900">
                      <div className="font-bold mb-0.5 flex items-center gap-1 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        Analyst Finding:
                      </div>
                      {attribution.analyst_note}
                    </div>
                  )}

                  {/* SAHYOG Quick Dispatch Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onNavigateToSahyog(wallet, attribution.primary_vasp || 'Binance Global')}
                      className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-blue-2 text-white font-semibold text-xs rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Issue Section 91 CrPC Freeze to {attribution.primary_vasp || 'Binance'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-center text-[10px] text-slate-400 mt-1.5 font-mono">
                      I4C SAHYOG Gateway API · Compliant Notice Format
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 3 cols: Next Best Lead & Active Nodes */}
            <div className="lg:col-span-3 space-y-5">
              {/* Next Best Lead Recommendation */}
              {nextLead && (
                <div className="bg-white border-2 border-amber-400/80 rounded-lg p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-bl">
                    LEAD #1
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-700">
                      Recommended Next Action
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 leading-snug">
                    {nextLead.recommended_action}
                  </div>
                  <div className="text-2xs text-slate-600 mt-1 leading-normal">
                    {nextLead.reason}
                  </div>

                  {nextLead.target && (
                    <button
                      onClick={() => setWallet(nextLead.target)}
                      className="mt-3 w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Pivot to Target Address</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Related Network Cluster */}
              {graphData && (
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                      Cluster Entities ({graphData.nodes.length})
                    </span>
                    <button
                      onClick={onNavigateToNetwork}
                      className="text-2xs font-semibold text-gov-blue hover:underline flex items-center gap-0.5"
                    >
                      <span>Canvas</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {graphData.nodes.slice(0, 7).map((node) => {
                      const isCurrent = node.id.toLowerCase() === wallet.toLowerCase();
                      return (
                        <div
                          key={node.id}
                          onClick={() => setWallet(node.id)}
                          className={`p-1.5 rounded flex items-center gap-2 cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              background:
                                node.risk_level === 'high_mule'
                                  ? '#DC2626'
                                  : node.category === 'VASP'
                                  ? '#059669'
                                  : '#2563EB',
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-900 truncate">
                              {node.label}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {node.id.slice(0, 8)}...{node.id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MULTI-HOP FORENSIC LEDGER                                          */}
        {/* ========================================================================= */}
        {activeTab === 'TRACE' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Forensic Multi-Hop Transaction Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological progression of stolen funds from complainant to exchange cashout points
                </p>
              </div>

              {/* Path Switcher */}
              {paths.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Trace Route:</span>
                  {paths.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPath(i)}
                      className={`text-xs px-2.5 py-1 rounded border font-medium transition-colors ${
                        i === selectedPath
                          ? 'border-gov-blue bg-blue-50 text-gov-blue font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p.title || `Route ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ledger hops list */}
            {activePath && activePath.hops && (
              <div className="space-y-3">
                {activePath.hops.map((hop, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gov-blue text-white font-mono text-xs font-bold flex items-center justify-center">
                          {hop.step}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{hop.action}</span>
                        <span className="px-2 py-0.5 rounded text-2xs font-mono font-semibold bg-slate-200 text-slate-700">
                          {hop.tx_hash ? `${hop.tx_hash.slice(0, 10)}...` : '0x8f2a...'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {hop.amount} ({hop.chain})
                        </span>
                        <span className="text-2xs font-mono text-slate-400">
                          {hop.timestamp || '14 Sep 2026, 19:42 IST'}
                        </span>
                      </div>
                    </div>

                    {/* From / To row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase">
                          Sender ({hop.from_category}):
                        </span>
                        <span className="text-slate-700 break-all">{hop.from_entity}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] font-sans font-bold text-slate-400 block uppercase">
                          Recipient ({hop.to_category}):
                        </span>
                        <span className="text-slate-900 font-semibold break-all">{hop.to_entity}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-2xs">
                      <span className="text-slate-500">Evidence Link: {hop.evidence_id} · Direct Layering Hop</span>
                      <button
                        onClick={() => onNavigateToSahyog(hop.to_entity, 'Binance Global')}
                        className="text-gov-blue font-semibold hover:underline flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        <span>Attach to SAHYOG Notice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EVIDENCE & CHAIN OF CUSTODY (SEC 65B)                              */}
        {/* ========================================================================= */}
        {activeTab === 'EVIDENCE' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Section 65B Indian Evidence Act Forensic Vault
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cryptographically hashed chain of custody exhibits generated for FIR 412/2026
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge badge-green font-mono">
                  SHA-256 VERIFIED
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {evidenceList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                        {item.evidence_type}
                      </span>
                    </div>

                    <div className="font-mono text-2xs text-slate-500">
                      Exhibit ID: {item.id} · Case: {item.case_id} · Observed: {item.observed_at}
                    </div>

                    <div className="font-mono text-[11px] text-slate-600 break-all">
                      SHA-256: <span className="text-slate-800 font-semibold">{item.reference_hash}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Certificate of Accuracy under Section 65B(4) generated for Exhibit ${item.id}`)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Sec 65B Cert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CRPC NOTICES & SAHYOG DISPATCH                                     */}
        {/* ========================================================================= */}
        {activeTab === 'ACTIONS' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Legal Directives &amp; Section 91 CrPC Action Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct law enforcement summons and account freeze notices dispatched to registered VASPs
                </p>
              </div>

              <button
                onClick={() => onNavigateToSahyog(wallet, attribution?.primary_vasp || 'Binance Global')}
                className="px-3 py-1.5 bg-gov-blue hover:bg-gov-blue-2 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>+ New Section 91 Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {actionsList.map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {action.action_type}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{action.target_entity}</span>
                      <span
                        className={`badge ${
                          action.status === 'EXECUTED'
                            ? 'badge-green'
                            : action.status === 'IN_REVIEW'
                            ? 'badge-amber'
                            : 'badge-blue'
                        }`}
                      >
                        {action.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">{action.detail}</div>
                    <div className="font-mono text-2xs text-slate-400">
                      Action ID: {action.id} · Target: {action.target_entity}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigateToSahyog(wallet, action.target_entity)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
