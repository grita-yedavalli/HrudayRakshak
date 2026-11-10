# BMD-HS RosaNet — Valvular Heart Disease Diagnostic AI

A clinical-grade web application for automated multi-disease cardiac auscultation analysis based on the **BUET Multi-Disease Heart Sound (BMD-HS)** dataset and **RosaNet** deep learning architecture.

Built with **FastAPI** as the backend and **React + Vite** as the frontend, styled in the soft, tactile claymorphic medical aesthetic requested.

---

## 1. Homepage & Architecture Breakdown

### Hardware Specifications & Acquisition Setup
- **Sensor / Transducer:** Electronic digital auscultation stethoscope contact sensor with a calibrated piezoelectric diaphragm (20 Hz – 2,000 Hz flat frequency response) avoiding acoustic chamber distortion.
- **Preamplifier & ADC:** High-input-impedance (>10 MΩ) differential instrumentation amplifier with active ambient noise suppression, paired with a 16-bit PCM Linear ADC.
- **Sampling Frequency:** Standardized at **4,000 Hz** (Nyquist 2,000 Hz), capturing both low-frequency heart sounds (S1, S2 ~20–150 Hz) and high-frequency regurgitant murmurs (~200–800 Hz).
- **Precordial Auscultation Protocol:**
  - **Aortic (Aor):** Right 2nd Intercostal Space parasternal.
  - **Pulmonic (Pul):** Left 2nd Intercostal Space parasternal.
  - **Tricuspid (Tri):** Lower Left Sternal Border (4th/5th ICS).
  - **Mitral (Mit):** Cardiac Apex (5th ICS midclavicular line).
- **Hemodynamic Postures:** Both **Supine** (recumbent) and **Sitting** (leaning forward) positions.
- **Recording Standard:** 8 recordings per patient (20.0 seconds each = 80,000 samples @ 4 kHz), 160 seconds total spatial cardiac mapping.

---

### Complete End-to-End Workflow (7 Phases)
1. **Hardware Acquisition:** 4 precordial valve sites × 2 postures (8 records per patient).
2. **Signal Conditioning:** 5th-order zero-phase bidirectional Butterworth bandpass filter (25–1,000 Hz) via `sosfiltfilt` eliminating DC baseline wander (<20 Hz) and friction noise (>1,000 Hz).
3. **Temporal Windowing:** 50% overlapping 5.0-second sliding windows (stride = 2.5s, 20,000 samples @ 4 kHz).
4. **RosaNet Temporal Backbone:** 1D Temporal Pattern Extractor + Gated Dilated Convolutions ($d \in \{1, 2, 4\}$) capturing multi-scale micro-turbulences and macro S1/S2 cadence.
5. **Context Injection:** Late fusion with a 10-D metadata vector (4 demographics: age midpoint, gender, smoker, lives + 6 auscultation context features: 4 valve sites + 2 postures $\to$ 144-D fused latent space).
6. **Patient-Level Multi-Site Max-Pooling:** Key architectural breakthrough eliminating silent valve dilution (**+15.57%** absolute Macro F1 boost).
7. **Diagnostic Head:** Multilabel independent sigmoids (`AS`, `AR`, `MR`, `MS`) and strictly coherent Normal derivation: $P(\text{Normal}) = 1.0 - \max(P(\text{diseases}))$.

---

### Model Metrics & Cross-Validation Benchmarks
- **Macro F1 Score:** `0.6700` (Peak fold: `0.7203`)
- **Macro Sensitivity (Recall):** `0.8343` (Peak fold: `0.9375`)
- **Macro Precision:** `0.5766`
- **Macro ROC-AUC:** `0.7877` (Aortic Stenosis: `0.9348`)
- **Hamming Accuracy:** `69.64%`
- **Target Pathology Breakdown:**
  - **Aortic Stenosis (AS):** Recall `85.8%`, Precision `74.2%`, F1 `79.8%`, ROC-AUC `93.5%`
  - **Aortic Regurgitation (AR):** Recall `92.5%`, Precision `54.5%`, F1 `68.2%`, ROC-AUC `76.8%`
  - **Mitral Regurgitation (MR):** Recall `76.8%`, Precision `54.2%`, F1 `62.0%`, ROC-AUC `72.1%`
  - **Mitral Stenosis (MS):** Recall `72.1%`, Precision `47.5%`, F1 `56.0%`, ROC-AUC `72.6%`
- **Ablation Study (Max-Pooling vs. Mean-Pooling):** Confirms why arithmetic averaging across silent valve sites dilutes true murmurs, whereas Max-Pooling delivers a **+15.57%** Macro F1 and **+38.87%** Recall jump.

---

## 2. Diagnostic Studio ("The Actual Page")

Switch to the **Diagnostic Studio** via the top navbar button.

### Option 1: Live Hardware Recording
- Streams live audio directly from your connected electronic stethoscope or contact microphone via the **Web Audio API**.
- Real-time oscilloscope canvas visualizer drawing the sound wave as you record.
- Automated **20.0s recording countdown timer** (matching the BMD-HS standardized recording length) with manual stop.
- Audio playback scrubber to review the recorded heart sound before running inference.

### Option 2: Upload WAV Files & Benchmark Samples
- Drag & Drop or file picker for `.wav` files (automatically resampled to 4,000 Hz).
- **1-Click Benchmark Samples:** Pre-loaded samples from the real BMD-HS dataset (`AS Patient 005`, `AR Patient 016`, `MR Patient 002`, `MS Patient 006`, `Normal Patient 089`) with auto-filled patient metadata for instant evaluation.

### Patient & Auscultation Metadata Form
- **Age Bracket:** Scaled midpoint (e.g. 30–39 $\to$ 34.5 / 100 = 0.345).
- **Gender:** Male (`M`) / Female (`F`).
- **Smoker Status:** Non-Smoker (`0`) / Smoker (`1`).
- **Living Environment:** Urban (`U`) / Rural (`R`).
- **Auscultation Site:** Aortic (`Aor`), Pulmonic (`Pul`), Tricuspid (`Tri`), Mitral (`Mit`).
- **Posture:** Supine (`sup`) / Sitting (`sit`).

### RosaNet Model Inference Output
- Real-time execution via FastAPI using the **5-Fold RosaNet PyTorch Ensemble** (`rosanet_fixed_fold1.pt` to `fold5.pt`).
- Diagnostic finding, status, and severity banner.
- Multi-label probability distribution bars for **AS**, **AR**, **MR**, **MS**, and **Normal**.
- Side-by-side **Raw vs Butterworth 25–1,000 Hz Filtered** phonocardiogram waveforms.

---

## Running the Application

### 1. Backend (FastAPI + PyTorch)
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000
```
- API Health & Endpoints: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
- Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)
