import React from 'react';
import { Heart, Activity, Cpu, GitBranch, BarChart3, Stethoscope, ArrowRight, Radio } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, backendStatus }) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-black/5 py-3 px-4 sm:px-8 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActivePage('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FCE7E6] border border-[#F9D1CF] flex items-center justify-center text-[#CF3B32] shadow-sm group-hover:scale-105 transition-all">
            <Heart className="w-5 h-5 fill-[#CF3B32]" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#18181B] tracking-tight">BMD-HS RosaNet</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#18181B] text-white px-2 py-0.5 rounded-full">
                AI Engine
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Valvular Heart Disease Auscultation & Phenotyping
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F4F5F7] p-1.5 rounded-2xl border border-black/5">
          <button
            onClick={() => setActivePage('home')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePage === 'home' 
                ? 'bg-white text-[#18181B] shadow-sm' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActivePage('hardware')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePage === 'hardware' 
                ? 'bg-white text-[#18181B] shadow-sm' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Hardware Setup
          </button>
          <button
            onClick={() => setActivePage('workflow')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePage === 'workflow' 
                ? 'bg-white text-[#18181B] shadow-sm' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Workflow Pipeline
          </button>
          <button
            onClick={() => setActivePage('metrics')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePage === 'metrics' 
                ? 'bg-white text-[#18181B] shadow-sm' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Model Metrics
          </button>
        </nav>

        {/* Right CTA & Status Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFBFD] border border-black/5 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PyTorch 5-Fold Ensemble</span>
          </div>

          <button
            onClick={() => setActivePage('studio')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm ${
              activePage === 'studio'
                ? 'bg-[#CF3B32] text-white shadow-[#CF3B32]/30 shadow-md scale-105'
                : 'bg-[#18181B] text-white hover:bg-black hover:scale-105'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Diagnostic Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
