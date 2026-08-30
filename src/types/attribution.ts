/**
 * Phase 10: Closed-Loop Revenue Attribution & Conversion Engine Types
 * Complies with Section 66, 67, and 68 of the Master Build Specification.
 */

export type AttributionModelType = 'first_touch' | 'last_touch' | 'linear' | 'w_shaped';

export interface TouchpointRecord {
  id: string;
  stepNumber: number;
  channel: 'organic_search' | 'direct' | 'referral' | 'local_pack' | 'calculator' | 'visualiser' | 'planner';
  pageUrl: string;
  pageTitle: string;
  referrer?: string;
  utmSource?: string;
  utmCampaign?: string;
  timestamp: string;
  interactionType: 'PAGEVIEW' | 'CALCULATION' | 'VISUALISATION' | 'PLANNER_SCOPE' | 'LEAD_SUBMISSION';
}

export interface CustomerJourneyRecord {
  leadId: string;
  referenceCode: string;
  customerName: string;
  projectType: string;
  borough: string;
  touchpoints: TouchpointRecord[];
  firstTouchPage: string;
  conversionTool: string;
  crmStage: string;
  estimatedContractValueGbp: number;
  realisedWonRevenueGbp?: number;
  daysToConvert: number;
  isWon: boolean;
}

export interface AssetAttributionSummary {
  assetUrl: string;
  assetTitle: string;
  assetCategory: 'cost_guide' | 'calculator' | 'location_page' | 'service_page' | 'visualiser' | 'advice_guide';
  totalOrganicVisits: number;
  leadsGenerated: number;
  consultationsBooked: number;
  wonProjectsCount: number;
  firstTouchAttributedRevenueGbp: number;
  lastTouchAttributedRevenueGbp: number;
  wShapedAttributedRevenueGbp: number;
  conversionRatePercent: number;
  romiMultiplier: number; // Return on Marketing Investment (e.g. 14.5x)
}

export interface AttributionOverviewReport {
  totalPipelineValueGbp: number;
  totalRealisedWonRevenueGbp: number;
  totalConsultations: number;
  totalWonContracts: number;
  overallConversionRatePercent: number;
  averageContractValueGbp: number;
  averageDaysToClose: number;
  topAcquisitionAssets: AssetAttributionSummary[];
  journeys: CustomerJourneyRecord[];
  channelDistribution: {
    channel: string;
    leadsCount: number;
    wonRevenueGbp: number;
    percentageOfRevenue: number;
  }[];
}
