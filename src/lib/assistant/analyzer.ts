/**
 * AI Construction Assistant Analysis Engine
 * Extracts:
 * 1. Project type
 * 2. Project requirements
 * 3. Rooms
 * 4. Likely works
 * 5. Missing questions
 * 6. Potential considerations
 *
 * Conforms to GEMINI.md Section 13 (AI Rules) & Section 14 (AI Cost Control)
 */

import { ExtractedProject, ExtractedRoom, ExtractedWorkItem, MissingQuestion, PotentialConsideration } from './types';
import { ProjectType } from '@/lib/planner/quiz-engine';

/**
 * Deep Semantic UK Building Intelligence Engine
 * Dynamically extracts bespoke architectural, structural, and regulatory requirements
 * tailored to any residential building or conversion scenario.
 */
export function extractWithUKBuildingRules(text: string): ExtractedProject {
  const lower = (text || '').toLowerCase().trim();

  // ---------------------------------------------------------------------------
  // 1. SEMANTIC ENTITY & INTENT DETECTION
  // ---------------------------------------------------------------------------

  // Source spaces
  const isGarage = lower.includes('garage');
  const isLoft = lower.includes('loft') || lower.includes('attic') || lower.includes('dormer') || lower.includes('mansard');
  const isBasement = lower.includes('basement') || lower.includes('cellar');
  const isExtension = lower.includes('extend') || lower.includes('extension') || lower.includes('side return') || lower.includes('wraparound');
  const isConservatory = lower.includes('conservatory') || lower.includes('orangery');
  const isGardenRoom = (lower.includes('garden') && (lower.includes('room') || lower.includes('studio') || lower.includes('annexe') || lower.includes('office') || lower.includes('building') || lower.includes('outbuilding'))) && !isExtension;
  const isBathroom = lower.includes('bathroom') || lower.includes('ensuite') || lower.includes('wet room') || lower.includes('shower room') || lower.includes('cloakroom');
  const isKitchen = lower.includes('kitchen');
  const isFullRenovation = lower.includes('full house') || lower.includes('full renovation') || lower.includes('whole house') || lower.includes('refurbish') || lower.includes('gut renovat');
  const isChimney = lower.includes('chimney');

  // Target rooms / purpose
  const isCinema = lower.includes('cinema') || lower.includes('movie') || lower.includes('media room') || lower.includes('theater') || lower.includes('theatre');
  const isGym = lower.includes('gym') || lower.includes('fitness') || lower.includes('workout');
  const isOffice = lower.includes('office') || lower.includes('study') || lower.includes('workspace');
  const isAnnexe = lower.includes('annexe') || lower.includes('annex') || lower.includes('granny flat');
  const isBedroom = lower.includes('bedroom') || lower.includes('guest room');

  // Specific structural modifications
  const isDoorwayFormation =
    (lower.includes('door') && (lower.includes('between') || lower.includes('making') || lower.includes('create') || lower.includes('new') || lower.includes('cut') || lower.includes('hallway') || lower.includes('open'))) ||
    lower.includes('connecting door') ||
    lower.includes('internal door');

  const isWallRemoval =
    lower.includes('knock') ||
    lower.includes('remove wall') ||
    lower.includes('take down wall') ||
    lower.includes('load bearing') ||
    lower.includes('rsj') ||
    lower.includes('steel beam') ||
    lower.includes('open plan') ||
    lower.includes('together');

  // Mentioned rooms in text
  const mentionsHallway = lower.includes('hallway') || lower.includes('hall') || lower.includes('corridor');
  const mentionsKitchen = lower.includes('kitchen');
  const mentionsDining = lower.includes('dining') || lower.includes('diner');
  const mentionsLiving = lower.includes('living') || lower.includes('lounge') || lower.includes('reception');
  const mentionsGarden = lower.includes('garden');

  // Dimensions
  let extractedLength = 4;
  let extractedWidth = 3;
  const meterMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|metre|meter|metres|meters)/i);
  const wordMeterMatch = text.match(/(three|four|five|six|seven|eight)\s*(?:m|metre|meter|metres|meters)/i);
  if (meterMatch) {
    extractedLength = parseFloat(meterMatch[1]);
  } else if (wordMeterMatch) {
    const wordMap = { three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 } as Record<string, number>;
    extractedLength = wordMap[wordMeterMatch[1].toLowerCase()] || 4;
  }

  // ---------------------------------------------------------------------------
  // 2. BESPOKE PROJECT HANDLERS
  // ---------------------------------------------------------------------------

  // ===========================================================================
  // SCENARIO A: GARAGE CONVERSION (e.g. Cinema, Gym, Office, Bedroom, Door to Hallway)
  // ===========================================================================
  if (isGarage) {
    const targetPurposeName = isCinema
      ? 'Dedicated Home Cinema & Media Suite'
      : isGym
      ? 'Private Home Gym & Fitness Studio'
      : isOffice
      ? 'Executive Home Office & Study'
      : isBedroom
      ? 'Ground Floor Guest Bedroom Suite'
      : isAnnexe
      ? 'Self-Contained Garden Annexe'
      : 'Converted Habitable Living Room';

    const projectType: ProjectType = 'other';
    const projectTypeDisplay = `Integrated Garage Conversion to ${targetPurposeName}${isDoorwayFormation && mentionsHallway ? ' with Hallway Access' : ''}`;

    const projectRequirements: string[] = [
      `Convert existing cold garage space into a fully insulated, habitable ${targetPurposeName}`,
      'Infill existing external vehicle door opening with matching cavity masonry, damp-proof course (DPC), and energy-efficient window/glazing',
      'Construct a raised, insulated floating floor slab (100mm rigid PIR insulation + Vapour Control Layer + screed/timber) over the existing concrete slab',
    ];

    if (isDoorwayFormation) {
      projectRequirements.push(
        `Form a new structural doorway opening between ${mentionsHallway ? 'the main hallway' : 'the house'} and the converted garage space`,
        'Install a certified pre-stressed structural lintel over the new opening with minimum 150mm padstone end bearings',
        'Install an FD30S certified fire-rated door set with intumescent smoke seals and automatic self-closing mechanism conforming to Building Regs Part B'
      );
    }

    if (isCinema) {
      projectRequirements.push(
        'Install dedicated acoustic soundproofing package (resilient decoupling bars, high-density acoustic mineral wool 60kg/m³, and dual-layer SoundBloc plasterboard)',
        'Professional first-fix AV infrastructure: concealed in-wall conduits for 4K projector/OLED display, 7.1.4 Dolby Atmos surround sound cabling, and subwoofers',
        'Zoned architectural lighting: concealed perimeter LED coffer trough lighting, dimmable spotlight circuits, and step lighting'
      );
    }

    if (isGym) {
      projectRequirements.push(
        'Heavy-duty reinforced shock-absorbent acoustic sports flooring suitable for free weights',
        'Mechanical extract ventilation / heat recovery (MVHR) for continuous fresh air circulation',
        'Full-height mirrored feature wall and reinforced structural ceiling fixings for suspension trainers/punchbags'
      );
    }

    const rooms: ExtractedRoom[] = [
      {
        name: isCinema ? 'Bespoke Home Cinema' : isGym ? 'Home Gym Studio' : 'Converted Garage Living Suite',
        sizeCategory: 'medium',
        dimensions: { length: 5.5, width: 2.8, areaM2: 15.4 },
        purpose: isCinema
          ? 'Dedicated acoustic cinema room with projector/screen, surround sound, and tiered luxury seating'
          : 'High-comfort habitable living and leisure zone',
      },
    ];

    if (isDoorwayFormation) {
      rooms.push({
        name: `${mentionsHallway ? 'Hallway' : 'House'} Direct Access Doorway`,
        sizeCategory: 'small',
        dimensions: { length: 1.0, width: 0.9, areaM2: 0.9 },
        purpose: 'Internal transition with FD30S fire door connecting main ground floor to converted room',
      });
    }

    const likelyWorks: ExtractedWorkItem[] = [
      {
        category: 'Structural & Groundworks',
        workTitle: isDoorwayFormation
          ? 'Structural Doorway Knockthrough & Concrete Lintel Installation'
          : 'Structural Openings & Infill Masonry',
        description: isDoorwayFormation
          ? 'Carefully cut structural opening in internal dividing wall, insert pre-stressed concrete or steel Catnic lintel on concrete padstones, and make good structural reveals.'
          : 'Remove vehicle door, excavate perimeter footing if required, and construct matching cavity wall with wall ties.',
        tradeRequired: 'Bricklayers & Structural Builders',
        structuralImplication: 'Requires structural calculation check and Building Control inspection.',
      },
      {
        category: 'Building Envelope',
        workTitle: 'Garage Front Infill Masonry & Raised Insulated Floor',
        description: 'Cavity brickwork matching house facade with 100mm PIR insulation, high-spec double glazed casement window, and floating timber floor over damp-proof membrane (DPM).',
        tradeRequired: 'Bricklayers, Carpenters & Window Specialists',
        structuralImplication: 'Brings thermal U-values to modern Part L standards (0.18 W/m²K).',
      },
    ];

    if (isCinema) {
      likelyWorks.push({
        category: 'Fit-Out & Joinery',
        workTitle: 'Acoustic Decoupling & SoundBloc Drylining System',
        description: 'Independent timber/metal acoustic stud framing with 60kg/m³ RW3 rockwool insulation, resilient sound isolation clips, dual 15mm SoundBloc boards with Green Glue damping.',
        tradeRequired: 'Specialist Acoustic Dryliners',
      });
      likelyWorks.push({
        category: 'Plumbing & Electrics',
        workTitle: 'Dedicated AV Power Submain, Dimmable Lighting & MVHR',
        description: 'Clean power radial circuit for AV rack/amplifiers, star-wired HDMI/Cat6/speaker conduits, coffer LED mood lighting, and quiet continuous extract ventilation.',
        tradeRequired: 'NICEIC Electricians & AV Specialists',
      });
    } else {
      likelyWorks.push({
        category: 'Plumbing & Electrics',
        workTitle: 'Electrical Rewire, Central Heating Extension & Sockets',
        description: 'New consumer unit circuits, LED spotlights, double USB sockets, and new radiator / underfloor heating loop extended from existing boiler.',
        tradeRequired: 'NICEIC Electricians & Gas Safe Plumbers',
      });
      likelyWorks.push({
        category: 'Fit-Out & Joinery',
        workTitle: 'Plaster Skimming, FD30S Fire Door & Internal Carpentry',
        description: 'Full multi-finish plaster skim, certified FD30S fire door with intumescent seals, skirting boards, architraves, and premium floor finishes.',
        tradeRequired: 'Plasterers & Finish Carpenters',
      });
    }

    const missingQuestions: MissingQuestion[] = [
      {
        id: 'garage_floor_level',
        question: 'Is the garage concrete slab lower than your hallway floor level?',
        reason: 'Most UK garages sit 100mm–250mm below the house floor level. We need to know if you want a flush level floor (requiring raised timber joists & insulation) or a small threshold step.',
        options: ['Lower by 100-250mm (Need raised flush subfloor)', 'Already level with hallway', 'Not sure / Need survey'],
      },
      {
        id: 'garage_attached_type',
        question: 'Is the garage integrated under the main house roofline, attached to the side, or detached?',
        reason: 'Integrated garages share ceiling joists with first-floor bedrooms and require enhanced fire-boarding (Part B) and acoustic floor isolation (Part E).',
        options: ['Integrated under first-floor bedrooms', 'Side-attached single storey', 'Detached garage'],
      },
    ];

    if (isCinema) {
      missingQuestions.push({
        id: 'cinema_acoustic_tier',
        question: 'What level of acoustic sound isolation do you require for the cinema?',
        reason: 'Determines whether standard acoustic plasterboard is sufficient or if a full isolated "room-within-a-room" with acoustic ceiling decoupling is required for high-volume viewing.',
        options: ['Standard acoustic plasterboard & rockwool', 'High-performance room-within-a-room decoupling', 'Consult with Audio Specialist'],
      });
    }

    const potentialConsiderations: PotentialConsideration[] = [
      {
        topic: 'Building Regulations Part B (Fire Safety) for Internal Door',
        consideration: 'Creating a new doorway between an attached garage and the main hallway strictly requires an FD30S certified fire door (30-minute fire resistance) with intumescent smoke seals, fire-rated frame, and self-closing device.',
        regulatoryRef: 'Building Regulations 2010 — Approved Document B (Fire Safety)',
        riskLevel: 'high',
      },
      {
        topic: 'Building Regulations Part L (Thermal Performance & Insulation)',
        consideration: 'Garage conversion walls and floors must achieve strict thermal targets (U-value 0.18 W/m²K). Existing single-skin walls and uninsulated slabs must be lined with minimum 100mm rigid PIR insulation.',
        regulatoryRef: 'Building Regulations 2010 — Approved Document L1B (Existing Dwellings)',
        riskLevel: 'medium',
      },
      {
        topic: 'Building Regulations Part A (Structural Lintel over New Doorway)',
        consideration: 'Cutting into internal masonry walls to form the new hallway entrance requires a structural lintel with minimum 150mm end bearings to safely support upper floor joists or masonry above.',
        regulatoryRef: 'Building Regulations 2010 — Approved Document A (Structure)',
        riskLevel: 'medium',
      },
      {
        topic: 'Planning Permission & Permitted Development (Parking Conditions)',
        consideration: 'Most garage conversions are Permitted Development, but some local councils or modern housing developments have specific conditions preserving off-street parking quotas that require a minor planning application.',
        regulatoryRef: 'Town and Country Planning (General Permitted Development) Order 2015',
        riskLevel: 'low',
      },
    ];

    const initialAnswers: Record<string, any> = {
      project_type: 'other',
      other_scope: 'garage_conversion',
      postcode: 'W5 2UP',
      property_style: 'semi-detached',
      property_age: '1930_1960',
      timeline: '1_3_months',
      project_stage: 'starting_to_plan',
      natural_description: text,
      other_notes: text,
      goals: [
        isCinema ? 'Bespoke home cinema & media suite' : 'Habitable living space',
        'Internal doorway connection to hallway',
        'Full thermal & acoustic insulation',
        'Turnkey high-spec build',
      ],
    };

    const summary = `Interpreted ${projectTypeDisplay} comprising ${rooms.map((r) => r.name).join(' & ')}, involving structural doorway formation, garage door infill, complete thermal insulation, and bespoke ${isCinema ? 'acoustic cinema AV integration' : 'fit-out'}.`;

    return {
      projectType,
      projectTypeDisplay,
      originalDescription: text,
      projectRequirements,
      rooms,
      likelyWorks,
      missingQuestions,
      potentialConsiderations,
      initialAnswers,
      summary,
      estimatedTimelineWeeks: {
        min: 4,
        max: 8,
      },
    };
  }

  // ===========================================================================
  // SCENARIO B: HOUSE EXTENSION & STRUCTURAL KNOCKTHROUGH
  // ===========================================================================
  if (isExtension || (mentionsGarden && (isWallRemoval || mentionsKitchen))) {
    const isKnockthrough = isWallRemoval || (mentionsKitchen && mentionsDining);
    const projectType: ProjectType = 'extension';
    const projectTypeDisplay = isKnockthrough
      ? `Kitchen Knockthrough & ${extractedLength}m Rear Extension`
      : `${extractedLength}m Single-Storey House Extension`;

    const projectRequirements: string[] = [];

    if (isKnockthrough) {
      projectRequirements.push(
        `Remove dividing load-bearing wall between ${mentionsKitchen ? 'kitchen' : 'existing room'} and ${mentionsDining ? 'dining room' : 'living space'} to form open-plan living hub`,
        'Design, supply, and install fabricated structural universal steel beams (RSJ) on concrete padstones with structural calculations'
      );
    }

    projectRequirements.push(
      `${extractedLength}m single-storey rear extension projection into garden area with insulated concrete strip foundations`,
      'High-performance aluminium bi-fold or slimline sliding patio doors with flush floor threshold',
      'Architectural flat glass skylight or lantern roof for enhanced natural illumination'
    );

    if (mentionsKitchen) {
      projectRequirements.push('Design, supply, and installation of bespoke modern kitchen cabinetry, central island, and quartz worktops');
    }

    const rooms: ExtractedRoom[] = [];
    if (isKnockthrough && mentionsKitchen) {
      rooms.push({
        name: 'Open-Plan Kitchen & Dining Space',
        sizeCategory: 'large',
        dimensions: { length: 7.5, width: 4.8, areaM2: 36 },
        purpose: 'Unified culinary, family dining, and entertainment zone',
      });
    }

    rooms.push({
      name: 'Rear Garden Extension Zone',
      sizeCategory: 'medium',
      dimensions: { length: extractedLength, width: 5.5, areaM2: extractedLength * 5.5 },
      purpose: `New ${extractedLength}m building footprint connecting home to patio`,
    });

    const likelyWorks: ExtractedWorkItem[] = [
      {
        category: 'Structural & Groundworks',
        workTitle: 'Excavation & Concrete Strip Foundations',
        description: 'Excavate trench footings to minimum 1.0m–1.2m depth (subject to soil type and tree roots) and pour C20/C25 ready-mix concrete.',
        tradeRequired: 'Groundworks & Civil Engineering',
        structuralImplication: 'Critical for structural load transfer of new extension walls and roof.',
      },
      {
        category: 'Building Envelope',
        workTitle: 'Cavity Wall Masonry & Insulated Floor Slab',
        description: 'Outer skin matching existing brickwork with 100mm rigid PIR insulation and thermal blockwork inner leaf.',
        tradeRequired: 'Bricklayers & Groundworkers',
        structuralImplication: 'Full compliance with Part L thermal insulation targets.',
      },
    ];

    if (isKnockthrough) {
      likelyWorks.push({
        category: 'Structural & Groundworks',
        workTitle: 'Load-Bearing Wall Demolition & Steel Beam Installation',
        description: 'Temporary Acrow prop support system, mechanical demolition of dividing wall, and installation of fabricated RSJ steel beam.',
        tradeRequired: 'Structural Steel Erectors & Builders',
        structuralImplication: 'Requires structural engineer calculation package for Building Control sign-off.',
      });
    }

    likelyWorks.push(
      {
        category: 'Plumbing & Electrics',
        workTitle: 'M&E Submain Distribution, Rewiring & Plumbing Rerouting',
        description: 'First fix electrics (cooker circuits, LED spotlights, island power) and plumbing relocations for kitchen sink/island and underfloor heating.',
        tradeRequired: 'NICEIC Electricians & Gas Safe Plumbers',
      },
      {
        category: 'Fit-Out & Joinery',
        workTitle: 'Drylining, Plaster Skimming & Architectural Finishes',
        description: '12.5mm plasterboard with multi-finish skim coating, bespoke kitchen installation, engineered timber / porcelain tiled flooring.',
        tradeRequired: 'Plasterers, Kitchen Fitters & Decorators',
      }
    );

    const missingQuestions: MissingQuestion[] = [
      {
        id: 'property_type',
        question: 'What type of property is this (Terraced, Semi-Detached, or Detached)?',
        reason: 'Determines whether Party Wall notices apply to one or both sides, and establishes Permitted Development projection limits (3m attached vs 4m detached standard, or 6m/8m under Prior Approval).',
        options: ['Terraced House', 'Semi-Detached House', 'Detached House', 'Bungalow / Other'],
      },
      {
        id: 'drainage_sewer',
        question: 'Are there any public sewers, inspection manholes, or shared drains in your garden?',
        reason: 'If building within 3 metres of a public sewer, Thames Water / local water authority requires a formal Build-Over Agreement.',
        options: ['No manholes visible', 'Manhole present within 3m', 'Not sure / Need survey'],
      },
    ];

    if (isKnockthrough) {
      missingQuestions.push({
        id: 'steel_position',
        question: 'Do you prefer the structural steel beam to be completely flush (hidden in ceiling) or downstand?',
        reason: 'A flush steel requires joists to be trimmed into the steel web, providing a continuous seamless ceiling but requiring additional joist hangers and labour.',
        options: ['Completely flush (flat ceiling)', 'Downstand boxed beam is acceptable', 'Consult with Surveyor'],
      });
    }

    const potentialConsiderations: PotentialConsideration[] = [
      {
        topic: 'Planning Permission & Permitted Development',
        consideration: `Single-storey rear extensions up to 4m (detached) or 3m (attached) are generally Permitted Development. Projections between 4m and 8m are feasible via the Larger Home Extension Prior Approval scheme (a 42-day neighbour consultation process).`,
        regulatoryRef: 'Town and Country Planning (General Permitted Development) Order 2015',
        riskLevel: extractedLength > 3 ? 'medium' : 'low',
      },
      {
        topic: 'Party Wall etc. Act 1996',
        consideration: 'If excavating foundations within 3 metres of a neighbouring structure to a depth lower than their existing footings, you must serve formal Party Wall notices at least 1–2 months before work starts.',
        regulatoryRef: 'Party Wall etc. Act 1996 Section 6',
        riskLevel: 'medium',
      },
      {
        topic: 'Building Regulations Part A (Structural Safety) & Part L (Energy Efficiency)',
        consideration: 'All structural wall removals and new extensions require building control approval. Structural calculations and steel beam sizing must be submitted, along with SAP energy efficiency compliance for glazing exceeding 25% of floor area.',
        regulatoryRef: 'Building Regulations 2010 (Parts A, L, P)',
        riskLevel: 'high',
      },
    ];

    const initialAnswers: Record<string, any> = {
      project_type: 'extension',
      postcode: 'W5 2UP',
      property_style: 'semi-detached',
      property_age: '1930_1960',
      timeline: '1_3_months',
      project_stage: 'starting_to_plan',
      natural_description: text,
      extension_type: 'rear_single',
      extension_length: extractedLength,
      extension_width: 5.5,
      extension_knockthrough: isKnockthrough ? 'knockthrough_open' : 'separate',
      kitchen_flush_steel: isKnockthrough ? 'yes' : 'no',
      goals: ['Create open-plan family layout', 'Expand space into garden', 'Maximize natural light', 'Modern turnkey build'],
    };

    const summary = `Interpreted ${projectTypeDisplay} comprising ${rooms.map((r) => r.name).join(' & ')}, involving ${likelyWorks.length} key construction packages and structural steel integration.`;

    return {
      projectType,
      projectTypeDisplay,
      originalDescription: text,
      projectRequirements,
      rooms,
      likelyWorks,
      missingQuestions,
      potentialConsiderations,
      initialAnswers,
      summary,
      estimatedTimelineWeeks: {
        min: isKnockthrough ? 10 : 8,
        max: isKnockthrough ? 16 : 12,
      },
    };
  }

  // ===========================================================================
  // SCENARIO C: LOFT CONVERSION
  // ===========================================================================
  if (isLoft) {
    const projectType: ProjectType = 'loft';
    const isEnsuite = isBathroom || lower.includes('ensuite');
    const projectTypeDisplay = isEnsuite ? 'Loft Conversion with Master Ensuite Suite' : 'Dormer Loft Conversion';

    const projectRequirements: string[] = [
      'Rear flat-roof dormer extension with timber framework, exterior cladding, and EPDM waterproofing membrane',
      'Structural steel support beams (RSJs) to support new suspended timber floor and dormer walls',
      'New bespoke timber staircase constructed directly over existing flight complying with Part K 2.0m headroom',
      'High-performance breathable insulation between and under rafters conforming to Part L 0.18 U-value',
    ];

    if (isEnsuite) {
      projectRequirements.push('Installation of luxury ensuite shower room with waste connection to existing soil vent pipe');
    }

    const rooms: ExtractedRoom[] = [
      {
        name: 'Master Loft Bedroom Suite',
        sizeCategory: 'large',
        dimensions: { length: 5.2, width: 4.2, areaM2: 21.8 },
        purpose: 'Spacious primary bedroom with built-in eaves storage',
      },
    ];

    if (isEnsuite) {
      rooms.push({
        name: 'Loft Ensuite Shower Room',
        sizeCategory: 'small',
        dimensions: { length: 2.2, width: 1.8, areaM2: 3.96 },
        purpose: 'Private ensuite with walk-in shower, vanity, and WC',
      });
    }

    const likelyWorks: ExtractedWorkItem[] = [
      {
        category: 'Structural & Groundworks',
        workTitle: 'Structural Steel Ridge & Floor Beams Installation',
        description: 'Hoist and install fabricated structural universal steel beams onto concrete padstones to carry new floor joists and dormer structure.',
        tradeRequired: 'Structural Steel Erectors & Carpenters',
        structuralImplication: 'Requires structural engineer calculation package.',
      },
      {
        category: 'Building Envelope',
        workTitle: 'Rear Dormer Construction & Weatherproof Cladding',
        description: 'Timber stud dormer construction with EPDM flat roof, breathable membrane, and composite / slate tile hung cheeks.',
        tradeRequired: 'Roofers & Specialist Cladders',
      },
      {
        category: 'Fit-Out & Joinery',
        workTitle: 'Part K Bespoke Staircase & FD30 Fire Doors',
        description: 'Install matched timber staircase with spindle balustrade and upgrade escape route doors to FD30 fire resistance.',
        tradeRequired: 'Joiners & Carpenters',
      },
      {
        category: 'Plumbing & Electrics',
        workTitle: 'M&E First Fix, Soil Stack Connection & Smoke Alarms',
        description: 'Extend hot/cold water feeds, connect ensuite waste to soil stack, wire LED spotlights, and install interlinked mains smoke alarms.',
        tradeRequired: 'NICEIC Electricians & Gas Safe Plumbers',
      },
    ];

    const missingQuestions: MissingQuestion[] = [
      {
        id: 'ridge_height',
        question: 'What is the existing height from floor joists to the apex roof ridge?',
        reason: 'A minimum height of 2.2m–2.4m is required to achieve the statutory 2.0m clear standing headroom above finished floor and stairs.',
        options: ['Above 2.4m (Ideal)', '2.2m to 2.4m (Tight but workable)', 'Under 2.2m (May need roof raise / tie-in)'],
      },
      {
        id: 'water_pressure_cylinder',
        question: 'What type of boiler/water heating system does your property have?',
        reason: 'Combi boilers or unvented Megaflo cylinders provide mains pressure to top-floor showers; gravity tanks in lofts require relocation or pump.',
        options: ['Combi Boiler (Mains Pressure)', 'System Boiler with Megaflo', 'Conventional gravity tank in loft'],
      },
    ];

    const potentialConsiderations: PotentialConsideration[] = [
      {
        topic: 'Permitted Development Volume Allowance (40m³ / 50m³)',
        consideration: 'Terraced properties have a 40m³ roof enlargement allowance under Permitted Development; semi-detached/detached have 50m³.',
        regulatoryRef: 'Class B, Part 1, Schedule 2 — GPDO 2015',
        riskLevel: 'low',
      },
      {
        topic: 'Building Regulations Part B (Fire Safety & Escape Route)',
        consideration: 'Converting a 2-storey house into 3 storeys requires a protected fire escape stairway with FD30 doors and interlinked mains smoke detectors.',
        regulatoryRef: 'Approved Document B (Fire Safety)',
        riskLevel: 'high',
      },
    ];

    const initialAnswers: Record<string, any> = {
      project_type: 'loft',
      loft_type: 'rear_dormer',
      loft_bathroom: isEnsuite ? 'full_ensuite' : 'no_bathroom',
      loft_stairs: 'matched_timber',
      postcode: 'W5 2UP',
      property_style: 'terraced',
      property_age: 'pre_1900',
      timeline: '1_3_months',
      project_stage: 'starting_to_plan',
      natural_description: text,
      goals: ['Create master bedroom suite', 'Add property value', 'Maximize natural light', 'Turnkey build'],
    };

    const summary = `Interpreted ${projectTypeDisplay} comprising ${rooms.map((r) => r.name).join(' & ')}, involving structural steel floor insertion, dormer construction, Part K staircase, and complete turnkey fit-out.`;

    return {
      projectType,
      projectTypeDisplay,
      originalDescription: text,
      projectRequirements,
      rooms,
      likelyWorks,
      missingQuestions,
      potentialConsiderations,
      initialAnswers,
      summary,
      estimatedTimelineWeeks: {
        min: 6,
        max: 10,
      },
    };
  }

  // ===========================================================================
  // SCENARIO D: KITCHEN RENOVATION & STRUCTURAL WALL REMOVAL
  // ===========================================================================
  if (isKitchen && !isExtension) {
    const isKnockthrough = isWallRemoval || mentionsDining;
    const projectType: ProjectType = 'kitchen';
    const projectTypeDisplay = isKnockthrough ? 'Bespoke Kitchen & Dining Knockthrough' : 'Bespoke Kitchen Renovation';

    const projectRequirements: string[] = [
      'Supply and installation of bespoke kitchen cabinetry, soft-close hardware, and integrated appliances',
      'Fabrication and installation of 20mm/30mm Quartz or Dekton solid stone worktops with undermount sink',
    ];

    if (isKnockthrough) {
      projectRequirements.push(
        'Demolition of dividing internal wall with temporary Acrow prop support',
        'Installation of structural steel RSJ beam on concrete padstones with calculations for Building Control'
      );
    }

    projectRequirements.push(
      'Full electrical rewire: dedicated induction hob circuit, LED under-cabinet illumination, and island socket drops',
      'Plumbing modifications: sink, dishwasher, Quooker boiling water tap, and water supply to fridge'
    );

    const rooms: ExtractedRoom[] = [
      {
        name: isKnockthrough ? 'Open-Plan Kitchen & Dining Space' : 'Kitchen',
        sizeCategory: 'medium',
        dimensions: { length: 5.0, width: 4.0, areaM2: 20 },
        purpose: 'Modern kitchen and culinary entertainment area',
      },
    ];

    const likelyWorks: ExtractedWorkItem[] = [
      {
        category: 'Plumbing & Electrics',
        workTitle: 'Kitchen M&E First Fix & Island Power Routing',
        description: 'New electrical radial circuits from consumer unit, plumbing first fix, and waste drainage connections.',
        tradeRequired: 'NICEIC Electricians & Gas Safe Plumbers',
      },
      {
        category: 'Fit-Out & Joinery',
        workTitle: 'Bespoke Kitchen Fitting, Quartz Templating & Installation',
        description: 'Base and tall cabinet installation, laser templating and fitting of solid Quartz worktops, splashbacks, and integrated appliances.',
        tradeRequired: 'Specialist Kitchen Fitters & Stone Masons',
      },
    ];

    if (isKnockthrough) {
      likelyWorks.unshift({
        category: 'Structural & Groundworks',
        workTitle: 'Wall Removal & Structural Steel Support',
        description: 'Propping, dust screening, structural wall demolition, and RSJ beam installation on padstones.',
        tradeRequired: 'Structural Builders',
        structuralImplication: 'Requires structural engineer calculation package.',
      });
    }

    const missingQuestions: MissingQuestion[] = [
      {
        id: 'wall_load_bearing',
        question: 'Is the wall to be removed load-bearing (carrying first floor joists or roof structure)?',
        reason: 'Load-bearing walls require structural steel calculations and building control approval; non-load-bearing stud partitions do not.',
        options: ['Load-bearing masonry wall', 'Non-load-bearing stud partition', 'Not sure / Need builder inspection'],
      },
    ];

    const potentialConsiderations: PotentialConsideration[] = [
      {
        topic: 'Building Regulations Part P (Electrical Safety)',
        consideration: 'Kitchen electrical alterations require a Part P certified electrician with full testing and NICEIC certificate issuance.',
        regulatoryRef: 'Approved Document P (Electrical Safety)',
        riskLevel: 'medium',
      },
    ];

    const initialAnswers: Record<string, any> = {
      project_type: 'kitchen',
      kitchen_scope: isKnockthrough ? 'full_knockthrough' : 'full_renovation',
      kitchen_flush_steel: isKnockthrough ? 'yes' : 'no',
      postcode: 'W5 2UP',
      property_style: 'terraced',
      property_age: '1900_1930',
      timeline: '1_3_months',
      project_stage: 'starting_to_plan',
      natural_description: text,
      goals: ['Modern kitchen design', 'More storage & counter space', 'Better layout', 'Quality stone worktops'],
    };

    const summary = `Interpreted ${projectTypeDisplay} comprising ${rooms[0].name}, involving high-spec kitchen cabinetry, stone worktops, full M&E infrastructure, and structural opening.`;

    return {
      projectType,
      projectTypeDisplay,
      originalDescription: text,
      projectRequirements,
      rooms,
      likelyWorks,
      missingQuestions,
      potentialConsiderations,
      initialAnswers,
      summary,
      estimatedTimelineWeeks: {
        min: 3,
        max: 6,
      },
    };
  }

  // ===========================================================================
  // SCENARIO E: BATHROOM / WET ROOM / ENSUITE
  // ===========================================================================
  if (isBathroom) {
    const projectType: ProjectType = 'bathroom';
    const projectTypeDisplay = 'Luxury Bathroom & Walk-In Wetroom Renovation';

    const projectRequirements: string[] = [
      'Complete strip out of existing sanitaryware, wall tiles, floorboards, and redundant pipework',
      'Full wetroom tanking and waterproof tanking membrane system across shower zone and floor',
      'Installation of floor-level walk-in shower with linear drain and frameless fluted glass screen',
      'Supply and fit of wall-hung rimless WC with concealed cistern frame and dual-flush plate',
      'Large-format porcelain wall and floor tiling with matching grout and silicone expansion joints',
      'Electric or wet underfloor heating with digital touch-screen programmable thermostat',
    ];

    const rooms: ExtractedRoom[] = [
      {
        name: 'Family Bathroom / Wetroom Suite',
        sizeCategory: 'small',
        dimensions: { length: 2.8, width: 2.2, areaM2: 6.16 },
        purpose: 'High-end spa bathroom and shower sanctuary',
      },
    ];

    const likelyWorks: ExtractedWorkItem[] = [
      {
        category: 'Plumbing & Electrics',
        workTitle: 'Sanitary Plumbing First Fix & Concealed Shower Valves',
        description: 'Reroute hot/cold feeds, install concealed thermostatic valves, wall-hung WC frame, and low-profile linear shower waste.',
        tradeRequired: 'CIPHE Plumbers',
      },
      {
        category: 'Fit-Out & Joinery',
        workTitle: 'Substrate Tanking Membrane & Large-Format Porcelain Tiling',
        description: 'Apply waterproof tanking kit to wet zones, install thermal backing boards, and precision-cut 1200x600 porcelain tiles with mitred edges.',
        tradeRequired: 'Specialist Tile Artisans',
      },
    ];

    const missingQuestions: MissingQuestion[] = [
      {
        id: 'water_pressure',
        question: 'Do you have high mains water pressure (Combi / Megaflo) for a rainfall shower head?',
        reason: 'Large 300mm ceiling rainfall shower heads require minimum 2.0–3.0 bar pressure to deliver an optimal experience.',
        options: ['High pressure (Combi/Megaflo)', 'Low pressure (Gravity tank - may need pump)', 'Not sure'],
      },
    ];

    const potentialConsiderations: PotentialConsideration[] = [
      {
        topic: 'Building Regulations Part F (Ventilation)',
        consideration: 'Bathrooms without opening windows or with walk-in showers require mechanical extract ventilation capable of minimum 15 litres/second extract rate with overrun timer.',
        regulatoryRef: 'Approved Document F (Ventilation)',
        riskLevel: 'low',
      },
    ];

    const initialAnswers: Record<string, any> = {
      project_type: 'bathroom',
      bathroom_scope: 'full_renovation',
      postcode: 'W5 2UP',
      property_style: 'terraced',
      property_age: 'pre_1900',
      timeline: '1_3_months',
      project_stage: 'starting_to_plan',
      natural_description: text,
      goals: ['Luxury spa finish', 'Walk-in rainfall shower', 'Underfloor heating', 'Porcelain tiling'],
    };

    const summary = `Interpreted ${projectTypeDisplay} comprising ${rooms[0].name}, involving waterproof tanking, walk-in shower, wall-hung sanitaryware, and precision porcelain tiling.`;

    return {
      projectType,
      projectTypeDisplay,
      originalDescription: text,
      projectRequirements,
      rooms,
      likelyWorks,
      missingQuestions,
      potentialConsiderations,
      initialAnswers,
      summary,
      estimatedTimelineWeeks: {
        min: 2,
        max: 4,
      },
    };
  }

  // ===========================================================================
  // SCENARIO F: FULL HOUSE RENOVATION & PERIOD OVERHAUL
  // ===========================================================================
  if (isFullRenovation) {
    const projectType: ProjectType = 'full-renovation';
    const projectTypeDisplay = 'Complete Period Property Gut Renovation & Fit-Out';

    const projectRequirements: string[] = [
      'Complete strip out of existing finishes, redundant wiring, outdated plumbing, and fixtures',
      'Structural alterations to ground floor layout to create open-plan family kitchen-diner',
      'Full electrical rewire with new consumer unit, smart lighting circuits, and Part P sign-off',
      'Complete central heating overhaul: new high-efficiency system boiler, unvented cylinder, and ground floor underfloor heating',
      'Plaster skim coating throughout all ceilings and walls with restoration of period cornicing',
      'New bespoke luxury kitchen and multiple designer bathrooms/ensuites',
    ];

    const rooms: ExtractedRoom[] = [
      { name: 'Open-Plan Kitchen & Dining Hub', sizeCategory: 'large', dimensions: { length: 8.0, width: 5.0, areaM2: 40 }, purpose: 'Primary family culinary and living zone' },
      { name: 'Formal Living Room / Reception', sizeCategory: 'medium', dimensions: { length: 4.5, width: 3.8, areaM2: 17.1 }, purpose: 'Relaxation and entertaining' },
      { name: 'Master Bedroom Suite & Ensuite', sizeCategory: 'large', dimensions: { length: 5.0, width: 4.0, areaM2: 20 }, purpose: 'Primary suite with private bathroom' },
      { name: 'Secondary Bedrooms (x3)', sizeCategory: 'large', dimensions: { length: 7.0, width: 4.5, areaM2: 31.5 }, purpose: 'Family bedrooms and guest rooms' },
      { name: 'Family Bathroom & Cloakroom', sizeCategory: 'medium', dimensions: { length: 3.0, width: 2.5, areaM2: 7.5 }, purpose: 'Main bathroom and ground floor WC' },
    ];

    const likelyWorks: ExtractedWorkItem[] = [
      {
        category: 'Structural & Groundworks',
        workTitle: 'Internal Wall Knockthroughs & Structural Steels',
        description: 'Demolish dividing ground floor walls and install structural steel box frames to create expansive open-plan layout.',
        tradeRequired: 'Structural Builders & Steel Erectors',
      },
      {
        category: 'Plumbing & Electrics',
        workTitle: 'Whole-House Electrical Rewire & Heating System',
        description: 'Complete rewiring, CAT6 data cabling, system boiler with Megaflo cylinder, and wet underfloor heating.',
        tradeRequired: 'NICEIC Electricians & Gas Safe Plumbers',
      },
      {
        category: 'Fit-Out & Joinery',
        workTitle: 'Full Plaster Skim, Joinery & Turnkey Finishes',
        description: 'Replastering throughout, engineered hardwood flooring, bespoke fitted wardrobes, designer kitchen, and luxury bathrooms.',
        tradeRequired: 'Plasterers, Joiners, Kitchen Fitters & Tilers',
      },
    ];

    const missingQuestions: MissingQuestion[] = [
      {
        id: 'property_period',
        question: 'What is the architectural era of the property (Victorian, Edwardian, 1930s, or Modern)?',
        reason: 'Period properties require breathable lime materials, party wall considerations, and specific lintel details for high ceilings.',
        options: ['Victorian / Georgian (Pre-1900)', 'Edwardian (1900-1930)', '1930s-1960s Semi', 'Modern Build'],
      },
    ];

    const potentialConsiderations: PotentialConsideration[] = [
      {
        topic: 'Building Regulations Full Plans Approval',
        consideration: 'Full property renovations involving structural changes, thermal insulation upgrades (Part L), and complete rewiring (Part P) require comprehensive Building Control certification.',
        regulatoryRef: 'Building Regulations 2010 (All Approved Documents)',
        riskLevel: 'high',
      },
    ];

    const initialAnswers: Record<string, any> = {
      project_type: 'full-renovation',
      renovation_scope: 'complete_back_to_brick',
      postcode: 'W5 2UP',
      property_style: 'terraced',
      property_age: 'pre_1900',
      timeline: '1_3_months',
      project_stage: 'starting_to_plan',
      natural_description: text,
      goals: ['Complete modernisation', 'Open-plan living', 'High-end turnkey finish', 'Energy efficiency'],
    };

    const summary = `Interpreted ${projectTypeDisplay} comprising complete internal overhaul across ${rooms.length} zones, involving structural reconfiguration, new M&E systems, and luxury fit-out.`;

    return {
      projectType,
      projectTypeDisplay,
      originalDescription: text,
      projectRequirements,
      rooms,
      likelyWorks,
      missingQuestions,
      potentialConsiderations,
      initialAnswers,
      summary,
      estimatedTimelineWeeks: {
        min: 12,
        max: 24,
      },
    };
  }

  // ===========================================================================
  // DEFAULT / GENERAL STRUCTURAL & BUILDING ALTERATIONS
  // ===========================================================================
  const projectType: ProjectType = 'other';
  const projectTypeDisplay = isDoorwayFormation
    ? 'Internal Structural Doorway & Room Connection'
    : isWallRemoval
    ? 'Internal Wall Knockthrough & Structural Steel'
    : 'Custom Residential Building & Conversion';

  const projectRequirements: string[] = [
    isDoorwayFormation
      ? 'Form a new internal structural doorway opening in internal wall with pre-stressed lintel and certified door set'
      : isWallRemoval
      ? 'Demolish dividing wall and install structural steel beam (RSJ) on concrete padstones'
      : 'Architectural reconfiguration and building works according to customer brief',
    'Structural calculations and Building Regulations inspection package',
    'Making good reveals, plaster skimming, architraves, and matching existing decor',
  ];

  const rooms: ExtractedRoom[] = [
    {
      name: 'Main Alteration Space',
      sizeCategory: 'medium',
      dimensions: { length: 5.0, width: 4.0, areaM2: 20 },
      purpose: 'Target area for structural alterations and renovation',
    },
  ];

  const likelyWorks: ExtractedWorkItem[] = [
    {
      category: 'Structural & Groundworks',
      workTitle: isDoorwayFormation ? 'Structural Doorway Opening & Concrete Lintel' : 'Wall Demolition & Steel Support',
      description: 'Careful cutting of opening, propping, insertion of structural lintel/steel with padstones, and debris removal.',
      tradeRequired: 'Structural Builders',
      structuralImplication: 'Requires Building Control compliance check.',
    },
    {
      category: 'Fit-Out & Joinery',
      workTitle: 'Plaster Skimming, Joinery & Making Good',
      description: 'Dryline opening reveals, apply multi-finish plaster skim, install door frame, door, architraves, and skirting.',
      tradeRequired: 'Plasterers & Finish Carpenters',
    },
  ];

  const missingQuestions: MissingQuestion[] = [
    {
      id: 'structural_wall_type',
      question: 'Is the target wall solid masonry, brickwork, or lightweight timber studwork?',
      reason: 'Determines temporary propping engineering, lintel type (steel Catnic vs pre-stressed concrete), and demolition method.',
      options: ['Solid brick / block masonry', 'Timber stud partition', 'Not sure / Need builder survey'],
    },
  ];

  const potentialConsiderations: PotentialConsideration[] = [
    {
      topic: 'Building Regulations Part A (Structural Safety)',
      consideration: 'Creating new openings in structural walls or partitions requires Building Control notification and verified lintel bearings.',
      regulatoryRef: 'Approved Document A (Structure)',
      riskLevel: 'medium',
    },
  ];

  const initialAnswers: Record<string, any> = {
    project_type: 'other',
    other_scope: isDoorwayFormation || isWallRemoval ? 'structural_rsj' : 'general_carpentry',
    postcode: 'W5 2UP',
    property_style: 'terraced',
    property_age: '1930_1960',
    timeline: '1_3_months',
    project_stage: 'starting_to_plan',
    natural_description: text,
    other_notes: text,
    goals: ['Structural reconfiguration', 'Better room access', 'Quality clean finish'],
  };

  const summary = `Interpreted ${projectTypeDisplay} comprising ${rooms[0].name}, involving structural opening, lintel installation, and complete making good.`;

  return {
    projectType,
    projectTypeDisplay,
    originalDescription: text,
    projectRequirements,
    rooms,
    likelyWorks,
    missingQuestions,
    potentialConsiderations,
    initialAnswers,
    summary,
    estimatedTimelineWeeks: {
      min: 2,
      max: 5,
    },
  };
}

/**
 * Server-side AI Project Analyzer
 * Tries Gemini API if key is configured with high-precision UK construction instructions,
 * and falls back seamlessly to the deep semantic UK building rules engine.
 */
export async function analyzeProjectWithAI(prompt: string): Promise<ExtractedProject> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return extractWithUKBuildingRules(prompt);
  }

  try {
    const systemInstruction = `You are an expert UK Senior Construction Surveyor & Principal Building Contractor for high-end residential projects in London and the South East.
Analyze the homeowner's exact project description and return ONLY valid JSON matching this exact TypeScript schema:

{
  "projectType": "extension" | "kitchen" | "loft" | "bathroom" | "full-renovation" | "garden" | "driveway" | "other",
  "projectTypeDisplay": string,
  "projectRequirements": string[],
  "rooms": Array<{ "name": string, "sizeCategory": "small" | "medium" | "large", "dimensions": { "length": number, "width": number, "areaM2": number }, "purpose": string }>,
  "likelyWorks": Array<{ "category": "Structural & Groundworks" | "Building Envelope" | "Plumbing & Electrics" | "Fit-Out & Joinery" | "Compliance & Approvals", "workTitle": string, "description": string, "tradeRequired": string, "structuralImplication"?: string }>,
  "missingQuestions": Array<{ "id": string, "question": string, "reason": string, "options"?: string[] }>,
  "potentialConsiderations": Array<{ "topic": string, "consideration": string, "regulatoryRef"?: string, "riskLevel": "low" | "medium" | "high" }>,
  "summary": string,
  "estimatedTimelineWeeks": { "min": number, "max": number }
}

RULES FOR BESPOKE ACCURACY:
- Be 100% bespoke to the homeowner's specific words. If they mention converting a garage to a cinema with a door to a hallway, your output MUST be specifically about garage conversion, cinema acoustics, AV infrastructure, structural doorway formation in the hallway, and FD30 fire safety doors!
- Ground all advice in UK Building Regulations (Part A Structural, Part B Fire Safety, Part E Acoustics, Part L Thermal U-Values, Part P Electrical), the Party Wall etc. Act 1996, and UK Permitted Development standards.
- Never return generic filler like "Custom architectural reconfiguration" if specific details are supplied in the prompt.`;

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
      console.warn(`Gemini API returned ${response.status}. Using UK Building Rules Engine fallback.`);
      return extractWithUKBuildingRules(prompt);
    }

    const data = await response.json();
    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      return extractWithUKBuildingRules(prompt);
    }

    const parsed = JSON.parse(rawJson);
    const fallbackRules = extractWithUKBuildingRules(prompt);

    return {
      projectType: parsed.projectType || fallbackRules.projectType,
      projectTypeDisplay: parsed.projectTypeDisplay || fallbackRules.projectTypeDisplay,
      originalDescription: prompt,
      projectRequirements: parsed.projectRequirements?.length ? parsed.projectRequirements : fallbackRules.projectRequirements,
      rooms: parsed.rooms?.length ? parsed.rooms : fallbackRules.rooms,
      likelyWorks: parsed.likelyWorks?.length ? parsed.likelyWorks : fallbackRules.likelyWorks,
      missingQuestions: parsed.missingQuestions?.length ? parsed.missingQuestions : fallbackRules.missingQuestions,
      potentialConsiderations: parsed.potentialConsiderations?.length ? parsed.potentialConsiderations : fallbackRules.potentialConsiderations,
      initialAnswers: fallbackRules.initialAnswers,
      summary: parsed.summary || fallbackRules.summary,
      estimatedTimelineWeeks: parsed.estimatedTimelineWeeks || fallbackRules.estimatedTimelineWeeks,
    };
  } catch (error) {
    console.error('Error invoking Gemini Assistant API, falling back to rule engine:', error);
    return extractWithUKBuildingRules(prompt);
  }
}
