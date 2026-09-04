/**
 * Dynamic Construction Phases Engine
 * Selects and tailors project-specific phases from the master library.
 * Complies with BUILD_SPEC.md and Phase 7B Specification.
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
  const isDriveway = projectTypes.includes('driveway');
  const isJoinery = projectTypes.includes('joinery');
  const isBedroomOrDecorating = projectTypes.includes('bedroom') || projectTypes.includes('decorating');

  const phases: ConstructionPhase[] = [];

  // =========================================================================
  // DRIVEWAY PHASES
  // =========================================================================
  if (isDriveway) {
    phases.push(
      {
        phaseNumber: 1,
        title: 'Phase 1: Excavation, CAT Scanning & Subgrade Preparation',
        shortDescription: 'Cable avoidance scanning, 250mm excavation, and subsoil compaction.',
        whatHappens: 'Ground is scanned with Cable Avoidance Tools to trace incoming gas/electric supplies, excavated to 250mm depth, and subgrade compacted.',
        workInvolved: ['Utility line CAT scanning', 'Excavation of old concrete/soil to 250mm depth', 'Grab lorry muck-away disposal', 'Geotextile weed barrier membrane installation'],
        tradesInvolved: ['Groundworks Team', 'Excavator Operator'],
        decisionsRequired: ['Confirm exact driveway perimeter boundary and levels'],
        dependencies: ['Council skip permits or on-site grab lorry access confirmed'],
        potentialRisks: ['Uncharted shallow utility pipes requiring hand digging'],
        informationStillRequired: ['Exact invert level of council stormwater connection (if applicable)'],
        indicativeDuration: '2 – 3 Days',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: MOT Type 3 Sub-Base & ACO Channel Drainage (SuDS)',
        shortDescription: 'Compacted permeable stone sub-base and surface water drainage installation.',
        whatHappens: 'Crushed open-graded MOT Type 3 stone is compacted in 50mm layers to create a high-strength permeable foundation with ACO drainage channels.',
        workInvolved: ['Spreading and vibrating MOT Type 3 aggregate', 'Setting concrete haunched edge restraints', 'Installing permeable ACO drainage channels and silt traps'],
        tradesInvolved: ['Groundworkers', 'Drainage Installers'],
        decisionsRequired: ['Approve threshold fall levels against front entrance doorway'],
        dependencies: ['Subgrade fully compacted'],
        potentialRisks: ['Rain saturation of subsoil before stone compaction'],
        informationStillRequired: ['Permeability test confirmation'],
        indicativeDuration: '2 – 4 Days',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Surface Laying (Block Paving / Resin Bound) & Handover',
        shortDescription: 'Laying surface finish, sharp sand screed, kiln-dried sand compaction, and sealing.',
        whatHappens: 'Laying the chosen permeable blocks or UV-stable resin-bound aggregate matrix, followed by compacting and joint finishing.',
        workInvolved: ['Screeding bedding layer', 'Precision block laying with diamond cutting around borders', 'Vibrating plate compaction with protective rubber pad', 'Sweeping kiln-dried silica sand / applying resin seal'],
        tradesInvolved: ['Paving Craftsman', 'Resin Surface Specialist'],
        decisionsRequired: ['Final visual inspection of block laying bond and color distribution'],
        dependencies: ['Sub-base cured and stable'],
        potentialRisks: ['Vehicle parking before 48h curing period'],
        informationStillRequired: ['Driveway maintenance guide handover'],
        indicativeDuration: '3 – 5 Days',
      }
    );
    return phases;
  }

  // =========================================================================
  // BESPOKE JOINERY / WARDROBE PHASES
  // =========================================================================
  if (isJoinery) {
    phases.push(
      {
        phaseNumber: 1,
        title: 'Phase 1: Laser Site Survey, CAD Drafting & Workshop Fabrication',
        shortDescription: '3D laser survey, detailed CAD workshop drawings, and timber fabrication.',
        whatHappens: 'Precision laser measurements map out wall deviations. Carcasses, doors, and internal drawers are built off-site in our joinery workshop.',
        workInvolved: ['Digital laser 3D level survey', 'Detailed joinery CAD cutting schedules', 'Workshop machining, dovetail drawer assembly, and factory spray finishing'],
        tradesInvolved: ['Joinery Draughtsman', 'Master Cabinet Maker', 'Spray Finisher'],
        decisionsRequired: ['Sign off CAD elevation drawings, handle choices, and internal layout'],
        dependencies: ['Room finishes ready for survey'],
        potentialRisks: ['Design revisions delaying workshop machining'],
        informationStillRequired: ['Specific hanging length requirements (coats vs dresses)'],
        indicativeDuration: '2 – 3 Weeks (Off-Site)',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Electrical First-Fix & On-Site Carcass Installation',
        shortDescription: 'Running internal LED wiring feeds, scribing carcasses, and securing modules.',
        whatHappens: 'Pre-assembled joinery units are delivered, laser-leveled, and scribed to match out-of-plumb walls and ceilings.',
        workInvolved: ['First-fix LED wiring feeds and socket relocation', 'Scribing base plinths and side infills to irregular walls', 'Bolting modular carcasses and hanging doors with soft-close hinges'],
        tradesInvolved: ['Carpenter / Joiner', 'Electrician (Part P)'],
        decisionsRequired: ['Approve scribe lines and shadow gaps against period cornices'],
        dependencies: ['Clear room access and floor protection laid'],
        potentialRisks: ['Tight stairwell turns navigating large carcass panels'],
        informationStillRequired: ['Approve soft-close tension adjustments'],
        indicativeDuration: '2 – 4 Days',
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Ironmongery, Internal Lighting Commissioning & Handover',
        shortDescription: 'Fitting door handles, velvet drawer inserts, LED sensor testing, and final polish.',
        whatHappens: 'Handles and internal accessories are fitted, door sensor LED channels tested, and joinery hand-polished.',
        workInvolved: ['Installing handles and locksets', 'Fitting velvet inserts and pull-out shoe racks', 'Testing automated door sensor LED strips', 'Touch-up paint and final cleaning'],
        tradesInvolved: ['Joiner', 'Electrician'],
        decisionsRequired: ['Final snagging sign-off'],
        dependencies: ['All carcasses and doors fitted'],
        potentialRisks: ['Minor touch-ups'],
        informationStillRequired: ['Client sign-off confirmation'],
        indicativeDuration: '1 – 2 Days',
      }
    );
    return phases;
  }

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
        dependencies: ['Floor screed moisture level below 2.5% CM'],
        potentialRisks: ['Worktop fabrication lead times (5–7 days from templating)'],
        informationStillRequired: ['Sink and tap undermount technical drawings'],
        indicativeDuration: '2 – 3 Weeks',
      },
      {
        phaseNumber: 7,
        title: 'Phase 7: Second-Fix, Flooring, Decorating & Building Control Sign-Off',
        shortDescription: 'Herringbone flooring, designer emulsion, appliance commissioning, and completion certificate.',
        whatHappens: 'Herringbone oak or microcement is installed. Walls receive mist coat and 2 full coats of designer paint. Appliances are commissioned, and Building Control issues the Final Completion Certificate.',
        workInvolved: ['Herringbone flooring installation & perimeter skirting', 'Misting and 2 coats of washable emulsion paint', 'Connecting induction hob, Quooker tap, and second-fix sockets', 'Final Building Control inspection & NICEIC Part P certification'],
        tradesInvolved: ['Flooring Specialist', 'Painters & Decorators', 'Electricians', 'Building Control Officer'],
        decisionsRequired: ['Complete snagging walk-through with site manager'],
        dependencies: ['Plaster thoroughly dry before painting'],
        potentialRisks: ['Minor paint scuffs during appliance deliveries (repaired at snagging)'],
        informationStillRequired: ['Building Regulations Final Completion Certificate'],
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
        title: 'Phase 1: Strip-Out, Waste Capping & Subfloor Inspection',
        shortDescription: 'Removal of old sanitaryware, tiles, and probing subfloor joists.',
        whatHappens: 'Old sanitaryware, shower trays, and wall tiles are stripped back to bare brick and timber joists.',
        workInvolved: ['Isolating hot and cold water supplies', 'Stripping tiles, plasterboard, and old sanitaryware', 'Checking subfloor joists for historic pipe leaks and rot', 'Floor and doorway protective screening'],
        tradesInvolved: ['Demolition Labourers', 'Plumber'],
        decisionsRequired: ['Approve subfloor timber repairs if damp is detected'],
        dependencies: ['Mains water isolation valve operational'],
        potentialRisks: ['Concealed pipe leaks in old lead/copper pipes'],
        informationStillRequired: ['Drainage drop position below floorboards'],
        indicativeDuration: '2 – 3 Days',
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: First-Fix Plumbing, Concealed Frames & Electrical (Part P)',
        shortDescription: 'In-wall concealed cistern frame, thermostatic shower valve feeds, and LED zones.',
        whatHappens: 'Rigid steel frames for wall-hung toilets are anchored into structural walls, concealed shower valve bodies installed, and Part P electrical wiring pulled.',
        workInvolved: ['Installing Geberit in-wall steel toilet frame', 'Channelling hot/cold supply pipes for concealed shower valves', 'Wiring low-voltage LED niche lighting and extractor fan with overrun', 'Fitting marine-ply subfloor base for zero deflection'],
        tradesInvolved: ['Plumber', 'Electrician'],
        decisionsRequired: ['Confirm exact shower head and basin tap centreline heights'],
        dependencies: ['Subfloor joists reinforced'],
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
  // STANDARD INTERIOR REFURBISHMENT / DECORATING
  // =========================================================================
  phases.push(
    {
      phaseNumber: 1,
      title: 'Phase 1: Project Setup & Protective Screening',
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
      title: 'Phase 2: Surface Preparation & First-Fix Adjustments',
      shortDescription: 'Plaster repairs, electrical socket moves, and woodwork sanding.',
      whatHappens: 'Wall imperfections are filled and skimmed, woodwork sanded, and electrical points relocated if required.',
      workInvolved: ['Plaster repairs & acoustic lining', 'Electrical socket adjustments', 'Undercoat primer application'],
      tradesInvolved: ['Decorator', 'Electrician', 'Plasterer'],
      decisionsRequired: ['Approve colour swatches under room natural light'],
      dependencies: ['Furniture cleared and protected'],
      potentialRisks: ['Historic paint flaking on older walls'],
      informationStillRequired: ['Confirmed paint brand and sheen level'],
      indicativeDuration: '3 – 5 Days',
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: Decorative Finishing, Flooring & Handover',
      shortDescription: 'Emulsion application, woodwork satin finish, flooring, and sign-off.',
      whatHappens: 'Applying 2 full coats of designer emulsion, satin finish on woodwork, laying floor finishes, and final cleanup.',
      workInvolved: ['2 coats washable emulsion paint', 'Woodwork satinwood painting', 'Flooring / carpet installation', 'Snagging review and sign-off'],
      tradesInvolved: ['Decorator', 'Flooring Specialist'],
      decisionsRequired: ['Final sign-off on decorating finish'],
      dependencies: ['Primer and filler fully dried'],
      potentialRisks: ['Minor touch-ups'],
      informationStillRequired: ['Client sign-off confirmation'],
      indicativeDuration: '3 – 5 Days',
    }
  );

  return phases;
}
