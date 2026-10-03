import React, { useState, useRef } from 'react';
import {
  Shield, Search, Network, Briefcase, FileText, ArrowRight,
  CheckCircle, AlertTriangle, Clock, Building2, Play, Pause,
  RotateCcw, ExternalLink, ChevronDown, Activity, Sparkles,
  Lock, Award, Check, User, Upload, Eye, HelpCircle, Layers,
  Compass, Zap, TrendingUp, ChevronRight, Hash, Database,
  Cpu, Scale, AlertOctagon, ArrowUpRight, CheckCircle2,
  Volume2, Maximize2, Share2, CornerDownRight, ArrowDown
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
  timeSec: number;
  timeLabel: string;
  subtitle: string;
  narration: string;
}

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 1,
    tabId: 'home',
    tabLabel: '01 Dashboard',
    title: 'Dashboard: Live Rates & FIR Queue',
    timeSec: 0,
    timeLabel: '00:00',
    subtitle: 'Reviewing active dockets, live crypto valuations, and pending CrPC directives',
    narration: 'Track live FIU-IND cryptocurrency valuations and monitor the active FIR investigation queue across multiple state police units.'
  },
  {
    id: 2,
    tabId: 'investigate',
    tabLabel: '02 Investigate',
    title: 'Investigate: Multi-Hop Wallet Tracing',
    timeSec: 25,
    timeLabel: '00:25',
    subtitle: 'De-anonymizing suspect wallets, transaction ledgers, and illicit volumes',
    narration: 'The Investigate workspace automatically maps the target wallet, calculating transaction velocity, risk scores, and layering paths across 5 hops.'
  },
  {
    id: 3,
    tabId: 'network',
    tabLabel: '03 Network Map',
    title: 'Network Map: Visualizing the Money Trail',
    timeSec: 55,
    timeLabel: '00:55',
    subtitle: 'Forensic blueprint canvas with velocity intervals and interactive scrubber',
    narration: 'Explore the full inter-state syndicate structure. Step through each transaction hop using the Money Trail scrubber and inspect on-chain transfer exhibits.'
  },
  {
    id: 4,
    tabId: 'cases',
    tabLabel: '04 FIR Dockets',
    title: 'FIR Dockets: National Case Repository',
    timeSec: 80,
    timeLabel: '01:20',
    subtitle: 'Comparing ongoing investigations against resolved precedents and court dockets',
    narration: 'Manage active FIRs and cross-reference against previous precedents. Register citizen complaints with live file uploads into the shared cloud database.'
  },
  {
    id: 5,
    tabId: 'evidence',
    tabLabel: '05 Evidence Vault',
    title: 'Evidence: Section 65B Audit Trail',
    timeSec: 110,
    timeLabel: '01:50',
    subtitle: 'Cryptographic SHA-256 verification and court-admissible dossiers',
    narration: 'Inspect cryptographic evidence exhibits stamped with SHA-256 integrity hashes, formatted for Section 65B court admissibility.'
  },
  {
    id: 6,
    tabId: 'sahyog',
    tabLabel: '06 SAHYOG Gateway',
    title: 'SAHYOG: Automated Exchange Freezing',
    timeSec: 135,
    timeLabel: '02:15',
    subtitle: 'Issuing statutory CrPC 91 notices directly to domestic & global VASPs',
    narration: 'Execute statutory freeze notices directly to FIU-registered exchanges like Binance, CoinDCX, and WazirX via the official SAHYOG gateway.'
  },
  {
    id: 7,
    tabId: 'audit',
    tabLabel: '07 Restitution & Audit',
    title: 'Restitution: Victim Asset Restoration',
    timeSec: 160,
    timeLabel: '02:40',
    subtitle: 'Tracking court-ordered judicial releases and immutable investigator logs',
    narration: 'Track court-ordered asset releases back to victim bank accounts while an immutable audit log chronologically seals every investigative query.'
  }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onLaunchPrototype,
  onOpenComplaintModal
}) => {
  // Video Player Ref & State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  // Active Layer in 5-Layer Forensic Architecture
  const [activeLayer, setActiveLayer] = useState<number>(1);

  // Interactive Live Trace Step
  const [activeTraceStep, setActiveTraceStep] = useState(3);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeChapter = VIDEO_CHAPTERS[activeChapterIndex];

  const handleSeekChapter = (chapter: VideoChapter, index: number) => {
    setActiveChapterIndex(index);
    if (videoRef.current) {
      videoRef.current.currentTime = chapter.timeSec;
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setVideoCurrentTime(current);
      // Auto highlight active chapter based on time
      for (let i = VIDEO_CHAPTERS.length - 1; i >= 0; i--) {
        if (current >= VIDEO_CHAPTERS[i].timeSec) {
          setActiveChapterIndex(i);
          break;
        }
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // 5-Layer Forensic Model Data
  const LAYERS = [
    {
      num: 1,
      title: 'Layer 1: Placement & Initial Ingestion',
      subtitle: 'Victim Extortion to First Mule Crypto Hop',
      crimeModus: 'Victim is coerced via WhatsApp/Telegram fake investment or "Digital Arrest" into liquidating bank deposits via IMPS/UPI into mule accounts, immediately swapped for USDT or ETH.',
      netraDefense: 'Automated NCRP 1930 token ingestion. Real-time extraction of victim sender wallet and transaction hash into active docket within 90 seconds.',
      velocity: 'T+0 to T+15 minutes',
      chokepoint: 'First unhosted wallet de-anonymization',
      badge: 'Placement Intercept'
    },
    {
      num: 2,
      title: 'Layer 2: Rapid Mule Layering & Splitting',
      subtitle: 'Automated Fan-Out across Unhosted Accounts',
      crimeModus: 'Syndicate algorithms sweep funds through 4 to 6 pass-through mule wallets in under 14 minutes, splitting amounts into sub-lakh fragments to evade banking surveillance.',
      netraDefense: 'Recursive BFS/DFS graph clustering. Calculates velocity intervals, fan-in/fan-out ratios, and tags intermediate nodes as "High-Risk Pass-Through Mules".',
      velocity: 'T+15 to T+35 minutes',
      chokepoint: 'Velocity anomaly detection',
      badge: 'Layering De-anonymized'
    },
    {
      num: 3,
      title: 'Layer 3: Cross-Chain Liquidity Bridging',
      subtitle: 'EVM to Tron TRC-20 Obfuscation',
      crimeModus: 'Funds cross decentralized liquidity bridges (Stargate, Router Protocol) to switch chains from Ethereum (ERC-20) to Tron (TRC-20 USDT) for sub-dollar network fee liquidation.',
      netraDefense: 'Cross-chain bridge router fingerprinting. Tracks bridge deposit contracts and matches egress transaction hashes on destination chains.',
      velocity: 'T+35 to T+60 minutes',
      chokepoint: 'Bridge contract fingerprinting',
      badge: 'Bridge Tracking'
    },
    {
      num: 4,
      title: 'Layer 4: Institutional VASP Integration & Cashing',
      subtitle: 'Deposit Sweeps into Exchange Infrastructure',
      crimeModus: 'Mule consolidation accounts sweep tokens into domestic or offshore centralized exchanges (Binance, CoinDCX, Bybit) for OTC/P2P conversion into fiat currency.',
      netraDefense: 'Heuristic VASP attribution engine. Matches deposit addresses against FIU-IND registered institutional clusters with 94%+ confidence scores.',
      velocity: 'T+1 hour to T+2 hours',
      chokepoint: 'Direct VASP deposit cluster identification',
      badge: 'VASP Attributed'
    },
    {
      num: 5,
      title: 'Layer 5: Statutory Enforcement & Victim Restitution',
      subtitle: 'Legal Attachment & Court Restoration',
      crimeModus: 'Syndicate kingpins attempt offshore OTC withdrawal before law enforcement serves physical paper notices.',
      netraDefense: 'Machine-readable Section 91 & 102 CrPC freeze directives dispatched via SAHYOG API directly to exchange nodal officers. Section 65B court evidence generated for restitution.',
      velocity: 'Resolved under 2 hours',
      chokepoint: 'Instant judicial attachment',
      badge: '100% Capital Secured'
    }
  ];

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
      {/* 1. TOP STATUTORY METADATA HEADER */}
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
            {/* Left 7 Columns: Editorial Headline, Authority & Actions */}
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
                  Watch Demo Video
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

      {/* 3. REAL EMBEDDED DEMO VIDEO SHOWCASE WITH CHAPTER NAVIGATOR */}
      <section id="walkthrough-section" className="gov-container py-14">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
            RECORDED PLATFORM DEMO · 3-MINUTE COMPLETE WALKTHROUGH
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Watch the Live NETRA Prototype in Action
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            See the full operational workflow: from real-time transaction ingestion and multi-hop graph clustering to issuing an emergency VASP freeze under Section 91 CrPC.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
          {/* Top Video Terminal Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200">
                OFFICIAL RECORDING: NETRA FORENSIC TERMINAL
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                1080p HD
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span>Chapter {activeChapter.id}/7:</span>
              <strong className="text-amber-400">{activeChapter.title}</strong>
            </div>
          </div>

          {/* Real Embedded HTML5 Video Element */}
          <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
            <video
              ref={videoRef}
              src="/demo-walkthrough.mp4"
              controls
              playsInline
              onTimeUpdate={handleVideoTimeUpdate}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Interactive Chapter Quick Jumper Below Video */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gov-blue" />
                Click Any Chapter to Seek in Video &amp; Test Live:
              </div>
              <button
                onClick={() => onLaunchPrototype(activeChapter.tabId)}
                className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1"
              >
                <span>Launch {activeChapter.tabLabel} in Live Prototype</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {VIDEO_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => handleSeekChapter(ch, idx)}
                  className={`p-2.5 rounded border text-left transition-all ${
                    activeChapterIndex === idx
                      ? 'bg-gov-blue text-white border-gov-blue shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-gov-blue/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                    <span>{ch.timeLabel}</span>
                    <span className={activeChapterIndex === idx ? 'text-amber-300' : 'text-slate-400'}>
                      Ch {ch.id}
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate">
                    {ch.tabLabel.split(' ')[1]}
                  </div>
                </button>
              ))}
            </div>

            {/* Narration Context for current chapter */}
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-xs text-slate-600 flex items-start gap-2 shadow-xs">
              <Compass className="w-4 h-4 text-gov-blue shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold">{activeChapter.title}: </strong>
                {activeChapter.narration}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 5-LAYER FORENSIC ARCHITECTURE (CRIME FLOW VS NETRA INTERCEPTION) */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="gov-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-gov-blue text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5 text-gov-blue" />
              THE 5-LAYER FORENSIC PARADIGM
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How NETRA Intercepts Every Layer of Criminal Laundering
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Cryptocurrency syndicates operate in 5 sequential stages. Discover how NETRA counters each layer with specialized forensic countermeasures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
            {/* Left 5 Columns: 5 Interactive Layer Selectors */}
            <div className="lg:col-span-5 space-y-2">
              {LAYERS.map(layer => (
                <div
                  key={layer.num}
                  onClick={() => setActiveLayer(layer.num)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    activeLayer === layer.num
                      ? 'bg-white border-gov-blue shadow-md'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      activeLayer === layer.num ? 'bg-gov-blue text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      LAYER 0{layer.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {layer.velocity}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {layer.title.split(': ')[1]}
                  </h3>
                  <div className="text-2xs text-slate-500 mt-0.5">
                    {layer.subtitle}
                  </div>
                </div>
              ))}
            </div>

            {/* Right 7 Columns: Active Layer Deep Dive Card */}
            <div className="lg:col-span-7">
              {(() => {
                const current = LAYERS.find(l => l.num === activeLayer) || LAYERS[0];
                return (
                  <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm space-y-5 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="font-mono text-xs font-bold text-gov-blue uppercase tracking-wider block">
                          Layer 0{current.num} Technical Breakdown
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                          {current.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-2xs font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-gov-blue border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gov-blue" />
                        {current.badge}
                      </span>
                    </div>

                    {/* Criminal Modus Box */}
                    <div className="p-4 bg-red-50/70 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                        Criminal Syndicate Modus Operandi:
                      </div>
                      <p className="text-xs text-red-950 leading-relaxed font-medium">
                        {current.crimeModus}
                      </p>
                    </div>

                    {/* NETRA Countermeasure Box */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        NETRA Sovereign Defense Interception:
                      </div>
                      <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                        {current.netraDefense}
                      </p>
                    </div>

                    {/* Operational Chokepoint & Quick Launch */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div>
                        <span className="text-2xs text-slate-500 uppercase font-mono block">Primary Chokepoint:</span>
                        <span className="font-bold text-slate-800">{current.chokepoint}</span>
                      </div>
                      <button
                        onClick={() => onLaunchPrototype(
                          current.num === 1 ? 'cases' :
                          current.num === 2 ? 'investigate' :
                          current.num === 3 ? 'network' :
                          current.num === 4 ? 'sahyog' : 'evidence'
                        )}
                        className="btn-primary text-xs flex items-center gap-1.5 py-2"
                      >
                        <span>Test Layer 0{current.num} in Live Prototype</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 5. NATIONAL IMPACT METRICS STRIP (CLEAN LIGHT CARDS) */}
      <section className="gov-container py-12">
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
      </section>

      {/* 6. PROTOTYPE LAUNCHER: THE 8 OPERATIONAL MODULES (LIGHT CARDS) */}
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

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
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

      {/* 8. BOTTOM CALL-TO-ACTION */}
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
