/**
 * Phase 11: Continuous Learning & Pricing Calibration Engine
 * Ingests real project outturn data to fine-tune future AI estimates and optimize conversion funnels.
 */

import {
  ProjectOutturnRecord,
  FunnelStageMetric,
  LearningCalibrationOverview,
} from '@/types/learning';

const OUTTURN_RECORDS: ProjectOutturnRecord[] = [
  {
    id: 'outturn-1',
    referenceCode: 'ST-2026-9821',
    customerName: 'Marcus & Helena Vance',
    projectType: 'Rear Extension & Kitchen Knockthrough',
    borough: 'Ealing (W5)',
    propertyEra: 'Victorian',
    status: 'WON_COMPLETED',
    initialEstimatedCostGbp: 85000,
    quotedContractValueGbp: 88500,
    finalActualCostGbp: 89400,
    variancePercentage: 1.01,
    estimatedDurationWeeks: 12,
    actualDurationWeeks: 13,
    stripOutSurprises: ['Underfloor joist rot under old scullery', 'Lead water supply pipe replacement'],
    costImpactOfUnforeseenGbp: 900,
    winLossCategory: 'TRUST_AND_EXPERTISE',
    clientFeedbackNotes: 'Client chose us because of our upfront explanation of Party Wall and Thames Water requirements rather than lowballing.',
    loggedAt: '2026-02-15',
  },
  {
    id: 'outturn-2',
    referenceCode: 'ST-2026-9822',
    customerName: 'Dr. Julian Thorne',
    projectType: 'Full Period Villa Renovation',
    borough: 'Richmond (TW9)',
    propertyEra: 'Edwardian',
    status: 'WON_COMPLETED',
    initialEstimatedCostGbp: 185000,
    quotedContractValueGbp: 192000,
    finalActualCostGbp: 196500,
    variancePercentage: 2.34,
    estimatedDurationWeeks: 20,
    actualDurationWeeks: 21,
    stripOutSurprises: ['Unbonded chimney breast brickwork requiring gantry steel'],
    costImpactOfUnforeseenGbp: 4500,
    winLossCategory: 'SPECIFICATION_QUALITY',
    clientFeedbackNotes: 'Impressed by the detailed room-by-room breakdown and lime pointing expertise in conservation area.',
    loggedAt: '2026-02-10',
  },
  {
    id: 'outturn-3',
    referenceCode: 'ST-2026-9823',
    customerName: 'Sophia Lin',
    projectType: 'Bespoke Kitchen Knockthrough',
    borough: 'Chiswick (W4)',
    propertyEra: '1930s Semi',
    status: 'WON_COMPLETED',
    initialEstimatedCostGbp: 52000,
    quotedContractValueGbp: 54000,
    finalActualCostGbp: 53800,
    variancePercentage: -0.37,
    estimatedDurationWeeks: 8,
    actualDurationWeeks: 8,
    stripOutSurprises: [],
    costImpactOfUnforeseenGbp: 0,
    winLossCategory: 'TIMELINE',
    clientFeedbackNotes: 'Guaranteed 8-week timeline and fixed-price contract won the deal over competitor proposing 12 weeks.',
    loggedAt: '2026-02-05',
  },
  {
    id: 'outturn-4',
    referenceCode: 'ST-2026-9830',
    customerName: 'David & Clare Miller',
    projectType: 'Wrap-around Extension',
    borough: 'Harrow (HA1)',
    propertyEra: '1930s Semi',
    status: 'LOST',
    initialEstimatedCostGbp: 95000,
    quotedContractValueGbp: 98000,
    estimatedDurationWeeks: 14,
    winLossCategory: 'PRICE_COMPETITIVENESS',
    clientFeedbackNotes: 'Customer selected an uninsured sole-trader quoting £72,000 without structural engineer calculations or building control sign-off.',
    loggedAt: '2026-01-28',
  },
];

const FUNNEL_STAGES: FunnelStageMetric[] = [
  {
    stageId: 'stage-1',
    stageName: '1. Organic SEO Landing / Cost Guide',
    visitorsCount: 18450,
    conversionFromPreviousPercent: 100,
    dropOffPercent: 0,
    averageTimeSpentSeconds: 145,
  },
  {
    stageId: 'stage-2',
    stageName: '2. Tool / Calculator Interaction',
    visitorsCount: 8920,
    conversionFromPreviousPercent: 48.3,
    dropOffPercent: 51.7,
    averageTimeSpentSeconds: 190,
  },
  {
    stageId: 'stage-3',
    stageName: '3. Interactive Project Planner Scope',
    visitorsCount: 2840,
    conversionFromPreviousPercent: 31.8,
    dropOffPercent: 68.2,
    averageTimeSpentSeconds: 320,
  },
  {
    stageId: 'stage-4',
    stageName: '4. Lead & Consultation Created',
    visitorsCount: 384,
    conversionFromPreviousPercent: 13.5,
    dropOffPercent: 86.5,
    averageTimeSpentSeconds: 60,
  },
  {
    stageId: 'stage-5',
    stageName: '5. Surveyor Site Consultation Held',
    visitorsCount: 142,
    conversionFromPreviousPercent: 37.0,
    dropOffPercent: 63.0,
    averageTimeSpentSeconds: 3600,
  },
  {
    stageId: 'stage-6',
    stageName: '6. Formal Tender Quote Issued',
    visitorsCount: 88,
    conversionFromPreviousPercent: 62.0,
    dropOffPercent: 38.0,
    averageTimeSpentSeconds: 0,
  },
  {
    stageId: 'stage-7',
    stageName: '7. WON Construction Contract',
    visitorsCount: 23,
    conversionFromPreviousPercent: 26.1,
    dropOffPercent: 73.9,
    averageTimeSpentSeconds: 0,
  },
];

export function getLearningCalibrationOverview(): LearningCalibrationOverview {
  const wonOutturns = OUTTURN_RECORDS.filter((o) => o.status === 'WON_COMPLETED');
  const totalVariance = wonOutturns.reduce((sum, o) => sum + (o.variancePercentage || 0), 0);
  const avgVariance = wonOutturns.length > 0 ? Number((totalVariance / wonOutturns.length).toFixed(2)) : 0;
  const accuracy = Number((100 - Math.abs(avgVariance)).toFixed(1));

  return {
    overallFunnelConversionRatePercent: 2.45,
    averageEstimateAccuracyPercent: accuracy,
    averageCostVarianceGbp: 1850,
    totalWonProjectsAnalyzed: wonOutturns.length,
    totalLostProjectsAnalyzed: OUTTURN_RECORDS.filter((o) => o.status === 'LOST').length,
    pricingCalibrationFactors: [
      {
        category: 'Structural Steelwork (RSJs)',
        currentBenchmarkDeltaPercent: +2.1,
        recommendedAdjustment: 'Maintain current £3,800–£4,800 goalpost base allowance.',
      },
      {
        category: 'Groundworks & London Clay Excavation',
        currentBenchmarkDeltaPercent: +3.4,
        recommendedAdjustment: 'Increase trench foundation allowance by +3% for South/West London boroughs.',
      },
      {
        category: 'First & Second Fix Plumbing (Unvented Cylinders)',
        currentBenchmarkDeltaPercent: -0.8,
        recommendedAdjustment: 'Current £4,200 standard system benchmark is 99.2% accurate.',
      },
    ],
    funnelStages: FUNNEL_STAGES,
    outturns: OUTTURN_RECORDS,
  };
}

export function logProjectOutturn(record: Omit<ProjectOutturnRecord, 'id' | 'loggedAt'>): ProjectOutturnRecord {
  const newOutturn: ProjectOutturnRecord = {
    ...record,
    id: `outturn-${Date.now()}`,
    loggedAt: new Date().toISOString().split('T')[0],
  };

  OUTTURN_RECORDS.unshift(newOutturn);
  return newOutturn;
}
