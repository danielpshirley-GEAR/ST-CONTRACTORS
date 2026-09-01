/**
 * AI Construction Assistant Analysis Engine
 * Extracts:
 * 1. Project type
 * 2. General Description of work required
 * 3. Cost Estimate & Price Range (London 2026 rates)
 * 4. Custom Specification Options (Essential / Architectural Premium / Luxury Master)
 * 5. Things to Consider (Structural, Planning, Party Wall, Utilities, Living Logistics)
 * 6. Phase-by-Phase Trade Breakdown
 * 7. Rooms, Works, and Missing Questions
 *
 * Conforms to GEMINI.md Section 13 (AI Rules) & Section 14 (AI Cost Control)
 */

import {
  ExtractedProject,
  ExtractedRoom,
  ExtractedWorkItem,
  MissingQuestion,
  PotentialConsideration,
  CustomSpecificationOption,
  ThingToConsider,
  TradePhaseBreakdown,
} from './types';
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

  const mentionsHallway = lower.includes('hallway') || lower.includes('hall') || lower.includes('corridor');
  const mentionsCrittall = lower.includes('crittall') || lower.includes('steel door') || lower.includes('black frame');
  const mentionsBifolds = lower.includes('bifold') || lower.includes('bi-fold') || lower.includes('sliding');
  const mentionsUnderfloor = lower.includes('underfloor') || lower.includes('ufh') || lower.includes('heated floor');
  const mentionsIsland = lower.includes('island') || lower.includes('breakfast bar');
  const mentionsUtility = lower.includes('utility') || lower.includes('boot room') || lower.includes('laundry') || lower.includes('cloakroom') || lower.includes('wc');

  // Dimensions
  let extractedLength = 5;
  let extractedWidth = 4;
  const meterMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|metre|meter|metres|meters)/i);
  if (meterMatch) {
    extractedLength = parseFloat(meterMatch[1]);
  }

  // ---------------------------------------------------------------------------
  // 2. SCENARIO A: GARAGE CONVERSION
  // ---------------------------------------------------------------------------
  if (isGarage) {
    const purposeTitle = isCinema ? 'Cinema & Media Suite' : isGym ? 'Home Gym Studio' : isOffice ? 'Executive Home Office' : isBedroom ? 'Guest Bedroom Suite' : 'Habitable Living Room';
    const lowCost = isCinema ? 28000 : 22000;
    const highCost = isCinema ? 48000 : 38000;

    return {
      projectType: 'other',
      projectTypeDisplay: `Garage Conversion to ${purposeTitle}`,
      originalDescription: text,
      generalDescription: `Conversion of an existing cold single/double garage into a fully insulated, Building Regulations Part L compliant ${purposeTitle.toLowerCase()}.${isDoorwayFormation ? ' Includes cutting a structural opening into the hallway with a load-bearing lintel and FD30 fire door.' : ''} The vehicle door is bricked up with matching cavity masonry and high-performance double glazing, and a raised insulated floating floor is constructed over the existing concrete slab.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: '£1,450 – £2,400 / m²',
        notes: 'Includes vehicle door infill, floor/wall insulation, electrics, heating, plastering, and Building Control sign-off.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Standard Habitable Spec',
          priceImpact: 'Baseline (£22k–£28k)',
          description: '100mm PIR insulation, white uPVC window, radiator extension, and plastered painted finish.',
          highlights: ['Cavity wall infill with standard brick', '100mm floor insulation + chipboard', 'LED downlights & 6 double sockets', 'Standard radiator plumbed to boiler'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Acoustic & Designer Spec',
          priceImpact: '+£8,000 – £14,000',
          description: 'Acoustic decoupling for cinema/gym, aluminium slimline glazing, and electric underfloor heating.',
          highlights: ['SoundBloc dual-layer acoustic plasterboard', 'Slimline anthracite aluminium window', 'Engineered oak or heavy-duty gym rubber flooring', 'Smart zoned dimmable lighting circuits'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Full Integrated Suite with Ensuite / AV',
          priceImpact: '+£18,000 – £26,000',
          description: 'Adds compact ensuite shower room, built-in acoustic cabinetry, and MVHR ventilation.',
          highlights: ['Integrated ensuite with walk-in shower & macerator', 'Concealed 7.1.4 Dolby Atmos in-wall conduits', 'Mechanical ventilation with heat recovery (MVHR)', 'Custom architectural joinery'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Planning & Legal',
          title: 'Permitted Development vs Planning Permission',
          explanation: 'Garage conversions are usually Permitted Development unless your property is in a Conservation Area or your original planning permission had a condition retaining parking spaces.',
          impactLevel: 'medium',
        },
        {
          category: 'Structural & Engineering',
          title: 'Doorway Formation into Hallway',
          explanation: isDoorwayFormation ? 'Cutting through an existing masonry wall requires a pre-stressed concrete lintel with 150mm padstone end bearings and an FD30 fire door.' : 'Ensure adequate internal access is planned without compromising hallway circulation.',
          impactLevel: 'high',
        },
        {
          category: 'Drainage & Utilities',
          title: 'Floor Slab Damp Proofing & Floor Level Step',
          explanation: 'Existing garage slabs rarely have a DPM. A new liquid DPM and 100mm rigid PIR insulation is required to match house floor levels.',
          impactLevel: 'high',
        },
        {
          category: 'Living & Logistics',
          title: 'Alternative Storage & Meter Relocation',
          explanation: 'If gas or electric meters and consumer units are located in the garage, boxed joinery housing must be built with fire-rated inspection hatches.',
          impactLevel: 'low',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Strip-out & Vehicle Door Removal', estimatedWeeks: 'Week 1', estimatedCostRange: '£2,500 – £4,000', items: ['Remove garage door', 'Excavate toe footing for masonry infill', 'Form structural opening to hallway'] },
        { phase: 2, title: 'Masonry Infill & Subfloor Insulation', estimatedWeeks: 'Week 2', estimatedCostRange: '£5,000 – £8,500', items: ['Cavity wall brick/block infill', 'Damp proof membrane and 100mm PIR insulation', 'Install new double glazed window'] },
        { phase: 3, title: 'First Fix MEP & Acoustic Insulation', estimatedWeeks: 'Week 3–4', estimatedCostRange: '£6,000 – £11,000', items: ['Electrical ring main & AV cabling', 'Plumbing for radiator/underfloor heating', 'Acoustic mineral wool wall lining'] },
        { phase: 4, title: 'Plastering, Flooring & Second Fix Handover', estimatedWeeks: 'Week 5–6', estimatedCostRange: '£8,500 – £14,500', items: ['Full plaster skim', 'Flooring installation (oak/carpet/rubber)', 'Second fix lighting, fire door, and decorating'] },
      ],
      projectRequirements: [
        `Convert existing garage into insulated ${purposeTitle}`,
        'Brick infill vehicle opening with matching masonry',
        'Install insulated floating floor slab over existing concrete',
        ...(isDoorwayFormation ? ['Form structural opening into hallway with lintel and FD30 fire door'] : []),
      ],
      rooms: [
        { name: purposeTitle, sizeCategory: 'medium', dimensions: { length: 5.5, width: 2.8, areaM2: 15.4 }, purpose: `Habitable ${purposeTitle.toLowerCase()}` },
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Vehicle Opening Infill & Footing', description: 'Excavate pad footing and lay matching cavity brickwork.', tradeRequired: 'Bricklayer', structuralImplication: 'Tied to existing garage piers with helical ties.' },
        { category: 'Building Envelope', workTitle: 'Floor Slab Insulation & DPM', description: 'Install liquid DPM, 100mm PIR, and 22mm T&G flooring.', tradeRequired: 'Carpenter / Screeder' },
        { category: 'Plumbing & Electrics', workTitle: 'First Fix Electrics & Heating', description: 'Dedicated consumer unit circuit and heating extension.', tradeRequired: 'NICEIC Electrician / Gas Safe Plumber' },
        { category: 'Fit-Out & Joinery', workTitle: 'Plastering & FD30 Fire Door Installation', description: 'Skim all walls and fit self-closing fire door set.', tradeRequired: 'Plasterer & Joiner' },
      ],
      missingQuestions: [
        { id: 'meter_location', question: 'Are gas or electric meters located inside the garage?', reason: 'Determines boxing and ventilation requirements.' },
        { id: 'floor_level', question: 'Is the garage floor significantly lower than the house hallway?', reason: 'Dictates step-down threshold vs ramped insulated screed.' },
      ],
      potentialConsiderations: [
        { topic: 'Building Regulations Part B', consideration: 'Connecting doors between garage conversions and hallways require FD30 fire resistance.', riskLevel: 'medium' },
        { topic: 'Building Regulations Part L', consideration: 'U-values must achieve 0.18 W/m²K on walls and 0.13 W/m²K on floors.', riskLevel: 'medium' },
      ],
      initialAnswers: { project_type: 'other', goals: ['Garage conversion', 'Extra living space'] },
      summary: `Garage conversion to ${purposeTitle} with complete Building Control compliance.`,
      estimatedTimelineWeeks: { min: 4, max: 7 },
    };
  }

  // ---------------------------------------------------------------------------
  // 3. SCENARIO B: HOUSE EXTENSION / WRAPAROUND / KITCHEN KNOCKTHROUGH
  // ---------------------------------------------------------------------------
  if (isExtension || (isKitchen && isWallRemoval)) {
    const isWrap = lower.includes('wraparound') || lower.includes('wrap around');
    const isSide = lower.includes('side return');
    const typeTitle = isWrap ? 'Wraparound Rear & Side Extension' : isSide ? 'Side Return Kitchen Extension' : 'Single Storey Rear Kitchen Extension';
    const areaM2 = Math.round(extractedLength * extractedWidth) || 30;

    const basePerM2 = 2500;
    const lowCost = Math.round(areaM2 * basePerM2 * 0.95 + (isWallRemoval ? 8000 : 0));
    const highCost = Math.round(areaM2 * basePerM2 * 1.35 + (isWallRemoval ? 16000 : 0) + (mentionsCrittall ? 12000 : 0));

    return {
      projectType: 'extension',
      projectTypeDisplay: `${typeTitle} (~${areaM2}m²) with Open-Plan Living`,
      originalDescription: text,
      generalDescription: `Construction of a bespoke ${typeTitle.toLowerCase()} creating an open-plan kitchen, dining, and family living space. Includes groundworks in London clay, reinforced concrete foundations, structural steelwork (RSJ goalpost frame) to remove internal load-bearing walls, aluminium sliding/bifold or Crittall doors, flat roof with roof lanterns, wet underfloor heating, and turnkey kitchen installation.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: `£2,400 – £3,400 / m²`,
        notes: `Turnkey indicative London estimate including structural steel RSJ, padstones, glazing, underfloor heating, and kitchen fitting.`,
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Contemporary Standard Spec',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Aluminium bifolds (standard 3-pane), flat roof with Velux rooflights, screeded underfloor heating, and high-quality porcelain tiling.',
          highlights: ['Aluminium 3-pane bifolds (standard RAL)', '2x Velux flat glass rooflights', 'Wet underfloor heating over 100mm PIR', 'Plaster skim and standard electrical pack'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Architectural Glazing & Flush Steel Spec',
          priceImpact: `+£18,000 – £32,000`,
          description: 'Slimline sliding glass panels (20mm sightlines), frameless structural roof lantern, flush recessed ceiling steel, and herringbone engineered oak.',
          highlights: ['20mm ultra-slim sliding patio doors', 'Frameless structural glass roof lantern (3m × 1.5m)', 'Fully concealed flush ceiling steel RSJ frame', 'Bespoke kitchen layout with 30mm Quartz island'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Industrial Crittall & High-End Architectural Spec',
          priceImpact: `+£40,000 – £65,000`,
          description: 'Bespoke black steel Crittall glazed screens, microcement seamless flooring, recessed linear LED coffers, and automated climate control.',
          highlights: ['Genuine or architectural steel Crittall glazed doors & screens', 'Seamless architectural microcement or polished concrete', 'Integrated utility room & downstairs guest cloakroom', 'Smart home lighting, automated blinds, and acoustic ceiling'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Structural & Engineering',
          title: 'Structural Steel Goalpost & Padstones',
          explanation: 'Removing the rear house wall and side outrigger requires a fabricated 3-steel goalpost frame bearing on reinforced concrete padstones to carry upper floors and roof loads safely.',
          impactLevel: 'high',
        },
        {
          category: 'Planning & Legal',
          title: 'Party Wall etc. Act 1996 Compliance',
          explanation: 'Party Wall notices must be served to adjoining neighbours at least 2 months prior to work if excavating within 3m or building on the boundary line.',
          impactLevel: 'high',
        },
        {
          category: 'Drainage & Utilities',
          title: 'Thames Water Sewer Build-Over Agreement',
          explanation: 'Shared public sewers running along rear gardens require formal Thames Water approval, CCTV drainage survey, and protective lintels over pipe runs.',
          impactLevel: 'high',
        },
        {
          category: 'Living & Logistics',
          title: 'Temporary Kitchen & Living Arrangements',
          explanation: 'During the 4-week period when structural knockthroughs and kitchen installations occur, setting up a temporary utility cooking station is highly recommended.',
          impactLevel: 'medium',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Demolition & Groundworks', estimatedWeeks: 'Weeks 1–3', estimatedCostRange: '£18,000 – £26,000', items: ['Demolish existing outriggers/conservatory', 'Trench excavation to 1.5m depth (London clay)', 'Concrete foundation pour and below-ground drainage'] },
        { phase: 2, title: 'Structural Steelwork & Shell Masonry', estimatedWeeks: 'Weeks 4–7', estimatedCostRange: '£28,000 – £42,000', items: ['Erect structural steel goalpost frame on padstones', 'Build external cavity walls with insulation', 'Construct flat roof structure with EPDM/GRP waterproofing'] },
        { phase: 3, title: 'Glazing & First Fix MEP', estimatedWeeks: 'Weeks 8–10', estimatedCostRange: '£22,000 – £35,000', items: ['Install slimline patio sliding doors & roof lantern', 'First fix electrical ring circuits and lighting', 'First fix plumbing and wet underfloor heating screed'] },
        { phase: 4, title: 'Plastering, Flooring & Second Fix Fit-out', estimatedWeeks: 'Weeks 11–14', estimatedCostRange: '£20,000 – £32,000', items: ['Full plaster skim and drylining', 'Lay floor finishes (porcelain / herringbone oak)', 'Second fix electrical switches, lighting, and plumbing'] },
        { phase: 5, title: 'Kitchen Fitting, Decorating & Handover', estimatedWeeks: 'Weeks 14–16', estimatedCostRange: '£15,000 – £30,000', items: ['Install cabinetry, quartz island, and appliances', 'Full interior painting and decorating', 'Building Control final inspection and completion certificate'] },
      ],
      projectRequirements: [
        `Construct ${typeTitle.toLowerCase()} (~${areaM2}m²)`,
        'Install structural steel frame to open up rear ground floor',
        'Install energy-efficient architectural glazing and rooflights',
        'Install wet underfloor heating and open-plan kitchen diner',
      ],
      rooms: [
        { name: 'Open-Plan Kitchen & Dining Room', sizeCategory: 'large', dimensions: { length: extractedLength, width: extractedWidth, areaM2 }, purpose: 'Family dining, entertaining, and culinary preparation' },
        ...(mentionsUtility ? [{ name: 'Utility / Laundry Room', sizeCategory: 'small' as const, dimensions: { length: 2.2, width: 1.8, areaM2: 4 }, purpose: 'Washing machine, dryer, and secondary sink' }] : []),
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Foundation Excavation & Concrete Pour', description: '1.5m deep trench foundations in London clay with C25/30 ready-mix concrete.', tradeRequired: 'Groundworks Crew', structuralImplication: 'Engineered strip foundations with rebar cage.' },
        { category: 'Structural & Groundworks', workTitle: 'Structural Steel Goalpost Installation', description: 'Universal columns (UC) and beams (UB) connected with high-tensile bolts on concrete padstones.', tradeRequired: 'Steel Fabricator & Erectors' },
        { category: 'Building Envelope', workTitle: 'Flat Roof & Architectural Glazing', description: 'Warm roof deck with 130mm PIR, GRP fiberglass roof, and slimline sliding doors.', tradeRequired: 'Roofer & Glazier' },
        { category: 'Plumbing & Electrics', workTitle: 'Wet Underfloor Heating & Kitchen Electrics', description: 'Multi-zone manifold system screeded with liquid anhydrite.', tradeRequired: 'Plumber & Electrician' },
        { category: 'Fit-Out & Joinery', workTitle: 'Kitchen Installation & Quartz Worktops', description: 'Precision fitting of cabinetry, undermount sinks, and stone island.', tradeRequired: 'Master Kitchen Fitter' },
      ],
      missingQuestions: [
        { id: 'drainage_location', question: 'Is there a manhole or shared sewer in the extension footprint?', reason: 'Determines Thames Water build-over requirements.' },
        { id: 'glazing_style', question: 'Do you prefer slimline sliding doors, bifolds, or Crittall steel doors?', reason: 'Affects structural opening spans and pricing.' },
      ],
      potentialConsiderations: [
        { topic: 'Party Wall Notice', consideration: 'Notices required under Section 6 of Party Wall Act for foundations within 3m.', riskLevel: 'high' },
        { topic: 'Building Control Part L', consideration: 'Requires SAP energy calculation if glazing exceeds 25% of floor area.', riskLevel: 'medium' },
      ],
      initialAnswers: { project_type: 'extension', goals: ['Open-plan living', 'More natural light', 'Modern kitchen'] },
      summary: `${typeTitle} of ~${areaM2}m² with full structural opening and architectural finishes.`,
      estimatedTimelineWeeks: { min: 12, max: 16 },
    };
  }

  // ---------------------------------------------------------------------------
  // 4. SCENARIO C: LOFT CONVERSION (DORMER / MANSARD / HIP-TO-GABLE)
  // ---------------------------------------------------------------------------
  if (isLoft) {
    const isMansard = lower.includes('mansard');
    const isHipToGable = lower.includes('hip to gable') || lower.includes('hip-to-gable');
    const typeTitle = isMansard ? 'Mansard Loft Conversion' : isHipToGable ? 'Hip-to-Gable Loft Conversion' : 'Rear Dormer Loft Conversion';

    const lowCost = isMansard ? 68000 : 52000;
    const highCost = isMansard ? 98000 : 78000;

    return {
      projectType: 'loft',
      projectTypeDisplay: `${typeTitle} with Luxury Master Suite & Ensuite`,
      originalDescription: text,
      generalDescription: `Conversion of roof space creating a master bedroom suite with ensuite bathroom and built-in wardrobe storage. Involves structural steel floor beams, timber dormer/mansard construction, breathable multi-foil/PIR roof insulation to Part L standards, bespoke staircase over the existing flight, Velux rooflights, and statutory Building Control fire safety doors and alarms.`,
      costEstimate: {
        low: lowCost,
        high: highCost,
        formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
        benchmarkPerM2: `£1,800 – £2,600 / m²`,
        notes: 'Includes steel beams, dormer timber frame, roof waterproofing, ensuite plumbing, staircase, and fire door upgrades.',
      },
      customSpecifications: [
        {
          tier: 'Essential',
          title: 'Standard Dormer Spec',
          priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
          description: 'Rear dormer with UPVC French doors and Juliet balcony, 3-piece ensuite, and standard Velux rooflights.',
          highlights: ['Timber frame dormer with slate/tile hanging', 'Ensuite with quadrant shower, basin, and WC', 'Bespoke timber staircase matching ground floor balustrade', 'FD30 fire doors to hallway escape route'],
        },
        {
          tier: 'Architectural Premium',
          title: 'Architectural Master Suite Spec',
          priceImpact: `+£12,000 – £20,000`,
          description: 'Aluminium anthracite French doors, walk-in wetroom shower with frameless glass, and bespoke eaves wardrobe joinery.',
          highlights: ['Full-width rear dormer with aluminium glazing', 'Walk-in wetroom with thermostatic rainfall shower & niche lighting', 'Custom-built fitted wardrobes in low eaves zones', 'Dimmable LED perimeter cove lighting'],
          isRecommended: true,
        },
        {
          tier: 'Luxury Master',
          title: 'Mansard & Spa Bathroom Spec',
          priceImpact: `+£24,000 – £38,000`,
          description: '70-degree slate mansard with timber box sash windows, freestanding bath, microcement bathroom, and air conditioning.',
          highlights: ['Conservation-compliant slate mansard with lead dormers', 'Freestanding composite stone bathtub in master bedroom', 'Integrated low-profile climate control / air conditioning', 'Acoustic soundproof subfloor system'],
        },
      ],
      thingsToConsider: [
        {
          category: 'Structural & Engineering',
          title: 'Ridge Height & Headroom Clearance',
          explanation: 'Building Regulations require a minimum of 2.0m clear headroom above the finished staircase and master bedroom landing.',
          impactLevel: 'high',
        },
        {
          category: 'Planning & Legal',
          title: 'Fire Safety & Means of Escape (Part B)',
          explanation: 'Converting a 2-storey house to 3 storeys requires upgrading all doors leading to the staircase to FD30 fire-resistant door sets and installing mains interlinked smoke alarms.',
          impactLevel: 'high',
        },
        {
          category: 'Drainage & Utilities',
          title: 'Soil Vent Pipe & Water Pressure',
          explanation: 'Adding a top-floor ensuite requires connecting to the soil vent pipe and checking whether mains water pressure or an unvented cylinder is needed.',
          impactLevel: 'medium',
        },
        {
          category: 'Living & Logistics',
          title: 'Scaffolding & Minimal Disruption',
          explanation: 'Up to 80% of loft construction takes place externally via scaffolding through the roof, keeping internal household disruption to a minimum until the stairs are installed.',
          impactLevel: 'low',
        },
      ],
      tradePhaseBreakdown: [
        { phase: 1, title: 'Scaffolding & Structural Steel', estimatedWeeks: 'Weeks 1–2', estimatedCostRange: '£12,000 – £18,000', items: ['Erect full perimeter scaffolding with tin hat weather protection', 'Crane in structural steel ridge and floor beams into party walls', 'Install suspended floor joists'] },
        { phase: 2, title: 'Dormer Framing & Roof Weatherproofing', estimatedWeeks: 'Weeks 3–4', estimatedCostRange: '£16,000 – £24,000', items: ['Build timber stud dormer frame', 'Install EPDM rubber flat roof and external slate tile cladding', 'Fit Velux rooflights and rear balcony French doors'] },
        { phase: 3, title: 'Insulation & First Fix MEP', estimatedWeeks: 'Weeks 5–6', estimatedCostRange: '£12,000 – £18,000', items: ['Fit 100mm rigid PIR insulation + multi-foil blanket', 'First fix electrical cabling, spotlights, and smoke alarms', 'First fix ensuite plumbing and waste pipes'] },
        { phase: 4, title: 'Staircase, Plastering & Second Fix', estimatedWeeks: 'Weeks 7–9', estimatedCostRange: '£12,000 – £18,000', items: ['Cut stairwell and install bespoke wooden staircase', 'Plaster skim all ceilings and walls', 'Fit bathroom sanitaryware, tiles, and internal doors'] },
      ],
      projectRequirements: [
        `Construct ${typeTitle.toLowerCase()}`,
        'Install structural steel floor beams and timber dormer',
        'Install new staircase over existing stairs',
        'Create luxury master bedroom with ensuite bathroom',
      ],
      rooms: [
        { name: 'Master Loft Bedroom', sizeCategory: 'large', dimensions: { length: 5.5, width: 4.2, areaM2: 23 }, purpose: 'Master suite with eaves storage and garden views' },
        { name: 'Ensuite Shower Room', sizeCategory: 'small', dimensions: { length: 2.4, width: 1.6, areaM2: 3.8 }, purpose: 'Walk-in shower, basin vanity, and WC' },
      ],
      likelyWorks: [
        { category: 'Structural & Groundworks', workTitle: 'Structural Steel Floor & Ridge Beams', description: 'Insert RSJ beams into party walls to support floor and dormer loads.', tradeRequired: 'Steel Fabricator / Carpenter' },
        { category: 'Building Envelope', workTitle: 'Timber Dormer & EPDM Flat Roof', description: 'Weatherproof dormer carcass with breathable membranes and slate tiles.', tradeRequired: 'Roofer' },
        { category: 'Plumbing & Electrics', workTitle: 'Ensuite Plumbing & Fire Alarms', description: 'Pressurized water feeds, waste connections, and Part P electrical wiring.', tradeRequired: 'Plumber & Electrician' },
        { category: 'Fit-Out & Joinery', workTitle: 'Bespoke Staircase & Eaves Cupboards', description: 'Crafted timber staircase with matching balustrades and custom doors.', tradeRequired: 'Joiner' },
      ],
      missingQuestions: [
        { id: 'water_system', question: 'Do you have a combi boiler or traditional water tank in the loft?', reason: 'Water tanks must be relocated or upgraded to unvented cylinder.' },
        { id: 'roof_height', question: 'What is the internal height from ceiling joists to the ridge apex?', reason: 'Confirms headroom feasibility without lowering ceilings.' },
      ],
      potentialConsiderations: [
        { topic: 'Building Regulations Part B (Fire)', consideration: 'Staircase enclosure must be 30-minute fire protected with FD30 doors.', riskLevel: 'high' },
        { topic: 'Permitted Development volume', consideration: 'Permitted Development limits additional roof volume to 40m³ (terraced) or 50m³ (semi-detached).', riskLevel: 'medium' },
      ],
      initialAnswers: { project_type: 'loft', goals: ['Master bedroom', 'Add value to home'] },
      summary: `${typeTitle} adding master bedroom suite and ensuite bathroom.`,
      estimatedTimelineWeeks: { min: 7, max: 10 },
    };
  }

  // ---------------------------------------------------------------------------
  // 5. DEFAULT / FULL RENOVATION / STRUCTURAL KNOCKTHROUGH
  // ---------------------------------------------------------------------------
  const projectType: ProjectType = isFullRenovation ? 'full-renovation' : isBathroom ? 'bathroom' : 'other';
  const displayTitle = isFullRenovation
    ? 'Complete Period Home Renovation & Modernisation'
    : isBathroom
    ? 'Luxury Bathroom & Wetroom Renovation'
    : 'Bespoke Architectural Reconfiguration & Structural Works';

  const lowCost = isFullRenovation ? 110000 : isBathroom ? 14000 : 35000;
  const highCost = isFullRenovation ? 240000 : isBathroom ? 28000 : 75000;

  return {
    projectType,
    projectTypeDisplay: displayTitle,
    originalDescription: text,
    generalDescription: `Comprehensive architectural building works including structural modifications, MEP upgrades, and turnkey finishes. All work executed by experienced trade craftsmen in full compliance with UK Building Regulations.`,
    costEstimate: {
      low: lowCost,
      high: highCost,
      formatted: `£${lowCost.toLocaleString()} – £${highCost.toLocaleString()}`,
      benchmarkPerM2: `£1,500 – £2,800 / m²`,
      notes: 'Itemised budget based on current London trade labour rates and high-specification materials.',
    },
    customSpecifications: [
      {
        tier: 'Essential',
        title: 'High-Quality Contemporary Finish',
        priceImpact: `Baseline (~£${lowCost.toLocaleString()})`,
        description: 'Quality building products, clean plaster finish, and certified MEP installations.',
        highlights: ['Certified structural calculations', 'Quality timber and sanitaryware', 'NICEIC / Gas Safe certification'],
      },
      {
        tier: 'Architectural Premium',
        title: 'Architectural Specification',
        priceImpact: `+£15,000 – £35,000`,
        description: 'Designer finishes, underfloor heating, bespoke joinery, and concealed lighting.',
        highlights: ['Zoned smart lighting', 'Custom-made joinery units', 'Engineered oak flooring'],
        isRecommended: true,
      },
      {
        tier: 'Luxury Master',
        title: 'Turnkey Luxury Specification',
        priceImpact: `+£40,000 – £80,000`,
        description: 'Marble and microcement surfaces, bespoke cabinetry, and smart home automation.',
        highlights: ['Full HVAC climate control', 'Bookmatched marble stone', 'Complete architectural project management'],
      },
    ],
    thingsToConsider: [
      {
        category: 'Structural & Engineering',
        title: 'Structural Load Paths & Padstones',
        explanation: 'All removed walls require calculation by a chartered structural engineer to ensure upper floor and roof loads are safely supported.',
        impactLevel: 'high',
      },
      {
        category: 'Planning & Legal',
        title: 'Building Regulations Compliance',
        explanation: 'Statutory site inspections required for structural alterations, electrical wiring (Part P), and insulation (Part L).',
        impactLevel: 'high',
      },
      {
        category: 'Living & Logistics',
        title: 'Phased Sequencing of Trades',
        explanation: 'Proper sequencing prevents damage to new finishes and ensures project timelines are met.',
        impactLevel: 'medium',
      },
    ],
    tradePhaseBreakdown: [
      { phase: 1, title: 'Strip-Out & Structural Works', estimatedWeeks: 'Weeks 1–3', estimatedCostRange: '£8,000 – £20,000', items: ['Back to brick strip-out', 'Steel beam installation', 'Structural openings'] },
      { phase: 2, title: 'First Fix Plumbing & Electrics', estimatedWeeks: 'Weeks 4–6', estimatedCostRange: '£12,000 – £28,000', items: ['New consumer unit & wiring', 'Heating pipework & unvented cylinder', 'Underfloor heating screed'] },
      { phase: 3, title: 'Plastering, Joinery & Second Fix', estimatedWeeks: 'Weeks 7–10', estimatedCostRange: '£15,000 – £35,000', items: ['Plaster skim', 'Bespoke joinery & doors', 'Sanitaryware & tiling'] },
    ],
    projectRequirements: [
      'Carry out structural and architectural reconfiguration',
      'Update plumbing, electrical, and heating systems',
      'Provide turnkey decoration and Building Control sign-off',
    ],
    rooms: [
      { name: 'Main Project Space', sizeCategory: 'large', dimensions: { length: 6, width: 4, areaM2: 24 }, purpose: 'Reconfigured living and functional space' },
    ],
    likelyWorks: [
      { category: 'Structural & Groundworks', workTitle: 'Structural Opening & Steelwork', description: 'Install RSJ beam and concrete padstones.', tradeRequired: 'Structural Builder' },
      { category: 'Plumbing & Electrics', workTitle: 'MEP Upgrades & Certification', description: 'Full rewire and heating upgrades.', tradeRequired: 'Electrician & Plumber' },
      { category: 'Fit-Out & Joinery', workTitle: 'Carpentry, Plastering & Decorating', description: 'High-end interior finishing.', tradeRequired: 'Joiner & Plasterer' },
    ],
    missingQuestions: [
      { id: 'property_age', question: 'What era is your property (e.g. Victorian, Edwardian, 1930s, Modern)?', reason: 'Affects plaster types, floor joists, and structural requirements.' },
    ],
    potentialConsiderations: [
      { topic: 'Building Regulations', consideration: 'All structural work requires full Building Control certification.', riskLevel: 'high' },
    ],
    initialAnswers: { project_type: projectType, goals: ['Quality renovation', 'Added comfort'] },
    summary: `${displayTitle} with complete turnkey management.`,
    estimatedTimelineWeeks: { min: 6, max: 12 },
  };
}

/**
 * Server-side AI Project Analyzer
 */
export async function analyzeProjectWithAI(prompt: string): Promise<ExtractedProject> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return extractWithUKBuildingRules(prompt);
  }

  try {
    const fallbackRules = extractWithUKBuildingRules(prompt);

    const systemInstruction = `You are an expert UK Senior Construction Surveyor & Quantity Surveyor for ST CONTRACTORS in London.
Analyze the homeowner's project description and return ONLY valid JSON matching this exact structure:

{
  "generalDescription": string,
  "costEstimate": {
    "low": number,
    "high": number,
    "formatted": string,
    "benchmarkPerM2": string,
    "notes": string
  },
  "customSpecifications": [
    {
      "tier": "Essential" | "Architectural Premium" | "Luxury Master",
      "title": string,
      "priceImpact": string,
      "description": string,
      "highlights": string[],
      "isRecommended": boolean
    }
  ],
  "thingsToConsider": [
    {
      "category": "Structural & Engineering" | "Planning & Legal" | "Drainage & Utilities" | "Living & Logistics",
      "title": string,
      "explanation": string,
      "impactLevel": "high" | "medium" | "low"
    }
  ],
  "tradePhaseBreakdown": [
    {
      "phase": number,
      "title": string,
      "estimatedWeeks": string,
      "estimatedCostRange": string,
      "items": string[]
    }
  ]
}

Ensure all prices reflect realistic 2026 London residential construction rates (extensions ~£2,400-£3,400/m², lofts ~£50k-£90k, garage conversions ~£22k-£45k).
Ground all advice in UK Building Regulations (Part A, Part B, Part L, Part P), the Party Wall etc. Act 1996, and Thames Water drainage standards.`;

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
      return fallbackRules;
    }

    const data = await response.json();
    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return fallbackRules;

    const parsed = JSON.parse(rawJson);

    return {
      ...fallbackRules,
      generalDescription: parsed.generalDescription || fallbackRules.generalDescription,
      costEstimate: parsed.costEstimate?.low ? parsed.costEstimate : fallbackRules.costEstimate,
      customSpecifications: parsed.customSpecifications?.length ? parsed.customSpecifications : fallbackRules.customSpecifications,
      thingsToConsider: parsed.thingsToConsider?.length ? parsed.thingsToConsider : fallbackRules.thingsToConsider,
      tradePhaseBreakdown: parsed.tradePhaseBreakdown?.length ? parsed.tradePhaseBreakdown : fallbackRules.tradePhaseBreakdown,
    };
  } catch (error) {
    console.error('Error invoking Gemini Assistant API, falling back to rule engine:', error);
    return extractWithUKBuildingRules(prompt);
  }
}
