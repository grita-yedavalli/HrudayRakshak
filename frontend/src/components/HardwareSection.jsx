import React from 'react';
import { 
  Stethoscope, 
  Cpu, 
  Activity, 
  Wifi, 
  Radio, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Info,
  Mic,
  Disc,
  Cloud,
  Database,
  ArrowRight,
  Zap,
  Terminal,
  FileAudio
} from 'lucide-react';

export default function HardwareSection({ onLaunchStudio }) {
  const hrakshakSpecs = [
    {
      icon: Mic,
      category: "Acoustic Sensor",
      title: "MAX9814 Electret Microphone with AGC",
      details: "High-sensitivity electret microphone integrated with a low-noise pre-amplifier and Automatic Gain Control (AGC). Mounted directly inside a stethoscope chest bell to capture subtle cardiac mechanical murmurs.",
      specs: [
        { label: "Transducer", val: "MAX9814 Electret Capsule" },
        { label: "Gain Control", val: "Programmable AGC (40dB / 50dB / 60dB)" },
        { label: "Frequency Range", val: "20 Hz – 20,000 Hz (Optimal 20–800 Hz)" },
        { label: "Acoustic Mounting", val: "Stethoscope chest bell with silicone seal" }
      ],
      badge: "MAX9814 + AGC",
      color: "#EC7A72"
    },
    {
      icon: Cpu,
      category: "Microcontroller & ADC",
      title: "ESP32 Dual-Core Xtensa Microcontroller",
      details: "NodeMCU-32S / ESP32-WROOM-32 running a microsecond-timed sampling loop on GPIO 34 (ADC1 CH6), converting raw 12-bit heart sound vibrations into standardized 16-bit PCM samples.",
      specs: [
        { label: "Microcontroller", val: "ESP32 Tensilica LX6 @ 240 MHz" },
        { label: "Analog Input", val: "GPIO 34 (ADC1 Channel 6)" },
        { label: "Sampling Rate", val: "4,000 Hz (250 µs delay loop)" },
        { label: "Quantization", val: "12-Bit ADC mapped to 16-Bit PCM WAV" }
      ],
      badge: "ESP32 (4 kHz)",
      color: "#3480D9"
    },
    {
      icon: Wifi,
      category: "Telemetry Channels",
      title: "Dual Mode: Wi-Fi SoftAP & High-Speed UART",
      details: "Provides both wireless bedside mobility and reliable wired connectivity. Features on-chip SoftAP HTTP server for direct Wi-Fi streaming and 460,800 baud serial transfer.",
      specs: [
        { label: "Wi-Fi SoftAP", val: "SSID: HRakshak | Pass: 12345678" },
        { label: "Network Protocol", val: "HTTP Server @ 192.168.4.1:80 (/record)" },
        { label: "Serial Baud Rate", val: "460,800 bps (High-Speed UART)" },
        { label: "Cloud Ingestion", val: "Supabase Cloud Storage / Local WAV" }
      ],
      badge: "Wi-Fi & 460.8k Baud",
      color: "#E28C22"
    },
    {
      icon: Activity,
      category: "Filtering Pipeline",
      title: "Embedded & Host Denoising Engine",
      details: "Multi-stage digital signal conditioning from denoise.py eliminating DC chest drift, sensor friction, and electrical powerline hum without destroying murmur frequencies.",
      specs: [
        { label: "Bandpass Filter", val: "5th-Order Butterworth (20 Hz – 800 Hz)" },
        { label: "Filter Function", val: "scipy.signal.sosfiltfilt (Zero-Phase)" },
        { label: "Notch Filtering", val: "50 Hz, 100 Hz, 150 Hz Powerline Notches" },
        { label: "Format", val: "Mono 16-bit Little-Endian WAV @ 4 kHz" }
      ],
      badge: "20-800Hz + Notch",
      color: "#8B5CF6"
    }
  ];

  const pipelineStages = [
    {
      step: "1",
      title: "Hardware Acquisition",
      sub: "HRakshak V1.3 Stethoscope",
      desc: "MAX9814 microphone attached to chest bell reads acoustic pressure waves. ESP32 on GPIO 34 samples at 4,000 Hz.",
      badge: "MAX9814 + ESP32",
      color: "bg-[#DBEAFA] text-[#2A7FD9]"
    },
    {
      step: "2",
      title: "Cloud & Storage",
      sub: "Supabase Cloud Storage",
      desc: "Raw binary packets transmitted over Wi-Fi (HTTP/MQTT) or UART and stored as timestamped .wav files with patient metadata in Supabase bucket.",
      badge: "Wi-Fi / Supabase",
      color: "bg-[#D1FAE5] text-[#059669]"
    },
    {
      step: "3",
      title: "Upload / Ingestion",
      sub: "API & Studio Pipeline",
      desc: "Direct socket streaming from HRakshak or file upload of 4,000 Hz WAV recordings across valve sites.",
      badge: ".WAV File Ingestion",
      color: "bg-[#F3E8FF] text-[#7C3AED]"
    },
    {
      step: "4",
      title: "Denoise & Preprocess",
      sub: "Butterworth & Notches",
      desc: "20–800 Hz zero-phase bandpass filtering, 50/100/150 Hz electrical notch suppression, normalization, and window segmentation.",
      badge: "sosfiltfilt + Mel-Spec",
      color: "bg-[#FEF3C7] text-[#D97706]"
    },
    {
      step: "5",
      title: "RosaNet Classification",
      sub: "Deep Gated Conv1D",
      desc: "Multi-scale dilated convolutions evaluate PCG waveforms and metadata, predicting Normal, Murmur, and Valvular Pathologies.",
      badge: "1D RosaNet Ensemble",
      color: "bg-[#FCE7E6] text-[#CF3B32]"
    },
    {
      step: "6",
      title: "RAG Explanation",
      sub: "LLM + Vector Knowledge",
      desc: "Vector database retrieves clinical guidelines & matched patient profiles; LLM synthesizes personalized medical interpretations.",
      badge: "RAG Decision Support",
      color: "bg-[#E0E7FF] text-[#4F46E5]"
    },
    {
      step: "7",
      title: "User Clinical Output",
      sub: "Doctor / Patient Studio",
      desc: "Interactive dashboard displaying predicted class, probability scores, risk stratification, waveforms, and clinical recommendations.",
      badge: "Interactive Dashboard",
      color: "bg-slate-100 text-slate-800"
    }
  ];

  return (
    <section className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* Hardware Banner */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-soft-clay border border-[#E8EAEF] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3.5 py-1 rounded-full bg-[#18181B] text-white text-xs font-bold uppercase tracking-wider">
              HRakshak V1.3 Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FCE7E6] text-[#CF3B32] text-xs font-bold border border-[#F9D1CF]">
              ESP32 + MAX9814 Sensor Node
            </span>
            <span className="text-xs text-slate-400 font-medium">Standardized 4,000 Hz Auscultation</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#18181B] tracking-tight">
            HRakshak V1.3: Digital Stethoscope Hardware Setup
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed font-medium">
            Complete hardware implementation details from the <code>HRakshak_V1.3</code> engineering repository. Features a custom electret acoustic chest piece, hardware microsecond-timed ADC acquisition on the ESP32, and dual Wi-Fi/UART telemetry channels.
          </p>
        </div>

        <button
          onClick={onLaunchStudio}
          className="self-start md:self-auto bg-[#18181B] hover:bg-black text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md hover:scale-105 flex-shrink-0"
        >
          <Radio className="w-4 h-4 text-[#EC7A72] animate-pulse" />
          <span>Launch Diagnostic Studio</span>
        </button>
      </div>

      {/* Complete End-to-End System Pipeline (from user's architecture diagram) */}
      <div className="bg-white rounded-[32px] p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#CF3B32] uppercase tracking-wider">
              System Architecture Flow
            </span>
            <span className="text-xs text-slate-400 font-medium">• 7-Stage End-to-End Pipeline</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#18181B] tracking-tight">
            From HRakshak Hardware Ingestion to RAG-Augmented Clinical Explanation
          </h3>
        </div>

        {/* 7-Step Horizontal / Responsive Grid Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {pipelineStages.map((stage) => (
            <div 
              key={stage.step}
              className="bg-[#FAFBFD] rounded-2xl p-4 border border-slate-200 flex flex-col justify-between hover:bg-white hover:shadow-soft-clay-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center ${stage.color}`}>
                    {stage.step}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Stage {stage.step}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#18181B] leading-tight mb-1">
                  {stage.title}
                </h4>
                <span className="text-[10px] font-semibold text-slate-500 block mb-2">
                  {stage.sub}
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {stage.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white border border-black/5 text-slate-700 block truncate text-center">
                  {stage.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Core HRakshak Hardware Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hrakshakSpecs.map((spec, idx) => {
          const Icon = spec.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-[28px] p-7 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between hover:shadow-soft-clay-hover transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: spec.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {spec.category}
                      </span>
                      <h3 className="text-base font-bold text-[#18181B] leading-tight">
                        {spec.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-[#FAFBFD] px-2.5 py-1 rounded-xl border border-black/5 text-slate-600">
                    {spec.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                  {spec.details}
                </p>

                {/* Technical Specs List */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  {spec.specs.map((item, sIdx) => (
                    <div key={sIdx} className="bg-[#FAFBFD] p-2.5 rounded-xl border border-black/[0.03]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified in HRakshak_V1.3</span>
                <span className="font-semibold text-slate-700">Production Calibrated</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Firmware Implementation Snippet Box */}
      <div className="bg-[#18181B] text-white rounded-[32px] p-8 shadow-soft-clay flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                HRakshak ESP32 Firmware Execution Loop
              </h3>
              <span className="text-xs text-slate-400 font-mono">Arduino/esp32_stream/esp32_Wifi.ino</span>
            </div>
          </div>
          <span className="text-xs font-mono bg-white/10 text-emerald-400 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
            4,000 Hz Timing Loop
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
          {/* Wi-Fi Streaming Code */}
          <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-2">// Channel 1: Wi-Fi SoftAP Stream (Port 80)</div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`const int MIC_PIN = 34;
const int SAMPLE_RATE = 4000;
unsigned long interval = 1000000UL / SAMPLE_RATE; // 250 µs

// Record 10s to 20s heart sound buffer
for (int i = 0; i < TOTAL_SAMPLES; i++) {
  while ((long)(micros() - nextSample) < 0) {}
  samples[i] = analogRead(MIC_PIN);
  nextSample += interval;
}
client.write((uint8_t*)samples, TOTAL_SAMPLES * 2);`}
            </pre>
          </div>

          {/* Denoise & Conversion Code */}
          <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-2">// Channel 2 & Denoising (denoise.py)</div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`# 12-Bit ADC to 16-Bit Signed PCM WAV
sample = (adc_value - 2048) * 16
sample = max(-32768, min(32767, sample))

# 5th-Order Zero-Phase Butterworth Bandpass
sos = butter(5, [20, 800], btype="bandpass", fs=4000, output="sos")
clean_audio = sosfiltfilt(sos, raw_audio)

# Notch Filter 50/100/150 Hz Powerline Hum
b, a = iirnotch(50.0, Q=30, fs=4000)`}
            </pre>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-slate-400">
          <span>Wi-Fi Network: <strong>SSID: HRakshak (192.168.4.1)</strong> | Serial Port: <strong>460,800 Baud</strong></span>
          <button
            onClick={onLaunchStudio}
            className="text-white hover:text-[#EC7A72] font-bold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Test Hardware Recording in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
