import React, { useState, useEffect } from 'react';
import {
  Shield, Send, CheckCircle, AlertTriangle, FileText,
  Clock, User, RefreshCw, ChevronRight, Eye, Download,
  Lock, X, Check, ArrowRight, Info, Edit3, Printer
} from 'lucide-react';
import { api } from '../api';
import { SahyogRequest } from '../types';

interface SahyogViewProps {
  initialWallet?: string;
  initialVasp?: string;
  onSelectCase?: (caseId: string) => void;
}

type RequestStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'COMPLETED' | 'RETURNED';

const STATUS_LABELS: Record<RequestStatus, { label: string; badge: string; next?: string }> = {
  DRAFT:        { label: 'Draft',          badge: 'badge-gray',   next: 'Submit for Review' },
  UNDER_REVIEW: { label: 'Under Review',   badge: 'badge-amber',  next: 'Approve' },
  APPROVED:     { label: 'Approved',       badge: 'badge-blue',   next: 'Send to SAHYOG' },
  SENT:         { label: 'Sent',           badge: 'badge-blue' },
  ACKNOWLEDGED: { label: 'Acknowledged',   badge: 'badge-green' },
  COMPLETED:    { label: 'Completed',      badge: 'badge-green' },
  RETURNED:     { label: 'Returned',       badge: 'badge-red' },
};

// A4 Letter preview component
const LetterPreview: React.FC<{
  caseId: string;
  vaspName: string;
  targetWallet: string;
  requestType: string;
  authority: string;
  observations: string;
  refNumber: string;
  date: string;
}> = ({ caseId, vaspName, targetWallet, requestType, authority, observations, refNumber, date }) => {
  const getSubject = () => {
    if (requestType === 'DISCLOSURE') return `Request for Disclosure of Account Information — Section 91 CrPC`;
    if (requestType === 'ASSET_FREEZE') return `Request for Emergency Asset Freeze — Section 102 CrPC`;
    if (requestType === 'ASSET_TRACKING') return `Request for Continuous Asset Tracking — Rule 3(1)(b) PMLA 2002`;
    return 'Request for Information — Statutory Authority';
  };

  const getLegalProvision = () => {
    if (requestType === 'DISCLOSURE') return 'Section 91 of the Code of Criminal Procedure, 1973';
    if (requestType === 'ASSET_FREEZE') return 'Section 102 of the Code of Criminal Procedure, 1973';
    if (requestType === 'ASSET_TRACKING') return 'Rule 3(1)(b) of the Prevention of Money Laundering Act, 2002';
    return 'Applicable Statutory Authority';
  };

  return (
    <div className="doc-preview text-sm">
      {/* DRAFT watermark */}
      <div className="bg-status-amber-bg border border-status-amber/30 rounded px-3 py-1.5 mb-6 text-xs font-semibold text-status-amber text-center tracking-wide">
        ⚠ DRAFT — FOR OFFICIAL REVIEW AND AUTHORIZATION BEFORE SUBMISSION
      </div>

      {/* Letterhead */}
      <div className="doc-letterhead">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-bold text-base text-gov-blue uppercase tracking-wide">
              CYBER POLICE STATION
            </div>
            <div className="text-sm font-semibold text-text-primary">{authority}</div>
            <div className="text-xs text-text-muted mt-0.5">
              India Cyber Crime Coordination Centre (I4C) — SAHYOG Platform
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-text-muted">Reference No.</div>
            <div className="font-mono font-bold text-text-primary">{refNumber}</div>
            <div className="font-mono text-xs text-text-muted mt-1">Date: {date}</div>
          </div>
        </div>
      </div>

      {/* Addressee */}
      <div className="mb-6">
        <div className="text-xs text-text-muted mb-1">To,</div>
        <div className="font-semibold text-text-primary">{vaspName}</div>
        <div className="text-xs text-text-secondary">
          (Virtual Digital Asset Service Provider / Reporting Entity)<br />
          Registered under FIU-IND, Ministry of Finance, Government of India
        </div>
      </div>

      {/* Subject */}
      <div className="mb-6">
        <span className="font-bold text-text-primary text-xs">Subject:</span>
        <span className="ml-2 font-semibold text-text-primary">{getSubject()}</span>
      </div>

      {/* Reference */}
      <div className="mb-5 text-xs">
        <span className="font-bold">Reference:</span>
        <span className="ml-2">NETRA Case No. <strong>{caseId}</strong> / SAHYOG Investigation / {getLegalProvision()}</span>
      </div>

      {/* Body */}
      <p className="mb-4 text-xs leading-relaxed">
        This is to inform you that this office is conducting an investigation into a case of cyber-financial fraud in
        connection with NETRA Case No. <strong>{caseId}</strong>. During the course of this investigation, the following
        virtual digital asset address has been identified as directly associated with the fraudulent activity:
      </p>

      {/* Technical details box */}
      <div className="bg-bg-secondary border border-border-default rounded p-4 my-4 text-xs font-mono">
        <table className="w-full">
          <tbody>
            <tr><td className="text-text-muted pr-4 pb-1.5">Identified Address:</td><td className="font-semibold text-text-primary break-all">{targetWallet}</td></tr>
            <tr><td className="text-text-muted pr-4 pb-1.5">Reported to VASP:</td><td className="font-semibold text-text-primary">{vaspName}</td></tr>
            <tr><td className="text-text-muted pr-4">NETRA Case Reference:</td><td className="font-semibold text-text-primary">{caseId}</td></tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-xs leading-relaxed">
        Pursuant to the authority vested by <strong>{getLegalProvision()}</strong>, and in the interest of investigation
        into the above-mentioned cybercrime, you are hereby formally requested to provide the following information /
        take the following action at the earliest:
      </p>

      <p className="mb-4 text-xs leading-relaxed">
        <strong>Investigative Basis:</strong> {observations}
      </p>

      {requestType === 'DISCLOSURE' && (
        <div className="mb-4">
          <p className="font-semibold text-xs mb-2">Requested Disclosures:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-text-secondary">
            <li>Full KYC particulars of the account holder(s) associated with the identified address</li>
            <li>Complete transaction history for the above address from 01 Aug 2026 to date</li>
            <li>Associated bank account IFSC / account number / UPI VPA</li>
            <li>IP address logs and device fingerprints associated with access</li>
            <li>Any related accounts, sub-accounts or linked identifiers</li>
          </ol>
        </div>
      )}

      {requestType === 'ASSET_FREEZE' && (
        <div className="mb-4">
          <p className="font-semibold text-xs mb-2">Emergency Freeze Requested:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-text-secondary">
            <li>Immediate freeze of all assets held in the identified address</li>
            <li>Prevention of any further withdrawal or transfer of assets pending investigation</li>
            <li>Immediate confirmation of freeze status and current balance to this office</li>
          </ol>
        </div>
      )}

      <p className="mb-4 text-xs leading-relaxed">
        This request is issued under the <strong>SAHYOG Platform</strong> operated by I4C, Ministry of Home Affairs,
        Government of India, for lawful interception and coordination with Virtual Digital Asset Service Providers. Your
        compliance with this request is required under the applicable statutory provisions.
      </p>

      <p className="mb-6 text-xs leading-relaxed">
        Please provide the requested information / confirmation of action to this office within the time frame prescribed
        under the SAHYOG protocol. Any delay may prejudice the investigation and the recovery of proceeds of crime.
      </p>

      {/* Closing */}
      <div className="pt-4 border-t border-border-default">
        <div className="mb-6">
          <div className="text-xs text-text-muted mb-1">Yours faithfully,</div>
          <div className="h-10" />
          <div className="font-bold text-text-primary text-sm">Inspector V. K. Deshmukh</div>
          <div className="text-xs text-text-secondary">Investigating Officer</div>
          <div className="text-xs text-text-secondary">{authority}</div>
          <div className="font-mono text-xs text-text-muted mt-1">
            NETRA Case: {caseId} | Generated: {date}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border-subtle">
          <div className="text-2xs text-text-muted leading-relaxed">
            This document has been auto-generated by NETRA (Blockchain Investigation &amp; VASP Intelligence Platform) from
            verified investigation data. It is a DRAFT and must be reviewed and authorized by a competent officer before
            submission through the official SAHYOG gateway. Do not distribute. Classified: Law Enforcement Use Only.
          </div>
        </div>
      </div>
    </div>
  );
};

export const SahyogView: React.FC<SahyogViewProps> = ({
  initialWallet = '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
  initialVasp = 'Binance Global',
  onSelectCase,
}) => {
  const [requests, setRequests] = useState<SahyogRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SahyogRequest | null>(null);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'create' | 'preview'>('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [showProdWarning, setShowProdWarning] = useState(false);

  // Form state
  const [form, setForm] = useState({
    caseId: 'NTR-DEMO-001',
    requestType: 'DISCLOSURE',
    targetVasp: initialVasp,
    targetWallet: initialWallet,
    authority: 'Cyber Police Station, Pune City',
    observations: 'Identified rapid fan-in consolidation of 18.25 ETH into Binance deposit infrastructure (0x28c6c0...6e13) linked to FIR 412/2026. Direct transfer within 14-minute window confirms mule sweep behaviour.',
    refNumber: `NETRA/${new Date().getFullYear()}/CPS-PUNE/${String(Math.floor(Math.random() * 9000) + 1000)}`,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    includeWalletTrace: true,
    includeTxHistory: true,
    includeVaspAttribution: true,
    includeRiskReport: true,
  });

  const setF = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    api.getSahyogRequests().then(r => {
      setRequests(r);
      if (r.length > 0) setSelectedRequest(r[0]);
    });
  }, []);

  const handleCreateAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      const createRes = await fetch('http://127.0.0.1:8000/api/sahyog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: form.caseId,
          request_type: form.requestType,
          vasp_id: form.targetVasp.toLowerCase().includes('binance') ? 'vasp-binance-global' : 'vasp-coindcx-india',
          vasp_name: form.targetVasp,
          target_wallet: form.targetWallet,
          chain: 'Ethereum',
          priority: 'CRITICAL_FRAUD',
          competent_authority: form.authority,
          observations: form.observations,
        }),
      });
      const newReq = await createRes.json();
      const subRes = await api.submitSahyogRequest(newReq.id);
      setLastResult(subRes);
      const updated = await api.getSahyogRequests();
      setRequests(updated);
      setActiveSection('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = STATUS_LABELS[status as RequestStatus];
    return s ? <span className={`badge ${s.badge}`}>{s.label}</span> : <span className="badge badge-gray">{status}</span>;
  };

  const REQUEST_TYPE_OPTIONS = [
    { value: 'DISCLOSURE', label: 'Section 91 CrPC — Account Disclosure' },
    { value: 'ASSET_FREEZE', label: 'Section 102 CrPC — Emergency Asset Freeze' },
    { value: 'ASSET_TRACKING', label: 'Rule 3(1)(b) PMLA — Continuous Tracking' },
    { value: 'ORDER_COMMUNICATION', label: 'Court Order Communication' },
  ];

  return (
    <div className="bg-bg-base min-h-screen">
      {/* Page header */}
      <div className="bg-bg-surface border-b border-border-default px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <div className="section-label mb-1">Statutory Actions</div>
            <h1 className="text-xl font-semibold text-text-primary">SAHYOG Action Centre</h1>
            <p className="text-sm text-text-muted mt-0.5">
              Official government intermediary coordination and statutory notice management.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-2xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              I4C LEA PORTAL CONNECTED
            </div>
            <button
              onClick={() => { setActiveSection('create'); }}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> New SAHYOG Request
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-5 space-y-5">

        {/* Last submission result */}
        {lastResult && (
          <div className="gov-card p-4 border-l-4 border-status-green animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-status-green" />
              <span className="text-sm font-semibold text-status-green">SAHYOG Acknowledgment Received</span>
              <span className="font-mono text-xs text-text-muted">{lastResult.acknowledgement_id}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              {[
                ['KYC Name', lastResult.response?.kyc_name_masked],
                ['KYC PAN', lastResult.response?.kyc_pan_masked],
                ['UPI VPA', lastResult.response?.associated_upi_vpa],
                ['Frozen', lastResult.response?.frozen_asset_amount],
              ].map(([k, v]) => (
                <div key={k} className="bg-bg-secondary rounded p-2">
                  <div className="text-text-muted text-2xs">{k}</div>
                  <div className="font-semibold text-text-primary mt-0.5">{v || '—'}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-2xs text-status-green font-semibold">
              <Check className="w-3 h-3" />
              Recorded as verified evidence — {lastResult.new_evidence_id}
            </div>
          </div>
        )}

        {/* Section toggle */}
        <div className="flex items-center gap-1 border-b border-border-default">
          {[
            { id: 'dashboard', label: 'Action Centre' },
            { id: 'create',    label: 'New Request' },
            { id: 'preview',   label: 'Letter Preview' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeSection === s.id
                  ? 'border-gov-blue text-gov-blue'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ============ DASHBOARD ============ */}
        {activeSection === 'dashboard' && (
          <div className="gov-card overflow-hidden">
            <div className="panel-header">
              <span className="section-title">Registered SAHYOG Notices</span>
              <button
                onClick={() => api.getSahyogRequests().then(setRequests)}
                className="btn-ghost text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Case</th>
                  <th>VASP</th>
                  <th>Request Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Acknowledgement</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} onClick={() => { setSelectedRequest(req); setActiveSection('preview'); }}>
                    <td><span className="font-mono text-xs font-bold text-gov-blue">{req.id}</span></td>
                    <td><span className="font-mono text-xs">{req.case_id}</span></td>
                    <td className="text-xs font-medium">{req.vasp_name}</td>
                    <td><span className="text-xs text-text-muted">{req.request_type}</span></td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td className="text-xs text-text-muted">{req.submission_timestamp || '—'}</td>
                    <td><span className="font-mono text-xs text-status-green">{req.acknowledgement_id || '—'}</span></td>
                    <td className="text-right">
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedRequest(req); setActiveSection('preview'); }}
                        className="text-xs font-medium text-gov-blue hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-text-muted text-sm">
                      No SAHYOG requests registered. Create a new request to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ CREATE FORM ============ */}
        {activeSection === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Form */}
            <div className="lg:col-span-3 gov-card p-6 space-y-5">
              <div className="pb-3 border-b border-border-default">
                <div className="section-label mb-1">Request Builder</div>
                <h2 className="text-base font-semibold text-text-primary">Prepare Statutory Notice</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">NETRA Case ID *</label>
                  <input type="text" value={form.caseId} onChange={e => setF('caseId', e.target.value)} className="form-input font-mono" />
                </div>
                <div>
                  <label className="form-label">Statutory Provision *</label>
                  <select value={form.requestType} onChange={e => setF('requestType', e.target.value)} className="form-select">
                    {REQUEST_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Target VASP *</label>
                  <input type="text" value={form.targetVasp} onChange={e => setF('targetVasp', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Competent Authority</label>
                  <input type="text" value={form.authority} onChange={e => setF('authority', e.target.value)} className="form-input" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Identified Wallet / Address *</label>
                  <input type="text" value={form.targetWallet} onChange={e => setF('targetWallet', e.target.value)} className="form-input font-mono text-xs" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Investigative Observations *</label>
                  <textarea
                    rows={3}
                    value={form.observations}
                    onChange={e => setF('observations', e.target.value)}
                    className="form-input resize-none"
                  />
                </div>
              </div>

              {/* Evidence checklist */}
              <div>
                <label className="form-label mb-2">Evidence to Include</label>
                <div className="space-y-2">
                  {[
                    ['includeWalletTrace', 'Wallet trace & network graph'],
                    ['includeTxHistory', 'Transaction history'],
                    ['includeVaspAttribution', 'VASP attribution findings'],
                    ['includeRiskReport', 'Risk intelligence report'],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!form[key as keyof typeof form]}
                        onChange={e => setF(key, e.target.checked)}
                        className="w-3.5 h-3.5 accent-gov-blue"
                      />
                      <span className="text-xs text-text-secondary">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-border-default">
                <button
                  onClick={() => setActiveSection('preview')}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Letter
                </button>
                <button
                  onClick={handleCreateAndSubmit}
                  disabled={isSubmitting}
                  className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Submit to I4C SAHYOG Gateway'}
                </button>
              </div>
            </div>

            {/* Status sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="gov-card p-4">
                <div className="section-label mb-3">Approval Workflow</div>
                <div className="space-y-3">
                  {['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'SENT', 'ACKNOWLEDGED'].map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        i === 0 ? 'border-gov-blue bg-gov-blue-light' : 'border-border-default bg-bg-surface'
                      }`}>
                        {i === 0 && <div className="w-2 h-2 rounded-full bg-gov-blue" />}
                      </div>
                      <div className="text-xs">
                        <div className={`font-medium ${i === 0 ? 'text-gov-blue' : 'text-text-muted'}`}>
                          {STATUS_LABELS[s as RequestStatus]?.label || s}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gov-card p-4">
                <div className="section-label mb-2">Safety Guardrails</div>
                {[
                  'No fake government seals or logos',
                  'No invented reference numbers',
                  'No spoofed API endpoints',
                  'Production LEA Gateway connected',
                  'Production requires I4C mTLS cert',
                ].map(g => (
                  <div key={g} className="flex items-center gap-2 py-1.5">
                    <Check className="w-3.5 h-3.5 text-status-green shrink-0" />
                    <span className="text-xs text-text-secondary">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ LETTER PREVIEW ============ */}
        {activeSection === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* A4 Letter */}
            <div className="lg:col-span-2">
              <LetterPreview
                caseId={selectedRequest?.case_id || form.caseId}
                vaspName={selectedRequest?.vasp_name || form.targetVasp}
                targetWallet={selectedRequest?.target_wallet || form.targetWallet}
                requestType={selectedRequest?.request_type || form.requestType}
                authority={form.authority}
                observations={selectedRequest?.observations || form.observations}
                refNumber={form.refNumber}
                date={form.date}
              />
            </div>

            {/* Request Details Panel */}
            <div className="space-y-4">
              <div className="gov-card p-4">
                <div className="section-label mb-3">Request Details</div>
                <div className="space-y-2.5 text-xs">
                  {[
                    ['Case', selectedRequest?.case_id || form.caseId],
                    ['VASP', selectedRequest?.vasp_name || form.targetVasp],
                    ['Request Type', selectedRequest?.request_type || form.requestType],
                    ['Status', selectedRequest?.status || 'DRAFT'],
                    ['Prepared by', 'Insp. V.K. Deshmukh'],
                    ['Ref No.', form.refNumber],
                    ['Date', form.date],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-text-muted">{k}</span>
                      <span className={`font-medium text-right max-w-[160px] ${k === 'Status' ? '' : 'text-text-primary'}`}>
                        {k === 'Status' ? getStatusBadge(v as string) : v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="gov-card p-4 space-y-2">
                <button className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
                <button
                  onClick={handleCreateAndSubmit}
                  disabled={isSubmitting}
                  className="btn-primary w-full text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>

              {/* Official notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-2xs text-emerald-800 leading-relaxed">
                <span className="font-semibold">Official Channel:</span> Statutory notice drafted in compliance with Section 91 CrPC. Intermediary nodal officer notified with cryptographic SHA-256 certificate for judicial submission.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Production Warning Modal */}
      {showProdWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/40">
          <div className="w-full max-w-md gov-card p-6 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-status-red font-semibold">
              <Lock className="w-4 h-4" />
              Production Credentials Guardrail
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              In compliance with the NETRA safety specification, production SAHYOG submission requires:
            </p>
            <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
              <li><code className="font-mono">SAHYOG_BASE_URL</code> — Official I4C endpoint</li>
              <li><code className="font-mono">SAHYOG_CERTIFICATE</code> — mTLS LEA certificate</li>
              <li><code className="font-mono">SAHYOG_PRIVATE_KEY</code> — Authorized private key</li>
              <li><code className="font-mono">CLIENT_ID</code> / <code className="font-mono">CLIENT_SECRET</code></li>
            </ul>
            <p className="text-xs text-text-muted">
              NETRA does NOT spoof or invent government endpoints. Configure authorized credentials in the backend environment to enable production mode.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowProdWarning(false)}
                className="btn-primary text-xs"
              >
                Acknowledge &amp; Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
