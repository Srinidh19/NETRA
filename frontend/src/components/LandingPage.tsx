import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, Layers, Radio, Network, FileCheck, CheckCircle2, 
  ExternalLink, ChevronRight, Activity, CornerDownRight, Database, Zap
} from 'lucide-react';

interface LandingPageProps {
  onEnterDesk: () => void;
  onExploreNetworks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDesk,
  onExploreNetworks
}) => {
  // Choreographed 7-second sequence
  const [animSecond, setAnimSecond] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimSecond((prev) => (prev + 1) % 8);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const timelineSteps = [
    { sec: 0, label: '0s: Single Suspicious Transaction', detail: '0x3b89e...f110 transfer of 18.4 ETH ($48.2k)', badge: 'SIGNAL' },
    { sec: 1, label: '1s: Victim-Facing Wallet Identified', detail: 'Primary Mule Alpha (0x7a91...12fe) activated', badge: 'WALLET' },
    { sec: 2, label: '2s: Automated Mule Fan-In Layer', detail: 'Funds split & swept across 4 intermediary addresses', badge: 'LAYERING' },
    { sec: 3, label: '3s: Consolidation Network Forms', detail: 'Aggregation node 0x3f5c...f0be consolidates stolen flow', badge: 'NETWORK' },
    { sec: 4, label: '4s: Cross-Chain Bridge Transition', detail: 'Stargate Router converts ETH into Tron TRC-20 USDT', badge: 'BRIDGE' },
    { sec: 5, label: '5s: VASP Deposit Infrastructure Match', detail: '16-minute sweep into verified Binance Hot Wallet 6', badge: 'VASP' },
    { sec: 6, label: '6s: Defensible Finding Synthesized', detail: 'Strong Support: 7 verified observations, 2 limitations', badge: 'FINDING' },
    { sec: 7, label: '7s: Authorized Statutory SAHYOG Action', detail: 'Section 91 CrPC notice ready for supervisory review', badge: 'ACTION' },
  ];

  const chains = [
    { name: 'Ethereum', symbol: 'ETH', standard: 'ERC-20', status: 'Archive Synced', latency: '28ms' },
    { name: 'Tron', symbol: 'TRX', standard: 'TRC-20 (USDT)', status: 'Live Indexing', latency: '34ms' },
    { name: 'Bitcoin', symbol: 'BTC', standard: 'UTXO Core', status: 'Mempool Stream', latency: '31ms' },
    { name: 'BNB Chain', symbol: 'BNB', standard: 'BEP-20', status: 'Archive Synced', latency: '39ms' },
    { name: 'Polygon', symbol: 'POL', standard: 'PoS Ingestion', status: 'Block Listener', latency: '22ms' },
    { name: 'Solana', symbol: 'SOL', standard: 'SPL Token', status: 'RPC Validator', latency: '45ms' },
  ];

  return (
    <div className="w-full bg-porcelain dark:bg-night-bg text-ink dark:text-porcelain selection:bg-signal-amber/20">
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto border-b border-line dark:border-line-dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono text-stone dark:text-stone/90 bg-warm-paper/80 dark:bg-night-elevated border border-line dark:border-line-dark">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-amber animate-pulse"></span>
              <span>GOVERNMENT OF INDIA • CYBER-FINANCIAL INVESTIGATION PLATFORM</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight leading-[1.05] text-ink dark:text-porcelain uppercase">
              THE WALLET<br />
              IS ONLY<br />
              <span className="text-signal-amber">THE BEGINNING.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone dark:text-stone/90 max-w-xl font-normal leading-relaxed">
              NETRA turns blockchain activity into discoverable networks, defensible VASP attribution, 
              and authorized statutory actions before criminal syndicates off-ramp the stolen capital.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onEnterDesk}
                className="px-6 py-3 rounded text-sm font-semibold text-porcelain bg-ink hover:bg-graphite dark:bg-porcelain dark:text-ink dark:hover:bg-warm-paper transition-all flex items-center gap-2 group shadow-subtle cursor-pointer"
              >
                <span>ENTER INVESTIGATION DESK</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreNetworks}
                className="px-5 py-3 rounded text-sm font-medium text-ink dark:text-porcelain bg-warm-paper/80 dark:bg-night-elevated hover:bg-warm-paper dark:hover:bg-night-surface border border-line dark:border-line-dark transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Network className="w-4 h-4 text-stone" />
                <span>EXPLORE NETWORKS</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-stone font-mono">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-deep-moss dark:text-verdigris" />
                <span>Section 91 CrPC Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-signal-amber" />
                <span>Multi-Chain Ingestion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-copper" />
                <span>Tamper-Evident Ledger</span>
              </div>
            </div>
          </div>

          {/* CHOREOGRAPHED 7-SECOND SEQUENCE */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
                <span className="font-mono text-xs uppercase text-stone tracking-wider font-semibold">
                  7-Second Forensic Progression
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-porcelain dark:bg-night-bg border border-line dark:border-line-dark text-stone">
                  {animSecond}s of 7s
                </span>
              </div>

              <div className="space-y-2.5">
                {timelineSteps.map((step) => {
                  const isCurrent = animSecond === step.sec;
                  const isPast = animSecond > step.sec;

                  return (
                    <div
                      key={step.sec}
                      onClick={() => setAnimSecond(step.sec)}
                      className={`p-2.5 rounded border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-porcelain dark:bg-night-elevated border-signal-amber shadow-sm'
                          : isPast
                          ? 'bg-warm-paper/40 dark:bg-night-surface/60 border-line dark:border-line-dark opacity-80'
                          : 'bg-transparent border-line/40 dark:border-line-dark/40 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-ink dark:text-porcelain font-mono">{step.label}</span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-warm-paper dark:bg-night-bg text-stone">
                          {step.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone font-mono mt-0.5 truncate">{step.detail}</div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone">
                <span>Signal → Understand → Verify → Act</span>
                <button
                  onClick={onEnterDesk}
                  className="text-signal-amber hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Launch Live Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="py-20 px-4 sm:px-6 max-w-[1400px] mx-auto border-b border-line dark:border-line-dark">
        <div className="max-w-3xl space-y-4">
          <div className="font-mono text-xs uppercase tracking-wider text-oxide-red font-semibold">
            Operational Reality
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-ink dark:text-porcelain">
            The wallet is rarely the whole story.
          </h2>
          <p className="text-base text-stone dark:text-stone/90 leading-relaxed">
            In modern cyber-financial crime, syndicates immediately splinter stolen funds across unhosted mule accounts, 
            hop across cross-chain bridges into alternative networks, and sweep into institutional exchange deposit clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-xs">
          <div className="p-6 rounded border border-line dark:border-line-dark bg-warm-paper/30 dark:bg-night-surface space-y-2">
            <div className="font-mono font-bold text-stone">01 / VELOCITY</div>
            <div className="text-base font-semibold text-ink dark:text-porcelain">Sub-15 Minute Sweeps</div>
            <p className="text-stone leading-relaxed">
              Mule pass-through addresses consolidate balances within 14 minutes. Manual blockchain searches arrive long after fiat off-ramping.
            </p>
          </div>

          <div className="p-6 rounded border border-line dark:border-line-dark bg-warm-paper/30 dark:bg-night-surface space-y-2">
            <div className="font-mono font-bold text-stone">02 / JURISDICTIONAL HOPS</div>
            <div className="text-base font-semibold text-ink dark:text-porcelain">Cross-Chain Bridges</div>
            <p className="text-stone leading-relaxed">
              Ethereum ETH converted into Tron TRC-20 USDT disrupts conventional single-chain block explorers. NETRA bridges heterogeneous protocols.
            </p>
          </div>

          <div className="p-6 rounded border border-line dark:border-line-dark bg-warm-paper/30 dark:bg-night-surface space-y-2">
            <div className="font-mono font-bold text-stone">03 / ATTRIBUTION AMBIGUITY</div>
            <div className="text-base font-semibold text-ink dark:text-porcelain">Shared Deposit Infrastructure</div>
            <p className="text-stone leading-relaxed">
              Attributing an address to a VASP without understanding internal sweep mechanisms leads to rejected court notices. NETRA outputs explainable evidence.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MULTI-CHAIN COVERAGE */}
      <section className="py-20 px-4 sm:px-6 max-w-[1400px] mx-auto border-b border-line dark:border-line-dark">
        <div className="space-y-3 mb-10">
          <div className="font-mono text-xs uppercase tracking-wider text-verdigris font-semibold">
            Cross-Chain Coverage
          </div>
          <h2 className="text-3xl font-sans font-bold tracking-tight text-ink dark:text-porcelain">
            Multi-Chain Normalization Architecture
          </h2>
          <p className="text-xs text-stone font-mono">
            Provider abstraction normalizes EVM, UTXO, and TRC-20 token events without vendor lock-in.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {chains.map((c, i) => (
            <div key={i} className="p-4 rounded border border-line dark:border-line-dark bg-warm-paper/40 dark:bg-night-surface space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold">{c.symbol}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-verdigris"></span>
              </div>
              <div className="font-semibold text-xs text-ink dark:text-porcelain">{c.name}</div>
              <div className="text-[10px] font-mono text-stone">{c.standard}</div>
              <div className="pt-2 border-t border-line/60 dark:border-line-dark/60 flex items-center justify-between text-[9px] font-mono text-stone">
                <span>{c.status}</span>
                <span>{c.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 max-w-[1400px] mx-auto text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-ink dark:text-porcelain">
            Trace. Connect. Act.
          </h2>
          <p className="text-sm text-stone dark:text-stone/90">
            Turn suspicious blockchain activity into defensible attribution and authorized statutory notices under SAHYOG.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={onEnterDesk}
            className="px-6 py-3 rounded text-sm font-semibold text-porcelain bg-ink hover:bg-graphite dark:bg-porcelain dark:text-ink dark:hover:bg-warm-paper transition-all flex items-center gap-2 group shadow-subtle cursor-pointer"
          >
            <span>ENTER INVESTIGATION DESK</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

    </div>
  );
};
