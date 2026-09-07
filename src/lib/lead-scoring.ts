/**
 * Internal Lead Scoring Engine (0 - 100)
 * ST Contractors Master Build Specification — Phase 8 (Items 11 & 12)
 *
 * Evaluates 5 weighted commercial dimensions:
 * 1. Project Value (Scope, Project Type, Specifications)
 * 2. Readiness (Measurements, Uploaded Plans/Photos, Property details, Budget)
 * 3. Intent (Scope completion, Visuals generated, Brief exported, Review requested)
 * 4. Location (London Core, Wider South East, Outside Area)
 * 5. Project Timing (Immediate, 1-3m, 3-6m, Research)
 *
 * CRITICAL RULE: Never expose this numerical score publicly to homeowners.
 * CRITICAL RULE: Never reject legitimate customers solely because an automated score is low.
 */

import { ProjectPlanInput, LeadScoreResult, LeadScoreBand } from './pricing/types';
import { ProjectState } from '@/types/visualiser-scope';
import { routeLeadByScoreBand } from './leads/lead-router';

// London Core & Greater South East postal prefix definitions
export const LONDON_CORE_PREFIXES = [
  'W', 'SW', 'TW', 'KT', 'NW', 'N', 'E', 'SE', 'EC', 'WC',
];

export const LONDON_SOUTH_EAST_WIDER_PREFIXES = [
  'CR', 'BR', 'SM', 'UB', 'HA', 'EN', 'IG', 'RM', 'DA', 'SL', 'GU', 'RH', 'TN', 'ME', 'WD', 'AL',
];

export function checkPostcodeServiceArea(postcode?: string): {
  isCore: boolean;
  isWider: boolean;
  isOutside: boolean;
  prefix: string;
} {
  if (!postcode || !postcode.trim()) {
    return { isCore: false, isWider: false, isOutside: false, prefix: '' };
  }

  const clean = postcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  // Match outward postal code letters
  const match = clean.match(/^[A-Z]{1,2}/);
  const prefix = match ? match[0] : '';

  const isCore = LONDON_CORE_PREFIXES.includes(prefix);
  const isWider = LONDON_SOUTH_EAST_WIDER_PREFIXES.includes(prefix);
  const isOutside = !isCore && !isWider && prefix.length > 0;

  return { isCore, isWider, isOutside, prefix };
}

/**
 * Standard Planner / Calculator Lead Scoring
 */
export function computeLeadScore(
  input: ProjectPlanInput,
  hasConsultationRequest: boolean = true
): LeadScoreResult {
  const factors: LeadScoreResult['factors'] = [];
  let totalScore = 0;

  // 1. Project Value & Scope (Max 25 pts)
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
    totalScore += 14;
    factors.push({
      factor: 'Standard Project Type',
      points: 14,
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
  const loc = checkPostcodeServiceArea(input.postcode);
  if (loc.isCore) {
    totalScore += 15;
    factors.push({
      factor: 'Core Service Area Postcode',
      points: 15,
      description: `Location within London hub (${loc.prefix})`,
    });
  } else if (loc.isWider) {
    totalScore += 12;
    factors.push({
      factor: 'Greater London / South East Area',
      points: 12,
      description: `Location within South East commuter belt (${loc.prefix})`,
    });
  } else if (loc.isOutside) {
    factors.push({
      factor: 'Outside Primary Operating Hub',
      points: 2,
      description: `Postcode (${loc.prefix}) is outside standard operational area`,
    });
  }

  // Additional consultation request bonus
  if (hasConsultationRequest) {
    totalScore += 5;
    factors.push({
      factor: 'Direct Technical Consultation Requested',
      points: 5,
      description: 'High commercial intent signal',
    });
  }

  // Cap score at 100
  const finalScore = Math.min(Math.max(totalScore, 0), 100);

  // Determine score band
  let scoreBand: LeadScoreBand = 'EARLY_STAGE';
  if (loc.isOutside && finalScore < 60) {
    scoreBand = 'OUTSIDE_CRITERIA';
  } else if (finalScore >= 80) {
    scoreBand = 'HOT';
  } else if (finalScore >= 65) {
    scoreBand = 'STRONG';
  } else if (finalScore >= 45) {
    scoreBand = 'DEVELOPING';
  } else {
    scoreBand = 'EARLY_STAGE';
  }

  const routing = routeLeadByScoreBand(scoreBand);

  return {
    score: finalScore,
    scoreBand,
    factors,
    routingAction: routing.operationalAction,
  };
}

/**
 * Visualiser Lead Scoring Engine
 * Conforms to Phase 8 Item 11 & 12
 */
export function computeVisualiserLeadScore(params: {
  state: ProjectState;
  postcode?: string;
  isConsultationRequested?: boolean;
}): LeadScoreResult {
  const { state, postcode, isConsultationRequested = true } = params;
  const factors: LeadScoreResult['factors'] = [];
  let totalScore = 0;

  // 1. PROJECT VALUE (Max 25 pts)
  const pTypes = (state.projectTypes || []) as string[];
  const isHighValueType = pTypes.some((t) =>
    ['extension', 'loft_conversion', 'full_renovation', 'structural_alteration'].includes(t)
  );
  const isMidValueType = pTypes.some((t) =>
    ['kitchen_renovation', 'garage_conversion', 'garden_room'].includes(t)
  );
  const isMultiSpace = (state.spaces || []).length > 1;

  if (isHighValueType) {
    const pts = isMultiSpace ? 25 : 22;
    totalScore += pts;
    factors.push({
      factor: 'High-Value Project Scope',
      points: pts,
      description: `Primary project types: ${pTypes.join(', ')}${isMultiSpace ? ' (multiple spaces)' : ''}`,
    });
  } else if (isMidValueType) {
    totalScore += 18;
    factors.push({
      factor: 'Mid-Value Project Scope',
      points: 18,
      description: `Specialist project: ${pTypes.join(', ')}`,
    });
  } else {
    totalScore += 12;
    factors.push({
      factor: 'Single Room / Refurbishment',
      points: 12,
      description: `Project: ${pTypes.join(', ') || 'Interior refurbishment'}`,
    });
  }

  // Finish tier bonus
  if (state.selectedFinishTier === 'bespoke') {
    totalScore += 4;
    factors.push({
      factor: 'Bespoke / Architectural Finish Tier',
      points: 4,
      description: 'Client selected high-specification bespoke materials and architectural finishes',
    });
  } else if (state.selectedFinishTier === 'enhanced') {
    totalScore += 2;
  }

  // 2. READINESS (Max 25 pts)
  let readinessScore = 0;
  // Has explicit dimensions
  const hasDimensions = (state.spaces || []).some((s) => (s.areaM2?.value || 0) > 0);
  if (hasDimensions) {
    readinessScore += 7;
    factors.push({
      factor: 'Real Room Dimensions Supplied',
      points: 7,
      description: `Estimated floor area: ${state.spaces.reduce((acc, s) => acc + (s.areaM2?.value || 0), 0)}m²`,
    });
  }

  // Has uploaded assets (photos / drawings)
  const uploadCount = (state.uploadedAssets || []).length;
  if (uploadCount > 0) {
    const pts = Math.min(8, 4 + uploadCount * 2);
    readinessScore += pts;
    factors.push({
      factor: 'Existing Site Photos / Plans Uploaded',
      points: pts,
      description: `${uploadCount} photographic or plan asset(s) provided`,
    });
  }

  // Property details known
  const propType = state.property?.type?.value;
  const propEra = state.property?.era?.value;
  if (propType && propType !== 'unknown' && propType !== 'not_provided') {
    readinessScore += 5;
    factors.push({
      factor: 'Property Context Identified',
      points: 5,
      description: `${propType} ${propEra && propEra !== 'unknown' ? propEra : ''}`.trim(),
    });
  }

  // Budget alignment known
  const indicativeMin = state.budgetAlignment?.indicativeCostRange?.min;
  if (indicativeMin && indicativeMin > 0) {
    readinessScore += 5;
    factors.push({
      factor: 'Explicit Homeowner Budget Confirmed',
      points: 5,
      description: `Indicative scope: £${indicativeMin.toLocaleString()}`,
    });
  }

  totalScore += Math.min(25, readinessScore);

  // 3. INTENT (Max 20 pts)
  let intentScore = 0;
  // Completed full scope
  const scopeCount = state.scopeOfWorks?.length || 0;
  if (scopeCount > 0) {
    intentScore += 8;
    factors.push({
      factor: 'Complete Trade Scope Generated',
      points: 8,
      description: `${scopeCount} trade items structured across 12 sections`,
    });
  }

  // Generated or modified visuals
  const hasVisual = Boolean(state.visualConcept?.generatedConceptImage || state.visualConcept?.currentConceptImage);
  const visualHistoryCount = state.visualConcept?.visualHistory?.length || 0;
  if (hasVisual || visualHistoryCount > 0) {
    intentScore += 5;
    factors.push({
      factor: 'AI Concept Visualisation Generated',
      points: 5,
      description: `${visualHistoryCount || 1} visual design concept(s) generated/explored`,
    });
  }

  // Direct consultation request
  if (isConsultationRequested) {
    intentScore += 7;
    factors.push({
      factor: 'Commercial Consultation Requested',
      points: 7,
      description: 'Homeowner requested direct scope review / consultation',
    });
  }

  totalScore += Math.min(20, intentScore);

  // 4. LOCATION (Max 15 pts)
  const locStr = postcode || state.property?.location?.value;
  const loc = checkPostcodeServiceArea(locStr);
  if (loc.isCore) {
    totalScore += 15;
    factors.push({
      factor: 'Core London Operating Area',
      points: 15,
      description: `Target postcode hub (${loc.prefix})`,
    });
  } else if (loc.isWider) {
    totalScore += 12;
    factors.push({
      factor: 'Greater London / South East Area',
      points: 12,
      description: `Wider service area (${loc.prefix})`,
    });
  } else if (loc.isOutside) {
    factors.push({
      factor: 'Outside Primary Operating Area',
      points: 2,
      description: `Postcode (${loc.prefix}) is outside standard coverage`,
    });
  } else {
    // Location not yet specified
    totalScore += 8;
    factors.push({
      factor: 'Location Pending Confirmation',
      points: 8,
      description: 'Requires location verification during consultation',
    });
  }

  // 5. PROJECT TIMING & COMPLEXITY (Max 15 pts)
  const complexityLevel = state.complexity?.level;
  if (complexityLevel === 'HIGH' || complexityLevel === 'VERY_HIGH' || complexityLevel === 'MODERATE') {
    totalScore += 12;
    factors.push({
      factor: 'Significant Structural Complexity',
      points: 12,
      description: `${complexityLevel} complexity: requires turnkey main contractor`,
    });
  } else {
    totalScore += 8;
    factors.push({
      factor: 'Standard Execution Complexity',
      points: 8,
      description: 'Standard residential timeline',
    });
  }

  // Cap score at 100
  const finalScore = Math.min(Math.max(totalScore, 0), 100);

  // Determine score band
  let scoreBand: LeadScoreBand = 'EARLY_STAGE';
  if (loc.isOutside && finalScore < 60) {
    scoreBand = 'OUTSIDE_CRITERIA';
  } else if (finalScore >= 80) {
    scoreBand = 'HOT';
  } else if (finalScore >= 65) {
    scoreBand = 'STRONG';
  } else if (finalScore >= 45) {
    scoreBand = 'DEVELOPING';
  } else {
    scoreBand = 'EARLY_STAGE';
  }

  const routing = routeLeadByScoreBand(scoreBand);

  return {
    score: finalScore,
    scoreBand,
    factors,
    routingAction: routing.operationalAction,
  };
}
