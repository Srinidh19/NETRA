import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, AlertTriangle, Send, RefreshCw, 
  FileText, Lock, Key, ArrowRight, CornerDownRight, Check
} from 'lucide-react';
import { api } from '../api';
import { SahyogRequest } from '../types';

interface SahyogStudioViewProps {
  initialWallet?: string;
  initialVasp?: string;
  onSelectCase: (caseId: string) => void;
  onNavigateToEvidence: () => void;
}

export const SahyogStudioView: React.FC<SahyogStudioViewProps> = ({
  initialWallet = '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
  initialVasp = 'Binance Global',
  onSelectCase,
  onNavigateToEvidence
}) => {
  const [requests, setRequests] = useState<SahyogRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [targetWallet, setTargetWallet] = useState(initialWallet);
  const [targetVasp, setTargetVasp] = useState(initialVasp);
  const [requestType, setRequestType] = useState('DISCLOSURE');
  const [caseId, setCaseId] = useState('NTR-DEMO-001');
  const [authority, setAuthority] = useState('Cyber Police Station, Pune City');
  const [observations, setObservations] = useState(
    'Identified rapid fan-in consolidation of 18.25 ETH into Binance deposit infrastructure (0x28c6c0...6e13) linked to FIR 412/2026. Immediate Section 91 CrPC disclosure required.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<any | null>(null);
  const [prodModeWarning, setProdModeWarning] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const list = await api.getSahyogRequests();
    setRequests(list);
    if (list.length > 0) {
      setSelectedRequest(list[0]);
    }
  }

  async function handleCreateAndSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create request in sandbox
      const createRes = await fetch('http://127.0.0.1:8000/api/sahyog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseId,
          request_type: requestType,
          vasp_id: targetVasp.toLowerCase().includes('binance') ? 'vasp-binance-global' : 'vasp-coindcx-india',
          vasp_name: targetVasp,
          target_wallet: targetWallet,
          chain: 'Ethereum',
          priority: 'CRITICAL_FRAUD',
          competent_authority: authority,
          observations: observations
        })
      });
      const newReq = await createRes.json();

      // 2. Submit request through authorized sandbox adapter
      const subRes = await api.submitSahyogRequest(newReq.id);
      setLastSubmissionResult(subRes);
      await loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* OFFICIAL LEA STATUTORY HEADER */}
      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              I4C SAHYOG INTERMEDIARY GATEWAY · LEA PRODUCTION CHANNEL
            </span>
            <p className="text-stone dark:text-stone/90 mt-0.5">
              Statutory requisition portal connecting Law Enforcement Agencies with FIU-IND registered crypto exchanges, payment gateways, and banking intermediaries under Section 91 CrPC.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            GATEWAY ONLINE
          </span>
        </div>
      </div>

      {/* Production Keys Warning Modal */}
      {prodModeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-lg bg-porcelain dark:bg-night-surface border border-line dark:border-line-dark shadow-elevated space-y-4">
            <div className="flex items-center gap-2 font-mono font-semibold text-oxide-red">
              <Lock className="w-4 h-4" />
              <span>Production Credentials Guardrail</span>
            </div>
            <p className="text-xs text-stone leading-relaxed">
              In accordance with Section 24 of the specification, NETRA does NOT spoof or invent government endpoints. Production operation requires authorized mTLS certificates (<span className="font-mono">SAHYOG_CERTIFICATE</span>, <span className="font-mono">SAHYOG_PRIVATE_KEY</span>) issued by the Indian Cyber Crime Coordination Centre (I4C).
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setProdModeWarning(false)}
                className="px-3 py-1.5 rounded font-mono text-xs bg-ink dark:bg-porcelain text-porcelain dark:text-ink font-semibold"
              >
                Acknowledge &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: REQUEST BUILDER (5 COLS) */}
        <div className="lg:col-span-5 p-6 rounded-lg bg-warm-paper/60 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-5">
          <div className="pb-3 border-b border-line dark:border-line-dark">
            <span className="font-mono text-xs uppercase font-semibold text-stone">
              Statutory Notice Generator
            </span>
            <h2 className="text-lg font-semibold text-ink dark:text-porcelain mt-0.5">
              Prepare Intermediary Notice
            </h2>
          </div>

          <form onSubmit={handleCreateAndSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-mono text-[11px] text-stone uppercase block mb-1">
                Investigation Case ID
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark font-mono text-xs outline-none focus:border-signal-amber"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-stone uppercase block mb-1">
                Statutory Ground / Provision
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark font-sans text-xs outline-none focus:border-signal-amber"
              >
                <option value="DISCLOSURE">Section 91 CrPC — Intermediary Account Disclosure</option>
                <option value="ASSET_FREEZE">Section 102 CrPC — Emergency Asset Freeze</option>
                <option value="ASSET_TRACKING">Rule 3(1)(b) PMLA — Continuous Origin Tracking</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[11px] text-stone uppercase block mb-1">
                Target VASP Reporting Intermediary
              </label>
              <input
                type="text"
                value={targetVasp}
                onChange={(e) => setTargetVasp(e.target.value)}
                className="w-full p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark font-sans text-xs outline-none focus:border-signal-amber"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-stone uppercase block mb-1">
                Identified Deposit / Hot Wallet
              </label>
              <input
                type="text"
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.target.value)}
                className="w-full p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark font-mono text-xs outline-none focus:border-signal-amber"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-stone uppercase block mb-1">
                Competent Law Enforcement Authority
              </label>
              <input
                type="text"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark font-sans text-xs outline-none focus:border-signal-amber"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-stone uppercase block mb-1">
                Investigative Observations & Evidence Summary
              </label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full p-2.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark font-sans text-xs outline-none focus:border-signal-amber resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded font-semibold text-xs text-porcelain bg-signal-amber hover:bg-signal-amber/90 transition-all flex items-center justify-center gap-2 shadow-subtle cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting to SAHYOG Gateway...' : 'Submit to SAHYOG Intermediary Gateway'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: LIVE ACKNOWLEDGMENT & FEEDBACK LOOP (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Submission Feedback Card */}
          {lastSubmissionResult && (
            <div className="p-5 rounded-lg bg-verdigris/10 border border-verdigris/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-semibold text-deep-moss dark:text-verdigris flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-verdigris" />
                  Official Acknowledgment Received
                </span>
                <span className="font-mono text-[10px] text-stone">
                  {lastSubmissionResult.acknowledgement_id}
                </span>
              </div>

              <div className="p-3 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark text-xs font-mono space-y-1.5">
                <div>KYC NAME: <span className="font-bold text-ink dark:text-porcelain">{lastSubmissionResult.response.kyc_name_masked}</span></div>
                <div>KYC PAN: <span className="font-bold text-ink dark:text-porcelain">{lastSubmissionResult.response.kyc_pan_masked}</span></div>
                <div>ASSOCIATED UPI: <span className="font-bold text-signal-amber">{lastSubmissionResult.response.associated_upi_vpa}</span></div>
                <div>BANK IFSC: <span className="font-bold text-ink dark:text-porcelain">{lastSubmissionResult.response.associated_bank_ifsc}</span></div>
                <div>FROZEN ASSETS: <span className="font-bold text-deep-moss dark:text-verdigris">{lastSubmissionResult.response.frozen_asset_amount}</span></div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-[11px] text-deep-moss dark:text-verdigris font-semibold">
                  ✓ Recorded as Verified Evidence ({lastSubmissionResult.new_evidence_id})
                </span>
                <button
                  onClick={onNavigateToEvidence}
                  className="font-mono text-xs font-semibold text-signal-amber hover:underline flex items-center gap-1"
                >
                  <span>Inspect in Evidence Vault</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Existing SAHYOG Notices Docket */}
          <div className="p-5 rounded-lg bg-warm-paper/40 dark:bg-night-surface border border-line dark:border-line-dark shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
              <div>
                <h3 className="text-sm font-semibold">Registered SAHYOG Notices</h3>
                <p className="text-xs text-stone">Docket of issued statutory notices and VASP acknowledgments.</p>
              </div>
              <button
                onClick={loadRequests}
                className="text-stone hover:text-ink transition-colors p-1"
                title="Refresh docket"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded bg-porcelain dark:bg-night-elevated border border-line dark:border-line-dark text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-ink dark:text-porcelain">{req.id}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-verdigris/15 text-deep-moss dark:text-verdigris">
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-stone">
                    <div>CASE: <span className="font-semibold text-ink dark:text-porcelain">{req.case_id}</span></div>
                    <div>VASP: <span className="font-semibold text-ink dark:text-porcelain">{req.vasp_name}</span></div>
                    <div className="col-span-2 truncate">TARGET: <span className="font-semibold">{req.target_wallet}</span></div>
                  </div>

                  <div className="text-[11px] text-stone pt-1 border-t border-line/40 dark:border-line-dark/40 flex items-center justify-between">
                    <span>ACK: <span className="font-mono font-medium">{req.acknowledgement_id || 'PENDING'}</span></span>
                    <span>{req.submission_timestamp}</span>
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
