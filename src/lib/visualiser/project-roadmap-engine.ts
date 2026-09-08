/**
 * AI Project Roadmap & Scope Map Engine
 * Generates project-specific roadmap stages, buying packages, cost breakdowns,
 * and contractor verification checks following BUILD_SPEC and AI Project Guide rules.
 */

import {
  ProjectState,
  ProjectRoadmapModel,
  RoadmapStageCard,
  ProjectBuyingPackage,
  BudgetCostDriverCard,
  ConfirmCheckItem,
  CustomerDecisionItem,
  ProjectAtAGlance,
} from '@/types/visualiser-scope';
import { caseStudiesData } from '@/config/case-studies';

export function generateProjectRoadmap(
  state: ProjectState,
  selectedChoices: Record<string, string> = {}
): ProjectRoadmapModel {
  const briefLower = (state.originalBrief || '').toLowerCase();
  const types = state.projectTypes || [];

  // Determine Project Hierarchy
  const isGarageConversion =
    briefLower.includes('garage conversion') ||
    (briefLower.includes('garage') &&
      (briefLower.includes('convert') ||
        briefLower.includes('room') ||
        briefLower.includes('office') ||
        briefLower.includes('habitable') ||
        briefLower.includes('living') ||
        briefLower.includes('gym') ||
        briefLower.includes('bedroom')));

  const isDoorOnly =
    !isGarageConversion &&
    (briefLower.includes('door') || briefLower.includes('doorway') || briefLower.includes('opening')) &&
    !briefLower.includes('extension') &&
    !briefLower.includes('bathroom') &&
    !briefLower.includes('kitchen');

  const isBathroom = types.includes('bathroom-renovation') || briefLower.includes('bath') || briefLower.includes('shower');
  const isExtension = types.includes('extension') || briefLower.includes('extension') || briefLower.includes('extend');
  const isKitchen =
    !isExtension &&
    (types.includes('kitchen-renovation') || briefLower.includes('kitchen') || briefLower.includes('cabinets'));

  if (isGarageConversion) {
    return buildGarageConversionRoadmap(state, selectedChoices);
  }

  if (isDoorOnly) {
    return buildDoorOnlyRoadmap(state, selectedChoices);
  }

  if (isBathroom) {
    return buildBathroomRoadmap(state, selectedChoices);
  }

  if (isExtension) {
    return buildExtensionRoadmap(state, selectedChoices);
  }

  if (isKitchen) {
    return buildKitchenRoadmap(state, selectedChoices);
  }

  // Default / Whole House
  return buildGeneralRenovationRoadmap(state, selectedChoices);
}

// =============================================================================
// 1. GARAGE CONVERSION ROADMAP BUILDER
// =============================================================================

function buildGarageConversionRoadmap(
  state: ProjectState,
  choices: Record<string, string>
): ProjectRoadmapModel {
  const briefLower = (state.originalBrief || '').toLowerCase();
  const roomUse = briefLower.includes('gym')
    ? 'Home Gym'
    : briefLower.includes('bedroom')
    ? 'Ground Floor Bedroom'
    : briefLower.includes('playroom')
    ? 'Children’s Playroom'
    : briefLower.includes('living')
    ? 'Snug / Living Room'
    : 'Home Office';

  // Selected Choices or Defaults
  const frontageChoice = choices['frontage'] || 'wall_window';
  const flooringChoice = choices['flooring'] || 'engineered_timber';
  const heatingChoice = choices['heating'] || 'wet_central';

  // Dynamic Delta Calculations
  const frontageDelta =
    frontageChoice === 'large_glazing' ? 2400 : frontageChoice === 'keep_appearance' ? -1200 : 0;
  const flooringDelta =
    flooringChoice === 'premium_timber' ? 1400 : flooringChoice === 'laminate' ? -600 : 0;
  const heatingDelta =
    heatingChoice === 'underfloor' ? 1200 : heatingChoice === 'electric_panel' ? -700 : 0;

  const totalDelta = frontageDelta + flooringDelta + heatingDelta;

  const baseMin = 18000 + totalDelta;
  const baseMax = 28000 + totalDelta;

  const stages: RoadmapStageCard[] = [
    {
      id: 'gc-stage-1',
      stepNumber: 1,
      name: 'Existing Garage Survey & Preparation',
      badge: 'Current Space',
      whatIsThis: 'Detailed inspection of the existing concrete slab, brickwork damp proof course, ceiling fire line, and internal hallway dividing wall.',
      whyNeeded: 'Integral garages often lack floor insulation, damp proof membranes, and continuous cavity thermal barriers required by Building Regulations Part L.',
      possibleWorks: [
        'Strip out redundant garage door tracks and high-level shelving',
        'Verify existing floor slab level relative to main house hallway',
        'Core drill check for subfloor damp-proof membrane (DPM)',
        'Check internal dividing wall for structural load-bearing capacity',
      ],
      choices: [],
      costMin: 1200,
      costMax: 1800,
      costFormatted: '£1,200 – £1,800',
      visualAsset: {
        type: 'diagram',
        diagramType: 'existing_garage',
        iconName: 'Warehouse',
      },
      needsCheck: true,
      checkDescription: 'Concrete slab damp proofing and relative floor level to the hallway.',
      contractorSolution: 'ST Contractors inspects the slab core during the pre-construction survey to determine whether a thin liquid DPM or floating insulated subfloor is required.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gc-stage-2',
      stepNumber: 2,
      name: 'Create a Proper Habitable Room Envelope',
      badge: 'Main Building Work',
      whatIsThis: 'High-performance insulation lining to all external walls, ceiling vapour barrier, floating floor build-up, and acoustic plasterboarding.',
      whyNeeded: 'Converts an unconditioned utility space into a warm, airtight, year-round habitable room that stays warm in winter and cool in summer.',
      possibleWorks: [
        'Treated timber stud wall lining with 70mm PIR rigid insulation (U-value ≤ 0.18 W/m²K)',
        'Rigid insulation build-up over concrete floor with 22mm moisture-resistant chipboard deck',
        'Double-layer 15mm fireline plasterboard to ceiling separating room from first floor',
        'Full skim plaster finish throughout walls and ceiling',
      ],
      choices: [],
      costMin: 5000,
      costMax: 7200,
      costFormatted: '£5,000 – £7,200',
      visualAsset: {
        type: 'diagram',
        diagramType: 'insulated_envelope',
        iconName: 'ShieldCheck',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gc-stage-3',
      stepNumber: 3,
      name: 'Change the Garage Frontage',
      badge: 'External Envelope',
      whatIsThis: 'Removal of the steel up-and-over garage door and construction of a thermally sealed, weather-tight external facade.',
      whyNeeded: 'The garage door opening represents the largest thermal loss and must be properly closed with matched brickwork and high-security double glazing.',
      possibleWorks: [
        'Remove existing steel up-and-over garage door and frame',
        'Build cavity masonry infill with damp proof course to match house brickwork',
        'Install reinforced concrete or catnic lintel if window aperture requires',
        'Fit insulated UPVC or aluminium double-glazed casement window with trickle ventilation',
      ],
      choices: [
        {
          id: 'wall_window',
          label: 'Brick Infill + Double Glazed Window',
          description: 'Matching external brickwork below with an energy-efficient casement window. Most popular and cost-effective.',
          costIndicator: '££',
          costDeltaMin: 0,
          costDeltaMax: 0,
          isDefault: true,
          isSelected: frontageChoice === 'wall_window',
        },
        {
          id: 'large_glazing',
          label: 'Floor-to-Ceiling Architectural Glazing',
          description: 'Full-height powder-coated aluminium glazing or French doors maximizing natural daylight.',
          costIndicator: '£££',
          costDeltaMin: 2000,
          costDeltaMax: 2800,
          isSelected: frontageChoice === 'large_glazing',
        },
        {
          id: 'keep_appearance',
          label: 'Retain Garage Door Look (False Timber Front)',
          description: 'Insulated timber or composite panel retaining original exterior street facade where covenants apply.',
          costIndicator: '£',
          costDeltaMin: -1500,
          costDeltaMax: -900,
          isSelected: frontageChoice === 'keep_appearance',
        },
      ],
      selectedChoiceId: frontageChoice,
      costMin: 3200 + frontageDelta,
      costMax: 4800 + frontageDelta,
      costFormatted: `£${(3200 + frontageDelta).toLocaleString()} – £${(4800 + frontageDelta).toLocaleString()}`,
      visualAsset: {
        type: 'diagram',
        diagramType: 'frontage_options',
        iconName: 'Maximize2',
      },
      needsCheck: true,
      checkDescription: 'Local planning restrictions or conservation covenants requiring street-facing garage appearance retention.',
      contractorSolution: 'We check your local borough permitted development rights and matching brick stock availability before procurement.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gc-stage-4',
      stepNumber: 4,
      name: 'Create Internal Hallway Access',
      badge: 'Access & Flow',
      whatIsThis: 'Forming a new internal doorway directly connecting your existing hallway or corridor into the new room.',
      whyNeeded: 'Ensures natural walk-through access from within the home rather than having to step outside or through a utility space.',
      possibleWorks: [
        'Propping and forming neat structural opening in corridor dividing wall',
        'Installation of pre-stressed concrete structural lintel with 150mm bearing pads',
        'Supply and fit FD30S 30-minute fire-rated timber doorset with intumescent smoke seals',
        'Flush threshold transition matching hallway flooring level',
      ],
      choices: [],
      costMin: 2200,
      costMax: 3400,
      costFormatted: '£2,200 – £3,400',
      visualAsset: {
        type: 'diagram',
        diagramType: 'internal_doorway',
        iconName: 'DoorClosed',
      },
      needsCheck: true,
      checkDescription: 'Wall structural load and fire separation between original garage zone and escape hallway.',
      contractorSolution: 'We install a certified FD30S fire-rated door with cold smoke seals and self-closer to satisfy Building Regulations Approved Document B.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gc-stage-5',
      stepNumber: 5,
      name: 'Heating, Electrical & Data Infrastructure',
      badge: 'Building Services',
      whatIsThis: 'Complete electrical first and second fix, smart LED lighting, heating integration, and high-speed hardwired internet.',
      whyNeeded: 'Guarantees reliable winter heating comfort, ample power sockets for workstations or gym equipment, and strong data connection.',
      possibleWorks: [
        'Extended central heating circuit with high-output designer radiator or electric panel',
        '8 double power sockets strategically located around room perimeter',
        'Recessed fire-rated dimmable warm-white LED downlights',
        'Cat6 ethernet data port run back to main home router for lag-free connectivity',
      ],
      choices: [
        {
          id: 'wet_central',
          label: 'Extend Wet Central Heating',
          description: 'Plumb new designer steel radiator from main combi / system boiler.',
          costIndicator: '££',
          costDeltaMin: 0,
          costDeltaMax: 0,
          isDefault: true,
          isSelected: heatingChoice === 'wet_central',
        },
        {
          id: 'electric_panel',
          label: 'Smart Electric Ceramic Radiator',
          description: 'Independent programmable wall-mounted thermal electric radiator with WiFi thermostat.',
          costIndicator: '£',
          costDeltaMin: -800,
          costDeltaMax: -600,
          isSelected: heatingChoice === 'electric_panel',
        },
        {
          id: 'underfloor',
          label: 'Electric Underfloor Heating Mat',
          description: 'Hidden electric heat mat beneath flooring with digital touchscreen thermostat.',
          costIndicator: '£££',
          costDeltaMin: 1000,
          costDeltaMax: 1500,
          isSelected: heatingChoice === 'underfloor',
        },
      ],
      selectedChoiceId: heatingChoice,
      costMin: 2400 + heatingDelta,
      costMax: 3600 + heatingDelta,
      costFormatted: `£${(2400 + heatingDelta).toLocaleString()} – £${(3600 + heatingDelta).toLocaleString()}`,
      visualAsset: {
        type: 'diagram',
        diagramType: 'heating_electrical',
        iconName: 'Zap',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gc-stage-6',
      stepNumber: 6,
      name: 'Floor Finishes & Interior Joinery',
      badge: 'Finishes',
      whatIsThis: 'Quality flooring installation, primed MDF skirting boards, architraves, and professional 3-coat paint decoration.',
      whyNeeded: 'Transforms raw construction plaster into a polished, comfortable, ready-to-use room that matches the rest of your home.',
      possibleWorks: [
        'Subfloor acoustic underlay and durable flooring finish',
        '120mm Torus or square-edge primed MDF skirting and door architraves',
        'Mist coat and 2 coats durable matt emulsion (Dulux Diamond Matt or Little Greene)',
        'Satinwood finish to all timber joinery and door leaves',
      ],
      choices: [
        {
          id: 'engineered_timber',
          label: 'Engineered European Oak',
          description: 'Durable 14mm brushed and oiled engineered oak plank with bevelled edges.',
          costIndicator: '££',
          costDeltaMin: 0,
          costDeltaMax: 0,
          isDefault: true,
          isSelected: flooringChoice === 'engineered_timber',
        },
        {
          id: 'laminate',
          label: 'AC4 Commercial Grade Laminate',
          description: 'Hard-wearing, scratch-resistant oak-effect laminate flooring. Great value for high-traffic rooms.',
          costIndicator: '£',
          costDeltaMin: -700,
          costDeltaMax: -500,
          isSelected: flooringChoice === 'laminate',
        },
        {
          id: 'premium_timber',
          label: 'Herringbone Parquet or Seamless Microcement',
          description: 'Architectural prime herringbone oak or seamless polished microcement floor finish.',
          costIndicator: '£££',
          costDeltaMin: 1200,
          costDeltaMax: 1800,
          isSelected: flooringChoice === 'premium_timber',
        },
      ],
      selectedChoiceId: flooringChoice,
      costMin: 2800 + flooringDelta,
      costMax: 4200 + flooringDelta,
      costFormatted: `£${(2800 + flooringDelta).toLocaleString()} – £${(4200 + flooringDelta).toLocaleString()}`,
      visualAsset: {
        type: 'diagram',
        diagramType: 'finishes_joinery',
        iconName: 'Paintbrush',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gc-stage-7',
      stepNumber: 7,
      name: `Your Finished ${roomUse}`,
      badge: 'Completed Result',
      whatIsThis: `A warm, comfortable, year-round ${roomUse.toLowerCase()} with direct internal access, natural daylight, and full Building Control certification.`,
      whyNeeded: 'Increases living space and property value immediately without sacrificing garden space.',
      possibleWorks: [
        'Local authority Building Control completion certificate issued',
        'Part P electrical safety installation certificate',
        'Full snagging sign-off and professional handover',
      ],
      choices: [],
      costMin: 0,
      costMax: 0,
      costFormatted: 'Included in Project',
      visualAsset: {
        type: 'render',
        src: state.visualConcept?.currentConceptImage,
        iconName: 'Sparkles',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
  ];

  const packages: ProjectBuyingPackage[] = [
    {
      id: 'essential',
      name: 'Essential Conversion',
      tagline: 'Practical, fully compliant conversion for work or storage',
      summary: 'Everything required by Building Regulations to create a certified habitable room. Clean, durable, and cost-controlled.',
      features: [
        'Full wall, floor & ceiling insulation to Part L standards',
        'Matching brick frontage with UPVC double-glazed window',
        'New internal FD30S doorway from hallway',
        'Extend radiator or smart electric heating panel',
        'Hard-wearing AC4 oak laminate flooring & white skirting',
        'Smooth plaster finish and trade white emulsion',
        'Building Control inspection & sign-off certificate',
      ],
      costRange: `£${Math.round(baseMin * 0.9).toLocaleString()} – £${Math.round(baseMin * 1.05).toLocaleString()}`,
      costMin: Math.round(baseMin * 0.9),
      costMax: Math.round(baseMin * 1.05),
      regulatoryBaselineMet: true,
      visualHighlight: 'Clean, bright, functional space with durable finishes.',
    },
    {
      id: 'recommended',
      name: 'Recommended Spec',
      tagline: 'Enhanced comfort, warmth, and seamless aesthetic integration',
      summary: 'Our most popular specification. Upgraded insulation, real engineered oak, acoustic dampening, and designer radiator.',
      features: [
        'Enhanced acoustic & thermal wall linings',
        'Premium aluminium/UPVC window matching house profile',
        'Engineered European oak flooring over acoustic underlay',
        'Designer vertical anthracite radiator plumbed from boiler',
        'Dimmable warm-white LED downlights & Cat6 ethernet port',
        'Designer paint palette (Farrow & Ball / Little Greene finish)',
        'Building Control inspection & sign-off certificate',
      ],
      costRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      costMin: baseMin,
      costMax: baseMax,
      regulatoryBaselineMet: true,
      visualHighlight: 'Warm, refined home office that feels like an original part of the house.',
    },
    {
      id: 'premium',
      name: 'Bespoke Luxury',
      tagline: 'Design-led finish with custom joinery and architectural glazing',
      summary: 'Craftsman joinery, floor-to-ceiling slimline glazing, seamless herringbone timber, and integrated ambient lighting.',
      features: [
        'Floor-to-ceiling slimline aluminium glazing or French doors',
        'Prime herringbone parquet or seamless microcement floor',
        'Custom built-in alcove desk / media joinery and bookshelves',
        'Architectural plaster-in trimless LED lighting scenes',
        'Discreet electric underfloor heating system',
        'Full acoustic isolation lining for professional work or music',
        'Building Control inspection & sign-off certificate',
      ],
      costRange: `£${Math.round(baseMax * 1.05).toLocaleString()} – £${Math.round(baseMax * 1.3).toLocaleString()}`,
      costMin: Math.round(baseMax * 1.05),
      costMax: Math.round(baseMax * 1.3),
      regulatoryBaselineMet: true,
      visualHighlight: 'Architectural studio-standard space with bespoke cabinetry.',
    },
  ];

  const budgetBreakdown = [
    {
      category: 'Building Fabric & Thermal Insulation',
      costMin: 5000,
      costMax: 7200,
      formatted: '£5,000 – £7,200',
    },
    {
      category: 'Garage Frontage & Window Treatment',
      costMin: 3200 + frontageDelta,
      costMax: 4800 + frontageDelta,
      formatted: `£${(3200 + frontageDelta).toLocaleString()} – £${(4800 + frontageDelta).toLocaleString()}`,
    },
    {
      category: 'Internal Hallway Doorway & Lintel',
      costMin: 2200,
      costMax: 3400,
      formatted: '£2,200 – £3,400',
    },
    {
      category: 'Heating, Electrics & Lighting',
      costMin: 2400 + heatingDelta,
      costMax: 3600 + heatingDelta,
      formatted: `£${(2400 + heatingDelta).toLocaleString()} – £${(3600 + heatingDelta).toLocaleString()}`,
    },
    {
      category: 'Floor Finishes & Interior Joinery',
      costMin: 2800 + flooringDelta,
      costMax: 4200 + flooringDelta,
      formatted: `£${(2800 + flooringDelta).toLocaleString()} – £${(4200 + flooringDelta).toLocaleString()}`,
    },
    {
      category: 'Building Notice & Waste Disposal',
      costMin: 1200,
      costMax: 1800,
      formatted: '£1,200 – £1,800',
    },
  ];

  const costDrivers: BudgetCostDriverCard[] = [
    {
      id: 'driver-frontage',
      title: 'Garage Frontage Treatment',
      description: 'The exterior opening can be filled with standard cavity brickwork + window, or upgraded to full-height slimline architectural glazing.',
      impact: 'high',
      exampleText: 'Standard brick/window infill is approximately £3,200, whereas large aluminium French doors or structural glazing range £5,200+.',
      costDeltaLabel: '±£2,000 to £2,800',
    },
    {
      id: 'driver-floor',
      title: 'Floor Slab Level & Damp Proofing',
      description: 'Garage concrete floors are typically 50mm–150mm lower than the main hallway. The height difference dictates whether a timber joist subfloor or rigid screed is used.',
      impact: 'medium',
      exampleText: 'A level floor with simple PIR boards is economical; bridging an uneven 150mm step with timber joists and insulation adds modest labour.',
      costDeltaLabel: '±£800 to £1,500',
    },
    {
      id: 'driver-heating',
      title: 'Heating Integration Method',
      description: 'Connecting to your central heating pipework provides the lowest running costs, while independent smart electric radiators eliminate floor chasing.',
      impact: 'medium',
      exampleText: 'Extending boiler pipework is standard; underfloor heating or high-output designer radiators shift initial install costs.',
      costDeltaLabel: '±£700 to £1,400',
    },
    {
      id: 'driver-finish',
      title: 'Interior Joinery & Finish Level',
      description: 'From practical painted walls and durable laminate to bespoke floor-to-ceiling joinery, acoustic panelling, and prime herringbone timber.',
      impact: 'high',
      exampleText: 'Custom built-in alcove cabinetry, desks, and architectural LED lighting create a luxury look with corresponding material costs.',
      costDeltaLabel: '±£2,500 to £5,000+',
    },
  ];

  const checksToConfirm: ConfirmCheckItem[] = [
    {
      id: 'check-slab',
      issue: 'Garage concrete floor level and damp proof membrane (DPM).',
      whatWeDo: 'During our site visit, we test the concrete slab moisture content and measure the threshold level to specify the exact floating insulated subfloor build-up.',
      importance: 'high',
    },
    {
      id: 'check-fire',
      issue: 'Approved Document B fire separation between garage and hallway.',
      whatWeDo: 'We supply and certify an FD30S fire doorset with cold smoke seals and self-closing mechanism, ensuring full local council sign-off.',
      importance: 'high',
    },
    {
      id: 'check-planning',
      issue: 'Permitted development rights and street-facing facade conditions.',
      whatWeDo: 'We verify your property permitted development status to ensure no restrictive covenants require keeping a garage door appearance.',
      importance: 'standard',
    },
    {
      id: 'check-wall',
      issue: 'External single-skin masonry thermal bridging.',
      whatWeDo: 'We design an independent treated timber stud frame with continuous Celotex/Kingspan PIR insulation to completely eliminate condensation risk.',
      importance: 'high',
    },
  ];

  const customerChoices: CustomerDecisionItem[] = [
    {
      id: 'choice-room-use',
      category: 'Space & Lifestyle',
      title: 'Intended Room Purpose',
      currentValue: roomUse,
      options: [
        { id: 'office', label: 'Home Office', priceIndicator: '££', impact: 'Includes dedicated Cat6 data, power bank & task lighting' },
        { id: 'gym', label: 'Home Gym', priceIndicator: '££', impact: 'Includes reinforced subfloor, heavy-duty rubber underlay & ventilation' },
        { id: 'bedroom', label: 'Ground Floor Bedroom', priceIndicator: '££', impact: 'Includes egress window size & acoustic ceiling lining' },
        { id: 'living', label: 'Snug / Playroom', priceIndicator: '££', impact: 'Includes family-friendly durable flooring & warm lighting' },
      ],
    },
    {
      id: 'frontage',
      category: 'Exterior Appearance',
      title: 'Garage Frontage Design',
      currentValue:
        frontageChoice === 'large_glazing'
          ? 'Architectural Glazing'
          : frontageChoice === 'keep_appearance'
          ? 'False Timber Garage Front'
          : 'Brick Infill + Window',
      options: [
        { id: 'wall_window', label: 'Matching Brick + Window', priceIndicator: '££', impact: 'Best thermal performance and classic street match' },
        { id: 'large_glazing', label: 'Full Height Slimline Glazing', priceIndicator: '£££', impact: 'Floods room with maximum light (+£2,400 approx)' },
        { id: 'keep_appearance', label: 'Retain Garage Look', priceIndicator: '£', impact: 'Complies with restrictive street covenants (-£1,200 approx)' },
      ],
    },
    {
      id: 'flooring',
      category: 'Surfaces',
      title: 'Flooring Finish',
      currentValue:
        flooringChoice === 'premium_timber'
          ? 'Herringbone Parquet'
          : flooringChoice === 'laminate'
          ? 'Commercial Laminate'
          : 'Engineered European Oak',
      options: [
        { id: 'engineered_timber', label: 'Engineered Oak Plank', priceIndicator: '££', impact: 'Real natural timber warmth and high durability' },
        { id: 'laminate', label: 'AC4 Commercial Laminate', priceIndicator: '£', impact: 'Scratch-resistant & cost-effective (-£600 approx)' },
        { id: 'premium_timber', label: 'Prime Herringbone Oak', priceIndicator: '£££', impact: 'Design-led statement floor (+£1,400 approx)' },
      ],
    },
    {
      id: 'heating',
      category: 'Comfort',
      title: 'Heating Solution',
      currentValue:
        heatingChoice === 'underfloor'
          ? 'Electric Underfloor'
          : heatingChoice === 'electric_panel'
          ? 'Smart Electric Panel'
          : 'Extend Boiler Radiator',
      options: [
        { id: 'wet_central', label: 'Extend Boiler Radiator', priceIndicator: '££', impact: 'Lowest running costs from central combi boiler' },
        { id: 'electric_panel', label: 'Smart Electric Radiator', priceIndicator: '£', impact: 'Independent timer and quick installation (-£700 approx)' },
        { id: 'underfloor', label: 'Electric Underfloor Mat', priceIndicator: '£££', impact: 'Warm floor with zero radiator wall clutter (+£1,200 approx)' },
      ],
    },
  ];

  const matchedCaseStudy = caseStudiesData.find((c) => c.id === 'kew-garden-studio') || caseStudiesData[0];

  return {
    glance: {
      projectTitle: `Garage Conversion to ${roomUse}`,
      projectType: 'Garage Conversion',
      workAreasCount: 6,
      approxDuration: '3 to 5 weeks',
      earlyBudgetRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      budgetMin: baseMin,
      budgetMax: baseMax,
      biggestCostDrivers: ['Frontage & Window Design', 'Internal Doorway Knockthrough', 'Interior Finish Level'],
      mainThingToCheck: 'Concrete floor level & Approved Document B fire separation',
    },
    stages,
    packages,
    budgetBreakdown,
    totalEarlyBudget: {
      min: baseMin,
      max: baseMax,
      formatted: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
    },
    costDrivers,
    checksToConfirm,
    customerChoices,
    relevantCaseStudy: {
      title: matchedCaseStudy.title,
      location: matchedCaseStudy.location,
      projectType: matchedCaseStudy.projectType,
      duration: matchedCaseStudy.duration,
      cost: matchedCaseStudy.indicativeCost,
      coverImage: matchedCaseStudy.coverImage,
      slug: matchedCaseStudy.slug,
      whatCustomerWanted: matchedCaseStudy.customerObjective,
      whatStContractorsDid: matchedCaseStudy.solution,
      result: matchedCaseStudy.testimonial?.quote || 'Delivered on time and within agreed budget.',
    },
  };
}

// =============================================================================
// 2. INTERNAL DOORWAY / OPENING ROADMAP BUILDER
// =============================================================================

function buildDoorOnlyRoadmap(
  state: ProjectState,
  choices: Record<string, string>
): ProjectRoadmapModel {
  const doorType = choices['door_type'] || 'fd30s_timber';
  const doorDelta = doorType === 'glazed_fire' ? 600 : doorType === 'standard_fire' ? -200 : 0;

  const baseMin = 1800 + doorDelta;
  const baseMax = 3500 + doorDelta;

  const stages: RoadmapStageCard[] = [
    {
      id: 'door-stage-1',
      stepNumber: 1,
      name: 'Structural Wall Inspection & Opening Layout',
      badge: 'Preparation',
      whatIsThis: 'Site inspection to determine whether the dividing wall is load-bearing masonry or timber partition, and verify clearance from services.',
      whyNeeded: 'Ensures proper temporary Acrow propping is deployed and verifies lintel size before any masonry breakout.',
      possibleWorks: [
        'Scan for concealed electrical wiring and pipework in the target wall section',
        'Check joist bearing direction above the opening',
        'Set laser line for plumb jambs and level lintel bearing pads',
      ],
      choices: [],
      costMin: 350,
      costMax: 500,
      costFormatted: '£350 – £500',
      visualAsset: {
        type: 'diagram',
        diagramType: 'wall_inspection',
        iconName: 'Search',
      },
      needsCheck: true,
      checkDescription: 'Load-bearing status of the dividing wall and header clearance.',
      contractorSolution: 'ST Contractors props the ceiling with certified Acrow jacks and Strongboy needles before cutting any structural brickwork.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'door-stage-2',
      stepNumber: 2,
      name: 'Form Opening & Install Structural Lintel',
      badge: 'Structural Works',
      whatIsThis: 'Careful masonry breakout using dust-suppressed disc cutters and installation of a pre-stressed reinforced concrete lintel.',
      whyNeeded: 'Safely supports the brickwork and first floor loads above the new doorway opening.',
      possibleWorks: [
        'Install temporary structural propping if wall is load-bearing',
        'Precision wet-diamond cutting to form aperture with minimal plaster vibration',
        'Bed pre-stressed concrete lintel on 150mm engineering brick or concrete padstones',
        'Allow mortar to cure before easing temporary propping',
      ],
      choices: [],
      costMin: 650,
      costMax: 1100,
      costFormatted: '£650 – £1,100',
      visualAsset: {
        type: 'diagram',
        diagramType: 'lintel_install',
        iconName: 'Hammer',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'door-stage-3',
      stepNumber: 3,
      name: 'Install Certified Fire Doorset (FD30S)',
      badge: 'Doorset Installation',
      whatIsThis: 'Fitting a certified 30-minute fire-rated timber doorset with intumescent heat and cold smoke perimeter seals.',
      whyNeeded: 'Approved Document B mandates FD30S fire separation between an integral garage or utility zone and the main domestic dwelling.',
      possibleWorks: [
        'Supply and plumb pre-hung FD30 solid timber door frame with 3 steel ball-bearing hinges',
        'Fit FD30 solid core timber door leaf with fire-rated intumescent seals',
        'Install concealed or overhead automatic self-closing mechanism',
        'Architectural stainless steel lever handles and mortice latch',
      ],
      choices: [
        {
          id: 'fd30s_timber',
          label: 'Pre-hung 4-Panel / Smooth FD30S Door',
          description: 'Certified 30-minute fire door primed for painting, complete with intumescent smoke seals.',
          costIndicator: '££',
          costDeltaMin: 0,
          costDeltaMax: 0,
          isDefault: true,
          isSelected: doorType === 'fd30s_timber',
        },
        {
          id: 'glazed_fire',
          label: 'FD30 Vision Glazed Fire Door',
          description: 'Certified fire door with clear Pyroguard fire safety glass aperture allowing natural light through.',
          costIndicator: '£££',
          costDeltaMin: 500,
          costDeltaMax: 700,
          isSelected: doorType === 'glazed_fire',
        },
        {
          id: 'standard_fire',
          label: 'Standard Flush FD30 Door',
          description: 'Simple paint-grade flush fire door for utility and storage areas.',
          costIndicator: '£',
          costDeltaMin: -250,
          costDeltaMax: -150,
          isSelected: doorType === 'standard_fire',
        },
      ],
      selectedChoiceId: doorType,
      costMin: 450 + doorDelta,
      costMax: 900 + doorDelta,
      costFormatted: `£${(450 + doorDelta).toLocaleString()} – £${(900 + doorDelta).toLocaleString()}`,
      visualAsset: {
        type: 'diagram',
        diagramType: 'fire_doorset',
        iconName: 'DoorClosed',
      },
      needsCheck: true,
      checkDescription: '100mm threshold step or floor fall into garage to prevent fuel vapour ingress.',
      contractorSolution: 'We install a certified 100mm threshold step or smoke-sealed threshold plate meeting Building Regulations Part B.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'door-stage-4',
      stepNumber: 4,
      name: 'Making Good Plaster & Architraves',
      badge: 'Finishes',
      whatIsThis: 'Plasterboarding reveal jambs, applying multi-finish skim plaster, and fixing decorative timber architraves.',
      whyNeeded: 'Blends the new opening seamlessly with your existing hallway walls so it looks like it was always there.',
      possibleWorks: [
        'Bonding and skim plastering to both sides of the new wall opening',
        'Fitting primed MDF or softwood architraves matching existing hallway profile',
        'Caulking, sealing, and priming timber ready for final decoration',
      ],
      choices: [],
      costMin: 350,
      costMax: 600,
      costFormatted: '£350 – £600',
      visualAsset: {
        type: 'diagram',
        diagramType: 'architrave_finish',
        iconName: 'Paintbrush',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'door-stage-5',
      stepNumber: 5,
      name: 'Decoration & Building Notice Sign-off',
      badge: 'Completion',
      whatIsThis: 'Final coats of emulsion and satinwood paint, hardware testing, and building control sign-off.',
      whyNeeded: 'Provides complete peace of mind and statutory compliance documentation for future house sales.',
      possibleWorks: [
        'Two coats of durable emulsion to patched wall areas',
        'Two coats satinwood paint to door leaf, frame, and architraves',
        'Check self-closer tension and positive latch engagement',
      ],
      choices: [],
      costMin: 200,
      costMax: 400,
      costFormatted: '£200 – £400',
      visualAsset: {
        type: 'diagram',
        diagramType: 'completed_door',
        iconName: 'CheckCircle2',
      },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
  ];

  const packages: ProjectBuyingPackage[] = [
    {
      id: 'essential',
      name: 'Standard FD30S Installation',
      tagline: 'Fully compliant, robust internal fire door installation',
      summary: 'Complete structural opening, pre-stressed lintel, certified flush FD30S doorset, and primed architraves.',
      features: [
        'Structural wall cut-out & concrete lintel installation',
        'Certified FD30S flush fire door with intumescent seals',
        'Heavy-duty stainless steel ball bearing hinges & self-closer',
        'Plaster making good to reveals',
        'Matching timber architraves primed ready for paint',
      ],
      costRange: `£${baseMin.toLocaleString()} – £${Math.round(baseMin * 1.2).toLocaleString()}`,
      costMin: baseMin,
      costMax: Math.round(baseMin * 1.2),
      regulatoryBaselineMet: true,
      visualHighlight: 'Clean, safe, fully certified opening.',
    },
    {
      id: 'recommended',
      name: 'Recommended Finished Package',
      tagline: 'Turnkey opening with full decoration and matching period joinery',
      summary: 'Includes matching 4-panel moulded door, upgraded architectural hardware, professional 3-coat painting, and building notice compliance.',
      features: [
        'All structural opening and lintel works included',
        'Moulded 4-panel FD30S doorset matching internal house doors',
        'Architectural brushed chrome lever handles & magnetic latch',
        'Complete plaster skim and 3-coat paint decoration',
        '100mm threshold vapour step or sealed floor transition',
      ],
      costRange: `£${Math.round(baseMin * 1.15).toLocaleString()} – £${baseMax.toLocaleString()}`,
      costMin: Math.round(baseMin * 1.15),
      costMax: baseMax,
      regulatoryBaselineMet: true,
      visualHighlight: 'Finished to perfection, ready to use immediately.',
    },
    {
      id: 'premium',
      name: 'Bespoke Glazed Fire Suite',
      tagline: 'Clear fire-glass vision panel with custom hardwood architraves',
      summary: 'Allows light between hallway and connected room using certified Pyroguard clear fire glass and bespoke solid oak architraves.',
      features: [
        'Structural opening and pre-stressed steel/concrete lintel',
        'Bespoke glazed FD30S doorset with clear acoustic fire glass',
        'Solid European oak frame, architraves, and threshold',
        'Concealed magnetic jamb self-closing mechanism (no overhead arm)',
        'Full professional decoration & Building Control sign-off',
      ],
      costRange: `£${baseMax.toLocaleString()} – £${Math.round(baseMax * 1.35).toLocaleString()}`,
      costMin: baseMax,
      costMax: Math.round(baseMax * 1.35),
      regulatoryBaselineMet: true,
      visualHighlight: 'Architectural glazed fire door that elevates the hallway.',
    },
  ];

  const budgetBreakdown = [
    { category: 'Structural Propping, Breakout & Lintel', costMin: 700, costMax: 1200, formatted: '£700 – £1,200' },
    { category: 'FD30S Fire Doorset & Self-Closer', costMin: 450 + doorDelta, costMax: 900 + doorDelta, formatted: `£${(450 + doorDelta).toLocaleString()} – £${(900 + doorDelta).toLocaleString()}` },
    { category: 'Plaster Making Good & Architraves', costMin: 350, costMax: 600, formatted: '£350 – £600' },
    { category: 'Decoration & Threshold Step', costMin: 300, costMax: 600, formatted: '£300 – £600' },
    { category: 'Waste Removal & Site Protection', costMin: 200, costMax: 350, formatted: '£200 – £350' },
  ];

  const costDrivers: BudgetCostDriverCard[] = [
    {
      id: 'driver-load',
      title: 'Load-Bearing vs Partition Wall',
      description: 'If the wall supports first-floor floor joists or roof loads, structural needle propping and a heavy-duty concrete lintel are required.',
      impact: 'high',
      exampleText: 'A timber stud partition requires minimal propping; a 9-inch solid brick wall requires diamond disc cutting and lintel padstones.',
      costDeltaLabel: '±£500 to £900',
    },
    {
      id: 'driver-services',
      title: 'Concealed Services in Wall',
      description: 'Hidden cables, central heating pipes, or alarm wiring in the breakout zone must be safely isolated and re-routed.',
      impact: 'medium',
      exampleText: 'A clear wall section is straightforward; re-routing a twin 15mm heating pipe run adds plumbing time.',
      costDeltaLabel: '±£300 to £600',
    },
    {
      id: 'driver-finish',
      title: 'Door Style & Glazing',
      description: 'Standard flush timber fire door vs vision-panelled Pyroguard fire glass doorset.',
      impact: 'medium',
      exampleText: 'Standard flush doors are cost-efficient; clear acoustic fire glass panels increase doorset manufacturing cost.',
      costDeltaLabel: '±£400 to £700',
    },
  ];

  const checksToConfirm: ConfirmCheckItem[] = [
    {
      id: 'check-wall-type',
      issue: 'Wall construction: solid brick, blockwork, or studwork.',
      whatWeDo: 'We inspect the wall construction and joist direction during our site visit to size the structural lintel accurately.',
      importance: 'high',
    },
    {
      id: 'check-fire-step',
      issue: '100mm threshold step requirement into garage under Approved Document B.',
      whatWeDo: 'We check the garage floor height relative to the house floor to verify whether a step or ramped detail is mandated.',
      importance: 'high',
    },
  ];

  const customerChoices: CustomerDecisionItem[] = [
    {
      id: 'door_type',
      category: 'Door Style',
      title: 'Fire Doorset Specification',
      currentValue:
        doorType === 'glazed_fire'
          ? 'Vision Glazed Fire Door'
          : doorType === 'standard_fire'
          ? 'Standard Flush Fire Door'
          : '4-Panel Moulded Fire Door',
      options: [
        { id: 'fd30s_timber', label: 'Moulded 4-Panel FD30S', priceIndicator: '££', impact: 'Matches typical internal house doors' },
        { id: 'glazed_fire', label: 'Vision Glazed Fire Door', priceIndicator: '£££', impact: 'Allows daylight to flow between spaces (+£600 approx)' },
        { id: 'standard_fire', label: 'Flush Paint-Grade Door', priceIndicator: '£', impact: 'Functional and budget-friendly (-£200 approx)' },
      ],
    },
  ];

  return {
    glance: {
      projectTitle: 'Internal Connecting Doorway Installation',
      projectType: 'Door & Structural Opening',
      workAreasCount: 4,
      approxDuration: '2 to 3 days',
      earlyBudgetRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      budgetMin: baseMin,
      budgetMax: baseMax,
      biggestCostDrivers: ['Wall Load-Bearing Status', 'FD30S Door Style & Glazing', 'Plaster & Trim Integration'],
      mainThingToCheck: 'Wall structural load & Approved Document B fire separation',
    },
    stages,
    packages,
    budgetBreakdown,
    totalEarlyBudget: {
      min: baseMin,
      max: baseMax,
      formatted: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
    },
    costDrivers,
    checksToConfirm,
    customerChoices,
  };
}

// =============================================================================
// 3. BATHROOM RENOVATION ROADMAP BUILDER
// =============================================================================

function buildBathroomRoadmap(
  state: ProjectState,
  choices: Record<string, string>
): ProjectRoadmapModel {
  const surfaceChoice = choices['surfaces'] || 'large_porcelain';
  const surfaceDelta = surfaceChoice === 'microcement' ? 1800 : surfaceChoice === 'metro_tile' ? -600 : 0;

  const baseMin = 14000 + surfaceDelta;
  const baseMax = 22000 + surfaceDelta;

  const stages: RoadmapStageCard[] = [
    {
      id: 'bath-stage-1',
      stepNumber: 1,
      name: 'Strip-out & Substrate Inspection',
      badge: 'Demolition',
      whatIsThis: 'Complete removal of existing sanitaryware, tiles, bath, and compromised subflooring down to clean joists and studs.',
      whyNeeded: 'Exposes hidden leaks, water-damaged floor joists, and guarantees a sound, rigid substrate for high-end tiling or microcement.',
      possibleWorks: [
        'Isolate hot and cold water supplies and safe electrical circuits',
        'Strip old ceramic tiles, sanitary fixtures, and rotting plasterboard',
        'Inspect timber joists for water rot, deflection, and pipe notching',
        'Bag and dispose of all licensed construction debris via clean skips',
      ],
      choices: [],
      costMin: 1200,
      costMax: 1800,
      costFormatted: '£1,200 – £1,800',
      visualAsset: { type: 'diagram', diagramType: 'strip_out', iconName: 'Trash2' },
      needsCheck: true,
      checkDescription: 'Subfloor joist deflection and historic timber rot around wet zones.',
      contractorSolution: 'We sister damaged joists with C24 structural timber and screw 18mm marine plywood to eliminate floor flex.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'bath-stage-2',
      stepNumber: 2,
      name: 'First-Fix Plumbing & Drainage Layout',
      badge: 'Services',
      whatIsThis: 'Re-running hot and cold copper/PEX pipework, installing concealed thermostatic valve bodies, and setting high-flow shower wastes.',
      whyNeeded: 'Enables flush wall-hung fittings, modern rainfall showerheads, and rapid gravity drainage without water backup.',
      possibleWorks: [
        'Alter 40mm waste pipe runs with minimum 1:40 gravity fall to soil stack',
        'Chase concealed thermostatic valve and wall-hung basin mixer into studs',
        'Install Geberit wall-hung WC frame bolted to floor slab and rear studding',
        'Pressure test all soldered and push-fit joints to 6 bar before boarding',
      ],
      choices: [],
      costMin: 2200,
      costMax: 3400,
      costFormatted: '£2,200 – £3,400',
      visualAsset: { type: 'diagram', diagramType: 'plumbing_layout', iconName: 'Wrench' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'bath-stage-3',
      stepNumber: 3,
      name: 'Tanking & Impervious Waterproofing',
      badge: 'Waterproofing',
      whatIsThis: 'Installation of cementitious backer boards and Schlüter-KERDI waterproof tanking membrane across all wet zones.',
      whyNeeded: 'Tiles and grout are not waterproof. Continuous tanking prevents catastrophic leaks into ceilings and adjoining rooms.',
      possibleWorks: [
        'Line shower walls with 12mm moisture-impervious tile backer board',
        'Apply fleece-backed waterproof tanking membrane with joint corner tapes',
        'Install pre-formed level-access shower former with integrated stainless linear drain',
        'Flood-test shower tray for 24 hours prior to tiling',
      ],
      choices: [],
      costMin: 1500,
      costMax: 2200,
      costFormatted: '£1,500 – £2,200',
      visualAsset: { type: 'diagram', diagramType: 'tanking_waterproof', iconName: 'ShieldCheck' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'bath-stage-4',
      stepNumber: 4,
      name: 'Tiling & Surface Finishes',
      badge: 'Surfaces',
      whatIsThis: 'Precision installation of wall and floor tiles or seamless waterproof microcement with mitred epoxy corners.',
      whyNeeded: 'Creates the primary aesthetic and durable tactile surface of your luxury bathroom.',
      possibleWorks: [
        'Floor and wall surface priming with polymer bonding agent',
        'Precision installation with 1.5mm levelling clips and full-coverage adhesive',
        'Waterproof epoxy or anti-mould flexible grout with matching silicone joints',
      ],
      choices: [
        {
          id: 'large_porcelain',
          label: 'Large Format 1200x600 Porcelain',
          description: 'Contemporary Italian porcelain tiles with minimal grout lines. Calacatta marble or stone effect.',
          costIndicator: '££',
          costDeltaMin: 0,
          costDeltaMax: 0,
          isDefault: true,
          isSelected: surfaceChoice === 'large_porcelain',
        },
        {
          id: 'microcement',
          label: 'Seamless Architectural Microcement',
          description: 'Grout-free, hand-trowelled microcement across shower walls and floor. Ultra-modern aesthetic.',
          costIndicator: '£££',
          costDeltaMin: 1500,
          costDeltaMax: 2200,
          isSelected: surfaceChoice === 'microcement',
        },
        {
          id: 'metro_tile',
          label: 'Ceramic Metro / Glazed Zellige Tile',
          description: 'Handmade look glazed ceramic tiles with feature bond pattern.',
          costIndicator: '£',
          costDeltaMin: -700,
          costDeltaMax: -500,
          isSelected: surfaceChoice === 'metro_tile',
        },
      ],
      selectedChoiceId: surfaceChoice,
      costMin: 3200 + surfaceDelta,
      costMax: 5000 + surfaceDelta,
      costFormatted: `£${(3200 + surfaceDelta).toLocaleString()} – £${(5000 + surfaceDelta).toLocaleString()}`,
      visualAsset: { type: 'diagram', diagramType: 'tiling_surfaces', iconName: 'Layers' },
      needsCheck: true,
      checkDescription: 'Microcement requires zero-deflection substrate to prevent hairline cracking.',
      contractorSolution: 'We install dual-layer cross-bonded 18mm plywood and decoupling matting before trowelling microcement.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'bath-stage-5',
      stepNumber: 5,
      name: 'Sanitary Fixtures & Brassware Second-Fix',
      badge: 'Fixtures',
      whatIsThis: 'Fitting the walk-in glass shower screen, wall-hung vanity unit, illuminated mirror, and brushed brass or chrome taps.',
      whyNeeded: 'Brings functionality, storage, and visual luxury into daily use.',
      possibleWorks: [
        'Fit 10mm toughened easy-clean glass walk-in wet room panel with bracing bar',
        'Mount double-drawer wall-hung timber vanity with stone countertop basin',
        'Hang LED anti-fog touch mirror with ambient perimeter backlighting',
        'Install wall-hung rimless toilet pan with soft-close seat and dual-flush plate',
      ],
      choices: [],
      costMin: 3000,
      costMax: 4800,
      costFormatted: '£3,000 – £4,800',
      visualAsset: { type: 'diagram', diagramType: 'sanitary_fixtures', iconName: 'Sparkles' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'bath-stage-6',
      stepNumber: 6,
      name: 'Mechanical Ventilation & Ambient Lighting',
      badge: 'Ventilation & M&E',
      whatIsThis: 'Continuous low-energy Part F extract ventilation, IP65 LED downlights, and heated towel rail connection.',
      whyNeeded: 'Rapidly clears steam to eliminate mould risk, window condensation, and mirror misting.',
      possibleWorks: [
        'Install high-capacity inline centrifugal fan ducted through external wall/soffit',
        'IP65 rated dimmable LED ceiling downlights and niche accent LED strips',
        'Electric dual-fuel heated towel warmer connected to smart timer',
      ],
      choices: [],
      costMin: 1200,
      costMax: 1800,
      costFormatted: '£1,200 – £1,800',
      visualAsset: { type: 'diagram', diagramType: 'lighting_vent', iconName: 'Zap' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
  ];

  const packages: ProjectBuyingPackage[] = [
    {
      id: 'essential',
      name: 'Contemporary Standard',
      tagline: 'Reliable, fully waterproofed designer bathroom suite',
      summary: 'Schlüter tanking, 600x600 porcelain tiles, walk-in shower screen, chrome brassware, and vanity unit.',
      features: [
        'Full strip-out and timber subfloor preparation',
        '100% waterproof tanking to all shower zones',
        '600x600 Italian porcelain wall and floor tiles',
        'Thermostatic rainfall shower and handheld wand in polished chrome',
        'Wall-hung 600mm vanity unit with soft-close storage',
        'Building Regs Part F compliant mechanical extractor fan',
      ],
      costRange: `£${baseMin.toLocaleString()} – £${Math.round(baseMin * 1.15).toLocaleString()}`,
      costMin: baseMin,
      costMax: Math.round(baseMin * 1.15),
      regulatoryBaselineMet: true,
      visualHighlight: 'Crisp, contemporary white and grey porcelain look.',
    },
    {
      id: 'recommended',
      name: 'Enhanced Hotel-Spec',
      tagline: 'Large format tiles, brushed brass/black fittings, and LED niches',
      summary: 'Upgraded 1200x600 porcelain, brushed brassware, fluted glass shower screen, and illuminated feature shampoo niche.',
      features: [
        'Full strip-out & reinforced deflection-free subfloor',
        '100% certified wet room tanking membrane',
        '1200x600 Calacatta marble-effect porcelain with mitred corners',
        'Brushed brass or matt black thermostatic shower and taps',
        'Integrated illuminated LED shampoo niche in wet zone',
        'Wall-hung rimless toilet with concealed Geberit cistern',
      ],
      costRange: `£${Math.round(baseMin * 1.1).toLocaleString()} – £${baseMax.toLocaleString()}`,
      costMin: Math.round(baseMin * 1.1),
      costMax: baseMax,
      regulatoryBaselineMet: true,
      visualHighlight: 'Luxury boutique hotel feel with warm ambient lighting.',
    },
    {
      id: 'premium',
      name: 'Bespoke Microcement Sanctuary',
      tagline: 'Grout-free microcement walls, fluted oak vanity, and architectural lighting',
      summary: 'Master craftsman microcement finish, bespoke solid timber joinery, underfloor heating, and spa-level appointments.',
      features: [
        'Seamless waterproof microcement across walls and floor',
        'Bespoke fluted oak wall-hung vanity with stone washbasin',
        'Underfloor heating with digital touchscreen programmer',
        'Crittall-style or fluted glass walk-in shower partition',
        'Architectural plastered-in trimless LED lighting scenes',
        'Full acoustic isolation and premium extract system',
      ],
      costRange: `£${baseMax.toLocaleString()} – £${Math.round(baseMax * 1.3).toLocaleString()}`,
      costMin: baseMax,
      costMax: Math.round(baseMax * 1.3),
      regulatoryBaselineMet: true,
      visualHighlight: 'Ultra-modern architectural spa with tactile seamless surfaces.',
    },
  ];

  const budgetBreakdown = [
    { category: 'Strip-out & Waste Disposal', costMin: 1200, costMax: 1800, formatted: '£1,200 – £1,800' },
    { category: 'First-Fix Plumbing & Drainage', costMin: 2200, costMax: 3400, formatted: '£2,200 – £3,400' },
    { category: 'Wet Zone Tanking & Waterproofing', costMin: 1500, costMax: 2200, formatted: '£1,500 – £2,200' },
    { category: 'Tiling & Surfaces', costMin: 3200 + surfaceDelta, costMax: 5000 + surfaceDelta, formatted: `£${(3200 + surfaceDelta).toLocaleString()} – £${(5000 + surfaceDelta).toLocaleString()}` },
    { category: 'Sanitaryware & Glass Screen', costMin: 3000, costMax: 4800, formatted: '£3,000 – £4,800' },
    { category: 'Electrics, Ventilation & Heating', costMin: 1200, costMax: 1800, formatted: '£1,200 – £1,800' },
  ];

  const costDrivers: BudgetCostDriverCard[] = [
    {
      id: 'driver-surface',
      title: 'Surface Finish: Porcelain vs Microcement',
      description: 'Standard porcelain tiles require straightforward adhesive fixing. Microcement is hand-trowelled in 4 coats with primer, mesh, and polyurethane sealers.',
      impact: 'high',
      exampleText: 'Quality 600x600 porcelain averages £45/m² supply; artisan microcement application averages £120–£160/m² including labour.',
      costDeltaLabel: '±£1,500 to £2,200',
    },
    {
      id: 'driver-layout',
      title: 'Plumbing Layout Changes',
      description: 'Keeping the toilet and shower near their existing soil pipe positions saves labour. Moving a toilet across the room requires core-drilling joists.',
      impact: 'medium',
      exampleText: 'Working within existing stack runs keeps plumbing labour minimal; deep floor chasing adds pipework time.',
      costDeltaLabel: '±£600 to £1,200',
    },
    {
      id: 'driver-fixtures',
      title: 'Brassware & Sanitaryware Tier',
      description: 'Polished chrome standard fixtures vs PVD brushed brass, gunmetal, or thermostatic digital mixer valves.',
      impact: 'high',
      exampleText: 'A reliable chrome thermostatic shower set is £300–£450; luxury designer PVD brushed brass sets range £800–£1,600.',
      costDeltaLabel: '±£1,000 to £2,500',
    },
  ];

  const checksToConfirm: ConfirmCheckItem[] = [
    {
      id: 'check-fall',
      issue: 'Shower waste gravity drainage fall to existing soil stack.',
      whatWeDo: 'We measure the distance and drop from your proposed walk-in shower to the stack to guarantee water flows away rapidly without pump noise.',
      importance: 'high',
    },
    {
      id: 'check-subfloor',
      issue: 'Timber subfloor joist stiffness under tiles or microcement.',
      whatWeDo: 'We inspect joist centres and sister additional timber beams where necessary to eliminate all floor flex.',
      importance: 'high',
    },
  ];

  const customerChoices: CustomerDecisionItem[] = [
    {
      id: 'surfaces',
      category: 'Wall & Floor Surfaces',
      title: 'Surface Material Choice',
      currentValue:
        surfaceChoice === 'microcement'
          ? 'Seamless Microcement'
          : surfaceChoice === 'metro_tile'
          ? 'Ceramic Metro Tile'
          : 'Large Format Porcelain',
      options: [
        { id: 'large_porcelain', label: '1200x600 Porcelain', priceIndicator: '££', impact: 'Minimal grout lines and stone elegance' },
        { id: 'microcement', label: 'Seamless Microcement', priceIndicator: '£££', impact: 'Grout-free, hand-trowelled modern spa look (+£1,800 approx)' },
        { id: 'metro_tile', label: 'Ceramic Metro Tile', priceIndicator: '£', impact: 'Classic look with controlled cost (-£600 approx)' },
      ],
    },
  ];

  return {
    glance: {
      projectTitle: 'Luxury Bathroom Renovation',
      projectType: 'Bathroom Renovation',
      workAreasCount: 6,
      approxDuration: '2 to 3 weeks',
      earlyBudgetRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      budgetMin: baseMin,
      budgetMax: baseMax,
      biggestCostDrivers: ['Surface Choice (Porcelain vs Microcement)', 'Concealed Valve Plumbing', 'Sanitaryware Tier'],
      mainThingToCheck: 'Shower waste gravity fall & subfloor rigidity',
    },
    stages,
    packages,
    budgetBreakdown,
    totalEarlyBudget: {
      min: baseMin,
      max: baseMax,
      formatted: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
    },
    costDrivers,
    checksToConfirm,
    customerChoices,
  };
}

// =============================================================================
// 4. REAR EXTENSION & KITCHEN ROADMAP BUILDER
// =============================================================================

function buildExtensionRoadmap(
  state: ProjectState,
  choices: Record<string, string>
): ProjectRoadmapModel {
  const glazingChoice = choices['glazing'] || 'aluminium_sliders';
  const glazingDelta = glazingChoice === 'frameless_corner' ? 4500 : glazingChoice === 'upvc_bifolds' ? -2000 : 0;

  const baseMin = 75000 + glazingDelta;
  const baseMax = 110000 + glazingDelta;

  const stages: RoadmapStageCard[] = [
    {
      id: 'ext-stage-1',
      stepNumber: 1,
      name: 'Site Clearance & Groundworks',
      badge: 'Substructure',
      whatIsThis: 'Excavation of foundation trenches down to load-bearing London clay and concrete foundation pouring.',
      whyNeeded: 'Provides the solid, engineered base that supports the entire extension weight without subsidence risk.',
      possibleWorks: [
        'Strip patio, garden earth, and clear side access route for mini-digger',
        'Excavate 1.0m–1.5m deep strip foundations inspected by local building control',
        'Install CCTV drain survey and Thames Water build-over protection bridges',
        'Pour C25/30 ready-mix concrete foundation footings with reinforcement mesh',
      ],
      choices: [],
      costMin: 12000,
      costMax: 18000,
      costFormatted: '£12,000 – £18,000',
      visualAsset: { type: 'diagram', diagramType: 'groundworks', iconName: 'Trowel' },
      needsCheck: true,
      checkDescription: 'Thames Water public sewer clearance and tree root depth in London clay.',
      contractorSolution: 'We conduct a CCTV drain survey and manage Thames Water build-over approval before digging.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'ext-stage-2',
      stepNumber: 2,
      name: 'Structural Steelwork & Internal Knockthrough',
      badge: 'Structure',
      whatIsThis: 'Propping the rear of the house, knocking out the back wall, and installing engineered structural steel beams.',
      whyNeeded: 'Creates a completely clear, column-free open-plan living and kitchen space connecting old and new.',
      possibleWorks: [
        'Prop first floor and roof structure with engineered heavy-duty Acrow towers',
        'Demolish rear masonry wall and chimney breast if required',
        'Crane or hoist universal steel columns and goalpost beams onto concrete padstones',
        'Bolt steel connections to structural engineer signed-off calculation sheets',
      ],
      choices: [],
      costMin: 14000,
      costMax: 20000,
      costFormatted: '£14,000 – £20,000',
      visualAsset: { type: 'diagram', diagramType: 'steel_structure', iconName: 'Layers' },
      needsCheck: true,
      checkDescription: 'Party wall notice to adjoining neighbours if beam sits in party boundary.',
      contractorSolution: 'We serve formal Party Wall notices 2 months prior to work and provide full engineer drawings to surveyors.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'ext-stage-3',
      stepNumber: 3,
      name: 'Warm Roof Structure & High-Spec Glazing',
      badge: 'Weathertight Envelope',
      whatIsThis: 'Building the insulated flat roof deck, inserting frameless glass rooflights, and installing slimline patio doors.',
      whyNeeded: 'Floods the deep plan of the home with sky light while locking in winter heat to Part L standards.',
      possibleWorks: [
        'Construct C24 timber flat roof structure with 150mm Kingspan warm-deck insulation',
        'Install single-ply EPDM or GRP seamless fiberglass waterproofing membrane with 25-year warranty',
        'Drop in 2.5m × 1.2m solar-control frameless flat glass roof lantern',
        'Install powder-coated aluminium slimline sliding doors or bifold system with flush patio threshold',
      ],
      choices: [
        {
          id: 'aluminium_sliders',
          label: 'Aluminium Slimline Sliding Doors (4.5m)',
          description: 'Large glass panes with ultra-slim 20mm sightlines. Smooth sliding glide.',
          costIndicator: '££',
          costDeltaMin: 0,
          costDeltaMax: 0,
          isDefault: true,
          isSelected: glazingChoice === 'aluminium_sliders',
        },
        {
          id: 'frameless_corner',
          label: 'Open Corner Glazing with Cantilever Steel',
          description: 'Pillarless open corner with dual sliding doors that open the corner completely to the patio.',
          costIndicator: '£££',
          costDeltaMin: 4000,
          costDeltaMax: 5000,
          isSelected: glazingChoice === 'frameless_corner',
        },
        {
          id: 'upvc_bifolds',
          label: 'Standard Aluminium Bifolds (3m)',
          description: 'Classic 3-pane bifold door folding completely to one side.',
          costIndicator: '£',
          costDeltaMin: -2400,
          costDeltaMax: -1600,
          isSelected: glazingChoice === 'upvc_bifolds',
        },
      ],
      selectedChoiceId: glazingChoice,
      costMin: 18000 + glazingDelta,
      costMax: 26000 + glazingDelta,
      costFormatted: `£${(18000 + glazingDelta).toLocaleString()} – £${(26000 + glazingDelta).toLocaleString()}`,
      visualAsset: { type: 'diagram', diagramType: 'roof_glazing', iconName: 'Maximize2' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'ext-stage-4',
      stepNumber: 4,
      name: 'Underfloor Heating & First-Fix M&E',
      badge: 'Services',
      whatIsThis: 'Water underfloor heating pipes embedded in liquid screed, plumbing for kitchen island, and rewiring circuits.',
      whyNeeded: 'Even, luxurious heat across the entire open-plan ground floor with no wall-mounted radiator restrictions.',
      possibleWorks: [
        'Lay 100mm PIR insulation over floor slab with multi-zone water underfloor heating loops',
        'Pour 60mm self-levelling liquid screed with 21-day controlled drying schedule',
        'Run waste, water, and power feeds to central island location',
        'Install new 18-way consumer unit with surge protection and RCBO circuits',
      ],
      choices: [],
      costMin: 9000,
      costMax: 14000,
      costFormatted: '£9,000 – £14,000',
      visualAsset: { type: 'diagram', diagramType: 'heating_screed', iconName: 'Zap' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'ext-stage-5',
      stepNumber: 5,
      name: 'Kitchen Installation & Interior Joinery',
      badge: 'Kitchen & Living',
      whatIsThis: 'Cabinetry installation, stone worktop templating and fitting, integrated appliances, and utility area.',
      whyNeeded: 'The heart of your new extension, providing cooking, entertaining, and family dining in one beautiful space.',
      possibleWorks: [
        'Install base and tall kitchen units, pantry, and central island',
        'Template and install 20mm or 30mm polished quartz worktops and waterfall end',
        'Connect induction hob, dual ovens, integrated fridge-freezer, and Quooker boiling tap',
      ],
      choices: [],
      costMin: 14000,
      costMax: 22000,
      costFormatted: '£14,000 – £22,000',
      visualAsset: { type: 'diagram', diagramType: 'kitchen_install', iconName: 'ChefHat' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'ext-stage-6',
      stepNumber: 6,
      name: 'Finishes, Flooring & External Patio Blend',
      badge: 'Finishing Touches',
      whatIsThis: 'Engineered wood or large format porcelain floor, skim plastering, architectural lighting scenes, and decoration.',
      whyNeeded: 'Completes the space with a flush internal-to-external threshold transition into your garden.',
      possibleWorks: [
        'Lay continuous engineered oak or porcelain flooring through ground floor',
        'Full mist coat and 2 coats premium washable emulsion',
        'Trimless plaster-in ceiling spotlights and coffer LED perimeter strip',
        'Step-free exterior threshold drainage channel matching garden patio',
      ],
      choices: [],
      costMin: 8000,
      costMax: 12000,
      costFormatted: '£8,000 – £12,000',
      visualAsset: { type: 'diagram', diagramType: 'extension_finishes', iconName: 'Sparkles' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
  ];

  const packages: ProjectBuyingPackage[] = [
    {
      id: 'essential',
      name: 'Standard Extension Package',
      tagline: 'Quality construction, reliable materials, and full statutory compliance',
      summary: 'Solid construction, UPVC/aluminium bifolds, flat rooflights, quality shaker kitchen, and durable engineered flooring.',
      features: [
        'Full excavation, concrete footings & building control sign-off',
        'Concealed steel knockthrough creating clear open span',
        'Warm deck flat roof with 2-panel flat glass skylight',
        'Aluminium 3-pane bifold door system',
        'Water underfloor heating across new footprint',
        'Quality stock shaker kitchen with quartz worktops',
        'Building Control final completion certificate',
      ],
      costRange: `£${baseMin.toLocaleString()} – £${Math.round(baseMin * 1.15).toLocaleString()}`,
      costMin: baseMin,
      costMax: Math.round(baseMin * 1.15),
      regulatoryBaselineMet: true,
      visualHighlight: 'Bright, durable open-plan family kitchen with generous natural light.',
    },
    {
      id: 'recommended',
      name: 'Architectural Enhanced',
      tagline: 'Slimline sliding glass, frameless rooflights, and bespoke kitchen island',
      summary: 'Ultra-slim 20mm sliding doors, oversized frameless roof lantern, bespoke German handleless kitchen, and Quooker tap.',
      features: [
        'Engineered flush steel beam integration into ceiling void',
        '4.5m ultra-slim aluminium sliding doors with flush threshold',
        'Large frameless architectural skylight bringing light deep into house',
        'Full-footprint water underfloor heating with smart multi-zone app',
        'Bespoke in-frame or handleless kitchen suite with Dekton stone',
        'Integrated Quooker boiling water tap & Siemens appliance suite',
        'Architectural plastered-in trimless LED lighting design',
      ],
      costRange: `£${Math.round(baseMin * 1.1).toLocaleString()} – £${baseMax.toLocaleString()}`,
      costMin: Math.round(baseMin * 1.1),
      costMax: baseMax,
      regulatoryBaselineMet: true,
      visualHighlight: 'Seamless indoor-outdoor architectural living space with statement island.',
    },
    {
      id: 'premium',
      name: 'Grand Bespoke Luxury',
      tagline: 'Pillarless corner glazing, natural bookmatched quartzite, and master craftsman joinery',
      summary: 'Cantilever open corner sliding doors, bookmatched natural quartzite, herringbone oak parquet, and architectural smart scenes.',
      features: [
        'Cantilever structural steel frame allowing pillarless corner opening',
        'Floor-to-ceiling oversized minimal-frame sliding glass systems',
        'Bespoke solid timber craftsmanship cabinetry with pantry larder',
        'Bookmatched natural quartzite or Calacatta marble surfaces',
        'Prime herringbone European oak parquet with brass inlay detail',
        'Lutron smart architectural lighting control and discreet sound integration',
        'Full landscape integration and matching exterior porcelain patio',
      ],
      costRange: `£${baseMax.toLocaleString()} – £${Math.round(baseMax * 1.35).toLocaleString()}`,
      costMin: baseMax,
      costMax: Math.round(baseMax * 1.35),
      regulatoryBaselineMet: true,
      visualHighlight: 'Showcase architectural home transformation with no design compromises.',
    },
  ];

  const budgetBreakdown = [
    { category: 'Groundworks & Concrete Foundations', costMin: 12000, costMax: 18000, formatted: '£12,000 – £18,000' },
    { category: 'Structural Steel Frame & Knockthrough', costMin: 14000, costMax: 20000, formatted: '£14,000 – £20,000' },
    { category: 'Roof Structure, Skylights & Sliders', costMin: 18000 + glazingDelta, costMax: 26000 + glazingDelta, formatted: `£${(18000 + glazingDelta).toLocaleString()} – £${(26000 + glazingDelta).toLocaleString()}` },
    { category: 'Underfloor Heating & Liquid Screed', costMin: 9000, costMax: 14000, formatted: '£9,000 – £14,000' },
    { category: 'Kitchen Cabinetry, Worktops & Taps', costMin: 14000, costMax: 22000, formatted: '£14,000 – £22,000' },
    { category: 'Finishes, Flooring & Decoration', costMin: 8000, costMax: 12000, formatted: '£8,000 – £12,000' },
  ];

  const costDrivers: BudgetCostDriverCard[] = [
    {
      id: 'driver-glazing',
      title: 'Glazing: Bifolds vs Slimline Sliders',
      description: 'Standard bifolds have wider vertical sightlines (120mm–150mm). Ultra-slim sliders feature 20mm sightlines with large uninterrupted glass panels.',
      impact: 'high',
      exampleText: 'Aluminium bifolds are £4,000–£6,000; bespoke slimline sliders with oversized panels range £8,000–£14,000.',
      costDeltaLabel: '±£3,000 to £6,000',
    },
    {
      id: 'driver-steel',
      title: 'Structural Steel Complexity & Span',
      description: 'A simple rear knockthrough requires a single steel beam. Opening up the side return and rear simultaneously requires a multi-steel goalpost frame.',
      impact: 'high',
      exampleText: 'Single RSJ beam: ~£4,500 fabricated & fitted; complex goalpost with padstones and spliced connections: £9,000–£15,000.',
      costDeltaLabel: '±£4,000 to £8,000',
    },
    {
      id: 'driver-kitchen',
      title: 'Kitchen Specification Level',
      description: 'Stock cabinetry with laminate tops vs bespoke in-frame cabinets with 30mm Calacatta quartz and Bora downdraft induction.',
      impact: 'high',
      exampleText: 'Quality stock kitchen with quartz: £12,000–£18,000; bespoke German or handcrafted in-frame joinery: £25,000–£45,000+.',
      costDeltaLabel: '±£8,000 to £20,000+',
    },
  ];

  const checksToConfirm: ConfirmCheckItem[] = [
    {
      id: 'check-drainage',
      issue: 'Thames Water public sewer proximity in the garden.',
      whatWeDo: 'We conduct an early CCTV drainage survey and submit a Thames Water Build-Over Agreement application before groundwork starts.',
      importance: 'high',
    },
    {
      id: 'check-party-wall',
      issue: 'Party Wall Act notices to adjoining neighbours.',
      whatWeDo: 'We prepare and serve statutory Party Wall notices 2 months before construction, providing structural calculations to surveyors.',
      importance: 'high',
    },
    {
      id: 'check-planning',
      issue: 'Planning Permission vs Permitted Development (Part 1 Class A).',
      whatWeDo: 'We confirm whether your extension dimensions comply with permitted development (up to 4m rear extension for single storey) or require full householder planning.',
      importance: 'high',
    },
  ];

  const customerChoices: CustomerDecisionItem[] = [
    {
      id: 'glazing',
      category: 'Glazing Design',
      title: 'Rear Garden Patio Doors',
      currentValue:
        glazingChoice === 'frameless_corner'
          ? 'Pillarless Open Corner'
          : glazingChoice === 'upvc_bifolds'
          ? 'Aluminium Bifolds'
          : 'Slimline Sliding Doors',
      options: [
        { id: 'aluminium_sliders', label: 'Slimline Sliding Doors (20mm sightlines)', priceIndicator: '££', impact: 'Large uninterrupted glass panels with minimal framing' },
        { id: 'frameless_corner', label: 'Pillarless Open Corner Sliders', priceIndicator: '£££', impact: 'Entire corner floats open to garden (+£4,500 approx)' },
        { id: 'upvc_bifolds', label: 'Classic Aluminium Bifolds', priceIndicator: '£', impact: 'Folds back fully to open wall aperture (-£2,000 approx)' },
      ],
    },
  ];

  const matchedCaseStudy = caseStudiesData.find((c) => c.id === 'ealing-rear-extension') || caseStudiesData[0];

  return {
    glance: {
      projectTitle: 'Single Storey Rear Extension & Kitchen',
      projectType: 'House Extension',
      workAreasCount: 6,
      approxDuration: '12 to 16 weeks',
      earlyBudgetRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      budgetMin: baseMin,
      budgetMax: baseMax,
      biggestCostDrivers: ['Structural Steel Goalpost Frame', 'Glazing & Sliding Door System', 'Kitchen & Island Specification'],
      mainThingToCheck: 'Thames Water build-over agreement & Party Wall Act',
    },
    stages,
    packages,
    budgetBreakdown,
    totalEarlyBudget: {
      min: baseMin,
      max: baseMax,
      formatted: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
    },
    costDrivers,
    checksToConfirm,
    customerChoices,
    relevantCaseStudy: {
      title: matchedCaseStudy.title,
      location: matchedCaseStudy.location,
      projectType: matchedCaseStudy.projectType,
      duration: matchedCaseStudy.duration,
      cost: matchedCaseStudy.indicativeCost,
      coverImage: matchedCaseStudy.coverImage,
      slug: matchedCaseStudy.slug,
      whatCustomerWanted: matchedCaseStudy.customerObjective,
      whatStContractorsDid: matchedCaseStudy.solution,
      result: matchedCaseStudy.testimonial?.quote || 'Transformed how our family lives every day.',
    },
  };
}

// =============================================================================
// 5. KITCHEN RENOVATION ROADMAP BUILDER
// =============================================================================

function buildKitchenRoadmap(
  state: ProjectState,
  choices: Record<string, string>
): ProjectRoadmapModel {
  const baseMin = 22000;
  const baseMax = 38000;

  const stages: RoadmapStageCard[] = [
    {
      id: 'k-stage-1',
      stepNumber: 1,
      name: 'Strip-out & Service Isolation',
      badge: 'Preparation',
      whatIsThis: 'Removal of old cabinets, tiles, worktops, floor coverings, and safe disconnection of gas, water, and electrical circuits.',
      whyNeeded: 'Clears the space back to clean bare walls and floor to allow precision plumbing and electrical layout alterations.',
      possibleWorks: ['Disconnect gas cooker with Gas Safe certificate', 'Strip old cabinetry and tile splashbacks', 'Check subfloor flatness'],
      choices: [],
      costMin: 1200,
      costMax: 1800,
      costFormatted: '£1,200 – £1,800',
      visualAsset: { type: 'diagram', diagramType: 'kitchen_strip', iconName: 'Trash2' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'k-stage-2',
      stepNumber: 2,
      name: 'First-Fix Plumbing & Electrical Chasing',
      badge: 'M&E Services',
      whatIsThis: 'Chasing walls for double socket circuits, dedicated induction cooker supply, island sink water feeds, and extractor ducting.',
      whyNeeded: 'Modern kitchens require high-power dedicated electrical circuits and precise waste drops for dishwashers and boiling taps.',
      possibleWorks: ['Dedicated 32A/40A cooker feed', 'Under-cabinet lighting circuits', 'Plumbing manifold for island sink'],
      choices: [],
      costMin: 2800,
      costMax: 4200,
      costFormatted: '£2,800 – £4,200',
      visualAsset: { type: 'diagram', diagramType: 'kitchen_services', iconName: 'Zap' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'k-stage-3',
      stepNumber: 3,
      name: 'Cabinetry & Custom Joinery Fitting',
      badge: 'Cabinetry',
      whatIsThis: 'Installation of floor units, tall pantry housings, integrated appliance towers, and feature central island.',
      whyNeeded: 'Creates the core ergonomic storage, prep space, and focal dining zone in your kitchen.',
      possibleWorks: ['Assemble and laser-level all carcass units', 'Fit integrated pull-out pantries and soft-close corner mechanisms', 'Fit decorative end panels and plinths'],
      choices: [],
      costMin: 8500,
      costMax: 15000,
      costFormatted: '£8,500 – £15,000',
      visualAsset: { type: 'diagram', diagramType: 'kitchen_units', iconName: 'ChefHat' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'k-stage-4',
      stepNumber: 4,
      name: 'Stone Worktop Templating & Installation',
      badge: 'Worktops',
      whatIsThis: 'Digital laser templating, factory CNC cutting, and fitting of 20mm or 30mm polished quartz or Dekton sintered stone.',
      whyNeeded: 'Provides a non-porous, scratch-resistant, heat-tolerant work surface with seamless undermount sink cut-outs.',
      possibleWorks: ['Digital laser templating on site', 'Factory polish cut-outs for undermount sink and flush induction hob', 'Install mitred waterfall island side panels'],
      choices: [],
      costMin: 4000,
      costMax: 7500,
      costFormatted: '£4,000 – £7,500',
      visualAsset: { type: 'diagram', diagramType: 'worktop_fitting', iconName: 'Layers' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'k-stage-5',
      stepNumber: 5,
      name: 'Flooring, Lighting & Final Handover',
      badge: 'Finishing Touches',
      whatIsThis: 'Laying engineered oak or porcelain floor, fitting pendant lights above island, splashback tiling, and testing appliances.',
      whyNeeded: 'Delivers a ready-to-use, polished kitchen built to last for decades.',
      possibleWorks: ['Install herringbone oak or 600x600 porcelain', 'Connect boiling water tap and induction suite', 'Full snagging inspection and warranty sign-off'],
      choices: [],
      costMin: 5500,
      costMax: 9500,
      costFormatted: '£5,500 – £9,500',
      visualAsset: { type: 'diagram', diagramType: 'kitchen_finishes', iconName: 'Sparkles' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
  ];

  const packages: ProjectBuyingPackage[] = [
    {
      id: 'essential',
      name: 'Quality Shaker Package',
      tagline: 'Timeless shaker cabinetry with durable polished quartz',
      summary: 'Durable painted shaker units, 20mm quartz worktops, integrated appliance pack, and commercial flooring.',
      features: ['Stock painted shaker cabinetry', '20mm White Calacatta quartz worktops', 'Integrated oven, hob & dishwasher package', 'Under-cabinet LED task lighting', 'Engineered timber or porcelain floor'],
      costRange: `£${baseMin.toLocaleString()} – £${Math.round(baseMin * 1.15).toLocaleString()}`,
      costMin: baseMin,
      costMax: Math.round(baseMin * 1.15),
      regulatoryBaselineMet: true,
      visualHighlight: 'Classic British shaker kitchen built with quality trade durability.',
    },
    {
      id: 'recommended',
      name: 'Bespoke In-Frame / German Suite',
      tagline: 'Custom in-frame detailing, statement island, and Quooker tap',
      summary: 'Solid timber in-frame or handleless contemporary German cabinetry, 30mm Dekton stone, and Quooker Flex tap.',
      features: ['Bespoke in-frame or German handleless units', '30mm Dekton heatproof sintered stone worktops', 'Quooker instant boiling water tap', 'Full-height pull-out pantry larder', 'Siemens / Bosch integrated appliance suite', 'Dimmable architectural lighting scenes'],
      costRange: `£${Math.round(baseMin * 1.15).toLocaleString()} – £${baseMax.toLocaleString()}`,
      costMin: Math.round(baseMin * 1.15),
      costMax: baseMax,
      regulatoryBaselineMet: true,
      visualHighlight: 'Showpiece entertaining kitchen with premium stone and tactile cabinetry.',
    },
    {
      id: 'premium',
      name: 'Master Craftsman Luxury',
      tagline: 'Handmade solid oak cabinetry with Bora cooktop and natural quartzite',
      summary: 'Fully bespoke joinery with dovetail drawers, bookmatched natural quartzite, Bora cooktop, and bespoke bar zone.',
      features: ['Handcrafted solid timber cabinetry with walnut interior drawer boxes', 'Bookmatched natural quartzite or Taj Mahal marble worktops', 'Bora Pure induction cooktop with integrated downdraft extract', 'Miele MasterCool refrigeration suite', 'Integrated breakfast bar / drinks station with pocket doors'],
      costRange: `£${baseMax.toLocaleString()} – £${Math.round(baseMax * 1.35).toLocaleString()}`,
      costMin: baseMax,
      costMax: Math.round(baseMax * 1.35),
      regulatoryBaselineMet: true,
      visualHighlight: 'Uncompromising luxury kitchen crafted to exact architectural drawings.',
    },
  ];

  const budgetBreakdown = [
    { category: 'Strip-out & Electrical/Plumbing Alterations', costMin: 4000, costMax: 6000, formatted: '£4,000 – £6,000' },
    { category: 'Kitchen Cabinetry & Island Units', costMin: 8500, costMax: 15000, formatted: '£8,500 – £15,000' },
    { category: 'Quartz or Sintered Stone Worktops', costMin: 4000, costMax: 7500, formatted: '£4,000 – £7,500' },
    { category: 'Appliances, Sinks & Quooker Tap', costMin: 3500, costMax: 6500, formatted: '£3,500 – £6,500' },
    { category: 'Flooring, Splashbacks & Decoration', costMin: 3000, costMax: 5000, formatted: '£3,000 – £5,000' },
  ];

  const costDrivers: BudgetCostDriverCard[] = [
    {
      id: 'driver-cabinetry',
      title: 'Cabinetry Build: Stock vs Bespoke In-Frame',
      description: 'Standard flat-pack or rigid stock units vs bespoke solid timber in-frame construction with custom painted finishes.',
      impact: 'high',
      exampleText: 'Quality stock units: £6,000–£10,000; handmade bespoke in-frame joinery: £18,000–£32,000+.',
      costDeltaLabel: '±£8,000 to £16,000',
    },
    {
      id: 'driver-worktop',
      title: 'Worktop Material & Waterfall Edges',
      description: '20mm standard quartz vs 30mm premium marble-effect stone with mitred waterfall end panels down to the floor.',
      impact: 'medium',
      exampleText: 'Straight runs in standard quartz are cost-efficient; waterfall island sides double stone fabrication time.',
      costDeltaLabel: '±£1,500 to £3,500',
    },
  ];

  const checksToConfirm: ConfirmCheckItem[] = [
    {
      id: 'check-gas-electric',
      issue: 'Consumer unit electrical capacity for induction cooktop.',
      whatWeDo: 'We inspect your main electrical fuse and consumer unit to verify whether an upgraded 32A/40A cooker cable run is needed.',
      importance: 'high',
    },
  ];

  const customerChoices: CustomerDecisionItem[] = [
    {
      id: 'kitchen-style',
      category: 'Design Style',
      title: 'Kitchen Cabinet Style',
      currentValue: 'Modern Handleless',
      options: [
        { id: 'handleless', label: 'Contemporary Handleless', priceIndicator: '££', impact: 'Clean, minimalist lines with recessed finger rails' },
        { id: 'shaker', label: 'Classic Painted Shaker', priceIndicator: '££', impact: 'Timeless framed doors in curated heritage tones' },
        { id: 'in_frame', label: 'Bespoke In-Frame Joinery', priceIndicator: '£££', impact: 'Traditional British craftsmanship with visible butt hinges' },
      ],
    },
  ];

  const matchedCaseStudy = caseStudiesData.find((c) => c.id === 'chiswick-kitchen') || caseStudiesData[0];

  return {
    glance: {
      projectTitle: 'Bespoke Kitchen Transformation',
      projectType: 'Kitchen Renovation',
      workAreasCount: 5,
      approxDuration: '3 to 5 weeks',
      earlyBudgetRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      budgetMin: baseMin,
      budgetMax: baseMax,
      biggestCostDrivers: ['Cabinetry Construction Tier', 'Worktop Material & Island Waterfall', 'Appliance Package'],
      mainThingToCheck: 'Consumer unit electrical capacity & extractor ducting run',
    },
    stages,
    packages,
    budgetBreakdown,
    totalEarlyBudget: {
      min: baseMin,
      max: baseMax,
      formatted: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
    },
    costDrivers,
    checksToConfirm,
    customerChoices,
    relevantCaseStudy: {
      title: matchedCaseStudy.title,
      location: matchedCaseStudy.location,
      projectType: matchedCaseStudy.projectType,
      duration: matchedCaseStudy.duration,
      cost: matchedCaseStudy.indicativeCost,
      coverImage: matchedCaseStudy.coverImage,
      slug: matchedCaseStudy.slug,
      whatCustomerWanted: matchedCaseStudy.customerObjective,
      whatStContractorsDid: matchedCaseStudy.solution,
      result: matchedCaseStudy.testimonial?.quote || 'Transformed how we cook and entertain.',
    },
  };
}

// =============================================================================
// 6. GENERAL / WHOLE HOUSE RENOVATION ROADMAP BUILDER
// =============================================================================

function buildGeneralRenovationRoadmap(
  state: ProjectState,
  choices: Record<string, string>
): ProjectRoadmapModel {
  const baseMin = 45000;
  const baseMax = 75000;

  const stages: RoadmapStageCard[] = [
    {
      id: 'gen-stage-1',
      stepNumber: 1,
      name: 'Comprehensive Strip-out & Structural Investigation',
      badge: 'Preparation',
      whatIsThis: 'Systematic removal of worn fixtures, carpets, cracked plaster, and investigation of underlying timber frames and services.',
      whyNeeded: 'Reveals the true structural condition of period walls, joists, and old lead/galvanised pipework.',
      possibleWorks: ['Strip floor coverings and damaged wall linings', 'Inspect joist integrity under suspended timber floors', 'Clear all debris safely via licensed skips'],
      choices: [],
      costMin: 3500,
      costMax: 6000,
      costFormatted: '£3,500 – £6,000',
      visualAsset: { type: 'diagram', diagramType: 'strip_investigation', iconName: 'Trash2' },
      needsCheck: true,
      checkDescription: 'Damp, timber beetle, or historic structural movement in period masonry.',
      contractorSolution: 'Our structural team inspects brickwork and subfloors during strip-out and carries out remedial stitching where required.',
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gen-stage-2',
      stepNumber: 2,
      name: 'Complete Rewire & Plumbing Overhaul',
      badge: 'M&E Infrastructure',
      whatIsThis: 'Full replacement of electrical wiring, new metal consumer unit, and new copper/multilayer central heating circuits.',
      whyNeeded: 'Ensures 100% electrical safety to BS 7671 standards and reliable, energy-efficient heating in every room.',
      possibleWorks: ['Full first-fix rewiring throughout all zones', 'Install new A-rated condensing combi boiler or heat pump interface', 'High-speed Cat6 data distribution'],
      choices: [],
      costMin: 12000,
      costMax: 18000,
      costFormatted: '£12,000 – £18,000',
      visualAsset: { type: 'diagram', diagramType: 'services_overhaul', iconName: 'Zap' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gen-stage-3',
      stepNumber: 3,
      name: 'Wall Insulation, Plastering & Joinery',
      badge: 'Building Fabric',
      whatIsThis: 'Breathable internal wall insulation, smooth multi-finish plaster skimming throughout, and bespoke timber architraves.',
      whyNeeded: 'Dramatically improves EPC energy ratings, soundproofing between rooms, and provides crisp, straight walls.',
      possibleWorks: ['Internal wall insulation to external solid brick walls', 'Re-skim all ceilings and walls', 'Replace all skirting boards and internal doors'],
      choices: [],
      costMin: 14000,
      costMax: 22000,
      costFormatted: '£14,000 – £22,000',
      visualAsset: { type: 'diagram', diagramType: 'plaster_joinery', iconName: 'Layers' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
    {
      id: 'gen-stage-4',
      stepNumber: 4,
      name: 'Flooring, High-End Decoration & Handover',
      badge: 'Finishes',
      whatIsThis: 'Engineered oak flooring, luxury bathroom and kitchen installations, designer paint finishes, and final certification.',
      whyNeeded: 'Delivers a completely rejuvenated home ready for contemporary living.',
      possibleWorks: ['Engineered oak plank or luxury carpets', 'Designer paint scheme throughout', 'Building control and NICEIC electrical sign-off'],
      choices: [],
      costMin: 16000,
      costMax: 29000,
      costFormatted: '£16,000 – £29,000',
      visualAsset: { type: 'diagram', diagramType: 'completed_renovation', iconName: 'Sparkles' },
      needsCheck: false,
      includedByDefault: true,
      optional: false,
    },
  ];

  const packages: ProjectBuyingPackage[] = [
    {
      id: 'essential',
      name: 'Essential Renovation',
      tagline: 'Reliable, complete modernization meeting all statutory standards',
      summary: 'Full rewiring, new heating, fresh plaster, trade emulsion, and durable flooring throughout.',
      features: ['Full electrical rewire with NICEIC certificate', 'New central heating boiler and radiators', 'Complete plaster re-skim throughout', 'Quality laminate or engineered oak flooring', 'Clean trade paint decoration throughout'],
      costRange: `£${baseMin.toLocaleString()} – £${Math.round(baseMin * 1.15).toLocaleString()}`,
      costMin: baseMin,
      costMax: Math.round(baseMin * 1.15),
      regulatoryBaselineMet: true,
      visualHighlight: 'Clean, safe, completely renewed home.',
    },
    {
      id: 'recommended',
      name: 'Enhanced Period Restoration',
      tagline: 'Architectural finishes, designer fixtures, and smart lighting',
      summary: 'Restores period cornicing, premium engineered European oak, designer bathroom suites, and smart heating controls.',
      features: ['Full rewire with dimmable LED circuits & smart thermostats', 'High-efficiency unvented hot water cylinder system', 'Restoration of decorative plaster coving & architraves', 'Engineered oak plank or parquet flooring', 'Designer bathroom and kitchen installations', 'Farrow & Ball / Little Greene heritage paint palette'],
      costRange: `£${Math.round(baseMin * 1.15).toLocaleString()} – £${baseMax.toLocaleString()}`,
      costMin: baseMin,
      costMax: baseMax,
      regulatoryBaselineMet: true,
      visualHighlight: 'Refined architectural character combined with modern efficiency.',
    },
    {
      id: 'premium',
      name: 'Bespoke Luxury Transformation',
      tagline: 'Craftsman joinery, seamless microcement, and smart home automation',
      summary: 'Custom built-in wardrobes, bookmatched stone, architectural trimless lighting, and full acoustic insulation.',
      features: ['Bespoke master bedroom dressing room and joinery', 'Seamless microcement or chevron French oak parquet', 'Architectural plastered-in trimless LED lighting scenes', 'Lutron smart home automation for lighting and blinds', 'Underfloor heating across ground and bathroom zones'],
      costRange: `£${baseMax.toLocaleString()} – £${Math.round(baseMax * 1.35).toLocaleString()}`,
      costMin: baseMax,
      costMax: Math.round(baseMax * 1.35),
      regulatoryBaselineMet: true,
      visualHighlight: 'Luxury London residence finished to prime standards.',
    },
  ];

  const budgetBreakdown = [
    { category: 'Strip-out & Structural Investigation', costMin: 3500, costMax: 6000, formatted: '£3,500 – £6,000' },
    { category: 'Electrical Rewiring & Plumbing System', costMin: 12000, costMax: 18000, formatted: '£12,000 – £18,000' },
    { category: 'Insulation, Plastering & Joinery', costMin: 14000, costMax: 22000, formatted: '£14,000 – £22,000' },
    { category: 'Flooring, Decoration & Certification', costMin: 16000, costMax: 29000, formatted: '£16,000 – £29,000' },
  ];

  const costDrivers: BudgetCostDriverCard[] = [
    {
      id: 'driver-period-condition',
      title: 'Historic Masonry & Subfloor Condition',
      description: 'Period London homes often have uninsulated solid brickwork or decayed joists discovered during strip-out.',
      impact: 'high',
      exampleText: 'Sound existing timbers require simple boarding; repairing rot or underpinning requires structural carpentry.',
      costDeltaLabel: '±£3,000 to £7,000',
    },
  ];

  const checksToConfirm: ConfirmCheckItem[] = [
    {
      id: 'check-rewire',
      issue: 'Mains electrical fuse rating and earth bonding.',
      whatWeDo: 'We carry out an Electrical Installation Condition Report (EICR) to verify whether UKPN service head upgrade is required.',
      importance: 'high',
    },
  ];

  const customerChoices: CustomerDecisionItem[] = [
    {
      id: 'finish-tier',
      category: 'Overall Spec',
      title: 'Finish & Material Palette',
      currentValue: 'Enhanced Architectural',
      options: [
        { id: 'standard', label: 'Contemporary Standard', priceIndicator: '££', impact: 'Clean, modern, and cost-controlled' },
        { id: 'enhanced', label: 'Enhanced Period Restoration', priceIndicator: '£££', impact: 'Authentic period features with modern performance' },
        { id: 'luxury', label: 'Bespoke Luxury', priceIndicator: '£££', impact: 'Full custom joinery and architectural lighting' },
      ],
    },
  ];

  const matchedCaseStudy = caseStudiesData.find((c) => c.id === 'richmond-victorian-renovation') || caseStudiesData[0];

  return {
    glance: {
      projectTitle: 'Residential Property Renovation',
      projectType: 'Home Renovation',
      workAreasCount: 5,
      approxDuration: '8 to 14 weeks',
      earlyBudgetRange: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
      budgetMin: baseMin,
      budgetMax: baseMax,
      biggestCostDrivers: ['Electrical & Plumbing Overhaul', 'Plastering & Joinery Extent', 'Kitchen & Bathroom Fixtures'],
      mainThingToCheck: 'Existing electrical capacity & historic subfloor condition',
    },
    stages,
    packages,
    budgetBreakdown,
    totalEarlyBudget: {
      min: baseMin,
      max: baseMax,
      formatted: `£${baseMin.toLocaleString()} – £${baseMax.toLocaleString()}`,
    },
    costDrivers,
    checksToConfirm,
    customerChoices,
    relevantCaseStudy: {
      title: matchedCaseStudy.title,
      location: matchedCaseStudy.location,
      projectType: matchedCaseStudy.projectType,
      duration: matchedCaseStudy.duration,
      cost: matchedCaseStudy.indicativeCost,
      coverImage: matchedCaseStudy.coverImage,
      slug: matchedCaseStudy.slug,
      whatCustomerWanted: matchedCaseStudy.customerObjective,
      whatStContractorsDid: matchedCaseStudy.solution,
      result: matchedCaseStudy.testimonial?.quote || 'Delivered exactly what they promised on time.',
    },
  };
}
