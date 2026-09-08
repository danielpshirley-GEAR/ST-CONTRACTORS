/**
 * Multi-Part Project Understanding Engine
 * Conforms to Master Rebuild Specification (Parts 2, 3, 13, 14, 15, 16, 21).
 *
 * Evaluates the homeowner brief before deciding what project this is.
 * Never reduces a complex project to a single keyword.
 */

import {
  ProjectCategoryType,
  MultiPartProjectUnderstanding,
  UploadedAsset,
  AnsweredQuestion,
} from '@/types/visualiser-scope';

export interface ParseBriefInput {
  briefText: string;
  images?: { url: string; filename: string; category?: string }[];
  dimensions?: { length?: number; width?: number; height?: number; area?: number };
  propertyType?: string;
  propertyEra?: string;
  location?: string;
  budget?: number;
  desiredCompletion?: string;
  imageAnalyses?: UploadedAsset[];
  answeredQuestions?: AnsweredQuestion[];
}

/**
 * Parses natural language brief into structured multi-part project intelligence.
 */
export function analyzeProjectBrief(input: ParseBriefInput): MultiPartProjectUnderstanding {
  const text = (input.briefText || '').toLowerCase();
  const answered = input.answeredQuestions || [];

  // Combine answered questions into effective text context
  const answeredText = answered.map((a) => `${a.questionText} ${a.answerLabel} ${a.answerValue}`).join(' ').toLowerCase();
  const fullContext = `${text} ${answeredText}`;

  // 1. Check for Garage Conversion vs Garage Door
  const hasGarageWord = fullContext.includes('garage');
  const hasConversionWord =
    fullContext.includes('convert') ||
    fullContext.includes('conversion') ||
    fullContext.includes('into a room') ||
    fullContext.includes('into an office') ||
    fullContext.includes('to a room') ||
    fullContext.includes('home office') ||
    fullContext.includes('gym') ||
    fullContext.includes('playroom') ||
    fullContext.includes('habitable');

  const hasDoorWord =
    fullContext.includes('door') ||
    fullContext.includes('doorway') ||
    fullContext.includes('opening') ||
    fullContext.includes('access');

  const hasHallwayWord =
    fullContext.includes('hallway') ||
    fullContext.includes('corridor') ||
    fullContext.includes('passage') ||
    fullContext.includes('house');

  // Classification priority
  let primaryProject: ProjectCategoryType = 'unknown';
  let primaryProjectTitle = 'Home Improvement Project';
  const secondaryProjects: MultiPartProjectUnderstanding['secondaryProjects'] = [];
  const optionalRequirements: string[] = [];
  const objectives: string[] = [];
  const requestedChanges: string[] = [];
  const featuresToKeep: string[] = [];
  const featuresToRemove: string[] = [];
  const unknowns: string[] = [];
  const ambiguities: string[] = [];
  const contradictions: string[] = [];

  // Determine Primary Project
  if (hasGarageWord && hasConversionWord) {
    // Regression Test 1: Garage Conversion with Doorway
    primaryProject = 'garage-conversion';
    primaryProjectTitle = 'Garage Conversion';
    objectives.push('Convert existing garage into high-specification habitable space');

    if (hasDoorWord && (hasHallwayWord || fullContext.includes('between') || fullContext.includes('corridor'))) {
      secondaryProjects.push({
        type: 'door-replacement',
        title: 'New Internal Access Doorway',
        description: 'Create internal connecting doorway from hallway/corridor into the converted room with FD30S fire separation',
      });
      objectives.push('Form direct internal access from main hallway/corridor');
    }

    if (fullContext.includes('storage') || fullContext.includes('cupboard') || fullContext.includes('wardrobe')) {
      optionalRequirements.push('Built-in storage solutions');
    }
    if (fullContext.includes('sound') || fullContext.includes('acoustic') || fullContext.includes('office')) {
      optionalRequirements.push('Enhanced acoustic wall & ceiling insulation');
    }
  } else if (hasGarageWord && hasDoorWord && !hasConversionWord) {
    // Regression Test 2: Solely a Garage Access Door
    primaryProject = 'door-replacement';
    primaryProjectTitle = 'Garage Access Fire Door';
    objectives.push('Form direct doorway between hallway and garage compliant with Approved Document B');
  } else if (
    fullContext.includes('extension') ||
    fullContext.includes('extend') ||
    fullContext.includes('rear addition') ||
    fullContext.includes('side return') ||
    fullContext.includes('wraparound')
  ) {
    // Extension
    primaryProject = 'extension';
    primaryProjectTitle = fullContext.includes('side return')
      ? 'Side-Return Extension'
      : fullContext.includes('wraparound')
      ? 'Wraparound House Extension'
      : 'Single-Storey Rear Extension';
    objectives.push('Expand ground floor footprint with high-performance glazed extension');

    if (fullContext.includes('kitchen') || fullContext.includes('island') || fullContext.includes('diner')) {
      secondaryProjects.push({
        type: 'kitchen-renovation',
        title: 'Open-Plan Kitchen Diner',
        description: 'New bespoke kitchen layout, central island, and integrated appliances',
      });
      objectives.push('Create open-plan kitchen and dining living zone');
    }
    if (
      fullContext.includes('knock through') ||
      fullContext.includes('remove wall') ||
      fullContext.includes('steel') ||
      fullContext.includes('rsj') ||
      fullContext.includes('open plan')
    ) {
      secondaryProjects.push({
        type: 'structural-alteration',
        title: 'Structural Steel Knockthrough',
        description: 'Load-bearing masonry removal supported by flush ceiling steel beam frame',
      });
    }
    if (fullContext.includes('utility') || fullContext.includes('boot room') || fullContext.includes('wc')) {
      optionalRequirements.push('Ground floor WC or utility room');
    }
  } else if (
    fullContext.includes('bathroom') ||
    fullContext.includes('shower') ||
    fullContext.includes('wet room') ||
    fullContext.includes('ensuite')
  ) {
    // Regression Test 3: Bathroom Renovation
    primaryProject = 'bathroom-renovation';
    primaryProjectTitle = fullContext.includes('wet room') ? 'Luxury Wet Room' : 'Complete Bathroom Renovation';
    objectives.push('Full strip-out, waterproofing, and high-end sanitaryware fitting');

    if (fullContext.includes('walk-in shower') || fullContext.includes('shower')) {
      requestedChanges.push('Walk-in shower enclosure with concealed thermostatic mixer');
    }
    if (fullContext.includes('vanity') || fullContext.includes('wall-hung')) {
      requestedChanges.push('Wall-hung vanity unit with integrated basin');
    }
    if (fullContext.includes('microcement')) {
      requestedChanges.push('Seamless microcement wall and floor finish');
    }
  } else if (fullContext.includes('kitchen') || fullContext.includes('worktop') || fullContext.includes('cabinet')) {
    primaryProject = 'kitchen-renovation';
    primaryProjectTitle = 'Bespoke Kitchen Renovation';
    objectives.push('Reconfigure kitchen cabinetry, worktops, and appliance layout');
  } else if (fullContext.includes('loft') || fullContext.includes('dormer') || fullContext.includes('attic')) {
    primaryProject = 'loft-conversion';
    primaryProjectTitle = 'Rear Dormer Loft Conversion';
    objectives.push('Convert roof space into master bedroom suite with private shower room');
  } else if (fullContext.includes('driveway') || fullContext.includes('paving')) {
    primaryProject = 'driveway';
    primaryProjectTitle = 'Permeable Driveway Installation';
    objectives.push('Excavate and lay SUDS-compliant permeable block paving or resin-bound surface');
  } else if (fullContext.includes('door') || fullContext.includes('front door')) {
    primaryProject = 'door-replacement';
    primaryProjectTitle = 'Architectural Door Installation';
    objectives.push('Replace existing doorset with certified high-security unit');
  } else if (fullContext.includes('whole house') || fullContext.includes('downstairs') || fullContext.includes('full renovation')) {
    primaryProject = 'full-renovation';
    primaryProjectTitle = 'Ground Floor & Full Home Renovation';
    objectives.push('Comprehensive internal strip-out, rewiring, replastering, and modern architectural finish');
  } else {
    primaryProject = 'unknown';
    primaryProjectTitle = 'Custom Renovation Project';
    objectives.push('Home improvement and modern architectural update');
  }

  // 2. Extract Dimensions
  let knownDimensions: MultiPartProjectUnderstanding['knownDimensions'] = undefined;
  if (input.dimensions && (input.dimensions.length || input.dimensions.width || input.dimensions.area)) {
    const l = input.dimensions.length;
    const w = input.dimensions.width;
    const area = input.dimensions.area || (l && w ? Math.round(l * w * 10) / 10 : undefined);
    knownDimensions = { length: l, width: w, height: input.dimensions.height, area, note: 'Provided in input' };
  } else {
    // Regex extract from text (e.g. "2.4m x 2m" or "5m x 3.8m" or "5.2m x 2.8m" or "5 x 3")
    const dimRegex = /(\d+(?:\.\d+)?)\s*(?:m)?\s*[x×by]\s*(\d+(?:\.\d+)?)\s*(?:m)?/i;
    const match = fullContext.match(dimRegex);
    if (match) {
      const l = parseFloat(match[1]);
      const w = parseFloat(match[2]);
      if (l > 0 && w > 0) {
        knownDimensions = {
          length: l,
          width: w,
          area: Math.round(l * w * 10) / 10,
          note: `Extracted from description (${l}m × ${w}m)`,
        };
      }
    } else {
      // Check for separate depth/length and width (e.g. "4m rear extension ... 6m wide")
      const depthMatch = fullContext.match(/(\d+(?:\.\d+)?)\s*m\s*(?:rear|deep|depth|projection|extension)/i);
      const widthMatch = fullContext.match(/(\d+(?:\.\d+)?)\s*m\s*(?:wide|width|span|across)/i);
      if (depthMatch && widthMatch) {
        const l = parseFloat(depthMatch[1]);
        const w = parseFloat(widthMatch[1]);
        if (l > 0 && w > 0) {
          knownDimensions = {
            length: l,
            width: w,
            area: Math.round(l * w * 10) / 10,
            note: `Extracted from description (${l}m depth × ${w}m width)`,
          };
        }
      }
    }
  }

  // 3. Extract Budget
  let budgetInfo: MultiPartProjectUnderstanding['budgetInfo'] = undefined;
  if (input.budget && input.budget > 0) {
    budgetInfo = { amount: input.budget, range: `£${input.budget.toLocaleString()}`, notes: 'Specified by user' };
  } else {
    const budgetRegex = /(?:£|budget\s*of\s*|budget\s*is\s*|have\s*)(\d{1,3}(?:,\d{3})*|\d+)\s*(?:k|thousand)?/i;
    const bMatch = fullContext.match(budgetRegex);
    if (bMatch) {
      let num = parseFloat(bMatch[1].replace(/,/g, ''));
      if (fullContext.includes(`${bMatch[1]}k`) || (num < 500 && num > 5)) {
        num = num * 1000;
      }
      if (num >= 1000) {
        budgetInfo = { amount: num, range: `£${num.toLocaleString()}`, notes: 'Mentioned in brief' };
      }
    }
  }

  // 4. Extract Timeline
  let timelineInfo: MultiPartProjectUnderstanding['timelineInfo'] = undefined;
  if (fullContext.includes('christmas')) {
    timelineInfo = { targetDate: 'Before Christmas', notes: 'Completed before Christmas' };
  } else if (fullContext.includes('asap') || fullContext.includes('immediately')) {
    timelineInfo = { targetDate: 'As soon as possible', notes: 'Ready to start immediately' };
  } else if (fullContext.includes('spring') || fullContext.includes('summer')) {
    timelineInfo = { targetDate: fullContext.includes('spring') ? 'Spring' : 'Summer', notes: 'Targeting next season' };
  }

  // 5. Detect Features to Keep & Remove
  if (fullContext.includes('keep garage door') || fullContext.includes('retain existing door')) {
    featuresToKeep.push('Existing garage door appearance');
  }
  if (
    fullContext.includes('replace garage door') ||
    fullContext.includes('replace frontage') ||
    fullContext.includes('brick up garage') ||
    fullContext.includes('window in place of garage door')
  ) {
    featuresToRemove.push('Existing up-and-over garage door');
    requestedChanges.push('Replace garage frontage with insulated cavity wall & double-glazed window');
  }

  // 6. Detect Contradictions (Part 16)
  if (
    (fullContext.includes('keep garage door') || fullContext.includes('retain door')) &&
    (fullContext.includes('replace garage door') || fullContext.includes('window in place'))
  ) {
    contradictions.push('Conflicting instructions on whether to keep or replace the garage frontage door.');
  }

  // 7. Detect Ambiguities (Part 15)
  if (hasGarageWord && hasDoorWord && !hasConversionWord && text.length < 30) {
    ambiguities.push('Brief could mean adding an internal doorway or a full garage conversion.');
  }

  // 8. Identify Unknowns based on project type and existing data
  if (primaryProject === 'garage-conversion') {
    // Check what is already answered
    const roomUseAnswer = answered.find((a) => a.questionId === 'garage_room_use');
    if (!roomUseAnswer && !fullContext.includes('office') && !fullContext.includes('gym') && !fullContext.includes('bedroom') && !fullContext.includes('playroom')) {
      unknowns.push('Intended room use (office, gym, bedroom, playroom, living space)');
    }
    const frontageAnswer = answered.find((a) => a.questionId === 'garage_frontage');
    if (!frontageAnswer && featuresToRemove.length === 0 && featuresToKeep.length === 0) {
      unknowns.push('Treatment for existing garage door frontage (wall & window, French doors, retain)');
    }
    const structureAnswer = answered.find((a) => a.questionId === 'garage_structure');
    if (!structureAnswer && !fullContext.includes('integral') && !fullContext.includes('attached') && !fullContext.includes('detached')) {
      unknowns.push('Garage structure type (integral within house, attached to side, or detached)');
    }
    if (!knownDimensions) {
      unknowns.push('Approximate garage dimensions (length & width)');
    }
    const heatingAnswer = answered.find((a) => a.questionId === 'garage_heating');
    if (!heatingAnswer && !fullContext.includes('radiator') && !fullContext.includes('underfloor') && !fullContext.includes('heating')) {
      unknowns.push('Heating and insulation requirements for all-year comfort');
    }
  } else if (primaryProject === 'door-replacement') {
    const wallTypeAnswer = answered.find((a) => a.questionId === 'door_wall_type');
    if (!wallTypeAnswer && !fullContext.includes('brick') && !fullContext.includes('block') && !fullContext.includes('stud')) {
      unknowns.push('Dividing wall construction (solid brick, blockwork, or timber stud)');
    }
    const fireRatingAnswer = answered.find((a) => a.questionId === 'door_fire_rating');
    if (!fireRatingAnswer && !fullContext.includes('fd30') && !fullContext.includes('fire door')) {
      unknowns.push('Door finish and Approved Document B FD30S fire doorset specification');
    }
  } else if (primaryProject === 'bathroom-renovation') {
    if (!knownDimensions) {
      unknowns.push('Bathroom room dimensions');
    }
    const showerTypeAnswer = answered.find((a) => a.questionId === 'bath_shower_type');
    if (!showerTypeAnswer && requestedChanges.length === 0) {
      unknowns.push('Preferred shower configuration (walk-in wet room tray, enclosed cubicle, bath combination)');
    }
    const subfloorAnswer = answered.find((a) => a.questionId === 'bath_subfloor');
    if (!subfloorAnswer && !fullContext.includes('timber') && !fullContext.includes('concrete')) {
      unknowns.push('Subfloor type (suspended timber joists vs solid concrete screed)');
    }
  } else if (primaryProject === 'extension') {
    if (!knownDimensions) {
      unknowns.push('Proposed extension footprint dimensions (length & depth)');
    }
    const roofTypeAnswer = answered.find((a) => a.questionId === 'ext_roof_glazing');
    if (!roofTypeAnswer && !fullContext.includes('flat') && !fullContext.includes('pitched') && !fullContext.includes('skylight') && !fullContext.includes('lantern')) {
      unknowns.push('Roof design and architectural glazing (flat roof with frameless rooflight vs pitched)');
    }
    const drainageAnswer = answered.find((a) => a.questionId === 'ext_drainage');
    if (!drainageAnswer && !fullContext.includes('manhole') && !fullContext.includes('thames water')) {
      unknowns.push('Drainage and inspection chamber positions in the garden');
    }
  }

  // Determine if scope is sufficiently understood to generate the confirmation summary
  const isScopeUnderstood = unknowns.length <= 1 || answered.length >= (primaryProject === 'door-replacement' ? 2 : primaryProject === 'bathroom-renovation' ? 3 : 4);
  const isReadyForConfirmation = unknowns.length === 0 || answered.length >= (primaryProject === 'door-replacement' ? 2 : 4);

  // Build Confirmation Summary (Part 21)
  let headline = primaryProjectTitle.toUpperCase();
  let primaryDescription = 'Complete residential renovation executed to UK Building Regulations standards.';
  let secondaryDescription: string | undefined = undefined;
  let frontageOrKeyElement: string | undefined = undefined;
  let dimensionsSummary = knownDimensions
    ? `Approx. ${knownDimensions.length}m × ${knownDimensions.width}m (${knownDimensions.area}m²)`
    : 'Standard dimensions (to be confirmed on site)';
  let mainRequirements: string[] = [];

  if (primaryProject === 'garage-conversion') {
    const roomUse =
      answered.find((a) => a.questionId === 'garage_room_use')?.answerLabel ||
      (fullContext.includes('office') ? 'Home Office' : fullContext.includes('gym') ? 'Home Gym' : fullContext.includes('bedroom') ? 'Bedroom' : 'Multipurpose Living Room');

    primaryDescription = `Convert garage into a year-round ${roomUse.toLowerCase()} with fully insulated floor, walls, and ceiling.`;
    
    if (secondaryProjects.length > 0) {
      secondaryDescription = 'Create internal connecting doorway from hallway/corridor into the converted room with FD30S fire separation.';
    }

    const frontage =
      answered.find((a) => a.questionId === 'garage_frontage')?.answerLabel ||
      (featuresToRemove.length > 0 ? 'Replace garage door with insulated cavity wall & double-glazed window' : 'Replace frontage with insulated wall and double-glazed window');
    frontageOrKeyElement = frontage;

    mainRequirements = [
      'High-performance Kingspan/Celotex thermal insulation to floor, walls & ceiling',
      'Direct internal fire-rated access doorway from hallway',
      'Garage frontage masonry fill with matching brickwork and double-glazed window',
      'Full electrical ring main, LED lighting, and radiator heating circuit',
      'Structural subfloor damp proof membrane & acoustic screed',
      'Building Control statutory inspection and completion certification',
    ];
  } else if (primaryProject === 'door-replacement') {
    primaryDescription = 'Form new internal doorway between hallway and garage compliant with Approved Document B.';
    frontageOrKeyElement = 'Certified FD30S 30-minute fire-and-smoke rated doorset with automatic self-closing mechanism.';
    mainRequirements = [
      'Pre-stressed reinforced concrete or steel box lintel with 150mm padstone bearings',
      'FD30S fire doorset with cold smoke intumescent brush seals',
      '100mm threshold step or floor fall vapour barrier to contain vehicle emissions',
      'Overhead hydraulic self-closing mechanism',
      'Plaster reveal make-good and architrave joinery',
      'Local Authority Building Control Building Notice sign-off',
    ];
  } else if (primaryProject === 'bathroom-renovation') {
    primaryDescription = `Complete renovation of ${dimensionsSummary} bathroom into a modern luxury bathroom.`;
    frontageOrKeyElement = requestedChanges.join(', ') || 'Walk-in shower enclosure, wall-hung vanity, and premium finishes';
    mainRequirements = [
      'Complete strip-out of existing sanitaryware, wall tiles, and flooring',
      'Schlüter-KERDI tanking membrane waterproofing system across all wet zones',
      'Subfloor deflection stiffening (18mm marine plywood / cement backer board)',
      'Concealed thermostatic brassware and waste falls to drainage',
      'Approved Document F compliant high-extract mechanical ventilation',
      'Part P certified electrical lighting and mirror demister circuits',
    ];
  } else if (primaryProject === 'extension') {
    primaryDescription = `Construct a ${dimensionsSummary} extension to expand ground floor living space.`;
    if (secondaryProjects.length > 0) {
      secondaryDescription = secondaryProjects.map((s) => s.title).join(' & ');
    }
    frontageOrKeyElement = 'Architectural rooflights and multi-panel aluminium bifold/sliding patio doors';
    mainRequirements = [
      'Engineered mass concrete strip foundations designed for London shrinkable clay',
      'Structural steel frame (RSJ) for column-free open-plan internal flow',
      'Approved Document L compliant insulated external cavity masonry walls',
      'Thermally-broken aluminium glazing and structural rooflights',
      'Plumbing, underfloor heating, and certified Part P electrical installation',
      'Building Regulations inspections and Final Completion Certificate',
    ];
  } else {
    primaryDescription = `Transform and renovate space according to homeowner brief.`;
    mainRequirements = [
      'Site survey and structural assessment',
      'Preparation, strip-out, and substrate leveling',
      'Trade installations by certified specialists',
      'Premium architectural finishing and decoration',
    ];
  }

  const confirmationSummary: MultiPartProjectUnderstanding['confirmationSummary'] = {
    headline,
    primaryDescription,
    secondaryDescription,
    frontageOrKeyElement,
    dimensionsSummary,
    mainRequirements,
  };

  return {
    primaryProject,
    primaryProjectTitle,
    secondaryProjects,
    optionalRequirements,
    spaces: [primaryProjectTitle],
    objectives,
    requestedChanges,
    featuresToKeep,
    featuresToRemove,
    knownDimensions,
    uploadedAssetsCount: (input.images || []).length + (input.imageAnalyses || []).length,
    budgetInfo,
    timelineInfo,
    unknowns,
    ambiguities,
    contradictions,
    isScopeUnderstood,
    isReadyForConfirmation,
    confirmationSummary,
  };
}
