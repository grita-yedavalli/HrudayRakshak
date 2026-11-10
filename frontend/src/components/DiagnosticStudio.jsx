import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Cloud,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Activity,
  Volume2,
  VolumeX,
  Stethoscope,
  Sliders,
  ArrowRight,
  ArrowLeft,
  FileAudio,
  Radio,
  Check,
  X,
  Heart,
  Eye,
  CheckCircle2,
  ShieldCheck,
  FileText,
  User
} from 'lucide-react';
import BigWaveformViewer from './BigWaveformViewer';
import PatientRiskStratification from './PatientRiskStratification';
import ClinicalConsultationReport from './ClinicalConsultationReport';

export default function DiagnosticStudio() {
  // Precordial 8 Slots Specification: 4 sites x 2 postures
  const standardSlots = [
    { key: 'Aor_sit', site: 'Aor', posture: 'sit', label: 'Aortic (Sitting)', ics: 'Right 2nd ICS parasternal', color: '#EC7A72' },
    { key: 'Aor_sup', site: 'Aor', posture: 'sup', label: 'Aortic (Supine)', ics: 'Right 2nd ICS parasternal', color: '#EC7A72' },
    { key: 'Mit_sit', site: 'Mit', posture: 'sit', label: 'Mitral (Sitting)', ics: 'Cardiac apex (5th ICS)', color: '#8B5CF6' },
    { key: 'Mit_sup', site: 'Mit', posture: 'sup', label: 'Mitral (Supine)', ics: 'Cardiac apex (5th ICS)', color: '#8B5CF6' },
    { key: 'Pul_sit', site: 'Pul', posture: 'sit', label: 'Pulmonic (Sitting)', ics: 'Left 2nd ICS parasternal', color: '#3480D9' },
    { key: 'Pul_sup', site: 'Pul', posture: 'sup', label: 'Pulmonic (Supine)', ics: 'Left 2nd ICS parasternal', color: '#3480D9' },
    { key: 'Tri_sit', site: 'Tri', posture: 'sit', label: 'Tricuspid (Sitting)', ics: 'Lower left sternal border', color: '#E28C22' },
    { key: 'Tri_sup', site: 'Tri', posture: 'sup', label: 'Tricuspid (Supine)', ics: 'Lower left sternal border', color: '#E28C22' },
  ];

  // Page View state: 'ingest' (Upload & Demographics) vs 'diagnosis' (Stages 1-3) vs 'rag' (Stage 4 Clinical Decision Support)
  const [currentPage, setCurrentPage] = useState('ingest');
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [cloudLoadStatus, setCloudLoadStatus] = useState('');

  // 8 Files slot state: key -> { file, filename, url, size }
  const [slotFiles, setSlotFiles] = useState({});

  // Patient Metadata state (Patient Name & Direct Exact Age with dynamic decadal epoch derivation)
  const [patientName, setPatientName] = useState('Alex Morgan');
  const [age, setAge] = useState(38);
  const [gender, setGender] = useState('M');
  const [smoker, setSmoker] = useState(0);
  const [lives, setLives] = useState('U');

  const getAgeBracket = (a) => {
    const n = Number(a) || 35;
    if (n < 20) return '10-19';
    if (n < 30) return '20-29';
    if (n < 40) return '30-39';
    if (n < 50) return '40-49';
    if (n < 60) return '50-59';
    if (n < 70) return '60-69';
    if (n < 80) return '70-79';
    return '80+';
  };

  // Analysis & Results state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeInspectSlot, setActiveInspectSlot] = useState('Aor_sit');

  // Interactive Hover Heartbeat Listening Audio system
  const hoverAudioRef = useRef(new Audio());
  const synthTimerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [isHoverListening, setIsHoverListening] = useState(false);
  const [activeHoverSlotKey, setActiveHoverSlotKey] = useState(null);

  // Play heart sound on hover (authentic audio file or synthesized stethoscope acoustic resonance)
  const startHoverListening = (slotKey) => {
    const targetKey = slotKey || activeInspectSlot;
    setActiveHoverSlotKey(targetKey);
    setIsHoverListening(true);

    const fileItem = slotFiles[targetKey];
    if (fileItem && fileItem.url) {
      try {
        if (hoverAudioRef.current.src !== fileItem.url) {
          hoverAudioRef.current.src = fileItem.url;
        }
        hoverAudioRef.current.loop = true;
        hoverAudioRef.current.currentTime = 0;
        hoverAudioRef.current.play().catch(() => {
          startSyntheticHeartbeat();
        });
        return;
      } catch (err) {
        console.warn("Direct audio playback failed, falling back to synth:", err);
      }
    }

    startSyntheticHeartbeat();
  };

  const stopHoverListening = () => {
    setIsHoverListening(false);
    setActiveHoverSlotKey(null);
    if (hoverAudioRef.current) {
      hoverAudioRef.current.pause();
    }
    stopSyntheticHeartbeat();
  };

  // Synthesize realistic acoustic stethoscope heart sound using Web Audio API
  const startSyntheticHeartbeat = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const playLubDub = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        // S1 (Lub - 65 Hz, 120ms)
        createHeartSoundTone(now, 65, 0.12, 0.5);
        // S2 (Dub - 95 Hz, 90ms, 280ms after S1)
        createHeartSoundTone(now + 0.28, 95, 0.09, 0.4);
      };

      playLubDub();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      synthTimerRef.current = setInterval(playLubDub, 830); // ~72 BPM
    } catch (e) {
      console.warn("Synth heartbeat error:", e);
    }
  };

  const createHeartSoundTone = (time, freq, duration, gainLevel) => {
    if (!audioCtxRef.current) return;
    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      const filter = audioCtxRef.current.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2.2, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gainLevel, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch (e) { }
  };

  const stopSyntheticHeartbeat = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopHoverListening();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => { });
      }
    };
  }, []);

  // Batch upload: accepts all 8 WAV files at once
  const handleBatchUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setErrorMessage(null);

    const newSlots = { ...slotFiles };

    files.forEach((file) => {
      const name = file.name.toLowerCase();
      // Auto-detect valve site and posture from filename using delimiter-safe regex
      let matchedKey = null;
      const siteRegexMap = {
        Aor: /(?:^|[\W_])(aor|aortic)(?:[\W_]|$)/i,
        Mit: /(?:^|[\W_])(mit|mitral|apex)(?:[\W_]|$)/i,
        Pul: /(?:^|[\W_])(pul|pulmonic|pulmonary)(?:[\W_]|$)/i,
        Tri: /(?:^|[\W_])(tri|tricuspid)(?:[\W_]|$)/i,
      };
      const postureRegexMap = {
        sit: /(?:^|[\W_])(sit|sitting)(?:[\W_]|$)/i,
        sup: /(?:^|[\W_])(sup|supine|recumbent)(?:[\W_]|$)/i,
      };

      for (const slot of standardSlots) {
        const siteRx = siteRegexMap[slot.site];
        const postRx = postureRegexMap[slot.posture];
        if (siteRx && postRx && siteRx.test(name) && postRx.test(name)) {
          matchedKey = slot.key;
          break;
        }
      }

      if (matchedKey) {
        newSlots[matchedKey] = {
          file,
          filename: file.name,
          url: URL.createObjectURL(file),
          size: file.size
        };
      }
    });

    // If any files could not be matched by name, fill empty slots sequentially
    const unassignedFiles = files.filter(f => !Object.values(newSlots).some(s => s.file === f));
    const emptySlotKeys = standardSlots.map(s => s.key).filter(k => !newSlots[k]);

    unassignedFiles.forEach((file, idx) => {
      if (idx < emptySlotKeys.length) {
        const slotKey = emptySlotKeys[idx];
        newSlots[slotKey] = {
          file,
          filename: file.name,
          url: URL.createObjectURL(file),
          size: file.size
        };
      }
    });

    setSlotFiles(newSlots);
  };

  // Upload individual slot
  const handleSlotUpload = (slotKey, e) => {
    const file = e.target.files[0];
    if (file) {
      setSlotFiles((prev) => ({
        ...prev,
        [slotKey]: {
          file,
          filename: file.name,
          url: URL.createObjectURL(file),
          size: file.size
        }
      }));
    }
  };

  // Load curated sample patient (Patient 005 - AS, or Patient 089 - Normal) from backend
  const handleLoadSample = async (cohortId = 'patient_005') => {
    setIsLoadingSample(true);
    setErrorMessage(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/sample-cohorts').catch(() => null);
      if (res && res.ok) {
        const cohorts = await res.json();
        const targetPatient = cohorts.find(c => c.cohort_id === cohortId) || cohorts[0];
        if (targetPatient && targetPatient.slots) {
          const newSlots = {};
          for (const [key, filename] of Object.entries(targetPatient.slots)) {
            try {
              const audioRes = await fetch(`http://127.0.0.1:8000/api/sample-audio/${filename}`);
              if (audioRes.ok) {
                const blob = await audioRes.blob();
                newSlots[key] = {
                  file: new File([blob], filename, { type: 'audio/wav' }),
                  filename: filename,
                  url: URL.createObjectURL(blob),
                  size: blob.size
                };
              }
            } catch (err) {
              console.warn(`Failed to fetch sample file ${filename}:`, err);
            }
          }
          if (Object.keys(newSlots).length > 0) {
            setSlotFiles(newSlots);
            setPatientName(cohortId === 'patient_089' ? 'Sarah Jenkins' : 'Marcus Vance');
            setAge(cohortId === 'patient_089' ? 24 : 48);
            setGender(targetPatient.gender || 'M');
            setSmoker(targetPatient.smoker ?? 0);
            setLives(targetPatient.lives || 'U');
            setIsLoadingSample(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Sample load error:", e);
    }
    setIsLoadingSample(false);
  };

  // Load latest 8 recordings from Supabase Cloud Storage (Arduino real recordings)
  const handleLoadFromCloud = async () => {
    setIsLoadingCloud(true);
    setErrorMessage(null);
    setCloudLoadStatus('Connecting to Supabase...');

    const SUPABASE_URL = 'https://yurpyrwvhpyluavimjeu.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_k6tKxSoom26z-wAgDInv4w_0JlnljMZ';
    const BUCKET = 'heart-sounds';

    try {
      // Step 1: List all files in the bucket sorted newest first
      setCloudLoadStatus('Fetching file list...');
      const listRes = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 100,
          offset: 0,
          prefix: '',
          sortBy: { column: 'created_at', order: 'desc' }
        })
      });

      if (!listRes.ok) {
        const errText = await listRes.text();
        throw new Error(`Could not list cloud files: ${errText}`);
      }

      const fileList = await listRes.json();

      if (!fileList || fileList.length === 0) {
        throw new Error('No recordings found in Supabase. Please record from Arduino first.');
      }

      // Take the 8 most recent files
      const targetFiles = fileList.slice(0, 8);
      const newSlots = {};

      // Step 2: Download each file and map to the 8 precordial slots
      for (let i = 0; i < targetFiles.length; i++) {
        const fileInfo = targetFiles[i];
        const filename = fileInfo.name;
        const slotKey = standardSlots[i]?.key;
        if (!slotKey) continue;

        setCloudLoadStatus(`Downloading ${i + 1}/${targetFiles.length}: ${filename.substring(0, 20)}...`);

        try {
          let blob = null;

          // Method 1: Try public URL (works if bucket is set to Public in Supabase)
          const pubRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(filename)}`
          );
          if (pubRes.ok) {
            blob = await pubRes.blob();
          }

          // Method 2: Try signed URL (works with anon key on private buckets with SELECT policy)
          if (!blob || blob.size === 0) {
            const signRes = await fetch(
              `${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${encodeURIComponent(filename)}`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${SUPABASE_KEY}`,
                  'apikey': SUPABASE_KEY,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expiresIn: 300 })
              }
            );
            if (signRes.ok) {
              const signData = await signRes.json();
              const signedURL = signData.signedURL || signData.signedUrl;
              if (signedURL) {
                const dlRes = await fetch(
                  signedURL.startsWith('http') ? signedURL : `${SUPABASE_URL}${signedURL}`
                );
                if (dlRes.ok) blob = await dlRes.blob();
              }
            }
          }

          if (blob && blob.size > 0) {
            newSlots[slotKey] = {
              file: new File([blob], filename, { type: 'audio/wav' }),
              filename,
              url: URL.createObjectURL(blob),
              size: blob.size
            };
          }
        } catch (dlErr) {
          console.warn(`Failed to download ${filename}:`, dlErr);
        }
      }

      if (Object.keys(newSlots).length === 0) {
        throw new Error('Could not download any recordings. Check Supabase bucket permissions (make bucket public or enable RLS).');
      }

      setSlotFiles(newSlots);
      setCloudLoadStatus('');

    } catch (err) {
      setErrorMessage(err.message || 'Failed to load recordings from Supabase cloud.');
      setCloudLoadStatus('');
    } finally {
      setIsLoadingCloud(false);
    }
  };

  // Reset all 8 slots
  const handleReset = () => {
    setSlotFiles({});
    setPatientName('Alex Morgan');
    setAge(38);
    setGender('M');
    setSmoker(0);
    setLives('U');
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Clear single precordial slot
  const handleClearSlot = (slotKey) => {
    setSlotFiles((prev) => {
      const updated = { ...prev };
      delete updated[slotKey];
      return updated;
    });
  };

  const loadedCount = Object.keys(slotFiles).length;

  // Run RosaNet Multi-Site Evaluation
  const handleExecuteAnalysis = async () => {
    if (loadedCount === 0) {
      setErrorMessage("Please upload your heart sound WAV files to the precordial grid first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('patient_name', (patientName || '').trim() || 'Alex Morgan');
      formData.append('age', age || 35);
      formData.append('age_bracket', getAgeBracket(age));
      formData.append('gender', gender);
      formData.append('smoker', smoker);
      formData.append('lives', lives);

      // Append all uploaded files
      Object.entries(slotFiles).forEach(([key, item]) => {
        if (item.file) {
          formData.append('files', item.file, `${key}_${item.filename}`);
        }
      });

      const res = await fetch('http://127.0.0.1:8000/api/predict-patient-8', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Patient multi-site analysis failed");
      }

      const data = await res.json();
      setAnalysisResult(data);
      if (data.peak_auscultation_site) {
        const pKey = `${data.peak_auscultation_site.valve_site}_${data.peak_auscultation_site.posture}`;
        setActiveInspectSlot(pKey);
      }

      // Navigate to Diagnosis Page!
      setCurrentPage('diagnosis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn("Analysis error:", err);
      setErrorMessage(err.message || "Failed to process 8-recording patient auscultations.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Currently active slot info for the Big Waveform viewer
  const activeSlotObj = standardSlots.find(s => s.key === activeInspectSlot) || standardSlots[0];
  const activeBreakdownItem = analysisResult?.site_breakdown?.find(s => s.slot_key === activeInspectSlot) || analysisResult?.site_breakdown?.[0];

  return (
    <div className="w-full flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">

      {/* ========================================================================= */}
      {/* PAGE 1: AUSCULTATION INGESTION & PATIENT METADATA                         */}
      {/* ========================================================================= */}
      {currentPage === 'ingest' && (
        <div className="flex flex-col gap-8 animate-fadeIn">
          {/* Studio Header */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-soft-clay border border-[#E8EAEF] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3.5 py-1 rounded-full bg-[#18181B] text-white text-xs font-bold uppercase tracking-wider">
                  Diagnostic Studio
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FCE7E6] text-[#CF3B32] text-xs font-bold border border-[#F9D1CF]">
                  Page 1 of 2: Ingestion & Demographics
                </span>
                <span className="text-xs text-slate-400 font-medium">8 Precordial Ingestion Matrix</span>
              </div>

              <h2 className="text-3xl font-extrabold text-[#18181B] tracking-tight">
                Full Patient Auscultation Suite (8 Waveforms)
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed font-medium">
                Clinical phonocardiography protocol: Ingest all <strong>8 precordial recordings</strong> (4 valve sites × 2 postures) to eliminate localized murmur blind spots. RosaNet processes all 8 recordings and executes <strong>Patient-Level Max-Pooling</strong> to prevent silent valve dilution.
              </p>
            </div>

            {/* Counter Badge */}
            <div className="flex items-center gap-3 bg-[#FAFBFD] p-4 rounded-2xl border border-slate-200 flex-shrink-0 self-start md:self-auto">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7E6] text-[#CF3B32] flex items-center justify-center font-extrabold text-sm shadow-sm">
                {loadedCount}/8
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Precordial Channels</span>
                <span className="text-xs font-bold text-slate-800">
                  {loadedCount === 8 ? "All 8 Sites Loaded" : `${8 - loadedCount} Channels Pending`}
                </span>
              </div>
            </div>
          </div>

          {/* If an analysis result is already calculated, show a quick jump banner */}
          {analysisResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    Patient-Level Diagnosis Report is Ready: {analysisResult.primary_diagnosis}
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Switch to Stages 1-3 (Diagnosis & Waveforms) or Stage 4 (Clinical Decision Support RAG).
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setCurrentPage('diagnosis');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#18181B] hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Stages 1-3 (Diagnosis)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#EC7A72]" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('rag');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#CF3B32] hover:bg-[#B52F26] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Stage 4 (Decision Support RAG)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Precordial Auscultation Slots Matrix (Upload WAV Files Directly Here) */}
          <div className="bg-white rounded-[32px] p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#3480D9]" />
                  <span>Step 1: Precordial Auscultation Grid (4 Valve Sites × 2 Postures)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload heart sound WAV recordings directly into each precordial position below, or upload all 8 at once.
                </p>
              </div>

              {/* Action buttons right in the grid header */}
              <div className="flex items-center gap-2.5 flex-wrap">

                {/* ☁️ NEW: Load from Supabase Cloud (Arduino Recordings) */}
                <button
                  type="button"
                  onClick={handleLoadFromCloud}
                  disabled={isLoadingCloud}
                  className="bg-gradient-to-r from-[#3480D9] to-[#5B9FE8] hover:from-[#2a6bc7] hover:to-[#4a8fd6] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Fetch your real Arduino heart sound recordings from Supabase cloud storage"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>{isLoadingCloud ? (cloudLoadStatus || 'Loading...') : 'Load Our Recordings ☁️'}</span>
                </button>

                <label className="bg-[#18181B] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105">
                  <Upload className="w-3.5 h-3.5 text-[#EC7A72]" />
                  <span>Upload All 8 Together</span>
                  <input
                    type="file"
                    multiple
                    accept=".wav,audio/wav"
                    onChange={handleBatchUpload}
                    className="hidden"
                  />
                </label>

                {loadedCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    title="Clear all recordings"
                  >
                    Reset All
                  </button>
                )}
              </div>
            </div>

            {/* 8-Grid Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {standardSlots.map((slot) => {
                const fileData = slotFiles[slot.key];
                const isLoaded = Boolean(fileData);

                return (
                  <div
                    key={slot.key}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${isLoaded
                        ? 'bg-[#FAFBFD] border-slate-300 shadow-soft-clay-sm'
                        : 'bg-white border-dashed border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="px-2.5 py-1 rounded-lg text-white font-extrabold text-xs shadow-sm"
                          style={{ backgroundColor: slot.color }}
                        >
                          {slot.site} • {slot.posture.toUpperCase()}
                        </span>
                        {isLoaded ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Loaded
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-black/5">
                            Empty
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-[#18181B] leading-tight">
                        {slot.label}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {slot.ics}
                      </span>

                      {/* If loaded, show filename + clear button */}
                      {isLoaded && (
                        <div className="mt-3 p-2 bg-white rounded-xl border border-black/5 flex items-center justify-between gap-1.5 shadow-2xs">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileAudio className="w-3.5 h-3.5 text-[#CF3B32] flex-shrink-0" />
                            <span className="text-[11px] font-mono text-slate-700 truncate font-semibold" title={fileData.filename}>
                              {fileData.filename}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleClearSlot(slot.key)}
                            className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                            title="Remove recording"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Upload action area */}
                    {!isLoaded ? (
                      <label className="mt-3 flex-1 min-h-[96px] border-2 border-dashed border-slate-200 hover:border-[#CF3B32] hover:bg-red-50/20 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-[#FCE7E6] text-slate-500 group-hover:text-[#CF3B32] flex items-center justify-center transition-colors">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 group-hover:text-[#CF3B32]">
                          Upload WAV
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Click to choose file
                        </span>
                        <input
                          type="file"
                          accept=".wav,audio/wav"
                          onChange={(e) => handleSlotUpload(slot.key, e)}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {fileData.url && (
                          <audio src={fileData.url} controls className="h-6 max-w-[125px]" />
                        )}
                        <label className="text-[10px] font-bold text-slate-600 hover:text-black hover:underline cursor-pointer flex-shrink-0">
                          <span>Replace</span>
                          <input
                            type="file"
                            accept=".wav,audio/wav"
                            onChange={(e) => handleSlotUpload(slot.key, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Demographic Metadata Form & Big Execute Button */}
          <div className="bg-white rounded-[32px] p-8 shadow-soft-clay border border-[#E8EAEF] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#E28C22]" />
                  <span>Step 2: Patient Demographic Parameters</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Injected into the 10-D RosaNet Metadata MLP late fusion layer.
                </p>
              </div>

              {/* Patient Full Name Input */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#CF3B32]" />
                    <span>Patient Full Name</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Included on Doctor & Patient Reports</span>
                </div>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient full name (e.g. Alex Morgan)"
                  className="w-full bg-white px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF3B32] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Direct Patient Age with Live Epoch Badge */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">Patient Age</label>
                    <span className="text-[10px] font-mono font-bold text-[#8B5CF6] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                      {getAgeBracket(age)} yrs
                    </span>
                  </div>
                  <div className="flex items-center bg-[#FAFBFD] border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#CF3B32] focus-within:border-transparent">
                    <button
                      type="button"
                      onClick={() => setAge((prev) => Math.max(10, Number(prev || 35) - 1))}
                      className="px-2.5 py-2 hover:bg-slate-200 text-slate-600 font-black text-sm select-none transition-colors border-r border-slate-200"
                      title="Decrease age"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="10"
                      max="95"
                      value={age}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setAge('');
                        } else {
                          const num = Math.min(95, Math.max(10, parseInt(val, 10) || 10));
                          setAge(num);
                        }
                      }}
                      onBlur={() => {
                        if (age === '' || Number(age) < 10) setAge(10);
                        else if (Number(age) > 95) setAge(95);
                      }}
                      className="w-full bg-transparent px-2 py-2 font-black text-slate-800 text-center text-xs focus:outline-none"
                      placeholder="e.g. 54"
                    />
                    <span className="text-[11px] font-bold text-slate-400 pr-2 select-none">yrs</span>
                    <button
                      type="button"
                      onClick={() => setAge((prev) => Math.min(95, Number(prev || 35) + 1))}
                      className="px-2.5 py-2 hover:bg-slate-200 text-slate-600 font-black text-sm select-none transition-colors border-l border-slate-200"
                      title="Increase age"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <div className="grid grid-cols-2 gap-1 bg-[#FAFBFD] p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setGender('M')}
                      className={`py-1 rounded-lg font-bold text-center ${gender === 'M' ? 'bg-[#18181B] text-white' : 'text-slate-600'}`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('F')}
                      className={`py-1 rounded-lg font-bold text-center ${gender === 'F' ? 'bg-[#18181B] text-white' : 'text-slate-600'}`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Smoker */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Smoker Status</label>
                  <div className="grid grid-cols-2 gap-1 bg-[#FAFBFD] p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSmoker(0)}
                      className={`py-1 rounded-lg font-bold text-center ${smoker === 0 ? 'bg-[#18181B] text-white' : 'text-slate-600'}`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setSmoker(1)}
                      className={`py-1 rounded-lg font-bold text-center ${smoker === 1 ? 'bg-[#18181B] text-white' : 'text-slate-600'}`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {/* Living Area */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Living Area</label>
                  <div className="grid grid-cols-2 gap-1 bg-[#FAFBFD] p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setLives('U')}
                      className={`py-1 rounded-lg font-bold text-center ${lives === 'U' ? 'bg-[#18181B] text-white' : 'text-slate-600'}`}
                    >
                      Urban
                    </button>
                    <button
                      type="button"
                      onClick={() => setLives('R')}
                      className={`py-1 rounded-lg font-bold text-center ${lives === 'R' ? 'bg-[#18181B] text-white' : 'text-slate-600'}`}
                    >
                      Rural
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <button
                onClick={handleExecuteAnalysis}
                disabled={isAnalyzing || loadedCount === 0}
                className={`w-full py-5 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1.5 transition-all shadow-md ${isAnalyzing || loadedCount === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#CF3B32] hover:bg-[#B52F26] text-white hover:scale-[1.02] shadow-[#CF3B32]/30'
                  }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating 8 Sites with Max-Pooling...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Run RosaNet 8-Site Patient Analysis</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-normal opacity-80">
                      Multi-Site Max-Pooling $\to$ Patient-Level Diagnosis
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-[#FCE7E6] text-[#CF3B32] p-4 rounded-2xl border border-[#F9D1CF] flex items-center gap-3 text-xs font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}


      {/* ========================================================================= */}
      {/* PAGE 2: CLINICAL NARRATIVE FLOW (DISEASE -> RISK -> HEARTBEATS)          */}
      {/* ========================================================================= */}
      {currentPage === 'diagnosis' && analysisResult && (
        <div className="flex flex-col gap-8 animate-fadeIn">

          {/* Top Page Navigation Bar & Clinical Flow Stepper */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <button
              onClick={() => {
                setCurrentPage('ingest');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#18181B] hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-102 self-start lg:self-auto"
            >
              <ArrowLeft className="w-4 h-4 text-[#EC7A72]" />
              <span>← Back to Auscultation Ingestion (8 Slots)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentPage('rag');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer self-start lg:self-auto"
              title="Proceed to Patient & Doctor Consultation Reports"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Consultation Reports (Patient & Doctor Views) →</span>
            </button>

            <button
              onClick={() => {
                handleReset();
                setCurrentPage('ingest');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 self-start lg:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Patient Scan</span>
            </button>
          </div>

          {/* =================================================================== */}
          {/* PATIENT DEMOGRAPHICS & CLINICAL CASE RECORD (STARTING ONLY)          */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#CF3B32] flex items-center justify-center font-black">
                  <User className="w-5 h-5 text-[#CF3B32]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cardiology Patient Intake Record
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {patientName || analysisResult.patient_name || 'Alex Morgan'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{analysisResult.recordings_evaluated || 8}/8 Precordial Sites Analyzed</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAFBFD] p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age & Bracket</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{age} yrs ({getAgeBracket(age)})</span>
              </div>
              <div className="bg-[#FAFBFD] p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biological Gender</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{gender === 'F' ? 'Female' : 'Male'}</span>
              </div>
              <div className="bg-[#FAFBFD] p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Smoking Status</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{smoker === 1 ? 'Active Smoker' : 'Non-smoker'}</span>
              </div>
              <div className="bg-[#FAFBFD] p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Living Setting</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{lives === 'R' ? 'Rural Setting' : 'Urban Setting'}</span>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* STAGE 1: VALVULAR HEART DISEASE MULTI-TARGET DIAGNOSIS               */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6 animate-fadeIn">

            {/* Stage 1 Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#CF3B32] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  01
                </span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Stage 1 • Etiological Classification
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    Valvular Heart Disease Multi-Target Diagnosis
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                <Activity className="w-3.5 h-3.5 text-[#CF3B32]" />
                <span>{analysisResult.recordings_evaluated || 8} Precordial Auscultations Max-Pooled</span>
              </div>
            </div>

            {/* Stage 1 Hero Diagnosis Banner */}
            <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#FAFBFD] via-[#FAFBFD] to-white border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xs">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    Primary Cardiac Diagnosis
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">
                    {analysisResult.severity || 'Pathological Finding'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {analysisResult.status || 'Abnormal Hemodynamics'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#18181B] tracking-tight">
                  {analysisResult.primary_diagnosis}
                </h2>

                <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed">
                  Synthesized through acoustic multi-site pooling across 8 recording points on the anterior chest wall (Aortic, Pulmonic, Tricuspid, and Mitral landmarks).
                </p>
              </div>

              {/* Peak Acoustic Window Interactive Pill */}
              {analysisResult.peak_auscultation_site && (
                <div
                  onMouseEnter={() => {
                    const pKey = `${analysisResult.peak_auscultation_site.valve_site}_${analysisResult.peak_auscultation_site.posture}`;
                    startHoverListening(pKey);
                  }}
                  onMouseLeave={stopHoverListening}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 flex-shrink-0 ${isHoverListening
                      ? 'bg-[#FCE7E6] border-[#F9D1CF] shadow-md scale-102 ring-2 ring-[#CF3B32]'
                      : 'bg-white hover:border-slate-300 border-slate-200 shadow-sm hover:shadow-soft-clay-sm'
                    }`}
                  title="Hover over this cardiac window to listen to the peak murmur"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FCE7E6] text-[#CF3B32] flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0 relative">
                    <Heart className={`w-6 h-6 text-[#CF3B32] ${isHoverListening ? 'animate-ping' : ''}`} />
                    <span className="absolute text-[10px] font-black">{analysisResult.peak_auscultation_site.valve_site}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span>Peak Acoustic Window</span>
                      {isHoverListening && <Volume2 className="w-3.5 h-3.5 text-[#CF3B32] animate-pulse" />}
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {analysisResult.peak_auscultation_site.slot_label}
                    </span>
                    <span className="text-xs text-[#CF3B32] font-black">
                      {(analysisResult.peak_auscultation_site.probability * 100).toFixed(1)}% {analysisResult.peak_auscultation_site.target} Murmur
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                      Hover to listen to murmur
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Multilabel Probabilities (5-Target Distribution) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Patient-Level Multilabel Probabilities (Max-Pooled Posterior Estimates)
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Aortic, Mitral, Pulmonic & Normal classes
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {Object.entries(analysisResult.patient_probabilities).map(([code, prob]) => {
                  const percent = (prob * 100).toFixed(1);
                  const isNormal = code === 'Normal';
                  const isHighlight = prob >= 0.5;

                  const targetLabels = {
                    AS: 'Aortic Stenosis',
                    AR: 'Aortic Regurgitation',
                    MR: 'Mitral Regurgitation',
                    MS: 'Mitral Stenosis',
                    Normal: 'Physiological Normal'
                  };

                  return (
                    <div
                      key={code}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${isHighlight && !isNormal
                          ? 'bg-[#FCE7E6] border-[#F9D1CF] text-[#CF3B32] shadow-2xs ring-1 ring-[#CF3B32]'
                          : isNormal && isHighlight
                            ? 'bg-[#DBEAFA] border-[#BDDBF7] text-[#2A7FD9] shadow-2xs ring-1 ring-[#2A7FD9]'
                            : 'bg-[#FAFBFD] border-slate-200 text-slate-700'
                        }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-black">{code}</span>
                          <span className="text-xs font-bold font-mono">{percent}%</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block truncate">
                          {targetLabels[code] || code}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${!isNormal ? 'bg-[#CF3B32]' : 'bg-[#2A7FD9]'
                            }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* STAGE 2: PATIENT-SPECIFIC RISK STRATIFICATION MODULE                 */}
          {/* =================================================================== */}
          <PatientRiskStratification
            riskStratification={analysisResult.risk_stratification}
            demographics={{
              patientName: patientName || analysisResult.patient_name || 'Alex Morgan',
              age,
              ageBracket: getAgeBracket(age),
              gender,
              smoker,
              lives
            }}
            primaryDiagnosis={analysisResult.primary_diagnosis}
            patientProbabilities={analysisResult.patient_probabilities}
          />

          {/* =================================================================== */}
          {/* STAGE 3: PRECORDIAL HEARTBEAT MONITOR & AUSCULTATION STUDIO         */}
          {/* =================================================================== */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6 animate-fadeIn">

            {/* Stage 3 Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#0284C7] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  03
                </span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Stage 3 • Acoustic Phonocardiography
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    Precordial Heartbeat Waveforms & Stethoscope Studio
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                <Volume2 className={`w-3.5 h-3.5 ${isHoverListening ? 'text-[#CF3B32] animate-bounce' : 'text-slate-400'}`} />
                <span className="font-semibold">Hover over graph to listen</span>
              </div>
            </div>

            {/* 8-Channel Precordial Switcher Tabs */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Precordial Channel for High-Resolution PCG Inspection
                </span>
                <span className="text-xs text-slate-400 font-medium hidden md:inline">
                  Click any channel to display its waveform on the big monitor below
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {standardSlots.map((slot) => {
                  const isSelected = activeInspectSlot === slot.key;
                  const itemData = analysisResult.site_breakdown.find(s => s.slot_key === slot.key);
                  const maxProb = itemData ? Math.max(...Object.values(itemData.probabilities)) : 0;
                  const targetName = itemData ? Object.entries(itemData.probabilities).sort((a, b) => b[1] - a[1])[0][0] : '';

                  return (
                    <button
                      key={slot.key}
                      onClick={() => setActiveInspectSlot(slot.key)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${isSelected
                          ? 'bg-[#18181B] text-white border-[#18181B] shadow-md scale-102 ring-2 ring-[#CF3B32]'
                          : 'bg-[#FAFBFD] hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: slot.color }}
                        />
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                          {slot.posture}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold truncate block">
                        {slot.site}
                      </span>
                      <span className={`text-[10px] mt-1 block font-mono ${maxProb >= 0.5 ? 'text-[#EC7A72] font-bold' : isSelected ? 'text-slate-300' : 'text-slate-400'
                        }`}>
                        {(maxProb * 100).toFixed(0)}% {targetName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Big High-Definition Waveform Viewer (Embedded in Stage 3) */}
            {(() => {
              const isNormalPatient = Boolean(
                analysisResult?.primary_diagnosis && (
                  /normal|physiolog|healthy|benign/i.test(analysisResult.primary_diagnosis) ||
                  (analysisResult.patient_probabilities?.Normal > 0.5)
                )
              );
              const slotMaxProb = activeBreakdownItem ? Math.max(...Object.values(activeBreakdownItem.probabilities)) : 0;
              const slotIsNormal = isNormalPatient || (slotMaxProb < 0.35);
              const slotTarget = slotIsNormal 
                ? 'Normal' 
                : (activeBreakdownItem ? Object.entries(activeBreakdownItem.probabilities).sort((a, b) => b[1] - a[1])[0][0] : 'Normal');
              const displayProb = slotIsNormal 
                ? (analysisResult.patient_probabilities?.Normal || 0.976) 
                : slotMaxProb;

              return (
                <BigWaveformViewer
                  title={activeSlotObj.label}
                  valveSite={activeSlotObj.site}
                  posture={activeSlotObj.posture}
                  ics={activeSlotObj.ics}
                  signalData={activeBreakdownItem?.waveform || []}
                  dominantTarget={slotTarget}
                  dominantProb={displayProb}
                  isNormal={slotIsNormal}
                  isHoverListening={isHoverListening}
                  onHoverStart={() => startHoverListening(activeInspectSlot)}
                  onHoverEnd={stopHoverListening}
                  badgeColor={activeSlotObj.color}
                  embedded={true}
                />
              );
            })()}

            {/* Site-by-Site Auscultation Breakdown Table */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Site-by-Site Acoustic Breakdown (All 8 Auscultations)
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Click any recording below to display its 4,000 Hz waveform on the high-resolution monitor above.
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-[#FAFBFD] border-b border-slate-200">
                    <tr className="text-slate-500 font-semibold text-left">
                      <th className="py-3 px-4">Recording Site</th>
                      <th className="py-3 px-4">Posture</th>
                      <th className="py-3 px-4 text-right">P(AS)</th>
                      <th className="py-3 px-4 text-right">P(AR)</th>
                      <th className="py-3 px-4 text-right">P(MR)</th>
                      <th className="py-3 px-4 text-right">P(MS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium bg-white">
                    {analysisResult.site_breakdown.map((item) => {
                      const isSelected = activeInspectSlot === item.slot_key;

                      return (
                        <tr
                          key={item.slot_key}
                          onClick={() => setActiveInspectSlot(item.slot_key)}
                          className={`cursor-pointer transition-colors ${isSelected
                              ? 'bg-rose-50/70 font-bold'
                              : 'hover:bg-slate-50'
                            }`}
                        >
                          <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#CF3B32]' : 'bg-[#18181B]'}`} />
                            <span>{item.label}</span>
                          </td>
                          <td className="py-3 px-4 uppercase text-slate-500 font-mono">
                            {item.posture}
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${item.probabilities.AS >= 0.5 ? 'text-[#CF3B32] font-black' : 'text-slate-600'}`}>
                            {(item.probabilities.AS * 100).toFixed(1)}%
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${item.probabilities.AR >= 0.5 ? 'text-[#CF3B32] font-black' : 'text-slate-600'}`}>
                            {(item.probabilities.AR * 100).toFixed(1)}%
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${item.probabilities.MR >= 0.5 ? 'text-[#CF3B32] font-black' : 'text-slate-600'}`}>
                            {(item.probabilities.MR * 100).toFixed(1)}%
                          </td>
                          <td className={`py-3 px-4 text-right font-mono ${item.probabilities.MS >= 0.5 ? 'text-[#CF3B32] font-black' : 'text-slate-600'}`}>
                            {(item.probabilities.MS * 100).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* =================================================================== */}
          {/* DIRECTING ARROW: PROCEED TO STAGE 4 (CLINICAL DECISION SUPPORT RAG) */}
          {/* =================================================================== */}
          <div className="bg-gradient-to-r from-[#18181B] via-[#242428] to-[#18181B] text-white rounded-[28px] p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
            {/* Ambient glows */}
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#CF3B32]/25 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#3480D9]/25 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0 border border-white/20 relative">
                <ShieldCheck className="w-7 h-7 text-[#EC7A72]" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#CF3B32] text-white text-[9px] font-black flex items-center justify-center border-2 border-[#18181B]">
                  04
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                    Stage 4 of 4 • Next Page
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Stages 1, 2 & 3 Auscultations Evaluated
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Clinical Decision Support System (CDSS • RAG)</span>
                </h3>

                <p className="text-xs text-slate-300 font-normal mt-1 max-w-2xl leading-relaxed">
                  Proceed to the next page to review the formal cardiology consultation dossier synthesized from <strong>2020 ACC/AHA Valvular Heart Disease Guidelines</strong>, differential considerations, hemodynamic staging, and guideline-directed workup protocol.
                </p>
              </div>
            </div>

            {/* Directing Arrow Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('rag');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#CF3B32] hover:bg-[#B52F26] text-white px-6 py-4 rounded-2xl text-xs font-black transition-all shadow-lg shadow-[#CF3B32]/30 flex items-center justify-center gap-3 cursor-pointer hover:scale-105 active:scale-95 group/btn"
              >
                <span>Proceed to Clinical Decision Support (RAG)</span>
                <ArrowRight className="w-4 h-4 text-white transform transition-transform group-hover/btn:translate-x-1.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: CLINICAL DECISION SUPPORT SYSTEM (RAG CARDIOLOGY REPORT)         */}
      {/* ========================================================================= */}
      {currentPage === 'rag' && analysisResult && (
        <div className="flex flex-col gap-8 animate-fadeIn">

          {/* Top Page Navigation Bar & Stepper (Hidden in Print) */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
            <button
              onClick={() => {
                setCurrentPage('diagnosis');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#18181B] hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-102 self-start lg:self-auto"
            >
              <ArrowLeft className="w-4 h-4 text-[#EC7A72]" />
              <span>← Back to Stages 1, 2 & 3 (Diagnosis & Waveforms)</span>
            </button>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                Cardiology Consultation Dossier
              </span>
            </div>

            <button
              onClick={() => {
                handleReset();
                setCurrentPage('ingest');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 self-start lg:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Patient Scan</span>
            </button>
          </div>

          {/* RAG Clinical Consultation Report (Doctor View & Patient View) */}
          <ClinicalConsultationReport
            report={analysisResult.clinical_report}
            doctorReport={analysisResult.doctor_report || analysisResult.clinical_report}
            patientReport={analysisResult.patient_report}
            primaryDiagnosis={analysisResult.primary_diagnosis}
            patientMetadata={{
              patient_name: patientName || analysisResult.patient_name || 'Alex Morgan',
              patient_id: patientName || analysisResult.patient_name || 'Alex Morgan',
              age,
              gender,
              smoker,
              lives,
              valve_site: analysisResult.peak_auscultation_site?.valve_site || 'Aor',
              posture: analysisResult.peak_auscultation_site?.posture || 'sit',
            }}
            probabilities={analysisResult.patient_probabilities}
            peakSite={analysisResult.peak_auscultation_site}
            severity={analysisResult.severity}
            riskStratification={analysisResult.risk_stratification}
            onListenMurmur={() => {
              const pKey = analysisResult.peak_auscultation_site
                ? `${analysisResult.peak_auscultation_site.valve_site}_${analysisResult.peak_auscultation_site.posture}`
                : activeInspectSlot;
              if (isHoverListening) {
                stopHoverListening();
              } else {
                startHoverListening(pKey);
              }
            }}
            isHoverListening={isHoverListening}
            onNavigateBack={() => {
              setCurrentPage('diagnosis');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReset={() => {
              handleReset();
              setCurrentPage('ingest');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

        </div>
      )}
    </div>
  );
}
