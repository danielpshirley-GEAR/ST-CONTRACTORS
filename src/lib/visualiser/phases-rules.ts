/**
 * Dynamic Construction Phases Engine
 * Selects and tailors project-specific phases from the master 25-phase library.
 * Complies with BUILD_SPEC.md & Master Visualiser Rebuild Specification.
 */

import { ConstructionPhase, ProjectCategoryType } from '@/types/visualiser-scope';

export function generateConstructionPhases(
  projectTypes: ProjectCategoryType[],
  hasStructuralKnockthrough: boolean
): ConstructionPhase[] {
  const isExtension = projectTypes.includes('extension');
  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isLoft = projectTypes.includes('loft-conversion');
  const isGardenRoom = projectTypes.includes('garden-room');
  const isDriveway = projectTypes.includes('driveway');
  const isLandscaping = projectTypes.includes('landscaping');

  const phases: ConstructionPhase[] = [];

  // =========================================================================
  // EXTENSION / STRUCTURAL KNOCKTHROUGH FLOW
  // =========================================================================
  if (isExtension || (isKitchen && hasStructuralKnockthrough)) {
    phases.push(
      {
        phaseNumber: 1,
        title: 'Phase 1: Survey, Structural Calculations & Party Wall Notices',
        shortDescription: 'Measured site survey, structural engineer steel calculations, and statutory notices.',
        whatHappens: 'Our structural engineer models load paths and specifies RSJ beam sizes, while party wall notices are served to adjoining neighbours.',
        workInvolved: ['Laser measured dimensional survey', 'Structural steel calculations & connection details', 'Party Wall Act 1996 notice serving', 'Thames Water build-over application (if applicable)'],
        tradesInvolved: ['Structural Engineer', 'Architectural Surveyor', 'Party Wall Surveyor'],
        decisionsRequired: ['Approve final structural opening dimensions', 'Select preferred glazing layout (bifolds vs sliding doors)'],
        dependencies: ['Neighbour party wall consents or awards in place'],
        potentialRisks: ['Neighbour dissent triggering formal surveyor dispute (allow 6–8 weeks)'],
        informationStillRequired: ['Exact invert levels of existing underground drains'],
        indicativeDuration: '3 – 6 Weeks (Pre-construction)',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Site Protection, Strip-Out & Substructure Excavation',
        shortDescription: 'Dust screening, floor protection, demolition, and foundation trench excavation.',
        whatHappens: 'Dust-sealed air barriers protect retained living areas. The existing outrigger is stripped and foundation trenches excavated down to solid ground.',
        workInvolved: ['Erection of airtight dust screens & floor cladding', 'Demolition of external walls and removal of old units', 'Excavation of 1.2m–1.8m foundation trenches', 'Muck-away spoil removal via grab lorries'],
        tradesInvolved: ['Groundworks Team', 'Demolition Specialists', 'Site Labourers'],
        decisionsRequired: ['Confirm access routes for spoil barrowing through the property'],
        dependencies: ['Gas and water supplies isolated in demolition zones'],
        potentialRisks: ['Uncovering uncharted drainage pipes or unrecorded tree roots'],
        informationStillRequired: ['Soil consistency inspection by Building Control officer'],
        indicativeDuration: '1 – 2 Weeks',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Foundations, Concrete Pour & Structural Steel (RSJs)',
        shortDescription: 'C25/30 ready-mix concrete pour, padstones, and steel goalpost erection.',
        whatHappens: 'Foundations are poured and signed off by Building Control. Heavy universal column and beam steel frames are craned into place on high-density concrete padstones.',
        workInvolved: ['C25/30 concrete foundation pour', 'Casting concrete padstones into load-bearing brickwork', 'Erection of structural steel goalpost frame', 'Acro propping and load transfer verification'],
        tradesInvolved: ['Steel Fabricators', 'Groundworkers', 'Structural Project Manager'],
        decisionsRequired: ['Sign-off on structural steel installation inspection'],
        dependencies: ['Building Control foundation inspection sign-off before concrete pour'],
        potentialRisks: ['Adverse weather delaying ready-mix concrete curing'],
        informationStillRequired: ['Padstone compression test certification'],
        indicativeDuration: '1 – 2 Weeks',
      },
      {
        phaseNumber: 4,
        title: 'Phase 4: Building Envelope, EPDM Roof & Architectural Glazing',
        shortDescription: 'Cavity brickwork, PIR thermal insulation, flat roof membrane, and sliding glass.',
        whatHappens: 'Cavity walls and timber flat roof joists are constructed, single-ply EPDM membrane is heat-bonded, and slimline aluminium sliding doors and frameless rooflights are fitted.',
        workInvolved: ['Cavity blockwork and brick matching', '120mm Celotex/Kingspan PIR insulation', 'Single-ply EPDM / GRP rubber roof membrane', 'Installation of aluminium bifold/sliding doors & glass rooflights'],
        tradesInvolved: ['Bricklayers', 'Carpenters', 'Roofing Specialists', 'Glazing Installers'],
        decisionsRequired: ['Confirm internal/external threshold drop level before glass install'],
        dependencies: ['Structural steel securely bolted and torqued'],
        potentialRisks: ['Glazing supplier lead times (order 4–6 weeks ahead)'],
        informationStillRequired: ['U-value compliance documentation for Building Control Part L'],
        indicativeDuration: '2 – 3 Weeks',
      },
      {
        phaseNumber: 5,
        title: 'Phase 5: First-Fix MEP, Underfloor Heating & Screeding',
        shortDescription: 'Electrical wiring conduits, plumbing feeds, manifold UFH, and subfloor screed.',
        whatHappens: 'Electricians and plumbers run cables and pipes for the kitchen island, induction hob, and appliances. Wet underfloor heating pipes are laid and covered in self-leveling liquid screed.',
        workInvolved: ['32A/40A induction circuit wiring', 'Kitchen island water, waste, and downdraft conduits', 'Manifold-controlled wet underfloor heating installation', 'Pumped liquid floor screed application (7-day cure)'],
        tradesInvolved: ['Electricians (NICEIC)', 'Plumbers (Gas Safe)', 'Underfloor Heating Engineers'],
        decisionsRequired: ['Finalise exact socket and island pendant lighting drop locations'],
        dependencies: ['Building envelope must be 100% weather-tight'],
        potentialRisks: ['Premature foot traffic on curing screed'],
        informationStillRequired: ['Kitchen appliance technical spec sheets for electrical loads'],
        indicativeDuration: '2 Weeks',
      },
      {
        phaseNumber: 6,
        title: 'Phase 6: Plastering, Kitchen Cabinetry & Stone Worktops',
        shortDescription: 'Multi-coat plaster skimming, carcass installation, and laser stone templating.',
        whatHappens: 'Walls are drylined and skimmed with Thistle Multi-Finish. Kitchen carcasses are leveled and laser-templated for quartz or Dekton worktops.',
        workInvolved: ['Acoustic drylining and plaster skimming', 'Fitting kitchen base and wall carcasses', 'Digital laser templating for quartz worktops', '5-day stone workshop fabrication and installation'],
        tradesInvolved: ['Plasterers', 'Kitchen Fitters', 'Stone Fabricators'],
        decisionsRequired: ['Approve stone worktop overhangs, drainage grooves, and tap hole positions'],
        dependencies: ['Plaster and screed must be fully dry before timber fitting'],
        potentialRisks: ['Plaster cracking if artificial heating is introduced too rapidly'],
        informationStillRequired: ['Exact sink and tap models on site for undermount cutouts'],
        indicativeDuration: '2 – 3 Weeks',
      },
      {
        phaseNumber: 7,
        title: 'Phase 7: Second-Fix Trades, Flooring, Testing & Handover',
        shortDescription: 'Appliance commissioning, flooring, painting, snagging, and Building Control sign-off.',
        whatHappens: 'Flooring is installed, appliances are commissioned, LED architectural lighting is connected, full decoration applied, and the project handed over with warranties.',
        workInvolved: ['Engineered timber / porcelain floor installation', 'Appliance connections, Quooker tap, and extractor commissioning', 'Mist coating and 2 coats of designer emulsion paint', 'Part P and Building Control Completion Certificate sign-off'],
        tradesInvolved: ['Electricians', 'Plumbers', 'Flooring Specialists', 'Decorators', 'Building Control Inspector'],
        decisionsRequired: ['Conduct joint snagging walk-through with Project Director'],
        dependencies: ['Worktops bonded and cured before second-fix plumbing'],
        potentialRisks: ['Snagging adjustments delaying move-in'],
        informationStillRequired: ['Building Control final sign-off inspection'],
        indicativeDuration: '1 – 2 Weeks',
      }
    );
    return phases;
  }

  // =========================================================================
  // BATHROOM RENOVATION FLOW
  // =========================================================================
  if (isBathroom) {
    phases.push(
      {
        phaseNumber: 1,
        title: 'Phase 1: Strip-Out & Subfloor Joist Inspection',
        shortDescription: 'Removing old sanitaryware and checking underlying timber for damp.',
        whatHappens: 'Old tiles and suites are removed. Underlying floor joists are checked for moisture, levelness, and load capacity.',
        workInvolved: ['Safe isolation of water and electrical circuits', 'Removal of old sanitaryware, tiles, and plasterboard', 'Moisture probing and laser leveling of subfloor joists'],
        tradesInvolved: ['Plumber', 'Demolition Specialist'],
        decisionsRequired: ['Confirm if floor level needs sistering or reinforcement'],
        dependencies: ['Mains water isolation valve working properly'],
        potentialRisks: ['Historic timber rot around old shower wastes'],
        informationStillRequired: ['Condition of waste pipe drops to external soil stack'],
        indicativeDuration: '2 – 3 Days',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: First-Fix Plumbing, Concealed Framing & Electrics',
        shortDescription: 'Running hot/cold feeds, Geberit concealed frames, and niche lighting.',
        whatHappens: 'Thermostatic shower valves, wall-hung toilet frames, waste pipes, and LED shampoo niche conduits are built into the walls.',
        workInvolved: ['Concealed thermostatic shower valve body installation', 'Geberit steel wall-hung toilet frame installation', 'LED niche lighting and extractor fan ducting runs', '18mm marine plywood / cement board subfloor overboarding'],
        tradesInvolved: ['Plumber', 'Electrician (Part P)', 'Carpenter'],
        decisionsRequired: ['Confirm exact showerhead and niche height positions on wall'],
        dependencies: ['Subfloor securely fixed and free of flex'],
        potentialRisks: ['Inadequate water pressure requiring booster pump upgrade'],
        informationStillRequired: ['Water pressure reading (bar) across hot/cold supplies'],
        indicativeDuration: '3 – 5 Days',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: 100% Waterproof Tanking Membrane Application',
        shortDescription: 'Schlüter/Mapei multi-layer membrane applied across all wet zones.',
        whatHappens: 'Impermeable waterproof sheeting and corner sealing bands are applied across all shower walls and floor to prevent structural leaks.',
        workInvolved: ['Schlüter-KERDI waterproof membrane application', 'Sealing corner joint bands and pipe collar gaskets', 'Pressure testing first-fix pipework under mains load'],
        tradesInvolved: ['Tiling Specialist', 'Waterproofing Installer'],
        decisionsRequired: ['Approve waterproof membrane sign-off'],
        dependencies: ['All first-fix pipework tested for 24h under pressure'],
        potentialRisks: ['Puncturing membrane during subsequent tile cuts'],
        informationStillRequired: ['Manufacturer warranty sign-off documentation'],
        indicativeDuration: '2 Days',
      },
      {
        phaseNumber: 4,
        title: 'Phase 4: Laser-Aligned Tiling & Anti-Fungal Grouting',
        shortDescription: 'Precision large-format porcelain tile cutting, mitring, and epoxy grout.',
        whatHappens: 'Large-format porcelain tiles are laser-aligned with mitred 45° edges and anti-mold epoxy grout.',
        workInvolved: ['Precision diamond wet-saw tile cutting', '45-degree mitred external corners and niche edging', 'Epoxy / anti-fungal flexible grouting'],
        tradesInvolved: ['Master Tiler'],
        decisionsRequired: ['Confirm grout colour match against porcelain tiles'],
        dependencies: ['Tanking adhesive fully cured'],
        potentialRisks: ['Tile offcut shortages (ensure +12% order buffer)'],
        informationStillRequired: ['Tile batch numbers verified for uniform dye lot'],
        indicativeDuration: '4 – 7 Days',
      },
      {
        phaseNumber: 5,
        title: 'Phase 5: Second-Fix Sanitaryware, Brassware & Handover',
        shortDescription: 'Mounting toilet, vanity unit, shower glass screen, and certification.',
        whatHappens: 'Floating vanity unit, wall-hung toilet, thermostatic trim plates, and frameless glass are fitted, sealed, and signed off.',
        workInvolved: ['Fitting wall-hung toilet and flush plate', 'Mounting vanity basin and brassware taps', 'Installing frameless 10mm glass shower screen', 'Colour-matched anti-mould silicone sealing', 'Part P electrical certification sign-off'],
        tradesInvolved: ['Plumber', 'Electrician', 'Siliconing Specialist'],
        decisionsRequired: ['Final snagging inspection'],
        dependencies: ['Grout cured for minimum 48 hours'],
        potentialRisks: ['Silicone smudging before 24h curing period'],
        informationStillRequired: ['Electrical Part P test certificate'],
        indicativeDuration: '2 – 3 Days',
      }
    );
    return phases;
  }

  // =========================================================================
  // STANDARD REFURBISHMENT / DEFAULT
  // =========================================================================
  phases.push(
    {
      phaseNumber: 1,
      title: 'Phase 1: Project Setup & Protective Dust Screening',
      shortDescription: 'Site protection, surface prep, and isolation of affected services.',
      whatHappens: 'Floors, doors, and pathways are protected with heavy-duty corex and dust-sealed barriers.',
      workInvolved: ['Dust partition setup', 'Floor protection laying', 'Service isolation'],
      tradesInvolved: ['Site Manager', 'Labourer'],
      decisionsRequired: ['Confirm daily working hours and access logistics'],
      dependencies: ['Access to electrical and water mains'],
      potentialRisks: ['Dust ingress to non-work zones'],
      informationStillRequired: ['Keyholder and parking arrangements'],
      indicativeDuration: '1 – 2 Days',
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: First-Fix Trades & Surface Preparation',
      shortDescription: 'Channelling electrics, pipe adjustments, and plasterboard repair.',
      whatHappens: 'Cables and plumbing are chased into walls and surfaces prepared for new finishes.',
      workInvolved: ['Electrical chasing', 'Plumbing first-fix', 'Subfloor leveling screed'],
      tradesInvolved: ['Electrician', 'Plumber', 'Plasterer'],
      decisionsRequired: ['Approve socket and switch heights'],
      dependencies: ['Demolition completed'],
      potentialRisks: ['Cracking in old lath-and-plaster walls'],
      informationStillRequired: ['Exact fixture locations'],
      indicativeDuration: '1 – 2 Weeks',
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Second-Fix Installation, Finishes & Handover',
      shortDescription: 'Fitting fixtures, flooring, painting, and completion certification.',
      whatHappens: 'All fittings, flooring, and decorative paints are applied, tested, and handed over.',
      workInvolved: ['Flooring laying', 'Socket faceplates and lighting fixtures', '2 coats emulsion paint', 'Snagging review and handover'],
      tradesInvolved: ['Carpenter', 'Electrician', 'Decorator'],
      decisionsRequired: ['Final sign-off and warranty certificate receipt'],
      dependencies: ['First-fix trades certified'],
      potentialRisks: ['Minor paint touch-ups required'],
      informationStillRequired: ['Client sign-off confirmation'],
      indicativeDuration: '1 – 2 Weeks',
    }
  );

  return phases;
}
