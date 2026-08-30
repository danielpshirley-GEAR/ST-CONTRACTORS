export type ProjectType =
  | 'extension'
  | 'full-renovation'
  | 'kitchen-renovation'
  | 'bathroom-renovation'
  | 'loft-conversion'
  | 'garage-conversion'
  | 'garden-room'
  | 'driveway'
  | 'landscaping'
  | 'new-build'
  | 'other';

export type PropertyType =
  | 'detached'
  | 'semi-detached'
  | 'terraced'
  | 'bungalow'
  | 'flat'
  | 'other';

export type FinishLevel = 'essential' | 'standard' | 'premium' | 'luxury';

export type ProjectStage =
  | 'exploring_ideas'
  | 'researching_costs'
  | 'ready_to_plan'
  | 'drawings_completed'
  | 'planning_submitted'
  | 'planning_approved'
  | 'building_regs_underway'
  | 'ready_to_appoint'
  | 'construction_started';

export type ProjectTimeline =
  | 'asap'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | '12_plus_months'
  | 'researching_only';

export type LeadScoreBand = 'HOT' | 'HIGH' | 'MEDIUM' | 'EARLY';

export type CRMStage =
  | 'new'
  | 'attempting_contact'
  | 'contacted'
  | 'consultation_booked'
  | 'consultation_completed'
  | 'site_visit_booked'
  | 'site_visit_completed'
  | 'preparing_quote'
  | 'quote_sent'
  | 'follow_up'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'future_opportunity';

export interface ServiceDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  heroImage: string;
  indicativePriceRange: string;
  typicalDuration: string;
  keyBenefits: string[];
  stages: {
    title: string;
    description: string;
  }[];
  planningGuidance: string;
  costDrivers: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  serviceSlug: string;
  projectType: string;
  location: string;
  completionYear: string;
  duration: string;
  indicativeCost: string;
  customerObjective: string;
  challenge: string;
  solution: string;
  coverImage: string;
  beforeImages: string[];
  progressImages: string[];
  afterImages: string[];
  highlights: string[];
  testimonial?: {
    quote: string;
    author: string;
    location: string;
  };
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  postcode?: string;
  projectType?: string;
  message: string;
  preferredContactMethod?: 'phone' | 'email';
  bestTime?: string;
  createdAt?: string;
}

export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}
