
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Zap, AlertCircle, Mail } from 'lucide-react';
import { SearchParams } from '../types';

interface LeadFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSearch, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    industry: 'SaaS',
    location: 'San Francisco, CA',
    service: 'SEO & Content Marketing',
    email: ''
  });
  
  const [errors, setErrors] = useState<{industry?: string, location?: string, service?: string, email?: string}>({});
  const [touched, setTouched] = useState<{industry?: boolean, location?: boolean, service?: boolean, email?: boolean}>({});

  const validate = () => {
    const newErrors: {industry?: string, location?: string, service?: string, email?: string} = {};
    let isValid = true;

    if (!params.industry.trim()) {
      newErrors.industry = "Industry is required";
      isValid = false;
    } else if (params.industry.length < 2) {
      newErrors.industry = "Industry name too short";
      isValid = false;
    }

    if (!params.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    if (!params.service.trim()) {
      newErrors.service = "Service is required";
      isValid = false;
    }

    if (!params.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
      newErrors.email = "Invalid email address format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof SearchParams) => {
    setTouched({ ...touched, [field]: true });
    // Optional: Validate on blur
    if (params[field]) validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ industry: true, location: true, service: true, email: true });
    
    if (validate()) {
      onSearch(params);
    }
  };

  const getInputClass = (field: keyof SearchParams) => {
    const hasError = errors[field] && touched[field];
    return `block w-full pl-12 pr-4 py-4 bg-[#1c1c1e] border ${hasError ? 'border-red-500/50' : 'border-white/10 focus:border-cyan-500/50'} rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500/20' : 'focus:ring-cyan-500/20'} transition-all text-[17px] shadow-sm backdrop-blur-xl`;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-6 md:p-10 rounded-[2rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Find Your Perfect Client</h1>
          <p className="text-zinc-400 text-lg font-light">AI-Powered Lead Scraping, Verification & Scoring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            
            {/* Industry Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Briefcase className={`h-5 w-5 transition-colors ${errors.industry && touched.industry ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-cyan-400'}`} />
              </div>
              <input
                type="text"
                className={getInputClass('industry')}
                placeholder="Target Industry (e.g. Dental)"
                value={params.industry}
                onChange={(e) => {
                  setParams({ ...params, industry: e.target.value });
                  if (touched.industry) validate();
                }}
                onBlur={() => handleBlur('industry')}
              />
              {errors.industry && touched.industry && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs animate-fadeIn z-10">
                  <AlertCircle className="w-3 h-3" /> {errors.industry}
                </div>
              )}
            </div>

            {/* Location Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <MapPin className={`h-5 w-5 transition-colors ${errors.location && touched.location ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-purple-400'}`} />
              </div>
              <input
                type="text"
                className={getInputClass('location')}
                placeholder="Location (e.g. Austin, TX)"
                value={params.location}
                onChange={(e) => {
                  setParams({ ...params, location: e.target.value });
                  if (touched.location) validate();
                }}
                onBlur={() => handleBlur('location')}
              />
              {errors.location && touched.location && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs animate-fadeIn z-10">
                  <AlertCircle className="w-3 h-3" /> {errors.location}
                </div>
              )}
            </div>

            {/* Service Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Zap className={`h-5 w-5 transition-colors ${errors.service && touched.service ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-emerald-400'}`} />
              </div>
              <input
                type="text"
                className={getInputClass('service')}
                placeholder="Service to Sell (e.g. Web Design)"
                value={params.service}
                onChange={(e) => {
                  setParams({ ...params, service: e.target.value });
                  if (touched.service) validate();
                }}
                onBlur={() => handleBlur('service')}
              />
              {errors.service && touched.service && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs animate-fadeIn z-10">
                  <AlertCircle className="w-3 h-3" /> {errors.service}
                </div>
              )}
            </div>

            {/* Email Input - New Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Mail className={`h-5 w-5 transition-colors ${errors.email && touched.email ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-blue-400'}`} />
              </div>
              <input
                type="email"
                className={getInputClass('email')}
                placeholder="Your Email Address"
                value={params.email}
                onChange={(e) => {
                  setParams({ ...params, email: e.target.value });
                  if (touched.email) validate();
                }}
                onBlur={() => handleBlur('email')}
              />
              {errors.email && touched.email && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 text-red-400 text-xs animate-fadeIn z-10">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </div>
              )}
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#007AFF] hover:bg-[#0062cc] active:scale-[0.99] text-white font-semibold text-[17px] py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning Networks...
                </>
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
    </div>
  );
};
