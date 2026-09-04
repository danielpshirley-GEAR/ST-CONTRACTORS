/**
 * Master Project State Coordinator Engine
 * Single source of truth for the AI Project Design & Scope Builder.
 * Complies with BUILD_SPEC.md & Master Visualiser Rebuild Specification.
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
} from '@/types/visualiser-scope';
import { calculateProjectQuantities } from './scope-calculator';
import { evaluateProjectFeasibility } from './feasibility-rules';
import { generateConstructionPhases } from './phases-rules';
import { generateThingsToConsider } from './considerations-rules';
import { buildSpecificationTree, MASTER_FINISH_TIERS } from './specification-rules';

export interface InitialProjectInput {
  briefText: string;
  images?: { url: string; filename: string; category?: string }[];
  dimensions?: { length?: number; width?: number; height?: number; area?: number };
  propertyType?: string;
  propertyEra?: string;
  location?: string;
  budget?: number;
  desiredCompletion?: string;
}

export function createInitialProjectState(input: InitialProjectInput): ProjectState {
  const brief = input.briefText || '';
  const lower = brief.toLowerCase();

  // 1. Detect Project Types (supports multiple)
  const projectTypes: ProjectCategoryType[] = [];
  if (lower.includes('bathroom') || lower.includes('ensuite') || lower.includes('shower') || lower.includes('wetroom')) {
    projectTypes.push('bathroom-renovation');
  }
  if (lower.includes('kitchen') || lower.includes('diner') || lower.includes('cabinets') || lower.includes('island') || lower.includes('worktop')) {
    projectTypes.push('kitchen-renovation');
  }
  if (lower.includes('extension') || lower.includes('extend') || lower.includes('rear extension') || lower.includes('side return') || lower.includes('wraparound')) {
    projectTypes.push('extension');
  }
  if (lower.includes('loft') || lower.includes('attic') || lower.includes('dormer') || lower.includes('mansard')) {
    projectTypes.push('loft-conversion');
  }
  if (lower.includes('garage')) {
    projectTypes.push('garage-conversion');
  }
  if (lower.includes('garden room') || lower.includes('garden studio') || lower.includes('outbuilding')) {
    projectTypes.push('garden-room');
  }
  if (lower.includes('driveway') || lower.includes('paving') || lower.includes('resin')) {
    projectTypes.push('driveway');
  }
  if (lower.includes('landscaping') || lower.includes('patio') || lower.includes('decking')) {
    projectTypes.push('landscaping');
  }
  if (lower.includes('full house') || lower.includes('full renovation') || lower.includes('whole house') || lower.includes('gut renovat')) {
    projectTypes.push('full-renovation');
  }
  if (projectTypes.length === 0) {
    projectTypes.push('kitchen-renovation'); // Default fallback
  }

  const hasStructuralKnockthrough =
    lower.includes('knock') ||
    lower.includes('remove wall') ||
    lower.includes('open plan') ||
    lower.includes('steel') ||
    lower.includes('rsj') ||
    lower.includes('beam');

  // 2. Property Info
  const detectedEra = (input.propertyEra as any) || (lower.includes('victorian') ? 'victorian' : lower.includes('edwardian') ? 'edwardian' : lower.includes('1930') ? '1930s' : 'victorian');
  const detectedBuilding = (input.propertyType as any) || (lower.includes('terrace') ? 'terraced' : lower.includes('semi') ? 'semi_detached' : lower.includes('detached') ? 'detached' : lower.includes('flat') ? 'flat' : 'terraced');

  const property: ProjectPropertyInfo = {
    type: {
      value: detectedBuilding,
      source: input.propertyType ? 'user_statement' : 'system_assumption',
      status: input.propertyType ? 'confirmed' : 'assumed',
    },
    era: {
      value: detectedEra,
      source: input.propertyEra ? 'user_statement' : 'system_assumption',
      status: input.propertyEra ? 'confirmed' : 'assumed',
    },
    storeys: {
      value: lower.includes('flat') ? 1 : 2,
      source: 'system_assumption',
      status: 'assumed',
    },
    location: {
      value: input.location || 'London & South East',
      source: input.location ? 'user_statement' : 'system_assumption',
      status: input.location ? 'confirmed' : 'assumed',
    },
    isConservationArea: {
      value: lower.includes('conservation'),
      source: 'user_statement',
      status: lower.includes('conservation') ? 'confirmed' : 'unknown',
    },
    isListedBuilding: {
      value: lower.includes('listed'),
      source: 'user_statement',
      status: lower.includes('listed') ? 'confirmed' : 'unknown',
    },
    existingCondition: {
      value: 'Unmodernised residential interior',
      source: 'system_assumption',
      status: 'assumed',
    },
  };

  // 3. Primary Space & Dimensions
  let length = input.dimensions?.length || 0;
  let width = input.dimensions?.width || 0;
  let height = input.dimensions?.height || 2.4;

  // Extract dimensions from text if not supplied explicitly (e.g. "5m x 4m" or "5x4")
  if (length === 0 || width === 0) {
    const dimMatch = brief.match(/(\d+(\.\d+)?)\s*(?:m|metres|meters)?\s*(?:x|by|\*)\s*(\d+(\.\d+)?)\s*(?:m|metres|meters)?/i);
    if (dimMatch) {
      length = parseFloat(dimMatch[1]);
      width = parseFloat(dimMatch[3]);
    }
  }

  const isConfirmedDims = length > 0 && width > 0;
  // If still 0, provide default realistic starting assumption for visualization
  if (length === 0) length = projectTypes.includes('extension') ? 5.0 : projectTypes.includes('bathroom-renovation') ? 2.8 : 4.5;
  if (width === 0) width = projectTypes.includes('extension') ? 3.5 : projectTypes.includes('bathroom-renovation') ? 2.2 : 3.8;

  const spaceName = projectTypes.includes('bathroom-renovation')
    ? 'Family Bathroom Suite'
    : projectTypes.includes('extension')
    ? 'Rear Extension & Kitchen Living Space'
    : projectTypes.includes('loft-conversion')
    ? 'Master Bedroom Suite & En-Suite'
    : 'Open-Plan Kitchen & Dining Space';

  const spaces: ProjectSpace[] = [
    {
      id: 'space-primary',
      name: spaceName,
      lengthM: {
        value: length,
        source: isConfirmedDims ? 'user_statement' : 'system_assumption',
        status: isConfirmedDims ? 'confirmed' : 'assumed',
      },
      widthM: {
        value: width,
        source: isConfirmedDims ? 'user_statement' : 'system_assumption',
        status: isConfirmedDims ? 'confirmed' : 'assumed',
      },
      heightM: {
        value: height,
        source: 'system_assumption',
        status: 'assumed',
      },
      areaM2: {
        value: Math.round(length * width * 10) / 10,
        source: 'derived_calculation',
        status: isConfirmedDims ? 'confirmed' : 'assumed',
      },
      desiredChanges: [
        'Open-plan layout reconfiguration',
        'High-specification fixtures and bespoke cabinetry/tiling',
        'Underfloor heating and architectural lighting circuits',
      ],
      fixtures: projectTypes.includes('kitchen-renovation')
        ? ['Central Kitchen Island', 'Induction Cooktop with Downdraft', 'Quartz Worktops', 'Undermount Sink']
        : ['Concealed Thermostatic Shower', 'Wall-Hung Vanity', 'Schlüter Tanking'],
      constraints: ['Existing load-bearing walls', 'Subfloor joist load capacity'],
      isPrimary: true,
    },
  ];

  // 4. Uploaded Assets
  const uploadedAssets: UploadedAsset[] = (input.images || []).map((img, idx) => ({
    id: `asset-${idx + 1}`,
    url: img.url,
    filename: img.filename || `Photo ${idx + 1}`,
    classifiedCategory: (img.category as any) || (idx === 0 ? 'existing_condition' : 'inspiration'),
    extractedDetails: {
      visibleFeatures: ['Rectangular room layout', 'Suspended timber flooring', 'Rear exterior wall opening'],
    },
  }));

  // 5. System Assumptions
  const assumptions: SystemAssumption[] = [];
  if (!isConfirmedDims) {
    assumptions.push({
      id: 'assump-dims',
      key: 'room_dimensions',
      label: 'Room Dimensions',
      assumedValue: `Approximately ${length}m × ${width}m (${Math.round(length * width)}m²)`,
      reasonForAssumption: 'No exact measurements supplied; standard residential room scale assumed for initial quantities and layout planning.',
      status: 'active',
    });
  }
  assumptions.push(
    {
      id: 'assump-ceiling',
      key: 'ceiling_height',
      label: 'Ceiling Height',
      assumedValue: '2.4 metres finished height',
      reasonForAssumption: 'Standard UK residential ceiling clearance assumed for wall plasterboard and paint quantities.',
      status: 'active',
    },
    {
      id: 'assump-property-era',
      key: 'property_era',
      label: 'Property Era & Construction',
      assumedValue: property.era.value === 'victorian' ? 'Victorian solid brick (1837–1901)' : 'Modern cavity wall',
      reasonForAssumption: 'Assumed based on London regional distribution; dictates Party Wall and subfloor joist requirements.',
      status: 'active',
    },
    {
      id: 'assump-services',
      key: 'services_location',
      label: 'Services & Drainage',
      assumedValue: 'Existing foul drainage stack located within 5m of proposed wet zones',
      reasonForAssumption: 'Assumed gravity fall can be achieved without requiring mechanical macerator pumps.',
      status: 'active',
    }
  );

  // 6. Missing Information Ranking
  const missingInformation: MissingInfoItem[] = [];
  if (!isConfirmedDims) {
    missingInformation.push({
      id: 'miss-dims',
      impact: 'HIGH',
      field: 'room_dimensions',
      question: 'What are the approximate length and width of your target space?',
      whyWeAsk: 'Exact measurements allow our deterministic quantity engine to calculate accurate flooring, plasterboard, paint, and worktop square meterage.',
      category: 'Dimensions',
      resolved: false,
    });
  }
  if (hasStructuralKnockthrough || projectTypes.includes('extension')) {
    missingInformation.push({
      id: 'miss-wall-type',
      impact: 'HIGH',
      field: 'structural_wall',
      question: 'Do you know if the wall being altered is load-bearing (solid brick vs timber stud)?',
      whyWeAsk: 'Load-bearing walls require structural steel RSJ beam sizing, concrete padstones, and Building Control engineering calculations.',
      category: 'Structure',
      options: ['Solid Brick (Load-Bearing)', 'Timber Stud Partition (Non-Load-Bearing)', 'Not Sure — Needs Site Survey'],
      resolved: false,
    });
  }
  missingInformation.push(
    {
      id: 'miss-island-function',
      impact: 'MEDIUM',
      field: 'island_features',
      question: 'Would you like your kitchen island to include the sink, induction hob, breakfast seating, or pure prep space?',
      whyWeAsk: 'Placing a sink or hob on an island requires channelling plumbing waste or 32A power into the subfloor before screeding.',
      category: 'Layout',
      options: ['Hob + Downdraft Extractor', 'Sink & Dishwasher', 'Breakfast Bar Seating Only', 'Pure Food Preparation Surface'],
      resolved: false,
    },
    {
      id: 'miss-living-continuity',
      impact: 'LOW',
      field: 'living_in_property',
      question: 'Are you planning to remain living in the property during the construction works?',
      whyWeAsk: 'Dictates site setup logistics, temporary dust partitions, and temporary kitchen/washing provision.',
      category: 'Logistics',
      options: ['Yes — Staying in Property', 'No — Vacating / Rented Nearby'],
      resolved: false,
    }
  );

  // 7. Visual Concept
  const visualConcept: VisualConceptState = {
    currentConceptImage: projectTypes.includes('bathroom-renovation')
      ? '/images/services/bathroom-renovations.png'
      : projectTypes.includes('loft-conversion')
      ? '/images/services/loft-conversions.png'
      : projectTypes.includes('garden-room')
      ? '/images/services/garden-rooms.png'
      : '/images/services/house-extensions.png',
    architecturalStyle: 'contemporary_glass',
    glazingType: 'slimline_aluminium_bifold',
    flooringType: 'herringbone_engineered_oak',
    worktopType: 'calacatta_quartz',
    visualPrompt: `Architectural concept visualization for ${brief}. High-end residential finish with natural light and level-threshold garden views.`,
    disclaimer: 'Concept visualisation — intended to explore layout, materials, and design direction. Structural feasibility, exact dimensions, and final specification require confirmation.',
    refinementsHistory: [],
  };

  // 8. Scope of Works
  const scopeOfWorks = buildScopeOfWorks(projectTypes, hasStructuralKnockthrough);

  // 9. Calculated Quantities (Deterministic)
  const calculatedQuantities = calculateProjectQuantities(spaces, projectTypes, hasStructuralKnockthrough);

  // 10. Feasibility & Constraints
  const feasibility = evaluateProjectFeasibility(projectTypes, hasStructuralKnockthrough, false, property, brief);

  // 11. Construction Phases
  const phases = generateConstructionPhases(projectTypes, hasStructuralKnockthrough);

  // 12. Things to Consider (Balanced 4, 6, or 8)
  const thingsToConsider = generateThingsToConsider(projectTypes, property, brief, hasStructuralKnockthrough);

  // 13. Specification Tree
  const specificationTree = buildSpecificationTree(projectTypes, spaces, 'enhanced');

  // 14. Complexity
  const complexity = evaluateComplexity(projectTypes, hasStructuralKnockthrough, property.type.value === 'terraced');

  // 15. Budget Alignment
  const budgetAlignment = evaluateBudgetAlignment(projectTypes, length * width, 'enhanced');

  // 16. Completeness Score
  const completenessScore = isConfirmedDims ? 78 : 55;

  // 17. Initial Version
  const versions: ProjectVersion[] = [
    {
      versionNumber: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: 'Initial AI brief interpretation & scope baseline',
      briefSnapshot: brief,
      dimensionsSnapshot: { length, width, height },
      finishesSnapshot: { tier: 'enhanced' },
    },
  ];

  // Interpreted Intent Summary
  let interpretedIntent = `Create a high-specification ${projectTypes.map((t) => t.replace(/-/g, ' ')).join(' & ')} `;
  if (hasStructuralKnockthrough) interpretedIntent += 'with an open-plan structural knockthrough, ';
  interpretedIntent += `optimising natural light, functional layout circulation, and seamless interior finishes.`;

  return {
    projectId: `prj-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    originalBrief: brief,
    interpretedIntent,
    projectTypes,
    property,
    spaces,
    uploadedAssets,
    visualConcept,
    finishSelections: {
      Cabinetry: 'enhanced',
      Worktops: 'enhanced',
      Flooring: 'enhanced',
      Lighting: 'enhanced',
      Glazing: 'enhanced',
    },
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
    versions,
    chatHistory: [
      {
        role: 'assistant',
        message: `Hello! I have interpreted your project brief and generated a preliminary architectural concept, deterministic quantities, and trade-by-trade scope of works. You can refine any dimension, ask questions, or customize finishes below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  };
}

function buildScopeOfWorks(projectTypes: ProjectCategoryType[], hasStructuralKnockthrough: boolean) {
  const items: any[] = [];
  let id = 1;

  // 1. Preparation
  items.push({
    id: `scope-${id++}`,
    trade: 'Site Setup & Protection',
    category: 'Preparation',
    title: 'Site Protection & Service Isolation',
    description: 'Erect sealed corex floor protection and zippered dust-barrier partitions isolating live construction zones from living spaces.',
    included: true,
    isStructural: false,
    finishTier: 'standard',
  });

  // 2. Structural
  if (projectTypes.includes('extension') || hasStructuralKnockthrough) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Structural Engineering',
      category: 'Structure',
      title: 'Structural Steel Goalpost & Padstone Installation',
      description: 'Temporary Acrow propping, knocking through load-bearing brickwork, bedded concrete padstones, and installation of universal beam RSJs.',
      included: true,
      isStructural: true,
      finishTier: 'enhanced',
      requiresInspection: true,
    });
  }

  // 3. Groundworks
  if (projectTypes.includes('extension')) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Groundworks',
      category: 'Substructure',
      title: 'Excavation & C25/30 Concrete Trench Foundations',
      description: '1.2m–1.8m perimeter trench excavation, Thames Water build-over protection, concrete foundation pour, and DPM insulated floor slab.',
      included: true,
      isStructural: true,
      finishTier: 'standard',
      requiresInspection: true,
    });
  }

  // 4. Glazing
  if (projectTypes.includes('extension') || projectTypes.includes('kitchen-renovation')) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Glazing Installation',
      category: 'Envelope',
      title: 'Thermally Broken Aluminium Sliding / Bifold Doors',
      description: 'Low-E argon-filled solar control glass aperture with recessed drainage track for seamless indoor-outdoor patio threshold.',
      included: true,
      isStructural: false,
      finishTier: 'enhanced',
    });
  }

  // 5. MEP
  items.push({
    id: `scope-${id++}`,
    trade: 'Electrical (NICEIC Part P)',
    category: 'M&E',
    title: 'First-Fix Rewiring & High-Load Appliance Circuits',
    description: 'Dedicated 32A induction hob circuit, island floor channels, LED downlight rings, and consumer unit surge protection.',
    included: true,
    isStructural: false,
    finishTier: 'enhanced',
    requiresInspection: true,
  });

  items.push({
    id: `scope-${id++}`,
    trade: 'Plumbing & Heating',
    category: 'M&E',
    title: 'Manifold Underfloor Heating & Plumbing Feeds',
    description: 'Wet underfloor heating pipe loops with programmable multi-zone thermostats and hot/cold water feeds.',
    included: true,
    isStructural: false,
    finishTier: 'enhanced',
  });

  // 6. Joinery / Kitchen / Bathroom
  if (projectTypes.includes('kitchen-renovation') || projectTypes.includes('extension')) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Kitchen Fitting',
      category: 'Fit-Out',
      title: 'Cabinetry Fitting, Island Assembly & Stone Worktops',
      description: 'Precision laser leveling of cabinetry carcasses, soft-close drawers, appliance integration, and 20mm/30mm quartz stone installation.',
      included: true,
      isStructural: false,
      finishTier: 'enhanced',
    });
  }

  if (projectTypes.includes('bathroom-renovation')) {
    items.push({
      id: `scope-${id++}`,
      trade: 'Tiling & Waterproofing',
      category: 'Sanitaryware',
      title: 'Full Schlüter Tanking & Italian Porcelain Tiling',
      description: '100% waterproof membrane application, 45-degree mitred tile corners, Geberit concealed cistern, and rainfall shower brassware.',
      included: true,
      isStructural: false,
      finishTier: 'enhanced',
    });
  }

  // 7. Finishes
  items.push({
    id: `scope-${id++}`,
    trade: 'Decorating',
    category: 'Finishes',
    title: 'Flawless Plaster Skimming & Designer Emulsion Painting',
    description: 'Thistle Multi-Finish skim coat, mist coat primer, and 2 full coats of durable washable emulsion paint.',
    included: true,
    isStructural: false,
    finishTier: 'enhanced',
  });

  return items;
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

  score = Math.min(10, Math.max(2, score));
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

function evaluateBudgetAlignment(projectTypes: ProjectCategoryType[], areaM2: number, tier: FinishTier): BudgetAlignment {
  const safeArea = areaM2 > 0 ? areaM2 : 20;
  let baseMin = 1800;
  let baseMax = 2800;

  if (projectTypes.includes('extension')) {
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
    indicativeCostRange: {
      min: minCost,
      max: maxCost,
      formatted: `£${minCost.toLocaleString()} – £${maxCost.toLocaleString()}`,
    },
    benchmarkPerM2: `£${Math.round(baseMin * multiplier).toLocaleString()} – £${Math.round(baseMax * multiplier).toLocaleString()} / m²`,
    elementsMostAffectingBudget: [
      'Structural steel beam spans and concrete foundation depths',
      'Architectural glazing aperture width and slimline sliding mechanisms',
      'Bespoke kitchen cabinetry joinery and 30mm quartz stone fabrication',
    ],
    whereToSpendMore: [
      'Quality structural engineering and subfloor joist sistering',
      'High-performance Low-E solar control glass to prevent summer overheating',
      'Concealed thermostatic brassware with solid brass valve cartridges',
    ],
    whereToSave: [
      'Standardizing kitchen carcass modules rather than 100% custom dimensions',
      'Keeping primary foul drainage stacks close to their existing drops',
      'Selecting high-grade 20mm quartz over imported exotic marble',
    ],
    unknownCostRisks: [
      'Underground drainage obstructions or Thames Water build-over requirements',
      'Subfloor moisture or joist rot discovered during strip-out',
      'Consumer unit upgrade if existing domestic fuse board lacks spare capacity',
    ],
  };
}

/**
 * Applies a conversational natural language change to an existing ProjectState
 * Recalculating downstream quantities, dimensions, scope, and budget without wiping user state.
 */
export function applyProjectChange(currentState: ProjectState, changePrompt: string): ProjectState {
  const lower = changePrompt.toLowerCase();
  const next = JSON.parse(JSON.stringify(currentState)) as ProjectState;
  const primarySpace = next.spaces[0];

  let changeDescription = changePrompt;

  // 1. Dimension Modifications (e.g. "make it 1m wider" or "make it 4m deep")
  const widerMatch = lower.match(/(?:make (?:it|the room|the extension) )?(\d+(?:\.\d+)?)\s*m\s*wider/i);
  if (widerMatch && primarySpace) {
    const addW = parseFloat(widerMatch[1]);
    primarySpace.widthM.value = Math.round((primarySpace.widthM.value + addW) * 10) / 10;
    primarySpace.widthM.status = 'confirmed';
    changeDescription = `Widened room by +${addW}m to ${primarySpace.widthM.value}m`;
  }

  const deeperMatch = lower.match(/(?:make (?:it|the extension) )?(\d+(?:\.\d+)?)\s*m\s*(?:deep|deeper|longer|long)/i);
  if (deeperMatch && primarySpace) {
    const newL = parseFloat(deeperMatch[1]);
    primarySpace.lengthM.value = newL;
    primarySpace.lengthM.status = 'confirmed';
    changeDescription = `Updated room length to ${newL}m`;
  }

  // Recalculate area
  if (primarySpace) {
    primarySpace.areaM2.value = Math.round(primarySpace.lengthM.value * primarySpace.widthM.value * 10) / 10;
    primarySpace.areaM2.status = 'confirmed';
  }

  // 2. Finish Tier Modifications (e.g. "show bespoke option", "change to standard", "use herringbone")
  if (lower.includes('bespoke') || lower.includes('luxury') || lower.includes('premium')) {
    next.finishSelections.Cabinetry = 'bespoke';
    next.finishSelections.Worktops = 'bespoke';
    next.finishSelections.Flooring = 'bespoke';
    next.specificationTree = buildSpecificationTree(next.projectTypes, next.spaces, 'bespoke');
    changeDescription = 'Upgraded specification to Bespoke Luxury tier';
  } else if (lower.includes('standard') || lower.includes('budget') || lower.includes('cheaper')) {
    next.finishSelections.Cabinetry = 'standard';
    next.finishSelections.Worktops = 'standard';
    next.finishSelections.Flooring = 'standard';
    next.specificationTree = buildSpecificationTree(next.projectTypes, next.spaces, 'standard');
    changeDescription = 'Adjusted specification to Standard Value tier';
  }

  if (lower.includes('herringbone')) {
    const floorNode = next.specificationTree.find((n) => n.id === 'spec-flooring');
    if (floorNode) {
      floorNode.selectedOption = 'Prime European Engineered Oak Herringbone Parquet';
      floorNode.finishTier = 'enhanced';
      next.visualConcept.flooringType = 'herringbone_engineered_oak';
    }
  }

  if (lower.includes('microcement')) {
    const floorNode = next.specificationTree.find((n) => n.id === 'spec-flooring');
    if (floorNode) {
      floorNode.selectedOption = 'Seamless Architectural Microcement';
      floorNode.finishTier = 'bespoke';
      next.visualConcept.flooringType = 'microcement_seamless';
    }
  }

  // 3. Recalculate Quantities, Feasibility, and Budget
  next.calculatedQuantities = calculateProjectQuantities(next.spaces, next.projectTypes, true);
  next.budgetAlignment = evaluateBudgetAlignment(
    next.projectTypes,
    primarySpace ? primarySpace.areaM2.value : 20,
    next.finishSelections.Cabinetry || 'enhanced'
  );

  // 4. Update Version History
  const nextVersionNum = next.versions.length + 1;
  next.versions.push({
    versionNumber: nextVersionNum,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: changeDescription,
    briefSnapshot: changePrompt,
    dimensionsSnapshot: {
      length: primarySpace?.lengthM.value,
      width: primarySpace?.widthM.value,
      area: primarySpace?.areaM2.value,
    },
    finishesSnapshot: { ...next.finishSelections },
  });

  next.updatedAt = new Date().toISOString();
  return next;
}
