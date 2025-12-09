import React, { useState } from 'react';
import { LeadForm } from './components/LeadForm';
import { ScanLoader } from './components/ScanLoader';
import { Dashboard } from './components/Dashboard';
import { Documentation } from './components/Documentation';
import { Lead, SearchParams, ScanStatus } from './types';
import { generateLeads } from './services/gemini';
import { Cpu, ShieldCheck, LayoutGrid, BookOpen, Globe } from 'lucide-react';

const App = () => {
  const [status, setStatus] = useState<ScanStatus['step']>('idle');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentService, setCurrentService] = useState('');
  const [currentView, setCurrentView] = useState<'app' | 'docs'>('app');

  const handleSearch = async (params: SearchParams) => {
    setStatus('searching');
    setError(null);
    setCurrentService(params.service);
    
    // Artificial delay to show the scanning animation for effect, 
    // since the API might be too fast or too slow.
    const loadingTimer = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const [generatedLeads] = await Promise.all([
        generateLeads(params),
        loadingTimer
      ]);
      
      setStatus('analyzing');
      // Simulate analysis phase
      setTimeout(() => {
        setLeads(generatedLeads);
        setStatus('complete');
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Failed to generate intelligence report. Please check your network connection or API key.");
      setStatus('error');
    }
  };

  const resetSearch = () => {
    setStatus('idle');
    setLeads([]);
    setError(null);
    setCurrentService('');
  };

  const NavItem = ({ label, active, onClick, icon }: { label: string, active?: boolean, onClick: () => void, icon?: React.ReactNode }) => (
    <span 
      onClick={onClick}
      className={`text-sm cursor-pointer transition-colors flex items-center gap-2 ${active ? 'text-white font-medium' : 'text-slate-400 hover:text-white'}`}
    >
      {icon}
      {label}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 pb-20">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2" role="button" onClick={() => { setCurrentView('app'); if(status === 'complete') { /* stay */ } else { resetSearch(); } }}>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 rounded-lg shadow-lg shadow-cyan-500/20">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                LeadIntel
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <NavItem 
                label="Scanner" 
                active={currentView === 'app'} 
                onClick={() => setCurrentView('app')} 
                icon={<LayoutGrid className="w-4 h-4" />}
              />
              <NavItem 
                label="Documentation" 
                active={currentView === 'docs'} 
                onClick={() => setCurrentView('docs')} 
                icon={<BookOpen className="w-4 h-4" />}
              />
              
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 ml-4">
                <ShieldCheck className="w-3 h-3" />
                SECURE CONNECTION
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {currentView === 'docs' ? (
          <Documentation onClose={() => setCurrentView('app')} />
        ) : (
          <>
            {status === 'idle' && (
              <div className="animate-fadeIn">
                <LeadForm onSearch={handleSearch} isLoading={false} />
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                  <FeatureCard 
                    title="Google Maps Extraction"
                    desc="Connects directly to global business directories to find verified local businesses."
                    icon={<Globe className="w-6 h-6 text-purple-400" />}
                  />
                  <FeatureCard 
                    title="Pattern Recognition"
                    desc="Identifies likely decision makers and contact info using domain pattern matching."
                    icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
                  />
                   <FeatureCard 
                    title="Smart Scoring"
                    desc="Algorithmic analysis of review counts, ratings, and website presence."
                    icon={<Cpu className="w-6 h-6 text-cyan-400" />}
                  />
                </div>
              </div>
            )}

            {(status === 'searching' || status === 'analyzing') && (
              <div className="max-w-2xl mx-auto mt-12">
                <ScanLoader message={status === 'searching' ? 'SCANNING MAPS DIRECTORY...' : 'CALCULATING LEAD SCORES...'} />
              </div>
            )}

            {status === 'complete' && (
              <Dashboard leads={leads} onReset={resetSearch} service={currentService} />
            )}

            {status === 'error' && (
               <div className="text-center mt-20">
                 <div className="text-red-500 text-xl font-bold mb-4">Connection Error</div>
                 <p className="text-slate-400 mb-6">{error}</p>
                 <button onClick={resetSearch} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors">
                   Return to Console
                 </button>
               </div>
            )}
          </>
        )}
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default App;