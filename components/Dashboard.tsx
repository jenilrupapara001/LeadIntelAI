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
    <div className="space-y-8 animate-fadeIn relative w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 bg-[#1c1c1e]/90 backdrop-blur-md border border-white/10 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-bounce-in min-w-[300px] justify-center">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Stats Bar - Grid layout for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
            className="h-28 xl:h-auto bg-[#1c1c1e] border border-white/5 hover:border-cyan-500/50 hover:bg-[#2c2c2e] rounded-[2rem] p-6 flex flex-col items-center justify-center transition-all group shadow-sm active:scale-[0.98]"
        >
            <Download className="w-8 h-8 text-zinc-400 group-hover:text-cyan-400 mb-2 transition-colors" />
            <span className="text-zinc-300 font-medium group-hover:text-white">Export CSV</span>
        </button>
      </div>

      {/* Action Bar & Filters */}
      <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
        
        {/* Row 1: Title & Saved Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div className="w-full md:w-auto">
                <h2 className="text-3xl font-bold text-white mb-1">Qualified Opportunities</h2>
                <p className="text-zinc-400">Showing {filteredLeads.length} of {leads.length} leads</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="bg-[#1c1c1e] p-1 rounded-xl border border-white/5 flex items-center">
                  <button 
                  onClick={() => setShowSavedOnly(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showSavedOnly ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                  >
                  All
                  </button>
                  <button 
                  onClick={() => setShowSavedOnly(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${showSavedOnly ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                  >
                  <Bookmark className="w-3.5 h-3.5" />
                  Saved ({savedLeadIds.size})
                  </button>
              </div>
              <button 
                  onClick={onReset}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all whitespace-nowrap"
              >
                  New Scan
              </button>
            </div>
        </div>
        
        {/* Row 2: Detailed Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Search Filter */}
          <div className="relative group sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-cyan-400" />
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              className="block w-full pl-10 pr-3 py-3 bg-[#1c1c1e] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-zinc-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

           {/* Industry Filter */}
           <div className="flex items-center gap-2 bg-[#1c1c1e] px-3 py-3 rounded-xl border border-white/5 overflow-hidden relative group">
             <Briefcase className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 shrink-0" />
             <select 
                className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer w-full appearance-none"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
             >
               {industries.map(ind => (
                   <option key={ind} value={ind} className="bg-[#1c1c1e] text-zinc-300">{ind}</option>
               ))}
             </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 bg-[#1c1c1e] px-3 py-3 rounded-xl border border-white/5 overflow-hidden relative group">
             <MapPin className="w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 shrink-0" />
             <select 
                className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer w-full appearance-none"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
             >
               {locations.map(loc => (
                   <option key={loc} value={loc} className="bg-[#1c1c1e] text-zinc-300">{loc}</option>
               ))}
             </select>
          </div>

          {/* Min Score Filter */}
          <div className="flex items-center gap-2 bg-[#1c1c1e] px-3 py-3 rounded-xl border border-white/5 overflow-hidden">
             <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0" />
             <select 
                className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer w-full appearance-none"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
             >
               <option value={0} className="bg-[#1c1c1e]">All Scores</option>
               <option value={50} className="bg-[#1c1c1e]">Score 50+</option>
               <option value={70} className="bg-[#1c1c1e]">Score 70+</option>
               <option value={85} className="bg-[#1c1c1e]">Score 85+</option>
             </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 bg-[#1c1c1e] px-3 py-3 rounded-xl border border-white/5 overflow-hidden">
             <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
             <select 
                className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer w-full appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
             >
               <option value="score_desc" className="bg-[#1c1c1e]">Highest Score</option>
               <option value="score_asc" className="bg-[#1c1c1e]">Lowest Score</option>
               <option value="name_asc" className="bg-[#1c1c1e]">Name (A-Z)</option>
             </select>
          </div>

        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-6 min-h-[400px]">
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
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
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
  <div className="bg-[#1c1c1e] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between relative overflow-hidden h-28 xl:h-auto hover:bg-[#2c2c2e] transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform translate-x-2 -translate-y-2">
      {icon}
    </div>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-sm text-zinc-400 font-medium">{label}</span>
    </div>
    <div>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium mt-1">{subtext}</div>
    </div>
  </div>
);