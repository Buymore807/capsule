
import React from 'react';
import { Capsule, Language } from '../types';
import { translations } from '../i18n';

interface Props {
  capsule: Capsule | null;
  lang: Language;
  onClose: () => void;
}

const CapsuleModal: React.FC<Props> = ({ capsule, lang, onClose }) => {
  if (!capsule) return null;
  const t = translations[lang];

  const getTierStyles = () => {
    switch(capsule.tier) {
      case 'BRAND': return 'border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.3)]';
      case 'SOCIAL': return 'border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.3)]';
      case 'UNIVERSE': return 'border-amber-500 shadow-[0_0_50px_rgba(251,191,36,0.2)]';
      case 'GALAXY': return 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]';
      default: return 'border-slate-700 shadow-[0_0_30px_rgba(255,255,255,0.05)]';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-2xl">
      <div className={`relative w-full max-w-5xl bg-slate-950 border rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-all duration-1000 animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto ${getTierStyles()}`}>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-black/60 text-slate-400 hover:text-white rounded-full transition-all border border-white/10 backdrop-blur-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-1/2 relative group overflow-hidden h-[300px] md:h-[500px] lg:h-auto">
            <img 
              src={capsule.imageUrl} 
              alt={capsule.title}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {capsule.logoUrl && (
              <div className="absolute top-6 left-6 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl">
                <img src={capsule.logoUrl} alt="Logo" className="h-10 md:h-16 w-auto object-contain" />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 p-8 md:p-14 lg:p-20 flex flex-col justify-between relative z-10 bg-slate-950">
            <div>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 md:mb-12">
                <span className={`px-4 py-1.5 text-[8px] md:text-[10px] font-black rounded-full uppercase tracking-[0.3em] border font-space ${
                  capsule.tier === 'BRAND' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  capsule.tier === 'SOCIAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                  capsule.tier === 'UNIVERSE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-slate-500/10 text-slate-400 border-white/5'
                }`}>
                  {capsule.tier}
                </span>
                <span className="text-slate-800 font-space text-[10px]">/</span>
                <span className="text-indigo-400 font-space text-[9px] md:text-[11px] font-black tracking-[0.3em] uppercase">{formatDate(capsule.date)}</span>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-space mb-6 md:mb-10 text-white leading-tight tracking-tighter uppercase italic">{capsule.title}</h2>
              <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mb-8 md:mb-12 rounded-full" />
              <p className="text-slate-300 text-lg md:text-2xl lg:text-3xl font-light italic leading-relaxed mb-8 md:mb-12 max-w-xl">
                "{capsule.message}"
              </p>

              {capsule.externalLink && (
                <a 
                  href={capsule.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-8 py-4 bg-white text-slate-950 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] font-space hover:bg-indigo-500 hover:text-white transition-all shadow-2xl group/link"
                >
                  {t.modal_visit_site}
                </a>
              )}
            </div>

            <div className="flex items-center justify-between pt-8 md:pt-14 border-t border-white/10 mt-10 md:mt-12">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-900 flex items-center justify-center font-black text-xl md:text-2xl text-white transform rotate-6 border border-white/10">
                  {capsule.author[0]}
                </div>
                <div>
                  <p className="text-sm md:text-lg font-black text-white tracking-widest font-space uppercase">
                    {capsule.isAnonymous ? t.modal_anonymous : capsule.author}
                  </p>
                  <p className="text-[8px] md:text-[10px] text-slate-600 uppercase tracking-[0.4em] font-black mt-1 italic">{t.modal_guardian}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-[10px] font-black text-slate-600 font-space">{capsule.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleModal;
