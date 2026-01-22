
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Capsule, Language, Tier } from '../types';
import { translations } from '../i18n';

interface Props {
  capsules: Capsule[];
  lang: Language;
  onSelectCapsule: (c: Capsule) => void;
  onSelectDate: (date: string) => void;
}

type FilterType = 'ALL' | 'PERSONAL' | 'SOCIAL' | 'BRAND';

const Timeline: React.FC<Props> = ({ capsules, lang, onSelectCapsule, onSelectDate }) => {
  const [zoomLevel, setZoomLevel] = useState<'YEAR' | 'MONTH'>('YEAR');
  const [viewingYear, setViewingYear] = useState(2025);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [activeTier, setActiveTier] = useState<Tier | 'ALL'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = translations[lang];

  // Era Navigator Logic
  const decades = useMemo(() => {
    const arr = [];
    for (let i = 1940; i <= 2050; i += 10) arr.push(i);
    return arr;
  }, []);

  const years = useMemo(() => {
    const arr = [];
    for (let i = 1940; i <= 2050; i++) arr.push(i);
    return arr;
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filteredCapsules = useMemo(() => {
    return capsules.filter(c => {
      const typeMatch = filter === 'ALL' || 
        (filter === 'PERSONAL' && ['ESSENTIEL', 'AURA', 'NOVA', 'GALAXY', 'UNIVERSE'].includes(c.tier)) ||
        (filter === 'SOCIAL' && c.tier === 'SOCIAL') ||
        (filter === 'BRAND' && c.tier === 'BRAND');
      
      const tierMatch = activeTier === 'ALL' || c.tier === activeTier;
      
      return typeMatch && tierMatch;
    });
  }, [capsules, filter, activeTier]);

  const getCapsulesForYear = (year: number) => {
    return filteredCapsules.filter(c => new Date(c.date).getFullYear() === year);
  };

  const getCapsulesForMonth = (year: number, monthIndex: number) => {
    return filteredCapsules.filter(c => {
      const d = new Date(c.date);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    });
  };

  const getStarOffset = (id: string, index: number) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      x: (hash % 60) - 30,
      y: ((hash * (index + 1)) % 120) - 60
    };
  };

  const scrollToYear = (year: number) => {
    const el = document.getElementById(`year-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      setViewingYear(year);
    }
  };

  // Star size based on Tier
  const getStarSize = (tier: Tier) => {
    switch(tier) {
      case 'UNIVERSE': return 'w-14 h-14';
      case 'BRAND': return 'w-12 h-12';
      case 'GALAXY': return 'w-10 h-10';
      case 'SOCIAL': return 'w-10 h-10';
      default: return 'w-6 h-6';
    }
  };

  return (
    <div className="relative w-full flex flex-col select-none">
      
      {/* 1. TOP NAVIGATOR: Decades Mini-Map */}
      <div className="mb-12 px-2 md:px-0">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 font-space">Temporal Coordinate Map</span>
         </div>
         <div className="flex items-center bg-slate-900/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
            {decades.map(decade => (
              <button
                key={decade}
                onClick={() => scrollToYear(decade)}
                className={`flex-shrink-0 px-6 py-3 text-[10px] font-black font-space rounded-xl transition-all ${
                  Math.floor(viewingYear / 10) * 10 === decade 
                    ? 'bg-white text-slate-950 shadow-xl' 
                    : 'text-slate-600 hover:text-white hover:bg-white/5'
                }`}
              >
                {decade}s
              </button>
            ))}
         </div>
      </div>

      {/* 2. FILTER HUD: Category & Tier Switches */}
      <div className="flex flex-col lg:flex-row gap-6 mb-16 items-start lg:items-center justify-between">
         <div className="flex flex-wrap gap-3">
            {[
              { id: 'ALL', label: 'All Clusters' },
              { id: 'PERSONAL', label: t.cat_personal },
              { id: 'SOCIAL', label: t.cat_social },
              { id: 'BRAND', label: t.cat_business }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as FilterType)}
                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  filter === f.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-950/40 text-slate-500 border-white/5 hover:border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
         </div>

         <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest shrink-0">Filter Magnitude:</span>
            <div className="flex gap-4">
               {['ALL', 'ESSENTIEL', 'AURA', 'NOVA', 'GALAXY', 'UNIVERSE', 'SOCIAL', 'BRAND'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setActiveTier(tier as any)}
                    className={`w-4 h-4 rounded-full transition-all border-2 ${
                      activeTier === tier 
                        ? 'scale-125 border-indigo-400 bg-white' 
                        : 'border-white/10 bg-slate-800'
                    }`}
                    title={tier}
                  />
               ))}
            </div>
         </div>
      </div>

      {/* 3. MAIN TIMELINE DISPLAY */}
      <div className="flex items-center gap-12 mb-8">
        <button 
          onClick={() => setZoomLevel('YEAR')}
          className={`flex items-center gap-4 px-8 py-3 rounded-full border transition-all font-space tracking-[0.3em] text-[10px] font-black uppercase ${
            zoomLevel === 'YEAR' 
              ? 'bg-indigo-600 text-white border-white/20 shadow-[0_0_30px_rgba(79,70,229,0.5)]' 
              : 'bg-slate-950/40 text-slate-500 border-white/5 hover:bg-slate-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          {t.timeline_explore}
        </button>
        {zoomLevel === 'MONTH' && (
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-6">
            <div className="w-12 h-px bg-indigo-500/30" />
            <span className="text-white font-space tracking-[0.4em] text-xs font-black italic">{viewingYear} {t.timeline_sector}</span>
            <button 
              onClick={() => setZoomLevel('YEAR')}
              className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors underline underline-offset-8"
            >
              Back to Galaxy View
            </button>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="relative w-full overflow-x-auto py-24 md:py-32 no-scrollbar scroll-smooth"
      >
        <div className="flex items-center space-x-24 md:space-x-56 min-w-max pb-32 relative px-20 md:px-56">
          {/* Central temporal horizon line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -z-10 pointer-events-none" />

          {zoomLevel === 'YEAR' ? (
            years.map(year => {
              const yearCapsules = getCapsulesForYear(year);
              const hasCapsules = yearCapsules.length > 0;
              return (
                <div 
                  key={year} 
                  id={`year-${year}`}
                  className="flex flex-col items-center group relative snap-center"
                >
                  <div 
                    onClick={() => {
                      setViewingYear(year);
                      setZoomLevel('MONTH');
                    }}
                    className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 transition-all duration-700 cursor-pointer flex items-center justify-center group-hover:scale-125 ${
                      hasCapsules 
                        ? 'border-indigo-400/60 bg-indigo-950/20 shadow-[0_0_50px_rgba(129,140,248,0.15)] group-hover:border-indigo-400' 
                        : 'border-white/5 bg-slate-950/20 hover:border-slate-700'
                    }`}
                  >
                    {hasCapsules && (
                      <div className="absolute -top-3 -right-3 md:-top-5 md:-right-5 w-8 h-8 md:w-12 md:h-12 bg-white text-slate-950 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black border-4 border-slate-950 shadow-2xl animate-in zoom-in-0 duration-500">
                        {yearCapsules.length}
                      </div>
                    )}
                    <span className={`text-lg md:text-2xl font-space font-black tracking-tighter transition-all ${hasCapsules ? 'text-white scale-110' : 'text-slate-800 group-hover:text-slate-500'}`}>
                      {year}
                    </span>
                    {hasCapsules && (
                      <div className="absolute inset-0 rounded-full animate-ping border-2 border-indigo-500/10 opacity-20 pointer-events-none" />
                    )}
                  </div>
                  
                  <div className={`mt-8 md:mt-12 h-16 md:h-24 w-[1px] ${hasCapsules ? 'bg-gradient-to-b from-indigo-500/60 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/5'}`} />
                  <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500 ${hasCapsules ? 'bg-white scale-110 shadow-[0_0_20px_white]' : 'bg-slate-900 group-hover:bg-slate-700'}`} />
                </div>
              );
            })
          ) : (
            months.map((month, idx) => {
              const monthCapsules = getCapsulesForMonth(viewingYear, idx);
              const hasCapsules = monthCapsules.length > 0;
              return (
                <div key={month} className="flex flex-col items-center relative group/month snap-center">
                  
                  {/* CONSTELLATION ENGINE */}
                  <div className="relative h-64 md:h-80 w-40 md:w-56 flex justify-center mb-12 md:mb-20">
                     {monthCapsules.length > 1 && (
                       <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                         <path 
                            d={monthCapsules.map((c, i) => {
                              const offset = getStarOffset(c.id, i);
                              const x = (scrollRef.current?.offsetWidth || 200) / 4 + offset.x; // approximate center
                              const y = 160 + offset.y;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="rgba(129, 140, 248, 0.15)"
                            strokeWidth="1"
                            className="constellation-line"
                         />
                       </svg>
                     )}

                     {monthCapsules.map((c, i) => {
                        const offset = getStarOffset(c.id, i);
                        const starSize = getStarSize(c.tier);
                        return (
                          <div 
                            key={c.id}
                            onClick={() => onSelectCapsule(c)}
                            style={{ 
                              transform: `translate(${offset.x}px, ${offset.y}px)`,
                            }}
                            className="absolute top-1/2 left-1/2 -ml-6 -mt-6 group/star cursor-pointer z-20"
                          >
                            <div className={`relative ${starSize} rounded-full transition-all duration-700 group-hover/star:scale-150 ${
                              c.tier === 'UNIVERSE' ? 'bg-amber-200 shadow-[0_0_50px_rgba(251,191,36,1)]' :
                              c.tier === 'BRAND' ? 'bg-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.8)]' :
                              c.tier === 'SOCIAL' ? 'bg-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.7)]' :
                              c.tier === 'GALAXY' ? 'bg-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.6)]' :
                              'bg-slate-200 shadow-[0_0_15px_white/50]'
                            }`}>
                              {/* Spikes for high-tier stars */}
                              {['UNIVERSE', 'BRAND', 'SOCIAL'].includes(c.tier) && (
                                <>
                                  <div className="absolute top-1/2 left-[-20px] right-[-20px] h-[1px] bg-white/40 blur-[0.5px]" />
                                  <div className="absolute left-1/2 top-[-20px] bottom-[-20px] w-[1px] bg-white/40 blur-[0.5px]" />
                                </>
                              )}
                              <div className="absolute inset-0 rounded-full animate-pulse bg-white opacity-20 pointer-events-none" />
                            </div>

                            {/* Hover Tag */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 opacity-0 group-hover/star:opacity-100 transition-all pointer-events-none group-hover/star:translate-y-[-10px]">
                               <div className="bg-slate-950/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl min-w-[200px]">
                                  <div className="flex items-center gap-3 mb-2">
                                     <span className="text-[8px] font-black text-indigo-400 tracking-widest uppercase">{c.author}</span>
                                     <div className="w-1 h-1 rounded-full bg-slate-700" />
                                     <span className="text-[8px] font-black text-slate-500 uppercase">{c.tier}</span>
                                  </div>
                                  <p className="text-xs text-white font-black font-space truncate">{c.title}</p>
                               </div>
                            </div>
                          </div>
                        );
                     })}
                  </div>

                  {/* Navigational Month Node */}
                  <div 
                    onClick={() => onSelectDate(`${viewingYear}-${String(idx + 1).padStart(2, '0')}-01`)}
                    className={`relative w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] border transition-all duration-700 cursor-pointer flex flex-col items-center justify-center overflow-hidden hover:scale-110 ${
                      hasCapsules 
                        ? 'border-indigo-400/40 bg-indigo-950/40 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
                        : 'border-white/5 bg-slate-950/40 hover:bg-slate-900/60'
                    }`}
                  >
                    <span className={`text-[10px] md:text-xs font-space font-black uppercase tracking-[0.5em] mb-1 ${hasCapsules ? 'text-white' : 'text-slate-700 group-hover/month:text-slate-400'}`}>
                      {month}
                    </span>
                    {hasCapsules && (
                      <div className="mt-3 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-indigo-400 font-black tracking-widest uppercase">
                          {monthCapsules.length} Active
                        </span>
                        <div className="flex gap-1">
                          {Array.from({length: Math.min(monthCapsules.length, 5)}).map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-indigo-500" />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover/month:opacity-100 transition-all duration-700" />
                  </div>

                  <div className={`mt-10 h-16 w-[1px] ${hasCapsules ? 'bg-gradient-to-b from-indigo-400 to-transparent' : 'bg-white/5'}`} />
                  <div className={`w-4 h-4 rounded-sm rotate-45 border border-white/10 transition-all duration-500 ${hasCapsules ? 'bg-indigo-500 scale-125 shadow-[0_0_30px_rgba(99,102,241,0.8)]' : 'bg-slate-900'}`} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. FOOTER INFO: Current Scope Indicator */}
      <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] font-space text-slate-700 border-t border-white/5 pt-8">
          <div className="flex items-center gap-4">
              <span className="text-indigo-500">Coordinate Range:</span>
              <span className="text-slate-500">1940 - 2050</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
              <span className="text-indigo-500">Live Sectors:</span>
              <span className="text-slate-500">{filteredCapsules.length} Gravitational Wells Detected</span>
          </div>
          <div className="flex items-center gap-4 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-slate-500">Systems Nominal</span>
          </div>
      </div>

    </div>
  );
};

export default Timeline;
