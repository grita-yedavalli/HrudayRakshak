import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  ShieldCheck, 
  Stethoscope, 
  Heart, 
  Activity, 
  Volume2, 
  Eye, 
  Award, 
  CheckCircle2, 
  Info, 
  RotateCcw, 
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  CalendarCheck,
  User,
  HeartHandshake,
  Download,
  Flame,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

/**
 * Authoritative, intuitive, and professional clinical decision support knowledge base.
 * Explains findings in clear, understandable medical language that patients and doctors can trust,
 * while responsibly guiding them to confirm findings with a licensed cardiologist.
 */
const CLINICAL_GIST_MAP = {
  MS: {
    code: 'MS',
    name: 'Mitral Stenosis',
    severity: 'Severe Hemodynamic Finding',
    impression: 'Acoustic mapping across precordial chest landmarks identified sound patterns consistent with Mitral Stenosis (MS). The mitral valve leaflets are experiencing significant mechanical restriction, reducing the opening through which blood enters the left ventricle. This represents a hemodynamically significant condition requiring formal echocardiographic evaluation and cardiologist consultation.',
    acoustics: [
      { label: 'Murmur Character', value: 'Low-pitched, rumbling mid-diastolic murmur with presystolic accentuation.' },
      { label: 'Acoustic Timing', value: 'Begins with an Opening Snap (OS) shortly after the second heart sound (S2), accompanied by a loud, snapping first heart sound (S1).' },
      { label: 'Acoustic Epicenter', value: 'Strictly localized to the Cardiac Apex (Mitral Area, 5th Intercostal Space midclavicular line), with minimal sound radiation to other areas.' },
      { label: 'Postural Dynamics', value: 'Markedly louder when lying on the left side (Left Lateral Decubitus posture) using the stethoscope bell; acoustic intensity increases following light exertion.' }
    ],
    mechanics: 'The mitral valve leaflets have become stiff, thickened, or fused, preventing the valve from opening fully during filling. Because blood cannot freely pass into the main pumping chamber (left ventricle), pressure builds up backward into the left atrium and pulmonary blood vessels leading to the lungs. This backpressure is the primary cause of shortness of breath during exertion.',
    staging: [
      { 
        stage: 'Stage A: At Risk', 
        detail: 'Risk factors are present (such as rheumatic history or leaflet calcification), but the valve currently opens and functions normally.' 
      },
      { 
        stage: 'Stage B: Progressive', 
        detail: 'Mild-to-moderate valve narrowing is detectable (Valve Area > 1.5 cm²), but the heart is compensating well. Patients typically feel no daily symptoms at rest.' 
      },
      { 
        stage: 'Stage C: Asymptomatic Severe', 
        detail: 'Ultrasound tests show severe valve narrowing (Valve Area ≤ 1.5 cm², mean pressure gradient > 5–10 mmHg), but the patient has not yet noticed overt symptoms.' 
      },
      { 
        stage: 'Stage D: Symptomatic Severe', 
        detail: 'Severe narrowing accompanied by real-life symptoms: shortness of breath during exertion, unusual fatigue, difficulty breathing when lying flat (orthopnea), or heart palpitations.' 
      }
    ],
    benchmarks: [
      { label: 'Severe Valve Area Threshold', value: '≤ 1.5 cm² (≤ 1.0 cm² very severe)' },
      { label: 'Pressure Half-Time (PHT)', value: '≥ 150 ms (≥ 220 ms very severe)' },
      { label: 'Mean Transvalvular Gradient', value: '> 5 – 10 mmHg at rest' }
    ],
    differentials: [
      { 
        name: 'Left Atrial Myxoma', 
        mimic: 'A non-cancerous mobile heart tumor that physically drops into the valve opening during filling, producing a "tumor plop" that sounds like an opening snap.', 
        distinction: 'Ruled out on echocardiogram, which visualizes a mobile intra-cavitary tumor mass rather than thickened valve leaflets.' 
      },
      { 
        name: 'Austin Flint Murmur (from Severe Aortic Regurgitation)', 
        mimic: 'A backward leak from the aortic valve strikes the mitral leaflet, causing an apical diastolic rumble.', 
        distinction: 'Ruled out by the absence of a true opening snap, absence of a loud snapping S1, and presence of wide peripheral pulse pressure.' 
      },
      { 
        name: 'Tricuspid Stenosis', 
        mimic: 'A diastolic rumble occurring on the right side of the heart.', 
        distinction: 'Ruled out because tricuspid murmurs markedly intensify when taking a deep breath in (Carvallo\'s sign); mitral murmurs do not.' 
      }
    ],
    workup: [
      {
        step: '1. Diagnostic Echocardiogram (TTE)',
        detail: 'Schedule a comprehensive Transthoracic Doppler Echocardiography (TTE) [Class I Recommendation]. Ultrasound soundwaves take direct moving pictures of the heart to measure the exact valve opening area (MVA), pressure gradient, and pulmonary pressures with definitive accuracy.'
      },
      {
        step: '2. In-Person Cardiologist Evaluation',
        detail: 'Consult an attending cardiologist or Heart Valve Clinic. Bring this acoustic report and sound recordings to guide formal physical examination and specialized clinical review.'
      },
      {
        step: '3. Rhythm & Symptom Monitoring',
        detail: 'Monitor for rapid irregular heart fluttering (Atrial Fibrillation) and exertional breathlessness. A sudden rapid heartbeat significantly shortens filling time in mitral stenosis and requires immediate medical attention.'
      },
      {
        step: '4. Activity & Medical Precautions',
        detail: 'Avoid sudden heavy isometric straining or intense unmonitored athletic exertion. Medications that control heart rate (such as beta-blockers) are commonly prescribed by cardiologists to keep heart rate controlled and protect the lungs.'
      }
    ]
  },

  AS: {
    code: 'AS',
    name: 'Aortic Stenosis',
    severity: 'Severe Hemodynamic Finding',
    impression: 'Acoustic mapping across precordial chest landmarks identified sound patterns consistent with Aortic Stenosis (AS). The aortic valve (the main exit doorway from the heart to the rest of the body) is significantly restricted, forcing the left ventricle to pump against high resistance. This finding warrants prompt Doppler echocardiography and formal cardiologist evaluation.',
    acoustics: [
      { label: 'Murmur Character', value: 'Harsh, late-peaking crescendo-decrescendo (diamond-shaped) mid-systolic ejection murmur.' },
      { label: 'Acoustic Timing', value: 'Begins after the first heart sound (S1), peaks during mid-to-late contraction, and stops strictly before the second heart sound (A2).' },
      { label: 'Acoustic Epicenter', value: 'Loudest at the Right 2nd Intercostal Space next to the breastbone (Aortic Area); transmits upward into the carotid arteries in the neck.' },
      { label: 'Postural Dynamics', value: 'Accentuated when sitting upright leaning forward with breath held in full expiration; second heart sound (S2) is softened.' }
    ],
    mechanics: 'The aortic valve leaflets have become calcified and stiff, narrowing the exit opening of the heart. The left ventricle must contract with extreme force to push blood past this obstruction, causing the heart muscle to thicken (concentric hypertrophy). Less blood reaches the brain and coronary arteries during exertion, explaining exertional dizziness and chest tightness.',
    staging: [
      { 
        stage: 'Stage A: At Risk', 
        detail: 'Risk factors present (such as leaflet calcification or bicuspid valve), but blood velocity across the valve is completely normal (Vmax < 2.0 m/s).' 
      },
      { 
        stage: 'Stage B: Progressive', 
        detail: 'Mild-to-moderate narrowing is present (Vmax 2.0–3.9 m/s, gradient 20–39 mmHg). The thickened heart muscle is compensating, and patients usually feel completely well.' 
      },
      { 
        stage: 'Stage C: Asymptomatic Severe', 
        detail: 'Ultrasound confirms severe narrowing (Vmax ≥ 4.0 m/s, gradient ≥ 40 mmHg, Valve Area ≤ 1.0 cm²), but the patient does not yet report noticeable daily symptoms.' 
      },
      { 
        stage: 'Stage D: Symptomatic Severe', 
        detail: 'Severe narrowing accompanied by classic symptoms: shortness of breath during exertion, chest tightness (angina), lightheadedness, or fainting (syncope). This requires timely surgical or transcatheter valve replacement.' 
      }
    ],
    benchmarks: [
      { label: 'Severe Valve Area Threshold', value: '≤ 1.0 cm² (Indexed ≤ 0.6 cm²/m²)' },
      { label: 'Peak Blood Jet Velocity (Vmax)', value: '≥ 4.0 m/s' },
      { label: 'Mean Transvalvular Gradient', value: '≥ 40 mmHg' }
    ],
    differentials: [
      { 
        name: 'Aortic Sclerosis', 
        mimic: 'Common age-related leaflet thickening that creates a systolic murmur in older adults.', 
        distinction: 'In sclerosis, the valve still opens freely. Peak velocity is normal (< 2.0 m/s), there is no pressure buildup, and heart muscle does not thicken.' 
      },
      { 
        name: 'Hypertrophic Cardiomyopathy (HOCM)', 
        mimic: 'Thickened heart septum creates a dynamic muscular obstruction.', 
        distinction: 'HOCM murmur gets louder when standing or straining (Valsalva), whereas valvular aortic stenosis murmur gets quieter when standing.' 
      },
      { 
        name: 'Mitral Regurgitation (MR)', 
        mimic: 'A leaking mitral valve also produces a loud systolic murmur.', 
        distinction: 'MR murmur covers the second heart sound (S2) and radiates to the armpit; AS murmur stops before S2 and radiates up toward the neck.' 
      }
    ],
    workup: [
      {
        step: '1. Diagnostic Echocardiogram (TTE)',
        detail: 'Schedule a comprehensive Transthoracic Doppler Echocardiography (TTE) [Class I Recommendation] to measure peak jet velocity (Vmax), mean gradient, Aortic Valve Area (AVA), and pumping strength (LVEF).'
      },
      {
        step: '2. In-Person Cardiologist Evaluation',
        detail: 'Consult an attending cardiologist or Heart Valve Team. Discuss surgical (SAVR) versus minimally invasive transcatheter (TAVR) valve options based on age and anatomical factors.'
      },
      {
        step: '3. Careful Symptom Tracking',
        detail: 'Watch closely for: unusual shortness of breath when walking up stairs, chest tightness, lightheadedness, or feeling faint. Report any such symptoms immediately.'
      },
      {
        step: '4. Critical Activity & Medication Cautions',
        detail: 'Avoid sudden heavy weightlifting or intense competitive athletics until your cardiologist reviews your ultrasound. Avoid abrupt vasodilators without specialist guidance, as sudden vessel dilation can trigger syncope.'
      }
    ]
  },

  AR: {
    code: 'AR',
    name: 'Aortic Regurgitation',
    severity: 'Moderate-to-Severe Finding',
    impression: 'Acoustic mapping across precordial chest landmarks identified sound patterns consistent with Aortic Regurgitation (AR). The aortic valve fails to seal shut tightly after each beat, allowing blood to leak backward into the left ventricle. This finding indicates combined volume and pressure overload, warranting echocardiographic quantification and cardiologist review.',
    acoustics: [
      { label: 'Murmur Character', value: 'High-pitched, blowing early-diastolic decrescendo murmur.' },
      { label: 'Acoustic Timing', value: 'Starts immediately at the aortic closure sound (A2) with maximal intensity, tapering off through the heart\'s resting phase (diastole).' },
      { label: 'Acoustic Epicenter', value: 'Loudest at Erb\'s point (Left 3rd/4th Intercostal Space along the left sternal border) or Right 2nd ICS; radiates toward the apex.' },
      { label: 'Postural Dynamics', value: 'Maximally heard sitting upright leaning forward with breath held in complete expiration; accompanied by wide arterial pulse pressure.' }
    ],
    mechanics: 'The aortic valve fails to close completely during diastole, allowing oxygen-rich blood to leak backward into the left ventricle. The ventricle must pump out this regurgitant blood volume in addition to normal incoming blood. Over time, the ventricle dilates and stretches (eccentric hypertrophy) to handle the excess volume.',
    staging: [
      { 
        stage: 'Stage A: At Risk', 
        detail: 'Risk factors present (such as a bicuspid aortic valve or aortic root dilation), with trace or minimal backward leakage.' 
      },
      { 
        stage: 'Stage B: Progressive', 
        detail: 'Mild-to-moderate backward leakage is detectable, but heart chamber size remains within normal limits and the patient is asymptomatic.' 
      },
      { 
        stage: 'Stage C: Asymptomatic Severe', 
        detail: 'Quantitative ultrasound criteria confirm severe volume leakage (Regurgitant Volume ≥ 60 mL), but the patient does not yet feel symptoms. Subdivided into C1 (heart pumping strength preserved) and C2 (heart pump starting to dilate or weaken).' 
      },
      { 
        stage: 'Stage D: Symptomatic Severe', 
        detail: 'Severe leakage accompanied by real-life symptoms: shortness of breath during exertion, fatigue, chest discomfort, or signs of heart failure.' 
      }
    ],
    benchmarks: [
      { label: 'Vena Contracta Width (Leak Jet)', value: '> 0.6 cm indicates severe' },
      { label: 'Regurgitant Volume per Beat', value: '≥ 60 mL/beat' },
      { label: 'Pressure Half-Time (PHT)', value: '< 200 ms (indicates rapid leak)' }
    ],
    differentials: [
      { 
        name: 'Patent Ductus Arteriosus (PDA)', 
        mimic: 'A continuous blood flow noise heard throughout both contraction and filling.', 
        distinction: 'PDA produces a continuous "machinery" murmur in both phases, whereas AR is strictly a decrescendo murmur during diastole.' 
      },
      { 
        name: 'Pulmonic Regurgitation (Graham Steell)', 
        mimic: 'High-pitched diastolic murmur heard along the left sternal border.', 
        distinction: 'Pulmonic regurgitation is associated with high pulmonary lung pressures (loud P2), not bounding peripheral arm pulses.' 
      },
      { 
        name: 'Mitral Stenosis', 
        mimic: 'A low-pitched apical rumble (Austin Flint rumble) can mimic mitral stenosis.', 
        distinction: 'Lacks an opening snap and loud S1, and responds to afterload-reducing medications.' 
      }
    ],
    workup: [
      {
        step: '1. Diagnostic Echocardiogram (TTE)',
        detail: 'Schedule a comprehensive Doppler Echocardiography to measure the exact backward regurgitant volume, jet width (vena contracta), and left ventricular chamber dimensions.'
      },
      {
        step: '2. In-Person Cardiologist Evaluation',
        detail: 'Consult an attending cardiologist to establish a serial surveillance plan. Tracking left ventricular chamber size every 6–12 months ensures timely intervention before permanent muscle stretching occurs.'
      },
      {
        step: '3. Medication Precautions',
        detail: 'Avoid beta-blockers in severe acute AR without specialist review, as slowing the heart rate prolongs diastole and increases the backward leakage volume into the heart.'
      },
      {
        step: '4. Surgical Valve Consultation',
        detail: 'Valve repair or replacement is recommended if symptoms develop (Stage D) or if ultrasound shows left ventricular enlargement (LVESD > 50 mm) or reduced ejection fraction (< 55%).'
      }
    ]
  },

  MR: {
    code: 'MR',
    name: 'Mitral Regurgitation',
    severity: 'Moderate-to-Severe Finding',
    impression: 'Acoustic mapping across precordial chest landmarks identified sound patterns consistent with Mitral Regurgitation (MR). The mitral valve fails to seal shut during heart contraction, allowing blood to leak backward into the left atrium. This finding creates left-sided volume overload, warranting echocardiographic quantification and cardiologist evaluation.',
    acoustics: [
      { label: 'Murmur Character', value: 'High-pitched, blowing holosystolic (pansystolic) plateau murmur with uniform acoustic intensity throughout contraction.' },
      { label: 'Acoustic Timing', value: 'Begins precisely at the first heart sound (S1) and continues all the way through the second heart sound (S2).' },
      { label: 'Acoustic Epicenter', value: 'Loudest at the Cardiac Apex (Left 5th Intercostal Space midclavicular line); transmits outward into the left armpit (axilla) and left back.' },
      { label: 'Postural Dynamics', value: 'Best heard in the Left Lateral Decubitus posture; murmur intensifies with isometric handgrip exercise.' }
    ],
    mechanics: 'The mitral valve leaflets fail to close completely during heart contraction, allowing blood to leak backward into the low-pressure left atrium. This volume overload stretches and enlarges the left atrium (increasing risk of irregular heart rhythm) and forces the left ventricle to pump extra blood to compensate.',
    staging: [
      { 
        stage: 'Stage A: At Risk', 
        detail: 'Risk factors present (such as mitral valve prolapse or mild leaflet thickening), with trace or minimal backward leakage.' 
      },
      { 
        stage: 'Stage B: Progressive', 
        detail: 'Mild-to-moderate backward leakage is detectable (regurgitant volume < 60 mL), but the heart is compensating and the patient is asymptomatic.' 
      },
      { 
        stage: 'Stage C: Asymptomatic Severe', 
        detail: 'Ultrasound confirms severe backward volume leakage (Regurgitant Volume ≥ 60 mL, jet width ≥ 0.7 cm), but the patient does not yet report noticeable daily symptoms.' 
      },
      { 
        stage: 'Stage D: Symptomatic Severe', 
        detail: 'Severe regurgitation accompanied by daily symptoms: shortness of breath during exertion, reduced exercise stamina, fatigue, or fluid retention.' 
      }
    ],
    benchmarks: [
      { label: 'Vena Contracta Width (Jet Width)', value: '≥ 0.7 cm indicates severe' },
      { label: 'Regurgitant Volume per Beat', value: '≥ 60 mL/beat' },
      { label: 'Effective Regurgitant Orifice Area', value: '≥ 0.40 cm²' }
    ],
    differentials: [
      { 
        name: 'Tricuspid Regurgitation (TR)', 
        mimic: 'Also creates a holosystolic murmur across the lower chest wall.', 
        distinction: 'Tricuspid murmur markedly increases during deep inspiration (Carvallo\'s sign); mitral regurgitation murmur radiates to the armpit and does not increase on inspiration.' 
      },
      { 
        name: 'Ventricular Septal Defect (VSD)', 
        mimic: 'A hole in the heart wall producing a harsh holosystolic murmur.', 
        distinction: 'VSD murmur is loudest along the lower left breastbone and is typically accompanied by a palpable chest vibration (thrill).' 
      },
      { 
        name: 'Aortic Stenosis', 
        mimic: 'Loud systolic murmur heard over the chest.', 
        distinction: 'AS murmur is diamond-shaped, terminates before S2, and radiates up to the neck; MR murmur encompasses S2 and radiates to the armpit.' 
      }
    ],
    workup: [
      {
        step: '1. Diagnostic Echocardiogram (TTE)',
        detail: 'Schedule a comprehensive Doppler Echocardiography to measure the exact backward regurgitant volume, effective leak area (EROA), and heart chamber dimensions.'
      },
      {
        step: '2. In-Person Cardiologist Evaluation',
        detail: 'Consult an attending cardiologist to determine whether the leak is primary (organic leaflet prolapse) or secondary (functional heart muscle stretching), which guides treatment.'
      },
      {
        step: '3. Heart Rhythm Monitoring',
        detail: 'Monitor for rapid irregular heart fluttering (Atrial Fibrillation). Enlargement of the left atrium from chronic regurgitation increases the risk of rhythm disturbances.'
      },
      {
        step: '4. Repair vs Intervention Triage',
        detail: 'Mitral valve repair is preferred over replacement in primary MR when performed early. Minimally invasive transcatheter clip repair (TEER) is available for eligible patients.'
      }
    ]
  },

  Normal: {
    code: 'Normal',
    name: 'Normal Physiological Auscultation',
    severity: 'Normal / Benign Finding',
    impression: 'Acoustic mapping across precordial chest landmarks identified crisp physiological normal heart sounds. No evidence of pathological heart murmurs, valve stenosis, backward regurgitation, or hemodynamic obstruction.',
    acoustics: [
      { label: 'First Heart Sound (S1)', value: 'Crisp, normal physiological sound representing clean closure of the mitral and tricuspid valves.' },
      { label: 'Second Heart Sound (S2)', value: 'Normal physiological splitting observed during inspiration; single synchronized sound during expiration.' },
      { label: 'Acoustic Epicenter', value: 'Uniform acoustic intensity across all 4 precordial landmarks without localized murmur hotspots.' },
      { label: 'Postural Dynamics', value: 'Normal acoustic amplitude in both sitting and supine postures; complete absence of gallops or clicks.' }
    ],
    mechanics: 'All four heart valves open completely without restriction and seal shut tightly without backward leakage. Intracardiac blood pressures and pumping ejection fraction are fully preserved within normal physiological ranges.',
    staging: [
      { 
        stage: 'Physiological Benchmark', 
        detail: 'Normal cardiac auscultation. No evidence of structural or hemodynamic valvular disease.' 
      }
    ],
    benchmarks: [
      { label: 'Aortic Peak Velocity', value: '< 1.7 m/s (Normal)' },
      { label: 'Left Ventricular Pumping Strength', value: '55% – 70% (Normal)' },
      { label: 'Valvular Regurgitation', value: 'None or trace physiological' }
    ],
    differentials: [
      { 
        name: 'Innocent Flow Murmurs', 
        mimic: 'A faint, soft systolic noise heard in young, active, or pregnant individuals.', 
        distinction: 'Innocent flow murmurs are soft, change with position, and occur across completely healthy, normal heart valves.' 
      }
    ],
    workup: [
      {
        step: '1. Routine Preventive Health',
        detail: 'Continue routine cardiovascular wellness: balanced diet, regular aerobic exercise, and annual blood pressure monitoring.'
      },
      {
        step: '2. No Advanced Testing Needed',
        detail: 'No echocardiography or pharmacological intervention is required in the absence of clinical cardiovascular symptoms.'
      }
    ]
  }
};

/**
 * Plain-language, compassionate explanations and next steps for the Patient View.
 */
const PATIENT_FRIENDLY_GIST = {
  Normal: {
    title: "Healthy Heart Rhythm (Normal Findings)",
    explanation: "Your heart sound recordings show clear, natural heart sounds (S1 and S2) with no significant murmurs detected. Blood flow through your heart valves appears smooth, regular, and unobstructed.",
    procedures: [
      {
        title: "Routine Cardiovascular Wellness",
        detail: "Continue your healthy lifestyle habits, balanced daily nutrition, and regular aerobic exercise."
      },
      {
        title: "No Advanced Heart Tests Required",
        detail: "Because your heart sounds are normal, no echocardiogram (ultrasound) or specialized heart medications are needed."
      },
      {
        title: "Annual Primary Care Check-Up",
        detail: "Maintain routine annual blood pressure and heart sound checks with your primary care physician."
      }
    ]
  },
  AS: {
    title: "Aortic Stenosis (Narrowed Aortic Valve)",
    explanation: "The aortic valve is the main doorway that allows oxygen-rich blood to exit your heart and flow to the rest of your body. In Aortic Stenosis, this valve opening has become stiffer or narrower than usual, meaning your heart muscle has to work harder to push blood through.",
    procedures: [
      {
        title: "Schedule a Doppler Echocardiogram (Heart Ultrasound)",
        detail: "This is a painless, safe ultrasound scan using sound waves to take live moving pictures of your aortic valve and measure blood flow velocity."
      },
      {
        title: "Cardiologist Consultation",
        detail: "Review this report and heart sound recordings with a heart specialist (cardiologist) for a complete physical examination and formal diagnosis."
      },
      {
        title: "Monitor Daily Symptoms",
        detail: "Watch for unusual shortness of breath when walking or climbing stairs, chest tightness, or feeling lightheaded/dizzy. Notify your doctor if any occur."
      },
      {
        title: "Physical Activity Precautions",
        detail: "Avoid sudden heavy weightlifting or intense competitive athletics until your cardiologist reviews your ultrasound."
      }
    ]
  },
  AR: {
    title: "Aortic Regurgitation (Leaking Aortic Valve)",
    explanation: "In Aortic Regurgitation, the aortic valve does not seal completely shut after each beat. This allows a portion of blood to leak backward into your heart's main pumping chamber.",
    procedures: [
      {
        title: "Schedule a Doppler Echocardiogram (Heart Ultrasound)",
        detail: "A painless ultrasound scan will measure the exact amount of backward leakage and assess your heart pumping strength."
      },
      {
        title: "Cardiologist Consultation",
        detail: "Consult an attending cardiologist to establish a regular surveillance schedule and review blood pressure management."
      },
      {
        title: "Symptom Monitoring",
        detail: "Notice whether you experience unusual fatigue, difficulty breathing when lying flat, or shortness of breath with mild exertion."
      },
      {
        title: "Blood Pressure Management",
        detail: "Maintain healthy resting blood pressure in partnership with your doctor."
      }
    ]
  },
  MR: {
    title: "Mitral Regurgitation (Leaking Mitral Valve)",
    explanation: "The mitral valve regulates blood flow between the upper and lower chambers on the left side of your heart. In Mitral Regurgitation, the valve flaps do not seal tightly, allowing blood to flow backward when the heart squeezes.",
    procedures: [
      {
        title: "Schedule a Doppler Echocardiogram (Heart Ultrasound)",
        detail: "An ultrasound will quantify the degree of backward leakage and verify the size of your heart chambers."
      },
      {
        title: "Cardiologist Consultation",
        detail: "Review these findings with a licensed cardiologist or Heart Valve specialist."
      },
      {
        title: "Symptom Tracking",
        detail: "Monitor for fluttering or rapid irregular heartbeats (palpitations), unusual fatigue, or exertional shortness of breath."
      },
      {
        title: "Activity Guidance",
        detail: "Engage in regular light walking while avoiding sudden heavy physical exertion pending specialist evaluation."
      }
    ]
  },
  MS: {
    title: "Mitral Stenosis (Narrowed Mitral Valve)",
    explanation: "The mitral valve opening has become restricted or stiffened, making it harder for blood to flow smoothly from the lungs into your heart's main pumping chamber.",
    procedures: [
      {
        title: "Schedule a Doppler Echocardiogram (Heart Ultrasound)",
        detail: "An ultrasound will measure the exact valve opening area and transvalvular pressure gradients."
      },
      {
        title: "Cardiologist Consultation",
        detail: "Consult a heart specialist to review ultrasound results and discuss medication or intervention strategies."
      },
      {
        title: "Watch Heart Rate & Breathlessness",
        detail: "Pay close attention to rapid flutterings in your chest or shortness of breath. A rapid pulse requires prompt medical attention in mitral stenosis."
      },
      {
        title: "Physical Exertion Precautions",
        detail: "Avoid sudden heavy isometric exertion and keep well-hydrated."
      }
    ]
  }
};

function getConditionKey(primaryDiagnosis, probabilities) {
  // If posterior probability for Normal exceeds 0.50, or if all valvular disease probabilities are below clinical threshold (<0.35), classify as Normal
  if (probabilities) {
    if (probabilities.Normal !== undefined && probabilities.Normal >= 0.50) {
      return 'Normal';
    }
    const maxDiseaseProb = Math.max(
      probabilities.AS || 0,
      probabilities.AR || 0,
      probabilities.MR || 0,
      probabilities.MS || 0
    );
    if (maxDiseaseProb < 0.35 && (probabilities.Normal === undefined || probabilities.Normal > 0.40)) {
      return 'Normal';
    }
  }

  const text = (primaryDiagnosis || '').trim();
  if (!text) return 'Normal';

  // 1. Check Normal / Physiological FIRST to avoid false positives with words like "Heart" or "Auscultation"
  if (/normal|physiologic|healthy|benign/i.test(text)) {
    return 'Normal';
  }

  // 2. Match specific disease pathologies using word boundaries for acronyms
  if (/\bAR\b|aortic\s+regurgitation/i.test(text)) return 'AR';
  if (/\bAS\b|aortic\s+stenosis/i.test(text)) return 'AS';
  if (/\bMR\b|mitral\s+regurgitation/i.test(text)) return 'MR';
  if (/\bMS\b|mitral\s+stenosis/i.test(text)) return 'MS';

  return 'Normal';
}

export default function ClinicalConsultationReport({ 
  report, 
  doctorReport,
  patientReport,
  primaryDiagnosis, 
  patientMetadata = {},
  probabilities = {},
  peakSite = null,
  severity = 'Pathological Finding',
  riskStratification = null,
  onListenMurmur = null,
  isHoverListening = false,
  onNavigateBack = null,
  onReset = null
}) {
  const [activeRoleView, setActiveRoleView] = useState('patient'); // 'patient' (first) | 'doctor'
  const [printTarget, setPrintTarget] = useState('patient'); // 'patient' (first) | 'doctor'
  const [copiedDoctor, setCopiedDoctor] = useState(false);
  const [copiedPatient, setCopiedPatient] = useState(false);
  const [viewMode, setViewMode] = useState('dossier');

  const conditionKey = getConditionKey(primaryDiagnosis, probabilities);
  const gist = CLINICAL_GIST_MAP[conditionKey] || CLINICAL_GIST_MAP.MS;
  const patientGist = PATIENT_FRIENDLY_GIST[conditionKey] || PATIENT_FRIENDLY_GIST.Normal;

  const patientName = patientMetadata.patient_name || patientMetadata.patient_id || 'Alex Morgan';
  const patientAge = patientMetadata.age || 48;
  const patientGender = patientMetadata.gender === 'F' ? 'Female' : 'Male';
  const patientSmoker = patientMetadata.smoker === 1 ? 'Active Smoker' : 'Non-smoker';
  const patientLives = patientMetadata.lives === 'R' ? 'Rural Setting' : 'Urban Setting';

  const score = Math.round(Number(riskStratification?.composite_score) || 0);
  const getTierConfig = (s) => {
    if (s <= 24) return { tier: "Tier 1: Low Risk", color: "#16A34A", bgColor: "#DCFCE7", borderColor: "#86EFAC" };
    if (s <= 49) return { tier: "Tier 2: Moderate Risk", color: "#CA8A04", bgColor: "#FEF9C3", borderColor: "#FDE047" };
    if (s <= 74) return { tier: "Tier 3: High Priority", color: "#EA580C", bgColor: "#FFEDD5", borderColor: "#FDBA74" };
    return { tier: "Tier 4: Critical / Urgent", color: "#DC2626", bgColor: "#FEE2E2", borderColor: "#FCA5A5" };
  };
  const activeTierConfig = getTierConfig(score);

  // Build clean plain text EHR note (Doctor View)
  const plainTextEhrNote = `================================================================================
CARDIOLOGY CLINICAL DECISION SUPPORT REPORT (DOCTOR VIEW)
ACC/AHA 2020 GUIDELINE-DIRECTED MULTIMODAL AUSCULTATION ASSESSMENT
================================================================================
PATIENT        : ${patientName} | ${patientAge}y ${patientMetadata.gender === 'F' ? 'Female' : 'Male'} | ${patientMetadata.smoker === 1 ? 'Smoker' : 'Non-smoker'} | ${patientMetadata.lives === 'R' ? 'Rural' : 'Urban'}
RECORDING SITE : ${peakSite?.slot_label || 'Auscultation Site'} (${(peakSite?.posture || patientMetadata.posture || 'Sitting').toUpperCase()})
DIAGNOSIS      : ${gist.name} (${gist.code}) - ${gist.severity}
GROUNDING      : 2020 ACC/AHA Valvular Heart Disease Guidelines

1. CLINICAL IMPRESSION & SUMMARY
${gist.impression}

2. PHONOCARDIOGRAPHIC ACOUSTIC EVIDENCE
${gist.acoustics.map(a => `• ${a.label}: ${a.value}`).join('\n')}

3. HEMODYNAMICS & ACC/AHA 2020 STAGING
How This Affects Heart Mechanics:
${gist.mechanics}

ACC/AHA Clinical Staging:
${gist.staging.map(s => `• ${s.stage}: ${s.detail}`).join('\n')}

Doppler Benchmarks:
${gist.benchmarks.map(b => `• ${b.label}: ${b.value}`).join('\n')}

4. DIFFERENTIAL CONSIDERATIONS (WHAT WAS RULED OUT)
${gist.differentials.map(d => `• ${d.name}:\n  - Lookalike Mimic: ${d.mimic}\n  - Clinical Distinction: ${d.distinction}`).join('\n')}

5. RECOMMENDED NEXT STEPS & CARDIOLOGIST CONSULTATION GUIDE
${gist.workup.map((w, i) => `${i + 1}. ${w.step}\n   ${w.detail}`).join('\n')}

CLINICAL DECISION SUPPORT NOTICE:
This report provides preliminary decision support grounded in acoustic phonocardiography
and ACC/AHA 2020 guidelines. It does not replace an in-person medical evaluation by
a licensed cardiologist. Formal Doppler echocardiography is required.
================================================================================`;

  // Build clean plain text Patient Summary (Patient View)
  const plainTextPatientNote = `================================================================================
PATIENT HEART HEALTH SUMMARY (PATIENT VIEW)
================================================================================
PATIENT NAME       : ${patientName}
PATIENT DETAILS    : ${patientAge} years old • ${patientGender} • ${patientSmoker} • ${patientLives}
EXAMINATION DATE   : ${new Date().toLocaleDateString()}

1. DIAGNOSED CONDITION
Condition: ${gist.name} (${gist.code}) - ${gist.severity}
What this means:
${patientGist.explanation}

2. CARDIOVASCULAR RISK SCORE
Risk Score : ${score} / 100
Risk Tier  : ${activeTierConfig.tier}
${riskStratification?.clinical_action ? `Clinical Urgency: ${riskStratification.clinical_action}` : ''}

3. RECOMMENDED FURTHER PROCEDURE & NEXT STEPS
${patientGist.procedures.map((p, idx) => `${idx + 1}. ${p.title}\n   ${p.detail}`).join('\n')}

================================================================================
IMPORTANT NOTICE FOR PATIENTS:
This report provides preliminary screening results from your digital stethoscope
recording. It is designed to help you discuss your heart health with a doctor,
and does not replace a medical consultation with a licensed cardiologist.
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(plainTextEhrNote);
    setCopiedDoctor(true);
    setTimeout(() => setCopiedDoctor(false), 2500);
  };

  const handleCopyPatient = () => {
    navigator.clipboard.writeText(plainTextPatientNote);
    setCopiedPatient(true);
    setTimeout(() => setCopiedPatient(false), 2500);
  };

  /**
   * CLEAN PRINT / PDF HANDLER:
   * Triggers native browser print formatted exclusively via @media print styles.
   * Prints the chosen version (Doctor View or Patient View) as a dedicated 1-page document.
   */
  const handleDownloadReport = (target = 'doctor') => {
    setPrintTarget(target);
    if (target === 'doctor' && viewMode !== 'dossier') {
      setViewMode('dossier');
    }
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handlePrint = () => {
    handleDownloadReport(activeRoleView);
  };

  const isNormal = conditionKey === 'Normal';
  const accentBg = isNormal ? 'bg-sky-50' : 'bg-rose-50';
  const accentText = isNormal ? 'text-sky-700' : 'text-rose-700';

  return (
    <div id="clinical-report-printable-area" className="w-full">

      {/* ========================================================================= */}
      {/* 1. ON-SCREEN INTERACTIVE VIEW (Rich UI, audio playback, EHR toggle)       */}
      {/* ========================================================================= */}
      <div className="screen-only w-full flex flex-col gap-6 animate-fadeIn">

      {/* ========================================================================= */}
      {/* TOP BAR: PRIMARY DOCTOR VIEW VS PATIENT VIEW TOGGLE + QUICK DOWNLOADS     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[24px] p-3 shadow-soft-clay border border-[#E8EAEF] flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        
        {/* Toggle between Patient View & Doctor View (Patient First) */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveRoleView('patient');
              setPrintTarget('patient');
            }}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeRoleView === 'patient'
                ? 'bg-[#CF3B32] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Heart className="w-4 h-4 text-white" />
            <span>Patient View (Summary)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRoleView('doctor');
              setPrintTarget('doctor');
            }}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeRoleView === 'doctor'
                ? 'bg-[#18181B] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#EC7A72]" />
            <span>Doctor View (CDSS)</span>
          </button>
        </div>

        {/* Single Download PDF Button for Currently Active View */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleDownloadReport(activeRoleView)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102 ${
              activeRoleView === 'patient'
                ? 'bg-[#CF3B32] hover:bg-[#b5322a] text-white'
                : 'bg-[#18181B] hover:bg-black text-white'
            }`}
            title={`Download or Print ${activeRoleView === 'patient' ? 'Patient View' : 'Doctor View'} as PDF`}
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Download {activeRoleView === 'patient' ? 'Patient View' : 'Doctor View'} (PDF)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DOCTOR VIEW: FULL CLINICAL DECISION SUPPORT DOSSIER (UNCHANGED CORE)   */}
      {/* ========================================================================= */}
      {activeRoleView === 'doctor' && (
        <div className="flex flex-col gap-8 animate-fadeIn">

      {/* HEADER: CLEAN MEDICAL REPORT DOSSIER (NO INSTITUTIONAL BRANDING)          */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6 print-card print-avoid-break">
        
        {/* Header Title Row & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#18181B] text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-[#EC7A72]" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-black uppercase tracking-wider">
                  Doctor View • Clinical Decision Support
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ACC/AHA 2020 Grounded
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  Ref: CDSS-{gist.code}-{Date.now().toString(36).slice(-5).toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
                Cardiology Consultation & Diagnostic Report (Doctor View)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive, guideline-grounded assessment synthesized from anterior precordial phonocardiography. Designed to assist clinical review with an attending cardiologist.
              </p>
            </div>
          </div>

          {/* Action Toolbar (Hidden during Print/PDF export) */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap no-print">
            
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('dossier')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'dossier'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Clinical View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('ehr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'ehr'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>EHR Note</span>
              </button>
            </div>

            {/* Quick Listen to Peak Murmur */}
            {onListenMurmur && (
              <button
                type="button"
                onClick={onListenMurmur}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isHoverListening
                    ? 'bg-[#CF3B32] text-white ring-2 ring-[#CF3B32]'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Listen to the acoustic heart sound referenced in this consultation"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isHoverListening ? 'animate-bounce text-white' : 'text-[#CF3B32]'}`} />
                <span>{isHoverListening ? 'Listening...' : 'Listen Murmur'}</span>
              </button>
            )}

            {/* Copy Note to Clipboard */}
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                copiedDoctor
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Copy consultation text for hospital EHR insertion"
            >
              {copiedDoctor ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Patient Auscultation & Clinical Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="bg-[#FAFBFD] p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Primary Assessment
            </span>
            <div className="mt-1">
              <span className="text-sm font-black text-slate-900 block truncate">
                {gist.name} ({gist.code})
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block mt-0.5 ${accentBg} ${accentText}`}>
                {gist.severity}
              </span>
            </div>
          </div>

          <div className="bg-[#FAFBFD] p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Patient Profile
            </span>
            <div className="mt-1">
              <span className="text-sm font-black text-slate-900 block truncate" title={patientName}>
                {patientName}
              </span>
              <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                {patientAge} yrs • {patientGender} • {patientSmoker}
              </span>
            </div>
          </div>

          <div className="bg-[#FAFBFD] p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Recording Landmark
            </span>
            <div className="mt-1">
              <span className="text-sm font-black text-slate-900 block truncate">
                {peakSite?.slot_label || `${patientMetadata.valve_site || 'Mitral'} Area`}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 block mt-0.5 uppercase">
                Posture: {peakSite?.posture || patientMetadata.posture || 'Supine'}
              </span>
            </div>
          </div>

          <div className="bg-[#FAFBFD] p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Clinical Guidelines
            </span>
            <div className="mt-1">
              <span className="text-sm font-black text-slate-900 block">
                ACC/AHA 2020 VHD
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                Doppler Hemodynamic Staging
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: STRUCTURED CLINICAL DOSSIER (INTUITIVE, TRUSTED, PROFESSIONAL)     */}
      {/* ========================================================================= */}
      {viewMode === 'dossier' && (
        <div className="flex flex-col gap-8 animate-fadeIn">
          
          {/* SECTION 1: CLINICAL IMPRESSION (CLEAR EXECUTIVE SUMMARY) */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-4 print-card print-avoid-break">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#CF3B32] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  01
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                  Section 1 • Clinical Assessment & Primary Finding
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${accentBg} ${accentText}`}>
                {gist.severity}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200/80">
              {gist.impression}
            </p>
          </div>

          {/* SECTION 2: PHONOCARDIOGRAPHIC ACOUSTIC EVIDENCE */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-4 print-card print-avoid-break">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  02
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                  Section 2 • Phonocardiographic Acoustic Evidence
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">4,000 Hz Sampling</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {gist.acoustics.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200/80 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-slate-800 font-semibold leading-relaxed">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: HEMODYNAMIC PATHOPHYSIOLOGY & ACC/AHA 2020 STAGING */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-5 print-card print-avoid-break">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#E28C22] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  03
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                  Section 3 • Hemodynamic Pathophysiology & ACC/AHA 2020 Staging
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Hemodynamic Staging
              </span>
            </div>

            {/* Part A: How this affects heart mechanics */}
            <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-5 rounded-2xl border border-amber-100/80 text-xs sm:text-sm">
              <span className="font-extrabold text-amber-950 block mb-1.5">
                How This Condition Physically Affects Blood Flow:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {gist.mechanics}
              </p>
            </div>

            {/* Part B: ACC/AHA Staging categories */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ACC/AHA 2020 Clinical Staging Categories (What each stage means):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {gist.staging.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAFBFD] rounded-2xl border border-slate-200 text-xs flex flex-col justify-between gap-2">
                    <span className="font-extrabold text-slate-900 block">{s.stage}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Part C: Diagnostic Doppler benchmarks */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Key Doppler Echocardiogram Benchmarks:
              </span>
              {gist.benchmarks.map((b, idx) => (
                <div key={idx} className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                  <span className="font-bold text-slate-900">{b.label}:</span> {b.value}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: DIFFERENTIAL CONSIDERATIONS (WHAT WAS RULED OUT) */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-5 print-card print-avoid-break">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  04
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                  Section 4 • Differential Considerations (Conditions Evaluated & Ruled Out)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Rule-Out Diagnostics
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Different heart conditions can produce acoustic murmurs that sound very similar through a stethoscope. To build diagnostic confidence, our acoustic analysis evaluated and ruled out these primary lookalike conditions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {gist.differentials.map((diff, idx) => (
                <div key={idx} className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm">{diff.name}</span>
                  </div>
                  <div className="text-[11px] space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                      <strong className="text-[10px] text-amber-700 uppercase block mb-0.5">Why it mimics:</strong>
                      <span className="text-slate-600 font-medium leading-relaxed">{diff.mimic}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/60">
                      <strong className="text-[10px] text-emerald-700 uppercase block mb-0.5">How doctors rule it out:</strong>
                      <span className="text-slate-800 font-medium leading-relaxed">{diff.distinction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: RECOMMENDED NEXT STEPS & CARDIOLOGIST CONSULTATION GUIDE */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-4 print-card print-avoid-break">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#16A34A] text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  05
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                  Section 5 • Recommended Next Steps & Cardiologist Consultation Guide
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Action Plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {gist.workup.map((step, idx) => (
                <div key={idx} className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex flex-col gap-1.5">
                  <span className="font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm">{step.step}</span>
                  </span>
                  <p className="text-slate-600 font-medium leading-relaxed pl-7">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: EHR TEXT TRANSCRIPT                                               */}
      {/* ========================================================================= */}
      {viewMode === 'ehr' && (
        <div className="bg-[#18181B] text-slate-100 rounded-[28px] p-6 shadow-inner border border-slate-800 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400 font-bold uppercase tracking-wider">
              Standard Hospital EHR Clinical Note
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[#EC7A72] hover:text-white font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Transcript'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap select-text text-slate-200 overflow-x-auto">
            {plainTextEhrNote}
          </pre>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESPONSIBLE CARDIOLOGY CONSULTATION BRIDGE & TRUST NOTICE                 */}
      {/* ========================================================================= */}
      <div className="bg-amber-50/70 rounded-[20px] p-5 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-card print-avoid-break">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 font-medium leading-relaxed">
            <strong>Clinical Consultation & Decision Support Mandate:</strong> This report provides screening decision support derived from digitized phonocardiography and 2020 ACC/AHA clinical guidelines. It is designed to inform clinical discussion with an attending physician, <strong>not to replace an in-person medical consultation with a licensed cardiologist</strong>. Definitive diagnosis, hemodynamic staging, and treatment planning require a formal Doppler echocardiogram.
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto no-print">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-amber-700" />
            <span>Copy Note</span>
          </button>
        </div>
      </div>

      </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PATIENT VIEW: CLEAN, SIMPLE, TRANSPARENT PATIENT HEALTH REPORT         */}
      {/* ========================================================================= */}
      {activeRoleView === 'patient' && (
        <div className="flex flex-col gap-8 animate-fadeIn">
          
          {/* Patient View Header Banner */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#CF3B32] text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#CF3B32] text-white text-[10px] font-black uppercase tracking-wider">
                      Patient View
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Acoustic Screening
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Date: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
                    Your Heart Health Summary (Patient View)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    A clear, easy-to-understand overview of your cardiac auscultation examination results and recommended next steps.
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap no-print">
                <button
                  type="button"
                  onClick={handleCopyPatient}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    copiedPatient
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Copy patient summary note to clipboard"
                >
                  {copiedPatient ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied Summary</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#FAFBFD] p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Patient Name
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 truncate mt-1">
                  {patientName}
                </span>
              </div>
              <div className="bg-[#FAFBFD] p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Diagnosed Condition
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 truncate mt-1">
                  {gist.name} ({gist.code})
                </span>
              </div>
              <div className="bg-[#FAFBFD] p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Risk Score
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 mt-1" style={{ color: activeTierConfig.color }}>
                  {score} / 100 • {activeTierConfig.tier.split(':')[1]?.trim() || activeTierConfig.tier}
                </span>
              </div>
              <div className="bg-[#FAFBFD] p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Key Procedure
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 truncate mt-1">
                  {isNormal ? 'Routine Check-Up' : 'Doppler Echocardiogram'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 1: Patient Name & Details */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                1
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                  Patient Information & Details
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Demographic profile mapped to this auscultation session</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-[#CF3B32] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Full Name</span>
                  <strong className="text-slate-900 text-sm sm:text-base font-black block">{patientName}</strong>
                </div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Age & Gender</span>
                  <strong className="text-slate-900 text-sm sm:text-base font-black block">{patientAge} yrs • {patientGender}</strong>
                </div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Smoking Status</span>
                  <strong className="text-slate-900 text-sm sm:text-base font-black block">{patientSmoker}</strong>
                </div>
              </div>

              <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Living Area</span>
                  <strong className="text-slate-900 text-sm sm:text-base font-black block">{patientLives}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Diagnosed Disease / Condition */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#CF3B32] text-white flex items-center justify-center text-xs font-black">
                  2
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                    Diagnosed Condition
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Primary acoustic heart sound finding</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${accentBg} ${accentText}`}>
                {gist.severity}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <Heart className={`w-5 h-5 ${isNormal ? 'text-sky-600' : 'text-[#CF3B32]'}`} />
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {patientGist.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {patientGist.explanation}
              </p>
            </div>
          </div>

          {/* Card 3: Risk Score */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#E28C22] text-white flex items-center justify-center text-xs font-black">
                  3
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                    Cardiovascular Risk Score
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Combined acoustic urgency and patient risk stratification</span>
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-xs font-extrabold border"
                style={{ backgroundColor: activeTierConfig.bgColor, color: activeTierConfig.color, borderColor: activeTierConfig.borderColor }}
              >
                {activeTierConfig.tier}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl border" style={{ backgroundColor: activeTierConfig.bgColor, borderColor: activeTierConfig.borderColor }}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-soft-clay flex flex-col items-center justify-center border border-black/5 flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                <span className="text-2xl sm:text-3xl font-black" style={{ color: activeTierConfig.color }}>
                  {score}
                </span>
                <span className="text-[10px] font-bold text-slate-400">/ 100</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                <strong className="text-slate-900 text-sm sm:text-base font-black">
                  {activeTierConfig.tier} Priority Level
                </strong>
                <p className="text-slate-700 font-medium leading-relaxed">
                  Your risk score is computed by correlating the heart sound acoustic intensity with your age, cardiovascular risk factors, and care access setting.
                </p>
                {riskStratification?.clinical_action && (
                  <div className="mt-1.5 text-slate-800 font-bold bg-white/80 px-3.5 py-2 rounded-xl border border-black/5">
                    <strong>Recommended Urgency:</strong> {riskStratification.clinical_action}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Further Procedure & Next Steps */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-soft-clay border border-[#E8EAEF] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#16A34A] text-white flex items-center justify-center text-xs font-black">
                  4
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                    Further Procedure & Next Steps
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Clear actions for you and your healthcare team</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Action Plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {patientGist.procedures.map((proc, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-[#FAFBFD] rounded-2xl border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {idx + 1}
                    </span>
                    <strong className="text-slate-900 text-xs sm:text-sm font-black">{proc.title}</strong>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed pl-8">
                    {proc.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Advice & Consultation Callout Box */}
          <div className="bg-sky-50/70 rounded-[24px] p-6 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 w-full">
              <Info className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-sky-950 font-medium leading-relaxed">
                <strong>What to do with this report:</strong> You can download or print both your <strong>Patient Summary</strong> and the detailed <strong>Doctor View</strong> to bring to your appointment with your cardiologist or primary care doctor.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Navigation Return Button (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 no-print">
        {onNavigateBack && (
          <button
            type="button"
            onClick={onNavigateBack}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#CF3B32]" />
            <span>← Return to Stages 1, 2 & 3 (Diagnosis & Waveforms)</span>
          </button>
        )}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#18181B] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#EC7A72]" />
            <span>Start New Patient Scan</span>
          </button>
        )}
      </div>

      </div> {/* End of screen-only */}

      {/* ========================================================================= */}
      {/* 2. DEDICATED PRINT / PDF MEDICAL DOSSIER (DOCTOR OR PATIENT TARGET)       */}
      {/* ========================================================================= */}
      <div className="print-only">
        {printTarget === 'patient' ? (
          <div className="print-page">
            
            {/* Patient Clinical Letterhead Header */}
            <div style={{ borderBottom: '2.5px solid #0f172a', paddingBottom: '7px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>
                  Cardiology Decision Support System (CDSS)
                </div>
                <div style={{ fontSize: '13pt', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', lineHeight: 1.1 }}>
                  Patient Heart Health Summary
                </div>
                <div style={{ fontSize: '7.5pt', color: '#475569', fontWeight: 500, marginTop: '2px' }}>
                  Precordial Phonocardiography Screening • Patient Health Record
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '7.5pt', fontWeight: 800, border: '1.5px solid #0f172a', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                  Patient Copy
                </span>
                <div style={{ fontSize: '7pt', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
                  Date: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* 1. Patient Name and Details Table */}
            <table className="print-table" style={{ marginBottom: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '35%', padding: '6px 10px' }}>
                    <span style={{ fontSize: '6.5pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Patient Full Name</span>
                    <strong style={{ fontSize: '9.5pt', color: '#0f172a' }}>{patientName}</strong>
                  </td>
                  <td style={{ width: '25%', padding: '6px 10px' }}>
                    <span style={{ fontSize: '6.5pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Age & Gender</span>
                    <strong style={{ fontSize: '8pt', color: '#0f172a' }}>{patientAge} yrs • {patientGender}</strong>
                  </td>
                  <td style={{ width: '20%', padding: '6px 10px' }}>
                    <span style={{ fontSize: '6.5pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Smoking Status</span>
                    <strong style={{ fontSize: '8pt', color: '#0f172a' }}>{patientSmoker}</strong>
                  </td>
                  <td style={{ width: '20%', padding: '6px 10px' }}>
                    <span style={{ fontSize: '6.5pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Living Setting</span>
                    <strong style={{ fontSize: '8pt', color: '#0f172a' }}>{patientLives}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 2. Diagnosed Condition */}
            <div className="print-section" style={{ marginBottom: '12px', padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '8pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.3px' }}>
                  Diagnosed Condition
                </strong>
                <span style={{ fontSize: '7.5pt', fontWeight: 800, color: isNormal ? '#0284c7' : '#b91c1c' }}>
                  {gist.name} ({gist.code}) • {gist.severity}
                </span>
              </div>
              <strong style={{ fontSize: '8.5pt', color: '#0f172a', display: 'block', marginBottom: '3px' }}>
                {patientGist.title}
              </strong>
              <p style={{ fontSize: '7.8pt', lineHeight: 1.45, color: '#334155', margin: 0 }}>
                {patientGist.explanation}
              </p>
            </div>

            {/* 3. Cardiovascular Risk Score */}
            <div className="print-section" style={{ marginBottom: '12px', padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '8pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.3px' }}>
                  Cardiovascular Risk Score
                </strong>
                <span style={{ fontSize: '7.5pt', fontWeight: 800, color: activeTierConfig.color }}>
                  Score: {score} / 100 • {activeTierConfig.tier}
                </span>
              </div>
              <p style={{ fontSize: '7.8pt', lineHeight: 1.45, color: '#334155', margin: 0 }}>
                Computed from acoustic murmur intensity combined with patient age and demographic factors.
                {riskStratification?.clinical_action ? ` Recommended follow-up: ${riskStratification.clinical_action}` : ''}
              </p>
            </div>

            {/* 4. Further Procedure & Next Steps */}
            <div className="print-section" style={{ marginBottom: '12px', padding: '10px 14px' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '8pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.3px' }}>
                  Further Procedure & Next Steps
                </strong>
              </div>
              <table className="print-table" style={{ margin: 0 }}>
                <tbody>
                  {patientGist.procedures.map((proc, idx) => (
                    <tr key={idx}>
                      <td style={{ width: '5%', verticalAlign: 'top', fontWeight: 800, color: '#0f172a', fontSize: '7.5pt', padding: '5px 7px' }}>
                        {idx + 1}.
                      </td>
                      <td style={{ width: '95%', padding: '5px 7px' }}>
                        <strong style={{ fontSize: '7.5pt', color: '#0f172a', display: 'block' }}>{proc.title}</strong>
                        <span style={{ fontSize: '7pt', color: '#475569', lineHeight: 1.35 }}>{proc.detail}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print Footer */}
            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '6px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt', color: '#64748b' }}>
              <div>
                <strong>Evidence Grounding:</strong> 2020 ACC/AHA Valvular Heart Disease Guidelines • Bring to your cardiologist appointment.
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Mandate:</strong> Formal Doppler Echocardiography & Cardiologist Evaluation Required
              </div>
            </div>

          </div>
        ) : (
          <div className="print-page">
            
            {/* Clinical Letterhead Header */}
            <div style={{ borderBottom: '2.5px solid #0f172a', paddingBottom: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '7pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>
                  Clinical Decision Support System (CDSS)
                </div>
                <div style={{ fontSize: '12pt', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', lineHeight: 1.1 }}>
                  Cardiology Consultation & Diagnostic Report (Doctor View)
                </div>
                <div style={{ fontSize: '7pt', color: '#475569', fontWeight: 500, marginTop: '2px' }}>
                  Multimodal Precordial Phonocardiography • ACC/AHA 2020 Valvular Heart Disease Guidelines
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '7pt', fontWeight: 800, border: '1px solid #0f172a', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                  ACC/AHA 2020 Grounded
                </span>
                <div style={{ fontSize: '6.5pt', color: '#64748b', marginTop: '3px', fontFamily: 'monospace' }}>
                  Ref: CDSS-{gist.code}-{Date.now().toString(36).slice(-5).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Patient & Auscultation Metadata Table */}
            <table className="print-table" style={{ marginBottom: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '25%', padding: '5px 8px' }}>
                    <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Primary Assessment</span>
                    <strong style={{ fontSize: '8pt', color: '#0f172a' }}>{gist.name} ({gist.code})</strong>
                    <span style={{ fontSize: '6.5pt', display: 'block', color: isNormal ? '#0284c7' : '#b91c1c', fontWeight: 700 }}>{gist.severity}</span>
                  </td>
                  <td style={{ width: '25%', padding: '5px 8px' }}>
                    <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Patient Profile</span>
                    <strong style={{ fontSize: '7.5pt', color: '#0f172a' }}>{patientName} ({patientAge}y {patientGender === 'Female' ? 'F' : 'M'})</strong>
                    <span style={{ fontSize: '6.5pt', display: 'block', color: '#475569' }}>
                      {patientSmoker} • {patientLives}
                    </span>
                  </td>
                  <td style={{ width: '25%', padding: '5px 8px' }}>
                    <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Acoustic Landmark</span>
                    <strong style={{ fontSize: '7.5pt', color: '#0f172a' }}>{peakSite?.slot_label || 'Pulmonic Area'}</strong>
                    <span style={{ fontSize: '6.5pt', display: 'block', color: '#475569' }}>Posture: {(peakSite?.posture || patientMetadata.posture || 'Supine').toUpperCase()}</span>
                  </td>
                  <td style={{ width: '25%', padding: '5px 8px' }}>
                    <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Review Status</span>
                    <strong style={{ fontSize: '7.5pt', color: '#0f172a' }}>{new Date().toLocaleDateString()}</strong>
                    <span style={{ fontSize: '6.5pt', display: 'block', color: '#059669', fontWeight: 700 }}>Verified by CDSS</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Section 01: Clinical Impression & Primary Finding */}
            <div className="print-section" style={{ marginBottom: '10px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '5px' }}>
                <strong style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.4px' }}>
                  01 • Clinical Impression & Primary Assessment
                </strong>
                <span style={{ fontSize: '6.5pt', fontWeight: 700, color: isNormal ? '#0284c7' : '#b91c1c' }}>{gist.severity}</span>
              </div>
              <p style={{ fontSize: '7.2pt', lineHeight: 1.4, color: '#1e293b', margin: 0 }}>
                {gist.impression}
              </p>
            </div>

            {/* Section 02: Phonocardiographic Acoustic Evidence */}
            <div className="print-section" style={{ marginBottom: '10px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '5px' }}>
                <strong style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.4px' }}>
                  02 • Phonocardiographic & Auscultatory Evidence
                </strong>
                <span style={{ fontSize: '6.5pt', color: '#64748b', fontFamily: 'monospace' }}>4,000 Hz Precordial Sampling</span>
              </div>
              <table className="print-table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%' }}>
                      <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Murmur Character</span>
                      <span style={{ fontSize: '7pt', color: '#0f172a', fontWeight: 600 }}>{gist.acoustics[0]?.value}</span>
                    </td>
                    <td style={{ width: '50%' }}>
                      <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Acoustic Timing</span>
                      <span style={{ fontSize: '7pt', color: '#0f172a', fontWeight: 600 }}>{gist.acoustics[1]?.value}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '50%' }}>
                      <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Acoustic Epicenter</span>
                      <span style={{ fontSize: '7pt', color: '#0f172a', fontWeight: 600 }}>{gist.acoustics[2]?.value}</span>
                    </td>
                    <td style={{ width: '50%' }}>
                      <span style={{ fontSize: '6pt', textTransform: 'uppercase', color: '#64748b', display: 'block', fontWeight: 700 }}>Postural Dynamics</span>
                      <span style={{ fontSize: '7pt', color: '#0f172a', fontWeight: 600 }}>{gist.acoustics[3]?.value}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 03: Hemodynamic Pathophysiology & ACC/AHA 2020 Staging */}
            <div className="print-section" style={{ marginBottom: '10px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.4px' }}>
                  03 • Hemodynamic Pathophysiology & ACC/AHA 2020 Staging
                </strong>
                <span style={{ fontSize: '6.5pt', fontWeight: 700, color: '#92400e' }}>Hemodynamic Staging</span>
              </div>

              <div style={{ marginBottom: '6px', fontSize: '7pt', color: '#1e293b', background: '#fffbeb', border: '1px solid #fef3c7', padding: '4px 6px', borderRadius: '4px', lineHeight: 1.35 }}>
                <strong style={{ color: '#78350f', fontSize: '6.5pt', textTransform: 'uppercase' }}>Physical Impact on Blood Flow: </strong>
                {gist.mechanics}
              </div>

              <table className="print-table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    {gist.staging.map((s, idx) => (
                      <td key={idx} style={{ width: gist.staging.length === 1 ? '100%' : '25%' }}>
                        <strong style={{ fontSize: '6.5pt', color: '#0f172a', display: 'block', marginBottom: '2px' }}>{s.stage}</strong>
                        <span style={{ fontSize: '6.5pt', color: '#475569', lineHeight: 1.3 }}>{s.detail}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '6px', padding: '4px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt' }}>
                <span style={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Key Doppler Benchmarks:</span>
                {gist.benchmarks.map((b, idx) => (
                  <span key={idx} style={{ color: '#0f172a' }}>
                    <strong>{b.label}:</strong> {b.value}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 04: Differential Considerations */}
            <div className="print-section" style={{ marginBottom: '10px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.4px' }}>
                  04 • Differential Considerations (Conditions Evaluated & Ruled Out)
                </strong>
                <span style={{ fontSize: '6.5pt', fontWeight: 700, color: '#6b21a8' }}>Rule-Out Diagnostics</span>
              </div>

              <table className="print-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: '28%' }}>Evaluated Lookalike Condition</th>
                    <th style={{ width: '36%' }}>Why It Acoustically Mimics</th>
                    <th style={{ width: '36%' }}>How Clinicians Rule It Out</th>
                  </tr>
                </thead>
                <tbody>
                  {gist.differentials.map((diff, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ fontSize: '7pt', color: '#0f172a' }}>{idx + 1}. {diff.name}</strong>
                      </td>
                      <td style={{ fontSize: '6.5pt', color: '#475569' }}>{diff.mimic}</td>
                      <td style={{ fontSize: '6.5pt', color: '#0f172a', fontWeight: 600 }}>{diff.distinction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 05: Guideline-Directed Workup */}
            <div className="print-section" style={{ marginBottom: '10px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
                <strong style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.4px' }}>
                  05 • Guideline-Directed Workup & Next Steps
                </strong>
                <span style={{ fontSize: '6.5pt', fontWeight: 700, color: '#047857' }}>Action Plan</span>
              </div>

              <table className="print-table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%' }}>
                      <strong style={{ fontSize: '7pt', color: '#0f172a', display: 'block' }}>{gist.workup[0]?.step}</strong>
                      <span style={{ fontSize: '6.5pt', color: '#475569', lineHeight: 1.25 }}>{gist.workup[0]?.detail}</span>
                    </td>
                    <td style={{ width: '50%' }}>
                      <strong style={{ fontSize: '7pt', color: '#0f172a', display: 'block' }}>{gist.workup[1]?.step}</strong>
                      <span style={{ fontSize: '6.5pt', color: '#475569', lineHeight: 1.25 }}>{gist.workup[1]?.detail}</span>
                    </td>
                  </tr>
                  {gist.workup.length > 2 && (
                    <tr>
                      <td style={{ width: '50%' }}>
                        <strong style={{ fontSize: '7pt', color: '#0f172a', display: 'block' }}>{gist.workup[2]?.step}</strong>
                        <span style={{ fontSize: '6.5pt', color: '#475569', lineHeight: 1.25 }}>{gist.workup[2]?.detail}</span>
                      </td>
                      <td style={{ width: '50%' }}>
                        <strong style={{ fontSize: '7pt', color: '#0f172a', display: 'block' }}>{gist.workup[3]?.step}</strong>
                        <span style={{ fontSize: '6.5pt', color: '#475569', lineHeight: 1.25 }}>{gist.workup[3]?.detail}</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Medical Consultation Mandate Callout Box */}
            <div style={{ border: '1px solid #d97706', background: '#fffbeb', borderRadius: '4px', padding: '6px 10px', marginTop: '8px', marginBottom: '4px' }}>
              <strong style={{ fontSize: '6.5pt', color: '#92400e', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Clinical Consultation & Decision Support Mandate:
              </strong>
              <p style={{ fontSize: '6.5pt', lineHeight: 1.3, color: '#78350f', margin: 0 }}>
                This report provides automated screening decision support derived from digitized phonocardiography and 2020 ACC/AHA Valvular Heart Disease Guidelines. It is designed to inform and assist clinical discussion with an attending physician, <strong>not to replace an in-person physical consultation with a licensed cardiologist</strong>. Definitive diagnosis, hemodynamic staging, and treatment planning require a formal comprehensive Doppler echocardiogram.
              </p>
            </div>

            {/* Formal Attestation Footer */}
            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '6px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '6pt', color: '#64748b' }}>
              <div>
                <strong>Evidence Grounding:</strong> 2020 ACC/AHA Valvular Heart Disease Guidelines (Circulation 2021; 143:e72–e227) • 8-Site Phonocardiography
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Mandate:</strong> Formal Doppler Echocardiography & Cardiologist Evaluation Required
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}