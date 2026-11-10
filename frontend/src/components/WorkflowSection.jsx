import React, { useState } from 'react';
import { 
  Mic, 
  Database, 
  Upload, 
  Activity, 
  Cpu, 
  Brain, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileAudio, 
  Radio, 
  Wifi, 
  Search, 
  FileText, 
  Bot, 
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';

export default function WorkflowSection({ workflowData }) {
  const [selectedStep, setSelectedStep] = useState(0);

  const fallbackSteps = [
    {
      id: "stage_1",
      phase: "1. Hardware Data Acquisition",
      title: "Heart Sound Recording (MAX9814 + ESP32)",
      summary: "Captures heart sound acoustics using the MAX9814 electret microphone mounted inside a stethoscope chest bell, digitized via the ESP32 microcontroller.",
      details: [
        "Captures heart sounds using high-sensitivity MAX9814 microphone with Auto Gain Control (AGC) attached to stethoscope bell.",
        "Converts continuous analog acoustic heart sounds to digital samples via ESP32 ADC1 CH6 (GPIO 34) at a standardized 4,000 Hz.",
        "Generates standardized .wav audio files with 250 µs hardware-timed sampling intervals.",
        "Sends .wav audio files via Wi-Fi (HTTP / MQTT) or high-speed serial UART (460,800 baud) directly to the cloud/gateway."
      ],
      diagram_items: ["MAX9814 Microphone", "Stethoscope Bell", "ESP32 ADC (GPIO 34)", "4 kHz Sampling", "Wi-Fi (HTTP/MQTT)"],
      output_label: "Digital Audio Stream",
      output_val: "Raw .WAV (16-bit PCM @ 4,000 Hz)",
      badge: "MAX9814 + ESP32",
      color: "#3B82F6",
      icon: Mic
    },
    {
      id: "stage_2",
      phase: "2. Database & Storage (Cloud)",
      title: "Cloud Database (Supabase Cloud Storage)",
      summary: "Centralized cloud database storing time-stamped phonocardiograms, patient metadata, and auscultation histories.",
      details: [
        "Stores .wav audio recordings with comprehensive clinical metadata (Patient ID, timestamp, auscultation site, posture).",
        "Supports real-time telemetry streaming into Supabase Cloud Storage and PostgreSQL database.",
        "Maintains patient historical auscultation logs for longitudinal cardiac monitoring.",
        "Ensures data privacy, de-identification, and role-based access for clinicians."
      ],
      diagram_items: ["Supabase Platform", "Supabase Storage Bucket", "Patient ID & Timestamps", "Auscultation Site Tags"],
      output_label: "Cloud Telemetry Store",
      output_val: "Encrypted Cloud WAV + JSON Metadata",
      badge: "Supabase",
      color: "#10B981",
      icon: Database
    },
    {
      id: "stage_3",
      phase: "3. Upload / Input",
      title: "Dual Ingestion: File Upload & Cloud Retrieval",
      summary: "Clinicians can either directly upload new PCG recordings or query existing recordings from the cloud database.",
      details: [
        "Upload Heart Sound (.wav file): Immediate local workstation upload from connected stethoscopes or legacy sound files.",
        "Database Retrieval: Query and select from historical recordings stored in Supabase.",
        "Automatic metadata association: Maps patient age bracket, gender, smoking status, and auscultation valve site.",
        "Validates 4,000 Hz sampling rate and verifies signal continuity before feeding into the preprocessing pipeline."
      ],
      diagram_items: ["Local .WAV Upload", "Cloud DB Query", "Metadata Parsing", "Sampling Rate Verification"],
      output_label: "Ingested Audio Buffer",
      output_val: "Audio Array [1, N Samples] + 10-D Metadata",
      badge: "Upload / Cloud Select",
      color: "#8B5CF6",
      icon: Upload
    },
    {
      id: "stage_4",
      phase: "4. Preprocessing",
      title: "Signal Conditioning & Mel-Spectrogram Conversion",
      summary: "Four-step audio processing chain eliminating environmental noise, segmenting heart beats, and generating 2D spectral representations.",
      details: [
        "1. Noise Reduction (Bandpass Filter): 5th-order zero-phase Butterworth bandpass filter (20–800 Hz) via sosfiltfilt + 50/100/150 Hz electrical notch filters.",
        "2. Segmentation: Divides recording into fixed 5.0-second overlapping temporal windows (stride = 2.5s) to guarantee complete S1-S2 cycles.",
        "3. Normalization: Zero-mean centering and peak amplitude scaling across auscultation recording windows.",
        "4. Convert to Mel-Spectrogram (or STFT): Transforms 1D acoustic time-series into 2D time-frequency spectrograms capturing harmonic murmur energy."
      ],
      diagram_items: ["Butterworth 20-800Hz", "50/100/150Hz Notch", "5.0s Windows", "Mel-Spectrogram 64-Mel"],
      output_label: "Conditioned Feature Set",
      output_val: "Clean Waveform [1, 80k] & Mel-Spectrogram",
      badge: "Filter + Mel-Spectrogram",
      color: "#F59E0B",
      icon: Activity
    },
    {
      id: "stage_5",
      phase: "5. RoSaNet Classification",
      title: "RoSaNet Deep Learning Neural Network",
      summary: "Deep temporal convolutional architecture with gated dilated convolutions and late metadata fusion for multi-disease diagnosis.",
      details: [
        "Temporal Pattern Extractor: 3-stage strided 1D convolution extracting 128 high-level acoustic feature maps.",
        "Gated Dilated Blocks: Multi-receptive field temporal modeling (dilations d ∈ {1, 2, 4}) capturing micro-turbulences and macro heart rhythms.",
        "Metadata Fusion: Deep late fusion projecting 10-D patient metadata (demographics + auscultation valve context) into the audio latent space.",
        "Diagnostic Outputs: Classifies recordings into Normal, Murmur, or Abnormal, and predicts multi-valvular targets: AS, AR, MR, MS."
      ],
      diagram_items: ["Conv1D Backbone", "Gated Dilations (1,2,4)", "Metadata MLP Fusion", "Normal / Murmur / Abnormal"],
      output_label: "Model Classification",
      output_val: "Multilabel Probabilities [AS, AR, MR, MS, Normal]",
      badge: "RoSaNet Deep Learning",
      color: "#EC4899",
      icon: Cpu
    },
    {
      id: "stage_6",
      phase: "6. RAG-based Explanation",
      title: "LLM + Medical Knowledge Retrieval",
      summary: "Augmenting neural predictions with verified medical textbooks and cardiology guidelines via a vector database to generate personalized clinical explanations.",
      details: [
        "Knowledge Base: Indexed clinical corpus comprising cardiology guidelines, medical textbooks, peer-reviewed clinical research papers, and auscultation rules.",
        "Embedding & Indexing: High-dimensional vector database for sub-second semantic retrieval matching detected murmurs to clinical literature.",
        "Retrieval Step: Finds relevant medical evidence, pathophysiology citations, and echocardiography referral thresholds.",
        "LLM Generation: Medical LLM synthesizes evidence into a structured clinical report: Predicted class, Possible condition, Medical interpretation, Recommendations, and Confidence score."
      ],
      diagram_items: ["Medical Guidelines", "Vector Database", "Semantic Retrieval", "Medical LLM", "Personalized Report"],
      output_label: "Clinical Explanation",
      output_val: "Verifiable Medical Synthesis & Recommendations",
      badge: "RAG + Medical LLM",
      color: "#6366F1",
      icon: Brain
    },
    {
      id: "stage_7",
      phase: "7. Output to User / Application",
      title: "Web / Mobile Decision Support Application",
      summary: "Interactive clinical dashboard presenting diagnostic findings, spectrogram visuals, and AI-generated clinical reports to clinicians and patients.",
      details: [
        "Real-Time Visualization: Displays dual waveforms (raw vs Butterworth filtered) and dynamic 2D audio spectrograms.",
        "Diagnostic Result Display: Renders multi-label probability breakdown with calibrated severity alerts.",
        "Show AI-Generated Explanation: Provides transparent, interpretable medical reasoning and guideline-directed next steps.",
        "Clinical Records Management: Stores patient history, multi-site comparison logs, and generates exportable PDF summaries for doctors."
      ],
      diagram_items: ["Doctor / Patient Dashboard", "Real-Time Spectrogram", "Diagnostic Badges", "History Management"],
      output_label: "User Interface",
      output_val: "Doctor & Patient Decision Support Portal",
      badge: "Web / Mobile Dashboard",
      color: "#14B8A6",
      icon: Layers
    }
  ];

  const steps = workflowData?.steps || fallbackSteps;
  const currentStep = steps[selectedStep] || steps[0];

  return (
    <section className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* Workflow Header Banner */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-soft-clay border border-[#E8EAEF] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3.5 py-1 rounded-full bg-[#18181B] text-white text-xs font-bold uppercase tracking-wider">
              System Architecture Workflow
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FCE7E6] text-[#CF3B32] text-xs font-bold border border-[#F9D1CF]">
              7-Stage End-to-End Pipeline
            </span>
            <span className="text-xs text-slate-400 font-medium">Hardware Ingestion to RAG Explanation</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#18181B] tracking-tight">
            Retrieval-Augmented Heart Disease Classification Workflow
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed font-medium">
            This end-to-end workflow illustrates the complete trajectory of our system: starting from <strong>hardware data acquisition</strong> with the MAX9814 microphone and ESP32, through <strong>cloud storage</strong>, <strong>preprocessing</strong>, <strong>RoSaNet classification</strong>, and <strong>RAG-based medical explanation</strong>, delivering actionable decision support to clinicians.
          </p>
        </div>
      </div>

      {/* 7-Stage Architectural Stepper (Exact mirror of user diagram) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {steps.map((s, idx) => {
          const isSelected = selectedStep === idx;
          return (
            <button
              key={s.id || idx}
              onClick={() => setSelectedStep(idx)}
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'bg-white shadow-soft-clay border-2 border-[#18181B] scale-[1.02]' 
                  : 'bg-white/80 hover:bg-white border-[#E8EAEF] text-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-[#18181B] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Stage {idx + 1}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#CF3B32] animate-ping" />
                  )}
                </div>
                <h4 className="text-xs font-extrabold text-[#18181B] leading-tight line-clamp-2">
                  {s.phase.split('. ')[1] || s.phase}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 truncate block">
                  {s.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Deep-Dive Card */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-soft-clay border border-[#E8EAEF] grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stage Details & Sub-Bullets */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold text-[#CF3B32] bg-[#FCE7E6] px-3 py-1 rounded-full">
                {currentStep.phase}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentStep.badge}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight mb-3">
              {currentStep.title}
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              {currentStep.summary}
            </p>

            {/* Bullets directly from architecture diagram */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Operations & Engineering Specifications
              </h4>
              {currentStep.details?.map((item, dIdx) => (
                <div key={dIdx} className="flex items-start gap-3 text-sm text-slate-700 bg-[#FAFBFD] p-3.5 rounded-2xl border border-black/[0.03]">
                  <div className="w-5 h-5 rounded-full bg-[#DBEAFA] text-[#2A7FD9] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setSelectedStep((prev) => Math.max(0, prev - 1))}
              disabled={selectedStep === 0}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                selectedStep === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              ← Previous Stage
            </button>

            <span className="text-xs font-semibold text-slate-400">
              Stage {selectedStep + 1} of {steps.length}
            </span>

            <button
              onClick={() => setSelectedStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={selectedStep === steps.length - 1}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                selectedStep === steps.length - 1 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'bg-[#18181B] text-white hover:bg-black'
              }`}
            >
              Next Stage →
            </button>
          </div>
        </div>

        {/* Right Column: Diagram Component Box & Input/Output Mapping */}
        <div className="lg:col-span-5 bg-[#FAFBFD] rounded-[28px] p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Architecture Blueprint
              </span>
              <span className="text-[10px] font-mono bg-white px-2.5 py-0.5 rounded-full border border-black/5 text-slate-600 font-bold">
                Diagram Node {selectedStep + 1}
              </span>
            </div>

            {/* In/Out Data Box */}
            <div className="bg-[#18181B] text-white p-4 rounded-2xl font-mono text-xs mb-5 shadow-sm">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Data Flow Payload:</div>
              <div className="text-emerald-400 font-semibold break-all">
                {currentStep.tensor || currentStep.output_val}
              </div>
            </div>

            {/* Diagram Components Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Integrated Diagram Components:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {currentStep.diagram_items ? (
                  currentStep.diagram_items.map((elem, eIdx) => (
                    <div key={eIdx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 text-xs text-slate-800 font-medium">
                      <div className="w-2 h-2 rounded-full bg-[#CF3B32]"></div>
                      <span>{elem}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                    Component specifications verified against HRakshak and RoSaNet architecture.
                  </div>
                )}
              </div>
            </div>

            {/* Stage-Specific Visual Callout */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F6EFE9] border border-[#ECE3D7]/70 text-xs">
              {selectedStep === 0 && (
                <p className="text-slate-700">
                  <strong>Hardware Node:</strong> MAX9814 electret microphone capsule with AGC feeds analog signal into ESP32 GPIO 34. Wi-Fi SoftAP transmits 4,000 Hz WAV.
                </p>
              )}
              {selectedStep === 1 && (
                <p className="text-slate-700">
                  <strong>Storage Node:</strong> Supabase platform provides cloud persistence with indexing by Patient ID and recording session timestamps.
                </p>
              )}
              {selectedStep === 2 && (
                <p className="text-slate-700">
                  <strong>Input Ingestion:</strong> Seamlessly switch between live hardware streaming, local .wav file uploads, or database record selection.
                </p>
              )}
              {selectedStep === 3 && (
                <p className="text-slate-700">
                  <strong>Signal Conditioning:</strong> Butterworth 20–800 Hz filter + 50/100/150 Hz notch suppresses powerline and friction noise before Mel-Spectrogram extraction.
                </p>
              )}
              {selectedStep === 4 && (
                <p className="text-slate-700">
                  <strong>Neural Model:</strong> RoSaNet evaluates temporal sound patterns via dilated convolutions (1, 2, 4) and fuses 10-D patient metadata.
                </p>
              )}
              {selectedStep === 5 && (
                <p className="text-slate-700">
                  <strong>RAG Engine:</strong> Vector database matches acoustic signatures to medical textbooks and clinical guidelines; LLM generates personalized recommendations.
                </p>
              )}
              {selectedStep === 6 && (
                <p className="text-slate-700">
                  <strong>Clinical Interface:</strong> Web and mobile dashboard displays predicted class, multi-label probabilities, audio spectrogram, and clinical decision support.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Verified System Pipeline</span>
            <span className="font-bold text-slate-800">Production Calibrated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
