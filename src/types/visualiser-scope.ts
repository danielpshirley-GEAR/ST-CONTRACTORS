/**
 * Master Project State & Scope Architecture for the AI Project Design & Scope Builder
 * Conforms to BUILD_SPEC.md and Master Rebuild Specification.
 */

export type ProvenanceStatus = 'confirmed' | 'assumed' | 'unknown';
export type ProvenanceSource = 'user_statement' | 'system_assumption' | 'derived_calculation' | 'document_image';

export interface ProvenancedValue<T> {
  value: T;
  source: ProvenanceSource;
  status: ProvenanceStatus;
  confidence?: number;
  notes?: string;
}

export type ProjectCategoryType =
  | 'kitchen-renovation'
  | 'extension'
  | 'loft-conversion'
  | 'bathroom-renovation'
  | 'full-renovation'
  | 'structural-alteration'
  | 'garage-conversion'
  | 'garden-room'
  | 'driveway'
  | 'landscaping'
  | 'other';

export type PropertyEra = 'victorian' | 'edwardian' | 'georgian' | '1930s' | 'post_war' | 'modern' | 'unknown';
export type PropertyBuildingType = 'terraced' | 'semi_detached' | 'detached' | 'flat' | 'maisonette' | 'bungalow' | 'unknown';

export interface ProjectPropertyInfo {
  type: ProvenancedValue<PropertyBuildingType>;
  era: ProvenancedValue<PropertyEra>;
  storeys: ProvenancedValue<number>;
  location: ProvenancedValue<string>;
  isConservationArea: ProvenancedValue<boolean>;
  isListedBuilding: ProvenancedValue<boolean>;
  existingCondition: ProvenancedValue<string>;
}

export interface ProjectSpace {
  id: string;
  name: string;
  lengthM: ProvenancedValue<number>;
  widthM: ProvenancedValue<number>;
  heightM: ProvenancedValue<number>;
  areaM2: ProvenancedValue<number>;
  existingCondition?: string;
  desiredChanges: string[];
  fixtures: string[];
  constraints: string[];
  isPrimary: boolean;
}

export type UploadedAssetCategory =
  | 'existing_condition'
  | 'inspiration'
  | 'floor_plan'
  | 'drawing'
  | 'material_reference'
  | 'unknown';

export interface UploadedAsset {
  id: string;
  url: string;
  filename: string;
  classifiedCategory: UploadedAssetCategory;
  userOverriddenCategory?: UploadedAssetCategory;
  extractedDetails?: {
    visibleFeatures: string[];
    layoutObservations?: string;
    styleReferences?: string[];
  };
}

export type FinishTier = 'standard' | 'enhanced' | 'bespoke';

export interface FinishTierDefinition {
  tier: FinishTier;
  label: string;
  tagline: string;
  summary: string;
  keyFeatures: string[];
  materialPalette: string[];
  indicativeMultiplier: number;
}

export interface ScopeOfWorkItem {
  id: string;
  trade: string;
  category: string;
  title: string;
  description: string;
  included: boolean;
  isStructural: boolean;
  finishTier: FinishTier;
  estimatedHours?: number;
  materialsSpecified?: string[];
  requiresInspection?: boolean;
}

export interface SpecificationNode {
  id: string;
  roomId: string;
  element: string; // e.g. "Cabinetry", "Worktops", "Flooring", "Lighting", "Tanking"
  trade: string;
  selectedOption: string;
  finishTier: FinishTier;
  status: 'selected' | 'not_decided' | 'excluded';
  availableOptions: {
    name: string;
    tier: FinishTier;
    description: string;
    costImpact: string;
  }[];
  quantity?: number;
  unit?: string;
  userNotes?: string;
}

export type QuantityConfidence = 'calculated' | 'estimated' | 'unknown';

export interface CalculatedQuantityItem {
  id: string;
  item: string;
  category: string;
  netQuantity: number;
  wastePercent: number;
  totalWithWaste: number;
  unit: string;
  confidence: QuantityConfidence;
  basis: string; // e.g. "Based on 5.0m x 3.5m room"
  formulaExplanation: string; // e.g. "5.0m × 3.5m = 17.5m² + 10% cutting waste = 19.3m² (Order 20m²)"
  materialCategory: 'flooring' | 'tiles' | 'paint' | 'skirting' | 'plasterboard' | 'bricks' | 'blocks' | 'concrete' | 'steel' | 'glazing';
}

export type FeasibilityLevel =
  | 'LIKELY_STRAIGHTFORWARD'
  | 'POSSIBLE_REQUIRES_CONFIRMATION'
  | 'POTENTIAL_CONSTRAINT'
  | 'PROFESSIONAL_ASSESSMENT_REQUIRED';

export interface FeasibilityItem {
  id: string;
  category: 'Structure' | 'Planning' | 'Building_Regulations' | 'Utilities' | 'Drainage' | 'Access' | 'Party_Wall' | 'Fire_Safety' | 'Ventilation' | 'Waterproofing';
  title: string;
  level: FeasibilityLevel;
  assessment: string;
  evidenceUsed: string;
  whatIsUnknown: string;
  whyItMatters: string;
  recommendedNextStep: string;
}

export interface ConstructionPhase {
  phaseNumber: number;
  title: string;
  shortDescription: string;
  whatHappens: string;
  workInvolved: string[];
  tradesInvolved: string[];
  decisionsRequired: string[];
  dependencies: string[];
  potentialRisks: string[];
  informationStillRequired: string[];
  indicativeDuration: string;
}

export interface ThingToConsiderItem {
  id: string;
  issue: string;
  category: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  whatShouldBeChecked: string;
  effectOnProject: string;
}

export interface SystemAssumption {
  id: string;
  key: string;
  label: string;
  assumedValue: string;
  reasonForAssumption: string;
  status: 'active' | 'confirmed_by_user' | 'overridden' | 'removed';
}

export interface MissingInfoItem {
  id: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  field: string;
  question: string;
  whyWeAsk: string;
  category: string;
  options?: string[];
  resolved: boolean;
}

export interface ProjectComplexity {
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  scoreOutOf10: number;
  mainDrivers: string[];
  summary: string;
}

export interface BudgetAlignment {
  indicativeCostRange: {
    min: number;
    max: number;
    formatted: string;
  };
  benchmarkPerM2?: string;
  elementsMostAffectingBudget: string[];
  whereToSpendMore: string[];
  whereToSave: string[];
  unknownCostRisks: string[];
}

export interface ProjectVersion {
  versionNumber: number;
  timestamp: string;
  description: string;
  briefSnapshot: string;
  dimensionsSnapshot: Record<string, any>;
  finishesSnapshot: Record<string, any>;
}

export interface VisualConceptState {
  currentConceptImage: string;
  architecturalStyle: string;
  glazingType: string;
  flooringType: string;
  worktopType?: string;
  visualPrompt: string;
  disclaimer: string;
  refinementsHistory: string[];
}

export interface ProjectState {
  projectId: string;
  createdAt: string;
  updatedAt: string;
  originalBrief: string;
  interpretedIntent: string;
  projectTypes: ProjectCategoryType[];
  property: ProjectPropertyInfo;
  spaces: ProjectSpace[];
  uploadedAssets: UploadedAsset[];
  visualConcept: VisualConceptState;
  finishSelections: Record<string, FinishTier>; // Element/Trade to Tier
  finishTiers: FinishTierDefinition[];
  scopeOfWorks: ScopeOfWorkItem[];
  phases: ConstructionPhase[];
  thingsToConsider: ThingToConsiderItem[];
  specificationTree: SpecificationNode[];
  calculatedQuantities: CalculatedQuantityItem[];
  feasibility: FeasibilityItem[];
  assumptions: SystemAssumption[];
  missingInformation: MissingInfoItem[];
  complexity: ProjectComplexity;
  budgetAlignment: BudgetAlignment;
  completenessScore: number; // 0 - 100
  versions: ProjectVersion[];
  chatHistory: {
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
  }[];
}
