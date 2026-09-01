export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ContentFaq {
  question: string;
  answer: string;
}

export interface CostGuidePriceRow {
  type: string;
  low?: number;
  high?: number;
  guideRange: string;
  perM2?: string;
  notes: string;
}

export interface CostGuideTimelineStage {
  stage: string;
  duration: string;
  description: string;
}

export interface CostGuide {
  id: string;
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  category: string;
  status: ContentStatus;
  publishedDate: string;
  lastUpdated: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  indicativeRange: {
    low: number;
    high: number;
    formatted: string;
    unit: string;
  };
  introParagraphs: string[];
  priceTable: {
    title: string;
    description?: string;
    rows: CostGuidePriceRow[];
  };
  costFactors: {
    title: string;
    description: string;
  }[];
  finishLevels: {
    level: string;
    multiplier: string;
    description: string;
    features: string[];
  }[];
  regionalConsiderations: string[];
  timeline: CostGuideTimelineStage[];
  commonAdditionalCosts: {
    item: string;
    cost: string;
    description: string;
  }[];
  faqs: ContentFaq[];
  projectSizeConsiderations?: any[];
  hiddenCostTraps?: any[];
  timelineBreakdown?: any[];
  costSavingTips?: any[];
  builderFirstHandAdvice?: any[];
  realProjectCaseStudy?: any;
  relatedCalculatorSlug: string;
  relatedServiceSlug: string;
  relatedCaseStudySlug: string;
  relatedAdviceSlugs: string[];
  commercialCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
}

export interface AdviceArticle {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  category:
    | 'Extensions'
    | 'Renovations'
    | 'Kitchens'
    | 'Bathrooms'
    | 'Loft Conversions'
    | 'Garage Conversions'
    | 'Planning'
    | 'Building Regulations'
    | 'Driveways'
    | 'Landscaping'
    | 'Materials'
    | 'Construction Costs'
    | 'Project Management';
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedDate: string;
  lastUpdated: string;
  readingTimeMinutes: number;
  status: ContentStatus;
  heroImage: string;
  summary: string;
  contentSections: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
  faqs: ContentFaq[];
  relatedArticleSlugs: string[];
  relatedCalculatorSlug?: string;
  relatedServiceSlug?: string;
  relatedCaseStudySlug?: string;
  commercialCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
}

export interface LocationCostBenchmark {
  projectType: string;
  range: string;
  notes: string;
}

export interface LocationAreaGuide {
  id: string;
  slug: string;
  name: string;
  borough: string;
  region: string;
  postcodes: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroImage: string;
  intro: string;
  opportunityScore?: number;
  tier?: 'TIER_1' | 'TIER_2' | 'TIER_3';
  localArchitecture: {
    title: string;
    description: string;
    popularProperties: string[];
  };
  planningGuidelines: {
    councilName: string;
    permittedDevelopmentNotes: string;
    conservationAreaNotes: string;
  };
  costBenchmarks?: LocationCostBenchmark[];
  builderInsights?: string[];
  servicesAvailable: {
    title: string;
    slug: string;
    description: string;
  }[];
  featuredProjects: {
    title: string;
    slug: string;
    type: string;
    summary: string;
  }[];
  nearbyAreas?: {
    name: string;
    slug: string;
  }[];
  faqs: ContentFaq[];
  relatedCalculatorSlug: string;
  relatedCostGuideSlug: string;
  status: ContentStatus;
  commercialCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
}
