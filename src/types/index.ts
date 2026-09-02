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

export interface ServiceQuickFact {
  label: string;
  value: string;
  detail?: string;
}

export interface ServiceTypeOption {
  title: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  spaceRequired?: string;
  costTier: string;
  planningNotes: string;
}

export type ServiceComparisonRow = Record<string, string>;

export interface ServiceDesignIdea {
  title: string;
  description: string;
  category: string;
}

export interface ServiceCostFactor {
  title: string;
  explanation: string;
}

export interface ServiceJargonItem {
  term: string;
  plainEnglishMeaning: string;
}

export interface ServiceMistakeItem {
  mistake: string;
  whyItCausesProblems: string;
  howToAvoid: string;
}

export interface ServiceDecisionScenario {
  scenario: string;
  recommendation: string;
  why: string;
}

export interface ServiceTimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

export interface ServiceDefinition {
  id: string;
  slug: string;
  title: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  primarySearchIntent: string;
  secondaryTopics: string[];
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  heroImage: string;
  indicativePriceRange: string;
  typicalDuration: string;
  quickFacts: ServiceQuickFact[];
  keyBenefits: string[];
  whatIs: {
    summary: string;
    problemsSolved: string[];
    suitableFor: string[];
    whenAlternativeBetter: string;
  };
  typesAndOptions: ServiceTypeOption[];
  comparisonTable?: {
    headers: string[];
    rows: ServiceComparisonRow[];
  };
  designIdeas: ServiceDesignIdea[];
  homeownerChecklist: string[];
  costFactorsDetailed: ServiceCostFactor[];
  budgetFormula: {
    constructionPercent: string;
    feesPercent: string;
    finishesPercent: string;
    contingencyPercent: string;
    notes: string;
  };
  stages: {
    title: string;
    description: string;
  }[];
  timelinePhasing?: ServiceTimelinePhase[];
  technicalJargonBuster: ServiceJargonItem[];
  planningAndRegulations: {
    planningPermission: string;
    permittedDevelopment: string;
    buildingRegulations: string;
    partyWallNotes?: string;
  };
  planningGuidance: string;
  costDrivers: string[];
  londonPropertyRealities: {
    title: string;
    description: string;
  }[];
  commonMistakes: ServiceMistakeItem[];
  decisionMatrix: ServiceDecisionScenario[];
  connectedCalculator?: {
    slug: string;
    title: string;
    ctaText: string;
  };
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
