import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-slate-400">Have questions about our Enterprise plan or API access? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-start gap-4">
              <Mail className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg">Email Us</h3>
                <p className="text-slate-400 mb-2">For general inquiries and support.</p>
                <a href="mailto:support@leadintel.ai" className="text-cyan-400 hover:text-cyan-300">support@leadintel.ai</a>
              </div>
           </div>
           
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-start gap-4">
              <MapPin className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg">Headquarters</h3>
                <p className="text-slate-400">
                  100 Innovation Drive<br/>
                  Suite 500<br/>
                  San Francisco, CA 94105
                </p>
              </div>
           </div>

           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-start gap-4">
              <Phone className="w-6 h-6 text-emerald-400 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg">Sales</h3>
                <p className="text-slate-400">Mon-Fri, 9am - 5pm PST</p>
                <div className="text-white mt-1">+1 (555) 123-4567</div>
              </div>
           </div>
        </div>

        {/* Contact Form */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Work Email</label>
                <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="john@company.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="How can we help you?" required></textarea>
              </div>
              <button 
                type="submit" 
                className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${sent ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                disabled={sent}
              >
                {sent ? (
                  <>Message Sent!</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};