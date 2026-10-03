import React, { useState, useEffect } from 'react';
import { 
  Network, Shield, MapPin, ArrowRight, Activity, Filter, 
  ExternalLink, Layers, ChevronRight, Zap, Eye
} from 'lucide-react';
import { api } from '../api';
import { RegionalIntelligence } from '../types';

interface NetworksViewProps {
  onInvestigateWallet: (address: string) => void;
  onOpenCase: (caseId: string) => void;
  onInspect: (type: string, id: string) => void;
}

export const NetworksView: React.FC<NetworksViewProps> = ({
  onInvestigateWallet,
  onOpenCase,
  onInspect
}) => {
  const [regions, setRegions] = useState<RegionalIntelligence[]>([]);
  const [crossStateLinks, setCrossStateLinks] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionalIntelligence | null>(null);

  useEffect(() => {
    async function loadNetworkData() {
      const [mapRes, sigRes] = await Promise.all([
        api.getMapData(),
        api.getSignals()
      ]);
      setRegions(mapRes.regions);
      setCrossStateLinks(mapRes.cross_state_links);
      setSignals(sigRes);
      if (mapRes.regions.length > 0) {
        setSelectedRegion(mapRes.regions[0]); // Default to Maharashtra
      }
    }
    loadNetworkData();
  }, []);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
            <span>GEOGRAPHIC & TOPOLOGICAL INTELLIGENCE</span>
            <span>•</span>
            <span>NATIONAL SCAM CORRIDORS</span>
          </div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
            Networks & Geographic Intelligence
          </h1>
          <p className="text-xs text-stone mt-0.5">
            Geographic correlation connecting unhosted mule recruitment zones with domestic and cross-border VASP liquidation nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark">
            CORRIDORS: <span className="font-bold text-signal-amber">4 Active Inter-State</span>
          </span>
          <span className="px-3 py-1.5 rounded bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark">
            SYNDICATES: <span className="font-bold text-ink dark:text-porcelain">84 Tracked</span>
          </span>
        </div>
      </div>

      {/* Grid: 8 Cols Map + 4 Cols Regional Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INDIA TOPOLOGICAL RADAR (8 COLS) */}
        <div className="lg:col-span-8 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone flex items-center gap-2">
              <MapPin className="w-4 h-4 text-signal-amber" />
              <span>National Cybercrime Geographic Radar</span>
            </span>
            <span className="text-[11px] font-mono text-stone">Click region to filter active docket</span>
          </div>

          {/* Regional Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-ink dark:text-porcelain">{region.name}</span>
                    <span className="font-mono text-[10px] text-stone">{region.capital}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div>
                      <div className="text-[10px] text-stone">Active Cases</div>
                      <div className="font-bold text-ink dark:text-porcelain">{region.active_investigations}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone">Observed Flow</div>
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

          {/* Cross-State Corridors */}
          <div className="pt-3 border-t border-line dark:border-line-dark space-y-2">
            <span className="font-mono text-[11px] uppercase font-semibold text-stone">
              Observed Cross-State Laundering Corridors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {crossStateLinks.map((link, idx) => (
                <div key={idx} className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ink dark:text-porcelain">{link.from}</span>
                    <span className="text-stone mx-1">→</span>
                    <span className="font-bold text-signal-amber">{link.to}</span>
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

        {/* REGIONAL INTELLIGENCE DRAWER (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedRegion ? (
            <div className="p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
                <div>
                  <div className="font-mono text-[10px] uppercase text-stone">Regional Telemetry</div>
                  <h3 className="text-lg font-semibold text-ink dark:text-porcelain">{selectedRegion.name}</h3>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-signal-amber/15 text-signal-amber font-semibold">
                  {selectedRegion.active_investigations} Active Cases
                </span>
              </div>

              {/* Top Fraud Patterns */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase font-semibold text-stone">
                  Observed Syndicate Typologies
                </span>
                <div className="space-y-1">
                  {selectedRegion.top_patterns.map((p, i) => (
                    <div key={i} className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 text-xs flex items-center justify-between">
                      <span className="font-semibold text-ink dark:text-porcelain">{p}</span>
                      <span className="font-mono text-[10px] text-stone">Corroborated</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Cases in Region */}
              {selectedRegion.active_cases.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-line/60 dark:border-line-dark/60">
                  <span className="font-mono text-[11px] uppercase font-semibold text-stone">
                    Active Docket ({selectedRegion.active_cases.length})
                  </span>
                  <div className="space-y-1">
                    {selectedRegion.active_cases.map((cid) => (
                      <button
                        key={cid}
                        onClick={() => onOpenCase(cid)}
                        className="w-full p-2.5 rounded text-left bg-porcelain dark:bg-night-elevated hover:bg-warm-paper border border-line/60 dark:border-line-dark/60 transition-colors flex items-center justify-between text-xs font-mono group"
                      >
                        <span className="font-semibold text-signal-amber">{cid}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => onInvestigateWallet('0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
                className="w-full py-2.5 rounded font-semibold text-xs text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>Investigate Primary Regional Syndicate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone font-mono border border-line dark:border-line-dark rounded-lg">
              Select a state node to view cybercrime corridor telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
