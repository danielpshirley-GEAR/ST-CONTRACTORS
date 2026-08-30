/**
 * MASTER CALCULATOR REGISTRY
 * 20 Standalone Trade & Project Cost Calculators with Full SEO Strategy
 * Conforms to GEMINI.md Section 7, 8, 9, 11, 12 & BUILD_SPEC.md Section 20-23
 */

import { CalculatorDefinition } from './types';
import {
  calculateBricks,
  calculateBlocks,
  calculateConcrete,
  calculateTiles,
  calculatePaint,
  calculatePlasterboardAndSkim,
  calculatePatio,
  calculateDecking,
  calculateFencing,
  calculateGravel,
  calculateTurf,
} from './quantity-engine';
import {
  calculateTradeCostRange,
  LABOUR_RATES,
  MATERIAL_PRICES,
  PROJECT_M2_GUIDE_RATES,
  FINISH_MULTIPLIERS,
} from './pricing-engine';

export const MASTER_CALCULATORS: CalculatorDefinition[] = [
  // =========================================================================
  // 1. BRICK CALCULATOR
  // =========================================================================
  {
    id: 'brick-calculator',
    slug: 'brick-calculator',
    name: 'Brick Quantity, Mortar & Cost Calculator UK',
    shortTitle: 'Brick Calculator',
    tagline: 'Calculate exact facing bricks, mortar sand, and cement for walls and extensions.',
    description: 'Free UK brick calculator. Accurately estimate standard UK facing bricks (215 x 102.5 x 65mm), mortar bags, and trade costs for single skin, double skin, and cavity walls.',
    category: 'trade_material',
    badge: 'Masonry & Shell',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15, 20],
    inputs: [
      {
        id: 'lengthM',
        label: 'Wall Length',
        helperText: 'Total horizontal length of the brickwork run',
        type: 'number',
        defaultValue: 6.0,
        min: 0.5,
        max: 100,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'heightM',
        label: 'Wall Height',
        helperText: 'Total vertical height of the wall',
        type: 'number',
        defaultValue: 2.4,
        min: 0.5,
        max: 20,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'wallType',
        label: 'Wall Thickness / Type',
        type: 'select',
        defaultValue: 'single_skin',
        options: [
          { value: 'single_skin', label: 'Single Skin (Half Brick / 102.5mm thick)', desc: 'Standard garden walls, external skin of cavity wall (60 bricks/m²)' },
          { value: 'double_skin', label: 'Double Skin (One Brick Solid / 215mm thick)', desc: 'Solid retaining walls, load-bearing 9" walls (120 bricks/m²)' },
        ],
      },
      {
        id: 'deductionsM2',
        label: 'Window & Door Deductions',
        helperText: 'Total area of openings to subtract',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 50,
        step: 0.5,
        unit: 'm2',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const length = Number(inputs.lengthM) || 6;
      const height = Number(inputs.heightM) || 2.4;
      const wallType = inputs.wallType === 'double_skin' ? 'double_skin' : 'single_skin';
      const deductions = Number(inputs.deductionsM2) || 0;

      const q = calculateBricks(length, height, wallType, deductions, wastePercent);
      const bricksPerM2 = wallType === 'single_skin' ? 60 : 120;

      return {
        primaryValue: q.totalBricks,
        primaryUnit: 'Bricks',
        formattedPrimary: `${q.totalBricks.toLocaleString()} Bricks`,
        primaryLabel: 'Total Facing Bricks Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteBricks,
        materials: [
          { name: 'Standard UK Facing Bricks (215×102.5×65mm)', quantity: q.totalBricks, unit: 'bricks', formattedQuantity: `${q.totalBricks.toLocaleString()} units`, notes: `Includes ${q.wasteBricks} extra bricks (${wastePercent}% cutting waste)` },
          { name: 'Building Sand (Mortar)', quantity: q.mortarSandBags, unit: '25kg bags', formattedQuantity: `${q.mortarSandBags} × 25kg bags`, notes: 'Class M4 mortar mix (approx. 4:1 ratio)' },
          { name: 'Mastercrete / Portland Cement', quantity: q.cementBags, unit: '25kg bags', formattedQuantity: `${q.cementBags} × 25kg bags`, notes: 'Standard CEM II cement' },
        ],
        assumptions: [
          `Calculated for standard UK metric brick size: 215mm length × 102.5mm width × 65mm height with 10mm mortar joint.`,
          `Net wall surface area: ${q.netAreaM2} m² (${bricksPerM2} bricks per m²).`,
          `Includes ${wastePercent}% allowance for cuts around corners, reveals, and breakages.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const bricksCount = qResult.primaryValue;
      const bricksCostLow = (bricksCount / 1000) * MATERIAL_PRICES.facingBrickPer1000.low;
      const bricksCostHigh = (bricksCount / 1000) * MATERIAL_PRICES.facingBrickPer1000.high;
      const mortarCost = (bricksCount / 50) * 5;

      const matLow = bricksCostLow + mortarCost;
      const matHigh = bricksCostHigh + mortarCost;

      const daysLow = Math.max(1, bricksCount / 500);
      const daysHigh = Math.max(1, bricksCount / 400);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.bricklayerDayRate);
    },
    assumptions: [
      'Standard UK metric bricks: 215mm x 102.5mm x 65mm.',
      '10mm mortar bed and perp joints throughout.',
      'Single skin assumes half-brick stretcher bond (60 bricks/m²).',
    ],
    howItWorks: {
      title: 'How to Calculate Bricks for a Wall in the UK',
      paragraphs: [
        'In the UK construction industry, standard metric facing bricks measure 215mm in length, 102.5mm in width, and 65mm in height. When laid with a standard 10mm mortar bed and perpendicular joint, each coordinating brick unit occupies 225mm × 75mm of face area.',
        'This standard geometry results in exactly 59.26 bricks per square meter of single-skin brickwork, which is rounded up to 60 bricks per m² by structural engineers and quantity surveyors.',
        'For a double-skin (one-brick thick or 9-inch solid wall) or a cavity wall with outer and inner brick skins, double the requirement to 120 bricks per square meter.',
      ],
    },
    costBenchmarkTable: {
      title: 'Current UK Bricklaying & Material Cost Benchmarks (2025/2026)',
      description: 'Typical supply and installation rates across London, the South East, and UK national regions.',
      rows: [
        { item: 'Standard Red/Buff Facing Bricks (per 1,000)', unitCost: '£750 – £1,100', notes: 'Machine-made wirecut bricks' },
        { item: 'Handmade / Reclaimed Imperial Bricks (per 1,000)', unitCost: '£1,200 – £1,850', notes: 'For period restorations and heritage areas' },
        { item: 'Building Sand (25kg bag)', unitCost: '£3.50 – £4.80', notes: 'Washed soft building sand for mortar' },
        { item: 'Portland / Mastercrete Cement (25kg bag)', unitCost: '£6.50 – £8.50', notes: 'General purpose CEM II cement' },
        { item: 'Bricklayer + Labourer Day Rate', unitCost: '£350 – £480 / day', notes: 'Laying approx 400–500 bricks per day' },
      ],
    },
    commonMistakes: {
      title: 'Common Mistakes When Ordering Bricks',
      points: [
        { title: 'Forgetting Mortar Joint Width', desc: 'Calculating purely on brick dimensions without the 10mm mortar allowance will result in ordering 25% too many bricks.' },
        { title: 'Underestimating Cutting Waste on Gables', desc: 'Standard rectangular walls require 10% waste, but triangular gable walls or complex reveals need 15% due to diagonal offcuts.' },
        { title: 'Ordering in Multiple Batches', desc: 'Bricks manufactured in different kiln batches often have subtle shade variations. Always order the full quantity plus waste in a single batch.' },
      ],
    },
    buildingRegulations: {
      title: 'UK Building Regulations & Structural Standards',
      points: [
        { title: 'Part A (Structure)', desc: 'Freestanding garden walls over 1m high adjacent to highways or 2m elsewhere require structural stability checks. Cavity walls require certified stainless steel wall ties spaced at 900mm horizontal by 450mm vertical centers.' },
        { title: 'Part C (Moisture Resistance)', desc: 'A compliant Damp Proof Course (DPC) must be installed at least 150mm above finished ground level.' },
      ],
    },
    faqs: [
      {
        question: 'How many bricks are there in 1 square meter?',
        answer: 'In the UK, standard metric brickwork requires 60 bricks per square meter for a single skin (half-brick / 102.5mm thick) wall, and 120 bricks per square meter for a solid double skin (one-brick / 215mm thick) wall, including standard 10mm mortar joints.',
      },
      {
        question: 'How much sand and cement do I need for 1,000 bricks?',
        answer: 'For 1,000 standard facing bricks laid in a 1:4 mortar mix, you will need approximately 1 tonne (or 40 x 25kg bags) of building sand and 8 to 10 x 25kg bags of cement.',
      },
      {
        question: 'How much waste should I allow when buying bricks?',
        answer: 'We recommend adding 10% waste for standard rectangular walls. If your project involves intricate arches, decorative soldier courses, or complex gables, allow 15% to cover breakages and offcuts.',
      },
      {
        question: 'How many bricks can a professional bricklayer lay in a day?',
        answer: 'A qualified UK bricklayer working with a dedicated hod carrier or labourer typically lays between 400 and 500 facing bricks per day on straight runs, or 250 to 350 bricks per day on intricate corners, openings, and architectural detailing.',
      },
    ],
    relatedCalculators: ['block-calculator', 'concrete-calculator', 'extension-cost-calculator'],
    relatedProjectType: 'extension',
    relatedServices: [
      { title: 'House Extensions', href: '/services/extensions', desc: 'Single-storey, side return and wraparound extensions' },
      { title: 'Structural Alterations', href: '/services/renovations', desc: 'Load-bearing wall removal and steel beam installation' },
    ],
    commercialCta: {
      title: 'Planning a Brickwork or House Extension Project?',
      description: 'You have calculated your bricks. Now let our construction team review your architectural drawings and estimate your complete extension with fixed-price structural management.',
      buttonText: 'Plan My Extension Project →',
      buttonHref: '/plan-my-project?type=extension',
    },
    seo: {
      title: 'Brick Calculator UK | How Many Bricks Do I Need? (Free Tool)',
      description: 'Free UK brick calculator. Calculate exact facing bricks, mortar sand, cement bags and cost estimates for single and double skin walls with waste allowance.',
      keywords: ['brick calculator uk', 'how many bricks per m2', 'calculate bricks', 'brick mortar calculator', 'facing brick estimator'],
    },
  },

  // =========================================================================
  // 2. BLOCKWORK CALCULATOR
  // =========================================================================
  {
    id: 'block-calculator',
    slug: 'block-calculator',
    name: 'Blockwork & Concrete Block Calculator UK',
    shortTitle: 'Block Calculator',
    tagline: 'Calculate standard 440 x 215mm thermalite and concrete blocks for walls and foundations.',
    description: 'Free UK building block calculator. Compute exact quantities of standard UK blocks (440 x 215 x 100mm), mortar sand, and cement for internal partitions, foundations, and extensions.',
    category: 'trade_material',
    badge: 'Masonry & Shell',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Wall Length',
        type: 'number',
        defaultValue: 6.0,
        min: 0.5,
        max: 100,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'heightM',
        label: 'Wall Height',
        type: 'number',
        defaultValue: 2.4,
        min: 0.5,
        max: 20,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'deductionsM2',
        label: 'Openings / Deductions',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 50,
        step: 0.5,
        unit: 'm2',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const length = Number(inputs.lengthM) || 6;
      const height = Number(inputs.heightM) || 2.4;
      const deductions = Number(inputs.deductionsM2) || 0;

      const q = calculateBlocks(length, height, deductions, wastePercent);

      return {
        primaryValue: q.totalBlocks,
        primaryUnit: 'Blocks',
        formattedPrimary: `${q.totalBlocks.toLocaleString()} Blocks`,
        primaryLabel: 'Total Building Blocks Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteBlocks,
        materials: [
          { name: 'Standard UK Blocks (440×215×100mm)', quantity: q.totalBlocks, unit: 'blocks', formattedQuantity: `${q.totalBlocks.toLocaleString()} blocks`, notes: `Includes ${q.wasteBlocks} extra blocks for cuts (${wastePercent}% waste)` },
          { name: 'Building Sand (Mortar)', quantity: q.mortarSandBags, unit: '25kg bags', formattedQuantity: `${q.mortarSandBags} × 25kg bags`, notes: 'Mortar bed and vertical perp joints' },
          { name: 'Cement (25kg)', quantity: q.cementBags, unit: '25kg bags', formattedQuantity: `${q.cementBags} × 25kg bags`, notes: 'Standard trade cement' },
        ],
        assumptions: [
          `Calculated for standard UK block: 440mm length × 215mm height × 100mm thickness (10 blocks per m²).`,
          `Net wall surface area: ${q.netAreaM2} m².`,
          `Includes ${wastePercent}% allowance for corner interlocks and cutting.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const blocksCount = qResult.primaryValue;
      const matLow = blocksCount * MATERIAL_PRICES.denseConcreteBlockPerUnit.low + (blocksCount / 12) * 5;
      const matHigh = blocksCount * MATERIAL_PRICES.aeratedBlockPerUnit.high + (blocksCount / 12) * 7;
      const daysLow = Math.max(1, blocksCount / 120);
      const daysHigh = Math.max(1, blocksCount / 90);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.bricklayerDayRate);
    },
    assumptions: ['Standard 440mm x 215mm x 100mm UK block dimension.', '10 blocks per square meter.', '10mm mortar joints.'],
    howItWorks: {
      title: 'How Block Calculations Work in the UK',
      paragraphs: [
        'Standard UK building blocks (including dense concrete, lightweight aggregate, and aerated Celcon/Thermalite blocks) measure 440mm long by 215mm high.',
        'With a 10mm mortar joint, one block occupies a coordinating face of 450mm × 225mm (0.10125 m²). This equals exactly 9.88 blocks per square meter, standardized as 10 blocks per m².',
      ],
    },
    costBenchmarkTable: {
      title: 'UK Blockwork Material & Installation Costs',
      description: 'Typical unit costs for standard 100mm blockwork in the UK.',
      rows: [
        { item: 'Dense Concrete 7N Blocks (each)', unitCost: '£1.80 – £2.80', notes: 'Load-bearing foundations & retaining walls' },
        { item: 'Aerated Thermalite / Celcon Blocks (each)', unitCost: '£2.10 – £3.20', notes: 'High thermal performance inner skin' },
        { item: 'Bricklayer Block Laying Rate (per m²)', unitCost: '£25 – £40 / m²', notes: 'Labour only for blockwork' },
      ],
    },
    faqs: [
      {
        question: 'How many blocks do I need per square meter?',
        answer: 'Standard UK building blocks (440mm × 215mm) require exactly 10 blocks per square meter including 10mm mortar joints.',
      },
      {
        question: 'What is the difference between dense concrete and thermalite blocks?',
        answer: 'Dense concrete blocks provide high compressive strength (typically 7.3N/mm² or higher) for sub-structure foundations and acoustic party walls. Thermalite/aerated blocks are lightweight and offer superior thermal insulation (Part L compliance) for inner cavity walls.',
      },
    ],
    relatedCalculators: ['brick-calculator', 'concrete-calculator', 'plaster-calculator'],
    relatedProjectType: 'extension',
    relatedServices: [
      { title: 'House Extensions', href: '/services/extensions', desc: 'Complete structural build from foundations to finishes' },
    ],
    commercialCta: {
      title: 'Building an Extension or Knockthrough?',
      description: 'Our team handles groundworks, structural blockwork, and steel beam installations with Building Control certification.',
      buttonText: 'Plan Structural Extension →',
      buttonHref: '/plan-my-project?type=extension',
    },
    seo: {
      title: 'Block Calculator UK | How Many Blocks Per M2? (Free Tool)',
      description: 'Free UK blockwork calculator. Compute exact quantities of 440 x 215mm building blocks, mortar sand, cement and cost estimates.',
      keywords: ['block calculator uk', 'how many blocks per m2', 'breeze block calculator', 'thermalite block quantity'],
    },
  },

  // =========================================================================
  // 3. CONCRETE VOLUME CALCULATOR
  // =========================================================================
  {
    id: 'concrete-calculator',
    slug: 'concrete-calculator',
    name: 'Concrete Volume, m³ & Bag Calculator UK',
    shortTitle: 'Concrete Calculator',
    tagline: 'Calculate cubic meters (m³) of concrete, ballast, and 20kg pre-mix bags for slabs and footings.',
    description: 'Free UK concrete calculator. Calculate volume in cubic meters (m³), ready-mix lorry requirements, ballast tonnes, and 20kg pre-mix bags for foundations and floor slabs.',
    category: 'trade_material',
    badge: 'Groundworks & Slabs',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15, 20],
    inputs: [
      {
        id: 'lengthM',
        label: 'Length',
        type: 'number',
        defaultValue: 5.0,
        min: 0.5,
        max: 50,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Width',
        type: 'number',
        defaultValue: 3.0,
        min: 0.5,
        max: 50,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'depthMm',
        label: 'Depth / Thickness',
        helperText: 'Standard slab: 100mm (0.1m), Footings: 200–450mm',
        type: 'number',
        defaultValue: 100,
        min: 25,
        max: 1200,
        step: 25,
        unit: 'mm',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const length = Number(inputs.lengthM) || 5;
      const width = Number(inputs.widthM) || 3;
      const depthM = (Number(inputs.depthMm) || 100) / 1000;

      const q = calculateConcrete(length, width, depthM, wastePercent);

      return {
        primaryValue: q.finalVolumeM3,
        primaryUnit: 'm³',
        formattedPrimary: `${q.finalVolumeM3} m³`,
        primaryLabel: 'Total Concrete Volume Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: Math.round((q.finalVolumeM3 - q.baseVolumeM3) * 100) / 100,
        materials: [
          { name: 'Ready-Mix Concrete Volume (m³)', quantity: q.finalVolumeM3, unit: 'm³', formattedQuantity: `${q.finalVolumeM3} m³`, notes: q.isReadyMixRecommended ? 'Ready-mix lorry delivery recommended for volumes over 1.5m³' : 'Can be mixed on site with cement mixer' },
          { name: 'Pre-Mix Concrete Bags (20kg option)', quantity: q.preMixBags20kg, unit: '20kg bags', formattedQuantity: `${q.preMixBags20kg} bags`, notes: 'Alternative if mixing on site from pre-blended dry bags' },
          { name: 'All-In Ballast (Bulk Aggregates)', quantity: q.ballastTonnes, unit: 'tonnes', formattedQuantity: `${q.ballastTonnes} tonnes`, notes: 'Combined sharp sand and 20mm gravel' },
          { name: 'Standard Cement (25kg)', quantity: q.cementBags25kg, unit: '25kg bags', formattedQuantity: `${q.cementBags25kg} bags`, notes: 'Standard 5:1 ballast-to-cement C20 structural mix' },
        ],
        assumptions: [
          `Base geometry volume: ${q.baseVolumeM3} m³.`,
          `Includes ${wastePercent}% allowance for ground unevenness and spillage.`,
          `1 m³ of wet concrete weighs approx. 2,400 kg (2.4 tonnes).`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const vol = qResult.primaryValue;
      const matLow = vol * MATERIAL_PRICES.readyMixConcreteM3.low;
      const matHigh = vol * MATERIAL_PRICES.readyMixConcreteM3.high;
      const daysLow = Math.max(1, vol / 6);
      const daysHigh = Math.max(1, vol / 4);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.generalLabourerDayRate);
    },
    assumptions: ['Wet concrete density = 2,400 kg/m³.', 'Standard 100mm depth for non-structural slabs, 150mm for driveways.'],
    howItWorks: {
      title: 'How Concrete Volume is Calculated in Cubic Meters',
      paragraphs: [
        'To calculate concrete volume, multiply Length (in meters) × Width (in meters) × Depth (in meters) to calculate the cubic volume in m³.',
        'Because trenches and sub-bases are rarely laser flat, always add a 10% waste buffer. 1 m³ of wet concrete equals approximately 108 standard 20kg pre-mix bags or 2.4 tonnes of material.',
      ],
    },
    faqs: [
      {
        question: 'How do I calculate concrete volume?',
        answer: 'Multiply length (in meters) by width (in meters) by depth (in meters) to get volume in cubic meters (m³). Always add 10% for ground unevenness.',
      },
      {
        question: 'When should I order a ready-mix truck instead of bags?',
        answer: 'For volumes over 1.5 m³ (around 160 bags of pre-mix), ordering ready-mix concrete by truck is significantly cheaper, faster, and ensures higher structural strength.',
      },
    ],
    relatedCalculators: ['brick-calculator', 'block-calculator', 'patio-calculator', 'driveway-cost-calculator'],
    relatedProjectType: 'extension',
    commercialCta: {
      title: 'Planning Foundations or an Extension Slab?',
      description: 'Our groundworks team coordinates site excavation, building control inspection, structural steel reinforcement, and certified concrete pouring.',
      buttonText: 'Book Free Site Survey →',
      buttonHref: '/contact?type=consultation',
    },
    seo: {
      title: 'Concrete Calculator UK | Calculate m³ and 20kg Bags (Free Tool)',
      description: 'Free UK concrete calculator. Calculate exact cubic meters (m³), ballast tonnes, cement bags and 20kg pre-mix bags with waste allowance.',
      keywords: ['concrete calculator uk', 'how much concrete do i need', 'concrete m3 calculator', 'slab concrete calculator'],
    },
  },

  // =========================================================================
  // 4. TILE & GROUT CALCULATOR
  // =========================================================================
  {
    id: 'tile-calculator',
    slug: 'tile-calculator',
    name: 'Tile, Grout & Adhesive Calculator UK',
    shortTitle: 'Tile Calculator',
    tagline: 'Calculate tile count, boxes, 20kg adhesive bags, and grout kg for walls and floors.',
    description: 'Free UK tile calculator. Compute tile quantities, box numbers, rapid-set adhesive bags, and grout powder for bathroom and kitchen tiling.',
    category: 'trade_material',
    badge: 'Finishing & Tiling',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15, 20],
    inputs: [
      {
        id: 'areaM2',
        label: 'Tiling Area',
        helperText: 'Total wall or floor area to be tiled in square meters',
        type: 'number',
        defaultValue: 12.0,
        min: 0.5,
        max: 500,
        step: 0.5,
        unit: 'm2',
      },
      {
        id: 'tileLengthMm',
        label: 'Tile Length',
        type: 'number',
        defaultValue: 600,
        min: 50,
        max: 2400,
        step: 10,
        unit: 'mm',
      },
      {
        id: 'tileWidthMm',
        label: 'Tile Width',
        type: 'number',
        defaultValue: 300,
        min: 50,
        max: 1200,
        step: 10,
        unit: 'mm',
      },
      {
        id: 'groutJointMm',
        label: 'Grout Joint Width',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 0.5,
        unit: 'mm',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const area = Number(inputs.areaM2) || 12;
      const tileL = Number(inputs.tileLengthMm) || 600;
      const tileW = Number(inputs.tileWidthMm) || 300;
      const joint = Number(inputs.groutJointMm) || 3;

      const q = calculateTiles(area, tileL, tileW, joint, wastePercent);

      return {
        primaryValue: q.totalTiles,
        primaryUnit: 'Tiles',
        formattedPrimary: `${q.totalTiles.toLocaleString()} Tiles`,
        primaryLabel: 'Total Individual Tiles Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteTiles,
        materials: [
          { name: `Tiles (${tileL}×${tileW}mm)`, quantity: q.totalTiles, unit: 'tiles', formattedQuantity: `${q.totalTiles} tiles (${q.boxCount} boxes)`, notes: `Based on standard box coverage with ${wastePercent}% waste` },
          { name: 'Flexible Tile Adhesive (C2TE S1)', quantity: q.adhesiveBags20kg, unit: '20kg bags', formattedQuantity: `${q.adhesiveBags20kg} × 20kg bags`, notes: 'Coverage approx 4.5m² per 20kg bag' },
          { name: 'Flexible Anti-Mould Grout', quantity: q.groutBags5kg, unit: '5kg bags', formattedQuantity: `${q.groutBags5kg} × 5kg bags (${q.groutKg} kg total)`, notes: `Calculated for ${joint}mm joint width on ${tileL}×${tileW}mm tiles` },
        ],
        assumptions: [
          `Individual tile area: ${((tileL * tileW) / 1000000).toFixed(3)} m².`,
          `Base tiles before cuts: ${q.baseTileCount} tiles for ${q.netAreaM2} m².`,
          `Includes ${wastePercent}% cutting waste for perimeter cuts and pipe penetrations.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const area = qResult.materials[0].quantity * 0.18;
      const matLow = area * MATERIAL_PRICES.porcelainTileM2.low + 40;
      const matHigh = area * MATERIAL_PRICES.luxuryPorcelainTileM2.high + 100;
      const daysLow = Math.max(1, area / 12);
      const daysHigh = Math.max(1, area / 8);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.tilerDayRate);
    },
    assumptions: ['Standard 9mm tile thickness.', 'Flexible polymer-modified adhesive suitable for porcelain and ceramic.'],
    faqs: [
      {
        question: 'How much extra tile should I order for waste?',
        answer: 'Order 10% extra for standard square layouts. If laying tiles in herringbone or diagonal patterns, increase your waste allowance to 15% due to angular perimeter cuts.',
      },
    ],
    relatedCalculators: ['flooring-calculator', 'bathroom-cost-calculator', 'kitchen-cost-calculator'],
    relatedProjectType: 'bathroom',
    commercialCta: {
      title: 'Planning a Bathroom or Kitchen Renovation?',
      description: 'Our certified tiling specialists install Italian porcelain, large-format marble, and wetroom tanking systems with guaranteed waterproofing.',
      buttonText: 'Plan My Bathroom Renovation →',
      buttonHref: '/plan-my-project?type=bathroom',
    },
    seo: {
      title: 'Tile Calculator UK | Tile, Grout & Adhesive Quantities (Free Tool)',
      description: 'Free UK tile calculator. Calculate exact tiles, box quantities, grout kg and adhesive bags for bathrooms, kitchens and floors with waste allowance.',
      keywords: ['tile calculator uk', 'how many tiles do i need', 'grout calculator', 'tile adhesive calculator'],
    },
  },

  // =========================================================================
  // 5. PAINT & COVERAGE CALCULATOR
  // =========================================================================
  {
    id: 'paint-calculator',
    slug: 'paint-calculator',
    name: 'Paint & Coverage Calculator UK',
    shortTitle: 'Paint Calculator',
    tagline: 'Calculate exact litres of emulsion, 5L tins, and coats for walls and ceilings.',
    description: 'Free UK paint calculator. Calculate how much paint you need for any room based on dimensions, window deductions, coat count, and standard 12m²/litre trade coverage.',
    category: 'trade_material',
    badge: 'Decorating & Paint',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Room Length',
        type: 'number',
        defaultValue: 4.5,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Room Width',
        type: 'number',
        defaultValue: 3.5,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'heightM',
        label: 'Ceiling Height',
        type: 'number',
        defaultValue: 2.4,
        min: 1.8,
        max: 6,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'coats',
        label: 'Number of Coats',
        type: 'select',
        defaultValue: '2',
        options: [
          { value: '1', label: '1 Coat (Freshening existing matching color)' },
          { value: '2', label: '2 Coats (Standard quality coverage)' },
          { value: '3', label: '3 Coats (Covering dark walls with light paint)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const l = Number(inputs.lengthM) || 4.5;
      const w = Number(inputs.widthM) || 3.5;
      const h = Number(inputs.heightM) || 2.4;
      const coats = Number(inputs.coats) || 2;

      const q = calculatePaint(l, w, h, 4, coats, true);

      return {
        primaryValue: q.litresRequired,
        primaryUnit: 'Litres',
        formattedPrimary: `${q.litresRequired} Litres`,
        primaryLabel: 'Total Emulsion Paint Required',
        wasteAppliedPercent: 10,
        wasteUnitsCount: 1,
        materials: [
          { name: 'Trade Emulsion (5 Litre Tins)', quantity: q.fiveLitreTins, unit: 'tins', formattedQuantity: `${q.fiveLitreTins} × 5L tins`, notes: 'Most cost-effective tin size for rooms' },
          { name: 'Net Surface Area to Paint', quantity: q.totalAreaToPaintM2, unit: 'm²', formattedQuantity: `${q.totalAreaToPaintM2} m²`, notes: `${q.wallAreaNetM2}m² walls + ${q.ceilingAreaM2}m² ceiling (4m² deducted for doors/windows)` },
        ],
        assumptions: [
          `Standard UK trade emulsion coverage: 12 m² per litre per coat.`,
          `Applying ${coats} coats of paint.`,
          `Includes ceiling area (${q.ceilingAreaM2} m²) and standard deductions for 1 door + 1 window.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const litres = qResult.primaryValue;
      const matLow = (litres / 5) * MATERIAL_PRICES.tradeEmulsion5L.low + 25;
      const matHigh = (litres / 5) * MATERIAL_PRICES.premiumPaint5L.high + 60;
      const daysLow = 1;
      const daysHigh = 2;

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.decoratorDayRate);
    },
    assumptions: ['12m² per litre trade coverage benchmark.', 'Includes 2-coat coverage with ceiling included.'],
    faqs: [
      {
        question: 'How much paint does 1 litre cover?',
        answer: 'Standard UK vinyl matt emulsion covers approximately 10 to 12 square meters per litre for a single coat on prepared walls.',
      },
    ],
    relatedCalculators: ['plaster-calculator', 'tile-calculator', 'house-renovation-calculator'],
    relatedProjectType: 'full-renovation',
    commercialCta: {
      title: 'Full House Renovation or Turnkey Decorating?',
      description: 'Our professional decorating teams deliver flawless mist coats, woodwork spray finishing, and luxury paint application.',
      buttonText: 'Plan House Renovation →',
      buttonHref: '/plan-my-project?type=full-renovation',
    },
    seo: {
      title: 'Paint Calculator UK | How Much Paint Do I Need? (Free Tool)',
      description: 'Free UK paint calculator. Calculate exact litres of paint, 5L tins and coverage for walls and ceilings with door/window deductions.',
      keywords: ['paint calculator uk', 'how much paint for a room', 'paint coverage calculator', 'emulsion calculator'],
    },
  },

  // =========================================================================
  // 6. PLASTER & PLASTERBOARD CALCULATOR
  // =========================================================================
  {
    id: 'plaster-calculator',
    slug: 'plaster-calculator',
    name: 'Plasterboard & Multi-Finish Skim Calculator UK',
    shortTitle: 'Plaster Calculator',
    tagline: 'Calculate 2400 x 1200mm plasterboard sheets, 25kg skim bags, and scrim tape.',
    description: 'Free UK plaster calculator. Calculate exact 8x4 plasterboard sheets, Thistle MultiFinish 25kg bags, joint tape, and drywall screws for walls and ceilings.',
    category: 'trade_material',
    badge: 'Drylining & Plaster',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'areaM2',
        label: 'Total Wall / Ceiling Area',
        type: 'number',
        defaultValue: 25.0,
        min: 1,
        max: 500,
        step: 1,
        unit: 'm2',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const area = Number(inputs.areaM2) || 25;
      const q = calculatePlasterboardAndSkim(area, wastePercent);

      return {
        primaryValue: q.totalSheets,
        primaryUnit: 'Sheets',
        formattedPrimary: `${q.totalSheets} Plasterboards`,
        primaryLabel: 'Total 2400×1200mm Plasterboard Sheets',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteSheets,
        materials: [
          { name: 'Standard 12.5mm Plasterboard (2.4m×1.2m)', quantity: q.totalSheets, unit: 'sheets', formattedQuantity: `${q.totalSheets} sheets`, notes: `Covers ${q.areaM2} m² with ${wastePercent}% waste allowance` },
          { name: 'British Gypsum Thistle MultiFinish (25kg)', quantity: q.skimBags25kg, unit: '25kg bags', formattedQuantity: `${q.skimBags25kg} bags`, notes: 'Approx 10m² coverage per 25kg bag at 2mm skim coat' },
          { name: 'Self-Adhesive Scrim Joint Tape (90m)', quantity: q.scrimTapeRolls90m, unit: 'rolls', formattedQuantity: `${q.scrimTapeRolls90m} roll`, notes: 'For all tapered edge and butt joints' },
        ],
        assumptions: [
          `Calculated for standard 2400mm × 1200mm (2.88 m²) 12.5mm square edge/tapered edge plasterboard sheets.`,
          `MultiFinish skim coat applied at 2mm thickness (10m² coverage per 25kg bag).`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const area = qResult.materials[0].quantity * 2.88;
      const matLow = (area / 2.88) * MATERIAL_PRICES.plasterboardSheet24x12.low + (area / 10) * MATERIAL_PRICES.thistleMultiFinish25kg.low;
      const matHigh = (area / 2.88) * MATERIAL_PRICES.plasterboardSheet24x12.high + (area / 10) * MATERIAL_PRICES.thistleMultiFinish25kg.high;
      const daysLow = Math.max(1, area / 35);
      const daysHigh = Math.max(1, area / 25);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.plastererDayRate);
    },
    assumptions: ['Standard 2.4m x 1.2m plasterboard sheets.', '10m² coverage per 25kg MultiFinish bag.'],
    faqs: [
      {
        question: 'How many square meters does a 25kg bag of MultiFinish plaster cover?',
        answer: 'A standard 25kg bag of Thistle MultiFinish plaster covers approximately 10 square meters when applied at the standard 2mm two-coat skim thickness.',
      },
    ],
    relatedCalculators: ['paint-calculator', 'block-calculator', 'extension-cost-calculator'],
    relatedProjectType: 'full-renovation',
    commercialCta: {
      title: 'Looking for a Professional Plastering & Re-skimming Service?',
      description: 'Our experienced plasterers deliver glass-smooth crack-free finishes across full home renovations and extensions.',
      buttonText: 'Plan My Renovation →',
      buttonHref: '/plan-my-project?type=full-renovation',
    },
    seo: {
      title: 'Plasterboard & Plaster Calculator UK | Sheets & Skim Bags (Free Tool)',
      description: 'Free UK plaster calculator. Calculate exact 2400x1200 plasterboard sheets, Thistle MultiFinish 25kg bags, joint tape and plastering costs.',
      keywords: ['plaster calculator uk', 'how much multifinish do i need', 'plasterboard calculator', 'how many bags of plaster'],
    },
  },

  // =========================================================================
  // 7. PATIO & PAVING CALCULATOR
  // =========================================================================
  {
    id: 'patio-calculator',
    slug: 'patio-calculator',
    name: 'Patio Paving, Slabs & Sub-Base Calculator UK',
    shortTitle: 'Patio Calculator',
    tagline: 'Calculate porcelain slabs, MOT Type 1 aggregate tonnes, and mortar bed bulk bags.',
    description: 'Free UK patio calculator. Calculate 900x600 and 600x600 porcelain paving slabs, MOT sub-base aggregate, sharp sand, cement, and SBR primer for garden patios.',
    category: 'trade_material',
    badge: 'Outdoor & Paving',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Patio Length',
        type: 'number',
        defaultValue: 6.0,
        min: 1,
        max: 50,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Patio Width',
        type: 'number',
        defaultValue: 4.0,
        min: 1,
        max: 50,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'slabType',
        label: 'Slab Size & Style',
        type: 'select',
        defaultValue: 'porcelain_900_600',
        options: [
          { value: 'porcelain_900_600', label: '900mm × 600mm Italian Porcelain (0.54 m² / slab)' },
          { value: 'porcelain_600_600', label: '600mm × 600mm Porcelain Slabs (0.36 m² / slab)' },
          { value: 'sandstone_mixed', label: 'Indian Sandstone Mixed Project Pack (0.45 m² avg)' },
        ],
      },
    ],
    calculate: (inputs, wastePercent) => {
      const l = Number(inputs.lengthM) || 6;
      const w = Number(inputs.widthM) || 4;
      const slabType = inputs.slabType || 'porcelain_900_600';

      const q = calculatePatio(l, w, slabType, wastePercent);

      return {
        primaryValue: q.totalSlabs,
        primaryUnit: 'Slabs',
        formattedPrimary: `${q.totalSlabs} Paving Slabs`,
        primaryLabel: 'Total Paving Slabs Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteSlabs,
        materials: [
          { name: 'Paving Slabs', quantity: q.totalSlabs, unit: 'slabs', formattedQuantity: `${q.totalSlabs} slabs (${q.areaM2} m² total)`, notes: `Includes ${q.wasteSlabs} cuts allowance (${wastePercent}%)` },
          { name: 'MOT Type 1 Sub-Base Aggregate', quantity: q.motBulkBags850kg, unit: '850kg bulk bags', formattedQuantity: `${q.motBulkBags850kg} × bulk bags (${q.motType1Tonnes} tonnes)`, notes: 'Compacted 100mm sub-base foundation' },
          { name: 'Sharp Sand (Mortar Bed)', quantity: q.sharpSandBulkBags, unit: '850kg bulk bags', formattedQuantity: `${q.sharpSandBulkBags} × bulk bags`, notes: 'Full 50mm wet mortar bed' },
          { name: 'Cement (25kg)', quantity: q.cementBags25kg, unit: '25kg bags', formattedQuantity: `${q.cementBags25kg} bags`, notes: '4:1 sharp sand cement mix' },
        ],
        assumptions: [
          `Patio area: ${q.areaM2} m².`,
          `100mm compacted MOT Type 1 hardcore sub-base.`,
          `Full wet mortar bed with SBR primer slurry bond on porcelain backs.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const area = qResult.materials[0].quantity * 0.54;
      const matLow = area * MATERIAL_PRICES.sandstonePavingM2.low + 300;
      const matHigh = area * MATERIAL_PRICES.outdoorPorcelainSlabM2.high + 700;
      const daysLow = Math.max(2, area / 10);
      const daysHigh = Math.max(2, area / 7);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.landscaperDayRate);
    },
    assumptions: ['100mm MOT Type 1 sub-base.', '50mm full wet mortar bed with porcelain slurry primer.'],
    faqs: [
      {
        question: 'Do porcelain paving slabs need a special primer?',
        answer: 'Yes. Porcelain has very low porosity (under 0.5%), so the backs of porcelain slabs must be coated with an SBR polymer slurry primer before laying onto the wet mortar bed to ensure permanent adhesion.',
      },
    ],
    relatedCalculators: ['decking-calculator', 'gravel-calculator', 'driveway-cost-calculator'],
    relatedProjectType: 'garden',
    commercialCta: {
      title: 'Planning a Flush Porcelain Patio or Garden Landscaping?',
      description: 'Our landscaping team installs laser-level porcelain patios, ACO drainage channels, and garden studios designed to connect seamlessly with bifold doors.',
      buttonText: 'Plan My Garden Project →',
      buttonHref: '/plan-my-project?type=garden',
    },
    seo: {
      title: 'Patio Calculator UK | Paving Slabs, Sub-Base & Mortar (Free Tool)',
      description: 'Free UK patio calculator. Calculate porcelain paving slabs, MOT Type 1 aggregate tonnes, sand, cement and cost estimates for garden patios.',
      keywords: ['patio calculator uk', 'paving slab calculator', 'how many slabs for patio', 'mot type 1 sub base calculator'],
    },
  },

  // =========================================================================
  // 8. DECKING CALCULATOR
  // =========================================================================
  {
    id: 'decking-calculator',
    slug: 'decking-calculator',
    name: 'Decking Boards & Timber Joist Calculator UK',
    shortTitle: 'Decking Calculator',
    tagline: 'Calculate composite and timber decking boards, C24 framework joists, and clips.',
    description: 'Free UK decking calculator. Calculate decking boards (3.6m / 4.8m), C24 treated subframe joists at 400mm centers, hidden fastener clip packs, and membrane.',
    category: 'trade_material',
    badge: 'Outdoor & Decking',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Decking Length',
        type: 'number',
        defaultValue: 5.0,
        min: 1,
        max: 30,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Decking Width',
        type: 'number',
        defaultValue: 3.5,
        min: 1,
        max: 30,
        step: 0.5,
        unit: 'm',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const l = Number(inputs.lengthM) || 5;
      const w = Number(inputs.widthM) || 3.5;

      const q = calculateDecking(l, w, 3.6, 145, wastePercent);

      return {
        primaryValue: q.totalBoards,
        primaryUnit: 'Boards',
        formattedPrimary: `${q.totalBoards} Decking Boards`,
        primaryLabel: 'Total 3.6m Decking Boards Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteBoards,
        materials: [
          { name: 'Decking Boards (3.6m × 145mm)', quantity: q.totalBoards, unit: 'boards', formattedQuantity: `${q.totalBoards} boards (${q.areaM2} m² area)`, notes: `Includes ${q.wasteBoards} cutting allowance (${wastePercent}%)` },
          { name: 'C24 Treated Subframe Timber (47×150mm)', quantity: q.totalJoistLinearM, unit: 'linear meters', formattedQuantity: `${q.totalJoistLinearM} linear meters`, notes: 'Framing joists spaced at 400mm centers' },
          { name: 'Hidden Fastener Clips & Stainless Screws', quantity: q.deckScrewsClipsPack250, unit: 'packs (250)', formattedQuantity: `${q.deckScrewsClipsPack250} × 250pk`, notes: 'T-clips for composite or stainless deck screws' },
          { name: 'Heavy Duty Weed Membrane', quantity: q.weedMembraneM2, unit: 'm²', formattedQuantity: `${q.weedMembraneM2} m²`, notes: 'Geotextile weed barrier under subframe' },
        ],
        assumptions: [
          `Deck area: ${q.areaM2} m².`,
          `Standard 145mm board width with 5mm expansion gaps.`,
          `C24 treated joists at 400mm centers.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const area = qResult.materials[0].quantity * (3.6 * 0.145);
      const matLow = area * 45 + 200;
      const matHigh = area * 95 + 450;
      const daysLow = Math.max(1, area / 14);
      const daysHigh = Math.max(1, area / 10);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.landscaperDayRate);
    },
    assumptions: ['3.6m x 145mm standard board dimension.', '400mm joist center spacing.'],
    faqs: [
      {
        question: 'What is the correct joist spacing for composite decking?',
        answer: 'Composite decking requires joists spaced at a maximum of 300mm to 400mm center-to-center to prevent board flex and ensure manufacturer warranty compliance.',
      },
    ],
    relatedCalculators: ['patio-calculator', 'fence-calculator', 'garden-room-calculator'],
    relatedProjectType: 'garden',
    commercialCta: {
      title: 'Looking for a Bespoke Decking or Garden Studio?',
      description: 'Our team designs composite terraces, integrated LED step lighting, and custom garden studios with full guarantees.',
      buttonText: 'Plan My Garden Project →',
      buttonHref: '/plan-my-project?type=garden',
    },
    seo: {
      title: 'Decking Calculator UK | Boards, Joists & Fasteners (Free Tool)',
      description: 'Free UK decking calculator. Calculate composite and timber decking boards, C24 joist timber, clips and total costs with waste allowance.',
      keywords: ['decking calculator uk', 'how many decking boards do i need', 'composite decking calculator', 'decking joist spacing'],
    },
  },

  // =========================================================================
  // 9. FENCING CALCULATOR
  // =========================================================================
  {
    id: 'fence-calculator',
    slug: 'fence-calculator',
    name: 'Fence Panels, Posts & Postcrete Calculator UK',
    shortTitle: 'Fence Calculator',
    tagline: 'Calculate standard 6ft fence panels, concrete/timber posts, and Postcrete bags.',
    description: 'Free UK fence calculator. Calculate fence panels (1.83m / 6ft wide), slotted posts, gravel boards, and rapid Postcrete bags for garden boundary fencing.',
    category: 'trade_material',
    badge: 'Outdoor & Fencing',
    defaultWastePercent: 0,
    allowedWasteOptions: [0, 5],
    inputs: [
      {
        id: 'runLengthM',
        label: 'Total Fence Run Length',
        helperText: 'Total length of garden boundary to be fenced in meters',
        type: 'number',
        defaultValue: 15.0,
        min: 1.83,
        max: 200,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'panelHeightFt',
        label: 'Fence Height',
        type: 'select',
        defaultValue: '6',
        options: [
          { value: '6', label: '6ft (1.83m) — Standard Garden Privacy' },
          { value: '5', label: '5ft (1.52m) — Medium Height' },
          { value: '4', label: '4ft (1.22m) — Front Garden / Low Boundary' },
        ],
      },
    ],
    calculate: (inputs) => {
      const len = Number(inputs.runLengthM) || 15;
      const height = Number(inputs.panelHeightFt) || 6;
      const q = calculateFencing(len, height);

      return {
        primaryValue: q.panelsCount,
        primaryUnit: 'Panels',
        formattedPrimary: `${q.panelsCount} Fence Panels`,
        primaryLabel: 'Total 6ft (1.83m) Fence Panels Required',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: `Fence Panels (${height}ft High × 6ft Wide)`, quantity: q.panelsCount, unit: 'panels', formattedQuantity: `${q.panelsCount} panels`, notes: `For ${q.runLengthM}m boundary run` },
          { name: 'Slotted Fence Posts (Concrete / Treated Timber)', quantity: q.postsCount, unit: 'posts', formattedQuantity: `${q.postsCount} posts`, notes: '1 post per panel bay plus 1 end post' },
          { name: 'Concrete / Timber Gravel Boards', quantity: q.gravelBoardsCount, unit: 'boards', formattedQuantity: `${q.gravelBoardsCount} gravel boards`, notes: 'Protects panel bases from soil dampness' },
          { name: 'Blue Circle Postcrete (20kg)', quantity: q.postcreteBags20kg, unit: '20kg bags', formattedQuantity: `${q.postcreteBags20kg} bags`, notes: '2 bags per post hole for solid fixing' },
        ],
        assumptions: [
          `Standard UK 6ft (1.83m) panel width.`,
          `Number of posts = number of panels + 1.`,
          `2 x 20kg bags of Postcrete per 600mm deep post hole.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const panels = qResult.primaryValue;
      const matLow = panels * (MATERIAL_PRICES.fencePanel6ft.low + MATERIAL_PRICES.slottedConcretePost.low + 15);
      const matHigh = panels * (MATERIAL_PRICES.fencePanel6ft.high + MATERIAL_PRICES.slottedConcretePost.high + 25);
      const daysLow = Math.max(1, panels / 7);
      const daysHigh = Math.max(1, panels / 5);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.fencerDayRate);
    },
    assumptions: ['Standard 1.83m (6ft) UK panel width.', '2 bags of Postcrete per post.'],
    faqs: [
      {
        question: 'How deep should fence posts be buried?',
        answer: 'For a standard 6ft (1.8m) fence, posts should be set at least 600mm (2ft / 0.6m) into the ground and anchored with 2 bags of Postcrete for wind stability.',
      },
    ],
    relatedCalculators: ['patio-calculator', 'decking-calculator', 'turf-calculator'],
    relatedProjectType: 'garden',
    commercialCta: {
      title: 'Planning Complete Garden Landscaping?',
      description: 'Our team handles groundworks, contemporary slatted acoustic fencing, brick boundary walls, and porcelain patios.',
      buttonText: 'Plan My Garden Project →',
      buttonHref: '/plan-my-project?type=garden',
    },
    seo: {
      title: 'Fence Calculator UK | Panels, Posts & Postcrete (Free Tool)',
      description: 'Free UK fence calculator. Calculate exact 6ft fence panels, concrete posts, gravel boards, Postcrete bags and fencing costs.',
      keywords: ['fence calculator uk', 'how many fence panels do i need', 'fence post calculator', 'postcrete calculator'],
    },
  },

  // =========================================================================
  // 10. GRAVEL & AGGREGATE CALCULATOR
  // =========================================================================
  {
    id: 'gravel-calculator',
    slug: 'gravel-calculator',
    name: 'Gravel, Shingle & Bulk Bag Calculator UK',
    shortTitle: 'Gravel Calculator',
    tagline: 'Calculate metric tonnes, 850kg bulk bags, and 25kg small bags for paths and driveways.',
    description: 'Free UK gravel calculator. Calculate decorative gravel, golden flint, pea shingle, and slate chippings in metric tonnes and 850kg bulk bags for paths and driveways.',
    category: 'trade_material',
    badge: 'Outdoor & Aggregates',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Area Length',
        type: 'number',
        defaultValue: 8.0,
        min: 1,
        max: 100,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Area Width',
        type: 'number',
        defaultValue: 3.5,
        min: 0.5,
        max: 50,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'depthMm',
        label: 'Gravel Depth',
        helperText: 'Garden path: 40–50mm, Driveway: 50–60mm',
        type: 'number',
        defaultValue: 50,
        min: 25,
        max: 150,
        step: 5,
        unit: 'mm',
      },
    ],
    calculate: (inputs) => {
      const l = Number(inputs.lengthM) || 8;
      const w = Number(inputs.widthM) || 3.5;
      const d = Number(inputs.depthMm) || 50;

      const q = calculateGravel(l, w, d);

      return {
        primaryValue: q.tonnesRequired,
        primaryUnit: 'Tonnes',
        formattedPrimary: `${q.tonnesRequired} Tonnes`,
        primaryLabel: 'Total Decorative Gravel Required',
        wasteAppliedPercent: 10,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Bulk Bags (850kg each)', quantity: q.bulkBags850kg, unit: '850kg bulk bags', formattedQuantity: `${q.bulkBags850kg} × bulk bags`, notes: 'Delivered by crane hiab wagon' },
          { name: 'Small Bags (25kg option)', quantity: q.smallBags25kg, unit: '25kg bags', formattedQuantity: `${q.smallBags25kg} bags`, notes: 'Alternative for tight access without crane access' },
          { name: 'Heavy Duty Weed Control Membrane', quantity: q.weedMembraneM2, unit: 'm²', formattedQuantity: `${q.weedMembraneM2} m²`, notes: 'Prevents gravel mixing with subsoil and stops weeds' },
        ],
        assumptions: [
          `Area: ${q.areaM2} m² at ${d}mm depth (volume: ${q.volumeM3} m³).`,
          `Bulk density: 1.8 tonnes per cubic meter.`,
          `1 standard bulk bag contains approx. 850kg (0.85 tonnes).`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const tonnes = qResult.primaryValue;
      const matLow = tonnes * MATERIAL_PRICES.decorativeGravelBulkBag850kg.low;
      const matHigh = tonnes * MATERIAL_PRICES.decorativeGravelBulkBag850kg.high;
      const daysLow = Math.max(1, tonnes / 5);
      const daysHigh = Math.max(1, tonnes / 3);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.generalLabourerDayRate);
    },
    assumptions: ['Bulk aggregate density = 1.8 tonnes/m³.', 'Standard 50mm laying depth.'],
    faqs: [
      {
        question: 'How deep should decorative gravel be laid on paths and driveways?',
        answer: 'For garden paths and borders, lay gravel at 40mm to 50mm depth. For driveways using 20mm gravel, lay at a depth of 50mm to 60mm over a compacted MOT Type 1 sub-base.',
      },
    ],
    relatedCalculators: ['patio-calculator', 'turf-calculator', 'driveway-cost-calculator'],
    relatedProjectType: 'driveway',
    commercialCta: {
      title: 'Planning a New Driveway or Entrance?',
      description: 'Our team designs permeable resin-bound, block paved, and decorative gravel driveways with dropped kerbs and dropped water channels.',
      buttonText: 'Plan My Driveway Project →',
      buttonHref: '/plan-my-project?type=driveway',
    },
    seo: {
      title: 'Gravel Calculator UK | Tonnes & Bulk Bags (Free Tool)',
      description: 'Free UK gravel calculator. Calculate metric tonnes and 850kg bulk bags of decorative gravel, slate chippings and shingle for paths and driveways.',
      keywords: ['gravel calculator uk', 'how much gravel do i need', 'gravel tonnes calculator', 'bulk bag gravel calculator'],
    },
  },

  // =========================================================================
  // 11. TURF & TOPSOIL CALCULATOR
  // =========================================================================
  {
    id: 'turf-calculator',
    slug: 'turf-calculator',
    name: 'Lawn Turf & Topsoil Calculator UK',
    shortTitle: 'Turf Calculator',
    tagline: 'Calculate rolls of cultivated turf (1m² each) and bulk bags of blended topsoil.',
    description: 'Free UK lawn turf calculator. Calculate rolls of fresh cultivated turf, topsoil bulk bags, and rotovating requirements with waste allowance.',
    category: 'trade_material',
    badge: 'Outdoor & Landscaping',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Lawn Length',
        type: 'number',
        defaultValue: 10.0,
        min: 1,
        max: 100,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Lawn Width',
        type: 'number',
        defaultValue: 6.0,
        min: 1,
        max: 100,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'topsoilDepthMm',
        label: 'New Topsoil Depth',
        type: 'select',
        defaultValue: '50',
        options: [
          { value: '0', label: 'No new topsoil (Existing soil prepared & rotovated)' },
          { value: '50', label: '50mm Topsoil (Standard leveling bed)' },
          { value: '100', label: '100mm Topsoil (Poor subsoil or new build garden)' },
        ],
      },
    ],
    calculate: (inputs, wastePercent) => {
      const l = Number(inputs.lengthM) || 10;
      const w = Number(inputs.widthM) || 6;
      const depth = Number(inputs.topsoilDepthMm) || 50;

      const q = calculateTurf(l, w, depth, wastePercent);

      return {
        primaryValue: q.totalRolls,
        primaryUnit: 'Rolls',
        formattedPrimary: `${q.totalRolls} Turf Rolls`,
        primaryLabel: 'Total Cultivated Turf Rolls (1m² each)',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: q.wasteRolls,
        materials: [
          { name: 'Cultivated Lawn Turf (1m² rolls)', quantity: q.totalRolls, unit: 'rolls', formattedQuantity: `${q.totalRolls} rolls (${q.areaM2} m² area)`, notes: `Includes ${q.wasteRolls} rolls cutting allowance (${wastePercent}%)` },
          { name: 'Screened Enriched Topsoil', quantity: q.topsoilBulkBags850kg, unit: '850kg bulk bags', formattedQuantity: `${q.topsoilBulkBags850kg} × bulk bags (${q.topsoilTonnes} tonnes)`, notes: depth > 0 ? `${depth}mm depth for root establishment` : 'Existing soil used' },
        ],
        assumptions: [
          `Lawn area: ${q.areaM2} m².`,
          `Standard UK turf rolls: 1 square meter (typically 1.64m × 0.61m / 65" × 24").`,
          `Includes ${wastePercent}% waste for perimeter trimming and shaped borders.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const rolls = qResult.primaryValue;
      const matLow = rolls * MATERIAL_PRICES.cultivatedTurfRollM2.low + 100;
      const matHigh = rolls * MATERIAL_PRICES.cultivatedTurfRollM2.high + 300;
      const daysLow = Math.max(1, rolls / 80);
      const daysHigh = Math.max(1, rolls / 50);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.landscaperDayRate);
    },
    assumptions: ['1 turf roll = 1 m².', 'Topsoil density = 1.4 tonnes/m³.'],
    faqs: [
      {
        question: 'How big is a standard roll of turf in the UK?',
        answer: 'In the UK, standard cultivated turf rolls cover exactly 1 square meter (1m²), typically measuring 1.64m long by 0.61m wide (or 1m by 1m).',
      },
    ],
    relatedCalculators: ['patio-calculator', 'fence-calculator', 'garden-room-calculator'],
    relatedProjectType: 'garden',
    commercialCta: {
      title: 'Planning a Complete Garden Makeover?',
      description: 'Our landscaping team prepares ground levels, installs automated irrigation, porcelain paving, and lush cultivated lawns.',
      buttonText: 'Plan My Garden Project →',
      buttonHref: '/plan-my-project?type=garden',
    },
    seo: {
      title: 'Turf Calculator UK | How Many Turf Rolls Do I Need? (Free Tool)',
      description: 'Free UK turf calculator. Calculate exact rolls of lawn turf (1m² each), topsoil bulk bags, tonnes and cost estimates with waste allowance.',
      keywords: ['turf calculator uk', 'how many rolls of turf', 'lawn turf calculator', 'topsoil calculator'],
    },
  },

  // =========================================================================
  // 12. EXTENSION COST CALCULATOR (Project Cost)
  // =========================================================================
  {
    id: 'extension-cost-calculator',
    slug: 'extension-cost-calculator',
    name: 'House Extension Cost Calculator UK (2026 Build Rates)',
    shortTitle: 'Extension Cost Calculator',
    tagline: 'Calculate indicative build costs for single-storey, side return, wraparound, and double-storey extensions.',
    description: 'Free UK extension cost calculator. Estimate realistic turnkey construction costs, groundworks, structural steels, bi-fold doors, and interior fit-out for house extensions.',
    category: 'project_cost',
    badge: 'Major Projects',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'lengthM',
        label: 'Extension Length (Projection)',
        type: 'number',
        defaultValue: 6.0,
        min: 2,
        max: 20,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Extension Width',
        type: 'number',
        defaultValue: 4.0,
        min: 2,
        max: 20,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'extensionType',
        label: 'Extension Format',
        type: 'select',
        defaultValue: 'rear_single',
        options: [
          { value: 'rear_single', label: 'Single Storey Rear Extension (£1,850–£2,450/m²)' },
          { value: 'side_return', label: 'Side Return Infill Extension (£2,100–£2,850/m²)' },
          { value: 'wraparound', label: 'Wraparound Extension (£2,200–£2,950/m²)' },
          { value: 'double_storey', label: 'Double Storey Extension (£1,650–£2,250/m² total)' },
        ],
      },
      {
        id: 'finishLevel',
        label: 'Finish Specification',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'essential', label: 'Essential (Standard trade finish, clean paint, laminate flooring)' },
          { value: 'standard', label: 'Standard Architectural (Quality engineered flooring, bifold doors, spotlights)' },
          { value: 'premium', label: 'Premium Luxury (Bespoke glazing, 30mm quartz, water UFH, flush patio)' },
          { value: 'luxury', label: 'Bespoke Luxury (Crittall doors, imported stone, architectural joinery)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const l = Number(inputs.lengthM) || 6;
      const w = Number(inputs.widthM) || 4;
      const areaM2 = l * w;
      const type = inputs.extensionType || 'rear_single';
      const finish = inputs.finishLevel || 'standard';

      let rates = PROJECT_M2_GUIDE_RATES.extensionSingleStorey;
      if (type === 'side_return') rates = PROJECT_M2_GUIDE_RATES.extensionSideReturn;
      if (type === 'wraparound') rates = PROJECT_M2_GUIDE_RATES.extensionWraparound;
      if (type === 'double_storey') rates = PROJECT_M2_GUIDE_RATES.extensionDoubleStorey;

      const finishMultiplier = FINISH_MULTIPLIERS[finish] || 1.0;
      const baseCostLow = Math.round(areaM2 * rates.low * finishMultiplier);
      const baseCostHigh = Math.round(areaM2 * rates.high * finishMultiplier);

      const totalLow = Math.round((baseCostLow * 1.1) / 500) * 500;
      const totalHigh = Math.round((baseCostHigh * 1.1) / 500) * 500;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Turnkey Extension Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Groundworks & Concrete Foundations', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.18).toLocaleString()} – £${Math.round(totalHigh * 0.18).toLocaleString()}`, notes: 'Trench footings, drainage & slab' },
          { name: 'Structural Shell, Brickwork & Roof', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.35).toLocaleString()} – £${Math.round(totalHigh * 0.35).toLocaleString()}`, notes: 'Cavity walls, steel beams, flat roof' },
          { name: 'Glazing & Patio Bi-Fold Doors', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.15).toLocaleString()} – £${Math.round(totalHigh * 0.15).toLocaleString()}`, notes: 'Aluminium bifolds & rooflights' },
          { name: 'First & Second Fix Trades (Electrics, Plumbing, Plaster, Decorating)', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.22).toLocaleString()} – £${Math.round(totalHigh * 0.22).toLocaleString()}`, notes: 'Turnkey interior finishing' },
          { name: 'Contingency Reserve (10%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.1).toLocaleString()} – £${Math.round(totalHigh * 0.1).toLocaleString()}`, notes: 'Recommended 10% unforeseen reserve' },
        ],
        assumptions: [
          `Gross floor area: ${areaM2} m² (${l}m × ${w}m).`,
          `Includes full turnkey shell, structural steel beams, glazing, electrics, heating, and plaster finish.`,
          `Includes 10% contingency reserve. Excludes local authority planning fees and kitchen cabinetry.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.45),
          materialsCostHigh: Math.round(totalHigh * 0.45),
          labourCostLow: Math.round(totalLow * 0.45),
          labourCostHigh: Math.round(totalHigh * 0.45),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['UK national average benchmark pricing.', 'Turnkey build from foundations to decorated finish.'],
    howItWorks: {
      title: 'How House Extension Costs are Calculated in the UK',
      paragraphs: [
        'House extension pricing in the UK is calculated primarily on gross internal floor area (m²) and format complexity. A single-storey rear extension on straightforward ground conditions averages £1,850 to £2,450 per square meter.',
        'Side return extensions and Victorian wraparounds carry higher square-meter rates (£2,100 to £2,950/m²) due to party wall structural steelwork, existing sewer diversions, and temporary roof propping.',
      ],
    },
    costBenchmarkTable: {
      title: '2026 UK House Extension Cost per m²',
      description: 'Comprehensive breakdown of build stages and m² guide prices across UK regions.',
      rows: [
        { item: 'Single Storey Rear Extension (Standard)', unitCost: '£1,850 – £2,450 / m²', notes: 'Turnkey build including structural shell & finishes' },
        { item: 'Side Return Infill Extension', unitCost: '£2,100 – £2,850 / m²', notes: 'Includes party wall steels and structural opening' },
        { item: 'Wraparound Extension (Rear + Side)', unitCost: '£2,200 – £2,950 / m²', notes: 'Full structural goalpost steel frame' },
        { item: 'Double Storey Extension', unitCost: '£1,650 – £2,250 / m²', notes: 'Cost per m² across both floors combined' },
        { item: 'Aluminium 3-Pane Bi-Fold Doors (Supplied & Fitted)', unitCost: '£3,500 – £5,500', notes: 'Thermally broken with solar control glazing' },
      ],
    },
    faqs: [
      {
        question: 'How much does a 20m² or 30m² house extension cost in the UK?',
        answer: 'A standard single-storey rear extension typically costs between £1,850 and £2,450 per square meter in the UK, plus 10% contingency. A 24m² (6m × 4m) extension typically ranges from £48,000 to £65,000 depending on ground conditions and glazing specifications.',
      },
      {
        question: 'Do I need planning permission for a rear extension?',
        answer: 'Under Permitted Development rights in England, single-storey rear extensions up to 8m for detached houses or 6m for semi-detached/terraced houses can often be built without full planning permission, subject to the Prior Approval Neighbor Consultation scheme.',
      },
    ],
    relatedCalculators: ['brick-calculator', 'concrete-calculator', 'kitchen-cost-calculator'],
    relatedProjectType: 'extension',
    relatedServices: [
      { title: 'House Extensions', href: '/services/extensions', desc: 'Bespoke architectural house extensions with fixed-price management' },
    ],
    commercialCta: {
      title: 'Ready for an Accurate, Room-by-Room Extension Estimate?',
      description: 'Use our AI Project Planner to configure your exact glazing, wall knockthrough, underfloor heating, and finish options.',
      buttonText: 'Plan My Extension in Detail →',
      buttonHref: '/plan-my-project?type=extension',
    },
    seo: {
      title: 'House Extension Cost Calculator UK | 2026 Build Estimate (Free Tool)',
      description: 'Free UK extension cost calculator. Estimate realistic build costs for single-storey, side return, wraparound and double-storey extensions per m².',
      keywords: ['extension cost calculator uk', 'how much does an extension cost', 'cost per m2 extension uk', 'rear extension cost calculator'],
    },
  },

  // =========================================================================
  // 13. KITCHEN RENOVATION COST CALCULATOR
  // =========================================================================
  {
    id: 'kitchen-cost-calculator',
    slug: 'kitchen-cost-calculator',
    name: 'Kitchen Renovation & Knockthrough Cost Calculator UK',
    shortTitle: 'Kitchen Cost Calculator',
    tagline: 'Calculate cabinetry, quartz worktops, appliances, and knockthrough wall removal costs.',
    description: 'Free UK kitchen cost calculator. Estimate turnkey kitchen remodeling costs including cabinetry supply, solid stone fabrication, electrical rewiring, plumbing, and RSJ structural steel installation.',
    category: 'project_cost',
    badge: 'Interior Renovation',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'kitchenSize',
        label: 'Kitchen Size',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Compact Kitchen (Under 12 m² / 8–10 units)' },
          { value: 'medium', label: 'Standard Kitchen / Diner (15–22 m² / 12–16 units)' },
          { value: 'large', label: 'Large Open-Plan Kitchen Living (25–35 m² / Island + 18+ units)' },
        ],
      },
      {
        id: 'wallRemoval',
        label: 'Wall Removal / Knockthrough',
        type: 'select',
        defaultValue: 'no_wall',
        options: [
          { value: 'no_wall', label: 'No wall removal (Existing room footprint)' },
          { value: 'remove_wall', label: 'Remove dividing wall with RSJ Steel Beam (+£3,200–£5,500)' },
        ],
      },
      {
        id: 'finishLevel',
        label: 'Finish Specification',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'essential', label: 'Essential (Trade flat-pack units, laminate worktops, basic appliances)' },
          { value: 'standard', label: 'Standard (Quality painted Shaker, 20mm Quartz, Neff appliances, spotlights)' },
          { value: 'premium', label: 'Premium Architectural (Bespoke in-frame, 30mm Quartz waterfall island, Quooker tap, Miele)' },
          { value: 'luxury', label: 'Bespoke Luxury (Handcrafted timber, bookmatched marble, integrated wine cellar)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const size = inputs.kitchenSize || 'medium';
      const wall = inputs.wallRemoval || 'no_wall';
      const finish = inputs.finishLevel || 'standard';

      let baseLow = 8500;
      let baseHigh = 14500;

      if (size === 'medium') { baseLow = 12500; baseHigh = 21000; }
      if (size === 'large') { baseLow = 17500; baseHigh = 32000; }

      if (wall === 'remove_wall') {
        baseLow += 3500;
        baseHigh += 6000;
      }

      const mult = FINISH_MULTIPLIERS[finish] || 1.0;
      const totalLow = Math.round((baseLow * mult) / 500) * 500;
      const totalHigh = Math.round((baseHigh * mult) / 500) * 500;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Kitchen Renovation Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Cabinetry Supply & Internal Storage Mechanics', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.4).toLocaleString()} – £${Math.round(totalHigh * 0.4).toLocaleString()}` },
          { name: 'Worktops (Quartz / Granite / Solid Surface)', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.2).toLocaleString()} – £${Math.round(totalHigh * 0.2).toLocaleString()}` },
          { name: 'Installation, Plumbing, Electrics & Plastering', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.3).toLocaleString()} – £${Math.round(totalHigh * 0.3).toLocaleString()}` },
          { name: 'Contingency Allowance (10%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.1).toLocaleString()} – £${Math.round(totalHigh * 0.1).toLocaleString()}` },
        ],
        assumptions: [
          `Turnkey estimate including strip out, cabinetry fitting, electrical circuits, plumbing alteration, and decorating.`,
          `Includes 10% contingency reserve.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.5),
          materialsCostHigh: Math.round(totalHigh * 0.5),
          labourCostLow: Math.round(totalLow * 0.4),
          labourCostHigh: Math.round(totalHigh * 0.4),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['Includes strip out and waste disposal.', 'Full trade installation with certified Part P electricals.'],
    faqs: [
      {
        question: 'How much does a new kitchen cost in the UK including fitting?',
        answer: 'A standard complete kitchen renovation in the UK typically costs between £12,500 and £21,000 including units, solid quartz worktops, appliances, plumbing, and trade fitting.',
      },
    ],
    relatedCalculators: ['tile-calculator', 'flooring-calculator', 'extension-cost-calculator'],
    relatedProjectType: 'kitchen',
    relatedServices: [
      { title: 'Kitchen Renovations', href: '/services/kitchen-renovations', desc: 'Bespoke cabinetry, quartz worktops & open plan living' },
    ],
    commercialCta: {
      title: 'Planning a Kitchen Renovation or Knockthrough?',
      description: 'Configure your cabinetry styles, solid stone worktops, integrated appliances, and wall knockthroughs in our interactive planner.',
      buttonText: 'Plan My Kitchen Project →',
      buttonHref: '/plan-my-project?type=kitchen',
    },
    seo: {
      title: 'Kitchen Renovation Cost Calculator UK | 2026 Estimate (Free Tool)',
      description: 'Free UK kitchen cost calculator. Estimate kitchen supply, quartz worktops, appliances, trade fitting, and knockthrough wall removal costs.',
      keywords: ['kitchen cost calculator uk', 'how much does a new kitchen cost', 'kitchen renovation cost', 'kitchen knockthrough cost'],
    },
  },

  // =========================================================================
  // 14. BATHROOM RENOVATION COST CALCULATOR
  // =========================================================================
  {
    id: 'bathroom-cost-calculator',
    slug: 'bathroom-cost-calculator',
    name: 'Bathroom & Wetroom Renovation Cost Calculator UK',
    shortTitle: 'Bathroom Cost Calculator',
    tagline: 'Calculate sanitaryware, walk-in wetrooms, porcelain tiling, and plumbing installation.',
    description: 'Free UK bathroom cost calculator. Estimate complete bathroom refurbishment costs, walk-in shower installations, concealed cisterns, underfloor heating, and Italian porcelain tiling.',
    category: 'project_cost',
    badge: 'Interior Renovation',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'bathroomScope',
        label: 'Bathroom Type & Scope',
        type: 'select',
        defaultValue: 'full_family',
        options: [
          { value: 'cloakroom', label: 'Downstairs Cloakroom / WC (£2,500–£4,500)' },
          { value: 'ensuite', label: 'Ensuite Shower Room (£5,000–£8,500)' },
          { value: 'full_family', label: 'Full Family Bathroom Renovation (£6,500–£11,500)' },
          { value: 'luxury_wetroom', label: 'Walk-In Architectural Wetroom (£8,500–£16,000)' },
        ],
      },
      {
        id: 'finishLevel',
        label: 'Sanitaryware & Tile Quality',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'essential', label: 'Essential (Clean white suite, chrome fittings, ceramic tiles)' },
          { value: 'standard', label: 'Standard (Wall-hung toilet, rainfall shower, porcelain tiling)' },
          { value: 'premium', label: 'Premium (Hansgrohe/Lusso brassware, freestanding bath, heated wetroom tray)' },
          { value: 'luxury', label: 'Bespoke Luxury (Bookmatched stone marble, digital shower, bespoke vanity joinery)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const scope = inputs.bathroomScope || 'full_family';
      const finish = inputs.finishLevel || 'standard';

      let baseLow = 6500;
      let baseHigh = 11500;

      if (scope === 'cloakroom') { baseLow = 2500; baseHigh = 4500; }
      if (scope === 'ensuite') { baseLow = 5000; baseHigh = 8500; }
      if (scope === 'luxury_wetroom') { baseLow = 8500; baseHigh = 16000; }

      const mult = FINISH_MULTIPLIERS[finish] || 1.0;
      const totalLow = Math.round((baseLow * mult) / 250) * 250;
      const totalHigh = Math.round((baseHigh * mult) / 250) * 250;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Bathroom Renovation Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Sanitaryware, Brassware & Glass Enclosure', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.35).toLocaleString()} – £${Math.round(totalHigh * 0.35).toLocaleString()}` },
          { name: 'Porcelain Wall & Floor Tiles + Waterproof Tanking', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.25).toLocaleString()} – £${Math.round(totalHigh * 0.25).toLocaleString()}` },
          { name: 'Plumbing, Tiling, Electricals & Installation', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.32).toLocaleString()} – £${Math.round(totalHigh * 0.32).toLocaleString()}` },
          { name: 'Contingency Allowance (8%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.08).toLocaleString()} – £${Math.round(totalHigh * 0.08).toLocaleString()}` },
        ],
        assumptions: [
          `Turnkey renovation including strip out, plumbing reconfiguration, waterproof tanking membrane, full tiling, and sanitaryware fitting.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.45),
          materialsCostHigh: Math.round(totalHigh * 0.45),
          labourCostLow: Math.round(totalLow * 0.47),
          labourCostHigh: Math.round(totalHigh * 0.47),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 8,
        },
      };
    },
    assumptions: ['Full waterproof tanking in wet zones.', 'Part P compliant electricals for ventilation and spotlighting.'],
    faqs: [
      {
        question: 'How much does a full bathroom renovation cost in the UK?',
        answer: 'A standard full bathroom renovation in the UK typically costs between £6,500 and £11,500 including strip out, new suite, walk-in shower, wall and floor tiling, and trade fitting.',
      },
    ],
    relatedCalculators: ['tile-calculator', 'plaster-calculator', 'kitchen-cost-calculator'],
    relatedProjectType: 'bathroom',
    relatedServices: [
      { title: 'Bathroom Renovations', href: '/services/bathroom-renovations', desc: 'Luxury bathrooms, walk-in wetrooms & Italian tiling' },
    ],
    commercialCta: {
      title: 'Planning a Bathroom Renovation?',
      description: 'Configure your layout, walk-in shower, freestanding bath, and tiling preferences in our detailed project planner.',
      buttonText: 'Plan My Bathroom Project →',
      buttonHref: '/plan-my-project?type=bathroom',
    },
    seo: {
      title: 'Bathroom Renovation Cost Calculator UK | 2026 Estimate (Free Tool)',
      description: 'Free UK bathroom cost calculator. Estimate sanitaryware, walk-in wetrooms, porcelain tiling, and professional plumbing installation costs.',
      keywords: ['bathroom cost calculator uk', 'how much does a new bathroom cost', 'bathroom renovation estimate', 'wetroom cost calculator'],
    },
  },

  // =========================================================================
  // 15. LOFT CONVERSION COST CALCULATOR
  // =========================================================================
  {
    id: 'loft-conversion-calculator',
    slug: 'loft-conversion-calculator',
    name: 'Loft Conversion Cost Calculator UK (2026 Estimate)',
    shortTitle: 'Loft Cost Calculator',
    tagline: 'Calculate build costs for Velux, rear dormer, hip-to-gable, and mansard conversions.',
    description: 'Free UK loft conversion calculator. Estimate turnkey loft conversion costs including structural steel beams, staircase, dormer construction, ensuite shower room, and Building Regulations.',
    category: 'project_cost',
    badge: 'Major Projects',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'loftType',
        label: 'Loft Conversion Format',
        type: 'select',
        defaultValue: 'rear_dormer',
        options: [
          { value: 'velux_only', label: 'Velux Rooflight Conversion (£28,000–£38,000)' },
          { value: 'rear_dormer', label: 'Rear Flat Roof Dormer (£38,000–£55,000 / Most Popular)' },
          { value: 'hip_to_gable', label: 'Hip-to-Gable Dormer (£45,000–£65,000 / Semi-detached)' },
          { value: 'mansard', label: 'Mansard Conversion (£52,000–£75,000 / Terraced)' },
        ],
      },
      {
        id: 'includeEnsuite',
        label: 'Include Ensuite Shower Room',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Yes, include compact ensuite shower room (+£5,500)' },
          { value: 'no', label: 'No ensuite (Bedroom / Office only)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const type = inputs.loftType || 'rear_dormer';
      const ensuite = inputs.includeEnsuite === 'yes';

      let baseLow = 38000;
      let baseHigh = 55000;

      if (type === 'velux_only') { baseLow = 28000; baseHigh = 38000; }
      if (type === 'hip_to_gable') { baseLow = 45000; baseHigh = 65000; }
      if (type === 'mansard') { baseLow = 52000; baseHigh = 75000; }

      if (ensuite) {
        baseLow += 5500;
        baseHigh += 8500;
      }

      const totalLow = Math.round(baseLow / 500) * 500;
      const totalHigh = Math.round(baseHigh / 500) * 500;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Loft Conversion Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Structural Steelwork (RSJ Beams) & Floor Joists', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.25).toLocaleString()} – £${Math.round(totalHigh * 0.25).toLocaleString()}` },
          { name: 'Dormer Construction, Roof Weatherproofing & Glazing', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.3).toLocaleString()} – £${Math.round(totalHigh * 0.3).toLocaleString()}` },
          { name: 'Staircase Fabrication & Fire Door Regulations', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.15).toLocaleString()} – £${Math.round(totalHigh * 0.15).toLocaleString()}` },
          { name: 'Insulation (Part L), Plastering, Electrics & Ensuite', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.2).toLocaleString()} – £${Math.round(totalHigh * 0.2).toLocaleString()}` },
          { name: 'Contingency Reserve (10%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.1).toLocaleString()} – £${Math.round(totalHigh * 0.1).toLocaleString()}` },
        ],
        assumptions: [
          `Turnkey conversion compliant with Part B (Fire Safety) and Part L (Thermal Insulation) Building Regulations.`,
          `Includes bespoke staircase and structural calculations.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.45),
          materialsCostHigh: Math.round(totalHigh * 0.45),
          labourCostLow: Math.round(totalLow * 0.45),
          labourCostHigh: Math.round(totalHigh * 0.45),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['Compliant with Part B fire doors and interlinked alarms.', 'Steel beam calculations included.'],
    faqs: [
      {
        question: 'How much does a rear dormer loft conversion cost in the UK?',
        answer: 'A rear dormer loft conversion creating a master bedroom and ensuite typically costs between £42,000 and £60,000 in the UK including structural steel, stairs, glazing, insulation, and building control signoff.',
      },
    ],
    relatedCalculators: ['extension-cost-calculator', 'plaster-calculator', 'bathroom-cost-calculator'],
    relatedProjectType: 'loft',
    relatedServices: [
      { title: 'Loft Conversions', href: '/services/loft-conversions', desc: 'Dormer, Mansard & Velux conversions with Building Control signoff' },
    ],
    commercialCta: {
      title: 'Planning a Loft Conversion?',
      description: 'Our team assesses headroom, calculates structural steel beams, and provides full architectural drawings and construction delivery.',
      buttonText: 'Plan My Loft Project →',
      buttonHref: '/plan-my-project?type=loft',
    },
    seo: {
      title: 'Loft Conversion Cost Calculator UK | 2026 Build Estimate (Free Tool)',
      description: 'Free UK loft conversion cost calculator. Estimate build costs for dormer, Velux, hip-to-gable and mansard conversions with ensuite.',
      keywords: ['loft conversion cost calculator uk', 'how much does a loft conversion cost', 'dormer loft cost', 'attic conversion cost uk'],
    },
  },

  // =========================================================================
  // 16. DRIVEWAY COST CALCULATOR
  // =========================================================================
  {
    id: 'driveway-cost-calculator',
    slug: 'driveway-cost-calculator',
    name: 'Driveway Cost Calculator UK (Resin, Block Paving & Tarmac)',
    shortTitle: 'Driveway Cost Calculator',
    tagline: 'Calculate excavation, MOT sub-base, block paving, and resin-bound surface costs.',
    description: 'Free UK driveway calculator. Estimate complete driveway replacement costs including 150mm ground excavation, waste skip removal, permeable sub-base, and surface paving.',
    category: 'project_cost',
    badge: 'Outdoor & Groundworks',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'areaM2',
        label: 'Driveway Area',
        helperText: 'Standard single car drive: ~25m², 2 cars: ~50m², 3+ cars: 75m²+',
        type: 'number',
        defaultValue: 45.0,
        min: 10,
        max: 500,
        step: 5,
        unit: 'm2',
      },
      {
        id: 'surfaceType',
        label: 'Surface Material',
        type: 'select',
        defaultValue: 'resin_bound',
        options: [
          { value: 'block_paving', label: 'Tegula / Concrete Block Paving (£85–£135/m²)' },
          { value: 'resin_bound', label: 'Resin-Bound Permeable Aggregate (£95–£150/m²)' },
          { value: 'tarmac', label: 'Tarmac / Asphalt with Block Border (£75–£115/m²)' },
          { value: 'gravel_grid', label: 'Gravel with Cellular Stabilisation Grid (£55–£85/m²)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const area = Number(inputs.areaM2) || 45;
      const surface = inputs.surfaceType || 'resin_bound';

      let rate = PROJECT_M2_GUIDE_RATES.drivewayResinM2;
      if (surface === 'block_paving') rate = PROJECT_M2_GUIDE_RATES.drivewayBlockPavingM2;
      if (surface === 'tarmac') rate = { low: 75, high: 115 };
      if (surface === 'gravel_grid') rate = { low: 55, high: 85 };

      const baseLow = Math.round(area * rate.low);
      const baseHigh = Math.round(area * rate.high);

      const totalLow = Math.round((baseLow * 1.1) / 250) * 250;
      const totalHigh = Math.round((baseHigh * 1.1) / 250) * 250;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Driveway Installation Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Ground Excavation (150–200mm) & Muck Away Skips', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.25).toLocaleString()} – £${Math.round(totalHigh * 0.25).toLocaleString()}` },
          { name: 'MOT Type 1 Compacted Hardcore Sub-Base & Membrane', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.25).toLocaleString()} – £${Math.round(totalHigh * 0.25).toLocaleString()}` },
          { name: 'Surface Paving Materials & Edging Kerbs', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.4).toLocaleString()} – £${Math.round(totalHigh * 0.4).toLocaleString()}` },
          { name: 'Contingency Reserve (10%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.1).toLocaleString()} – £${Math.round(totalHigh * 0.1).toLocaleString()}` },
        ],
        assumptions: [
          `Driveway area: ${area} m².`,
          `Includes 150mm ground excavation, geotextile membrane, compacted sub-base, and concrete kerb edges.`,
          `SUDS compliant permeable drainage.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.45),
          materialsCostHigh: Math.round(totalHigh * 0.45),
          labourCostLow: Math.round(totalLow * 0.45),
          labourCostHigh: Math.round(totalHigh * 0.45),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['Includes full ground excavation and muck-away.', 'SUDS compliant drainage.'],
    faqs: [
      {
        question: 'How much does a new resin or block paving driveway cost in the UK?',
        answer: 'A new 50m² two-car driveway typically costs between £4,500 and £7,500 in the UK including excavation, hardcore sub-base, kerbing, and paving surface.',
      },
    ],
    relatedCalculators: ['gravel-calculator', 'concrete-calculator', 'patio-calculator'],
    relatedProjectType: 'driveway',
    relatedServices: [
      { title: 'Driveways & Entrances', href: '/services/driveways', desc: 'Resin-bound, block paved and permeable driveway installation' },
    ],
    commercialCta: {
      title: 'Planning a New Driveway or Front Entrance?',
      description: 'Our groundworks team installs permeable resin, block paving, and dropped kerbs with full council compliance.',
      buttonText: 'Plan My Driveway Project →',
      buttonHref: '/plan-my-project?type=driveway',
    },
    seo: {
      title: 'Driveway Cost Calculator UK | Resin, Block Paving & Tarmac (Free Tool)',
      description: 'Free UK driveway cost calculator. Estimate prices per m² for resin-bound, block paving, tarmac and gravel driveways including excavation.',
      keywords: ['driveway cost calculator uk', 'resin driveway cost per m2', 'block paving cost per m2', 'new driveway cost uk'],
    },
  },

  // =========================================================================
  // 17. HOUSE RENOVATION COST CALCULATOR
  // =========================================================================
  {
    id: 'house-renovation-calculator',
    slug: 'house-renovation-calculator',
    name: 'Full House Renovation Cost Calculator UK (2026 Rates)',
    shortTitle: 'Renovation Calculator',
    tagline: 'Calculate full property modernization, rewiring, replumbing, and turnkey fitout.',
    description: 'Free UK house renovation calculator. Estimate turnkey renovation costs based on floor area (m²), rewiring, heating replacement, new kitchen, bathrooms, and finish quality.',
    category: 'project_cost',
    badge: 'Major Projects',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'floorAreaM2',
        label: 'Total Floor Area',
        helperText: '2-bed terrace: ~70m², 3-bed semi: ~100m², 4-bed detached: 150m²+',
        type: 'number',
        defaultValue: 100.0,
        min: 30,
        max: 800,
        step: 5,
        unit: 'm2',
      },
      {
        id: 'finishLevel',
        label: 'Renovation Level',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'essential', label: 'Basic Refresh (£650–£950/m² — Paint, flooring, sanitaryware update)' },
          { value: 'standard', label: 'Full Modernisation (£950–£1,450/m² — Rewire, replumb, new kitchen & bathrooms, plastering)' },
          { value: 'premium', label: 'High-End Architectural (£1,450–£2,100/m² — Structural layout change, UFH, bespoke joinery)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const area = Number(inputs.floorAreaM2) || 100;
      const finish = inputs.finishLevel || 'standard';

      let rate = PROJECT_M2_GUIDE_RATES.fullHouseRenovationM2;
      if (finish === 'essential') rate = { low: 650, high: 950 };
      if (finish === 'premium') rate = { low: 1450, high: 2100 };

      const baseLow = Math.round(area * rate.low);
      const baseHigh = Math.round(area * rate.high);

      const totalLow = Math.round((baseLow * 1.1) / 1000) * 1000;
      const totalHigh = Math.round((baseHigh * 1.1) / 1000) * 1000;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Full Renovation Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Kitchen & Bathrooms Replacement', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.28).toLocaleString()} – £${Math.round(totalHigh * 0.28).toLocaleString()}` },
          { name: 'Full Electrical Rewire & Heating System', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.22).toLocaleString()} – £${Math.round(totalHigh * 0.22).toLocaleString()}` },
          { name: 'Plaster Skim, Joinery, Doors & Decorating', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.25).toLocaleString()} – £${Math.round(totalHigh * 0.25).toLocaleString()}` },
          { name: 'Flooring Throughout & Subfloor Prep', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.15).toLocaleString()} – £${Math.round(totalHigh * 0.15).toLocaleString()}` },
          { name: 'Contingency Reserve (10%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.1).toLocaleString()} – £${Math.round(totalHigh * 0.1).toLocaleString()}` },
        ],
        assumptions: [
          `Total property floor area: ${area} m².`,
          `Includes complete trade coordination from strip out to turnkey completion.`,
          `Includes 10% contingency reserve.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.45),
          materialsCostHigh: Math.round(totalHigh * 0.45),
          labourCostLow: Math.round(totalLow * 0.45),
          labourCostHigh: Math.round(totalHigh * 0.45),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['Whole house turnkey specification.', 'Certified NICEIC electricals and Gas Safe plumbing.'],
    faqs: [
      {
        question: 'How much does it cost to renovate a 3-bedroom house in the UK?',
        answer: 'Renovating a standard 3-bedroom house (approx 90–110m²) in the UK typically costs between £75,000 and £125,000 for a comprehensive modernisation including new kitchen, bathrooms, rewiring, heating, plastering, and flooring.',
      },
    ],
    relatedCalculators: ['kitchen-cost-calculator', 'bathroom-cost-calculator', 'extension-cost-calculator'],
    relatedProjectType: 'full-renovation',
    relatedServices: [
      { title: 'Full House Renovations', href: '/services/renovations', desc: 'Turnkey period home restoration and modernisation' },
    ],
    commercialCta: {
      title: 'Planning a Full Property Renovation?',
      description: 'Configure your room-by-room scope in our AI planner for an itemized estimate with dedicated project management.',
      buttonText: 'Plan Full House Renovation →',
      buttonHref: '/plan-my-project?type=full-renovation',
    },
    seo: {
      title: 'House Renovation Cost Calculator UK | 2026 Estimate (Free Tool)',
      description: 'Free UK house renovation calculator. Estimate full property modernisation, rewiring, heating, kitchen, bathrooms and plastering costs per m².',
      keywords: ['house renovation cost calculator uk', 'how much to renovate a house', 'full house renovation cost', 'renovation cost per m2 uk'],
    },
  },

  // =========================================================================
  // 18. GARAGE CONVERSION COST CALCULATOR
  // =========================================================================
  {
    id: 'garage-conversion-calculator',
    slug: 'garage-conversion-calculator',
    name: 'Garage Conversion Cost Calculator UK (2026)',
    shortTitle: 'Garage Calculator',
    tagline: 'Calculate costs to convert an attached or integrated garage into habitable living space.',
    description: 'Free UK garage conversion calculator. Estimate turnkey garage conversion costs including door brick infill, subfloor damp proofing, insulation, window installation, and building regs.',
    category: 'project_cost',
    badge: 'Interior Conversion',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'garageType',
        label: 'Garage Size & Format',
        type: 'select',
        defaultValue: 'single_integrated',
        options: [
          { value: 'single_integrated', label: 'Single Integrated / Attached Garage (~15m² / £11,500–£17,500)' },
          { value: 'double_garage', label: 'Double Garage (~30m² / £18,000–£28,000)' },
          { value: 'detached_garage', label: 'Detached Garage Conversion (~18m² / £16,000–£24,000)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const type = inputs.garageType || 'single_integrated';
      let totalLow = 11500;
      let totalHigh = 17500;

      if (type === 'double_garage') { totalLow = 18000; totalHigh = 28000; }
      if (type === 'detached_garage') { totalLow = 16000; totalHigh = 24000; }

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Garage Conversion Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Front Door Infill (Brick / Window)', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.25).toLocaleString()} – £${Math.round(totalHigh * 0.25).toLocaleString()}` },
          { name: 'Floor Insulation, Screed & Damp Proofing', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.2).toLocaleString()} – £${Math.round(totalHigh * 0.2).toLocaleString()}` },
          { name: 'Wall & Ceiling Insulation (Part L), Plastering & Electrics', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.45).toLocaleString()} – £${Math.round(totalHigh * 0.45).toLocaleString()}` },
          { name: 'Contingency Reserve (10%)', quantity: 1, unit: 'allowance', formattedQuantity: `£${Math.round(totalLow * 0.1).toLocaleString()} – £${Math.round(totalHigh * 0.1).toLocaleString()}` },
        ],
        assumptions: [
          `Turnkey conversion to habitable room complying with Building Regulations.`,
          `Includes insulated subfloor, new double-glazed window in door opening, electrical circuits, and radiator heating.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.45),
          materialsCostHigh: Math.round(totalHigh * 0.45),
          labourCostLow: Math.round(totalLow * 0.45),
          labourCostHigh: Math.round(totalHigh * 0.45),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['Compliant with Part L thermal standards.', 'Includes Building Regulations certificate.'],
    faqs: [
      {
        question: 'Do I need planning permission for a garage conversion in the UK?',
        answer: 'Most garage conversions fall under Permitted Development and do not require planning permission, provided the work is internal and you are not in a conservation area. However, Building Regulations approval is always required.',
      },
    ],
    relatedCalculators: ['brick-calculator', 'plaster-calculator', 'extension-cost-calculator'],
    relatedProjectType: 'other',
    relatedServices: [
      { title: 'Garage Conversions', href: '/services/garage-conversions', desc: 'Turnkey conversion into habitable bedrooms, offices and living spaces' },
    ],
    commercialCta: {
      title: 'Planning a Garage Conversion or Home Office?',
      description: 'Our building team handles building regulations, insulated floors, window infill, and electrical heating installations.',
      buttonText: 'Book Free Site Survey →',
      buttonHref: '/contact?type=consultation',
    },
    seo: {
      title: 'Garage Conversion Cost Calculator UK | 2026 Estimate (Free Tool)',
      description: 'Free UK garage conversion calculator. Estimate costs to convert single and double garages into habitable bedrooms, home offices and living rooms.',
      keywords: ['garage conversion cost calculator uk', 'how much does a garage conversion cost', 'convert garage to room cost', 'garage conversion building regs'],
    },
  },

  // =========================================================================
  // 19. GARDEN ROOM / STUDIO COST CALCULATOR
  // =========================================================================
  {
    id: 'garden-room-calculator',
    slug: 'garden-room-calculator',
    name: 'Insulated Garden Room & Studio Cost Calculator UK',
    shortTitle: 'Garden Studio Calculator',
    tagline: 'Calculate costs for year-round insulated timber garden offices and gyms.',
    description: 'Free UK garden room calculator. Estimate turnkey garden studio costs including ground screw foundations, super-insulated timber framework, aluminium bifold doors, and electrical connection.',
    category: 'project_cost',
    badge: 'Outdoor Buildings',
    defaultWastePercent: 0,
    allowedWasteOptions: [0],
    inputs: [
      {
        id: 'lengthM',
        label: 'Garden Studio Length',
        type: 'number',
        defaultValue: 5.0,
        min: 2.5,
        max: 12,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Garden Studio Width',
        type: 'number',
        defaultValue: 3.5,
        min: 2.0,
        max: 8,
        step: 0.5,
        unit: 'm',
      },
    ],
    calculate: (inputs) => {
      const l = Number(inputs.lengthM) || 5;
      const w = Number(inputs.widthM) || 3.5;
      const area = l * w;

      const baseLow = Math.round(area * PROJECT_M2_GUIDE_RATES.gardenStudioM2.low);
      const baseHigh = Math.round(area * PROJECT_M2_GUIDE_RATES.gardenStudioM2.high);

      const totalLow = Math.round((baseLow * 1.1) / 500) * 500;
      const totalHigh = Math.round((baseHigh * 1.1) / 500) * 500;

      return {
        primaryValue: totalLow,
        primaryUnit: 'GBP',
        formattedPrimary: `£${totalLow.toLocaleString()} – £${totalHigh.toLocaleString()}`,
        primaryLabel: 'Estimated Turnkey Garden Room Cost',
        wasteAppliedPercent: 0,
        wasteUnitsCount: 0,
        materials: [
          { name: 'Ground Screw Foundation System', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.15).toLocaleString()} – £${Math.round(totalHigh * 0.15).toLocaleString()}` },
          { name: 'Super-Insulated SIPs / Timber Frame & Cladding', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.45).toLocaleString()} – £${Math.round(totalHigh * 0.45).toLocaleString()}` },
          { name: 'Aluminium Bifold Doors & Glazing', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.2).toLocaleString()} – £${Math.round(totalHigh * 0.2).toLocaleString()}` },
          { name: 'Armoured Electrical Cable Run, Lighting & Heating', quantity: 1, unit: 'package', formattedQuantity: `£${Math.round(totalLow * 0.2).toLocaleString()} – £${Math.round(totalHigh * 0.2).toLocaleString()}` },
        ],
        assumptions: [
          `Floor area: ${area} m² (${l}m × ${w}m).`,
          `Year-round insulated construction with composite cladding and aluminium doors.`,
          `Includes mains electrical trench connection up to 20m from main house consumer unit.`,
        ],
        pricing: {
          materialsCostLow: Math.round(totalLow * 0.5),
          materialsCostHigh: Math.round(totalHigh * 0.5),
          labourCostLow: Math.round(totalLow * 0.4),
          labourCostHigh: Math.round(totalHigh * 0.4),
          totalCostLow: totalLow,
          totalCostHigh: totalHigh,
          currency: 'GBP (£)',
          contingencyIncluded: 10,
        },
      };
    },
    assumptions: ['Includes ground screw foundation.', 'Armoured electrical cable run included.'],
    faqs: [
      {
        question: 'Can a garden room be built under Permitted Development?',
        answer: 'Yes, most garden rooms under 2.5m eaves height situated at least 2 meters from boundaries fall within Permitted Development rules and do not require planning permission.',
      },
    ],
    relatedCalculators: ['patio-calculator', 'decking-calculator', 'extension-cost-calculator'],
    relatedProjectType: 'garden',
    relatedServices: [
      { title: 'Garden Rooms & Studios', href: '/services/garden-rooms', desc: 'Bespoke insulated garden offices, gyms and luxury outdoor living' },
    ],
    commercialCta: {
      title: 'Looking for a Bespoke Insulated Garden Studio?',
      description: 'Our team designs and constructs luxury garden offices, home gyms, and cinema rooms with full insulation and guarantees.',
      buttonText: 'Plan My Garden Project →',
      buttonHref: '/plan-my-project?type=garden',
    },
    seo: {
      title: 'Garden Room Cost Calculator UK | Insulated Studio Build Estimate (Free Tool)',
      description: 'Free UK garden room calculator. Estimate build costs for insulated garden offices, timber studios and gyms per m² with foundations.',
      keywords: ['garden room cost calculator uk', 'how much does a garden room cost', 'garden office cost calculator', 'insulated garden studio price'],
    },
  },

  // =========================================================================
  // 20. FLOORING AREA CALCULATOR
  // =========================================================================
  {
    id: 'flooring-calculator',
    slug: 'flooring-calculator',
    name: 'Flooring Area, Packs & Underlay Calculator UK',
    shortTitle: 'Flooring Calculator',
    tagline: 'Calculate wood flooring packs, underlay rolls, and perimeter beading trims.',
    description: 'Free UK flooring calculator. Calculate engineered hardwood, laminate, and LVT flooring pack requirements, acoustic underlay rolls, and expansion trims with cutting waste.',
    category: 'trade_material',
    badge: 'Finishing & Flooring',
    defaultWastePercent: 10,
    allowedWasteOptions: [5, 10, 15],
    inputs: [
      {
        id: 'lengthM',
        label: 'Room Length',
        type: 'number',
        defaultValue: 6.0,
        min: 1,
        max: 50,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'widthM',
        label: 'Room Width',
        type: 'number',
        defaultValue: 4.0,
        min: 1,
        max: 50,
        step: 0.5,
        unit: 'm',
      },
      {
        id: 'packSizeM2',
        label: 'Pack Coverage (m² per pack)',
        type: 'number',
        defaultValue: 2.16,
        min: 1.0,
        max: 5.0,
        step: 0.01,
        unit: 'm2',
      },
    ],
    calculate: (inputs, wastePercent) => {
      const l = Number(inputs.lengthM) || 6;
      const w = Number(inputs.widthM) || 4;
      const packM2 = Number(inputs.packSizeM2) || 2.16;

      const netArea = l * w;
      const totalAreaWithWaste = netArea * (1 + (wastePercent || 10) / 100);
      const packsCount = Math.ceil(totalAreaWithWaste / packM2);
      const underlayRolls = Math.ceil(netArea / 15);
      const perimeterM = (l + w) * 2;
      const beadingLengths24m = Math.ceil((perimeterM * 1.1) / 2.4);

      return {
        primaryValue: packsCount,
        primaryUnit: 'Packs',
        formattedPrimary: `${packsCount} Flooring Packs`,
        primaryLabel: 'Total Flooring Packs Required',
        wasteAppliedPercent: wastePercent,
        wasteUnitsCount: Math.ceil(packsCount - netArea / packM2),
        materials: [
          { name: 'Flooring Packs', quantity: packsCount, unit: 'packs', formattedQuantity: `${packsCount} packs (${(packsCount * packM2).toFixed(1)} m² total)`, notes: `Covers ${netArea}m² net room area + ${wastePercent}% waste` },
          { name: 'Acoustic Underlay (15m² rolls)', quantity: underlayRolls, unit: 'rolls', formattedQuantity: `${underlayRolls} × 15m² rolls`, notes: 'Thermal & sound reduction membrane' },
          { name: 'Perimeter Beading / Scotia (2.4m lengths)', quantity: beadingLengths24m, unit: 'lengths', formattedQuantity: `${beadingLengths24m} × 2.4m lengths`, notes: 'Covers 10mm expansion gap around perimeter' },
        ],
        assumptions: [
          `Room area: ${netArea} m² (${l}m × ${w}m).`,
          `Includes ${wastePercent}% waste allowance for staggered plank joins and edge cuts.`,
          `Pack coverage: ${packM2} m² per box.`,
        ],
      };
    },
    pricingEstimate: (qResult) => {
      const area = qResult.materials[0].quantity * 2.16;
      const matLow = area * 25 + 50;
      const matHigh = area * 75 + 120;
      const daysLow = Math.max(1, area / 25);
      const daysHigh = Math.max(1, area / 18);

      return calculateTradeCostRange(matLow, matHigh, daysLow, daysHigh, LABOUR_RATES.tilerDayRate);
    },
    assumptions: ['Standard 10% expansion cutting allowance.', 'Includes acoustic underlay and scotia trims.'],
    faqs: [
      {
        question: 'How much extra flooring should I order for waste?',
        answer: 'Order 10% extra for standard straight plank laying. If installing herringbone parquet flooring, order 15% extra due to extensive 45-degree angle cutting at the perimeter walls.',
      },
    ],
    relatedCalculators: ['tile-calculator', 'plaster-calculator', 'house-renovation-calculator'],
    relatedProjectType: 'full-renovation',
    commercialCta: {
      title: 'Planning New Flooring or Full House Renovation?',
      description: 'Our flooring specialists install subfloor leveling screeds, engineered hardwood herringbone, and luxury Amtico/Karndean LVT.',
      buttonText: 'Plan My Renovation →',
      buttonHref: '/plan-my-project?type=full-renovation',
    },
    seo: {
      title: 'Flooring Calculator UK | Packs, Area & Underlay (Free Tool)',
      description: 'Free UK flooring calculator. Calculate exact packs of engineered wood, laminate or LVT, underlay rolls, scotia trims and installation costs.',
      keywords: ['flooring calculator uk', 'how many packs of flooring do i need', 'laminate flooring calculator', 'engineered wood calculator'],
    },
  },
];

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return MASTER_CALCULATORS.find((c) => c.slug === slug);
}
