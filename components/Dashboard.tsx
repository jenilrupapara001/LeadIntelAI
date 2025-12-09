import React, { useState, useMemo } from 'react';
import { Lead } from '../types';
import { LeadCard } from './LeadCard';
import { Download, BarChart2, TrendingUp, Users, Filter, SlidersHorizontal, Search, Bookmark, CheckCircle, MapPin, Briefcase } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  onReset: () => void;
  service: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, onReset, service }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'name_asc'>('score_desc');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [savedLeadIds, setSavedLeadIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedLeadIds);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      showToast("Lead removed from saved");
    } else {
      newSaved.add(id);
      showToast("Lead saved to favorites");
    }
    setSavedLeadIds(newSaved);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Extract unique industries and locations for dropdowns
  const industries = useMemo(() => {
    const all = leads.map(l => l.industry).filter(Boolean);
    return ['All', ...Array.from(new Set(all)).sort()];
  }, [leads]);

  const locations = useMemo(() => {
    const all = leads.map(l => l.location).filter(Boolean);
    return ['All', ...Array.from(new Set(all)).sort()];
  }, [leads]);

  // Filter and Sort Logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const matchesSearch = 
          lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          lead.decisionMaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.industry.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesScore = lead.score >= minScore;
        const matchesSaved = showSavedOnly ? savedLeadIds.has(lead.id) : true;
        const matchesIndustry = selectedIndustry === 'All' || lead.industry === selectedIndustry;
        const matchesLocation = selectedLocation === 'All' || lead.location === selectedLocation;
        
        return matchesSearch && matchesScore && matchesSaved && matchesIndustry && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return b.score - a.score;
        if (sortBy === 'score_asc') return a.score - b.score;
        if (sortBy === 'name_asc') return a.companyName.localeCompare(b.companyName);
        return 0;
      });
  }, [leads, searchTerm, minScore, sortBy, showSavedOnly, savedLeadIds, selectedIndustry, selectedLocation]);

  const avgScore = Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length) || 0;
  const highQualityLeads = leads.filter(l => l.score >= 75).length;

  const downloadCSV = () => {
    const headers = ['Company', 'Address', 'Rating', 'Reviews', 'Website', 'Industry', 'Location', 'Decision Maker', 'Role', 'Email', 'Score', 'Reason'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + leads.map(l => {
          return [
            `"${l.companyName}"`,
            `"${l.address}"`,
            l.googleRating,
            l.reviewCount,
            l.website,
            l.industry,
            `"${l.location}"`,
            `"${l.decisionMaker.name}"`,
            `"${l.decisionMaker.role}"`,
            l.decisionMaker.email,
            l.score,
            `"${l.reason}"`
          ].join(",");
      }).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Exported successfully");
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce-in">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Users className="w-6 h-6 text-blue-400" />}
          label="Total Leads Found"
          value={leads.length.toString()}
          subtext="Verified Companies"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
          label="Avg. Lead Score"
          value={avgScore.toString()}
          subtext="Quality Index"
        />
        <StatCard 
          icon={<BarChart2 className="w-6 h-6 text-purple-400" />}
          label="High Priority"
          value={highQualityLeads.toString()}
          subtext="Score > 75"
        />
        <button 
            onClick={downloadCSV}
            className="h-full bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center transition-all group"
        >
            <Download className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 mb-2 transition-colors" />
            <span className="text-slate-300 font-medium group-hover:text-white">Export CSV</span>
        </button>
      </div>

      {/* Action Bar & Filters */}
      <div className="flex flex-col gap-4 pb-6 border-b border-slate-800">
        
        {/* Row 1: Title & Saved Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div className="flex items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Qualified Opportunities</h2>
                <p className="text-sm text-slate-400">Showing {filteredLeads.length} of {leads.length} leads</p>
            </div>
            
            <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex items-center">
                <button 
                onClick={() => setShowSavedOnly(false)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!showSavedOnly ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                All
                </button>
                <button 
                onClick={() => setShowSavedOnly(true)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${showSavedOnly ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                <Bookmark className="w-3 h-3" />
                Saved ({savedLeadIds.size})
                </button>
            </div>
            </div>
             <button 
                onClick={onReset}
                className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white transition-all whitespace-nowrap"
            >
                New Scan
            </button>
        </div>
        
        {/* Row 2: Detailed Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Filter */}
          <div className="relative group md:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-cyan-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

           {/* Industry Filter */}
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 overflow-hidden relative group">
             <Briefcase className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400 shrink-0" />
             <select 
                className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer w-full appearance-none"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
             >
               {industries.map(ind => (
                   <option key={ind} value={ind} className="bg-slate-900 text-slate-300">{ind}</option>
               ))}
             </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 overflow-hidden relative group">
             <MapPin className="w-4 h-4 text-slate-500 group-focus-within:text-purple-400 shrink-0" />
             <select 
                className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer w-full appearance-none"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
             >
               {locations.map(loc => (
                   <option key={loc} value={loc} className="bg-slate-900 text-slate-300">{loc}</option>
               ))}
             </select>
          </div>

          {/* Min Score Filter */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 overflow-hidden">
             <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
             <select 
                className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer w-full appearance-none"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
             >
               <option value={0} className="bg-slate-900">All Scores</option>
               <option value={50} className="bg-slate-900">Score 50+</option>
               <option value={70} className="bg-slate-900">Score 70+</option>
               <option value={85} className="bg-slate-900">Score 85+</option>
             </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 overflow-hidden">
             <Filter className="w-4 h-4 text-slate-500 shrink-0" />
             <select 
                className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer w-full appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
             >
               <option value="score_desc" className="bg-slate-900">Highest Score</option>
               <option value="score_asc" className="bg-slate-900">Lowest Score</option>
               <option value="name_asc" className="bg-slate-900">Name (A-Z)</option>
             </select>
          </div>

        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4 min-h-[400px]">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              serviceName={service} 
              isSaved={savedLeadIds.has(lead.id)}
              onToggleSave={toggleSave}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
             {showSavedOnly ? (
               <>
                 <Bookmark className="w-12 h-12 mb-4 opacity-20" />
                 <p>You haven't saved any leads yet.</p>
               </>
             ) : (
               <>
                 <Filter className="w-12 h-12 mb-4 opacity-20" />
                 <p>No leads match your current filters.</p>
               </>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-start justify-between relative overflow-hidden group hover:border-slate-600 transition-all">
    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform translate-x-2 -translate-y-2 group-hover:opacity-20 transition-opacity">
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-slate-400 font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wide">{subtext}</div>
    </div>
  </div>
);