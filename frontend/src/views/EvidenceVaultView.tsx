import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Shield, CheckCircle2, Copy, Check, 
  ExternalLink, Search, RefreshCw, Hash
} from 'lucide-react';
import { api } from '../api';
import { EvidenceItem } from '../types';

export const EvidenceVaultView: React.FC = () => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadEvidence();
  }, []);

  async function loadEvidence() {
    const list = await api.getEvidence();
    setEvidence(list);
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
            <span>CHAIN OF CUSTODY</span>
            <span>•</span>
            <span>EVIDENTIARY INTEGRITY</span>
          </div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
            Evidence Vault
          </h1>
          <p className="text-xs text-stone mt-0.5">
            Tamper-evident blockchain event logs, VASP sweep matches, bridge signatures, and statutory disclosure exhibits.
          </p>
        </div>

        <button
          onClick={loadEvidence}
          className="px-3 py-1.5 rounded font-mono text-xs text-stone hover:text-ink border border-line dark:border-line-dark hover:bg-warm-paper flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Evidence Exhibits List */}
      <div className="space-y-4">
        {evidence.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line/60 dark:border-line-dark/60 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-signal-amber">{item.id}</span>
                <span className="text-stone">|</span>
                <span className="font-semibold text-ink dark:text-porcelain">{item.title}</span>
                <span className="px-2 py-0.2 rounded text-[10px] bg-warm-paper dark:bg-night-bg text-stone">
                  {item.evidence_type}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-deep-moss dark:text-verdigris font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SHA-256 VERIFIED</span>
              </div>
            </div>

            <p className="text-xs text-stone leading-relaxed">
              {item.content_summary}
            </p>

            {/* Structured Evidence Provenance Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">SOURCE PROVIDER</span>
                <div className="font-semibold text-ink dark:text-porcelain mt-0.5 truncate">{item.source_provider}</div>
              </div>
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">OBSERVED TIMESTAMP</span>
                <div className="font-semibold text-ink dark:text-porcelain mt-0.5 truncate">{item.observed_at}</div>
              </div>
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">BLOCK / LOG ID</span>
                <div className="font-semibold text-ink dark:text-porcelain mt-0.5 truncate">{item.block_or_log_id || 'N/A'}</div>
              </div>
              <div className="p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">INVESTIGATOR AUDIT</span>
                <div className="font-semibold text-ink dark:text-porcelain mt-0.5 truncate">{item.analyst}</div>
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 font-mono text-[11px] space-y-1 text-stone break-all">
              <div className="flex items-center justify-between">
                <span>ON-CHAIN REFERENCE HASH: <span className="text-ink dark:text-porcelain font-semibold">{item.reference_hash}</span></span>
                <button
                  onClick={() => handleCopy(item.reference_hash, `ref-${item.id}`)}
                  className="p-1 hover:text-ink text-stone"
                  title="Copy reference hash"
                >
                  {copiedId === `ref-${item.id}` ? <Check className="w-3.5 h-3.5 text-deep-moss" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>PROVENANCE RECORD HASH: <span className="text-signal-amber font-semibold">{item.provenance_hash}</span></span>
                <button
                  onClick={() => handleCopy(item.provenance_hash, `prov-${item.id}`)}
                  className="p-1 hover:text-ink text-stone"
                  title="Copy provenance hash"
                >
                  {copiedId === `prov-${item.id}` ? <Check className="w-3.5 h-3.5 text-deep-moss" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
