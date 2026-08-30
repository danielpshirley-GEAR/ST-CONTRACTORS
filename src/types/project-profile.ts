/**
 * Unified Project Profile Definition
 * Central source of truth across all Calculators, AI Planner, Project Wizard, Quote Builder, and Customer Portal.
 * Complies with Section 11 of the Definitive Master Build Specification.
 */

import { ProjectType, PropertyType } from './index';

export type SpecificationTier = 'essential' | 'recommended' | 'premium';

export type PlanningPermissionStatus =
  | 'not_required'
  | 'permitted_development'
  | 'application_submitted'
  | 'approved'
  | 'conservation_area_pending'
  | 'listed_building_consent'
  | 'unknown';

export type EstimateConfidenceLevel = 'HIGH' | 'MEDIUM' | 'PROVISIONAL';

export interface ProjectRoomProfile {
  id: string;
  roomType: 'kitchen' | 'bathroom' | 'living_dining' | 'bedroom' | 'loft' | 'garage' | 'hallway_stairs' | 'garden_patio' | 'other';
  customName: string;
  lengthMeters?: number;
  widthMeters?: number;
  areaSqM?: number;
  specificationTier: SpecificationTier;
  includedWorks: string[];
  subtotalEstimate: {
    low: number;
    expected: number;
    high: number;
  };
}

export interface ProjectScopeItem {
  id: string;
  category: 'groundworks' | 'structural' | 'demolition' | 'm_and_e' | 'joinery' | 'finishes' | 'glazing' | 'external' | 'compliance';
  trade: string; // e.g. 'Bricklayer', 'Electrician', 'Plumber', 'Joiner', 'Plasterer', 'Tiler'
  title: string;
  description: string;
  isOptional: boolean;
  isSelected: boolean;
  estimatedCost: number;
  labourDaysEstimated?: number;
  dependencies?: string[]; // e.g. ['structural-steel-rsj'] must precede ['plastering-dryline']
}

export interface CustomScopeItem {
  id: string;
  title: string;
  userPrompt: string;
  category: string;
  clarifications?: string[];
  provisionalCostLow: number;
  provisionalCostHigh: number;
  uncertaintyNotes: string;
  approvedByUser: boolean;
}

export interface ProjectRecommendation {
  id: string;
  category: 'statutory' | 'efficiency' | 'quality' | 'cost_saving' | 'trade_sequence';
  title: string;
  description: string;
  whyRecommended: string;
  whenItMatters: string;
  estimatedCostImpact?: number;
  riskIfIgnored: string;
  isOptional: boolean;
  status: 'PENDING_REVIEW' | 'ACCEPTED' | 'DISMISSED';
}

export interface ProjectRiskFlag {
  id: string;
  severity: 'CRITICAL' | 'MODERATE' | 'ADVISORY';
  title: string;
  description: string;
  mitigationAdvice: string;
}

export interface ProjectUploadItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  category: 'photo' | 'floorplan' | 'architectural_drawing' | 'quote_document' | 'structural_calc' | 'inspiration';
  uploadedAt: string;
  notes?: string;
}

export interface AttributionData {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  originalLandingPage: string;
  referrer?: string;
  firstTouchTimestamp: string;
  lastTouchTimestamp: string;
}

export interface ProjectReadiness {
  score: number; // 0 - 100%
  status: 'DISCOVERY' | 'SCOPING' | 'ESTIMATED' | 'READY_FOR_REVIEW' | 'CONTRACT_READY';
  completedItems: string[];
  missingItems: string[];
  optionalNextSteps: string[];
}

export interface UnifiedProjectProfile {
  id: string; // e.g. ST-PROJ-8942
  userId?: string;
  sessionId: string;
  referenceCode: string; // e.g. ST-2026-8942
  createdAt: string;
  updatedAt: string;

  // 1. Attribution & Journey
  attribution: AttributionData;

  // 2. Property Context
  location: {
    postcode?: string;
    borough?: string;
    addressLine1?: string;
    isConservationArea?: boolean;
  };
  propertyType: PropertyType;
  propertyEra?: 'victorian' | 'edwardian' | 'georgian' | '1930s' | 'post_war' | 'modern';
  bedrooms?: number;
  bathrooms?: number;
  approximateSqM?: number;

  // 3. Project Scopes & Rooms
  projectTypes: ProjectType[];
  rooms: ProjectRoomProfile[];
  scopeItems: ProjectScopeItem[];
  customScopeAdditions: CustomScopeItem[];
  customerDescription?: string;
  customerGoals: string[];

  // 4. Commercials & Budget
  targetBudget?: number;
  maximumBudget?: number;
  specificationTier: SpecificationTier;
  timelineTarget: 'immediate' | '1_to_3_months' | '3_to_6_months' | 'planning_stage';
  occupiedDuringWorks: boolean;
  planningStatus: PlanningPermissionStatus;
  hasDrawings: boolean;
  hasStructuralCalculations: boolean;

  // 5. Assets & Documents
  uploads: ProjectUploadItem[];

  // 6. Intelligent Estimations & Readiness
  estimate: {
    low: number;
    expected: number;
    high: number;
    currency: 'GBP';
    breakdown: {
      materialsTotal: number;
      labourTotal: number;
      wasteAndDisposal: number;
      structuralSteelAllowance: number;
      prelimsAndManagement: number;
      contingency: number;
    };
  };
  confidenceLevel: EstimateConfidenceLevel;
  confidenceAssumptions: string[];
  readiness: ProjectReadiness;
  aiRecommendations: ProjectRecommendation[];
  riskFlags: ProjectRiskFlag[];

  // 7. Lead & Conversion Handoff
  savedByCustomer: boolean;
  professionalReviewRequested: boolean;
  leadId?: string;
  leadScore?: number;
  contactDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    preferredContactMethod?: 'phone' | 'email';
    requestedConsultationDate?: string;
    requestedTimeSlot?: string;
  };
}
