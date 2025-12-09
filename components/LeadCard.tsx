import React, { useState } from 'react';
import { Lead } from '../types';
import { generateOutreachEmail } from '../services/gemini';
import { User, MapPin, Building2, ChevronDown, ChevronUp, Mail, Phone, ExternalLink, Target, Zap, X, Copy, RefreshCw, Send, ClipboardCheck, Edit3, Bookmark, Star, Map } from 'lucide-react';
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
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`} 
          />
        ))}
        <span className="text-zinc-300 text-sm ml-2 font-medium">{rating}</span>
        <span className="text-zinc-500 text-xs ml-1">({lead.reviewCount})</span>
      </div>
    );
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
      <div className={`bg-[#1c1c1e] border ${isSaved ? 'border-cyan-500/50 shadow-[0_0_20px_-10px_rgba(6,182,212,0.3)]' : 'border-white/5'} rounded-[2rem] overflow-hidden hover:bg-[#252527] transition-all duration-300 group`}>
        {/* Header Summary */}
        <div className="p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start gap-5 flex-1 w-full">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-zinc-300 font-bold text-xl shrink-0 border border-white/5">
              {lead.companyName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2 truncate">
                {lead.companyName}
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                </a>
              </h3>
              {/* Google Maps Metadata */}
              <div className="flex items-center gap-4 mt-2 mb-2 flex-wrap">
                 {renderStars(lead.googleRating)}
                 <div className="hidden sm:block w-px h-3 bg-zinc-700"></div>
                 <div className="flex items-center gap-1 text-zinc-400 text-sm truncate max-w-full">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="truncate">{lead.address}</span>
                 </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md"><Building2 className="w-3 h-3" /> {lead.industry}</span>
                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md"><User className="w-3 h-3" /> {lead.size}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Score */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0 mt-2 lg:mt-0">
             {/* Bookmark Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(lead.id); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSaved ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
                title={isSaved ? "Remove from Saved" : "Save Lead"}
             >
               <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
             </button>

             <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">SCORE</div>
                  <div className={`text-2xl font-bold px-3 py-1 rounded-lg border ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                </div>
                {expanded ? <ChevronUp className="w-6 h-6 text-zinc-500" /> : <ChevronDown className="w-6 h-6 text-zinc-500" />}
             </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t border-white/5 bg-black/20 p-6 md:p-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Decision Maker */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" /> Decision Maker
                </h4>
                <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 h-full relative overflow-hidden group/card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div className="relative z-10">
                    <div className="font-bold text-white text-xl mb-1">{lead.decisionMaker.name}</div>
                    <div className="text-cyan-400 text-sm font-medium mb-6 uppercase tracking-wide">{lead.decisionMaker.role}</div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer group/email p-2 -ml-2 rounded-lg hover:bg-white/5" onClick={handleGenerateEmail}>
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                           <Mail className="w-4 h-4 text-zinc-400 group-hover/email:text-cyan-400 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500">Email Address</span>
                            <span className="truncate font-mono">{lead.decisionMaker.email}</span>
                        </div>
                      </div>

                      {lead.phone && (
                         <div className="flex items-center gap-3 text-sm text-zinc-300 p-2 -ml-2">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div className="flex flex-col">
                              <span className="text-xs text-zinc-500">Phone Number</span>
                              <span>{lead.phone}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm text-zinc-300 p-2 -ml-2 border-t border-white/5 mt-2 pt-4">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                            <Map className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                              <span className="text-xs text-zinc-500">Headquarters</span>
                              <span className="truncate" title={lead.address}>{lead.address}</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Intelligence & Radar */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Intelligence Report</h4>
                <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 p-6 h-full flex flex-col">
                    <p className="text-zinc-300 text-sm leading-relaxed bg-black/30 p-4 rounded-2xl border border-white/5 italic mb-4">
                    "{lead.reason}"
                    </p>
                    
                    <div className="flex-1 w-full relative min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={breakdownData}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Lead"
                            dataKey="A"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.3}
                        />
                        </RadarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
              </div>

              {/* Column 3: Visual Score & Actions */}
              <div className="flex flex-col space-y-4">
                <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 p-6 flex flex-col items-center justify-center flex-1 min-h-[250px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
                    <div className="h-48 w-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={scoreData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                            paddingAngle={5}
                        >
                            <Cell fill={lead.score >= 80 ? '#34d399' : lead.score >= 60 ? '#facc15' : '#f87171'} />
                            <Cell fill="#27272a" />
                        </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-bold text-white tracking-tighter">{lead.score}</span>
                        <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Match</span>
                    </div>
                    </div>
                </div>
                
                <button 
                  onClick={handleGenerateEmail}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] ${lead.score > 70 ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
                >
                  <Zap className="w-5 h-5" />
                  Generate Outreach
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Smart Outreach Generator
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 relative bg-[#1c1c1e]">
              {isGeneratingEmail ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-cyan-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium animate-pulse">Drafting professional outreach for {lead.decisionMaker.name}...</p>
                </div>
              ) : emailData ? (
                <div className="space-y-6">
                  {/* Email Header Fields */}
                  <div className="bg-black rounded-2xl border border-white/10 overflow-hidden">
                    <div className="flex items-center border-b border-white/10 p-4">
                       <span className="text-zinc-500 w-20 text-sm font-medium shrink-0">To:</span>
                       <span className="text-zinc-300 text-sm font-mono truncate">{lead.decisionMaker.email}</span>
                    </div>
                    <div className="flex items-center p-4 relative group focus-within:bg-zinc-900 transition-colors">
                       <span className="text-zinc-500 w-20 text-sm font-medium shrink-0">Subject:</span>
                       <input 
                         type="text"
                         value={emailData.subject}
                         onChange={(e) => updateEmailField('subject', e.target.value)}
                         className="bg-transparent text-white text-sm font-medium flex-1 outline-none placeholder-zinc-700"
                         placeholder="Subject line..."
                       />
                       <button 
                         onClick={() => handleCopy(emailData.subject, 'subject')}
                         className="p-2 text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                      className="w-full bg-black rounded-2xl border border-white/10 p-6 text-zinc-300 text-sm leading-relaxed min-h-[350px] font-sans outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-y"
                      placeholder="Email body content..."
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <div className="pointer-events-none px-3 py-1.5 bg-zinc-900/80 rounded-full text-[10px] text-zinc-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/5 uppercase font-bold tracking-wider">
                         <Edit3 className="w-3 h-3" />
                         Editable
                       </div>
                       <button 
                          onClick={() => handleCopy(emailData.body, 'body')}
                          className="p-2 bg-zinc-900/80 hover:bg-cyan-500/10 text-zinc-500 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/50 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                          title="Copy Body"
                       >
                          {copiedField === 'body' ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-400 p-8">Failed to generate content. Please try again.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button 
                onClick={() => { setIsGeneratingEmail(true); setEmailData(null); handleGenerateEmail(); }}
                className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={isGeneratingEmail}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <button 
                onClick={() => handleCopy(`Subject: ${emailData?.subject}\n\n${emailData?.body}`, 'all')}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors text-sm font-semibold flex items-center gap-2"
                disabled={isGeneratingEmail || !emailData}
              >
                {copiedField === 'all' ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                Copy All
              </button>
              <button 
                onClick={() => {
                   const mailto = `mailto:${lead.decisionMaker.email}?subject=${encodeURIComponent(emailData?.subject || '')}&body=${encodeURIComponent(emailData?.body || '')}`;
                   window.open(mailto, '_blank');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] text-white transition-colors text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                disabled={isGeneratingEmail || !emailData}
              >
                <Send className="w-4 h-4" />
                Open Mail App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};