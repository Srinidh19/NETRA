import React, { useState, useEffect } from 'react';
import { 
  Network, Shield, MapPin, ArrowRight, Activity, Filter, 
  ExternalLink, Layers, ChevronRight, Zap
} from 'lucide-react';
import { api } from '../api';
import { RegionalIntelligence } from '../types';

interface ScamNetworkMapProps {
  onSelectCase: (caseId: string) => void;
  onSelectWallet: (address: string) => void;
}

export const ScamNetworkMap: React.FC<ScamNetworkMapProps> = ({
  onSelectCase,
  onSelectWallet
}) => {
  const [regions, setRegions] = useState<RegionalIntelligence[]>([]);
  const [crossStateLinks, setCrossStateLinks] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionalIntelligence | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    async function loadMap() {
      const data = await api.getMapData();
      setRegions(data.regions);
      setCrossStateLinks(data.cross_state_links);
      setSummary(data.summary);
      if (data.regions.length > 0) {
        setSelectedRegion(data.regions[0]); // Default to Maharashtra
      }
    }
    loadMap();
  }, []);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header & National Totals */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
            <span>NATIONAL INTELLIGENCE RADAR</span>
            <span>•</span>
            <span>CROSS-STATE SCAM SYNDICATE MAP</span>
          </div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
            India Scam Network Intelligence Surface
          </h1>
          <p className="text-xs text-stone mt-0.5">
            Geographic correlation of mule recruitment corridors, cross-border token bridges, and domestic VASP liquidation nodes.
          </p>
        </div>

        {summary && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark">
              <span className="text-stone text-[10px]">ACTIVE NETWORKS:</span>
              <span className="font-bold text-ink dark:text-porcelain ml-1.5">{summary.total_active_networks}</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark">
              <span className="text-stone text-[10px]">TOTAL INTERCEPTED:</span>
              <span className="font-bold text-signal-amber ml-1.5">₹{summary.national_intercepted_inr_cr} Cr</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark">
              <span className="text-stone text-[10px]">REPORTING STATES:</span>
              <span className="font-bold text-ink dark:text-porcelain ml-1.5">{summary.reporting_states}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Map Workspace (Grid of 12 columns: 8 map canvas, 4 regional intelligence drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INTERACTIVE VECTOR MAP CANVAS (8 COLS) */}
        <div className="lg:col-span-8 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle overflow-hidden">
          
          <div className="p-3 border-b border-line dark:border-line-dark flex items-center justify-between bg-warm-paper/70 dark:bg-night-elevated">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone">
              National Corridor Topological Plot
            </span>
            <div className="text-[11px] font-mono text-stone">
              Click node to inspect regional case files & mule corridors
            </div>
          </div>

          <div className="relative min-h-[500px] graph-grid-bg p-6 flex flex-col justify-between">
            
            {/* National Topological Regional Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {regions.map((region) => {
                const isSelected = selectedRegion?.id === region.id;
                return (
                  <div
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-signal-amber bg-porcelain dark:bg-night-elevated shadow-md ring-1 ring-signal-amber'
                        : 'border-line dark:border-line-dark bg-porcelain/80 dark:bg-night-elevated/70 hover:border-stone/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-signal-amber' : 'text-stone'}`} />
                        <span>{region.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-stone">{region.capital}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <div className="text-[10px] text-stone">Investigations</div>
                        <div className="font-bold text-ink dark:text-porcelain">{region.active_investigations}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone">Scam Flow</div>
                        <div className="font-bold text-signal-amber">₹{region.total_observed_flow_cr} Cr</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between text-[10px] font-mono text-stone">
                      <span>{region.observed_scam_networks} syndicates</span>
                      <span className="text-verdigris font-semibold">{region.recent_signals} new signals</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cross-State Corridor Relationship Strip */}
            <div className="mt-8 p-3 rounded bg-porcelain/80 dark:bg-night-elevated/80 border border-line dark:border-line-dark backdrop-blur-sm space-y-2">
              <div className="text-[10px] font-mono uppercase text-stone flex items-center justify-between">
                <span>Observed Inter-State Mule & Cashout Corridors</span>
                <span>Supported by FIR on-chain correlation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {crossStateLinks.map((link, idx) => (
                  <div key={idx} className="p-2 rounded bg-warm-paper/60 dark:bg-night-bg border border-line/60 dark:border-line-dark/60 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-ink dark:text-porcelain">{link.from}</span>
                      <span className="text-stone mx-1">→</span>
                      <span className="font-semibold text-signal-amber">{link.to}</span>
                      <div className="text-[10px] text-stone mt-0.5">{link.type}</div>
                    </div>
                    <div className="font-bold text-ink dark:text-porcelain">
                      ₹{link.flow_cr} Cr
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* REGIONAL INTELLIGENCE DETAIL DRAWER (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          
          {selectedRegion ? (
            <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
                <div>
                  <div className="font-mono text-[10px] text-stone uppercase">Regional Command</div>
                  <h3 className="text-lg font-semibold text-ink dark:text-porcelain">
                    {selectedRegion.name}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-signal-amber/15 text-signal-amber font-semibold">
                  {selectedRegion.active_investigations} Active Cases
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <div className="text-[10px] text-stone">Observed Scam Networks</div>
                  <div className="text-base font-bold text-ink dark:text-porcelain mt-0.5">
                    {selectedRegion.observed_scam_networks}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <div className="text-[10px] text-stone">VASP Interactions</div>
                  <div className="text-base font-bold text-copper mt-0.5">
                    {selectedRegion.vasp_interactions}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <div className="text-[10px] text-stone">Total Observed Flow</div>
                  <div className="text-base font-bold text-signal-amber mt-0.5">
                    ₹{selectedRegion.total_observed_flow_cr} Cr
                  </div>
                </div>
                <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                  <div className="text-[10px] text-stone">Live Ingestion Signals</div>
                  <div className="text-base font-bold text-deep-moss dark:text-verdigris mt-0.5">
                    {selectedRegion.recent_signals}
                  </div>
                </div>
              </div>

              {/* Top Observed Scam Patterns */}
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase font-semibold text-stone">
                  Top Observed Fraud Typologies
                </div>
                <div className="space-y-1">
                  {selectedRegion.top_patterns.map((p, idx) => (
                    <div key={idx} className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 text-xs flex items-center justify-between">
                      <span className="font-semibold text-ink dark:text-porcelain">{p}</span>
                      <span className="font-mono text-[10px] text-stone">High Frequency</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Active Cases in Region */}
              {selectedRegion.active_cases.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-line/60 dark:border-line-dark/60">
                  <div className="font-mono text-xs uppercase font-semibold text-stone">
                    Active Docket ({selectedRegion.active_cases.length})
                  </div>
                  <div className="space-y-1">
                    {selectedRegion.active_cases.map((cid) => (
                      <button
                        key={cid}
                        onClick={() => onSelectCase(cid)}
                        className="w-full p-2.5 rounded text-left bg-porcelain dark:bg-night-elevated hover:bg-warm-paper dark:hover:bg-night-surface border border-line/60 dark:border-line-dark/60 transition-colors flex items-center justify-between text-xs font-mono group"
                      >
                        <span className="font-semibold text-signal-amber">{cid}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => onSelectWallet('0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
                  className="w-full py-2 rounded text-xs font-semibold text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <span>Open Primary Syndicate in Investigation Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone font-mono border border-line dark:border-line-dark rounded-lg">
              Select a state node to view cybercrime syndicate telemetry.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
