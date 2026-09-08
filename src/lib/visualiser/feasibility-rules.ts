/**
 * Feasibility & Constraints Analysis Engine
 * 4-Tier Assessment Model: Statutory, Building Regulations, Structural & Ground, Site Logistics.
 * Complies with GEMINI.md Section 13, BUILD_SPEC.md, and Phase 8B Customer-First Rules.
 */

import { FeasibilityItem, ProjectCategoryType, ProjectPropertyInfo } from '@/types/visualiser-scope';

export function evaluateProjectFeasibility(
  projectTypes: ProjectCategoryType[],
  hasStructuralKnockthrough: boolean,
  hasDrainageRelocation: boolean,
  property: ProjectPropertyInfo,
  briefText: string
): FeasibilityItem[] {
  const items: FeasibilityItem[] = [];
  const lower = (briefText || '').toLowerCase();

  const isExtension = projectTypes.includes('extension');
  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isLoft = projectTypes.includes('loft-conversion');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isDriveway = projectTypes.includes('driveway');
  const isDoorProject =
    projectTypes.includes('door-replacement') ||
    (lower.includes('door') && lower.includes('garage')) ||
    (lower.includes('door') && lower.includes('hallway'));
  const isTerrace = property.type.value === 'terraced' || lower.includes('terrace');
  const isConservation = property.isConservationArea.value === true;
  const isListed = property.isListedBuilding.value === true;
  const listedUnknown = property.isListedBuilding.value === 'unknown' || property.isListedBuilding.value === undefined;

  // =========================================================================
  // TIER 1: STATUTORY PLANNING & PERMITTED DEVELOPMENT
  // =========================================================================
  if (isExtension) {
    const isWraparound = lower.includes('wraparound') || lower.includes('wrap around') || lower.includes('double');
    items.push({
      id: 'feas-statutory-planning',
      tier: 'statutory',
      category: 'Planning',
      title: 'Planning Permission vs Permitted Development (Class A)',
      level: isConservation || isListed || isWraparound ? 'POTENTIAL_CONSTRAINT' : 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment: isListed
        ? 'Listed Building Consent and Full Planning Permission required from local planning authority.'
        : isConservation
        ? 'Conservation Area rules restrict permitted development (cladding, side extensions, and materials require council approval).'
        : isWraparound
        ? 'Wraparound extensions combine side and rear extensions, almost universally requiring a Full Householder Planning Application.'
        : 'Single-storey rear extensions up to 3.0m (attached) or 4.0m (detached) typically qualify under General Permitted Development Order (Class A). Larger extensions up to 6.0m require Neighbour Consultation Scheme Prior Approval.',
      why: 'Statutory planning legislation governs external envelope expansions, boundary setbacks, and daylight impact on adjoining owners.',
      source: `Project type: Extension. Property type: ${property.type.value}. Era: ${property.era.value}.`,
      whatWeKnow: [
        `Property listed: ${isListed ? 'Yes' : listedUnknown ? 'Not yet checked' : 'No'}`,
        `Conservation area: ${isConservation ? 'Yes' : 'No / Not indicated'}`,
      ],
      whatWeDontKnow: [
        'Whether local council has removed Permitted Development rights via an Article 4 Direction on your road.',
        'Exact rear garden boundary depth and distance to adjoining properties.',
      ],
      nextCheck: 'Submit an application for a Lawful Development Certificate (LDC) or Householder Planning Permission before groundworks.',
      evidenceUsed: 'Project category: Extension',
      whyItMatters: 'Ensures compliance with council planning laws and avoids enforcement orders.',
      recommendedNextStep: 'Verify planning constraints during ST Contractors pre-construction architectural review.',
    });
  } else if (isDriveway) {
    items.push({
      id: 'feas-statutory-suds',
      tier: 'statutory',
      category: 'Planning',
      title: 'Permeable Surface Water Regulations (SuDS Class F)',
      level: 'LIKELY_STRAIGHTFORWARD',
      assessment: 'Hard surfacing over 5m² of a front garden must use permeable materials (porous block paving, gravel, resin-bound) or direct surface water runoff into a lawn/soakaway to avoid requiring planning permission.',
      why: 'Under UK Planning Schedule 2 Part 1 Class F, non-permeable driveways directing water into council stormwater drains require full planning permission.',
      source: 'Driveway scope analysis.',
      whatWeKnow: ['Front garden / driveway paving project'],
      whatWeDontKnow: ['Existing ground permeability and surface water fall direction'],
      nextCheck: 'Specify certified permeable block paving or sub-surface soakaway crates.',
      evidenceUsed: 'Driveway category',
    });
  } else {
    // Internal alterations / door / bathroom / kitchen
    items.push({
      id: 'feas-statutory-internal',
      tier: 'statutory',
      category: 'Planning',
      title: 'Internal Works Planning Status',
      level: isListed ? 'POTENTIAL_CONSTRAINT' : 'LIKELY_STRAIGHTFORWARD',
      assessment: isListed
        ? 'Listed Building Consent is legally required for alterations affecting the character of a listed building.'
        : listedUnknown
        ? 'Internal alterations do not require planning permission on standard unlisted properties. (If your property is listed, consent would be required before altering walls or joinery).'
        : 'Internal alterations, doorways, and renovations do not require planning permission on unlisted dwellings.',
      why: 'Section 55(2)(a) of the Town and Country Planning Act 1990 excludes internal maintenance, improvement, and alterations from planning control.',
      source: 'Internal renovation brief.',
      whatWeKnow: [
        `Listed status: ${isListed ? 'Confirmed Listed' : listedUnknown ? 'Not yet checked' : 'Unlisted'}`,
      ],
      whatWeDontKnow: ['Freeholder alterations license (if leasehold flat or maisonette)'],
      nextCheck: 'Confirm property is unlisted; review leasehold covenants if leasehold.',
      evidenceUsed: 'Internal alterations assessment',
    });
  }

  // =========================================================================
  // TIER 2: BUILDING REGULATIONS (RELEVANCE GATED)
  // =========================================================================
  if (isDoorProject) {
    items.push({
      id: 'feas-fire-separation-garage',
      tier: 'building_regs',
      category: 'Fire_Safety',
      title: 'Approved Document B (Fire Safety) — Garage Separation & FD30S Doorset',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment:
        'A door between an integral or attached garage and a dwellinghouse must provide at least 30 minutes fire resistance (FD30S doorset with intumescent fire and smoke seals) and be fitted with an effective self-closing mechanism.',
      why: 'Approved Document B mandates a continuous fire-resisting barrier between vehicle storage and habitable domestic accommodation.',
      source: 'Approved Document B (Fire Safety) Volume 1: Dwellings, Requirement B3.',
      whatWeKnow: ['Door opening connecting dwelling to garage requested in brief.'],
      whatWeDontKnow: [
        'Whether existing wall already has a 30-minute fire-resisting construction.',
        'Floor level height difference between hallway and garage.',
      ],
      nextCheck: 'Confirm wall construction and specify a certified FD30S pre-hung doorset with overhead closer.',
      evidenceUsed: 'Approved Document B garage separation requirements',
      whyItMatters: 'Essential for life safety and mandatory for Building Regulations compliance.',
      recommendedNextStep: 'ST Contractors verifies opening size and specifies certified FD30S doorset.',
    });

    items.push({
      id: 'feas-threshold-floor-step',
      tier: 'building_regs',
      category: 'Building_Regulations',
      title: '100mm Floor Level Step or Fall (Vapour Containment)',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment:
        'The garage floor should ideally step down at least 100mm from the hallway floor level, or be laid to fall away from the door, to prevent petrol spills or heavy flammable vapours from entering the dwelling.',
      why: 'Prevents heavier-than-air automotive fumes and fluid leakages from migrating under the door into living spaces.',
      source: 'UK Building Regulations guidance on integral vehicle garages.',
      whatWeKnow: ['Internal opening to garage'],
      whatWeDontKnow: ['Exact floor levels between hallway and garage'],
      nextCheck: 'Measure relative floor level during initial site inspection; incorporate threshold step upstand if level.',
      evidenceUsed: 'Garage threshold standards',
    });
  } else if (isBathroom) {
    items.push({
      id: 'feas-bathroom-waterproofing',
      tier: 'building_regs',
      category: 'Waterproofing',
      title: 'Approved Document Part G & Wet Area Tanking Standards',
      level: 'LIKELY_STRAIGHTFORWARD',
      assessment:
        'All walk-in shower walls, wet zones, and floor junctions require full secondary tanking membrane waterproofing (BS 5385 Part 4) to protect timber joists and ceilings below. High-output extract ventilation (minimum 15 L/s) is required under Part F.',
      why: 'Prevents moisture penetration, mould growth, and subfloor timber degradation.',
      source: 'Approved Document Part G (Sanitation) and Part F (Ventilation).',
      whatWeKnow: ['Bathroom renovation with shower area'],
      whatWeDontKnow: ['Subfloor joist condition and waste water fall to soil stack'],
      nextCheck: 'Inspect soil stack access and water pressure during pre-strip survey.',
      evidenceUsed: 'Wet-room building standards',
    });
  } else {
    items.push({
      id: 'feas-building-regs-general',
      tier: 'building_regs',
      category: 'Building_Regulations',
      title: 'Building Control Compliance (Parts A, B, L, P)',
      level: hasStructuralKnockthrough || isExtension || isLoft ? 'POSSIBLE_REQUIRES_CONFIRMATION' : 'LIKELY_STRAIGHTFORWARD',
      assessment: hasStructuralKnockthrough || isExtension || isLoft
        ? 'Full Building Regulations application required covering Part A (Structural Safety), Part B (Fire Escape & Interlinked Smoke Alarms), Part L (Energy Efficiency), and Part P (Electrical Safety).'
        : isKitchen
        ? 'Kitchen remodeling requires Part P electrical certification for modified ring mains and Part F mechanical extract ventilation (30 L/s over hob or 60 L/s elsewhere).'
        : 'General building works require standard compliance with relevant Approved Documents.',
      why: 'Statutory Building Regulations guarantee that building works are structurally safe, thermally efficient, and fire protected.',
      source: 'Trade scope requirements.',
      whatWeKnow: [
        `Structural alterations: ${hasStructuralKnockthrough ? 'Yes' : 'No'}`,
      ],
      whatWeDontKnow: [
        'Consumer unit spare way capacity and RCD protection.',
      ],
      nextCheck: 'Appoint Building Control or Approved Inspector before commencing structural work.',
      evidenceUsed: 'National Building Regulations requirements',
    });
  }

  // =========================================================================
  // TIER 3: STRUCTURAL LINTEL / ENGINEERING
  // =========================================================================
  if (isDoorProject) {
    items.push({
      id: 'feas-door-lintel-support',
      tier: 'structural',
      category: 'Structure',
      title: 'Structural Lintel for Wall Opening',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment:
        'If the wall between the hallway and garage is masonry and load-bearing, a prestressed concrete or steel Catnic lintel with minimum 150mm end bearings will be required above the new door opening. If timber stud, double trimmers and a head binder will be installed.',
      why: 'Transfers structural floor and roof loads safely around the door opening.',
      source: 'Structural alteration assessment.',
      whatWeKnow: ['Door opening proposed through dividing wall.'],
      whatWeDontKnow: ['Whether dividing wall is solid brick, blockwork, or timber stud.'],
      nextCheck: 'Conduct non-destructive wall inspection during site survey to confirm construction.',
      evidenceUsed: 'Wall opening requirements',
    });
  } else if (hasStructuralKnockthrough || isExtension) {
    items.push({
      id: 'feas-structural-engineering',
      tier: 'structural',
      category: 'Structure',
      title: 'Structural Knockthrough & Steel Beam Calculations',
      level: 'PROFESSIONAL_ASSESSMENT_REQUIRED',
      assessment: 'A chartered structural engineer (MIStructE/MICE) must inspect the property, perform load calculations, and produce structural drawings and beam/padstone schedules.',
      why: 'Removing masonry walls or digging foundations near shared party structures requires verified mathematical load distribution.',
      source: hasStructuralKnockthrough ? 'Structural knockthrough requested in brief' : 'Extension foundation works',
      whatWeKnow: ['Structural load alteration is proposed'],
      whatWeDontKnow: [
        'Floor joist orientation and chimney breast load distribution on upper floors.',
        'Subsoil composition (London clay shrinkability, high water-demand tree root zones).',
      ],
      nextCheck: 'Commission a measured structural survey and engineer calculation pack.',
      evidenceUsed: 'Structural requirement analysis',
    });

    if (isExtension || hasDrainageRelocation) {
      items.push({
        id: 'feas-drainage-thames-water',
        tier: 'site_logistics',
        category: 'Drainage',
        title: 'Thames Water Build-Over Agreement & Drainage Alignment',
        level: 'POSSIBLE_REQUIRES_CONFIRMATION',
        assessment:
          'Building within 3 metres of a shared public sewer or inspection chamber requires a formal Thames Water Build-Over Agreement and pre-construction CCTV drain survey.',
        why: 'Under the 2011 Water Transfer Regulations, sewers serving more than one property are publicly owned assets.',
        source: 'Extension drainage regulations.',
        whatWeKnow: ['Rear extension encroaching onto existing garden drainage run.'],
        whatWeDontKnow: ['Location and depth of underground public sewer pipes.'],
        nextCheck: 'Commission CCTV drain survey before pouring concrete foundations.',
        evidenceUsed: 'Thames Water Build-Over regulations',
      });
    }
  }

  // =========================================================================
  // TIER 4: SITE LOGISTICS & PARTY WALL (RELEVANCE GATED)
  // =========================================================================
  if (isExtension || isLoft || (hasStructuralKnockthrough && isTerrace)) {
    items.push({
      id: 'feas-site-logistics',
      tier: 'site_logistics',
      category: 'Access',
      title: 'Party Wall Act 1996 & Site Logistics',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment:
        'Excavations within 3m of neighbouring foundations or structural insertions into a shared party wall require formal Party Wall Act notices served at least 1–2 months before work starts.',
      why: 'Statutory framework to prevent neighbour disputes and protect adjacent properties.',
      source: `Property type: ${property.type.value}. Scope: ${projectTypes.join(', ')}.`,
      whatWeKnow: [`Building type: ${property.type.value}`],
      whatWeDontKnow: ['Neighbour willingness to consent or requirement for an agreed surveyor.'],
      nextCheck: 'Serve Party Wall notices following final architectural drawings.',
      evidenceUsed: 'Party Wall Act 1996 applicability criteria',
    });
  }

  return items;
}
