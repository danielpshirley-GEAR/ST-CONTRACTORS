/**
 * Phase 11: Continuous Learning & Conversion Rate Optimisation (CRO) Types
 * Complies with Section 71, 72, and 73 of the Master Build Specification.
 */

export interface ProjectOutturnRecord {
  id: string;
  referenceCode: string;
  customerName: string;
  projectType: string;
  borough: string;
  propertyEra: string;
  status: 'WON_COMPLETED' | 'WON_IN_PROGRESS' | 'LOST';
  
  // Financial Comparison
  initialEstimatedCostGbp: number;
  quotedContractValueGbp: number;
  finalActualCostGbp?: number;
  variancePercentage?: number; // e.g. +3.8%
  
  // Timeline Comparison
  estimatedDurationWeeks: number;
  actualDurationWeeks?: number;
  
  // Unforeseen Site Discoveries
  stripOutSurprises?: string[];
  costImpactOfUnforeseenGbp?: number;
  
  // Win / Loss Intelligence
  winLossCategory: 'PRICE_COMPETITIVENESS' | 'SPECIFICATION_QUALITY' | 'TRUST_AND_EXPERTISE' | 'TIMELINE' | 'POSTPONED';
  clientFeedbackNotes: string;
  loggedAt: string;
}

export interface FunnelStageMetric {
  stageId: string;
  stageName: string;
  visitorsCount: number;
  conversionFromPreviousPercent: number;
  dropOffPercent: number;
  averageTimeSpentSeconds: number;
}

export interface LearningCalibrationOverview {
  overallFunnelConversionRatePercent: number;
  averageEstimateAccuracyPercent: number; // e.g. 96.2% accurate
  averageCostVarianceGbp: number;
  totalWonProjectsAnalyzed: number;
  totalLostProjectsAnalyzed: number;
  pricingCalibrationFactors: {
    category: string;
    currentBenchmarkDeltaPercent: number;
    recommendedAdjustment: string;
  }[];
  funnelStages: FunnelStageMetric[];
  outturns: ProjectOutturnRecord[];
}
