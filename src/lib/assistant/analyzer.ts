/**
 * AI Construction Scope & Quantity Surveying Calculation Engine
 * 
 * Accurately interprets ANY residential query — from a simple 2-word cosmetic task
 * (e.g. "decorate kitchen", "plaster hallway", "fit quartz worktop") to complex
 * architectural transformations (e.g. "6m rear extension with Crittall doors & RSJ").
 *
 * Conforms to UK Building Regulations (Part A, B, E, L, P), Party Wall Act 1996,
 * London 2026 Quantity Surveyor rates, and GEMINI.md Section 13 (AI Rules).
 */

import {
  ExtractedProject,
  ExtractedRoom,
  ExtractedWorkItem,
  MissingQuestion,
  PotentialConsideration,
  CustomSpecificationOption,
  ThingToConsider,
  TradePhaseBreakdown,
} from './types';
import { ProjectType } from '@/lib/planner/quiz-engine';

/**
 * Universal UK Construction & Trade Intelligence Engine
 */
export function extractWithUKBuildingRules(text: string): ExtractedProject {
  const raw = (text || '').trim();
  const lower = raw.toLowerCase();

  // ---------------------------------------------------------------------------
  // 1. INTENT & DOMAIN CLASSIFIERS
  // ---------------------------------------------------------------------------
  const hasDecorate = lower.includes('decorate') || lower.includes('paint') || lower.includes('painting') || lower.includes('wallpaper') || lower.includes('redecorate') || lower.includes('emulsion') || lower.includes('gloss');
  const hasPlaster = lower.includes('plaster') || lower.includes('skimming') || lower.includes('drylining') || lower.includes('plasterboard') || lower.includes('re-plaster');
  const hasTiling = lower.includes('tiling') || lower.includes('tile') || lower.includes('tiles') || lower.includes('splashback') || lower.includes('grout');
  const hasFlooring = lower.includes('flooring') || lower.includes('floor') || lower.includes('herringbone') || lower.includes('parquet') || lower.includes('lvt') || lower.includes('laminate') || lower.includes('microcement');
  const hasJoinery = lower.includes('wardrobe') || lower.includes('alcove') || lower.includes('cupboard') || lower.includes('cabinet') || lower.includes('media wall') || lower.includes('shelving') || lower.includes('doors');
  
  const hasWallRemoval = lower.includes('knock') || lower.includes('remove wall') || lower.includes('take down wall') || lower.includes('taking out the wall') || lower.includes('load bearing') || lower.includes('rsj') || lower.includes('steel beam') || lower.includes('open plan') || lower.includes('opening up');
  const hasChimney = lower.includes('chimney') || lower.includes('flue') || lower.includes('breast');

  const hasKitchen = lower.includes('kitchen') || lower.includes('worktop') || lower.includes('quartz') || lower.includes('island');
  const hasBathroom = lower.includes('bathroom') || lower.includes('ensuite') || lower.includes('wetroom') || lower.includes('wet room') || lower.includes('shower') || lower.includes('cloakroom') || lower.includes('toilet') || lower.includes('wc');
  const hasLoft = lower.includes('loft') || lower.includes('attic') || lower.includes('dormer') || lower.includes('mansard');
  const hasGarage = lower.includes('garage');
  const hasExtension = lower.includes('extension') || lower.includes('extend') || lower.includes('side return') || lower.includes('wraparound') || lower.includes('wrap around') || lower.includes('conservatory') || lower.includes('orangery');
  const hasBasement = lower.includes('basement') || lower.includes('cellar');
  const hasGardenRoom = (lower.includes('garden') && (lower.includes('studio') || lower.includes('office') || lower.includes('room') || lower.includes('annexe') || lower.includes('outbuilding'))) && !hasExtension;
  const hasDriveway = lower.includes('driveway') || lower.includes('paving') || lower.includes('patio') || lower.includes('resin') || lower.includes('block paving') || lower.includes('landscaping');
  const hasFullHouse = lower.includes('full house') || lower.includes('full renovation') || lower.includes('whole house') || lower.includes('gut renovat') || lower.includes('complete refurbishment') || lower.includes('back to brick');

  // Room targets
  const mentionsHallway = lower.includes('hallway') || lower.includes('hall') || lower.includes('stairs') || lower.includes('landing');
  const mentionsBedroom = lower.includes('bedroom') || lower.includes('master');
  const mentionsLiving = lower.includes('living') || lower.includes('lounge') || lower.includes('reception') || lower.includes('sitting');
  const mentionsUtility = lower.includes('utility') || lower.includes('laundry') || lower.includes('boot room');

  // Dimensions
  let extractedLength = 4;
  let extractedWidth = 3;
  const meterMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|metre|meter|metres|meters)/i);
  if (meterMatch) {
    extractedLength = parseFloat(meterMatch[1]);
  }

  // ===========================================================================
  // DOMAIN 1: DECORATING & PAINTING (PURE COSMETIC OR MULTI-ROOM)
  // ===========================================================================
  if (hasDecorate && !hasExtension && !hasLoft && !hasGarage && !hasBasement && !hasWallRemoval && !hasFullHouse) {
    const isKitchenDeco = hasKitchen;
    const isBathroomDeco = hasBathroom;
    const isMultiRoom = lower.includes('whole') || lower.includes('house') || lower.includes('flat') || (mentionsBedroom && mentionsLiving);

    const roomLabel = isKitchenDeco
      ? 'Kitchen'
      : isBathroomDeco
      ? 'Bathroom'
      : isMultiRoom
      ? 'Entire Property'
      : mentionsBedroom
      ? 'Bedroom'
      : mentionsLiving
      ? 'Living Room'
      : mentionsHallway
      ? 'Hallway & Staircase'
      : 'Living Space';

    const lowCost = isMultiRoom ? 4200 : isKitchenDeco ? 950 : isBathroomDeco ? 750 : 850;
    const highCost = isMultiRoom ? 9500 : isKitchenDeco ? 2200 : isBathroomDeco ? 1800 : 1950;
    const timelineDaysMin = isMultiRoom ? 10 : 3;
    const timelineDaysMax = isMultiRoom ? 18 : 5;

    return {
      projectType: isKitchenDeco ? 'kitchen' : isBathroomDeco ? 'bathroom' : 'other',
      projectTypeDisplay: `${roomLabel} Interior Decorating & Surface Refurbishment`,
      originalDescription: raw,
      generalDescription: `Professional surface preparation, stain-blocking, crack repair, and redecoration for ${roomLabel.toLowerCase()}. Includes thorough surface cleaning, filling imperfections with fine surface filler, sanding smooth, applying mist/primer coats, and applying 2 coats of durable, high-opacity, scrub-resistant emulsion (Class 1 scrub rated) to ceilings and walls, with satinwood/eggshell enamel to all skirtings, architraves, and window sills.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: `£18 – £35 / m² (Wall/Ceiling Surface)`,
        notes: `Turnkey trade decorating including surface preparation, premium trade paints, woodwork enamel, protection of fixtures, and final clean-down.`,
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Trade Professional Finish',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Full preparation, filling, 2 coats of durable Dulux Trade Diamond Matt / Crown Clean Extreme, and satinwood to woodwork.',
          highlights: ['Sugar soap wash & surface sanding', 'Dual coat scrub-resistant wall emulsion', 'Durable acrylic satinwood on woodwork', 'Full floor & fixture protection'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Designer Palette & Cabinet Refresh',
          priceImpact: `+£600 – £1,400`,
          description: 'Farrow & Ball, Little Greene, or Paint & Paper Library designer emulsions with fine brush/roller finish, plus siliconing and woodwork spraying.',
          highlights: ['Farrow & Ball / Little Greene designer paints', 'Specialist anti-mould bathroom/kitchen formulation', 'Precision sharp-line masking & perimeter caulking', 'Woodwork & trim spray/fine-satin application'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Full Cabinet Respray & Feature Tiling',
          priceImpact: `+£1,500 – £2,800`,
          description: 'Factory-grade 2-pack polyurethane spray painting of cabinet doors/drawers, designer handle upgrades, and new splashback tile installation.',
          highlights: ['Kitchen cabinet doors spray painted off-site/on-site', 'New hardware and soft-close hinge alignment', 'Tiled splashback refresh or regrouting', 'Full high-end architectural handover'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Living & Logistics',
          title: 'Surface Degreasing & Preparation',
          explanation: 'In kitchen areas, cooking grease and steam residues must be thoroughly degreased with sugar soap prior to sanding, otherwise paint will blister or peel.',
          impactLevel: 'high',
        },
        {
          category: 'Structural & Engineering',
          title: 'Paint Durability & Moisture Resistance',
          explanation: 'Kitchens and bathrooms require Class 1 scrub-rated moisture-resistant emulsion (e.g. Dulux Diamond Matt or Zinsser Perma-White) to withstand steam, grease, and regular wiping without burnishing.',
          impactLevel: 'medium',
        },
        {
          category: 'Living & Logistics',
          title: 'Protection of Worktops & Appliances',
          explanation: 'All worktops, appliances, flooring, and cabinetry will be fully masked and protected with heavy-duty Correx sheeting and dust sheets before any sanding or painting begins.',
          impactLevel: 'low',
        },
      ],
      tradePhaseBreakdown: [
        {
          phase: 1,
          title: 'Protection, Masking & Surface Preparation',
          estimatedWeeks: 'Day 1',
          estimatedCostRange: `£350 – £700`,
          items: ['Mask all worktops, units, and floor with Correx & tape', 'Degrease walls & ceiling with sugar soap solution', 'Rake out cracks, sand surface, and apply flexible filler'],
        },
        {
          phase: 2,
          title: 'Priming, Caulking & Ceiling Coating',
          estimatedWeeks: 'Day 2',
          estimatedCostRange: `£300 – £650`,
          items: ['Apply stain block primer to any water/grease marks', 'Caulk all internal corners, architraves, and skirtings', 'Apply 2 coats of brilliant white dead-flat ceiling emulsion'],
        },
        {
          phase: 3,
          title: 'Wall Coating & Woodwork Enamel',
          estimatedWeeks: 'Day 3–4',
          estimatedCostRange: `£400 – £850`,
          items: ['Apply 2 full coats of chosen durable scrub-rated wall paint', 'Sand and apply 2 coats of satinwood/eggshell to woodwork', 'Remove masking tape, renew sanitary silicone, and vacuum clean'],
        },
      ],
      projectRequirements: [
        `Prepare and redecorate ${roomLabel.toLowerCase()}`,
        'Degrease, fill cracks, and sand all surfaces',
        'Apply 2 coats of moisture-resistant wall emulsion',
        'Paint all woodwork, skirtings, and window sills',
      ],
      rooms: [
        { name: `${roomLabel} Decorating`, sizeCategory: 'medium', dimensions: { length: 4, width: 3.5, areaM2: 14 }, purpose: 'High-quality decorative surface refurbishment' },
      ],
      likelyWorks: [
        { category: 'Fit-Out & Joinery', workTitle: 'Surface Preparation & Filling', description: 'Degrease with sugar soap, fill hairline cracks, and sand smooth.', tradeRequired: 'Painter & Decorator' },
        { category: 'Fit-Out & Joinery', workTitle: 'Ceiling & Wall Emulsioning', description: 'Apply 2 coats of scrub-resistant washable emulsion.', tradeRequired: 'Painter & Decorator' },
        { category: 'Fit-Out & Joinery', workTitle: 'Woodwork Painting & Silicone', description: 'Satinwood enamel on skirtings, frames, and sills; new perimeter seal.', tradeRequired: 'Painter & Decorator' },
      ],
      missingQuestions: [
        { id: 'paint_brand', question: 'Do you have a preferred paint brand (e.g. Dulux Trade, Farrow & Ball, Little Greene)?', reason: 'Affects material cost and number of coats required.' },
        { id: 'woodwork_condition', question: 'Do the woodwork, doors, and window sills also need repainting?', reason: 'Clarifies total preparation and gloss/satinwood scope.' },
      ],
      potentialConsiderations: [
        { topic: 'Moisture Resistance', consideration: 'Kitchens require washable, steam-resistant paint formulations.', riskLevel: 'low' },
      ],
      initialAnswers: { project_type: isKitchenDeco ? 'kitchen' : isBathroomDeco ? 'bathroom' : 'other', goals: ['Fresh clean finish', 'Durable surfaces'] },
      summary: `Interior decorating for ${roomLabel.toLowerCase()} with full preparation and trade-grade finishes.`,
      estimatedTimelineWeeks: { min: 1, max: isMultiRoom ? 3 : 1 },
    };
  }

  // ===========================================================================
  // DOMAIN 2: KITCHEN REFURBISHMENT / CABINET FIT-OUT (WITHOUT MAJOR EXTENSION)
  // ===========================================================================
  if (hasKitchen && !hasExtension && !hasLoft && !hasGarage && !hasWallRemoval && !hasFullHouse) {
    const isWorktopOnly = lower.includes('worktop') && !lower.includes('cabinets') && !lower.includes('units');
    const lowCost = isWorktopOnly ? 2800 : 7500;
    const highCost = isWorktopOnly ? 6500 : 22000;

    return {
      projectType: 'kitchen',
      projectTypeDisplay: isWorktopOnly ? 'Kitchen Worktop Replacement & Splashback' : 'Kitchen Replacement & Refurbishment',
      originalDescription: raw,
      generalDescription: isWorktopOnly
        ? 'Precision templating, fabrication, and installation of solid quartz/granite worktops, undermount sink cut-out, tap plumbing, and new splashback tiling.'
        : 'Complete removal of existing kitchen cabinetry, electrical and plumbing first-fix reconfiguration, assembly and precision fitting of base and wall units, templating and fitting of quartz/solid stone worktops, integrated appliance installation, splashback tiling, and luxury second-fix plumbing and lighting.',
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: '£800 – £1,800 / m²',
        notes: 'Includes cabinetry installation, stone worktops, sink/appliance connections, splashback, and electrical updates.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Modern Standard Kitchen Fit',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Howdens / Magnet cabinetry, 20mm composite worktop, laminate upstands, and integrated appliance connections.',
          highlights: ['Precision cabinet installation & leveling', '20mm quartz or solid laminate worktop', 'Stainless steel undermount sink & chrome tap', '6x LED downlights and appliance wiring'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Bespoke Island & 30mm Quartz Spec',
          priceImpact: `+£5,000 – £9,000`,
          description: 'Handleless or shaker cabinetry, central kitchen island with breakfast bar, 30mm Calacatta quartz with waterfall edge, and boiling water tap.',
          highlights: ['Central island with breakfast bar overhang', '30mm Calacatta Gold / Statuario quartz', 'Quooker instant boiling water tap integration', 'Feature under-cabinet & plinth LED lighting'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Bespoke Architectural Custom Kitchen',
          priceImpact: `+£12,000 – £22,000`,
          description: 'Solid timber painted shaker or veneer cabinetry, Dekton/marble countertops, concealed walk-in pantry, and Miele/Gaggenau suite.',
          highlights: ['Handmade bespoke cabinetry with oak dove-tail drawers', 'Sintered stone Dekton / natural marble worktops', 'Integrated bar / wine cooler cabinet', 'Smart home integrated scenes & extractor'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Drainage & Utilities',
          title: 'Plumbing & Waste Alignments',
          explanation: 'Relocating sinks or dishwashers requires adequate waste fall (minimum 1:40 gradient) to the external soil stack or gully.',
          impactLevel: 'medium',
        },
        {
          category: 'Planning & Legal',
          title: 'Electrical Safety (Part P Building Regs)',
          explanation: 'New kitchen electrical circuits (especially high-power induction hobs, ovens, and boiling taps) require NICEIC certification.',
          impactLevel: 'high',
        },
        {
          category: 'Living & Logistics',
          title: 'Stone Templating Lead Time',
          explanation: 'Solid quartz/stone worktops require precision laser templating after base units are fixed, with a 5–7 day fabrication window before fitting.',
          impactLevel: 'medium',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Strip-Out & Waste Disposal', estimatedWeeks: 'Days 1–2', estimatedCostRange: '£800 – £1,500', items: ['Isolate electrics & water', 'Remove old units, appliances, and tiles', 'Dispose of waste via licensed carrier'] },
        { phase: 2, title: 'First Fix MEP & Plaster Prep', estimatedWeeks: 'Days 3–5', estimatedCostRange: '£1,800 – £3,500', items: ['Run new 32A cooker circuit & socket feeds', 'First fix plumbing for sink, dishwasher & fridge', 'Bond and plaster skim walls smooth'] },
        { phase: 3, title: 'Cabinet Assembly & Precision Fitting', estimatedWeeks: 'Week 2', estimatedCostRange: '£2,500 – £5,500', items: ['Install base & wall units plumb and level', 'Fit corner carousels, pull-out larders & end panels', 'Laser template for quartz stone worktops'] },
        { phase: 4, title: 'Worktop Installation & Second Fix Handover', estimatedWeeks: 'Week 3', estimatedCostRange: '£2,400 – £7,500', items: ['Fit 30mm quartz worktops & undermount sink', 'Connect appliances, induction hob & taps', 'Tile splashbacks, connect LED lights & test'] },
      ],
      projectRequirements: [
        'Strip out old kitchen units and tiles',
        'First-fix plumbing and electrical updates',
        'Fit new cabinetry, stone worktops, and splashback',
        'Connect and test all integrated appliances',
      ],
      rooms: [
        { name: 'Kitchen', sizeCategory: 'medium', dimensions: { length: 4.5, width: 3.2, areaM2: 14.4 }, purpose: 'High-spec kitchen cooking and dining space' },
      ],
      likelyWorks: [
        { category: 'Fit-Out & Joinery', workTitle: 'Kitchen Cabinetry Installation', description: 'Precision fitting of base, wall, and larder units.', tradeRequired: 'Master Kitchen Fitter' },
        { category: 'Plumbing & Electrics', workTitle: 'First & Second Fix MEP', description: 'Plumbing for sink/appliances and NICEIC electrical wiring.', tradeRequired: 'Electrician & Plumber' },
        { category: 'Fit-Out & Joinery', workTitle: 'Stone Worktop & Splashback Fitting', description: 'Solid quartz installation with undermount sink cutout.', tradeRequired: 'Stone Mason / Tiler' },
      ],
      missingQuestions: [
        { id: 'worktop_material', question: 'Do you prefer Quartz, Granite, Sintered Stone (Dekton), or Solid Wood?', reason: 'Primary driver of material cost and durability.' },
        { id: 'appliances_supplied', question: 'Are you supplying your own appliances or do you want our trade package?', reason: 'Affects project procurement schedule.' },
      ],
      potentialConsiderations: [
        { topic: 'Electrical Part P', consideration: 'Kitchen electrical alterations require Building Control Part P certificate.', riskLevel: 'medium' },
      ],
      initialAnswers: { project_type: 'kitchen', goals: ['Modern kitchen', 'Better storage', 'Quartz surfaces'] },
      summary: `Kitchen refurbishment with cabinetry installation, quartz worktops, and MEP connections.`,
      estimatedTimelineWeeks: { min: 2, max: 4 },
    };
  }

  // ===========================================================================
  // DOMAIN 3: BATHROOM / ENSUITE / WETROOM RENOVATION
  // ===========================================================================
  if (hasBathroom && !hasExtension && !hasLoft && !hasGarage && !hasWallRemoval && !hasFullHouse) {
    const isCloakroom = lower.includes('cloakroom') || lower.includes('wc') || lower.includes('downstairs toilet');
    const lowCost = isCloakroom ? 2500 : 6500;
    const highCost = isCloakroom ? 5500 : 15000;

    return {
      projectType: 'bathroom',
      projectTypeDisplay: isCloakroom ? 'Downstairs Cloakroom / WC Renovation' : 'Luxury Bathroom & Wetroom Renovation',
      originalDescription: raw,
      generalDescription: isCloakroom
        ? 'Renovation of compact ground-floor cloakroom including removal of old sanitaryware, waste adaptation, space-saving vanity basin, concealed cistern WC, feature tiling, and extractor ventilation.'
        : 'Full bathroom strip-out, substrate preparation, tanking/waterproofing membrane application, walk-in thermostatic rainfall shower or freestanding bath installation, wall-hung vanity basin, concealed cistern WC, heated towel rail, designer porcelain tiling, and LED lighting.',
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: '£1,200 – £2,400 / m²',
        notes: 'Includes full strip-out, waterproof tanking, plumbing, porcelain tiling, sanitaryware fitting, and testing.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Contemporary Family Bathroom',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Acrylic bath with glass shower screen, chrome thermostatic valve, vanity basin unit, and ceramic wall/floor tiles.',
          highlights: ['Full tanking waterproofing behind wet zones', 'Chrome thermostatic mixer shower', 'Soft-close vanity unit & close-coupled WC', 'Ceramic full-height tiling in shower area'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Walk-In Wetroom & Black/Brass Brassware',
          priceImpact: `+£3,500 – £6,500`,
          description: 'Low-profile wetroom tray with frameless 10mm fluted glass screen, concealed thermostatic valve with brushed brass or matte black finish, wall-hung WC, and large-format porcelain.',
          highlights: ['Frameless 10mm architectural glass panel', 'Brushed brass or matte black concealed brassware', 'Wall-hung vanity with quartz top & illuminated mirror', 'Electric undertile heating with digital thermostat'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Spa Suite with Freestanding Bath & Microcement',
          priceImpact: `+£8,000 – £14,000`,
          description: 'Seamless microcement or bookmatched marble, composite stone freestanding bath with floor-standing tap, recessed LED shower niches, and integrated sound.',
          highlights: ['Freestanding composite stone bath', 'Seamless waterproof microcement walls & floor', 'Recessed niche lighting with warm LED strips', 'Demisting smart mirror with Bluetooth audio'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Drainage & Utilities',
          title: 'Waterproofing & Tanking Membrane',
          explanation: 'All shower and wet areas require a certified liquid or sheet tanking membrane behind tiles to prevent water penetration into joists or downstairs ceilings.',
          impactLevel: 'high',
        },
        {
          category: 'Drainage & Utilities',
          title: 'Water Pressure & Hot Water Delivery',
          explanation: 'Rainfall showers require minimum 1.5–2.0 bar dynamic pressure. Older gravity systems may require a booster pump or unvented cylinder upgrade.',
          impactLevel: 'medium',
        },
        {
          category: 'Planning & Legal',
          title: 'Mechanical Ventilation (Building Regs Part F)',
          explanation: 'Building Regulations require an extractor fan capable of extracting 15 litres/sec with 15-minute overrun timer.',
          impactLevel: 'medium',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Strip-Out & Waste Pipework', estimatedWeeks: 'Days 1–2', estimatedCostRange: '£700 – £1,400', items: ['Isolate water and remove old sanitaryware & tiles', 'Inspect floor joists and repair any water damage', 'Reroute waste pipes and soil pipe connection'] },
        { phase: 2, title: 'Plumbing First-Fix & Tanking', estimatedWeeks: 'Days 3–5', estimatedCostRange: '£1,800 – £3,500', items: ['Install concealed shower valve & pipework', 'Apply waterproof tanking membrane to wet walls', 'Run wiring for illuminated mirror, fan & spotlights'] },
        { phase: 3, title: 'Wall & Floor Porcelain Tiling', estimatedWeeks: 'Week 2', estimatedCostRange: '£1,800 – £4,200', items: ['Lay large-format porcelain tiles on walls & floor', 'Tile recessed shower storage niche', 'Grout with anti-mould waterproof epoxy/cement grout'] },
        { phase: 4, title: 'Sanitaryware Fitting & Testing', estimatedWeeks: 'Days 10–12', estimatedCostRange: '£1,500 – £3,500', items: ['Install glass shower screen, vanity & WC', 'Connect and commission taps and shower valves', 'Silicone perimeter joints and final clean'] },
      ],
      projectRequirements: [
        'Strip out existing bathroom suite and tiles',
        'Install waterproof tanking membrane',
        'Tile walls and floor in designer porcelain',
        'Install luxury sanitaryware, shower, vanity, and heated towel rail',
      ],
      rooms: [
        { name: isCloakroom ? 'Cloakroom' : 'Bathroom', sizeCategory: 'small', dimensions: { length: 2.8, width: 2.2, areaM2: 6.2 }, purpose: 'High-end sanitary and bathing facility' },
      ],
      likelyWorks: [
        { category: 'Plumbing & Electrics', workTitle: 'First & Second Fix Plumbing', description: 'Install thermostatic shower, waste falls, and vanity plumbing.', tradeRequired: 'Plumber' },
        { category: 'Building Envelope', workTitle: 'Waterproof Tanking Membrane', description: 'Apply certified liquid tanking system to all wet areas.', tradeRequired: 'Tiler / Waterproofing Specialist' },
        { category: 'Fit-Out & Joinery', workTitle: 'Porcelain Tiling & Grouting', description: 'Precision tiling of walls, floors, and recessed niches.', tradeRequired: 'Master Tiler' },
      ],
      missingQuestions: [
        { id: 'water_system_type', question: 'Do you have a combi boiler, unvented cylinder (Megaflo), or traditional gravity tank?', reason: 'Determines whether shower pump or high-pressure valves are needed.' },
        { id: 'bath_or_shower', question: 'Are you planning a walk-in shower only, or a combined bath and shower?', reason: 'Affects drainage layouts and glass screen specifications.' },
      ],
      potentialConsiderations: [
        { topic: 'Building Regulations Part F', consideration: 'Extractor fan mandatory for moisture control.', riskLevel: 'medium' },
      ],
      initialAnswers: { project_type: 'bathroom', goals: ['Luxury shower', 'Modern clean finish', 'No leaks'] },
      summary: `${isCloakroom ? 'Cloakroom' : 'Bathroom'} renovation with tanking, porcelain tiling, and sanitaryware fitting.`,
      estimatedTimelineWeeks: { min: 2, max: 3 },
    };
  }

  // ===========================================================================
  // DOMAIN 4: STRUCTURAL WALL REMOVAL / KNOCKTHROUGH / RSJ (WITHOUT EXTENSION)
  // ===========================================================================
  if ((hasWallRemoval || hasChimney) && !hasExtension && !hasLoft && !hasGarage && !hasBasement && !hasFullHouse) {
    const isChimneyOnly = hasChimney && !hasWallRemoval;
    const lowCost = isChimneyOnly ? 2800 : 4200;
    const highCost = isChimneyOnly ? 6500 : 9500;

    return {
      projectType: 'other',
      projectTypeDisplay: isChimneyOnly ? 'Structural Chimney Breast Removal' : 'Load-Bearing Wall Removal & RSJ Installation',
      originalDescription: raw,
      generalDescription: isChimneyOnly
        ? 'Removal of masonry chimney breast at ground/first floor level. Involves structural propping, taking down brickwork, installing certified steel gallows brackets or a structural beam to support the upper stack, drylining, and plaster skimming.'
        : 'Formation of an open-plan room layout by removing an internal load-bearing spine wall. Includes structural engineer calculations, temporary Acrow propping and needles, wall removal, installing a fabricated Universal Beam (RSJ) onto reinforced concrete padstones, drypack mortar packing, 30-minute fireproofing with dual plasterboard, and plaster finish.',
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: '£2,800 – £4,500 / structural opening',
        notes: 'Includes structural calculations, steel RSJ supply, padstones, demolition, fire cladding, and plaster making good.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Standard RSJ with Downstand Bulkhead',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Steel beam installed under existing ceiling joists with plasterboard fire encasement creating a neat overhead downstand.',
          highlights: ['Chartered structural engineer calculations', 'Fabricated universal beam (RSJ) on padstones', '30-minute fire protective plasterboard encasement', 'Plaster skim and making good floor junctions'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Flush Ceiling Recessed Steel Frame',
          priceImpact: `+£1,800 – £3,200`,
          description: 'Steel beam recessed into ceiling joist space with steel joist hangers, creating a completely flat, seamless ceiling across the open room.',
          highlights: ['Fully recessed beam flush with ceiling line', 'Heavy-duty steel joist hangers to both sides', 'Seamless unbroken ceiling plaster across entire space', 'Integrated dimmable downlight layout across opening'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Crittall Steel Internal Screen Division',
          priceImpact: `+£4,500 – £8,500`,
          description: 'Combines structural wall removal with bespoke black steel Crittall glazed internal doors/screens for acoustic zoning.',
          highlights: ['Industrial black steel Crittall glazed screen', 'Retains light flow while acoustic zoning rooms', 'Integrated subfloor transition detailing', 'Complete turnkey decoration'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Structural & Engineering',
          title: 'Structural Engineer Calculations & Building Control',
          explanation: 'Removing any load-bearing wall requires calculations from a chartered structural engineer (SER/IStructE) submitted to local authority Building Control for a statutory completion certificate.',
          impactLevel: 'high',
        },
        {
          category: 'Structural & Engineering',
          title: 'Padstone Bearings & Load Distribution',
          explanation: 'The RSJ must bear at least 150mm on high-density concrete padstones to distribute concentrated point loads safely down to foundations.',
          impactLevel: 'high',
        },
        {
          category: 'Planning & Legal',
          title: 'Party Wall Act 1996 (if steel enters party wall)',
          explanation: 'If the structural beam is inserted into a shared party wall with a neighbour, a formal Party Wall notice must be served 2 months in advance.',
          impactLevel: 'high',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Structural Calculations & Propping', estimatedWeeks: 'Days 1–2', estimatedCostRange: '£1,200 – £2,200', items: ['Engineer calculation pack & Building Control notice', 'Erect heavy-duty Acrow props and load-spreading timber needles', 'Isolate any electrical cabling or pipes within the wall'] },
        { phase: 2, title: 'Demolition & Steel Installation', estimatedWeeks: 'Days 3–5', estimatedCostRange: '£1,800 – £4,200', items: ['Carefully demolish brick/block wall and remove rubble', 'Cast reinforced concrete padstones in supporting walls', 'Lift and bed structural RSJ on non-shrink drypack mortar'] },
        { phase: 3, title: 'Fireproofing, Plastering & Making Good', estimatedWeeks: 'Days 6–8', estimatedCostRange: '£1,200 – £2,600', items: ['Encase steel beam with 2 layers of fire-rated plasterboard', 'Plaster skim ceiling and reveals to seamless finish', 'Infill subfloor timber/screed channel where wall was removed'] },
      ],
      projectRequirements: [
        'Obtain structural engineer calculations and Building Control approval',
        'Erect temporary props and demolish load-bearing wall',
        'Install structural steel RSJ beam on concrete padstones',
        'Fire-rate steel and plaster skim to match existing room',
      ],
      rooms: [
        { name: 'Open-Plan Living Zone', sizeCategory: 'large', dimensions: { length: 6, width: 4.5, areaM2: 27 }, purpose: 'Combined open-plan kitchen, dining, or living room' },
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Structural Demolition & Propping', description: 'Temporary Acrow needle support and safe wall removal.', tradeRequired: 'Structural Builder' },
        { category: 'Structural & Groundworks', workTitle: 'RSJ Steel Beam & Padstone Installation', description: 'Install fabricated steel beam on engineered concrete bearings.', tradeRequired: 'Steel Fabricator & Builder', structuralImplication: 'Full structural load transfer.' },
        { category: 'Fit-Out & Joinery', workTitle: 'Fire Encasement & Plaster Making Good', description: 'Part B fire protective board and full plaster blend.', tradeRequired: 'Plasterer' },
      ],
      missingQuestions: [
        { id: 'floor_above', question: 'What is directly above this wall (e.g. bedrooms, bathroom, or roof structure)?', reason: 'Determines the weight of load the new steel RSJ must support.' },
        { id: 'flush_or_downstand', question: 'Do you want a flush ceiling with hidden steel, or is an overhead downstand acceptable?', reason: 'Affects whether joists need cutting and steel hangers fitted.' },
      ],
      potentialConsiderations: [
        { topic: 'Building Regulations Part A', consideration: 'Mandatory structural certification for structural load transfer.', riskLevel: 'high' },
      ],
      initialAnswers: { project_type: 'other', goals: ['Open-plan space', 'More light', 'Modern flow'] },
      summary: `Load-bearing wall removal with structural RSJ steel beam and Building Control compliance.`,
      estimatedTimelineWeeks: { min: 1, max: 2 },
    };
  }

  // ===========================================================================
  // DOMAIN 5: GARAGE CONVERSIONS
  // ===========================================================================
  if (hasGarage) {
    const isCinema = lower.includes('cinema') || lower.includes('movie') || lower.includes('media');
    const isGym = lower.includes('gym') || lower.includes('fitness');
    const isOffice = lower.includes('office') || lower.includes('study');
    const isBedroom = lower.includes('bedroom') || lower.includes('annexe');
    const purposeTitle = isCinema ? 'Cinema & Media Suite' : isGym ? 'Home Gym Studio' : isOffice ? 'Executive Home Office' : isBedroom ? 'Guest Bedroom Suite' : 'Habitable Living Room';
    
    const lowCost = isCinema ? 24000 : 18000;
    const highCost = isCinema ? 42000 : 34000;

    return {
      projectType: 'other',
      projectTypeDisplay: `Garage Conversion to ${purposeTitle}`,
      originalDescription: raw,
      generalDescription: `Conversion of an existing cold garage into a fully insulated, Building Regulations Part L compliant ${purposeTitle.toLowerCase()}. Involves bricking up the vehicle door with matching cavity masonry and double glazed window, building a raised insulated floating floor with damp-proof membrane over the concrete slab, thermal/acoustic wall lining, full electrical installation, heating, plastering, and an FD30 fire door connecting to the house.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: '£1,400 – £2,200 / m²',
        notes: 'Includes vehicle door infill, insulated slab, window, heating, electrics, plastering, and Building Control sign-off.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Standard Habitable Room Spec',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: '100mm PIR insulation, white uPVC window, radiator extension, plaster skim, and laminate/carpet flooring.',
          highlights: ['Cavity wall infill with matching brick', '100mm floor insulation + chipboard', 'LED downlights & 6 double sockets', 'Standard radiator plumbed to boiler'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Acoustic Soundproof & Designer Spec',
          priceImpact: `+£6,000 – £12,000`,
          description: 'Acoustic decoupling for cinema/gym, anthracite aluminium window, electric underfloor heating, and engineered oak.',
          highlights: ['SoundBloc dual-layer acoustic plasterboard', 'Slimline anthracite aluminium window', 'Engineered oak or heavy-duty gym flooring', 'Smart zoned dimmable lighting circuits'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Integrated Suite with Ensuite / AV Infrastructure',
          priceImpact: `+£14,000 – £22,000`,
          description: 'Adds compact ensuite shower room, built-in acoustic cabinetry, and MVHR fresh air ventilation.',
          highlights: ['Integrated ensuite with walk-in shower & macerator', 'Concealed 7.1.4 Dolby Atmos in-wall conduits', 'Mechanical ventilation with heat recovery (MVHR)', 'Custom architectural joinery'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Planning & Legal',
          title: 'Permitted Development vs Planning Permission',
          explanation: 'Garage conversions are usually Permitted Development unless your property is in a Conservation Area or your original planning permission had a condition retaining parking spaces.',
          impactLevel: 'medium',
        },
        {
          category: 'Drainage & Utilities',
          title: 'Floor Damp Proofing & Floor Level Step',
          explanation: 'Existing garage slabs rarely have a DPM. A new liquid DPM and 100mm rigid PIR insulation is required to match house floor levels.',
          impactLevel: 'high',
        },
        {
          category: 'Planning & Legal',
          title: 'Fire Safety (Part B) on Hallway Doors',
          explanation: 'Connecting doors between the house and converted garage must be certified FD30 fire-resistant with self-closers.',
          impactLevel: 'high',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Strip-out & Vehicle Door Infill', estimatedWeeks: 'Week 1', estimatedCostRange: '£3,000 – £5,500', items: ['Remove garage door & form toe footing', 'Lay matching cavity brickwork & DPC', 'Fit energy-efficient double glazed window'] },
        { phase: 2, title: 'Floor Insulation & First Fix MEP', estimatedWeeks: 'Week 2–3', estimatedCostRange: '£5,500 – £9,500', items: ['Liquid DPM, 100mm PIR insulation & floating floor', 'First fix electrical ring circuit & lighting feeds', 'Plumbing for radiator/underfloor heating'] },
        { phase: 3, title: 'Insulation, Plaster & Second Fix Handover', estimatedWeeks: 'Week 4–5', estimatedCostRange: '£7,500 – £14,000', items: ['Insulate ceiling/walls and plaster skim', 'Lay flooring (oak/carpet/rubber)', 'Fit FD30 fire door, switches, and decorating'] },
      ],
      projectRequirements: [
        `Convert existing garage into insulated ${purposeTitle.toLowerCase()}`,
        'Brick infill vehicle opening with matching masonry and window',
        'Install insulated floating floor slab over existing concrete',
        'Install electrics, heating, plastering, and fire safety door',
      ],
      rooms: [
        { name: purposeTitle, sizeCategory: 'medium', dimensions: { length: 5.5, width: 2.8, areaM2: 15.4 }, purpose: `Habitable ${purposeTitle.toLowerCase()}` },
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Masonry Infill & Footing', description: 'Cavity brickwork matching existing house elevations.', tradeRequired: 'Bricklayer' },
        { category: 'Building Envelope', workTitle: 'Floor Slab Insulation & DPM', description: 'Liquid DPM and 100mm PIR floating floor.', tradeRequired: 'Carpenter / Screeder' },
        { category: 'Plumbing & Electrics', workTitle: 'First Fix Electrics & Heating', description: 'Electrical ring main and heating connection.', tradeRequired: 'Electrician & Plumber' },
      ],
      missingQuestions: [
        { id: 'meter_location', question: 'Are gas or electric meters located inside the garage?', reason: 'Determines joinery boxing and inspection hatch requirements.' },
      ],
      potentialConsiderations: [
        { topic: 'Building Regulations Part L', consideration: 'U-values must achieve 0.18 W/m²K on walls and 0.13 W/m²K on floors.', riskLevel: 'medium' },
      ],
      initialAnswers: { project_type: 'other', goals: ['Garage conversion', 'Extra living space'] },
      summary: `Garage conversion to ${purposeTitle} with complete Building Control sign-off.`,
      estimatedTimelineWeeks: { min: 4, max: 6 },
    };
  }

  // ===========================================================================
  // DOMAIN 6: HOUSE EXTENSIONS (REAR / SIDE RETURN / WRAPAROUND)
  // ===========================================================================
  if (hasExtension) {
    const isWrap = lower.includes('wraparound') || lower.includes('wrap around');
    const isSide = lower.includes('side return');
    const typeTitle = isWrap ? 'Wraparound Rear & Side Extension' : isSide ? 'Side Return Kitchen Extension' : 'Single Storey Rear Kitchen Extension';
    const areaM2 = Math.round(extractedLength * extractedWidth) || 30;

    const basePerM2 = 2450;
    const lowCost = Math.round(areaM2 * basePerM2 * 0.95);
    const highCost = Math.round(areaM2 * basePerM2 * 1.35 + (hasWallRemoval ? 10000 : 0));

    return {
      projectType: 'extension',
      projectTypeDisplay: `${typeTitle} (~${areaM2}m²)`,
      originalDescription: raw,
      generalDescription: `Construction of a bespoke ${typeTitle.toLowerCase()} creating an expansive open-plan kitchen, dining, and living space. Involves 1.5m deep concrete trench foundations in London clay, drainage modifications, structural steel goalpost frame to open rear walls, energy-efficient cavity masonry, flat roof with architectural roof lanterns, slimline sliding/bifold doors, wet underfloor heating, and turnkey kitchen installation.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: `£2,400 – £3,400 / m²`,
        notes: `Turnkey indicative London estimate including groundworks, structural steel RSJ, architectural glazing, underfloor heating, and turnkey plastering.`,
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Contemporary Standard Spec',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Aluminium bifolds (standard 3-pane), flat roof with Velux rooflights, screeded underfloor heating, and porcelain tiling.',
          highlights: ['Aluminium 3-pane bifolds (standard RAL)', '2x Velux flat glass rooflights', 'Wet underfloor heating over 100mm PIR', 'Plaster skim and standard electrical pack'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Architectural Glazing & Flush Steel Spec',
          priceImpact: `+£16,000 – £28,000`,
          description: 'Slimline sliding glass panels (20mm sightlines), frameless structural roof lantern, flush recessed ceiling steel, and herringbone engineered oak.',
          highlights: ['20mm ultra-slim sliding patio doors', 'Frameless structural glass roof lantern (3m × 1.5m)', 'Fully concealed flush ceiling steel RSJ frame', 'Bespoke kitchen layout with 30mm Quartz island'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Industrial Crittall & High-End Architectural Spec',
          priceImpact: `+£35,000 – £55,000`,
          description: 'Bespoke black steel Crittall glazed screens, microcement seamless flooring, recessed linear LED coffers, and automated climate control.',
          highlights: ['Genuine or architectural steel Crittall glazed doors & screens', 'Seamless architectural microcement or polished concrete', 'Integrated utility room & downstairs guest cloakroom', 'Smart home lighting, automated blinds, and acoustic ceiling'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Structural & Engineering',
          title: 'Structural Steel Goalpost & Padstones',
          explanation: 'Opening the rear wall of the house requires an engineered structural steel frame on reinforced concrete padstones to carry upper floors safely.',
          impactLevel: 'high',
        },
        {
          category: 'Planning & Legal',
          title: 'Party Wall Act 1996 Compliance',
          explanation: 'Notices required under Section 6 of Party Wall Act for foundations excavated within 3m of neighbouring foundations.',
          impactLevel: 'high',
        },
        {
          category: 'Drainage & Utilities',
          title: 'Thames Water Sewer Build-Over Agreement',
          explanation: 'Shared public sewers running along rear gardens require formal Thames Water approval and protective lintels over pipe runs.',
          impactLevel: 'high',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Groundworks & Foundations', estimatedWeeks: 'Weeks 1–3', estimatedCostRange: '£16,000 – £24,000', items: ['Trench excavation to 1.5m depth in London clay', 'Concrete foundation pour (C25/30 ready-mix)', 'Sub-ground drainage & Thames Water lintels'] },
        { phase: 2, title: 'Structural Steel & Shell Masonry', estimatedWeeks: 'Weeks 4–7', estimatedCostRange: '£25,000 – £38,000', items: ['Erect structural steel goalpost frame on padstones', 'Build external cavity walls with 100mm PIR insulation', 'Construct flat roof deck with EPDM/GRP waterproofing'] },
        { phase: 3, title: 'Glazing & First Fix MEP', estimatedWeeks: 'Weeks 8–10', estimatedCostRange: '£18,000 – £30,000', items: ['Install slimline patio sliding doors & roof lantern', 'First fix electrical ring circuits and lighting', 'First fix plumbing and wet underfloor heating screed'] },
        { phase: 4, title: 'Plastering, Flooring & Kitchen Fit-out', estimatedWeeks: 'Weeks 11–14', estimatedCostRange: '£18,000 – £32,000', items: ['Full plaster skim and drylining', 'Lay floor finishes (porcelain / herringbone oak)', 'Fit kitchen cabinetry, quartz island, and decorate'] },
      ],
      projectRequirements: [
        `Construct ${typeTitle.toLowerCase()} (~${areaM2}m²)`,
        'Install structural steel frame to open up rear ground floor',
        'Install energy-efficient architectural glazing and rooflights',
        'Install wet underfloor heating and open-plan kitchen diner',
      ],
      rooms: [
        { name: 'Open-Plan Kitchen & Dining Room', sizeCategory: 'large', dimensions: { length: extractedLength, width: extractedWidth, areaM2 }, purpose: 'Family dining, entertaining, and culinary preparation' },
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Foundation Excavation & Concrete Pour', description: '1.5m deep trench foundations in London clay.', tradeRequired: 'Groundworks Crew' },
        { category: 'Structural & Groundworks', workTitle: 'Structural Steel Goalpost Installation', description: 'Universal columns and beams on concrete padstones.', tradeRequired: 'Steel Fabricator & Erectors' },
        { category: 'Building Envelope', workTitle: 'Flat Roof & Architectural Glazing', description: 'Warm roof deck and slimline sliding doors.', tradeRequired: 'Roofer & Glazier' },
      ],
      missingQuestions: [
        { id: 'drainage_location', question: 'Is there a manhole or shared sewer in the extension footprint?', reason: 'Determines Thames Water build-over requirements.' },
      ],
      potentialConsiderations: [
        { topic: 'Party Wall Notice', consideration: 'Notices required for foundations within 3m.', riskLevel: 'high' },
      ],
      initialAnswers: { project_type: 'extension', goals: ['Open-plan living', 'More natural light', 'Modern kitchen'] },
      summary: `${typeTitle} of ~${areaM2}m² with structural steel opening and architectural finishes.`,
      estimatedTimelineWeeks: { min: 12, max: 16 },
    };
  }

  // ===========================================================================
  // DOMAIN 7: LOFT CONVERSIONS
  // ===========================================================================
  if (hasLoft) {
    const isMansard = lower.includes('mansard');
    const isHipToGable = lower.includes('hip to gable') || lower.includes('hip-to-gable');
    const typeTitle = isMansard ? 'Mansard Loft Conversion' : isHipToGable ? 'Hip-to-Gable Loft Conversion' : 'Rear Dormer Loft Conversion';

    const lowCost = isMansard ? 65000 : 48000;
    const highCost = isMansard ? 92000 : 72000;

    return {
      projectType: 'loft',
      projectTypeDisplay: `${typeTitle} with Master Suite & Ensuite`,
      originalDescription: raw,
      generalDescription: `Conversion of attic space into a luxury master bedroom suite with ensuite bathroom. Involves scaffolding, structural steel floor beams, timber dormer/mansard construction, multi-foil and PIR roof insulation to Building Regs Part L, custom timber staircase, Velux rooflights, and FD30 fire safety doors.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: `£1,800 – £2,600 / m²`,
        notes: 'Includes steel beams, dormer timber frame, roof waterproofing, ensuite plumbing, staircase, and fire door upgrades.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Standard Dormer Spec',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Rear dormer with UPVC French doors, 3-piece ensuite, and standard Velux rooflights.',
          highlights: ['Timber frame dormer with slate/tile hanging', 'Ensuite with quadrant shower, basin, and WC', 'Bespoke timber staircase matching ground floor balustrade', 'FD30 fire doors to hallway escape route'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Architectural Master Suite Spec',
          priceImpact: `+£10,000 – £18,000`,
          description: 'Aluminium anthracite French doors, walk-in wetroom shower with frameless glass, and bespoke fitted eaves wardrobe joinery.',
          highlights: ['Full-width rear dormer with aluminium glazing', 'Walk-in wetroom with rainfall shower & niche lighting', 'Custom-built fitted wardrobes in low eaves zones', 'Dimmable LED perimeter cove lighting'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Mansard & Spa Bathroom Spec',
          priceImpact: `+£20,000 – £34,000`,
          description: '70-degree slate mansard with timber box sash windows, freestanding bath, microcement bathroom, and air conditioning.',
          highlights: ['Conservation-compliant slate mansard with lead dormers', 'Freestanding composite stone bathtub in master bedroom', 'Integrated low-profile climate control / air conditioning', 'Acoustic soundproof subfloor system'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Structural & Engineering',
          title: 'Ridge Height & Headroom Clearance',
          explanation: 'Building Regulations require a minimum of 2.0m clear headroom above the finished staircase and master bedroom landing.',
          impactLevel: 'high',
        },
        {
          category: 'Planning & Legal',
          title: 'Fire Safety & Means of Escape (Part B)',
          explanation: 'Converting to a 3-storey house requires upgrading all doors leading to the staircase to FD30 fire-resistant door sets.',
          impactLevel: 'high',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Scaffolding & Structural Steel', estimatedWeeks: 'Weeks 1–2', estimatedCostRange: '£12,000 – £18,000', items: ['Erect scaffolding with weather protection', 'Crane in structural steel ridge and floor beams', 'Install suspended floor joists'] },
        { phase: 2, title: 'Dormer Framing & Roof Weatherproofing', estimatedWeeks: 'Weeks 3–4', estimatedCostRange: '£14,000 – £22,000', items: ['Build timber stud dormer frame', 'Install EPDM rubber flat roof and slate cladding', 'Fit Velux rooflights and French doors'] },
        { phase: 3, title: 'Insulation & First Fix MEP', estimatedWeeks: 'Weeks 5–6', estimatedCostRange: '£10,000 – £16,000', items: ['Fit 100mm rigid PIR insulation + multi-foil blanket', 'First fix electrical cabling and smoke alarms', 'First fix ensuite plumbing and waste pipes'] },
        { phase: 4, title: 'Staircase, Plastering & Second Fix', estimatedWeeks: 'Weeks 7–9', estimatedCostRange: '£10,000 – £16,000', items: ['Install custom timber staircase', 'Plaster skim all ceilings and walls', 'Fit bathroom sanitaryware, tiles, and internal doors'] },
      ],
      projectRequirements: [
        `Construct ${typeTitle.toLowerCase()}`,
        'Install structural steel floor beams and timber dormer',
        'Install new staircase over existing flight',
        'Create luxury master bedroom with ensuite bathroom',
      ],
      rooms: [
        { name: 'Master Loft Bedroom', sizeCategory: 'large', dimensions: { length: 5.5, width: 4.2, areaM2: 23 }, purpose: 'Master suite with eaves storage and garden views' },
        { name: 'Ensuite Shower Room', sizeCategory: 'small', dimensions: { length: 2.4, width: 1.6, areaM2: 3.8 }, purpose: 'Walk-in shower, basin vanity, and WC' },
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Structural Steel Floor & Ridge Beams', description: 'Insert RSJ beams into party walls to support floor and dormer loads.', tradeRequired: 'Steel Fabricator / Carpenter' },
        { category: 'Building Envelope', workTitle: 'Timber Dormer & Flat Roof', description: 'Weatherproof dormer carcass with EPDM membrane.', tradeRequired: 'Roofer' },
      ],
      missingQuestions: [
        { id: 'roof_height', question: 'What is the internal height from ceiling joists to the ridge apex?', reason: 'Confirms headroom feasibility without lowering ceilings.' },
      ],
      potentialConsiderations: [
        { topic: 'Building Regulations Part B (Fire)', consideration: 'Staircase enclosure must be 30-minute fire protected with FD30 doors.', riskLevel: 'high' },
      ],
      initialAnswers: { project_type: 'loft', goals: ['Master bedroom', 'Add value to home'] },
      summary: `${typeTitle} adding master bedroom suite and ensuite bathroom.`,
      estimatedTimelineWeeks: { min: 7, max: 10 },
    };
  }

  // ===========================================================================
  // DOMAIN 8: GENERAL / FULL HOUSE RENOVATION / OTHER
  // ===========================================================================
  const projectType: ProjectType = hasFullHouse ? 'full-renovation' : 'other';
  const displayTitle = hasFullHouse
    ? 'Complete Period Home Renovation & Modernisation'
    : 'Bespoke Residential Refurbishment & Trade Works';

  const lowCost = hasFullHouse ? 85000 : 3500;
  const highCost = hasFullHouse ? 220000 : 8500;

  return {
    projectType,
    projectTypeDisplay: displayTitle,
    originalDescription: raw,
    generalDescription: `High-quality residential building and refurbishment works executed by certified trade professionals in full compliance with UK Building Regulations.`,
    costEstimate: {
      low: lowCost,
      high: highCost,
      formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
      benchmarkPerM2: `£1,200 – £2,400 / m²`,
      notes: 'Itemised estimate based on current London trade labour rates and high-specification materials.',
    },
    customSpecifications: [
      {
        tier: 'Essential',
        title: 'High-Quality Contemporary Finish',
        priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
        description: 'Quality trade products, clean plaster finish, and certified MEP installations.',
        highlights: ['Certified trade calculations', 'Quality timber and sanitaryware', 'NICEIC / Gas Safe certification'],
      },
      {
        tier: 'Architectural Premium',
        title: 'Architectural Specification',
        priceImpact: `+£8,000 – £20,000`,
        description: 'Designer finishes, underfloor heating, bespoke joinery, and concealed lighting.',
        highlights: ['Zoned smart lighting', 'Custom-made joinery units', 'Engineered oak flooring'],
        isRecommended: true,
      },
      {
        tier: 'Luxury Master',
        title: 'Turnkey Luxury Specification',
        priceImpact: `+£25,000 – £50,000`,
        description: 'Marble and microcement surfaces, bespoke cabinetry, and smart home automation.',
        highlights: ['Full HVAC climate control', 'Bookmatched marble stone', 'Complete architectural project management'],
      },
    ],
    thingsToConsider: [
      {
        category: 'Planning & Legal',
        title: 'Building Regulations Compliance',
        explanation: 'Statutory site inspections required for structural alterations, electrical wiring (Part P), and insulation (Part L).',
        impactLevel: 'high',
      },
      {
        category: 'Living & Logistics',
        title: 'Trade Phasing & Dust Control',
        explanation: 'Proper sequencing prevents damage to new finishes and ensures project timelines are met.',
        impactLevel: 'medium',
      },
    ],
    tradePhaseBreakdown: [
      { phase: 1, title: 'Preparation & Strip-Out', estimatedWeeks: 'Week 1', estimatedCostRange: '£1,200 – £3,500', items: ['Protect areas and strip out old fixtures', 'Surface and structural preparation', 'Waste removal'] },
      { phase: 2, title: 'Trade Installation & MEP', estimatedWeeks: 'Week 2', estimatedCostRange: '£1,500 – £4,000', items: ['Electrical and plumbing adjustments', 'Substrate preparation & plastering', 'Joinery fitting'] },
      { phase: 3, title: 'Finishes & Handover', estimatedWeeks: 'Week 3', estimatedCostRange: '£800 – £2,000', items: ['Painting and decorating', 'Silicone sealing & testing', 'Final inspection and cleanup'] },
    ],
    projectRequirements: [
      'Carry out residential refurbishment works',
      'Update plumbing, electrical, or surface finishes',
      'Provide turnkey decoration and clean handover',
    ],
    rooms: [
      { name: 'Project Space', sizeCategory: 'medium', dimensions: { length: 4, width: 3.5, areaM2: 14 }, purpose: 'Reconfigured living space' },
    ],
    likelyWorks: [
      { category: 'Fit-Out & Joinery', workTitle: 'Trade Refurbishment', description: 'Execution of specified building and finishing works.', tradeRequired: 'Multi-trade Craftsman' },
    ],
    missingQuestions: [
      { id: 'property_age', question: 'What era is your property (e.g. Victorian, Edwardian, 1930s, Modern)?', reason: 'Affects plaster types, floor joists, and structural requirements.' },
    ],
    potentialConsiderations: [
      { topic: 'Building Regulations', consideration: 'All work executed to current UK trade standards.', riskLevel: 'low' },
    ],
    initialAnswers: { project_type: projectType, goals: ['Quality renovation', 'Added comfort'] },
    summary: `${displayTitle} with complete turnkey management.`,
    estimatedTimelineWeeks: { min: 1, max: hasFullHouse ? 16 : 3 },
  };
}

/**
 * Server-side AI Project Analyzer
 */
export async function analyzeProjectWithAI(prompt: string): Promise<ExtractedProject> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return extractWithUKBuildingRules(prompt);
  }

  try {
    const fallbackRules = extractWithUKBuildingRules(prompt);

    const systemInstruction = `You are an expert UK Senior Quantity Surveyor & Construction Estimator for ST CONTRACTORS in London.
Analyze the homeowner's project description and return ONLY valid JSON matching this exact structure:

{
  "generalDescription": string,
  "costEstimate": {
    "low": number,
    "high": number,
    "formatted": string,
    "benchmarkPerM2": string,
    "notes": string
  },
  "customSpecifications": [
    {
      "tier": "Essential" | "Architectural Premium" | "Luxury Master",
      "title": string,
      "priceImpact": string,
      "description": string,
      "highlights": string[],
      "isRecommended": boolean
    }
  ],
  "thingsToConsider": [
    {
      "category": "Structural & Engineering" | "Planning & Legal" | "Drainage & Utilities" | "Living & Logistics",
      "title": string,
      "explanation": string,
      "impactLevel": "high" | "medium" | "low"
    }
  ],
  "tradePhaseBreakdown": [
    {
      "phase": number,
      "title": string,
      "estimatedWeeks": string,
      "estimatedCostRange": string,
      "items": string[]
    }
  ]
}

CRITICAL ACCURACY RULES:
1. Pay strict attention to the EXACT SCOPE. If the user asks for simple decorating (e.g. "decorate kitchen", "paint bedroom"), do NOT hallucinate structural walls, RSJs, extensions, or £40k budgets! Decorating a single room is ~£800-£2,200 and takes 3-5 days.
2. Only include structural works (RSJ, foundations, groundworks) if the user is extending, converting a loft/garage/basement, or taking down walls.
3. Realistic London 2026 rates:
   - Decorating room: £800 - £2,200 (3-5 days)
   - Bathroom refit: £6,500 - £15,000 (2-3 weeks)
   - Kitchen replacement: £7,500 - £22,000 (2-4 weeks)
   - Wall knockthrough with RSJ: £4,000 - £8,500 (1-2 weeks)
   - Garage conversion: £18,000 - £34,000 (4-6 weeks)
   - Rear extension: £50,000 - £120,000 (12-16 weeks)
   - Loft conversion: £48,000 - £85,000 (7-10 weeks)`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\nHomeowner Project Description: "${prompt}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      return fallbackRules;
    }

    const data = await response.json();
    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return fallbackRules;

    const parsed = JSON.parse(rawJson);

    return {
      ...fallbackRules,
      generalDescription: parsed.generalDescription || fallbackRules.generalDescription,
      costEstimate: parsed.costEstimate?.low ? parsed.costEstimate : fallbackRules.costEstimate,
      customSpecifications: parsed.customSpecifications?.length ? parsed.customSpecifications : fallbackRules.customSpecifications,
      thingsToConsider: parsed.thingsToConsider?.length ? parsed.thingsToConsider : fallbackRules.thingsToConsider,
      tradePhaseBreakdown: parsed.tradePhaseBreakdown?.length ? parsed.tradePhaseBreakdown : fallbackRules.tradePhaseBreakdown,
    };
  } catch (error) {
    console.error('Error invoking Gemini Assistant API, falling back to rule engine:', error);
    return extractWithUKBuildingRules(prompt);
  }
}
