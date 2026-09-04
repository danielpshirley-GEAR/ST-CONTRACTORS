/**
 * Master Project State Coordinator Engine
 * Single source of truth for the AI Project Design & Scope Builder.
 * Complies with BUILD_SPEC.md and Phase 7B Specification.
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
  ScopeOfWorkItem,
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

  // 1. Property Setup (Preserving 'not_provided' / 'unknown' - Item 3)
  const propEra = extraction.property.era || 'not_provided';
  const propType = extraction.property.type || 'not_provided';

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
      value: extraction.property.storeys || (propType === 'flat' ? 1 : 2),
      source: 'system_assumption',
      status: 'assumed',
    },
    location: {
      value: extraction.property.location || input.location || 'London & South East',
      source: input.location ? 'user_statement' : 'system_assumption',
      status: input.location ? 'confirmed' : 'assumed',
    },
    isConservationArea: {
      value: Boolean(extraction.property.isConservationArea),
      source: 'user_statement',
      status: extraction.property.isConservationArea !== undefined ? 'confirmed' : 'unknown',
    },
    isListedBuilding: {
      value: Boolean(extraction.property.isListedBuilding),
      source: 'user_statement',
      status: extraction.property.isListedBuilding !== undefined ? 'confirmed' : 'unknown',
    },
    existingCondition: {
      value: extraction.property.existingCondition || 'Existing residential space',
      source: 'system_assumption',
      status: 'assumed',
    },
  };

  // 2. Spaces Setup
  const spaces: ProjectSpace[] = (extraction.spaces && extraction.spaces.length > 0)
    ? extraction.spaces.map((s, idx) => {
        const length = s.lengthM || (projectTypes.includes('driveway') ? 8.0 : projectTypes.includes('bathroom-renovation') ? 2.5 : 5.0);
        const width = s.widthM || (projectTypes.includes('driveway') ? 5.0 : projectTypes.includes('bathroom-renovation') ? 2.0 : 4.0);
        const height = s.heightM || 2.4;
        const area = Math.round(length * width * 10) / 10;

        return {
          id: `space-${idx + 1}`,
          name: s.name || (idx === 0 ? 'Main Project Area' : `Secondary Space ${idx + 1}`),
          lengthM: {
            value: length,
            source: s.lengthM ? 'user_statement' : 'system_assumption',
            status: s.lengthM ? 'confirmed' : 'assumed',
          },
          widthM: {
            value: width,
            source: s.widthM ? 'user_statement' : 'system_assumption',
            status: s.widthM ? 'confirmed' : 'assumed',
          },
          heightM: {
            value: height,
            source: s.heightM ? 'user_statement' : 'system_assumption',
            status: s.heightM ? 'confirmed' : 'assumed',
          },
          areaM2: {
            value: area,
            source: s.lengthM && s.widthM ? 'derived_calculation' : 'system_assumption',
            status: s.lengthM && s.widthM ? 'derived' : 'assumed',
          },
          desiredChanges: s.desiredChanges || [input.briefText],
          fixtures: s.fixtures || [],
          constraints: s.constraints || [],
          isPrimary: idx === 0,
        };
      })
    : [
        {
          id: 'space-1',
          name: projectTypes[0] === 'driveway' ? 'Front Driveway & Entrance' : projectTypes[0] === 'bedroom' ? "Baby's Bedroom & Nursery" : 'Main Project Space',
          lengthM: { value: 5.0, source: 'system_assumption', status: 'assumed' },
          widthM: { value: 4.0, source: 'system_assumption', status: 'assumed' },
          heightM: { value: 2.4, source: 'system_assumption', status: 'assumed' },
          areaM2: { value: 20.0, source: 'system_assumption', status: 'assumed' },
          desiredChanges: [input.briefText],
          fixtures: [],
          constraints: [],
          isPrimary: true,
        },
      ];

  // 3. Uploaded Assets
  const uploadedAssets: UploadedAsset[] = input.imageAnalyses || (input.images || []).map((img, idx) => ({
    id: `asset-${idx + 1}`,
    url: img.url,
    filename: img.filename,
    classifiedCategory: (img.category as any) || (idx === 0 ? 'existing_condition' : 'inspiration'),
    classificationConfidence: 80,
  }));

  const hasExistingPhoto = uploadedAssets.some((a) => a.classifiedCategory === 'existing_condition');

  // 4. Finish Selections & Specification Tree
  const globalTier: FinishTier = extraction.assumedFinishTier || 'enhanced';
  const finishSelections: Record<string, FinishTier> = {
    Cabinetry: globalTier,
    Worktops: globalTier,
    Flooring: globalTier,
    Lighting: globalTier,
  };

  const specTree = buildSpecificationTree(projectTypes, spaces, globalTier);

  // 5. Quantities Calculation
  const quantities = calculateProjectQuantities(spaces, projectTypes, hasStructuralAlteration, {
    flooringMaterial: extraction.flooringPreference || 'herringbone_engineered_oak',
    hasStructuralAlteration,
  });

  // 6. Feasibility & Constraints
  const feasibility = evaluateProjectFeasibility(
    projectTypes,
    hasStructuralAlteration,
    false,
    property,
    input.briefText
  );

  // 7. Construction Phases & Considerations
  const phases = generateConstructionPhases(projectTypes, hasStructuralAlteration);
  const considerations = generateThingsToConsider(projectTypes, property, input.briefText, hasStructuralAlteration);

  // 8. Scope of Works Generation
  const scopeOfWorks = generateProjectSpecificScope(projectTypes, hasStructuralAlteration, globalTier, spaces[0]?.name || 'Space');

  // 9. System Assumptions (with reasons & affected calculations - Item 4)
  const assumptions: SystemAssumption[] = (extraction.assumptions || []).map((a, idx) => ({
    id: `assump-${idx + 1}`,
    key: a.key,
    label: a.label,
    value: a.value,
    reason: a.reason,
    source: 'system_assumption',
    confidence: a.confidence,
    affectedCalculations: a.affectedCalculations,
    userEditable: true,
    status: 'active',
  }));

  // 10. Missing Information Items (with priority scoring - Item 29)
  const missingInformation: MissingInfoItem[] = (extraction.missingInformation || []).map((m, idx) => {
    const priorityScore = (m.scopeImpact * 3) + (m.costImpact * 3) + (m.feasibilityImpact * 3) + (m.quantityImpact * 2) - (m.userEffort * 1);
    return {
      id: `missing-${idx + 1}`,
      field: m.field,
      question: m.question,
      category: m.category,
      scopeImpact: m.scopeImpact,
      costImpact: m.costImpact,
      feasibilityImpact: m.feasibilityImpact,
      visualImpact: m.visualImpact,
      quantityImpact: m.quantityImpact,
      userEffort: m.userEffort,
      priorityScore,
      applicabilityCondition: m.applicabilityCondition,
      options: m.options,
      resolved: false,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  // 11. Visual Concept Generation
  const visualConcept = buildVisualConcept(
    projectTypes,
    globalTier,
    spaces[0],
    extraction,
    hasExistingPhoto,
    uploadedAssets
  );

  // 12. Project Complexity & Budget Alignment
  const complexity = evaluateComplexity(projectTypes, hasStructuralAlteration, property.type.value === 'terraced');
  const budgetAlignment = evaluateBudgetAlignment(projectTypes, spaces[0]?.areaM2.value || 20, globalTier, hasStructuralAlteration);

  // 13. Weighted Completeness Score (Item 30)
  const completenessScore = calculateCompletenessScore(extraction, input);

  const initialBrief = input.briefText || 'Transform existing space with modern architectural finishes';
  const initialIntent = extraction.interpretedIntent || (projectTypes.includes('unknown') ? 'Homeowner looking to explore renovation design and costs' : `Architectural plan for ${projectTypes.map((t) => t.replace(/-/g, ' ')).join(' & ')}`);

  const state: ProjectState = {
    projectId: `proj-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    originalBrief: initialBrief,
    interpretedIntent: initialIntent,
    projectTypes,
    property,
    spaces,
    uploadedAssets,
    visualConcept,
    finishSelections,
    finishTiers: MASTER_FINISH_TIERS,
    scopeOfWorks,
    phases,
    thingsToConsider: considerations,
    specificationTree: specTree,
    calculatedQuantities: quantities,
    feasibility,
    assumptions,
    missingInformation,
    complexity,
    budgetAlignment,
    completenessScore,
    versions: [],
    chatHistory: [],
  };

  // Add Initial Version Snapshot (Immutable - Item 17)
  state.versions.push({
    versionNumber: 1,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: 'Initial Architectural Brief & Scope Baseline',
    briefSnapshot: initialBrief,
    dimensionsSnapshot: {
      length: spaces[0]?.lengthM.value,
      width: spaces[0]?.widthM.value,
      area: spaces[0]?.areaM2.value,
    },
    finishesSnapshot: { ...finishSelections },
    stateSnapshot: JSON.parse(JSON.stringify(state)),
  });

  return state;
}

/**
 * Generates Scope of Works with 3 Strict States (Item 31 & 32)
 */
function generateProjectSpecificScope(
  projectTypes: ProjectCategoryType[],
  hasStructural: boolean,
  tier: FinishTier,
  spaceName: string
): ScopeOfWorkItem[] {
  const items: ScopeOfWorkItem[] = [];
  let id = 1;

  const isDriveway = projectTypes.includes('driveway');
  const isJoinery = projectTypes.includes('joinery');
  const isBedroom = projectTypes.includes('bedroom') || projectTypes.includes('decorating');
  const isExtension = projectTypes.includes('extension');
  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');

  if (isDriveway) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Groundworks',
      category: 'Demolition & Groundworks',
      title: 'Driveway Subgrade Excavation & CAT Scanning',
      description: 'Scan utility cables and excavate existing driveway surface down to 250mm depth with grab lorry spoil removal.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: 'standard',
    });
    items.push({
      id: `scope-${id++}`,
      trade: 'Paving Specialist',
      category: 'Paving',
      title: 'Permeable Sub-Base & Block Paving / Resin Surfacing',
      description: 'Compacted MOT Type 3 stone layer, concrete haunched borders, and permeable block or resin-bound surface.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: tier,
    });
    items.push({
      id: `scope-${id++}`,
      trade: 'Drainage',
      category: 'Drainage',
      title: 'ACO Slot Channel Drainage to Soakaway Crates',
      description: 'Install continuous slot drainage channels connected to an underground stormwater soakaway.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: 'standard',
    });
    return items;
  }

  if (isJoinery) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Bespoke Joinery',
      category: 'Joinery',
      title: 'Floor-to-Ceiling Made-to-Measure Fitted Wardrobes',
      description: 'Precision CAD-drafted wardrobe carcasses, custom painted shaker doors, and Blum soft-close hardware.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: tier,
    });
    items.push({
      id: `scope-${id++}`,
      trade: 'Electrical (Part P)',
      category: 'Electrics',
      title: 'Integrated Internal Sensor LED Strip Lighting',
      description: 'Low-voltage warm LED lighting channels recessed into wardrobe frame triggered on door opening.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: tier,
    });
    return items;
  }

  // 1. Preparation & Site Protection
  items.push({
    id: `scope-${id++}`,
    trade: 'General Building',
    category: 'Preparation',
    title: 'Floor Protection, Corex Sheeting & Zipper Dust Screens',
    description: 'Erect sealed polythene dust barriers to isolate work zones and install heavy-duty corex floor protection throughout access paths.',
    included: true,
    status: 'CONFIRMED_IN_SCOPE',
    isStructural: false,
    finishTier: 'standard',
  });

  // 2. Structural Steel (Only if actually in scope)
  if (hasStructural) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Structural Engineering & Steel',
      category: 'Structure',
      title: 'Universal Beam / Column (RSJ) Frame & Concrete Padstones',
      description: 'Temporary Acro propping, demolition of load-bearing masonry, casting high-density concrete padstones, and craning structural steel frame into place.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: true,
      finishTier: 'standard',
    });
  }

  // 3. Groundworks (Only for extensions)
  if (isExtension) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Groundworks',
      category: 'Substructure',
      title: 'Foundation Trench Excavation & Ready-Mix Concrete Pour',
      description: 'Digging foundation trenches to solid ground, Building Control inspection, and C25/30 ready-mix concrete pour.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: true,
      finishTier: 'standard',
    });
    items.push({
      id: `scope-${id++}`,
      trade: 'Drainage',
      category: 'Drainage',
      title: 'Thames Water CCTV Survey & Drainage Build-Over Alignment',
      description: 'Pre-construction CCTV survey and installation of airtight double-sealed internal inspection covers.',
      included: true,
      status: 'PROVISIONAL',
      reason: 'Underground drainage condition must be verified on site.',
      isStructural: false,
      finishTier: 'standard',
    });
  }

  // 4. Kitchen Cabinetry (Only if kitchen)
  if (isKitchen) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Kitchen Fitting',
      category: 'Cabinetry',
      title: 'Bespoke Fitted Kitchen Units, Island & Quartz Worktops',
      description: 'Installation of high-grade cabinetry, laser-templated 20mm/30mm quartz worktops, and undermounted sink.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: tier,
    });
  }

  // 5. Bathroom (Only if bathroom)
  if (isBathroom) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Plumbing & Waterproofing',
      category: 'Sanitaryware',
      title: 'Schlüter Waterproof Tanking, Concealed Valve & Sanitaryware',
      description: '100% waterproof membrane application in wet zones, concealed thermostatic valves, and wall-hung pan installation.',
      included: true,
      status: 'CONFIRMED_IN_SCOPE',
      isStructural: false,
      finishTier: tier,
    });
  }

  // 6. Finishes & Decorating
  items.push({
    id: `scope-${id++}`,
    trade: 'Decorating',
    category: 'Finishes',
    title: 'Plaster Skimming & Washable Designer Emulsion Paint',
    description: 'Thistle Multi-Finish skim coat, mist coat primer, and 2 full coats of durable washable emulsion paint.',
    included: true,
    status: 'CONFIRMED_IN_SCOPE',
    isStructural: false,
    finishTier: tier,
  });

  return items;
}

/**
 * Visual Concept Builder with SVG Layout Plan Generation
 */
function buildVisualConcept(
  projectTypes: ProjectCategoryType[],
  tier: FinishTier,
  space: ProjectSpace,
  extraction: StructuredBriefExtraction,
  hasExistingPhoto: boolean,
  assets: UploadedAsset[]
): VisualConceptState {
  const isExtension = projectTypes.includes('extension');
  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isDriveway = projectTypes.includes('driveway');
  const isJoinery = projectTypes.includes('joinery');
  const isBedroom = projectTypes.includes('bedroom') || projectTypes.includes('decorating');

  let defaultImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
  let architecturalStyle = 'Contemporary Architectural';

  if (isDriveway) {
    defaultImage = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1600&q=80';
    architecturalStyle = 'Permeable Resin-Bound Paving';
  } else if (isJoinery) {
    defaultImage = 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1600&q=80';
    architecturalStyle = 'Bespoke Floor-to-Ceiling Joinery';
  } else if (isBedroom) {
    defaultImage = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=80';
    architecturalStyle = 'Serene Scandinavian Nursery / Bedroom';
  } else if (isBathroom) {
    defaultImage = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80';
    architecturalStyle = 'Minimalist Luxury Porcelain Bathroom';
  } else if (isExtension) {
    defaultImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
    architecturalStyle = 'Architectural Glass Rear Extension';
  }

  // Use uploaded existing photo if available
  const existingAsset = assets.find((a) => a.classifiedCategory === 'existing_condition');
  const currentConceptImage = existingAsset ? existingAsset.url : defaultImage;

  const visualPrompt = `Ultra-clean architectural photograph of ${space?.name || 'space'}, finished in ${tier} specification with ${extraction.flooringPreference || 'herringbone engineered oak'} and natural ambient daylight.`;

  return {
    currentConceptImage,
    conceptType: existingAsset ? 'image_to_image_transformation' : 'conceptual_interpretation',
    architecturalStyle,
    glazingType: isExtension ? 'Slimline Aluminium Bifolds / Sliding Glass' : 'Architectural Windows',
    flooringType: extraction.flooringPreference || 'Herringbone European Oak Parquet',
    cabinetryColor: extraction.cabinetryPreference || 'Handmade In-Frame Sage / Navy Shaker',
    worktopType: '30mm Calacatta Quartz with Waterfall Edge',
    lightingType: 'Plaster-in Flush LED Downlights & Island Pendants',
    visualPrompt,
    disclaimer: existingAsset
      ? 'Transformation concept based on your uploaded property photograph and requested design finishes.'
      : 'Conceptual architectural interpretation. Sizing and layouts represent indicative styling for preliminary planning.',
    refinementsHistory: ['Initial design generated'],
  };
}

/**
 * Calculates Real Weighted Completeness Score (Item 30)
 */
function calculateCompletenessScore(extraction: StructuredBriefExtraction, input: InitialProjectInput): number {
  let score = 0;

  // 1. Project Intent (15%)
  if (!extraction.projectTypes.includes('unknown')) score += 15;
  else if (input.briefText && input.briefText.length > 5) score += 5;

  // 2. Spaces (10%)
  if (extraction.spaces && extraction.spaces.length > 0) score += 10;

  // 3. Dimensions (15%)
  const primarySpace = extraction.spaces?.[0];
  if (primarySpace?.lengthM && primarySpace?.widthM) score += 15;
  else if (input.dimensions?.length && input.dimensions?.width) score += 15;
  else if (primarySpace?.areaM2) score += 8;

  // 4. Property Information (10%)
  if (input.propertyType && input.propertyType !== 'not_provided') score += 5;
  if (input.propertyEra && input.propertyEra !== 'not_provided') score += 5;

  // 5. Structural Information (15%)
  if (extraction.hasStructuralAlteration !== undefined) score += 15;

  // 6. Specification Selections (15%)
  if (extraction.materialsRequested.length > 0 || extraction.fixturesRequested.length > 0) score += 15;
  else score += 8;

  // 7. Site Constraints & Drainage (10%)
  if (input.imageAnalyses && input.imageAnalyses.length > 0) score += 10;
  else if (input.images && input.images.length > 0) score += 6;

  // 8. Budget & Timeline (10%)
  if (input.budget) score += 5;
  if (input.desiredCompletion) score += 5;

  return Math.min(100, Math.max(15, score));
}

function evaluateComplexity(projectTypes: ProjectCategoryType[], hasStructural: boolean, isTerrace: boolean): ProjectComplexity {
  const drivers: string[] = [];
  let score = 3;

  if (hasStructural) {
    drivers.push('Structural steel knockthrough requiring Building Control engineer calculations');
    score += 2;
  }
  if (projectTypes.includes('extension')) {
    drivers.push('Groundworks, foundation excavation, and Thames Water drainage alignment');
    score += 2;
  }
  if (isTerrace) {
    drivers.push('Terraced property with Party Wall Act notifications and narrow access logistics');
    score += 1.5;
  }
  if (projectTypes.length > 1) {
    drivers.push('Multi-trade coordination across plumbing, electrics, structural steel, and joinery');
    score += 1;
  }

  score = Math.min(10, Math.max(2, Math.round(score)));
  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' = 'MODERATE';
  if (score >= 8) level = 'VERY_HIGH';
  else if (score >= 6) level = 'HIGH';
  else if (score >= 4) level = 'MODERATE';
  else level = 'LOW';

  return {
    level,
    scoreOutOf10: score,
    mainDrivers: drivers,
    summary: `${level} project complexity driven by ${drivers.length} main engineering and logistical factors.`,
  };
}

function evaluateBudgetAlignment(
  projectTypes: ProjectCategoryType[],
  areaM2: number,
  tier: FinishTier,
  hasStructural: boolean
): BudgetAlignment {
  const safeArea = areaM2 > 0 ? areaM2 : 20;
  let baseMin = 1800;
  let baseMax = 2800;

  if (projectTypes.includes('driveway')) {
    baseMin = 120;
    baseMax = 240;
  } else if (projectTypes.includes('joinery')) {
    baseMin = 600;
    baseMax = 1200;
  } else if (projectTypes.includes('bedroom') || projectTypes.includes('decorating')) {
    baseMin = 400;
    baseMax = 900;
  } else if (projectTypes.includes('extension')) {
    baseMin = 2200;
    baseMax = 3200;
  } else if (projectTypes.includes('bathroom-renovation')) {
    baseMin = 1400;
    baseMax = 2500;
  }

  const multiplier = tier === 'bespoke' ? 1.4 : tier === 'standard' ? 0.85 : 1.15;
  const minCost = Math.round(safeArea * baseMin * multiplier);
  const maxCost = Math.round(safeArea * baseMax * multiplier);

  return {
    estimateQuality: 'EARLY_BENCHMARK',
    indicativeCostRange: {
      min: minCost,
      max: maxCost,
      formatted: `£${minCost.toLocaleString()} – £${maxCost.toLocaleString()}`,
    },
    benchmarkPerM2: `£${Math.round(baseMin * multiplier).toLocaleString()} – £${Math.round(baseMax * multiplier).toLocaleString()} / m²`,
    elementsMostAffectingBudget: [
      hasStructural ? 'Structural steel beam spans and concrete padstone bearing depths' : 'Subfloor levelness and structural timber preparation',
      'Architectural glazing aperture width and slimline sliding mechanisms',
      'Cabinetry joinery specification and stone fabrication details',
    ],
    whereToSpendMore: [
      'Quality structural engineering and subfloor joist sistering',
      'High-performance Low-E solar control glass to prevent summer overheating',
      'Concealed thermostatic brassware with solid brass valve cartridges',
    ],
    whereToSave: [
      'Standardizing modular carcass dimensions rather than 100% custom non-standard depths',
      'Keeping primary foul drainage stacks close to existing soil drops',
      'Selecting durable 20mm quartz stone over imported exotic marble slabs',
    ],
    unknownCostRisks: [
      'Underground drainage obstructions or Thames Water build-over requirements',
      'Subfloor moisture or joist rot discovered during strip-out',
      'Consumer unit upgrade if existing domestic fuse board lacks spare capacity',
    ],
  };
}

/**
 * Applies Atomic State Mutations from Structured Operations
 * Dependency Engine: Recalculates ONLY affected outputs without forcing structural alterations.
 */
export function applyProjectChange(
  currentState: ProjectState,
  operations: StructuredChangeOperation[]
): ProjectState {
  // Deep clone immutable snapshot
  const next = JSON.parse(JSON.stringify(currentState)) as ProjectState;
  const primarySpace = next.spaces[0];

  let hasDimensionChanged = false;
  let hasFinishChanged = false;
  let hasStructuralChanged = false;
  const changeDescriptions: string[] = [];

  for (const op of operations) {
    changeDescriptions.push(op.description);

    switch (op.operationType) {
      case 'UPDATE_DIMENSION': {
        if (primarySpace) {
          if (op.dimensionField === 'width') {
            if (op.dimensionValue !== undefined) primarySpace.widthM.value = op.dimensionValue;
            else if (op.dimensionDelta !== undefined) primarySpace.widthM.value = Math.round((primarySpace.widthM.value + op.dimensionDelta) * 10) / 10;
            primarySpace.widthM.status = 'confirmed';
            hasDimensionChanged = true;
          } else if (op.dimensionField === 'length') {
            if (op.dimensionValue !== undefined) primarySpace.lengthM.value = op.dimensionValue;
            else if (op.dimensionDelta !== undefined) primarySpace.lengthM.value = Math.round((primarySpace.lengthM.value + op.dimensionDelta) * 10) / 10;
            primarySpace.lengthM.status = 'confirmed';
            hasDimensionChanged = true;
          } else if (op.dimensionField === 'height') {
            if (op.dimensionValue !== undefined) primarySpace.heightM.value = op.dimensionValue;
            primarySpace.heightM.status = 'confirmed';
            hasDimensionChanged = true;
          }
          primarySpace.areaM2.value = Math.round(primarySpace.lengthM.value * primarySpace.widthM.value * 10) / 10;
          primarySpace.areaM2.status = 'derived';
        }
        break;
      }

      case 'CHANGE_FINISH_TIER': {
        if (op.finishTier) {
          next.finishSelections.Cabinetry = op.finishTier;
          next.finishSelections.Worktops = op.finishTier;
          next.finishSelections.Flooring = op.finishTier;
          next.specificationTree = buildSpecificationTree(next.projectTypes, next.spaces, op.finishTier);
          hasFinishChanged = true;
        }
        break;
      }

      case 'CHANGE_CABINETRY': {
        if (op.materialName) {
          next.visualConcept.cabinetryColor = op.materialName;
          next.visualConcept.visualPrompt += `, cabinetry painted in ${op.materialName}`;
        }
        break;
      }

      case 'CHANGE_FLOORING': {
        if (op.materialName) {
          next.visualConcept.flooringType = op.materialName;
          const floorNode = next.specificationTree.find((n) => n.id === 'spec-flooring');
          if (floorNode) {
            floorNode.selectedOption = op.materialName;
          }
          hasFinishChanged = true;
        }
        break;
      }

      case 'ADD_ROOFLIGHT': {
        next.visualConcept.visualPrompt += ', featuring frameless flush architectural glass rooflights';
        next.visualConcept.refinementsHistory.push('Added architectural rooflights to ceiling');
        break;
      }

      case 'UPDATE_STRUCTURAL': {
        if (op.hasStructuralChange !== undefined) {
          hasStructuralChanged = true;
        }
        break;
      }

      default:
        break;
    }
  }

  // Derive structural state strictly from existing state unless explicitly updated (Item 16)
  const isStructuralActive = hasStructuralChanged
    ? Boolean(operations.find((o) => o.operationType === 'UPDATE_STRUCTURAL')?.hasStructuralChange)
    : next.scopeOfWorks.some((s) => s.isStructural && s.included);

  // Recalculate downstream quantities using exact current state
  if (hasDimensionChanged || hasFinishChanged || hasStructuralChanged) {
    next.calculatedQuantities = calculateProjectQuantities(
      next.spaces,
      next.projectTypes,
      isStructuralActive,
      {
        flooringMaterial: next.visualConcept.flooringType,
        hasStructuralAlteration: isStructuralActive,
      }
    );

    next.budgetAlignment = evaluateBudgetAlignment(
      next.projectTypes,
      primarySpace ? primarySpace.areaM2.value : 20,
      next.finishSelections.Cabinetry || 'enhanced',
      isStructuralActive
    );
  }

  // Add new immutable version snapshot (Item 17)
  const nextVersionNum = next.versions.length + 1;
  const mainDesc = changeDescriptions.join('; ') || 'Refined project design';
  next.visualConcept.refinementsHistory.push(mainDesc);

  next.versions.push({
    versionNumber: nextVersionNum,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: mainDesc,
    briefSnapshot: mainDesc,
    dimensionsSnapshot: {
      length: primarySpace?.lengthM.value,
      width: primarySpace?.widthM.value,
      area: primarySpace?.areaM2.value,
    },
    finishesSnapshot: { ...next.finishSelections },
    stateSnapshot: JSON.parse(JSON.stringify(next)),
  });

  next.updatedAt = new Date().toISOString();
  return next;
}

/**
 * True Version Restore Engine (Item 17)
 * Restores exact immutable snapshot without regex string re-parsing.
 */
export function restoreProjectVersion(currentState: ProjectState, targetVersionNumber: number): ProjectState {
  const version = currentState.versions.find((v) => v.versionNumber === targetVersionNumber);
  if (!version || !version.stateSnapshot) {
    return currentState;
  }

  // Deep clone snapshot
  const restoredState = JSON.parse(JSON.stringify(version.stateSnapshot)) as ProjectState;
  
  // Preserve complete version history list
  restoredState.versions = [...currentState.versions];
  
  // Append new version entry noting the restore
  restoredState.versions.push({
    versionNumber: restoredState.versions.length + 1,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: `Restored back to Version ${targetVersionNumber} (${version.description})`,
    briefSnapshot: version.briefSnapshot,
    dimensionsSnapshot: { ...version.dimensionsSnapshot },
    finishesSnapshot: { ...version.finishesSnapshot },
    stateSnapshot: JSON.parse(JSON.stringify(restoredState)),
  });

  restoredState.updatedAt = new Date().toISOString();
  return restoredState;
}
