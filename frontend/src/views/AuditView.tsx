import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Search, Filter, RefreshCw,
  Clock, User, Shield, Network, FileText, CheckCircle,
  ChevronRight, Activity, Lock
} from 'lucide-react';
import { api } from '../api';

const ACTION_ICON: Record<string, React.FC<any>> = {
  VASP_ATTRIBUTION_REVIEWED: Network,
  SAHYOG_DRAFT_PREPARED: Shield,
  EVIDENCE_ADDED: FileText,
  INVESTIGATION_OPENED: ClipboardList,
  WALLET_TRACED: Activity,
  SAHYOG_APPROVED: CheckCircle,
  SAHYOG_SENT: Shield,
  SAHYOG_RESPONSE: CheckCircle,
  REPORT_GENERATED: FileText,
};

const ACTION_COLOR: Record<string, string> = {
  VASP_ATTRIBUTION_REVIEWED: 'text-gov-blue',
  SAHYOG_DRAFT_PREPARED: 'text-status-amber',
  EVIDENCE_ADDED: 'text-status-green',
  INVESTIGATION_OPENED: 'text-text-secondary',
  WALLET_TRACED: 'text-gov-blue',
  SAHYOG_APPROVED: 'text-status-green',
  SAHYOG_SENT: 'text-status-blue',
  SAHYOG_RESPONSE: 'text-status-green',
  REPORT_GENERATED: 'text-text-secondary',
};

// Seed audit data for demo
const SEED_AUDIT = [
  { timestamp: '30 Sep 2026, 22:08:14 IST', actor: 'Insp. V.K. Deshmukh', role: 'INVESTIGATOR', case_id: 'NTR-DEMO-001', action: 'VASP_ATTRIBUTION_REVIEWED', detail: 'Examined Binance Hot Wallet 6 infrastructure cluster attribution notes. Evidence EV-019284 verified.', hash: 'a190284710293847' },
  { timestamp: '30 Sep 2026, 21:50:02 IST', actor: 'SI R. Nair', role: 'INVESTIGATOR', case_id: 'NTR-2041', action: 'SAHYOG_DRAFT_PREPARED', detail: 'Drafted Section 91 CrPC notice for Binance Global user account disclosure.', hash: 'b881293847102941' },
  { timestamp: '30 Sep 2026, 20:15:33 IST', actor: 'System (NETRA)', role: 'SYSTEM', case_id: 'NTR-DEMO-001', action: 'EVIDENCE_ADDED', detail: 'Evidence EV-019285 auto-generated from SAHYOG response. Cross-chain Stargate bridge trace verified.', hash: 'c992837465019284' },
  { timestamp: '30 Sep 2026, 18:44:21 IST', actor: 'ASP M. Gupta', role: 'SUPERVISOR', case_id: 'NTR-DEMO-001', action: 'SAHYOG_APPROVED', detail: 'SAHYOG request SR-DEMO-001 approved for submission to I4C gateway.', hash: 'd001928374650182' },
  { timestamp: '30 Sep 2026, 18:30:08 IST', actor: 'Insp. V.K. Deshmukh', role: 'INVESTIGATOR', case_id: 'NTR-DEMO-001', action: 'SAHYOG_SENT', detail: 'SAHYOG request transmitted to I4C Intermediary Gateway. Acknowledgement ID: I4C-ACK-2026-00194', hash: 'e112029384756019' },
  { timestamp: '29 Sep 2026, 16:22:44 IST', actor: 'System (NETRA)', role: 'SYSTEM', case_id: 'NTR-2041', action: 'WALLET_TRACED', detail: 'Graph expansion completed. 37 new wallet nodes discovered. Consolidation pattern identified.', hash: 'f221938475601928' },
  { timestamp: '28 Sep 2026, 09:15:00 IST', actor: 'Insp. V.K. Deshmukh', role: 'INVESTIGATOR', case_id: 'NTR-DEMO-001', action: 'INVESTIGATION_OPENED', detail: 'New investigation opened for Complaint CP-2026-0841. Primary wallet assigned.', hash: 'a330192847560192' },
  { timestamp: '27 Sep 2026, 14:05:17 IST', actor: 'Insp. V.K. Deshmukh', role: 'INVESTIGATOR', case_id: 'NTR-DEMO-001', action: 'REPORT_GENERATED', detail: 'Forensic investigation report generated for NTR-DEMO-001. Export to PDF completed.', hash: 'b441029384756019' },
];

export const AuditView: React.FC = () => {
  const [auditLog, setAuditLog] = useState<any[]>(SEED_AUDIT);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api.getAudit().then(data => {
      if (data && data.length > 0) setAuditLog(data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const roles = ['ALL', ...Array.from(new Set(auditLog.map(e => e.role)))];
  const cases = ['ALL', ...Array.from(new Set(auditLog.map(e => e.case_id).filter(Boolean)))];

  const filtered = auditLog.filter(e =>
    (roleFilter === 'ALL' || e.role === roleFilter) &&
    (caseFilter === 'ALL' || e.case_id === caseFilter) &&
    (search === '' ||
      e.detail?.toLowerCase().includes(search.toLowerCase()) ||
      e.actor?.toLowerCase().includes(search.toLowerCase()) ||
      e.action?.toLowerCase().includes(search.toLowerCase()))
  );

  const getRoleColor = (role: string) => {
    if (role === 'SUPERVISOR') return 'badge-blue';
    if (role === 'INVESTIGATOR') return 'badge-gray';
    if (role === 'SYSTEM') return 'badge-green';
    return 'badge-gray';
  };

  return (
    <div className="bg-bg-base min-h-screen pb-12">
      {/* Page header */}
      <div className="bg-bg-surface border-b border-border-default">
        <div className="gov-container py-4 flex items-center justify-between">
          <div>
            <div className="section-label mb-1">Audit</div>
            <h1 className="text-xl font-bold text-text-primary">Audit &amp; Activity Log</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Immutable, SHA-256 hash-chained audit trail of all investigation actions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-status-green-bg border border-status-green/20 text-2xs font-mono font-semibold text-status-green">
              <Lock className="w-3 h-3" /> SHA-256 CHAINED
            </div>
            <button
              onClick={() => api.getAudit().then(d => { if (d?.length) setAuditLog(d); })}
              className="btn-secondary text-xs flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="gov-container py-6 space-y-4">

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Events', value: auditLog.length },
            { label: 'Investigators', value: new Set(auditLog.filter(e => e.role === 'INVESTIGATOR').map(e => e.actor)).size },
            { label: 'Cases Tracked', value: new Set(auditLog.map(e => e.case_id).filter(Boolean)).size },
          ].map(stat => (
            <div key={stat.label} className="gov-card p-4">
              <div className="section-label mb-1">{stat.label}</div>
              <div className="text-2xl font-semibold text-text-primary">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit log..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-8 text-xs py-1.5"
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="form-select text-xs py-1.5 w-auto">
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={caseFilter} onChange={e => setCaseFilter(e.target.value)} className="form-select text-xs py-1.5 w-auto">
            {cases.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Audit log table */}
        <div className="gov-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Case</th>
                <th>Action</th>
                <th>Detail</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, i) => {
                const Icon = ACTION_ICON[event.action] || Activity;
                const color = ACTION_COLOR[event.action] || 'text-text-secondary';
                return (
                  <tr key={i}>
                    <td>
                      <span className="font-mono text-2xs text-text-muted whitespace-nowrap">{event.timestamp}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-text-muted shrink-0" />
                        <span className="text-xs font-medium text-text-primary">{event.actor}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleColor(event.role)}`}>{event.role}</span>
                    </td>
                    <td>
                      <span className="font-mono text-2xs font-bold text-gov-blue">{event.case_id || '—'}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${color} shrink-0`} />
                        <span className="text-2xs font-mono text-text-secondary whitespace-nowrap">{event.action}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-text-secondary max-w-[300px] line-clamp-2">{event.detail}</div>
                    </td>
                    <td>
                      <span className="font-mono text-2xs text-text-muted">{event.hash?.slice(0, 12)}...</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-text-muted">
                    No audit events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Integrity note */}
        <div className="flex items-center gap-2 p-3 bg-status-green-bg border border-status-green/20 rounded text-xs text-status-green font-medium">
          <Lock className="w-4 h-4 shrink-0" />
          This audit log is cryptographically chained with SHA-256 hashes. Any tampering with an entry invalidates all subsequent records.
        </div>
      </div>
    </div>
  );
};
