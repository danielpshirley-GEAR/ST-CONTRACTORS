/**
 * DETERMINISTIC SEO OPPORTUNITY SCORING ENGINE
 * Combines commercial intent, position gap, search volume, project revenue, and conversion data.
 * Does NOT rely on AI hallucinations to calculate priority scores.
 */

import { SearchIntent, OpportunityPriority } from '../types';

export interface OpportunityScoreParams {
  currentPosition?: number;
  monthlyImpressions?: number;
  searchVolumeMonthly?: number;
  searchIntent: SearchIntent;
  estimatedProjectValueGbp: number;
  currentCtr?: number;
  conversionRatePercent?: number;
}

export function calculateLeadPotentialScore(
  intent: SearchIntent,
  projectValueGbp: number,
  isLocal: boolean
): number {
  let intentBase = 50;
  switch (intent) {
    case 'LOCAL':
      intentBase = 95;
      break;
    case 'TRANSACTIONAL':
      intentBase = 90;
      break;
    case 'COMMERCIAL':
      intentBase = 85;
      break;
    case 'INFORMATIONAL':
      intentBase = 40;
      break;
    case 'NAVIGATIONAL':
      intentBase = 20;
      break;
  }

  const valueFactor = Math.min(10, (projectValueGbp / 100000) * 10);
  const localBonus = isLocal ? 5 : 0;

  return Math.min(100, Math.round(intentBase + valueFactor + localBonus));
}

export function calculateDeterministicOpportunityScore(params: OpportunityScoreParams): {
  score: number;
  priority: OpportunityPriority;
} {
  const {
    currentPosition = 15,
    monthlyImpressions = 1000,
    searchVolumeMonthly = 2000,
    searchIntent,
    estimatedProjectValueGbp,
    currentCtr = 2.0,
  } = params;

  // 1. Intent Factor (0 - 100) -> Weight: 40%
  let intentScore = 50;
  if (searchIntent === 'LOCAL' || searchIntent === 'TRANSACTIONAL') intentScore = 95;
  else if (searchIntent === 'COMMERCIAL') intentScore = 85;
  else if (searchIntent === 'INFORMATIONAL') intentScore = 40;
  else intentScore = 20;

  // 2. Position Gap Factor (0 - 100) -> Weight: 25%
  // Positions 4-12 are prime striking distance (huge click gain for +1 to +3 rank jump)
  let positionScore = 40;
  if (currentPosition >= 4 && currentPosition <= 12) {
    positionScore = 100;
  } else if (currentPosition > 12 && currentPosition <= 20) {
    positionScore = 80;
  } else if (currentPosition < 4) {
    // Already ranking high, but could be improved if low CTR
    positionScore = currentCtr < 3.5 ? 85 : 50;
  } else {
    positionScore = 30; // > 20
  }

  // 3. Search Demand Factor (0 - 100) -> Weight: 20%
  const volume = Math.max(monthlyImpressions, searchVolumeMonthly);
  const volumeScore = Math.min(100, Math.round((Math.log10(volume + 1) / 4.3) * 100));

  // 4. Project Revenue Value Factor (0 - 100) -> Weight: 15%
  const valueScore = Math.min(100, Math.round((estimatedProjectValueGbp / 100000) * 100));

  // Weighted formula
  const rawScore =
    intentScore * 0.4 +
    positionScore * 0.25 +
    volumeScore * 0.2 +
    valueScore * 0.15;

  const score = Math.round(Math.min(100, Math.max(1, rawScore)));

  let priority: OpportunityPriority = 'MONITOR';
  if (score >= 90) priority = 'CRITICAL';
  else if (score >= 75) priority = 'HIGH';
  else if (score >= 50) priority = 'MEDIUM';
  else if (score >= 25) priority = 'LOW';

  return { score, priority };
}

/**
 * MASTER SPEC SECTION 46 FORMULA:
 * Opportunity Score = (Volume * CommercialIntent * EstimatedContractValue * ConversionRate * Margin) / Difficulty
 */
export function calculateCommercialRevenueOpportunityScore(params: {
  monthlySearchVolume: number;
  intent: SearchIntent;
  estimatedContractValueGbp: number; // £30,000 – £250,000
  conversionRatePercent?: number; // default 2.5%
  profitMarginPercent?: number; // default 18%
  difficultyScore?: number; // 1 - 100 (from DataForSEO / SERP analysis)
}): {
  commercialScore: number;
  expectedAnnualRevenueGbp: number;
  priorityBand: OpportunityPriority;
} {
  const {
    monthlySearchVolume,
    intent,
    estimatedContractValueGbp,
    conversionRatePercent = 2.5,
    profitMarginPercent = 18,
    difficultyScore = 45,
  } = params;

  // Commercial intent multiplier: Local/Transactional = 1.0, Commercial = 0.8, Informational = 0.35, Navigational = 0.1
  let intentFactor = 0.8;
  if (intent === 'LOCAL' || intent === 'TRANSACTIONAL') intentFactor = 1.0;
  else if (intent === 'COMMERCIAL') intentFactor = 0.85;
  else if (intent === 'INFORMATIONAL') intentFactor = 0.35;
  else intentFactor = 0.1;

  // Expected monthly organic visits if ranking top 3 (approx. 22% average CTR for position 1–3)
  const estimatedMonthlyClicks = monthlySearchVolume * 0.22 * intentFactor;

  // Expected monthly leads
  const estimatedMonthlyLeads = estimatedMonthlyClicks * (conversionRatePercent / 100);

  // Expected won jobs (assume 20% consultation-to-won job conversion)
  const estimatedAnnualWonJobs = estimatedMonthlyLeads * 12 * 0.2;

  // Expected annual gross pipeline revenue
  const expectedAnnualRevenueGbp = Math.round(estimatedAnnualWonJobs * estimatedContractValueGbp);

  // Expected annual net profit contribution
  const expectedProfitGbp = expectedAnnualRevenueGbp * (profitMarginPercent / 100);

  // Opportunity Index normalized against difficulty
  const difficultyMultiplier = Math.max(15, difficultyScore) / 50;
  const rawCommercialScore = (expectedProfitGbp / 50000) / difficultyMultiplier * 10;

  const commercialScore = Math.min(100, Math.max(1, Math.round(rawCommercialScore)));

  let priorityBand: OpportunityPriority = 'MONITOR';
  if (commercialScore >= 85 || expectedAnnualRevenueGbp >= 250000) priorityBand = 'CRITICAL';
  else if (commercialScore >= 65 || expectedAnnualRevenueGbp >= 100000) priorityBand = 'HIGH';
  else if (commercialScore >= 40) priorityBand = 'MEDIUM';
  else if (commercialScore >= 20) priorityBand = 'LOW';

  return {
    commercialScore,
    expectedAnnualRevenueGbp,
    priorityBand,
  };
}
