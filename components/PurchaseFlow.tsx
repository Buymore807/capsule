
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-3xl font-black text-white font-space uppercase tracking-tight">{t.purchase_title}</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
              {t.purchase_step.replace('{step}', step.toString())} — {getStepTitle()}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-4 justify-center">
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
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      filter === cat.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950/40 text-slate-500 border-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map(offer => (
                  <div 
                    key={offer.id}
                    onClick={() => setSelectedTier(offer.id)}
                    className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedTier === offer.id ? `border-indigo-400 bg-indigo-500/10` : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-4 ${offer.color}`}>Tier: {offer.id}</div>
                    <h3 className="text-2xl font-black font-space uppercase mb-2 text-white">{offer.name}</h3>
                    <div className="text-4xl font-black font-space mb-6 tracking-tighter text-indigo-100">€{offer.price.toFixed(2)}</div>
                    <p className="text-xs text-slate-500 mb-8 leading-relaxed font-light">{offer.description}</p>
                    <ul className="space-y-4">
                      {offer.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <svg className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {selectedTier === offer.id && (
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-12">
                <button 
                  disabled={!selectedTier}
                  onClick={() => setStep(2)}
                  className="px-16 py-5 bg-white text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.4em] font-space rounded-2xl transition-all shadow-2xl hover:bg-indigo-400 hover:text-white"
                >
                  {t.purchase_btn_continue}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-space ml-2">{t.purchase_field_date}</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-950/60 border border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-space ml-2">{t.purchase_field_title}</label>
                  <input 
                    placeholder="Enter your stellar title..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-950/60 border border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-space ml-2">{t.purchase_field_message}</label>
                <textarea 
                  rows={5}
                  placeholder="The words that will echo through history..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-8 py-6 rounded-[2rem] bg-slate-950/60 border border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition-all backdrop-blur-md"
                />
              </div>

              {(selectedTier === 'BRAND' || selectedTier === 'SOCIAL') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-space ml-2">{t.purchase_field_link}</label>
                    <input 
                      placeholder="https://..."
                      value={formData.externalLink}
                      onChange={e => setFormData({...formData, externalLink: e.target.value})}
                      className="w-full px-8 py-5 rounded-[1.5rem] bg-indigo-950/10 border border-indigo-500/20 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  {selectedTier === 'BRAND' && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-space ml-2">{t.purchase_field_logo}</label>
                      <input 
                        placeholder="URL to transparent logo"
                        value={formData.logoUrl}
                        onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                        className="w-full px-8 py-5 rounded-[1.5rem] bg-indigo-950/10 border border-indigo-500/20 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-950/20 p-8 rounded-[2rem] border border-white/5">
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-space ml-2">{t.purchase_field_author}</label>
                  <input 
                    disabled={formData.isAnonymous}
                    placeholder="Signature of the Guardian"
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-950/40 border border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-30 transition-all"
                  />
                </div>
                <div className="md:pt-8 w-full md:w-auto">
                  <label className="flex items-center gap-6 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={e => setFormData({...formData, isAnonymous: e.target.checked, author: e.target.checked ? '' : formData.author})}
                      className="w-8 h-8 rounded-xl border-white/10 text-indigo-600 focus:ring-indigo-500 bg-slate-950 cursor-pointer transition-all"
                    />
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-400 transition-colors uppercase tracking-[0.3em] font-space">{t.purchase_field_anon}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center mt-12 pt-10 border-t border-white/5">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] transition-all font-space flex items-center gap-4 group/back"
                >
                  <div className="w-8 h-px bg-current group-hover/back:w-12 transition-all" /> Back
                </button>
                <button 
                  disabled={!formData.title || !formData.message || !formData.date}
                  onClick={() => setStep(3)}
                  className="px-16 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-black uppercase tracking-[0.4em] font-space rounded-2xl transition-all shadow-xl shadow-indigo-600/30"
                >
                  {t.purchase_btn_secure}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in">
              <div className="relative w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-10 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.48l.348-.07a11.955 11.955 0 01-8.618-3.04V12.03c0-3.32 1.51-6.28 3.88-8.29l.348-.07z" />
                </svg>
                <div className="absolute inset-0 rounded-full animate-ping border border-emerald-500/30 opacity-20 pointer-events-none" />
              </div>
              <h3 className="text-4xl font-black mb-4 text-white font-space uppercase tracking-tight">{t.purchase_checkout_title}</h3>
              <p className="text-slate-500 mb-12 text-center font-light max-w-lg leading-relaxed">
                {t.purchase_checkout_desc.replace('{price}', `€${OFFERS.find(o => o.id === selectedTier)?.price.toFixed(2)}`).replace('{tier}', selectedTier || '')}
              </p>
              
              <div className="w-full max-w-md bg-slate-950/40 p-10 rounded-[2.5rem] border border-white/5 mb-12 backdrop-blur-xl shadow-2xl">
                <div className="flex justify-between mb-6">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] font-space">Temporal Unit</span>
                  <span className="text-white font-bold font-space tracking-tighter">€{OFFERS.find(o => o.id === selectedTier)?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] font-space">Archive Maintenance</span>
                  <span className="text-emerald-400 font-bold font-space tracking-widest text-[10px]">INCLUDED</span>
                </div>
                <div className="h-px bg-white/5 my-8" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] font-space mb-2">Total Energy</span>
                  <span className="text-white text-5xl font-black font-space tracking-tighter">€{OFFERS.find(o => o.id === selectedTier)?.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 w-full max-w-md">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 px-10 py-5 bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] font-space rounded-2xl transition-all border border-white/5"
                >
                  Review Map
                </button>
                <button 
                  onClick={handleCreate}
                  className="flex-1 px-10 py-5 bg-white text-slate-950 hover:bg-indigo-500 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] font-space rounded-2xl transition-all shadow-2xl shadow-white/5"
                >
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
