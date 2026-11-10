import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';

export default function MetricsSection({ metricsData }) {
  const [activeTab, setActiveTab] = useState('overview');

  const targets = metricsData?.target_breakdown || [
    {
      code: "AS",
      name: "Aortic Stenosis",
      description: "Systolic ejection murmur at right 2nd intercostal space",
      recall: 0.8579,
      precision: 0.7423,
      f1: 0.7982,
      roc_auc: 0.9348,
      color: "#EC7A72"
    },
    {
      code: "AR",
      name: "Aortic Regurgitation",
      description: "Early blowing diastolic murmur along left sternal border",
      recall: 0.9254,
      precision: 0.5451,
      f1: 0.6818,
      roc_auc: 0.7684,
      color: "#3480D9"
    },
    {
      code: "MR",
      name: "Mitral Regurgitation",
      description: "High-pitched holosystolic murmur radiating to axilla",
      recall: 0.7679,
      precision: 0.5421,
      f1: 0.6202,
      roc_auc: 0.7209,
      color: "#E28C22"
    },
    {
      code: "MS",
      name: "Mitral Stenosis",
      description: "Low-pitched rumbling mid-diastolic murmur with opening snap",
      recall: 0.7214,
      precision: 0.4749,
      f1: 0.5598,
      roc_auc: 0.7262,
      color: "#8B5CF6"
    }
  ];

  const folds = metricsData?.fold_details || [
    { fold: 1, macro_f1: 0.7160, macro_recall: 0.9375, macro_auc: 0.8009, val_loss: 0.5257 },
    { fold: 2, macro_f1: 0.7203, macro_recall: 0.8929, macro_auc: 0.8413, val_loss: 0.5298 },
    { fold: 3, macro_f1: 0.7077, macro_recall: 0.7882, macro_auc: 0.8284, val_loss: 0.5630 },
    { fold: 4, macro_f1: 0.5363, macro_recall: 0.6161, macro_auc: 0.7045, val_loss: 0.6089 },
    { fold: 5, macro_f1: 0.6697, macro_recall: 0.9375, macro_auc: 0.7635, val_loss: 0.5547 }
  ];

  return (
    <section className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Metrics Banner */}
      <div className="bg-white rounded-[28px] p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-[#DBEAFA] text-[#2A7FD9] text-xs font-bold uppercase tracking-wider">
              5-Fold Cross-Validation
            </span>
            <span className="text-xs text-slate-400 font-medium">107 Cohort Patients Evaluated</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#18181B] tracking-tight">
            RosaNet Clinical Performance & Ablations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Strict out-of-fold patient-level evaluation preventing patient data leakage across folds.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F7] rounded-2xl border border-black/5 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-[#18181B] shadow-sm' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Overview & Targets
          </button>
          <button
            onClick={() => setActiveTab('ablation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ablation' 
                ? 'bg-[#18181B] text-white shadow-sm' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            Pooling Ablation (+15.6%)
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-5 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Macro F1 Score</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">+15.57%</span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-[#18181B]">0.670</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">(Peak: 0.720)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Balanced harmonic mean across 4 targets</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Macro Sensitivity</span>
            <span className="text-xs font-bold text-[#CF3B32] bg-[#FCE7E6] px-2.5 py-0.5 rounded-full border border-[#F9D1CF]">83.4% Recall</span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-[#18181B]">0.834</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">(Peak: 0.938)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Critical for minimizing false-negative valve skips</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Macro ROC-AUC</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">Strong Discrim.</span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-[#18181B]">0.788</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">(AS: 0.935)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Area under ROC curve across out-of-fold folds</div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hamming Accuracy</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">0.304 Loss</span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-[#18181B]">69.6%</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">(Multi-label)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Fraction of correct label predictions</div>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Target Disease Breakdown Cards (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#18181B] tracking-tight flex items-center gap-2">
              <span>Pathology Target Performance Breakdown</span>
              <span className="text-xs font-normal text-slate-400">(Multilabel Independent Probabilities)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {targets.map((tgt) => (
                <div 
                  key={tgt.code}
                  className="bg-white rounded-[24px] p-5 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between hover:shadow-soft-clay-hover transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-8 h-8 rounded-xl text-white font-extrabold text-xs flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: tgt.color || '#CF3B32' }}
                        >
                          {tgt.code}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-[#18181B] leading-tight">{tgt.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">Valvular Heart Disease</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#18181B] bg-slate-50 px-2.5 py-1 rounded-xl border border-black/5">
                        F1: {(tgt.f1 * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {tgt.description}
                    </p>
                  </div>

                  {/* Metric Progress Bars */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Recall (Sensitivity)</span>
                        <span className="font-bold text-[#18181B]">{(tgt.recall * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700" 
                          style={{ width: `${tgt.recall * 100}%`, backgroundColor: tgt.color || '#CF3B32' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>ROC-AUC</span>
                        <span className="font-bold text-[#18181B]">{(tgt.roc_auc * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-800 rounded-full transition-all duration-700" 
                          style={{ width: `${tgt.roc_auc * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Fold Stratified Cross-Validation Table (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#18181B] tracking-tight">
                  Stratified Folds
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-black/5">
                  Multilabel K-Fold
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Strict patient-level separation guarantees zero recording leakage between train and validation.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-left">
                      <th className="pb-2">Fold</th>
                      <th className="pb-2 text-right">Macro F1</th>
                      <th className="pb-2 text-right">Recall</th>
                      <th className="pb-2 text-right">AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {folds.map((f) => (
                      <tr key={f.fold} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 font-bold text-slate-800">Fold {f.fold}</td>
                        <td className="py-2.5 text-right font-semibold text-[#CF3B32]">
                          {(f.macro_f1 * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 text-right text-slate-700">
                          {(f.macro_recall * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 text-right text-slate-500">
                          {f.macro_auc.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Out-of-fold predictions verified across 107 patients.</span>
            </div>
          </div>
        </div>
      ) : (
        /* Ablation Deep-Dive Tab: Max-Pooling vs Mean-Pooling */
        <div className="bg-white rounded-[32px] p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#CF3B32] bg-[#FCE7E6] px-3 py-1 rounded-full uppercase tracking-wider">
                Key Architectural Ablation
              </span>
              <h3 className="text-2xl font-extrabold text-[#18181B] tracking-tight mt-2">
                Patient-Level Max-Pooling vs. Mean-Pooling
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Resolving the "Silent Valve Dilution" pathology trap in multi-site cardiac phonocardiography.
              </p>
            </div>

            <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-slate-200 text-center min-w-[160px]">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Macro F1 Gain</span>
              <span className="text-3xl font-extrabold text-[#CF3B32]">+15.57%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Absolute Macro Boost</span>
            </div>
          </div>

          {/* Ablation Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAFBFD] rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Macro F1 Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-[#18181B]">0.6700</span>
                  <span className="text-sm text-slate-400 line-through">0.5143</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                +15.57% Gain with Max-Pooling
              </div>
            </div>

            <div className="bg-[#FAFBFD] rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Macro Sensitivity (Recall)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-[#CF3B32]">0.8343</span>
                  <span className="text-sm text-slate-400 line-through">0.4456</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                +38.87% Gain (Massive Clinical Impact)
              </div>
            </div>

            <div className="bg-[#FAFBFD] rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Micro F1 Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-[#18181B]">0.6629</span>
                  <span className="text-sm text-slate-400 line-through">0.5505</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                +11.24% Gain Across All Predictions
              </div>
            </div>
          </div>

          {/* Clinical Insight Callout Box */}
          <div className="bg-[#F6EFE9] rounded-2xl p-6 border border-[#ECE3D7]/70 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#CF3B32] flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18181B] mb-1">
                Why Does Mean-Pooling Fail in Cardiac Auscultation?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cardiac valvular murmurs are highly localized acoustic phenomena. An Aortic Stenosis (AS) systolic murmur produces powerful high-velocity turbulent jets audible at the right 2nd intercostal space (Aortic valve), but exhibits acoustic silence at the Tricuspid and Mitral apex windows. 
                <br /><br />
                When models compute an <strong>arithmetic mean</strong> across all auscultation sites, the acoustic silence from unaffected valve sites dilutes the high-confidence signal from the diseased valve, collapsing patient recall down to 44.5%. 
                By contrast, <strong>Max-Pooling</strong> preserves the maximal pathological evidence detected at any anatomical valve window, driving clinical sensitivity to <strong>83.4%</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
