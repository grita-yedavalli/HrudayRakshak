import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart as HeartIcon, Sparkles } from 'lucide-react';

export default function HeartCenterpiece({ 
  selectedSite, 
  onSelectSite, 
  activeCondition, 
  onCycleCondition, 
  bpm = 83 
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Anatomical auscultation site coordinates on the heart SVG
  const siteCoordinates = {
    Aor: { x: 195, y: 155, label: 'Aortic (Aor)', desc: 'Right 2nd Intercostal' },
    Pul: { x: 135, y: 145, label: 'Pulmonic (Pul)', desc: 'Left 2nd Intercostal' },
    Tri: { x: 150, y: 220, label: 'Tricuspid (Tri)', desc: 'Lower Left Sternal Border' },
    Mit: { x: 185, y: 245, label: 'Mitral (Mit)', desc: 'Cardiac Apex (5th ICS)' },
  };

  const currentCoords = siteCoordinates[selectedSite] || siteCoordinates.Aor;

  return (
    <div className="relative flex flex-col items-center justify-center py-2 px-4 select-none">
      {/* 3D Heart Visual Canvas Container */}
      <div 
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft Ambient Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F9D1CF]/40 via-[#FCE7E6]/20 to-transparent rounded-full filter blur-2xl -z-10" />

        {/* 3D Anatomical Rendered SVG Heart */}
        <svg 
          viewBox="0 0 320 340" 
          className="w-full h-full filter drop-shadow-[0_20px_25px_rgba(236,122,114,0.35)] transition-transform duration-700 ease-out hover:scale-105"
        >
          <defs>
            {/* Primary Heart Muscle Gradients */}
            <linearGradient id="heartGradient" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#F68A82" />
              <stop offset="35%" stopColor="#EE6E65" />
              <stop offset="70%" stopColor="#DC5147" />
              <stop offset="100%" stopColor="#BA3830" />
            </linearGradient>

            {/* Aorta Arch Gradient */}
            <linearGradient id="aortaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAB2AC" />
              <stop offset="50%" stopColor="#EE6E65" />
              <stop offset="100%" stopColor="#C43E36" />
            </linearGradient>

            {/* Pulmonary Artery / Vein Gradient */}
            <linearGradient id="pulmonaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9827B" />
              <stop offset="70%" stopColor="#D24E45" />
              <stop offset="100%" stopColor="#A83028" />
            </linearGradient>

            {/* Specular Highlight Gradient */}
            <linearGradient id="specularGlow" x1="0%" y1="0%" x2="50%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Soft Shadow Filter */}
            <radialGradient id="heartInnerShadow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#6E1510" stopOpacity="0.45" />
            </radialGradient>
          </defs>

          {/* Superior Vena Cava & Aorta Branches (Top Pipes) */}
          <g className="filter drop-shadow-sm">
            {/* Left Branch */}
            <path 
              d="M 135 75 C 135 50, 148 40, 155 45 C 160 50, 158 75, 158 85 Z" 
              fill="url(#aortaGradient)" 
            />
            {/* Center Branch */}
            <path 
              d="M 158 70 C 160 45, 172 35, 178 40 C 185 45, 180 70, 180 80 Z" 
              fill="url(#aortaGradient)" 
            />
            {/* Right Branch */}
            <path 
              d="M 182 65 C 185 48, 195 42, 202 46 C 208 50, 202 70, 198 85 Z" 
              fill="url(#aortaGradient)" 
            />
            {/* Aortic Arch Main Bend */}
            <path 
              d="M 125 105 C 120 60, 165 48, 205 65 C 220 72, 230 92, 215 118 C 200 115, 175 100, 145 108 Z" 
              fill="url(#aortaGradient)" 
            />
            {/* Pulmonary Trunk branching to the left */}
            <path 
              d="M 105 105 C 95 95, 105 78, 120 85 C 130 92, 130 115, 125 125 Z" 
              fill="url(#pulmonaryGradient)" 
            />
          </g>

          {/* Main Cardiac Muscular Body (Ventricles & Atria) */}
          <g>
            <path 
              d="M 160 95 
                 C 205 85, 255 125, 255 180 
                 C 255 225, 215 270, 168 312 
                 C 162 318, 154 318, 148 312 
                 C 105 270, 75 220, 75 175 
                 C 75 120, 120 90, 160 95 Z" 
              fill="url(#heartGradient)" 
            />

            {/* Claymorphic Organic Highlights (Curved volume contours) */}
            <path 
              d="M 148 105 
                 C 185 98, 235 130, 240 178 
                 C 242 195, 225 210, 200 190 
                 C 175 170, 160 135, 148 105 Z" 
              fill="url(#specularGlow)" 
            />

            {/* Left Anterior Descending Sulcus / Groove */}
            <path 
              d="M 162 108 
                 C 175 155, 178 215, 158 300" 
              stroke="#B52F26" 
              strokeWidth="5" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.5" 
            />
            {/* Small diagonal coronary artery branches */}
            <path d="M 170 145 C 190 155, 210 160, 225 168" stroke="#FAB2AC" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
            <path d="M 172 180 C 188 190, 205 205, 215 222" stroke="#FAB2AC" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
            <path d="M 165 215 C 150 230, 130 245, 115 255" stroke="#9E221A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>

          {/* 3D Orbiting Heartbeat Ribbon Wave (Matching image) */}
          <g className="filter drop-shadow-md">
            {/* Elliptical orbital wave path wrapping around the heart */}
            <path 
              d="M 60 215 
                 C 75 240, 120 255, 165 250 
                 C 215 245, 260 220, 275 190 
                 C 260 175, 215 165, 165 170 
                 C 115 175, 75 195, 60 215 Z" 
              fill="none" 
              stroke="rgba(255,255,255,0.7)" 
              strokeWidth="1.5" 
              strokeDasharray="3 3"
            />

            {/* Crisp white ECG pulse line etched into the orbit ribbon */}
            <path 
              d="M 70 212 
                 L 110 208 
                 L 118 200 
                 L 124 220 
                 L 132 185 
                 L 142 225 
                 L 148 205 
                 L 175 200 
                 L 182 195 
                 L 188 205 
                 L 194 182 
                 L 202 218 
                 L 210 198 
                 L 240 190" 
              fill="none" 
              stroke="#18181B" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              opacity="0.85"
            />
          </g>

          {/* Auscultation Sensors Pins on Anatomical Valve Landmarks */}
          {Object.entries(siteCoordinates).map(([siteKey, coords]) => {
            const isSelected = selectedSite === siteKey;
            return (
              <g 
                key={siteKey}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSite(siteKey);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo when active */}
                {isSelected && (
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r="14" 
                    fill="#18181B" 
                    fillOpacity="0.2" 
                    className="animate-ping"
                  />
                )}
                {/* Black sensor button disc (from uploaded photo) */}
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r={isSelected ? "9" : "6"} 
                  fill="#18181B" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                  className="transition-all duration-300 group-hover:scale-125"
                />
                {/* Center dot */}
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r="2.5" 
                  fill={isSelected ? "#EC7A72" : "#FFFFFF"} 
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Heart Rate Pill: ♥ 83 (Exact match from photo) */}
        <div className="absolute top-24 left-10 sm:left-12 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-black/5 flex items-center gap-1.5 text-slate-800 text-xs font-bold animate-pulse-subtle">
          <HeartIcon className="w-3.5 h-3.5 fill-[#EC7A72] text-[#EC7A72]" />
          <span>{bpm}</span>
          <span className="text-[10px] font-normal text-slate-400">bpm</span>
        </div>

        {/* Floating Auscultation Site Label Tag */}
        <div className="absolute bottom-6 bg-[#18181B]/90 text-white backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-medium shadow-md flex items-center gap-1.5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#EC7A72] animate-pulse"></span>
          <span>Site: <strong>{currentCoords.label}</strong></span>
        </div>
      </div>

      {/* Stepper controls < > below the heart (from photo) */}
      <div className="flex items-center gap-2 mt-2">
        <button 
          onClick={() => onCycleCondition(-1)}
          className="w-8 h-8 rounded-full bg-white shadow-soft-clay-sm flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-50 transition-all border border-black/5"
          title="Previous Sound Phenotype"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-semibold text-slate-500 px-2 tracking-wide uppercase">
          {activeCondition} Case
        </span>

        <button 
          onClick={() => onCycleCondition(1)}
          className="w-8 h-8 rounded-full bg-white shadow-soft-clay-sm flex items-center justify-center text-slate-600 hover:text-black hover:bg-slate-50 transition-all border border-black/5"
          title="Next Sound Phenotype"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Valve Site Switcher Tabs */}
      <div className="flex items-center gap-1.5 mt-3 p-1 bg-white/70 backdrop-blur-sm rounded-full border border-black/5 shadow-inner-soft">
        {Object.entries(siteCoordinates).map(([key, item]) => {
          const isSelected = selectedSite === key;
          return (
            <button
              key={key}
              onClick={() => onSelectSite(key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isSelected 
                  ? 'bg-[#18181B] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-black hover:bg-white/80'
              }`}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
