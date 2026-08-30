/**
 * MASTER LOCATION & SERVICE AREA DATASET
 * High quality, authentic location guides for London & Surrey service areas.
 * Conforms to GEMINI.md Section 6, 11 & BUILD_SPEC.md Section 6
 */

import { LocationAreaGuide } from './types';

export const LOCATIONS_DATA: LocationAreaGuide[] = [
  // =========================================================================
  // 1. EALING
  // =========================================================================
  {
    id: 'ealing',
    slug: 'ealing',
    name: 'Ealing',
    borough: 'London Borough of Ealing',
    region: 'West London & Middlesex',
    postcodes: ['W5', 'W13'],
    metaTitle: 'Builders in Ealing | House Extensions & Period Renovations W5 & W13',
    metaDescription: 'Trusted architectural building contractors in Ealing. High-spec kitchen extensions, loft conversions, and period Victorian home renovations across W5 and W13.',
    keywords: ['builders in ealing', 'house extension ealing w5', 'loft conversion ealing', 'period renovation ealing', 'builders w5 w13'],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    intro: 'As premier building contractors serving Ealing, we specialize in sympathetic Victorian and Edwardian architectural renovations, expansive ground-floor kitchen extensions, and bespoke loft conversions throughout Ealing Broadway, Pitshanger Village, and West Ealing.',
    localArchitecture: {
      title: 'Ealing Residential Architecture & Housing Stock',
      description: 'Ealing boasts exceptionally fine Victorian red-brick villas, Edwardian semi-detached family homes in the Brentham Garden Suburb, and wide 1930s avenues near Hanger Hill.',
      popularProperties: [
        'Victorian terraced homes ideal for side-return and rear wraparound extensions',
        'Edwardian semi-detached houses with substantial loft spaces for dormer conversions',
        'Substantial 1930s family homes suitable for double-storey extensions and open-plan kitchen diners',
      ],
    },
    planningGuidelines: {
      councilName: 'London Borough of Ealing Planning Department',
      permittedDevelopmentNotes: 'Ealing operates the standard Permitted Development scheme for larger rear extensions (up to 6m for attached homes and 8m for detached homes under Prior Approval).',
      conservationAreaNotes: 'Properties in the Brentham Garden Suburb, Ealing Green, and Mount Park Conservation Areas are subject to Article 4 Directions, requiring full planning permission for external modifications.',
    },
    servicesAvailable: [
      { title: 'House Extensions', slug: 'extensions', description: 'Single storey, side return, and wraparound extensions with aluminium bifold doors.' },
      { title: 'Period Renovations', slug: 'renovations', description: 'Full structural overhaul, rewiring, replumbing, and turnkey period decorating.' },
      { title: 'Loft Conversions', slug: 'loft-conversions', description: 'Rear dormer and mansard conversions creating luxury master bedrooms and ensuites.' },
      { title: 'Kitchen Remodeling', slug: 'kitchen-renovations', description: 'Open-plan knockthroughs with structural steel RSJ beams and bespoke islands.' },
    ],
    featuredProjects: [
      {
        title: 'Contemporary Rear Extension & Kitchen Diner',
        slug: 'ealing-contemporary-rear-extension',
        type: 'Single Storey Extension',
        summary: 'A 28m² open-plan extension featuring flush ceiling structural steel, 4-pane aluminium bifolds, and 30mm Quartz island.',
      },
    ],
    faqs: [
      {
        question: 'Do you manage building regulations inspections with Ealing Council?',
        answer: 'Yes. We coordinate all statutory site inspections with Ealing Local Authority Building Control (or approved private inspectors) from foundation excavation through to issuing your final completion certificate.',
      },
      {
        question: 'How do parking permits work for building works in Ealing (W5/W13)?',
        answer: 'We handle trade parking permits, skip licenses on the public highway, and site logistics directly with Ealing Council prior to project commencement.',
      },
    ],
    relatedCalculatorSlug: 'extension-cost-calculator',
    relatedCostGuideSlug: 'extension-cost',
    status: 'published',
    commercialCta: {
      title: 'Planning a Building Project in Ealing?',
      description: 'Book a free consultation with our local construction team to discuss architectural drawings, feasibility, and receive an itemized estimate.',
      buttonText: 'Book Ealing Site Consultation →',
      buttonHref: '/contact?type=consultation',
    },
  },

  // =========================================================================
  // 2. RICHMOND
  // =========================================================================
  {
    id: 'richmond',
    slug: 'richmond',
    name: 'Richmond upon Thames',
    borough: 'London Borough of Richmond upon Thames',
    region: 'South West London & Surrey',
    postcodes: ['TW9', 'TW10'],
    metaTitle: 'Builders in Richmond | Period Home Renovations & Extensions TW9 TW10',
    metaDescription: 'Specialist residential builders in Richmond upon Thames. Conservation-compliant restorations, architectural extensions, and luxury garden studios in TW9 and TW10.',
    keywords: ['builders in richmond upon thames', 'house extension richmond', 'renovations richmond tw9 tw10', 'conservation builders richmond'],
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    intro: 'Delivering craftsmanship and conservation-compliant building delivery across Richmond upon Thames, Kew, East Sheen, and Richmond Hill. We specialize in high-end period home restorations, architectural extensions, and luxury garden studios.',
    localArchitecture: {
      title: 'Richmond Period Architecture & Conservation Guidelines',
      description: 'Richmond features some of the finest Georgian townhouses, Victorian riverside properties, and protected conservation zones in Greater London.',
      popularProperties: [
        'Georgian and early Victorian townhouses requiring bespoke timber sash restoration and breathable lime plaster',
        'Victorian villas with mature garden plots suited for architectural glass extensions and garden studios',
      ],
    },
    planningGuidelines: {
      councilName: 'Richmond upon Thames Planning & Conservation Department',
      permittedDevelopmentNotes: 'Permitted development is widely applicable outside designated conservation zones, with strict rules preserving historic rooflines.',
      conservationAreaNotes: 'Richmond has extensive conservation areas along the Thames riverside and Richmond Hill requiring heritage materials and sympathetic architectural detailing.',
    },
    servicesAvailable: [
      { title: 'Period Home Renovations', slug: 'renovations', description: 'Back-to-brick sympathetic refurbishment with modern energy efficiency.' },
      { title: 'Architectural Extensions', slug: 'extensions', description: 'Frameless glass additions, side returns, and open-plan kitchen living.' },
      { title: 'Garden Studios & Annexes', slug: 'garden-rooms', description: 'Insulated luxury timber garden offices and home gyms.' },
    ],
    featuredProjects: [
      {
        title: 'Full Period Home Renovation & Modernisation',
        slug: 'richmond-full-period-home-renovation',
        type: 'Turnkey Renovation',
        summary: 'Complete period overhaul including rewiring, wetroom ensuite, and custom joinery.',
      },
    ],
    faqs: [
      {
        question: 'Do you have experience working in Richmond Conservation Areas?',
        answer: 'Yes. We frequently liaise with Richmond upon Thames conservation officers to ensure materials, timber sash profiles, and brick matching meet all historic preservation requirements.',
      },
    ],
    relatedCalculatorSlug: 'house-renovation-calculator',
    relatedCostGuideSlug: 'house-renovation-cost',
    status: 'published',
    commercialCta: {
      title: 'Planning a Period Renovation in Richmond?',
      description: 'Discuss your project with our senior building team and arrange a detailed architectural site consultation.',
      buttonText: 'Book Richmond Consultation →',
      buttonHref: '/contact?type=consultation',
    },
  },

  // =========================================================================
  // 3. CHISWICK
  // =========================================================================
  {
    id: 'chiswick',
    slug: 'chiswick',
    name: 'Chiswick',
    borough: 'London Borough of Hounslow',
    region: 'West London',
    postcodes: ['W4'],
    metaTitle: 'Builders in Chiswick | Side Return Kitchen Extensions & Renovations W4',
    metaDescription: 'Trusted builders in Chiswick W4. Specialists in Victorian side-return kitchen extensions, open-plan structural knockthroughs, and luxury home conversions.',
    keywords: ['builders in chiswick', 'kitchen extension chiswick w4', 'side return extension chiswick', 'house renovation chiswick'],
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    intro: 'Transforming period family homes across Chiswick, Bedford Park, Strand-on-the-Green, and Grove Park with bespoke side-return kitchen extensions, glass roofs, and structural wall removals.',
    localArchitecture: {
      title: 'Chiswick Victorian & Queen Anne Style Architecture',
      description: 'Chiswick is renowned for Norman Shaw Queen Anne architecture in Bedford Park and Victorian terraced cottages ideal for side return infill extensions.',
      popularProperties: [
        'Victorian terraced family homes ideal for side-return glass infill extensions',
        'Bedford Park heritage properties requiring bespoke timber detailing and matching handmade brickwork',
      ],
    },
    planningGuidelines: {
      councilName: 'London Borough of Hounslow Planning Department',
      permittedDevelopmentNotes: 'Side return extensions under 3m height and within 50% plot boundaries frequently qualify under Permitted Development in W4.',
      conservationAreaNotes: 'Bedford Park and Strand-on-the-Green have strict Article 4 directions requiring planning permission for front windows, doors, and rooflights.',
    },
    servicesAvailable: [
      { title: 'Side Return Extensions', slug: 'extensions', description: 'Transforming dark side passages into light-filled open-plan kitchen diners.' },
      { title: 'Kitchen Knockthroughs', slug: 'kitchen-renovations', description: 'Flush steel RSJ installations with bespoke quartz islands.' },
    ],
    featuredProjects: [
      {
        title: 'Bespoke Kitchen Knockthrough & Island',
        slug: 'chiswick-bespoke-kitchen-knockthrough',
        type: 'Kitchen Renovation',
        summary: 'Dividing wall removed with hidden flush RSJ steel, 30mm Quartz waterfall island, and bifold doors.',
      },
    ],
    faqs: [
      {
        question: 'How long does a side return extension in Chiswick take?',
        answer: 'A standard Chiswick side return extension takes approximately 12 to 16 weeks from ground excavation to turnkey decorated handover.',
      },
    ],
    relatedCalculatorSlug: 'kitchen-cost-calculator',
    relatedCostGuideSlug: 'kitchen-renovation-cost',
    status: 'published',
    commercialCta: {
      title: 'Planning a Chiswick Kitchen Extension?',
      description: 'Our team designs and builds side return extensions and full property refurbishments across W4.',
      buttonText: 'Book Chiswick Consultation →',
      buttonHref: '/contact?type=consultation',
    },
  },

  // =========================================================================
  // 4. HARROW
  // =========================================================================
  {
    id: 'harrow',
    slug: 'harrow',
    name: 'Harrow',
    borough: 'London Borough of Harrow',
    region: 'North West London & Middlesex',
    postcodes: ['HA1', 'HA2', 'HA3'],
    metaTitle: 'Builders in Harrow | House Extensions & Loft Conversions HA1 HA2 HA3',
    metaDescription: 'Established building contractors in Harrow. High-quality double-storey extensions, dormer loft conversions, and resin driveways across HA1, HA2, and HA3.',
    keywords: ['builders in harrow', 'house extension harrow ha1 ha2', 'loft conversion harrow', 'driveway contractors harrow'],
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    intro: 'Specializing in substantial semi-detached and detached double-storey extensions, dormer loft conversions, and permeable driveway paving in Harrow on the Hill, Pinner, Hatch End, and Stanmore.',
    localArchitecture: {
      title: 'Harrow Residential Architecture',
      description: 'Characterized by generous 1930s semi-detached properties, Metroland family homes with expansive rear gardens, and period cottages in Harrow on the Hill.',
      popularProperties: [
        '1930s semi-detached homes ideal for combined rear extension + hip-to-gable loft conversions',
        'Detached family homes with generous frontages suited for permeable resin-bound driveways',
      ],
    },
    planningGuidelines: {
      councilName: 'London Borough of Harrow Planning Department',
      permittedDevelopmentNotes: 'Larger Home Extension prior approval is popular across Harrow semi-detached stock, allowing up to 6m rear single-storey extensions.',
      conservationAreaNotes: 'Harrow on the Hill Conservation Area requires heritage materials and timber windows.',
    },
    servicesAvailable: [
      { title: 'Double Storey Extensions', slug: 'extensions', description: 'Adding substantial ground-floor living space and first-floor master bedrooms.' },
      { title: 'Hip-to-Gable Loft Conversions', slug: 'loft-conversions', description: 'Maximising 1930s semi-detached roofs for luxury bedrooms and ensuites.' },
      { title: 'Driveways & Entrances', slug: 'driveways', description: 'Permeable resin-bound and block paved driveways.' },
    ],
    featuredProjects: [
      {
        title: 'Contemporary Rear Extension & Kitchen Diner',
        slug: 'ealing-contemporary-rear-extension',
        type: 'House Extension',
        summary: 'Open-plan living transformation with aluminium bi-folds.',
      },
    ],
    faqs: [
      {
        question: 'Can you combine a loft conversion and ground-floor extension simultaneously?',
        answer: 'Yes. Carrying out both projects together achieves significant cost savings on scaffolding, skip waste, electrical rewiring, and overall project management.',
      },
    ],
    relatedCalculatorSlug: 'loft-conversion-calculator',
    relatedCostGuideSlug: 'loft-conversion-cost',
    status: 'published',
    commercialCta: {
      title: 'Planning an Extension or Loft in Harrow?',
      description: 'Book a free site consultation with our estimating team to review your dimensions and project scope.',
      buttonText: 'Book Harrow Consultation →',
      buttonHref: '/contact?type=consultation',
    },
  },
];

export function getLocationBySlug(slug: string): LocationAreaGuide | undefined {
  return LOCATIONS_DATA.find((l) => l.slug === slug);
}
