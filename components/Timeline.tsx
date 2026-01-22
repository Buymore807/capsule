
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

  return (
    <div className="relative w-full overflow-x-auto py-20 px-4 select-none scrollbar-hide">
      <div className="flex gap-4 items-center mb-12 px-6">
        <button 
          onClick={() => setZoomLevel('YEAR')}
          className={`px-6 py-2 rounded-full border border-indigo-500/30 transition-all font-space tracking-widest text-xs uppercase ${
            zoomLevel === 'YEAR' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Galactic Overview
        </button>
        {zoomLevel === 'MONTH' && (
          <div className="flex items-center gap-3">
            <span className="text-indigo-400 font-black font-space">/</span>
            <span className="text-white font-space tracking-widest text-sm font-bold">{viewingYear} System</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-32 min-w-max pb-20 relative px-12">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -z-10" />

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
                  className={`relative w-16 h-16 rounded-full border transition-all cursor-pointer flex items-center justify-center backdrop-blur-sm group-hover:scale-110 ${
                    hasCapsules 
                      ? 'border-indigo-400/60 bg-indigo-500/20 shadow-[0_0_20px_rgba(129,140,248,0.3)]' 
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-600'
                  }`}
                >
                  {hasCapsules && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-slate-950 animate-pulse">
                      {yearCapsules.length}
                    </div>
                  )}
                  <span className={`text-sm font-space font-bold tracking-tighter ${hasCapsules ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {year}
                  </span>
                </div>
                
                {/* Visual Connector */}
                <div className={`mt-6 h-12 w-px ${hasCapsules ? 'bg-indigo-500/40' : 'bg-slate-800'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${hasCapsules ? 'bg-indigo-400 shadow-[0_0_8px_white]' : 'bg-slate-800'}`} />
              </div>
            );
          })
        ) : (
          months.map((month, idx) => {
            const monthCapsules = getCapsulesForMonth(viewingYear, idx);
            const hasCapsules = monthCapsules.length > 0;
            return (
              <div key={month} className="flex flex-col items-center relative">
                {/* Floating Stars (Capsules) */}
                <div className="flex flex-col items-center gap-4 mb-8 h-40 justify-end">
                  {monthCapsules.map((c, i) => (
                    <div 
                      key={c.id}
                      onClick={() => onSelectCapsule(c)}
                      className={`group relative w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-150 animate-in fade-in zoom-in duration-500 delay-${i * 100} ${
                        c.tier === 'CONSTELLATION' ? 'bg-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.9)]' :
                        c.tier === 'SOUVENIR' ? 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.7)]' : 'bg-slate-300 shadow-[0_0_10px_white/40]'
                      }`}
                    >
                      {/* Star Aura */}
                      <div className="absolute inset-0 rounded-full scale-150 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                      
                      {/* Tooltip hint */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[10px] text-white px-2 py-1 rounded whitespace-nowrap border border-white/10">
                        {c.title}
                      </div>
                    </div>
                  ))}
                </div>

                <div 
                  onClick={() => onSelectDate(`${viewingYear}-${String(idx + 1).padStart(2, '0')}-01`)}
                  className={`relative w-20 h-20 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-center group overflow-hidden ${
                    hasCapsules ? 'border-indigo-500/50 bg-indigo-900/20' : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className={`text-xs font-space font-black uppercase tracking-tighter ${hasCapsules ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {month}
                  </span>
                </div>

                <div className={`mt-6 h-12 w-px ${hasCapsules ? 'bg-indigo-500/40' : 'bg-slate-800'}`} />
                <div className={`w-2 h-2 rounded-full transform rotate-45 ${hasCapsules ? 'bg-indigo-400 shadow-[0_0_10px_white]' : 'bg-slate-800'}`} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Timeline;
