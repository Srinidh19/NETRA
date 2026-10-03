import React, { useState, useEffect } from 'react';
import {
  Search, Shield, Network, ArrowRight, Layers,
  ChevronDown, X, Copy, Check, Filter, Sparkles,
  Database, RefreshCw, AlertTriangle, FileText
} from 'lucide-react';

export interface ExploreBarProps {
  initialValue?: string;
  onSearch: (query: string, chain: string, hops: number, caseId?: string) => void;
  onNavigateToNetwork?: () => void;
  currentCaseId?: string;
  className?: string;
  compact?: boolean;
}

export const CHAIN_OPTIONS = [
  { id: 'ALL',      label: 'All Chains',   symbol: 'MULTI', color: 'bg-slate-100 text-slate-700' },
  { id: 'ETH',      label: 'Ethereum',     symbol: 'ETH',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'TRON',     label: 'Tron (TRC-20)',symbol: 'TRX',   color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'BTC',      label: 'Bitcoin',      symbol: 'BTC',   color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'BSC',      label: 'BNB Chain',    symbol: 'BNB',   color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { id: 'POLYGON',  label: 'Polygon',      symbol: 'MATIC', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export const FORENSIC_PRESETS = [
  {
    name: 'Victim Inflow (Complainant)',
    address: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
    chain: 'ETH',
    tag: 'VICTIM',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    case: 'NTR-DEMO-001',
    note: 'Stolen ₹42.8 Lakh deposit'
  },
  {
    name: 'Syndicate Mule 1 (Primary Split)',
    address: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
    chain: 'ETH',
    tag: 'HIGH RISK MULE',
    tagColor: 'bg-red-100 text-red-800 border-red-200',
    case: 'NTR-DEMO-001',
    note: 'Immediate 43-min sweep'
  },
  {
    name: 'Layering Hub (Multi-Hop Sweep)',
    address: '0x28c6c06298d514db089934071355e5743bf21d60',
    chain: 'ETH',
    tag: 'CONSOLIDATION',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    case: 'NTR-DEMO-001',
    note: 'Intermediary sweep pool'
  },
  {
    name: 'Binance Hot Wallet 6 (Liquidation)',
    address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
    chain: 'ETH',
    tag: 'VASP CLUSTER',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    case: 'NTR-DEMO-001',
    note: 'Sec 91 CrPC actionable'
  },
  {
    name: 'CoinDCX Domestic Inflow Gateway',
    address: '0x503828976d22510aad0201ac7ec88293211a23da',
    chain: 'ETH',
    tag: 'FIU-IND VASP',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    case: 'NTR-DEMO-001',
    note: 'Direct INR off-ramp'
  }
];

export const ExploreBar: React.FC<ExploreBarProps> = ({
  initialValue = '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
  onSearch,
  onNavigateToNetwork,
  currentCaseId = 'NTR-DEMO-001',
  className = '',
  compact = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [selectedChain, setSelectedChain] = useState('ALL');
  const [hops, setHops] = useState<number>(2);
  const [isChainMenuOpen, setIsChainMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detectedType, setDetectedType] = useState<string>('EVM Address');

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Live query type detector
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setDetectedType('');
      return;
    }
    if (q.startsWith('0x') && q.length === 42) {
      setDetectedType('EVM Wallet Address');
    } else if (q.startsWith('0x') && q.length === 66) {
      setDetectedType('EVM Tx Hash (64-byte)');
    } else if (q.startsWith('T') && q.length === 34) {
      setDetectedType('Tron (TRC-20) Address');
    } else if (q.startsWith('bc1') || q.startsWith('1') || q.startsWith('3')) {
      setDetectedType('Bitcoin UTXO Address');
    } else if (q.toUpperCase().startsWith('FIR') || q.toUpperCase().startsWith('NTR-')) {
      setDetectedType('FIR / Police Docket ID');
    } else {
      setDetectedType('General Forensic Query');
    }
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), selectedChain, hops, currentCaseId);
  };

  const handlePresetSelect = (preset: typeof FORENSIC_PRESETS[0]) => {
    setQuery(preset.address);
    setSelectedChain(preset.chain);
    onSearch(preset.address, preset.chain, hops, preset.case);
  };

  const handleCopy = () => {
    if (!query) return;
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const currentChainObj = CHAIN_OPTIONS.find(c => c.id === selectedChain) || CHAIN_OPTIONS[0];

  return (
    <div className={`w-full bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
      {/* Primary Input Strip */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Chain Selector dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsChainMenuOpen(!isChainMenuOpen)}
              className="w-full lg:w-auto h-10 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 flex items-center justify-between lg:justify-start gap-2 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${selectedChain === 'ALL' ? 'bg-gov-blue' : 'bg-status-green'}`} />
                <span>{currentChainObj.label}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isChainMenuOpen && (
              <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 animate-fade-in">
                <div className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Target Blockchain
                </div>
                {CHAIN_OPTIONS.map((chain) => (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => {
                      setSelectedChain(chain.id);
                      setIsChainMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedChain === chain.id ? 'bg-blue-50 font-semibold text-gov-blue' : 'text-slate-700'
                    }`}
                  >
                    <span>{chain.label}</span>
                    <span className="font-mono text-2xs text-slate-400">{chain.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input Box */}
          <div className="flex-1 relative flex items-center bg-slate-50/70 focus-within:bg-white border border-slate-200 focus-within:border-gov-blue focus-within:ring-2 focus-within:ring-gov-blue/15 rounded-md transition-all">
            <div className="pl-3 pr-2 text-slate-400 flex items-center shrink-0">
              <Search className="w-4 h-4 text-gov-blue" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wallet address (0x..., T..., bc1...), Tx Hash (64-hex), or Case/FIR No..."
              className="w-full h-10 bg-transparent text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none pr-10"
              spellCheck={false}
            />

            {/* Live Detected Type Pill */}
            {detectedType && (
              <div className="hidden sm:flex items-center gap-1 mr-2 px-2 py-0.5 rounded text-2xs font-mono font-medium bg-slate-200/70 text-slate-700 border border-slate-300/60 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-blue" />
                {detectedType}
              </div>
            )}

            {/* Clear or Copy buttons */}
            <div className="flex items-center gap-1 pr-2 shrink-0">
              {query && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                    title="Copy address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-status-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Hop Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md p-0.5 h-10 shrink-0">
            <span className="text-2xs font-semibold uppercase text-slate-500 px-2 select-none">Hops:</span>
            {[1, 2, 3, 4].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHops(h)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded transition-colors ${
                  hops === h
                    ? 'bg-gov-blue text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              className="flex-1 lg:flex-none h-10 px-5 bg-gov-blue hover:bg-gov-blue-2 text-white font-medium text-xs rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Investigate Target</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {onNavigateToNetwork && (
              <button
                type="button"
                onClick={onNavigateToNetwork}
                className="h-10 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                title="Open directly in graph canvas"
              >
                <Network className="w-3.5 h-3.5 text-gov-blue" />
                <span className="hidden xl:inline">Graph View</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Quick Forensic Target Presets & Active Case Ribbon */}
      {!compact && (
        <div className="px-3 sm:px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gov-saffron" />
              Quick Case Leads:
            </span>

            {FORENSIC_PRESETS.map((preset) => {
              const isSelected = query.toLowerCase() === preset.address.toLowerCase();
              return (
                <button
                  key={preset.address}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-2xs font-mono transition-all border ${
                    isSelected
                      ? 'bg-gov-blue text-white border-gov-blue shadow-xs font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                  title={`${preset.name}: ${preset.note}`}
                >
                  <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : preset.tagColor
                  }`}>
                    {preset.tag}
                  </span>
                  <span>{preset.address.slice(0, 6)}...{preset.address.slice(-4)}</span>
                </button>
              );
            })}
          </div>

          {/* Active Docket / Case Tag */}
          <div className="flex items-center gap-2 text-2xs font-mono text-slate-500 shrink-0">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              FIR Docket:
            </span>
            <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {currentCaseId} (Pune Cyber)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
