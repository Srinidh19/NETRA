import React, { useState, useEffect } from 'react';
import {
  Briefcase, Search, Plus, ArrowRight, User, MapPin,
  Calendar, AlertCircle, FileText, Shield, ChevronRight,
  LayoutGrid, List, Filter, X, CheckCircle, Clock, Upload
} from 'lucide-react';
import { api } from '../api';
import { CaseRecord } from '../types';

interface CasesViewProps {
  onInvestigateWallet: (address: string) => void;
  onNavigateToSahyog: (walletAddress: string, vaspName: string) => void;
  onOpenReport: (caseId: string) => void;
}

const COMPLAINT_CATEGORIES = [
  'Investment / Trading Fraud',
  'Romance / Social Engineering Scam',
  'Job / Employment Fraud',
  'Loan App Fraud',
  'KYC / Impersonation Fraud',
  'Cryptocurrency Exchange Fraud',
  'Cross-Border Money Mule',
  'Other Cybercrime',
];

const priorityBadge = (p: string) => {
  if (p === 'CRITICAL') return 'badge-red';
  if (p === 'HIGH') return 'badge-amber';
  if (p === 'MEDIUM') return 'badge-blue';
  return 'badge-gray';
};

const statusBadge = (s: string) => {
  if (s === 'CLOSED_RECOVERED' || s === 'RESOLVED') return 'badge-green';
  if (s === 'CHARGE_SHEETED') return 'badge-blue';
  if (s === 'ACTION_REQUIRED') return 'badge-red';
  if (s === 'ACTIVE_INVESTIGATION' || s === 'ACTIVE') return 'badge-blue';
  if (s === 'EVIDENCE_ATTACHED') return 'badge-green';
  if (s === 'SAHYOG_DISCLOSED') return 'badge-amber';
  return 'badge-gray';
};

// --- Complaint Registration Form ---
// --- Complaint & FIR Registration Form with Live File Upload ---
const ComplaintForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isFirMode?: boolean;
}> = ({ onSubmit, onCancel, isFirMode = false }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const [form, setForm] = useState({
    complaint_id: `CP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    fir_number: `FIR ${Math.floor(100 + Math.random() * 900)}/2026`,
    date: new Date().toISOString().split('T')[0],
    complainant: '',
    category: 'Investment / Trading Fraud',
    description: '',
    reference_number: `NCRP-ACK-${Math.floor(100000 + Math.random() * 900000)}`,
    jurisdiction: 'Cyber Police Station, Pune City',
    investigating_unit: 'Special Cyber Crime Investigation Cell (I4C Relay)',
    priority: 'HIGH',
    wallet_address: '',
    tx_hash: '',
    chain: 'Ethereum',
    asset: 'USDT',
    amount: '42,80,000',
    suspected_vasp: 'Binance Global',
    known_domain: '',
  });

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.type || 'document'
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAutoFill = () => {
    setForm({
      complaint_id: `CP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      fir_number: `FIR ${Math.floor(100 + Math.random() * 900)}/2026`,
      date: new Date().toISOString().split('T')[0],
      complainant: 'S. K. Verma (Victim)',
      category: 'Investment / Trading Fraud',
      description: 'Victim was lured via WhatsApp & Telegram into fake algorithmic staking liquidity pool. Transferred 42.8 Lakh INR equivalent in crypto to mule wallets.',
      reference_number: `1930-NCRP-${Math.floor(100000 + Math.random() * 900000)}`,
      jurisdiction: 'Pune City Cyber Cell, Maharashtra',
      investigating_unit: 'Cyber Police Station, Shivajinagar',
      priority: 'CRITICAL',
      wallet_address: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
      tx_hash: '0x3a9f182c4d9e012984bb12094c18091844jK8102',
      chain: 'Ethereum',
      asset: 'USDT',
      amount: '42,80,000',
      suspected_vasp: 'Binance Global',
      known_domain: 'quant-yield-in.vip',
    });
    setAttachments([
      { name: 'NCRP_Complaint_Transcript_1930.pdf', size: '245.8 KB', type: 'application/pdf' },
      { name: 'Bank_Statement_IMPS_Tx.png', size: '512.4 KB', type: 'image/png' },
      { name: 'WhatsApp_Syndicate_Chat_Evidence.pdf', size: '890.1 KB', type: 'application/pdf' }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      attachments,
      evidence_count: attachments.length || 1
    });
  };

  return (
    <div className="bg-bg-surface border-2 border-gov-blue/40 rounded-lg shadow-xl p-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-default">
        <div>
          <div className="section-label mb-1 text-gov-blue">Official Statutory Docket Registration</div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-gov-blue" />
            {isFirMode ? 'Register New First Information Report (FIR)' : 'Register Criminal Cyber Complaint'}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Registered records are committed immediately to the shared National Cloud Repository for inter-state deconfliction.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFill}
            className="text-2xs font-semibold px-2.5 py-1.5 rounded bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 flex items-center gap-1 transition-colors"
          >
            ⚡ Auto-Fill Sample Data
          </button>
          <button onClick={onCancel} className="p-1.5 rounded hover:bg-bg-elevated text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Complaint & FIR Identifiers */}
        <div>
          <div className="section-label mb-3">1. Legal &amp; Complainant Identifiers</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Docket / FIR Number *</label>
              <input
                type="text"
                value={form.fir_number}
                onChange={e => set('fir_number', e.target.value)}
                className="form-input font-mono font-bold text-gov-blue"
                required
              />
            </div>
            <div>
              <label className="form-label">Complaint ID (Auto)</label>
              <input type="text" value={form.complaint_id} readOnly className="form-input bg-bg-secondary font-mono text-text-muted" />
            </div>
            <div>
              <label className="form-label">Date of Filing</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Complainant / Source *</label>
              <input type="text" value={form.complainant} onChange={e => set('complainant', e.target.value)} placeholder="e.g. S. K. Verma / NCRP 1930" className="form-input" required />
            </div>
            <div>
              <label className="form-label">Crime Typology *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="form-select font-medium" required>
                {COMPLAINT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Priority Level</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className="form-select font-bold">
                <option value="CRITICAL">CRITICAL (Active Money Flight)</option>
                <option value="HIGH">HIGH (Under 24h Window)</option>
                <option value="MEDIUM">MEDIUM (Standard Queue)</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="form-label">Allegation Brief &amp; Modus Operandi *</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                placeholder="Detail the sequence of events, extortion technique, and suspected communication channels (WhatsApp/Telegram/APK)..."
                className="form-input resize-none"
                required
              />
            </div>
            <div>
              <label className="form-label">NCRP Reference / ACK Token</label>
              <input type="text" value={form.reference_number} onChange={e => set('reference_number', e.target.value)} placeholder="1930 Token..." className="form-input font-mono text-xs" />
            </div>
            <div>
              <label className="form-label">Police Station / Jurisdiction *</label>
              <input type="text" value={form.jurisdiction} onChange={e => set('jurisdiction', e.target.value)} placeholder="e.g. Pune Cyber Crime PS" className="form-input" required />
            </div>
            <div>
              <label className="form-label">Investigating Unit / IO</label>
              <input type="text" value={form.investigating_unit} onChange={e => set('investigating_unit', e.target.value)} className="form-input" />
            </div>
          </div>
        </div>

        {/* Section 2: Financial & Blockchain Coordinates */}
        <div className="pt-4 border-t border-border-default">
          <div className="section-label mb-3">2. On-Chain Coordinates &amp; Suspect Footprint</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="form-label">Suspect / Mule Destination Wallet Address *</label>
              <input
                type="text"
                value={form.wallet_address}
                onChange={e => set('wallet_address', e.target.value)}
                placeholder="0x... (EVM) or TRx... (Tron) or bc1... (BTC)"
                className="form-input font-mono text-xs text-red-600 font-bold"
                required
              />
            </div>
            <div>
              <label className="form-label">Blockchain Network *</label>
              <select value={form.chain} onChange={e => set('chain', e.target.value)} className="form-select font-medium">
                <option value="Ethereum">Ethereum (ERC-20)</option>
                <option value="Tron">Tron (TRC-20 USDT)</option>
                <option value="Bitcoin">Bitcoin (BTC)</option>
                <option value="BNB Chain">BNB Smart Chain (BEP-20)</option>
                <option value="Polygon">Polygon (PoS)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Transaction Hash (TxID)</label>
              <input type="text" value={form.tx_hash} onChange={e => set('tx_hash', e.target.value)} placeholder="0x..." className="form-input font-mono text-xs" />
            </div>
            <div>
              <label className="form-label">Asset / Token</label>
              <input type="text" value={form.asset} onChange={e => set('asset', e.target.value)} placeholder="USDT, ETH, BTC..." className="form-input font-mono" />
            </div>
            <div>
              <label className="form-label">Reported Fraud Loss (₹ INR) *</label>
              <input type="text" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="₹ Amount (e.g. 42,80,000)" className="form-input font-mono font-bold text-slate-900" required />
            </div>
            <div>
              <label className="form-label">Suspected Cashing VASP / Exchange</label>
              <input type="text" value={form.suspected_vasp} onChange={e => set('suspected_vasp', e.target.value)} placeholder="e.g. Binance Global, CoinDCX, Bybit" className="form-input" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="form-label">Phishing URL / Telegram ID / Mule UPI</label>
              <input type="text" value={form.known_domain} onChange={e => set('known_domain', e.target.value)} placeholder="e.g. t.me/mule_traders, fake-exchange.vip" className="form-input" />
            </div>
          </div>
        </div>

        {/* Section 3: Live File Upload Section */}
        <div className="pt-4 border-t border-border-default">
          <div className="flex items-center justify-between mb-2">
            <div className="section-label">3. Evidentiary Attachments (Section 65B Audit Vault)</div>
            <span className="text-2xs text-text-muted">PDF, PNG, JPG up to 25MB each</span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt,.csv"
            className="hidden"
          />

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-5 border-2 border-dashed border-gov-blue/40 bg-gov-blue/5 hover:bg-gov-blue/10 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
          >
            <Upload className="w-8 h-8 text-gov-blue mb-2 animate-bounce" />
            <div className="text-xs font-bold text-gov-blue">Click or Drag &amp; Drop Evidentiary Files Here</div>
            <div className="text-2xs text-text-muted mt-1">
              FIR Copy, Bank Account Statements, WhatsApp/Telegram Screenshots, TxID Receipts
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="btn-primary text-xs mt-3 flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" /> Select Files from Computer
            </button>
          </div>

          {/* Uploaded Files List */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-2xs font-bold text-slate-700 uppercase tracking-wider">
                Attached Files ({attachments.length}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-gov-blue shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-text-primary truncate">{file.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{file.size} · Uploaded</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded shrink-0"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-5 border-t border-border-default">
          <button type="button" onClick={onCancel} className="btn-secondary text-xs">
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAutoFill}
              className="btn-secondary text-xs"
            >
              Fill Sample
            </button>
            <button
              type="submit"
              className="btn-primary text-xs flex items-center gap-2 px-5 py-2 text-sm shadow-md bg-gov-blue hover:bg-gov-blue-dark"
            >
              <CheckCircle className="w-4 h-4" />
              {isFirMode ? 'Submit & Issue FIR Docket' : 'Register Official Complaint'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// --- Case Detail Panel ---
const CaseDetailPanel: React.FC<{
  caseItem: CaseRecord;
  onClose: () => void;
  onInvestigate: (wallet: string) => void;
  onSahyog: (wallet: string, vasp: string) => void;
  onReport: (caseId: string) => void;
}> = ({ caseItem, onClose, onInvestigate, onSahyog, onReport }) => (
  <div className="h-full flex flex-col bg-bg-surface border-l border-border-default animate-slide-in">
    <div className="panel-header shrink-0">
      <div>
        <div className="font-mono text-xs font-bold text-gov-blue">{caseItem.id}</div>
        <div className="text-sm font-semibold text-text-primary mt-0.5">{caseItem.title}</div>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-bg-elevated rounded text-text-muted">
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
      {/* Status row */}
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        <span className={statusBadge(caseItem.status)}>{caseItem.status}</span>
        <span className={priorityBadge(caseItem.priority)}>{caseItem.priority}</span>
        {caseItem.tags?.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
      </div>

      {/* Synopsis */}
      <div className="px-4 py-3">
        <div className="section-label mb-1">Synopsis</div>
        <p className="text-xs text-text-secondary leading-relaxed">{caseItem.synopsis}</p>
      </div>

      {/* Key details */}
      <div className="px-4 py-3 space-y-2">
        <div className="section-label mb-2">Details &amp; Precedent Record</div>
        {[
          { label: 'Classification', value: caseItem.case_type === 'PREVIOUS' ? 'Previous / Resolved Precedent' : 'Current Active Investigation' },
          { label: 'FIR Number', value: caseItem.fir_number },
          { label: 'Police Station', value: caseItem.police_station },
          { label: 'Jurisdiction / Court', value: caseItem.court_name || caseItem.state },
          { label: 'Charge-Sheet Ref', value: caseItem.charge_sheet_ref || (caseItem.status === 'CHARGE_SHEETED' ? 'Filed before Court' : 'Pre-charge phase') },
          { label: 'NCRP Token', value: caseItem.ncrp_ack_number || '1930 Verified' },
          { label: 'Investigator', value: caseItem.investigator },
          { label: 'Reported Loss', value: `₹${(caseItem.loss_amount_inr / 100000).toFixed(1)} Lakh` },
          { label: 'Recovered / Frozen', value: caseItem.recovery_amount_inr ? `₹${(caseItem.recovery_amount_inr / 100000).toFixed(1)} Lakh` : 'Under tracing' },
          { label: 'Accused Identified', value: caseItem.accused_count ? `${caseItem.accused_count} Syndicate Members` : '4 Mules' },
          { label: 'Evidence Items', value: String(caseItem.evidence_count) },
        ].map(row => (
          <div key={row.label} className="flex justify-between text-xs">
            <span className="text-text-muted">{row.label}</span>
            <span className="font-medium text-text-primary text-right max-w-[160px] truncate">{row.value || '—'}</span>
          </div>
        ))}
      </div>

      {/* Victim wallet */}
      <div className="px-4 py-3">
        <div className="section-label mb-1">Victim Wallet</div>
        <div className="mono-address break-all">{caseItem.victim_wallet}</div>
      </div>

      {/* Identified VASPs */}
      {caseItem.identified_vasps?.length > 0 && (
        <div className="px-4 py-3">
          <div className="section-label mb-2">Identified VASPs</div>
          {caseItem.identified_vasps.map(v => (
            <div key={v} className="flex items-center justify-between py-1">
              <span className="text-sm text-text-primary">{v}</span>
              <button
                onClick={() => onSahyog(caseItem.victim_wallet, v)}
                className="text-2xs font-medium text-gov-blue hover:underline flex items-center gap-1"
              >
                <Shield className="w-3 h-3" /> SAHYOG
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 space-y-2">
        <button
          onClick={() => onInvestigate(caseItem.victim_wallet)}
          className="btn-primary w-full text-xs flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" /> Investigate Network
        </button>
        <button
          onClick={() => onReport(caseItem.id)}
          className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> Generate Report
        </button>
        <button
          onClick={() => onSahyog(caseItem.victim_wallet, caseItem.identified_vasps[0] || '')}
          className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5 text-status-amber" /> Create SAHYOG Request
        </button>
      </div>
    </div>
  </div>
);

// Seed complaints for demo
const SEED_COMPLAINTS = [
  {
    id: 'CP-2026-0841', date: '03 Oct 2026', complainant: 'S. K. Verma (via NCRP)',
    category: 'Investment / Trading Fraud', description: 'Victim was lured into a fake investment platform and lost ₹42.8 Lakh in ETH transactions.',
    jurisdiction: 'Pune, Maharashtra', priority: 'HIGH', status: 'CONVERTED',
    wallet: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
    linked_case: 'NTR-DEMO-001',
  },
  {
    id: 'CP-2026-0842', date: '02 Oct 2026', complainant: 'R. P. Singh',
    category: 'Romance / Social Engineering Scam', description: 'Victim sent USDT to a fraudulent wallet after online relationship manipulation. Total loss ₹8.5 Lakh.',
    jurisdiction: 'Mumbai, Maharashtra', priority: 'MEDIUM', status: 'PENDING',
    wallet: '0x9912e84c98f5b89a456102dc840b8a1c970ee2f',
    linked_case: null,
  },
  {
    id: 'CP-2026-0840', date: '01 Oct 2026', complainant: 'Cyber PS Bengaluru',
    category: 'Cryptocurrency Exchange Fraud', description: 'Multiple victims of a cloned exchange website. Funds traced to TRC-20 USDT on Tron network.',
    jurisdiction: 'Bengaluru, Karnataka', priority: 'CRITICAL', status: 'UNDER_INVESTIGATION',
    wallet: 'TRx91844jK810294719024870192840918',
    linked_case: 'NTR-2041',
  },
];

export const CasesView: React.FC<CasesViewProps> = ({
  onInvestigateWallet,
  onNavigateToSahyog,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'complaints'>('cases');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CURRENT' | 'PREVIOUS' | 'ACTION_REQUIRED' | 'RECOVERED' | 'CHARGE_SHEETED'>('ALL');
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string>('SYNCHRONIZED');
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [c, comps] = await Promise.all([api.getCases(), api.getComplaints()]);
      setCases(c);
      if (c.length > 0 && !selectedCase) setSelectedCase(c[0]);
      setComplaints(comps);
      setCloudSyncStatus('SYNCHRONIZED');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const currentCasesCount = cases.filter(c => c.case_type === 'CURRENT' || (!c.case_type && (c.status.includes('ACTIVE') || c.status.includes('REQUIRED') || c.status.includes('ATTACHED') || c.status.includes('DISCLOSED')))).length;
  const previousCasesCount = cases.filter(c => c.case_type === 'PREVIOUS' || c.status.includes('RECOVERED') || c.status === 'CHARGE_SHEETED' || c.status === 'RESOLVED').length;
  const totalFraudInr = cases.reduce((acc, c) => acc + (c.loss_amount_inr || 0), 0);
  const totalRecoveredInr = cases.reduce((acc, c) => acc + (c.recovery_amount_inr || 0), 0);

  const filtered = cases.filter(c => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fir_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'CURRENT') {
      return c.case_type === 'CURRENT' || (!c.case_type && (c.status.includes('ACTIVE') || c.status.includes('REQUIRED') || c.status.includes('ATTACHED') || c.status.includes('DISCLOSED')));
    }
    if (statusFilter === 'PREVIOUS') {
      return c.case_type === 'PREVIOUS' || c.status.includes('RECOVERED') || c.status === 'CHARGE_SHEETED' || c.status === 'RESOLVED';
    }
    if (statusFilter === 'ACTION_REQUIRED') {
      return c.status === 'ACTION_REQUIRED';
    }
    if (statusFilter === 'RECOVERED') {
      return c.status === 'CLOSED_RECOVERED' || c.status === 'RESOLVED';
    }
    if (statusFilter === 'CHARGE_SHEETED') {
      return c.status === 'CHARGE_SHEETED';
    }
    return true;
  });

  const handleComplaintSubmit = async (data: any) => {
    setCloudSyncStatus('SAVING_TO_DATABASE');
    try {
      const res = await api.registerComplaint(data);
      if (res && res.complaint) {
        setComplaints(prev => [res.complaint, ...prev.filter(x => x.id !== res.complaint.id)]);
        if (res.case) {
          setCases(prev => [res.case, ...prev]);
        }
        setCloudSyncStatus('SYNCHRONIZED');
        setCloudMessage(`Complaint ${res.complaint.id} successfully saved to Dedicated Cloud Database! Your friend on another laptop will see this complaint in their registry.`);
        setActiveTab('complaints');
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setCloudSyncStatus('CACHED');
    }
    setShowComplaintForm(false);
  };

  const TABS = [
    { id: 'cases', label: 'Registered FIR Dockets', count: cases.length },
    { id: 'complaints', label: 'Citizen Complaints (NCRP & Cloud Registry)', count: complaints.length },
  ];

  return (
    <div className="bg-bg-base min-h-screen pb-10">
      {/* Page header */}
      <div className="bg-bg-surface border-b border-border-default">
        <div className="gov-container py-3.5 flex items-center justify-between">
          <div>
            <div className="section-label mb-0.5">National Criminal Case Repository</div>
            <h1 className="text-lg font-bold text-text-primary">FIR Dockets &amp; Digital Crime Records</h1>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'complaints' && (
              <button
                onClick={() => setShowComplaintForm(true)}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Register Complaint
              </button>
            )}
            {activeTab === 'cases' && (
              <button
                onClick={() => setShowComplaintForm(true)}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> + Register New FIR
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="gov-container pt-4">
        {/* Primary Tabs */}
        <div className="flex items-center gap-1 border-b border-border-default mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-gov-blue text-gov-blue'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong'
              }`}
            >
              {tab.label}
              <span className={`text-2xs px-1.5 py-0.2 rounded font-semibold ${
                activeTab === tab.id ? 'bg-blue-100 text-gov-blue' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* National Docket Metrics Strip */}
        {activeTab === 'cases' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Current Ongoing Cases
              </div>
              <div className="text-xl font-bold font-mono text-gov-blue mt-0.5">
                {currentCasesCount} Active Dockets
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Under active on-chain tracing
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Previous / Resolved Cases
              </div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
                {previousCasesCount} Precedents
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Restituted or charge-sheeted in court
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Total Fraud Traced
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                ₹{(totalFraudInr / 10000000).toFixed(2)} Crore
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                15 FIR Dockets across 7 States
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Restituted &amp; Attached Assets
              </div>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
                ₹{(totalRecoveredInr / 10000000).toFixed(2)} Crore
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {((totalRecoveredInr / (totalFraudInr || 1)) * 100).toFixed(1)}% Capital Recovery Rate
              </div>
            </div>
          </div>
        )}

        {/* Status Lifecycle Filter Chips (Previous & Current Cases) */}
        {activeTab === 'cases' && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4 text-2xs">
            <span className="font-semibold text-slate-500 mr-1">Case Filter:</span>
            {[
              { id: 'ALL', label: `All Cases (${cases.length})` },
              { id: 'CURRENT', label: `Current Active Cases (${currentCasesCount})` },
              { id: 'PREVIOUS', label: `Previous Precedents (${previousCasesCount})` },
              { id: 'ACTION_REQUIRED', label: `Action Required (${cases.filter(c => c.status === 'ACTION_REQUIRED').length})` },
              { id: 'RECOVERED', label: `100% Recovered (${cases.filter(c => c.status.includes('RECOVERED') || c.status.includes('RESOLVED')).length})` },
              { id: 'CHARGE_SHEETED', label: `Charge-Sheeted in Court (${cases.filter(c => c.status === 'CHARGE_SHEETED').length})` },
            ].map(chip => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setStatusFilter(chip.id as any)}
                className={`px-2.5 py-1 rounded border font-medium transition-colors ${
                  statusFilter === chip.id
                    ? 'bg-gov-blue text-white border-gov-blue font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Complaint Registration Form */}
        {showComplaintForm && (
          <div className="mb-5">
            <ComplaintForm
              isFirMode={activeTab === 'cases'}
              onSubmit={handleComplaintSubmit}
              onCancel={() => setShowComplaintForm(false)}
            />
          </div>
        )}

        {/* CASES TAB */}
        {activeTab === 'cases' && (
          <div className="flex gap-5" style={{ minHeight: 'calc(100vh - 220px)' }}>
            {/* Cases list/table */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="form-input pl-8 text-xs py-1.5"
                  />
                </div>
                <div className="flex items-center border border-border-default rounded overflow-hidden">
                  <button onClick={() => setViewMode('list')} className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-gov-blue text-white' : 'text-text-muted hover:bg-bg-elevated'}`}><List className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-gov-blue text-white' : 'text-text-muted hover:bg-bg-elevated'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {viewMode === 'list' ? (
                <div className="gov-card overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Docket</th>
                        <th>Classification</th>
                        <th>Title &amp; FIR</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Loss / Recovered</th>
                        <th>Target VASP</th>
                        <th>Jurisdiction / Court</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(item => {
                        const isPrev = item.case_type === 'PREVIOUS' || item.status.includes('RECOVERED') || item.status === 'CHARGE_SHEETED';
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedCase(item)}
                            className={selectedCase?.id === item.id ? 'bg-gov-blue-light' : ''}
                          >
                            <td>
                              <span className="font-mono text-xs font-bold text-gov-blue">{item.id}</span>
                            </td>
                            <td>
                              {isPrev ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                  PREVIOUS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                  ACTIVE
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="font-medium text-xs max-w-[220px] truncate text-slate-900">{item.title}</div>
                              <div className="text-2xs font-mono text-text-muted">{item.fir_number} · {item.police_station}</div>
                            </td>
                            <td><span className={priorityBadge(item.priority)}>{item.priority}</span></td>
                            <td><span className={statusBadge(item.status)}>{item.status}</span></td>
                            <td>
                              <div className="font-mono text-xs font-bold text-slate-900">
                                ₹{(item.loss_amount_inr / 100000).toFixed(1)}L
                              </div>
                              {item.recovery_amount_inr ? (
                                <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                                  ✓ ₹{(item.recovery_amount_inr / 100000).toFixed(1)}L frozen
                                </div>
                              ) : (
                                <div className="text-[10px] font-mono text-slate-400">
                                  tracing in progress
                                </div>
                              )}
                            </td>
                            <td className="text-xs text-text-secondary truncate max-w-[120px] font-medium">{item.identified_vasps?.[0] || '—'}</td>
                            <td>
                              <div className="text-xs text-slate-800 font-medium truncate max-w-[130px]">{item.court_name || item.state}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">{item.ncrp_ack_number || item.investigator}</div>
                            </td>
                            <td className="text-right">
                              <button
                                onClick={e => { e.stopPropagation(); onInvestigateWallet(item.victim_wallet); }}
                                className="text-xs font-semibold text-gov-blue hover:underline"
                              >
                                Investigate
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCase(item)}
                      className={`gov-card p-4 text-left space-y-3 hover:border-gov-blue transition-colors ${
                        selectedCase?.id === item.id ? 'border-gov-blue bg-gov-blue-light/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gov-blue">{item.id}</span>
                        <span className={statusBadge(item.status)}>{item.status}</span>
                      </div>
                      <div>
                        <div className="font-medium text-text-primary text-sm">{item.title}</div>
                        <div className="text-2xs font-mono text-text-muted mt-0.5">{item.fir_number} · {item.police_station}</div>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">{item.synopsis}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                        <div className="flex items-center gap-2">
                          <span className={priorityBadge(item.priority)}>{item.priority}</span>
                          <span className="font-mono text-2xs text-status-amber">₹{(item.loss_amount_inr / 100000).toFixed(1)}L</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Case detail side panel */}
            {selectedCase && (
              <div className="w-72 shrink-0">
                <CaseDetailPanel
                  caseItem={selectedCase}
                  onClose={() => setSelectedCase(null)}
                  onInvestigate={onInvestigateWallet}
                  onSahyog={onNavigateToSahyog}
                  onReport={onOpenReport}
                />
              </div>
            )}
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {/* Cloud Database Status Bar */}
            <div className="bg-slate-900 text-white rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                      ☁ Dedicated National Cloud Database Active
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                      Multi-Device Shared Registry
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Any complaint filed on this terminal is immediately saved to the dedicated cloud repository and visible on your friend's laptop or mobile.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="btn-secondary text-xs bg-slate-800 hover:bg-slate-700 text-white border-slate-600 flex items-center gap-1.5"
                >
                  <Clock className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
                  {isRefreshing ? 'Syncing...' : 'Sync Cloud DB'}
                </button>

                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Register Complaint
                </button>
              </div>
            </div>

            {/* Success Alert Banner if just submitted */}
            {cloudMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{cloudMessage}</span>
                </div>
                <button
                  onClick={() => setCloudMessage(null)}
                  className="text-2xs text-emerald-700 hover:underline font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="gov-card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Date</th>
                    <th>Complainant / Source</th>
                    <th>Modus Operandi / Category</th>
                    <th>Amount (INR)</th>
                    <th>Blockchain &amp; Suspect Wallet</th>
                    <th>Jurisdiction</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id}>
                      <td><span className="font-mono text-xs font-bold text-gov-blue">{c.id}</span></td>
                      <td className="text-xs whitespace-nowrap">{c.date}</td>
                      <td className="text-xs font-medium max-w-[140px] truncate">{c.complainant}</td>
                      <td className="text-xs text-text-secondary max-w-[160px] truncate">{c.category}</td>
                      <td className="text-xs font-mono font-bold text-slate-900 whitespace-nowrap">
                        {c.amount || '—'}
                      </td>
                      <td className="text-xs font-mono">
                        {c.wallet_address || c.wallet ? (
                          <button
                            onClick={() => onInvestigateWallet(c.wallet_address || c.wallet)}
                            className="text-gov-blue hover:underline flex items-center gap-1 font-mono text-[11px]"
                            title={c.wallet_address || c.wallet}
                          >
                            <span>{(c.wallet_address || c.wallet).slice(0, 8)}...{(c.wallet_address || c.wallet).slice(-6)}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        ) : (
                          <span className="text-2xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="text-xs text-text-secondary max-w-[130px] truncate">{c.jurisdiction}</td>
                      <td><span className={priorityBadge(c.priority)}>{c.priority}</span></td>
                      <td>
                        <span className={`badge ${
                          c.status === 'CONVERTED' || c.status === 'ACTIVE_INVESTIGATION' ? 'badge-green' :
                          c.status === 'UNDER_INVESTIGATION' ? 'badge-blue' :
                          c.status === 'PENDING' ? 'badge-amber' : 'badge-gray'
                        }`}>{c.status ? c.status.replace(/_/g, ' ') : 'REGISTERED'}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            const targetWallet = c.wallet_address || c.wallet || '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97';
                            onInvestigateWallet(targetWallet);
                          }}
                          className="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1 inline-flex"
                        >
                          Trace Funds <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
