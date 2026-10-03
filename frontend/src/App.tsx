import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { CommandPalette } from './components/CommandPalette';
import { HomeView } from './views/HomeView';
import { InvestigateView } from './views/InvestigateView';
import { NetworkView } from './views/NetworkView';
import { CasesView } from './views/CasesView';
import { EvidenceView } from './views/EvidenceView';
import { SahyogView } from './views/SahyogView';
import { AuditView } from './views/AuditView';
import { TrendsView } from './views/TrendsView';
import { api } from './api';

type Tab = 'home' | 'investigate' | 'network' | 'cases' | 'trends' | 'evidence' | 'sahyog' | 'audit';

export function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);

  // Persistent investigation state
  const [activeWallet, setActiveWallet] = useState('0x7a912e84c98f5b89a456102dc840b8a1c97012fe');
  const [selectedCaseId, setSelectedCaseId] = useState('NTR-DEMO-001');
  const [sahyogWallet, setSahyogWallet] = useState('0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be');
  const [sahyogVasp, setSahyogVasp] = useState('Binance Global');
  const [pendingCount, setPendingCount] = useState(3);

  useEffect(() => {
    // Always force light mode — this is a government investigation portal
    document.documentElement.classList.remove('dark');
    document.body.style.background = '#F5F7F9';
  }, []);

  useEffect(() => {
    api.getActions().then(acts => {
      const pending = acts.filter(a => a.status !== 'EXECUTED').length;
      setPendingCount(pending || 3);
    });
  }, []);

  // Handle Ctrl+K globally
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleInvestigateWallet = (address: string) => {
    setActiveWallet(address);
    setCurrentTab('investigate');
  };

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentTab('cases');
  };

  const handleNavigateToSahyog = (wallet: string, vasp: string) => {
    setSahyogWallet(wallet);
    setSahyogVasp(vasp);
    setCurrentTab('sahyog');
  };

  const handleSearchResult = (type: string, id: string) => {
    if (type === '__open') {
      setIsSearchOpen(true);
      return;
    }
    if (type === 'Case') {
      handleOpenCase(id);
    } else if (type === 'Wallet') {
      handleInvestigateWallet(id);
    } else if (type === 'VASP') {
      setCurrentTab('network');
    } else {
      handleInvestigateWallet(id);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans">
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab as Tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        pendingActionsCount={pendingCount}
        onOpenSystemStatus={() => setIsSystemModalOpen(true)}
        sandboxMode={false}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResult}
      />

      {/* System Status Modal */}
      {isSystemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/30">
          <div className="w-full max-w-lg gov-card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-default">
              <h3 className="text-base font-semibold text-text-primary">System &amp; Provider Status</h3>
              <button
                onClick={() => setIsSystemModalOpen(false)}
                className="btn-ghost text-xs"
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Bitquery v2 (GraphQL)', status: 'OPERATIONAL', latency: '18ms' },
                { name: 'Ethereum RPC', status: 'OPERATIONAL', latency: '32ms' },
                { name: 'TronGrid API', status: 'OPERATIONAL', latency: '24ms' },
                { name: 'Bitcoin Core RPC', status: 'OPERATIONAL', latency: '41ms' },
                { name: 'I4C SAHYOG Gateway', status: 'ONLINE', latency: '12ms' },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <span className="text-sm text-text-primary">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-muted">{p.latency}</span>
                    <span className={`badge ${p.status === 'OPERATIONAL' || p.status === 'ONLINE' ? 'badge-green' : 'badge-amber'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border-default text-xs text-text-muted">
              NETRA v2.4.0 · Production LEA Terminal · I4C SAHYOG Official Gateway Active
            </div>
          </div>
        </div>
      )}

      <main className="w-full">
        {currentTab === 'home' && (
          <HomeView
            onNavigateToTab={(tab) => setCurrentTab(tab as Tab)}
            onInvestigateWallet={handleInvestigateWallet}
            onOpenCase={handleOpenCase}
          />
        )}

        {currentTab === 'investigate' && (
          <InvestigateView
            initialWallet={activeWallet}
            onNavigateToSahyog={handleNavigateToSahyog}
            onOpenCase={handleOpenCase}
            onNavigateToNetwork={() => setCurrentTab('network')}
          />
        )}

        {currentTab === 'network' && (
          <NetworkView
            onInvestigateWallet={handleInvestigateWallet}
            onOpenCase={handleOpenCase}
            onNavigateToSahyog={handleNavigateToSahyog}
          />
        )}

        {currentTab === 'cases' && (
          <CasesView
            onInvestigateWallet={handleInvestigateWallet}
            onNavigateToSahyog={handleNavigateToSahyog}
            onOpenReport={(caseId) => {
              setSelectedCaseId(caseId);
              setCurrentTab('evidence');
            }}
          />
        )}

        {currentTab === 'trends' && (
          <TrendsView
            onInvestigateWallet={handleInvestigateWallet}
            onNavigateToCases={() => setCurrentTab('cases')}
          />
        )}

        {currentTab === 'evidence' && (
          <EvidenceView
            onOpenCase={handleOpenCase}
          />
        )}

        {currentTab === 'sahyog' && (
          <SahyogView
            initialWallet={sahyogWallet}
            initialVasp={sahyogVasp}
            onSelectCase={handleOpenCase}
          />
        )}

        {currentTab === 'audit' && (
          <AuditView />
        )}
      </main>
    </div>
  );
}

export default App;
