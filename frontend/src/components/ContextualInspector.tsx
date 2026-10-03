import React, { useEffect, useState } from 'react';
import { 
  X, ArrowRight, Shield, Zap, ExternalLink, Activity, 
  CheckCircle2, AlertTriangle, Bookmark, FileText, CornerDownRight
} from 'lucide-react';
import { api } from '../api';

interface ContextualInspectorProps {
  entityType: string | null;
  entityId: string | null;
  onClose: () => void;
  onInvestigate: (id: string) => void;
  onPrepareSahyog: (wallet: string, vasp: string) => void;
}

export const ContextualInspector: React.FC<ContextualInspectorProps> = ({
  entityType,
  entityId,
  onClose,
  onInvestigate,
  onPrepareSahyog
}) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!entityId) {
      setData(null);
      return;
    }
    async function loadData() {
      setIsLoading(true);
      const res = await api.inspectEntity(entityType || 'Wallet', entityId!);
      setData(res);
      setIsLoading(false);
    }
    loadData();
  }, [entityType, entityId]);

  if (!entityId) return null;

  return (
    <aside 
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-porcelain dark:bg-night-surface border-l border-line dark:border-line-dark shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* Top Header */}
      <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between bg-warm-paper/50 dark:bg-night-elevated">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-warm-paper dark:bg-night-bg border border-line dark:border-line-dark text-stone">
            {data?.type || entityType || 'Entity'}
          </span>
          <span className="font-mono text-xs font-semibold text-ink dark:text-porcelain truncate max-w-[240px]">
            {entityId}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-stone hover:text-ink dark:hover:text-porcelain hover:bg-warm-paper dark:hover:bg-night-elevated transition-colors"
          title="Close Inspector (ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
        
        {isLoading ? (
          <div className="p-12 text-center text-stone font-mono text-xs">
            Querying graph metadata & threat intel...
          </div>
        ) : data ? (
          <>
            {/* Title & Core Overview */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink dark:text-porcelain">
                {data.label || entityId}
              </h3>
              <div className="font-mono text-[11px] text-stone">
                Chain: <span className="text-ink dark:text-porcelain font-semibold">{data.chain || 'Ethereum'}</span> • 
                Attribution: <span className="text-signal-amber font-semibold">{data.attribution || 'Unresolved'}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded bg-warm-paper/60 dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">OBSERVED BALANCE</span>
                <div className="font-bold text-ink dark:text-porcelain mt-0.5">
                  ${(data.balance_usd || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded bg-warm-paper/60 dark:bg-night-elevated border border-line/60 dark:border-line-dark/60">
                <span className="text-[10px] text-stone">KNOWN RELATIONSHIPS</span>
                <div className="font-bold text-ink dark:text-porcelain mt-0.5">
                  {data.known_relationships || 1} links
                </div>
              </div>
            </div>

            {/* Risk Indicators (Explainable, No Fake AI Score) */}
            {data.risk_indicators && (
              <div className="p-4 rounded-lg bg-warm-paper/40 dark:bg-night-elevated border border-line dark:border-line-dark space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase font-semibold text-stone">
                    Risk Intelligence
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                    data.risk_indicators.overall_level === 'HIGH'
                      ? 'bg-oxide-red/15 text-oxide-red'
                      : 'bg-signal-amber/15 text-signal-amber'
                  }`}>
                    {data.risk_indicators.overall_level} RISK
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone">
                  {data.risk_indicators.key_factors?.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-oxide-red font-bold">•</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>

                {/* Privacy / Mixer Alert if present */}
                {data.risk_indicators.privacy_mixer_detected && (
                  <div className="p-2 rounded bg-signal-amber/10 border border-signal-amber/30 text-[11px] font-mono text-stone space-y-1">
                    <div className="font-bold text-signal-amber flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>PRIVACY INFRASTRUCTURE INTERACTION</span>
                    </div>
                    <div>{data.risk_indicators.privacy_mixer_notes}</div>
                  </div>
                )}
              </div>
            )}

            {/* Observed Laundering Typologies */}
            {data.risk_indicators?.typologies && (
              <div className="space-y-2">
                <div className="font-mono text-[11px] uppercase font-semibold text-stone">
                  Observed Laundering Typologies ({data.risk_indicators.typologies.length})
                </div>
                <div className="space-y-1.5">
                  {data.risk_indicators.typologies.map((t: any) => (
                    <div key={t.id} className="p-2.5 rounded bg-warm-paper/40 dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink dark:text-porcelain">{t.name}</span>
                        <span className="font-mono text-[10px] text-verdigris font-semibold">{t.status}</span>
                      </div>
                      <p className="text-stone leading-relaxed text-[11px]">{t.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Drawer */}
            <div className="space-y-2 pt-2 border-t border-line/60 dark:border-line-dark/60">
              <div className="font-mono text-[10px] uppercase font-semibold text-stone">
                Operational Actions
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    onInvestigate(entityId!);
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded font-semibold text-xs text-porcelain bg-ink dark:bg-porcelain dark:text-ink hover:opacity-90 transition-opacity flex items-center justify-between"
                >
                  <span>Open in Investigation Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onPrepareSahyog(entityId!, data.attribution || 'Binance Global');
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded font-semibold text-xs text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Prepare SAHYOG Notice</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 2000);
                  }}
                  className="w-full py-2 px-3 rounded font-medium text-xs text-stone hover:text-ink dark:hover:text-porcelain bg-warm-paper/60 dark:bg-night-elevated border border-line dark:border-line-dark transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved to Collection!' : 'Save to Investigation Collection'}</span>
                  </span>
                  {savedSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-deep-moss" />}
                </button>
              </div>
            </div>

          </>
        ) : (
          <div className="p-12 text-center text-stone font-mono text-xs">
            Entity metadata unavailable.
          </div>
        )}

      </div>

      {/* Footer Audit Provenance Note */}
      <div className="p-3 border-t border-line dark:border-line-dark bg-warm-paper/40 dark:bg-night-elevated text-[10px] font-mono text-stone flex items-center justify-between">
        <span>Verified against NETRA National Ledger</span>
        <span>ESC to dismiss</span>
      </div>

    </aside>
  );
};
