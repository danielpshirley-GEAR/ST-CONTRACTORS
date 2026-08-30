/**
 * MASTER ADVICE & KNOWLEDGE HUB DATASET
 * CMS-managed authoritative homeowner construction advice articles.
 * Conforms to GEMINI.md Section 11, 13, 19 & BUILD_SPEC.md Phase 4
 */

import { AdviceArticle } from './types';

export const ADVICE_ARTICLES_DATA: AdviceArticle[] = [
  // =========================================================================
  // 1. PERMITTED DEVELOPMENT FOR EXTENSIONS
  // =========================================================================
  {
    id: 'permitted-development-rules-extensions',
    slug: 'permitted-development-rules-extensions',
    title: 'Permitted Development Rights for House Extensions: 2026 UK Guide',
    seoTitle: 'Permitted Development Extensions UK 2026 | Rules & Limits',
    metaDescription: 'Complete guide to UK Permitted Development rights for house extensions in 2026. Single storey 6m/8m limits, height restrictions, boundary rules, and Prior Approval.',
    keywords: ['permitted development extension uk', 'how big can i extend without planning', '6m extension rules', '8m rear extension permitted development'],
    category: 'Planning',
    author: {
      name: 'David Reynolds',
      role: 'Principal Architectural Planner & Surveyor',
    },
    publishedDate: '2025-01-18',
    lastUpdated: '2026-02-12',
    readingTimeMinutes: 7,
    status: 'published',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Everything UK homeowners need to know about building a single or double-storey house extension without full planning permission under Permitted Development rights in 2026.',
    contentSections: [
      {
        heading: 'What is Permitted Development for House Extensions?',
        paragraphs: [
          'Permitted Development (PD) rights are statutory planning rights granted by Parliament that allow homeowners to extend, remodel, or convert their properties without needing to submit a full planning application to the local council.',
          'Under General Permitted Development Order (GPDO) rules, you can add single-storey rear extensions, side-returns, and loft conversions provided your project conforms strictly to established size, height, and boundary limits.',
        ],
      },
      {
        heading: 'Key Dimensions & Restrictions for Single-Storey Rear Extensions',
        paragraphs: [
          'For standard single-storey rear extensions, the following national limits apply:',
        ],
        bulletPoints: [
          'Attached Houses (Semi-detached / Terraced): You can extend up to 3 meters from the original rear wall as standard, or up to 6 meters under the Larger Home Extension Prior Approval scheme.',
          'Detached Houses: You can extend up to 4 meters as standard, or up to 8 meters under Larger Home Extension Prior Approval.',
          'Maximum Height: Single-storey extensions cannot exceed 4 meters in total height.',
          'Eaves Height: If the extension is within 2 meters of a boundary, the eaves height cannot exceed 3 meters.',
          'Plot Coverage: The extension (plus any other outbuildings) must not cover more than 50% of the total curtilage of the garden area around the original house.',
        ],
      },
      {
        heading: 'When Permitted Development Does NOT Apply',
        paragraphs: [
          'Permitted Development rights are automatically restricted or removed in specific circumstances:',
        ],
        bulletPoints: [
          'Flats and Maisonettes: PD rights only apply to single-family houses, never to flats.',
          'Conservation Areas & National Parks: Article 4 Directions frequently remove PD rights for side extensions, cladding, and front exterior changes.',
          'Listed Buildings: Any alteration to a Listed building requires formal Listed Building Consent and full planning permission.',
        ],
      },
      {
        heading: 'The Importance of a Lawful Development Certificate (LDC)',
        paragraphs: [
          'Even if your extension complies with all Permitted Development rules, we strongly advise applying for a Certificate of Lawful Development from your local planning authority before breaking ground.',
          'An LDC serves as permanent legal proof that your build was lawful at the time of construction, which is essential when selling the property or securing mortgage refinancing.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long does a Lawful Development Certificate take to obtain?',
        answer: 'Local planning authorities in England have a statutory timeframe of 8 weeks to determine a Lawful Development Certificate application.',
      },
      {
        question: 'Can I build right up to my neighbour’s boundary line under Permitted Development?',
        answer: 'Yes, provided your eaves height does not exceed 3 meters within 2 meters of the boundary and you comply with the legal notification requirements of the Party Wall etc. Act 1996.',
      },
    ],
    relatedArticleSlugs: ['planning-permission-vs-building-regulations', 'party-wall-act-guide'],
    relatedCalculatorSlug: 'extension-cost-calculator',
    relatedServiceSlug: 'extensions',
    relatedCaseStudySlug: 'ealing-contemporary-rear-extension',
    commercialCta: {
      title: 'Planning an Extension Under Permitted Development?',
      description: 'Our architectural team produces measured survey drawings, submits Lawful Development Certificates, and manages complete turnkey construction.',
      buttonText: 'Plan My Extension Project →',
      buttonHref: '/plan-my-project?type=extension',
    },
  },

  // =========================================================================
  // 2. PLANNING VS BUILDING REGS
  // =========================================================================
  {
    id: 'planning-permission-vs-building-regulations',
    slug: 'planning-permission-vs-building-regulations',
    title: 'Planning Permission vs Building Regulations: Key Differences Explained',
    seoTitle: 'Planning Permission vs Building Regs UK | What Homeowners Need',
    metaDescription: 'Understand the difference between Planning Permission and Building Regulations in the UK. Why you need both, structural safety sign-offs, and compliance steps.',
    keywords: ['planning permission vs building regulations', 'difference between planning and building regs', 'do i need building regulations for extension', 'building control certificate uk'],
    category: 'Building Regulations',
    author: {
      name: 'James Campbell',
      role: 'Head of Construction & Structural Compliance',
    },
    publishedDate: '2025-01-22',
    lastUpdated: '2026-02-14',
    readingTimeMinutes: 6,
    status: 'published',
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    summary: 'Many homeowners confuse Planning Permission with Building Regulations. Here is a plain-English explanation of why they are separate legal processes and what is required for your build.',
    contentSections: [
      {
        heading: 'Two Completely Different Legal Frameworks',
        paragraphs: [
          'One of the most frequent misconceptions in UK home improvement is assuming that obtaining Planning Permission means you are legally clear to start building. In reality, Planning Permission and Building Regulations are governed by two entirely separate pieces of legislation.',
          'Planning Permission deals with the external appearance, size, highway impact, and neighbour amenity of your proposed building. Building Regulations, on the other hand, focus strictly on structural safety, fire escape routes, thermal insulation, damp proofing, and electrical safety.',
        ],
      },
      {
        heading: 'Quick Comparison Table',
        paragraphs: [
          'Here is how the two permissions differ in practice:',
        ],
        bulletPoints: [
          'Planning Permission: Governed by the Town and Country Planning Act. Evaluates aesthetic appearance, local character, overlooking neighbours, and plot boundaries. Can be bypassed via Permitted Development.',
          'Building Regulations: Governed by the Building Act 1984. Evaluates structural foundations, steel RSJ calculations, fire safety (Part B), insulation (Part L), drainage (Part H), and electrics (Part P). Mandatory on almost all structural work.',
        ],
      },
      {
        heading: 'Why You Must Never Skip Building Regulations',
        paragraphs: [
          'Building without Building Regulations approval is illegal under UK law. The local council has enforcement powers to require the alteration or complete removal of non-compliant structural work.',
          'Furthermore, when selling your home, buyers’ solicitors will demand the official Building Regulations Completion Certificate. Missing certificates can delay or derail a property sale completely.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I use an Approved Private Inspector instead of Local Authority Building Control?',
        answer: 'Yes. You can appoint either your local council building control department (LABC) or a licensed Registered Building Control Approver (RBCA) to inspect your build stages and issue the final completion certificate.',
      },
    ],
    relatedArticleSlugs: ['permitted-development-rules-extensions', 'party-wall-act-guide'],
    relatedCalculatorSlug: 'extension-cost-calculator',
    relatedServiceSlug: 'extensions',
    commercialCta: {
      title: 'Need Compliant Architectural & Structural Drawings?',
      description: 'Our construction management includes full structural calculations, building control stage sign-offs, and final completion certification.',
      buttonText: 'Book Free Project Consultation →',
      buttonHref: '/contact?type=consultation',
    },
  },

  // =========================================================================
  // 3. PARTY WALL ACT
  // =========================================================================
  {
    id: 'party-wall-act-guide',
    slug: 'party-wall-act-guide',
    title: 'The Party Wall Act Explained: A Complete Guide for UK Homeowners',
    seoTitle: 'Party Wall Act UK 2026 | Notice Rules, Costs & Surveyor Awards',
    metaDescription: 'Homeowner guide to the Party Wall etc. Act 1996. When to serve notices, 3-meter excavation rules, surveyor costs, and neighbour consent procedures.',
    keywords: ['party wall act uk', 'party wall notice rules', 'party wall surveyor cost', '3m excavation party wall'],
    category: 'Planning',
    author: {
      name: 'David Reynolds',
      role: 'Principal Architectural Planner & Surveyor',
    },
    publishedDate: '2025-01-26',
    lastUpdated: '2026-02-15',
    readingTimeMinutes: 8,
    status: 'published',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    summary: 'A step-by-step guide to navigating the Party Wall etc. Act 1996 when building an extension, converting a loft, or excavating foundations near a boundary.',
    contentSections: [
      {
        heading: 'When Does the Party Wall Act Apply?',
        paragraphs: [
          'The Party Wall etc. Act 1996 is a legal framework designed to prevent and resolve disputes relating to shared boundary walls, party structures, and deep excavations near neighbouring properties.',
          'In residential building projects, you must serve formal Party Wall Notices if your works involve:',
        ],
        bulletPoints: [
          'Section 1: Building a new wall directly along or astride a property boundary line.',
          'Section 2: Cutting into a shared party wall to insert steel RSJ beam bearings, removing chimney breasts, or raising the party wall height in a loft conversion.',
          'Section 6: Excavating foundations within 3 meters of an adjoining neighbour’s building that go deeper than the bottom of their foundations.',
        ],
      },
      {
        heading: 'Notice Periods and Timelines',
        paragraphs: [
          'Party Wall Notices must be served in advance of starting work on site:',
        ],
        bulletPoints: [
          'Excavation Works (Section 6) & New Boundary Walls (Section 1): At least 1 month prior to commencement.',
          'Structural Works on Shared Party Wall (Section 2): At least 2 months prior to commencement.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if my neighbour dissents to the Party Wall Notice?',
        answer: 'If a neighbour dissents, a dispute is legally deemed to have arisen. Both parties can appoint an Agreed Surveyor, or each appoint their own surveyor, who will prepare an impartial Party Wall Award detailing working hours, protective measures, and a schedule of condition.',
      },
    ],
    relatedArticleSlugs: ['permitted-development-rules-extensions', 'planning-permission-vs-building-regulations'],
    relatedCalculatorSlug: 'extension-cost-calculator',
    commercialCta: {
      title: 'Planning Works Near a Shared Boundary?',
      description: 'We help homeowners navigate party wall requirements and coordinate structural engineering packs to ensure smooth neighbour approvals.',
      buttonText: 'Plan My Project →',
      buttonHref: '/plan-my-project',
    },
  },

  // =========================================================================
  // 4. OPEN-PLAN KITCHEN KNOCKTHROUGH
  // =========================================================================
  {
    id: 'open-plan-kitchen-knockthrough-guide',
    slug: 'open-plan-kitchen-knockthrough-guide',
    title: 'Open-Plan Kitchen Knockthroughs: RSJ Steels, Building Regs & Costs',
    seoTitle: 'Kitchen Knockthrough Guide UK | Wall Removal, RSJ Steels & Costs',
    metaDescription: 'Step-by-step guide to removing load-bearing walls for an open-plan kitchen-diner. RSJ steel beam sizing, temporary propping, costs, and building control.',
    keywords: ['kitchen knockthrough cost uk', 'removing load bearing wall kitchen', 'rsj steel beam cost kitchen', 'open plan living kitchen knockthrough'],
    category: 'Kitchens',
    author: {
      name: 'James Campbell',
      role: 'Head of Construction & Structural Compliance',
    },
    publishedDate: '2025-02-02',
    lastUpdated: '2026-02-18',
    readingTimeMinutes: 7,
    status: 'published',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    summary: 'Everything you need to know about knocking through a dividing wall to create a modern open-plan kitchen-diner with structural steel beams.',
    contentSections: [
      {
        heading: 'Why Knock Through into an Open-Plan Space?',
        paragraphs: [
          'Knocking through a wall between an isolated kitchen and a dark dining room or rear living room is one of the most transformative renovations possible in British housing.',
          'By removing the dividing wall, you flood the ground floor with natural light, allow space for a sociable central kitchen island, and dramatically enhance everyday family connectivity.',
        ],
      },
      {
        heading: 'Step-by-Step Structural Wall Removal Process',
        paragraphs: [
          'Removing a load-bearing wall requires rigorous structural engineering:',
        ],
        bulletPoints: [
          'Step 1: Structural Engineer Calculations to specify exact RSJ beam dimensions and padstone sizes.',
          'Step 2: Temporary Support installation using heavy-duty Strongboys and steel Acrow props under the floor joists above.',
          'Step 3: Controlled masonry demolition and debris removal via waste skips.',
          'Step 4: Hoisting and securing the RSJ steel beam onto pre-cast concrete padstones.',
          'Step 5: Slate packing with non-shrink structural grout and Building Control site inspection.',
          'Step 6: Fire protection boarding (two layers of 12.5mm fireline plasterboard) and smooth plaster skimming.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can the steel beam be hidden completely flush inside the ceiling?',
        answer: 'Yes. If floor joists run perpendicular to the wall, joists can be cut back and hung directly into the web of the steel beam using joist hangers, creating a continuous flat ceiling with no downstand.',
      },
    ],
    relatedArticleSlugs: ['planning-permission-vs-building-regulations'],
    relatedCalculatorSlug: 'kitchen-cost-calculator',
    relatedServiceSlug: 'kitchen-renovations',
    relatedCaseStudySlug: 'chiswick-bespoke-kitchen-knockthrough',
    commercialCta: {
      title: 'Planning an Open-Plan Kitchen Knockthrough?',
      description: 'Our team coordinates structural engineering, temporary propping, certified steel installation, and complete kitchen fitting.',
      buttonText: 'Plan My Kitchen Project →',
      buttonHref: '/plan-my-project?type=kitchen',
    },
  },
];

export function getAdviceArticleBySlug(slug: string): AdviceArticle | undefined {
  return ADVICE_ARTICLES_DATA.find((a) => a.slug === slug);
}
