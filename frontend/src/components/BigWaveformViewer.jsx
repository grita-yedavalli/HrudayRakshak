import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Heart, 
  Sparkles, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck, 
  Stethoscope, 
  Waves,
  Radio,
  Info,
  RotateCcw,
  MoveHorizontal
} from 'lucide-react';

export default function BigWaveformViewer({
  title = 'Aortic (Sitting)',
  valveSite = 'Aor',
  posture = 'sit',
  ics = 'Right 2nd ICS parasternal',
  signalData = [],
  dominantTarget = 'AS',
  dominantProb = 0.85,
  isHoverListening = false,
  onHoverStart,
  onHoverEnd,
  badgeColor = '#EC7A72',
  embedded = false,
  isNormal = false
}) {
  const isNormalRecording = isNormal || 
    dominantTarget === 'Normal' || 
    /normal|physiolog|healthy|benign/i.test(dominantTarget || '') || 
    (dominantProb < 0.35);

  const containerRef = useRef(null);
  const [cursorX, setCursorX] = useState(null);
  const [cursorData, setCursorData] = useState(null);

  // =========================================================================
  // CONTINUOUS PINCH & ZOOM STATE (1.0x to 8.0x)
  // =========================================================================
  // 1.0x = Full 5.0s recording
  // 2.0x = 2.5s window (3 cardiac cycles)
  // 4.0x = 1.25s window (Single heartbeat focus: S1 -> Murmur -> S2)
  // 8.0x = 0.625s window (High-definition micro-murmur inspection)
  const [zoom, setZoom] = useState(4.0); // Default to 4.0x single beat focus
  const [panOffset, setPanOffset] = useState(0.4); // 0.0 (start) to 1.0 (end) of allowed pan range
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startPan: 0.4 });
  const touchState = useRef({ initialDist: 0, initialZoom: 4.0 });

  // Large SVG Canvas Dimensions
  const svgWidth = 1000;
  const svgHeight = 320;
  const centerY = svgHeight / 2;

  // Total recording duration
  const totalDuration = 5.0; // 5.0 seconds
  const beatPeriod = 0.833; // ~72 BPM

  // Calculate visible temporal window [windowStart, windowStart + windowDuration]
  const windowDuration = Math.max(0.6, totalDuration / zoom);
  const maxStart = Math.max(0, totalDuration - windowDuration);
  const windowStart = Math.min(maxStart, Math.max(0, panOffset * maxStart));
  const windowEnd = windowStart + windowDuration;

  // =========================================================================
  // TRACKPAD PINCH-TO-ZOOM LISTENER (e.ctrlKey / wheel delta)
  // =========================================================================
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      // On Mac trackpad, 2-finger pinch sets e.ctrlKey = true
      // Or standard wheel scroll
      const sensitivity = e.ctrlKey ? 0.025 : 0.005;
      const delta = -e.deltaY * sensitivity;

      setZoom((prev) => {
        const next = Math.min(8.0, Math.max(1.0, prev + delta));
        return Math.round(next * 10) / 10;
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // =========================================================================
  // TOUCH 2-FINGER PINCH LISTENER (Mobile / iPad / Touchscreens)
  // =========================================================================
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchState.current = { initialDist: dist, initialZoom: zoom };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchState.current.initialDist > 0) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchState.current.initialDist;
      const next = Math.min(8.0, Math.max(1.0, touchState.current.initialZoom * factor));
      setZoom(Math.round(next * 10) / 10);
    }
  };

  const handleTouchEnd = () => {
    touchState.current = { initialDist: 0, initialZoom: zoom };
  };

  // =========================================================================
  // DRAG-TO-PAN (When Zoomed In > 1.0x)
  // =========================================================================
  const handleMouseDown = (e) => {
    if (zoom > 1.0) {
      setIsDragging(true);
      dragRef.current = { startX: e.clientX, startPan: panOffset };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1.0) {
      const deltaX = e.clientX - dragRef.current.startX;
      const width = containerRef.current?.clientWidth || 1000;
      // Dragging right shifts view left (standard pan physics)
      const deltaRatio = -deltaX / (width * 0.7);
      setPanOffset(Math.min(1.0, Math.max(0.0, dragRef.current.startPan + deltaRatio)));
      return;
    }

    // Normal Hover Cursor Scanning
    if (!containerRef.current || points.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = mouseX / rect.width;
    const svgX = ratio * svgWidth;
    const closestIdx = Math.round(ratio * (points.length - 1));
    setCursorX(svgX);
    setCursorData(points[closestIdx] || points[0]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // =========================================================================
  // AUDIO LISTENING ON HOVER (Strictly for the Waveform Monitor Canvas)
  // =========================================================================
  const handleGraphMouseEnter = () => {
    if (onHoverStart) onHoverStart();
  };

  const handleGraphMouseLeave = () => {
    setCursorX(null);
    setCursorData(null);
    setIsDragging(false);
    if (onHoverEnd) onHoverEnd();
  };

  // =========================================================================
  // SIGNAL SLICING & SVG PATH COMPUTATION
  // =========================================================================
  const { pathD, points } = useMemo(() => {
    let fullSignal = [];

    if (signalData && signalData.length > 20) {
      fullSignal = signalData;
    } else {
      // High-resolution synthetic 5.0-second physiological heart sound waveform with murmurs
      const numPts = 600;
      for (let i = 0; i < numPts; i++) {
        const t = (i / (numPts - 1)) * 5.0;
        const beatCycle = t % beatPeriod;
        let yVal = 0;

        // S1 (0.05s to 0.16s): Mitral/Tricuspid closure
        if (beatCycle >= 0.05 && beatCycle <= 0.16) {
          const p = (beatCycle - 0.05) / 0.11;
          yVal = Math.sin(p * Math.PI * 6) * Math.exp(-p * 2.5) * 0.95;
        }
        // Systolic Murmur Turbulence (0.17s to 0.36s): Diamond crescendo-decrescendo jet (Only if pathological murmur!)
        else if (beatCycle > 0.16 && beatCycle < 0.37) {
          if (isNormalRecording) {
            // Clean laminar quiet baseline during normal systole (no artificial murmur turbulence)
            yVal = (Math.sin(beatCycle * 14) * 0.04) + (Math.random() - 0.5) * 0.015;
          } else {
            const p = (beatCycle - 0.16) / 0.21;
            const diamond = Math.sin(p * Math.PI);
            yVal = (Math.sin(p * 28) * 0.52 + (Math.sin(p * 50) * 0.28) + (Math.random() - 0.5) * 0.15) * diamond;
          }
        }
        // S2 (0.38s to 0.47s): Aortic/Pulmonic closure
        else if (beatCycle >= 0.37 && beatCycle <= 0.48) {
          const p = (beatCycle - 0.37) / 0.11;
          yVal = Math.sin(p * Math.PI * 8) * Math.exp(-p * 3.5) * 0.75;
        }
        // Diastole: Quiet baseline with low-amplitude compliance
        else {
          yVal = (Math.sin(beatCycle * 14) * 0.04) + (Math.random() - 0.5) * 0.015;
        }

        fullSignal.push(yVal);
      }
    }

    // Slice signal according to windowStart and windowDuration
    const totalPts = fullSignal.length;
    const startIdx = Math.floor((windowStart / totalDuration) * totalPts);
    const endIdx = Math.min(totalPts - 1, Math.ceil((windowEnd / totalDuration) * totalPts));
    const sliced = fullSignal.slice(startIdx, endIdx + 1);

    if (sliced.length < 2) {
      return { pathD: `M 0 ${centerY} L ${svgWidth} ${centerY}`, points: [] };
    }

    const step = svgWidth / (sliced.length - 1);
    const maxVal = Math.max(...sliced.map(v => Math.abs(v)), 0.08);
    const scale = (svgHeight * 0.38) / maxVal;

    const pts = sliced.map((val, idx) => {
      const x = idx * step;
      const y = centerY - (val * scale);
      const t = windowStart + (idx / (sliced.length - 1)) * windowDuration;
      return { x, y, val, t };
    });

    const d = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    return { pathD: d, points: pts };
  }, [signalData, windowStart, windowEnd, windowDuration, svgHeight, centerY]);

  // =========================================================================
  // DYNAMIC S1 (lub), MURMUR, S2 (dub) REGION CALCULATION (ZERO OVERLAP)
  // =========================================================================
  // Calculates all visible cardiac cycles within [windowStart, windowEnd]
  const visibleBeats = useMemo(() => {
    const beats = [];
    const minBeatIdx = Math.max(0, Math.floor((windowStart - 0.4) / beatPeriod));
    const maxBeatIdx = Math.min(6, Math.ceil((windowEnd + 0.4) / beatPeriod));

    for (let i = minBeatIdx; i <= maxBeatIdx; i++) {
      const tCycle = i * beatPeriod;
      const tS1 = tCycle + 0.10;
      const tMurmurStart = tCycle + 0.17;
      const tMurmurEnd = tCycle + 0.36;
      const tMurmurMid = (tMurmurStart + tMurmurEnd) / 2;
      const tS2 = tCycle + 0.43;
      const tDiastoleMid = tCycle + 0.62;

      // Map to SVG coordinates
      const xS1 = ((tS1 - windowStart) / windowDuration) * svgWidth;
      const xMurmurStart = ((tMurmurStart - windowStart) / windowDuration) * svgWidth;
      const xMurmurEnd = ((tMurmurEnd - windowStart) / windowDuration) * svgWidth;
      const xMurmurMid = ((tMurmurMid - windowStart) / windowDuration) * svgWidth;
      const xS2 = ((tS2 - windowStart) / windowDuration) * svgWidth;
      const xDiastoleMid = ((tDiastoleMid - windowStart) / windowDuration) * svgWidth;

      // Check if any portion falls in visible canvas
      if (xS2 >= -60 && xS1 <= svgWidth + 60) {
        beats.push({
          beatIndex: i + 1,
          xS1,
          xMurmurStart,
          xMurmurEnd,
          xMurmurMid,
          xS2,
          xDiastoleMid,
          murmurWidth: Math.max(40, xMurmurEnd - xMurmurStart)
        });
      }
    }
    return beats;
  }, [windowStart, windowEnd, windowDuration]);

  return (
    <div className={embedded 
      ? "flex flex-col gap-5 w-full transition-all" 
      : "bg-white rounded-[28px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6 w-full transition-all"
    }>
      
      {/* Top Header & Channel Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md flex-shrink-0"
            style={{ backgroundColor: badgeColor }}
          >
            {valveSite}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {posture === 'sit' ? 'Sitting Posture' : 'Supine Posture'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs font-bold text-[#CF3B32]">
                {(dominantProb * 100).toFixed(1)}% {dominantTarget} Acoustic Intensity
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#18181B] tracking-tight">
              {title} Phonocardiogram (PCG) Monitor
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Landmark: {ics} • Zero-Phase 25–1,000 Hz Butterworth Bandpass
            </span>
          </div>
        </div>

        {/* Audio Hover Status Indicator */}
        <div className="flex items-center gap-3">
          <div 
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all ${
              isHoverListening
                ? 'bg-[#FCE7E6] border-[#F9D1CF] text-[#CF3B32] shadow-sm scale-102'
                : 'bg-[#FAFBFD] border-slate-200 text-slate-500'
            }`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              isHoverListening ? 'bg-[#CF3B32] text-white animate-pulse' : 'bg-slate-200 text-slate-600'
            }`}>
              {isHoverListening ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-75">
                {isHoverListening ? 'Audio Active' : 'Cardiac Stethoscope'}
              </span>
              <span className="text-xs font-extrabold flex items-center gap-1">
                <Heart className={`w-3 h-3 ${isHoverListening ? 'text-[#CF3B32] fill-[#CF3B32] animate-bounce' : 'text-slate-400'}`} />
                {isHoverListening ? 'Streaming Heart Sound' : 'Hover Graph to Listen'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* PINCH-TO-ZOOM TOOLBAR & CONTINUOUS RANGE CONTROL                        */}
      {/* ======================================================================= */}
      <div className="flex flex-col gap-3 bg-[#FAFBFD] p-4 rounded-2xl border border-slate-200">
        
        {/* Top Control Bar: Quick Presets + Continuous Slider */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Quick Preset Zoom Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
              <ZoomIn className="w-4 h-4 text-[#CF3B32]" />
              <span>Pinch Zoom:</span>
            </span>

            {[
              { label: '1x (Full 5s)', value: 1.0 },
              { label: '2x (2.5s)', value: 2.0 },
              { label: '4x (Single Beat)', value: 4.0, highlight: true },
              { label: '8x (Micro Jet)', value: 8.0 }
            ].map(preset => {
              const isActive = Math.abs(zoom - preset.value) < 0.2;
              return (
                <button
                  key={preset.value}
                  onClick={() => setZoom(preset.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-sm ring-2 ring-[#CF3B32]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {preset.highlight && <Sparkles className={`w-3 h-3 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />}
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Continuous Zoom Slider with Pinch Gestures */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setZoom(prev => Math.max(1.0, Math.round((prev - 0.5) * 10) / 10))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Range Slider */}
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-28 sm:w-36 accent-[#CF3B32] cursor-pointer"
              title="Continuous pinch/zoom slider"
            />

            <button
              onClick={() => setZoom(prev => Math.min(8.0, Math.round((prev + 0.5) * 10) / 10))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-black text-slate-800 min-w-[36px] text-right">
              {zoom.toFixed(1)}x
            </span>

            {zoom > 1.0 && (
              <button
                onClick={() => { setZoom(1.0); setPanOffset(0.0); }}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title="Reset zoom to 1.0x"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mini Waveform Timeline Scrubber / Viewport Indicator */}
        <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <MoveHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Pinch trackpad / scroll wheel to zoom • Drag graph horizontally to pan</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">
              Window: <strong>{windowStart.toFixed(2)}s – {windowEnd.toFixed(2)}s</strong> ({windowDuration.toFixed(2)}s span)
            </span>

            {/* Timeline Progress Track */}
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden relative border border-slate-300">
              <div 
                className="h-full bg-[#CF3B32] rounded-full transition-all duration-75"
                style={{
                  left: `${(windowStart / totalDuration) * 100}%`,
                  width: `${(windowDuration / totalDuration) * 100}%`,
                  position: 'absolute'
                }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================================= */}
      {/* THE BIG PCG MONITOR CANVAS (PINCHABLE, DRAGGABLE, AUDIO ON HOVER)       */}
      {/* ======================================================================= */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleGraphMouseEnter}
        onMouseLeave={handleGraphMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full h-80 sm:h-96 md:h-[420px] rounded-3xl bg-[#090D16] border border-slate-800 p-4 overflow-hidden select-none flex items-center justify-center shadow-inner transition-colors ${
          zoom > 1.0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair'
        }`}
      >
        {/* ECG/PCG Millimeter Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38BDF8 1px, transparent 1px),
              linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Major Medical Calibrations */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #FFFFFF 1px, transparent 1px),
              linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Amplitude Scale (Y-Axis) */}
        <div className="absolute left-3 top-0 bottom-0 flex flex-col justify-between py-8 text-[10px] font-mono text-cyan-400/70 pointer-events-none z-10">
          <span>+1.0 P</span>
          <span>+0.5 P</span>
          <span className="text-cyan-300 font-bold"> 0.0 (Baseline)</span>
          <span>-0.5 P</span>
          <span>-1.0 P</span>
        </div>

        {/* Center Zero-Phase Baseline */}
        <div className="absolute left-10 right-0 top-1/2 h-[1px] bg-cyan-500/20 pointer-events-none" />

        {/* Time Axis Calibration (X-Axis) */}
        <div className="absolute left-12 right-6 bottom-2 flex justify-between text-[10px] font-mono text-cyan-400/60 pointer-events-none z-10">
          <span>{windowStart.toFixed(2)}s</span>
          <span>{(windowStart + windowDuration * 0.25).toFixed(2)}s</span>
          <span>{(windowStart + windowDuration * 0.50).toFixed(2)}s</span>
          <span>{(windowStart + windowDuration * 0.75).toFixed(2)}s</span>
          <span>{windowEnd.toFixed(2)}s</span>
        </div>

        {/* Top Status Badges on Monitor */}
        <div className="absolute top-3 right-4 z-10 pointer-events-none flex items-center gap-2">
          {zoom > 1.0 && (
            <span className="text-[10px] text-amber-300 font-mono bg-amber-950/80 border border-amber-700/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <MoveHorizontal className="w-3 h-3" />
              <span>Drag to Pan</span>
            </span>
          )}
          <span className="text-[10px] text-cyan-300 font-mono bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
            Zoom: {zoom.toFixed(1)}x • Window: {windowDuration.toFixed(2)}s
          </span>
        </div>

        {/* =================================================================== */}
        {/* SVG DRAWING: WAVEFORM + DYNAMIC NON-OVERLAPPING S1, MURMUR, S2      */}
        {/* =================================================================== */}
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-full relative z-10 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Render visible cardiac beats (S1, Murmur, S2, Diastole) */}
          {visibleBeats.map((beat) => {
            const isSingleFocus = zoom >= 3.0;

            return (
              <g key={`beat-${beat.beatIndex}`} className="pointer-events-none select-none">
                {/* 1. S1 (LUB) REGION - Mitral/Tricuspid closure */}
                <rect 
                  x={beat.xS1 - (isSingleFocus ? 45 : 24)} 
                  y="45" 
                  width={isSingleFocus ? 90 : 48} 
                  height={svgHeight - 85} 
                  fill="#10B981" 
                  opacity={isSingleFocus ? 0.14 : 0.08} 
                  rx="8" 
                />
                <line 
                  x1={beat.xS1} 
                  y1="45" 
                  x2={beat.xS1} 
                  y2={svgHeight - 40} 
                  stroke="#10B981" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3" 
                  opacity="0.6" 
                />
                
                {/* S1 Badge */}
                <rect 
                  x={beat.xS1 - (isSingleFocus ? 52 : 36)} 
                  y="12" 
                  width={isSingleFocus ? 104 : 72} 
                  height={isSingleFocus ? 26 : 22} 
                  rx="6" 
                  fill="#064E3B" 
                  stroke="#10B981" 
                  strokeWidth="1.5" 
                />
                <text 
                  x={beat.xS1} 
                  y={isSingleFocus ? 29 : 27} 
                  fill="#6EE7B7" 
                  fontSize={isSingleFocus ? 12 : 10} 
                  fontWeight="900" 
                  textAnchor="middle" 
                  fontFamily="monospace"
                >
                  S1 (lub)
                </text>
                {isSingleFocus && (
                  <text x={beat.xS1} y="58" fill="#A7F3D0" fontSize="9" fontWeight="700" textAnchor="middle">
                    AV Valves Close
                  </text>
                )}

                {/* 2. SYSTOLIC REGION: Murmur Jet vs Normal Quiet Laminar Systole */}
                {!isNormalRecording ? (
                  <>
                    <rect 
                      x={beat.xMurmurStart} 
                      y="45" 
                      width={beat.murmurWidth} 
                      height={svgHeight - 85} 
                      fill="#F43F5E" 
                      opacity={isSingleFocus ? 0.16 : 0.09} 
                      rx="8" 
                    />
                    <line 
                      x1={beat.xMurmurStart + 5} 
                      y1="36" 
                      x2={beat.xMurmurEnd - 5} 
                      y2="36" 
                      stroke="#F43F5E" 
                      strokeWidth="2" 
                      strokeDasharray="6 3" 
                    />
                    
                    {/* Murmur Badge */}
                    <rect 
                      x={beat.xMurmurMid - (isSingleFocus ? 85 : 55)} 
                      y={isSingleFocus ? 12 : 36} 
                      width={isSingleFocus ? 170 : 110} 
                      height={isSingleFocus ? 26 : 22} 
                      rx="6" 
                      fill="#881337" 
                      stroke="#F43F5E" 
                      strokeWidth="1.5" 
                    />
                    <text 
                      x={beat.xMurmurMid} 
                      y={isSingleFocus ? 29 : 51} 
                      fill="#FDA4AF" 
                      fontSize={isSingleFocus ? 11 : 9} 
                      fontWeight="900" 
                      textAnchor="middle" 
                      fontFamily="monospace"
                    >
                      Murmur ({dominantTarget})
                    </text>
                    {isSingleFocus && (
                      <text x={beat.xMurmurMid} y="58" fill="#FECDD3" fontSize="9" fontWeight="700" textAnchor="middle">
                        Systolic Turbulent Jet
                      </text>
                    )}
                  </>
                ) : (
                  <>
                    {/* Normal Laminar Systole Indicator */}
                    <line 
                      x1={beat.xMurmurStart} 
                      y1="40" 
                      x2={beat.xMurmurEnd} 
                      y2="40" 
                      stroke="#0D9488" 
                      strokeWidth="1" 
                      strokeDasharray="3 3" 
                      opacity="0.4" 
                    />
                    {isSingleFocus && (
                      <g>
                        <rect 
                          x={beat.xMurmurMid - 70} 
                          y="14" 
                          width="140" 
                          height="22" 
                          rx="6" 
                          fill="#042F2E" 
                          stroke="#0D9488" 
                          strokeWidth="1" 
                          opacity="0.9" 
                        />
                        <text 
                          x={beat.xMurmurMid} 
                          y="29" 
                          fill="#5EEAD4" 
                          fontSize="10" 
                          fontWeight="800" 
                          textAnchor="middle" 
                          fontFamily="monospace"
                        >
                          Laminar (No Murmur)
                        </text>
                      </g>
                    )}
                  </>
                )}

                {/* 3. S2 (DUB) REGION - Aortic/Pulmonic closure */}
                <rect 
                  x={beat.xS2 - (isSingleFocus ? 45 : 24)} 
                  y="45" 
                  width={isSingleFocus ? 90 : 48} 
                  height={svgHeight - 85} 
                  fill="#38BDF8" 
                  opacity={isSingleFocus ? 0.14 : 0.08} 
                  rx="8" 
                />
                <line 
                  x1={beat.xS2} 
                  y1="45" 
                  x2={beat.xS2} 
                  y2={svgHeight - 40} 
                  stroke="#38BDF8" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 3" 
                  opacity="0.6" 
                />
                
                {/* S2 Badge */}
                <rect 
                  x={beat.xS2 - (isSingleFocus ? 52 : 36)} 
                  y="12" 
                  width={isSingleFocus ? 104 : 72} 
                  height={isSingleFocus ? 26 : 22} 
                  rx="6" 
                  fill="#0C4A6E" 
                  stroke="#38BDF8" 
                  strokeWidth="1.5" 
                />
                <text 
                  x={beat.xS2} 
                  y={isSingleFocus ? 29 : 27} 
                  fill="#7DD3FC" 
                  fontSize={isSingleFocus ? 12 : 10} 
                  fontWeight="900" 
                  textAnchor="middle" 
                  fontFamily="monospace"
                >
                  S2 (dub)
                </text>
                {isSingleFocus && (
                  <text x={beat.xS2} y="58" fill="#BAE6FD" fontSize="9" fontWeight="700" textAnchor="middle">
                    Semilunar Valves Close
                  </text>
                )}
              </g>
            );
          })}

          {/* Glowing Shadow Trace */}
          <path
            d={pathD}
            fill="none"
            stroke={badgeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-25 blur-[3px]"
          />

          {/* Secondary Cyan Glow */}
          <path
            d={pathD}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-35"
          />

          {/* Primary Crisp Acoustic Signal Trace */}
          <path
            d={pathD}
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Mouse Tracking Scanner Line */}
          {cursorX !== null && (
            <g className="pointer-events-none">
              <line
                x1={cursorX}
                y1="35"
                x2={cursorX}
                y2={svgHeight - 35}
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-90 animate-pulse"
              />

              {cursorData && (
                <circle
                  cx={cursorX}
                  cy={cursorData.y}
                  r="5.5"
                  fill="#38BDF8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="shadow-lg"
                />
              )}
            </g>
          )}
        </svg>

        {/* Hover Crosshair Info Tooltip Overlay */}
        {cursorData && cursorX !== null && (
          <div 
            className="absolute top-4 pointer-events-none z-20 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-cyan-500/40 shadow-xl flex items-center gap-3 text-xs font-mono transition-all"
            style={{
              left: `${Math.max(12, Math.min(84, (cursorX / svgWidth) * 100))}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-bold">{cursorData.t.toFixed(3)}s</span>
            </div>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">Amp: {cursorData.val.toFixed(3)} P</span>
            <span className="text-slate-500">•</span>
            <span className={`${isNormalRecording ? 'text-teal-300' : 'text-rose-300'} font-bold`}>
              {((cursorData.t % beatPeriod) >= 0.17 && (cursorData.t % beatPeriod) <= 0.36) 
                ? (isNormalRecording ? 'Systole (Laminar / No Murmur)' : `Systolic Murmur (${dominantTarget})`) 
                : ((cursorData.t % beatPeriod) <= 0.16) 
                ? 'S1 Phase' 
                : ((cursorData.t % beatPeriod) <= 0.48) 
                ? 'S2 Phase' 
                : 'Diastole Phase'}
            </span>
          </div>
        )}
      </div>

      {/* Monitor Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-slate-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
            <span>S1 (lub): Atrioventricular Valves Close</span>
          </div>
          {!isNormalRecording ? (
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" />
              <span>Murmur: Systolic Ejection / Regurgitant Jet</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-3 h-3 rounded bg-teal-500/30 border border-teal-500" />
              <span>Systole: Laminar Blood Flow (No Murmurs Detected)</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500" />
            <span>S2 (dub): Semilunar Valves Close</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span>HRakshak V1.3 • 4,000 Hz Sampling</span>
        </div>
      </div>

    </div>
  );
}
