/**
 * Next Best Question Engine
 * Conforms to Master Rebuild Specification (Parts 4–20).
 *
 * Continuously evaluates: "WHAT SINGLE QUESTION WOULD MOST IMPROVE MY UNDERSTANDING OF THIS PROJECT?"
 * Returns ONE question at a time with 3-6 suggested answers, or null when ready to confirm.
 */

import {
  MultiPartProjectUnderstanding,
  ConsultationQuestion,
  AnsweredQuestion,
} from '@/types/visualiser-scope';

/**
 * Returns dynamic stage label based on question progression.
 */
function getStageLabel(questionIndex: number, totalExpected: number): string {
  if (questionIndex === 0) return 'UNDERSTANDING YOUR PROJECT';
  if (questionIndex === 1) return 'A FEW QUICK DETAILS';
  if (questionIndex >= totalExpected - 1) return 'ONE MORE USEFUL DETAIL';
  return 'A FEW QUICK DETAILS';
}

/**
 * Evaluates project understanding and answered questions to determine the next best single question.
 */
export function getNextBestQuestion(
  understanding: MultiPartProjectUnderstanding,
  answered: AnsweredQuestion[]
): ConsultationQuestion | null {
  const answeredIds = new Set(answered.map((a) => a.questionId));
  const numAnswered = answered.length;
  const project = understanding.primaryProject;

  // Question budget by project complexity (Part 12)
  const maxQuestions =
    project === 'door-replacement' ? 2 : project === 'bathroom-renovation' ? 4 : project === 'extension' ? 5 : 4;

  // 1. Check Contradictions First (Part 16)
  if (understanding.contradictions.length > 0 && !answeredIds.has('resolve_contradiction')) {
    return {
      id: 'resolve_contradiction',
      category: 'contradiction',
      stageLabel: 'CLARIFYING YOUR INTENT',
      question: 'Just to clarify — would you like to keep the existing garage door or replace it?',
      subtitle: 'Your brief mentioned both keeping the door and replacing it with a window.',
      options: [
        { label: 'Replace frontage with an insulated wall & window', value: 'replace_with_window', autoAdvance: true },
        { label: 'Keep the existing garage door appearance externally', value: 'keep_external_door', autoAdvance: true },
        { label: 'Replace with modern French or bifold doors', value: 'replace_with_glazed_doors', autoAdvance: true },
      ],
      allowCustomInput: true,
      customInputPlaceholder: 'Tell us in your own words...',
      inputType: 'single_choice',
    };
  }

  // 2. Check Ambiguities (Part 15)
  if (understanding.ambiguities.length > 0 && !answeredIds.has('resolve_ambiguity')) {
    return {
      id: 'resolve_ambiguity',
      category: 'ambiguity',
      stageLabel: 'UNDERSTANDING YOUR PROJECT',
      question: 'Just to make sure we understand — what are you planning?',
      subtitle: 'Tell us whether you want to convert the garage or simply add an access door.',
      options: [
        { label: 'Convert the entire garage into a habitable room', value: 'full_conversion', autoAdvance: true },
        { label: 'Only add an access doorway between hallway and garage', value: 'door_only', autoAdvance: true },
        { label: 'Convert the garage AND add the connecting doorway', value: 'conversion_and_door', autoAdvance: true },
      ],
      allowCustomInput: true,
      customInputPlaceholder: 'Something else? Tell us...',
      inputType: 'single_choice',
    };
  }

  // Stop asking if maximum useful questions reached (Part 12)
  if (numAnswered >= maxQuestions) {
    return null;
  }

  // -------------------------------------------------------------
  // GARAGE CONVERSION FLOW (Regression Test 1)
  // -------------------------------------------------------------
  if (project === 'garage-conversion') {
    // Q1: Room Use (High Value, Scope Impact)
    if (!answeredIds.has('garage_room_use') && !understanding.objectives.some((o) => o.includes('office') || o.includes('gym') || o.includes('bedroom'))) {
      return {
        id: 'garage_room_use',
        category: 'scope',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'What would you mainly like to use the converted garage for?',
        subtitle: 'This helps us specify the right acoustic insulation, heating, and natural light.',
        impactReason: 'Directly influences electrical layout, heating load, and insulation thickness.',
        options: [
          { label: 'Home Office / Studio', value: 'office', description: 'Quiet working space with ample power & data', autoAdvance: true },
          { label: 'Living Room / Snug', value: 'living_room', description: 'Cosy family space or TV room', autoAdvance: true },
          { label: 'Home Gym', value: 'gym', description: 'Durable reinforced subfloor & high ventilation', autoAdvance: true },
          { label: 'Guest Bedroom', value: 'bedroom', description: 'Complies with Approved Document B escape regulations', autoAdvance: true },
          { label: 'Children’s Playroom', value: 'playroom', description: 'Hardwearing, warm flooring and low-level storage', autoAdvance: true },
        ],
        allowCustomInput: true,
        customInputPlaceholder: 'Something else? Tell us in your own words...',
        allowSkip: true,
        skipLabel: 'Decide later',
        inputType: 'single_choice',
      };
    }

    // Q2: Garage Frontage Treatment
    if (!answeredIds.has('garage_frontage') && understanding.featuresToRemove.length === 0 && understanding.featuresToKeep.length === 0) {
      return {
        id: 'garage_frontage',
        category: 'layout',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'What would you like to do with the existing garage door frontage?',
        subtitle: 'The front opening can be filled with matching masonry or architectural glazing.',
        impactReason: 'Affects external brickwork matching, lintel requirements, and planning rules.',
        options: [
          { label: 'Replace with matching brick wall & window', value: 'wall_and_window', description: 'Most common choice for thermal efficiency', autoAdvance: true },
          { label: 'Replace with floor-to-ceiling glass / French doors', value: 'glazed_doors', description: 'Maximum natural daylight', autoAdvance: true },
          { label: 'Keep existing garage door appearance externally', value: 'keep_front_appearance', description: 'Internal stud wall erected behind closed door', autoAdvance: true },
          { label: 'I’m not sure — show me recommendations', value: 'builder_recommendation', autoAdvance: true },
        ],
        allowCustomInput: true,
        customInputPlaceholder: 'Other frontage preference...',
        allowSkip: true,
        skipLabel: 'Skip for now',
        inputType: 'single_choice',
      };
    }

    // Q3: Garage Structure (Integral vs Attached vs Detached)
    if (!answeredIds.has('garage_structure') && !understanding.objectives.some((o) => o.includes('integral') || o.includes('attached'))) {
      return {
        id: 'garage_structure',
        category: 'feasibility',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'Is your garage built into the house or attached to the side?',
        subtitle: 'Integral garages usually require fire-rated ceilings beneath first-floor bedrooms.',
        impactReason: 'Determines ceiling fire resistance (Approved Document B) and wall cavity insulation.',
        options: [
          { label: 'Built into the main house (Integral)', value: 'integral', description: 'Rooms exist above or directly beside the garage', autoAdvance: true },
          { label: 'Attached to the side of the house', value: 'attached', description: 'Shares one side wall with the main dwelling', autoAdvance: true },
          { label: 'Standalone / Detached garage', value: 'detached', description: 'Separate building in garden or driveway', autoAdvance: true },
          { label: 'Not sure', value: 'not_sure', autoAdvance: true },
        ],
        allowCustomInput: false,
        allowSkip: true,
        skipLabel: 'Skip',
        inputType: 'single_choice',
      };
    }

    // Q4: Approximate Dimensions (if not already known)
    if (!answeredIds.has('garage_dimensions') && !understanding.knownDimensions) {
      return {
        id: 'garage_dimensions',
        category: 'dimensions',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'Do you know roughly how large the garage is?',
        subtitle: 'A rough estimate is fine — our surveyors verify exact dimensions on site.',
        impactReason: 'Sizes allow us to calculate floor insulation volume, plasterboard, and screed.',
        options: [
          { label: 'Standard single garage (approx. 5m × 2.8m)', value: 'single_5x2.8', autoAdvance: true },
          { label: 'Long single garage (approx. 6m × 3m)', value: 'long_single_6x3', autoAdvance: true },
          { label: 'Double garage (approx. 5.5m × 5.5m)', value: 'double_5.5x5.5', autoAdvance: true },
          { label: 'I’m not sure — assume standard size', value: 'assume_standard', autoAdvance: true },
        ],
        allowCustomInput: true,
        customInputPlaceholder: 'e.g. 5.2m x 2.6m',
        inputType: 'single_choice',
      };
    }

    // Q5: Smart Suggestion: Sound Insulation for Office (Part 20)
    if (!answeredIds.has('garage_soundproofing') && numAnswered < maxQuestions) {
      return {
        id: 'garage_soundproofing',
        category: 'scope',
        stageLabel: 'ONE MORE USEFUL DETAIL',
        question: 'Would you like us to include enhanced acoustic soundproofing?',
        subtitle: 'High-density acoustic rockwool in the ceiling and dividing wall ensures quiet video calls and privacy.',
        impactReason: 'Recommended for home offices and gyms sharing party or internal walls.',
        options: [
          { label: 'Yes, include acoustic soundproofing', value: 'yes_soundproofing', autoAdvance: true },
          { label: 'Standard thermal insulation is sufficient', value: 'standard_insulation', autoAdvance: true },
          { label: 'Show me the cost difference in the plan', value: 'compare_options', autoAdvance: true },
        ],
        allowSkip: true,
        skipLabel: 'Skip',
        inputType: 'single_choice',
      };
    }
  }

  // -------------------------------------------------------------
  // GARAGE ACCESS DOOR FLOW (Regression Test 2)
  // -------------------------------------------------------------
  if (project === 'door-replacement') {
    // Q1: Wall Type
    if (!answeredIds.has('door_wall_type')) {
      return {
        id: 'door_wall_type',
        category: 'feasibility',
        stageLabel: 'UNDERSTANDING YOUR PROJECT',
        question: 'What is the wall between the hallway and garage built from?',
        subtitle: 'This determines whether we need heavy-duty Acrow props and a pre-stressed concrete or steel box lintel.',
        impactReason: 'Masonry walls require structural lintel insertion and Building Control notice.',
        options: [
          { label: 'Solid brick or blockwork masonry', value: 'brick_block', description: 'Load-bearing dividing wall requiring lintel & padstones', autoAdvance: true },
          { label: 'Timber stud partition', value: 'timber_stud', description: 'Plasterboard partition with timber framework', autoAdvance: true },
          { label: 'Not sure — please inspect on site visit', value: 'site_survey', autoAdvance: true },
        ],
        allowCustomInput: true,
        customInputPlaceholder: 'Tell us in your own words...',
        allowSkip: true,
        skipLabel: 'Not sure',
        inputType: 'single_choice',
      };
    }

    // Q2: Fire Door Style Preference
    if (!answeredIds.has('door_style')) {
      return {
        id: 'door_style',
        category: 'style',
        stageLabel: 'ONE MORE USEFUL DETAIL',
        question: 'What style of FD30S fire doorset would you prefer?',
        subtitle: 'Building Regs require a 30-minute fire-and-smoke door with cold smoke seals and self-closer.',
        options: [
          { label: 'Paint-grade flush white (clean & minimal)', value: 'paint_grade_flush', autoAdvance: true },
          { label: 'Moulded 4-panel period style to match hallway', value: 'period_4_panel', autoAdvance: true },
          { label: 'Oak veneer natural wood finish', value: 'oak_veneer', autoAdvance: true },
          { label: 'Fire-rated glazed vision panel', value: 'fire_glazed', autoAdvance: true },
        ],
        allowSkip: true,
        skipLabel: 'Decide later',
        inputType: 'single_choice',
      };
    }
  }

  // -------------------------------------------------------------
  // BATHROOM RENOVATION FLOW (Regression Test 3)
  // -------------------------------------------------------------
  if (project === 'bathroom-renovation') {
    // If dimensions not already known
    if (!answeredIds.has('bath_dimensions') && !understanding.knownDimensions) {
      return {
        id: 'bath_dimensions',
        category: 'dimensions',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'What are the approximate dimensions of your bathroom?',
        subtitle: 'Helps us calculate wall tile m², Schlüter tanking membrane, and sanitaryware clearance.',
        options: [
          { label: 'Compact en-suite (approx. 2m × 1.5m)', value: 'ensuite_2x1.5', autoAdvance: true },
          { label: 'Standard family bathroom (approx. 2.4m × 2m)', value: 'standard_2.4x2', autoAdvance: true },
          { label: 'Large master bathroom (approx. 3.2m × 2.5m)', value: 'large_3.2x2.5', autoAdvance: true },
          { label: 'I’ll enter exact measurements', value: 'custom_dims' },
        ],
        allowCustomInput: true,
        customInputPlaceholder: 'e.g. 2.4m x 2.0m',
        inputType: 'single_choice',
      };
    }

    // Q: Subfloor Construction (Critical for Microcement and Large Format Tiles)
    if (!answeredIds.has('bath_subfloor')) {
      return {
        id: 'bath_subfloor',
        category: 'feasibility',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'Do you know what kind of floor you have in the bathroom?',
        subtitle: 'Seamless microcement and wet rooms require a zero-deflection, fully rigid substrate.',
        impactReason: 'Timber joists require sistering or 18mm marine plywood plus cement backer boards.',
        options: [
          { label: 'Suspended timber floorboards / joists', value: 'timber_joists', description: 'Most Victorian, Edwardian, and 1930s London homes', autoAdvance: true },
          { label: 'Solid concrete screed slab', value: 'concrete_slab', description: 'Common in ground-floor extensions and modern flats', autoAdvance: true },
          { label: 'Not sure — check during survey', value: 'survey_check', autoAdvance: true },
        ],
        allowSkip: true,
        skipLabel: 'Check on site',
        inputType: 'single_choice',
      };
    }

    // Q: Heating Preference
    if (!answeredIds.has('bath_heating')) {
      return {
        id: 'bath_heating',
        category: 'scope',
        stageLabel: 'ONE MORE USEFUL DETAIL',
        question: 'What heating would you like in the new bathroom?',
        options: [
          { label: 'Electric underfloor heating mat + towel radiator', value: 'ufh_and_towel', autoAdvance: true },
          { label: 'Designer heated towel radiator only', value: 'towel_radiator_only', autoAdvance: true },
          { label: 'Keep existing radiator position', value: 'keep_existing_rad', autoAdvance: true },
        ],
        allowSkip: true,
        skipLabel: 'Decide later',
        inputType: 'single_choice',
      };
    }
  }

  // -------------------------------------------------------------
  // EXTENSION FLOW (Regression Test 4)
  // -------------------------------------------------------------
  if (project === 'extension') {
    // If dimensions not known
    if (!answeredIds.has('ext_dimensions') && !understanding.knownDimensions) {
      return {
        id: 'ext_dimensions',
        category: 'dimensions',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'How far into the garden are you planning to extend?',
        subtitle: 'Most single-storey rear extensions extend between 3m and 6m from the original rear wall.',
        options: [
          { label: '3m depth (standard Permitted Development)', value: 'depth_3m', autoAdvance: true },
          { label: '4m to 5m depth', value: 'depth_4_to_5m', autoAdvance: true },
          { label: '6m depth (larger home extension)', value: 'depth_6m', autoAdvance: true },
          { label: 'Wraparound (rear + side return)', value: 'wraparound', autoAdvance: true },
        ],
        allowCustomInput: true,
        customInputPlaceholder: 'e.g. 5m length by 3.8m width',
        inputType: 'single_choice',
      };
    }

    // Q: Roof Glazing
    if (!answeredIds.has('ext_glazing')) {
      return {
        id: 'ext_glazing',
        category: 'layout',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'What roof glazing style would you prefer?',
        subtitle: 'Rooflights bring daylight deep into the existing middle rooms of the house.',
        options: [
          { label: 'Frameless flat glass rooflights', value: 'frameless_rooflight', description: 'Clean, contemporary, and low maintenance', autoAdvance: true },
          { label: 'Pitched aluminium roof lantern', value: 'roof_lantern', description: 'Architectural focal point over kitchen island', autoAdvance: true },
          { label: 'Solid flat roof with warm roof insulation only', value: 'solid_roof', autoAdvance: true },
          { label: 'Show me recommendations in the plan', value: 'recommend_glazing', autoAdvance: true },
        ],
        allowSkip: true,
        skipLabel: 'Decide later',
        inputType: 'single_choice',
      };
    }

    // Q: Patio Doors
    if (!answeredIds.has('ext_patio_doors')) {
      return {
        id: 'ext_patio_doors',
        category: 'style',
        stageLabel: getStageLabel(numAnswered, maxQuestions),
        question: 'What rear patio door system do you envision?',
        options: [
          { label: 'Aluminium bifolding doors (concertina full opening)', value: 'bifolds', autoAdvance: true },
          { label: 'Slimline sliding glass panels (large glass expanses)', value: 'sliders', autoAdvance: true },
          { label: 'Crittall-style heritage steel/aluminium doors', value: 'crittall', autoAdvance: true },
          { label: 'French doors with side windows', value: 'french_doors', autoAdvance: true },
        ],
        allowSkip: true,
        skipLabel: 'Decide later',
        inputType: 'single_choice',
      };
    }
  }

  // -------------------------------------------------------------
  // BUDGET QUESTION (Part 18 - Asked AFTER scope is understood)
  // -------------------------------------------------------------
  if (!answeredIds.has('project_budget') && !understanding.budgetInfo && numAnswered >= 2 && numAnswered < maxQuestions) {
    return {
      id: 'project_budget',
      category: 'budget',
      stageLabel: 'BUDGET ALIGNMENT',
      question: 'Do you have a target budget you’d like us to work around?',
      subtitle: 'Optional — this helps our team suggest the best materials and finish packages for your range.',
      options: [
        { label: 'Under £20k', value: 'under_20k', autoAdvance: true },
        { label: '£20k – £40k', value: '20k_40k', autoAdvance: true },
        { label: '£40k – £70k', value: '40k_70k', autoAdvance: true },
        { label: '£70k – £110k', value: '70k_110k', autoAdvance: true },
        { label: '£110k+', value: 'over_110k', autoAdvance: true },
        { label: 'I’m not sure — give me guide costs first', value: 'show_guide_costs', autoAdvance: true },
      ],
      allowCustomInput: true,
      customInputPlaceholder: 'Enter specific budget (e.g. £35,000)...',
      allowSkip: true,
      skipLabel: 'Skip budget question',
      inputType: 'single_choice',
    };
  }

  // Enough is known! (Part 12)
  return null;
}
