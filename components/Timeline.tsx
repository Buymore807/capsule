
import React, { useState, useMemo } from 'react';
import { Capsule, Language } from '../types';
import { translations } from '../i18n';

interface Props {
  capsules: Capsule[];
  lang: Language;
  onSelectCapsule: (c: Capsule) => void;
  onSelectDate: (date: string) => void;
}

const Timeline: React.FC<Props> = ({ capsules, lang, onSelectCapsule, onSelectDate }) => {
  const [zoomLevel, setZoomLevel] = useState<'YEAR' | 'MONTH'>('YEAR');
  const [viewingYear, setViewingYear] = useState(2025);
  const t = translations[lang];

  const years = useMemo(() => {
    const start = 1940;
    const end = 2050;
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getCapsulesForYear = (year: number) => {
    return capsules.filter(c => new Date(c.date).getFullYear() === year);
  };

  const getCapsulesForMonth = (year: number, monthIndex: number) => {
    return capsules.filter(c => {
      const d = new Date(c.date);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    });
  };

  const getStarOffset = (id: string, index: number) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      x: (hash % 80) - 40,
      y: ((hash * (index + 1)) % 160) - 80
    };
  };

  return (
    <div className="relative w-full overflow-x-auto py-32 px-4 select-none scrollbar-hide">
      <div className="flex gap-8 items-center mb-16 px-10">
        <button 
          onClick={() => setZoomLevel('YEAR')}
          className={`px-10 py-3 rounded-full border transition-all font-space tracking-[0.3em] text-[10px] font-black uppercase ${
            zoomLevel === 'YEAR' 
              ? 'bg-indigo-600 text-white border-white/20 shadow-[0_0_30px_rgba(79,70,229,0.5)]' 
              : 'bg-slate-950/40 text-slate-500 border-white/5 hover:bg-slate-900 hover:text-slate-300'
          }`}
        >
          {t.timeline_explore}
        </button>
        {zoomLevel === 'MONTH' && (
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-6">
            <div className="w-12 h-px bg-indigo-500/30" />
            <span className="text-white font-space tracking-[0.4em] text-xs font-black italic">{viewingYear} {t.timeline_sector}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-56 min-w-max pb-40 relative px-32">
        {/* Horizon Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -z-10" />

        {zoomLevel === 'YEAR' ? (
          years.map(year => {
            const yearCapsules = getCapsulesForYear(year);
            const hasCapsules = yearCapsules.length > 0;
            return (
              <div key={year} className="flex flex-col items-center group relative">
                <div 
                  onClick={() => {
                    setViewingYear(year);
                    setZoomLevel('MONTH');
                  }}
                  className={`relative w-24 h-24 rounded-full border-2 transition-all duration-500 cursor-pointer flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/5 ${
                    hasCapsules 
                      ? 'border-indigo-400 bg-indigo-950/40 shadow-[0_0_40px_rgba(129,140,248,0.2)]' 
                      : 'border-white/5 bg-slate-950/20 hover:border-slate-700'
                  }`}
                >
                  {hasCapsules && (
                    <div className="absolute -top-4 -right-4 w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-[11px] font-black text-white border-4 border-slate-950 animate-pulse">
                      {yearCapsules.length}
                    </div>
                  )}
                  <span className={`text-xl font-space font-black tracking-tighter transition-colors ${hasCapsules ? 'text-white' : 'text-slate-800 group-hover:text-slate-500'}`}>
                    {year}
                  </span>

                  {/* Halo pulse */}
                  {hasCapsules && (
                    <div className="absolute inset-0 rounded-full animate-ping border-2 border-indigo-500/20 opacity-10 pointer-events-none" />
                  )}
                </div>
                
                <div className={`mt-10 h-20 w-[1px] ${hasCapsules ? 'bg-indigo-500/40 shadow-[0_0_5px_rgba(99,102,241,0.5)]' : 'bg-white/5'}`} />
                <div className={`w-3 h-3 rounded-full ${hasCapsules ? 'bg-white shadow-[0_0_20px_white]' : 'bg-slate-900'}`} />
              </div>
            );
          })
        ) : (
          months.map((month, idx) => {
            const monthCapsules = getCapsulesForMonth(viewingYear, idx);
            const hasCapsules = monthCapsules.length > 0;
            return (
              <div key={month} className="flex flex-col items-center relative group/month">
                {/* Floating Star Constellation */}
                <div className="relative h-72 w-48 flex justify-center mb-16">
                   {monthCapsules.length > 1 && (
                     <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                       <path 
                          d={monthCapsules.map((c, i) => {
                            const offset = getStarOffset(c.id, i);
                            const x = 96 + offset.x;
                            const y = 144 + offset.y;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="rgba(99, 102, 241, 0.2)"
                          strokeWidth="1.5"
                          className="constellation-line"
                       />
                     </svg>
                   )}

                   {monthCapsules.map((c, i) => {
                    const offset = getStarOffset(c.id, i);
                    return (
                      <div 
                        key={c.id}
                        onClick={() => onSelectCapsule(c)}
                        style={{ 
                          transform: `translate(${offset.x}px, ${offset.y}px)`,
                        }}
                        className={`absolute top-1/2 left-1/2 -ml-5 -mt-5 group/star cursor-pointer transition-all duration-700 hover:scale-150 z-20`}
                      >
                        <div className={`relative w-10 h-10 rounded-full transition-shadow duration-500 ${
                          c.tier === 'CONSTELLATION' ? 'bg-amber-300 shadow-[0_0_40px_rgba(251,191,36,1)]' :
                          c.tier === 'SOUVENIR' ? 'bg-blue-300 shadow-[0_0_25px_rgba(96,165,250,0.8)]' : 'bg-slate-100 shadow-[0_0_15px_white/80]'
                        }`}>
                          {c.tier === 'CONSTELLATION' && (
                            <>
                              <div className="diffraction-spike absolute top-1/2 left-[-15px] right-[-15px] h-[1.5px] opacity-80" />
                              <div className="diffraction-spike absolute left-1/2 top-[-15px] bottom-[-15px] w-[1.5px] opacity-80" />
                            </>
                          )}
                          <div className="absolute inset-0 rounded-full animate-ping opacity-25 bg-white pointer-events-none" />
                        </div>

                        {/* Star ID Tag */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 group-hover/star:opacity-100 transition-all scale-90 group-hover/star:scale-100 min-w-[180px]">
                           <div className="bg-slate-950/95 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                              <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-2">{c.author}</p>
                              <p className="text-sm text-white font-black font-space truncate">{c.title}</p>
                           </div>
                        </div>
                      </div>
                    );
                   })}
                </div>

                {/* Navigation Node */}
                <div 
                  onClick={() => onSelectDate(`${viewingYear}-${String(idx + 1).padStart(2, '0')}-01`)}
                  className={`relative w-28 h-28 rounded-[2rem] border transition-all duration-500 cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                    hasCapsules 
                      ? 'border-indigo-400/40 bg-indigo-950/60 shadow-[inset_0_0_25px_rgba(99,102,241,0.2),0_0_30px_rgba(99,102,241,0.1)]' 
                      : 'border-white/5 bg-slate-950/40 hover:bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <span className={`text-[10px] font-space font-black uppercase tracking-[0.4em] mb-1 ${hasCapsules ? 'text-indigo-200' : 'text-slate-700 group-hover/month:text-slate-400'}`}>
                    {month}
                  </span>
                  {hasCapsules && (
                    <span className="text-[10px] text-white font-black px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 mt-2">
                      {monthCapsules.length} {t.timeline_lights}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover/month:opacity-100 transition-opacity" />
                </div>

                <div className={`mt-10 h-16 w-[1px] ${hasCapsules ? 'bg-indigo-500/40 shadow-[0_0_10px_white/20]' : 'bg-white/5'}`} />
                <div className={`w-4 h-4 rounded-sm rotate-45 border border-white/10 ${hasCapsules ? 'bg-indigo-400 shadow-[0_0_25px_white/50]' : 'bg-slate-900'}`} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Timeline;
