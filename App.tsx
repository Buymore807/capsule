
import React, { useState, useEffect } from 'react';
import Cosmos from './components/Cosmos';
import Timeline from './components/Timeline';
import CapsuleModal from './components/CapsuleModal';
import PurchaseFlow from './components/PurchaseFlow';
import { Capsule, Language } from './types';
import { MOCK_CAPSULES } from './constants';
import { generateStellarSummary } from './services/geminiService';
import { translations } from './i18n';

const App: React.FC = () => {
  const getBrowserLanguage = (): Language => {
    const navLang = navigator.language.split('-')[0];
    const supported: Language[] = ['en', 'fr', 'es', 'de'];
    return supported.includes(navLang as Language) ? (navLang as Language) : 'en';
  };

  const [lang, setLang] = useState<Language>(getBrowserLanguage());
  const [capsules, setCapsules] = useState<Capsule[]>(MOCK_CAPSULES);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [isPurchaseFlowOpen, setIsPurchaseFlowOpen] = useState(false);
  const [stellarSummary, setStellarSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[lang];

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
      const summary = await generateStellarSummary(date, dateCapsules, lang);
      setStellarSummary(summary);
    } else {
      setStellarSummary(t.void_msg);
    }
    setIsLoadingSummary(false);
  };

  const handleNewCapsule = (newCapsule: Capsule) => {
    setCapsules([newCapsule, ...capsules]);
    setIsPurchaseFlowOpen(false);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'es', label: 'ES' },
    { code: 'de', label: 'DE' }
  ];

  return (
    <div className="min-h-screen cosmos-bg flex flex-col relative overflow-hidden">
      <Cosmos />
      
      {/* HUD Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 md:px-10 py-6 md:py-8 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-3 md:gap-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl md:rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition-all duration-700" />
              <div className="relative w-10 h-10 md:w-16 md:h-16 bg-slate-950 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden group-hover:border-indigo-500/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-white/5" />
                <svg className="w-5 h-5 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-3xl font-black font-space tracking-tighter text-white uppercase italic leading-none mb-0.5 md:mb-1">
                  AETERNYA
              </h1>
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] text-slate-500 uppercase font-space">{t.nav_archive}</span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-3 md:gap-8">
             <div className="hidden sm:flex bg-slate-950/40 border border-white/10 p-1 rounded-full backdrop-blur-md">
                {languages.map((l) => (
                   <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1 text-[10px] font-black font-space rounded-full transition-all ${
                      lang === l.code ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                   >
                    {l.label}
                   </button>
                ))}
             </div>

             <div className="relative group hidden lg:block">
                <input 
                  type="text"
                  placeholder={t.nav_scan}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-950/60 border border-white/10 rounded-full px-8 py-3 w-80 text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-[10px] font-black tracking-[0.3em] font-space transition-all backdrop-blur-md"
                />
             </div>
             <button 
                onClick={() => setIsPurchaseFlowOpen(true)}
                className="relative px-5 md:px-10 py-2.5 md:py-3 overflow-hidden rounded-full group transition-all"
              >
                <div className="absolute inset-0 bg-white group-hover:bg-indigo-600 transition-colors duration-500" />
                <span className="relative z-10 text-slate-950 group-hover:text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] font-space">
                  {t.nav_launch}
                </span>
              </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col mt-32 md:mt-48 px-4 md:px-10 z-10 pb-40 max-w-[1600px] mx-auto w-full">
        
        {/* Poetic Intro */}
        <div className="mb-20 md:mb-32">
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10 animate-in slide-in-from-left-8 duration-700">
            <div className="h-px w-10 md:w-20 bg-indigo-500/50" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-indigo-400 font-space">{t.hero_archive_protocol}</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-[7.5rem] font-black mb-8 md:mb-12 text-white leading-[0.9] md:leading-[0.85] tracking-tighter font-space uppercase">
            {t.hero_title_1} <br/>{t.hero_title_2} <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-400 to-white">{t.hero_title_3}</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed italic border-l border-white/10 pl-6 md:pl-10">
              {t.hero_desc}
            </p>
            <div className="flex gap-10 md:gap-12">
               <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black text-indigo-500 tracking-widest uppercase mb-1 md:mb-2">{t.hero_stat_recorded}</span>
                  <span className="text-3xl md:text-5xl font-black text-white font-space tracking-tighter">{capsules.length.toLocaleString()}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black text-indigo-500 tracking-widest uppercase mb-1 md:mb-2">{t.hero_stat_range}</span>
                  <span className="text-3xl md:text-5xl font-black text-white font-space tracking-tighter">110Y</span>
               </div>
            </div>
          </div>
        </div>

        {/* AI Collective Memory Panel */}
        {stellarSummary && (
           <div className="mb-20 md:mb-32 relative p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700 overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-[10s]">
                  <svg className="w-32 h-32 md:w-64 md:h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6z"/>
                  </svg>
              </div>
              
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
                <h3 className="text-indigo-400 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs font-space">{t.oracle_title}</h3>
              </div>
              
              <p className="text-white text-2xl md:text-5xl font-light italic leading-tight md:leading-[1.1] max-w-5xl relative z-10 tracking-tight">
                "{stellarSummary}"
              </p>
              
              <button 
                onClick={() => setStellarSummary(null)}
                className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-black text-indigo-400/40 hover:text-indigo-400 transition-all uppercase tracking-[0.3em] md:tracking-[0.5em] font-space flex items-center gap-4 group/btn"
              >
                <div className="w-8 md:w-12 h-px bg-current group-hover/btn:w-20 transition-all" /> {t.oracle_dismiss}
              </button>
           </div>
        )}

        {/* THE CORE: Cosmic Temporal Navigator Section */}
        <div className="relative mb-20 md:mb-40 min-h-[800px]">
          <div className="absolute inset-0 bg-indigo-500/5 blur-[180px] rounded-full -z-10" />
          <div className="relative bg-slate-950/40 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 overflow-hidden shadow-2xl backdrop-blur-3xl group">
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
                  <div className="max-w-xl">
                      <div className="flex items-center gap-4 mb-4">
                          <span className="w-12 h-[1px] bg-indigo-500" />
                          <h3 className="text-2xl md:text-5xl font-black text-white font-space tracking-tight uppercase italic">{t.horizon_title}</h3>
                      </div>
                      <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed pl-16 border-l border-white/5">{t.horizon_desc}</p>
                  </div>
              </div>
              
              <Timeline 
                  lang={lang}
                  capsules={filteredCapsules}
                  onSelectCapsule={setSelectedCapsule}
                  onSelectDate={handleSelectDate}
              />
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-20 md:mb-40">
          {[
            { title: t.feature_1_title, desc: t.feature_1_desc },
            { title: t.feature_2_title, desc: t.feature_2_desc },
            { title: t.feature_3_title, desc: t.feature_3_desc }
          ].map((item, i) => (
            <div key={i} className="group flex flex-col items-start text-left bg-slate-950/20 p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all">
              <div className="text-[10px] font-black text-indigo-500 tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6 flex items-center gap-4">
                 COORD_0{i + 1} <div className="w-6 md:w-8 h-px bg-current" />
              </div>
              <h4 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 text-white font-space tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{item.title}</h4>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile-First Sticky Launcher */}
      <div className="fixed bottom-8 md:bottom-16 left-0 right-0 px-4 md:px-10 z-40 pointer-events-none">
        <div className="max-w-[1600px] mx-auto flex justify-center pointer-events-auto">
           <button 
              onClick={() => setIsPurchaseFlowOpen(true)}
              className="group relative px-10 md:px-20 py-5 md:py-8 overflow-hidden rounded-2xl md:rounded-[2rem] shadow-[0_30px_100px_-20px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 w-full max-w-md"
            >
              <div className="absolute inset-0 bg-white group-hover:bg-indigo-600 transition-colors duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
              <span className="relative z-10 text-slate-950 group-hover:text-white font-black text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.6em] font-space">
                {t.cta_ignite}
              </span>
            </button>
        </div>
      </div>

      <CapsuleModal lang={lang} capsule={selectedCapsule} onClose={() => setSelectedCapsule(null)} />
      {isPurchaseFlowOpen && <PurchaseFlow lang={lang} onClose={() => setIsPurchaseFlowOpen(false)} onSuccess={handleNewCapsule} />}

      {isLoadingSummary && (
        <div className="fixed inset-0 z-[60] bg-[#020617]/95 flex items-center justify-center backdrop-blur-3xl">
          <div className="text-center px-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 md:mb-10">
                <div className="absolute inset-0 border-t-[3px] border-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-4 md:inset-6 bg-indigo-500/10 rounded-full animate-pulse blur-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
            </div>
            <p className="text-white text-sm md:text-xl font-black font-space tracking-[0.5em] uppercase animate-pulse mb-3">{t.oracle_loading}</p>
            <p className="text-indigo-400/60 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-space font-black">{t.oracle_decrypting}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
