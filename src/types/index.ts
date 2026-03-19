export interface Address {
  street: string;
  city: string;
  country: string;
  zip: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: Address;
}

export interface SeoDefaults {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  url: string;
  contact: ContactInfo;
  social: Record<string, string>;
  seo: SeoDefaults;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  icon: string;
  positioning: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  useCases: string[];
  ctaText: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Package {
  id: string;
  name: string;
  featured: boolean;
  targetClient: string;
  priceRange: PriceRange;
  wordLimit: number;
  turnaround: string;
  revisions: number;
  researchDepth: string;
  includes: string[];
  ctaText: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Retainer {
  id: string;
  name: string;
  monthlyRate: number;
  wordVolume: number;
  discount: number;
  benefits: string[];
}

export interface ProjectPricing {
  type: string;
  scope: string;
  priceRange: PriceRange;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  serviceInterest: string;
  budget?: string;
  message: string;
  honeypot?: string;
}

export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

