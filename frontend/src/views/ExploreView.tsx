import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, Zap, AlertTriangle, Network, Layers, 
  Clock, CheckCircle2, Bookmark, Radio, Activity, MapPin, Eye
} from 'lucide-react';
import { api } from '../api';
import { CaseRecord, ActionItem, SavedCollection } from '../types';

interface ExploreViewProps {
  onInvestigateWallet: (address: string) => void;
  onOpenCase: (caseId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onInspect: (type: string, id: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onInvestigateWallet,
  onOpenCase,
  onNavigateToTab,
  onInspect
}) => {
  const [exploreData, setExploreData] = useState<any | null>(null);
  const [collections, setCollections] = useState<SavedCollection[]>([]);

  useEffect(() => {
    async function loadExplore() {
      const [feed, cols] = await Promise.all([
        api.getExploreFeed(),
        api.getCollections()
      ]);
      setExploreData(feed);
      setCollections(cols);
    }
    loadExplore();
  }, []);

  const whatMatters = exploreData?.what_matters_now || [
    { id: '1', title: 'New VASP attribution confirmed', detail: 'Binance Cluster 14 matched to FIR 412/2026', urgency: 'high' },
    { id: '2', title: 'Network activity increased', detail: '37 wallets synchronizing on Ethereum/Tron', urgency: 'medium' },
    { id: '3', title: 'SAHYOG response received', detail: 'Verified KYC & frozen balance attached to Case NTR-2041', urgency: 'resolved' },
    { id: '4', title: '2 actions require review', detail: 'Section 91 CrPC disclosure pending approval', urgency: 'urgent' }
  ];

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* SECTION 9: "WHAT MATTERS NOW" OPERATIONAL STRIP (Replaces giant KPI dashboard) */}
      <div className="p-3.5 rounded-lg bg-warm-paper/80 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-signal-amber animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-porcelain">
            WHAT MATTERS NOW
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {whatMatters.map((item: any) => (
            <div 
              key={item.id}
              onClick={() => onNavigateToTab('actions')}
              className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 text-xs font-mono flex items-center justify-between gap-2 hover:border-signal-amber transition-colors cursor-pointer"
            >
              <div className="truncate">
                <div className="font-semibold text-ink dark:text-porcelain truncate">{item.title}</div>
                <div className="text-[10px] text-stone truncate">{item.detail}</div>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                item.urgency === 'urgent' ? 'bg-oxide-red' : item.urgency === 'high' ? 'bg-signal-amber' : 'bg-verdigris'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* MASONRY / EDITORIAL DISCOVERY CANVASES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-start">
        
        {/* SURFACE 1: URGENT INVESTIGATION (4 COLS) */}
        <div className="lg:col-span-4 p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase text-signal-amber flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Urgent Active Investigation
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-warm-paper dark:bg-night-bg text-stone">
                FIR 412/2026
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink dark:text-porcelain">
                Operation ShadowSiphon: Multi-Chain Mule Syndicate
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                Complainant induced to invest ₹42.8 Lakh via deceptive algorithmic portal. 70% consolidated into institutional VASP deposit infrastructure within 43 minutes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">REPORTED LOSS</span>
                <div className="font-bold text-signal-amber text-sm mt-0.5">₹42.8 Lakh</div>
              </div>
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">TARGET VASP</span>
                <div className="font-bold text-ink dark:text-porcelain text-sm mt-0.5">Binance Global</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between">
            <button
              onClick={() => onInspect('Wallet', '0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
              className="text-xs font-mono text-stone hover:text-ink flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Mule</span>
            </button>

            <button
              onClick={() => onInvestigateWallet('0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
              className="px-3 py-1.5 rounded text-xs font-semibold text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>Investigate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 2: EMERGING SCAM NETWORK (5 COLS) */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
              <span className="font-mono text-[11px] font-bold uppercase text-verdigris flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                Emerging Scam Network 07
              </span>
              <span className="font-mono text-[10px] text-stone">Active 14 min ago</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">Observed Flow</span>
                <div className="font-bold text-ink dark:text-porcelain text-sm mt-0.5">₹2.7 Cr</div>
              </div>
              <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">Wallets</span>
                <div className="font-bold text-ink dark:text-porcelain text-sm mt-0.5">18 Wallets</div>
              </div>
              <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">Bridges</span>
                <div className="font-bold text-copper text-sm mt-0.5">2 Bridges</div>
              </div>
            </div>

            <p className="text-xs text-stone leading-relaxed">
              Consolidation flow originating from Telegram fake task syndicates in Pune and Bengaluru. 
              Mule pass-throughs hop from Ethereum to Tron USDT via Stargate Bridge before settling in domestic exchange accounts.
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone">3 Chains Connected</span>
            <button
              onClick={() => onNavigateToTab('networks')}
              className="text-xs font-semibold text-verdigris hover:underline flex items-center gap-1 font-mono"
            >
              <span>Explore Networks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 3: ACTION REQUIRED (3 COLS) */}
        <div className="lg:col-span-3 p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border-l-4 border-l-oxide-red border-t border-r border-b border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase text-oxide-red flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Action Required
              </span>
              <span className="font-mono text-[10px] text-stone">3 Pending</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-ink dark:text-porcelain">
                VASP Disclosure Request Ready
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                Deposit infrastructure identified for Case NTR-2041. 18.25 ETH held in interim consolidation wallet before off-ramp.
              </p>
            </div>

            <div className="p-2.5 rounded bg-oxide-red/10 border border-oxide-red/20 text-xs font-mono space-y-1">
              <div className="text-oxide-red font-bold">Intermediary: Binance Global</div>
              <div className="text-[10px] text-stone">Provision: Section 91 CrPC Notice</div>
            </div>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex justify-end">
            <button
              onClick={() => onNavigateToTab('actions')}
              className="px-3 py-1.5 rounded text-xs font-semibold text-porcelain bg-oxide-red hover:bg-oxide-red/90 transition-colors"
            >
              Review Actions
            </button>
          </div>
        </div>

        {/* SURFACE 4: INDIA NETWORK MAP FRAGMENT (6 COLS) */}
        <div className="lg:col-span-6 p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-signal-amber" />
              <span className="font-semibold text-sm">National Scam Corridor Activity</span>
            </div>
            <span className="text-xs font-mono text-stone">14 States Reporting</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Maharashtra</span>
              <div className="font-bold mt-0.5">84 cases</div>
            </div>
            <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Delhi NCR</span>
              <div className="font-bold mt-0.5">62 cases</div>
            </div>
            <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Karnataka</span>
              <div className="font-bold mt-0.5">47 cases</div>
            </div>
            <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Rajasthan</span>
              <div className="font-bold mt-0.5">39 cases</div>
            </div>
          </div>

          <p className="text-xs text-stone leading-relaxed">
            Active cross-state link observed: Mewat mule accounts sourcing UPI deposits $\rightarrow$ consolidated via Surat OTC desks $\rightarrow$ settled via institutional VASP hot wallets.
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateToTab('networks')}
              className="text-xs font-semibold text-signal-amber hover:underline flex items-center gap-1 font-mono"
            >
              <span>Open National Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 5: RECENT VASP ATTRIBUTION (3 COLS) */}
        <div className="lg:col-span-3 p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase text-copper flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                VASP Attribution
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-signal-amber/15 text-signal-amber font-semibold">
                STRONG SUPPORT
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-ink dark:text-porcelain">
                Binance Deposit Cluster 14
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                7 supporting observations. 16-minute sweep cycle matched against verified Binance Hot Wallet 6.
              </p>
            </div>

            <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 font-mono text-[11px] text-stone space-y-1">
              <div>Observations: <span className="font-bold text-deep-moss dark:text-verdigris">7 Verified</span></div>
              <div>Limitations: <span className="font-bold text-stone">2 Acknowledged</span></div>
              <div>Sweep Latency: <span className="font-bold text-ink dark:text-porcelain">16 min</span></div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onInvestigateWallet('0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be')}
              className="text-xs font-semibold text-copper hover:underline flex items-center gap-1 font-mono"
            >
              <span>Examine Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 6: SAVED INVESTIGATION COLLECTIONS (3 COLS) */}
        <div className="lg:col-span-3 p-5 rounded-lg bg-warm-paper/50 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase text-stone flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-signal-amber" />
                Saved Collections
              </span>
              <span className="font-mono text-[10px] text-stone">{collections.length} Collections</span>
            </div>

            <div className="space-y-2">
              {collections.map((col) => (
                <div 
                  key={col.id} 
                  className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 text-xs space-y-0.5"
                >
                  <div className="font-semibold text-ink dark:text-porcelain flex items-center justify-between">
                    <span>{col.title}</span>
                    <span className="text-[10px] font-mono text-stone">{col.items_count} items</span>
                  </div>
                  <p className="text-[11px] text-stone truncate">{col.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateToTab('cases')}
              className="text-xs font-semibold text-signal-amber hover:underline flex items-center gap-1 font-mono"
            >
              <span>View Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
