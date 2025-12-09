
import React, { useState } from 'react';
import { LeadForm } from './components/LeadForm';
import { ScanLoader } from './components/ScanLoader';
import { Dashboard } from './components/Dashboard';
import { Documentation } from './components/Documentation';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Legal } from './components/Legal';
import { Lead, SearchParams, ScanStatus } from './types';
import { generateLeads } from './services/gemini';
import { Cpu, ShieldCheck, LayoutGrid, BookOpen, Globe, Info, Mail, Menu, X } from 'lucide-react';

type ViewState = 'app' | 'docs' | 'about' | 'contact' | 'privacy' | 'terms';

const App = () => {
  const [status, setStatus] = useState<ScanStatus['step']>('idle');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentService, setCurrentService] = useState('');
  const [currentView, setCurrentView] = useState<ViewState>('app');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setStatus('searching');
    setError(null);
    setCurrentService(params.service);
    
    // Artificial delay to show the scanning animation for effect
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
    <button 
      onClick={onClick}
      className={`text-[15px] cursor-pointer transition-all px-4 py-2 rounded-full flex items-center gap-2 ${active ? 'bg-white/10 text-white font-medium backdrop-blur-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      {label}
    </button>
  );

  const MobileNavItem = ({ label, active, onClick, icon }: { label: string, active?: boolean, onClick: () => void, icon?: React.ReactNode }) => (
    <button 
      onClick={() => { onClick(); setIsMobileMenuOpen(false); }}
      className={`w-full text-left text-xl py-4 border-b border-white/5 flex items-center gap-4 ${active ? 'text-white font-bold' : 'text-zinc-400 font-medium'}`}
    >
      <div className={`p-2 rounded-lg ${active ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-zinc-500'}`}>
        {icon}
      </div>
      {label}
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'docs':
        return <Documentation onClose={() => setCurrentView('app')} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <Legal type="privacy" />;
      case 'terms':
        return <Legal type="terms" />;
      case 'app':
      default:
        return (
          <>
            {status === 'idle' && (
              <div className="animate-fadeIn w-full">
                <LeadForm onSearch={handleSearch} isLoading={false} />
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 max-w-[1400px] mx-auto">
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
              <div className="max-w-2xl mx-auto mt-20 px-4">
                <ScanLoader message={status === 'searching' ? 'SCANNING MAPS DIRECTORY...' : 'CALCULATING LEAD SCORES...'} />
              </div>
            )}

            {status === 'complete' && (
              <Dashboard leads={leads} onReset={resetSearch} service={currentService} />
            )}

            {status === 'error' && (
               <div className="text-center mt-32">
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
                    <ShieldCheck className="w-8 h-8 text-red-500" />
                 </div>
                 <div className="text-white text-2xl font-bold mb-3">Connection Error</div>
                 <p className="text-zinc-400 mb-8 max-w-md mx-auto">{error}</p>
                 <button onClick={resetSearch} className="px-8 py-3 bg-white text-black font-semibold hover:bg-zinc-200 rounded-full transition-colors shadow-lg">
                   Return to Console
                 </button>
               </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col overflow-x-hidden">
      {/* Navigation - iOS Style Blurred Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('app'); if(status !== 'idle' && currentView === 'app') { /* stay */ } else if (currentView !== 'app') { resetSearch(); } }}>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                LeadIntel
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-2">
              <NavItem 
                label="Scanner" 
                active={currentView === 'app'} 
                onClick={() => setCurrentView('app')} 
                icon={<LayoutGrid className="w-4 h-4" />}
              />
              <NavItem 
                label="Docs" 
                active={currentView === 'docs'} 
                onClick={() => setCurrentView('docs')} 
                icon={<BookOpen className="w-4 h-4" />}
              />
              <NavItem 
                label="About" 
                active={currentView === 'about'} 
                onClick={() => setCurrentView('about')} 
                icon={<Info className="w-4 h-4" />}
              />
               <NavItem 
                label="Contact" 
                active={currentView === 'contact'} 
                onClick={() => setCurrentView('contact')} 
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-white/5 text-[11px] font-bold tracking-wider text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SECURE
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <MobileNavItem 
              label="Lead Scanner" 
              active={currentView === 'app'} 
              onClick={() => setCurrentView('app')} 
              icon={<LayoutGrid className="w-5 h-5" />}
            />
            <MobileNavItem 
              label="Documentation" 
              active={currentView === 'docs'} 
              onClick={() => setCurrentView('docs')} 
              icon={<BookOpen className="w-5 h-5" />}
            />
            <MobileNavItem 
              label="About Us" 
              active={currentView === 'about'} 
              onClick={() => setCurrentView('about')} 
              icon={<Info className="w-5 h-5" />}
            />
            <MobileNavItem 
              label="Contact Support" 
              active={currentView === 'contact'} 
              onClick={() => setCurrentView('contact')} 
              icon={<Mail className="w-5 h-5" />}
            />
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between text-zinc-500 text-sm">
               <span>© 2024 LeadIntel AI</span>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-white/5 text-[11px] font-bold tracking-wider text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SECURE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full Width with safe spacing */}
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow mx-auto">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#09090b] mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-cyan-500" />
                    <span className="text-white font-bold text-lg">LeadIntel</span>
                 </div>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   Next-generation lead intelligence for modern agencies. Powered by advanced network scanning algorithms.
                 </p>
              </div>
              <div>
                 <h4 className="text-white font-semibold mb-4">Product</h4>
                 <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setCurrentView('app')}>Scanner</li>
                    <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setCurrentView('docs')}>Documentation</li>
                    <li className="hover:text-cyan-400 cursor-pointer" onClick={() => setCurrentView('docs')}>API Access</li>
                 </ul>
              </div>
              <div>
                 <h4 className="text-white font-semibold mb-4">Company</h4>
                 <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setCurrentView('about')}>About Us</li>
                    <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setCurrentView('contact')}>Contact</li>
                    <li className="hover:text-cyan-400 cursor-pointer" onClick={() => setCurrentView('about')}>Careers</li>
                 </ul>
              </div>
              <div>
                 <h4 className="text-white font-semibold mb-4">Legal</h4>
                 <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setCurrentView('privacy')}>Privacy Policy</li>
                    <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setCurrentView('terms')}>Terms of Service</li>
                 </ul>
              </div>
           </div>
           <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-zinc-600 text-sm">© 2024 LeadIntel AI. All rights reserved.</p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#1c1c1e] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#2c2c2e] cursor-pointer transition-all" onClick={() => setCurrentView('contact')}>
                    <Globe className="w-4 h-4" />
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#1c1c1e] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#2c2c2e] cursor-pointer transition-all" onClick={() => setCurrentView('contact')}>
                    <Mail className="w-4 h-4" />
                 </div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => (
  <div className="p-8 rounded-[2rem] bg-[#1c1c1e] border border-white/5 hover:bg-[#2c2c2e] transition-colors group">
    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-[15px]">{desc}</p>
  </div>
);

export default App;
