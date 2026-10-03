import React, { useState } from 'react';
import {
  Shield, Search, Network, Briefcase, FileText, ArrowRight,
  CheckCircle, AlertTriangle, Clock, Building2, Play, Pause,
  RotateCcw, ExternalLink, ChevronDown, Activity, Sparkles,
  Lock, Award, Check, User, Upload, Eye, HelpCircle, Layers,
  Compass, Zap
} from 'lucide-react';
import { api, TrendsData } from '../api';

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

  const activeChapter = TUTORIAL_CHAPTERS[activeChapterIndex];

  // Playback simulation effect
  React.useEffect(() => {
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
      q: 'What is NETRA and who is authorized to use it?',
      a: 'NETRA (National Blockchain Intelligence & Digital Asset De-Anonymization Platform) is a law enforcement-grade forensic investigation portal developed for the Ministry of Home Affairs, Indian Cyber Crime Coordination Centre (I4C), State Cyber Police Cells, and judicial agencies to track, de-anonymize, and attach illicit cryptocurrency capital.'
    },
    {
      q: 'How does NETRA solve the 18-minute money flight problem?',
      a: 'Conventional policing requires days to send physical notices. Syndicates exploit this delay to hop funds across Tron, Ethereum, and offshore bridges within 18 minutes. NETRA automates real-time multi-hop graph de-anonymization and generates pre-validated Section 91 CrPC fast-track freeze orders directly to designated VASP compliance desks via the SAHYOG API in under 2 hours.'
    },
    {
      q: 'Are evidence reports generated by NETRA admissible in Indian courts?',
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
    <div className="bg-[#F8FAFC] min-h-screen text-[#0F172A] selection:bg-amber-100 selection:text-amber-900 pb-16">
      {/* 1. TOP STATUTORY BANNER */}
      <div className="bg-[#071B2F] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-4 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-400">BHARAT CYBER FORENSICS · I4C PROTOCOL</span>
            <span className="text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Statutory Compliance: Section 91 &amp; 102 CrPC · Section 65B IEA</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-2 py-0.5 rounded text-[10px]">
              DEDICATED CLOUD DB ACTIVE
            </span>
            <span className="text-slate-400 text-[10px]">v2.4.0-AUTHORIZED</span>
          </div>
        </div>
      </div>

      {/* 2. HERO PRESENTATION */}
      <section className="bg-gradient-to-b from-[#0A2540] via-[#0F2942] to-[#0A2540] text-white py-16 px-4 border-b border-slate-700 shadow-lg relative overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-400 text-xs font-semibold tracking-wide shadow-sm">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            NATIONAL DIGITAL ASSET INTELLIGENCE &amp; VASP ATTRIBUTION PLATFORM
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Operational Crypto Forensic Engine for Indian Law Enforcement
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
            Dismantling India's ₹2,480+ Cr cyber-financial syndicates. From citizen complaint to court-admissible VASP asset freeze in under <strong className="text-white">2 hours</strong> instead of weeks.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onLaunchPrototype('home')}
              className="px-6 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <Zap className="w-5 h-5 text-slate-950 fill-current" />
              Launch Live Forensic Prototype (LEA Terminal) →
            </button>

            <button
              onClick={onOpenComplaintModal}
              className="px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/25 flex items-center gap-2 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              Register New FIR / Complaint (Cloud DB)
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('walkthrough-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-3.5 rounded-lg text-slate-300 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-sky-400" />
              Watch Video Walkthrough
            </button>
          </div>

          {/* 4 Hero Live Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-8 border-t border-slate-700/60">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3.5 text-left">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Reported Loss (2026)</div>
              <div className="text-2xl font-bold font-mono text-red-400 mt-1">₹2,480 Cr</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Across 84 active syndicates</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3.5 text-left">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Frozen / Intercepted</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">₹612.4 Cr</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Via SAHYOG CrPC 91 API</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3.5 text-left">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Restitution Rate</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">24.7%</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Court-ordered victim returns</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3.5 text-left">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">VASP Freeze SLA</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">1.8 - 4.2h</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Turnaround on Indian VASPs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM: WHY TRADITIONAL POLICING FAILS */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-red-600 mb-1">
            THE ANATOMY OF CRYPTO MONEY FLIGHT
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            3 Critical Bottlenecks Paralyzing Cybercrime Investigations
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Syndicates exploit legal fragmentation and on-chain velocity. By the time an FIR is recorded, stolen funds have crossed 3 state jurisdictions and been converted into offshore Tether.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-red-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-mono font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">The 18-Minute Money Flight</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mule coordinators execute automated fan-out sweeps through TRC-20 and EVM smart contracts. Funds pass through 4 to 6 mule hops before exiting into offshore P2P liquidity pools in under 18 minutes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-mono font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Jurisdictional Black Holes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Police officers cannot serve physical Section 91 notices to international exchanges like Binance or Bybit. Delayed mutual legal assistance treaties (MLAT) give syndicates ample time to liquidate assets.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-gov-blue/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-blue flex items-center justify-center font-mono font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Evidentiary Inadmissibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Block explorers display raw cryptographic hexes that trial magistrates reject. Without Section 65B certified audit trails and deterministic state links, asset restitution orders are routinely delayed or dismissed.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OUR SOLUTION: THE 4-PILLAR FORENSIC PIPELINE */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1">
              THE NETRA ARCHITECTURE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The 4-Pillar Forensic Pipeline: From Complaint to Court Restitution
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              NETRA systematically de-anonymizes suspect wallets, identifies the destination exchange cluster, triggers an immediate statutory freeze, and generates court-certified evidence dossiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-gov-blue mb-2">PILLAR 01</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Graph De-Anonymization</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recursive BFS &amp; DFS graph clustering across Ethereum, Tron, and Bitcoin. Identifies pass-through mules, consolidators, and bridge exit routers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-2xs font-semibold text-gov-blue">
                Live in Investigate Module →
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-gov-blue mb-2">PILLAR 02</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">VASP Attribution Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Heuristic de-mixing matches unhosted suspect wallets against FIU-IND registered hot and cold exchange infrastructure with 94%+ confidence scores.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-2xs font-semibold text-gov-blue">
                VASP Directory Integrated →
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-gov-blue mb-2">PILLAR 03</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">SAHYOG Freeze Gateway</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates machine-readable CrPC Section 91 &amp; 102 statutory directives delivered directly to exchange compliance desks, reducing freeze turnaround to 1.8h.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-2xs font-semibold text-gov-blue">
                Fast-Track Directives Active →
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold font-mono text-gov-blue mb-2">PILLAR 04</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Section 65B Restitution</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Produces tamper-evident SHA-256 certified court dockets with judicial release certificates, restoring seized funds back to victim bank accounts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-2xs font-semibold text-gov-blue">
                Evidence Vault Certified →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE VIDEO TUTORIAL & PLATFORM SIMULATOR */}
      <section id="walkthrough-section" className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1">
            STEP-BY-STEP OPERATION MANUAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Interactive Platform Walkthrough &amp; Navigation Demo
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Watch how an Investigating Officer takes a fresh FIR from the Citizen Registry, tracks the money trail through 3 hops, and triggers an emergency exchange freeze.
          </p>
        </div>

        {/* The Video Simulator Card */}
        <div className="bg-slate-950 text-white rounded-xl overflow-hidden shadow-2xl border border-slate-800">
          {/* Top Video Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200">
                OFFICIAL WORKFLOW DEMO · CHAPTER {activeChapter.id} OF 7
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {activeChapter.timeCode}
              </span>
              <button
                onClick={() => onLaunchPrototype(activeChapter.tabId)}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-gov-blue text-white hover:bg-gov-blue-dark flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>Jump to Live {activeChapter.tabLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-950 min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="inline-block font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-700/40 px-2.5 py-1 rounded mb-3">
                {activeChapter.tabLabel.toUpperCase()}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {activeChapter.title}
              </h3>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                {activeChapter.subtitle}
              </p>
            </div>

            {/* Narration Subtitle Box */}
            <div className="mt-8 p-4 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs sm:text-sm text-emerald-300 font-mono flex items-start gap-3">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-white mr-1.5">[NARRATION]:</span>
                {activeChapter.narration}
              </div>
            </div>
          </div>

          {/* Scrubber & Controls Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
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
                className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Restart from Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed toggle */}
              <div className="flex items-center gap-1 bg-slate-800 rounded p-0.5 text-2xs font-mono">
                {[1, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded ${playbackSpeed === speed ? 'bg-gov-blue text-white font-bold' : 'text-slate-400'}`}
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
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Step {ch.id}: {ch.tabLabel.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROTOTYPE LAUNCHER: THE 8 OPERATIONAL MODULES */}
      <section className="bg-slate-900 text-white py-14 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 mb-1">
                OPERATIONAL PROTOTYPE SHOWCASE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Explore All 8 Law Enforcement Investigation Modules
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Every module is fully functional with live blockchain graphs, Section 91 notice generators, and verified test dockets.
              </p>
            </div>
            <button
              onClick={() => onLaunchPrototype('home')}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-md"
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
                className="bg-slate-800/80 border border-slate-700 rounded-lg p-5 hover:border-slate-500 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {mod.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/60 text-2xs font-semibold text-emerald-400">
                  {mod.btn} →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-gov-blue mb-1">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Legal, Technical &amp; Operational Inquiries
          </h2>
        </div>

        <div className="space-y-3">
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

      {/* 8. BOTTOM CALL-TO-ACTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-gov-blue-dark via-gov-blue to-slate-900 text-white rounded-xl p-8 sm:p-10 text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Ready to Test the Operational Investigation Terminal?
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
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
