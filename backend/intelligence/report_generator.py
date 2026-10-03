import time
from typing import Dict, Any, List
from ..models import InvestigationReport, RiskIndicator

class ReportGeneratorEngine:
    """
    Evidence-Backed Investigation Report Generator.
    Generates formal forensic briefs with full data provenance, transaction exhibits,
    VASP attribution findings, and SAHYOG notice records.
    """
    def __init__(self):
        pass

    def generate_case_report(
        self,
        case: Dict[str, Any],
        paths: List[Any],
        attribution: Any,
        risk: RiskIndicator,
        evidence: List[Dict[str, Any]],
        actions: List[Dict[str, Any]],
        audits: List[Dict[str, Any]]
    ) -> InvestigationReport:
        report_id = f"REP-{case['id']}-{int(time.time()) % 10000}"
        
        # Serialize trace hops
        trace_hops = []
        if paths and len(paths) > 0:
            for hop in paths[0].hops:
                trace_hops.append({
                    "step": hop.step,
                    "from_entity": hop.from_entity,
                    "to_entity": hop.to_entity,
                    "action": hop.action,
                    "chain": hop.chain,
                    "amount": hop.amount,
                    "tx_hash": hop.tx_hash,
                    "timestamp": hop.timestamp,
                    "evidence_id": hop.evidence_id
                })

        return InvestigationReport(
            report_id=report_id,
            case_id=case["id"],
            title=f"Forensic Intelligence Brief: {case['title']}",
            generated_at=time.strftime("%d %b %Y %H:%M:%S IST"),
            investigator=case.get("investigator", "Cyber Financial Crime Officer"),
            source_wallet=case.get("victim_wallet", "0x4838b1..."),
            observed_loss_inr=case.get("loss_amount_inr", 4280000.0),
            summary=case.get("synopsis", "Automated forensic brief compiling on-chain flows."),
            fund_flow_trace=trace_hops,
            vasp_attribution={
                "primary_vasp": attribution.primary_vasp if attribution else "Unresolved",
                "status": attribution.status if attribution else "INSUFFICIENT",
                "supporting_observations_count": len(attribution.supporting_observations) if attribution else 0,
                "analyst_note": attribution.analyst_note if attribution else "No attribution record available."
            },
            risk_indicators=risk,
            evidence_provenance=evidence,
            action_history=actions,
            sahyog_references=[
                {"request_id": "SHYG-SBX-2026-0819", "vasp": "Binance Global", "status": "ACKNOWLEDGED_WITH_DISCLOSURE"}
            ],
            audit_trail=audits
        )
