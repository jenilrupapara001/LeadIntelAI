import React from 'react';

interface LegalProps {
  type: 'privacy' | 'terms';
}

export const Legal: React.FC<LegalProps> = ({ type }) => {
  return (
    <div className="animate-fadeIn max-w-3xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
        {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      </h1>
      
      <div className="space-y-8 text-slate-300 leading-relaxed">
        {type === 'privacy' ? (
          <>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Data Collection</h2>
              <p>We collect information that you provide directly to us, including when you use our lead generation tools. This includes search parameters and generated lead lists. We do not store credit card information directly.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Use of Information</h2>
              <p>We use the information we collect to operate, maintain, and improve our services, and to communicate with you. We do not sell your personal search history to third parties.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Public Data</h2>
              <p>Our tool aggregates publicly available business information (e.g., Google Maps data). We act as a search engine and do not claim ownership of the underlying business data.</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using LeadIntel AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Usage License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on LeadIntel AI's website for personal, non-commercial transitory viewing only.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Disclaimer</h2>
              <p>The materials on LeadIntel AI's website are provided on an 'as is' basis. LeadIntel AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};