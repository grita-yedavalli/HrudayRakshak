"""
Automated Clinical RAG Verification & Audit Script
Validates ChromaDB multi-slot retrieval, Ollama generation, and audits physician tone compliance.
"""

import sys
import os
import re

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from rag.service import clinical_rag_service, DISEASE_CODE_MAP

BANNED_AI_TERMS = [
    r"\bmodel\b",
    r"\bneural network\b",
    r"\brosanet\b",
    r"\balgorithm\b",
    r"\bprobability\b",
    r"\bprobabilities\b",
    r"\bconfidence score\b",
    r"\bsigmoid\b",
    r"\bclassifier\b",
    r"\bbutterworth\b",
    r"\bdeep learning\b"
]

REQUIRED_CLINICAL_SECTIONS = [
    "CLINICAL IMPRESSION",
    "PHONOCARDIOGRAPHIC & AUSCULTATORY ANALYSIS",
    "HEMODYNAMIC PATHOPHYSIOLOGY & STAGING",
    "DIFFERENTIAL CONSIDERATIONS",
    "GUIDELINE-DIRECTED WORKUP & MANAGEMENT PROTOCOL"
]

TEST_CASES = [
    {
        "name": "Severe Aortic Stenosis (Elderly Smoker, Aortic Site Sitting)",
        "disease": "AS",
        "metadata": {
            "age": 68,
            "gender": "M",
            "smoker": 1,
            "valve_site": "Aor",
            "posture": "sit",
            "patient_id": "Patient 005 (AS Benchmark)"
        }
    },
    {
        "name": "Mitral Regurgitation (Female, Apex Supine)",
        "disease": "MR",
        "metadata": {
            "age": 54,
            "gender": "F",
            "smoker": 0,
            "valve_site": "Mit",
            "posture": "sup",
            "patient_id": "Patient 002 (MR Benchmark)"
        }
    },
    {
        "name": "Aortic Regurgitation (Male, Erb's Point Sitting)",
        "disease": "AR",
        "metadata": {
            "age": 42,
            "gender": "M",
            "smoker": 0,
            "valve_site": "Aor",
            "posture": "sit",
            "patient_id": "Patient 016 (AR Benchmark)"
        }
    },
    {
        "name": "Mitral Stenosis (Rheumatic, Apex Supine)",
        "disease": "MS",
        "metadata": {
            "age": 36,
            "gender": "F",
            "smoker": 0,
            "valve_site": "Mit",
            "posture": "sup",
            "patient_id": "Patient 006 (MS Benchmark)"
        }
    },
    {
        "name": "Physiological / Normal Heart Sound",
        "disease": "Normal",
        "metadata": {
            "age": 28,
            "gender": "M",
            "smoker": 0,
            "valve_site": "Mit",
            "posture": "sup",
            "patient_id": "Patient 089 (Normal Benchmark)"
        }
    }
]

def run_rag_audit():
    print("=" * 80)
    print("      BMD-HS ROSANET CLINICAL RAG VERIFICATION & COMPLIANCE AUDIT")
    print("=" * 80)
    
    total_tests = len(TEST_CASES)
    passed_tests = 0
    
    for idx, tc in enumerate(TEST_CASES, 1):
        print(f"\n--- [Case {idx}/{total_tests}] Testing: {tc['name']} ---")
        
        disease_code = tc["disease"]
        meta = tc["metadata"]
        
        # 1. Test 3-Slot Auto-Retrieval
        evidence = clinical_rag_service.execute_three_auto_queries(
            disease_code, meta["valve_site"], meta["posture"]
        )
        
        slots_found = {k: bool(v and len(v.strip()) > 20) for k, v in evidence.items()}
        print(f"  [ChromaDB Retrieval] Slot 1 (Acoustics): {'PASS' if slots_found['acoustic'] else 'EMPTY'}")
        print(f"  [ChromaDB Retrieval] Slot 2 (Guidelines): {'PASS' if slots_found['guideline'] else 'EMPTY'}")
        print(f"  [ChromaDB Retrieval] Slot 3 (Pathophysiology): {'PASS' if slots_found['pathophysiology'] else 'EMPTY'}")
        
        # 2. Test Clinical Report Generation
        report = clinical_rag_service.generate_clinical_consultation_report(disease_code, meta)
        
        if not report or len(report.strip()) < 150:
            print("  [Report Generation] FAILED: Report is empty or too short.")
            continue
        print(f"  [Report Generation] Generated {len(report)} characters of clinical text.")
        
        # 3. Audit Required Sections
        report_upper = report.upper()
        missing_sections = [sec for sec in REQUIRED_CLINICAL_SECTIONS if sec not in report_upper]
        if missing_sections:
            print(f"  [Structure Audit] WARNING: Missing sections: {missing_sections}")
        else:
            print("  [Structure Audit] PASS: All 5 standardized clinical sections present.")
            
        # 4. Audit Tone & Banned AI/ML Jargon
        violations = []
        for term_regex in BANNED_AI_TERMS:
            matches = re.findall(term_regex, report, re.IGNORECASE)
            if matches:
                violations.extend(matches)
                
        if violations:
            print(f"  [Tone Audit] FAILED: Banned AI terms detected: {set(violations)}")
        else:
            print("  [Tone Audit] PASS: Zero AI/ML jargon detected. 100% formal cardiology tone.")
            
        if not missing_sections and not violations and any(slots_found.values()):
            passed_tests += 1
            print(f"  >>> RESULT: CASE {idx} PASSED CLINICAL AUDIT.")
        else:
            print(f"  >>> RESULT: CASE {idx} REQUIRES REVIEW.")
            
    print("\n" + "=" * 80)
    print(f"AUDIT SUMMARY: {passed_tests}/{total_tests} Cases Passed Verification.")
    print("=" * 80)
    return passed_tests == total_tests

if __name__ == "__main__":
    success = run_rag_audit()
    sys.exit(0 if success else 1)
