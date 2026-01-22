
import { Offer, Capsule } from './types';

export const OFFERS: Offer[] = [
  {
    id: 'ESSENTIEL',
    name: 'Essentiel',
    price: 9,
    description: 'A classic memory in the stars.',
    features: ['1 message', '1 photo', 'Public visibility'],
    color: 'border-slate-400 text-slate-100',
  },
  {
    id: 'SOUVENIR',
    name: 'Souvenir+',
    price: 29,
    description: 'Enhance your legacy.',
    features: ['Up to 3 photos', 'Ambient music', 'Featured for 7 days', 'Custom frame'],
    color: 'border-blue-400 text-blue-100',
  },
  {
    id: 'CONSTELLATION',
    name: 'Constellation',
    price: 79,
    description: 'Shine brighter than anyone.',
    features: ['High-visibility "Star" icon', 'Premium badge', 'Shareable link', 'Infinite duration'],
    color: 'border-amber-400 text-amber-100',
  },
];

export const MOCK_CAPSULES: Capsule[] = [
  {
    id: '1',
    date: '1969-07-20',
    title: 'One Small Step',
    message: 'The day humanity touched the moon. A reminder of what we can achieve when we look up.',
    imageUrl: 'https://picsum.photos/seed/moon/600/400',
    author: 'Neil',
    tier: 'CONSTELLATION',
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    likes: 1240,
  },
  {
    id: '2',
    date: '1989-11-09',
    title: 'Wall Coming Down',
    message: 'I was there when the barriers fell. Freedom felt like static in the air.',
    imageUrl: 'https://picsum.photos/seed/wall/600/400',
    author: 'BerlinDreamer',
    tier: 'SOUVENIR',
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    likes: 850,
  },
  {
    id: '3',
    date: '2025-01-01',
    title: 'Future Hopes',
    message: 'To my future self: I hope we finally learned to play the guitar.',
    imageUrl: 'https://picsum.photos/seed/guitar/600/400',
    author: 'SelfCare',
    tier: 'ESSENTIEL',
    isAnonymous: true,
    createdAt: new Date().toISOString(),
    likes: 45,
  }
];
