"""
Clinical RAG Report Generation Service for BMD-HS RosaNet.
Executes 3 programmatic auto-queries and calls local Ollama with a strict physician prompt.
"""

import os
import json
import logging
import urllib.request
import urllib.error
import chromadb
from chromadb.utils import embedding_functions

logger = logging.getLogger("clinical_rag")

DISEASE_NAME_MAP = {
    "AS": "Aortic Stenosis",
    "AR": "Aortic Regurgitation",
    "MR": "Mitral Regurgitation",
    "MS": "Mitral Stenosis",
    "Normal": "Physiological / Normal Cardiac Auscultation",
    "Aortic Stenosis": "Aortic Stenosis",
    "Aortic Regurgitation": "Aortic Regurgitation",
    "Mitral Regurgitation": "Mitral Regurgitation",
    "Mitral Stenosis": "Mitral Stenosis",
    "Normal Heart Sound": "Physiological / Normal Cardiac Auscultation"
}

DISEASE_CODE_MAP = {
    "Aortic Stenosis": "AS",
    "Aortic Regurgitation": "AR",
    "Mitral Regurgitation": "MR",
    "Mitral Stenosis": "MS",
    "Normal": "Normal",
    "Normal Heart Sound": "Normal",
    "AS": "AS",
    "AR": "AR",
    "MR": "MR",
    "MS": "MS"
}

VALVE_FULL_NAMES = {
    "Aor": "Aortic Area (Right 2nd Intercostal Space parasternal)",
    "Pul": "Pulmonic Area (Left 2nd Intercostal Space parasternal)",
    "Tri": "Tricuspid Area (Left 4th/5th Intercostal Space parasternal)",
    "Mit": "Mitral Area / Cardiac Apex (Left 5th Intercostal Space midclavicular)"
}

POSTURE_FULL_NAMES = {
    "sit": "Sitting Leaning Forward",
    "sup": "Supine (Recumbent)"
}

class ClinicalRAGService:
    def __init__(self, chroma_path: str = None, ollama_model: str = "llama3.2:3b", ollama_host: str = "http://localhost:11434"):
        if chroma_path is None:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            chroma_path = os.path.join(script_dir, "chroma_db")
            
        self.chroma_path = chroma_path
        self.ollama_model = os.getenv("OLLAMA_MODEL", ollama_model)
        self.ollama_host = os.getenv("OLLAMA_HOST", ollama_host).rstrip("/")
        
        self.client = None
        self.collection = None
        self._init_vector_db()

    def _init_vector_db(self):
        try:
            if os.path.exists(self.chroma_path):
                self.client = chromadb.PersistentClient(path=self.chroma_path)
                embed_fn = embedding_functions.OllamaEmbeddingFunction(
                    url=f"{self.ollama_host}/api/embeddings",
                    model_name="all-minilm"
                )
                self.collection = self.client.get_collection(
                    name="cardiology_guidelines",
                    embedding_function=embed_fn
                )
        except Exception as e:
            logger.warning(f"ChromaDB not yet initialized or collection missing: {e}")

    def query_slot(self, disease_code: str, slot_type: str, query_text: str) -> str:
        """Query ChromaDB specifically for one of the 3 clinical slots."""
        if self.collection is None:
            self._init_vector_db()
            
        if self.collection is None:
            return ""
            
        try:
            # Query with metadata filtering to prevent semantic collision
            results = self.collection.query(
                query_texts=[query_text],
                n_results=1,
                where={"$and": [{"disease": disease_code}, {"slot": slot_type}]}
            )
            if results and results.get("documents") and results["documents"][0]:
                return results["documents"][0][0]
        except Exception as e:
            logger.debug(f"Direct slot query failed, attempting disease fallback: {e}")
            try:
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=1,
                    where={"disease": disease_code}
                )
                if results and results.get("documents") and results["documents"][0]:
                    return results["documents"][0][0]
            except Exception as ex:
                logger.error(f"Fallback Chroma query error: {ex}")
        return ""

    def _read_knowledge_file(self, disease_code: str, slot_type: str) -> str:
        """Direct file fallback to read curated clinical knowledge markdown files when vector DB is offline."""
        try:
            filename_map = {
                'acoustic': 'auscultation_biomechanics.md',
                'guideline': 'acc_aha_2020_vhd_criteria.md',
                'pathophysiology': 'pathophysiology_precautions.md'
            }
            fname = filename_map.get(slot_type)
            if not fname:
                return ''
            script_dir = os.path.dirname(os.path.abspath(__file__))
            fpath = os.path.join(script_dir, 'knowledge', fname)
            if not os.path.exists(fpath):
                return ''
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            import re
            if disease_code in ['Normal', 'N']:
                pattern = r'###\s+[^#\n]*(?:Normal|Physiological)[^\n]*\n([\s\S]*?)(?=\n###|\Z)'
            else:
                pattern = rf'###\s+[^#\n]*\({disease_code}\)[^\n]*\n([\s\S]*?)(?=\n###|\Z)'
            match = re.search(pattern, content)
            if match:
                return match.group(1).strip()
        except Exception as e:
            logger.warning(f"Direct knowledge file read error: {e}")
        return ''

    def execute_three_auto_queries(self, disease_code: str, valve_site: str, posture: str) -> dict:
        """Execute the 3 targeted programmatic queries with instant markdown knowledge fallback."""
        disease_name = DISEASE_NAME_MAP.get(disease_code, disease_code)
        
        # Slot 1: Acoustic Biomechanics
        q1 = f"{disease_name} phonocardiogram murmur acoustic timing S1 S2 frequency {valve_site} {posture}"
        doc_acoustic = self.query_slot(disease_code, "acoustic", q1)
        if not doc_acoustic:
            doc_acoustic = self._read_knowledge_file(disease_code, "acoustic")
        
        # Slot 2: ACC/AHA 2020 Guidelines & Staging
        q2 = f"{disease_name} ACC/AHA 2020 clinical staging Doppler echocardiography criteria Vmax gradient valve area"
        doc_guideline = self.query_slot(disease_code, "guideline", q2)
        if not doc_guideline:
            doc_guideline = self._read_knowledge_file(disease_code, "guideline")
        
        # Slot 3: Pathophysiology & Precautions
        q3 = f"{disease_name} hemodynamic pathophysiology ventricular remodeling differential diagnoses medication precautions intervention"
        doc_precautions = self.query_slot(disease_code, "pathophysiology", q3)
        if not doc_precautions:
            doc_precautions = self._read_knowledge_file(disease_code, "pathophysiology")
        
        return {
            "acoustic": doc_acoustic,
            "guideline": doc_guideline,
            "pathophysiology": doc_precautions
        }

    def _call_ollama(self, prompt: str) -> str:
        """Call local Ollama REST API."""
        url = f"{self.ollama_host}/api/generate"
        payload = {
            "model": self.ollama_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,  # Strict clinical fidelity
                "num_ctx": 4096
            }
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response", "").strip()

    def generate_clinical_consultation_report(self, primary_disease: str, patient_metadata: dict) -> str:
        """
        Generates a formal physician-to-physician cardiology consultation report.
        Zero AI/ML jargon, 100% formal medical terminology.
        """
        disease_code = DISEASE_CODE_MAP.get(primary_disease, "AS")
        disease_full_name = DISEASE_NAME_MAP.get(disease_code, primary_disease)
        
        valve_site_raw = patient_metadata.get("valve_site", "Aor")
        valve_full = VALVE_FULL_NAMES.get(valve_site_raw, valve_site_raw)
        
        posture_raw = patient_metadata.get("posture", "sit")
        posture_full = POSTURE_FULL_NAMES.get(posture_raw, posture_raw)
        
        age = patient_metadata.get("age", 65)
        gender = "Male" if str(patient_metadata.get("gender", "")).upper() in ["M", "MALE", "1"] else "Female"
        smoker_str = "Active Tobacco Use" if str(patient_metadata.get("smoker", "0")) in ["1", "True", "true", "smoker"] else "Non-smoker"
        patient_id = patient_metadata.get("patient_id", "BMD-HS Clinical Case")
        
        # 1. Execute the 3 Programmatic Auto-Queries
        evidence = self.execute_three_auto_queries(disease_code, valve_site_raw, posture_raw)
        
        # 2. Construct Strict Physician Prompt
        prompt = f"""You are the Chief of Cardiology drafting a formal Consultation & Diagnostic Assessment Report for an attending physician.
You are evaluating a patient who presented for cardiac auscultation and acoustic mapping.

PATIENT CLINICAL RECORD:
- Patient Identifier: {patient_id}
- Age: {age} years old | Gender: {gender}
- Cardiovascular Risk Factors: {smoker_str}
- Auscultation Recording Focus: {valve_full}
- Patient Posture during Recording: {posture_full}
- Primary Valvular Pathology Identified: {disease_full_name}

AUTHORITATIVE CLINICAL KNOWLEDGE (ACC/AHA 2020 GUIDELINES & ACOUSTIC EVIDENCE):
[SLOT 1: PHONOCARDIOGRAM ACOUSTICS & BIOMECHANICS]
{evidence.get('acoustic', 'Refer to standard valvular acoustic mechanics.')}

[SLOT 2: ACC/AHA 2020 CLINICAL STAGING & DOPPLER CRITERIA]
{evidence.get('guideline', 'Refer to 2020 ACC/AHA VHD Guidelines.')}

[SLOT 3: HEMODYNAMICS, DIFFERENTIALS & MANAGEMENT PRECAUTIONS]
{evidence.get('pathophysiology', 'Refer to hemodynamic remodeling and guideline medical therapy.')}

STRICT PROFESSIONAL COMPLIANCE MANDATE:
1. BAN ALL ARTIFICIAL INTELLIGENCE, MACHINE LEARNING, AND SOFTWARE JARGON.
   NEVER mention: "model", "neural network", "RosaNet", "algorithm", "AI", "prediction", "probability", "confidence score", "percentage", "sigmoid", "classifier", or "filter".
2. Write exclusively in formal clinical cardiology terminology (e.g., hemodynamic gradients, ejection murmur, LVOT obstruction, concentric LVH, Doppler velocities, effective orifice area, volume overload).
3. Structure your response EXACTLY with these 5 numbered clinical sections:

1. CLINICAL IMPRESSION
2. PHONOCARDIOGRAPHIC & AUSCULTATORY ANALYSIS
3. HEMODYNAMIC PATHOPHYSIOLOGY & STAGING (ACC/AHA 2020)
4. DIFFERENTIAL CONSIDERATIONS
5. GUIDELINE-DIRECTED WORKUP & MANAGEMENT PROTOCOL

Draft the consultation report now:"""

        # 3. Call Local Ollama
        try:
            report_text = self._call_ollama(prompt)
            if report_text and len(report_text) > 100:
                return report_text
        except Exception as e:
            logger.warning(f"Ollama call failed ({e}), generating direct clinical synthesis from retrieved evidence.")

        # 4. Deterministic Clinical Fallback Synthesis (Ensures zero UI downtime if Ollama is starting)
        return self._build_deterministic_clinical_report(
            disease_code, disease_full_name, patient_id, age, gender, smoker_str, valve_full, posture_full, evidence
        )

    def _build_deterministic_clinical_report(self, code: str, disease_name: str, patient_id: str,
                                            age: any, gender: str, smoker: str, valve: str, posture: str,
                                            evidence: dict) -> str:
        """Deterministic high-grade clinical report directly synthesized from ACC/AHA and acoustic evidence."""
        import re

        acoustic_text = evidence.get('acoustic') or self._read_knowledge_file(code, 'acoustic')
        if not acoustic_text:
            acoustic_text = f"Characteristic acoustic profile consistent with {disease_name}. Murmur timing, high-frequency turbulence envelope, and radiation vectors corroborate valvular etiology."

        guideline_text = evidence.get('guideline') or self._read_knowledge_file(code, 'guideline')
        patho_full = evidence.get('pathophysiology') or self._read_knowledge_file(code, 'pathophysiology')

        # Split pathophysiology into Remodeling vs Differential vs Precautions
        differentials_text = ""
        remodeling_text = ""
        precautions_text = ""

        if patho_full:
            diff_match = re.search(r'-\s*\*\*Differential Considerations:\*\*([\s\S]*?)(?=-\s*\*\*Critical Precautions|-\s*\*\*Intervention|\Z)', patho_full)
            if diff_match:
                differentials_text = diff_match.group(1).strip()

            remod_match = re.search(r'-\s*\*\*Pathophysiology & Remodeling:\*\*([\s\S]*?)(?=-\s*\*\*Differential|\Z)', patho_full)
            if remod_match:
                remodeling_text = remod_match.group(1).strip()

            prec_match = re.search(r'-\s*\*\*Critical Precautions[^\n]*\*\*([\s\S]*?)(?=-\s*\*\*Intervention|\Z)', patho_full)
            if prec_match:
                precautions_text = prec_match.group(1).strip()

        if not differentials_text:
            differentials_text = f"Differentiate {disease_name} from adjacent valvular and subvalvular lesions, dynamic outflow tract obstruction, and innocent physiological flow acceleration."

        # Combined Section 3: Remodeling mechanics + ACC/AHA Staging
        section3_parts = []
        if remodeling_text:
            section3_parts.append(f"Mechanical Impact on Ventricular Hemodynamics:\n{remodeling_text}")
        if guideline_text:
            section3_parts.append(f"ACC/AHA 2020 Clinical Staging Criteria:\n{guideline_text}")
        else:
            section3_parts.append("ACC/AHA 2020 Criteria: Requires quantitative Doppler echocardiographic evaluation to classify Stage B (Progressive), Stage C (Asymptomatic Severe), or Stage D (Symptomatic Severe).")

        section3_body = "\n\n".join(section3_parts)

        if code in ["Normal", "N"]:
            return f"""================================================================================
                    CARDIOLOGY CLINICAL ASSESSMENT & SUMMARY (DOCTOR VIEW)
================================================================================
PATIENT IDENTIFIER : {patient_id}
DEMOGRAPHICS       : {age}-year-old {gender} | RISK PROFILE: {smoker}
AUSCULTATION FOCUS : {valve}
PATIENT POSTURE    : {posture}

--------------------------------------------------------------------------------
1. CLINICAL IMPRESSION
--------------------------------------------------------------------------------
Auscultatory and phonocardiographic mapping demonstrates crisp, physiological normal 
heart sounds (S1 and S2). No evidence of pathological heart murmurs, hemodynamically 
significant valvular stenosis, regurgitant insufficiency, or intracardiac obstruction.

--------------------------------------------------------------------------------
2. PHONOCARDIOGRAPHIC & AUSCULTATORY ANALYSIS
--------------------------------------------------------------------------------
{acoustic_text if acoustic_text else "First Heart Sound (S1) is crisp and synchronized across atrioventricular valves. Second Heart Sound (S2) exhibits physiological inspiratory splitting without pathological delay or accentuation. Absence of systolic ejection clicks, opening snaps, or third/fourth gallop sounds."}

--------------------------------------------------------------------------------
3. HEMODYNAMIC PATHOPHYSIOLOGY & STAGING (ACC/AHA 2020)
--------------------------------------------------------------------------------
ACC/AHA 2020 Valvular Heart Disease Guidelines Benchmark:
Physiological Normal Auscultation. Transvalvular pressure gradients across aortic, mitral, 
pulmonic, and tricuspid orifices are fully preserved within normal clinical reference limits. 
Ejection fraction and intracardiac chamber filling pressures remain unobstructed.

--------------------------------------------------------------------------------
4. DIFFERENTIAL CONSIDERATIONS
--------------------------------------------------------------------------------
Differentiate physiological normal auscultation from benign functional flow murmurs 
(innocent murmurs of young or high-output states) and mild asymptomatic aortic sclerosis. 
No evidence of structural leaflet degeneration.

--------------------------------------------------------------------------------
5. GUIDELINE-DIRECTED WORKUP & MANAGEMENT PROTOCOL
--------------------------------------------------------------------------------
1. Diagnostic Imaging:
   - No echocardiography, cardiac MRI, or advanced diagnostic imaging indicated in the absence of clinical cardiovascular symptoms.
2. Clinical Surveillance:
   - Routine preventive cardiovascular wellness and annual primary care physical examination.
3. Therapeutic Precautions:
   - Maintain active lifestyle and routine age-appropriate cardiovascular health monitoring.
4. Definitive Intervention Triage:
   - No specialized cardiology referral or structural valve team intervention required.
================================================================================
"""

        return f"""================================================================================
                    CARDIOLOGY CLINICAL ASSESSMENT & SUMMARY (DOCTOR VIEW)
================================================================================
PATIENT IDENTIFIER : {patient_id}
DEMOGRAPHICS       : {age}-year-old {gender} | RISK PROFILE: {smoker}
AUSCULTATION FOCUS : {valve}
PATIENT POSTURE    : {posture}

--------------------------------------------------------------------------------
1. CLINICAL IMPRESSION
--------------------------------------------------------------------------------
Auscultatory and phonocardiographic mapping demonstrates hemodynamically significant 
{disease_name.upper()}. Findings warrant comprehensive cardiovascular staging and 
definitive echocardiographic hemodynamic evaluation.

--------------------------------------------------------------------------------
2. PHONOCARDIOGRAPHIC & AUSCULTATORY ANALYSIS
--------------------------------------------------------------------------------
{acoustic_text}

--------------------------------------------------------------------------------
3. HEMODYNAMIC PATHOPHYSIOLOGY & STAGING (ACC/AHA 2020)
--------------------------------------------------------------------------------
{section3_body}

--------------------------------------------------------------------------------
4. DIFFERENTIAL CONSIDERATIONS
--------------------------------------------------------------------------------
{differentials_text}

--------------------------------------------------------------------------------
5. GUIDELINE-DIRECTED WORKUP & MANAGEMENT PROTOCOL
--------------------------------------------------------------------------------
1. Diagnostic Imaging:
   - Comprehensive Transthoracic Doppler Echocardiography (TTE) [Class I Recommendation].
   - Quantification of transvalvular gradients, regurgitant volumes, and chamber dimensions.
2. Clinical Surveillance:
   - Symptom surveillance for exertional dyspnea, angina, presyncope, or heart failure symptoms.
3. Therapeutic Precautions:
   - {precautions_text if precautions_text else 'Avoid strenuous exertion pending definitive Doppler hemodynamic quantification.'}
4. Definitive Intervention Triage:
   - Heart Valve Team evaluation in accordance with 2020 ACC/AHA VHD management pathways.
================================================================================
"""

    def generate_patient_view_report(self, primary_disease: str, patient_metadata: dict,
                                   risk_score: float = None, risk_tier: str = None,
                                   clinical_action: str = None) -> str:
        """
        Generates a simplified, compassionate, patient-friendly report containing:
        - Patient Name and Demographics
        - Diagnosed Condition (in clear, non-technical terms)
        - Cardiovascular Risk Score & Tier
        - Recommended Further Procedures & Next Steps
        """
        disease_code = DISEASE_CODE_MAP.get(primary_disease, "AS")
        disease_full_name = DISEASE_NAME_MAP.get(disease_code, primary_disease)
        patient_name = patient_metadata.get("patient_name") or patient_metadata.get("patient_id") or "Patient"
        age = patient_metadata.get("age", 45)
        gender = "Female" if str(patient_metadata.get("gender", "")).upper() in ["F", "FEMALE"] else "Male"
        smoker = "Active Smoker" if str(patient_metadata.get("smoker", "0")) in ["1", "True", "true"] else "Non-smoker"
        lives = "Rural Area" if str(patient_metadata.get("lives", "")).upper() in ["R", "RURAL"] else "Urban Area"
        
        score_display = f"{int(round(risk_score))}/100" if risk_score is not None else "Pending Assessment"
        tier_display = risk_tier if risk_tier else "Standard Evaluation"

        # Friendly explanation of the condition
        condition_explanations = {
            "Normal": (
                "Healthy Heart Sounds (Normal Rhythm)",
                "Your heart check-up showed natural, healthy heart sounds (S1 and S2) with no significant heart murmurs detected. Blood appears to be moving smoothly through your heart valves."
            ),
            "AS": (
                "Aortic Stenosis (Narrowed Aortic Valve)",
                "The aortic valve acts as the main exit doorway that lets blood leave your heart to supply the rest of your body. In Aortic Stenosis, this valve opening is stiffer and narrower than usual, meaning your heart muscle has to work harder to push blood through."
            ),
            "AR": (
                "Aortic Regurgitation (Leaking Aortic Valve)",
                "In Aortic Regurgitation, the aortic valve does not seal completely tight after each heartbeat. This allows a small amount of blood to leak backward into your heart's main pumping chamber."
            ),
            "MR": (
                "Mitral Regurgitation (Leaking Mitral Valve)",
                "The mitral valve sits between the upper and lower chambers on the left side of your heart. In Mitral Regurgitation, the valve leaflets do not close tightly, causing blood to leak backward when the heart squeezes."
            ),
            "MS": (
                "Mitral Stenosis (Narrowed Mitral Valve)",
                "The mitral valve opening has become restricted or stiffened, slowing down the natural flow of blood from your lungs into your heart's main pumping chamber."
            )
        }

        friendly_title, friendly_desc = condition_explanations.get(disease_code, (disease_full_name, "A heart sound murmur pattern was detected across precordial landmarks."))

        # Clear further procedures
        if disease_code == "Normal":
            procedures = [
                "1. Routine Wellness: Continue your regular healthy diet, active lifestyle, and annual check-ups.",
                "2. No Immediate Tests Needed: In the absence of symptoms, no specialized scans or medications are required.",
                "3. Blood Pressure: Continue checking your resting blood pressure once or twice a year."
            ]
        else:
            procedures = [
                "1. Schedule an Echocardiogram (Heart Ultrasound): A painless ultrasound that uses sound waves to create moving pictures of your heart valves and measure blood flow accurately.",
                "2. In-Person Cardiologist Consultation: Review this report and your sound recordings with a heart specialist (cardiologist) for a formal physical exam and discussion.",
                "3. Symptom Awareness: Pay close attention to any shortness of breath while walking or climbing stairs, chest tightness, or dizzy spells. Report these to your doctor right away.",
                "4. Activity Precautions: Avoid sudden heavy physical straining or intense unmonitored athletic workouts until your doctor reviews your ultrasound."
            ]

        proc_text = "\n".join(procedures)

        return f"""================================================================================
                    YOUR HEART HEALTH SUMMARY (PATIENT VIEW)
================================================================================
PATIENT NAME       : {patient_name}
PATIENT DETAILS    : {age} years old • {gender} • {smoker} • {lives}
DATE OF SCAN       : Examination Completed

--------------------------------------------------------------------------------
1. DIAGNOSED CONDITION
--------------------------------------------------------------------------------
Condition: {friendly_title}
What this means:
{friendly_desc}

--------------------------------------------------------------------------------
2. CARDIOVASCULAR RISK SCORE
--------------------------------------------------------------------------------
Risk Score : {score_display}
Risk Tier  : {tier_display}
{f'Clinical Action: {clinical_action}' if clinical_action else ''}

--------------------------------------------------------------------------------
3. RECOMMENDED FURTHER PROCEDURE & NEXT STEPS
--------------------------------------------------------------------------------
{proc_text}

--------------------------------------------------------------------------------
IMPORTANT NOTICE FOR PATIENTS:
This report provides preliminary screening results from a digital stethoscope 
recording. It is designed to help you discuss your heart health with a doctor, 
and does not replace a medical consultation with a licensed cardiologist.
================================================================================
"""

# Singleton instance
clinical_rag_service = ClinicalRAGService()
