import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Radio, 
  ShieldCheck,
  Cpu,
  Brain,
  Database
} from 'lucide-react';

export default function HeroSection({ onNavigate }) {
  return (
    <section className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white rounded-[36px] p-8 sm:p-12 shadow-soft-clay border border-[#E8EAEF]">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-[#FCE7E6] text-[#CF3B32] text-xs font-bold uppercase tracking-wider">
              Multimodal Heart Sound Intelligence (BMD-HS)
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FAFBFD] text-slate-600 text-xs font-bold border border-black/5">
              RosaNet Clinical AI Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              RAG & Clinical Decision Support
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#18181B] tracking-tight leading-[1.18]">
            Retrieval-Augmented Heart Disease Classification and Patient-Specific Risk Stratification with Clinical Decision Support Using RosaNet
          </h1>

          <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed font-medium">
            An intelligent clinical platform integrating retrieval-augmented deep learning with clinical decision support. Combining multi-site precordial phonocardiography (4 valve windows, 2 postures), 1D gated dilated temporal convolutions, and patient-specific risk stratification to provide verifiable diagnostic decision support.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            <button
              onClick={() => onNavigate('studio')}
              className="bg-[#18181B] hover:bg-black text-white px-7 py-4 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition-all shadow-md hover:scale-105"
            >
              <Radio className="w-4 h-4 text-[#EC7A72] animate-pulse" />
              <span>Launch Diagnostic Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('hardware')}
              className="bg-[#FAFBFD] hover:bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl text-xs font-bold transition-all border border-slate-200"
            >
              Hardware Specifications
            </button>

            <button
              onClick={() => onNavigate('workflow')}
              className="bg-[#FAFBFD] hover:bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl text-xs font-bold transition-all border border-slate-200"
            >
              7-Phase RosaNet Pipeline
            </button>
          </div>
        </div>

        {/* Highlight Stats Pill Box */}
        <div className="grid grid-cols-2 gap-3.5 self-stretch lg:w-80 flex-shrink-0">
          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cohort Size</span>
            <span className="text-3xl font-extrabold text-[#18181B] my-1.5">108</span>
            <span className="text-xs text-slate-500 font-medium">Patients Evaluated</span>
          </div>

          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sampling Rate</span>
            <span className="text-3xl font-extrabold text-[#3480D9] my-1.5">4 kHz</span>
            <span className="text-xs text-slate-500 font-medium">Zero-Phase Filtered</span>
          </div>

          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max-Pool Gain</span>
            <span className="text-3xl font-extrabold text-[#CF3B32] my-1.5">+15.6%</span>
            <span className="text-xs text-slate-500 font-medium">Macro F1 vs Mean</span>
          </div>

          <div className="bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sensitivity</span>
            <span className="text-3xl font-extrabold text-emerald-600 my-1.5">83.4%</span>
            <span className="text-xs text-slate-500 font-medium">Macro Clinical Recall</span>
          </div>
        </div>
      </div>
    </section>
  );
}
