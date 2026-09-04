/**
 * Feasibility & Constraints Analysis Engine
 * 4-Tier Assessment Model: Statutory, Building Regulations, Structural & Ground, Site Logistics.
 * Complies with GEMINI.md Section 13 & Phase 7B Specification (Item 33).
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
  const isTerrace = property.type.value === 'terraced' || lower.includes('terrace');
  const isConservation = property.isConservationArea.value;
  const isListed = property.isListedBuilding.value;

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
        `Property listed: ${isListed ? 'Yes' : 'No / Not indicated'}`,
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
    items.push({
      id: 'feas-statutory-internal',
      tier: 'statutory',
      category: 'Planning',
      title: 'Internal Works Statutory Planning Status',
      level: isListed ? 'POTENTIAL_CONSTRAINT' : 'LIKELY_STRAIGHTFORWARD',
      assessment: isListed
        ? 'Listed Building Consent is legally required for internal alterations and layout changes.'
        : 'Internal alterations, kitchen refits, bathroom replacements, and internal joinery do not require planning permission on unlisted residential properties.',
      why: 'Section 55(2)(a) of the Town and Country Planning Act 1990 excludes internal maintenance and improvement works from planning control.',
      source: 'Internal renovation brief.',
      whatWeKnow: [`Unlisted residential interior: ${!isListed}`],
      whatWeDontKnow: ['Leasehold freeholder alterations consent (if flat or maisonette)'],
      nextCheck: 'Review leasehold covenants if property is a leasehold flat.',
      evidenceUsed: 'Internal refurbishment',
    });
  }

  // =========================================================================
  // TIER 2: BUILDING REGULATIONS (PARTS A, B, E, L, P)
  // =========================================================================
  items.push({
    id: 'feas-building-regs',
    tier: 'building_regs',
    category: 'Building_Regulations',
    title: 'Building Control Compliance (Parts A, B, E, L, P)',
    level: hasStructuralKnockthrough || isExtension || isLoft ? 'POSSIBLE_REQUIRES_CONFIRMATION' : 'LIKELY_STRAIGHTFORWARD',
    assessment: hasStructuralKnockthrough || isExtension || isLoft
      ? 'Full Building Regulations application required covering Part A (Structural Safety), Part B (Fire Escape & Mains Interlinked Smoke Detection), Part L (Thermal U-Values 0.15 W/m²K for roofs, 0.18 for walls), and Part P (Electrical Safety).'
      : 'Requires Part P electrical compliance for new circuits and Part G for unvented hot water cylinders or sanitisation.',
    why: 'Statutory Building Regulations guarantee that building works are structurally safe, thermally efficient, and fire protected.',
    source: 'Trade scope requirements.',
    whatWeKnow: [
      `Structural changes present: ${hasStructuralKnockthrough ? 'Yes' : 'No'}`,
      `New electrical circuits required: Yes`,
    ],
    whatWeDontKnow: [
      'Current fuse board / consumer unit spare way capacity and RCD protection.',
      'Mains interlinked fire alarm coverage in existing hallways and landings.',
    ],
    nextCheck: 'Appoint an Approved Inspector or Local Authority Building Control officer before structural demolition.',
    evidenceUsed: 'National Building Regulations requirements',
  });

  // =========================================================================
  // TIER 3: STRUCTURAL & GROUND CONDITIONS
  // =========================================================================
  if (hasStructuralKnockthrough || isExtension) {
    items.push({
      id: 'feas-structural-engineering',
      tier: 'structural',
      category: 'Structure',
      title: 'Structural Load Paths & Foundation Soil Conditions',
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
  }

  // =========================================================================
  // TIER 4: SITE LOGISTICS & ACCESS (LONDON REALITIES)
  // =========================================================================
  items.push({
    id: 'feas-site-logistics',
    tier: 'site_logistics',
    category: 'Access',
    title: 'London Access Logistics, Party Wall & Deliveries',
    level: isTerrace ? 'POTENTIAL_CONSTRAINT' : 'POSSIBLE_REQUIRES_CONFIRMATION',
    assessment: isTerrace
      ? 'Terraced house with no side access requires all demolition waste, concrete, and heavy steel beams to be transported through the property or via a crane over rooflines. Party Wall Act 1996 notices required for adjoining neighbours.'
      : 'Site access from road frontage. Skip permits and parking bay suspensions may be required from the local council.',
    why: 'Urban London construction requires proactive logistics planning to prevent site stoppages and avoid council parking enforcement fines.',
    source: `Property layout: ${property.type.value}`,
    whatWeKnow: [`Building type: ${property.type.value}`],
    whatWeDontKnow: [
      'Local council Controlled Parking Zone (CPZ) skip license restrictions.',
      'Neighbour willingness to sign Party Wall consents without appointing separate surveyors.',
    ],
    nextCheck: 'Serve Party Wall notices at least 2 months before commencement; arrange council skip licenses.',
    evidenceUsed: 'London site logistics assessment',
  });

  return items;
}
