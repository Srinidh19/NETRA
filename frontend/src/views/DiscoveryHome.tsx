import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, Zap, AlertTriangle, Network, Layers, 
  Clock, CheckCircle, ExternalLink, Bookmark, FolderPlus, Radio, Search
} from 'lucide-react';
import { api } from '../api';
import { CaseRecord, ActionItem } from '../types';

interface DiscoveryHomeProps {
  onSelectCase: (caseId: string) => void;
  onSelectWallet: (address: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DiscoveryHome: React.FC<DiscoveryHomeProps> = ({
  onSelectCase,
  onSelectWallet,
  onNavigateToTab
}) => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [c, a, s] = await Promise.all([
        api.getCases(),
        api.getActions(),
        api.getSignals()
      ]);
      setCases(c);
      setActions(a);
      setSignals(s);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Welcome & Orientation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line dark:border-line-dark">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
            <span>OPERATIONAL DESK</span>
            <span>•</span>
            <span>CYBER FINANCIAL CRIME INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
            Investigation Discovery Surface
          </h1>
          <p className="text-xs text-stone mt-1">
            Progressive discovery of active syndicates, emerging scam networks, and statutory enforcement actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectWallet('0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
            className="px-4 py-2 rounded text-xs font-semibold text-porcelain bg-ink hover:bg-graphite dark:bg-porcelain dark:text-ink dark:hover:bg-warm-paper transition-all flex items-center gap-1.5 shadow-subtle cursor-pointer"
          >
            <span>LAUNCH OPERATION SHADOWSIPHON</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PINTEREST-INSPIRED MASONRY INFORMATION COMPOSITION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        
        {/* SURFACE 1: ACTIVE INVESTIGATION (Primary Anchor) */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase text-signal-amber flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-signal-amber animate-pulse" />
                Active Investigation
              </span>
              <span className="font-mono text-[10px] text-stone">FIR 412/2026</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-base text-ink dark:text-porcelain">
                Operation ShadowSiphon: Multi-Chain Mule Syndicate
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                ₹42.8 Lakh loss reported via fake AI trading portal. 70% consolidated into institutional VASP deposit infrastructure within 43 minutes.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <div className="text-[10px] text-stone">REPORTED LOSS</div>
                <div className="font-semibold text-ink dark:text-porcelain text-sm">₹42.8 Lakh</div>
              </div>
              <div className="p-2 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <div className="text-[10px] text-stone">TARGET VASP</div>
                <div className="font-semibold text-ink dark:text-porcelain text-sm">Binance Global</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone">Pune Cyber Cell</span>
            <button
              onClick={() => onSelectCase('NTR-DEMO-001')}
              className="text-xs font-semibold text-signal-amber hover:underline flex items-center gap-1"
            >
              <span>Inspect Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 2: NETWORK SIGNAL (Emerging Pattern) */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase text-verdigris flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                Network Signal
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-verdigris/15 text-deep-moss dark:text-verdigris font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-ink dark:text-porcelain">
                Rapid Fan-In Mule Consolidation
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                37 wallets across 4 chains activating in synchronized 15-minute bursts. Common aggregation path identified.
              </p>
            </div>

            <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone">Wallets Involved</span>
                <span className="font-bold">37</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone">Chains</span>
                <span className="font-bold">Ethereum • Tron • Polygon • BSC</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone">Observed Flow</span>
                <span className="font-bold text-signal-amber">₹1.4 Cr</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone">First seen 14m ago</span>
            <button
              onClick={() => onSelectWallet('0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
              className="text-xs font-semibold text-ink dark:text-porcelain hover:underline flex items-center gap-1"
            >
              <span>Trace Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 3: ACTION REQUIRED (Urgent Enforcement) */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border-l-4 border-l-oxide-red border-t border-r border-b border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase text-oxide-red flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Action Required
              </span>
              <span className="font-mono text-[10px] text-stone">Case NTR-2041</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-ink dark:text-porcelain">
                SAHYOG Section 91 CrPC Disclosure
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                Deposit cluster matched to Binance Global. 18.25 ETH held in interim consolidation wallet before off-ramp.
              </p>
            </div>

            <div className="p-3 rounded bg-oxide-red/5 border border-oxide-red/20 space-y-1 text-xs">
              <div className="font-mono font-medium text-oxide-red">Target Intermediary:</div>
              <div className="font-semibold">Binance Global (FIU-IND Reporting)</div>
              <div className="text-[11px] text-stone mt-1">Ground: Section 91 CrPC / Emergency Asset Freeze</div>
            </div>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone">Ready for Review</span>
            <button
              onClick={() => onNavigateToTab('sahyog')}
              className="px-2.5 py-1 rounded text-xs font-semibold text-porcelain bg-oxide-red hover:bg-oxide-red/90 transition-colors"
            >
              Review Request
            </button>
          </div>
        </div>

        {/* SURFACE 4: VASP ATTRIBUTION CANDIDATE */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase text-stone flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-copper" />
                New Attribution
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-signal-amber/15 text-signal-amber font-semibold">
                STRONG SUPPORT
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-ink dark:text-porcelain">
                Binance Deposit Cluster 14
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                7 supporting observations. 16-minute sweep cycle matched against Binance Hot Wallet 6.
              </p>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between p-1.5 rounded bg-porcelain dark:bg-night-elevated">
                <span className="text-stone">Observations</span>
                <span className="font-semibold text-deep-moss dark:text-verdigris">7 Verified</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-porcelain dark:bg-night-elevated">
                <span className="text-stone">Limitations</span>
                <span className="font-semibold text-stone">2 Acknowledged</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-porcelain dark:bg-night-elevated">
                <span className="text-stone">Alternative Hypotheses</span>
                <span className="font-semibold text-stone">1 Competing</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone">Zero Fake Scores</span>
            <button
              onClick={() => onSelectWallet('0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be')}
              className="text-xs font-semibold text-copper hover:underline flex items-center gap-1"
            >
              <span>Examine Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SURFACE 5: SCAM NETWORK INTERACTIVE PREVIEW */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4 hover:border-stone/60 transition-colors md:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-signal-amber" />
              <span className="font-semibold text-sm">SCAM NETWORK 07 (Pune Investment Fraud)</span>
            </div>
            <span className="text-xs font-mono text-stone">Latest activity: 14m ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Observed Flow</span>
              <div className="text-base font-semibold text-ink dark:text-porcelain mt-0.5">₹2.7 Cr</div>
            </div>
            <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Wallets Involved</span>
              <div className="text-base font-semibold text-ink dark:text-porcelain mt-0.5">18 Wallets</div>
            </div>
            <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
              <span className="text-[10px] text-stone">Settlement Destination</span>
              <div className="text-base font-semibold text-signal-amber mt-0.5">1 Probable VASP</div>
            </div>
          </div>

          <p className="text-xs text-stone leading-relaxed">
            Consolidation flow originating from fake telegram investment groups targeting victims in Maharashtra and Karnataka. 
            Mule funds pass through intermediate fan-outs on Ethereum, cross into Tron via Stargate Bridge, and settle into registered domestic exchange clusters.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onSelectWallet('0x7a912e84c98f5b89a456102dc840b8a1c97012fe')}
              className="px-3 py-1.5 rounded text-xs font-semibold text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity"
            >
              Investigate Network
            </button>
            <button
              onClick={() => onNavigateToTab('map')}
              className="px-3 py-1.5 rounded text-xs font-medium text-stone hover:text-ink dark:hover:text-porcelain border border-line dark:border-line-dark hover:bg-warm-paper transition-colors"
            >
              View on National Map
            </button>
          </div>
        </div>

        {/* SURFACE 6: EVIDENCE SNIPPET */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3 hover:border-stone/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase text-stone flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-deep-moss dark:text-verdigris" />
              Verified Evidence
            </span>
            <span className="font-mono text-[10px] text-stone">EV-019284</span>
          </div>

          <div className="space-y-1">
            <div className="font-semibold text-xs">Binance Institutional Deposit Sweep</div>
            <div className="text-[11px] text-stone font-mono">Bitquery / Ethereum Mainnet</div>
          </div>

          <div className="p-2 rounded bg-porcelain dark:bg-night-elevated text-[10px] font-mono text-stone space-y-1 break-all">
            <div>REF HASH: 0x55dc8192039481720394871029487102938479911bb</div>
            <div>PROVENANCE: 7d793037a0760186574b0282f2f435e70d71686e9e9a74eb</div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono text-deep-moss dark:text-verdigris">Tamper-Evident</span>
            <button
              onClick={() => onNavigateToTab('evidence')}
              className="text-stone hover:text-ink dark:hover:text-porcelain font-medium text-xs flex items-center gap-1"
            >
              <span>Vault</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* SURFACE 7: SAVED INVESTIGATION COLLECTIONS (Pinterest-Style Curation) */}
        <div className="p-5 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3 hover:border-stone/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase text-stone flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-signal-amber" />
              Saved Collection
            </span>
            <span className="font-mono text-[10px] text-stone">4 Cases</span>
          </div>

          <div className="space-y-1">
            <div className="font-semibold text-xs">USDT Cross-Border Mule Syndicates</div>
            <p className="text-[11px] text-stone">
              Curated collection of Stargate Bridge hops with terminal off-ramps in Southeast Asia and domestic P2P.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono text-stone">Updated 2h ago</span>
            <button
              onClick={() => onNavigateToTab('cases')}
              className="text-signal-amber font-medium hover:underline text-xs flex items-center gap-1"
            >
              <span>Open Collection</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* RECENT CASE FILES TABLE */}
      <div className="p-6 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Active Case Docket</h2>
            <p className="text-xs text-stone">Registered cyber police cases under active blockchain tracking.</p>
          </div>
          <button
            onClick={() => onNavigateToTab('cases')}
            className="text-xs font-semibold text-stone hover:text-ink dark:hover:text-porcelain flex items-center gap-1 font-mono"
          >
            <span>View All Cases ({cases.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line dark:border-line-dark font-mono text-stone">
                <th className="pb-2 font-medium">CASE ID</th>
                <th className="pb-2 font-medium">TITLE & FIR</th>
                <th className="pb-2 font-medium">STATE</th>
                <th className="pb-2 font-medium">LOSS (INR)</th>
                <th className="pb-2 font-medium">VASP TARGET</th>
                <th className="pb-2 font-medium">STATUS</th>
                <th className="pb-2 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 dark:divide-line-dark/40">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-warm-paper/60 dark:hover:bg-night-elevated transition-colors">
                  <td className="py-3 font-mono font-semibold text-ink dark:text-porcelain">{c.id}</td>
                  <td className="py-3">
                    <div className="font-semibold text-ink dark:text-porcelain">{c.title}</div>
                    <div className="text-[11px] text-stone font-mono">{c.fir_number} • {c.police_station}</div>
                  </td>
                  <td className="py-3 text-stone">{c.state}</td>
                  <td className="py-3 font-mono font-semibold">₹{(c.loss_amount_inr / 100000).toFixed(1)} Lakh</td>
                  <td className="py-3 font-mono text-stone">{c.identified_vasps.join(', ')}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-warm-paper dark:bg-night-bg border border-line dark:border-line-dark text-stone">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectCase(c.id)}
                      className="px-2.5 py-1 rounded font-semibold text-xs text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
