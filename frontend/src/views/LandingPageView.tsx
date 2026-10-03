import React, { useState, useEffect } from 'react';
import {
  Shield, Search, Network, Briefcase, FileText, ArrowRight,
  CheckCircle, AlertTriangle, Clock, Building2, Play, Pause,
  RotateCcw, ExternalLink, ChevronDown, Activity, Sparkles,
  Lock, Award, Check, User, Upload, Eye, HelpCircle, Layers,
  Compass, Zap, TrendingUp, ChevronRight, Hash, Database,
  Cpu, Scale, AlertOctagon, ArrowUpRight, CheckCircle2
} from 'lucide-react';

interface LandingPageViewProps {
  onLaunchPrototype: (targetTab?: string) => void;
  onOpenComplaintModal: () => void;
}

interface VideoChapter {
  id: number;
  tabId: string;
  tabLabel: string;
  title: string;
  timeCode: string;
  durationSec: number;
  subtitle: string;
  narration: string;
}

const TUTORIAL_CHAPTERS: VideoChapter[] = [
  {
    id: 1,
    tabId: 'home',
    tabLabel: '01 Dashboard',
    title: 'Dashboard: Live Rates & FIR Queue',
    timeCode: '00:00 - 00:10',
    durationSec: 10,
    subtitle: 'Reviewing active dockets, live crypto valuations, and pending CrPC directives',
    narration: 'Step 1: Start at the Dashboard. Track live FIU-IND cryptocurrency valuations and monitor the active FIR investigation queue. Select any case docket or target wallet to begin tracing.'
  },
  {
    id: 2,
    tabId: 'investigate',
    tabLabel: '02 Investigate',
    title: 'Investigate: Multi-Hop Wallet Tracing',
    timeCode: '00:10 - 00:20',
    durationSec: 10,
    subtitle: 'De-anonymizing suspect wallets, transaction ledgers, and illicit volumes',
    narration: 'Step 2: The Investigate workspace automatically loads the target wallet. It calculates total incoming volume, transaction velocity, risk scores, and reveals the layering path across hops.'
  },
  {
    id: 3,
    tabId: 'network',
    tabLabel: '03 Network Map',
    title: 'Network Map: Visualizing the Money Trail',
    timeCode: '00:20 - 00:30',
    durationSec: 10,
    subtitle: 'Forensic blueprint canvas with velocity intervals and interactive scrubber',
    narration: 'Step 3: Move to the Network Map to see the full syndicate structure. Step through each transaction hop using the Money Trail scrubber and inspect on-chain transfer exhibits.'
  },
  {
    id: 4,
    tabId: 'cases',
    tabLabel: '04 FIR Dockets',
    title: 'FIR Dockets: National Case Repository',
    timeCode: '00:30 - 00:40',
    durationSec: 10,
    subtitle: 'Comparing ongoing investigations against resolved precedents and court dockets',
    narration: 'Step 4: The FIR Dockets view manages active FIRs and cross-references them against previous precedents. New citizen complaints can be registered directly into the shared cloud repository.'
  },
  {
    id: 5,
    tabId: 'evidence',
    tabLabel: '05 Evidence Vault',
    title: 'Evidence: Section 65B Audit Trail',
    timeCode: '00:40 - 00:50',
    durationSec: 10,
    subtitle: 'Cryptographic SHA-256 verification and court-admissible dossiers',
    narration: 'Step 5: Inspect cryptographic evidence. Every blockchain transaction is cataloged with SHA-256 integrity hashes, formatted for Section 65B court admissibility.'
  },
  {
    id: 6,
    tabId: 'sahyog',
    tabLabel: '06 SAHYOG Gateway',
    title: 'SAHYOG: Automated Exchange Freezing',
    timeCode: '00:50 - 01:00',
    durationSec: 10,
    subtitle: 'Issuing statutory CrPC 91 notices directly to domestic & global VASPs',
    narration: 'Step 6: Execute statutory freeze notices directly to FIU-registered exchanges like Binance, CoinDCX, and WazirX via the official SAHYOG gateway with 1.8 hour response turnaround.'
  },
  {
    id: 7,
    tabId: 'audit',
    tabLabel: '07 Restitution & Audit',
    title: 'Restitution: Victim Asset Restoration',
    timeCode: '01:00 - 01:10',
    durationSec: 10,
    subtitle: 'Tracking court-ordered judicial releases and immutable investigator logs',
    narration: 'Step 7: Once funds are attached, track court-ordered asset releases back to victim bank accounts while an immutable audit log records every forensic action.'
  }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onLaunchPrototype,
  onOpenComplaintModal
}) => {
  // Video Player Simulator State
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progressSec, setProgressSec] = useState(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Live Trace Step
  const [activeTraceStep, setActiveTraceStep] = useState(3);

  const activeChapter = TUTORIAL_CHAPTERS[activeChapterIndex];

  // Playback simulation effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec(prev => {
          if (prev >= 70) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1 * playbackSpeed;
          const chapterIdx = Math.min(Math.floor(next / 10), TUTORIAL_CHAPTERS.length - 1);
          setActiveChapterIndex(chapterIdx);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    setProgressSec(index * 10);
    setIsPlaying(true);
  };

  const FAQS = [
    {
      q: 'What is NETRA and who is authorized to operate the platform?',
      a: 'NETRA (National Blockchain Intelligence & Digital Asset De-Anonymization Platform) is a specialized sovereign forensic investigation portal deployed under the Ministry of Home Affairs and the Indian Cyber Crime Coordination Centre (I4C). It is authorized for use by State Cyber Police Cells, Central Law Enforcement Agencies (CBI, ED, NIA), and judicial magistrates handling financial cyber offenses.'
    },
    {
      q: 'How does NETRA solve the critical 18-minute money flight problem?',
      a: 'Traditional manual policing relies on physical notices delivered over days, allowing criminal syndicates to sweep stolen funds across 5 mule hops into offshore Tether (USDT) within 18 minutes. NETRA automates real-time multi-hop graph clustering and dispatches cryptographically verified statutory directives under Section 91 CrPC directly into registered VASP compliance queues via the SAHYOG API, reducing asset freeze turnaround to 1.8 hours.'
    },
    {
      q: 'Are evidence dossiers generated by NETRA admissible in Indian courts?',
      a: 'Yes. NETRA generates deterministic Section 65B Indian Evidence Act (and Bharatiya Sakshya Adhiniyam) compliant dossiers. Every on-chain transaction exhibit is stamped with an immutable SHA-256 cryptographic hash, block header timestamp, and node receipt, preventing evidentiary challenges in magistrate trials.'
    },
    {
      q: 'How does the Dedicated Cloud Database work across multiple laptops?',
      a: 'NETRA features a persistent multi-terminal cloud repository. Any FIR docket or citizen complaint registered on one terminal is instantly synchronized to the cloud database. Investigating officers across different states can deconflict overlapping syndicate wallets in real time.'
    },
    {
      q: 'Which blockchain networks and VASPs are currently supported?',
      a: 'NETRA supports Ethereum (ERC-20/EVM), Tron (TRC-20 USDT), Bitcoin (BTC), BNB Smart Chain, and Polygon. It features pre-configured API attribution connectors for domestic and offshore VASPs including CoinDCX, WazirX, Binance Global, OKX, Bybit, Mudrex, and ZebPay.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] selection:bg-blue-100 selection:text-blue-900 pb-20 font-sans">
      {/* 1. TOP STATUTORY METADATA HEADER (CLEAN LIGHT THEME) */}
      <div className="bg-slate-50 border-b border-slate-200 text-[11px] py-1.5 px-4 font-mono text-slate-600">
        <div className="gov-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800 tracking-wider">भारत सरकार · GOVERNMENT OF INDIA</span>
            <span className="text-slate-400">|</span>
            <span className="hidden md:inline text-slate-600 font-sans">Ministry of Home Affairs · Indian Cyber Crime Coordination Centre (I4C)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CLOUD DATABASE ACTIVE
            </span>
            <span className="text-slate-500 text-[10px]">SECURE KERNEL v2.4.0</span>
          </div>
        </div>
      </div>

      {/* 2. HERO PRESENTATION (LIGHT, CRISP, EDITORIAL ASYMMETRIC 2-COLUMN) */}
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="gov-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 Columns: Editorial Presentation */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-gov-blue text-xs font-semibold tracking-wide">
                <Shield className="w-3.5 h-3.5 text-gov-blue" />
                OFFICIAL I4C / MHA CRYPTO FORENSICS PLATFORM
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                De-Anonymizing India's ₹2,480 Cr Crypto Financial Crime Syndicates.
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Bridging the critical 18-minute criminal laundering window. Transforming on-chain ledger anomalies into defensible Section 91 CrPC freeze orders and Section 65B court-admissible conviction evidence.
              </p>

              {/* 3 Core Value Cards in Light Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-amber-700 font-bold font-mono text-xs mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" /> 1.8-Hour Freeze SLA
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    Statutory automated directives to Binance, CoinDCX &amp; WazirX.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-gov-blue font-bold font-mono text-xs mb-1 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-gov-blue" /> Multi-Hop Tracing
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    Clustering pass-through mules across Tron, Ethereum &amp; Bitcoin.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-emerald-700 font-bold font-mono text-xs mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" /> Section 65B Dossiers
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    SHA-256 certified exhibits admissible before trial courts.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onLaunchPrototype('home')}
                  className="px-6 py-3.5 rounded-lg bg-gov-blue hover:bg-gov-blue-dark text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <Cpu className="w-4 h-4 text-white" />
                  Launch Live Forensic Prototype (LEA Terminal) →
                </button>

                <button
                  onClick={onOpenComplaintModal}
                  className="px-5 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 flex items-center gap-2 transition-all shadow-xs"
                >
                  <FileText className="w-4 h-4 text-gov-blue" />
                  Register FIR / Complaint (Cloud DB)
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('walkthrough-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-3.5 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-gov-blue" />
                  View Video Demo
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Light Intelligence Dossier Card */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Live Forensic Interception Exhibit
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-gov-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                    FIR 412/2026 · PUNE PS
                  </span>
                </div>

                {/* Case Synopsis Summary */}
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                  <div className="flex justify-between text-2xs text-slate-500 mb-1">
                    <span>Incident: <strong className="text-slate-800">Investment Fraud Syndicate</strong></span>
                    <span className="font-mono text-red-600 font-bold">Loss: ₹42,80,000</span>
                  </div>
                  <div className="text-[11px] text-slate-700 leading-snug">
                    Victim capital swept across 3 pass-through mule hops into Binance institutional deposit clusters.
                  </div>
                </div>

                {/* Multi-Hop Trail in Clean Light Mode */}
                <div className="space-y-2">
                  <div className="text-2xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                    On-Chain Interception Path:
                  </div>

                  <div className="space-y-1.5">
                    {[
                      {
                        hop: 'Hop 0',
                        address: '0x4838b1...5f97',
                        label: 'S. K. Verma (Victim)',
                        amount: '₹42.8 Lakh (ETH)',
                        status: 'DRAINED',
                        time: 'T+00 min'
                      },
                      {
                        hop: 'Hop 1',
                        address: '0x7a912e...12fe',
                        label: 'Primary Mule Alpha',
                        amount: 'Sweep 18.2 ETH',
                        status: 'PASSED',
                        time: 'T+14 min'
                      },
                      {
                        hop: 'Hop 2',
                        address: 'contract-stargate',
                        label: 'Stargate Finance Bridge',
                        amount: 'USDT 48,200',
                        status: 'CONVERTED',
                        time: 'T+28 min'
                      },
                      {
                        hop: 'Hop 3',
                        address: 'vasp-binance-hot6',
                        label: 'Binance Hot Wallet 6',
                        amount: 'USDT 48,200 (₹40.2L)',
                        status: 'ATTACHED',
                        time: 'T+1h 48m'
                      }
                    ].map((step, idx) => (
                      <div
                        key={step.address}
                        onClick={() => setActiveTraceStep(idx)}
                        className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between text-xs ${
                          activeTraceStep === idx
                            ? 'bg-blue-50/70 border-gov-blue shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                            idx === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {idx}
                          </span>
                          <div className="truncate">
                            <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{step.label}</span>
                              <span className="font-mono text-[10px] text-slate-500">({step.address})</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {step.amount} · Velocity: {step.time}
                            </div>
                          </div>
                        </div>

                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          step.status === 'ATTACHED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Interception Verdict */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Statutory Order</span>
                    <span className="font-bold text-emerald-700 font-mono">CRPC 91 NOTICE #REQ-SH-0941</span>
                  </div>
                  <button
                    onClick={() => onLaunchPrototype('investigate')}
                    className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1"
                  >
                    <span>Inspect in Prototype</span>
                    <ArrowRight className="w-3 h-3 text-gov-blue" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NATIONAL METRICS STRIP (LIGHT CARDS) */}
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="gov-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reported National Loss (2026)</div>
              <div className="text-2xl font-black text-red-600 font-mono mt-1">₹2,480 Cr</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Across 84 active syndicates</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Frozen / Attached Capital</div>
              <div className="text-2xl font-black text-gov-blue font-mono mt-1">₹612.4 Cr</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Via SAHYOG CrPC 91 Directives</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Judicial Restitution Rate</div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">24.7%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Court-ordered victim restoration</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average VASP Freeze SLA</div>
              <div className="text-2xl font-black text-amber-700 font-mono mt-1">1.8 - 4.2 hrs</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Turnaround on Indian Exchanges</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM: 3 SYSTEMIC CHOKEPOINTS */}
      <section className="gov-container py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-red-600 mb-1.5">
            THE ANATOMY OF CRYPTO MONEY FLIGHT
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            3 Critical Bottlenecks Paralyzing Traditional Policing
          </h2>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
            Syndicates exploit legal delays and blockchain speed. By the time an FIR is recorded at a local police station, stolen funds have crossed 3 state jurisdictions and exited into offshore Tether.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 font-mono font-bold flex items-center justify-center text-sm mb-4 border border-red-200">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">The 18-Minute Money Flight</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mule coordinators execute automated fan-out sweeps through TRC-20 and EVM smart contracts. Stolen capital passes through 4 to 6 mule hops before exiting into offshore P2P liquidity pools in under 18 minutes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono font-semibold text-red-600">
              Avg. police delay: 5 to 7 days
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 font-mono font-bold flex items-center justify-center text-sm mb-4 border border-amber-200">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Jurisdictional Black Holes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Police officers cannot serve physical Section 91 notices to international exchanges like Binance or Bybit. Delayed mutual legal assistance treaties (MLAT) give syndicates ample time to liquidate assets.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono font-semibold text-amber-700">
              International MLAT: 6 to 18 months
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-blue font-mono font-bold flex items-center justify-center text-sm mb-4 border border-blue-200">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Courtroom Evidentiary Void</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Block explorers display raw cryptographic hexes that trial magistrates reject. Without Section 65B certified audit trails and deterministic state links, asset restitution orders are routinely delayed or dismissed.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono font-semibold text-gov-blue">
              Magistrate rejection rate: 64%
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE SOLUTION: 4-PILLAR FORENSIC PIPELINE */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="gov-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1.5">
              THE SOVEREIGN SOLUTION
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The 4-Pillar Forensic Pipeline: Citizen FIR to Court Restitution
            </h2>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              NETRA systematically de-anonymizes suspect wallets, identifies the destination exchange cluster, triggers an immediate statutory freeze, and generates court-certified evidence dossiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-gov-blue transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-gov-blue">PILLAR 01</span>
                  <Network className="w-4 h-4 text-gov-blue" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Graph De-Anonymization</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recursive BFS &amp; DFS graph clustering across Ethereum, Tron, and Bitcoin. Identifies pass-through mules, consolidators, and bridge exit routers.
                </p>
              </div>
              <button
                onClick={() => onLaunchPrototype('investigate')}
                className="mt-4 pt-3 border-t border-slate-100 text-left text-2xs font-semibold text-gov-blue hover:underline flex items-center gap-1"
              >
                <span>Live in Investigate Module</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-gov-blue transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-gov-blue">PILLAR 02</span>
                  <Building2 className="w-4 h-4 text-gov-blue" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">VASP Attribution Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Heuristic de-mixing matches unhosted suspect wallets against FIU-IND registered hot and cold exchange infrastructure with 94%+ confidence scores.
                </p>
              </div>
              <button
                onClick={() => onLaunchPrototype('sahyog')}
                className="mt-4 pt-3 border-t border-slate-100 text-left text-2xs font-semibold text-gov-blue hover:underline flex items-center gap-1"
              >
                <span>VASP Directory Integrated</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-gov-blue transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-gov-blue">PILLAR 03</span>
                  <Shield className="w-4 h-4 text-gov-blue" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">SAHYOG Freeze Gateway</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates machine-readable CrPC Section 91 &amp; 102 statutory directives delivered directly to exchange compliance desks, reducing freeze turnaround to 1.8h.
                </p>
              </div>
              <button
                onClick={() => onLaunchPrototype('sahyog')}
                className="mt-4 pt-3 border-t border-slate-100 text-left text-2xs font-semibold text-gov-blue hover:underline flex items-center gap-1"
              >
                <span>Fast-Track Directives Active</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-gov-blue transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-gov-blue">PILLAR 04</span>
                  <FileText className="w-4 h-4 text-gov-blue" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Section 65B Restitution</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Produces tamper-evident SHA-256 certified court dockets with judicial release certificates, restoring seized funds back to victim bank accounts.
                </p>
              </div>
              <button
                onClick={() => onLaunchPrototype('evidence')}
                className="mt-4 pt-3 border-t border-slate-100 text-left text-2xs font-semibold text-gov-blue hover:underline flex items-center gap-1"
              >
                <span>Evidence Vault Certified</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE VIDEO WALKTHROUGH SIMULATOR (LIGHT CONSOLE STYLE) */}
      <section id="walkthrough-section" className="gov-container py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1.5">
            STEP-BY-STEP OPERATION MANUAL
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Interactive Platform Walkthrough &amp; Navigation Demo
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Watch how an Investigating Officer takes a fresh FIR from the Citizen Registry, tracks the money trail through 3 hops, and triggers an emergency exchange freeze.
          </p>
        </div>

        {/* Light Console Styled Video Card */}
        <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-800">
                OFFICIAL WORKFLOW DEMO · CHAPTER {activeChapter.id} OF 7
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gov-blue bg-white px-2 py-0.5 rounded border border-slate-300 font-bold">
                {activeChapter.timeCode}
              </span>
              <button
                onClick={() => onLaunchPrototype(activeChapter.tabId)}
                className="btn-primary text-xs flex items-center gap-1 py-1"
              >
                <span>Jump to Live {activeChapter.tabLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Screen Content */}
          <div className="p-8 bg-slate-50 min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="inline-block font-mono text-xs font-bold text-gov-blue bg-blue-50 border border-blue-200 px-2.5 py-1 rounded mb-3">
                {activeChapter.tabLabel.toUpperCase()}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {activeChapter.title}
              </h3>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                {activeChapter.subtitle}
              </p>
            </div>

            {/* Narration box in light mode */}
            <div className="mt-8 p-4 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-mono flex items-start gap-3 shadow-xs">
              <Compass className="w-5 h-5 text-gov-blue shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-gov-blue mr-1.5">[NARRATION]:</span>
                {activeChapter.narration}
              </div>
            </div>
          </div>

          {/* Controls Bar in Light Mode */}
          <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-full bg-gov-blue hover:bg-gov-blue-dark text-white font-bold transition-all shadow-xs"
                title={isPlaying ? 'Pause Demo' : 'Play Demo'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setProgressSec(0);
                  setActiveChapterIndex(0);
                  setIsPlaying(false);
                }}
                className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="Restart from Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5 text-2xs font-mono">
                {[1, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded ${playbackSpeed === speed ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter Jump Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {TUTORIAL_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`px-2.5 py-1.5 rounded text-2xs font-mono whitespace-nowrap transition-all ${
                    activeChapterIndex === idx
                      ? 'bg-gov-blue text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Step {ch.id}: {ch.tabLabel.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROTOTYPE LAUNCHER: THE 8 OPERATIONAL MODULES (LIGHT CARDS) */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-16">
        <div className="gov-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1">
                OPERATIONAL PROTOTYPE SHOWCASE
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore All 8 Law Enforcement Investigation Modules
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Every module is live with verified on-chain datasets, Section 91 notice generators, and shared cloud database sync.
              </p>
            </div>
            <button
              onClick={() => onLaunchPrototype('home')}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              Enter Master Dashboard →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'home',
                title: '01. Operations Dashboard',
                desc: 'Real-time crypto loss tickers, active FIR queue, and FIU-IND live valuation feeds.',
                badge: 'Live Data',
                btn: 'Open Dashboard'
              },
              {
                id: 'investigate',
                title: '02. Multi-Hop Graph Tracing',
                desc: 'Trace stolen tokens across 6 hops. De-anonymize mule wallets with risk scoring.',
                badge: 'Interactive Canvas',
                btn: 'Investigate Wallet'
              },
              {
                id: 'network',
                title: '03. Cross-State Network Map',
                desc: 'Indian state-wise crime radar. Trace inter-state syndicates across MH, KA, DL, and TS.',
                badge: 'Geographic Map',
                btn: 'View Network Map'
              },
              {
                id: 'cases',
                title: '04. FIR Dockets & Cloud Registry',
                desc: 'Searchable case vault and live complaint registry synchronized across terminals.',
                badge: 'Cloud DB Synced',
                btn: 'View FIR Dockets'
              },
              {
                id: 'trends',
                title: '05. Threat Radar & Trends',
                desc: 'Interactive 2026 charts: reported loss, modus operandi, and VASP freeze SLA metrics.',
                badge: 'New Visualization',
                btn: 'Open Threat Radar'
              },
              {
                id: 'evidence',
                title: '06. Section 65B Evidence Vault',
                desc: 'Cryptographic SHA-256 exhibits formatted for judicial court admissibility.',
                badge: 'Court Certified',
                btn: 'Inspect Evidence'
              },
              {
                id: 'sahyog',
                title: '07. SAHYOG VASP Freeze Bridge',
                desc: 'Dispatch CrPC 91 freeze directives directly to Binance, CoinDCX, and WazirX desks.',
                badge: '1.8h Turnaround',
                btn: 'Access SAHYOG'
              },
              {
                id: 'audit',
                title: '08. Immutable Audit Trail',
                desc: 'Tamper-evident chronological logs of every investigator query and freeze order.',
                badge: 'Zero Knowledge Log',
                btn: 'Audit Records'
              }
            ].map(mod => (
              <div
                key={mod.id}
                onClick={() => onLaunchPrototype(mod.id)}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:border-gov-blue transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {mod.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-gov-blue group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-gov-blue transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-2xs font-semibold text-gov-blue">
                  {mod.btn} →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION (LIGHT WHITE ACCORDION) */}
      <section className="gov-container py-16">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1.5">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Legal, Technical &amp; Operational Inquiries
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-gov-blue' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CALL-TO-ACTION (ELEGANT LIGHT/NAVY ACCENT) */}
      <section className="gov-container">
        <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-10 text-center shadow-lg border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-emerald-400 font-mono text-2xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PRODUCTION READY FOR STATE CYBER CRIME CELLS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Ready to Test the Operational Investigation Terminal?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
            Experience multi-hop wallet de-anonymization, statutory VASP freezing, and Section 65B certified court report generation in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onLaunchPrototype('home')}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              Launch Live Prototype (Dashboard) →
            </button>
            <button
              onClick={onOpenComplaintModal}
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 transition-all"
            >
              Register FIR / Complaint (Cloud DB)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
