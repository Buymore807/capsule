
export type Tier = 'ESSENTIEL' | 'SOUVENIR' | 'CONSTELLATION';

export interface Capsule {
  id: string;
  date: string; // ISO string
  title: string;
  message: string;
  imageUrl: string;
  author: string;
  tier: Tier;
  location?: string;
  isAnonymous: boolean;
  createdAt: string;
  likes: number;
}

export interface Offer {
  id: Tier;
  name: string;
  price: number;
  description: string;
  features: string[];
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  purchasedCapsules: string[];
}
