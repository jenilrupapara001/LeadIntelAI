import React from 'react';
import { Lead } from '../types';
import { LeadCard } from './LeadCard';
import { Download, BarChart2, TrendingUp, Users } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ leads, onReset }) => {
  const avgScore = Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length);
  const highQualityLeads = leads.filter(l => l.score >= 75).length;
  const topIndustry = leads[0]?.industry || 'N/A';

  const downloadCSV = () => {
    const headers = ['Company', 'Website', 'Industry', 'Location', 'Decision Maker', 'Role', 'Email', 'Score', 'Reason'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + leads.map(l => {
          return [
            `"${l.companyName}"`,
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
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
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

      {/* Action Bar */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white">Qualified Opportunities</h2>
        <button 
          onClick={onReset}
          className="text-sm text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white transition-all"
        >
          New Search
        </button>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-start justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 transform translate-x-2 -translate-y-2">
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
