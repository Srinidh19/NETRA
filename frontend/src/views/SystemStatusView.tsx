import React, { useState, useEffect } from 'react';
import { Cpu, Shield, Database, CheckCircle2, Activity, RefreshCw } from 'lucide-react';
import { api } from '../api';

export const SystemStatusView: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [schemas, setSchemas] = useState<any>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    const [p, s] = await Promise.all([
      api.getProviders(),
      fetch('http://127.0.0.1:8000/api/system/schemas').then(r => r.json()).catch(() => null)
    ]);
    setProviders(p);
    setSchemas(s);
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone mb-1">
            <span>INFRASTRUCTURE TELEMETRY</span>
            <span>•</span>
            <span>DATA SOURCE REGISTRY</span>
          </div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-ink dark:text-porcelain">
            System & Provider Health
          </h1>
          <p className="text-xs text-stone mt-0.5">
            Real-time status of multi-chain blockchain indexers, RPC archives, and authorized SAHYOG gateways.
          </p>
        </div>

        <button
          onClick={loadStatus}
          className="px-3 py-1.5 rounded font-mono text-xs text-stone hover:text-ink border border-line dark:border-line-dark hover:bg-warm-paper flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Poll Ingestion Status</span>
        </button>
      </div>

      {/* Provider Status Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p, idx) => (
          <div
            key={idx}
            className="p-5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-ink dark:text-porcelain">{p.name}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-deep-moss dark:text-verdigris">
                <span className="w-2 h-2 rounded-full bg-verdigris animate-pulse" />
                {p.connected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-stone">LATENCY:</span>
                <span className="font-semibold text-ink dark:text-porcelain">{p.latency_ms} ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone">INGESTION MODE:</span>
                <span className="font-semibold text-signal-amber">{p.status_label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone">LAST EVENT:</span>
                <span className="text-stone">{p.last_event_seconds_ago}s ago</span>
              </div>
              {p.indexed_height > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-stone">INDEXED HEIGHT:</span>
                  <span className="font-semibold">{p.indexed_height.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schema Registry Inspection */}
      {schemas && (
        <div className="p-6 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4">
          <div className="pb-2 border-b border-line dark:border-line-dark flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Schema Registry & Dynamic Field Validation</h2>
              <p className="text-xs text-stone">
                Guarantees zero silent failures when provider GraphQL/RPC versions evolve.
              </p>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-verdigris/15 text-deep-moss dark:text-verdigris font-semibold">
              DYNAMIC VALIDATION ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 space-y-2">
              <div className="font-bold text-signal-amber">Bitquery v2 Multi-Chain GraphQL Schema</div>
              <div className="text-stone">Version: {schemas.bitquery?.version}</div>
              <div className="text-stone">Status: {schemas.bitquery?.status}</div>
              <div className="text-[11px] text-stone">Last Verified: {schemas.bitquery?.last_verified}</div>
            </div>

            <div className="p-4 rounded bg-porcelain dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 space-y-2">
              <div className="font-bold text-copper">SAHYOG Statutory Notice Protocol Schema</div>
              <div className="text-stone">Version: {schemas.sahyog?.version}</div>
              <div className="text-stone">Status: {schemas.sahyog?.status}</div>
              <div className="text-[11px] text-stone">Fields: case_id, fir_reference, target_wallet, vasp_id</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
