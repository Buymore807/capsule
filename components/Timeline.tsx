
import React, { useState, useMemo } from 'react';
import { Capsule } from '../types';

interface Props {
  capsules: Capsule[];
  onSelectCapsule: (c: Capsule) => void;
  onSelectDate: (date: string) => void;
}

const Timeline: React.FC<Props> = ({ capsules, onSelectCapsule, onSelectDate }) => {
  const [zoomLevel, setZoomLevel] = useState<'YEAR' | 'MONTH'>('YEAR');
  const [viewingYear, setViewingYear] = useState(2025);

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

  // Helper to generate "constellation" positions for stars in a month
  const getStarOffset = (id: string, index: number) => {
    // Deterministic random-ish offset
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      x: (hash % 60) - 30, // -30px to 30px
      y: ((hash * (index + 1)) % 140) - 70 // -70px to 70px
    };
  };

  return (
    <div className="relative w-full overflow-x-auto py-32 px-4 select-none scrollbar-hide">
      <div className="flex gap-6 items-center mb-16 px-10">
        <button 
          onClick={() => setZoomLevel('YEAR')}
          className={`px-8 py-2.5 rounded-full border transition-all font-space tracking-[0.2em] text-[10px] font-black uppercase ${
            zoomLevel === 'YEAR' 
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
              : 'bg-slate-900/40 text-slate-500 border-white/5 hover:bg-slate-800'
          }`}
        >
          Universal Map
        </button>
        {zoomLevel === 'MONTH' && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
            <div className="w-8 h-px bg-slate-800" />
            <span className="text-white font-space tracking-widest text-sm font-black italic">{viewingYear} SECTOR</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-48 min-w-max pb-32 relative px-24">
        {/* The Ecliptic Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -z-10 shadow-[0_0_15px_rgba(99,102,241,0.1)]" />

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
                  className={`relative w-20 h-20 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 ${
                    hasCapsules 
                      ? 'border-indigo-400 bg-indigo-600/10 shadow-[0_0_30px_rgba(129,140,248,0.4)]' 
                      : 'border-white/5 bg-slate-950/40 hover:border-slate-600'
                  }`}
                >
                  {hasCapsules && (
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-[11px] font-black text-white border-2 border-slate-950 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      {yearCapsules.length}
                    </div>
                  )}
                  <span className={`text-base font-space font-black tracking-tighter ${hasCapsules ? 'text-white' : 'text-slate-700 group-hover:text-slate-400'}`}>
                    {year}
                  </span>

                  {/* Radial pulses for years with capsules */}
                  {hasCapsules && (
                    <div className="absolute inset-0 rounded-full animate-ping border border-indigo-500/30 opacity-20 pointer-events-none" />
                  )}
                </div>
                
                <div className={`mt-8 h-16 w-px ${hasCapsules ? 'bg-indigo-500/50' : 'bg-white/5'}`} />
                <div className={`w-2 h-2 rounded-full ${hasCapsules ? 'bg-white shadow-[0_0_15px_white]' : 'bg-slate-900'}`} />
              </div>
            );
          })
        ) : (
          months.map((month, idx) => {
            const monthCapsules = getCapsulesForMonth(viewingYear, idx);
            const hasCapsules = monthCapsules.length > 0;
            return (
              <div key={month} className="flex flex-col items-center relative group">
                {/* Floating Constellation Stars */}
                <div className="relative h-64 w-32 flex justify-center mb-12">
                   {/* Draw connecting lines between stars in the constellation */}
                   {monthCapsules.length > 1 && (
                     <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                       <path 
                          d={monthCapsules.map((c, i) => {
                            const offset = getStarOffset(c.id, i);
                            const x = 64 + offset.x;
                            const y = 128 + offset.y;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="rgba(99, 102, 241, 0.15)"
                          strokeWidth="1"
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
                        className={`absolute top-1/2 left-1/2 -ml-4 -mt-4 group/star cursor-pointer transition-all duration-700 hover:scale-150 z-10`}
                      >
                        {/* The Star Body */}
                        <div className={`relative w-8 h-8 rounded-full ${
                          c.tier === 'CONSTELLATION' ? 'bg-amber-300 shadow-[0_0_30px_rgba(251,191,36,1)]' :
                          c.tier === 'SOUVENIR' ? 'bg-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.8)]' : 'bg-slate-200 shadow-[0_0_10px_white]'
                        }`}>
                          {/* Diffraction Spikes for Constellation Tier */}
                          {c.tier === 'CONSTELLATION' && (
                            <>
                              <div className="diffraction-spike absolute top-1/2 left-[-10px] right-[-10px] h-[1px]" />
                              <div className="diffraction-spike absolute left-1/2 top-[-10px] bottom-[-10px] w-[1px]" />
                            </>
                          )}
                          
                          {/* Pulsing Aura */}
                          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current pointer-events-none" />
                        </div>

                        {/* Hover Preview Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/star:opacity-100 transition-all pointer-events-none scale-90 group-hover/star:scale-100 min-w-[150px]">
                           <div className="bg-slate-950/90 border border-white/20 p-3 rounded-xl backdrop-blur-md shadow-2xl">
                              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">{c.author}</p>
                              <p className="text-xs text-white font-bold truncate">{c.title}</p>
                           </div>
                           <div className="w-px h-4 bg-white/20 mx-auto" />
                        </div>
                      </div>
                    );
                   })}
                </div>

                {/* Month Node */}
                <div 
                  onClick={() => onSelectDate(`${viewingYear}-${String(idx + 1).padStart(2, '0')}-01`)}
                  className={`relative w-24 h-24 rounded-3xl border transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                    hasCapsules 
                      ? 'border-indigo-500/50 bg-indigo-950/40 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]' 
                      : 'border-white/5 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-xs font-space font-black uppercase tracking-[0.2em] ${hasCapsules ? 'text-indigo-200' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {month}
                  </span>
                  {hasCapsules && (
                    <span className="text-[10px] text-indigo-400/80 font-bold mt-1">{monthCapsules.length} ⭐</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className={`mt-8 h-12 w-px ${hasCapsules ? 'bg-indigo-500/30' : 'bg-white/5'}`} />
                <div className={`w-3 h-3 rounded-sm transform rotate-45 border border-white/10 ${hasCapsules ? 'bg-indigo-400 shadow-[0_0_15px_white/50]' : 'bg-slate-900'}`} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Timeline;
