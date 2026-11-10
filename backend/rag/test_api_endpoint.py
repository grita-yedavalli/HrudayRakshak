"""
End-to-End API Integration Test for BMD-HS RosaNet RAG Engine
Tests the live FastAPI /api/predict endpoint with real patient benchmark audio.
"""

import sys
import os
import re

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_predict_with_rag():
    print("Testing POST /api/predict with AS_005_sit_Aor...")
    response = client.post(
        "/api/predict",
        data={
            "sample_id": "AS_005_sit_Aor",
            "age": "65",
            "gender": "M",
            "smoker": 1,
            "lives": "U",
            "valve_site": "Aor",
            "posture": "sit"
        }
    )
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    
    print("\n[API Response Summary]")
    print(f"Primary Diagnosis : {data.get('primary_diagnosis')}")
    print(f"Severity          : {data.get('severity')}")
    print(f"Probabilities     : {data.get('probabilities')}")
    
    report = data.get("clinical_report")
    assert report, "Expected 'clinical_report' in API response, but got None"
    print(f"\n[Clinical Consultation Report Preview ({len(report)} chars)]")
    print(report[:800] + "\n...[truncated for brevity]...\n")
    
    # Audit for required clinical sections
    required_sections = [
        "CLINICAL IMPRESSION",
        "PHONOCARDIOGRAPHIC & AUSCULTATORY ANALYSIS",
        "HEMODYNAMIC PATHOPHYSIOLOGY & STAGING",
        "DIFFERENTIAL CONSIDERATIONS",
        "GUIDELINE-DIRECTED WORKUP & MANAGEMENT PROTOCOL"
    ]
    report_upper = report.upper()
    for sec in required_sections:
        assert sec in report_upper, f"Missing section: {sec}"
    print("PASS: All 5 standardized clinical sections verified in API response.")
    
    # Audit for zero AI/ML terms
    banned = [r"\bneural network\b", r"\brosanet\b", r"\bmodel\b", r"\bconfidence score\b"]
    for b in banned:
        matches = re.findall(b, report, re.IGNORECASE)
        assert len(matches) == 0, f"Banned AI term found: {matches}"
    print("PASS: Zero AI/ML terms detected in clinical report.")
    print("\n>>> END-TO-END FASTAPI RAG INTEGRATION VERIFIED.")

if __name__ == "__main__":
    test_predict_with_rag()
