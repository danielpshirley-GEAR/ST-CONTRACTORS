/**
 * Commercial Conversion & Pricing Engine Types
 * Conforms to BUILD_SPEC.md Sections 7-18 & 23-25
 */

export type ProjectType =
  | 'extension'
  | 'full-renovation'
  | 'kitchen'
  | 'bathroom'
  | 'loft-conversion'
  | 'garage-conversion'
  | 'garden-room'
  | 'driveway'
  | 'landscaping'
  | 'other';

export type PropertyType =
  | 'detached'
  | 'semi-detached'
  | 'terraced'
  | 'bungalow'
  | 'flat'
  | 'other';

export type FinishLevel = 'essential' | 'standard' | 'premium' | 'luxury';

export type ProjectStatus =
  | 'exploring_ideas'
  | 'researching_costs'
  | 'ready_to_plan'
  | 'drawings_completed'
  | 'planning_submitted'
  | 'planning_approved'
  | 'building_regs_underway'
  | 'ready_to_appoint'
  | 'started';

export type DesiredTimeline =
  | 'asap'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | '12_plus_months'
  | 'researching_only';

export type BudgetRange =
  | 'under_25k'
  | '25k_50k'
  | '50k_100k'
  | '100k_150k'
  | '150k_250k'
  | '250k_plus'
  | 'not_sure';

export interface ProjectPlanInput {
  projectType: ProjectType;
  propertyType: PropertyType;
  bedrooms?: number;
  postcode: string;
  
  // Dimensions & Specifics (Dynamic based on projectType)
  lengthMeters?: number;
  widthMeters?: number;
  storeys?: number;
  approxAreaM2?: number;
  roomCount?: number;
  isUnknownDimensions?: boolean;

  // Selected Requirements & Features
  requirements: string[];

  // Specifications
  finishLevel: FinishLevel;
  status: ProjectStatus;
  timeline: DesiredTimeline;
  budgetRange: BudgetRange;
  customNotes?: string;
}

export interface CostCategoryItem {
  category: string;
  description: string;
  lowCost: number;
  highCost: number;
  percentage: number;
}

export interface ProjectTimelineStage {
  stageNumber: number;
  name: string;
  durationWeeks: string;
  description: string;
  deliverables: string[];
}

export interface EstimateResult {
  projectTitle: string;
  indicativeCostLow: number;
  indicativeCostHigh: number;
  averageCost: number;
  estimatedDurationWeeksMin: number;
  estimatedDurationWeeksMax: number;
  complexity: 'Standard' | 'Moderate' | 'Complex' | 'Substantial';
  breakdown: CostCategoryItem[];
  contingencyAllowance: number; // 10% standard recommended
  timelineStages: ProjectTimelineStage[];
  likelyTrades: string[];
  keyCostDrivers: string[];
  disclaimer: string;
}

export interface LeadScoreResult {
  score: number; // 0 - 100
  scoreBand: 'HOT' | 'HIGH' | 'MEDIUM' | 'EARLY';
  factors: {
    factor: string;
    points: number;
    description: string;
  }[];
}

export interface LeadSubmissionPayload {
  projectInput: ProjectPlanInput;
  estimateResult: EstimateResult;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContactMethod: 'phone' | 'email';
    consultationType: 'consultation' | 'callback' | 'site_visit';
    requestedDate?: string;
    requestedTimeSlot?: string;
    notes?: string;
  };
  source?: string;
}
