
import React, { useState } from 'react';
import { Tier, Capsule, Language } from '../types';
import { OFFERS } from '../constants';
import { translations } from '../i18n';

interface Props {
  lang: Language;
  onClose: () => void;
  onSuccess: (capsule: Capsule) => void;
}

const PurchaseFlow: React.FC<Props> = ({ lang, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [filter, setFilter] = useState<'personal' | 'professional' | 'social'>('personal');
  const t = translations[lang];

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    date: '',
    author: '',
    externalLink: '',
    logoUrl: '',
    isAnonymous: false,
    imageUrl: 'https://picsum.photos/seed/new/600/400'
  });

  const handleCreate = () => {
    if (!selectedTier) return;
    const newCapsule: Capsule = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      tier: selectedTier,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    onSuccess(newCapsule);
  };

  const getStepTitle = () => {
    if (step === 1) return t.purchase_step_1;
    if (step === 2) return t.purchase_step_2;
    return t.purchase_step_3;
  };

  const filteredOffers = OFFERS.filter(o => o.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-white font-space uppercase tracking-tight">{t.purchase_title}</h2>
            <p className="text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mt-1 md:mt-2">
              {t.purchase_step.replace('{step}', step.toString())} — {getStepTitle()}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
             <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </div>

        <div className="p-6 md:p-10 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                {[
                  { id: 'personal', label: t.cat_personal },
                  { id: 'social', label: t.cat_social },
                  { id: 'professional', label: t.cat_business }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFilter(cat.id as any);
                      setSelectedTier(null);
                    }}
                    className={`px-5 md:px-8 py-2 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${
                      filter === cat.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950/40 text-slate-500 border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredOffers.map(offer => (
                  <div 
                    key={offer.id}
                    onClick={() => setSelectedTier(offer.id)}
                    className={`relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 cursor-pointer transition-all ${
                      selectedTier === offer.id ? `border-indigo-400 bg-indigo-500/10` : 'border-slate-800 bg-slate-950/40 opacity-70'
                    }`}
                  >
                    <div className={`text-[8px] font-black uppercase tracking-[0.2em] mb-3 ${offer.color}`}>Tier: {offer.id}</div>
                    <h3 className="text-xl md:text-2xl font-black font-space uppercase mb-1 text-white">{offer.name}</h3>
                    <div className="text-2xl md:text-4xl font-black font-space mb-4 md:mb-6 tracking-tighter text-indigo-100">€{offer.price.toFixed(2)}</div>
                    <ul className="space-y-2 md:space-y-4">
                      {offer.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <svg className="w-3 h-3 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-6">
                <button 
                  disabled={!selectedTier}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-12 md:px-16 py-4 md:py-5 bg-white text-slate-950 disabled:opacity-30 text-[10px] font-black uppercase tracking-[0.3em] font-space rounded-xl md:rounded-2xl transition-all"
                >
                  {t.purchase_btn_continue}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-space ml-2">{t.purchase_field_date}</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-950/60 border border-white/5 text-white focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-space ml-2">{t.purchase_field_title}</label>
                  <input placeholder="Enter title..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-950/60 border border-white/5 text-white focus:outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-space ml-2">{t.purchase_field_message}</label>
                <textarea rows={4} placeholder="Your words..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-950/60 border border-white/5 text-white focus:outline-none resize-none" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-950/20 p-6 rounded-2xl border border-white/5">
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-space ml-2">{t.purchase_field_author}</label>
                  <input disabled={formData.isAnonymous} placeholder="Author..." value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-950/40 border border-white/5 text-white focus:outline-none" />
                </div>
                <div className="w-full md:w-auto">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input type="checkbox" checked={formData.isAnonymous} onChange={e => setFormData({...formData, isAnonymous: e.target.checked, author: e.target.checked ? '' : formData.author})} className="w-6 h-6 rounded-lg border-white/10 bg-slate-950" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-space">{t.purchase_field_anon}</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-white/5">
                <button onClick={() => setStep(1)} className="w-full sm:w-auto px-6 py-3 text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-[0.3em] transition-all font-space">Back</button>
                <button disabled={!formData.title || !formData.message || !formData.date} onClick={() => setStep(3)} className="w-full sm:w-auto px-12 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] font-space rounded-xl shadow-xl">{t.purchase_btn_secure}</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 md:py-20 animate-in fade-in zoom-in">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 md:mb-10 border border-emerald-500/20">
                 <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 text-white font-space uppercase tracking-tight">{t.purchase_checkout_title}</h3>
              <p className="text-slate-500 mb-8 md:mb-12 text-center font-light max-w-lg text-sm px-4">
                {t.purchase_checkout_desc.replace('{price}', `€${OFFERS.find(o => o.id === selectedTier)?.price.toFixed(2)}`).replace('{tier}', selectedTier || '')}
              </p>
              
              <div className="w-full max-w-sm bg-slate-950/40 p-6 md:p-10 rounded-[2rem] border border-white/5 mb-8 md:mb-12">
                <div className="flex justify-between items-end">
                  <span className="text-slate-300 text-[9px] font-black uppercase tracking-[0.3em] font-space mb-2">Total Energy</span>
                  <span className="text-white text-3xl md:text-5xl font-black font-space tracking-tighter">€{OFFERS.find(o => o.id === selectedTier)?.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button onClick={handleCreate} className="w-full px-10 py-4 bg-white text-slate-950 hover:bg-indigo-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] font-space rounded-xl transition-all shadow-2xl">
                  {t.purchase_btn_pay}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseFlow;
