/**
 * Internal Lead Scoring Engine (0 - 100)
 * Conforms to BUILD_SPEC.md Section 25
 * Note: Never expose this score publicly to homeowners.
 */

import { ProjectPlanInput, LeadScoreResult } from './pricing/types';

export function computeLeadScore(
  input: ProjectPlanInput,
  hasConsultationRequest: boolean = true
): LeadScoreResult {
  const factors: LeadScoreResult['factors'] = [];
  let totalScore = 0;

  // 1. Project Type & Scope (Max 25 pts)
  const highValueTypes = ['extension', 'full-renovation', 'loft-conversion'];
  const midValueTypes = ['kitchen', 'garden-room', 'garage-conversion'];

  if (highValueTypes.includes(input.projectType)) {
    totalScore += 25;
    factors.push({
      factor: 'High-Value Project Type',
      points: 25,
      description: `Target core service: ${input.projectType.replace('-', ' ').toUpperCase()}`,
    });
  } else if (midValueTypes.includes(input.projectType)) {
    totalScore += 20;
    factors.push({
      factor: 'Mid-Value Project Type',
      points: 20,
      description: `Specialist service: ${input.projectType.replace('-', ' ').toUpperCase()}`,
    });
  } else {
    totalScore += 15;
    factors.push({
      factor: 'Standard Project Type',
      points: 15,
      description: 'General residential works',
    });
  }

  // 2. Project Readiness & Planning Status (Max 25 pts)
  if (input.status === 'planning_approved' || input.status === 'ready_to_appoint') {
    totalScore += 25;
    factors.push({
      factor: 'Immediate Construction Readiness',
      points: 25,
      description: 'Planning approved or actively seeking contractor appointment',
    });
  } else if (input.status === 'drawings_completed' || input.status === 'planning_submitted') {
    totalScore += 20;
    factors.push({
      factor: 'Advanced Planning Stage',
      points: 20,
      description: 'Architectural drawings finalized or planning application in progress',
    });
  } else if (input.status === 'ready_to_plan' || input.status === 'building_regs_underway') {
    totalScore += 15;
    factors.push({
      factor: 'Active Planning Phase',
      points: 15,
      description: 'Defined project requirements ready for architectural design',
    });
  } else {
    totalScore += 8;
    factors.push({
      factor: 'Early Feasibility Research',
      points: 8,
      description: 'Initial budget scoping stage',
    });
  }

  // 3. Desired Start Timeline (Max 20 pts)
  if (input.timeline === 'asap') {
    totalScore += 20;
    factors.push({
      factor: 'Immediate Start Timeline (ASAP)',
      points: 20,
      description: 'Client ready for imminent site start',
    });
  } else if (input.timeline === '1_3_months') {
    totalScore += 18;
    factors.push({
      factor: 'Near-Term Timeline (1–3 Months)',
      points: 18,
      description: 'Optimal lead time for survey, engineering & procurement',
    });
  } else if (input.timeline === '3_6_months') {
    totalScore += 14;
    factors.push({
      factor: 'Standard Timeline (3–6 Months)',
      points: 14,
      description: 'Standard planning & tender cycle',
    });
  } else if (input.timeline === '6_12_months') {
    totalScore += 10;
    factors.push({
      factor: 'Medium-Term Pipeline (6–12 Months)',
      points: 10,
      description: 'Future quarter opportunity',
    });
  } else {
    totalScore += 5;
    factors.push({
      factor: 'Long-Range Research (12+ Months)',
      points: 5,
      description: 'Early-stage feasibility research',
    });
  }

  // 4. Budget Realism & Sizing (Max 15 pts)
  if (['100k_150k', '150k_250k', '250k_plus'].includes(input.budgetRange)) {
    totalScore += 15;
    factors.push({
      factor: 'High Sized Budget Allocation',
      points: 15,
      description: `Budget bracket: ${input.budgetRange.replace(/_/g, ' ')}`,
    });
  } else if (['50k_100k', '25k_50k'].includes(input.budgetRange)) {
    totalScore += 12;
    factors.push({
      factor: 'Realistic Project Budget',
      points: 12,
      description: `Budget bracket: ${input.budgetRange.replace(/_/g, ' ')}`,
    });
  } else {
    totalScore += 8;
    factors.push({
      factor: 'Flexible / Unconfirmed Budget',
      points: 8,
      description: 'Requires pricing consultation to confirm budget parameters',
    });
  }

  // 5. Service Area Postcode Check (Max 15 pts)
  const postcodeUpper = (input.postcode || '').trim().toUpperCase();
  const londonSouthEastPrefixes = [
    'W', 'SW', 'TW', 'KT', 'NW', 'N', 'E', 'SE', 'EC', 'WC', 'CR', 'BR', 'SM', 'UB', 'HA', 'EN', 'IG', 'RM', 'DA',
  ];
  const isTargetArea = londonSouthEastPrefixes.some((prefix) => postcodeUpper.startsWith(prefix));

  if (isTargetArea) {
    totalScore += 15;
    factors.push({
      factor: 'Core Service Area Postcode',
      points: 15,
      description: `Location within London & South East hub (${postcodeUpper || 'London'})`,
    });
  } else if (postcodeUpper.length >= 2) {
    totalScore += 8;
    factors.push({
      factor: 'Regional UK Postcode',
      points: 8,
      description: `Postcode: ${postcodeUpper}`,
    });
  }

  // Cap score at 100
  const finalScore = Math.min(Math.max(totalScore, 0), 100);

  // Determine score band
  let scoreBand: LeadScoreResult['scoreBand'] = 'EARLY';
  if (finalScore >= 80) {
    scoreBand = 'HOT';
  } else if (finalScore >= 60) {
    scoreBand = 'HIGH';
  } else if (finalScore >= 40) {
    scoreBand = 'MEDIUM';
  }

  return {
    score: finalScore,
    scoreBand,
    factors,
  };
}
