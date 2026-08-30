/**
 * UNIFIED NORMALIZED SEO DATA MODELS & TYPES
 * Decouples the application from third-party vendor APIs.
 * Conforms to BUILD_SPEC.md Phase 4 & Master SEO Intelligence Spec
 */

// ============================================================================
// 1. INTEGRATION CONFIGURATION & HEALTH
// ============================================================================

export type IntegrationStatus =
  | 'connected'
  | 'not_configured'
  | 'authentication_required'
  | 'error'
  | 'disabled';

export type IntegrationServiceId =
  | 'gsc'
  | 'ga4'
  | 'dataforseo'
  | 'pagespeed'
  | 'maps'
  | 'gemini'
  | 'gbp';

export interface IntegrationServiceInfo {
  id: IntegrationServiceId;
  name: string;
  category: 'search_console' | 'analytics' | 'keyword_data' | 'performance' | 'maps' | 'ai' | 'business_profile';
  status: IntegrationStatus;
  requiredEnvVars: string[];
  description: string;
  configuredEnvVarsCount: number;
  lastSuccessfulSync?: string;
  lastError?: string;
  estimatedCostGbp?: number;
}

export interface IntegrationHealthCheckResult {
  serviceId: IntegrationServiceId;
  name: string;
  status: 'PASS' | 'NOT_CONFIGURED' | 'ERROR' | 'DISABLED';
  latencyMs: number;
  message: string;
  timestamp: string;
  troubleshooting?: {
    likelyReason: string;
    recommendedFix: string;
    docsUrl?: string;
  };
}

// ============================================================================
// 2. NORMALIZED KEYWORD & RANKING METRICS
// ============================================================================

export type SearchIntent =
  | 'INFORMATIONAL'
  | 'COMMERCIAL'
  | 'TRANSACTIONAL'
  | 'NAVIGATIONAL'
  | 'LOCAL';

export interface KeywordMetric {
  keyword: string;
  landingPage?: string;
  searchVolumeMonthly: number;
  cpcGbp: number;
  keywordDifficulty: number; // 0 - 100
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  searchIntent: SearchIntent;
  leadPotentialScore: number; // 0 - 100
  estimatedProjectValueGbp: number;
  currentPosition?: number;
  previousPosition?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  serpTopCompetitor?: string;
  features?: string[]; // 'featured_snippet', 'paa', 'map_pack', etc.
  lastCheckedAt: string;
}

export interface RankingMetric {
  keyword: string;
  url: string;
  position: number;
  previousPosition?: number;
  positionChange?: number;
  clicks: number;
  impressions: number;
  ctr: number;
  device?: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'ALL';
  country?: string;
  period: '7d' | '28d' | '3m' | '6m' | '12m' | 'custom';
  dateRecorded: string;
}

// ============================================================================
// 3. NORMALIZED PAGE & TRAFFIC METRICS
// ============================================================================

export interface PageMetric {
  url: string;
  pageTitle: string;
  category: 'cost_guide' | 'advice' | 'area' | 'calculator' | 'service' | 'case_study' | 'landing' | 'other';
  organicClicks: number;
  organicImpressions: number;
  averageCtr: number;
  averagePosition: number;
  topQuery: string;
  totalIndexedKeywords: number;
  indexStatus: 'INDEXED' | 'NOT_INDEXED' | 'EXCLUDED' | 'UNKNOWN';
  lastCrawledAt?: string;
  canonicalUrl?: string;
}

export interface TrafficMetric {
  url: string;
  organicSessions: number;
  totalUsers: number;
  newUsers: number;
  engagedSessions: number;
  engagementRatePercent: number;
  bounceRatePercent: number;
  averageSessionDurationSeconds: number;
  period: '7d' | '28d' | '3m' | '6m' | '12m';
}

export interface ConversionMetric {
  url: string;
  pageTitle: string;
  organicSessions: number;
  calculatorStarts: number;
  calculatorCompletions: number;
  plannerStarts: number;
  plannerCompletions: number;
  leadsGenerated: number;
  consultationsBooked: number;
  wonProjects: number;
  pipelineValueGbp: number;
  conversionRatePercent: number;
}

// ============================================================================
// 4. NORMALIZED TECHNICAL & PERFORMANCE METRICS
// ============================================================================

export interface TechnicalAuditIssue {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'performance' | 'seo' | 'accessibility' | 'best_practices';
  displayValue?: string;
  score?: number;
  remediationSnippet?: string;
}

export interface TechnicalMetric {
  url: string;
  device: 'MOBILE' | 'DESKTOP';
  performanceScore: number; // 0 - 100
  seoScore: number; // 0 - 100
  accessibilityScore?: number;
  bestPracticesScore?: number;
  lcpSeconds: number; // Largest Contentful Paint (<2.5s is good)
  clsScore: number; // Cumulative Layout Shift (<0.1 is good)
  inpMs?: number; // Interaction to Next Paint (<200ms is good)
  fidMs?: number; // First Input Delay
  fcpSeconds: number; // First Contentful Paint
  speedIndexSeconds: number;
  issues: TechnicalAuditIssue[];
  lastAuditedAt: string;
}

// ============================================================================
// 5. NORMALIZED COMPETITOR & LOCAL METRICS
// ============================================================================

export interface CompetitorMetric {
  competitorDomain: string;
  targetKeyword: string;
  competitorRank: number;
  competitorUrl: string;
  competitorTitle?: string;
  domainAuthority?: number;
  contentWordCount?: number;
  strengths: string[];
  weaknesses: string[];
  contentGapIdentified?: string;
}

export interface LocationMetric {
  locationName: string;
  boroughOrCounty: string;
  outwardPostcode: string;
  postcodeDistricts: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isInServiceRadius: boolean;
  pricingMultiplier: number;
  searchDemandMonthly: number;
  existingPageSlug?: string;
  recommendedPageStatus: 'PUBLISHED' | 'RECOMMENDED' | 'OUT_OF_AREA' | 'MONITOR';
}

// ============================================================================
// 6. UNIFIED SEO OPPORTUNITY MODEL
// ============================================================================

export type OpportunityType =
  | 'RANKING_STRIKING_DISTANCE' // Position 4 - 20
  | 'HIGH_IMPRESSION_LOW_CTR' // High impression, poor snippet
  | 'DECLINING_RANKING' // Dropping positions
  | 'HIGH_CONVERTING_ASSET' // High ROI page to expand
  | 'CONVERSION_OPTIMISATION' // High traffic, low conversion
  | 'NEW_CONTENT_GAP' // Search intent missing page
  | 'COMPETITOR_WEAKNESS' // Overtake competitor
  | 'LOCAL_AREA_OPPORTUNITY' // High demand local hub
  | 'TECHNICAL_CORE_WEB_VITALS' // LCP / CLS issue
  | 'INTERNAL_LINKING_ORPHAN' // Missing strategic internal links
  | 'CONTENT_EXPANSION'; // Existing page update

export type OpportunityPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MONITOR';

export interface SEOOpportunity {
  id: string;
  type: OpportunityType;
  priority: OpportunityPriority;
  title: string;
  description: string;
  url?: string;
  keyword?: string;
  currentPosition?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  traffic?: number;
  conversionRate?: number;
  searchVolume?: number;
  keywordDifficulty?: number;
  competitorPosition?: number;
  opportunityScore: number; // 0 - 100 deterministic score
  leadPotentialScore?: number; // 0 - 100 lead intent score
  estimatedImpact: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  sourceApis: IntegrationServiceId[];
  recommendedAction: string;
  suggestedActionType?: 'UPDATE_METADATA' | 'ADD_CONTENT_SECTION' | 'BUILD_CALCULATOR_FUNNEL' | 'ADD_INTERNAL_LINKS' | 'CREATE_PAGE' | 'FIX_TECHNICAL_SPEED';
  createdAt: string;
  lastUpdated: string;
}

// ============================================================================
// 7. CONTENT BRIEF & AI REASONING OUTPUT
// ============================================================================

export interface ContentBriefSection {
  heading: string;
  targetKeywords: string[];
  bulletPoints: string[];
  suggestedWordCount?: number;
}

export interface ContentBriefOutput {
  id: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  estimatedSearchVolume: number;
  contentType: 'COST_GUIDE' | 'ADVICE_ARTICLE' | 'SERVICE_PAGE' | 'LOCATION_PAGE' | 'CALCULATOR';
  suggestedTitle: string;
  suggestedH1: string;
  suggestedMetaDescription: string;
  targetWordCount: number;
  targetAudience: string;
  commercialFunnels: {
    recommendedCalculatorSlug?: string;
    recommendedServiceSlug?: string;
    recommendedCaseStudySlug?: string;
    ctaHeadline: string;
    ctaButtonText: string;
    ctaHref: string;
  };
  structure: ContentBriefSection[];
  suggestedFaqs: Array<{ question: string; answerGuidance: string }>;
  evidenceSources: {
    gscQueries?: string[];
    monthlyVolume?: number;
    competitorsAnalyzed?: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  status: 'DRAFT_PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED';
  createdAt: string;
}

// ============================================================================
// 8. DASHBOARD OVERVIEW AGGREGATE
// ============================================================================

export interface SEOOverviewDashboardData {
  kpis: {
    organicClicks: number;
    organicClicksChangePercent: number;
    organicImpressions: number;
    organicImpressionsChangePercent: number;
    organicSessions: number;
    organicLeads: number;
    pipelineValueGbp: number;
    averageCtr: number;
    trackedKeywordsCount: number;
    keywordsTop3Count: number;
    keywordsTop10Count: number;
    keywordsTop20Count: number;
    totalOpportunitiesCount: number;
    criticalOpportunitiesCount: number;
    criticalTechnicalIssuesCount: number;
  };
  topOpportunities: SEOOpportunity[];
  recentRankingGains: RankingMetric[];
  recentRankingLosses: RankingMetric[];
  topConversionPages: ConversionMetric[];
  technicalWarnings: TechnicalAuditIssue[];
  integrationStatuses: IntegrationServiceInfo[];
  lastUpdated: string;
}
