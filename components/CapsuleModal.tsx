
import React from 'react';
import { Capsule } from '../types';

interface Props {
  capsule: Capsule | null;
  onClose: () => void;
}

const CapsuleModal: React.FC<Props> = ({ capsule, onClose }) => {
  if (!capsule) return null;

  const getTierStyles = () => {
    switch(capsule.tier) {
      case 'CONSTELLATION': return 'border-amber-500 shadow-[0_0_50px_rgba(251,191,36,0.2)]';
      case 'SOUVENIR': return 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.15)]';
      default: return 'border-slate-700 shadow-[0_0_30px_rgba(255,255,255,0.05)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className={`relative w-full max-w-3xl bg-slate-950/80 border rounded-[2rem] overflow-hidden transition-all duration-700 animate-in fade-in zoom-in-95 ${getTierStyles()}`}>
        
        {/* Star Sparkle Particles (CSS Only) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-slate-400 hover:text-white rounded-full transition-all border border-white/10 hover:border-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 relative group">
            <img 
              src={capsule.imageUrl} 
              alt={capsule.title}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          </div>

          <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-1 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border ${
                  capsule.tier === 'CONSTELLATION' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]' :
                  capsule.tier === 'SOUVENIR' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                  'bg-slate-500/10 text-slate-400 border-slate-700'
                }`}>
                  {capsule.tier} Capsule
                </span>
                <span className="text-slate-600 font-space text-xs">/</span>
                <span className="text-indigo-300 font-space text-xs font-bold tracking-widest">{new Date(capsule.date).toLocaleDateString()}</span>
              </div>

              <h2 className="text-4xl font-black font-space mb-6 text-white leading-tight tracking-tight">{capsule.title}</h2>
              <div className="h-0.5 w-12 bg-indigo-500 mb-6 rounded-full" />
              <p className="text-slate-400 text-lg leading-relaxed font-light italic mb-8">
                "{capsule.message}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 transform rotate-3">
                  {capsule.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">
                    {capsule.isAnonymous ? 'Anonyme Star' : capsule.author}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Chronos Guardian</p>
                </div>
              </div>
              
              <button className="group flex flex-col items-center gap-1 transition-all hover:scale-110">
                <svg className="w-7 h-7 text-rose-500 group-hover:fill-rose-500 transition-all drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-[10px] font-black text-slate-400 group-hover:text-rose-400">{capsule.likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleModal;
