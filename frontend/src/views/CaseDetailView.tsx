import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Shield, FileCheck, Zap, Clock, ArrowRight, 
  ExternalLink, User, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';
import { api } from '../api';
import { CaseRecord, EvidenceItem, ActionItem } from '../types';

interface CaseDetailViewProps {
  caseId: string;
  onSelectWallet: (address: string) => void;
  onNavigateToSahyog: (walletAddress: string, vaspName: string) => void;
  onNavigateToEvidence: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  caseId,
  onSelectWallet,
  onNavigateToSahyog,
  onNavigateToEvidence
}) => {
  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [actionsList, setActionsList] = useState<ActionItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'AUDIT'>('OVERVIEW');

  useEffect(() => {
    async function loadCase() {
      const res = await api.getCase(caseId);
      if (res && res.case) {
        setCaseData(res.case);
        setEvidenceList(res.evidence || []);
        setActionsList(res.actions || []);
        setAuditTrail(res.audit_trail || []);
      }
    }
    loadCase();
  }, [caseId]);

  if (!caseData) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-xs text-stone font-mono">
        Loading case file {caseId}...
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Case Header */}
      <div className="p-6 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
              <span className="font-bold text-signal-amber">{caseData.id}</span>
              <span>•</span>
              <span>{caseData.fir_number}</span>
              <span>•</span>
              <span>{caseData.police_station}</span>
            </div>
            <h1 className="text-2xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
              {caseData.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectWallet(caseData.victim_wallet)}
              className="px-4 py-2 rounded text-xs font-semibold text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>Launch in Investigation Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Case Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
            <span className="text-[10px] text-stone">REPORTED LOSS</span>
            <div className="text-base font-bold text-signal-amber mt-0.5">
              ₹{(caseData.loss_amount_inr / 100000).toFixed(1)} Lakh
            </div>
          </div>
          <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
            <span className="text-[10px] text-stone">IDENTIFIED VASPs</span>
            <div className="font-bold text-ink dark:text-porcelain mt-0.5 truncate">
              {caseData.identified_vasps.join(', ')}
            </div>
          </div>
          <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
            <span className="text-[10px] text-stone">CASE STATUS</span>
            <div className="font-bold text-deep-moss dark:text-verdigris mt-0.5">
              {caseData.status}
            </div>
          </div>
          <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
            <span className="text-[10px] text-stone">INVESTIGATOR</span>
            <div className="font-bold text-ink dark:text-porcelain mt-0.5 truncate">
              {caseData.investigator}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
            activeTab === 'OVERVIEW'
              ? 'bg-ink text-porcelain dark:bg-porcelain dark:text-ink font-semibold'
              : 'text-stone hover:text-ink'
          }`}
        >
          SYNOPSIS & ACTIONS
        </button>
        <button
          onClick={() => setActiveTab('EVIDENCE')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
            activeTab === 'EVIDENCE'
              ? 'bg-ink text-porcelain dark:bg-porcelain dark:text-ink font-semibold'
              : 'text-stone hover:text-ink'
          }`}
        >
          EVIDENCE EXHIBITS ({evidenceList.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
            activeTab === 'AUDIT'
              ? 'bg-ink text-porcelain dark:bg-porcelain dark:text-ink font-semibold'
              : 'text-stone hover:text-ink'
          }`}
        >
          AUDIT LOGS ({auditTrail.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-6 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark space-y-4">
            <div className="font-mono text-xs uppercase font-semibold text-stone">
              Case Synopsis & Operational Summary
            </div>
            <p className="text-xs text-stone leading-relaxed">
              {caseData.synopsis}
            </p>

            <div className="pt-3 border-t border-line/60 dark:border-line-dark/60 space-y-2">
              <div className="font-mono text-xs uppercase font-semibold text-stone">
                Complainant Blockchain Origin
              </div>
              <div className="p-3 rounded bg-porcelain dark:bg-night-elevated font-mono text-xs text-stone break-all">
                {caseData.victim_wallet}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark space-y-4">
            <div className="font-mono text-xs uppercase font-semibold text-stone">
              Linked Operational Actions ({actionsList.length})
            </div>
            <div className="space-y-3">
              {actionsList.map((a) => (
                <div key={a.id} className="p-3.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-oxide-red">{a.urgency}</span>
                    <span className="text-stone">{a.id}</span>
                  </div>
                  <div className="font-semibold text-ink dark:text-porcelain">{a.title}</div>
                  <p className="text-stone leading-relaxed">{a.detail}</p>
                  {a.sahyog_ready && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onNavigateToSahyog(a.target_entity, caseData.identified_vasps[0] || 'Binance Global')}
                        className="px-2.5 py-1 rounded font-mono text-[11px] font-semibold text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-colors"
                      >
                        Prepare SAHYOG Notice
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EVIDENCE' && (
        <div className="space-y-3">
          {evidenceList.map((ev) => (
            <div key={ev.id} className="p-4 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-signal-amber">{ev.id} • {ev.title}</span>
                <span className="text-[10px] text-deep-moss dark:text-verdigris font-semibold">
                  ✓ VERIFIED TAMPER-EVIDENT
                </span>
              </div>
              <div className="text-stone">{ev.content_summary}</div>
              <div className="p-2 rounded bg-porcelain dark:bg-night-elevated text-[11px] text-stone break-all">
                REFERENCE: {ev.reference_hash}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="space-y-3">
          {auditTrail.map((log, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-ink dark:text-porcelain">{log.action}</span>
                <span className="text-stone">{log.timestamp}</span>
              </div>
              <div className="text-stone">{log.detail}</div>
              <div className="text-[10px] text-stone/80">ACTOR: {log.actor} ({log.role})</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
