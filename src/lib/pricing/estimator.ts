/**
 * Deterministic Project Estimation Engine
 * Conforms to GEMINI.md Rule 7 & BUILD_SPEC.md Sections 15-18
 */

import {
  ProjectType,
  ProjectPlanInput,
  EstimateResult,
  CostCategoryItem,
  ProjectTimelineStage,
} from './types';
import {
  BASE_PROJECT_BENCHMARKS,
  FINISH_LEVEL_MULTIPLIERS,
  ADDON_FEATURE_COSTS,
} from './benchmarks';

export function calculateProjectEstimate(input: ProjectPlanInput): EstimateResult {
  const benchmark = BASE_PROJECT_BENCHMARKS[input.projectType] || BASE_PROJECT_BENCHMARKS.other;
  const finishInfo = FINISH_LEVEL_MULTIPLIERS[input.finishLevel] || FINISH_LEVEL_MULTIPLIERS.standard;

  // 1. Quantity & Area Calculation
  let calculatedArea = benchmark.defaultAreaM2;

  if (!input.isUnknownDimensions) {
    if (input.lengthMeters && input.widthMeters) {
      calculatedArea = input.lengthMeters * input.widthMeters;
      if (input.storeys && input.storeys > 1) {
        calculatedArea *= input.storeys;
      }
    } else if (input.approxAreaM2 && input.approxAreaM2 > 0) {
      calculatedArea = input.approxAreaM2;
    }
  }

  // 2. Base Core Cost Computation
  let baseCostLow = 0;
  let baseCostHigh = 0;

  if (benchmark.unit === 'per_m2') {
    baseCostLow = calculatedArea * benchmark.baseCostLow;
    baseCostHigh = calculatedArea * benchmark.baseCostHigh;

    // Double storey modifier: second storey structural cost is ~65% of first storey
    if (input.storeys && input.storeys > 1) {
      baseCostLow *= 0.85; // blended average rate per m2 across multiple floors
      baseCostHigh *= 0.85;
    }
  } else {
    // Fixed scope baseline
    baseCostLow = benchmark.baseCostLow;
    baseCostHigh = benchmark.baseCostHigh;

    // Room count / property size scale factor for renovations
    if (input.roomCount && input.roomCount > 3) {
      const roomMultiplier = 1 + (input.roomCount - 3) * 0.18;
      baseCostLow *= roomMultiplier;
      baseCostHigh *= roomMultiplier;
    }
  }

  // 3. Property Type Modifier (e.g., terraced party walls / access constraints)
  let propertyTypeModifier = 1.0;
  if (input.propertyType === 'terraced') {
    propertyTypeModifier = 1.06; // Party wall scaffolding and rear access logistics
  } else if (input.propertyType === 'flat') {
    propertyTypeModifier = 1.12; // High-rise lifting, parking bays, working hour restrictions
  } else if (input.propertyType === 'detached') {
    propertyTypeModifier = 0.98; // Full 360 site access
  }

  baseCostLow *= propertyTypeModifier;
  baseCostHigh *= propertyTypeModifier;

  // 4. Apply Finish Level Multiplier
  let subtotalLow = baseCostLow * finishInfo.multiplier;
  let subtotalHigh = baseCostHigh * finishInfo.multiplier;

  // 5. Add Selected Add-on Features
  let extraWeeks = 0;
  let addonsCostLow = 0;
  let addonsCostHigh = 0;

  if (Array.isArray(input.requirements)) {
    for (const reqKey of input.requirements) {
      const addon = ADDON_FEATURE_COSTS[reqKey];
      if (addon) {
        addonsCostLow += addon.costLow;
        addonsCostHigh += addon.costHigh;
        extraWeeks += addon.extraWeeks;
      }
    }
  }

  subtotalLow += addonsCostLow;
  subtotalHigh += addonsCostHigh;

  // 6. 10% Standard Contingency Allowance (Best Practice in Construction)
  const contingencyLow = Math.round(subtotalLow * 0.10);
  const contingencyHigh = Math.round(subtotalHigh * 0.10);

  const totalLow = Math.round((subtotalLow + contingencyLow) / 500) * 500;
  const totalHigh = Math.round((subtotalHigh + contingencyHigh) / 500) * 500;
  const averageCost = Math.round((totalLow + totalHigh) / 2);

  // 7. Duration in Weeks
  let durationMin = benchmark.typicalDurationWeeksMin + Math.floor(extraWeeks);
  let durationMax = benchmark.typicalDurationWeeksMax + Math.ceil(extraWeeks);

  if (input.finishLevel === 'luxury') {
    durationMin += 2;
    durationMax += 4;
  }

  // 8. Complexity Rating
  let complexity: EstimateResult['complexity'] = 'Standard';
  if (totalHigh > 180000 || input.storeys === 2 || input.requirements?.includes('structural_opening')) {
    complexity = 'Substantial';
  } else if (totalHigh > 90000 || input.requirements?.length >= 4) {
    complexity = 'Complex';
  } else if (totalHigh > 45000) {
    complexity = 'Moderate';
  }

  // 9. Cost Category Itemized Breakdown (Percentage distribution based on standard RICS trade breakdowns)
  const breakdown: CostCategoryItem[] = [
    {
      category: 'Design, Engineering & Permissions',
      description: 'Architectural coordination, structural calculations, Thames Water build-over and Building Regs inspection fees.',
      lowCost: Math.round(totalLow * 0.08),
      highCost: Math.round(totalHigh * 0.08),
      percentage: 8,
    },
    {
      category: 'Groundworks & Substructure',
      description: 'Excavation, concrete trench/piled foundations, DPC, drainage diversion and sub-floor slab installation.',
      lowCost: Math.round(totalLow * 0.18),
      highCost: Math.round(totalHigh * 0.18),
      percentage: 18,
    },
    {
      category: 'Superstructure, Roof & Envelope',
      description: 'Brick/block external masonry, steelwork (RSJs), insulated flat/pitched roof and weatherproofing.',
      lowCost: Math.round(totalLow * 0.26),
      highCost: Math.round(totalHigh * 0.26),
      percentage: 26,
    },
    {
      category: 'Architectural Glazing, Doors & Windows',
      description: 'High-performance thermally broken aluminum bifolds, slimline sliders, rooflights and entrance doors.',
      lowCost: Math.round(totalLow * 0.14),
      highCost: Math.round(totalHigh * 0.14),
      percentage: 14,
    },
    {
      category: 'M&E First Fix (Plumbing & Electrics)',
      description: 'Rewiring, LED circuit runs, consumer unit upgrade, boiler/megaflo connections, heating and waste pipework.',
      lowCost: Math.round(totalLow * 0.12),
      highCost: Math.round(totalHigh * 0.12),
      percentage: 12,
    },
    {
      category: 'Drylining, Plastering & Second Fix Joinery',
      description: 'Insulation boards, skim plastering, internal doors, skirting, architraves and custom flooring.',
      lowCost: Math.round(totalLow * 0.12),
      highCost: Math.round(totalHigh * 0.12),
      percentage: 12,
    },
    {
      category: 'Recommended Project Contingency (10%)',
      description: 'Recommended financial buffer reserved for unforeseen underground obstacles or homeowner specification upgrades.',
      lowCost: contingencyLow,
      highCost: contingencyHigh,
      percentage: 10,
    },
  ];

  // 10. Phased 8-Stage Project Timeline
  const timelineStages: ProjectTimelineStage[] = [
    {
      stageNumber: 1,
      name: 'Architectural Consultation & Survey',
      durationWeeks: '1–2 weeks',
      description: 'Senior surveyor site visit, laser measure, structural assessment, and fixed-price scope finalization.',
      deliverables: ['Measured 3D Survey', 'Detailed Schedule of Works', 'Fixed Price Contract'],
    },
    {
      stageNumber: 2,
      name: 'Statutory Permissions & Party Wall',
      durationWeeks: '2–6 weeks',
      description: 'Council Building Notice / Planning submissions, structural calculations, and Thames Water agreements.',
      deliverables: ['Building Control Notice', 'Structural Calcs Sign-off', 'Party Wall Approvals'],
    },
    {
      stageNumber: 3,
      name: 'Site Enabling & Groundworks',
      durationWeeks: `${Math.round(durationMin * 0.2)} weeks`,
      description: 'Site hoarding, demolition, foundation trenching, steel rebar cage, and building control trench inspection.',
      deliverables: ['Site Welfare Set-up', 'Inspected Foundations', 'Damp Proof Membrane'],
    },
    {
      stageNumber: 4,
      name: 'Superstructure & Steelwork',
      durationWeeks: `${Math.round(durationMin * 0.25)} weeks`,
      description: 'Cavity brickwork/blockwork, structural steel beams installation, and roof carcass timber framing.',
      deliverables: ['Structural Steel Sign-off', 'External Shell Erection', 'Roof Carcass'],
    },
    {
      stageNumber: 5,
      name: 'Weatherproofing & Glazing',
      durationWeeks: `${Math.round(durationMin * 0.15)} weeks`,
      description: 'Roof covering (EPDM / slate), rooflight installation, and precision fitting of aluminum bifold/sliding doors.',
      deliverables: ['Watertight Building Envelope', 'Glazing Certificate', 'External Flashing'],
    },
    {
      stageNumber: 6,
      name: 'M&E First Fix & Insulation',
      durationWeeks: `${Math.round(durationMin * 0.15)} weeks`,
      description: 'Full electrical cabling, underfloor heating manifolds, plumbing pipework, and acoustic insulation.',
      deliverables: ['Pre-plaster Inspection', 'Pipe Pressure Test', 'Electrical Cable Runs'],
    },
    {
      stageNumber: 7,
      name: 'Plastering, Kitchen & Second Fix',
      durationWeeks: `${Math.round(durationMin * 0.2)} weeks`,
      description: 'Full surface plaster skim, kitchen cabinetry, worktops, tiling, switches, sockets, and sanitaryware.',
      deliverables: ['Skimmed Walls', 'Kitchen/Bathroom Fit', 'Flooring Installation'],
    },
    {
      stageNumber: 8,
      name: 'Commissioning, Snagging & Handover',
      durationWeeks: '1–2 weeks',
      description: 'Independent inspection, thorough snagging list rectification, NICEIC / Gas Safe certificates, and 10-year warranty.',
      deliverables: ['Part P / NICEIC Certificate', 'Building Control Final Completion', '10-Year Insurance Warranty'],
    },
  ];

  // 11. Likely Trades & Key Drivers
  const likelyTrades = [
    'Project Manager & Site Foreman',
    'Groundwork & Drainage Specialists',
    'Bricklayers & Stonemasons',
    'Structural Steel Erectors',
    'Roofers & Leadwork Specialists',
    'NICEIC Certified Electricians',
    'Gas Safe Plumbers & Heating Engineers',
    'Specialist Glazing Installers',
    'Master Plasterers & Joiners',
    'Tilers & Precision Finishers',
  ];

  const keyCostDrivers = [
    `Ground conditions and foundation depth requirements at ${input.postcode.toUpperCase() || 'site'}`,
    `Specification finish level (${finishInfo.label}) and custom architectural glazing choices`,
    'Extent of structural knockthroughs and steel beam spans (RSJs)',
    'Drainage run alterations and Thames Water build-over approvals',
    'Underfloor heating and high-efficiency mechanical ventilation integration',
  ];

  const projectTitleMap: Record<ProjectType, string> = {
    extension: 'Residential House Extension',
    'full-renovation': 'Full Period House Renovation',
    kitchen: 'Bespoke Architectural Kitchen Renovation',
    bathroom: 'Luxury Bathroom Renovation',
    'loft-conversion': 'Dormer Loft Master Suite Conversion',
    'garage-conversion': 'Habitable Room Garage Conversion',
    'garden-room': 'Architectural Garden Studio',
    driveway: 'Resin-Bound / Paved Driveway',
    landscaping: 'Contemporary Landscaping & Patio',
    other: 'Residential Construction Project',
  };

  return {
    projectTitle: projectTitleMap[input.projectType] || 'Residential Project',
    indicativeCostLow: totalLow,
    indicativeCostHigh: totalHigh,
    averageCost,
    estimatedDurationWeeksMin: durationMin,
    estimatedDurationWeeksMax: durationMax,
    complexity,
    breakdown,
    contingencyAllowance: contingencyHigh,
    timelineStages,
    likelyTrades,
    keyCostDrivers,
    disclaimer:
      'This indicative cost range is calculated using benchmark trade rates across London & the South East for initial planning purposes. A formal fixed-price quotation with guaranteed milestone schedules is provided following our comprehensive on-site architectural survey.',
  };
}
