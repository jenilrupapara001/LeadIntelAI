import React from 'react';
import { Target, Zap, Globe, Users, Briefcase } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-6">Empowering Agency Growth</h1>
        <p className="text-xl text-slate-400">
          LeadIntel was built to solve the biggest problem agencies face: finding high-quality clients without wasting hours on manual research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
           <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
           <p className="text-slate-400 leading-relaxed mb-6">
             We believe that data shouldn't just be abundant; it should be actionable. Our mission is to democratize access to enterprise-level lead intelligence, allowing freelancers and agencies to compete with the big players.
           </p>
           <p className="text-slate-400 leading-relaxed">
             By combining real-time directory scanning with algorithmic scoring, we turn cold data into warm opportunities.
           </p>
        </div>
        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-2 rounded-lg"><Target className="w-6 h-6 text-cyan-400"/></div>
                  <div>
                    <h3 className="text-white font-medium">Precision Targeting</h3>
                    <p className="text-sm text-slate-500">Only relevant leads matching your exact criteria.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-2 rounded-lg"><Zap className="w-6 h-6 text-purple-400"/></div>
                  <div>
                    <h3 className="text-white font-medium">Instant Qualification</h3>
                    <p className="text-sm text-slate-500">Scores based on 5+ data points.</p>
                  </div>
               </div>
            </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-center border border-slate-700 mb-20">
         <h2 className="text-2xl font-bold text-white mb-8">The Team</h2>
         <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
               <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400" />
               </div>
               <div className="text-white font-medium">Engineering</div>
            </div>
            <div className="text-center">
               <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-slate-400" />
               </div>
               <div className="text-white font-medium">Data Science</div>
            </div>
         </div>
      </div>

      {/* Careers Section */}
      <div className="border-t border-slate-800 pt-16">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
             <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                   <Briefcase className="w-6 h-6 text-emerald-400" />
                   Join Our Team
                </h2>
                <p className="text-slate-400">Help us build the future of automated sales intelligence.</p>
             </div>
             <button className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
               View Open Roles
             </button>
         </div>
         <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 flex justify-between items-center group hover:border-slate-600 transition-colors cursor-pointer">
               <div>
                  <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">Senior React Developer</h4>
                  <span className="text-xs text-slate-500">Remote • Full-time</span>
               </div>
               <span className="text-slate-400 text-sm">Apply &rarr;</span>
            </div>
             <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800 flex justify-between items-center group hover:border-slate-600 transition-colors cursor-pointer">
               <div>
                  <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">Data Engineer (Python/NLP)</h4>
                  <span className="text-xs text-slate-500">San Francisco • Full-time</span>
               </div>
               <span className="text-slate-400 text-sm">Apply &rarr;</span>
            </div>
         </div>
      </div>
    </div>
  );
};