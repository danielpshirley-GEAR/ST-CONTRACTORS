/**
 * Project-Specific Considerations Engine
 * Generates visually balanced cards (4, 6, or 8) strictly tailored to project type, property era, and scope.
 * Complies with GEMINI.md and Phase 7B Specification (Items 14 & 28).
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
  const isDriveway = projectTypes.includes('driveway');
  const isJoinery = projectTypes.includes('joinery');
  const isBedroom = projectTypes.includes('bedroom') || projectTypes.includes('decorating');
  const isTerrace = property.type.value === 'terraced' || lower.includes('terrace');
  const isVictorian = property.era.value === 'victorian' || lower.includes('victorian');

  // =========================================================================
  // DRIVEWAY CONSIDERATIONS
  // =========================================================================
  if (isDriveway) {
    pool.push(
      {
        id: 'cons-driveway-suds',
        issue: 'Permeable Sub-Base & SuDS Regulations',
        category: 'Statutory Regulations',
        impactLevel: 'HIGH',
        whyItMatters: 'UK legislation requires driveway surfaces over 5m² to be fully permeable or direct water to internal soakaways to prevent local storm flooding.',
        whatShouldBeChecked: 'Ensure MOT Type 3 sub-base specification and non-clogging geotextile membrane.',
        effectOnProject: 'Prevents council enforcement and ensures rapid natural drainage.',
      },
      {
        id: 'cons-driveway-crossover',
        issue: 'Council Dropped Kerb & Vehicle Crossover Approval',
        category: 'Council & Highways',
        impactLevel: 'HIGH',
        whyItMatters: 'Driving across a public pedestrian footway without a council-approved dropped kerb is illegal under Highways Act legislation.',
        whatShouldBeChecked: 'Check whether a formal vehicle crossover license has already been issued by the local authority.',
        effectOnProject: 'Applications take 4–8 weeks; dropped kerb works must be carried out by council-approved contractors.',
      },
      {
        id: 'cons-driveway-subgrade',
        issue: 'Subgrade Soil Compaction & Vehicle Load Bearing',
        category: 'Engineering & Ground',
        impactLevel: 'MEDIUM',
        whyItMatters: 'Inadequate subgrade excavation and compaction on London clay causes driveway rutting under heavy SUV wheel loads.',
        whatShouldBeChecked: 'Excavate minimum 200–250mm depth and mechanically compact in progressive 50mm layers.',
        effectOnProject: 'Guarantees driveway remains level without sunken tire tracks.',
      },
      {
        id: 'cons-driveway-cables',
        issue: 'Underground Gas, Water & Telecom Service Lines',
        category: 'Utilities & Safety',
        impactLevel: 'MEDIUM',
        whyItMatters: 'Shallow domestic gas and electric supply pipes frequently run across front gardens at shallow depths.',
        whatShouldBeChecked: 'Scan the excavation area with a CAT (Cable Avoidance Tool) locator before ground breaking.',
        effectOnProject: 'Prevents catastrophic utility strikes and repair charges.',
      }
    );
    return pool;
  }

  // =========================================================================
  // JOINERY CONSIDERATIONS
  // =========================================================================
  if (isJoinery) {
    pool.push(
      {
        id: 'cons-joinery-plumb',
        issue: 'Wall Out-of-Plumb & Uneven Period Ceilings',
        category: 'Carpentry & Detailing',
        impactLevel: 'HIGH',
        whyItMatters: 'Older London walls and ceilings are rarely square or plumb. Floor-to-ceiling wardrobes require scribed infill fillets to fit seamlessly.',
        whatShouldBeChecked: 'Perform digital laser 3D level checks at top, middle, and bottom of wardrobe alcoves.',
        effectOnProject: 'Allows joiners to pre-calculate scribe margins for a factory-fitted finish.',
      },
      {
        id: 'cons-joinery-sockets',
        issue: 'Concealed Socket Relocation & Internal Lighting Feeds',
        category: 'Electrical Integration',
        impactLevel: 'MEDIUM',
        whyItMatters: 'Existing wall power sockets often become trapped behind new back panels unless relocated or brought forward into wardrobe carcasses.',
        whatShouldBeChecked: 'Determine whether sockets should be surface-mounted inside wardrobes or integrated with USB-C charging points.',
        effectOnProject: 'Requires first-fix electrical prep before joinery installation.',
      },
      {
        id: 'cons-joinery-damp',
        issue: 'External Wall Moisture & Ventilation Cavity',
        category: 'Thermal & Moisture',
        impactLevel: 'MEDIUM',
        whyItMatters: 'Fitting solid MDF back panels hard against uninsulated solid brick external walls can trap condensation and cause hidden mold.',
        whatShouldBeChecked: 'Maintain a 15–20mm ventilated shadow gap or use foil-backed insulation against external walls.',
        effectOnProject: 'Preserves clothing and cabinetry against damp.',
      },
      {
        id: 'cons-joinery-access',
        issue: 'Staircase Clearance for Oversized Cabinet Panels',
        category: 'Site Logistics',
        impactLevel: 'LOW',
        whyItMatters: 'Full 2.7m carcass end panels cannot always navigate tight Victorian staircase turns in one piece.',
        whatShouldBeChecked: 'Check stairwell turning radius or build carcasses in modular sections for on-site assembly.',
        effectOnProject: 'Avoids delivery damage and site bottlenecks.',
      }
    );
    return pool;
  }

  // =========================================================================
  // EXTENSION / KITCHEN / RENOVATION CONSIDERATIONS
  // =========================================================================
  if (isVictorian || isKitchen || isExtension) {
    pool.push({
      id: 'cons-joist-deflection',
      issue: 'Suspended Floor Joist Deflection & Heavy Island Load',
      category: 'Structural Subfloor',
      impactLevel: 'HIGH',
      whyItMatters: 'Older suspended floor joists were designed for lightweight living. Heavy quartz worktops, kitchen islands, and tile finishes require joist sistering to prevent floor bounce and grout cracking.',
      whatShouldBeChecked: 'Laser survey joist levelness and probe joist ends for damp during initial strip-out.',
      effectOnProject: 'Requires timber sistering during first-fix to permanently prevent floor deflection.',
    });
  }

  if (isTerrace || isExtension || isLoft || hasStructuralKnockthrough) {
    pool.push({
      id: 'cons-party-wall',
      issue: 'Party Wall etc. Act 1996 Statutory Notices',
      category: 'Legal & Neighbour',
      impactLevel: 'HIGH',
      whyItMatters: 'Excavating within 3 metres of an adjoining foundation or inserting steel beams into a shared party wall legally requires written notice under UK law.',
      whatShouldBeChecked: 'Serve formal Section 1, 2, and 6 notices early during architectural drawing preparation.',
      effectOnProject: 'Dissenting neighbours can appoint surveyors, introducing 6–8 weeks in award preparation time.',
    });
  }

  if (isExtension || lower.includes('drain') || lower.includes('manhole')) {
    pool.push({
      id: 'cons-thames-water',
      issue: 'Thames Water Shared Drain Build-Over Agreement',
      category: 'Drainage & Sewers',
      impactLevel: 'HIGH',
      whyItMatters: 'Under the 2011 Private Sewers Transfer Regulations, any drain serving more than one property is owned by Thames Water. Building within 3m requires formal approval.',
      whatShouldBeChecked: 'Run a CCTV drainage survey from the nearest manhole chamber before digging foundations.',
      effectOnProject: 'Requires a self-certification or full Thames Water Build-Over Agreement and double-sealed internal inspection covers.',
    });
  }

  if (isKitchen || isExtension || lower.includes('induction') || lower.includes('electric')) {
    pool.push({
      id: 'cons-electrical-load',
      issue: 'Consumer Unit Capacity & High-Load Induction Circuits',
      category: 'Electrical Infrastructure',
      impactLevel: 'MEDIUM',
      whyItMatters: 'Modern 7.4kW induction hobs, electric underfloor heating, and boiling taps can exceed the capacity of older fuse boards lacking RCD protection.',
      whatShouldBeChecked: 'Verify incoming electrical supply fuse (60A vs 100A) and spare ways on consumer unit.',
      effectOnProject: 'May require a consumer unit upgrade with NICEIC Part P certification.',
    });
  }

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

  if (isBathroom) {
    pool.push({
      id: 'cons-ventilation',
      issue: 'Building Regs Part F Mechanical Extract Ventilation',
      category: 'Ventilation & Moisture',
      impactLevel: 'HIGH',
      whyItMatters: 'High-pressure rainfall showers generate significant steam. Weak extractor fans cause mirror misting, mold on ceiling paint, and peeling silicone sealant.',
      whatShouldBeChecked: 'Install an inline continuous or humidistat extractor fan ducted directly through external walls with an overrun timer.',
      effectOnProject: 'Eliminates mold and satisfies Building Regulations Part F airflow rates.',
    });
  }

  if (isTerrace) {
    pool.push({
      id: 'cons-terrace-access',
      issue: 'Narrow Terraced Access & London CPZ Parking Suspensions',
      category: 'Site Access',
      impactLevel: 'MEDIUM',
      whyItMatters: 'Terraces without side alleys require barrowing excavated spoil and materials through the house, plus council skip and parking bay suspensions.',
      whatShouldBeChecked: 'Apply for controlled parking zone (CPZ) bay suspensions with the local council 2 weeks prior to site start.',
      effectOnProject: 'Prevents delivery delays and ensures compliant street parking permits.',
    });
  }

  pool.push({
    id: 'cons-dust-protection',
    issue: 'Living in Property & Dust Barrier Isolation',
    category: 'Logistics & Welfare',
    impactLevel: 'LOW',
    whyItMatters: 'Erecting floor-to-ceiling plastic zipper dust screens and heavy-duty floor corex protection keeps the remainder of the home clean during structural knockthroughs.',
    whatShouldBeChecked: 'Agree on dust-protection boundaries and dedicated access corridors with the site manager.',
    effectOnProject: 'Minimises domestic disruption during active building phases.',
  });

  // Ensure balanced count: exactly 4, 6, or 8 items
  let targetCount = 6;
  if (pool.length <= 4) targetCount = 4;
  else if (pool.length >= 8) targetCount = 8;
  else targetCount = 6;

  return pool.slice(0, targetCount);
}
