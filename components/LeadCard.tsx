import React, { useState } from 'react';
import { Lead } from '../types';
import { User, Globe, MapPin, Building2, ChevronDown, ChevronUp, Mail, Phone, Linkedin, ExternalLink, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/50 shadow-emerald-900/20';
    if (score >= 60) return 'text-yellow-400 border-yellow-500/50 shadow-yellow-900/20';
    return 'text-red-400 border-red-500/50 shadow-red-900/20';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scoreData = [
    { name: 'Score', value: lead.score },
    { name: 'Remaining', value: 100 - lead.score }
  ];

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg group`}>
      {/* Header Summary */}
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xl shrink-0">
            {lead.companyName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              {lead.companyName}
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {lead.industry}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.location}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {lead.size}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Score */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
           <div className="flex flex-col items-end">
             <div className="text-xs text-slate-400 font-mono mb-1">LEAD SCORE</div>
             <div className={`text-2xl font-bold font-mono px-3 py-1 rounded border bg-slate-900/50 ${getScoreColor(lead.score)}`}>
               {lead.score}
             </div>
           </div>
           {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-700/50 bg-slate-800/30 p-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Decision Maker */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" /> Decision Maker
              </h4>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <div className="font-medium text-white text-lg">{lead.decisionMaker.name}</div>
                <div className="text-cyan-400 text-sm mb-3">{lead.decisionMaker.role}</div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer group/email">
                    <Mail className="w-4 h-4 text-slate-500 group-hover/email:text-cyan-400" />
                    <span className="truncate">{lead.decisionMaker.email}</span>
                  </div>
                  {lead.phone && (
                     <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.decisionMaker.linkedIn && (
                    <a href={lead.decisionMaker.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Analysis & Reasoning */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Intelligence Report</h4>
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-700/20 p-3 rounded border border-slate-700/30">
                "{lead.reason}"
              </p>
              
              <div className="space-y-3 mt-4">
                 <h5 className="text-xs text-slate-400 font-medium uppercase">Performance Metrics</h5>
                 <div className="space-y-2">
                    <MetricBar label="Online Presence" value={lead.scoreBreakdown?.onlinePresence || 0} />
                    <MetricBar label="Website Quality" value={lead.scoreBreakdown?.websiteQuality || 0} />
                    <MetricBar label="SEO Opportunities" value={lead.scoreBreakdown?.seoIssues || 0} color="bg-orange-500" />
                 </div>
              </div>
            </div>

            {/* Column 3: Visual Score */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-40 w-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={lead.score >= 80 ? '#34d399' : lead.score >= 60 ? '#facc15' : '#f87171'} />
                      <Cell fill="#334155" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">{lead.score}</span>
                  <span className="text-xs text-slate-500 uppercase">Match</span>
                </div>
              </div>
              <button className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${lead.score > 70 ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                {lead.score > 70 ? 'Generate Outreach Email' : 'Review Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricBar = ({ label, value, color = 'bg-cyan-500' }: { label: string, value: number, color?: string }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="w-24 text-slate-400 shrink-0">{label}</span>
    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
    <span className="w-8 text-right text-slate-300">{value}%</span>
  </div>
);