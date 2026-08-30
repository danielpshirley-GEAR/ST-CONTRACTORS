/**
 * Phase 9: Algorithmic Lead Qualification Engine
 * Strictly scores and classifies inbound leads based on commercial value, prime location, scope depth, and urgency.
 */

import { UnifiedProjectProfile } from '@/types/project-profile';

export interface LeadQualificationResult {
  score: number; // 0 to 100
  scoreBand: 'HOT' | 'WARM' | 'NURTURE';
  qualificationFactors: {
    factor: string;
    pointsAwarded: number;
    maxPoints: number;
    notes: string;
  }[];
  isPriorityLondonBorough: boolean;
  estimatedContractValueGbp: number;
  recommendedAction: string;
}

const PRIME_LONDON_BOROUGHS = [
  'ealing',
  'hounslow',
  'chiswick',
  'richmond',
  'kew',
  'hammersmith',
  'fulham',
  'kensington',
  'chelsea',
  'westminster',
  'wandsworth',
  'islington',
  'camden',
  'barnet',
  'harrow',
];

export function calculateLeadQualificationScore(
  profile: Partial<UnifiedProjectProfile>,
  contactDetails?: {
    phone?: string;
    email?: string;
    hasAppointment?: boolean;
    notes?: string;
  }
): LeadQualificationResult {
  const factors: LeadQualificationResult['qualificationFactors'] = [];

  // 1. Budget & Project Scale (Max: 30 pts)
  const estVal = profile.estimate?.expected || profile.estimate?.low || 65000;
  let budgetPoints = 15;
  let budgetNotes = 'Standard residential scope (£30k–£60k)';
  if (estVal >= 120000) {
    budgetPoints = 30;
    budgetNotes = `High-value project (£${estVal.toLocaleString()})`;
  } else if (estVal >= 70000) {
    budgetPoints = 25;
    budgetNotes = `Solid mid-to-large project (£${estVal.toLocaleString()})`;
  } else if (estVal >= 45000) {
    budgetPoints = 20;
    budgetNotes = `Standard single room / knockthrough (£${estVal.toLocaleString()})`;
  }
  factors.push({
    factor: 'Project Budget & Scale',
    pointsAwarded: budgetPoints,
    maxPoints: 30,
    notes: budgetNotes,
  });

  // 2. Prime London Borough Location (Max: 25 pts)
  const postcode = (profile.location?.postcode || '').toLowerCase();
  const borough = (profile.location?.borough || '').toLowerCase();
  const isPrime = PRIME_LONDON_BOROUGHS.some(
    (b) => borough.includes(b) || postcode.startsWith('w') || postcode.startsWith('sw') || postcode.startsWith('nw') || postcode.startsWith('tw')
  );

  const locationPoints = isPrime ? 25 : 15;
  factors.push({
    factor: 'Target Geography & Borough',
    pointsAwarded: locationPoints,
    maxPoints: 25,
    notes: isPrime
      ? `Prime core service territory: ${profile.location?.borough || profile.location?.postcode || 'West / South West London'}`
      : `Secondary service area (${profile.location?.postcode || 'Greater London'})`,
  });

  // 3. Planning & Architectural Readiness (Max: 20 pts)
  let readinessPoints = 10;
  let readinessNotes = 'Early exploration stage';
  if (profile.hasDrawings && profile.hasStructuralCalculations) {
    readinessPoints = 20;
    readinessNotes = 'Architectural drawings & structural calcs completed';
  } else if (profile.hasDrawings || profile.planningStatus === 'approved') {
    readinessPoints = 16;
    readinessNotes = 'Drawings or Planning Approved';
  } else if (profile.planningStatus === 'permitted_development') {
    readinessPoints = 14;
    readinessNotes = 'Permitted Development scope identified';
  }
  factors.push({
    factor: 'Planning & Structural Readiness',
    pointsAwarded: readinessPoints,
    maxPoints: 20,
    notes: readinessNotes,
  });

  // 4. Timeline Urgency (Max: 15 pts)
  let timelinePoints = 10;
  let timelineNotes = 'Standard timeline (3–6 months)';
  if (profile.timelineTarget === 'immediate') {
    timelinePoints = 15;
    timelineNotes = 'Ready to start immediately / tender stage';
  } else if (profile.timelineTarget === '1_to_3_months') {
    timelinePoints = 13;
    timelineNotes = 'Starting in 1–3 months';
  }
  factors.push({
    factor: 'Project Timeline Urgency',
    pointsAwarded: timelinePoints,
    maxPoints: 15,
    notes: timelineNotes,
  });

  // 5. Contact Completeness & Consultation Intent (Max: 10 pts)
  let contactPoints = 5;
  if (contactDetails?.phone && contactDetails.phone.length >= 10) {
    contactPoints += 3;
  }
  if (contactDetails?.hasAppointment) {
    contactPoints += 2;
  }
  factors.push({
    factor: 'Direct Contact & Consultation Intent',
    pointsAwarded: Math.min(10, contactPoints),
    maxPoints: 10,
    notes: contactDetails?.hasAppointment
      ? 'Customer requested scheduled consultation / surveyor call'
      : 'Direct contact phone & email provided',
  });

  const totalScore = Math.min(
    100,
    factors.reduce((sum, f) => sum + f.pointsAwarded, 0)
  );

  let scoreBand: LeadQualificationResult['scoreBand'] = 'NURTURE';
  let recommendedAction = 'Send automated cost guide follow-up email.';
  if (totalScore >= 80) {
    scoreBand = 'HOT';
    recommendedAction = 'Call within 1 hour — Senior Estimator site consultation priority.';
  } else if (totalScore >= 55) {
    scoreBand = 'WARM';
    recommendedAction = 'Contact same-day for discovery callback & scope review.';
  }

  return {
    score: totalScore,
    scoreBand,
    qualificationFactors: factors,
    isPriorityLondonBorough: isPrime,
    estimatedContractValueGbp: estVal,
    recommendedAction,
  };
}
