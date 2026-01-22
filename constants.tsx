
import { Offer, Capsule } from './types';

export const OFFERS: Offer[] = [
  {
    id: 'ESSENTIEL',
    name: 'Fragment',
    price: 2.90,
    description: 'A pure message drifting through time.',
    features: ['1 text message', 'Infinite duration'],
    color: 'border-slate-500 text-slate-100',
    category: 'personal'
  },
  {
    id: 'AURA',
    name: 'Aura',
    price: 4.90,
    description: 'Light up your message with a visual.',
    features: ['1 message', '1 photo', 'Cosmic glow'],
    color: 'border-blue-400 text-blue-100',
    category: 'personal'
  },
  {
    id: 'NOVA',
    name: 'Nova',
    price: 9.90,
    description: 'A brilliant collection of memories.',
    features: ['1 message', '5 photos', 'Diffraction spikes'],
    color: 'border-indigo-400 text-indigo-100',
    category: 'personal'
  },
  {
    id: 'GALAXY',
    name: 'Galaxy',
    price: 14.90,
    description: 'A shared orbit for close ones.',
    features: ['1 message', '10 photos', '5 guest slots'],
    color: 'border-purple-400 text-purple-100',
    category: 'personal'
  },
  {
    id: 'UNIVERSE',
    name: 'Universe',
    price: 19.90,
    description: 'The ultimate temporal monument.',
    features: ['1 message', '10 photos', '10 guest slots'],
    color: 'border-amber-400 text-amber-100',
    category: 'personal'
  },
  {
    id: 'SOCIAL',
    name: 'Social Star',
    price: 90,
    description: 'Bridge the gap between eras.',
    features: ['Profile Image', 'Social Media Link', 'Increased Visibility'],
    color: 'border-rose-400 text-rose-100',
    category: 'social'
  },
  {
    id: 'BRAND',
    name: 'Nebula Brand',
    price: 290,
    description: 'Eternal visibility for your vision.',
    features: ['Transparent Logo', 'Brand Link', 'Featured Placement'],
    color: 'border-emerald-400 text-emerald-100',
    category: 'professional'
  }
];

export const MOCK_CAPSULES: Capsule[] = [
  {
    id: '1',
    date: '1969-07-20',
    title: 'One Small Step',
    message: 'The day humanity touched the moon. A reminder of what we can achieve when we look up.',
    imageUrl: 'https://picsum.photos/seed/moon/600/400',
    author: 'Neil',
    tier: 'UNIVERSE',
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    likes: 1240,
  },
  {
    id: 'brand-1',
    date: '2025-05-20',
    title: 'SpaceX Exploration',
    message: 'Reaching for the stars, one launch at a time. The future belongs to the curious.',
    imageUrl: 'https://picsum.photos/seed/mars/600/400',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/SpaceX-Logo-Xonly.png',
    externalLink: 'https://spacex.com',
    author: 'SpaceX',
    tier: 'BRAND',
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    likes: 5400,
  }
];
