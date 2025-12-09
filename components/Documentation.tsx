import React from 'react';
import { ShieldCheck, Cpu, BarChart2, Zap, Mail, ChevronRight } from 'lucide-react';

export const Documentation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fadeIn pb-20">
      {/* Header */}
      <div className="mb-12 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2 mb-4">
           <span className="text-cyan-500 font-mono text-sm uppercase tracking-widest">System Manual</span>
           <ChevronRight className="w-4 h-4 text-slate-600" />
           <span className="text-slate-400 font-mono text-sm uppercase tracking-widest">v2.1.0</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Documentation & Strategy Guide</h1>
        <p className="text-xl text-slate-400 max-w-3xl">
          Learn how LeadIntel AI scouts, scores, and qualifies opportunities, and master the art of the cold outreach using our generated templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-8 sticky top-24 h-fit">
           <div>
             <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
               <Cpu className="w-4 h-4 text-cyan-400" /> Core Technology
             </h3>
             <ul className="space-y-3 text-slate-400 text-sm">
               <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => scrollTo('tech')}>How Scanning Works</li>
               <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => scrollTo('tech')}>Data Verification</li>
             </ul>
           </div>
           
           <div>
             <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
               <BarChart2 className="w-4 h-4 text-purple-400" /> Scoring Legend
             </h3>
             <ul className="space-y-3 text-slate-400 text-sm">
               <li className="hover:text-purple-400 cursor-pointer transition-colors" onClick={() => scrollTo('scoring')}>Score Calculation</li>
               <li className="hover:text-purple-400 cursor-pointer transition-colors" onClick={() => scrollTo('scoring')}>Priority Tiers</li>
             </ul>
           </div>

           <div>
             <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
               <Mail className="w-4 h-4 text-emerald-400" /> Outreach Strategy
             </h3>
             <ul className="space-y-3 text-slate-400 text-sm">
               <li className="hover:text-emerald-400 cursor-pointer transition-colors" onClick={() => scrollTo('outreach')}>PAS Framework</li>
             </ul>
           </div>

            <div>
             <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-slate-400" /> Privacy
             </h3>
             <ul className="space-y-3 text-slate-400 text-sm">
               <li className="hover:text-slate-200 cursor-pointer transition-colors" onClick={() => scrollTo('privacy')}>Data Integrity</li>
             </ul>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-16">
          
          {/* Section: Core Technology */}
          <section id="tech" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg"><Cpu className="w-6 h-6 text-cyan-400" /></div>
              Core Technology
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <p className="text-slate-300 leading-relaxed mb-4">
                LeadIntel operates by interfacing directly with the <strong className="text-white">Google Places API</strong> to fetch real-time data about local businesses. Unlike static databases which are often outdated, our scanner pulls live information including current review counts, ratings, and address verification.
              </p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2">Pattern Recognition Engine</h3>
              <p className="text-slate-400 text-sm">
                 When direct email addresses are not public, our system uses a deterministic pattern matching engine to predict likely contact points (e.g., info@domain.com, hello@domain.com) and verifies the domain's existence.
              </p>
            </div>
          </section>

          {/* Section: Scoring */}
          <section id="scoring" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg"><BarChart2 className="w-6 h-6 text-purple-400" /></div>
              Understanding Lead Scores
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 space-y-8">
              <p className="text-slate-300 leading-relaxed">
                Our proprietary algorithm evaluates potential clients on a 0-100 scale. This isn't just about company size; it's about <span className="text-white font-semibold">propensity to buy</span> the service you are selling.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-2">80 - 100 (Hot Lead)</div>
                  <p className="text-sm text-slate-400">High growth signals, active digital presence but with clear gaps in your specific service area. These companies have budget and intent.</p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <div className="text-yellow-400 font-bold mb-2">60 - 79 (Warm Lead)</div>
                  <p className="text-sm text-slate-400">Established companies. They might have a solution in place, but it's outdated or underperforming. Good targets for "Upgrade" pitches.</p>
                </div>
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
                  <div className="text-red-400 font-bold mb-2">0 - 59 (Cold/Risk)</div>
                  <p className="text-sm text-slate-400">Either too small to afford services or too large/bureaucratic to penetrate easily. Low digital footprint.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Outreach */}
          <section id="outreach" className="scroll-mt-24">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg"><Zap className="w-6 h-6 text-emerald-400" /></div>
              The "PAS" Outreach Framework
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <p className="text-slate-300 mb-6">
                The AI generates emails based on the <strong>Problem-Agitate-Solution</strong> framework. This is statistically proven to outperform generic "Introduction" emails.
              </p>
              
              <div className="space-y-4">
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shrink-0">P</div>
                   <div>
                     <h4 className="text-white font-medium">Problem</h4>
                     <p className="text-slate-400 text-sm">Identify a pain point the prospect is likely facing based on our analysis of their industry and lead score.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shrink-0">A</div>
                   <div>
                     <h4 className="text-white font-medium">Agitate</h4>
                     <p className="text-slate-400 text-sm">Briefly highlight why this problem is dangerous or annoying (e.g., "This usually leads to wasted ad spend...").</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shrink-0">S</div>
                   <div>
                     <h4 className="text-white font-medium">Solution</h4>
                     <p className="text-slate-400 text-sm">Present your service as the specific mechanism that removes the pain. Close with a soft ask.</p>
                   </div>
                 </div>
              </div>
            </div>
          </section>

           {/* Section: Data Privacy */}
          <section id="privacy" className="scroll-mt-24">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg"><ShieldCheck className="w-6 h-6 text-cyan-400" /></div>
              Data Integrity & Usage
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <p className="text-slate-400 text-sm leading-relaxed">
                LeadIntel AI uses real-time simulation and pattern matching to identify decision makers. While we strive for 99% accuracy, we recommend verifying emails before mass-sending. We strictly adhere to public data aggregation policies and do not bypass secure authentication layers.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};