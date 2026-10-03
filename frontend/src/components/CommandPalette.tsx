import React, { useState, useEffect, useRef } from 'react';
import { Search, Briefcase, Network, Shield, FileText, X, ArrowRight, Clock } from 'lucide-react';
import { api } from '../api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, id: string) => void;
}

const QUICK_ACCESS = [
  { type: 'Case', id: 'NTR-DEMO-001', label: 'NTR-DEMO-001 — Pune Investment Fraud FIR 412/2026', icon: Briefcase },
  { type: 'Case', id: 'NTR-2041', label: 'NTR-2041 — Cross-border USDT mule network', icon: Briefcase },
  { type: 'Wallet', id: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe', label: 'Primary Mule Alpha — 0x7a91...12fe', icon: Network },
  { type: 'Wallet', id: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be', label: 'Consolidator Mule — 0x3f5c...f0be', icon: Network },
  { type: 'VASP', id: 'vasp-binance-global', label: 'Binance Global — FIU-IND/VDA/BIN/2024/09', icon: Shield },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) onSelectResult('__open', '');
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      const res = await api.search(query);
      setResults(res?.matches || []);
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  const displayItems = query.trim() ? results : QUICK_ACCESS;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-text-primary/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-bg-surface border border-border-default rounded-lg shadow-elevated animate-fade-in overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search wallet, transaction, VASP, case or complaint..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline text-2xs font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border-default text-text-muted">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-2 border-b border-border-subtle">
              <span className="text-2xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3 h-3" /> Quick Access
              </span>
            </div>
          )}
          {isLoading && (
            <div className="px-4 py-3 text-sm text-text-muted text-center">Searching...</div>
          )}
          {displayItems.map((item, i) => {
            const Icon = item.icon || Network;
            return (
              <button
                key={i}
                onClick={() => { onSelectResult(item.type, item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary text-left transition-colors"
              >
                <div className="w-7 h-7 rounded border border-border-default bg-bg-elevated flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-primary font-medium truncate">{item.label}</div>
                  <div className="text-2xs text-text-muted font-mono truncate">{item.id}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="badge badge-gray">{item.type}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </div>
              </button>
            );
          })}
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              No results for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border-subtle bg-bg-secondary flex items-center justify-between">
          <div className="flex items-center gap-3 text-2xs text-text-muted">
            <span><kbd className="font-mono bg-bg-elevated border border-border-default px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-bg-elevated border border-border-default px-1 rounded">↵</kbd> Select</span>
          </div>
          <div className="demo-mode-banner">DEMO DATA</div>
        </div>
      </div>
    </div>
  );
};
