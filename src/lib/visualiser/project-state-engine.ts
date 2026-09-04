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

  const projectTypes = extraction.projectTypes && extraction.projectTypes.length > 0
    ? extraction.projectTypes
    : (['unknown'] as ProjectCategoryType[]);

  const hasStructuralAlteration = extraction.hasStructuralAlteration ?? false;

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
      value: extraction.property.existingCondition || 'Existing residential space',
      source: 'system_assumption',
      status: 'assumed',
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

  // 3. Uploaded Assets
  const uploadedAssets: UploadedAsset[] = input.imageAnalyses || [];

  // 4. Initial Finish Tiers & Selections
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

  // 6. Visual Concept State (Items 4, 5, 6, 7, 8)
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
      imageUrl: initialConceptSvg,
      sourceImageUrl: existingAsset?.url,
      prompt: input.briefText,
      modifications: [],
      provider: 'ST Contractors Architectural Engine',
      model: 'concept-vector-v2',
      timestamp: new Date().toISOString(),
      conceptType: existingAsset ? 'image_to_image_transformation' : 'conceptual_interpretation',
    },
  ];

  const visualConcept: VisualConceptState = {
    sourceImage: existingAsset?.url,
    generatedConceptImage: initialConceptSvg,
    currentConceptImage: initialConceptSvg,
    generationProvider: 'ST Contractors Architectural Engine',
    generationId: `vis-${Date.now()}-1`,
    generationVersion: 1,
    generationPrompt: input.briefText,
    generationTimestamp: new Date().toISOString(),
    conceptType: existingAsset ? 'image_to_image_transformation' : 'conceptual_interpretation',
    architecturalStyle: extraction.stylePreference,
    glazingType: extraction.glazingPreference,
    flooringType: extraction.flooringPreference,
    cabinetryColor: extraction.cabinetryPreference,
    visualPrompt: input.briefText,
    disclaimer: 'CONCEPT VISUALISATION — Indicative design interpretation for spatial and finish exploration. Not a structural working drawing.',
    refinementsHistory: [],
    visualHistory: initialVisualHistory,
    status: 'completed',
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
  const phases = generateConstructionPhases(projectTypes, hasStructuralAlteration);

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
    input.budget
  );

  // 16. Completeness Score
  const completenessScore = evaluateCompletenessScore(property, spaces, uploadedAssets, missingInformation);

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
  next.calculatedQuantities = calculateProjectQuantities(
    next.spaces,
    next.projectTypes,
    next.scopeOfWorks.some((s) => s.isStructural && s.included),
    {
      flooringMaterial: next.visualConcept.flooringType,
      structuralEngineerSpec: next.structuralEngineerSpec,
    }
  );

  next.budgetAlignment = evaluateBudgetAlignment(
    next.projectTypes,
    next.spaces,
    next.finishSelections
  );

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
  userBudget?: number
): BudgetAlignment {
  const primarySpace = spaces[0];
  const area = primarySpace?.areaM2?.value;
  const hasArea = area !== undefined && area > 0;

  // Base rates per project type (ST Contractors Q1 2026 London Benchmarks)
  let minCost = 25000;
  let maxCost = 45000;
  let benchmarkPerM2: string | undefined;

  if (types.includes('extension')) {
    minCost = hasArea ? area * 2400 : 75000;
    maxCost = hasArea ? area * 3200 : 110000;
    benchmarkPerM2 = hasArea ? '£2,400 – £3,200 / m²' : 'Area required for exact m² budget adjustment';
  } else if (types.includes('kitchen-renovation')) {
    minCost = hasArea ? 18000 + area * 600 : 22000;
    maxCost = hasArea ? 32000 + area * 900 : 42000;
    benchmarkPerM2 = hasArea ? '£1,800 – £2,600 / m²' : 'Area required for exact m² budget adjustment';
  } else if (types.includes('bathroom-renovation')) {
    minCost = 12000;
    maxCost = 24000;
    benchmarkPerM2 = 'Standard suite benchmark (£12k–£24k)';
  } else if (types.includes('driveway')) {
    minCost = hasArea ? area * 110 : 8000;
    maxCost = hasArea ? area * 165 : 14000;
    benchmarkPerM2 = hasArea ? '£110 – £165 / m²' : 'Area required for exact m² budget adjustment';
  }

  // Multiplier for Finish Tier
  const tierMultiplier = finishes.Cabinetry === 'bespoke' ? 1.4 : finishes.Cabinetry === 'standard' ? 0.85 : 1.0;
  const finalMin = Math.round(minCost * tierMultiplier);
  const finalMax = Math.round(maxCost * tierMultiplier);

  return {
    estimateQuality: hasArea ? 'DEVELOPING_ESTIMATE' : 'EARLY_BENCHMARK',
    indicativeCostRange: {
      min: finalMin,
      max: finalMax,
      formatted: `£${finalMin.toLocaleString()} – £${finalMax.toLocaleString()}`,
    },
    benchmarkPerM2,
    elementsMostAffectingBudget: [
      'Structural alterations and load-bearing steelwork requirements',
      'Cabinetry and worktop specification selections',
      'Architectural glazing aperture widths and sliding mechanisms',
    ],
    whereToSpendMore: [
      'Engineered steelwork and premium sliding door track mechanisms',
      'High-durability quartz or sintered stone worktops',
    ],
    whereToSave: [
      'Retaining existing drainage positions where possible',
      'Standardizing carcass cabinetry with bespoke door fronts',
    ],
    unknownCostRisks: [
      'Subfloor condition and level discrepancies beneath existing coverings',
      'Condition of existing electrical consumer unit and service tails',
    ],
    provenance: {
      source: 'ST Contractors Historical Benchmark Data Q1 2026 (London & South East)',
      region: 'London & South East England',
      projectType: types.join(', '),
      dateUpdated: '2026-03-01',
      vatTreatment: 'inclusive_20_percent',
      inclusions: ['Labour', 'Materials', 'Building Regulations compliance', 'Project management', 'Waste clearance'],
      exclusions: ['Local authority planning application fees', 'Party Wall surveyor awards', 'Specialist AV equipment'],
      confidence: hasArea ? 'scope_aligned' : 'benchmark_only',
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
