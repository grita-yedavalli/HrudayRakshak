import React from 'react';
import { 
  Brain, 
  Database, 
  GitBranch, 
  ShieldCheck, 
  Layers, 
  Radio, 
  ArrowRight,
  Heart,
  Activity,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Search
} from 'lucide-react';

export default function ProjectTheoryOverview({ onNavigate }) {
  const pillars = [
    {
      icon: Activity,
      tag: "Acoustic Foundation",
      title: "1. Multi-Site Precordial Auscultation",
      summary: "Cardiac murmurs are inherently anisotropic—acoustic energy radiates non-uniformly across the chest wall based on valve anatomy.",
      concept: "Capturing 4 distinct anatomical windows (Aortic, Pulmonic, Tricuspid, Mitral) in both supine and sitting postures ensures complete spatial coverage, preventing localized murmur blind spots.",
      color: "#EC7A72"
    },
    {
      icon: GitBranch,
      tag: "Temporal Deep Learning",
      title: "2. RosaNet Gated Dilated Convolutions",
      summary: "Heart sounds contain both micro-turbulences (murmurs at 200–800 Hz) and macro temporal rhythms (S1/S2 cycles at ~1 Hz).",
      concept: "RosaNet employs multi-scale dilated convolutions (d ∈ {1, 2, 4}) with gating mechanisms. This captures rapid acoustic transients and global cardiac cycle cadence simultaneously without loss of temporal resolution.",
      color: "#3480D9"
    },
    {
      icon: Database,
      tag: "Evidence Grounding",
      title: "3. Retrieval-Augmented Generation (RAG)",
      summary: "Raw neural network predictions lack clinical explainability and are susceptible to demographic blind spots.",
      concept: "Our RAG engine indexes patient cohort archetypes, clinical auscultation guidelines, and demographic correlation vectors to retrieve verified evidence, grounding predictions in established cardiovascular literature.",
      color: "#E28C22"
    },
    {
      icon: Brain,
      tag: "Clinical Synthesis",
      title: "4. Clinical Decision Support & Risk Stratification",
      summary: "Moving beyond basic binary classification to comprehensive patient-specific risk stratification.",
      concept: "Multimodal clinical reasoning modules synthesize acoustic embeddings, 10-D metadata, and retrieved clinical knowledge to grade murmur severity, identify multi-disease co-occurrence, and suggest personalized follow-up protocols.",
      color: "#8B5CF6"
    }
  ];

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* Theoretical Framework Core Narrative */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-[#FCE7E6] text-[#CF3B32] text-xs font-bold uppercase tracking-wider">
            Theoretical Framework
          </span>
          <span className="text-xs text-slate-400 font-medium">Core Research Thesis & Architecture</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
          How Our Project Works: From Heart Acoustics to Verifiable Clinical Decisions
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
          Valvular Heart Disease (VHD) affects tens of millions of individuals globally. Traditional stethoscopic auscultation suffers from high inter-observer variability, subjective human auditory limitations, and the dilution of localized sound waves. 
          <br /><br />
          This project proposes an integrated clinical AI architecture combining <strong>Digital Phonocardiography (PCG)</strong>, the <strong>RosaNet deep temporal temporal architecture</strong>, <strong>Retrieval-Augmented Generation (RAG)</strong>, and <strong>Clinical Decision Support (CDSS)</strong>.
        </p>

        {/* 3 Core Mathematical & Clinical Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#CF3B32] uppercase tracking-wider block mb-1">
                Acoustic Principle
              </span>
              <h4 className="text-sm font-bold text-[#18181B] mb-1.5">
                Silent Valve Dilution Theorem
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Valvular murmurs localize to specific acoustic windows (e.g., Aortic Stenosis at 2nd RICS). Averaging across non-affected silent sites dilutes signal strength. <strong>Patient-Level Max-Pooling</strong> mathematically preserves peak pathological evidence, yielding a +15.6% Macro F1 gain.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-slate-700 bg-white p-2 rounded-xl border border-black/5">
              Invariant: Max-Pool across sites
            </div>
          </div>

          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#3480D9] uppercase tracking-wider block mb-1">
                Mathematical Principle
              </span>
              <h4 className="text-sm font-bold text-[#18181B] mb-1.5">
                Normal Clinical Coherence
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Independent multi-label heads often produce contradictory outputs where a patient is flagged as both diseased and healthy. We enforce strict coherence: <code>P(Normal) = 1.0 - max(P(diseases))</code>, guaranteeing clinically sound outputs.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-slate-700 bg-white p-2 rounded-xl border border-black/5">
              Constraint: Zero contradiction
            </div>
          </div>

          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider block mb-1">
                Decision Principle
              </span>
              <h4 className="text-sm font-bold text-[#18181B] mb-1.5">
                RAG + Clinical Risk Stratification
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rather than treating neural predictions as black boxes, an automated clinical reasoning pipeline references retrieved clinical evidence from matched cohort profiles and echocardiographic guidelines to generate stratified patient risk scores.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-bold text-slate-700 bg-white p-2 rounded-xl border border-black/5">
              Synthesis: Verifiable Clinical AI
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Architectural Pillars Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              The Four Pillars of the System
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              End-to-end integration of acoustic physics, deep learning, retrieval knowledge, and clinical decision support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between hover:shadow-soft-clay-hover transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: pillar.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {pillar.tag}
                        </span>
                        <h4 className="text-base font-bold text-[#18181B]">
                          {pillar.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 leading-relaxed mb-2">
                    {pillar.summary}
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium bg-[#FAFBFD] p-3 rounded-xl border border-black/[0.03]">
                    {pillar.concept}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
}
