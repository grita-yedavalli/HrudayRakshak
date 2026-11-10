import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  HeartPulse, 
  Flame, 
  MapPin, 
  Calendar, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';

export default function PatientRiskStratification({ 
  riskStratification, 
  demographics = {}, 
  primaryDiagnosis = '',
  patientProbabilities = {}
}) {
  // Fallback defaults if riskStratification object is missing
  const strat = riskStratification || {
    composite_score: 15.0,
    tier: "Tier 1: Low Risk",
    tier_level: 1,
    tier_color: "#16A34A",
    tier_bg: "#DCFCE7",
    urgency: "Routine Outpatient Follow-up",
    clinical_action: "Routine annual auscultation and clinical review; no immediate echocardiography needed.",
    breakdown: {
      acoustic_burden: { score: 10.0, max: 55.0, label: "Acoustic Murmur Severity", detail: "Low murmur probability" },
      age_vulnerability: { score: 5.0, max: 20.0, label: "Age Vulnerability", detail: "Low degenerative baseline" },
      lifestyle_comorbidity: { score: 0.0, max: 15.0, label: "Smoking / Vascular Stress", detail: "Non-smoker" },
      healthcare_latency: { score: 2.0, max: 10.0, label: "Care Access Latency", detail: "Urban setting" }
    }
  };

  const {
    composite_score = 0,
    urgency = '',
    clinical_action = '',
    breakdown = {}
  } = strat;

  // 100% mathematically deterministic score parsing
  const score = Math.round(Number(composite_score) || 0);

  // Derive tier index from composite_score directly:
  // 0 - 24  => Tier 1: Low Risk (Green)
  // 25 - 49 => Tier 2: Moderate Risk (Amber)
  // 50 - 74 => Tier 3: High Risk (Orange)
  // 75 - 100 => Tier 4: Critical Risk (Red)
  const computedTierLevel = score >= 75 ? 4 : score >= 50 ? 3 : score >= 25 ? 2 : 1;

  // Tier configuration metadata
  const tierConfigs = {
    1: {
      title: 'Tier 1: Low Risk',
      subtitle: 'Minimal Cardiovascular Risk',
      color: '#16A34A',
      bgColor: '#DCFCE7',
      borderColor: '#86EFAC',
      textColor: '#14532D',
      icon: ShieldCheck,
      range: '0 – 24 pts'
    },
    2: {
      title: 'Tier 2: Moderate Risk',
      subtitle: 'Borderline Murmur or Moderate Comorbidity',
      color: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      textColor: '#78350F',
      icon: Info,
      range: '25 – 49 pts'
    },
    3: {
      title: 'Tier 3: High Risk',
      subtitle: 'Confirmed Pathological Murmur or Synergistic Stress',
      color: '#EA580C',
      bgColor: '#FFEDD5',
      borderColor: '#FDBA74',
      textColor: '#7C2D12',
      icon: AlertTriangle,
      range: '50 – 74 pts'
    },
    4: {
      title: 'Tier 4: Critical Risk',
      subtitle: 'Severe Valvular Pathology with High Vulnerability',
      color: '#DC2626',
      bgColor: '#FEE2E2',
      borderColor: '#FCA5A5',
      textColor: '#7F1D1D',
      icon: ShieldAlert,
      range: '75 – 100 pts'
    }
  };

  // Support both integer (1, 2, 3, 4) and string names ('Low', 'Moderate', 'High', 'Critical')
  tierConfigs['Low'] = tierConfigs[1];
  tierConfigs['Moderate'] = tierConfigs[2];
  tierConfigs['High'] = tierConfigs[3];
  tierConfigs['Critical'] = tierConfigs[4];

  // Active configuration guaranteed to match score
  const activeTierConfig = tierConfigs[computedTierLevel] || tierConfigs[strat.tier_level] || tierConfigs[1];
  const TierIcon = activeTierConfig.icon;

  // 4 Risk Factor Decomposition Items
  const factorList = [
    {
      key: 'acoustic_burden',
      title: breakdown.acoustic_burden?.label || 'Acoustic Murmur Severity',
      score: breakdown.acoustic_burden?.score ?? 0,
      max: breakdown.acoustic_burden?.max ?? 55,
      detail: breakdown.acoustic_burden?.detail || 'Precordial acoustic turbulence',
      color: '#CF3B32',
      bgColor: '#FCE7E6',
      icon: HeartPulse
    },
    {
      key: 'age_vulnerability',
      title: breakdown.age_vulnerability?.label || 'Age Vulnerability',
      score: breakdown.age_vulnerability?.score ?? 0,
      max: breakdown.age_vulnerability?.max ?? 20,
      detail: breakdown.age_vulnerability?.detail || (demographics.age ? `${demographics.age} yrs (${demographics.ageBracket} epoch)` : `Bracket: ${demographics.ageBracket || '30-39'} yrs`),
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      icon: Calendar
    },
    {
      key: 'lifestyle_comorbidity',
      title: breakdown.lifestyle_comorbidity?.label || 'Smoking / Vascular Stress',
      score: breakdown.lifestyle_comorbidity?.score ?? 0,
      max: breakdown.lifestyle_comorbidity?.max ?? 15,
      detail: breakdown.lifestyle_comorbidity?.detail || (demographics.smoker === 1 ? 'Active Smoker (+15)' : 'Non-Smoker (0)'),
      color: '#E28C22',
      bgColor: '#FEF3C7',
      icon: Flame
    },
    {
      key: 'healthcare_latency',
      title: breakdown.healthcare_latency?.label || 'Care Access Latency',
      score: breakdown.healthcare_latency?.score ?? 0,
      max: breakdown.healthcare_latency?.max ?? 10,
      detail: breakdown.healthcare_latency?.detail || (demographics.lives === 'R' ? 'Rural Setting (+10)' : 'Urban Setting (+2)'),
      color: '#0D9488',
      bgColor: '#CCFBF1',
      icon: MapPin
    }
  ];

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6 animate-fadeIn">
      
      {/* Stage 2 Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-[#E28C22] text-white flex items-center justify-center text-xs font-black shadow-2xs">
            02
          </span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Stage 2 • Prognostic Urgency
            </span>
            <h3 className="text-sm font-extrabold text-slate-800">
              Patient-Specific Cardiovascular Risk Stratification
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-[#E28C22]" />
          <span>Multimodal 4-Tier Clinical Triage</span>
        </div>
      </div>

      {/* Main Top Banner: Composite Score Gauge & Tier Card */}
      <div 
        className="rounded-2xl p-5 sm:p-6 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden"
        style={{ 
          backgroundColor: activeTierConfig.bgColor,
          borderColor: activeTierConfig.borderColor
        }}
      >
        {/* Left: Score & Tier Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Big Score Circular Display */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-soft-clay flex flex-col items-center justify-center border border-black/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Risk Score
              </span>
              <div className="flex items-baseline gap-0.5">
                <span 
                  className="text-3xl sm:text-4xl font-black tracking-tight"
                  style={{ color: activeTierConfig.color }}
                >
                  {score}
                </span>
                <span className="text-xs font-bold text-slate-400">/100</span>
              </div>
              <span 
                className="text-[9px] font-extrabold px-2 py-0.5 rounded-full mt-0.5 uppercase"
                style={{ backgroundColor: activeTierConfig.bgColor, color: activeTierConfig.color }}
              >
                {activeTierConfig.range}
              </span>
            </div>
          </div>

          {/* Tier Label & Title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span 
                className="px-3 py-0.5 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 shadow-sm"
                style={{ backgroundColor: activeTierConfig.color }}
              >
                <TierIcon className="w-3.5 h-3.5" />
                <span>{activeTierConfig.title}</span>
              </span>
              <span className="text-xs font-bold text-slate-600">
                Level {computedTierLevel} of 4
              </span>
            </div>

            <h4 
              className="text-lg sm:text-xl font-black tracking-tight"
              style={{ color: activeTierConfig.textColor }}
            >
              {activeTierConfig.subtitle}
            </h4>

            <p className="text-xs font-medium text-slate-700 max-w-xl leading-relaxed">
              Synthesized from primary acoustic findings ({primaryDiagnosis || 'Cardiac Auscultation'}) combined with patient-specific cardiovascular stress markers.
            </p>
          </div>
        </div>

        {/* Right: Urgency Window & Recommended Directives Box */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-black/10 flex flex-col gap-2.5 min-w-[260px] lg:max-w-md shadow-2xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: activeTierConfig.color }} />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Clinical Urgency Window
            </span>
          </div>
          
          <div 
            className="text-xs sm:text-sm font-extrabold"
            style={{ color: activeTierConfig.textColor }}
          >
            {urgency || activeTierConfig.subtitle}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Recommended Clinical Directive
            </span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {clinical_action}
            </p>
          </div>
        </div>
      </div>

      {/* 4-Tier Continuous Risk Spectrum Bar with Animated Needle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span className="uppercase tracking-wider">Stratification Spectrum (0–100)</span>
          <span className="font-mono text-slate-700">Patient Score: {score} / 100</span>
        </div>

        {/* Spectrum Track */}
        <div className="relative pt-6 pb-2">
          {/* Needle Pointer */}
          <div 
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-out z-10"
            style={{ left: `${Math.min(98, Math.max(2, score))}%` }}
          >
            <div 
              className="px-2 py-0.5 rounded text-[10px] font-black text-white shadow-md flex items-center gap-0.5 whitespace-nowrap"
              style={{ backgroundColor: activeTierConfig.color }}
            >
              <span>{score}</span>
            </div>
            <div 
              className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px]"
              style={{ borderTopColor: activeTierConfig.color }}
            />
          </div>

          {/* 4 Colored Segments */}
          <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-1 border border-slate-200">
            {/* Low (0-24) */}
            <div 
              className="h-full rounded-l-full bg-[#16A34A] transition-all flex items-center justify-center relative"
              style={{ width: '25%' }}
              title="Tier 1: Low Risk (0-24)"
            />
            {/* Moderate (25-49) */}
            <div 
              className="h-full bg-[#D97706] transition-all flex items-center justify-center relative"
              style={{ width: '25%' }}
              title="Tier 2: Moderate Risk (25-49)"
            />
            {/* High (50-74) */}
            <div 
              className="h-full bg-[#EA580C] transition-all flex items-center justify-center relative"
              style={{ width: '25%' }}
              title="Tier 3: High Risk (50-74)"
            />
            {/* Critical (75-100) */}
            <div 
              className="h-full rounded-r-full bg-[#DC2626] transition-all flex items-center justify-center relative"
              style={{ width: '25%' }}
              title="Tier 4: Critical Risk (75-100)"
            />
          </div>

          {/* Spectrum Labels */}
          <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-500 mt-2 px-1">
            <div className="text-left text-[#16A34A]">Tier 1: Low (0–24)</div>
            <div className="text-center text-[#D97706]">Tier 2: Moderate (25–49)</div>
            <div className="text-center text-[#EA580C]">Tier 3: High (50–74)</div>
            <div className="text-right text-[#DC2626]">Tier 4: Critical (75–100)</div>
          </div>
        </div>
      </div>

      {/* Factor Breakdown (4-Card Grid) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Factor Contribution Breakdown (Max 100 Points)
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              Transparent clinical weighting combining acoustic severity with epidemiological risk drivers.
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono hidden sm:inline">
            Acoustic (55) + Age (20) + Smoker (15) + Latency (10)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {factorList.map((factor) => {
            const FactorIcon = factor.icon;
            const pct = Math.min(100, Math.round((factor.score / factor.max) * 100));

            return (
              <div 
                key={factor.key}
                className="p-5 rounded-2xl border border-slate-200 bg-[#FAFBFD] hover:bg-white hover:border-slate-300 hover:shadow-soft-clay-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs"
                      style={{ backgroundColor: factor.bgColor, color: factor.color }}
                    >
                      <FactorIcon className="w-5 h-5" />
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 font-mono">
                        {factor.score.toFixed(1)}
                      </span>
                      <span className="text-xs font-bold text-slate-400"> / {factor.max}</span>
                    </div>
                  </div>

                  <h5 className="text-xs font-extrabold text-slate-900 leading-snug">
                    {factor.title}
                  </h5>

                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {factor.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                  <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: factor.color 
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Contribution</span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
