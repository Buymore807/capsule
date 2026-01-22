
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <div className={`relative w-full max-w-5xl bg-slate-950 border rounded-[3rem] overflow-hidden transition-all duration-1000 animate-in fade-in zoom-in-95 ${getTierStyles()}`}>
        
        {/* Particle Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        <button 
          onClick={onClose}
          className="absolute top-10 right-10 z-20 p-4 bg-black/60 text-slate-400 hover:text-white rounded-full transition-all border border-white/10 hover:border-white/30 backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-1/2 relative group overflow-hidden">
            <img 
              src={capsule.imageUrl} 
              alt={capsule.title}
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 min-h-[400px] lg:min-h-[600px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {/* Logo for Brands */}
            {capsule.logoUrl && (
              <div className="absolute top-10 left-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl animate-in slide-in-from-top-4 duration-700">
                <img src={capsule.logoUrl} alt="Logo" className="h-16 w-auto object-contain drop-shadow-2xl" />
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 p-14 lg:p-20 flex flex-col justify-between relative z-10 bg-slate-950">
            <div>
              <div className="flex flex-wrap items-center gap-6 mb-12">
                <span className={`px-6 py-2 text-[10px] font-black rounded-full uppercase tracking-[0.4em] border font-space ${
                  capsule.tier === 'BRAND' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  capsule.tier === 'SOCIAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                  capsule.tier === 'UNIVERSE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-slate-500/10 text-slate-400 border-white/5'
                }`}>
                  {capsule.tier} Sector
                </span>
                <span className="text-slate-800 font-space text-xs">/</span>
                <span className="text-indigo-400 font-space text-[11px] font-black tracking-[0.4em] uppercase">{formatDate(capsule.date)}</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-black font-space mb-10 text-white leading-[1.1] tracking-tighter uppercase italic">{capsule.title}</h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mb-12 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
              <p className="text-slate-300 text-2xl lg:text-3xl font-light italic leading-relaxed mb-12 max-w-xl">
                "{capsule.message}"
              </p>

              {capsule.externalLink && (
                <a 
                  href={capsule.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] font-space hover:bg-indigo-500 hover:text-white transition-all shadow-2xl group/link"
                >
                  {t.modal_visit_site}
                  <svg className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>

            <div className="flex items-center justify-between pt-14 border-t border-white/10 mt-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-900 flex items-center justify-center font-black text-2xl text-white shadow-2xl transform rotate-6 border border-white/10">
                  {capsule.author[0]}
                </div>
                <div>
                  <p className="text-lg font-black text-white tracking-widest font-space uppercase">
                    {capsule.isAnonymous ? t.modal_anonymous : capsule.author}
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] font-black mt-2 italic">{t.modal_guardian}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <button className="group flex flex-col items-center gap-2 transition-all hover:scale-125">
                  <svg className="w-10 h-10 text-rose-500 group-hover:fill-rose-500 transition-all drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-black text-slate-600 group-hover:text-rose-400 font-space">{capsule.likes.toLocaleString()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleModal;
