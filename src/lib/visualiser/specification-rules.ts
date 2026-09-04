/**
 * Project Specification Builder Engine
 * Generates room-by-room, trade-isolated editable specification trees with 3 finish tiers:
 * Standard, Enhanced, and Bespoke, supporting individual mix-and-match and "Not decided" state.
 * Complies with BUILD_SPEC.md and Phase 7B Specification.
 */

import { SpecificationNode, FinishTier, ProjectCategoryType, FinishTierDefinition } from '@/types/visualiser-scope';

export const MASTER_FINISH_TIERS: FinishTierDefinition[] = [
  {
    tier: 'standard',
    label: 'Standard Spec',
    tagline: 'Quality, durable specification using well-selected standard products',
    summary: 'Reliable, trade-certified materials and straightforward detailing delivering excellent value and durability.',
    keyFeatures: [
      'Good-quality stock cabinetry with soft-close mechanisms',
      '20mm polished Silestone quartz or high-grade solid laminate',
      'Straight-laid engineered oak or 600x600mm porcelain tiles',
      'Quality trade emulsion (Dulux Diamond Matt) & LED downlights',
    ],
    materialPalette: ['Stock Painted Shaker', '20mm White Quartz', 'Engineered Oak Plank', 'Brushed Chrome Fittings'],
    indicativeMultiplier: 1.0,
  },
  {
    tier: 'enhanced',
    label: 'Enhanced Spec',
    tagline: 'Improved materials, fixtures, design detailing and customisation',
    summary: 'Upgraded designer materials, larger format porcelain, smart lighting, and custom joinery detailing.',
    keyFeatures: [
      'Bespoke in-frame or contemporary handleless German cabinetry',
      '30mm Calacatta quartz or Dekton sintered stone worktops',
      'Prime herringbone engineered oak or 1200x600mm Italian porcelain',
      'Designer paint palette (Farrow & Ball / Little Greene) & smart dimming',
      'Quooker instant boiling water tap & integrated appliance package',
    ],
    materialPalette: ['In-Frame Shaker', '30mm Calacatta Gold Quartz', 'Herringbone European Oak', 'Brushed Brass Hardware'],
    indicativeMultiplier: 1.35,
  },
  {
    tier: 'bespoke',
    label: 'Bespoke Luxury',
    tagline: 'Premium materials, specialist detailing and custom-built elements',
    summary: 'Master craftsman joinery, seamless microcement, architectural lighting design, and professional appliances.',
    keyFeatures: [
      'Fully custom solid timber cabinetry with dovetail drawers & pantries',
      'Bookmatched natural marble, quartzite, or ultra-compact Dekton',
      'Seamless microcement or chevron French oak parquet flooring',
      'Architectural plastered-in trimless downlights & coffer LED scenes',
      'Gaggenau / Miele MasterCool / Bora Professional induction suite',
    ],
    materialPalette: ['Custom Walnut / Fluted Timber', 'Bookmatched Quartzite', 'Seamless Microcement', 'Plaster-in Architectural LED'],
    indicativeMultiplier: 1.75,
  },
];

export function buildSpecificationTree(
  projectTypes: ProjectCategoryType[],
  spaces: { id: string; name: string }[],
  globalTier: FinishTier = 'enhanced'
): SpecificationNode[] {
  const nodes: SpecificationNode[] = [];
  const primarySpace = spaces[0] || { id: 'room-1', name: 'Main Project Space' };

  const isKitchen = projectTypes.includes('kitchen-renovation');
  const isBathroom = projectTypes.includes('bathroom-renovation');
  const isExtension = projectTypes.includes('extension');
  const isDriveway = projectTypes.includes('driveway');
  const isJoinery = projectTypes.includes('joinery');
  const isBedroomOrDecorating = projectTypes.includes('bedroom') || projectTypes.includes('decorating');
  const isDoorReplacement = projectTypes.includes('door-replacement');
  const isCinema = projectTypes.includes('cinema-room');

  // =========================================================================
  // DRIVEWAY SPECIFICATIONS
  // =========================================================================
  if (isDriveway) {
    nodes.push(
      {
        id: 'spec-driveway-surface',
        roomId: primarySpace.id,
        element: 'Driveway Surface Material',
        trade: 'Groundworks & Paving',
        selectedOption: globalTier === 'bespoke' ? 'Natural Granite Setts & Resin-Bound Quartz Mix' : globalTier === 'enhanced' ? 'UV-Stable Resin-Bound Aggregate with Block Border' : 'Permeable Concrete Block Paving (Marshalls Tegula)',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Permeable Concrete Block Paving (Marshalls Tegula)', tier: 'standard', description: 'Hardwearing permeable concrete block paving with MOT Type 3 sub-base complying with SuDS regulations.', costImpact: 'Included in Standard' },
          { name: 'UV-Stable Resin-Bound Aggregate with Block Border', tier: 'enhanced', description: 'Smooth, seamless polyurethane resin bound gravel over open-textured tarmac base.', costImpact: '+£1,500 – £2,800' },
          { name: 'Natural Granite Setts & Resin-Bound Quartz Mix', tier: 'bespoke', description: 'Hand-dressed silver-grey Portuguese granite setts with custom radius aprons and concealed ACO drainage.', costImpact: '+£3,500 – £6,500' },
        ],
      },
      {
        id: 'spec-driveway-drainage',
        roomId: primarySpace.id,
        element: 'Surface Water Drainage (SuDS)',
        trade: 'Groundworks Drainage',
        selectedOption: globalTier === 'bespoke' ? 'Concealed Slot Drain Channels with Underground Soakaway Crate System' : globalTier === 'enhanced' ? 'High-Capacity ACO HexDrain with Silt Trap to Soakaway' : 'Standard Fall to Permeable Sub-Base Grating',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Standard Fall to Permeable Sub-Base Grating', tier: 'standard', description: 'Gravity fall directing surface runoff into permeable sub-base layer.', costImpact: 'Included in Standard' },
          { name: 'High-Capacity ACO HexDrain with Silt Trap to Soakaway', tier: 'enhanced', description: 'Discrete composite channel drainage with inline debris basket connected to geotextile soakaway.', costImpact: '+£650 – £1,100' },
          { name: 'Concealed Slot Drain Channels with Underground Soakaway Crate System', tier: 'bespoke', description: 'Architectural stainless steel brickslot drains flush with driveway threshold.', costImpact: '+£1,400 – £2,400' },
        ],
      }
    );
    return nodes;
  }

  // =========================================================================
  // JOINERY SPECIFICATIONS (FITTED WARDROBES)
  // =========================================================================
  if (isJoinery) {
    nodes.push(
      {
        id: 'spec-joinery-carcass',
        roomId: primarySpace.id,
        element: 'Wardrobe Carcass & External Doors',
        trade: 'Bespoke Joinery',
        selectedOption: globalTier === 'bespoke' ? 'Handmade Solid Oak / Fluted Walnut with Integrated Warm LED Lighting' : globalTier === 'enhanced' ? 'Floor-to-Ceiling Custom Painted Shaker / Fluted MDF with Blum Tip-On' : 'Made-to-Measure Egger MFC Carcasses with Soft-Close Hinges',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Made-to-Measure Egger MFC Carcasses with Soft-Close Hinges', tier: 'standard', description: '18mm textured melamine faced board with hanging rails and adjustable shelves.', costImpact: 'Included in Standard' },
          { name: 'Floor-to-Ceiling Custom Painted Shaker / Fluted MDF with Blum Tip-On', tier: 'enhanced', description: 'Bespoke moisture-resistant MDF, factory spray painted to Little Greene / Farrow & Ball palette.', costImpact: '+£1,200 – £2,400' },
          { name: 'Handmade Solid Oak / Fluted Walnut with Integrated Warm LED Lighting', tier: 'bespoke', description: 'Real timber veneer internal drawers, dovetail construction, fluted glass door inserts, and sensor LEDs.', costImpact: '+£3,200 – £5,800' },
        ],
      },
      {
        id: 'spec-joinery-internals',
        roomId: primarySpace.id,
        element: 'Internal Storage Configuration',
        trade: 'Cabinet Making',
        selectedOption: globalTier === 'bespoke' ? 'Velvet-Lined Jewellery Drawers, Pull-Out Shoe Racks & Automated Lighting' : globalTier === 'enhanced' ? 'Integrated Soft-Close Drawer Stacks & Dual-Height Hanging Rails' : 'Standard Fixed Shelves & Chrome Wardrobe Hanging Rails',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Standard Fixed Shelves & Chrome Wardrobe Hanging Rails', tier: 'standard', description: 'Basic functional interior with fixed shelving and hanging bars.', costImpact: 'Included in Standard' },
          { name: 'Integrated Soft-Close Drawer Stacks & Dual-Height Hanging Rails', tier: 'enhanced', description: 'Internal 3-drawer chests, adjustable shoe shelving, and soft-close pull-out trouser racks.', costImpact: '+£600 – £1,200' },
          { name: 'Velvet-Lined Jewellery Drawers, Pull-Out Shoe Racks & Automated Lighting', tier: 'bespoke', description: 'Handcrafted velvet organiser compartments, LED concealed profile strips on door triggers.', costImpact: '+£1,500 – £2,800' },
        ],
      }
    );
    return nodes;
  }

  // =========================================================================
  // DOOR REPLACEMENT SPECIFICATIONS
  // =========================================================================
  if (isDoorReplacement) {
    nodes.push(
      {
        id: 'spec-front-door',
        roomId: primarySpace.id,
        element: 'Front Entrance Door & Frame',
        trade: 'Joinery & Security',
        selectedOption: globalTier === 'bespoke' ? 'Bespoke Solid Accoya Timber Door with Banham Multi-Point Security Suite' : globalTier === 'enhanced' ? 'Architectural Solid-Core Composite Door with Heritage Glazing & High-Security Lock' : 'Standard High-Grade Composite Door (PAS 24 Certified)',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Standard High-Grade Composite Door (PAS 24 Certified)', tier: 'standard', description: '44mm composite door leaf with police-approved multi-point locking system and standard chrome furniture.', costImpact: 'Included in Standard' },
          { name: 'Architectural Solid-Core Composite Door with Heritage Glazing & High-Security Lock', tier: 'enhanced', description: '48mm solid timber core composite, custom heritage colours, etched double glazing, and brushed brass ironmongery.', costImpact: '+£850 – £1,500' },
          { name: 'Bespoke Solid Accoya Timber Door with Banham Multi-Point Security Suite', tier: 'bespoke', description: 'Handcrafted solid Accoya timber entrance door with bespoke stained glass fanlight, Banham locks, and smart intercom.', costImpact: '+£2,400 – £4,500' },
        ],
      }
    );
    return nodes;
  }

  // =========================================================================
  // KITCHEN SPECIFICATIONS
  // =========================================================================
  if (isKitchen) {
    nodes.push(
      {
        id: 'spec-cabinetry',
        roomId: primarySpace.id,
        element: 'Cabinetry & Doors',
        trade: 'Kitchen Fitting & Joinery',
        selectedOption: globalTier === 'bespoke' ? 'Custom Painted In-Frame Shaker with Oak Dovetail Drawers' : globalTier === 'enhanced' ? 'High-Spec Painted Shaker with Blum Soft-Close' : 'Quality Stock Modular Cabinets with Soft-Close',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Quality Stock Modular Cabinets with Soft-Close', tier: 'standard', description: '18mm rigid carcasses with durable painted finish and soft-close hinges.', costImpact: 'Included in Standard' },
          { name: 'High-Spec Painted Shaker with Blum Soft-Close', tier: 'enhanced', description: 'Factory-finished 19mm moisture-resistant MDF with Blum Legrabox drawer systems and internal cutlery inserts.', costImpact: '+£3,500 – £5,500' },
          { name: 'Custom Painted In-Frame Shaker with Oak Dovetail Drawers', tier: 'bespoke', description: 'Handmade solid hardwood frames, solid oak dovetailed drawer boxes, and custom pantry larders.', costImpact: '+£8,000 – £14,000' },
        ],
      },
      {
        id: 'spec-worktops',
        roomId: primarySpace.id,
        element: 'Kitchen Worktops & Island Surface',
        trade: 'Stone Masonry',
        selectedOption: globalTier === 'bespoke' ? '30mm Calacatta Quartzite / Dekton Sintered Stone' : globalTier === 'enhanced' ? '20mm/30mm Calacatta Gold Silestone Quartz' : '20mm Polished Solid White Quartz',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: '20mm Polished Solid White Quartz', tier: 'standard', description: 'Hardwearing, non-porous engineered quartz with standard pencil edge profile.', costImpact: 'Included in Standard' },
          { name: '20mm/30mm Calacatta Gold Silestone Quartz', tier: 'enhanced', description: 'Prominent gold/grey marble veining with double pencil round edge and recessed drainer grooves.', costImpact: '+£1,400 – £2,600' },
          { name: '30mm Calacatta Quartzite / Dekton Sintered Stone', tier: 'bespoke', description: '100% heat-proof, UV-proof ultra-compact stone with mitred 50mm waterfall edges on island.', costImpact: '+£3,500 – £6,000' },
        ],
      },
      {
        id: 'spec-appliances',
        roomId: primarySpace.id,
        element: 'Cooking Appliances & Extraction',
        trade: 'Appliance Commissioning',
        selectedOption: globalTier === 'bespoke' ? 'Bora Professional Downdraft Induction + Miele Dual Oven Suite' : globalTier === 'enhanced' ? 'Siemens StudioLine / Neff Slide&Hide + Central Downdraft Hob' : 'Bosch Series 4 Induction Hob & Integrated Oven',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Bosch Series 4 Induction Hob & Integrated Oven', tier: 'standard', description: 'Dependable mid-tier appliance suite with 60cm induction and standard extractor.', costImpact: 'Included in Standard' },
          { name: 'Siemens StudioLine / Neff Slide&Hide + Central Downdraft Hob', tier: 'enhanced', description: '7.4kW central downdraft induction cooktop (no overhead hood needed) and pyrolytic self-cleaning oven.', costImpact: '+£2,800 – £4,500' },
          { name: 'Bora Professional Downdraft Induction + Miele Dual Oven Suite', tier: 'bespoke', description: 'Professional-grade oversized induction with heavy stainless steel control dials and Miele steam ovens.', costImpact: '+£7,000 – £12,000' },
        ],
      }
    );
  }

  // =========================================================================
  // BATHROOM SPECIFICATIONS
  // =========================================================================
  if (isBathroom) {
    nodes.push(
      {
        id: 'spec-sanitaryware',
        roomId: primarySpace.id,
        element: 'Sanitaryware & Wall-Hung WC',
        trade: 'Plumbing & Sanitaryware',
        selectedOption: globalTier === 'bespoke' ? 'Lusso Stone Fluted Freestanding Basin + Geberit AquaClean WC' : globalTier === 'enhanced' ? 'Geberit Concealed Frame with Rimless Wall-Hung Pan' : 'Standard Close-Coupled Quality Ceramic WC Suite',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Standard Close-Coupled Quality Ceramic WC Suite', tier: 'standard', description: 'Durable white vitreous china with soft-close seat and dual-flush cistern.', costImpact: 'Included in Standard' },
          { name: 'Geberit Concealed Frame with Rimless Wall-Hung Pan', tier: 'enhanced', description: 'Steel in-wall concealed cistern frame with floating pan and matte black flush plate.', costImpact: '+£650 – £1,100' },
          { name: 'Lusso Stone Fluted Freestanding Basin + Geberit AquaClean WC', tier: 'bespoke', description: 'Cast stone composite basin and smart bidet toilet with heated seat and warm air drying.', costImpact: '+£2,400 – £4,500' },
        ],
      },
      {
        id: 'spec-shower',
        roomId: primarySpace.id,
        element: 'Shower System & Enclosure',
        trade: 'Plumbing & Waterproofing',
        selectedOption: globalTier === 'bespoke' ? 'Concealed Thermostatic 3-Way Valve with 350mm Ceiling Rain Head & Frameless Glass' : globalTier === 'enhanced' ? 'Concealed 2-Way Thermostatic Shower with Brushed Brass Trim' : 'Exposed Thermostatic Chrome Bar Shower with Slider Rail',
        finishTier: globalTier,
        status: 'selected',
        availableOptions: [
          { name: 'Exposed Thermostatic Chrome Bar Shower with Slider Rail', tier: 'standard', description: 'Reliable thermostatic mixer with overhead drencher and handheld spray.', costImpact: 'Included in Standard' },
          { name: 'Concealed 2-Way Thermostatic Shower with Brushed Brass Trim', tier: 'enhanced', description: 'In-wall solid brass valve with 250mm flush rain head and handheld pencil spray.', costImpact: '+£750 – £1,400' },
          { name: 'Concealed Thermostatic 3-Way Valve with 350mm Ceiling Rain Head & Frameless Glass', tier: 'bespoke', description: 'Triple outlet concealed valve with body jets, ceiling rain plate, and 10mm fluted glass screen.', costImpact: '+£1,800 – £3,200' },
        ],
      }
    );
  }

  // =========================================================================
  // FLOORING & LIGHTING (FOR LIVING, BEDROOM, EXTENSION, KITCHEN)
  // =========================================================================
  nodes.push(
    {
      id: 'spec-flooring',
      roomId: primarySpace.id,
      element: 'Flooring Material',
      trade: 'Flooring Specialist',
      selectedOption: globalTier === 'bespoke' ? 'Seamless Architectural Microcement / French Chevron Parquet' : globalTier === 'enhanced' ? 'Prime European Engineered Oak Herringbone Parquet' : '14mm Straight-Plank Engineered Oak / 600x600 Porcelain',
      finishTier: globalTier,
      status: 'selected',
      availableOptions: [
        { name: '14mm Straight-Plank Engineered Oak / 600x600 Porcelain', tier: 'standard', description: 'Durable multi-ply engineered oak or rectified ceramic tiles.', costImpact: 'Included in Standard' },
        { name: 'Prime European Engineered Oak Herringbone Parquet', tier: 'enhanced', description: 'Brushed and oiled 18mm herringbone blocks with double perimeter border.', costImpact: '+£1,200 – £2,200' },
        { name: 'Seamless Architectural Microcement / French Chevron Parquet', tier: 'bespoke', description: 'Grout-free continuous polymer microcement or hand-scraped chevron parquet.', costImpact: '+£2,600 – £4,800' },
      ],
    },
    {
      id: 'spec-lighting',
      roomId: primarySpace.id,
      element: 'Architectural Lighting & Controls',
      trade: 'Electrical (Part P)',
      selectedOption: globalTier === 'bespoke' ? 'Lutron Smart Scene Lighting with Trimless Plaster-in Downlights & LED Coffers' : globalTier === 'enhanced' ? 'Layered Warm LED Circuits with Trailing-Edge Dimmers & Niche LEDs' : 'Fire-Rated Warm White (2700K) LED Downlights',
      finishTier: globalTier,
      status: 'selected',
      availableOptions: [
        { name: 'Fire-Rated Warm White (2700K) LED Downlights', tier: 'standard', description: 'High-CRI energy efficient LED downlights with standard white bezels.', costImpact: 'Included in Standard' },
        { name: 'Layered Warm LED Circuits with Trailing-Edge Dimmers & Niche LEDs', tier: 'enhanced', description: 'Dual-switched task and ambient circuits, island pendant feeds, and concealed LED strip glows.', costImpact: '+£850 – £1,500' },
        { name: 'Lutron Smart Scene Lighting with Trimless Plaster-in Downlights & LED Coffers', tier: 'bespoke', description: 'Architectural flush plaster-in spotlights, smart keypad scenes, and linear perimeter ceiling wash lights.', costImpact: '+£2,400 – £4,500' },
      ],
    }
  );

  // =========================================================================
  // GLAZING (FOR EXTENSIONS)
  // =========================================================================
  if (isExtension) {
    nodes.push({
      id: 'spec-glazing',
      roomId: primarySpace.id,
      element: 'Rear Glazing & Doors',
      trade: 'Glazing Fabrication',
      selectedOption: globalTier === 'bespoke' ? 'Ultra-Slim 20mm Sightline Sliding Glass with Flush Track' : globalTier === 'enhanced' ? 'Thermally Broken Aluminium Slimline Bifolds (3–4 panels)' : 'Standard Aluminium Bifold Doors (55mm sightlines)',
      finishTier: globalTier,
      status: 'selected',
      availableOptions: [
        { name: 'Standard Aluminium Bifold Doors (55mm sightlines)', tier: 'standard', description: 'Thermally efficient powder-coated aluminium bifolds with standard threshold.', costImpact: 'Included in Standard' },
        { name: 'Thermally Broken Aluminium Slimline Bifolds (3–4 panels)', tier: 'enhanced', description: 'Slimmer profiles with low-E solar control glass and integrated flush trickle vents.', costImpact: '+£1,200 – £2,000' },
        { name: 'Ultra-Slim 20mm Sightline Sliding Glass with Flush Track', tier: 'bespoke', description: 'Minimalist sliding panels with recessed drainage channels for 100% flush threshold into patio.', costImpact: '+£3,200 – £5,800' },
      ],
    });
  }

  return nodes;
}
