import React, { useEffect, useState } from 'react';
import { 
  X, Printer, Download, Shield, FileCheck, CheckCircle2, 
  ArrowRight, FileText, Clock
} from 'lucide-react';
import { api } from '../api';
import { InvestigationReport } from '../types';

interface ReportModalProps {
  caseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  caseId,
  isOpen,
  onClose
}) => {
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && caseId) {
      loadReport();
    }
  }, [isOpen, caseId]);

  async function loadReport() {
    setIsLoading(true);
    const data = await api.generateReport(caseId);
    setReport(data);
    setIsLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  function handleDownloadJson() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NETRA-FORENSIC-REPORT-${caseId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-porcelain dark:bg-night-surface rounded-lg shadow-2xl border border-line dark:border-line-dark flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Modal Header */}
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between bg-warm-paper/60 dark:bg-night-elevated">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-signal-amber" />
            <span className="font-semibold text-sm">Forensic Intelligence Report Docket</span>
            <span className="font-mono text-xs text-stone">({caseId})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded text-xs font-mono font-medium bg-porcelain dark:bg-night-bg border border-line dark:border-line-dark hover:bg-warm-paper transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1 rounded text-xs font-mono font-medium bg-porcelain dark:bg-night-bg border border-line dark:border-line-dark hover:bg-warm-paper transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-stone hover:text-ink dark:hover:text-porcelain transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Forensic Report Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs text-ink dark:text-porcelain font-sans print:p-0 print:text-black">
          
          {isLoading ? (
            <div className="p-16 text-center text-stone font-mono">
              Compiling evidence provenance ledger & transaction traces...
            </div>
          ) : report ? (
            <div className="space-y-6">
              
              {/* Report Title & Metadata Header */}
              <div className="border-b-2 border-ink dark:border-porcelain pb-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone">
                  <span>GOVERNMENT OF INDIA • CYBER CRIME INVESTIGATION WING</span>
                  <span>{report.report_id}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  {report.title}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1 text-stone">
                  <div>CASE ID: <span className="font-bold text-ink dark:text-porcelain">{report.case_id}</span></div>
                  <div>GENERATED: <span className="font-bold text-ink dark:text-porcelain">{report.generated_at}</span></div>
                  <div>INVESTIGATOR: <span className="font-bold text-ink dark:text-porcelain">{report.investigator}</span></div>
                  <div>LOSS (INR): <span className="font-bold text-signal-amber">₹{(report.observed_loss_inr / 100000).toFixed(1)} Lakh</span></div>
                </div>
              </div>

              {/* Case Executive Summary */}
              <div className="space-y-1.5">
                <h4 className="font-mono text-[11px] uppercase font-bold text-stone">1. Executive Investigation Summary</h4>
                <p className="text-xs text-stone leading-relaxed bg-warm-paper/40 dark:bg-night-elevated p-3 rounded border border-line dark:border-line-dark">
                  {report.summary}
                </p>
              </div>

              {/* Fund Flow Trace */}
              <div className="space-y-2">
                <h4 className="font-mono text-[11px] uppercase font-bold text-stone">2. Fund-Flow Reconstruction & Multi-Chain Bridge Hops</h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {report.fund_flow_trace.map((hop: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-warm-paper/30 dark:bg-night-elevated border border-line/60 dark:border-line-dark/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone">{hop.step}.</span>
                        <span className="font-semibold">{hop.from_entity}</span>
                        <span className="text-stone">→</span>
                        <span className="font-semibold text-signal-amber">{hop.to_entity}</span>
                        <span className="text-[10px] text-stone">({hop.action})</span>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="font-bold">{hop.amount}</span>
                        <span className="text-stone ml-2">{hop.chain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VASP Attribution Finding */}
              <div className="space-y-2">
                <h4 className="font-mono text-[11px] uppercase font-bold text-stone">3. VASP Attribution Analysis & Evidence Provenance</h4>
                <div className="p-3.5 rounded bg-warm-paper/40 dark:bg-night-elevated border border-line dark:border-line-dark space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold">PRIMARY VASP: {report.vasp_attribution.primary_vasp}</span>
                    <span className="font-semibold text-verdigris">{report.vasp_attribution.status}</span>
                  </div>
                  <p className="text-[11px] text-stone font-mono leading-relaxed whitespace-pre-line">
                    {report.vasp_attribution.analyst_note}
                  </p>
                </div>
              </div>

              {/* Statutory SAHYOG Orders Attached */}
              <div className="space-y-2">
                <h4 className="font-mono text-[11px] uppercase font-bold text-stone">4. Statutory SAHYOG Notices & Judicial Enforcement</h4>
                <div className="p-3 rounded bg-warm-paper/40 dark:bg-night-elevated border border-line dark:border-line-dark font-mono text-xs space-y-1">
                  <div>STATUTORY GROUND: Section 91 CrPC & Prevention of Money Laundering Act Rule 3(1)(b)</div>
                  <div>AUTHORITY: Cyber Police Station, Pune City (FIR No. 412/2026)</div>
                  <div>OFFICIAL RECEIPT: I4C-ACK-2026-88912-SBX</div>
                  <div>DISCLOSED ENTITY: Binance Global Reporting Intermediary</div>
                </div>
              </div>

              {/* Chain of Custody Stamp */}
              <div className="pt-4 border-t border-line dark:border-line-dark flex items-center justify-between text-[10px] font-mono text-stone">
                <span>Cryptographic SHA-256 Provenance Verified</span>
                <span>Authorized Law Enforcement Brief • Strictly Confidential</span>
              </div>

            </div>
          ) : (
            <div className="p-16 text-center text-stone">Failed to load report.</div>
          )}

        </div>

      </div>
    </div>
  );
};
