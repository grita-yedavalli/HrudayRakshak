import React, { useState } from 'react';
import { Pill, Activity, Calendar, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BottomCards({ activeCondition, onConditionChange }) {
  const [selectedDate, setSelectedDate] = useState('2 Oct');

  const dates = [
    { label: '28', month: 'Sep', id: '28 Sep' },
    { label: '2', month: 'Oct', id: '2 Oct' },
    { label: '14', month: 'Oct', id: '14 Oct' },
    { label: '24', month: 'Oct', id: '24 Oct' },
  ];

  const conditionDetails = {
    AS: {
      med1: { name: 'Aortic Valve Eval', dose: 'Ejection Peak', type: 'pill', bg: 'bg-[#FDF2DE]' },
      med2: { name: 'Afterload Reducer', dose: 'Vasodilator', type: 'circle', bg: 'bg-[#FCE7E6]' },
      dateText: 'Aortic Stenosis systolic murmur marked at right 2nd ICS'
    },
    AR: {
      med1: { name: 'Diastolic Decresc.', dose: 'Left Sternal Border', type: 'pill', bg: 'bg-[#DBEAFA]' },
      med2: { name: 'AR Pulse Pressure', dose: 'Water-hammer eval', type: 'circle', bg: 'bg-[#FDF2DE]' },
      dateText: 'Aortic Regurgitation early blowing diastolic murmur detected'
    },
    MR: {
      med1: { name: 'Holosystolic Murmur', dose: 'Cardiac Apex (Mit)', type: 'pill', bg: 'bg-[#FCE7E6]' },
      med2: { name: 'Axillary Radiation', dose: 'High Frequency', type: 'circle', bg: 'bg-[#DBEAFA]' },
      dateText: 'Mitral Regurgitation pansystolic blowing murmur confirmed'
    },
    MS: {
      med1: { name: 'Mid-Diastolic Rumble', dose: 'Opening Snap', type: 'pill', bg: 'bg-[#FDF2DE]' },
      med2: { name: 'Presystolic Acc.', dose: 'Sinus Rhythm', type: 'circle', bg: 'bg-[#FCE7E6]' },
      dateText: 'Mitral Stenosis low-pitched rumbling murmur with opening snap'
    },
    Normal: {
      med1: { name: 'Clear S1 & S2', dose: 'Lub-Dub Regular', type: 'pill', bg: 'bg-[#DBEAFA]' },
      med2: { name: 'Zero Murmurs', dose: 'Physiological Rhythm', type: 'circle', bg: 'bg-[#FDF2DE]' },
      dateText: 'Clean physiological cardiac sounds without adventitious murmurs'
    }
  };

  const current = conditionDetails[activeCondition] || conditionDetails.AS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {/* Bottom Left Card: Doctor's Auscultation Appointments / Clinical Protocol */}
      <div className="bg-white rounded-[28px] p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#18181B] tracking-tight">
            Doctor's Auscultation Protocol
          </h3>
          <span className="w-8 h-1 bg-slate-200 rounded-full"></span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Peach Sub-Card (Matching photo "Pills 2 weeks") */}
          <div className="bg-[#FDF2DE] rounded-2xl p-4 flex items-center gap-3 border border-[#FBE2B7]/60 transition-transform hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#E28C22]">
              <Pill className="w-5 h-5 rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#18181B]">4 Valve Sites</span>
              <span className="text-[11px] text-slate-500 font-medium">Aor, Mit, Pul, Tri</span>
            </div>
          </div>

          {/* Soft Baby Blue Sub-Card (Matching photo "ECG Every Month") */}
          <div className="bg-[#DBEAFA]/70 rounded-2xl p-4 flex items-center gap-3 border border-[#BDDBF7]/60 transition-transform hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2A7FD9]">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#18181B]">PCG Resampled</span>
              <span className="text-[11px] text-slate-500 font-medium">4,000 Hz Zero-Phase</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Stethoscope className="w-3.5 h-3.5 text-[#CF3B32]" />
            Postures: <strong>Supine & Sitting</strong>
          </span>
          <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full border border-black/5">
            Fix 2 Context Injected
          </span>
        </div>
      </div>

      {/* Bottom Right Card: Medications & Valvular Murmur Diagnostics */}
      <div className="bg-white rounded-[28px] p-6 shadow-soft-clay border border-[#E8EAEF] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#18181B] tracking-tight">
            Medications & Valve Regimen
          </h3>
          <span className="w-8 h-1 bg-slate-200 rounded-full"></span>
        </div>

        {/* Date Selector Pills (Matching photo with 28 Sep, 2 Oct active black pill, 14 Oct, 24 Oct) */}
        <div className="flex items-center justify-between gap-2 px-1 py-1">
          {dates.map((d) => {
            const isSelected = selectedDate === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                  isSelected 
                    ? 'bg-[#18181B] text-white shadow-md scale-105' 
                    : 'text-slate-600 hover:text-black hover:bg-slate-100/60'
                }`}
              >
                <span className="text-sm font-bold leading-tight">{d.label}</span>
                <span className={`text-[10px] leading-tight font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>

        {/* Prescription / Condition Pills (Matching photo Aspirin 150mg & Statins 50mg) */}
        <div className="flex items-center gap-3 mt-3">
          {/* Pill 1 */}
          <div className="flex-1 bg-[#FBF9F7] rounded-2xl p-2.5 flex items-center gap-2.5 border border-[#ECE3D7]/60">
            <div className="w-9 h-9 rounded-full bg-[#E8DFD4] flex items-center justify-center text-[#18181B] shadow-sm">
              <Pill className="w-4 h-4 rotate-45 text-[#3B82F6]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#18181B]">{current.med1.name}</span>
              <span className="text-[10px] text-slate-500 font-medium">{current.med1.dose}</span>
            </div>
          </div>

          {/* Pill 2 */}
          <div className="flex-1 bg-[#FDF4F3] rounded-2xl p-2.5 flex items-center gap-2.5 border border-[#F9D1CF]/60">
            <div className="w-9 h-9 rounded-full bg-[#FCE7E6] flex items-center justify-center text-[#E2554C] shadow-sm">
              <div className="w-4 h-4 rounded-full bg-[#EC7A72]/30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#CF3B32]"></span>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#18181B]">{current.med2.name}</span>
              <span className="text-[10px] text-slate-500 font-medium">{current.med2.dose}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-slate-400 font-medium truncate">
          {current.dateText}
        </div>
      </div>
    </div>
  );
}
