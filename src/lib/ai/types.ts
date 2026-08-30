/**
 * AI Project Planner & Room-by-Room Scope Types
 * Conforms to BUILD_SPEC.md & PHASE 2 Specification
 */

export type SizeCategory = 'small' | 'medium' | 'large' | 'very_large' | 'unknown';

export interface SelectedRoomArea {
  id: string;
  name: string;
  sizeCategory: SizeCategory;
  lengthMeters?: number;
  widthMeters?: number;
  heightMeters?: number;
  notes?: string;
}

export type WorkCategory =
  | 'Preparation & Demolition'
  | 'Building & Structural'
  | 'Plumbing & Heating'
  | 'Electrical & Lighting'
  | 'Installation & Cabinetry'
  | 'Finishing & Decorating'
  | 'Carpentry & Joinery'
  | 'Glazing & Openings'
  | 'External & Grounds';

export interface ProjectScopeItem {
  id: string;
  areaId: string;
  areaName: string;
  category: WorkCategory;
  name: string;
  description: string;
  selected: boolean;
  recommended?: boolean;
  customItem?: boolean;
  pricingStatus: 'estimated' | 'requires_review' | 'not_included';
  costLow: number;
  costHigh: number;
  notes?: string;
}

export interface RecommendedWorkItem {
  id: string;
  title: string;
  areaName: string;
  category: WorkCategory;
  reason: string;
  costLow: number;
  costHigh: number;
  status: 'suggested' | 'accepted' | 'dismissed';
}

export type FinishLevel = 'budget' | 'standard' | 'premium' | 'luxury';

export interface ComprehensivePlannerInput {
  projectType: string;
  projectTypeCustom?: string;
  customDescription?: string;
  customerGoals: string[];
  goalNotes?: string;
  propertyType: string;
  propertyAge: string;
  postcode: string;
  selectedAreas: SelectedRoomArea[];
  hasStructuralChanges?: 'yes' | 'no' | 'not_sure';
  isWallStructural?: 'yes' | 'no' | 'not_sure';
  // Detailed Space & Custom Inclusion Fields
  glazingChoices?: string[];
  structuralFeatures?: string[];
  interiorSpecialties?: string[];
  heatingElectrics?: string[];
  externalFinishes?: string[];
  ceilingAndRoofType?: string;
  planningStatus?: string;
  extensionStoreys?: 'single' | 'double';
  // Finish & Commercial Fields
  finishLevel: FinishLevel;
  projectStatus: string;
  timeline: string;
  budgetRange: string;
}

export interface RoomBreakdownSummary {
  areaName: string;
  itemCount: number;
  costLow: number;
  costHigh: number;
}

export interface CategoryBreakdownSummary {
  category: string;
  costLow: number;
  costHigh: number;
  percentage: number;
}

export interface TimelinePhase {
  phaseNumber: number;
  name: string;
  duration: string;
  description: string;
}

export interface FullProjectQuoteEstimate {
  projectTitle: string;
  summaryText: string;
  indicativeCostLow: number;
  indicativeCostHigh: number;
  averageCost: number;
  contingencyAmount: number;
  durationWeeksMin: number;
  durationWeeksMax: number;
  roomBreakdowns: RoomBreakdownSummary[];
  categoryBreakdowns: CategoryBreakdownSummary[];
  timelinePhases: TimelinePhase[];
  thingsToConfirm: string[];
  confidenceRating: 'High' | 'Good' | 'Needs Confirmation';
  isDevelopmentDemo: boolean;
}
