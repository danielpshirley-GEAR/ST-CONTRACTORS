/**
 * Master Project State & Scope Architecture for the AI Project Design & Scope Builder
 * Conforms to BUILD_SPEC.md and Phase 7C Specification.
 */

export type ProvenanceStatus = 'confirmed' | 'derived' | 'assumed' | 'unknown';
export type ProvenanceSource =
  | 'user_statement'
  | 'system_assumption'
  | 'derived_calculation'
  | 'document_image'
  | 'architectural_drawing';

export interface ProvenancedValue<T> {
  value: T;
  source: ProvenanceSource;
  status: ProvenanceStatus;
  confidence?: number;
  notes?: string;
}

export type ProjectCategoryType =
  | 'unknown'
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
  | 'bedroom'
  | 'decorating'
  | 'joinery'
  | 'door-replacement'
  | 'cinema-room'
  | 'living-room'
  | 'other';

export type PropertyEra =
  | 'victorian'
  | 'edwardian'
  | 'georgian'
  | '1930s'
  | 'post_war'
  | 'modern'
  | 'unknown'
  | 'not_provided';

export type PropertyBuildingType =
  | 'terraced'
  | 'semi_detached'
  | 'detached'
  | 'flat'
  | 'maisonette'
  | 'bungalow'
  | 'unknown'
  | 'not_provided';

export interface ProjectPropertyInfo {
  type: ProvenancedValue<PropertyBuildingType>;
  era: ProvenancedValue<PropertyEra>;
  storeys: ProvenancedValue<number | undefined>;
  location: ProvenancedValue<string>;
  isConservationArea: ProvenancedValue<boolean | 'unknown'>;
  isListedBuilding: ProvenancedValue<boolean | 'unknown'>;
  existingCondition: ProvenancedValue<string>;
}

export interface ProjectSpace {
  id: string;
  name: string;
  lengthM: ProvenancedValue<number | undefined>;
  widthM: ProvenancedValue<number | undefined>;
  heightM: ProvenancedValue<number | undefined>;
  areaM2: ProvenancedValue<number | undefined>;
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
  | 'sketch'
  | 'material_reference'
  | 'product_reference'
  | 'exterior'
  | 'site_condition'
  | 'defect_issue'
  | 'boundary_context'
  | 'product_cutsheet'
  | 'other'
  | 'unknown';

export interface UploadedAsset {
  id: string;
  url: string;
  filename: string;
  classifiedCategory: UploadedAssetCategory;
  classificationConfidence: number; // 0 - 100
  userOverriddenCategory?: UploadedAssetCategory;
  visibleSpaces?: string[];
  visibleDoors?: string[];
  visibleWindows?: string[];
  visibleOpenings?: string[];
  visibleFixtures?: string[];
  visibleMaterials?: string[];
  visibleFlooring?: string;
  visibleWallFinishes?: string;
  architecturalFeatures?: string[];
  approximateLayout?: string;
  likelyPropertyCharacteristics?: string[];
  existingConditions?: string[];
  possibleConstraints?: string[];
  textVisibleInDrawing?: string[];
  dimensionsVisibleInDrawing?: { label?: string; value?: string; confidence?: 'high' | 'medium' }[];
  uncertainties?: string[];
  extractedDetails?: {
    visibleFeatures?: string[];
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

export type ScopeItemStatus = 'CONFIRMED_IN_SCOPE' | 'PROVISIONAL' | 'NOT_CURRENTLY_INCLUDED';

export interface ScopeOfWorkItem {
  id: string;
  trade: string;
  category: string;
  title: string;
  description: string;
  included: boolean;
  status: ScopeItemStatus;
  isStructural: boolean;
  finishTier: FinishTier;
  reason?: string;
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

export type QuantityConfidence =
  | 'CALCULATED_FROM_CONFIRMED_INPUT'
  | 'ESTIMATED_FROM_ASSUMPTION'
  | 'ENGINEERING_REQUIRED'
  | 'INSUFFICIENT_INFORMATION';

export interface CalculatedQuantityItem {
  id: string;
  item: string;
  category: string;
  netQuantity: number;
  wastePercent: number;
  totalWithWaste: number;
  unit: string;
  confidence: QuantityConfidence;
  basis: string;
  formulaExplanation: string;
  materialCategory:
    | 'flooring'
    | 'tiles'
    | 'paint'
    | 'skirting'
    | 'plasterboard'
    | 'bricks'
    | 'blocks'
    | 'concrete'
    | 'steel'
    | 'glazing'
    | 'general';
  engineeringNote?: string;
}

export interface StructuralEngineerSpec {
  sectionDesignation?: string; // e.g. "203 x 133 x 30 UB"
  massPerMetre?: number; // e.g. 30 (kg/m)
  memberLength?: number; // e.g. 4.5 (m)
  memberCount?: number; // e.g. 1
  bearingSpecification?: string; // e.g. "150mm concrete padstone C30"
  padstones?: number;
  posts?: string;
  connectionNotes?: string;
  engineerReference?: string;
  calculationStatus: 'unspecified' | 'partial' | 'fully_specified';
}

export type FeasibilityLevel =
  | 'LIKELY_STRAIGHTFORWARD'
  | 'POSSIBLE_REQUIRES_CONFIRMATION'
  | 'POTENTIAL_CONSTRAINT'
  | 'PROFESSIONAL_ASSESSMENT_REQUIRED';

export type FeasibilityTier = 'statutory' | 'building_regs' | 'structural' | 'site_logistics';

export interface FeasibilityItem {
  id: string;
  tier: FeasibilityTier;
  category:
    | 'Structure'
    | 'Planning'
    | 'Building_Regulations'
    | 'Utilities'
    | 'Drainage'
    | 'Access'
    | 'Party_Wall'
    | 'Fire_Safety'
    | 'Ventilation'
    | 'Waterproofing';
  title: string;
  level: FeasibilityLevel;
  assessment: string;
  why: string;
  source: string;
  whatWeKnow: string[];
  whatWeDontKnow: string[];
  nextCheck: string;
  evidenceUsed?: string;
  whyItMatters?: string;
  recommendedNextStep?: string;
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
  applicableProjectTypes?: ProjectCategoryType[];
}

export interface SystemAssumption {
  id: string;
  key: string;
  label: string;
  value: string | number;
  reason: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  affectedCalculations: string[];
  userEditable: boolean;
  status: 'active' | 'confirmed_by_user' | 'overridden' | 'removed';
}

export interface MissingInfoItem {
  id: string;
  field: string;
  question: string;
  category: string;
  scopeImpact: number; // 1 - 5
  costImpact: number; // 1 - 5
  feasibilityImpact: number; // 1 - 5
  visualImpact: number; // 1 - 5
  quantityImpact: number; // 1 - 5
  userEffort: number; // 1 - 5 (1 = easy, 5 = hard)
  priorityScore: number; // weighted sum
  applicabilityCondition?: string;
  options?: string[];
  resolved: boolean;
  whyWeAsk?: string;
}

export interface ProjectComplexity {
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  scoreOutOf10: number;
  mainDrivers: string[];
  summary: string;
}

export type EstimateQuality =
  | 'EARLY_BENCHMARK'
  | 'DEVELOPING_ESTIMATE'
  | 'DETAILED_PRE_SURVEY'
  | 'SURVEY_VALIDATED';

export interface BudgetProvenance {
  source: string;
  region: string;
  projectType: string;
  dateUpdated: string;
  vatTreatment: 'inclusive_20_percent' | 'exclusive' | 'zero_rated_new_build';
  inclusions: string[];
  exclusions: string[];
  confidence: 'benchmark_only' | 'scope_aligned' | 'survey_validated';
  areaAdjusted: boolean;
}

export interface BudgetAlignment {
  estimateQuality: EstimateQuality;
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
  provenance?: BudgetProvenance;
}

export interface ProjectVersion {
  versionNumber: number;
  timestamp: string;
  description: string;
  briefSnapshot: string;
  dimensionsSnapshot: Record<string, any>;
  finishesSnapshot: Record<string, any>;
  stateSnapshot?: ProjectState;
}

export interface VisualConceptHistoryItem {
  id: string;
  version: number;
  imageUrl: string;
  sourceImageUrl?: string;
  prompt: string;
  modifications: string[];
  provider: string;
  model?: string;
  timestamp: string;
  conceptType: 'conceptual_interpretation' | 'image_to_image_transformation';
}

export interface VisualConceptState {
  sourceImage?: string; // original homeowner uploaded image
  generatedConceptImage?: string; // AI generated visual
  currentConceptImage: string; // for display compatibility
  generationProvider?: string;
  generationId?: string;
  generationPrompt?: string;
  generationTimestamp?: string;
  generationVersion?: number;
  conceptType: 'conceptual_interpretation' | 'image_to_image_transformation';
  architecturalStyle?: string;
  glazingType?: string;
  flooringType?: string;
  cabinetryColor?: string;
  worktopType?: string;
  lightingType?: string;
  visualPrompt: string;
  disclaimer: string;
  refinementsHistory: string[];
  visualHistory?: VisualConceptHistoryItem[];
  layoutPlanSvg?: string;
  status?: 'idle' | 'generating' | 'completed' | 'failed';
  errorMessage?: string;
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
  finishSelections: Record<string, FinishTier>;
  finishTiers: FinishTierDefinition[];
  scopeOfWorks: ScopeOfWorkItem[];
  phases: ConstructionPhase[];
  thingsToConsider: ThingToConsiderItem[];
  specificationTree: SpecificationNode[];
  calculatedQuantities: CalculatedQuantityItem[];
  structuralEngineerSpec?: StructuralEngineerSpec;
  feasibility: FeasibilityItem[];
  assumptions: SystemAssumption[];
  missingInformation: MissingInfoItem[];
  complexity: ProjectComplexity;
  budgetAlignment: BudgetAlignment;
  completenessScore: number;
  versions: ProjectVersion[];
  chatHistory: {
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
  }[];
}
