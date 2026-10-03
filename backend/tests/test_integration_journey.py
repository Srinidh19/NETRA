import unittest
import urllib.request
import json

class TestNetraInvestigationJourney(unittest.TestCase):
    BASE_URL = "http://127.0.0.1:8000/api"

    def test_01_system_health_and_providers(self):
        """Step 1 & 2: System telemetry shows online providers and schema registry."""
        req = urllib.request.urlopen(f"{self.BASE_URL}/system/health")
        data = json.loads(req.read().decode('utf-8'))
        self.assertEqual(data["status"], "OPERATIONAL")
        self.assertIn("SANDBOX", data["sahyog_mode"])

        req_prov = urllib.request.urlopen(f"{self.BASE_URL}/system/providers")
        provs = json.loads(req_prov.read().decode('utf-8'))
        self.assertGreaterEqual(len(provs), 4)
        prov_names = [p["name"] for p in provs]
        self.assertTrue(any("Bitquery" in n for n in prov_names))
        self.assertTrue(any("Ethereum" in n for n in prov_names))

    def test_02_search_demo_wallet(self):
        """Step 3 & 4: Search demo suspicious wallet returns instant entity match."""
        query = "0x7a912e84c98f5b89a456102dc840b8a1c97012fe"
        req = urllib.request.urlopen(f"{self.BASE_URL}/search?q={query}")
        res = json.loads(req.read().decode('utf-8'))
        self.assertGreaterEqual(len(res["matches"]), 1)
        match = res["matches"][0]
        self.assertIn("Primary Mule", match["title"])
        self.assertEqual(match["url"], f"/investigate/{query}")

    def test_03_graph_disciplined_windowing(self):
        """Step 5 & 6: Graph displays disciplined scope without random animations."""
        addr = "0x7a912e84c98f5b89a456102dc840b8a1c97012fe"
        req = urllib.request.urlopen(f"{self.BASE_URL}/wallets/{addr}/graph?max_visible=8")
        graph = json.loads(req.read().decode('utf-8'))
        self.assertLessEqual(len(graph["nodes"]), 9)
        self.assertGreater(graph["total_discovered_nodes"], 0)
        # Check node categories
        cats = [n["category"] for n in graph["nodes"]]
        self.assertIn("Wallet", cats)
        self.assertTrue(any("VASP" in c for c in cats))

    def test_04_multi_path_trace_discovery(self):
        """Step 7: Trace discovers Primary, Alternative and Ambiguous paths with investigative scoring."""
        addr = "0x7a912e84c98f5b89a456102dc840b8a1c97012fe"
        req = urllib.request.urlopen(f"{self.BASE_URL}/graph/path?start={addr}")
        paths = json.loads(req.read().decode('utf-8'))
        self.assertEqual(len(paths), 3)

        primary = next(p for p in paths if p["path_type"] == "Primary")
        self.assertEqual(primary["destination_vasp"], "Binance Global")
        self.assertEqual(primary["continuity_status"], "STRONG CONTINUITY")
        self.assertGreater(primary["investigative_value"], 0.85)

        alt = next(p for p in paths if p["path_type"] == "Alternative")
        self.assertEqual(alt["destination_vasp"], "CoinDCX India")
        self.assertTrue(any("Bridge" in h["to_category"] or "Bridge" in h["from_category"] for h in alt["hops"]))

    def test_05_vasp_attribution_structured_finding(self):
        """Step 8, 9, 10 & 11: Attribution outputs STRONG SUPPORT, 7 observations, 2 limitations, 1 competing."""
        addr = "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be"
        req = urllib.request.urlopen(f"{self.BASE_URL}/wallets/{addr}/attribution")
        attr = json.loads(req.read().decode('utf-8'))
        self.assertEqual(attr["status"], "STRONG SUPPORT")
        self.assertEqual(len(attr["supporting_observations"]), 7)
        self.assertEqual(len(attr["limitations"]), 2)
        self.assertEqual(len(attr["competing_hypotheses"]), 1)
        self.assertIn("Binance Global", attr["primary_vasp"])
        self.assertIn("OBSERVED:", attr["analyst_note"])
        self.assertIn("LIMITATION:", attr["analyst_note"])

    def test_06_sahyog_request_and_feedback_loop(self):
        """Step 12-20: Prepare SAHYOG notice -> Submit to Sandbox -> Response arrives -> Feedback to graph & evidence."""
        # Create request
        payload = json.dumps({
            "case_id": "NTR-DEMO-001",
            "request_type": "DISCLOSURE",
            "vasp_id": "vasp-binance-global",
            "vasp_name": "Binance Global",
            "target_wallet": "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
            "competent_authority": "Cyber Police Station, Pune City",
            "observations": "Automated test sweep verification."
        }).encode('utf-8')

        req = urllib.request.Request(
            f"{self.BASE_URL}/sahyog/create",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        created = json.loads(res.read().decode('utf-8'))
        req_id = created["id"]
        self.assertTrue(created["sandbox_mode"])

        # Submit request
        sub_req = urllib.request.Request(
            f"{self.BASE_URL}/sahyog/requests/{req_id}/submit",
            data=b"",
            headers={"Content-Type": "application/json"}
        )
        sub_res = urllib.request.urlopen(sub_req)
        sub_data = json.loads(sub_res.read().decode('utf-8'))
        self.assertEqual(sub_data["status"], "SUBMITTED_AND_ACKNOWLEDGED")
        self.assertIn("I4C-ACK-2026-", sub_data["response"]["acknowledgement_id"])
        new_ev_id = sub_data["new_evidence_id"]

        # Verify evidence item was added to the evidence vault
        ev_req = urllib.request.urlopen(f"{self.BASE_URL}/evidence/{new_ev_id}")
        ev_data = json.loads(ev_req.read().decode('utf-8'))
        self.assertEqual(ev_data["id"], new_ev_id)
        self.assertTrue(ev_data["verified_tamper_evident"])
        self.assertIn("Binance Global", ev_data["title"])

        # Verify audit trail recorded the event
        aud_req = urllib.request.urlopen(f"{self.BASE_URL}/audit")
        audit_trail = json.loads(aud_req.read().decode('utf-8'))
        latest = audit_trail[0]
        self.assertIn("SAHYOG", latest["action"])

    def test_07_national_scam_map_telemetry(self):
        """Verify national radar provides cross-state links and regional statistics."""
        req = urllib.request.urlopen(f"{self.BASE_URL}/network/map")
        map_data = json.loads(req.read().decode('utf-8'))
        self.assertGreater(len(map_data["regions"]), 5)
        self.assertGreater(len(map_data["cross_state_links"]), 2)
        mh = next(r for r in map_data["regions"] if r["id"] == "IN-MH")
        self.assertEqual(mh["active_investigations"], 84)

if __name__ == "__main__":
    unittest.main()
