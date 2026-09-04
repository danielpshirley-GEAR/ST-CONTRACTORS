/**
 * Feasibility & Constraints Analysis Engine
 * 4-Tier Assessment Model: LIKELY_STRAIGHTFORWARD, POSSIBLE_REQUIRES_CONFIRMATION, POTENTIAL_CONSTRAINT, PROFESSIONAL_ASSESSMENT_REQUIRED
 * Complies with GEMINI.md Section 13 & Master Visualiser Rebuild Specification.
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
  const isTerrace = property.type.value === 'terraced' || lower.includes('terrace');
  const isVictorian = property.era.value === 'victorian' || lower.includes('victorian');

  // 1. STRUCTURE
  if (hasStructuralKnockthrough || isExtension || isLoft || lower.includes('wall') || lower.includes('open plan') || lower.includes('steel')) {
    items.push({
      id: 'feas-structure',
      category: 'Structure',
      title: 'Load-Bearing Structural Openings & Steelwork',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment: 'Structural opening requested. A qualified structural engineer must calculate load transfers and specify universal column/beam (RSJ) sizing and concrete padstones.',
      evidenceUsed: hasStructuralKnockthrough ? 'Identified request to remove dividing wall / create open plan layout.' : 'Structural alterations implied by project type.',
      whatIsUnknown: 'Exact location of load-bearing walls, floor joist directions, and ceiling load paths above.',
      whyItMatters: 'Removing or altering load-bearing masonry without calculated steel support causes severe floor sag and ceiling collapse.',
      recommendedNextStep: 'Commission a measured structural survey before freezing architectural drawings.',
    });
  } else {
    items.push({
      id: 'feas-structure-straightforward',
      category: 'Structure',
      title: 'Structural Stability',
      level: 'LIKELY_STRAIGHTFORWARD',
      assessment: 'Non-structural refurbishment. No load-bearing wall alterations or foundation modifications detected in current brief.',
      evidenceUsed: 'No wall knockthroughs or structural extensions identified.',
      whatIsUnknown: 'Subfloor joist condition beneath existing finishes.',
      whyItMatters: 'Ensures fit-out proceeds rapidly without engineering delays.',
      recommendedNextStep: 'Verify subfloor flatness during initial strip-out inspection.',
    });
  }

  // 2. PLANNING PERMISSION & PERMITTED DEVELOPMENT
  if (isExtension) {
    const isLarge = lower.includes('wraparound') || lower.includes('double') || lower.includes('two storey');
    items.push({
      id: 'feas-planning',
      category: 'Planning',
      title: 'Permitted Development vs Full Planning Application',
      level: isLarge ? 'POTENTIAL_CONSTRAINT' : 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment: isLarge
        ? 'Wraparound and double-storey extensions almost always require Full Planning Permission from your local council.'
        : 'Single-storey rear extensions up to 3m (attached) or 6m (Prior Approval) generally fall under UK Permitted Development rights.',
      evidenceUsed: `Project category: Extension. Property type: ${property.type.value}.`,
      whatIsUnknown: 'Whether council Article 4 directions or Conservation Area covenants apply to this specific street.',
      whyItMatters: 'Building without required permissions risks council enforcement action and invalidates building insurance.',
      recommendedNextStep: 'Submit an application for a Lawful Development Certificate (LDC) to verify compliance legally.',
    });
  } else if (isLoft) {
    const isMansard = lower.includes('mansard');
    items.push({
      id: 'feas-planning-loft',
      category: 'Planning',
      title: 'Loft Conversion Planning & Volume Allowance',
      level: isMansard ? 'POTENTIAL_CONSTRAINT' : 'LIKELY_STRAIGHTFORWARD',
      assessment: isMansard
        ? 'Mansard loft conversions require full planning approval in most London boroughs.'
        : 'Rear dormer conversions up to 40m³ (terraced) or 50m³ (semi-detached) typically fall under Permitted Development.',
      evidenceUsed: 'Loft conversion scope analysis.',
      whatIsUnknown: 'Exact cubic volume of existing roof and proposed dormer extension.',
      whyItMatters: 'Exceeding 40m³/50m³ thresholds requires formal planning consent.',
      recommendedNextStep: 'Have architectural drawings calculate exact cubic volume before construction.',
    });
  }

  // 3. DRAINAGE & THAMES WATER
  if (isExtension || hasDrainageRelocation || lower.includes('drain') || lower.includes('sewer') || lower.includes('manhole')) {
    items.push({
      id: 'feas-drainage',
      category: 'Drainage',
      title: 'Thames Water Shared Drain & Build-Over Feasibility',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment: 'If public or shared sewer pipes run within 3 metres of new foundation footings, a formal Thames Water Build-Over Agreement is legally required.',
      evidenceUsed: 'Ground-floor extension footprint or relocated drainage lines identified.',
      whatIsUnknown: 'Exact location, invert depth, and condition of underground drainage pipes.',
      whyItMatters: 'Pouring concrete over shared sewers without consent leads to stop-work notices and expensive retrospective approvals.',
      recommendedNextStep: 'Conduct a CCTV drainage survey from the nearest inspection chamber prior to excavation.',
    });
  }

  // 4. PARTY WALL ACT 1996
  if (isTerrace || isExtension || isLoft || hasStructuralKnockthrough) {
    items.push({
      id: 'feas-party-wall',
      category: 'Party_Wall',
      title: 'Party Wall etc. Act 1996 Statutory Notices',
      level: 'POSSIBLE_REQUIRES_CONFIRMATION',
      assessment: 'Excavating within 3m of neighbour foundations or inserting steel beams into shared party walls legally requires formal Party Wall Notice at least 2 months prior to works.',
      evidenceUsed: isTerrace ? 'Terraced property with shared party walls on both flanks.' : 'Semi-detached / structural works adjacent to boundary.',
      whatIsUnknown: 'Neighbour willingness to consent without appointing independent surveyors.',
      whyItMatters: 'Dissenting neighbours can appoint surveyors, introducing a 6 to 10 week award drafting period.',
      recommendedNextStep: 'Serve Section 1, 2, and 6 Party Wall notices early in the architectural drawing phase.',
    });
  }

  // 5. ELECTRICAL & UTILITY CAPACITY
  if (isKitchen || isExtension || lower.includes('induction') || lower.includes('electric') || lower.includes('boiler')) {
    items.push({
      id: 'feas-utilities',
      category: 'Utilities',
      title: 'Consumer Unit & Electrical Load Capacity',
      level: 'LIKELY_STRAIGHTFORWARD',
      assessment: 'Modern induction hobs (7.4kW), electric underfloor heating, and appliance suites require dedicated 32A/40A circuits and RCD consumer unit surge protection.',
      evidenceUsed: 'Modern kitchen/extension MEP requirements.',
      whatIsUnknown: 'Age and capacity of existing domestic fuse box and incoming main fuse (60A vs 100A).',
      whyItMatters: 'Overloading an outdated fuse board causes tripping and fails Part P electrical building regulations.',
      recommendedNextStep: 'Request an Electrical Installation Condition Report (EICR) during preliminary survey.',
    });
  }

  // 6. WATERPROOFING & DAMP (FOR BATHROOMS & VICTORIAN HOMES)
  if (isBathroom) {
    items.push({
      id: 'feas-waterproofing',
      category: 'Waterproofing',
      title: 'Wet Room & Shower Waterproof Tanking Integrity',
      level: 'LIKELY_STRAIGHTFORWARD',
      assessment: 'Full Schlüter or Mapei multi-layer waterproof membrane tanking required across all shower walls and floors to prevent subfloor timber rot.',
      evidenceUsed: 'Bathroom / wet room scope.',
      whatIsUnknown: 'Condition of existing timber joists beneath the current shower tray or bath.',
      whyItMatters: 'Tile grout is naturally porous; untanked shower walls cause chronic structural water leaks into ceilings below.',
      recommendedNextStep: 'Mandate full-envelope tanking guarantee prior to tile installation.',
    });
  }

  // 7. ACCESS & SITE LOGISTICS
  if (isTerrace && (isExtension || lower.includes('excavat') || lower.includes('demolit'))) {
    items.push({
      id: 'feas-access',
      category: 'Access',
      title: 'Narrow Terraced Access & Barrowing Logistics',
      level: 'POTENTIAL_CONSTRAINT',
      assessment: 'Terraced properties lacking side alleys require all spoil removal, concrete, and materials to be barrowed directly through the house.',
      evidenceUsed: 'Terraced property without dedicated external side passage.',
      whatIsUnknown: 'Internal hallway widths and floor protection requirements.',
      whyItMatters: 'Adds 5%–10% to groundworks labor and requires heavy-duty dust-sealed protection barriers.',
      recommendedNextStep: 'Specify heavy-duty protective floor cladding and air-sealed dust screening in site setup scope.',
    });
  }

  return items;
}
