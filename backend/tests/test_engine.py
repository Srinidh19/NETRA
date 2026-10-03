import unittest
from backend.intelligence.graph_engine import GraphIntelligenceEngine
from backend.intelligence.vasp_attribution import VASPAttributionEngine
from backend.providers.sahyog import SahyogSandboxProvider, SahyogProductionProvider
from backend.providers.blockchain import BitqueryProvider, EthereumRPCProvider, TronProvider
from backend.data.seed_data import DEMO_GRAPH_NODES, DEMO_GRAPH_EDGES

class TestNetraKernel(unittest.TestCase):
    def setUp(self):
        self.graph_engine = GraphIntelligenceEngine()
        self.graph_engine.load_fixture(DEMO_GRAPH_NODES, DEMO_GRAPH_EDGES)
        self.vasp_engine = VASPAttributionEngine()
        self.sahyog_sbx = SahyogSandboxProvider()
        self.sahyog_prd = SahyogProductionProvider()

    def test_disciplined_graph_windowing(self):
        """Verify graph windowing prevents visual overload and preserves high-conviction nodes."""
        res = self.graph_engine.get_scoped_graph(
            "0x7a912e84c98f5b89a456102dc840b8a1c97012fe",
            max_visible=6,
            hops=2
        )
        self.assertLessEqual(len(res.nodes), 7)
        self.assertGreaterEqual(res.total_discovered_nodes, len(res.nodes))
        self.assertGreaterEqual(res.truncated_count, 0)
        # Root node must always be present
        root_present = any(n.id == "0x7a912e84c98f5b89a456102dc840b8a1c97012fe" for n in res.nodes)
        self.assertTrue(root_present)

    def test_hidden_paths_multi_hypothesis(self):
        """Verify discovery of Primary, Alternative, and Ambiguous multi-paths."""
        paths = self.graph_engine.discover_hidden_paths("0x7a912e84c98f5b89a456102dc840b8a1c97012fe")
        self.assertEqual(len(paths), 3)
        types = [p.path_type for p in paths]
        self.assertIn("Primary", types)
        self.assertIn("Alternative", types)
        self.assertIn("Ambiguous", types)

        primary = next(p for p in paths if p.path_type == "Primary")
        self.assertGreater(primary.investigative_value, 0.8)
        self.assertEqual(primary.destination_vasp, "Binance Global")

        alternative = next(p for p in paths if p.path_type == "Alternative")
        self.assertEqual(alternative.destination_vasp, "CoinDCX India")
        self.assertTrue(any(h.from_category == "Bridge" or h.to_category == "Bridge" for h in alternative.hops))

    def test_vasp_attribution_no_fake_ai_confidence(self):
        """Verify attribution outputs structured evidence, limitations, and competing hypotheses."""
        finding = self.vasp_engine.attribute_wallet("0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be")
        self.assertEqual(finding.status, "STRONG SUPPORT")
        self.assertGreaterEqual(len(finding.supporting_observations), 5)
        self.assertGreaterEqual(len(finding.limitations), 1)
        self.assertGreaterEqual(len(finding.competing_hypotheses), 1)
        # Ensure limitations explicitly flag shared infrastructure
        self.assertTrue(any("Shared Multi-User" in l.statement for l in finding.limitations))

    def test_next_best_lead_engine(self):
        """Verify actionable lead generation instead of vague paragraphs."""
        lead = self.graph_engine.get_next_best_lead("0x7a912e84c98f5b89a456102dc840b8a1c97012fe")
        self.assertIn("target_wallet", lead)
        self.assertIn("reasons", lead)
        self.assertGreater(len(lead["reasons"]), 2)
        self.assertIn("action_cta", lead)

    def test_sahyog_sandbox_lifecycle_feedback_loop(self):
        """Verify SAHYOG statutory request submission and feedback loop into case evidence."""
        req = self.sahyog_sbx.create_request({
            "case_id": "NTR-DEMO-001",
            "request_type": "DISCLOSURE",
            "vasp_id": "vasp-binance-global",
            "vasp_name": "Binance Global",
            "target_wallet": "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
            "competent_authority": "Cyber Police Station, Pune City"
        })
        self.assertTrue(req["sandbox_mode"])
        self.assertEqual(req["status"], "PREPARED")

        sub = self.sahyog_sbx.submit_request(req["id"])
        self.assertEqual(sub["status"], "SUCCESS")
        self.assertIn("acknowledgement_id", sub)
        self.assertTrue(sub["response"]["feedback_applied_to_graph"])

    def test_sahyog_production_guardrail(self):
        """Verify production adapter rejects execution if mTLS certs are unconfigured."""
        auth = self.sahyog_prd.authenticate()
        self.assertFalse(auth["authenticated"])
        self.assertEqual(auth["mode"], "PRODUCTION")

    def test_provider_schemas(self):
        """Verify provider schemas are discoverable and validated."""
        bq = BitqueryProvider()
        schema = bq.get_schema()
        self.assertEqual(schema["status"], "VALIDATED")
        self.assertIn("EVM", schema["entities"])

if __name__ == "__main__":
    unittest.main()
