import React, { useState, useEffect } from 'react';
import { 
  Zap, Shield, CheckCircle, AlertTriangle, ArrowRight, 
  ExternalLink, Clock, RefreshCw, FileText
} from 'lucide-react';
import { api } from '../api';
import { ActionItem } from '../types';

interface ActionCenterViewProps {
  onNavigateToSahyog: (walletAddress: string, vaspName: string) => void;
  onSelectCase: (caseId: string) => void;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  onNavigateToSahyog,
  onSelectCase
}) => {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'URGENT' | 'PREPARED'>('ALL');

  useEffect(() => {
    loadActions();
  }, []);

  async function loadActions() {
    const list = await api.getActions();
    setActions(list);
  }

  async function handleApprove(id: string) {
    await api.approveAction(id, 'EXECUTED');
    await loadActions();
  }

  const filtered = actions.filter((a) => {
    if (filter === 'URGENT') return a.urgency === 'URGENT';
    if (filter === 'PREPARED') return a.status === 'PREPARED';
    return true;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
            <span>OPERATIONAL ENFORCEMENT</span>
            <span>•</span>
            <span>DECISION WORKSPACE</span>
          </div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
            Action Center
          </h1>
          <p className="text-xs text-stone mt-0.5">
            Operational interventions requiring supervisory investigator review before statutory execution.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-ink text-porcelain dark:bg-porcelain dark:text-ink font-semibold'
                : 'bg-warm-paper/60 dark:bg-night-elevated text-stone'
            }`}
          >
            ALL ({actions.length})
          </button>
          <button
            onClick={() => setFilter('URGENT')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              filter === 'URGENT'
                ? 'bg-oxide-red text-porcelain font-semibold'
                : 'bg-warm-paper/60 dark:bg-night-elevated text-stone'
            }`}
          >
            URGENT
          </button>
          <button
            onClick={() => setFilter('PREPARED')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              filter === 'PREPARED'
                ? 'bg-signal-amber text-porcelain font-semibold'
                : 'bg-warm-paper/60 dark:bg-night-elevated text-stone'
            }`}
          >
            READY FOR REVIEW
          </button>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isUrgent = item.urgency === 'URGENT';
          return (
            <div
              key={item.id}
              className={`p-5 rounded-lg border shadow-subtle space-y-3 transition-colors ${
                isUrgent
                  ? 'border-l-4 border-l-oxide-red border-t border-r border-b border-line dark:border-line-dark bg-warm-paper/40 dark:bg-night-surface'
                  : 'border border-line dark:border-line-dark bg-warm-paper/40 dark:bg-night-surface'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                    isUrgent ? 'bg-oxide-red/15 text-oxide-red' : 'bg-warm-paper dark:bg-night-bg text-stone'
                  }`}>
                    {item.urgency}
                  </span>
                  <span className="font-mono text-xs font-bold text-ink dark:text-porcelain">{item.id}</span>
                  <span className="text-stone font-mono text-xs">•</span>
                  <button
                    onClick={() => onSelectCase(item.case_id)}
                    className="font-mono text-xs text-signal-amber hover:underline font-semibold"
                  >
                    Case {item.case_id}
                  </button>
                </div>

                <span className="font-mono text-[11px] text-stone">{item.created_at}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-ink dark:text-porcelain">{item.title}</h3>
                <p className="text-xs text-stone leading-relaxed">{item.detail}</p>
              </div>

              <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-stone">TARGET ENTITY: </span>
                  <span className="font-bold text-ink dark:text-porcelain">{item.target_entity}</span>
                </div>
                <div>
                  <span className="text-stone">STATUS: </span>
                  <span className="font-bold text-signal-amber">{item.status}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                {item.sahyog_ready && (
                  <button
                    onClick={() => onNavigateToSahyog(item.target_entity, 'Binance Global')}
                    className="px-4 py-2 rounded text-xs font-semibold text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-all flex items-center gap-1.5 shadow-subtle cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Review in SAHYOG Studio</span>
                  </button>
                )}
                {item.status !== 'EXECUTED' && (
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-4 py-2 rounded text-xs font-semibold text-ink dark:text-porcelain bg-warm-paper hover:bg-line dark:bg-night-elevated dark:hover:bg-night-surface border border-line dark:border-line-dark transition-colors"
                  >
                    Mark Executed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
