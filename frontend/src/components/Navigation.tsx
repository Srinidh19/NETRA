import React, { useState } from 'react';
import {
  Home, Search, Network, Briefcase, FileText,
  Shield, ClipboardList, Bell, User, Activity,
  ChevronDown, AlertCircle, CheckCircle, ExternalLink,
  Layers, Lock
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  pendingActionsCount: number;
  onOpenSystemStatus: () => void;
  sandboxMode?: boolean;
}

const NAV_ITEMS = [
  { id: 'home',       label: 'Dashboard',   number: '01', icon: Home },
  { id: 'investigate',label: 'Investigate', number: '02', icon: Search },
  { id: 'network',    label: 'Network Map', number: '03', icon: Network },
  { id: 'cases',      label: 'FIR Dockets', number: '04', icon: Briefcase },
  { id: 'trends',     label: 'Threat Radar',number: '05', icon: Activity },
  { id: 'evidence',   label: 'Evidence',    number: '06', icon: FileText },
  { id: 'sahyog',     label: 'SAHYOG',      number: '07', icon: Shield },
  { id: 'audit',      label: 'Audit Trail', number: '08', icon: ClipboardList },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  pendingActionsCount,
  onOpenSystemStatus,
  sandboxMode = true,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A2540] text-white shadow-md select-none border-b border-slate-700/50">
      {/* Tricolor Subtle Top Strip */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white opacity-90" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Official Government Metadata Banner */}
      <div className="bg-[#071B2F] border-b border-slate-800/80 px-4 sm:px-6 py-1 text-2xs">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-amber-400 tracking-wider">भारत सरकार · GOVERNMENT OF INDIA</span>
            <span className="text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Ministry of Home Affairs · Indian Cyber Crime Coordination Centre (I4C)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-2 py-0.5 rounded tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              PORTAL ACTIVE · SECURE KERNEL
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400 uppercase tracking-widest bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
              RESTRICTED LEA ACCESS
            </span>
          </div>
        </div>
      </div>

      {/* Primary Brand & Navigation Row */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 text-left group"
          >
            {/* Emblem representation */}
            <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex flex-col items-center justify-center shadow-inner group-hover:bg-white/15 transition-colors">
              <span className="font-serif font-black text-amber-400 text-sm leading-none">नेत्रा</span>
              <span className="font-mono text-[8px] text-slate-300 font-bold tracking-tighter">NETRA</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">NETRA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  v2.4
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium leading-none hidden sm:block">
                National Blockchain Investigation &amp; VASP Intelligence
              </div>
            </div>
          </button>
        </div>

        {/* 7-Tab Navigation Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const hasBadge = item.id === 'sahyog' && pendingActionsCount > 0;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold
                  transition-all duration-150 whitespace-nowrap cursor-pointer
                  ${isActive
                    ? 'bg-white text-[#0A2540] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0A2540]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {hasBadge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold leading-tight">
                    {pendingActionsCount > 9 ? '9+' : pendingActionsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right utility & officer badge */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Shortcut */}
          <button
            onClick={onOpenSearch}
            id="global-search-btn"
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 text-xs transition-colors"
            title="Global Quick Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden xl:inline text-[11px]">Command Palette</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 text-slate-300">
              Ctrl+K
            </kbd>
          </button>

          {/* System status pill */}
          <button
            onClick={onOpenSystemStatus}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
            title="RPC & Provider Telemetry"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-slate-300">4 Providers</span>
          </button>

          {/* Officer profile pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/15">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-xs font-mono">
              VK
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[11px] font-bold text-white leading-tight">Insp. V. K. Deshmukh</div>
              <div className="text-[9px] font-mono text-slate-400 leading-none">Cyber Unit · Pune City</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
