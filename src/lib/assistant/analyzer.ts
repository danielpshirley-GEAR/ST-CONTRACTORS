/**
 * AI Construction Scope & Quantity Surveying Calculation Engine
 *
 * Decomposes multi-trade user inputs into individual building trade items,
 * calculating accurate itemised costs, timelines, specifications, statutory considerations,
 * and sequenced trade phases based on London 2026 Quantity Surveyor rates.
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

interface DetectedTradeItem {
  id: string;
  name: string;
  category: string;
  lowCost: number;
  highCost: number;
  daysMin: number;
  daysMax: number;
  tradeRequired: string;
  description: string;
  tasks: string[];
  considerations: ThingToConsider[];
  boqMetric?: { label: string; value: string; note: string };
}

/**
 * Universal Multi-Trade Itemised Composition Engine
 */
export function extractWithUKBuildingRules(text: string): ExtractedProject {
  const raw = (text || '').trim();
  const lower = raw.toLowerCase();

  // ---------------------------------------------------------------------------
  // 1. ROOM TARGET IDENTIFICATION
  // ---------------------------------------------------------------------------
  let roomLabel = 'Living Space';
  let isKitchen = lower.includes('kitchen');
  let isBathroom = lower.includes('bathroom') || lower.includes('ensuite') || lower.includes('shower') || lower.includes('wetroom') || lower.includes('toilet') || lower.includes('wc');
  let isBedroom = lower.includes('bedroom') || lower.includes('master');
  let isLiving = lower.includes('living') || lower.includes('lounge') || lower.includes('reception') || lower.includes('sitting');
  let isHallway = lower.includes('hallway') || lower.includes('hall') || lower.includes('stairs') || lower.includes('landing');
  let isDining = lower.includes('dining');
  let isMultiRoom = lower.includes('whole house') || lower.includes('whole property') || lower.includes('all rooms') || (isBedroom && isLiving) || (isKitchen && isLiving);

  if (isMultiRoom) roomLabel = 'Entire Property';
  else if (isKitchen) roomLabel = 'Kitchen';
  else if (isBathroom) roomLabel = 'Bathroom';
  else if (isBedroom) roomLabel = 'Bedroom';
  else if (isLiving) roomLabel = 'Living Room';
  else if (isHallway) roomLabel = 'Hallway & Staircase';
  else if (isDining) roomLabel = 'Dining Room';

  // Extract dimensions if provided
  let extractedM2 = 15;
  const meterMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m2|sqm|sq m|m²)/i);
  const lengthMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|metre|meter|metres|meters)/i);
  if (meterMatch) {
    extractedM2 = parseFloat(meterMatch[1]);
  } else if (lengthMatch) {
    const len = parseFloat(lengthMatch[1]);
    extractedM2 = Math.round(len * (len > 5 ? 3.5 : len * 0.8));
  }

  // ---------------------------------------------------------------------------
  // 2. DETECT INDIVIDUAL TRADE ITEMS REQUESTED
  // ---------------------------------------------------------------------------
  const detectedItems: DetectedTradeItem[] = [];

  // A. Decorating / Painting
  const hasDecorate = lower.includes('paint') || lower.includes('decorate') || lower.includes('decorating') || lower.includes('wallpaper') || lower.includes('emulsion') || lower.includes('gloss') || lower.includes('woodwork');
  if (hasDecorate) {
    const isSpecialistKitchen = isKitchen && !isMultiRoom;
    detectedItems.push({
      id: 'decorating',
      name: `${roomLabel} Redecoration & Painting`,
      category: 'Finishes & Decorating',
      lowCost: isMultiRoom ? 3800 : isSpecialistKitchen ? 950 : 850,
      highCost: isMultiRoom ? 8500 : isSpecialistKitchen ? 2200 : 1650,
      daysMin: isMultiRoom ? 8 : 2,
      daysMax: isMultiRoom ? 15 : 4,
      tradeRequired: 'Trade Painter & Decorator',
      description: `Surface preparation, sugar soap cleaning, filling hairline cracks, spot-priming, and applying 2 coats of durable emulsion to ceilings and walls, with satinwood/eggshell to all woodwork.`,
      tasks: [
        'Protect flooring and fixtures with heavy-duty drop sheets and tape',
        'Rake out cracks, fill imperfections, and sand surfaces smooth',
        'Apply 2 coats of scrub-resistant washable wall emulsion (Class 1)',
        'Prep and paint skirtings, door frames, and window sills in satinwood',
      ],
      considerations: [
        {
          category: 'Living & Logistics',
          title: 'Surface Preparation & Paint Quality',
          explanation: 'Using trade-grade scrub-rated Class 1 emulsion ensures walls can be wiped clean without leaving shiny patches or burnishing.',
          impactLevel: 'low',
        },
      ],
      boqMetric: { label: 'Surface Area', value: `~${Math.round(extractedM2 * 3.8)} m²`, note: 'Ceiling, walls & woodwork' },
    });
  }

  // B. Flooring
  const hasFlooring = lower.includes('flooring') || lower.includes('floor') || lower.includes('herringbone') || lower.includes('parquet') || lower.includes('oak') || lower.includes('lvt') || lower.includes('laminate') || lower.includes('carpet') || lower.includes('tiling') || lower.includes('tiles') || lower.includes('microcement');
  if (hasFlooring) {
    const isHerringbone = lower.includes('herringbone') || lower.includes('parquet');
    const isTile = lower.includes('tile') || lower.includes('porcelain');
    const isMicrocement = lower.includes('microcement');
    const isCarpet = lower.includes('carpet');
    const isLvtLaminate = lower.includes('lvt') || lower.includes('laminate');

    const lowF = isMicrocement ? 2200 : isHerringbone ? 1800 : isTile ? 1300 : isLvtLaminate ? 750 : isCarpet ? 450 : 1100;
    const highF = isMicrocement ? 3800 : isHerringbone ? 3200 : isTile ? 2600 : isLvtLaminate ? 1500 : isCarpet ? 950 : 2200;
    const flooringTypeLabel = isHerringbone ? 'Herringbone Engineered Oak' : isTile ? 'Porcelain Tiling' : isMicrocement ? 'Seamless Microcement' : isCarpet ? 'Luxury Carpet & Underlay' : 'Engineered Wood / Premium Flooring';

    detectedItems.push({
      id: 'flooring',
      name: `${flooringTypeLabel} Installation`,
      category: 'Flooring & Subfloor',
      lowCost: isMultiRoom ? lowF * 3 : lowF,
      highCost: isMultiRoom ? highF * 3 : highF,
      daysMin: isMultiRoom ? 5 : 2,
      daysMax: isMultiRoom ? 10 : 3,
      tradeRequired: 'Flooring Specialist / Master Craftsman',
      description: `Uplift of old floor coverings, subfloor inspection and levelling with self-smoothing compound or 6mm ply, installation of acoustic underlay/adhesive, fitting new ${flooringTypeLabel.toLowerCase()}, and trimming door bottoms with matching threshold profiles.`,
      tasks: [
        'Uplift and environmentally dispose of old flooring',
        'Check subfloor moisture levels and apply latex self-levelling screed',
        `Lay acoustic underlay and precision-fit ${flooringTypeLabel.toLowerCase()}`,
        'Trim bottom of internal doors and fit matching perimeter beading/thresholds',
      ],
      considerations: [
        {
          category: 'Structural & Engineering',
          title: 'Subfloor Levelling & Moisture Testing',
          explanation: 'Subfloors must have a moisture content below 75% RH and no more than 3mm deviation over 2m to prevent floor movement, creaking, or cupping.',
          impactLevel: 'medium',
        },
      ],
      boqMetric: { label: 'Flooring Area', value: `~${extractedM2} m²`, note: 'Includes 10% cutting waste' },
    });
  }

  // C. Spotlights / Downlights / Electrics
  const hasLighting = lower.includes('spot light') || lower.includes('spot lights') || lower.includes('spotlight') || lower.includes('spotlights') || lower.includes('downlight') || lower.includes('downlights') || lower.includes('recessed light') || lower.includes('recessed lights') || lower.includes('lighting') || lower.includes('dimmer') || lower.includes('led') || lower.includes('socket') || lower.includes('sockets') || lower.includes('rewire');
  if (hasLighting) {
    const isFullRewire = lower.includes('rewire');
    const lowL = isFullRewire ? 4500 : 650;
    const highL = isFullRewire ? 9500 : 1250;

    detectedItems.push({
      id: 'lighting',
      name: isFullRewire ? 'Electrical Rewire & Consumer Unit' : 'Recessed Dimmable LED Spotlights',
      category: 'Electrical & Lighting',
      lowCost: isMultiRoom ? lowL * 2.5 : lowL,
      highCost: isMultiRoom ? highL * 2.5 : highL,
      daysMin: isFullRewire ? 5 : 1,
      daysMax: isFullRewire ? 10 : 2,
      tradeRequired: 'NICEIC Certified Electrician',
      description: `First-fix electrical cabling from lighting ring, precision laser-aligned core drilling of ceiling apertures, installation of 4–8 fire-rated, IP65-rated warm white LED downlights, installation of digital trailing-edge dimmer switch, and Part P electrical safety testing.`,
      tasks: [
        'Isolate circuit and run heat-resistant flex cabling across ceiling joists',
        'Laser-align and core-drill 6x spotlight holes in ceiling',
        'Install fire-rated, acoustic-rated dimmable LED downlight fittings',
        'Fit trailing-edge LED dimmer switch and issue Part P Minor Works certificate',
      ],
      considerations: [
        {
          category: 'Planning & Legal',
          title: 'Building Regulations Part P & Fire Rating',
          explanation: 'Downlights penetrating plasterboard ceilings must be fire-rated (30/60/90 mins) to maintain ceiling fire integrity between floors. Work must be certified under Part P.',
          impactLevel: 'high',
        },
      ],
      boqMetric: { label: 'Lighting Points', value: '6x LED Fittings', note: 'Fire-rated IP65 + Dimmer' },
    });
  }

  // D. Plastering / Skimming
  const hasPlaster = lower.includes('plaster') || lower.includes('skimming') || lower.includes('drylining') || lower.includes('plasterboard') || lower.includes('smooth ceiling') || lower.includes('artex');
  if (hasPlaster) {
    detectedItems.push({
      id: 'plastering',
      name: `${roomLabel} Plaster Skimming & Ceiling Prep`,
      category: 'Plastering & Drylining',
      lowCost: isMultiRoom ? 2800 : 650,
      highCost: isMultiRoom ? 6200 : 1450,
      daysMin: isMultiRoom ? 4 : 1,
      daysMax: isMultiRoom ? 8 : 2,
      tradeRequired: 'Master Plasterer',
      description: `Application of PVA/bonding agent, scrim taping all joints, and applying a 2-coat Thistle Multi-Finish skim to achieve a perfectly smooth, blemish-free surface ready for decoration.`,
      tasks: [
        'Scrape high spots and apply SBR/PVA bonding coat',
        'Apply fiberglass scrim tape over all plasterboard joints and cracks',
        'Apply 2-coat multi-finish plaster skim and trowel to a polished glass finish',
      ],
      considerations: [
        {
          category: 'Living & Logistics',
          title: 'Plaster Drying Time Before Painting',
          explanation: 'Fresh plaster must dry completely (pale pink colour, usually 3–5 days) before applying a breathable mist coat (50/50 water & emulsion).',
          impactLevel: 'medium',
        },
      ],
      boqMetric: { label: 'Plaster Area', value: `~${Math.round(extractedM2 * 3.5)} m²`, note: 'Walls & ceiling skim' },
    });
  }

  // E. Carpentry & Fitted Joinery
  const hasJoinery = lower.includes('wardrobe') || lower.includes('fitted wardrobe') || lower.includes('alcove') || lower.includes('media wall') || lower.includes('shelving') || lower.includes('cupboard') || lower.includes('internal doors');
  if (hasJoinery) {
    detectedItems.push({
      id: 'joinery',
      name: 'Bespoke Fitted Joinery & Cabinetry',
      category: 'Carpentry & Joinery',
      lowCost: 1800,
      highCost: 4800,
      daysMin: 2,
      daysMax: 4,
      tradeRequired: 'Bespoke Joiner / Carpenter',
      description: `Site survey, workshop fabrication of moisture-resistant MDF or veneered cabinetry with soft-close Blum hardware, integrated LED strip channels, scribing to walls, and spray or hand-painted finish.`,
      tasks: [
        'Laser-measure alcoves/walls and precision scribe cabinetry to contours',
        'Install solid carcass units with soft-close drawers and hanging rails',
        'Route channels for concealed LED sensor strip lighting',
        'Fit shaker or flat slab doors and fit architectural handles',
      ],
      considerations: [
        {
          category: 'Living & Logistics',
          title: 'Wall Plumbness & Scribing',
          explanation: 'Period property walls are rarely true; bespoke joinery requires precision on-site scribing to achieve seamless flush fits without gaps.',
          impactLevel: 'medium',
        },
      ],
      boqMetric: { label: 'Bespoke Joinery', value: '1x Built-In Unit', note: 'Soft-close hardware' },
    });
  }

  // F. Structural Knockthrough / RSJ
  const hasWallRemoval = lower.includes('knock') || lower.includes('remove wall') || lower.includes('take down wall') || lower.includes('taking out the wall') || lower.includes('rsj') || lower.includes('steel beam') || lower.includes('load bearing') || lower.includes('opening up');
  if (hasWallRemoval) {
    detectedItems.push({
      id: 'structural',
      name: 'Load-Bearing Wall Removal & RSJ Installation',
      category: 'Structural Works',
      lowCost: 4200,
      highCost: 9500,
      daysMin: 5,
      daysMax: 10,
      tradeRequired: 'Structural Builder & Steel Fabricator',
      description: `Structural engineer calculations, temporary Acrow propping and needle support, masonry demolition, installation of fabricated Universal Beam (RSJ) on concrete padstones, drypack mortar, fireproofing, and plastering.`,
      tasks: [
        'Erect temporary heavy-duty load-spreading props and needles',
        'Demolish masonry wall and remove debris via licensed skip',
        'Cast high-density concrete padstones and bed steel RSJ beam',
        'Encase steel in 2 layers of fireline plasterboard (Part B compliance)',
      ],
      considerations: [
        {
          category: 'Structural & Engineering',
          title: 'Structural Engineer Calculations & Building Control',
          explanation: 'Mandatory chartered engineer calculations submitted to local authority Building Control for completion certificate.',
          impactLevel: 'high',
        },
      ],
      boqMetric: { label: 'Structural Steel', value: '~450 kg RSJ', note: 'On concrete padstones' },
    });
  }

  // G. Extensions (Rear, Side, Wraparound)
  const hasExtension = lower.includes('extension') || lower.includes('extend') || lower.includes('side return') || lower.includes('wraparound') || lower.includes('wrap around');
  if (hasExtension) {
    const isWrap = lower.includes('wraparound') || lower.includes('wrap around');
    const isSide = lower.includes('side return');
    const extArea = extractedM2 > 20 ? extractedM2 : 30;
    const basePerM2 = 2450;
    const lowCostExt = Math.round(extArea * basePerM2 * 0.95);
    const highCostExt = Math.round(extArea * basePerM2 * 1.35);

    detectedItems.push({
      id: 'extension',
      name: isWrap ? 'Wraparound Extension' : isSide ? 'Side Return Extension' : 'Single Storey Rear Extension',
      category: 'Structural Construction',
      lowCost: lowCostExt,
      highCost: highCostExt,
      daysMin: 45,
      daysMax: 75,
      tradeRequired: 'Principal Contractor & Construction Crew',
      description: `Groundworks, 1.5m foundations in London clay, drainage lintels, structural steel frame, cavity walls, flat roof with rooflights, sliding/bifold doors, underfloor heating, and turnkey fit-out.`,
      tasks: [
        'Excavate 1.5m trench foundations and pour C25/30 ready-mix concrete',
        'Erect structural steel goalpost frame on padstones',
        'Construct insulated cavity walls and warm flat roof with glazing',
        'Install wet underfloor heating and open-plan finishes',
      ],
      considerations: [
        {
          category: 'Structural & Engineering',
          title: 'Party Wall Act 1996 & Thames Water',
          explanation: 'Notices required under Section 6 for foundations within 3m of neighbour; Thames Water build-over agreement if near shared sewer.',
          impactLevel: 'high',
        },
      ],
      boqMetric: { label: 'Excavation & Pour', value: `${Math.round(extArea * 0.85)} m³`, note: '1.5m London clay trench' },
    });
  }

  // H. Loft Conversions
  const hasLoft = lower.includes('loft') || lower.includes('attic') || lower.includes('dormer') || lower.includes('mansard');
  if (hasLoft) {
    detectedItems.push({
      id: 'loft',
      name: 'Dormer Loft Conversion with Master Ensuite',
      category: 'Roof & Structural',
      lowCost: 48000,
      highCost: 78000,
      daysMin: 35,
      daysMax: 55,
      tradeRequired: 'Loft Specialist & Carpenters',
      description: `Scaffolding, structural steel ridge/floor beams, timber dormer carcass, EPDM flat roof, Part L multi-foil insulation, bespoke staircase, ensuite plumbing, and FD30 fire doors.`,
      tasks: [
        'Erect scaffolding with temporary roof weather protection',
        'Crane in structural steel beams and suspended timber floor joists',
        'Construct timber dormer with EPDM roof and Velux windows',
        'Fit bespoke timber staircase and luxury ensuite bathroom',
      ],
      considerations: [
        {
          category: 'Planning & Legal',
          title: 'Means of Escape & Fire Safety (Part B)',
          explanation: 'Converting to a 3-storey home requires FD30 fire doors to all habitable rooms opening onto the protected staircase enclosure.',
          impactLevel: 'high',
        },
      ],
      boqMetric: { label: 'Structural Beams', value: '~850 kg Steel', note: 'Ridge & floor supports' },
    });
  }

  // I. Garage Conversions
  const hasGarage = lower.includes('garage');
  if (hasGarage && !hasExtension) {
    detectedItems.push({
      id: 'garage',
      name: 'Garage Conversion to Habitable Living Space',
      category: 'Conversion Works',
      lowCost: 18000,
      highCost: 34000,
      daysMin: 20,
      daysMax: 30,
      tradeRequired: 'General Builder & Electrician',
      description: `Masonry infill of vehicle door with matching brick and double glazed window, insulated floating floor with damp-proof membrane over concrete slab, wall insulation, heating, electics, and FD30 door.`,
      tasks: [
        'Brick up garage door opening with matching cavity masonry and window',
        'Apply liquid DPM, 100mm PIR insulation, and floating floor deck',
        'First fix electrical circuits, heating, and acoustic wall linings',
        'Plaster skim, fit FD30 fire door, and complete decoration',
      ],
      considerations: [
        {
          category: 'Planning & Legal',
          title: 'Floor Damp Proofing & Floor Step',
          explanation: 'Existing garage slabs lack DPMs; new liquid membrane and 100mm PIR insulation required to match house floor levels.',
          impactLevel: 'high',
        },
      ],
      boqMetric: { label: 'Insulated Deck', value: '~15 m²', note: '100mm PIR + DPM' },
    });
  }

  // If no specific trade was matched, provide a comprehensive refurbishment fallback
  if (detectedItems.length === 0) {
    detectedItems.push({
      id: 'general_refurb',
      name: `${roomLabel} Refurbishment Works`,
      category: 'General Building',
      lowCost: 1500,
      highCost: 4500,
      daysMin: 3,
      daysMax: 7,
      tradeRequired: 'Multi-Trade Builder',
      description: `Comprehensive room refurbishment including surface preparation, minor electrical/plumbing adjustments, plaster repairs, and turnkey decorative finishes.`,
      tasks: [
        'Protect areas and strip out old fixtures',
        'Carry out surface preparation and necessary trade updates',
        'Apply professional decorative finishes and clean up',
      ],
      considerations: [
        {
          category: 'Living & Logistics',
          title: 'Trade Phasing & Dust Management',
          explanation: 'Careful sequencing ensures works are completed on schedule with minimal disruption to the household.',
          impactLevel: 'low',
        },
      ],
      boqMetric: { label: 'Scope Tasks', value: 'Multi-Trade', note: 'Turnkey handover' },
    });
  }

  // ---------------------------------------------------------------------------
  // 3. AGGREGATE TOTALS & COMPOSE UNIFIED PROJECT SCOPE
  // ---------------------------------------------------------------------------
  const totalLow = detectedItems.reduce((sum, item) => sum + item.lowCost, 0);
  const totalHigh = detectedItems.reduce((sum, item) => sum + item.highCost, 0);
  const totalDaysMin = Math.max(...detectedItems.map((i) => i.daysMin));
  const totalDaysMax = detectedItems.reduce((sum, item) => sum + Math.round(item.daysMax * 0.75), 0); // account for concurrent trades

  const weeksMin = Math.max(1, Math.ceil(totalDaysMin / 5));
  const weeksMax = Math.max(1, Math.ceil(totalDaysMax / 5));

  // Compose Display Title
  let displayTitle = '';
  if (detectedItems.length === 1) {
    displayTitle = detectedItems[0].name;
  } else {
    const itemNames = detectedItems.map((i) => {
      if (i.id === 'decorating') return 'Redecoration';
      if (i.id === 'flooring') return 'New Flooring';
      if (i.id === 'lighting') return 'Spotlights / Lighting';
      if (i.id === 'plastering') return 'Plaster Skimming';
      if (i.id === 'joinery') return 'Bespoke Joinery';
      if (i.id === 'structural') return 'Wall Removal & RSJ';
      if (i.id === 'extension') return 'Extension';
      if (i.id === 'loft') return 'Loft Conversion';
      if (i.id === 'garage') return 'Garage Conversion';
      return i.name;
    });
    displayTitle = `${roomLabel} Refurbishment: ${itemNames.join(' + ')}`;
  }

  // Compose General Description
  const descriptionsList = detectedItems.map((item, idx) => `(${idx + 1}) ${item.name}: ${item.description}`).join(' ');
  const generalDescription = `Multi-trade scope for ${roomLabel.toLowerCase()}. The project encompasses: ${descriptionsList}`;

  // Compose Phased Sequence
  // Logical Trade Ordering: Demolition/Structural (1) -> Electrics/Plumbing 1st Fix (2) -> Plastering (3) -> Decorating (4) -> Flooring (5) -> Electrics 2nd Fix / Second Fit (6)
  const tradePhaseBreakdown: TradePhaseBreakdown[] = [];
  let phaseNum = 1;

  // Order items logically
  const orderPriority: Record<string, number> = {
    structural: 10,
    extension: 15,
    loft: 18,
    garage: 20,
    lighting: 30, // 1st fix
    plastering: 40,
    decorating: 50,
    flooring: 60, // flooring comes after painting to avoid paint drips
    joinery: 70,
    general_refurb: 80,
  };

  const sortedItems = [...detectedItems].sort((a, b) => (orderPriority[a.id] || 99) - (orderPriority[b.id] || 99));

  sortedItems.forEach((item) => {
    const timeLabel = item.daysMax <= 5 ? `Days 1–${item.daysMax}` : `${Math.ceil(item.daysMin / 5)}–${Math.ceil(item.daysMax / 5)} Weeks`;
    tradePhaseBreakdown.push({
      phase: phaseNum++,
      title: item.name,
      estimatedWeeks: timeLabel,
      estimatedCostRange: `£${item.lowCost.toLocaleString()} – £${item.highCost.toLocaleString()}`,
      items: item.tasks,
    });
  });

  // Compose Custom Specifications (Essential, Premium, Luxury)
  const customSpecifications: CustomSpecificationOption[] = [
    {
      tier: 'Essential',
      title: 'High-Quality Standard Trade Spec',
      priceImpact: `Baseline (~£${totalLow.toLocaleString()})`,
      description: `Certified trade execution: durable trade paints (Dulux Diamond Matt), quality underlay/flooring, and certified fire-rated LED lighting points.`,
      highlights: [
        'Full surface preparation and masking protection',
        'Class 1 scrub-rated washable wall & ceiling emulsion',
        'Precision subfloor levelling and quality floor installation',
        'Fire-rated warm white LED downlights with trailing-edge dimmer',
      ],
    },
    {
      tier: 'Architectural Premium',
      title: 'Architectural Designer Specification',
      priceImpact: `+£${Math.round(totalLow * 0.45).toLocaleString()} – £${Math.round(totalHigh * 0.45).toLocaleString()}`,
      description: `Farrow & Ball / Little Greene designer palette, herringbone engineered oak or large-format porcelain, and smart dimmable architectural lighting.`,
      highlights: [
        'Farrow & Ball / Little Greene designer wall emulsion',
        'Prime grade herringbone engineered oak with acoustic underlay',
        'Smart app/dimmer controlled architectural LED lighting',
        'Scribed skirtings, concealed thresholds, and flawless finish',
      ],
      isRecommended: true,
    },
    {
      tier: 'Luxury Master',
      title: 'Turnkey Luxury Bespoke Master Suite',
      priceImpact: `+£${Math.round(totalLow * 1.1).toLocaleString()} – £${Math.round(totalHigh * 1.1).toLocaleString()}`,
      description: `Seamless microcement or bespoke parquet, perimeter coffer LED lighting scenes, and custom floor-to-ceiling fitted wardrobe joinery.`,
      highlights: [
        'Custom floor-to-ceiling bespoke fitted wardrobe joinery',
        'Seamless waterproof microcement or bespoke chevron parquet',
        'Perimeter ceiling coffer lighting with concealed warm LED',
        'Complete turnkey architectural project management & warranty',
      ],
    },
  ];

  // Aggregate Considerations
  const thingsToConsider: ThingToConsider[] = [];
  detectedItems.forEach((item) => {
    item.considerations.forEach((c) => {
      if (!thingsToConsider.some((existing) => existing.title === c.title)) {
        thingsToConsider.push(c);
      }
    });
  });

  // Add trade sequencing rule if multiple trades
  if (detectedItems.length > 1) {
    thingsToConsider.push({
      category: 'Living & Logistics',
      title: 'Trade Sequencing & Floor Protection',
      explanation: 'Critical builder sequencing: Electrical 1st fix and ceiling apertures must occur FIRST, followed by plastering and painting, with new flooring installed LAST to ensure pristine handover without paint splashes or scuffs.',
      impactLevel: 'medium',
    });
  }

  const projectType: ProjectType = hasExtension ? 'extension' : isKitchen ? 'kitchen' : isBathroom ? 'bathroom' : 'other';

  return {
    projectType,
    projectTypeDisplay: displayTitle,
    originalDescription: raw,
    generalDescription,
    costEstimate: {
      low: totalLow,
      high: totalHigh,
      formatted: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
      benchmarkPerM2: `£${Math.round(totalLow / extractedM2)} – £${Math.round(totalHigh / extractedM2)} / m²`,
      notes: `Itemised trade estimate based on ${detectedItems.length} trade disciplines: ${detectedItems.map((i) => i.tradeRequired).join(', ')}.`,
    },
    customSpecifications,
    thingsToConsider,
    tradePhaseBreakdown,
    projectRequirements: detectedItems.map((i) => i.name),
    rooms: [
      {
        name: roomLabel,
        sizeCategory: extractedM2 > 25 ? 'large' : 'medium',
        dimensions: { length: Math.sqrt(extractedM2 * 1.2), width: Math.sqrt(extractedM2 / 1.2), areaM2: extractedM2 },
        purpose: `${displayTitle} refurbishment`,
      },
    ],
    likelyWorks: detectedItems.map((item) => ({
      category: item.category as any,
      workTitle: item.name,
      description: item.description,
      tradeRequired: item.tradeRequired,
    })),
    missingQuestions: [
      {
        id: 'finish_preferences',
        question: `Do you have specific material/paint brands selected for the ${roomLabel.toLowerCase()} (e.g. Farrow & Ball, engineered oak, LVT)?`,
        reason: 'Allows exact material costing and trade schedule finalisation.',
      },
    ],
    potentialConsiderations: [
      {
        topic: 'Trade Coordination',
        consideration: 'Single point of project management coordinates all trades to prevent handover delays.',
        riskLevel: 'low',
      },
    ],
    initialAnswers: {
      project_type: projectType,
      goals: detectedItems.map((i) => i.name),
    },
    summary: `${displayTitle} with itemised trade breakdown and 2026 London rates.`,
    estimatedTimelineWeeks: { min: weeksMin, max: weeksMax },
  };
}

/**
 * Server-side AI Project Analyzer
 * Combines LLM Natural Language Understanding with the Multi-Trade Itemised Quantity Surveyor Engine
 */
export async function analyzeProjectWithAI(prompt: string): Promise<ExtractedProject> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  // 1. Run our deterministic multi-trade itemised engine first
  const ruleEngineResult = extractWithUKBuildingRules(prompt);

  // If no external LLM key is configured, return the multi-trade QS engine output immediately
  if (!apiKey) {
    return ruleEngineResult;
  }

  try {
    const systemInstruction = `You are a Senior Quantity Surveyor & Construction Estimator for ST CONTRACTORS in London.
Analyze the homeowner's project description: "${prompt}".

The baseline itemised breakdown is:
- Project: ${ruleEngineResult.projectTypeDisplay}
- Cost: ${ruleEngineResult.costEstimate?.formatted}
- Trades: ${ruleEngineResult.likelyWorks?.map(w => w.workTitle).join(', ')}

Return ONLY valid JSON matching this exact structure:
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

CRITICAL RULES:
1. ONLY include trades that the user actually asked for or that are directly required for that work. Never hallucinate unrelated rooms, structural beams, or kitchen cabinets for a bedroom.
2. If the user asks for painting, new flooring, and spotlights, the trades are Painter, Flooring Fitter, and Electrician. Cost is ~£2,500 - £5,000, NOT £50,000!`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemInstruction }],
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
      return ruleEngineResult;
    }

    const data = await response.json();
    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return ruleEngineResult;

    const parsed = JSON.parse(rawJson);

    return {
      ...ruleEngineResult,
      generalDescription: parsed.generalDescription || ruleEngineResult.generalDescription,
      costEstimate: parsed.costEstimate?.low ? parsed.costEstimate : ruleEngineResult.costEstimate,
      customSpecifications: parsed.customSpecifications?.length ? parsed.customSpecifications : ruleEngineResult.customSpecifications,
      thingsToConsider: parsed.thingsToConsider?.length ? parsed.thingsToConsider : ruleEngineResult.thingsToConsider,
      tradePhaseBreakdown: parsed.tradePhaseBreakdown?.length ? parsed.tradePhaseBreakdown : ruleEngineResult.tradePhaseBreakdown,
    };
  } catch (error) {
    console.error('Error in Gemini Assistant API, using multi-trade QS engine:', error);
    return ruleEngineResult;
  }
}
