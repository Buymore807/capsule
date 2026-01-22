
import React, { useState, useEffect } from 'react';
import Cosmos from './components/Cosmos';
import Timeline from './components/Timeline';
import CapsuleModal from './components/CapsuleModal';
import PurchaseFlow from './components/PurchaseFlow';
import { Capsule } from './types';
import { MOCK_CAPSULES } from './constants';
import { generateStellarSummary } from './services/geminiService';

const App: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>(MOCK_CAPSULES);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [isPurchaseFlowOpen, setIsPurchaseFlowOpen] = useState(false);
  const [stellarSummary, setStellarSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCapsules = capsules.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDate = async (date: string) => {
    setIsLoadingSummary(true);
    // Find capsules for that year/month
    const [y, m] = date.split('-');
    const dateCapsules = capsules.filter(c => {
        const d = new Date(c.date);
        return d.getFullYear().toString() === y && (d.getMonth() + 1).toString().padStart(2, '0') === m;
    });

    if (dateCapsules.length > 0) {
      const summary = await generateStellarSummary(date, dateCapsules);
      setStellarSummary(summary);
    } else {
      setStellarSummary("In this celestial void, silence reigns. It awaits a pioneer to ignite the first spark of memory.");
    }
    setIsLoadingSummary(false);
  };

  const handleNewCapsule = (newCapsule: Capsule) => {
    setCapsules([newCapsule, ...capsules]);
    setIsPurchaseFlowOpen(false);
  };

  return (
    <div className="min-h-screen cosmos-bg flex flex-col relative overflow-hidden">
      <Cosmos />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-indigo-500/40 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-black font-space tracking-tighter text-white uppercase italic group-hover:tracking-normal transition-all duration-500">
                CHRONOS <span className="text-indigo-400">STAR</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-10">
             <div className="relative">
                <input 
                  type="text"
                  placeholder="Scan the constellation..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-900/40 border border-white/10 rounded-full px-6 py-2 w-72 text-indigo-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs transition-all font-space tracking-widest"
                />
                <svg className="absolute right-5 top-2.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <button 
                onClick={() => setIsPurchaseFlowOpen(true)}
                className="px-8 py-3 bg-white text-slate-950 text-xs font-black rounded-full transition-all hover:bg-indigo-400 hover:text-white uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
              >
                Ignite Memory
              </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col mt-32 px-8 z-10 pb-32">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Hero Section */}
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-indigo-500" />
                <span className="text-xs font-black uppercase tracking-[0.5em] text-indigo-400 font-space">The Infinite Archive</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-8 text-white leading-[0.9] tracking-tighter font-space">
                YOUR LEGACY, <br/>AMONG THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">STARS.</span>
              </h2>
              <p className="text-slate-400 text-xl font-light max-w-xl leading-relaxed">
                Chronos Star is a celestial sanctuary where your most precious memories are engraved in the fabric of time. Public, permanent, poetic.
              </p>
            </div>
            <div className="flex md:flex-col gap-6 items-center md:items-end">
                <div className="text-right">
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Active Capsules</p>
                    <p className="text-4xl font-black text-white font-space tracking-tighter">{capsules.length.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Time Range</p>
                    <p className="text-4xl font-black text-white font-space tracking-tighter">1940 - 2050</p>
                </div>
            </div>
          </div>

          {/* AI Message Area */}
          {stellarSummary && (
             <div className="mb-20 relative p-10 rounded-[2.5rem] bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-8 group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6z"/>
                    </svg>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                  <h3 className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] font-space">Visions of the Archive</h3>
                </div>
                <p className="text-indigo-50 text-2xl md:text-3xl font-light italic leading-tight max-w-4xl relative z-10">
                  {stellarSummary}
                </p>
                <button 
                  onClick={() => setStellarSummary(null)}
                  className="mt-8 text-[10px] font-black text-indigo-400/50 hover:text-indigo-400 transition-all uppercase tracking-[0.4em] font-space flex items-center gap-2"
                >
                  <span className="w-6 h-px bg-current" /> Dismiss Vision
                </button>
             </div>
          )}

          {/* Timeline View */}
          <div className="relative mb-24">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full" />
            <div className="relative bg-slate-950/40 border border-white/5 rounded-[3rem] p-12 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <h3 className="text-3xl font-black text-white font-space tracking-tight mb-2 uppercase">Celestial Timeline</h3>
                        <p className="text-slate-500 text-sm font-light">Scroll horizontally to navigate the stars of time.</p>
                    </div>
                    <div className="flex gap-8 items-center bg-slate-900/50 px-6 py-3 rounded-full border border-white/5">
                        {[
                            { color: 'bg-slate-400', label: 'Essentiel' },
                            { color: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]', label: 'Souvenir+' },
                            { color: 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]', label: 'Constellation' }
                        ].map((item, idx) => (
                            <span key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 font-space">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} /> {item.label}
                            </span>
                        ))}
                    </div>
                </div>
                
                <Timeline 
                    capsules={filteredCapsules}
                    onSelectCapsule={setSelectedCapsule}
                    onSelectDate={handleSelectDate}
                />
            </div>
          </div>

          {/* Marketing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />, 
                title: "Rare Origins", 
                desc: "Every date has limited slots. As more stars ignite, their luminosity and value increases." 
              },
              { 
                icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.48l.348-.07a11.955 11.955 0 01-8.618-3.04V12.03c0-3.32 1.51-6.28 3.88-8.29l.348-.07z" />, 
                title: "Secured Legacy", 
                desc: "Verified by the blockchain of human memory. Your entry is guaranteed to shine for decades." 
              },
              { 
                icon: <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />, 
                title: "Oracle Guidance", 
                desc: "Our AI Oracle synthesizes the collective spirit of eras to provide cosmic wisdom." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[3rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h4 className="text-2xl font-black mb-4 text-white font-space tracking-tight uppercase">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Persistent CTA */}
      <div className="fixed bottom-12 left-0 right-0 px-8 z-40 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
           <button 
              onClick={() => setIsPurchaseFlowOpen(true)}
              className="group relative px-14 py-6 overflow-hidden rounded-full shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-indigo-600 transition-colors group-hover:bg-indigo-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 text-white font-black text-xs uppercase tracking-[0.4em] font-space">
                Launch My Star
              </span>
            </button>
        </div>
      </div>

      {/* Modals */}
      <CapsuleModal 
        capsule={selectedCapsule} 
        onClose={() => setSelectedCapsule(null)} 
      />
      
      {isPurchaseFlowOpen && (
        <PurchaseFlow 
          onClose={() => setIsPurchaseFlowOpen(false)}
          onSuccess={handleNewCapsule}
        />
      )}

      {isLoadingSummary && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center backdrop-blur-xl">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-4 bg-indigo-500/10 rounded-full animate-pulse" />
            </div>
            <p className="text-indigo-400 font-black font-space tracking-[0.3em] uppercase animate-pulse">Consulting the Star Oracle</p>
            <p className="text-slate-600 text-xs mt-2 uppercase tracking-widest font-space">Mapping the timeline...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
