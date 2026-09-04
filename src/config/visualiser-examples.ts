/**
 * Curated Indexable Visualiser Example Projects
 * High-quality, human-reviewed, indexable architectural project examples.
 * Complies with GEMINI.md Section 23 & Master Visualiser Rebuild Specification.
 */

export interface VisualiserExampleProject {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  projectType: string;
  location: string;
  propertyType: string;
  propertyEra: string;
  dimensionsText: string;
  estimatedCostRange: string;
  duration: string;
  heroImage: string;
  briefDescription: string;
  keyHighlights: string[];
  keyChallenges: string[];
  recommendedSolutions: string[];
  initialPrompt: string;
  initialDimensions: { length: number; width: number; height: number };
}

export const VISUALISER_EXAMPLES: VisualiserExampleProject[] = [
  {
    slug: 'rear-extension',
    title: 'Victorian Terraced Rear Extension & Kitchen Diner',
    h1: 'Victorian Terraced Rear Extension Visualiser Plan (Ealing, London)',
    metaTitle: 'Victorian Rear Extension Plan & Scope | AI Visualiser Example | ST Contractors',
    metaDescription: 'Explore a complete architectural scope, structural steel plan, and 3 finish tiers for a 5.0m x 3.5m Victorian terraced house extension in Ealing, West London.',
    projectType: 'House Extension & Open-Plan Kitchen',
    location: 'Ealing, West London (W5)',
    propertyType: 'Mid-Terraced Victorian House',
    propertyEra: 'Victorian (1890s)',
    dimensionsText: '5.0m Depth × 3.8m Width (19.0 m² net ground extension)',
    estimatedCostRange: '£55,000 – £85,000+ VAT',
    duration: '10 – 14 Weeks',
    heroImage: '/images/services/house-extensions.png',
    briefDescription:
      'Homeowner wanted to extend the ground floor out into the garden to create a light-filled kitchen-diner with an oversized quartz island, structural glass rooflight, and slimline aluminium bifold doors opening onto a flush patio.',
    keyHighlights: [
      'Twin Universal Beam RSJ steel goalposts supporting the rear outrigger',
      'Frameless structural glass rooflight strip running along the side boundary',
      'Suspended timber subfloor sistering with C24 timber to prevent island sag',
      'Full Thames Water build-over agreement for shared rear combined sewer',
    ],
    keyChallenges: [
      'Zero external side access requiring spoil barrowing through the front hall',
      'Party Wall Act notices required with both adjoining terraced neighbours',
    ],
    recommendedSolutions: [
      'Airtight corex floor protection and dust screens throughout the hallway',
      'Early Section 1 and Section 6 Party Wall notices served 2 months prior to works',
    ],
    initialPrompt: 'I want a 5m x 3.8m rear extension on a Victorian terrace with a central kitchen island, bifold doors, and a glass rooflight.',
    initialDimensions: { length: 5.0, width: 3.8, height: 2.4 },
  },
  {
    slug: 'kitchen-renovation',
    title: 'Chiswick Open-Plan Kitchen Knockthrough & Crittall Doors',
    h1: 'Open-Plan Kitchen Knockthrough & Crittall Plan (Chiswick, London)',
    metaTitle: 'Kitchen Knockthrough Plan & Scope | AI Visualiser Example | ST Contractors',
    metaDescription: 'Complete design and scope plan for an open-plan kitchen knockthrough with Crittall glass doors, Calacatta quartz island, and underfloor heating in Chiswick.',
    projectType: 'Kitchen Renovation & Structural Alteration',
    location: 'Chiswick, West London (W4)',
    propertyType: 'Edwardian Semi-Detached House',
    propertyEra: 'Edwardian (1905)',
    dimensionsText: '6.2m Length × 4.4m Width (27.3 m² open-plan space)',
    estimatedCostRange: '£35,000 – £65,000+ VAT',
    duration: '4 – 7 Weeks',
    heroImage: '/images/services/kitchen-renovations.png',
    briefDescription:
      'Removing the load-bearing dividing wall between the original kitchen and rear dining room to create a contemporary open-plan family kitchen with black Crittall glass screens, herringbone parquet, and central downdraft induction cooking.',
    keyHighlights: [
      'Load-bearing masonry removal with 203x203 UC steel beam on concrete padstones',
      'Bora central downdraft induction hob eliminating overhead island hood',
      'Prime engineered oak herringbone parquet with manifold underfloor heating',
      'Farrow & Ball painted in-frame shaker cabinetry with antique brass handles',
    ],
    keyChallenges: [
      'Channelling 32A power and waste drainage into the existing suspended floor',
      'Acoustic sound transmission through party wall to neighbouring property',
    ],
    recommendedSolutions: [
      'High-density acoustic mineral wool and resilient sound-break stud walls',
      'Subfloor conduits pre-routed before laying acoustic underlay deck',
    ],
    initialPrompt: 'Remove the wall between kitchen and dining room, install an island with seating, herringbone wood floor, and black Crittall glass doors.',
    initialDimensions: { length: 6.2, width: 4.4, height: 2.6 },
  },
  {
    slug: 'loft-conversion',
    title: 'Richmond Rear Dormer Master Bedroom Suite & En-Suite',
    h1: 'Rear Dormer Loft Conversion Visualiser Plan (Richmond, London)',
    metaTitle: 'Loft Conversion Master Suite Plan | AI Visualiser Example | ST Contractors',
    metaDescription: 'Detailed architectural scope and specification for a rear dormer loft conversion with en-suite wet room and Juliet balcony in Richmond, South West London.',
    projectType: 'Loft Conversion & En-Suite',
    location: 'Richmond, South West London (TW9)',
    propertyType: 'Period 1930s Family Home',
    propertyEra: '1930s Semi-Detached',
    dimensionsText: '6.5m Length × 4.2m Width (27.3 m² master suite + 4.5 m² en-suite)',
    estimatedCostRange: '£48,000 – £78,000+ VAT',
    duration: '8 – 12 Weeks',
    heroImage: '/images/services/loft-conversions.png',
    briefDescription:
      'Converting unutilised roof volume into an expansive master bedroom suite featuring floor-to-ceiling French doors with a glass Juliet balcony, custom eaves wardrobe joinery, and a luxury walk-in wet room.',
    keyHighlights: [
      'Independent structural steel floor beams bolted into flank party walls',
      'Full Schlüter waterproof tanking and walk-in linear drain wet room',
      'Bespoke architectural staircase seamlessly matching ground-floor spindles',
      'Permitted Development compliant under the 50m³ volume allowance',
    ],
    keyChallenges: [
      'Building Regs Part B fire safety requiring FD30 fire doors to all lower hallway doors',
      'Maintaining minimum 2.0m vertical headroom clearance along all stair treads',
    ],
    recommendedSolutions: [
      'Precision CAD staircase geometry design ensuring 2.1m clear headroom throughout',
      'Upgrading all hallway doors with period-matching FD30 fire-resistant cores',
    ],
    initialPrompt: 'Convert attic into a master bedroom with dormer, en-suite walk-in shower, Juliet balcony, and built-in eaves wardrobes.',
    initialDimensions: { length: 6.5, width: 4.2, height: 2.3 },
  },
];
