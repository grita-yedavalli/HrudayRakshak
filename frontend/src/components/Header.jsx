import React from 'react';
import { Bell, MoreHorizontal, ShieldCheck, Stethoscope } from 'lucide-react';

export default function Header({ activeCondition, onConditionChange }) {
  return (
    <header className="flex items-center justify-between w-full py-2">
      {/* Left: Notification Pill */}
      <div className="flex items-center gap-3">
        <button 
          className="relative w-11 h-11 rounded-full bg-white shadow-soft-clay-sm flex items-center justify-center text-slate-700 hover:text-black border border-black/5 hover:scale-105 transition-all"
          title="Diagnostic alerts"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EC7A72] rounded-full ring-2 ring-white"></span>
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-black/5 text-xs text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>BMD-HS Multi-Site Model Loaded</span>
          <span className="text-slate-400">|</span>
          <span className="text-[#E2554C] font-semibold">108 Patients</span>
        </div>
      </div>

      {/* Right: Doctor / Specialist Profile Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm pl-2 pr-4 py-1.5 rounded-full shadow-soft-clay-sm border border-black/5">
          {/* Avatar with medical badge */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F6EFE9] border border-black/10 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80" 
                alt="Dr. Mary Shelton" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<span class="text-xs font-bold text-slate-700">MS</span>';
                }}
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
              <span className="sr-only">Online</span>
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] leading-tight text-slate-400 font-medium">My Doctor</span>
            <span className="text-xs leading-tight font-bold text-[#18181B]">Mary Shelton</span>
          </div>
        </div>

        {/* Dark action circle button with dots */}
        <button 
          className="w-10 h-10 rounded-full bg-[#18181B] text-white flex items-center justify-center hover:bg-black transition-all shadow-sm"
          title="Cardiology Consult Menu"
        >
          <MoreHorizontal className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
}
