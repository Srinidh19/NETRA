import unittest
from backend.intelligence.risk_engine import RiskIntelligenceEngine
from backend.intelligence.report_generator import ReportGeneratorEngine
from backend.data.seed_data import CASES_SEED

class TestRiskAndReports(unittest.TestCase):
    def setUp(self):
        self.risk_engine = RiskIntelligenceEngine()
        self.report_gen = ReportGeneratorEngine()

    def test_typology_and_risk_evaluation(self):
        """Verify explainable risk evaluation without fake percentage scores."""
        risk = self.risk_engine.evaluate_wallet_risk("0x7a912e84c98f5b89a456102dc840b8a1c97012fe")
        self.assertEqual(risk.overall_level, "HIGH")
        self.assertGreaterEqual(len(risk.typologies), 4)
        
        # Verify specific typologies are observed
        typ_names = [t.name for t in risk.typologies]
        self.assertIn("Rapid Layering", typ_names)
        self.assertIn("Fan-In Consolidation", typ_names)
        self.assertIn("Cross-Chain Bridge Hopping", typ_names)
        self.assertIn("Mixer / Privacy Infrastructure", typ_names)
        self.assertTrue(risk.privacy_mixer_detected)

    def test_forensic_report_generation(self):
        """Verify evidence-backed forensic brief generation with data provenance."""
        case = CASES_SEED[0]
        risk = self.risk_engine.evaluate_wallet_risk(case["victim_wallet"])
        report = self.report_gen.generate_case_report(
            case=case,
            paths=[],
            attribution=None,
            risk=risk,
            evidence=[],
            actions=[],
            audits=[]
        )
        self.assertIn("Forensic Intelligence Brief", report.title)
        self.assertEqual(report.case_id, case["id"])
        self.assertEqual(report.risk_indicators.overall_level, "HIGH")

if __name__ == "__main__":
    unittest.main()
