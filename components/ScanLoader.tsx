import React from 'react';
import { Scan, Database, Server, Globe, Search } from 'lucide-react';

interface ScanLoaderProps {
  message?: string;
}

export const ScanLoader: React.FC<ScanLoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-slate-900 text-cyan-400 p-8 rounded-xl border border-slate-800">
      <div className="relative mb-8">
        {/* Animated Radar Effect */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative bg-slate-800 p-6 rounded-full border border-cyan-500/30 ring-1 ring-cyan-500/50 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
          <Globe className="w-16 h-16 animate-spin-slow text-cyan-400" />
        </div>
        
        {/* Satellites */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 animate-bounce delay-75">
           <Search className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-8 translate-y-4 animate-bounce delay-150">
           <Database className="w-6 h-6 text-purple-400" />
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-8 translate-y-4 animate-bounce delay-300">
           <Server className="w-6 h-6 text-orange-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
        INTELLIGENCE SCAN ACTIVE
      </h2>
      <div className="flex items-center space-x-2 text-cyan-300/80 font-mono text-sm">
        <Scan className="w-4 h-4 animate-pulse" />
        <span className="uppercase tracking-widest">{message || 'ANALYZING NETWORK DATA...'}</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-loading-bar w-1/2 rounded-full"></div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s infinite linear;
        }
      `}</style>
    </div>
  );
};
