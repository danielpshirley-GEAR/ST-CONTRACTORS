/**
 * MASTER COST GUIDES DATASET
 * In-depth, high commercial intent construction cost benchmarks.
 * Conforms to GEMINI.md Section 8, 11, 12 & BUILD_SPEC.md Phase 4
 */

import { CostGuide } from './types';

export const COST_GUIDES_DATA: CostGuide[] = [
  // =========================================================================
  // 1. EXTENSION COST GUIDE
  // =========================================================================
  {
    id: 'extension-cost',
    slug: 'extension-cost',
    title: 'House Extension Cost Guide UK (2026 Build Rates)',
    h1: 'How Much Does a House Extension Cost in the UK? (2026 Guide)',
    subtitle: 'Comprehensive pricing guide for single-storey, side return, wraparound, and double-storey extensions with price per m² benchmarks.',
    metaTitle: 'House Extension Cost UK 2026 | Cost Per m2 & Price Guide',
    metaDescription: 'Complete 2026 UK house extension cost guide. Average price per m², single storey, side return, double storey estimates, structural steel costs, and timeline breakdown.',
    keywords: ['house extension cost uk', 'extension cost per m2', 'how much does an extension cost', 'rear extension price guide', 'side return extension cost'],
    category: 'extensions',
    publishedDate: '2025-01-15',
    lastUpdated: '2026-02-10',
    status: 'published',
    indicativeRange: {
      low: 45000,
      high: 85000,
      unit: 'standard single storey (20–30m²)',
      formatted: '£45,000 – £85,000',
    },
    introParagraphs: [
      'Planning a house extension is one of the most rewarding ways to add valuable living space and substantial market value to your home. However, navigating construction costs, structural steel requirements, and local authority permissions can feel overwhelming.',
      'In 2026, standard single-storey house extension build costs in the UK typically range between £1,850 and £2,600 per square meter (m²) for standard architectural specifications. Premium finishes, complex structural knockthroughs, and extensive glazing will increase this to £2,600 to £3,400+ per m².',
      'This guide breaks down every cost driver—from groundworks and steel goalposts to bi-fold doors and VAT—providing transparent, realistic numbers for your project budget.',
    ],
    priceTable: {
      title: 'UK House Extension Cost Benchmarks by Format (2026)',
      rows: [
        {
          type: 'Single Storey Rear Extension (20m² – 30m²)',
          guideRange: '£45,000 – £75,000',
          perM2: '£1,850 – £2,500/m²',
          notes: 'Standard flat or pitched roof with aluminium bi-folds and rooflights',
        },
        {
          type: 'Side Return Infill Extension (Victorian / Period)',
          guideRange: '£55,000 – £85,000',
          perM2: '£2,100 – £2,850/m²',
          notes: 'Includes party wall structural steel beams and pitched glass roof',
        },
        {
          type: 'Wraparound Extension (Rear + Side)',
          guideRange: '£80,000 – £140,000',
          perM2: '£2,200 – £3,000/m²',
          notes: 'Major open-plan transformation with heavy steel goalpost frames',
        },
        {
          type: 'Double Storey Extension (40m² – 60m² total)',
          guideRange: '£85,000 – £145,000',
          perM2: '£1,650 – £2,300/m²',
          notes: 'Extremely cost-effective per m² because foundations & roof are shared',
        },
      ],
    },
    costFactors: [
      {
        title: 'Ground Conditions & Foundation Depth',
        description: 'Standard 1m deep trench footings are cost-effective. However, high water tables, clay soil, or proximity to large trees may require 2m+ deep footings or engineered piling, adding £3,000–£8,000.',
      },
      {
        title: 'Structural Steelwork (RSJ Beams)',
        description: 'Removing load-bearing external walls to create seamless open-plan living requires structural steel beams. A simple opening costs ~£2,500, while a continuous flush ceiling goalpost frame ranges from £4,500 to £8,500.',
      },
      {
        title: 'Glazing & Architectural Rooflights',
        description: 'Standard uPVC patio doors cost ~£1,500, whereas high-performance thermally broken aluminium bi-fold or sliding doors cost £4,000–£9,000. Frameless glass roof lanterns add £1,800–£4,500.',
      },
      {
        title: 'Heating & Mechanical Services',
        description: 'Integrating water underfloor heating (UFH) into an insulated screed slab costs £65–£95/m², ensuring even warmth and uncluttered wall space without radiators.',
      },
    ],
    projectSizeConsiderations: [
      {
        sizeCategory: 'Small Extension (15m² – 20m²)',
        dimensions: 'e.g. 4m × 4m or 5m × 3.5m',
        typicalCost: '£38,000 – £52,000',
        description: 'Ideal for enlarging a galley kitchen into a bright dining room with bi-fold doors.',
      },
      {
        sizeCategory: 'Medium Extension (24m² – 32m²)',
        dimensions: 'e.g. 6m × 4.5m or 7m × 4m',
        typicalCost: '£55,000 – £82,000',
        description: 'The most popular UK family extension format, creating a spacious kitchen-diner with central island.',
      },
      {
        sizeCategory: 'Large Wraparound (40m² – 55m²)',
        dimensions: 'e.g. 8m × 6m L-shaped footprint',
        typicalCost: '£90,000 – £145,000',
        description: 'A transformative ground-floor reconfiguration adding an open-plan kitchen, dining lounge, utility room, and WC.',
      },
    ],
    finishLevels: [
      {
        level: 'Essential / Standard Trade',
        multiplier: '1.0x (Baseline)',
        description: 'Functional, clean, and durable trade-standard finish.',
        features: ['Laminate flooring', 'Standard trade paint finish', 'Standard radiators', 'Surface-mounted lighting'],
      },
      {
        level: 'Premium Architectural',
        multiplier: '1.25x – 1.35x',
        description: 'High-spec modern finish designed for luxury family living.',
        features: ['Engineered hardwood flooring', 'Water underfloor heating', 'Aluminium slimline bi-folds', 'Recessed LED architectural lighting'],
      },
      {
        level: 'Bespoke Luxury',
        multiplier: '1.6x – 2.0x',
        description: 'Architect-designed finishes using premium imported materials.',
        features: ['Crittall-style steel glazing', 'Italian large-format porcelain floor tiles', 'Integrated smart home automation', 'Bespoke roof glazing'],
      },
    ],
    regionalConsiderations: [
      'London & Inner M25: Construction costs are approximately 15–20% higher due to parking permits, tight urban site access, and higher trade day rates.',
      'South East & Home Counties: Average benchmark rates apply with high demand for premium structural extensions.',
      'Midlands & North: Build costs average 5–10% below London benchmarks, with lower labour rates.',
    ],
    timeline: [
      { stage: 'Stage 1: Site Setup & Ground Excavation', duration: 'Weeks 1–3', description: 'Site hoardings, trench digging, drainage diverts, and concrete foundation pouring.' },
      { stage: 'Stage 2: Structural Shell & Brickwork', duration: 'Weeks 4–7', description: 'Cavity brick and blockwork, damp proof courses, and subfloor insulation slab.' },
      { stage: 'Stage 3: Steel Installation & Roof Structure', duration: 'Weeks 8–10', description: 'RSJ steel beam hoisting, roof joists, flat roof EPDM membrane, and rooflight fitting.' },
      { stage: 'Stage 4: First Fix Trades (Plumbing & Electrics)', duration: 'Weeks 11–13', description: 'Water pipes, underfloor heating pipes, electrical cables, and internal studwork.' },
      { stage: 'Stage 5: Plastering, Glazing & Second Fix', duration: 'Weeks 14–17', description: 'Plasterboarding, MultiFinish skim, bi-fold door installation, flooring, and kitchen fitting.' },
      { stage: 'Stage 6: Turnkey Decorating & Snagging', duration: 'Weeks 18–20', description: 'Interior painting, lighting fixtures, building control final inspection, and handover.' },
    ],
    commonAdditionalCosts: [
      { item: 'Architectural Drawings & Planning Permission', cost: '£1,800 – £3,500', description: 'Measured survey, 2D/3D planning drawings, and council application submission.' },
      { item: 'Structural Engineer Calculations', cost: '£750 – £1,800', description: 'Load calculations for steel RSJ beams and foundation depth approvals.' },
      { item: 'Building Regulations Inspection Fees', cost: '£850 – £1,500', description: 'Council or approved private inspector stage sign-offs and completion certificate.' },
      { item: 'Party Wall Surveyor Notices / Awards', cost: '£1,000 – £2,500 per neighbour', description: 'Required if excavating within 3 meters of a neighbour’s foundation or modifying a shared wall.' },
      { item: 'Thames Water / Utility Build-Over Agreement', cost: '£350 – £750', description: 'Mandatory if building within 3m of a public shared sewer pipe.' },
    ],
    faqs: [
      {
        question: 'What is the average cost of a 30m² house extension in the UK?',
        answer: 'A standard 30m² (e.g. 6m × 5m) single-storey rear extension in the UK typically costs between £55,000 and £85,000 including VAT, foundations, structural steelwork, bi-fold doors, plastering, heating, and electrics.',
      },
      {
        question: 'Can I build a house extension under Permitted Development?',
        answer: 'Yes. In England, single-storey rear extensions up to 8m (for detached homes) or 6m (for semi-detached and terraced homes) can frequently be built without full planning permission under Permitted Development, provided height limits and materials match the existing property.',
      },
      {
        question: 'How much contingency budget should I allow for an extension?',
        answer: 'We always recommend keeping a 10% to 15% contingency reserve in your budget to cover unforeseen ground condition issues (such as uncharted pipework or tree root obstructions) and specification upgrades.',
      },
      {
        question: 'Does a double-storey extension cost twice as much as a single-storey?',
        answer: 'No. A double-storey extension is significantly cheaper per square meter (typically only 40–50% more expensive overall than a single-storey), because you share the exact same ground foundations and roof structure across both floors.',
      },
    ],
    relatedCalculatorSlug: 'extension-cost-calculator',
    relatedServiceSlug: 'extensions',
    relatedCaseStudySlug: 'ealing-contemporary-rear-extension',
    relatedAdviceSlugs: ['permitted-development-rules-extensions', 'planning-permission-vs-building-regulations', 'party-wall-act-guide'],
    commercialCta: {
      title: 'Ready to Plan Your House Extension?',
      description: 'Use our interactive Project Planner to configure your layout, glazing, underfloor heating, and finish options for an instant room-by-room estimate.',
      buttonText: 'Plan My Extension in Detail →',
      buttonHref: '/plan-my-project?type=extension',
    },
  },

  // =========================================================================
  // 2. FULL HOUSE RENOVATION COST GUIDE
  // =========================================================================
  {
    id: 'house-renovation-cost',
    slug: 'house-renovation-cost',
    title: 'Full House Renovation Cost Guide UK (2026 Rates)',
    h1: 'How Much Does It Cost to Renovate a House in the UK? (2026)',
    subtitle: 'Detailed cost breakdown for full property modernization, rewiring, replumbing, structural alterations, and turnkey decorating.',
    metaTitle: 'House Renovation Cost UK 2026 | Full Property Overhaul Guide',
    metaDescription: 'Complete 2026 guide to full house renovation costs in the UK. Average costs for 2, 3, and 4-bedroom houses, rewiring, plumbing, plastering, and timeline.',
    keywords: ['house renovation cost uk', 'cost to renovate 3 bed house', 'full property renovation price', 'house refurbishment cost per m2'],
    category: 'renovations',
    publishedDate: '2025-01-20',
    lastUpdated: '2026-02-12',
    status: 'published',
    indicativeRange: {
      low: 65000,
      high: 145000,
      unit: 'standard 3-bed property (90–120m²)',
      formatted: '£65,000 – £145,000',
    },
    introParagraphs: [
      'Renovating a period property or modernising an outdated home is a major financial and lifestyle investment. Whether you are transforming a neglected Victorian terrace or upgrading a 1930s semi, understanding the full scope of works is essential to avoid unexpected surprises.',
      'In the UK, full property renovation costs generally range from £750 to £1,500+ per square meter. A comprehensive whole-house overhaul of a standard 3-bedroom home usually falls between £65,000 and £145,000 depending on structural changes and kitchen/bathroom specifications.',
    ],
    priceTable: {
      title: 'UK House Renovation Cost by Property Size (2026)',
      rows: [
        { type: '2-Bedroom Flat / Small Terrace (~70m²)', guideRange: '£45,000 – £80,000', perM2: '£650 – £1,150/m²', notes: 'Rewire, new bathroom, new kitchen, plastering, flooring' },
        { type: '3-Bedroom Semi-Detached House (~105m²)', guideRange: '£75,000 – £135,000', perM2: '£750 – £1,300/m²', notes: 'Whole house renovation including heating system & structural wall removal' },
        { type: '4-Bedroom Detached / Victorian Townhouse (150m²+)', guideRange: '£120,000 – £230,000+', perM2: '£850 – £1,550/m²', notes: 'High-end architectural overhaul with multiple bathrooms & bespoke joinery' },
      ],
    },
    costFactors: [
      { title: 'Property Age & Structural Condition', description: 'Period Victorian/Edwardian properties often require extensive subfloor repairs, lime replastering, damp proofing, and structural joist reinforcement.' },
      { title: 'Electrical Rewiring (NICEIC)', description: 'A complete full-house electrical rewire costs £4,500–£8,500 including new consumer unit, smoke alarms, and spotlight circuits.' },
      { title: 'Plumbing & New Central Heating', description: 'Replacing lead/iron pipes, installing a high-efficiency combi boiler, and fitting new radiators costs £5,500–£10,000.' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Cosmetic Refresh', dimensions: 'Whole house cosmetic', typicalCost: '£25,000 – £45,000', description: 'Plaster skimming, full interior decorating, new carpets, and budget bathroom update.' },
      { sizeCategory: 'Full Modernisation', dimensions: 'Whole house turnkey', typicalCost: '£75,000 – £130,000', description: 'Complete back-to-brick refurbishment with new electricals, heating, kitchen, and bathrooms.' },
    ],
    finishLevels: [
      { level: 'Standard Trade Finish', multiplier: '1.0x', description: 'Clean, modern, and cost-effective specifications.', features: ['Trade kitchen units', 'Porcelain ceramic tiles', 'Laminate flooring'] },
      { level: 'High-End Architectural', multiplier: '1.4x', description: 'Bespoke detailing and premium brand fixtures.', features: ['Solid quartz surfaces', 'Underfloor heating', 'Bespoke alcove cabinetry', 'Lusso Stone sanitaryware'] },
    ],
    regionalConsiderations: ['London period renovations typically command higher budgets due to conservation restrictions and parking logistics.'],
    timeline: [
      { stage: 'Strip Out & Demolition', duration: 'Weeks 1–3', description: 'Removal of old fixtures, wall knockthroughs, and waste skip clearance.' },
      { stage: 'First Fix Mechanical & Electrical', duration: 'Weeks 4–7', description: 'Full rewiring, new copper pipework, and structural steels.' },
      { stage: 'Plastering & Joinery', duration: 'Weeks 8–11', description: 'Boarding, full skimming, skirtings, architraves, and doors.' },
      { stage: 'Second Fix Kitchens, Bathrooms & Decorating', duration: 'Weeks 12–16', description: 'Cabinetry fitting, tiling, painting, and final certification.' },
    ],
    commonAdditionalCosts: [
      { item: 'Damp Proofing & Timber Treatment', cost: '£2,500 – £6,000', description: 'Chemical DPC injection and wet/dry rot remedial work.' },
      { item: 'Structural Steel Wall Removal', cost: '£3,200 – £6,000', description: 'Removing dividing walls for open-plan living.' },
    ],
    faqs: [
      { question: 'Should I live in the house during a full renovation?', answer: 'We strongly advise moving out during back-to-brick renovations. Living on site significantly slows down trade progress, increases dust exposure, and adds 15–20% to total labour time.' },
    ],
    relatedCalculatorSlug: 'house-renovation-calculator',
    relatedServiceSlug: 'renovations',
    relatedCaseStudySlug: 'richmond-full-period-home-renovation',
    relatedAdviceSlugs: ['renovation-budget-planning-guide', 'rewiring-a-house-cost-and-regulations'],
    commercialCta: {
      title: 'Planning a Full House Renovation?',
      description: 'Configure your room-by-room scope in our AI planner for an itemized estimate with dedicated project management.',
      buttonText: 'Plan Full House Renovation →',
      buttonHref: '/plan-my-project?type=full-renovation',
    },
  },

  // =========================================================================
  // 3. KITCHEN RENOVATION COST GUIDE
  // =========================================================================
  {
    id: 'kitchen-renovation-cost',
    slug: 'kitchen-renovation-cost',
    title: 'Kitchen Renovation & Knockthrough Cost Guide UK (2026)',
    h1: 'How Much Does a New Kitchen Cost in the UK? (2026 Guide)',
    subtitle: 'Realistic pricing for kitchen cabinetry supply, quartz worktops, appliances, knockthrough wall removal, and trade installation.',
    metaTitle: 'Kitchen Renovation Cost UK 2026 | New Kitchen & Knockthrough Guide',
    metaDescription: 'Complete 2026 guide to UK kitchen renovation costs. Cabinetry, quartz and granite worktops, appliances, RSJ steel wall removal, and fitting costs.',
    keywords: ['kitchen renovation cost uk', 'how much does a new kitchen cost', 'kitchen knockthrough cost', 'fitted kitchen price guide'],
    category: 'kitchens',
    publishedDate: '2025-01-25',
    lastUpdated: '2026-02-14',
    status: 'published',
    indicativeRange: {
      low: 15000,
      high: 35000,
      unit: 'fully fitted family kitchen',
      formatted: '£15,000 – £35,000',
    },
    introParagraphs: [
      'The kitchen is the heart of the modern home. A well-designed kitchen remodel not only enhances day-to-day family life but also delivers one of the highest returns on investment when selling your property.',
      'In 2026, a standard complete kitchen renovation in the UK costs between £15,000 and £35,000 fully installed. Removing dividing walls with structural steel beams to create an open-plan kitchen-diner adds £3,500 to £6,500.',
    ],
    priceTable: {
      title: 'UK Kitchen Renovation Cost Breakdown (2026)',
      rows: [
        { type: 'Compact / Galley Kitchen (8–10 units)', guideRange: '£9,500 – £16,000', perM2: 'Standard fitting', notes: 'Trade flat-pack units, laminate/compact worktops, standard appliances' },
        { type: 'Standard Kitchen / Diner (12–16 units)', guideRange: '£16,000 – £28,000', perM2: 'Quality fitting', notes: 'Shaker/handleless units, 20mm Quartz worktops, integrated appliances' },
        { type: 'Large Open-Plan with Island (18+ units)', guideRange: '£28,000 – £55,000+', perM2: 'Bespoke luxury', notes: 'Bespoke in-frame cabinetry, 30mm Quartz waterfall island, Quooker tap' },
      ],
    },
    costFactors: [
      { title: 'Worktop Materials', description: 'Laminate worktops cost £350–£750, whereas solid 20mm or 30mm Quartz/Granite with templating and undermount sink cutouts costs £2,500–£5,500.' },
      { title: 'Structural Knockthroughs', description: 'Removing a wall to create an open-plan kitchen-diner requires Building Control sign-off and an RSJ steel beam (£3,500–£6,500).' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Replacement Only', dimensions: 'Existing footprint', typicalCost: '£12,000 – £22,000', description: 'New units, worktops, and appliances in existing locations without moving pipework.' },
      { sizeCategory: 'Full Structural Transformation', dimensions: 'Open-plan living', typicalCost: '£25,000 – £48,000', description: 'Wall removal, new electrical circuits, underfloor heating, island, and bifolds.' },
    ],
    finishLevels: [
      { level: 'Trade Quality', multiplier: '1.0x', description: 'Howdens / Magnet standard ranges.', features: ['Melamine carcasses', 'Laminate worktops', 'Standard chrome taps'] },
      { level: 'Bespoke Architectural', multiplier: '1.5x', description: 'Custom painted timber and premium stone.', features: ['Solid oak drawers', '30mm Silestone Quartz', 'Bora induction hob', 'Quooker boiling tap'] },
    ],
    regionalConsiderations: ['London installation day rates average £240–£320 per trade.'],
    timeline: [
      { stage: 'Strip Out & First Fix', duration: 'Week 1', description: 'Old kitchen removal, plumbing pipe alterations, and electrical cable runs.' },
      { stage: 'Plastering & Floor Prep', duration: 'Week 2', description: 'Full wall skim coat and subfloor leveling.' },
      { stage: 'Cabinetry Installation', duration: 'Week 3', description: 'Base and wall unit leveling and appliance housing.' },
      { stage: 'Worktop Templating & Fitting', duration: 'Week 4', description: 'Laser templating and stone fabrication.' },
      { stage: 'Second Fix & Turnkey Signoff', duration: 'Week 5', description: 'Appliance connection, splashback tiling, and commissioning.' },
    ],
    commonAdditionalCosts: [
      { item: 'Quooker Instant Boiling Water Tap', cost: '£1,200 – £1,800', description: 'Supplied and plumbed into mains.' },
    ],
    faqs: [
      { question: 'How much does it cost to fit a kitchen (labour only)?', answer: 'In the UK, professional kitchen fitting labour typically costs between £2,500 and £5,000 depending on unit count, plumbing complexity, and electrical alterations.' },
    ],
    relatedCalculatorSlug: 'kitchen-cost-calculator',
    relatedServiceSlug: 'kitchen-renovations',
    relatedCaseStudySlug: 'chiswick-bespoke-kitchen-knockthrough',
    relatedAdviceSlugs: ['open-plan-kitchen-knockthrough-guide', 'quartz-vs-granite-worktops-guide'],
    commercialCta: {
      title: 'Planning a Kitchen Renovation or Knockthrough?',
      description: 'Configure your cabinetry styles, solid stone worktops, integrated appliances, and wall knockthroughs in our interactive planner.',
      buttonText: 'Plan My Kitchen Project →',
      buttonHref: '/plan-my-project?type=kitchen',
    },
  },

  // =========================================================================
  // 4. BATHROOM RENOVATION COST GUIDE
  // =========================================================================
  {
    id: 'bathroom-renovation-cost',
    slug: 'bathroom-renovation-cost',
    title: 'Bathroom Renovation & Wetroom Cost Guide UK (2026)',
    h1: 'How Much Does a New Bathroom Cost in the UK? (2026)',
    subtitle: 'Transparent costs for full family bathrooms, ensuite shower rooms, luxury wetrooms, and Italian porcelain tiling.',
    metaTitle: 'Bathroom Renovation Cost UK 2026 | New Bathroom Price Guide',
    metaDescription: 'Complete 2026 guide to UK bathroom renovation costs. Family bathrooms, ensuite shower rooms, walk-in wetrooms, tiling, and plumbing fitting rates.',
    keywords: ['bathroom renovation cost uk', 'how much does a new bathroom cost', 'wetroom installation cost', 'bathroom fitting price guide'],
    category: 'bathrooms',
    publishedDate: '2025-01-28',
    lastUpdated: '2026-02-15',
    status: 'published',
    indicativeRange: {
      low: 7500,
      high: 16500,
      unit: 'complete bathroom renovation',
      formatted: '£7,500 – £16,500',
    },
    introParagraphs: [
      'A luxury bathroom renovation transforms daily routines into a spa-like experience. However, precise waterproofing, plumbing relocations, and specialist tiling require experienced trade coordination.',
      'In 2026, standard family bathroom renovations in the UK average £7,500 to £12,500 including sanitaryware, tiles, and trade fitting. Architectural walk-in wetrooms with concealed thermostatic valves range from £10,000 to £18,000.',
    ],
    priceTable: {
      title: 'UK Bathroom Renovation Cost Benchmarks (2026)',
      rows: [
        { type: 'Downstairs Cloakroom / WC', guideRange: '£3,000 – £5,500', perM2: 'Turnkey', notes: 'Compact vanity, toilet, basin, and floor tiling' },
        { type: 'Ensuite Shower Room', guideRange: '£5,500 – £9,500', perM2: 'Turnkey', notes: 'Walk-in low-profile shower tray, vanity unit, and wall tiling' },
        { type: 'Full Family Bathroom (4-piece)', guideRange: '£7,500 – £13,500', perM2: 'Turnkey', notes: 'Bath, rainfall shower, wall-hung WC, vanity, and full tiling' },
        { type: 'Luxury Walk-In Wetroom', guideRange: '£10,000 – £18,500', perM2: 'Turnkey', notes: 'Complete tanking membrane, flush linear drain, and frameless glass' },
      ],
    },
    costFactors: [
      { title: 'Waterproof Tanking', description: 'Proper tanking in wet zones is essential to prevent structural leaks (£450–£950).' },
      { title: 'Plumbing Layout Alterations', description: 'Moving soil pipes or water supplies across the room adds £800–£1,800 in subfloor plumbing work.' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Standard Replacement', dimensions: 'Same footprint', typicalCost: '£6,500 – £10,000', description: 'Like-for-like suite replacement with fresh tiling.' },
      { sizeCategory: 'Luxury Architectural Wetroom', dimensions: 'Complete redesign', typicalCost: '£12,000 – £19,000', description: 'Concealed thermostatic brassware, underfloor heating, and large-format Italian porcelain.' },
    ],
    finishLevels: [
      { level: 'Standard Quality', multiplier: '1.0x', description: 'Good quality trade sanitaryware.', features: ['Chrome brassware', 'Ceramic tiles', 'Standard thermostatic bar valve'] },
      { level: 'Luxury Designer', multiplier: '1.6x', description: 'Lusso Stone, Hansgrohe, and marble.', features: ['Brushed brass valves', 'Freestanding resin bath', 'Large format porcelain', 'Electric underfloor heating mat'] },
    ],
    regionalConsiderations: ['South East & London tiling rates range from £35–£55/m².'],
    timeline: [
      { stage: 'Strip Out & First Fix Plumbing', duration: 'Days 1–3', description: 'Removal of old suite and pipe routing.' },
      { stage: 'Waterproof Tanking & Boarding', duration: 'Days 4–5', description: 'HardieBacker boards and waterproof membrane.' },
      { stage: 'Tiling & Grouting', duration: 'Days 6–9', description: 'Precision cutting, laying, and anti-mould grouting.' },
      { stage: 'Second Fix & Commissioning', duration: 'Days 10–12', description: 'Sanitaryware fitting, testing, and silicone sealant.' },
    ],
    commonAdditionalCosts: [
      { item: 'Electric Underfloor Heating Mat (Warmup)', cost: '£450 – £850', description: 'Programmable touchscreen thermostat with heated tile floor.' },
    ],
    faqs: [
      { question: 'How long does a full bathroom renovation take?', answer: 'A standard complete bathroom renovation takes between 2 and 3 weeks from initial strip out to final silicone sealing.' },
    ],
    relatedCalculatorSlug: 'bathroom-cost-calculator',
    relatedServiceSlug: 'bathroom-renovations',
    relatedCaseStudySlug: 'richmond-full-period-home-renovation',
    relatedAdviceSlugs: ['bathroom-tanking-and-waterproofing-guide', 'wetroom-vs-walk-in-shower-cost'],
    commercialCta: {
      title: 'Planning a Bathroom Renovation?',
      description: 'Configure your layout, walk-in shower, freestanding bath, and tiling preferences in our detailed project planner.',
      buttonText: 'Plan My Bathroom Project →',
      buttonHref: '/plan-my-project?type=bathroom',
    },
  },

  // =========================================================================
  // 5. LOFT CONVERSION COST GUIDE
  // =========================================================================
  {
    id: 'loft-conversion-cost',
    slug: 'loft-conversion-cost',
    title: 'Loft Conversion Cost Guide UK (2026 Build Rates)',
    h1: 'How Much Does a Loft Conversion Cost in the UK? (2026)',
    subtitle: 'Comprehensive guide for Velux, rear dormer, hip-to-gable, and mansard conversions with ensuite costs.',
    metaTitle: 'Loft Conversion Cost UK 2026 | Dormer & Velux Price Guide',
    metaDescription: 'Complete 2026 guide to UK loft conversion costs. Rear dormer, Velux rooflight, hip-to-gable, and mansard conversion prices, steelwork, and regulations.',
    keywords: ['loft conversion cost uk', 'dormer loft conversion cost', 'how much does a loft conversion cost', 'attic conversion price guide'],
    category: 'lofts',
    publishedDate: '2025-02-01',
    lastUpdated: '2026-02-16',
    status: 'published',
    indicativeRange: {
      low: 38000,
      high: 68000,
      unit: 'rear dormer with ensuite',
      formatted: '£38,000 – £68,000',
    },
    introParagraphs: [
      'A loft conversion is one of the most cost-effective methods of expanding your home, adding a master bedroom suite or home office without sacrificing garden space.',
      'In 2026, a standard rear dormer loft conversion in the UK costs between £38,000 and £58,000. Adding an ensuite shower room adds £5,000 to £8,500.',
    ],
    priceTable: {
      title: 'UK Loft Conversion Cost Benchmarks (2026)',
      rows: [
        { type: 'Velux Rooflight Conversion (No Dormer)', guideRange: '£28,000 – £38,000', perM2: '£1,100 – £1,550/m²', notes: 'Ideal where existing head height is already generous (>2.3m)' },
        { type: 'Rear Flat Roof Dormer (Most Popular)', guideRange: '£38,000 – £58,000', perM2: '£1,450 – £1,950/m²', notes: 'Creates maximum headroom and usable floor space for master bedroom & ensuite' },
        { type: 'Hip-to-Gable Dormer (Semi-Detached)', guideRange: '£45,000 – £68,000', perM2: '£1,650 – £2,250/m²', notes: 'Extends sloping side roof into vertical gable wall' },
        { type: 'Mansard Conversion (Terraced Homes)', guideRange: '£52,000 – £78,000', perM2: '£1,850 – £2,550/m²', notes: '72-degree rear slope, often required in London conservation areas' },
      ],
    },
    costFactors: [
      { title: 'Structural Steel Beams (RSJ)', description: 'Supporting the new floor joists requires heavy structural steel beams (£4,500–£8,500).' },
      { title: 'Bespoke Staircase', description: 'A custom timber staircase complying with Part K building regulations costs £2,200–£4,500.' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Standard Dormer', dimensions: 'Approx 25m²', typicalCost: '£42,000 – £58,000', description: 'Creates 1 spacious bedroom and 1 compact ensuite.' },
      { sizeCategory: 'L-Shaped Dormer', dimensions: 'Approx 40m²', typicalCost: '£55,000 – £78,000', description: 'Converts both main roof and rear outrigger for 2 bedrooms or 1 master suite with dressing room.' },
    ],
    finishLevels: [
      { level: 'Standard Turnkey', multiplier: '1.0x', description: 'Full plaster, electrics, standard ensuite suite.', features: ['Timber staircase', 'EPDM rubber roof', 'Standard shower suite', 'Radiator heating'] },
      { level: 'Luxury Master Suite', multiplier: '1.35x', description: 'Juliette balcony, bespoke fitted wardrobes, walk-in wetroom.', features: ['Aluminium Juliet balcony', 'Custom fitted wardrobes', 'Walk-in wetroom', 'Smart heating controls'] },
    ],
    regionalConsiderations: ['London planning constraints often favor mansards or rear dormers with timber cladding.'],
    timeline: [
      { stage: 'Scaffolding & Structural Steel', duration: 'Weeks 1–2', description: 'External access scaffolding and steel beam installation.' },
      { stage: 'Dormer Framing & Roof Weatherproofing', duration: 'Weeks 3–4', description: 'Timber structural frame, EPDM rubber roof, and Velux windows.' },
      { stage: 'Staircase & First Fix', duration: 'Weeks 5–6', description: 'Stairs installation, electrical wiring, and plumbing.' },
      { stage: 'Insulation, Boarding & Plastering', duration: 'Weeks 7–8', description: 'SuperFOIL/Celotex insulation and MultiFinish skim.' },
      { stage: 'Second Fix & Handover', duration: 'Weeks 9–10', description: 'Ensuite fitting, fire doors, and building control completion.' },
    ],
    commonAdditionalCosts: [
      { item: 'Party Wall Notices / Awards', cost: '£1,000 – £2,000', description: 'Required for steel beam bearing in shared party walls.' },
    ],
    faqs: [
      { question: 'What minimum head height is required for a loft conversion?', answer: 'You need a minimum ceiling height of 2.2 meters measured from the top of the ceiling joists to the bottom of the ridge timber. After floor and roof insulation, this leaves a finished head height of approx 2.0m.' },
    ],
    relatedCalculatorSlug: 'loft-conversion-calculator',
    relatedServiceSlug: 'loft-conversions',
    relatedCaseStudySlug: 'richmond-full-period-home-renovation',
    relatedAdviceSlugs: ['minimum-head-height-for-loft-conversion', 'fire-safety-building-regulations-lofts'],
    commercialCta: {
      title: 'Planning a Loft Conversion?',
      description: 'Our team assesses headroom, calculates structural steel beams, and provides full architectural drawings and construction delivery.',
      buttonText: 'Plan My Loft Project →',
      buttonHref: '/plan-my-project?type=loft',
    },
  },

  // =========================================================================
  // 6. GARAGE CONVERSION COST GUIDE
  // =========================================================================
  {
    id: 'garage-conversion-cost',
    slug: 'garage-conversion-cost',
    title: 'Garage Conversion Cost Guide UK (2026 Rates)',
    h1: 'How Much Does a Garage Conversion Cost in the UK? (2026)',
    subtitle: 'Cost guide for converting attached, integrated, and detached garages into habitable living space or home offices.',
    metaTitle: 'Garage Conversion Cost UK 2026 | Price Guide & Building Regs',
    metaDescription: 'Complete 2026 guide to UK garage conversion costs. Single and double garage conversion prices, floor insulation, window infill, and building regulations.',
    keywords: ['garage conversion cost uk', 'how much to convert a garage', 'garage conversion price guide', 'convert garage to bedroom cost'],
    category: 'conversions',
    publishedDate: '2025-02-05',
    lastUpdated: '2026-02-18',
    status: 'published',
    indicativeRange: {
      low: 11500,
      high: 24500,
      unit: 'single garage conversion',
      formatted: '£11,500 – £24,500',
    },
    introParagraphs: [
      'Converting an under-utilized garage into a home office, gym, playroom, or ground-floor bedroom is one of the quickest and most cost-effective ways to increase your home’s living area.',
      'In 2026, standard single garage conversions in the UK cost between £11,500 and £18,500. Double garage conversions typically range from £18,000 to £28,000.',
    ],
    priceTable: {
      title: 'UK Garage Conversion Costs (2026)',
      rows: [
        { type: 'Single Integrated Garage (~15m²)', guideRange: '£11,500 – £17,500', perM2: 'Turnkey', notes: 'Door infill, insulated floor slab, damp proofing, plastering, electrics' },
        { type: 'Double Garage Conversion (~30m²)', guideRange: '£18,000 – £28,000', perM2: 'Turnkey', notes: 'Full conversion to living room, bedroom, or divided utility space' },
        { type: 'Detached Garage Conversion', guideRange: '£16,000 – £24,000', perM2: 'Turnkey', notes: 'Requires trenching for power, heating, and upgraded roof insulation' },
      ],
    },
    costFactors: [
      { title: 'Floor Damp Proofing & Insulation', description: 'Existing concrete garage floors must be damp proofed with DPM and insulated with 100mm PIR board (£1,500–£2,500).' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Single Garage Home Office', dimensions: 'Approx 15m²', typicalCost: '£12,500 – £16,500', description: 'Insulated walls, radiator heating, spotlighting, and double glazed window.' },
    ],
    finishLevels: [
      { level: 'Turnkey Living Space', multiplier: '1.0x', description: 'Fully compliant with Part L thermal insulation standards.', features: ['Cavity wall insulation', 'Insulated floating floor', 'Double-glazed uPVC window', 'Full plaster skim'] },
    ],
    regionalConsiderations: ['South East prices average ~£14,500 for a single conversion.'],
    timeline: [
      { stage: 'Door Removal & Infill Brickwork', duration: 'Week 1', description: 'Remove garage door, pour footing, build brickwork, and install window.' },
      { stage: 'Floor Screed & Wall Insulation', duration: 'Week 2', description: 'Install DPM membrane, PIR insulation, and studwork.' },
      { stage: 'Plastering, Electrics & Handover', duration: 'Week 3', description: 'Skim plaster, heating connection, decorating, and building control certificate.' },
    ],
    commonAdditionalCosts: [
      { item: 'Building Regulations Certification', cost: '£650 – £950', description: 'Mandatory council inspection and certificate of completion.' },
    ],
    faqs: [
      { question: 'Do I need planning permission for a garage conversion?', answer: 'Most garage conversions fall under Permitted Development and do not require planning permission. However, Building Regulations approval is always legally required.' },
    ],
    relatedCalculatorSlug: 'garage-conversion-calculator',
    relatedServiceSlug: 'garage-conversions',
    relatedCaseStudySlug: 'richmond-full-period-home-renovation',
    relatedAdviceSlugs: ['garage-conversion-building-regulations-guide'],
    commercialCta: {
      title: 'Planning a Garage Conversion or Home Office?',
      description: 'Our building team handles building regulations, insulated floors, window infill, and electrical heating installations.',
      buttonText: 'Book Free Site Survey →',
      buttonHref: '/contact?type=consultation',
    },
  },

  // =========================================================================
  // 7. GARDEN ROOM / STUDIO COST GUIDE
  // =========================================================================
  {
    id: 'garden-room-cost',
    slug: 'garden-room-cost',
    title: 'Insulated Garden Room & Studio Cost Guide UK (2026)',
    h1: 'How Much Does a Garden Room Cost in the UK? (2026 Guide)',
    subtitle: 'Cost guide for bespoke insulated timber garden offices, home gyms, and luxury outdoor living studios.',
    metaTitle: 'Garden Room Cost UK 2026 | Insulated Studio Price Guide',
    metaDescription: 'Complete 2026 guide to UK garden room costs. Prices per m² for insulated timber studios, ground screw foundations, aluminium bifolds, and electrics.',
    keywords: ['garden room cost uk', 'garden office cost', 'how much does a garden studio cost', 'insulated garden building price'],
    category: 'outdoor',
    publishedDate: '2025-02-08',
    lastUpdated: '2026-02-19',
    status: 'published',
    indicativeRange: {
      low: 18000,
      high: 38000,
      unit: 'year-round insulated studio (15–25m²)',
      formatted: '£18,000 – £38,000',
    },
    introParagraphs: [
      'A dedicated garden room offers the ultimate separation between work and home life. Built with residential-grade insulation, double or triple glazing, and integrated heating, modern garden studios provide comfortable year-round use.',
      'In 2026, turnkey insulated garden rooms in the UK typically cost between £1,400 and £2,100 per square meter, including screw pile foundations, composite cladding, and electrical mains connections.',
    ],
    priceTable: {
      title: 'UK Garden Room Costs by Size (2026)',
      rows: [
        { type: 'Compact Garden Office (3m × 3m / 9m²)', guideRange: '£14,000 – £19,500', perM2: '£1,550 – £2,150/m²', notes: 'Ideal for 1-2 remote workstations, includes power & heating' },
        { type: 'Standard Garden Studio (5m × 3.5m / 17.5m²)', guideRange: '£24,500 – £36,000', perM2: '£1,400 – £2,050/m²', notes: 'Our most popular size for dual home office / lounge with aluminium bifolds' },
        { type: 'Large Garden Gym / Annex (7m × 4m / 28m²)', guideRange: '£38,000 – £58,000', perM2: '£1,350 – £2,050/m²', notes: 'Includes reinforced floor for weights, acoustic glass, and optional shower room' },
      ],
    },
    costFactors: [
      { title: 'Ground Screw Foundation System', description: 'Zero-mess ground screws anchor into the ground in 1 day without concrete skips (£1,800–£3,500).' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Medium Studio', dimensions: '5m × 3.5m', typicalCost: '£26,000 – £34,000', description: 'Aluminium bifold doors, composite cedar-style cladding, electrics, and heating.' },
    ],
    finishLevels: [
      { level: 'Luxury Turnkey', multiplier: '1.0x', description: 'Year-round residential specification with 100mm insulation throughout.', features: ['Composite cedar cladding', 'EPDM rubber roof', 'Slimline aluminium bifolds', 'Electric radiator & data point'] },
    ],
    regionalConsiderations: ['Trench cable runs over 25m from main house consumer unit add £40/meter.'],
    timeline: [
      { stage: 'Ground Screws & Base Framework', duration: 'Days 1–2', description: 'Laser-level foundation screws and C24 treated subframe.' },
      { stage: 'SIPs Structure & Weatherproofing', duration: 'Days 3–6', description: 'Insulated panels, EPDM roof, and aluminium doors.' },
      { stage: 'Cladding, Electrics & Plaster Finish', duration: 'Days 7–12', description: 'Exterior cladding, interior plaster, lighting, and commissioning.' },
    ],
    commonAdditionalCosts: [
      { item: 'Armoured Electrical Cable Trenching', cost: '£800 – £1,600', description: 'Buried 500mm underground from main house consumer unit.' },
    ],
    faqs: [
      { question: 'Can I use a garden room all year round in winter?', answer: 'Yes. Our garden rooms use residential-grade SIPs panels and 100mm PIR insulation with thermally broken double glazing and climate control heating.' },
    ],
    relatedCalculatorSlug: 'garden-room-calculator',
    relatedServiceSlug: 'garden-rooms',
    relatedCaseStudySlug: 'kew-architectural-garden-studio',
    relatedAdviceSlugs: ['garden-room-permitted-development-rules'],
    commercialCta: {
      title: 'Looking for a Bespoke Insulated Garden Studio?',
      description: 'Our team designs and constructs luxury garden offices, home gyms, and cinema rooms with full insulation and guarantees.',
      buttonText: 'Plan My Garden Project →',
      buttonHref: '/plan-my-project?type=garden',
    },
  },

  // =========================================================================
  // 8. DRIVEWAY COST GUIDE
  // =========================================================================
  {
    id: 'driveway-cost',
    slug: 'driveway-cost',
    title: 'Driveway Cost Guide UK (Resin, Block Paving & Tarmac 2026)',
    h1: 'How Much Does a New Driveway Cost in the UK? (2026)',
    subtitle: 'Price per m² benchmarks for resin-bound, block paving, tarmac, and permeable gravel driveways including groundworks.',
    metaTitle: 'Driveway Cost UK 2026 | Resin & Block Paving Price per m2',
    metaDescription: 'Complete 2026 guide to UK driveway costs. Average price per m² for resin-bound, block paving, tarmac, ground excavation, and dropped kerbs.',
    keywords: ['driveway cost uk', 'resin driveway cost per m2', 'block paving cost per m2', 'how much does a new driveway cost'],
    category: 'outdoor',
    publishedDate: '2025-02-10',
    lastUpdated: '2026-02-20',
    status: 'published',
    indicativeRange: {
      low: 4500,
      high: 9500,
      unit: 'standard 2-car driveway (~50m²)',
      formatted: '£4,500 – £9,500',
    },
    introParagraphs: [
      'A new driveway dramatically boosts your home’s kerb appeal while providing secure off-street parking and electric vehicle charging access.',
      'In 2026, installing a new 50m² driveway in the UK typically ranges from £4,500 to £8,500 including 150mm ground excavation, MOT Type 1 sub-base, and paving surface.',
    ],
    priceTable: {
      title: 'UK Driveway Cost per m² by Surface Material (2026)',
      rows: [
        { type: 'Resin-Bound Permeable Aggregate', guideRange: '£95 – £150 / m²', perM2: 'Installed', notes: 'SUDS compliant permeable surface, smooth finish, no loose stones' },
        { type: 'Concrete / Tegula Block Paving', guideRange: '£85 – £135 / m²', perM2: 'Installed', notes: 'Classic aesthetic with block border details and kiln-dried sand' },
        { type: 'Tarmac / Asphalt with Block Border', guideRange: '£75 – £115 / m²', perM2: 'Installed', notes: 'Extremely durable and cost-effective for large surface areas' },
      ],
    },
    costFactors: [
      { title: 'Ground Excavation & Muck Away', description: 'Digging out 150–200mm of old ground and removing with grab wagons costs £1,500–£2,800.' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: '2-Car Driveway', dimensions: 'Approx 50m²', typicalCost: '£4,800 – £7,500', description: 'Standard suburban driveway with concrete edging kerbs.' },
    ],
    finishLevels: [
      { level: 'Resin-Bound UV Resistant', multiplier: '1.0x', description: 'Seamless permeable polyurethane aggregate.', features: ['UV-stable aliphatic resin', 'Recycled natural aggregate', 'Aluminium edge trims', 'SUDS permeability'] },
    ],
    regionalConsiderations: ['Dropped kerb council permits in London typically cost £1,200–£2,200.'],
    timeline: [
      { stage: 'Excavation & Sub-Base', duration: 'Days 1–2', description: 'Dig out ground, lay geotextile membrane, and compact MOT Type 1 aggregate.' },
      { stage: 'Edging & Surface Paving', duration: 'Days 3–5', description: 'Install concrete kerbs and lay resin-bound or block paving.' },
    ],
    commonAdditionalCosts: [
      { item: 'ACO Drainage Channels & Soakaway', cost: '£650 – £1,200', description: 'Prevents water pooling and complies with SUDS planning regulations.' },
    ],
    faqs: [
      { question: 'Do I need planning permission to pave my front garden?', answer: 'If using a permeable surface (such as resin-bound paving or porous blocks) where water naturally drains away, planning permission is not required under UK SUDS regulations.' },
    ],
    relatedCalculatorSlug: 'driveway-cost-calculator',
    relatedServiceSlug: 'driveways',
    relatedCaseStudySlug: 'kew-architectural-garden-studio',
    relatedAdviceSlugs: ['suds-permeable-driveway-regulations'],
    commercialCta: {
      title: 'Planning a New Driveway or Front Entrance?',
      description: 'Our groundworks team installs permeable resin, block paving, and dropped kerbs with full council compliance.',
      buttonText: 'Plan My Driveway Project →',
      buttonHref: '/plan-my-project?type=driveway',
    },
  },
  // =========================================================================
  // 9. WRAPAROUND EXTENSION COST GUIDE
  // =========================================================================
  {
    id: 'wraparound-extension-cost',
    slug: 'wraparound-extension-cost',
    title: 'Victorian Wraparound Extension Cost Guide UK (2026 London Rates)',
    h1: 'Victorian Wraparound Extension Costs & Structural Feasibility (2026 Guide)',
    subtitle: 'Comprehensive pricing guide for L-shaped wraparound extensions, 3-steel goalpost frame requirements, Thames Water build-overs, and cost per m² benchmarks.',
    metaTitle: 'Wraparound Extension Cost UK 2026 | London Price Per m2 & Steel Guide',
    metaDescription: 'Complete 2026 UK wraparound house extension cost guide. Average price per m², 3-way RSJ goalpost engineering, Thames Water sewer build-over rules, and realistic budgets.',
    keywords: ['wraparound extension cost london', 'victorian wraparound extension cost', 'side return and rear extension price', 'l shaped extension cost uk', 'rsj goalpost extension cost'],
    category: 'extensions',
    publishedDate: '2026-03-01',
    lastUpdated: '2026-03-01',
    status: 'published',
    indicativeRange: {
      low: 105000,
      high: 220000,
      unit: 'standard wraparound (35–55m²)',
      formatted: '£105,000 – £220,000',
    },
    introParagraphs: [
      'A wraparound extension combines a traditional Victorian side return with a rear extension, creating a massive L-shaped open-plan living and kitchen space that dramatically increases both the usable floor area and commercial value of a London period home.',
      'In 2026, standard wraparound house extension build costs in London and the South East typically range between £2,850 and £3,800 per square metre (m²) for architectural specifications, rising to £4,200+ per m² for ultra-slimline structural glass and bespoke joinery.',
      'Because a wraparound involves removing the entire corner of the original house, it requires extensive structural steel goalpost framing, foundation underpinning in London clay, and formal Thames Water sewer build-over approvals.',
    ],
    priceTable: {
      title: 'London Wraparound Extension Cost Benchmarks (2026)',
      rows: [
        {
          type: '30m² Compact Wraparound (Side + Small Rear)',
          guideRange: '£85,000 – £115,000',
          perM2: '£2,850 – £3,400/m²',
          notes: 'Standard pitched side glazing and slimline aluminium bi-folds',
        },
        {
          type: '45m² Mid-Size Wraparound (Typical Victorian Terrace)',
          guideRange: '£135,000 – £175,000',
          perM2: '£3,000 – £3,900/m²',
          notes: 'Full 3-steel goalpost frame, floor-to-ceiling sliding glass & underfloor heating',
        },
        {
          type: '60m² Large Wraparound (Semi-Detached / Period Villa)',
          guideRange: '£185,000 – £245,000',
          perM2: '£3,100 – £4,100/m²',
          notes: 'Minimalist frameless glass box, bespoke architectural island & subfloor tanking',
        },
      ],
    },
    costFactors: [
      { title: '3-Steel Interconnected Goalpost System', description: 'Removing the outrigger corner wall requires 3 heavy Universal Column (UC) steel beams bearing on engineered concrete padstones (£7,500–£14,000).' },
      { title: 'Thames Water Build-Over Agreement', description: 'Building over public sewer lines requires CCTV surveys, non-return valves, and manhole relocations (£1,500–£3,500).' },
      { title: 'London Clay Groundworks & Foundations', description: 'Deep 1.2m–1.8m concrete strip foundations or engineered mini-piles to resist tree root shrinkage.' },
    ],
    projectSizeConsiderations: [
      { sizeCategory: 'Standard 40m² London Wraparound', dimensions: 'Approx 40m²', typicalCost: '£120,000 – £160,000', description: 'Combines a 2.5m wide side return with a 3m rear projection.' },
    ],
    finishLevels: [
      { level: 'Architectural Spec', multiplier: '1.0x', description: 'Flush 20mm sliding glass, hydronic underfloor heating, and large-format porcelain.', features: ['20mm sightline sliding glass', 'Hydronic manifold UFH', 'Engineered concrete padstones', 'Thames Water sign-off'] },
    ],
    regionalConsiderations: ['West and South West London (Chiswick, Richmond, Ealing, Wimbledon) require Party Wall notices served 2 months in advance.'],
    timeline: [
      { stage: 'Strip-Out & Groundworks', duration: 'Weeks 1–3', description: 'Demolish side return walls, dig foundation trenches, and relocate sewer lines.' },
      { stage: 'Structural Steel & Shell', duration: 'Weeks 4–7', description: 'Erect 3-steel goalpost frame, build cavity brickwork, and install roof lanterns.' },
      { stage: 'Glazing & First Fix MEP', duration: 'Weeks 8–11', description: 'Install sliding doors, plumbing, electrical rewiring, and subfloor screed.' },
      { stage: 'Second Fix & Kitchen Fit', duration: 'Weeks 12–16', description: 'Plastering, flooring, kitchen cabinetry, and Building Control completion.' },
    ],
    commonAdditionalCosts: [
      { item: 'Party Wall Surveyor Awards', cost: '£1,800 – £3,500', description: 'Mandatory notices and schedule of condition surveys for both shared boundaries.' },
    ],
    faqs: [
      { question: 'Do I need planning permission for a wraparound extension?', answer: 'Because a wraparound wraps around the side and rear simultaneously, it often exceeds Permitted Development side-width rules (half the width of the original house) and typically requires a Householder Full Planning Application.' },
      { question: 'How long does a wraparound extension take to build?', answer: 'A typical London 40–55m² wraparound extension takes between 14 and 18 weeks from initial site strip-out to final decorator snagging.' },
    ],
    relatedCalculatorSlug: 'extension-cost-calculator',
    relatedServiceSlug: 'extensions',
    relatedCaseStudySlug: 'ealing-contemporary-rear-extension',
    relatedAdviceSlugs: ['party-wall-act-guide', 'planning-permission-vs-building-regulations'],
    commercialCta: {
      title: 'Planning a Wraparound Extension on Your London Home?',
      description: 'Our principal contracting team handles architectural design, structural engineering, Thames Water agreements, and construction under a single turnkey contract.',
      buttonText: 'Plan My Wraparound Project →',
      buttonHref: '/plan-my-project?type=extension',
    },
  },
];

export function getCostGuideBySlug(slug: string): CostGuide | undefined {
  return COST_GUIDES_DATA.find((g) => g.slug === slug);
}
