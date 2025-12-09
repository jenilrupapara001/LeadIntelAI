import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Zap } from 'lucide-react';
import { SearchParams } from '../types';

interface LeadFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSearch, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    industry: 'SaaS',
    location: 'San Francisco, CA',
    service: 'SEO & Content Marketing'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Find Your Perfect Client</h1>
        <p className="text-slate-400">AI-Powered Lead Scraping, Verification & Scoring</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Target Industry (e.g. Dental, Tech)"
            value={params.industry}
            onChange={(e) => setParams({ ...params, industry: e.target.value })}
            required
          />
          <label className="absolute -top-2.5 left-3 bg-slate-800 px-1 text-xs text-cyan-500 font-medium">Industry</label>
        </div>

        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Location (e.g. Austin, TX)"
            value={params.location}
            onChange={(e) => setParams({ ...params, location: e.target.value })}
            required
          />
          <label className="absolute -top-2.5 left-3 bg-slate-800 px-1 text-xs text-purple-500 font-medium">Location</label>
        </div>

        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Zap className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Service to Sell (e.g. Web Design)"
            value={params.service}
            onChange={(e) => setParams({ ...params, service: e.target.value })}
            required
          />
          <label className="absolute -top-2.5 left-3 bg-slate-800 px-1 text-xs text-emerald-500 font-medium">Intent / Service</label>
        </div>

        <div className="md:col-span-12 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>Scanning Networks...</>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Initialize Lead Scan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
