import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Shield, AlertTriangle, ArrowUpRight, Clock,
  PieChart, BarChart2, Layers, CheckCircle2, RefreshCw,
  ExternalLink, Building2, Globe2, Activity, Zap, Compass
} from 'lucide-react';
import { api, TrendsData } from '../api';

export const TrendsView: React.FC<{
  onInvestigateWallet: (wallet: string) => void;
  onNavigateToCases: () => void;
}> = ({ onInvestigateWallet, onNavigateToCases }) => {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState<string>('Tron (TRC-20 USDT)');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    api.getTrends().then(data => {
      setTrends(data);
      setLoading(false);
    });
  }, []);

  if (loading || !trends) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-12 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-gov-blue mx-auto mb-3" />
        <div className="text-sm font-semibold text-text-primary">Loading National Threat Intelligence & Radar...</div>
      </div>
    );
  }

  const { kpis, yearly_trajectory, modus_operandi_breakdown, chain_distribution, vasp_benchmarks } = trends;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-bg-surface border border-border-default rounded-md p-6 shadow-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-gov-blue/10 border border-gov-blue/20 text-gov-blue text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-gov-blue" />
              NATIONAL CYBERCRIME FORENSIC RADAR · 2026 EDITION
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Cryptocurrency Financial Threat Trends &amp; VASP Attribution Analytics
            </h1>
            <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
              Real-time national surveillance on cross-border syndicates, money mule velocity, illicit blockchain flow share, and statutory freeze response times across regulated and offshore VASPs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToCases}
              className="btn-primary text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              View FIR Dockets &amp; Complaints
            </button>
          </div>
        </div>

        {/* Hero KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-border-default">
          <div className="bg-bg-secondary/70 p-3.5 rounded border border-border-subtle">
            <div className="text-2xs text-text-muted uppercase font-bold tracking-wider mb-1">National Reported Loss</div>
            <div className="text-xl font-mono font-bold text-red-600">₹{kpis.total_reported_loss_inr_cr.toLocaleString()} Cr</div>
            <div className="text-2xs text-text-muted mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-red-500" />
              +25.2% YoY increase
            </div>
          </div>

          <div className="bg-bg-secondary/70 p-3.5 rounded border border-border-subtle">
            <div className="text-2xs text-text-muted uppercase font-bold tracking-wider mb-1">Intercepted / Frozen</div>
            <div className="text-xl font-mono font-bold text-gov-blue">₹{kpis.total_intercepted_inr_cr.toLocaleString()} Cr</div>
            <div className="text-2xs text-text-muted mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Via CrPC 91 &amp; SAHYOG
            </div>
          </div>

          <div className="bg-bg-secondary/70 p-3.5 rounded border border-border-subtle">
            <div className="text-2xs text-text-muted uppercase font-bold tracking-wider mb-1">Restitution Rate</div>
            <div className="text-xl font-mono font-bold text-emerald-600">{kpis.restitution_rate_pct}%</div>
            <div className="text-2xs text-text-muted mt-1">Court orders executed</div>
          </div>

          <div className="bg-bg-secondary/70 p-3.5 rounded border border-border-subtle">
            <div className="text-2xs text-text-muted uppercase font-bold tracking-wider mb-1">VASP Freeze SLA</div>
            <div className="text-xl font-mono font-bold text-amber-600">{kpis.avg_vasp_freeze_sla_hours} hrs</div>
            <div className="text-2xs text-text-muted mt-1">Down from 18h in 2024</div>
          </div>

          <div className="bg-bg-secondary/70 p-3.5 rounded border border-border-subtle col-span-2 md:col-span-1">
            <div className="text-2xs text-text-muted uppercase font-bold tracking-wider mb-1">Active Syndicates</div>
            <div className="text-xl font-mono font-bold text-purple-700">{kpis.active_syndicates_tracked}</div>
            <div className="text-2xs text-text-muted mt-1">Multi-state coordination</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Yearly Trajectory & Chain Flow */}
        <div className="lg:col-span-7 space-y-6">
          {/* Yearly Trajectory Visualization */}
          <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-panel">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="section-label mb-1">Trend Analysis (2023 - 2026)</div>
                <h3 className="text-sm font-bold text-text-primary">Reported Crime Volume vs Intercepted Funds (₹ Cr)</h3>
              </div>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                Intercept Rate Rising
              </span>
            </div>

            {/* Custom SVG Line & Bar Chart */}
            <div className="h-64 w-full bg-slate-50/70 border border-border-subtle rounded p-4 flex flex-col justify-between">
              <div className="flex-1 flex items-end justify-between gap-6 px-4">
                {yearly_trajectory.map((item) => {
                  const maxVal = 2600;
                  const reportedHeight = (item.reported_cr / maxVal) * 100;
                  const interceptedHeight = (item.intercepted_cr / maxVal) * 100;
                  const recoveredHeight = (item.recovered_cr / maxVal) * 100;

                  return (
                    <div key={item.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="flex items-end gap-1.5 w-full justify-center h-full">
                        {/* Reported Loss Bar */}
                        <div
                          style={{ height: `${reportedHeight}%` }}
                          className="w-1/3 bg-red-400 hover:bg-red-500 rounded-t transition-all relative group/bar flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-7 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                            Loss: ₹{item.reported_cr} Cr
                          </span>
                        </div>

                        {/* Intercepted Bar */}
                        <div
                          style={{ height: `${interceptedHeight}%` }}
                          className="w-1/3 bg-gov-blue hover:bg-gov-blue-dark rounded-t transition-all relative group/bar flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-7 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                            Frozen: ₹{item.intercepted_cr} Cr
                          </span>
                        </div>

                        {/* Recovered Bar */}
                        <div
                          style={{ height: `${recoveredHeight}%` }}
                          className="w-1/3 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all relative group/bar flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover/bar:opacity-100 absolute -top-7 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                            Restituted: ₹{item.recovered_cr} Cr
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-center">
                        <div className="font-mono text-xs font-bold text-text-primary">{item.year}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-200 text-2xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-400" />
                  <span className="text-text-secondary">Reported Loss</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gov-blue" />
                  <span className="text-text-secondary">Intercepted / Frozen via SAHYOG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-text-secondary">Restituted to Victims</span>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Distribution & Velocity */}
          <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-panel">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="section-label mb-1">Chain Flow Analysis</div>
                <h3 className="text-sm font-bold text-text-primary">Target Blockchain Networks &amp; Mule Pass-Through Velocity</h3>
              </div>
              <span className="text-2xs text-text-muted">Updated real-time from active dockets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chain_distribution.map((chain) => (
                <div
                  key={chain.chain}
                  onClick={() => setSelectedChain(chain.chain)}
                  className={`p-3.5 rounded border cursor-pointer transition-all ${
                    selectedChain === chain.chain
                      ? 'bg-gov-blue/5 border-gov-blue shadow-sm'
                      : 'bg-bg-secondary/40 border-border-subtle hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text-primary">{chain.chain}</span>
                    <span className="font-mono text-xs font-bold text-gov-blue">{chain.share_pct}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        chain.share_pct > 50 ? 'bg-amber-500' : chain.share_pct > 20 ? 'bg-gov-blue' : 'bg-slate-500'
                      }`}
                      style={{ width: `${chain.share_pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-2xs text-text-muted font-mono">
                    <span>Est. Vol: ₹{chain.volume_cr} Cr</span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Clock className="w-3 h-3 text-amber-500" />
                      Avg Velocity: {chain.avg_velocity_min} min
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Key Intelligence Finding:</span> Tron TRC-20 USDT accounts for <span className="font-bold">64% of total fraudulent liquidity</span> due to sub-dollar network fees and 18-minute rapid transfer windows between mule accounts. Instant freezing via SAHYOG API reduces bridge exit rates by 72%.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Modus Operandi & VASP Benchmarks */}
        <div className="lg:col-span-5 space-y-6">
          {/* Modus Operandi Breakdown */}
          <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-panel">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="section-label mb-1">Crime Typology</div>
                <h3 className="text-sm font-bold text-text-primary">Modus Operandi Breakdown (2026)</h3>
              </div>
              <PieChart className="w-4 h-4 text-text-muted" />
            </div>

            <div className="space-y-3">
              {modus_operandi_breakdown.map((item) => (
                <div
                  key={item.category}
                  onClick={() => setSelectedCategory(selectedCategory === item.category ? null : item.category)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedCategory === item.category
                      ? 'bg-gov-blue/5 border-gov-blue'
                      : 'bg-bg-secondary/40 border-border-subtle hover:bg-bg-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1">
                    <span className="truncate pr-2">{item.category}</span>
                    <span className="font-mono text-gov-blue shrink-0">{item.share_pct}%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-gov-blue h-full rounded-full"
                      style={{ width: `${item.share_pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-2xs text-text-muted">
                    <span>Loss: ₹{item.reported_cr} Cr</span>
                    <span className="font-mono">Avg/Victim: ₹{item.avg_loss_lakh} Lakh</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VASP Freeze SLA Benchmark */}
          <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-panel">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="section-label mb-1">Enforcement Readiness</div>
                <h3 className="text-sm font-bold text-text-primary">Exchange Cooperation &amp; Freeze SLA</h3>
              </div>
              <Building2 className="w-4 h-4 text-gov-blue" />
            </div>

            <div className="divide-y divide-border-subtle">
              {vasp_benchmarks.map((vasp) => (
                <div key={vasp.vasp} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-primary flex items-center gap-1.5">
                      {vasp.vasp}
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {vasp.jurisdiction}
                      </span>
                    </div>
                    <div className="text-2xs text-text-muted mt-0.5">
                      Statutory SLA: <span className="font-mono font-bold text-gov-blue">{vasp.sla_hours} hrs</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-2xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Zap className="w-3 h-3 text-emerald-500" />
                      {vasp.compliance_pct}% Compliant
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
