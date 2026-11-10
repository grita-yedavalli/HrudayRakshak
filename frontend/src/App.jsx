import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectTheoryOverview from './components/ProjectTheoryOverview';
import HardwareSection from './components/HardwareSection';
import WorkflowSection from './components/WorkflowSection';
import MetricsSection from './components/MetricsSection';
import DiagnosticStudio from './components/DiagnosticStudio';
import { 
  Heart, 
  Activity, 
  Cpu, 
  GitBranch, 
  BarChart3, 
  Radio, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'hardware', 'workflow', 'metrics', 'studio'
  const [activeCondition, setActiveCondition] = useState('AS');
  
  // Backend data states
  const [overviewData, setOverviewData] = useState(null);
  const [workflowData, setWorkflowData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [signalData, setSignalData] = useState({ raw: [], filtered: [] });
  const [backendStatus, setBackendStatus] = useState('checking');

  const API_BASE = 'http://127.0.0.1:8000';

  // Fetch initial API data from FastAPI backend
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [healthRes, overviewRes, workflowRes, metricsRes] = await Promise.all([
          fetch(`${API_BASE}/api/health`).catch(() => null),
          fetch(`${API_BASE}/api/overview`).catch(() => null),
          fetch(`${API_BASE}/api/workflow`).catch(() => null),
          fetch(`${API_BASE}/api/metrics`).catch(() => null),
        ]);

        if (healthRes && healthRes.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('simulated');
        }

        if (overviewRes && overviewRes.ok) {
          const ov = await overviewRes.json();
          setOverviewData(ov);
        }
        if (workflowRes && workflowRes.ok) {
          const wf = await workflowRes.json();
          setWorkflowData(wf);
        }
        if (metricsRes && metricsRes.ok) {
          const mt = await metricsRes.json();
          setMetricsData(mt);
        }
      } catch (err) {
        console.warn("Backend API not reachable, running with local clinical cache", err);
        setBackendStatus('simulated');
      }
    };

    fetchApiData();
  }, []);



  return (
    <div className="min-h-screen bg-[#ECEEF1] flex flex-col font-sans text-[#18181B] selection:bg-[#F9D1CF] selection:text-[#CF3B32]">
      {/* Top Navigation Bar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        backendStatus={backendStatus} 
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-10">
        
        {/* Page 1: Homepage (Overview & Project Theory) */}
        {activePage === 'home' && (
          <div className="flex flex-col gap-10">
            <HeroSection onNavigate={setActivePage} />
            <ProjectTheoryOverview onNavigate={setActivePage} />
          </div>
        )}

        {/* Dedicated Hardware Setup View */}
        {activePage === 'hardware' && (
          <HardwareSection onLaunchStudio={() => setActivePage('studio')} />
        )}

        {/* Dedicated Workflow Pipeline View */}
        {activePage === 'workflow' && (
          <WorkflowSection workflowData={workflowData} />
        )}

        {/* Dedicated Model Metrics View */}
        {activePage === 'metrics' && (
          <MetricsSection metricsData={metricsData} />
        )}

        {/* Page 2: Diagnostic Studio ("the actual page") */}
        {activePage === 'studio' && (
          <DiagnosticStudio />
        )}

      </main>

      {/* Footer (Hidden during Print/PDF export) */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Multimodal Cardiac Auscultation Intelligence & Clinical Decision Support</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-semibold text-slate-700">Dataset License: CC BY-NC-ND 4.0</span>
            <span>PyTorch 2.14 • FastAPI Backend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
