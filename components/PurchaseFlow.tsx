
import React, { useState } from 'react';
import { Tier, Capsule } from '../types';
import { OFFERS } from '../constants';

interface Props {
  onClose: () => void;
  onSuccess: (capsule: Capsule) => void;
}

const PurchaseFlow: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    date: '',
    author: '',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-white">Engrave a Memory</h2>
            <p className="text-slate-400 text-sm">Step {step} of 3: {step === 1 ? 'Choose Offer' : step === 2 ? 'Customize Capsule' : 'Payment'}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {OFFERS.map(offer => (
                <div 
                  key={offer.id}
                  onClick={() => setSelectedTier(offer.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                    selectedTier === offer.id ? `${offer.color} bg-indigo-500/10` : 'border-slate-800 bg-slate-800/50 grayscale hover:grayscale-0'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                  <div className="text-3xl font-black mb-4">${offer.price}</div>
                  <p className="text-sm text-slate-400 mb-6">{offer.description}</p>
                  <ul className="space-y-3">
                    {offer.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {selectedTier === offer.id && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              <div className="col-span-full flex justify-end mt-8">
                <button 
                  disabled={!selectedTier}
                  onClick={() => setStep(2)}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
                >
                  Continue to Customization
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Date of Memory</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Title</label>
                  <input 
                    placeholder="E.g. The first summer night"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Share the core of this memory..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Author Name</label>
                  <input 
                    disabled={formData.isAnonymous}
                    placeholder="Your Name"
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>
                <div className="pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={e => setFormData({...formData, isAnonymous: e.target.checked, author: e.target.checked ? '' : formData.author})}
                      className="w-6 h-6 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-800"
                    />
                    <span className="text-sm text-slate-300">Publish Anonymously</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-4 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button 
                  disabled={!formData.title || !formData.message || !formData.date}
                  onClick={() => setStep(3)}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
                >
                  Go to Secure Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.48l.348-.07a11.955 11.955 0 01-8.618-3.04V12.03c0-3.32 1.51-6.28 3.88-8.29l.348-.07z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Secure Checkout</h3>
              <p className="text-slate-400 mb-8">You are about to pay ${OFFERS.find(o => o.id === selectedTier)?.price} for the {selectedTier} tier.</p>
              
              <div className="w-full max-w-sm bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-400">Memory Slot</span>
                  <span className="text-white font-bold">${OFFERS.find(o => o.id === selectedTier)?.price}.00</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-slate-400">Processing Fee</span>
                  <span className="text-white font-bold">$0.00</span>
                </div>
                <div className="h-px bg-slate-700 my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-indigo-400">${OFFERS.find(o => o.id === selectedTier)?.price}.00</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="px-8 py-4 text-slate-400 hover:text-white transition-colors"
                >
                  Review Details
                </button>
                <button 
                  onClick={handleCreate}
                  className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Pay & Publish Now
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
