/**
 * Unified Project Profile Synchronization Engine
 * Handles bidirectional state syncing between Calculators, AI Planner, Quote Builder, and Customer Portal.
 * Implements the "Start Anywhere Principle" from Section 12 of the Master Build Specification.
 */

import { UnifiedProjectProfile, ProjectRoomProfile, ProjectScopeItem } from '@/types/project-profile';
import { getOrCreateSessionId, getAttributionContext } from '@/lib/analytics';

const STORAGE_KEY = 'apex_unified_project_profile';

/**
 * Loads the active Unified Project Profile from local storage or returns a fresh blank profile
 */
export function getActiveProjectProfile(): UnifiedProjectProfile {
  if (typeof window === 'undefined') {
    return createDefaultProfile();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local project profile:', e);
  }

  const fresh = createDefaultProfile();
  saveActiveProjectProfile(fresh);
  return fresh;
}

/**
 * Persists the active profile locally and synchronizes asynchronously with the server
 */
export function saveActiveProjectProfile(profile: UnifiedProjectProfile): void {
  if (typeof window === 'undefined') return;

  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    // Asynchronously push to server API in background
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/projects/profile', JSON.stringify(profile));
    } else {
      fetch('/api/projects/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (e) {
    console.warn('Failed to save project profile locally:', e);
  }
}

/**
 * Updates the active profile with partial fields and returns the updated profile
 */
export function updateActiveProjectProfile(updates: Partial<UnifiedProjectProfile>): UnifiedProjectProfile {
  const current = getActiveProjectProfile();
  const updated: UnifiedProjectProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Re-calculate readiness score dynamically
  updated.readiness = calculateProfileReadiness(updated);

  saveActiveProjectProfile(updated);
  return updated;
}

/**
 * Integrates a single calculator result into the Unified Project Profile
 * (Start Anywhere Principle: e.g. Kitchen Calculator -> updates active project profile)
 */
export function syncCalculatorToProjectProfile(params: {
  calculatorSlug: string;
  calculatorTitle: string;
  category: string;
  inputs: Record<string, any>;
  outputs: {
    primaryQuantity: string;
    unit: string;
    lowGbp?: number;
    highGbp?: number;
  };
}): UnifiedProjectProfile {
  const profile = getActiveProjectProfile();
  const roomType = mapCategoryToRoomType(params.category, params.calculatorSlug);

  // Check if room already exists or create new
  const existingRoomIndex = profile.rooms.findIndex((r) => r.id === `room_${params.calculatorSlug}` || r.roomType === roomType);

  const roomEstimate = {
    low: params.outputs.lowGbp || 15000,
    expected: Math.round(((params.outputs.lowGbp || 15000) + (params.outputs.highGbp || 25000)) / 2),
    high: params.outputs.highGbp || 25000,
  };

  const roomProfile: ProjectRoomProfile = {
    id: `room_${params.calculatorSlug}`,
    roomType,
    customName: params.calculatorTitle,
    lengthMeters: params.inputs.length || params.inputs.roomLength || undefined,
    widthMeters: params.inputs.width || params.inputs.roomWidth || undefined,
    areaSqM: params.inputs.area || params.inputs.roomArea || undefined,
    specificationTier: profile.specificationTier || 'recommended',
    includedWorks: [params.calculatorTitle],
    subtotalEstimate: roomEstimate,
  };

  if (existingRoomIndex >= 0) {
    profile.rooms[existingRoomIndex] = roomProfile;
  } else {
    profile.rooms.push(roomProfile);
  }

  // Update project types if not present
  const projectType = mapCategoryToProjectType(params.category, params.calculatorSlug);
  if (!profile.projectTypes.includes(projectType)) {
    profile.projectTypes.push(projectType);
  }

  // Re-calculate estimate breakdown
  profile.estimate.low = profile.rooms.reduce((acc, r) => acc + r.subtotalEstimate.low, 0);
  profile.estimate.expected = profile.rooms.reduce((acc, r) => acc + r.subtotalEstimate.expected, 0);
  profile.estimate.high = profile.rooms.reduce((acc, r) => acc + r.subtotalEstimate.high, 0);

  return updateActiveProjectProfile(profile);
}

/**
 * Computes the Project Readiness Score (0–100%) and itemized breakdown
 */
export function calculateProfileReadiness(profile: UnifiedProjectProfile) {
  const completed: string[] = [];
  const missing: string[] = [];
  const optional: string[] = [];

  let score = 0;

  // 1. Project Type Selected (20 pts)
  if (profile.projectTypes && profile.projectTypes.length > 0) {
    score += 20;
    completed.push('Project type selected');
  } else {
    missing.push('Select primary project type');
  }

  // 2. Property Type & Era Known (15 pts)
  if (profile.propertyType) {
    score += 15;
    completed.push(`Property context (${profile.propertyType}${profile.propertyEra ? `, ${profile.propertyEra}` : ''})`);
  } else {
    missing.push('Specify property type (e.g. Victorian terrace, semi-detached)');
  }

  // 3. Location / Postcode Provided (15 pts)
  if (profile.location?.postcode) {
    score += 15;
    completed.push(`Location specified (${profile.location.postcode})`);
  } else {
    missing.push('Enter London postcode for logistics & ground condition checks');
  }

  // 4. Rooms or Dimensions Configured (20 pts)
  if (profile.rooms && profile.rooms.length > 0) {
    score += 20;
    completed.push(`Room scopes defined (${profile.rooms.length} room${profile.rooms.length > 1 ? 's' : ''})`);
  } else {
    missing.push('Add room dimensions or scope items');
  }

  // 5. Target Budget Specified (10 pts)
  if (profile.targetBudget || profile.maximumBudget) {
    score += 10;
    completed.push('Target budget provided');
  } else {
    optional.push('Specify target budget for budget optimization');
  }

  // 6. Timeline Specified (10 pts)
  if (profile.timelineTarget) {
    score += 10;
    completed.push('Desired start timeline identified');
  } else {
    missing.push('Indicate desired build timeline');
  }

  // 7. Photos or Drawings Uploaded (10 pts)
  if (profile.uploads && profile.uploads.length > 0) {
    score += 10;
    completed.push(`Project assets uploaded (${profile.uploads.length} file${profile.uploads.length > 1 ? 's' : ''})`);
  } else {
    optional.push('Upload room photographs or architectural drawings for laser accuracy');
  }

  let status: UnifiedProjectProfile['readiness']['status'] = 'DISCOVERY';
  if (score >= 85) status = 'CONTRACT_READY';
  else if (score >= 70) status = 'READY_FOR_REVIEW';
  else if (score >= 50) status = 'ESTIMATED';
  else if (score >= 30) status = 'SCOPING';

  return {
    score: Math.min(score, 100),
    status,
    completedItems: completed,
    missingItems: missing,
    optionalNextSteps: optional,
  };
}

/**
 * Creates an empty default project profile with unique reference code
 */
function createDefaultProfile(): UnifiedProjectProfile {
  const now = new Date().toISOString();
  const num = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();

  return {
    id: `ST-PROJ-${num}`,
    sessionId: getOrCreateSessionId(),
    referenceCode: `ST-${year}-${num}`,
    createdAt: now,
    updatedAt: now,
    attribution: {
      source: 'direct',
      originalLandingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
      ...getAttributionContext(),
      firstTouchTimestamp: now,
      lastTouchTimestamp: now,
    },
    location: {
      postcode: 'W4 1PR',
      borough: 'Ealing / Hounslow',
    },
    propertyType: 'terraced',
    propertyEra: 'victorian',
    bedrooms: 3,
    bathrooms: 2,
    projectTypes: ['extension'],
    rooms: [],
    scopeItems: [],
    customScopeAdditions: [],
    customerGoals: ['More living space', 'Open-plan kitchen/diner', 'Seamless garden connection'],
    specificationTier: 'recommended',
    timelineTarget: '1_to_3_months',
    occupiedDuringWorks: true,
    planningStatus: 'permitted_development',
    hasDrawings: false,
    hasStructuralCalculations: false,
    uploads: [],
    estimate: {
      low: 55000,
      expected: 70000,
      high: 85000,
      currency: 'GBP',
      breakdown: {
        materialsTotal: 28000,
        labourTotal: 32000,
        wasteAndDisposal: 2500,
        structuralSteelAllowance: 4000,
        prelimsAndManagement: 2000,
        contingency: 1500,
      },
    },
    confidenceLevel: 'MEDIUM',
    confidenceAssumptions: [
      'Indicative preliminary estimates based on standard London ground conditions',
      'Structural steel span up to 5.5m without extensive underpinning',
    ],
    readiness: {
      score: 50,
      status: 'SCOPING',
      completedItems: ['Project Type', 'Property Type', 'Location'],
      missingItems: ['Room Dimensions', 'Target Budget'],
      optionalNextSteps: ['Upload Site Photographs'],
    },
    aiRecommendations: [],
    riskFlags: [],
    savedByCustomer: false,
    professionalReviewRequested: false,
  };
}

function mapCategoryToRoomType(category: string, slug: string): ProjectRoomProfile['roomType'] {
  if (slug.includes('kitchen')) return 'kitchen';
  if (slug.includes('bathroom') || slug.includes('tile')) return 'bathroom';
  if (slug.includes('loft')) return 'loft';
  if (slug.includes('garage')) return 'garage';
  if (slug.includes('garden') || slug.includes('landscape') || slug.includes('paving') || slug.includes('driveway')) return 'garden_patio';
  return 'living_dining';
}

function mapCategoryToProjectType(category: string, slug: string): any {
  if (slug.includes('extension')) return 'extension';
  if (slug.includes('kitchen')) return 'kitchen-renovation';
  if (slug.includes('bathroom')) return 'bathroom-renovation';
  if (slug.includes('loft')) return 'loft-conversion';
  if (slug.includes('garage')) return 'garage-conversion';
  if (slug.includes('garden')) return 'garden-room';
  if (slug.includes('driveway')) return 'driveway';
  if (slug.includes('landscape')) return 'landscaping';
  return 'full-renovation';
}
