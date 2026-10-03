import React, { useState, useEffect } from 'react';
import {
  Briefcase, Search, Shield, FileText, ArrowRight,
  AlertCircle, CheckCircle, Clock, Building2,
  ExternalLink, ChevronRight, RefreshCw, Eye,
  Play, Pause, RotateCcw, Award, Layers, Sparkles,
  ChevronDown, Check, Lock, User, TrendingUp, HelpCircle
} from 'lucide-react';
import { api } from '../api';
import { CaseRecord, ActionItem } from '../types';

interface HomeViewProps {
  onNavigateToTab: (tab: string) => void;
  onInvestigateWallet: (address: string) => void;
  onOpenCase: (caseId: string) => void;
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
    title: 'FIR Dockets: Active Cases vs Precedents',
    timeCode: '00:30 - 00:40',
    durationSec: 10,
    subtitle: 'Comparing active investigations with resolved judicial precedents and recovery figures',
    narration: 'Step 4: The FIR Dockets repository tracks both current active dockets and previous resolved cases, displaying court conviction details, charge-sheets, and restituted capital.'
  },
  {
    id: 5,
    tabId: 'evidence',
    tabLabel: '05 Evidence Vault',
    title: 'Evidence Vault: Section 65B Certificates',
    timeCode: '00:40 - 00:50',
    durationSec: 10,
    subtitle: 'Court-admissible cryptographic seals under the Indian Evidence Act',
    narration: 'Step 5: Inside the Evidence Vault, every on-chain artifact is sealed with a SHA-256 hash. Generate court-admissible Section 65B certificates for judicial submission in one click.'
  },
  {
    id: 6,
    tabId: 'sahyog',
    tabLabel: '06 SAHYOG',
    title: 'SAHYOG: Section 91 CrPC Freeze Notices',
    timeCode: '00:50 - 01:00',
    durationSec: 10,
    subtitle: 'Direct legal directive dispatch to FIU-registered exchange compliance desks',
    narration: 'Step 6: Open the SAHYOG Gateway to draft and transmit binding Section 91 CrPC freeze requisitions directly to exchange compliance officers, locking scammer accounts in minutes.'
  },
  {
    id: 7,
    tabId: 'cases',
    tabLabel: '07 Restitution',
    title: 'Restitution: Victim Fund Recovery',
    timeCode: '01:00 - 01:10',
    durationSec: 10,
    subtitle: 'Completing the loop with magistrate restitution orders and bank refunds',
    narration: 'Step 7: The investigation culminates in judicial restitution. The court orders the frozen exchange assets to be converted and transferred back to the victim’s verified bank account.'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToTab,
  onInvestigateWallet,
  onOpenCase,
}) => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [rates, setRates] = useState<any>(null);
  const [caseFilter, setCaseFilter] = useState<'ALL' | 'CURRENT' | 'PREVIOUS'>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Video Tutorial Player State
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoElapsed, setVideoElapsed] = useState(0); // 0 to 70 seconds
  const [videoSpeed, setVideoSpeed] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Video playback loop
  useEffect(() => {
    let interval: any = null;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoElapsed((prev) => {
          if (prev >= 70) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1 * videoSpeed;
        });
      }, 1000 / videoSpeed);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, videoSpeed]);

  // Synchronize active chapter with elapsed time
  useEffect(() => {
    const chapterIdx = Math.min(Math.floor(videoElapsed / 10), TUTORIAL_CHAPTERS.length - 1);
    setActiveChapterIndex(chapterIdx);
  }, [videoElapsed]);

  const selectVideoChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    setVideoElapsed(idx * 10);
    setIsVideoPlaying(true);
  };

  const currentChapter = TUTORIAL_CHAPTERS[activeChapterIndex];

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [c, a, r] = await Promise.all([
          api.getCases(),
          api.getActions(),
          api.getLiveRates()
        ]);
        setCases(c);
        setActions(a);
        setRates(r);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onInvestigateWallet(searchInput.trim());
    }
  };

  const priorityBadge = (p: string) => {
    if (p === 'CRITICAL') return 'bg-rose-50 text-rose-800 border-rose-200';
    if (p === 'HIGH') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-sky-50 text-sky-800 border-sky-200';
  };

  const currentCases = cases.filter(c => (c.case_type || 'CURRENT') === 'CURRENT');
  const previousCases = cases.filter(c => c.case_type === 'PREVIOUS');

  const filteredCases = cases.filter(c => {
    if (caseFilter === 'CURRENT') return (c.case_type || 'CURRENT') === 'CURRENT';
    if (caseFilter === 'PREVIOUS') return c.case_type === 'PREVIOUS';
    return true;
  });

  const totalLoss = cases.reduce((acc, c) => acc + (c.loss_amount_inr || 0), 0);
  const totalRecovered = cases.reduce((acc, c) => acc + (c.recovery_amount_inr || 0), 0);

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-80px)] pb-10">
      {/* Official Government Portal Sub-Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="gov-container py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              National Informatics Centre (NIC) / I4C SAHYOG Gateway Sync
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Blockchain Investigation &amp; VASP Attribution Command
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-2xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Investigator: <strong className="text-slate-800">Insp. V. K. Deshmukh</strong> (Pune Cyber)</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              title="Refresh Portal Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Market Feeds & Institutional Exchange Rates */}
        <div className="bg-slate-900 text-slate-300 border-t border-slate-800 text-[11px] font-mono py-1.5 px-4 overflow-x-auto">
          <div className="gov-container flex items-center justify-between gap-4 whitespace-nowrap">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">FIU-IND Valuation Feed</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400 mr-1.5">USDT/INR:</span>
                <span className="text-emerald-400 font-bold">₹{rates?.USDT?.inr?.toFixed(2) || '83.50'}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-1.5">BTC/INR:</span>
                <span className="text-white font-bold">₹{rates?.BTC?.inr ? (rates.BTC.inr / 100000).toFixed(2) + 'L' : '53.85L'}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-1.5">ETH/INR:</span>
                <span className="text-sky-300 font-bold">₹{rates?.ETH?.inr ? (rates.ETH.inr / 100000).toFixed(2) + 'L' : '2.21L'}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-1.5">TRX/INR:</span>
                <span className="text-amber-300 font-bold">₹{rates?.TRX?.inr?.toFixed(2) || '12.50'}</span>
              </div>
              <div className="text-[10px] text-slate-400 pl-2 border-l border-slate-700">
                Source: CoinGecko Pro / RBI Reference Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gov-container mt-5 space-y-5">
        {/* PRECISE 4-METRIC ROW - CURRENT VS PREVIOUS DISTINCTION */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Current Active Cases
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {currentCases.length || 8}
            </div>
            <div className="text-2xs text-sky-700 font-medium mt-1">
              Ongoing Under Sec 91 CrPC Tracing
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Previous Precedent Cases
            </div>
            <div className="text-2xl font-black text-indigo-700 font-mono mt-1">
              {previousCases.length || 7}
            </div>
            <div className="text-2xs text-slate-500 mt-1">
              Resolved &amp; Charge-Sheeted Dockets
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Total Stolen Capital Traced
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              ₹{(totalLoss / 10000000).toFixed(2)} Cr
            </div>
            <div className="text-2xs text-slate-500 mt-1">
              Across Ethereum, Tron, Polygon &amp; BSC
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Restituted / Frozen Assets
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              ₹{(totalRecovered / 10000000).toFixed(2)} Cr
            </div>
            <div className="text-2xs text-emerald-600 font-semibold mt-1">
              {((totalRecovered / (totalLoss || 1)) * 100).toFixed(1)}% Forensic Recovery Ratio
            </div>
          </div>
        </div>

        {/* 1. OUR WHOLE IDEA: WHAT IS NETRA & HOW IT WORKS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gov-blue" />
                <span className="text-2xs font-bold uppercase tracking-wider text-gov-blue font-mono">
                  National Cyber Crime Coordination Centre (I4C) Protocol
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                The NETRA Vision: Bridging On-Chain Evidence to Statutory Asset Recovery
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                Cryptocurrency fraud syndicates exploit jurisdictional delays to liquidate stolen assets into cash within the "Golden Hour". NETRA provides a unified operational pipeline converting raw blockchain transactions into discoverable networks, defensible attribution, and binding Section 91 CrPC freeze requisitions served directly to FIU-registered exchanges.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-2xs font-mono text-slate-700 font-bold">
                PMLA &amp; CrPC 91 COMPLIANT
              </span>
            </div>
          </div>

          {/* 4 Core Pillars of NETRA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-gov-blue font-bold text-xs mb-2">
                01
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Graph Discovery</h4>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Automated multi-hop tracing across Ethereum, Tron, Polygon, and BSC, uncovering mule layering networks and mixer hops.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-amber-700 font-bold text-xs mb-2">
                02
              </div>
              <h4 className="font-bold text-slate-900 mb-1">VASP Attribution</h4>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Clustering algorithms identifying recipient hot wallets belonging to Binance, CoinDCX, or WazirX with 99%+ forensic confidence.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-rose-700 font-bold text-xs mb-2">
                03
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Section 91 Freeze</h4>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Automated dispatch of cryptographically sealed statutory freeze directives directly to exchange compliance desks via SAHYOG.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <div className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-emerald-700 font-bold text-xs mb-2">
                04
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Court Restitution</h4>
              <p className="text-2xs text-slate-600 leading-relaxed">
                Generating Section 65B Indian Evidence Act certificates enabling magistrates to authorize returning frozen funds to victim accounts.
              </p>
            </div>
          </div>
        </div>

        {/* 2. ACTUAL PLATFORM NAVIGATION VIDEO TUTORIAL (NOT ABSTRACT CHARTS) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {/* Video Header Strip */}
          <div className="bg-[#0A2540] text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Play className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Platform Navigation Video Tutorial: How to Use NETRA
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500 text-slate-950">
                    REAL SCREEN WALKTHROUGH
                  </span>
                </div>
                <p className="text-2xs text-slate-300">
                  Step-by-step navigation across all 7 operational modules: from case review to exchange freeze and restitution
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-2xs">
              <button
                onClick={() => {
                  setVideoElapsed(0);
                  setActiveChapterIndex(0);
                  setIsVideoPlaying(true);
                }}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 transition-colors flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay</span>
              </button>
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isVideoPlaying ? <Pause className="w-3 h-3 fill-slate-950" /> : <Play className="w-3 h-3 fill-slate-950" />}
                <span>{isVideoPlaying ? 'Pause Video' : 'Play Video'}</span>
              </button>
            </div>
          </div>

          {/* Chapter Selector Playlist Strip (7 Tabs corresponding to actual platform navigation) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50 text-xs">
            {TUTORIAL_CHAPTERS.map((ch, idx) => {
              const isSelected = activeChapterIndex === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => selectVideoChapter(idx)}
                  className={`p-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-b-2 border-gov-blue text-gov-blue font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100/80 opacity-90'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold text-slate-400">
                    {ch.tabLabel}
                  </div>
                  <div className="text-2xs font-semibold text-slate-900 truncate mt-0.5">
                    {ch.title.split(':')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Simulated Browser Frame Displaying Actual Section Screens */}
          <div className="p-4 sm:p-5 bg-slate-100">
            <div className="bg-white rounded-lg border border-slate-300 shadow-md overflow-hidden max-w-5xl mx-auto">
              {/* Virtual Browser Chrome */}
              <div className="bg-slate-200 border-b border-slate-300 px-3.5 py-1.5 flex items-center justify-between gap-3 text-2xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>

                <div className="flex-1 max-w-md bg-white border border-slate-300 rounded px-2.5 py-0.5 text-slate-600 font-mono text-[11px] flex items-center gap-1.5 shadow-2xs">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span className="truncate">
                    {currentChapter.id === 1 && 'https://netra.gov.in/dashboard'}
                    {currentChapter.id === 2 && 'https://netra.gov.in/investigate?address=0x7a912e84...'}
                    {currentChapter.id === 3 && 'https://netra.gov.in/network?case=FIR-412-2026'}
                    {currentChapter.id === 4 && 'https://netra.gov.in/cases?filter=precedents'}
                    {currentChapter.id === 5 && 'https://netra.gov.in/evidence?hash=0x92fba1...'}
                    {currentChapter.id === 6 && 'https://netra.gov.in/sahyog/sec91-dispatch'}
                    {currentChapter.id === 7 && 'https://netra.gov.in/cases/restitution-order'}
                  </span>
                </div>

                <div className="text-slate-500 font-mono text-2xs">
                  {videoElapsed}s / 70s
                </div>
              </div>

              {/* Virtual Screen Viewport */}
              <div className="min-h-[300px] sm:min-h-[340px] p-5 bg-[#F8FAFC] relative flex flex-col justify-between">
                {/* Visual content matching the active navigation chapter */}
                {currentChapter.id === 1 && (
                  /* 01 Dashboard Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-gov-blue" />
                        <span>01. Dashboard Investigation Queue</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 font-bold">
                        ACTIVE DOCKETS
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-gov-blue">FIR 412/2026 (Pune Cyber)</span>
                        <span className="font-mono font-bold text-slate-900">₹45.2 Lakh Loss</span>
                      </div>
                      <div className="text-2xs text-slate-600">
                        Operation ShadowSiphon · Suspect Wallet: <span className="font-mono font-bold text-slate-800">0x4838b1...5f97</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-2xs">
                        <span className="text-emerald-700 font-semibold">Attributed VASP: Binance Hot 6</span>
                        <span className="px-2 py-0.5 rounded bg-gov-blue text-white font-medium text-[10px]">
                          Click to Trace Target ⟶
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {currentChapter.id === 2 && (
                  /* 02 Investigate Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Search className="w-4 h-4 text-gov-blue" />
                        <span>02. Investigate: Target Wallet De-Anonymization</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-800 font-bold">
                        HIGH RISK NODE (SCORE 88)
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-2xs">
                      <div className="p-2 bg-white border border-slate-200 rounded">
                        <div className="text-slate-400">TOTAL VOLUME:</div>
                        <div className="font-bold text-slate-900 mt-0.5">45.2 ETH (₹1.00 Cr)</div>
                      </div>
                      <div className="p-2 bg-white border border-slate-200 rounded">
                        <div className="text-slate-400">TRANSACTION HOPS:</div>
                        <div className="font-bold text-slate-900 mt-0.5">3 Outbound Layering</div>
                      </div>
                      <div className="p-2 bg-white border border-slate-200 rounded">
                        <div className="text-slate-400">DESTINATION:</div>
                        <div className="font-bold text-amber-700 mt-0.5">Exchange Hot Wallet</div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded font-mono text-2xs text-slate-700">
                      Target Address: <span className="font-bold text-gov-blue">0x7a912e84c98f5b89a456102dc840b8a1c97012fe</span>
                    </div>
                  </div>
                )}

                {currentChapter.id === 3 && (
                  /* 03 Network Map Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-gov-blue" />
                        <span>03. Network Map: Interactive Money Trail Canvas</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                        PLAYBACK ACTIVE
                      </span>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-center font-mono text-2xs">
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded flex-1">
                        <div className="text-slate-400">VICTIM NODE</div>
                        <div className="font-bold text-slate-800 mt-0.5">0x4838...5f97</div>
                      </div>
                      <div className="text-gov-blue font-bold">⟶ 45.2 ETH ⟶</div>
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded flex-1">
                        <div className="text-rose-600 font-bold">MULE HUB 1</div>
                        <div className="font-bold text-slate-800 mt-0.5">0x7a91...12fe</div>
                      </div>
                      <div className="text-gov-blue font-bold">⟶ +14m ⟶</div>
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded flex-1">
                        <div className="text-amber-800 font-bold">BINANCE HOT 6</div>
                        <div className="font-bold text-slate-800 mt-0.5">₹29.96L Exit</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentChapter.id === 4 && (
                  /* 04 FIR Dockets Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gov-blue" />
                        <span>04. FIR Dockets: Active Cases &amp; Resolved Precedents</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 font-bold">
                        15 REGISTERED CASES
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-2xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="font-bold text-sky-800">8 CURRENT ACTIVE DOCKETS</div>
                        <div className="text-slate-500 mt-1">Ongoing investigations across Maharashtra, Karnataka, Delhi, and Rajasthan.</div>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="font-bold text-emerald-800">7 RESOLVED PRECEDENTS</div>
                        <div className="text-slate-500 mt-1">₹8.42 Cr restituted with judicial convictions under Section 91 CrPC and PMLA.</div>
                      </div>
                    </div>
                  </div>
                )}

                {currentChapter.id === 5 && (
                  /* 05 Evidence Vault Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-gov-blue" />
                        <span>05. Evidence Vault: Section 65B Admissibility</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                        COURT ADMISSIBLE
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-2xs space-y-1.5">
                      <div className="text-slate-800 font-bold">EXHIBIT EV-019284: Stargate Cross-Chain Bridge Swap</div>
                      <div className="text-slate-500">SHA-256 HASH: <span className="text-gov-blue">0x92fba102938471029487102948710294871029487102948710293847901233</span></div>
                      <div className="text-emerald-700 font-semibold">TIMESTAMPED: 14 Sep 2026 19:44:12 UTC (Indian Evidence Act Certified)</div>
                    </div>
                  </div>
                )}

                {currentChapter.id === 6 && (
                  /* 06 SAHYOG Gateway Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-gov-blue" />
                        <span>06. SAHYOG: Section 91 CrPC Statutory Freeze Notice</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                        GATEWAY ACTIVE
                      </span>
                    </div>

                    <div className="p-3 bg-white border-2 border-gov-blue rounded-lg font-mono text-2xs space-y-1">
                      <div className="text-slate-800 font-bold">REQUISITION: Direct Debit Freeze &amp; KYC Disclosure</div>
                      <div>TARGET VASP: Binance Holdings Ltd. (Hot Wallet 6)</div>
                      <div>STATUTORY REF: Section 91 Code of Criminal Procedure, 1973</div>
                      <div className="text-emerald-700 font-bold pt-1">STATUS: DISPATCHED &amp; COMPLIANCE DESK NOTIFIED</div>
                    </div>
                  </div>
                )}

                {currentChapter.id === 7 && (
                  /* 07 Restitution Screen */
                  <div className="space-y-3 max-w-2xl mx-auto w-full animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>07. Restitution: Court Refund Order Executed</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                        RESTITUTION COMPLETE
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-emerald-300 rounded-lg font-mono text-2xs space-y-1.5">
                      <div className="text-slate-900 font-bold text-xs">ORDER REF: CR-412-2026-REST (Court of CJM, Pune City)</div>
                      <div className="text-emerald-700 font-bold text-sm">AMOUNT RESTITUTED: ₹29,96,400</div>
                      <div className="text-slate-600">FUNDS TRANSFERRED: Remitted back to Complainant Verified Bank Account</div>
                    </div>
                  </div>
                )}

                {/* Subtitle & Narration Guidance Box */}
                <div className="mt-4 pt-3 border-t border-slate-200 bg-white/80 p-2.5 rounded border border-slate-200 text-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-slate-700">
                    <strong className="text-gov-blue uppercase font-mono mr-1.5">NARRATOR:</strong>
                    {currentChapter.narration}
                  </div>

                  <button
                    onClick={() => onNavigateToTab(currentChapter.tabId)}
                    className="px-3 py-1 bg-gov-blue hover:bg-gov-blue-2 text-white font-semibold text-2xs rounded transition-colors flex items-center gap-1 shrink-0 self-end sm:self-auto cursor-pointer"
                  >
                    <span>Open {currentChapter.tabLabel.split(' ')[1]} Live</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Video Bottom Progress Slider Bar */}
              <div className="bg-slate-200 border-t border-slate-300 px-4 py-2 flex items-center justify-between gap-3 text-2xs">
                <div className="flex items-center gap-2 flex-1 max-w-lg">
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={videoElapsed}
                    onChange={(e) => setVideoElapsed(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-gov-blue"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVideoSpeed(videoSpeed === 1 ? 1.5 : 1)}
                    className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono font-bold border border-slate-300 hover:bg-slate-50 cursor-pointer"
                  >
                    {videoSpeed}x Speed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SINGLE CLEAN EXPLORATION BAR */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus-within:bg-white focus-within:border-gov-blue">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter target wallet address (0x...), transaction hash, or FIR number..."
                className="w-full bg-transparent text-xs font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-gov-blue hover:bg-gov-blue-2 text-white font-semibold text-xs rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <span>Investigate Target</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Preset Leads */}
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-2xs">
            <span className="font-semibold text-slate-500">Quick Case Leads:</span>
            {[
              { label: 'Victim (Pune FIR 412)', addr: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97' },
              { label: 'Syndicate Mule 1', addr: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe' },
              { label: 'Layering Hub', addr: '0x28c6c06298d514db089934071355e5743bf21d60' },
              { label: 'Binance Cashout Cluster', addr: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be' },
              { label: 'TRON Syndicate Vault', addr: 'TXY9A6b2FvQe3R1L9gH8jK4mP2nB1cX5zW' },
            ].map((lead) => (
              <button
                key={lead.addr}
                type="button"
                onClick={() => onInvestigateWallet(lead.addr)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono border border-slate-200 transition-colors"
              >
                {lead.label}
              </button>
            ))}
          </div>
        </div>

        {/* TWO ALIGNED PANELS: ACTIVE & PREVIOUS CASES (LEFT) + PENDING ACTIONS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* FIR Cases Table (8 Columns) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Assigned FIR Investigation Queue
                </h2>
                <div className="text-2xs text-slate-500">Official cyber crime cases registered in NETRA</div>
              </div>
              
              {/* Filter Tabs for Current vs Previous Cases */}
              <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded text-2xs font-medium">
                <button
                  type="button"
                  onClick={() => setCaseFilter('ALL')}
                  className={`px-2 py-1 rounded transition-colors ${caseFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All ({cases.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCaseFilter('CURRENT')}
                  className={`px-2 py-1 rounded transition-colors ${caseFilter === 'CURRENT' ? 'bg-white text-sky-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Current ({currentCases.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCaseFilter('PREVIOUS')}
                  className={`px-2 py-1 rounded transition-colors ${caseFilter === 'PREVIOUS' ? 'bg-white text-indigo-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Precedents ({previousCases.length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">FIR Docket</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Jurisdiction</th>
                    <th className="px-3 py-2.5">Loss / Recovered</th>
                    <th className="px-3 py-2.5">Attributed VASP</th>
                    <th className="px-3 py-2.5">Priority</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-gov-blue">{c.fir_number}</div>
                        <div className="text-slate-900 font-medium truncate max-w-[190px]" title={c.title}>
                          {c.title}
                        </div>
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        {c.case_type === 'PREVIOUS' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Precedent
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-3 text-slate-600">
                        <div>{c.police_station}</div>
                        <div className="text-2xs text-slate-400 font-mono">{c.state}</div>
                      </td>

                      <td className="px-3 py-3 font-mono whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          ₹{(c.loss_amount_inr / 100000).toFixed(1)}L
                        </div>
                        {c.recovery_amount_inr ? (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            ₹{(c.recovery_amount_inr / 100000).toFixed(1)}L restituted
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">
                            Tracing pending
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3 text-2xs font-medium text-slate-700">
                        {c.identified_vasps?.length ? c.identified_vasps.join(', ') : 'Pending'}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${priorityBadge(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.victim_wallet && (
                            <button
                              onClick={() => onInvestigateWallet(c.victim_wallet)}
                              className="px-2 py-1 bg-gov-blue hover:bg-gov-blue-2 text-white text-2xs font-medium rounded transition-colors"
                              title="Investigate wallet"
                            >
                              Trace
                            </button>
                          )}
                          <button
                            onClick={() => onOpenCase(c.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-2xs font-medium rounded border border-slate-200 transition-colors"
                          >
                            Docket
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Priority Directives (Right 4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Statutory Directives (CrPC)
                  </h2>
                  <div className="text-2xs text-slate-500">Immediate officer actions required</div>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                  3 PENDING
                </span>
              </div>

              <div className="p-3 space-y-2.5">
                {[
                  {
                    title: 'Section 91 CrPC Freeze Requisition',
                    target: 'Binance Global Hot Wallet 6',
                    docket: 'FIR 412/2026 (Pune)',
                    amount: '₹29.96 Lakh Recoverable',
                    tab: 'sahyog',
                    badge: 'CRITICAL',
                  },
                  {
                    title: 'Section 65B Certificate Generation',
                    target: 'Stargate Bridge Hash EV-019284',
                    docket: 'FIR 219/2026 (Pune)',
                    amount: 'Evidence Vault',
                    tab: 'evidence',
                    badge: 'REQUIRED',
                  },
                  {
                    title: 'Domestic VASP Identity Disclosure',
                    target: 'CoinDCX India Gateway',
                    docket: 'FIR 554/2026 (Bengaluru)',
                    amount: '₹65.0 Lakh Coerced',
                    tab: 'sahyog',
                    badge: 'HIGH',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateToTab(item.tab)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                        {item.badge}
                      </span>
                    </div>

                    <div className="text-2xs text-slate-600 font-medium">
                      Target: {item.target}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/70 text-2xs">
                      <span className="font-mono text-slate-500">{item.docket}</span>
                      <span className="font-semibold text-gov-blue flex items-center gap-0.5">
                        <span>Execute</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Quick Directives */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-2xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Statutory Investigation Protocol:
              </div>
              <p className="leading-relaxed">
                All Section 91 CrPC freeze requests and Section 65B evidence exhibits generated by NETRA are admissible under the Indian Evidence Act. Transmissions through the SAHYOG gateway undergo cryptographic timestamping.
              </p>
            </div>
          </div>
        </div>

        {/* 3. NATIONAL CYBER FINANCIAL CRIME TRENDS & THREAT RADAR (2026) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-amber-700 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>I4C Threat Telemetry · 2026 National Radar</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Cryptocurrency Fraud Modus Operandi &amp; VASP Response Trends
              </h3>
            </div>
            <div className="text-2xs font-mono text-slate-500">
              Aggregated across 15 Cyber Crime Cells &amp; 1930 Portal
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Trend 1: Top Modus Operandi */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-2xs flex items-center justify-between">
                <span>Top Modus Operandi (2026)</span>
                <span className="text-slate-400 font-mono">% Volume</span>
              </div>

              <div className="space-y-2 text-2xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Telegram Daily Task / Rating Scams</span>
                    <span className="font-mono font-bold text-slate-900">42%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Fake Trading / Institutional Ponzi</span>
                    <span className="font-mono font-bold text-slate-900">28%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gov-blue h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">APK Trojans &amp; Phishing Contracts</span>
                    <span className="font-mono font-bold text-slate-900">18%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-600 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">P2P Bank Mule Coercion</span>
                    <span className="font-mono font-bold text-slate-900">12%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Trend 2: Targeted Blockchain Distribution */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-2xs flex items-center justify-between">
                <span>Illicit Flow by Blockchain</span>
                <span className="text-slate-400 font-mono">Dominance</span>
              </div>

              <div className="space-y-2 text-2xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Tron (TRC-20 USDT)</span>
                    <span className="font-mono font-bold text-amber-700">64%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '64%' }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Favored by syndicates due to sub-cent gas fees</div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Ethereum (ERC-20 USDT/ETH)</span>
                    <span className="font-mono font-bold text-gov-blue">24%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gov-blue h-full rounded-full" style={{ width: '24%' }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Used for large ₹50L+ laundering dockets</div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Polygon &amp; BSC Bridges</span>
                    <span className="font-mono font-bold text-purple-700">12%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '12%' }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Cross-chain swaps attempting evasion</div>
                </div>
              </div>
            </div>

            {/* Trend 3: VASP Statutory Response SLA */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-2xs flex items-center justify-between">
                <span>VASP Freeze Turnaround (SLA)</span>
                <span className="text-slate-400 font-mono">Avg Time</span>
              </div>

              <div className="space-y-2 font-mono text-2xs">
                <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">CoinDCX India</div>
                    <div className="text-[10px] text-slate-500 font-sans">FIU-VASP-2024-CD01</div>
                  </div>
                  <span className="text-emerald-700 font-bold">1.8 Hours</span>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">WazirX Gateway</div>
                    <div className="text-[10px] text-slate-500 font-sans">FIU-VASP-2024-WX01</div>
                  </div>
                  <span className="text-emerald-700 font-bold">2.3 Hours</span>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Binance Global</div>
                    <div className="text-[10px] text-slate-500 font-sans">FIU-VASP-2024-BN01</div>
                  </div>
                  <span className="text-amber-700 font-bold">4.2 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) & STATUTORY GUIDELINES */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-gov-blue font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Statutory Guidance &amp; Operational FAQ</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Frequently Asked Questions: Blockchain Investigation &amp; Recovery
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                q: 'How does NETRA enable cryptocurrency debit freezes under Section 91 CrPC?',
                a: 'Under Section 91 of the Code of Criminal Procedure (CrPC), investigating police officers are empowered to requisition documents, electronic records, or assets necessary for investigation. When NETRA traces illicit funds into an exchange deposit or hot wallet, an officer generates a digitally signed Section 91 directive transmitted via the SAHYOG gateway, instructing the exchange to freeze the accused account pending trial.'
              },
              {
                q: 'How are pseudo-anonymous blockchain addresses attributed to registered exchanges?',
                a: 'NETRA employs multi-input heuristics, change address clustering, and hot/cold wallet signature analysis cross-referenced against FIU-IND registered VASP deposit address ranges. This achieves attribution confidence exceeding 99% for both domestic entities (CoinDCX, WazirX) and registered offshore VASPs (Binance).'
              },
              {
                q: 'What makes NETRA outputs admissible under Section 65B of the Indian Evidence Act?',
                a: 'Section 65B (and Section 63 of Bharatiya Sakshya Adhiniyam, 2023) mandates that computer-generated evidence must have certified chain-of-custody, system integrity proofs, and unmanipulated hash records. NETRA automatically captures raw RPC node payloads, timestamps, block hashes, and generates cryptographically signed certificates for production before magistrate courts.'
              },
              {
                q: 'How does NETRA synchronize with the 1930 National Cyber Crime Reporting Portal (NCRP)?',
                a: 'Complaints registered on the National Cyber Crime Reporting Portal (1930) with transaction hashes or suspect wallet addresses are ingested through the I4C SAHYOG feed into the NETRA docket queue, enabling immediate automated preliminary tracing.'
              },
              {
                q: 'How is victim restitution executed once funds are frozen in an exchange account?',
                a: 'Following the freezing of funds, the investigating officer submits the Section 65B certified evidence package to the Chief Judicial Magistrate (CJM) court. The court issues a formal restitution order directing the VASP to liquidate or remit the seized balance back to the verified bank account of the complainant.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="py-2.5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs text-slate-900 gap-2 hover:text-gov-blue transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-2xs text-slate-600 leading-relaxed pr-4 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
