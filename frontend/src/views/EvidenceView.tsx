import React, { useState, useEffect } from 'react';
import {
  FileText, Shield, Search, Download, CheckCircle,
  AlertCircle, Clock, Package, ExternalLink, RefreshCw,
  Filter, ChevronRight, Database, Link
} from 'lucide-react';
import { api } from '../api';
import { EvidenceItem } from '../types';

interface EvidenceViewProps {
  onOpenCase?: (caseId: string) => void;
}

const EVIDENCE_TYPE_BADGE: Record<string, string> = {
  'BLOCKCHAIN_TRANSACTION': 'badge-blue',
  'WALLET_OBSERVATION': 'badge-blue',
  'GRAPH_TRACE': 'badge-blue',
  'VASP_ATTRIBUTION': 'badge-green',
  'RISK_ASSESSMENT': 'badge-amber',
  'SAHYOG_RESPONSE': 'badge-green',
  'TYPOLOGY_DETECTION': 'badge-amber',
  'THREAT_INTEL': 'badge-red',
};

export const EvidenceView: React.FC<EvidenceViewProps> = ({ onOpenCase }) => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<EvidenceItem | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    api.getEvidence().then(ev => {
      setEvidence(ev);
      if (ev.length > 0) setSelected(ev[0]);
      setIsLoading(false);
    });
  }, []);

  const types = ['ALL', ...Array.from(new Set(evidence.map(e => e.evidence_type)))];

  const filtered = evidence.filter(e =>
    (typeFilter === 'ALL' || e.evidence_type === typeFilter) &&
    (search === '' ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.case_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-bg-base min-h-screen">
      {/* Page header */}
      <div className="bg-bg-surface border-b border-border-default">
        <div className="gov-container py-4 flex items-center justify-between">
          <div>
            <div className="section-label mb-1">Evidence Management</div>
            <h1 className="text-xl font-bold text-text-primary">Evidence Vault &amp; Court Exhibits</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Section 65B Indian Evidence Act compliant cryptographic custody vault.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-green font-mono">SHA-256 VERIFIED</span>
            <button className="btn-secondary text-xs flex items-center gap-1.5 shadow-xs">
              <Download className="w-3.5 h-3.5" /> Export Court Package
            </button>
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="bg-bg-secondary border-b border-border-default">
        <div className="gov-container py-3 flex items-center gap-6">
          {[
            { label: 'Total Evidence Exhibits', value: evidence.length, icon: Database },
            { label: 'Tamper-Evident Verified', value: evidence.filter(e => e.verified_tamper_evident).length, icon: CheckCircle },
            { label: 'Linked FIR Dockets', value: new Set(evidence.map(e => e.case_id)).size, icon: FileText },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-bold text-text-primary font-mono">{stat.value}</span>
                <span className="text-xs text-text-muted">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="gov-container py-6">
        <div className="flex gap-5" style={{ minHeight: 'calc(100vh - 240px)' }}>
          {/* Left: Evidence list */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search evidence..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-input pl-8 text-xs py-1.5"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="form-select text-xs py-1.5 w-auto"
              >
                {types.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>

            {/* Evidence table */}
            <div className="gov-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Evidence ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Case</th>
                    <th>Chain</th>
                    <th>Source</th>
                    <th>Observed</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={8} className="text-center py-8 text-text-muted text-sm">Loading evidence...</td></tr>
                  ) : filtered.map(ev => (
                    <tr
                      key={ev.id}
                      onClick={() => setSelected(ev)}
                      className={selected?.id === ev.id ? 'bg-gov-blue-light' : ''}
                    >
                      <td>
                        <span className="font-mono text-2xs font-bold text-gov-blue">{ev.id}</span>
                      </td>
                      <td>
                        <div className="text-xs font-medium max-w-[200px] truncate">{ev.title}</div>
                      </td>
                      <td>
                        <span className={`badge ${EVIDENCE_TYPE_BADGE[ev.evidence_type] || 'badge-gray'}`}>
                          {ev.evidence_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={e => { e.stopPropagation(); onOpenCase?.(ev.case_id); }}
                          className="font-mono text-2xs font-bold text-gov-blue hover:underline"
                        >
                          {ev.case_id}
                        </button>
                      </td>
                      <td className="text-xs text-text-muted">{ev.chain}</td>
                      <td className="text-xs text-text-muted">{ev.source_provider}</td>
                      <td className="text-xs text-text-muted">{ev.observed_at}</td>
                      <td>
                        {ev.verified_tamper_evident
                          ? <CheckCircle className="w-4 h-4 text-status-green" />
                          : <AlertCircle className="w-4 h-4 text-text-disabled" />
                        }
                      </td>
                    </tr>
                  ))}
                  {!isLoading && filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-text-muted text-sm">No evidence found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Evidence detail */}
          {selected && (
            <div className="w-72 shrink-0 space-y-4">
              <div className="gov-card p-4">
                <div className="section-label mb-2">Evidence Detail</div>
                <div className="font-mono text-xs font-bold text-gov-blue mb-2">{selected.id}</div>
                <div className="font-medium text-text-primary text-sm mb-1">{selected.title}</div>

                <div className="space-y-2.5 mt-3 text-xs">
                  {[
                    ['Case ID', selected.case_id],
                    ['Type', selected.evidence_type.replace(/_/g, ' ')],
                    ['Chain', selected.chain],
                    ['Source', selected.source_provider],
                    ['Observed', selected.observed_at],
                    ['Analyst', selected.analyst],
                    ['Block / Log', selected.block_or_log_id || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-text-muted">{k}</span>
                      <span className="font-medium text-text-primary text-right max-w-[140px] truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Tamper-evident status */}
                <div className={`flex items-center gap-2 mt-3 p-2.5 rounded text-xs font-medium ${
                  selected.verified_tamper_evident
                    ? 'bg-status-green-bg text-status-green'
                    : 'bg-bg-elevated text-text-muted'
                }`}>
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  {selected.verified_tamper_evident
                    ? 'SHA-256 Verified — Tamper-Evident'
                    : 'Not yet verified'
                  }
                </div>
              </div>

              {/* Content summary */}
              <div className="gov-card p-4">
                <div className="section-label mb-2">Summary</div>
                <p className="text-xs text-text-secondary leading-relaxed">{selected.content_summary}</p>
              </div>

              {/* Reference hash */}
              <div className="gov-card p-4">
                <div className="section-label mb-2">Provenance Hash</div>
                <div className="font-mono text-2xs text-text-muted break-all leading-relaxed">{selected.provenance_hash || selected.reference_hash}</div>
              </div>

              <div className="gov-card p-4 space-y-2">
                <button className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export Evidence
                </button>
                <button className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Attach to SAHYOG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
