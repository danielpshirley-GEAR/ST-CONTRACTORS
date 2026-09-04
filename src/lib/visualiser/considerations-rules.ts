/**
 * Project-Specific Considerations Engine
 * Generates visually balanced cards (4, 6, or 8) tailored to project type, property era, and scope.
 * Complies with Master Visualiser Rebuild Specification.
 */

import { ThingToConsiderItem, ProjectCategoryType, ProjectPropertyInfo } from '@/types/visualiser-scope';

export function generateThingsToConsider(
  projectTypes: ProjectCategoryType[],
  property: ProjectPropertyInfo,
  briefText: string,
  hasStructuralKnockthrough: boolean
): ThingToConsiderItem[] {
  const pool: ThingToConsiderItem[] = [];
  const lower = (briefText || '').toLowerCase();

  const isExtension = projectTypes.includes('extension');
  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isLoft = projectTypes.includes('loft-conversion');
  const isTerrace = property.type.value === 'terraced' || lower.includes('terrace');
  const isVictorian = property.era.value === 'victorian' || lower.includes('victorian');

  // 1. Victorian Subfloor Joist Deflection
  if (isVictorian || isKitchen || isExtension) {
    pool.push({
      id: 'cons-joist-deflection',
      issue: 'Victorian Suspended Floor Joist Deflection & Island Load',
      category: 'Structural Subfloor',
      impactLevel: 'HIGH',
      whyItMatters: '140-year-old suspended floor joists were sized for lightweight furniture. Installing a 500kg quartz island and heavy porcelain tiles without joist sistering causes floor bounce, grout cracking, and long-term sagging.',
      whatShouldBeChecked: 'Laser survey joist levelness and probe joist ends for damp during initial strip-out.',
      effectOnProject: 'Requires £1,200–£2,400 in C24 timber sistering during first-fix to permanently prevent floor failure.',
    });
  }

  // 2. Party Wall Act 1996
  if (isTerrace || isExtension || isLoft || hasStructuralKnockthrough) {
    pool.push({
      id: 'cons-party-wall',
      issue: 'Party Wall etc. Act 1996 Statutory Notices',
      category: 'Legal & Neighbour',
      impactLevel: 'HIGH',
      whyItMatters: 'Excavating within 3 metres of a neighbour’s foundation or inserting steel beams into a shared party wall legally requires 2 months written notice under UK law.',
      whatShouldBeChecked: 'Serve formal Section 1, 2, and 6 notices early during architectural drawing preparation.',
      effectOnProject: 'Dissenting neighbours can appoint surveyors, introducing 6–8 weeks in award preparation time.',
    });
  }

  // 3. Thames Water Shared Sewer Build-Over
  if (isExtension || lower.includes('drain') || lower.includes('manhole')) {
    pool.push({
      id: 'cons-thames-water',
      issue: 'Thames Water Shared Drain Build-Over Agreement',
      category: 'Drainage & Sewers',
      impactLevel: 'HIGH',
      whyItMatters: 'Under the 2011 Private Sewers Transfer Regulations, any drain serving more than one property is owned by Thames Water. Building within 3m requires formal approval.',
      whatShouldBeChecked: 'Run a CCTV drainage survey from the nearest manhole chamber before digging foundations.',
      effectOnProject: 'Requires a self-certification (£343) or full Thames Water Build-Over Agreement and double-sealed internal inspection covers.',
    });
  }

  // 4. Electrical Consumer Unit & 32A Induction Circuit
  if (isKitchen || isExtension || lower.includes('induction') || lower.includes('electric')) {
    pool.push({
      id: 'cons-electrical-load',
      issue: 'Consumer Unit Capacity & High-Load Induction Circuits',
      category: 'Electrical Infrastructure',
      impactLevel: 'MEDIUM',
      whyItMatters: 'Modern 7.4kW induction hobs, electric underfloor heating, and Quooker boiling taps exceed the capacity of older fuse boards lacking RCD surge protection.',
      whatShouldBeChecked: 'Verify incoming electrical supply fuse (60A vs 100A) and spare ways on consumer unit.',
      effectOnProject: 'May require a consumer unit upgrade (£650–£950) with NICEIC Part P certification.',
    });
  }

  // 5. Living in Property & Temporary Cooking/Washing Setup
  pool.push({
    id: 'cons-living-in',
    issue: 'Household Living Continuity & Dust Protection',
    category: 'Logistics & Welfare',
    impactLevel: 'MEDIUM',
    whyItMatters: 'Over 80% of our clients remain living in their homes during ground-floor builds. Dust isolation and temporary washing/cooking setups prevent extreme disruption.',
    whatShouldBeChecked: 'Agree on dedicated temporary kitchen/utility locations and sealed floor protection routes.',
    effectOnProject: 'Site setup includes heavy-duty floor cladding and zippered plastic dust barriers.',
  });

  // 6. Natural Light & Solar Heat Gain
  if (isExtension || isKitchen || lower.includes('bifold') || lower.includes('glass') || lower.includes('rooflight')) {
    pool.push({
      id: 'cons-solar-glazing',
      issue: 'Solar Heat Gain & Over-Glazing on South Elevations',
      category: 'Thermal Comfort',
      impactLevel: 'MEDIUM',
      whyItMatters: 'South-facing glass roof lanterns without solar-control coating create a greenhouse effect, making open-plan kitchens uncomfortably hot in summer.',
      whatShouldBeChecked: 'Specify Low-E glass with minimum 60% solar reflection and opening roof vents.',
      effectOnProject: 'Ensures year-round comfortable room temperatures with zero glare.',
    });
  }

  // 7. Bathroom Mechanical Ventilation & Mold (Part F)
  if (isBathroom) {
    pool.push({
      id: 'cons-ventilation',
      issue: 'Building Regs Part F Mechanical Extract Ventilation',
      category: 'Ventilation & Moisture',
      impactLevel: 'HIGH',
      whyItMatters: 'High-pressure rainfall showers generate significant steam. Weak extractor fans cause mirror misting, mold on ceiling paint, and peeling silicone sealant.',
      whatShouldBeChecked: 'Install an inline continuous or humidistat extractor fan ducted directly through external walls with a 15-minute overrun timer.',
      effectOnProject: 'Eliminates mold and satisfies Building Regulations Part F airflow rates.',
    });
  }

  // 8. Narrow Terraced Spoil Barrowing & Parking CPZ
  if (isTerrace) {
    pool.push({
      id: 'cons-terrace-access',
      issue: 'Narrow Terraced Access & London CPZ Parking Suspensions',
      category: 'Site Access',
      impactLevel: 'MEDIUM',
      whyItMatters: 'Terraces without side alleys require barrowing tons of excavated spoil and materials through the house, plus council skip and parking bay suspensions.',
      whatShouldBeChecked: 'Apply for controlled parking zone (CPZ) bay suspensions with the local council 2 weeks prior to site start.',
      effectOnProject: 'Prevents delivery delays and ensures compliant street parking permits.',
    });
  }

  // Ensure balanced count: exactly 4, 6, or 8 items
  let targetCount = 6;
  if (pool.length <= 4) targetCount = 4;
  else if (pool.length >= 8) targetCount = 8;
  else targetCount = 6;

  return pool.slice(0, targetCount);
}
