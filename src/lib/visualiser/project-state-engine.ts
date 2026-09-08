/**
 * Master Project State Coordinator Engine
 * Single source of truth for the AI Project Design & Scope Builder.
 * Complies with BUILD_SPEC.md and Phase 7C Specification.
 */

import {
  ProjectState,
  ProjectCategoryType,
  ProjectPropertyInfo,
  ProjectSpace,
  UploadedAsset,
  SystemAssumption,
  MissingInfoItem,
  ProjectComplexity,
  BudgetAlignment,
  ProjectVersion,
  FinishTier,
  VisualConceptState,
  VisualConceptHistoryItem,
  ScopeOfWorkItem,
  StructuralEngineerSpec,
} from '@/types/visualiser-scope';
import { calculateProjectQuantities } from './scope-calculator';
import { evaluateProjectFeasibility } from './feasibility-rules';
import { generateConstructionPhases } from './phases-rules';
import { generateThingsToConsider } from './considerations-rules';
import { buildSpecificationTree, MASTER_FINISH_TIERS } from './specification-rules';
import {
  StructuredBriefExtraction,
  StructuredChangeOperation,
  extractBriefDeterministically,
} from '@/lib/ai/visualiser-ai';
import { generateArchitecturalConceptSvg, constructVisualPrompt } from '@/lib/ai/visual-generator';
import { analyzeProjectBrief } from './project-understanding-engine';

export interface InitialProjectInput {
  briefText: string;
  images?: { url: string; filename: string; category?: string }[];
  dimensions?: { length?: number; width?: number; height?: number; area?: number };
  propertyType?: string;
  propertyEra?: string;
  location?: string;
  budget?: number;
  desiredCompletion?: string;
  aiExtraction?: StructuredBriefExtraction;
  imageAnalyses?: UploadedAsset[];
}

/**
 * Creates Initial Project State from validated Structured Extraction
 * Strictly adheres to Zero-Assumption and Provenance-First architecture.
 */
export function createInitialProjectState(input: InitialProjectInput): ProjectState {
  const consultationUnderstanding = analyzeProjectBrief(input);

  const extraction: StructuredBriefExtraction =
    input.aiExtraction ||
    extractBriefDeterministically({
      briefText: input.briefText,
      dimensions: input.dimensions,
      propertyType: input.propertyType,
      propertyEra: input.propertyEra,
      location: input.location,
      budget: input.budget,
      desiredCompletion: input.desiredCompletion,
    });

  const baseTypes = extraction.projectTypes && extraction.projectTypes.length > 0
    ? extraction.projectTypes
    : (['unknown'] as ProjectCategoryType[]);

  const projectTypes = [...baseTypes];
  if (consultationUnderstanding.primaryProject !== 'unknown' && !projectTypes.includes(consultationUnderstanding.primaryProject)) {
    projectTypes.unshift(consultationUnderstanding.primaryProject);
  }
  for (const sec of consultationUnderstanding.secondaryProjects) {
    if (!projectTypes.includes(sec.type)) {
      projectTypes.push(sec.type);
    }
  }

  const hasStructuralAlteration = extraction.hasStructuralAlteration ?? false;
  const uploadedAssets: UploadedAsset[] = input.imageAnalyses || [];

  // 1. Property Setup (Preserving 'not_provided' / 'unknown' - Item 3, 14, 15)
  const propEra = extraction.property.era || (input.propertyEra as any) || 'not_provided';
  const propType = extraction.property.type || (input.propertyType as any) || 'not_provided';

  const property: ProjectPropertyInfo = {
    type: {
      value: propType,
      source: input.propertyType ? 'user_statement' : 'system_assumption',
      status: propType !== 'not_provided' && propType !== 'unknown' ? 'confirmed' : 'unknown',
    },
    era: {
      value: propEra,
      source: input.propertyEra ? 'user_statement' : 'system_assumption',
      status: propEra !== 'not_provided' && propEra !== 'unknown' ? 'confirmed' : 'unknown',
    },
    storeys: {
      value: extraction.property.storeys !== undefined ? extraction.property.storeys : undefined,
      source: extraction.property.storeys ? 'user_statement' : 'system_assumption',
      status: extraction.property.storeys ? 'confirmed' : 'unknown',
    },
    location: {
      value: extraction.property.location || input.location || 'Location not specified',
      source: input.location || extraction.property.location ? 'user_statement' : 'system_assumption',
      status: input.location || extraction.property.location ? 'confirmed' : 'unknown',
    },
    isConservationArea: {
      value: extraction.property.isConservationArea !== undefined ? extraction.property.isConservationArea : 'unknown',
      source: 'user_statement',
      status: extraction.property.isConservationArea !== undefined ? 'confirmed' : 'unknown',
    },
    isListedBuilding: {
      value: extraction.property.isListedBuilding !== undefined ? extraction.property.isListedBuilding : 'unknown',
      source: 'user_statement',
      status: extraction.property.isListedBuilding !== undefined ? 'confirmed' : 'unknown',
    },
    existingCondition: {
      value: extraction.property.existingCondition || uploadedAssets[0]?.existingConditions?.[0] || 'Not yet described',
      source: extraction.property.existingCondition ? 'user_statement' : uploadedAssets.length > 0 ? 'user_image' : 'system_assumption',
      status: extraction.property.existingCondition || uploadedAssets[0]?.existingConditions ? 'confirmed' : 'unknown',
    },
  };

  // 2. Spaces Setup (Item 12: No Silent 5m x 4m Room Defaults)
  const spaces: ProjectSpace[] = (extraction.spaces && extraction.spaces.length > 0)
    ? extraction.spaces.map((s, idx) => {
        const lengthVal = s.lengthM !== undefined && s.lengthM > 0 ? s.lengthM : input.dimensions?.length;
        const widthVal = s.widthM !== undefined && s.widthM > 0 ? s.widthM : input.dimensions?.width;
        const heightVal = s.heightM !== undefined && s.heightM > 0 ? s.heightM : input.dimensions?.height;
        const areaVal = lengthVal && widthVal ? Math.round(lengthVal * widthVal * 10) / 10 : input.dimensions?.area;

        return {
          id: `space-${idx + 1}`,
          name: s.name || (projectTypes.includes('driveway') ? 'Driveway' : 'Primary Project Area'),
          lengthM: {
            value: lengthVal,
            source: lengthVal ? 'user_statement' : 'system_assumption',
            status: lengthVal ? 'confirmed' : 'unknown',
          },
          widthM: {
            value: widthVal,
            source: widthVal ? 'user_statement' : 'system_assumption',
            status: widthVal ? 'confirmed' : 'unknown',
          },
          heightM: {
            value: heightVal,
            source: heightVal ? 'user_statement' : 'system_assumption',
            status: heightVal ? 'confirmed' : 'unknown',
          },
          areaM2: {
            value: areaVal,
            source: areaVal ? 'derived_calculation' : 'system_assumption',
            status: areaVal ? 'derived' : 'unknown',
          },
          existingCondition: s.existingCondition,
          desiredChanges: s.desiredChanges || [input.briefText],
          fixtures: s.fixtures || [],
          constraints: s.constraints || [],
          isPrimary: idx === 0,
        };
      })
    : [
        {
          id: 'space-1',
          name: projectTypes.includes('driveway') ? 'Driveway' : 'Primary Space',
          lengthM: { value: input.dimensions?.length, source: 'user_statement', status: input.dimensions?.length ? 'confirmed' : 'unknown' },
          widthM: { value: input.dimensions?.width, source: 'user_statement', status: input.dimensions?.width ? 'confirmed' : 'unknown' },
          heightM: { value: input.dimensions?.height, source: 'user_statement', status: input.dimensions?.height ? 'confirmed' : 'unknown' },
          areaM2: {
            value: input.dimensions?.length && input.dimensions?.width ? Math.round(input.dimensions.length * input.dimensions.width * 10) / 10 : input.dimensions?.area,
            source: 'derived_calculation',
            status: input.dimensions?.area ? 'confirmed' : 'unknown',
          },
          desiredChanges: [input.briefText],
          fixtures: [],
          constraints: [],
          isPrimary: true,
        },
      ];

  // 3. Initial Finish Tiers & Selections
  const finishSelections: Record<string, FinishTier> = {
    Cabinetry: extraction.assumedFinishTier || 'enhanced',
    Worktops: extraction.assumedFinishTier || 'enhanced',
    Flooring: extraction.assumedFinishTier || 'enhanced',
    Glazing: extraction.assumedFinishTier || 'enhanced',
    Lighting: extraction.assumedFinishTier || 'enhanced',
    Finishes: extraction.assumedFinishTier || 'enhanced',
  };

  // 5. Specification Tree
  const specificationTree = buildSpecificationTree(
    projectTypes,
    spaces.map((s) => ({ id: s.id, name: s.name })),
    extraction.assumedFinishTier || 'enhanced'
  );

  // 6. Visual Concept State (Items 4, 5, 6, 7, 8, 14)
  const existingAsset = uploadedAssets.find(
    (a) => a.classifiedCategory === 'existing_condition' || a.userOverriddenCategory === 'existing_condition'
  );

  const initialConceptSvg = generateArchitecturalConceptSvg(
    {
      projectId: 'temp',
      createdAt: '',
      updatedAt: '',
      originalBrief: input.briefText,
      interpretedIntent: extraction.interpretedIntent,
      projectTypes,
      property,
      spaces,
      uploadedAssets,
      visualConcept: {
        currentConceptImage: '',
        conceptType: 'conceptual_interpretation',
        visualPrompt: '',
        disclaimer: '',
        refinementsHistory: [],
      },
      finishSelections,
      finishTiers: MASTER_FINISH_TIERS,
      scopeOfWorks: [],
      phases: [],
      thingsToConsider: [],
      specificationTree,
      calculatedQuantities: [],
      feasibility: [],
      assumptions: [],
      missingInformation: [],
      complexity: { level: 'MODERATE', scoreOutOf10: 5, mainDrivers: [], summary: '' },
      budgetAlignment: { estimateQuality: 'EARLY_BENCHMARK', indicativeCostRange: { min: 0, max: 0, formatted: '£0' }, elementsMostAffectingBudget: [], whereToSpendMore: [], whereToSave: [], unknownCostRisks: [] },
      completenessScore: 50,
      versions: [],
      chatHistory: [],
    },
    input.briefText,
    1
  );

  const initialVisualHistory: VisualConceptHistoryItem[] = [
    {
      id: `vis-${Date.now()}-1`,
      version: 1,
      assetId: `ast-init-1`,
      imageUrl: initialConceptSvg,
      sourceImageUrl: existingAsset?.url,
      sourceVersion: undefined,
      branchId: 'main',
      prompt: input.briefText,
      modifications: [],
      provider: 'ST Contractors Architectural Engine',
      model: 'architectural-placeholder-svg-v2',
      timestamp: new Date().toISOString(),
      conceptType: 'conceptual_interpretation',
    },
  ];

  const visualConcept: VisualConceptState = {
    sourceImage: existingAsset?.url,
    generatedConceptImage: initialConceptSvg,
    currentConceptImage: initialConceptSvg,
    currentAssetId: `ast-init-1`,
    activeBranchId: 'main',
    generationProvider: 'ST Contractors Architectural Engine',
    generationId: `vis-${Date.now()}-1`,
    generationVersion: 1,
    generationPrompt: input.briefText,
    generationTimestamp: new Date().toISOString(),
    conceptType: 'conceptual_interpretation',
    status: 'idle',
    architecturalStyle: extraction.stylePreference,
    glazingType: extraction.glazingPreference,
    flooringType: extraction.flooringPreference,
    cabinetryColor: extraction.cabinetryPreference,
    visualPrompt: input.briefText,
    disclaimer: 'ARCHITECTURAL PLACEHOLDER CONCEPT — Initial illustrative diagram. AI visual generation is available on demand.',
    refinementsHistory: [],
    visualHistory: initialVisualHistory,
  };

  // 7. Deterministic Quantities
  const calculatedQuantities = calculateProjectQuantities(
    spaces,
    projectTypes,
    hasStructuralAlteration,
    {
      flooringMaterial: extraction.flooringPreference,
      hasStructuralAlteration,
    }
  );

  // 8. Scope of Works
  const scopeOfWorks: ScopeOfWorkItem[] = buildInitialScopeOfWorks(projectTypes, hasStructuralAlteration, extraction);

  // 9. Feasibility & Constraints
  const feasibility = evaluateProjectFeasibility(
    projectTypes,
    hasStructuralAlteration,
    false,
    property,
    input.briefText
  );

  // 10. Construction Phases
  const phases = generateConstructionPhases(projectTypes, hasStructuralAlteration, input.briefText);

  // 11. Things to Consider
  const thingsToConsider = generateThingsToConsider(
    projectTypes,
    property,
    input.briefText,
    hasStructuralAlteration
  );

  // 12. Assumptions
  const assumptions: SystemAssumption[] = buildInitialAssumptions(extraction, property, spaces, projectTypes);

  // 13. Missing Information
  const missingInformation: MissingInfoItem[] = buildInitialMissingInfo(extraction, property, spaces, projectTypes);

  // 14. Complexity
  const complexity = evaluateComplexity(projectTypes, property, hasStructuralAlteration, spaces);

  // 15. Budget Alignment (Items 25, 26: Data Provenance & Area Adjustments)
  const budgetAlignment = evaluateBudgetAlignment(
    projectTypes,
    spaces,
    finishSelections,
    input.budget,
    input.briefText
  );

  // 16. Completeness Score
  const completenessScore = evaluateCompletenessScore(property, spaces, uploadedAssets, missingInformation);

  // Phase 8B Consultation Fields
  const reportDepth = evaluateReportDepth(projectTypes, spaces, input.briefText);
  const humanReadableStatus = evaluateHumanReadableStatus(property, spaces, missingInformation, input.briefText);
  const initialView = generateOurInitialView(projectTypes, property, spaces, input.briefText, hasStructuralAlteration);
  const projectSnapshot = generateProjectSnapshot(projectTypes, property, spaces, input.briefText, budgetAlignment);
  const workingInFavour = generateWorkingInFavour(projectTypes, property, spaces, input.briefText);
  const potentialChallenges = generatePotentialChallenges(projectTypes, property, spaces, input.briefText);
  const valueEngineeringTips = generateValueEngineeringTips(projectTypes, spaces, input.briefText);

  const stateId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const initialState: ProjectState = {
    projectId: stateId,
    createdAt: now,
    updatedAt: now,
    originalBrief: input.briefText,
    interpretedIntent: extraction.interpretedIntent,
    projectTypes,
    property,
    spaces,
    uploadedAssets,
    visualConcept,
    finishSelections,
    finishTiers: MASTER_FINISH_TIERS,
    scopeOfWorks,
    phases,
    thingsToConsider,
    specificationTree,
    calculatedQuantities,
    feasibility,
    assumptions,
    missingInformation,
    complexity,
    budgetAlignment,
    completenessScore,
    reportDepth,
    humanReadableStatus,
    initialView,
    projectSnapshot,
    workingInFavour,
    potentialChallenges,
    valueEngineeringTips,
    consultationStage: 'report',
    consultationUnderstanding,
    versions: [],
    chatHistory: [],
  };

  // Create Version 1 snapshot
  initialState.versions = [
    {
      versionNumber: 1,
      timestamp: now,
      description: 'Initial Brief Interpretation & Architectural Model',
      briefSnapshot: input.briefText,
      dimensionsSnapshot: {
        length: spaces[0]?.lengthM?.value,
        width: spaces[0]?.widthM?.value,
        area: spaces[0]?.areaM2?.value,
      },
      finishesSnapshot: { ...finishSelections },
      stateSnapshot: JSON.parse(JSON.stringify(initialState)),
    },
  ];

  return initialState;
}

/**
 * Applies Atomic Change Mutations to Project State & Records Version Snapshot
 */
export function applyProjectChange(
  state: ProjectState,
  changeText: string,
  operations: StructuredChangeOperation[],
  generatedVisual?: {
    imageUrl: string;
    generationId: string;
    generationVersion: number;
    provider: string;
    prompt: string;
    conceptType: 'conceptual_interpretation' | 'image_to_image_transformation';
    historyItem: VisualConceptHistoryItem;
  }
): ProjectState {
  const next = JSON.parse(JSON.stringify(state)) as ProjectState;
  next.updatedAt = new Date().toISOString();

  for (const op of operations) {
    if (op.operationType === 'UPDATE_DIMENSION' && op.dimensionField && op.dimensionValue !== undefined) {
      const space = next.spaces.find((s) => s.id === op.targetSpace) || next.spaces[0];
      if (space) {
        if (op.dimensionField === 'length') space.lengthM = { value: op.dimensionValue, source: 'user_statement', status: 'confirmed' };
        if (op.dimensionField === 'width') space.widthM = { value: op.dimensionValue, source: 'user_statement', status: 'confirmed' };
        if (op.dimensionField === 'height') space.heightM = { value: op.dimensionValue, source: 'user_statement', status: 'confirmed' };
        
        if (space.lengthM.value && space.widthM.value) {
          space.areaM2 = {
            value: Math.round(space.lengthM.value * space.widthM.value * 10) / 10,
            source: 'derived_calculation',
            status: 'derived',
          };
        }
      }
    }

    if (op.operationType === 'CHANGE_CABINETRY' && op.cabinetryColor) {
      next.visualConcept.cabinetryColor = op.cabinetryColor;
    }

    if (op.operationType === 'CHANGE_FLOORING' && op.flooringType) {
      next.visualConcept.flooringType = op.flooringType;
    }

    if (op.operationType === 'CHANGE_FINISH_TIER' && op.finishTier) {
      next.finishSelections.Cabinetry = op.finishTier;
      next.finishSelections.Worktops = op.finishTier;
      next.finishSelections.Flooring = op.finishTier;
    }
  }

  // Update Visual Concept if newly generated visual provided (Items 7, 8)
  if (generatedVisual) {
    next.visualConcept.generatedConceptImage = generatedVisual.imageUrl;
    next.visualConcept.currentConceptImage = generatedVisual.imageUrl;
    next.visualConcept.currentAssetId = generatedVisual.historyItem.assetId;
    next.visualConcept.activeBranchId = generatedVisual.historyItem.branchId || next.visualConcept.activeBranchId || 'main';
    next.visualConcept.generationId = generatedVisual.generationId;
    next.visualConcept.generationVersion = generatedVisual.generationVersion;
    next.visualConcept.generationProvider = generatedVisual.provider;
    next.visualConcept.generationPrompt = generatedVisual.prompt;
    next.visualConcept.generationTimestamp = new Date().toISOString();
    next.visualConcept.conceptType = generatedVisual.conceptType;
    next.visualConcept.refinementsHistory = [...(next.visualConcept.refinementsHistory || []), changeText];
    next.visualConcept.visualHistory = [...(next.visualConcept.visualHistory || []), generatedVisual.historyItem];
  }

  // Re-run dependent calculation engines
  const hasStructural = next.scopeOfWorks.some((s) => s.isStructural && s.included);
  next.calculatedQuantities = calculateProjectQuantities(
    next.spaces,
    next.projectTypes,
    hasStructural,
    {
      flooringMaterial: next.visualConcept.flooringType,
      structuralEngineerSpec: next.structuralEngineerSpec,
    }
  );

  next.budgetAlignment = evaluateBudgetAlignment(
    next.projectTypes,
    next.spaces,
    next.finishSelections,
    undefined,
    next.originalBrief
  );

  next.phases = generateConstructionPhases(next.projectTypes, hasStructural, next.originalBrief);
  next.thingsToConsider = generateThingsToConsider(next.projectTypes, next.property, next.originalBrief, hasStructural);
  next.feasibility = evaluateProjectFeasibility(next.projectTypes, hasStructural, false, next.property, next.originalBrief);
  next.reportDepth = evaluateReportDepth(next.projectTypes, next.spaces, next.originalBrief);
  next.humanReadableStatus = evaluateHumanReadableStatus(next.property, next.spaces, next.missingInformation, next.originalBrief);
  next.initialView = generateOurInitialView(next.projectTypes, next.property, next.spaces, next.originalBrief, hasStructural);
  next.projectSnapshot = generateProjectSnapshot(next.projectTypes, next.property, next.spaces, next.originalBrief, next.budgetAlignment);
  next.workingInFavour = generateWorkingInFavour(next.projectTypes, next.property, next.spaces, next.originalBrief);
  next.potentialChallenges = generatePotentialChallenges(next.projectTypes, next.property, next.spaces, next.originalBrief);
  next.valueEngineeringTips = generateValueEngineeringTips(next.projectTypes, next.spaces, next.originalBrief);

  // Append new version snapshot
  const nextVerNum = next.versions.length + 1;
  const newVersion: ProjectVersion = {
    versionNumber: nextVerNum,
    timestamp: next.updatedAt,
    description: `Modification: "${changeText}"`,
    briefSnapshot: next.originalBrief,
    dimensionsSnapshot: {
      length: next.spaces[0]?.lengthM?.value,
      width: next.spaces[0]?.widthM?.value,
      area: next.spaces[0]?.areaM2?.value,
    },
    finishesSnapshot: { ...next.finishSelections },
    stateSnapshot: JSON.parse(JSON.stringify(next)),
  };

  next.versions.push(newVersion);
  return next;
}

/**
 * Restores an exact historical ProjectState snapshot
 */
export function restoreProjectVersion(state: ProjectState, targetVersionNumber: number): ProjectState {
  const target = state.versions.find((v) => v.versionNumber === targetVersionNumber);
  if (target && target.stateSnapshot) {
    const restored = JSON.parse(JSON.stringify(target.stateSnapshot)) as ProjectState;
    restored.updatedAt = new Date().toISOString();
    restored.versions = [...state.versions]; // Retain full version trail
    return restored;
  }
  return state;
}

/**
 * Initiates a new visual branch by resetting visual modifications back to the original homeowner photo (Phase 7E Item 9, 10)
 */
export function restartVisualFromOriginal(state: ProjectState, reason: string = 'Restarted visual branch from original photograph'): ProjectState {
  const next = JSON.parse(JSON.stringify(state)) as ProjectState;
  next.updatedAt = new Date().toISOString();
  const branchId = `branch-v0-${Date.now()}`;
  next.visualConcept.activeBranchId = branchId;
  next.visualConcept.refinementsHistory = [];
  return next;
}

// ----------------------------------------------------------------------------
// Internal Helper Builders
// ----------------------------------------------------------------------------
function buildInitialScopeOfWorks(
  types: ProjectCategoryType[],
  hasStructural: boolean,
  extraction: StructuredBriefExtraction
): ScopeOfWorkItem[] {
  const items: ScopeOfWorkItem[] = [];

  // Strip-out
  items.push({
    id: 'sow-stripout',
    trade: 'Demolition & Strip-Out',
    category: 'Preparation',
    title: 'Site Preparation & Strip-Out to Substrate',
    description: 'Protect thoroughfares, isolate services, and strip out existing fixtures and linings.',
    included: true,
    status: 'CONFIRMED_IN_SCOPE',
    isStructural: false,
    finishTier: extraction.assumedFinishTier || 'enhanced',
  });

  if (hasStructural) {
    items.push({
      id: 'sow-steelwork',
      trade: 'Structural Engineering',
      category: 'Structure',
      title: 'Structural Knockthrough & Steel Installation',
      description: 'Temporary Acrow propping, load-bearing masonry removal, padstones, and universal steel beam installation.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: true,
      finishTier: 'enhanced',
      requiresInspection: true,
    });
  }

  return items;
}

function buildInitialAssumptions(
  extraction: StructuredBriefExtraction,
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  types: ProjectCategoryType[]
): SystemAssumption[] {
  const assumptions: SystemAssumption[] = [];

  if (property.era.value === 'not_provided') {
    assumptions.push({
      id: 'assump-era',
      key: 'property_era',
      label: 'Property Architectural Era',
      value: 'Not yet supplied',
      reason: 'No property era specified in brief. Wall composition, floor joists, and ceiling construction require verification.',
      source: 'System Zero-Assumption Rule',
      confidence: 'low',
      affectedCalculations: ['Strip-Out Durations', 'Structural Linings'],
      userEditable: true,
      status: 'active',
    });
  }

  if (spaces[0]?.lengthM?.value === undefined) {
    assumptions.push({
      id: 'assump-dim',
      key: 'room_dimensions',
      label: 'Room Dimensions',
      value: 'Unmeasured',
      reason: 'Dimensions not yet supplied by user. Quantity calculations will remain in INSUFFICIENT_INFORMATION state until entered or example model accepted.',
      source: 'Homeowner Brief',
      confidence: 'low',
      affectedCalculations: ['Flooring m²', 'Plasterboard sheets', 'Paint litres'],
      userEditable: true,
      status: 'active',
    });
  }

  return assumptions;
}

function buildInitialMissingInfo(
  extraction: StructuredBriefExtraction,
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  types: ProjectCategoryType[]
): MissingInfoItem[] {
  const items: MissingInfoItem[] = [];

  if (spaces[0]?.lengthM?.value === undefined) {
    items.push({
      id: 'miss-dim',
      field: 'dimensions',
      question: 'What are the approximate length and width of the room or area?',
      category: 'Dimensions',
      scopeImpact: 5,
      costImpact: 5,
      feasibilityImpact: 3,
      visualImpact: 4,
      quantityImpact: 5,
      userEffort: 2,
      priorityScore: 23,
      resolved: false,
      whyWeAsk: 'Accurate dimensions enable exact material order calculations and precise budget ranges.',
    });
  }

  if (property.era.value === 'not_provided') {
    items.push({
      id: 'miss-era',
      field: 'property_era',
      question: 'What architectural era is your property (e.g. Victorian, 1930s, Modern)?',
      category: 'Property Context',
      scopeImpact: 4,
      costImpact: 4,
      feasibilityImpact: 5,
      visualImpact: 3,
      quantityImpact: 3,
      userEffort: 1,
      priorityScore: 21,
      resolved: false,
      options: ['Victorian (1837–1901)', 'Edwardian (1901–1914)', '1930s / Inter-War', 'Post-War (1950–1980)', 'Modern (1980+)'],
      whyWeAsk: 'Period properties often feature solid brickwork and suspended timber floors affecting plumbing runs and structural steel details.',
    });
  }

  return items;
}

function evaluateComplexity(
  types: ProjectCategoryType[],
  property: ProjectPropertyInfo,
  hasStructural: boolean,
  spaces: ProjectSpace[]
): ProjectComplexity {
  let score = 3;
  const drivers: string[] = [];

  if (hasStructural) {
    score += 3;
    drivers.push('Structural knockthrough requiring Building Regulations approval and steelwork');
  }

  if (property.era.value === 'victorian' || property.era.value === 'georgian') {
    score += 1.5;
    drivers.push('Period property substrate preparation and hidden service routing');
  }

  if (types.includes('extension') || types.includes('loft-conversion')) {
    score += 2;
    drivers.push('Major building envelope alteration and groundworks / roof structure changes');
  }

  const boundedScore = Math.min(10, Math.max(1, Math.round(score * 10) / 10));
  const level = boundedScore >= 7.5 ? 'HIGH' : boundedScore >= 5 ? 'MODERATE' : 'LOW';

  return {
    level,
    scoreOutOf10: boundedScore,
    mainDrivers: drivers,
    summary: `Project presents ${level.toLowerCase()} logistical complexity with ${drivers.length} key structural and property drivers.`,
  };
}

function evaluateBudgetAlignment(
  types: ProjectCategoryType[],
  spaces: ProjectSpace[],
  finishes: Record<string, FinishTier>,
  userBudget?: number,
  briefText?: string
): BudgetAlignment {
  const primarySpace = spaces[0];
  const area = primarySpace?.areaM2?.value;
  const hasArea = area !== undefined && area > 0;
  const lower = (briefText || '').toLowerCase();

  const isGarageConversion =
    types.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage')) ||
    (lower.includes('garage') && (lower.includes('room') || lower.includes('office') || lower.includes('gym') || lower.includes('habitable')));

  const isGarageDoor = !isGarageConversion && ((lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway')));
  const isBathroom = types.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isKitchen = types.includes('kitchen-renovation') || lower.includes('kitchen');
  const isExtension = types.includes('extension') || lower.includes('extension');
  const isDriveway = types.includes('driveway');

  let minCost = 0;
  let maxCost = 0;
  let benchmarkPerM2: string | undefined;
  let isBudgetReady = true;
  let budgetUnreadyReason: string | undefined;
  let onSiteWorkDuration = '1 to 2 weeks';
  let totalLeadTime = '2 to 3 weeks';
  let inclusions: string[] = ['Labour', 'Materials', 'Building Regulations compliance', 'Project management', 'Waste clearance'];
  let costDrivers: Array<{ title: string; description: string }> = [];
  let whereToSpendMore: string[] = [];
  let whereToSave: string[] = [];
  let couldIncreaseIf: string[] = [];
  let potentialSavings: string[] = [];
  let unknownCostRisks: string[] = [];

  if (isGarageConversion) {
    minCost = hasArea ? Math.round(Math.max(16000, area * 1100)) : 16000;
    maxCost = hasArea ? Math.round(Math.max(26000, area * 1700)) : 28000;
    benchmarkPerM2 = hasArea ? '£1,100 – £1,700 / m² (Full conversion)' : 'Single garage benchmark (£16k–£28k)';
    onSiteWorkDuration = '3 to 5 weeks';
    totalLeadTime = '2 to 3 weeks (Building Notice & window fabrication)';
    inclusions = [
      'High-performance Kingspan floor, wall & ceiling thermal insulation',
      'Frontage opening infill with matching brickwork and double-glazed window',
      'Structural subfloor damp proof membrane & laser-levelled screed',
      'New FD30S certified internal connecting doorway to hallway/corridor',
      'Electrical ring main, recessed LED downlights & radiator heating circuit',
      'Plasterboard lining, dry-lining acoustic bonding & two-coat skim',
      'Local Authority Building Control statutory sign-off & completion certificate',
    ];
    costDrivers = [
      {
        title: 'Frontage Opening Treatment',
        description: 'Whether filling the former garage door opening with matching cavity masonry and a window, or installing wide architectural glazed doors.',
      },
      {
        title: 'Floor Level & Damp Proofing',
        description: 'Level discrepancy between the original garage slab and internal house floor, requiring structural insulation and screed build-up.',
      },
      {
        title: 'Internal Access Knockthrough',
        description: 'Forming a new structural opening through the dividing party or internal spine wall with engineer-approved lintel.',
      },
    ];
    whereToSpendMore = [
      'Enhanced acoustic insulation in the ceiling and party wall for home office or gym privacy',
      'Architectural bespoke joinery and fitted storage wall to maximize functional room space',
    ];
    whereToSave = [
      'Utilizing standard window profiles rather than bespoke aluminium shapes for the frontage',
      'Tying into existing boiler and central heating circuit rather than independent electric heaters',
    ];
    couldIncreaseIf = [
      'Original concrete slab has no damp-proof membrane requiring full liquid DPM tanking',
      'External foundation beneath the garage door threshold requires underpinning or concrete trench footings to support new masonry infill',
    ];
    potentialSavings = [
      'Retaining existing structural ceiling joists without sistering if deflection checks pass',
      'Standard flush internal fire doorset rather than bespoke panelled joinery',
    ];
    unknownCostRisks = [
      'Presence of foundation footing beneath existing garage door threshold',
      'Consumer unit electrical capacity for new dedicated ring main',
    ];
  } else if (isGarageDoor) {
    minCost = 1800;
    maxCost = 3500;
    benchmarkPerM2 = 'Fixed opening benchmark (£1.8k–£3.5k based on lintel & doorset)';
    onSiteWorkDuration = '2 to 3 days';
    totalLeadTime = '1 to 2 weeks for certified FD30S doorset & Building Notice';
    inclusions = [
      'FD30S certified fire-and-smoke doorset & intumescent seals',
      'Structural lintel (concrete or steel box) & 150mm padstone bearings',
      '100mm threshold step or floor fall vapour barrier',
      'Overhead automatic self-closing mechanism',
      'Plaster bonding and skim make-good to reveal edges',
      'Building Control statutory inspection sign-off',
    ];
    costDrivers = [
      {
        title: 'Load-Bearing Wall Support',
        description: 'Whether overhead joists require Acrow propping while an engineer-specified lintel is inserted.',
      },
      {
        title: 'Floor Level Discrepancy',
        description: 'Forming the mandatory 100mm step or fall between garage and hallway to contain fluid and vapour spills.',
      },
      {
        title: 'Concealed Services Rerouting',
        description: 'Checking for electrical ring mains or heating pipes hidden inside the masonry before cutting.',
      },
    ];
    whereToSpendMore = [
      'Heavy-duty commercial-grade overhead self-closer (longer lifespan than concealed spring chains)',
      'Factory pre-finished paint-grade FD30S doorset for superior draught and smoke sealing',
    ];
    whereToSave = [
      'Selecting standard metric door leaf dimensions (1981 x 762mm) rather than custom joinery sizes',
      'Retaining existing wall finishes around the opening where possible',
    ];
    couldIncreaseIf = [
      'Concealed cables or central heating pipework require rerouting around the opening',
      'Dividing wall is solid 215mm engineering brick requiring double lintels and heavy propping',
    ];
    potentialSavings = [
      'Selecting pre-primed FD30S doorset for on-site finishing',
      'Standard door dimensions avoiding bespoke joinery fabrication charges',
    ];
    unknownCostRisks = [
      'Presence of concealed electrical cables in the dividing wall path',
      'Exact floor slab level beneath hallway floorboards',
    ];
  } else if (isExtension) {
    minCost = hasArea ? Math.round(area * 2400) : 75000;
    maxCost = hasArea ? Math.round(area * 3200) : 110000;
    benchmarkPerM2 = hasArea ? '£2,400 – £3,200 / m²' : 'Area required for exact m² budget adjustment';
    onSiteWorkDuration = '12 to 18 weeks';
    totalLeadTime = '8 to 12 weeks (planning, structural calcs & party wall)';
    inclusions = [
      'Excavation, groundworks & concrete foundations',
      'Structural steelwork, padstones & masonry knockthrough',
      'Approved Document L compliant insulated external envelope',
      'High-performance architectural roof glazing / rooflights',
      'First & second fix electrics, heating & plumbing',
      'Building Regulations completion certificate',
    ];
    costDrivers = [
      {
        title: 'Ground Conditions & Foundation Depth',
        description: 'Depth of trench or engineered piling required on London clay near mature tree roots.',
      },
      {
        title: 'Structural Steelwork Spans',
        description: 'Size and weight of universal steel beams required to create seamless open-plan spans.',
      },
      {
        title: 'Architectural Glazing Specification',
        description: 'Slimline thermally broken aluminium sliding or bifold doors vs standard uPVC apertures.',
      },
    ];
    whereToSpendMore = [
      'Engineered steelwork flush ceiling details and premium sliding door track mechanisms',
      'High-efficiency roof insulation and solar-control Low-E glazing',
    ];
    whereToSave = [
      'Positioning kitchen drainage runs in alignment with existing inspection chambers',
      'Selecting standard glazed aperture sizes rather than bespoke oversized structural spans',
    ];
    couldIncreaseIf = [
      'Thames Water build-over agreement required for shared public sewer across site',
      'Foundation depths exceed 1.5m due to tree roots and clay shrinkage',
      'Complex party wall awards required with multiple adjoining owners',
    ];
    potentialSavings = [
      'Keeping drainage close to existing soil stack locations',
      'Standardising structural steel lengths to avoid custom site splicing',
    ];
    unknownCostRisks = [
      'Invert level and condition of shared underground drainage pipes',
      'Bearing capacity of existing foundation at junction with new build',
    ];
  } else if (isBathroom) {
    minCost = hasArea ? Math.round(12000 + area * 800) : 12000;
    maxCost = hasArea ? Math.round(18000 + area * 1200) : 22000;
    benchmarkPerM2 = hasArea ? '£3,000 – £4,500 / m² (Full wetroom / bathroom)' : 'Standard suite benchmark (£12k–£22k)';
    onSiteWorkDuration = '2 to 3 weeks';
    totalLeadTime = '2 to 4 weeks (sanitaryware & specialist finishes)';
    inclusions = [
      'Complete sanitaryware & brassware installation',
      'Continuous wet-zone waterproof fleece tanking membrane',
      'Subfloor deflection stiffening & laser levelling',
      'Waste & supply pipework re-alignment',
      'Part F compliant continuous extract ventilation',
      'Substrate prep for microcement / porcelain tiling',
      'NICEIC Part P electrical certification',
    ];
    costDrivers = [
      {
        title: 'Concealed Valve & Wall-Hung Frames',
        description: 'Chasing solid masonry or constructing rigid timber boxing for concealed cisterns and thermostatic mixers.',
      },
      {
        title: 'Specialist Surface Finishes',
        description: 'Multi-coat hand-trowelled microcement or calibrated porcelain slab installation requiring unyielding substrates.',
      },
      {
        title: 'Walk-In Shower Drainage Falls',
        description: 'Recessing low-profile waste trap into joists or creating flush wetroom deck gradients.',
      },
    ];
    whereToSpendMore = [
      'Substrate tanking membrane and uncoupling matting to permanently stop leaks',
      'High-quality thermostatic brassware with serviceable ceramic cartridges',
    ];
    whereToSave = [
      'Keeping WC and shower waste runs close to the existing soil stack position',
      'Combining microcement in wet areas with washable moisture-resistant paint on non-splash walls',
    ];
    couldIncreaseIf = [
      'Rot or deflection discovered in existing floor joists requiring timber sistering',
      'Cast iron or lead soil stack requires replacement back to main sewer',
      'Low incoming water pressure requiring booster pump or unvented cylinder upgrade',
    ];
    potentialSavings = [
      'Maintaining existing soil stack alignment to eliminate structural joist notching',
      'Selecting standard format designer porcelain tiles over bespoke hand-cut slabs',
    ];
    unknownCostRisks = [
      'Subfloor joist condition beneath old tiles or bathtub',
      'Dynamic water pressure and flow rate for high-volume rainfall showerhead',
    ];
  } else if (isKitchen) {
    minCost = hasArea ? Math.round(18000 + area * 600) : 22000;
    maxCost = hasArea ? Math.round(32000 + area * 900) : 42000;
    benchmarkPerM2 = hasArea ? '£1,800 – £2,600 / m²' : 'Standard kitchen benchmark (£22k–£42k)';
    onSiteWorkDuration = '3 to 5 weeks';
    totalLeadTime = '4 to 6 weeks (cabinetry manufacturing)';
    inclusions = [
      'Cabinetry supply, scribing & installation',
      'Solid surface worktop templating & precision installation',
      'First and second fix plumbing & gas/electric appliances',
      'High-output extract ducting to external air',
      'Dedicated high-load appliance electrical circuits',
      'Splashback and under-cabinet LED task lighting',
    ];
    costDrivers = [
      {
        title: 'Cabinetry Specification & Joinery',
        description: 'Modular standard carcasses vs bespoke painted timber units with custom internal storage.',
      },
      {
        title: 'Worktop Material & Fabrication',
        description: 'Laminate vs 20mm/30mm quartz, granite, or sintered porcelain with undermount cut-outs.',
      },
      {
        title: 'Electrical Consumer Unit Capacity',
        description: 'Adding 7.4kW induction hob and ovens may require consumer unit upgrade.',
      },
    ];
    whereToSpendMore = [
      'High-durability quartz or quartzite worktops and German soft-close drawer runners',
      'External ducted extractor hood to eliminate cooking grease and humidity',
    ];
    whereToSave = [
      'Retaining existing sink and drainage positions to avoid subfloor plumbing reroutes',
      'Standardising carcass dimensions while upgrading door fronts and handles',
    ];
    couldIncreaseIf = [
      'Subfloor requires levelling compound or joist stiffening before large-format tiling',
      'Existing electrical fuse board lacks spare ways or RCD protection',
    ];
    potentialSavings = [
      'Preserving plumbing and gas supply positions',
      'Standardizing appliance dimensions for straightforward integration',
    ];
    unknownCostRisks = [
      'Subfloor flatness beneath existing vinyl or laminate',
      'Adequacy of incoming electrical supply fuse (60A vs 100A)',
    ];
  } else if (isDriveway) {
    minCost = hasArea ? Math.round(area * 110) : 7000;
    maxCost = hasArea ? Math.round(area * 165) : 12000;
    benchmarkPerM2 = hasArea ? '£110 – £165 / m²' : 'Area required for exact m² budget adjustment';
    onSiteWorkDuration = '1 to 2 weeks';
    totalLeadTime = '1 to 2 weeks';
    inclusions = [
      'Excavation to 250mm depth & muck-away disposal',
      'Geotextile membrane & compacted MOT Type 3 permeable sub-base',
      'ACO channel drainage and soakaway compliance (SuDS)',
      'Concrete haunched edge restraints and perimeter cutting',
      'Kiln-dried sand compaction or resin bound aggregate laying',
    ];
    costDrivers = [
      {
        title: 'Surface Material Selection',
        description: 'Permeable concrete block paving vs UV-stable resin-bound natural aggregate.',
      },
      {
        title: 'Council Vehicle Crossover Requirements',
        description: 'Dropped kerb installation across public footway requiring council-approved contractor.',
      },
    ];
    whereToSpendMore = [
      'MOT Type 3 open-graded permeable stone sub-base and geotextile weed membrane',
      'Polyurethane UV-stable resin binder to prevent sunlight yellowing',
    ];
    whereToSave = [
      'Maintaining existing driveway footprint to avoid extra excavation and muck-away costs',
      'Directing surface run-off into existing soft garden borders rather than deep soakaways',
    ];
    couldIncreaseIf = [
      'Shallow gas or electric supply lines discovered during excavation requiring hand digging',
      'Unstable subsoil clay requiring extra 100mm excavation and heavier sub-base',
    ];
    potentialSavings = [
      'Optimising layout to reduce edge restraint cutting waste',
      'Existing dropped kerb already in place and council approved',
    ];
    unknownCostRisks = [
      'Depth of buried underground utilities across front garden',
      'Load-bearing capacity of subgrade soil under heavy vehicle loads',
    ];
  } else {
    // Unrecognized or insufficiently specified project
    if (!hasArea && (briefText || '').trim().length < 20) {
      isBudgetReady = false;
      budgetUnreadyReason = 'Exact scope and measurements required before reliable budget guidance can be established.';
      minCost = 0;
      maxCost = 0;
      benchmarkPerM2 = undefined;
    } else {
      minCost = hasArea ? Math.round(area * 1500) : 15000;
      maxCost = hasArea ? Math.round(area * 2500) : 30000;
      benchmarkPerM2 = hasArea ? '£1,500 – £2,500 / m²' : 'Preliminary renovation benchmark';
    }
  }

  // Multiplier for Finish Tier (only if budget is ready and non-zero)
  if (isBudgetReady && minCost > 0) {
    const tierMultiplier = finishes.Cabinetry === 'bespoke' ? 1.3 : finishes.Cabinetry === 'standard' ? 0.9 : 1.0;
    minCost = Math.round(minCost * tierMultiplier);
    maxCost = Math.round(maxCost * tierMultiplier);
  }

  return {
    estimateQuality: !isBudgetReady ? 'EARLY_BENCHMARK' : hasArea || isGarageDoor ? 'DEVELOPING_ESTIMATE' : 'EARLY_BENCHMARK',
    isBudgetReady,
    budgetUnreadyReason,
    indicativeCostRange: {
      min: minCost,
      max: maxCost,
      formatted: isBudgetReady ? `£${minCost.toLocaleString()} – £${maxCost.toLocaleString()}` : 'Budget to be confirmed upon survey',
    },
    benchmarkPerM2,
    inclusions,
    elementsMostAffectingBudget: costDrivers.map((d) => d.title),
    costDrivers,
    whereToSpendMore,
    whereToSave,
    couldIncreaseIf,
    potentialSavings,
    unknownCostRisks,
    onSiteWorkDuration,
    totalLeadTime,
    provenance: {
      source: 'ST Contractors Historical Benchmark Data Q1 2026 (London & South East)',
      region: 'London & South East England',
      projectType: isGarageDoor ? 'Garage Access Door & Lintel Installation' : types.join(', '),
      dateUpdated: '2026-03-01',
      vatTreatment: 'inclusive_20_percent',
      inclusions,
      exclusions: ['Local authority planning application fees', 'Party Wall surveyor awards', 'Specialist AV equipment'],
      confidence: hasArea || isGarageDoor ? 'scope_aligned' : 'benchmark_only',
      areaAdjusted: hasArea,
    },
  };
}

function evaluateCompletenessScore(
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  uploadedAssets: UploadedAsset[],
  missingInformation: MissingInfoItem[]
): number {
  let score = 30; // base score for brief
  if (property.era.value !== 'not_provided' && property.era.value !== 'unknown') score += 15;
  if (property.type.value !== 'not_provided' && property.type.value !== 'unknown') score += 15;
  if (spaces[0]?.lengthM?.value !== undefined && spaces[0]?.widthM?.value !== undefined) score += 20;
  if (uploadedAssets.length > 0) score += 10;
  if (missingInformation.every((m) => m.resolved)) score += 10;
  return Math.min(100, score);
}

// ----------------------------------------------------------------------------
// Phase 8B Consultation Helper Generators
// ----------------------------------------------------------------------------

export function evaluateReportDepth(
  types: ProjectCategoryType[],
  spaces: ProjectSpace[],
  briefText: string
): 'simple' | 'moderate' | 'complex' {
  const lower = (briefText || '').toLowerCase();
  const isGarageConversion =
    types.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage')) ||
    (lower.includes('garage') && (lower.includes('room') || lower.includes('office') || lower.includes('gym') || lower.includes('habitable')));

  // Simple: isolated minor works (single door opening, garage access door, hatch, partition)
  const isDoorOrOpening =
    !isGarageConversion &&
    ((lower.includes('door') && (lower.includes('garage') || lower.includes('hallway') || lower.includes('between'))) ||
      lower.includes('access door') ||
      lower.includes('single opening') ||
      lower.includes('replace door'));

  if (isDoorOrOpening) {
    return 'simple';
  }

  // Complex: whole-house, multi-storey, extensions, lofts, basements, extensive structural knockthroughs
  if (
    types.includes('extension') ||
    types.includes('loft-conversion') ||
    lower.includes('extension') ||
    lower.includes('loft') ||
    lower.includes('basement') ||
    lower.includes('refurbishment') ||
    spaces.length > 2
  ) {
    return 'complex';
  }

  // Moderate: bathrooms, kitchens, joinery, driveways, single-room fitouts
  return 'moderate';
}

export function evaluateHumanReadableStatus(
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  missingInfo: MissingInfoItem[],
  briefText: string
) {
  const unresolved = missingInfo.filter((m) => !m.resolved);
  const count = unresolved.length;

  if (count === 0) {
    return {
      stage: 'Survey-Ready Scope',
      headline: 'Scope Comprehensive — Ready for On-Site Consultation',
      detail: 'All foundational dimensions and specifications have been recorded. Our surveyor can inspect existing substrates and issue a firm quote.',
      detailsNeededCount: 0,
    };
  }

  if (count <= 2) {
    return {
      stage: 'Initial Scope Defined',
      headline: 'Scope Well Defined — Key Structural Details Needed',
      detail: 'Core concept, feasibility, and indicative budgets are mapped out. A few site-specific confirmations will unlock a contractor-ready specification.',
      detailsNeededCount: count,
    };
  }

  return {
    stage: 'Early Consultation Concept',
    headline: 'Concept Outlined — Key Measurements & Site Details Needed',
    detail: 'We have drafted your initial scope of work and statutory compliance path. Adding room dimensions or booking a consultation will crystallise your budget.',
    detailsNeededCount: count,
  };
}

export function generateOurInitialView(
  types: ProjectCategoryType[],
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  briefText: string,
  hasStructural: boolean
) {
  const lower = (briefText || '').toLowerCase();
  const isGarageConversion =
    types.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage')) ||
    (lower.includes('garage') && (lower.includes('room') || lower.includes('office') || lower.includes('gym') || lower.includes('habitable')));

  const isGarageDoor = !isGarageConversion && ((lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway')));
  const isBathroom = types.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isKitchen = types.includes('kitchen-renovation') || lower.includes('kitchen');
  const isExtension = types.includes('extension') || lower.includes('extension');

  if (isGarageConversion) {
    return {
      paragraphs: [
        'Converting an underutilized garage into a dedicated home office, gym, or additional living space is one of the most cost-effective ways to unlock substantial square footage without sacrificing valuable garden space. Because the external envelope already stands, this project delivers exceptional return on investment within a focused 3 to 5 week on-site construction window.',
        'Our primary structural priority on site is establishing a flawless thermal and damp-proof envelope. Most original garage concrete slabs lack modern damp-proof membranes and thermal insulation. We install heavy-duty liquid/sheet DPMs and high-performance rigid Kingspan floor insulation before screeding, ensuring the new floor aligns comfortably with your existing hallway level.',
        'At the frontage, we carefully remove the vehicular door and construct a fully insulated cavity brickwork infill with double-glazed architectural windows matching your home’s existing exterior facade. The new connecting doorway into the hallway is installed with a certified FD30S fire doorset, and all new heating and electrical circuits receive full local authority Building Control sign-off.',
      ],
      keyPriorities: [
        {
          title: 'Complete Thermal & Damp-Proof Envelope',
          explanation: 'Installing continuous Kingspan insulation across subfloor, perimeter walls, and ceiling to meet Approved Document L standards for all-year heating efficiency.',
          icon: 'ShieldAlert',
        },
        {
          title: 'Matching Masonry Frontage & Natural Daylighting',
          explanation: 'Building a structural cavity wall with matching exterior brickwork, damp-proof coursing, and high-specification double-glazed windows.',
          icon: 'Layers',
        },
        {
          title: 'Internal Access Knockthrough & Building Notice Sign-Off',
          explanation: 'Forming direct access into the main hallway with an FD30S fire doorset, certified electrics, and statutory Building Control completion certificate.',
          icon: 'CheckCircle2',
        },
      ],
    };
  }

  if (isGarageDoor) {
    return {
      paragraphs: [
        'Installing a direct access door between a hallway and an attached or integral garage is one of the most practical upgrades a homeowner can make. From a builder perspective, this is a clean, straightforward 2 to 3 day project, but it is strictly governed by Approved Document B of the UK Building Regulations.',
        'Because a garage contains vehicles, fuel vapours, and combustible storage, the new opening cannot use a standard domestic door. Our site team will inspect the dividing wall to determine whether it carries floor joists overhead (requiring a pre-stressed concrete or steel box lintel) and verify that a compliant 100mm floor level step or slope exists to prevent petrol fumes or liquid spills from entering the living quarters.',
        'We execute this by erecting dust-tight isolation barriers in the hallway, cutting the masonry cleanly with dust suppression, bedding the structural lintel on 150mm padstone bearings, and hanging an FD30S certified fire-and-smoke doorset complete with intumescent seals and an automatic overhead closer. A quick Building Notice inspection by local Building Control validates the installation for your property deeds.',
      ],
      keyPriorities: [
        {
          title: '30-Minute Fire & Smoke Separation (Approved Doc B)',
          explanation: 'Statutory installation of a certified FD30S fire doorset equipped with intumescent fire and cold smoke perimeter seals plus an approved automatic self-closing device.',
          icon: 'ShieldAlert',
        },
        {
          title: '100mm Vapour & Fluid Spill Barrier',
          explanation: 'Forming a mandatory 100mm step down to the garage slab (or floor slope falling away) to stop vehicle exhaust fumes and combustible spills entering habitable space.',
          icon: 'AlertTriangle',
        },
        {
          title: 'Structural Lintel Bearing & Clean Masonry Opening',
          explanation: 'Propping overhead floor joists if load-bearing, cutting masonry with dust extraction, and seating a reinforced lintel on minimum 150mm concrete padstones.',
          icon: 'Hammer',
        },
      ],
    };
  }

  if (isBathroom) {
    return {
      paragraphs: [
        'A successful modern bathroom renovation is 80% what lies beneath the surface and 20% aesthetic finishes. Incorporating a walk-in rainfall shower, wall-hung vanity unit, and contemporary microcement or large-format tiling elevates both daily comfort and property value.',
        'Before any decorative finishes are applied, our primary focus is subfloor stability and impervious tanking. Concealed shower valves and wall-hung frames require precision masonry chasing or rigid timber stud framing. In older London homes, timber floor joists must be laser-levelled and stiffened with 18mm/22mm marine-grade or cementitious boards to prevent deflection that would crack microcement or tile grout.',
        'We install full liquid fleece tanking membranes throughout all wet zones, ensure waste drainage maintains a minimum 1:40 gravitational fall to the main soil stack, and install a continuous or humidistat-controlled Part F extractor fan ducted to an external wall to permanently banish condensation and mold.',
      ],
      keyPriorities: [
        {
          title: 'Impervious Substrate Tanking & Waterproofing',
          explanation: 'Continuous waterproof fleece membrane applied across all shower walls up to 2m and across subfloor before microcement or tiling.',
          icon: 'Droplets',
        },
        {
          title: 'Subfloor Deflection-Free Stiffening',
          explanation: 'Reinforcing timber joists with rigid cement backer boards or marine plywood to guarantee microcement and large tiles never hairline crack.',
          icon: 'Layers',
        },
        {
          title: 'High-Volume Drainage Fall & Soil Stack Run',
          explanation: 'Maintaining a 1:40 gravity fall for walk-in shower waste trap and securing concealed frames for wall-hung basins and toilets.',
          icon: 'Wrench',
        },
      ],
    };
  }

  if (isExtension) {
    return {
      paragraphs: [
        'A single-storey rear extension is an extraordinary way to unlock open-plan living, natural daylight, and garden connectivity. Achieving that seamless indoor-outdoor transition requires meticulous engineering where the existing house meets the new structure.',
        'The key technical priorities for our construction team start below ground: establishing foundation depth based on local London clay shrinkage and nearby trees, and surveying existing drainage to determine whether a Thames Water Build-Over Agreement is triggered. Above ground, open-plan structural openings require precision-fabricated steel beams with concrete padstone bearings designed to sit flush with your ceiling line.',
        'We specify a continuous thermal envelope with high-performance floor, wall, and roof insulation exceeding Approved Document L standards, paired with solar-control architectural glazing to guarantee the space is warm in mid-winter and delightfully cool in mid-summer.',
      ],
      keyPriorities: [
        {
          title: 'Engineered Foundation & Drainage Clearance',
          explanation: 'Trial pit inspection to confirm ground bearing capacity on London clay and CCTV drain survey for Thames Water sewer clearance.',
          icon: 'Anchor',
        },
        {
          title: 'Flush Steelwork & Padstone Engineering',
          explanation: 'Full structural calculations, Acrow propping, and concealed universal steel beams for an uninterrupted open-plan ceiling line.',
          icon: 'Columns',
        },
        {
          title: 'Thermal Envelope & Solar-Control Glazing',
          explanation: 'Compliant Part L insulation levels and Low-E solar-reflective glass to avoid summer greenhouse overheating.',
          icon: 'Sun',
        },
      ],
    };
  }

  // Default initial view
  return {
    paragraphs: [
      'Every successful residential project relies on clear trade coordination, rigorous regulatory compliance, and high-quality materials. We approach every renovation with builder precision and transparent communication.',
      'During our initial site visit, we verify substrate condition, incoming services (water, electrics, drainage), and structural bearings. Identifying hidden conditions before works start is how we keep projects on schedule and within budget.',
      'Our dedicated site manager oversees each phase, coordinating certified tradespeople, scheduling statutory inspections, and keeping domestic disruption to an absolute minimum.',
    ],
    keyPriorities: [
      {
        title: 'Building Regulations & Statutory Sign-Off',
        explanation: 'Ensuring all works comply with UK Building Regulations and receive certified local authority sign-off upon completion.',
        icon: 'CheckCircle2',
      },
      {
        title: 'Substrate & Service Infrastructure',
        explanation: 'Checking underlying walls, subfloors, plumbing, and consumer unit capacity before installing high-end finishes.',
        icon: 'Wrench',
      },
      {
        title: 'Clear Phasing & Dedicated Site Management',
        explanation: 'Sequencing trades logically to minimize project timeline and protect the remainder of your home from dust.',
        icon: 'Clock',
      },
    ],
  };
}

export function generateProjectSnapshot(
  types: ProjectCategoryType[],
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  briefText: string,
  budgetAlignment: BudgetAlignment
): Array<{ label: string; value: string; detail?: string }> {
  const lower = (briefText || '').toLowerCase();
  const isGarageConversion =
    types.includes('garage-conversion') ||
    lower.includes('garage conversion') ||
    (lower.includes('convert') && lower.includes('garage')) ||
    (lower.includes('garage') && (lower.includes('room') || lower.includes('office') || lower.includes('gym') || lower.includes('habitable')));

  const isGarageDoor = !isGarageConversion && ((lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway')));
  const isBathroom = types.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isExtension = types.includes('extension') || lower.includes('extension');
  const isKitchen = types.includes('kitchen-renovation') || lower.includes('kitchen');
  const primarySpace = spaces[0];
  const area = primarySpace?.areaM2?.value;

  const cards: Array<{ label: string; value: string; detail?: string }> = [];

  // 1. Work Type
  if (isGarageConversion) {
    cards.push({ label: 'Scope of Work', value: 'Garage Conversion to Living Space', detail: 'Habitable room insulation, infill & doorway' });
  } else if (isGarageDoor) {
    cards.push({ label: 'Scope of Work', value: 'Garage Access Door Installation', detail: 'Approved Doc B fire separation opening' });
  } else if (isBathroom) {
    cards.push({ label: 'Scope of Work', value: 'Bathroom & Wetroom Renovation', detail: 'Full strip, tanking, plumbing & luxury finishes' });
  } else if (isExtension) {
    cards.push({ label: 'Scope of Work', value: 'Single-Storey Rear Extension', detail: 'Structural knockthrough & open-plan envelope' });
  } else if (isKitchen) {
    cards.push({ label: 'Scope of Work', value: 'Kitchen Renovation & Reconfiguration', detail: 'Joinery, worktops & service modifications' });
  } else {
    cards.push({ label: 'Scope of Work', value: 'Residential Renovation', detail: types.join(', ') });
  }

  // 2. Property Type / Substrate
  const propEra = property.era.value !== 'not_provided' && property.era.value !== 'unknown' ? property.era.value : undefined;
  const propType = property.type.value !== 'not_provided' && property.type.value !== 'unknown' ? property.type.value : undefined;
  const propertyDesc = propEra && propType ? `${propEra.toUpperCase()} ${propType.toUpperCase()}` : propType ? propType.toUpperCase() : 'To Be Confirmed';
  cards.push({
    label: 'Property Context',
    value: propertyDesc,
    detail: isGarageConversion ? 'Integral or attached garage structure' : isGarageDoor ? 'Dividing wall substrate to be verified on survey' : 'Substrates & floor structures inspected on site',
  });

  // 3. Approximate Scope / Area
  if (isGarageConversion) {
    const dims = primarySpace?.lengthM?.value && primarySpace?.widthM?.value ? `${primarySpace.lengthM.value}m x ${primarySpace.widthM.value}m` : undefined;
    cards.push({ label: 'Physical Dimensions', value: area ? `${area} m²` : 'Approx. 15 m²', detail: dims ? `Approx ${dims}` : 'Standard single garage envelope' });
  } else if (isGarageDoor) {
    cards.push({ label: 'Physical Scope', value: '1 New Structural Opening', detail: 'Standard metric FD30S doorset aperture' });
  } else if (area) {
    const dims = primarySpace?.lengthM?.value && primarySpace?.widthM?.value ? `${primarySpace.lengthM.value}m x ${primarySpace.widthM.value}m` : undefined;
    cards.push({ label: 'Physical Dimensions', value: `${area} m²`, detail: dims ? `Approx ${dims}` : undefined });
  } else {
    cards.push({ label: 'Physical Scope', value: 'Measurements Needed', detail: 'Add dimensions or confirm on site visit' });
  }

  // 4. Regulatory Pathway
  if (isGarageConversion) {
    cards.push({ label: 'Statutory Pathway', value: 'Building Regs (Doc L & B)', detail: 'Building Notice or Full Plans certification' });
  } else if (isGarageDoor) {
    cards.push({ label: 'Statutory Pathway', value: 'Building Notice (Doc B)', detail: 'Local authority Building Control sign-off required' });
  } else if (isExtension) {
    cards.push({ label: 'Statutory Pathway', value: 'Planning & Building Regs', detail: 'Permitted Dev or Full Planning + Full Plans Regs' });
  } else if (isBathroom) {
    cards.push({ label: 'Statutory Pathway', value: 'Building Regs (Parts P & F)', detail: 'Electrical safety & mechanical extract ventilation' });
  } else {
    cards.push({ label: 'Statutory Pathway', value: 'Building Regulations', detail: 'Statutory compliance inspection upon completion' });
  }

  // 5. On-Site Work Duration
  cards.push({
    label: 'On-Site Work Duration',
    value: budgetAlignment.onSiteWorkDuration || '2 to 3 weeks',
    detail: budgetAlignment.totalLeadTime ? `Procurement lead time: ${budgetAlignment.totalLeadTime}` : undefined,
  });

  // 6. Indicative Cost Guide
  cards.push({
    label: 'Indicative Cost Guide',
    value: budgetAlignment.indicativeCostRange.formatted,
    detail: budgetAlignment.isBudgetReady ? 'All labour, materials & VAT included' : 'Scope confirmation required',
  });

  return cards;
}

export function generateWorkingInFavour(
  types: ProjectCategoryType[],
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  briefText: string
): string[] {
  const lower = (briefText || '').toLowerCase();
  const isGarageDoor = (lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway'));
  const isBathroom = types.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isExtension = types.includes('extension') || lower.includes('extension');

  if (isGarageDoor) {
    return [
      'Contained scope of work that can be executed cleanly in 2 to 3 working days with zero disruption to daily cooking or sleeping areas.',
      'Existing garage slab provides a solid working platform for masonry cutting, dust extraction, and lintel installation.',
      'Clear, standardized statutory path under Approved Document B without requiring planning permission or Party Wall awards.',
    ];
  }

  if (isBathroom) {
    return [
      'Self-contained room footprint allowing effective dust isolation screens from the rest of the property during strip-out.',
      'Modern walk-in wetroom formers and linear drainage channels integrate cleanly into suspended timber joists.',
      'Direct access to existing soil stack simplifies waste pipework falls and prevents unnecessary subfloor rerouting.',
    ];
  }

  if (isExtension) {
    return [
      'Rear garden access allows heavy machinery, muck-away grab lorries, and structural steels to be delivered without carrying through the home.',
      'Permitted Development rights may apply depending on boundary dimensions and ridge heights, saving 8 to 10 weeks of planning delays.',
      'Significant uplift in usable square footage and natural daylight, directly boosting property market valuation.',
    ];
  }

  return [
    'Straightforward project scope with established construction sequencing.',
    'Clear access for trade coordination and clean site setup.',
    'Enhances property functionality and long-term asset value.',
  ];
}

export function generatePotentialChallenges(
  types: ProjectCategoryType[],
  property: ProjectPropertyInfo,
  spaces: ProjectSpace[],
  briefText: string
): Array<{ challenge: string; solution: string }> {
  const lower = (briefText || '').toLowerCase();
  const isGarageDoor = (lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway'));
  const isBathroom = types.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isExtension = types.includes('extension') || lower.includes('extension');

  if (isGarageDoor) {
    return [
      {
        challenge: 'Floor level discrepancy between the garage concrete slab and hallway finished floor.',
        solution: 'Our team constructs a compliant 100mm step threshold with integrated draught, intumescent, and cold smoke seals satisfying Building Regs vapour containment.',
      },
      {
        challenge: 'Hidden electrical cables or central heating pipework running through the proposed opening location.',
        solution: 'We scan the entire dividing wall with multi-frequency digital scanners before any cutting, allowing our NICEIC electrician to safely reroute cables.',
      },
      {
        challenge: 'Controlling masonry dust inside the finished domestic hallway.',
        solution: 'We erect a heavy-duty zipped floor-to-ceiling polythene dust screen and use continuous water or vacuum-assisted dust suppression on all diamond cutters.',
      },
    ];
  }

  if (isBathroom) {
    return [
      {
        challenge: 'Timber joist deflection causing microcement hairline cracking or tile grout failure.',
        solution: 'We laser survey joists during strip-out and install 18mm/22mm marine plywood or cementitious backer boards screwed at 150mm centres to create a rigid, deflection-free substrate.',
      },
      {
        challenge: 'Water ingress behind luxury finishes in continuous-use walk-in shower zones.',
        solution: 'We apply a continuous liquid fleece tanking membrane up to 2m high and across the entire wet floor deck before any microcement or tiling is laid.',
      },
      {
        challenge: 'Achieving adequate gravitational waste fall for low-profile walk-in shower trays.',
        solution: 'We recess low-profile waste traps into the floor structure or notch joists strictly within Building Regs 0.25–0.4 span limits with timber reinforcement.',
      },
    ];
  }

  if (isExtension) {
    return [
      {
        challenge: 'Uncertain ground conditions and foundation depths on shrinkable London clay.',
        solution: 'We dig exploratory hand-dug trial holes prior to pouring concrete to verify load-bearing subsoil depth and satisfy the Building Control surveyor.',
      },
      {
        challenge: 'Shared Thames Water sewer pipes running across the rear garden.',
        solution: 'We commission a pre-construction CCTV drain survey and manage the Thames Water Build-Over Agreement application before ground breaking.',
      },
      {
        challenge: 'Open-plan ceiling heights compromised by downstand structural steel beams.',
        solution: 'Our structural engineer designs concealed universal beams seated on pocket padstones to achieve a continuous, completely flush ceiling line.',
      },
    ];
  }

  return [
    {
      challenge: 'Hidden condition variations discovered during substrate strip-out.',
      solution: 'We allocate a realistic pre-agreed contingency and conduct early non-destructive probing before ordering bespoke materials.',
    },
    {
      challenge: 'Minimising noise and domestic disruption while living on site.',
      solution: 'We establish clear working hours, daily clean-down routines, and protected corridor barriers throughout.',
    },
  ];
}

export function generateValueEngineeringTips(
  types: ProjectCategoryType[],
  spaces: ProjectSpace[],
  briefText: string
): string[] {
  const lower = (briefText || '').toLowerCase();
  const isGarageDoor = (lower.includes('garage') && lower.includes('door')) || (lower.includes('door') && lower.includes('hallway'));
  const isBathroom = types.includes('bathroom-renovation') || lower.includes('bath') || lower.includes('shower');
  const isExtension = types.includes('extension') || lower.includes('extension');

  if (isGarageDoor) {
    return [
      'Specifying a standard metric FD30S doorset size (e.g. 1981 x 762mm) avoids bespoke joinery fabrication charges.',
      'Selecting an unpainted pre-primed door leaf for on-site painting allows seamless color matching to your hallway architraves.',
      'Positioning the opening between existing studwork (if partition) or aligned with blockwork joints reduces plaster make-good.',
    ];
  }

  if (isBathroom) {
    return [
      'Keeping the WC, vanity, and shower waste within 1.5m of the existing soil vent pipe avoids costly joist notching and pipework rerouting.',
      'Combining hand-trowelled microcement in the wet enclosure with washable anti-mould paint on dry walls saves up to 35% on specialist application costs.',
      'Selecting standard format designer porcelain tiles over book-matched marble slabs offers identical visual elegance with zero specialist fabrication charges.',
    ];
  }

  if (isExtension) {
    return [
      'Aligning the extension width with standard steel stock lengths minimizes expensive off-site steel fabrication and site welding.',
      'Selecting standard glazed aperture dimensions for sliding or bifold doors can save £2,000–£4,000 compared to bespoke oversized openings.',
      'Positioning your new kitchen or utility drainage close to the existing inspection chamber reduces deep trench excavation.',
    ];
  }

  return [
    'Confirming all finishes and fixtures prior to site start eliminates costly mid-build change orders.',
    'Selecting durable standard-dimension materials avoids specialist fabrication lead times.',
  ];
}
