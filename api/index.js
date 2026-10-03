const fs = require('fs');
const path = require('path');

// Load base seed data
let seedData = null;
try {
  seedData = require('./seed_data.json');
} catch (e) {
  try {
    seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data.json'), 'utf8'));
  } catch (err) {
    seedData = {
      DEMO_GRAPH_NODES: [],
      DEMO_GRAPH_EDGES: [],
      CASES_SEED: [],
      INDIA_MAP_REGIONS: [],
      ACTIONS_SEED: [],
      EVIDENCE_SEED: []
    };
  }
}

const GITHUB_REPO = 'Srinidh19/NETRA';
const GITHUB_FILE = 'data/db.json';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// In-memory cache for ultra-fast response and fallback
let memoryDb = {
  complaints: [
    {
      id: 'CP-2026-0841',
      date: '2026-10-03',
      complainant: 'S. K. Verma (via NCRP 1930)',
      category: 'Investment / Trading Fraud',
      description: 'Victim lured into high-yield algorithmic liquidity pool and lost ₹42.8 Lakh in ETH transactions.',
      jurisdiction: 'Cyber Police Station, Pune City, Maharashtra',
      priority: 'HIGH',
      status: 'ACTIVE_INVESTIGATION',
      wallet_address: '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
      tx_hash: '0x3a9f182c4d9e012984bb12094c18091844jK8102',
      chain: 'Ethereum',
      asset: 'ETH',
      amount: '₹42,80,000',
      suspected_vasp: 'Binance Global',
      known_domain: 'quant-yield-in.vip',
      linked_case: 'NTR-DEMO-001'
    },
    {
      id: 'CP-2026-0842',
      date: '2026-10-02',
      complainant: 'R. P. Singh',
      category: 'Romance / Social Engineering Scam',
      description: 'Manipulated via Telegram group into depositing USDT to a fake staking platform. Total loss ₹8.5 Lakh.',
      jurisdiction: 'BKC Cyber Police, Mumbai, Maharashtra',
      priority: 'MEDIUM',
      status: 'SAHYOG_DISCLOSED',
      wallet_address: '0xdf21841aa72198018247012984bb12094c180918',
      tx_hash: '0x889214bba72198018247012984bb12094c180918',
      chain: 'Tron',
      asset: 'USDT',
      amount: '₹8,50,000',
      suspected_vasp: 'OKX Global',
      known_domain: 't.me/inr_vip_traders',
      linked_case: 'NTR-2042'
    },
    {
      id: 'CP-2026-0840',
      date: '2026-10-01',
      complainant: 'Cyber Police Station Bengaluru',
      category: 'Digital Arrest / Impersonation Scam',
      description: 'Senior citizen coerced under threat of fabricated ED/CBI warrant into liquidating mutual funds into TRC-20 USDT.',
      jurisdiction: 'CID Cyber Crime, Bengaluru, Karnataka',
      priority: 'CRITICAL',
      status: 'ACTION_REQUIRED',
      wallet_address: 'TRx91844jK810294719024870192840918',
      tx_hash: '0x551844jK81029471902487019284091844jK8102',
      chain: 'Tron',
      asset: 'USDT',
      amount: '₹95,00,000',
      suspected_vasp: 'Bybit',
      known_domain: 'cbi-investigation-notice.gov-verify.in',
      linked_case: 'NTR-2041'
    }
  ],
  cases: [...(seedData.CASES_SEED || [])],
  last_synced: 0
};

// Helper to sync from GitHub database
async function getCloudDb() {
  const now = Date.now();
  if (now - memoryDb.last_synced < 10000 && memoryDb.complaints.length > 0) {
    return memoryDb;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'NETRA-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
      if (Array.isArray(content.complaints) && content.complaints.length > 0) {
        // Merge without duplicating
        const existingIds = new Set(content.complaints.map(c => c.id));
        memoryDb.complaints.forEach(seedC => {
          if (!existingIds.has(seedC.id)) {
            content.complaints.push(seedC);
          }
        });
        memoryDb.complaints = content.complaints;
      }
      memoryDb.last_synced = now;
      memoryDb.sha = data.sha;
    }
  } catch (e) {
    console.error('Failed to sync from GitHub DB:', e.message);
  }
  return memoryDb;
}

// Helper to commit new complaint to GitHub database
async function saveToCloudDb(newComplaint) {
  memoryDb.complaints.unshift(newComplaint);
  try {
    // 1. Get current SHA
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'NETRA-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    let sha = memoryDb.sha;
    let existingComplaints = memoryDb.complaints;
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
      try {
        const parsed = JSON.parse(Buffer.from(getJson.content, 'base64').toString('utf8'));
        if (Array.isArray(parsed.complaints)) {
          const ids = new Set([newComplaint.id]);
          existingComplaints = [newComplaint];
          parsed.complaints.forEach(item => {
            if (!ids.has(item.id)) {
              ids.add(item.id);
              existingComplaints.push(item);
            }
          });
        }
      } catch (err) {}
    }

    const payload = {
      complaints: existingComplaints,
      updated_at: new Date().toISOString()
    };

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'NETRA-App',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `feat(db): register complaint ${newComplaint.id}`,
        sha: sha,
        content: Buffer.from(JSON.stringify(payload, null, 2)).toString('base64')
      })
    });
    if (putRes.ok) {
      const putData = await putRes.json();
      memoryDb.sha = putData.content?.sha || sha;
    }
  } catch (e) {
    console.error('Failed to commit to GitHub DB:', e.message);
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host || 'netra.gov.in'}`);
  let pathname = url.pathname.replace(/^\/api/, '');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;

  const db = await getCloudDb();

  // Route: /complaints (GET & POST)
  if (pathname === '/complaints') {
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
      body = body || {};

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const complaintId = body.complaint_id || `CP-2026-${randomNum}`;
      const newComplaint = {
        id: complaintId,
        date: body.date || new Date().toISOString().split('T')[0],
        complainant: body.complainant || 'Anonymous Citizen / Law Enforcement Unit',
        category: body.category || 'Investment / Trading Fraud',
        description: body.description || 'Cryptocurrency fraudulent diversion reported via NETRA Portal.',
        reference_number: body.reference_number || `NCRP-ACK-${randomNum}`,
        jurisdiction: body.jurisdiction || 'State Cyber Crime Coordination Cell',
        investigating_unit: body.investigating_unit || 'Special Investigation Team (Cyber)',
        priority: body.priority || 'HIGH',
        status: 'ACTIVE_INVESTIGATION',
        wallet_address: body.wallet_address || '',
        tx_hash: body.tx_hash || '',
        chain: body.chain || 'Ethereum',
        asset: body.asset || 'USDT',
        amount: body.amount ? `₹${body.amount}` : '₹10,00,000',
        suspected_vasp: body.suspected_vasp || 'Binance / Global VASP',
        known_domain: body.known_domain || '',
        timestamp: new Date().toISOString()
      };

      await saveToCloudDb(newComplaint);

      // Also create an associated CaseRecord
      const newCase = {
        id: `NTR-${randomNum}`,
        fir_number: `FIR ${Math.floor(100 + Math.random() * 900)}/2026`,
        title: `${newComplaint.category} — ${newComplaint.complainant}`,
        police_station: newComplaint.jurisdiction,
        court_name: 'Chief Metropolitan Magistrate Court',
        charge_sheet_ref: null,
        ncrp_ack_number: newComplaint.reference_number,
        case_type: 'CURRENT',
        status: 'ACTIVE_INVESTIGATION',
        priority: newComplaint.priority,
        investigator: 'IO Assigned via Portal',
        victim_name: newComplaint.complainant,
        victim_wallet: newComplaint.wallet_address || '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
        loss_amount_inr: parseFloat((body.amount || '1000000').replace(/[^0-9.]/g, '')) || 1000000,
        recovery_amount_inr: 0,
        currency: newComplaint.asset,
        first_incident_date: newComplaint.date,
        last_activity_date: newComplaint.date,
        tags: [newComplaint.category, newComplaint.chain, 'MHA-NCRP'],
        identified_vasps: [newComplaint.suspected_vasp],
        synopsis: newComplaint.description,
        evidence_count: 1,
        accused_count: 0
      };
      memoryDb.cases.unshift(newCase);

      res.status(201).json({
        success: true,
        message: 'Complaint successfully registered in NETRA National Cloud Registry.',
        complaint: newComplaint,
        case: newCase
      });
      return;
    }

    res.status(200).json(db.complaints);
    return;
  }

  // Route: /cases
  if (pathname === '/cases') {
    res.status(200).json(db.cases);
    return;
  }

  // Route: /cases/:id
  if (pathname.startsWith('/cases/')) {
    const id = decodeURIComponent(pathname.replace('/cases/', ''));
    const caseRecord = db.cases.find(c => c.id === id) || db.cases[0];
    res.status(200).json(caseRecord);
    return;
  }

  // Route: /explore
  if (pathname === '/explore') {
    const totalLoss = db.cases.reduce((sum, c) => sum + (c.loss_amount_inr || 0), 0);
    const totalRecovered = db.cases.reduce((sum, c) => sum + (c.recovery_amount_inr || 0), 0);
    res.status(200).json({
      summary: {
        active_investigations: db.cases.length,
        total_intercepted_inr: totalLoss,
        total_recovered_inr: totalRecovered,
        vasp_compliance_rate: 94.2,
        active_freeze_orders: 41,
        restitution_rate_pct: 26.8
      },
      recent_alerts: [
        { id: 'ALT-901', time: '12m ago', severity: 'CRITICAL', title: 'Cross-chain sweep detected: ₹1.4 Cr from Pune FIR 412/26 into Stargate Bridge.' },
        { id: 'ALT-902', time: '44m ago', severity: 'HIGH', title: 'CoinDCX compliance desk confirmed deposit freeze on Mule Alpha account.' },
        { id: 'ALT-903', time: '1h ago', severity: 'MEDIUM', title: 'TRC-20 USDT cluster flagged across 3 inter-state syndicate dockets.' }
      ],
      high_priority_cases: db.cases.slice(0, 5)
    });
    return;
  }

  // Route: /wallets/:address/graph
  if (pathname.includes('/graph')) {
    res.status(200).json({
      nodes: seedData.DEMO_GRAPH_NODES || [],
      edges: seedData.DEMO_GRAPH_EDGES || [],
      total_discovered_nodes: seedData.DEMO_GRAPH_NODES.length,
      visible_nodes: seedData.DEMO_GRAPH_NODES.length,
      truncated_count: 0
    });
    return;
  }

  // Route: /wallets/:address/attribution
  if (pathname.includes('/attribution')) {
    res.status(200).json({
      address: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
      cluster_label: 'Layer-1 Rapid Mule (Pune Syndicate)',
      primary_vasp: 'Binance Global',
      confidence_score: 0.94,
      fiu_registered: true,
      jurisdiction: 'Global (Offshore / Cayman)',
      identified_entity: 'Syndicate Cashout Cluster Alpha',
      risk_category: 'HIGH_MULE',
      statutory_basis: 'CrPC Section 91 Direct Notice'
    });
    return;
  }

  // Route: /wallets/:address/risk
  if (pathname.includes('/risk')) {
    res.status(200).json({
      address: '0x7a912e84c98f5b89a456102dc840b8a1c97012fe',
      risk_score: 92,
      risk_level: 'CRITICAL',
      threat_tags: ['RAPID_DISPERSAL', 'MULE_NETWORK', 'BRIDGE_HOP', 'FIU_ALERT'],
      velocity_alert: 'Funds dispersed within 14 minutes of receipt',
      recommended_action: 'Issue Immediate Statutory Freeze Notice under CrPC Sec 91'
    });
    return;
  }

  // Route: /network/map
  if (pathname === '/network/map') {
    res.status(200).json({
      regions: seedData.INDIA_MAP_REGIONS || [],
      cross_state_links: [
        { source: 'Maharashtra', target: 'Karnataka', volume_inr_cr: 14.8, active_mules: 22 },
        { source: 'Delhi NCR', target: 'Gujarat', volume_inr_cr: 28.5, active_mules: 41 },
        { source: 'Telangana', target: 'Maharashtra', volume_inr_cr: 9.2, active_mules: 16 }
      ],
      summary: {
        total_active_networks: 84,
        national_intercepted_inr_cr: 142.0,
        reporting_states: 14,
        total_mules_identified: 318
      }
    });
    return;
  }

  // Route: /evidence
  if (pathname === '/evidence') {
    res.status(200).json(seedData.EVIDENCE_SEED || []);
    return;
  }

  // Route: /actions
  if (pathname === '/actions') {
    res.status(200).json(seedData.ACTIONS_SEED || []);
    return;
  }

  // Route: /actions/:id/approve
  if (pathname.includes('/approve')) {
    res.status(200).json({ status: 'EXECUTED', timestamp: new Date().toISOString() });
    return;
  }

  // Route: /sahyog/requests
  if (pathname === '/sahyog/requests') {
    res.status(200).json([
      {
        id: 'REQ-SH-0941',
        vasp_name: 'Binance Global',
        target_wallet: '0x28c6c06298d514db089934071355e5743bf21d60',
        case_id: 'NTR-DEMO-001',
        fir_number: 'FIR 412/2026',
        notice_type: 'CRPC_91_FREEZE',
        status: 'COMPLIED_FROZEN',
        frozen_amount: 'USDT 48,200 (₹40,24,700)',
        created_at: '2026-09-30 22:15 IST',
        compliance_officer: 'Binance Law Enforcement Portal (Ref #IN-90812)'
      },
      {
        id: 'REQ-SH-0942',
        vasp_name: 'CoinDCX India',
        target_wallet: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
        case_id: 'NTR-2041',
        fir_number: 'FIR 108/2026',
        notice_type: 'FAST_TRACK_FREEZE',
        status: 'FROZEN_CONFIRMED',
        frozen_amount: 'ETH 4.2 (₹9,29,355)',
        created_at: '2026-10-01 11:30 IST',
        compliance_officer: 'Nodal Compliance Desk (FIU-IND/2024)'
      }
    ]);
    return;
  }

  // Route: /sahyog/vasp-directory
  if (pathname === '/sahyog/vasp-directory') {
    res.status(200).json([
      { name: 'CoinDCX', fiu_status: 'REGISTERED', jurisdiction: 'India', compliance_sla: '1.8h', total_frozen_inr_cr: 48.2 },
      { name: 'WazirX', fiu_status: 'REGISTERED', jurisdiction: 'India', compliance_sla: '2.1h', total_frozen_inr_cr: 32.5 },
      { name: 'Binance Global', fiu_status: 'REGISTERED_FIU', jurisdiction: 'Global', compliance_sla: '4.2h', total_frozen_inr_cr: 210.8 },
      { name: 'OKX Global', fiu_status: 'COOPERATING', jurisdiction: 'Seychelles', compliance_sla: '6.5h', total_frozen_inr_cr: 84.0 },
      { name: 'Bybit', fiu_status: 'COOPERATING', jurisdiction: 'UAE / Dubai', compliance_sla: '5.1h', total_frozen_inr_cr: 62.4 },
      { name: 'Mudrex', fiu_status: 'REGISTERED', jurisdiction: 'India', compliance_sla: '1.2h', total_frozen_inr_cr: 14.6 }
    ]);
    return;
  }

  // Route: /trends
  if (pathname === '/trends') {
    res.status(200).json({
      kpis: {
        total_reported_loss_inr_cr: 2480.0,
        total_intercepted_inr_cr: 612.4,
        restitution_rate_pct: 24.7,
        avg_vasp_freeze_sla_hours: 3.2,
        active_syndicates_tracked: 84
      },
      yearly_trajectory: [
        { year: '2023', reported_cr: 840, intercepted_cr: 110, recovered_cr: 64 },
        { year: '2024', reported_cr: 1420, intercepted_cr: 285, recovered_cr: 172 },
        { year: '2025', reported_cr: 1980, intercepted_cr: 460, recovered_cr: 310 },
        { year: '2026 (YTD)', reported_cr: 2480, intercepted_cr: 612, recovered_cr: 428 }
      ],
      modus_operandi_breakdown: [
        { category: 'Digital Arrest / Fake Police Scams', share_pct: 38, reported_cr: 942.4, avg_loss_lakh: 42.5 },
        { category: 'Algorithmic Stock Trading & Pig Butchering', share_pct: 29, reported_cr: 719.2, avg_loss_lakh: 68.0 },
        { category: 'Telegram Task & Part-Time Job Scams', share_pct: 18, reported_cr: 446.4, avg_loss_lakh: 12.8 },
        { category: 'Cross-Border Mule Pass-Throughs', share_pct: 11, reported_cr: 272.8, avg_loss_lakh: 84.0 },
        { category: 'Loan App Coercion & Impersonation', share_pct: 4, reported_cr: 99.2, avg_loss_lakh: 4.5 }
      ],
      chain_distribution: [
        { chain: 'Tron (TRC-20 USDT)', share_pct: 64, volume_cr: 1587.2, avg_velocity_min: 18 },
        { chain: 'Ethereum (EVM / DeFi)', share_pct: 24, volume_cr: 595.2, avg_velocity_min: 44 },
        { chain: 'Bitcoin (BTC / OTC)', share_pct: 8, volume_cr: 198.4, avg_velocity_min: 120 },
        { chain: 'BNB Smart Chain (BSC)', share_pct: 4, volume_cr: 99.2, avg_velocity_min: 25 }
      ],
      vasp_benchmarks: [
        { vasp: 'CoinDCX', sla_hours: 1.8, compliance_pct: 98, jurisdiction: 'India (FIU-IND)' },
        { vasp: 'Mudrex', sla_hours: 1.2, compliance_pct: 99, jurisdiction: 'India (FIU-IND)' },
        { vasp: 'WazirX', sla_hours: 2.1, compliance_pct: 95, jurisdiction: 'India (FIU-IND)' },
        { vasp: 'Binance Global', sla_hours: 4.2, compliance_pct: 91, jurisdiction: 'Global (Offshore)' },
        { vasp: 'Bybit', sla_hours: 5.1, compliance_pct: 88, jurisdiction: 'UAE / Dubai' },
        { vasp: 'OKX Global', sla_hours: 6.5, compliance_pct: 84, jurisdiction: 'Seychelles' }
      ]
    });
    return;
  }

  // Route: /audit
  if (pathname === '/audit') {
    res.status(200).json([
      {
        timestamp: new Date().toISOString(),
        actor: 'IO Deshmukh (Cyber PS Pune)',
        action: 'CLOUD_REGISTRY_SYNC',
        detail: 'Synchronized shared national database dockets and active statutory notices.',
        ip_hash: '103.24.18.91 (NIC Secure Gateway)'
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actor: 'Automated SAHYOG Bridge',
        action: 'STATUTORY_FREEZE_ACK',
        detail: 'CoinDCX Nodal Officer confirmed freeze of 4.2 ETH under FIR 412/26.',
        ip_hash: '10.0.84.12 (Internal Nodal Relay)'
      }
    ]);
    return;
  }

  // Fallback
  res.status(200).json({ status: 'OK', message: 'NETRA Dedicated Forensic API v2.4 Active', timestamp: new Date().toISOString() });
};
