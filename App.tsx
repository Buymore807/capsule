
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
    const [y, m] = date.split('-');
    const dateCapsules = capsules.filter(c => {
        const d = new Date(c.date);
        return d.getFullYear().toString() === y && (d.getMonth() + 1).toString().padStart(2, '0') === m;
    });

    if (dateCapsules.length > 0) {
      const summary = await generateStellarSummary(date, dateCapsules);
      setStellarSummary(summary);
    } else {
      setStellarSummary("A silent sector of the cosmic void. It waits for your light to join the constellation.");
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
      
      {/* HUD Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-10 py-8 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex items-start justify-between">
          <div className="pointer-events-auto flex items-center gap-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition-all duration-700" />
              <div className="relative w-16 h-16 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden group-hover:border-indigo-500/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-white/5" />
                <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black font-space tracking-tighter text-white uppercase italic leading-none mb-1">
                  CHRONOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">STAR</span>
              </h1>
              <span className="text-[10px] font-black tracking-[0.6em] text-slate-500 uppercase font-space">Universal Archive</span>
            </div>
          </div>

          <div className="pointer-events-auto hidden lg:flex items-center gap-12">
             <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <input 
                  type="text"
                  placeholder="SCAN ARCHIVE..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-full px-8 py-3 w-80 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-[10px] font-black tracking-[0.3em] font-space transition-all backdrop-blur-md"
                />
                <svg className="absolute right-6 top-3 w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <button 
                onClick={() => setIsPurchaseFlowOpen(true)}
                className="relative px-10 py-3 overflow-hidden rounded-full group transition-all"
              >
                <div className="absolute inset-0 bg-white group-hover:bg-indigo-500 transition-colors duration-500" />
                <span className="relative z-10 text-slate-950 group-hover:text-white text-[10px] font-black uppercase tracking-[0.3em] font-space">
                  Launch Capsule
                </span>
              </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col mt-48 px-10 z-10 pb-40 max-w-[1600px] mx-auto w-full">
        
        {/* Poetic Intro */}
        <div className="mb-32">
          <div className="flex items-center gap-6 mb-10 animate-in slide-in-from-left-8 duration-700">
            <div className="h-px w-20 bg-indigo-500/50" />
            <span className="text-xs font-black uppercase tracking-[0.6em] text-indigo-400 font-space">Sector-7 Archiving Protocol</span>
          </div>
          <h2 className="text-7xl md:text-[9rem] font-black mb-12 text-white leading-[0.85] tracking-tighter font-space uppercase">
            ETERNITY <br/>IN THE <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-400 to-white">VOID.</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <p className="text-slate-400 text-xl font-light max-w-2xl leading-relaxed italic border-l border-white/10 pl-10">
              Transform your transient moments into eternal constellations. Chronos Star is more than a database; it's a living map of human experience carved into the infinite sky.
            </p>
            <div className="flex gap-12">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-500 tracking-widest uppercase mb-2">Stars Recorded</span>
                  <span className="text-5xl font-black text-white font-space tracking-tighter">{capsules.length.toLocaleString()}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-500 tracking-widest uppercase mb-2">Epoch Range</span>
                  <span className="text-5xl font-black text-white font-space tracking-tighter">110Y</span>
               </div>
            </div>
          </div>
        </div>

        {/* AI Collective Memory Panel */}
        {stellarSummary && (
           <div className="mb-32 relative p-16 rounded-[3rem] bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700 overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-[10s]">
                  <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6z"/>
                  </svg>
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
                <h3 className="text-indigo-400 font-black uppercase tracking-[0.5em] text-xs font-space">Universal Oracle Translation</h3>
              </div>
              
              <p className="text-white text-3xl md:text-5xl font-light italic leading-[1.1] max-w-5xl relative z-10 tracking-tight">
                "{stellarSummary}"
              </p>
              
              <button 
                onClick={() => setStellarSummary(null)}
                className="mt-12 text-[10px] font-black text-indigo-400/40 hover:text-indigo-400 transition-all uppercase tracking-[0.5em] font-space flex items-center gap-4 group/btn"
              >
                <div className="w-12 h-px bg-current group-hover/btn:w-20 transition-all" /> Dismiss Oracle Vision
              </button>
           </div>
        )}

        {/* Timeline Horizon */}
        <div className="relative mb-40">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[150px] rounded-full" />
          <div className="relative bg-slate-950/40 border border-white/10 rounded-[4rem] p-16 overflow-hidden shadow-2xl backdrop-blur-xl group">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
                  <div className="max-w-xl">
                      <h3 className="text-4xl font-black text-white font-space tracking-tight mb-4 uppercase">Horizon Navigation</h3>
                      <p className="text-slate-500 text-sm font-light leading-relaxed">Adjust your temporal lens to witness the birth and persistence of human memory across the ecliptic plane.</p>
                  </div>
                  <div className="flex flex-wrap gap-10 items-center bg-slate-900/40 px-10 py-5 rounded-[2rem] border border-white/5 backdrop-blur-md">
                      {[
                          { color: 'bg-slate-500', label: 'Fragment' },
                          { color: 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.6)]', label: 'Aura' },
                          { color: 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]', label: 'Nova' }
                      ].map((item, idx) => (
                          <span key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-space">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} /> {item.label}
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

        {/* Feature Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-40">
          {[
            { 
              title: "Star Resonance", 
              desc: "Every memory slot is unique. As the constellation grows, your capsule's luminosity increases, echoing through the timeline." 
            },
            { 
              title: "Temporal Guard", 
              desc: "Encrypted memory structures ensure your legacy remains intact across the shifts of digital eras for up to 99 years." 
            },
            { 
              title: "Stellar Synthesis", 
              desc: "Our Gemini-powered Oracle weaves individual memories into collective poetic insights for every sector of time." 
            }
          ].map((item, i) => (
            <div key={i} className="group flex flex-col items-start text-left">
              <div className="text-[10px] font-black text-indigo-500 tracking-[0.4em] uppercase mb-6 flex items-center gap-4">
                 0{i + 1} <div className="w-8 h-px bg-current" />
              </div>
              <h4 className="text-3xl font-black mb-6 text-white font-space tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{item.title}</h4>
              <p className="text-slate-500 text-lg leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Primary Interaction Interface */}
      <div className="fixed bottom-16 left-0 right-0 px-10 z-40 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex justify-center pointer-events-auto">
           <button 
              onClick={() => setIsPurchaseFlowOpen(true)}
              className="group relative px-20 py-8 overflow-hidden rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white group-hover:bg-indigo-600 transition-colors duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
              <span className="relative z-10 text-slate-950 group-hover:text-white font-black text-[11px] uppercase tracking-[0.5em] font-space">
                IGNITE A NEW STAR
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
        <div className="fixed inset-0 z-[60] bg-[#020617]/90 flex items-center justify-center backdrop-blur-3xl">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-10">
                <div className="absolute inset-0 border-[1px] border-indigo-500/20 rounded-full" />
                <div className="absolute inset-0 border-t-[3px] border-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-6 bg-indigo-500/10 rounded-full animate-pulse blur-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                </div>
            </div>
            <p className="text-white font-black font-space tracking-[0.5em] uppercase animate-pulse mb-3">Analyzing Sector</p>
            <p className="text-indigo-400/60 text-[10px] uppercase tracking-widest font-space font-black">Decrypting collective consciousness...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
