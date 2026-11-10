import React from 'react';
import { 
  Heart, 
  Activity, 
  GitBranch, 
  BarChart3, 
  FileText, 
  Settings, 
  X,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Condition', icon: Heart },
    { id: 'workflow', label: 'Workflow', icon: GitBranch },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'auscultation', label: 'PCG Signals', icon: Activity },
    { id: 'protocol', label: 'Clinical Protocol', icon: Stethoscope },
  ];

  return (
    <aside className="w-18 md:w-20 bg-[#ECE5DC]/70 backdrop-blur-md rounded-[32px] p-3 flex flex-col items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.03)] border border-[#E2D9CE]/60 flex-shrink-0">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* User / Brand avatar indicator */}
        <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-slate-700 font-bold text-sm border border-black/5">
          <span className="text-[#CF3B32]">R</span>N
        </div>

        {/* Close / Action circular button */}
        <button 
          title="Reset View"
          onClick={() => setActiveTab('dashboard')}
          className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-black hover:bg-white/90 transition-all border border-black/5"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Navigation Item Stack */}
        <div className="flex flex-col items-center gap-3 w-full mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#DFD3C4] text-[#18181B] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_3px_8px_rgba(0,0,0,0.04)] font-medium scale-105' 
                    : 'text-[#8A847C] hover:text-[#18181B] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -left-1 w-1.5 h-4 bg-[#CF3B32] rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Settings & Status */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="RosaNet Engine Active" />
        <button 
          onClick={() => setActiveTab('metrics')}
          className="w-10 h-10 rounded-2xl text-[#8A847C] hover:text-[#18181B] hover:bg-white/50 flex items-center justify-center transition-all"
          title="Model Specs"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </aside>
  );
}
