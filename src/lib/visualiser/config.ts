import { VisualiserConcept } from '@/types/visualiser';

export const VISUALISER_CONCEPTS: VisualiserConcept[] = [
  {
    id: 'concept-contemporary-extension',
    name: 'Contemporary Frameless Glass Rear Extension',
    category: 'extension',
    style: 'contemporary_glass',
    tagline: 'Maximized daylight with flush floor-to-ceiling structural glass & slimline aluminium sliders.',
    description: 'Designed for London Victorian and Edwardian properties looking for a seamless indoor-outdoor transition into the garden. Features recessed box guttering, insulated flush thresholds, and integrated automated rooflights.',
    image: '/images/case-studies/ealing-rear-extension.png',
    indicativeCostPerM2: 2750,
    typicalTotalRange: '£75,000 – £115,000',
    glazing: 'frameless_glass_box',
    flooring: 'large_porcelain_tiles',
    worktop: 'calacatta_quartz',
    structuralNotes: [
      'Requires goalpost RSJ steel frame to support upper brickwork floors without intermediate columns.',
      'Flush threshold requires subfloor slot drainage channels connected to rainwater soakaway.',
      'Check Thames Water sewer line depth before foundation trench excavation.',
    ],
    statutoryConsiderations: {
      planningStatus: 'Permitted Development likely',
      partyWallRequired: true,
      buildingRegsPart: ['Part A (Structure)', 'Part L (Thermal Efficiency SAP)', 'Part K (Glazing Safety)'],
    },
    pros: [
      'Maximum natural light penetration deep into dark Victorian reception rooms',
      'Completely flush transition between kitchen and patio',
      'Adds significant commercial resale value in London boroughs',
    ],
    cons: [
      'Structural glass and bespoke goalpost steel have longer fabrication lead times (4–6 weeks)',
      'Requires solar control low-E glass coatings to avoid summer overheating',
    ],
  },
  {
    id: 'concept-industrial-crittall',
    name: 'Industrial Black Steel Crittall Kitchen Knockthrough',
    category: 'kitchen',
    style: 'industrial_crittall',
    tagline: 'Architectural black acoustic steel glazing with polished microcement and fluted oak joinery.',
    description: 'Creates a striking zoning effect between open-plan kitchen dining areas and formal living spaces while retaining light flow and acoustic separation.',
    image: '/images/case-studies/chiswick-kitchen.png',
    indicativeCostPerM2: 2450,
    typicalTotalRange: '£45,000 – £75,000',
    glazing: 'crittall_steel_doors',
    flooring: 'microcement_seamless',
    worktop: 'sintered_stone_dekton',
    structuralNotes: [
      'Chimney breast removal requires twin steel beams with concrete padstones bearing into party structure.',
      'Microcement requires minimum 18mm marine plywood or decoupling matting over underfloor heating screed.',
    ],
    statutoryConsiderations: {
      planningStatus: 'Permitted Development likely',
      partyWallRequired: true,
      buildingRegsPart: ['Part A (Structure)', 'Part P (Electrical First Fix)', 'Part G (Sanitation)'],
    },
    pros: [
      'Superior acoustic isolation for home working while maintaining visual connection',
      'Timeless architectural aesthetic that pairs seamlessly with period cornicing',
      'Heat & stain-proof Dekton surfaces suitable for heavy culinary use',
    ],
    cons: [
      'Authentic steel doors are heavier and require reinforced floor fixings',
      'Higher unit cost than standard UPVC or timber partition doors',
    ],
  },
  {
    id: 'concept-heritage-period-restoration',
    name: 'Classic Heritage Restoration & Side Return',
    category: 'extension',
    style: 'heritage_period',
    tagline: 'London stock brick matching, traditional timber sash windows, and herringbone oak flooring.',
    description: 'Specialized for Conservation Areas across Richmond, Kensington, Chiswick, and Islington. Preserves historic Victorian proportions with traditional lime pointing and bespoke timber French patio doors.',
    image: '/images/case-studies/richmond-victorian-villa.png',
    indicativeCostPerM2: 2600,
    typicalTotalRange: '£85,000 – £130,000',
    glazing: 'heritage_timber_french',
    flooring: 'herringbone_engineered_oak',
    worktop: 'carrara_marble',
    structuralNotes: [
      'Requires hydraulic lime mortar for all exterior brickwork to allow natural vapor permeability.',
      'Suspended timber subfloors must be sistered and insulated with breathable wood-fibre batts.',
    ],
    statutoryConsiderations: {
      planningStatus: 'Full Planning required',
      partyWallRequired: true,
      buildingRegsPart: ['Part A (Structure)', 'Part L (Conservation Area Concessions)', 'Part F (Ventilation)'],
    },
    pros: [
      'Compliant with strict London Conservation Area planning guidelines',
      'Engineered herringbone oak compatible with hydronic underfloor heating',
      'Preserves authentic architectural character and kerb appeal',
    ],
    cons: [
      'Timber joinery requires periodic maintenance (repainting every 5–7 years)',
      'Planning approvals typically take 8–10 weeks in conservation zones',
    ],
  },
  {
    id: 'concept-scandinavian-minimalist-studio',
    name: 'Scandinavian Warm Minimalist Garden Studio',
    category: 'garden_studio',
    style: 'scandinavian_minimal',
    tagline: 'Western Red Cedar cladding, triple-glazed aluminium sliders, and acoustic slat panelling.',
    description: 'Year-round habitable insulated studio for executive home working, fitness, or creative studio. Built with structural insulated panels (SIPs) and ground screw foundations for zero lawn disruption.',
    image: '/images/case-studies/kew-garden-studio.png',
    indicativeCostPerM2: 2150,
    typicalTotalRange: '£32,000 – £52,000',
    glazing: 'slimline_aluminium_bifold',
    flooring: 'herringbone_engineered_oak',
    structuralNotes: [
      'Ground screw pile foundations eliminate concrete disposal and skip permit costs.',
      'Armoured SWA power cable & Cat6 ethernet trenched at 600mm depth back to consumer unit.',
    ],
    statutoryConsiderations: {
      planningStatus: 'Permitted Development likely',
      partyWallRequired: false,
      buildingRegsPart: ['Part P (Electrical Certification)', 'Part L (Insulation Standards)'],
    },
    pros: [
      'Rapid on-site assembly (2–3 weeks total construction duration)',
      'Permitted Development compliant under 2.5m maximum height rule within 2m of boundary',
      'No disruption to main house living areas during construction',
    ],
    cons: [
      'Adding toilet/shower requires Thames Water waste drainage pump station (+£3,500)',
      'Cedar cladding requires UV-protective oiling every 3 years to maintain golden tone',
    ],
  },
];

export const GLAZING_PRICE_MODIFIERS: Record<string, { label: string; deltaPerM2: number; leadTimeWeeks: number }> = {
  frameless_glass_box: { label: 'Frameless Structural Glass Box', deltaPerM2: 350, leadTimeWeeks: 6 },
  slimline_aluminium_bifold: { label: 'Slimline Aluminium Bi-folds (20mm sightlines)', deltaPerM2: 0, leadTimeWeeks: 3 },
  crittall_steel_doors: { label: 'Black Architectural Steel Crittall Doors', deltaPerM2: 420, leadTimeWeeks: 8 },
  heritage_timber_french: { label: 'Bespoke Painted Timber French Doors & Sashes', deltaPerM2: 220, leadTimeWeeks: 5 },
  skylight_roof_lantern: { label: 'Thermally Broken Roof Lantern & Flat Rooflight', deltaPerM2: 180, leadTimeWeeks: 2 },
};

export const FLOORING_PRICE_MODIFIERS: Record<string, { label: string; deltaPerM2: number }> = {
  herringbone_engineered_oak: { label: 'Prime European Engineered Oak (Herringbone)', deltaPerM2: 110 },
  microcement_seamless: { label: 'Seamless Architectural Microcement Floor', deltaPerM2: 140 },
  large_porcelain_tiles: { label: 'Large Format 1200x600mm Rectified Porcelain', deltaPerM2: 85 },
  polished_concrete: { label: 'Diamond Polished Structural Concrete', deltaPerM2: 160 },
};
