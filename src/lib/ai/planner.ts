/**
 * AI Service Layer & Dynamic Project-Isolated Scope Generator
 * Strictly enforces project type isolation.
 * NO cross-contamination of questions, recommendations, or quote items.
 */

import {
  ComprehensivePlannerInput,
  ProjectScopeItem,
  RecommendedWorkItem,
  WorkCategory,
  FinishLevel,
} from './types';
import { ProjectType } from '@/lib/planner/quiz-engine';

/**
 * Parses freeform natural language text to extract project type, target rooms, and goals
 * within the strict context of the customer's intent.
 */
export function interpretProjectDescription(text: string): {
  suggestedProjectType: ProjectType;
  suggestedRooms: string[];
  hasStructuralIntent: boolean;
  detectedGoals: string[];
  summary: string;
} {
  const lower = (text || '').toLowerCase();

  let suggestedProjectType: ProjectType = 'other';
  if (lower.includes('bathroom') || lower.includes('ensuite') || lower.includes('shower') || lower.includes('wetroom') || lower.includes('toilet') || lower.includes('cloakroom')) {
    suggestedProjectType = 'bathroom';
  } else if (lower.includes('kitchen') || lower.includes('diner') || lower.includes('worktop') || lower.includes('cabinets')) {
    suggestedProjectType = 'kitchen';
  } else if (lower.includes('extension') || lower.includes('extend') || lower.includes('rear extension') || lower.includes('side return') || lower.includes('wraparound')) {
    suggestedProjectType = 'extension';
  } else if (lower.includes('loft') || lower.includes('attic') || lower.includes('dormer') || lower.includes('mansard')) {
    suggestedProjectType = 'loft';
  } else if (lower.includes('garden') || lower.includes('patio') || lower.includes('decking') || lower.includes('landscap')) {
    suggestedProjectType = 'garden';
  } else if (lower.includes('driveway') || lower.includes('paving') || lower.includes('tarmac') || lower.includes('resin')) {
    suggestedProjectType = 'driveway';
  } else if (lower.includes('full house') || lower.includes('full renovation') || lower.includes('whole house') || lower.includes('gut renovat')) {
    suggestedProjectType = 'full-renovation';
  }

  const suggestedRooms: string[] = [];
  if (suggestedProjectType === 'bathroom') {
    suggestedRooms.push('Main Bathroom');
  } else if (suggestedProjectType === 'kitchen') {
    suggestedRooms.push('Kitchen & Dining Area');
  } else if (suggestedProjectType === 'extension') {
    suggestedRooms.push('Rear Extension Living Space');
  } else if (suggestedProjectType === 'loft') {
    suggestedRooms.push('Loft Bedroom Suite');
  } else if (suggestedProjectType === 'garden') {
    suggestedRooms.push('Garden & Patio Area');
  } else if (suggestedProjectType === 'driveway') {
    suggestedRooms.push('Driveway & Front Entrance');
  } else if (suggestedProjectType === 'full-renovation') {
    suggestedRooms.push('Kitchen & Dining', 'Bathrooms', 'Living Rooms', 'Bedrooms', 'Hallway & Stairs');
  } else {
    suggestedRooms.push('Main Project Area');
  }

  const hasStructuralIntent =
    lower.includes('knock') ||
    lower.includes('remove wall') ||
    lower.includes('open plan') ||
    lower.includes('steel') ||
    lower.includes('rsj') ||
    lower.includes('beam');

  const detectedGoals: string[] = [];
  if (lower.includes('space') || lower.includes('bigger') || lower.includes('larger')) detectedGoals.push('More space');
  if (lower.includes('open plan') || lower.includes('layout') || lower.includes('knock')) detectedGoals.push('Better layout');
  if (lower.includes('modern') || lower.includes('new') || lower.includes('upgrade')) detectedGoals.push('Modernise the property');
  if (lower.includes('storage') || lower.includes('cupboard')) detectedGoals.push('Create more storage');
  if (lower.includes('garden') || lower.includes('door') || lower.includes('bifold') || lower.includes('light')) detectedGoals.push('Improve natural light & garden access');

  return {
    suggestedProjectType,
    suggestedRooms,
    hasStructuralIntent,
    detectedGoals,
    summary: `Interpreted project intent for ${suggestedProjectType.replace(/-/g, ' ')} with ${suggestedRooms.join(', ')}.`,
  };
}

/**
 * Standard baseline room templates generating clean, non-technical jobs per room
 * STRICTLY FILTERED by active project type.
 */
export function generateRoomByRoomScope(
  input: ComprehensivePlannerInput,
  answers: Record<string, any> = {}
): ProjectScopeItem[] {
  const items: ProjectScopeItem[] = [];
  const projectType = (input.projectType || 'other') as ProjectType;

  const finishMultiplier =
    input.finishLevel === 'budget'
      ? 0.85
      : input.finishLevel === 'premium'
      ? 1.25
      : input.finishLevel === 'luxury'
      ? 1.6
      : 1.0;

  const addItem = (
    category: WorkCategory,
    name: string,
    description: string,
    baseLow: number,
    baseHigh: number,
    areaName: string,
    selected: boolean = true
  ) => {
    const costLow = Math.round((baseLow * finishMultiplier) / 50) * 50;
    const costHigh = Math.round((baseHigh * finishMultiplier) / 50) * 50;

    items.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
      areaId: `area-${areaName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      areaName,
      category,
      name,
      description,
      selected,
      pricingStatus: 'estimated',
      costLow,
      costHigh,
    });
  };

  // =========================================================================
  // 1. BATHROOM SCOPE (Only when projectType === 'bathroom')
  // =========================================================================
  if (projectType === 'bathroom') {
    const area = 'Bathroom';
    const feats = (answers.bathroom_features as string[]) || [];
    const subs = (answers.bathroom_features_suboptions as string[]) || [];

    addItem('Preparation & Demolition', 'Strip out existing bathroom suite, tiles & flooring', 'Safe isolation and disconnection of water supplies, removal and disposal of old sanitaryware, tiles and flooring.', 650, 1200, area);

    if (answers.bathroom_layout_change === 'change_layout') {
      addItem('Plumbing & Heating', 'Alter pipework & reroute waste lines for new layout', 'Extending hot/cold copper pipework and rerouting 40mm/110mm waste lines to new fixture positions.', 950, 1800, area);
    } else {
      addItem('Plumbing & Heating', 'First-fix plumbing connections to existing positions', 'Connecting hot and cold supplies, isolators and waste traps to existing pipework locations.', 600, 1100, area);
    }

    if (feats.length === 0 || feats.includes('shower')) {
      const isWetroom = subs.includes('shower_walkin_wetroom');
      addItem('Plumbing & Heating', isWetroom ? 'Supply & install luxury walk-in wetroom with fluted glass' : 'Supply and fit walk-in rainfall shower & frameless screen', 'Floor-level low-profile shower tray, concealed thermostatic valve, rainfall head and fluted/clear glass screen.', 1400, 2800, area);
    }
    if (feats.includes('bath')) {
      const isFreestanding = subs.includes('bath_freestanding_stone');
      addItem('Plumbing & Heating', isFreestanding ? 'Supply & install freestanding stone statement bathtub & standpipe tap' : 'Install standard family bath with glass shower screen', 'Double-ended luxury stone/acrylic feature bath with floor-mounted chrome/brass mixer tap.', 1600, 3200, area);
    }
    if (feats.length === 0 || feats.includes('toilet')) {
      const isSmart = subs.includes('toilet_smart_bidet');
      addItem('Plumbing & Heating', isSmart ? 'Install Japanese-style smart heated bidet toilet & concealed frame' : 'Install wall-hung / back-to-wall toilet with concealed cistern', 'Concealed steel cistern frame, dual-flush plate, soft-close toilet seat and rimless pan.', 750, 1500, area);
    }
    if (feats.length === 0 || feats.includes('vanity_sink')) {
      const isDouble = subs.includes('vanity_double_twin');
      addItem('Installation & Cabinetry', isDouble ? 'Fit double/twin basin vanity storage unit & dual taps' : 'Fit vanity storage unit, basin & monobloc tap', 'Wall-mounted or floorstanding vanity unit with soft-close drawers, ceramic basin and designer tap.', 650, 1400, area);
    }
    if (feats.length === 0 || feats.includes('tiling')) {
      addItem('Finishing & Decorating', 'Full waterproof tanking & porcelain wall and floor tiling', 'Tanking membrane in wet zones, floor-to-ceiling porcelain tiling, mitred edge trims and anti-mold grout.', 1800, 3600, area);
    }
    if (feats.includes('flooring')) {
      addItem('Finishing & Decorating', 'Lay waterproof bathroom flooring (Non-slip Porcelain / LVT)', 'Subfloor leveling membrane and non-slip R10 porcelain or LVT floor installation.', 650, 1300, area);
    }
    if (feats.includes('heating_towels')) {
      addItem('Plumbing & Heating', 'Install electric underfloor heating mat & designer towel rail', 'Fast-response electric warm floor cable mat under bathroom tiles with programmable digital thermostat and heated towel rail.', 850, 1600, area);
    }
    if (feats.length === 0 || feats.includes('lighting_ventilation')) {
      addItem('Electrical & Lighting', 'Fit IP65 waterproof LED spotlights & quiet extractor fan', 'Waterproof bathroom ceiling downlights, quiet inline loft extractor fan and illuminated mirror point.', 550, 1100, area);
    }

    addItem('Finishing & Decorating', 'Anti-condensation ceiling painting and sanitary silicone sealing', 'Specialist moisture-resistant ceiling paint and mold-proof color-matched silicone perimeter beading.', 350, 650, area);
  }

  // =========================================================================
  // 2. KITCHEN SCOPE (Only when projectType === 'kitchen')
  // =========================================================================
  else if (projectType === 'kitchen') {
    const area = 'Kitchen & Dining';
    const kFeats = (answers.kitchen_features as string[]) || [];
    const kSubs = (answers.kitchen_features_suboptions as string[]) || [];

    addItem('Preparation & Demolition', 'Remove old kitchen units, worktops, tiles & flooring', 'Safe isolation of gas, water and electrical supplies, full strip out and skip disposal of all debris.', 750, 1400, area);

    if (answers.kitchen_wall_removal === 'remove_wall') {
      addItem('Building & Structural', 'Demolish dividing wall & install structural steel beam (RSJ)', 'Temporary Acrow propping, controlled masonry demolition, engineered RSJ steel beam and padstones.', 3800, 6800, area);
      if (answers.kitchen_flush_steel === 'flush_steel') {
        addItem('Building & Structural', 'Hidden flush-ceiling steel beam installation (No downstand)', 'Slotting RSJ steels into ceiling joists to create an uninterrupted flat continuous ceiling.', 2200, 4200, area);
      }
    }

    addItem('Plumbing & Heating', 'First and second fix plumbing for sink, tap, dishwasher & fridge', 'Altering hot/cold copper supply pipework, waste runs, and connecting new sink and appliance valves.', 950, 1800, area);
    addItem('Electrical & Lighting', 'Dedicated appliance feeds, sockets & ceiling LED spotlights', 'Wiring dedicated 32A cooker circuit, appliance sockets, above-worktop points and dimmable downlights.', 1200, 2400, area);
    addItem('Installation & Cabinetry', 'Supply & fit high-quality kitchen base, wall & tall units', 'Assembly and laser-level installation of kitchen cabinetry, soft-close drawers, end panels and plinths.', 3200, 6800, area);

    // Worktops
    if (kFeats.length === 0 || kFeats.includes('worktops')) {
      const isQuartz = kSubs.includes('worktop_quartz_30mm') || kSubs.length === 0;
      addItem('Installation & Cabinetry', isQuartz ? 'Template, supply & fit 30mm Solid Quartz worktops' : 'Template, supply & install premium solid worktops', 'Laser templating, cutting and fitting solid stone surfaces with undermount sink cutout & drainer grooves.', 2800, 5800, area);
    }

    // Sink & Taps
    if (kFeats.length === 0 || kFeats.includes('sink_and_taps')) {
      const hasQuooker = kSubs.includes('sink_quooker_boiling_tap');
      addItem('Plumbing & Heating', hasQuooker ? 'Install undermount sink & Quooker 100°C boiling water tap system' : 'Install undermount / Belfast sink with designer mixer tap', 'Undermount sink, pull-out spray tap, plumbing traps and waste disposal connection.', 950, 2200, area);
    }

    // Flooring
    if (kFeats.length === 0 || kFeats.includes('flooring')) {
      const isOak = kSubs.includes('floor_engineered_oak');
      addItem('Finishing & Decorating', isOak ? 'Supply & lay engineered oak hardwood flooring (plank / herringbone)' : 'Lay high-durability kitchen & dining floor covering', 'Subfloor levelling screed, acoustic membrane and seamless flooring with threshold trims.', 1400, 2800, area);
    }

    // Windows & Doors
    if (kFeats.includes('windows_doors')) {
      const isBifold5m = kSubs.includes('doors_bifold_5m');
      const isSliding = kSubs.includes('doors_slim_sliding');
      const label = isBifold5m ? 'Supply & fit 5m panoramic aluminium bi-fold doors' : isSliding ? 'Supply & fit ultra-slim sliding glass patio doors' : 'Supply & fit aluminium bi-fold patio doors / new window';
      addItem('Glazing & Openings', label, 'Thermally broken powder-coated aluminium glazing with flush threshold onto garden patio.', 4200, 8500, area);
    }

    // Island
    if (kFeats.includes('kitchen_island')) {
      addItem('Installation & Cabinetry', 'Bespoke central kitchen island with breakfast bar seating', 'Feature multi-cabinet island with storage drawers, wine cooler recess and quartz worktop overhang.', 2600, 5200, area);
    }

    // Appliances
    if (kFeats.length === 0 || kFeats.includes('integrated_appliances')) {
      addItem('Installation & Cabinetry', 'Install and commission integrated appliance package', 'Fitting integrated pyrolytic oven, induction hob with extractor, dishwasher and fridge freezer.', 850, 1700, area);
    }

    // Heating
    if (kFeats.includes('heating')) {
      addItem('Plumbing & Heating', 'Install water/electric underfloor heating across kitchen floor', 'Insulated low-profile warm floor system with programmable digital touchscreen thermostat.', 1800, 3600, area);
    }

    // Utility Room
    if (kFeats.includes('utility_room')) {
      addItem('Installation & Cabinetry', 'Utility room fit-out with washing machine & dryer cabinetry', 'Separate utility cabinetry housing laundry machines, sink, boiler and storage.', 1800, 3600, area);
    }

    addItem('Finishing & Decorating', 'Full plaster skim coat and paint finish to walls & ceiling', 'Two-coat multi-finish plastering providing smooth crack-free surfaces and durable kitchen paint finish.', 950, 1800, area);
  }

  // =========================================================================
  // 3. EXTENSION SCOPE (Only when projectType === 'extension')
  // =========================================================================
  else if (projectType === 'extension') {
    const area = 'Extension & Shell';
    addItem('Building & Structural', 'Excavate foundations, pour concrete trench & build blockwork', 'Building control inspected deep concrete foundations, DPC, insulated subfloor slab and drainage.', 9500, 18500, area);
    addItem('Building & Structural', 'Erect external brickwork/render and structural steel framework (RSJs)', 'Cavity insulated masonry matching existing house, steel goalposts and ceiling joists.', 11000, 22000, area);
    addItem('Building & Structural', 'Construct insulated flat roof with EPDM rubber / pitch tile roof', 'High-performance warm roof construction with 150mm PIR insulation and 25-year membrane.', 5500, 11000, area);

    if (answers.extension_knockthrough === 'full_knockthrough' || !answers.extension_knockthrough) {
      addItem('Building & Structural', 'Knock through existing rear wall & install structural steel beams', 'Temporary propping, controlled demolition, engineered steel beams on padstones.', 3800, 6800, area);
    }

    const glazing = answers.extension_glazing || 'bifold_doors_3m';
    if (glazing === 'bifold_doors_5m') {
      addItem('Glazing & Openings', '5m Panoramic Aluminium Bi-Fold Doors (5-6 panels)', 'Full-width multi-panel folding glass system with integrated multi-point locking.', 6800, 11500, area);
    } else if (glazing === 'slim_sliding_doors') {
      addItem('Glazing & Openings', 'Ultra-Slimline Sliding Glass Doors (20mm sightline)', 'Minimalist floor-to-ceiling sliding glass panels for uninterrupted garden panoramic views.', 7500, 13800, area);
    } else if (glazing === 'crittall_doors') {
      addItem('Glazing & Openings', 'Heritage Industrial Steel-Look French Doors & Screens', 'Black acoustic aluminium heritage doors with horizontal glazing bars.', 4500, 8200, area);
    } else {
      addItem('Glazing & Openings', '3m Powder-Coated Aluminium Bi-Fold Doors (3 panels)', 'Thermally broken aluminum profile, low-E solar glass, ultra-low flush floor track.', 4200, 7500, area);
    }

    const rooflight = answers.extension_rooflights || 'flat_skylight';
    if (rooflight === 'roof_lantern') {
      addItem('Glazing & Openings', 'Architectural Aluminium Roof Lantern (3m × 1.5m)', 'High-pitch pyramid glass lantern maximizing central natural daylight.', 3200, 5800, area);
    } else if (rooflight === 'pitched_velux') {
      addItem('Glazing & Openings', 'Velux Solar-Powered Roof Windows with Rain Sensors', 'Centre-pivot roof windows with thermo-technology and integrated solar blinds.', 1800, 3200, area);
    } else if (rooflight !== 'solid_roof') {
      addItem('Glazing & Openings', 'Frameless Toughened Flat Glass Rooflight (1.5m × 1m)', 'Laminated solar control self-cleaning rooflight with insulated kerb.', 1800, 3400, area);
    }

    const patioFeats = (answers.extension_patio_connection as string[]) || [];
    if (patioFeats.includes('flush_porcelain_patio')) {
      addItem('External & Grounds', 'Flush Porcelain Patio (25m²–40m²) Matching Internal Floor', 'Exterior 20mm vitrified porcelain tiles laid flush with bifold track on full mortar bed.', 4200, 8500, 'Garden & Patio');
    }
    if (patioFeats.includes('k_rend_render')) {
      addItem('External & Grounds', 'Silicone Weatherproof External Render (K-Rend / Weber)', 'Breathable through-coloured silicone monocouche render requiring no painting.', 2800, 5600, area);
    }
    if (patioFeats.includes('cedar_timber_cladding')) {
      addItem('External & Grounds', 'Architectural Western Red Cedar / Composite Slatted Cladding', 'Contemporary slatted exterior facade timber with protective UV oil treatment.', 2600, 5200, area);
    }
    if (patioFeats.includes('wet_underfloor_heating') || !answers.extension_patio_connection) {
      addItem('Plumbing & Heating', 'Install water underfloor heating across new extension floor', 'Wet system piped into screed with multi-zone digital thermostats.', 2400, 4800, area);
    }

    addItem('Electrical & Lighting', 'First & second fix electrical installation and LED downlights', 'New consumer unit circuits, downlights, pendant drops, wall lights and exterior illumination.', 2200, 4200, area);
    addItem('Finishing & Decorating', 'Drylining, full plaster skimming, skirting boards & paint finishing', 'Insulation boards, skim plastering, primed skirting, architraves and complete paint finish.', 2800, 5600, area);
  }

  // =========================================================================
  // 4. LOFT SCOPE (Only when projectType === 'loft')
  // =========================================================================
  else if (projectType === 'loft') {
    const area = 'Loft Conversion';
    addItem('Building & Structural', 'Install structural steel beams (RSJs) & new floor joists', 'Supporting new loft floor independently from ceiling below with structural engineer calcs.', 6500, 12500, area);
    addItem('Building & Structural', 'Construct full-width rear flat-roof dormer with EPDM roof', 'Timber framed dormer cheeks, insulated flat roof, breathable membrane and exterior cladding.', 11500, 21000, area);
    addItem('Carpentry & Joinery', 'Build bespoke matching staircase from lower floor to loft', 'Custom hardwood/pine staircase with handrails, spindles and fire door integration.', 2800, 5200, area);

    const loftGlazing = (answers.loft_glazing as string[]) || [];
    if (loftGlazing.includes('french_juliette') || loftGlazing.length === 0) {
      addItem('Glazing & Openings', 'French doors with Juliette glass balcony to rear dormer', 'Floor-to-ceiling double glazed doors with clear glass safety balustrade.', 2800, 4800, area);
    }
    if (loftGlazing.includes('velux_skylights') || loftGlazing.length === 0) {
      addItem('Glazing & Openings', 'Fit Velux solar roof windows to front roof pitch', 'Top-hung Velux rooflights bringing daylight into bedroom and stairwell.', 1600, 2900, area);
    }

    const loftRooms = (answers.loft_rooms as string[]) || [];
    if (loftRooms.includes('ensuite_shower') || loftRooms.length === 0) {
      addItem('Plumbing & Heating', 'Install ensuite shower room plumbing, sanitaryware & tiling', 'Soil pipe drop, waste lines, walk-in shower, vanity sink, toilet and heated towel rail.', 3800, 6800, 'Loft Ensuite');
    }
    if (loftRooms.includes('dressing_room')) {
      addItem('Carpentry & Joinery', 'Bespoke eaves fitted wardrobes & dressing storage', 'Custom-built fitted wardrobes into eaves slopes with hanging rails and soft-close drawers.', 2200, 4400, area);
    }

    addItem('Electrical & Lighting', 'Full loft electrical fit-out, smoke alarms & spotlighting', 'Integrated fire-rated downlights, interlinked optical smoke alarms and USB points.', 1800, 3400, area);
    addItem('Finishing & Decorating', 'Super-insulated drylining, full plaster skim & decoration', '150mm PIR insulation meeting Part L Building Regs, skimmed plaster and painted finish.', 3200, 6200, area);
  }

  // =========================================================================
  // 5. GARDEN & LANDSCAPING SCOPE (Only when projectType === 'garden')
  // =========================================================================
  else if (projectType === 'garden') {
    const area = 'Garden & Landscaping';
    addItem('Preparation & Demolition', 'Excavation of ground, site leveling & sub-base preparation', 'Excavating soil to 200mm depth, laying geotextile membrane and compacted Type 1 stone.', 1800, 3600, area);

    const gScope = (answers.garden_scope as string[]) || [];
    if (gScope.includes('porcelain_patio') || gScope.length === 0) {
      addItem('External & Grounds', 'Lay non-slip vitrified porcelain patio slabs on wet mortar bed', 'Vitrified R11 porcelain paving on full wet mortar bed with primed backs and jointing compound.', 3600, 7200, area);
    }
    if (gScope.includes('composite_decking')) {
      addItem('External & Grounds', 'Install composite / hardwood garden decking terrace', 'Rot-proof composite decking boards on treated timber sub-frame with hidden fasteners.', 2800, 5600, area);
    }
    if (gScope.includes('garden_studio')) {
      addItem('Building & Structural', 'Construct insulated contemporary garden studio / office', 'Engineered ground screw foundation, C24 timber frame structure, composite cladding, power & double glazing.', 14000, 26000, 'Garden Studio');
    }
    if (gScope.includes('new_lawn') || gScope.length === 0) {
      addItem('External & Grounds', 'Supply and lay cultivated lawn turf & plant borders', 'Rotovated topsoil enriched with organic matter and freshly laid weed-free turf.', 1100, 2400, area);
    }
    if (gScope.includes('fencing_screens')) {
      addItem('External & Grounds', 'Install contemporary boundary fencing & slatted cedar screens', 'Horizontal slatted timber fencing or acoustic panels with treated posts.', 1800, 3600, area);
    }
    if (gScope.includes('retaining_walls')) {
      addItem('Building & Structural', 'Build rendered retaining walls & multi-level garden steps', 'Engineered blockwork retaining walls with drainage weep holes and stone step copings.', 2400, 4800, area);
    }
    if (gScope.includes('garden_drainage')) {
      addItem('External & Grounds', 'Install ACO linear drainage channels & soakaway system', 'Permeable drainage preventing rainwater pooling against exterior walls.', 950, 1900, area);
    }
    if (gScope.includes('outdoor_lighting')) {
      addItem('Electrical & Lighting', 'Install low-voltage ambient garden lighting & outdoor power socket', 'Waterproof exterior IP66 double power socket and warm spike spotlights.', 750, 1500, area);
    }
  }

  // =========================================================================
  // 6. DRIVEWAY SCOPE (Only when projectType === 'driveway')
  // =========================================================================
  else if (projectType === 'driveway') {
    const area = 'Driveway & Entrance';
    addItem('Preparation & Demolition', 'Excavate existing driveway & lay compacted Type 1 sub-base', 'Excavating ground to 200mm depth, laying geotextile weed membrane and compacted MOT sub-base.', 1800, 3400, area);

    const surface = answers.driveway_surface || 'resin_bound';
    if (surface === 'block_paving') {
      addItem('External & Grounds', 'Lay premium block paving / Tegula sets with edge restraints', 'High-density concrete block pavers in herringbone pattern with kiln-dried silica sand jointing.', 3400, 6800, area);
    } else if (surface === 'tarmac_granite') {
      addItem('External & Grounds', 'Lay SMA black tarmacadam with silver granite set kerbs', 'Stone mastic asphalt laid on prepared base with natural granite kerb edging.', 3200, 6200, area);
    } else if (surface === 'gravel_grids') {
      addItem('External & Grounds', 'Install cellular grid gravel reinforcement & aggregate', 'Heavy-duty gravel stabilisation grids filled with washed 20mm decorative gravel.', 2200, 4400, area);
    } else {
      addItem('External & Grounds', 'Supply & lay UV-stable resin-bound marble aggregate surface', 'Seamless permeable resin-bound natural aggregate surface (18mm thickness) on porous tarmac base.', 3800, 7500, area);
    }

    const dFeats = (answers.driveway_features as string[]) || [];
    if (dFeats.includes('dropped_kerb')) {
      addItem('External & Grounds', 'Council dropped kerb crossover construction & dropped kerbs', 'Highways compliant dropped kerb vehicle crossing across pavement.', 1600, 3200, area);
    }
    if (dFeats.includes('brick_piers_walls')) {
      addItem('Building & Structural', 'Build front boundary brick wall with stone pier caps', 'Cavity brick wall matching house with engineered concrete footings and coping stones.', 2400, 4800, area);
    }
    if (dFeats.includes('drainage_channel') || dFeats.length === 0) {
      addItem('External & Grounds', 'Install permeable ACO linear drainage channels & soakaway', 'SUDS-compliant drainage interceptor preventing rainwater runoff onto road.', 850, 1600, area);
    }
    if (dFeats.includes('ev_charger')) {
      addItem('Electrical & Lighting', 'Install underground EV car charger ducting & cable run', 'Armoured SWA cable conduit routed from house consumer unit to driveway charging point.', 650, 1300, area);
    }
  }

  // =========================================================================
  // 7. FULL HOUSE RENOVATION SCOPE (Only when projectType === 'full-renovation')
  // =========================================================================
  else if (projectType === 'full-renovation') {
    addItem('Preparation & Demolition', 'Complete house strip out, fixture removal & skip disposal', 'Stripping all old carpets, tiles, sanitaryware, kitchen units, damaged plaster and wallpaper.', 2200, 4500, 'Whole House');

    if (answers.renovation_structural === 'major_layout_changes') {
      addItem('Building & Structural', 'Remove internal load-bearing walls & install RSJ steel beams', 'Temporary propping, masonry removal and structural steel beam installations across ground floor.', 5500, 10500, 'Ground Floor');
    }

    const sys = (answers.renovation_systems as string[]) || [];
    if (sys.includes('full_rewire') || sys.length === 0) {
      addItem('Electrical & Lighting', 'Full property electrical rewire & dual RCD consumer unit', 'Complete new cabling, sockets, downlights, switches and Part P electrical signoff.', 4500, 8500, 'Whole House');
    }
    if (sys.includes('boiler_megaflo') || sys.length === 0) {
      addItem('Plumbing & Heating', 'Install new system boiler & Megaflo unvented cylinder', 'High-flow unvented hot water cylinder and condensing gas boiler supplying all showers.', 3800, 7200, 'Heating & Hot Water');
    }
    if (sys.includes('wet_underfloor_heating')) {
      addItem('Plumbing & Heating', 'Install water underfloor heating across entire ground floor', 'Low-profile manifold pipe system in screed with multi-zone digital thermostats.', 3200, 6400, 'Ground Floor');
    }

    addItem('Installation & Cabinetry', 'Full kitchen renovation with cabinetry, worktops & appliances', 'Bespoke cabinetry, quartz worktops, undermount sink, induction hob and integrated appliances.', 8500, 18500, 'Kitchen & Dining');
    addItem('Plumbing & Heating', 'Complete family bathroom and ensuite renovation', 'Walk-in showers, vanity units, wall-hung toilets, porcelain tiling and heated towel rails.', 6500, 13500, 'Bathrooms');
    addItem('Carpentry & Joinery', 'Supply & fit solid-core internal doors, skirtings & architraves', 'Contemporary internal doors with brushed handles, 150mm skirtings and architraves throughout.', 2800, 5600, 'Whole House');
    addItem('Finishing & Decorating', 'Full plaster skim coat to all ceilings and walls throughout', 'Two-coat multi-finish plastering providing smooth crack-free surfaces ready for painting.', 4500, 8800, 'Whole House');
    addItem('Finishing & Decorating', 'Lay engineered hardwood flooring and carpets to bedrooms', 'Seamless acoustic flooring to ground floor and luxury wool carpets to stairs and bedrooms.', 4200, 8500, 'Flooring');
    addItem('Finishing & Decorating', 'Professional mist coat and full two-coat decorating throughout', 'Complete painting of all walls, ceilings, skirtings and woodwork.', 3200, 6400, 'Whole House');
  }

  // =========================================================================
  // 8. OTHER / STRUCTURAL SCOPE (projectType === 'other')
  // =========================================================================
  else {
    const area = 'Project Area';
    addItem('Preparation & Demolition', 'Site preparation, protection & initial strip out', 'Dust barriers, floor protection and safe removal of affected fixtures.', 500, 1000, area);
    addItem('Building & Structural', 'Structural alterations, steel support & making good', 'Careful structural modification, steel beam support and Building Control compliance.', 3200, 6500, area);
    addItem('Electrical & Lighting', 'Electrical modifications & lighting circuit', 'Adding power outlets, switches, and energy-efficient lighting.', 650, 1300, area);
    addItem('Finishing & Decorating', 'Plaster skim and professional decorating finish', 'Smooth surface plastering and durable paint finish.', 850, 1700, area);
  }

  return items;
}

/**
 * Generates tailored recommendations STRICTLY TAGGED by project type.
 * NO cross-project contamination!
 */
export function generateContextualRecommendations(
  input: ComprehensivePlannerInput
): RecommendedWorkItem[] {
  const recommendations: RecommendedWorkItem[] = [];
  const projectType = (input.projectType || 'other') as ProjectType;

  // 1. Bathroom Recommendation
  if (projectType === 'bathroom') {
    recommendations.push({
      id: 'rec-bathroom-extractor',
      title: 'High-Efficiency Mechanical Extractor Fan (Part F Compliant)',
      areaName: 'Bathroom',
      category: 'Electrical & Lighting',
      reason: 'Recommended for your bathroom renovation to prevent steam buildup, eliminate condensation, and comply with Part F Building Regulations.',
      costLow: 450,
      costHigh: 850,
      status: 'suggested',
    });
  }

  // 2. Kitchen Recommendation
  else if (projectType === 'kitchen') {
    recommendations.push({
      id: 'rec-kitchen-task-lighting',
      title: 'Under-Cabinet Warm LED Task Lighting & Dimmer Circuit',
      areaName: 'Kitchen & Dining',
      category: 'Electrical & Lighting',
      reason: 'Recommended for optimal food preparation illumination and ambient evening dining atmosphere.',
      costLow: 350,
      costHigh: 750,
      status: 'suggested',
    });
  }

  // 3. Extension Recommendation
  else if (projectType === 'extension') {
    recommendations.push({
      id: 'rec-extension-building-regs',
      title: 'Building Control Inspection & Structural Engineer Calculation Pack',
      areaName: 'Extension & Shell',
      category: 'Building & Structural',
      reason: 'Required for all extensions to certify foundation depths, steel beam sizing, and provide your lawful completion certificate.',
      costLow: 1200,
      costHigh: 2200,
      status: 'suggested',
    });
  }

  // 4. Loft Recommendation
  else if (projectType === 'loft') {
    recommendations.push({
      id: 'rec-loft-fire-safety',
      title: 'Interlinked Optical Smoke Alarms & Part B Fire Safety Pack',
      areaName: 'Loft Conversion',
      category: 'Electrical & Lighting',
      reason: 'Mandatory Building Regulations requirement for 3-storey converted houses to ensure early fire warning in all escape corridors.',
      costLow: 450,
      costHigh: 850,
      status: 'suggested',
    });
  }

  // 5. Garden / Driveway Recommendation
  else if (projectType === 'garden' || projectType === 'driveway') {
    recommendations.push({
      id: 'rec-drainage-soakaway',
      title: 'ACO Linear Permeable Drainage Channel & Soakaway Crate',
      areaName: projectType === 'garden' ? 'Garden & Patio' : 'Driveway & Entrance',
      category: 'External & Grounds',
      reason: 'Recommended to prevent standing water accumulation against exterior walls and comply with SUDS environmental drainage rules.',
      costLow: 650,
      costHigh: 1200,
      status: 'suggested',
    });
  }

  // 6. Pre-1960 Electrical Inspection (Full renovation)
  else if (projectType === 'full-renovation' && (input.propertyAge === 'pre_1900' || input.propertyAge === '1900_1930' || input.propertyAge === '1930_1960')) {
    recommendations.push({
      id: 'rec-electrical-check',
      title: 'Full Electrical Installation Condition Report (EICR) & RCD Protection',
      areaName: 'Whole House',
      category: 'Electrical & Lighting',
      reason: 'Recommended because your property was built before 1960, ensuring all old circuits have modern RCD surge and fire protection.',
      costLow: 400,
      costHigh: 800,
      status: 'suggested',
    });
  }

  return recommendations;
}

/**
 * Classifies free-text custom items added by the customer and assigns trade categories and cost ranges
 */
export function classifyCustomUserItem(
  text: string,
  areaName: string,
  finishLevel: FinishLevel = 'standard'
): ProjectScopeItem {
  const lower = text.toLowerCase();
  const finishMultiplier =
    finishLevel === 'budget' ? 0.85 : finishLevel === 'premium' ? 1.25 : finishLevel === 'luxury' ? 1.6 : 1.0;

  let category: WorkCategory = 'Finishing & Decorating';
  let baseLow = 450;
  let baseHigh = 950;

  if (lower.includes('steel') || lower.includes('rsj') || lower.includes('knock') || lower.includes('beam') || lower.includes('structural')) {
    category = 'Building & Structural';
    baseLow = 2200;
    baseHigh = 4500;
  } else if (lower.includes('cupboard') || lower.includes('cabinet') || lower.includes('unit') || lower.includes('wardrobe') || lower.includes('joinery') || lower.includes('shelf') || lower.includes('bench') || lower.includes('storage')) {
    category = 'Installation & Cabinetry';
    baseLow = 1200;
    baseHigh = 2600;
  } else if (lower.includes('shower') || lower.includes('bath') || lower.includes('tap') || lower.includes('toilet') || lower.includes('plumb') || lower.includes('pipe') || lower.includes('heating') || lower.includes('radiator')) {
    category = 'Plumbing & Heating';
    baseLow = 750;
    baseHigh = 1600;
  } else if (lower.includes('light') || lower.includes('socket') || lower.includes('wire') || lower.includes('spotlight') || lower.includes('electric')) {
    category = 'Electrical & Lighting';
    baseLow = 550;
    baseHigh = 1200;
  } else if (lower.includes('door') || lower.includes('bifold') || lower.includes('window') || lower.includes('skylight') || lower.includes('glass')) {
    category = 'Glazing & Openings';
    baseLow = 1800;
    baseHigh = 3800;
  } else if (lower.includes('patio') || lower.includes('decking') || lower.includes('garden') || lower.includes('driveway') || lower.includes('lawn')) {
    category = 'External & Grounds';
    baseLow = 1400;
    baseHigh = 2800;
  }

  const costLow = Math.round((baseLow * finishMultiplier) / 50) * 50;
  const costHigh = Math.round((baseHigh * finishMultiplier) / 50) * 50;

  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
    areaId: `area-${areaName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    areaName,
    category,
    name: text.charAt(0).toUpperCase() + text.slice(1),
    description: `Custom specification requested: "${text}". Indicative pricing based on standard trade supply and installation.`,
    selected: true,
    customItem: true,
    pricingStatus: 'estimated',
    costLow,
    costHigh,
  };
}

/**
 * Generates an accurate, natural language summary of what the customer asked for
 * (Conforms to BUILD_SPEC.md & Phase 2 verification)
 */
export function generateProjectSummary(
  input: ComprehensivePlannerInput,
  answers: Record<string, any> = {}
): string {
  const projectType = (input.projectType || 'other') as ProjectType;
  const finish = input.finishLevel ? `${input.finishLevel} finish` : 'standard finish';

  if (projectType === 'bathroom') {
    const scope = answers.bathroom_scope;
    const isNew = scope === 'create_new_bathroom';
    const isRefresh = scope === 'replace_elements';
    const hasMove = answers.bathroom_layout_change === 'change_layout';
    const features = (answers.bathroom_features as string[]) || [];
    const featNames = features.map((f) => f.replace(/_/g, ' ')).slice(0, 3).join(', ');

    return `You're planning ${isNew ? 'to create an entirely new bathroom' : isRefresh ? 'a bathroom refresh' : 'a full bathroom renovation'} ${hasMove ? 'with reconfigured plumbing layout' : 'keeping existing plumbing layout'}${featNames ? `, including ${featNames}` : ''}, completed in a ${finish}.`;
  }

  if (projectType === 'kitchen') {
    const scope = answers.kitchen_scope;
    const isKnock = answers.kitchen_wall_removal === 'remove_wall' || scope === 'open_plan_knockthrough';
    const hasFlush = answers.kitchen_flush_steel === 'flush_steel';
    const features = (answers.kitchen_features as string[]) || [];
    const featNames = features.map((f) => f.replace(/_/g, ' ')).slice(0, 3).join(', ');

    return `You're planning ${isKnock ? 'an open-plan kitchen knockthrough' : 'a full kitchen renovation'} ${isKnock && hasFlush ? 'with a hidden flush ceiling RSJ beam' : ''}${featNames ? ` including ${featNames}` : ''}, completed in a ${finish}.`;
  }

  if (projectType === 'extension') {
    const type = answers.extension_type || 'single-storey rear extension';
    const length = answers.extension_length_exact || 5;
    const width = answers.extension_width_exact || 4;
    const glazing = (answers.extension_glazing as string[]) || [];
    const glazingSummary = glazing.map((g) => g.replace(/_/g, ' ')).join(' & ');

    return `You're planning a ${length}m × ${width}m ${type.replace(/_/g, ' ')}${glazingSummary ? ` featuring ${glazingSummary}` : ''}, completed to a watertight structural shell and interior turnkey fit-out in a ${finish}.`;
  }

  if (projectType === 'loft') {
    const dormer = answers.loft_type || 'rear dormer loft conversion';
    const rooms = answers.loft_rooms || '1 master bedroom & ensuite';
    return `You're planning a ${dormer.replace(/_/g, ' ')} creating ${rooms.replace(/_/g, ' ')} with building regulations approval in a ${finish}.`;
  }

  if (projectType === 'garden') {
    const scope = (answers.garden_scope as string[]) || [];
    const scopeNames = scope.map((s) => s.replace(/_/g, ' ')).join(', ');
    return `You're planning garden & landscaping works${scopeNames ? ` including ${scopeNames}` : ' with porcelain patio and landscaping upgrades'}, finished to a ${finish}.`;
  }

  if (projectType === 'driveway') {
    const surface = answers.driveway_surface || 'resin-bound';
    return `You're planning a new ${surface.replace(/_/g, ' ')} driveway and entrance with ground excavation, permeable sub-base, and boundary edges in a ${finish}.`;
  }

  return `You're planning a ${input.customDescription || 'structural improvement project'} with professional construction management and turnkey finishing in a ${finish}.`;
}

/**
 * PHASE 4: AI Budget Optimizer
 * Evaluates the current estimate and returns realistic, safe scope optimizations.
 */
export interface BudgetOptimizationOption {
  id: string;
  title: string;
  category: 'layout_saving' | 'material_alternative' | 'phasing' | 'specification';
  estimatedSavingMinGbp: number;
  estimatedSavingMaxGbp: number;
  tradeOffDescription: string;
  pros: string[];
  cons: string[];
  isSafeAndCompliant: boolean;
}

export function generateBudgetOptimizationOptions(
  input: ComprehensivePlannerInput,
  currentEstimatedTotal: number,
  targetBudget?: number
): BudgetOptimizationOption[] {
  const projectType = input.projectType;
  const options: BudgetOptimizationOption[] = [];

  if (projectType === 'extension' || projectType === 'kitchen' || projectType === 'full-renovation') {
    options.push({
      id: 'opt-drainage-alignment',
      title: 'Retain Existing Soil Vent Pipe & Foul Drain Location',
      category: 'layout_saving',
      estimatedSavingMinGbp: 1800,
      estimatedSavingMaxGbp: 3200,
      tradeOffDescription:
        'Instead of relocating the underground foul drain and core drilling through external footings, plan the kitchen sink and island waste close to the existing stack.',
      pros: ['Saves significant ground excavation & underground pipe re-routing', 'Reduces risk of Thames Water build-over complications', 'Shortens first-fix plumbing duration by 3–4 days'],
      cons: ['Slight constraint on where the kitchen sink / dishwasher is positioned on the floorplan'],
      isSafeAndCompliant: true,
    });

    options.push({
      id: 'opt-glazing-standardisation',
      title: 'Standard Modular Bifold / Sliding Doors vs Custom Oversized Panels',
      category: 'specification',
      estimatedSavingMinGbp: 2500,
      estimatedSavingMaxGbp: 5000,
      tradeOffDescription:
        'Specify standard opening widths (e.g. 3.0m or 4.0m aluminium sliders) rather than bespoke floor-to-ceiling 3.0m structural glass panels that require crane lifting.',
      pros: ['Standard lead times (2–3 weeks vs 8–10 weeks bespoke)', 'Standard structural lintel sizing without custom goalpost steel frame', 'Lower future seal replacement costs'],
      cons: ['Frame profile sightlines are standard rather than ultra-slim structural glass'],
      isSafeAndCompliant: true,
    });
  }

  if (projectType === 'bathroom' || projectType === 'full-renovation') {
    options.push({
      id: 'opt-bathroom-tile-zones',
      title: 'Zone-Specific Tiling (Wet Areas Only) with Anti-Mould Eggshell Paint',
      category: 'material_alternative',
      estimatedSavingMinGbp: 900,
      estimatedSavingMaxGbp: 1800,
      tradeOffDescription:
        'Tile 100% of the shower enclosure and splashback areas to full height, but paint dry wall areas with high-durability breathable bathroom eggshell.',
      pros: ['Saves tile material & tiler labour days', 'Modern Scandi aesthetic that feels warmer than cold full tiling', 'Allows future colour refreshes without retiling'],
      cons: ['Dry walls need wiping down occasionally'],
      isSafeAndCompliant: true,
    });
  }

  if (input.finishLevel === 'luxury' || input.finishLevel === 'premium') {
    options.push({
      id: 'opt-engineered-timber-vs-solid',
      title: 'High-Spec Engineered Oak Flooring over Solid Hardwood',
      category: 'material_alternative',
      estimatedSavingMinGbp: 1200,
      estimatedSavingMaxGbp: 2800,
      tradeOffDescription:
        'Install 20mm/6mm multi-ply engineered brushed European oak rather than solid timber planks.',
      pros: ['100% compatible with wet underfloor heating (solid hardwood warps and cups over UFH)', 'More dimensionally stable in humid London seasons', 'Identical genuine timber finish and feel underfoot'],
      cons: ['Can only be re-sanded 3–4 times over 40 years compared to solid timber'],
      isSafeAndCompliant: true,
    });
  }

  // Phase joinery option
  options.push({
    id: 'opt-phase-fitted-joinery',
    title: 'Phase Built-in Wardrobes & Media Unit (Post-Handover)',
    category: 'phasing',
    estimatedSavingMinGbp: 3000,
    estimatedSavingMaxGbp: 6500,
    tradeOffDescription:
      'Complete all structural, wet trades, plastering, first/second fix electrics, and core decorating, while deferring bespoke MDF cabinetry to Phase 2.',
    pros: ['Reduces upfront construction capital outlay', 'Allows you to live in the finished rooms before finalizing furniture ergonomics', 'Zero impact on Building Regulations completion certificate'],
    cons: ['Joiner returns for 3–5 days after move-in'],
    isSafeAndCompliant: true,
  });

  return options;
}

/**
 * PHASE 4: Era-Specific London Builder Observations & Inspection Questions
 */
export function generateEraSpecificBuilderChecklist(propertyEra: string, projectType: string): string[] {
  const era = (propertyEra || 'victorian').toLowerCase();
  const checks: string[] = [];

  if (era.includes('victorian') || era.includes('edwardian') || era.includes('pre_1900') || era.includes('1900_1930')) {
    checks.push('Inspect subfloor timber joist depth and moisture content at party wall plates');
    checks.push('Confirm solid 9-inch brickwork damp-proof course (DPC) level and air brick clearance');
    checks.push('Verify incoming dynamic water mains pressure (minimum 18L/min needed for unvented cylinder)');
    checks.push('Check condition of external lime pointing before sealing internal vapour control layers');
  } else if (era.includes('1930') || era.includes('1950')) {
    checks.push('Check for cavity wall ties condition and asbestos in soffits or artex ceilings');
    checks.push('Verify suspended timber vs solid concrete ground floor slab transition');
  } else {
    checks.push('Inspect existing consumer unit (fuse box) RCD protection and earthing bonding');
    checks.push('Check ceiling void depth for recessed lighting and ventilation duct runs');
  }

  if (projectType === 'extension') {
    checks.push('Map shared Thames Water foul drain invert level from nearest manhole');
    checks.push('Measure neighbour foundation depth for Section 6 Party Wall 3-metre rule');
  }

  return checks;
}

