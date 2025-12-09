export interface DecisionMaker {
  name: string;
  role: string;
  email: string;
  linkedIn?: string;
}

export interface ScoreBreakdown {
  onlinePresence: number;
  websiteQuality: number;
  seoIssues: number;
  growthSignals: number;
  relevancy: number;
}

export interface Lead {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  location: string;
  size: string;
  decisionMaker: DecisionMaker;
  phone?: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  reason: string;
}

export interface SearchParams {
  industry: string;
  location: string;
  service: string; // e.g., "SEO", "Web Development"
}

export interface ScanStatus {
  step: 'idle' | 'searching' | 'analyzing' | 'scoring' | 'complete' | 'error';
  message?: string;
}
