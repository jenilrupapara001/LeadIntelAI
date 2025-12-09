import React, { useState } from 'react';
import { Lead } from '../types';
import { generateOutreachEmail } from '../services/gemini';
import { User, MapPin, Building2, ChevronDown, ChevronUp, Mail, Phone, Linkedin, ExternalLink, Target, Zap, X, Copy, RefreshCw, Send, ClipboardCheck, Edit3, Bookmark } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface LeadCardProps {
  lead: Lead;
  serviceName: string;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, serviceName, isSaved = false, onToggleSave }) => {
  const [expanded, setExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState<{subject: string, body: string} | null>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | 'all' | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/50 shadow-emerald-900/20';
    if (score >= 60) return 'text-yellow-400 border-yellow-500/50 shadow-yellow-900/20';
    return 'text-red-400 border-red-500/50 shadow-red-900/20';
  };

  const scoreData = [
    { name: 'Score', value: lead.score },
    { name: 'Remaining', value: 100 - lead.score }
  ];

  const breakdownData = [
    { subject: 'Presence', A: lead.scoreBreakdown?.onlinePresence || 0, fullMark: 100 },
    { subject: 'Website', A: lead.scoreBreakdown?.websiteQuality || 0, fullMark: 100 },
    { subject: 'SEO', A: lead.scoreBreakdown?.seoIssues || 0, fullMark: 100 },
    { subject: 'Growth', A: lead.scoreBreakdown?.growthSignals || 0, fullMark: 100 },
    { subject: 'Fit', A: lead.scoreBreakdown?.relevancy || 0, fullMark: 100 },
  ];

  const handleGenerateEmail = async () => {
    setShowEmailModal(true);
    if (!emailData) {
      setIsGeneratingEmail(true);
      const data = await generateOutreachEmail(lead, serviceName);
      setEmailData(data);
      setIsGeneratingEmail(false);
    }
  };

  const handleCopy = (text: string, type: 'subject' | 'body' | 'all') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const updateEmailField = (field: 'subject' | 'body', value: string) => {
    if (emailData) {
      setEmailData({ ...emailData, [field]: value });
    }
  };

  return (
    <>
      <div className={`bg-slate-800/50 border ${isSaved ? 'border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]' : 'border-slate-700'} rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 shadow-lg group`}>
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
             {/* Bookmark Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(lead.id); }}
                className={`p-2 rounded-lg transition-all ${isSaved ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-600 hover:text-cyan-400 hover:bg-slate-800'}`}
                title={isSaved ? "Remove from Saved" : "Save Lead"}
             >
               <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
             </button>

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
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 h-full">
                  <div className="font-medium text-white text-lg">{lead.decisionMaker.name}</div>
                  <div className="text-cyan-400 text-sm mb-3">{lead.decisionMaker.role}</div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer group/email" onClick={handleGenerateEmail}>
                      <Mail className="w-4 h-4 text-slate-500 group-hover/email:text-cyan-400" />
                      <span className="truncate">{lead.decisionMaker.email}</span>
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded ml-auto opacity-0 group-hover/email:opacity-100 transition-opacity">Draft</span>
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

              {/* Column 2: Intelligence & Radar */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Intelligence Report</h4>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-700/20 p-3 rounded border border-slate-700/30">
                  "{lead.reason}"
                </p>
                
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={breakdownData}>
                      <PolarGrid stroke="#475569" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Lead"
                        dataKey="A"
                        stroke="#06b6d4"
                        fill="#06b6d4"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Column 3: Visual Score & Actions */}
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
                <button 
                  onClick={handleGenerateEmail}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${lead.score > 70 ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  <Zap className="w-4 h-4" />
                  Generate Outreach
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                AI Outreach Generator
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 relative">
              {isGeneratingEmail ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-slate-400 text-sm animate-pulse">Drafting professional outreach for {lead.decisionMaker.name}...</p>
                </div>
              ) : emailData ? (
                <div className="space-y-4">
                  {/* Email Header Fields */}
                  <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                    <div className="flex items-center border-b border-slate-800 p-3">
                       <span className="text-slate-500 w-20 text-sm font-medium shrink-0">To:</span>
                       <span className="text-slate-300 text-sm font-mono truncate">{lead.decisionMaker.email}</span>
                    </div>
                    <div className="flex items-center p-3 relative group focus-within:bg-slate-900 transition-colors">
                       <span className="text-slate-500 w-20 text-sm font-medium shrink-0">Subject:</span>
                       <input 
                         type="text"
                         value={emailData.subject}
                         onChange={(e) => updateEmailField('subject', e.target.value)}
                         className="bg-transparent text-white text-sm font-medium flex-1 outline-none placeholder-slate-600"
                         placeholder="Subject line..."
                       />
                       <button 
                         onClick={() => handleCopy(emailData.subject, 'subject')}
                         className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded transition-all opacity-0 group-hover:opacity-100"
                         title="Copy Subject"
                       >
                         {copiedField === 'subject' ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>

                  {/* Email Body - Textarea for Editing */}
                  <div className="relative group">
                    <textarea
                      value={emailData.body}
                      onChange={(e) => updateEmailField('body', e.target.value)}
                      className="w-full bg-slate-950 rounded-lg border border-slate-800 p-6 text-slate-300 text-sm leading-relaxed min-h-[300px] font-sans outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-y"
                      placeholder="Email body content..."
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                       <div className="pointer-events-none px-2 py-1 bg-slate-900/50 rounded text-xs text-slate-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                         <Edit3 className="w-3 h-3" />
                         Editable
                       </div>
                       <button 
                          onClick={() => handleCopy(emailData.body, 'body')}
                          className="p-2 bg-slate-900/80 hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/50 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                          title="Copy Body"
                       >
                          {copiedField === 'body' ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-400">Failed to generate content. Please try again.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3">
              <button 
                onClick={() => { setIsGeneratingEmail(true); setEmailData(null); handleGenerateEmail(); }}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={isGeneratingEmail}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <button 
                onClick={() => handleCopy(`Subject: ${emailData?.subject}\n\n${emailData?.body}`, 'all')}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm font-medium flex items-center gap-2"
                disabled={isGeneratingEmail || !emailData}
              >
                {copiedField === 'all' ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                Copy Full Email
              </button>
              <button 
                onClick={() => {
                   const mailto = `mailto:${lead.decisionMaker.email}?subject=${encodeURIComponent(emailData?.subject || '')}&body=${encodeURIComponent(emailData?.body || '')}`;
                   window.open(mailto, '_blank');
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors text-sm font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                disabled={isGeneratingEmail || !emailData}
              >
                <Send className="w-4 h-4" />
                Open Email Client
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};