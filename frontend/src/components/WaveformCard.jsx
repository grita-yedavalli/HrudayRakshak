import React from 'react';
import { Volume2, Info, Activity, ShieldCheck, Sparkles } from 'lucide-react';

export default function WaveformCard({ 
  type = 'before', // 'before' (Raw) or 'after' (Butterworth Filtered)
  title = 'Before',
  dateLabel = 'Raw Recording',
  condition = 'AS',
  signalData = [],
  highlightColor = '#EC7A72'
}) {
  const isBefore = type === 'before';

  // Generate SVG path from signal array
  const width = 280;
  const height = 90;
  const centerY = height / 2;
  
  // Create path string
  let pathD = `M 0 ${centerY}`;
  if (signalData && signalData.length > 0) {
    const stepX = width / (signalData.length - 1);
    pathD = signalData.map((val, idx) => {
      const x = idx * stepX;
      // scale val: -1.5..1.5 -> height
      const y = centerY - (val * (height * 0.38));
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  } else {
    // Default fallback stylized pulse wave
    pathD = isBefore
      ? `M 0 45 Q 25 35, 50 45 T 100 45 L 110 38 L 115 55 L 122 20 L 130 65 L 138 45 L 180 43 L 188 32 L 194 58 L 202 45 L 280 45`
      : `M 0 45 L 100 45 L 112 36 L 118 54 L 124 22 L 132 64 L 138 45 L 180 45 L 188 35 L 194 55 L 202 45 L 280 45`;
  }

  return (
    <div className="bg-white rounded-[26px] p-5 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between w-full min-w-[260px] max-w-[320px] transition-all duration-300 hover:shadow-soft-clay-hover">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-[#18181B] tracking-tight">{title}</span>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-black/5">
          {dateLabel}
        </span>
      </div>

      {/* Waveform Canvas / SVG Container */}
      <div className="relative h-24 w-full flex items-center justify-center bg-[#FAFBFD] rounded-2xl p-2 border border-black/[0.03] overflow-hidden">
        {/* Medical Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.35]" 
          style={{
            backgroundImage: 'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Center baseline */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-slate-200" />

        {/* Dynamic Waveform Path */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full relative z-10 overflow-visible">
          {/* Shadow line for depth */}
          <path
            d={pathD}
            fill="none"
            stroke={isBefore ? '#F9D1CF' : '#BDDBF7'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />
          {/* Main crisp line */}
          <path
            d={pathD}
            fill="none"
            stroke={isBefore ? '#CF3B32' : '#2A7FD9'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Peak callout markers (matching the subtle red/blue dots in image) */}
          {isBefore ? (
            <>
              {/* S1 marker */}
              <circle cx="85" cy="56" r="3" fill="#CF3B32" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* S2 marker */}
              <circle cx="175" cy="56" r="3" fill="#CF3B32" stroke="#FFFFFF" strokeWidth="1.5" />
            </>
          ) : (
            <>
              {/* Cleaned S1 & S2 markers */}
              <circle cx="85" cy="56" r="3.5" fill="#2A7FD9" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="175" cy="56" r="3.5" fill="#2A7FD9" stroke="#FFFFFF" strokeWidth="1.5" />
            </>
          )}
        </svg>

        {/* Visual Badge overlay */}
        <div className="absolute bottom-1.5 right-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          {isBefore ? 'Raw Sensor DC+Noise' : 'Zero-Phase 25–1k Hz'}
        </div>
      </div>

      {/* Description / Feature footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: isBefore ? '#E2554C' : '#3480D9' }} 
          />
          {isBefore ? 'Noise & Drift Unfiltered' : 'S1/S2 Systolic Murmur Intact'}
        </span>
        <span className="font-semibold text-slate-700">
          {isBefore ? 'Fs: 4,000 Hz' : 'sosfiltfilt'}
        </span>
      </div>
    </div>
  );
}
