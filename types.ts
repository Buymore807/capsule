
export type Tier = 'ESSENTIEL' | 'AURA' | 'NOVA' | 'GALAXY' | 'UNIVERSE' | 'BRAND' | 'SOCIAL';
export type Language = 'en' | 'fr' | 'es' | 'de';

export interface Capsule {
  id: string;
  date: string; // ISO string
  title: string;
  message: string;
  imageUrl: string;
  logoUrl?: string; // For brands
  externalLink?: string; // For brands/social
  author: string;
  tier: Tier;
  location?: string;
  isAnonymous: boolean;
  createdAt: string;
  likes: number;
  guestSlots?: number;
}

export interface Offer {
  id: Tier;
  name: string;
  price: number;
  description: string;
  features: string[];
  color: string;
  category: 'personal' | 'professional' | 'social';
}

export interface User {
  id: string;
  email: string;
  name: string;
  purchasedCapsules: string[];
}
