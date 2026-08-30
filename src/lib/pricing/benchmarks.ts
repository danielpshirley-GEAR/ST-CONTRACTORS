/**
 * Central Construction Benchmark Rates — London & South East
 * Conforms to GEMINI.md Rule 8 & BUILD_SPEC.md Section 23
 * Last Updated: Q1 2026
 */

import { FinishLevel, ProjectType } from './types';

export interface BaseRateBenchmark {
  projectType: ProjectType;
  baseCostLow: number;
  baseCostHigh: number;
  unit: 'per_m2' | 'fixed_scope' | 'per_room';
  defaultAreaM2: number;
  typicalDurationWeeksMin: number;
  typicalDurationWeeksMax: number;
  notes: string;
}

export interface AddonFeature {
  key: string;
  label: string;
  costLow: number;
  costHigh: number;
  extraWeeks: number;
  description: string;
}

export const BASE_PROJECT_BENCHMARKS: Record<ProjectType, BaseRateBenchmark> = {
  extension: {
    projectType: 'extension',
    baseCostLow: 2100,
    baseCostHigh: 2750,
    unit: 'per_m2',
    defaultAreaM2: 24, // e.g. 6m x 4m single rear extension
    typicalDurationWeeksMin: 10,
    typicalDurationWeeksMax: 16,
    notes: 'Single storey ground floor extension including standard foundations, brick/block shell, flat/pitch roof, basic M&E.',
  },
  'full-renovation': {
    projectType: 'full-renovation',
    baseCostLow: 1100,
    baseCostHigh: 1650,
    unit: 'per_m2',
    defaultAreaM2: 110, // ~3-bed house floor area
    typicalDurationWeeksMin: 12,
    typicalDurationWeeksMax: 22,
    notes: 'Full house strip out, rewiring, central heating replumb, plastering, kitchen, 2 bathrooms, flooring and decoration.',
  },
  kitchen: {
    projectType: 'kitchen',
    baseCostLow: 18000,
    baseCostHigh: 38000,
    unit: 'fixed_scope',
    defaultAreaM2: 18,
    typicalDurationWeeksMin: 3,
    typicalDurationWeeksMax: 6,
    notes: 'Bespoke cabinetry, quartz worktops, plumbing alterations, appliance installation, tiling and lighting.',
  },
  bathroom: {
    projectType: 'bathroom',
    baseCostLow: 9500,
    baseCostHigh: 22000,
    unit: 'fixed_scope',
    defaultAreaM2: 7,
    typicalDurationWeeksMin: 2,
    typicalDurationWeeksMax: 4,
    notes: 'Sanitaryware, walk-in shower/bath, full waterproofing/tanking, porcelain tiling, vanity and ventilation.',
  },
  'loft-conversion': {
    projectType: 'loft-conversion',
    baseCostLow: 48000,
    baseCostHigh: 78000,
    unit: 'fixed_scope',
    defaultAreaM2: 32,
    typicalDurationWeeksMin: 8,
    typicalDurationWeeksMax: 14,
    notes: 'Rear dormer loft conversion with master bedroom, en-suite bathroom, Velux rooflights and staircase integration.',
  },
  'garage-conversion': {
    projectType: 'garage-conversion',
    baseCostLow: 16000,
    baseCostHigh: 32000,
    unit: 'fixed_scope',
    defaultAreaM2: 18,
    typicalDurationWeeksMin: 4,
    typicalDurationWeeksMax: 7,
    notes: 'Infill front garage door with matching brick/window, damp-proof insulated floor, wall insulation, heating and electrics.',
  },
  'garden-room': {
    projectType: 'garden-room',
    baseCostLow: 1750,
    baseCostHigh: 2400,
    unit: 'per_m2',
    defaultAreaM2: 18, // 6m x 3m studio
    typicalDurationWeeksMin: 4,
    typicalDurationWeeksMax: 8,
    notes: 'Insulated timber frame garden studio, aluminum sliding/bifold doors, electrical sub-panel, heating and composite cladding.',
  },
  driveway: {
    projectType: 'driveway',
    baseCostLow: 140,
    baseCostHigh: 220,
    unit: 'per_m2',
    defaultAreaM2: 45,
    typicalDurationWeeksMin: 2,
    typicalDurationWeeksMax: 3,
    notes: 'Excavation, permeable Type 1 sub-base, resin-bound / block paving, ACO drainage channel and dropped kerb prep.',
  },
  landscaping: {
    projectType: 'landscaping',
    baseCostLow: 160,
    baseCostHigh: 260,
    unit: 'per_m2',
    defaultAreaM2: 60,
    typicalDurationWeeksMin: 2,
    typicalDurationWeeksMax: 5,
    notes: 'Porcelain slab patio on wet mortar bed, retaining walls, steps, premium turfing, fencing and garden lighting.',
  },
  other: {
    projectType: 'other',
    baseCostLow: 25000,
    baseCostHigh: 75000,
    unit: 'fixed_scope',
    defaultAreaM2: 30,
    typicalDurationWeeksMin: 4,
    typicalDurationWeeksMax: 12,
    notes: 'General architectural residential building work and structural modifications.',
  },
};

export const FINISH_LEVEL_MULTIPLIERS: Record<FinishLevel, { multiplier: number; label: string; description: string }> = {
  essential: {
    multiplier: 0.88,
    label: 'Essential',
    description: 'Clean, cost-conscious, functional specification with durable trade-standard materials.',
  },
  standard: {
    multiplier: 1.0,
    label: 'Standard',
    description: 'Quality specification with recognized UK brand fittings, solid finishes, and durable fixtures.',
  },
  premium: {
    multiplier: 1.22,
    label: 'Premium',
    description: 'High-end architectural specification: quartz surfaces, hardwood/engineered floors, designer sanitaryware and smart controls.',
  },
  luxury: {
    multiplier: 1.55,
    label: 'Luxury / Bespoke',
    description: 'Ultra-prime bespoke finishes: imported marble, custom architectural glazing, bespoke joinery, and full home automation.',
  },
};

/**
 * Dynamic Project-Specific Requirements & Add-ons Map
 * Conforms to BUILD_SPEC.md Section 10
 */
export const PROJECT_SPECIFIC_ADDONS: Record<ProjectType, AddonFeature[]> = {
  extension: [
    { key: 'bifold_doors', label: 'Aluminum Bifold Doors (3–4 Panel)', costLow: 4200, costHigh: 6800, extraWeeks: 1, description: 'Thermally broken powder-coated aluminum bifolding glass door system.' },
    { key: 'sliding_doors', label: 'Architectural Slimline Sliding Glass Doors', costLow: 5500, costHigh: 9200, extraWeeks: 1, description: 'Minimal sightline 20mm slimline sliders for panoramic garden view.' },
    { key: 'rooflights', label: 'Frameless Glass Rooflights / Lantern', costLow: 1800, costHigh: 3600, extraWeeks: 0.5, description: 'High-efficiency self-cleaning solar control rooflight window.' },
    { key: 'underfloor_heating', label: 'Water Underfloor Heating System', costLow: 2400, costHigh: 4600, extraWeeks: 1, description: 'Wet system piped into screed with individual digital smart thermostats.' },
    { key: 'structural_opening', label: 'Major Structural Knockthrough & Steel Beam (RSJ)', costLow: 3500, costHigh: 6200, extraWeeks: 1, description: 'Full rear loadbearing wall removal with structural engineer calculation.' },
    { key: 'new_kitchen', label: 'Integrated Kitchen Installation in New Extension', costLow: 14000, costHigh: 28000, extraWeeks: 2, description: 'New cabinetry layout, island plumbing, extraction and electrical runs.' },
    { key: 'utility_room', label: 'Utility Room & Plumbing Fit-Out', costLow: 4500, costHigh: 8500, extraWeeks: 1, description: 'Separate laundry space, Belfast sink, washing machine & storage cabinetry.' },
    { key: 'wc_bathroom', label: 'Ground Floor WC / Wetroom Addition', costLow: 5200, costHigh: 9800, extraWeeks: 1, description: 'New cloakroom toilet with concealed cistern, basin and ventilation.' },
    { key: 'full_decorating', label: 'Professional Misting & Full Paint Finishing', costLow: 2200, costHigh: 4500, extraWeeks: 0.5, description: 'Complete mist coat, two topcoats, and satinwood woodwork finishing.' },
    { key: 'paving_patio', label: 'Adjoining Garden Patio / Threshold Leveling', costLow: 3800, costHigh: 7500, extraWeeks: 1, description: 'Flush indoor-outdoor threshold connection to matching porcelain patio.' },
  ],

  'full-renovation': [
    { key: 'full_rewire', label: 'Full Property Rewire & Consumer Unit Upgrade', costLow: 5500, costHigh: 9500, extraWeeks: 1.5, description: 'Complete NICEIC certified rewiring, USB sockets, and new dual RCD board.' },
    { key: 'new_heating_system', label: 'New Central Heating & Radiator / UFH Replumb', costLow: 6500, costHigh: 12000, extraWeeks: 1.5, description: 'New high-flow combi or megaflo system with designer column radiators.' },
    { key: 'structural_knockthrough', label: 'Internal Wall Removals & Steel Beams (RSJ)', costLow: 4500, costHigh: 8500, extraWeeks: 1, description: 'Creating open plan ground floor layout with building control sign-off.' },
    { key: 'kitchen_renovation', label: 'Complete Bespoke Kitchen Fit-Out', costLow: 16000, costHigh: 34000, extraWeeks: 2, description: 'Premium kitchen cabinetry, quartz surfaces, island and integrated appliances.' },
    { key: 'bathroom_renovations', label: 'Luxury Main Bathroom & Ensuite Renovation', costLow: 14000, costHigh: 26000, extraWeeks: 1.5, description: 'Complete replacement of 2 bathrooms with porcelain tiling and walk-in showers.' },
    { key: 'plastering_throughout', label: 'Full Plaster Skimming Throughout All Rooms', costLow: 4200, costHigh: 7800, extraWeeks: 1, description: 'Replastering all ceilings and walls to smooth, flawless paint-ready finish.' },
    { key: 'flooring_throughout', label: 'Engineered Hardwood / Tiled Flooring Throughout', costLow: 5000, costHigh: 11000, extraWeeks: 1, description: 'Subfloor leveling and installation of herringbone / wide-plank flooring.' },
    { key: 'period_features', label: 'Period Cornicing, Skirting & Architectural Joinery', costLow: 3200, costHigh: 6500, extraWeeks: 0.5, description: 'Victorian/Edwardian plaster coving restoration and deep profile skirtings.' },
    { key: 'windows_replacement', label: 'Replacement Double Glazed Sash or Casement Windows', costLow: 8500, costHigh: 18000, extraWeeks: 1.5, description: 'Timber or acoustic UPVC double glazed conservation-approved windows.' },
    { key: 'full_decorating', label: 'Full Interior Decorating & Woodwork Spraying', costLow: 3800, costHigh: 7500, extraWeeks: 1, description: 'Professional primer, misting, wall emulsion and spray-painted doors.' },
  ],

  kitchen: [
    { key: 'island_breakfast_bar', label: 'Kitchen Island with Breakfast Bar Seating', costLow: 3500, costHigh: 7500, extraWeeks: 0.5, description: 'Central island unit with integrated storage, wine cooler, and seating overhang.' },
    { key: 'quartz_worktops', label: 'Quartz / Porcelain Slab Worktops & Splashbacks', costLow: 3200, costHigh: 6800, extraWeeks: 0.5, description: '20mm or 30mm mitred quartz surfaces with undermount sink cutouts.' },
    { key: 'knockthrough_diner', label: 'Load-Bearing Wall Removal for Open-Plan Diner', costLow: 3800, costHigh: 6500, extraWeeks: 1, description: 'Structural knockthrough connecting kitchen and living/dining space.' },
    { key: 'integrated_appliances', label: 'Premium Integrated Appliance Package', costLow: 4500, costHigh: 10500, extraWeeks: 0.5, description: 'Oven tower, induction hob with downdraft, dishwasher, and fridge-freezer.' },
    { key: 'underfloor_heating', label: 'Electric or Wet Underfloor Heating', costLow: 1800, costHigh: 3400, extraWeeks: 0.5, description: 'Even radiant floor warmth under tiles with digital programmable thermostat.' },
    { key: 'plumbing_gas_relocation', label: 'Sinks, Gas & Drainage Pipeline Relocation', costLow: 1500, costHigh: 3200, extraWeeks: 0.5, description: 'Re-routing water supply, waste pipes and gas line for new layout.' },
    { key: 'designer_lighting', label: 'Feature Pendant & Under-Cabinet LED Lighting', costLow: 1200, costHigh: 2400, extraWeeks: 0.5, description: 'Layered architectural LED strip lighting and dimmer zones.' },
    { key: 'utility_knockthrough', label: 'Adjoining Utility Room Fit-Out', costLow: 3500, costHigh: 6500, extraWeeks: 1, description: 'Separate laundry and pantry space with matching cabinetry.' },
    { key: 'porcelain_flooring', label: 'Large Format Porcelain Floor Tiling', costLow: 2200, costHigh: 4600, extraWeeks: 0.5, description: '600x1200mm porcelain floor tiles with anti-crack membrane.' },
    { key: 'bifold_kitchen_access', label: 'New Bifold / French Doors into Garden', costLow: 4200, costHigh: 6800, extraWeeks: 1, description: 'Knockout external wall to create garden access from kitchen.' },
  ],

  bathroom: [
    { key: 'walk_in_rainfall_shower', label: 'Walk-In Low-Profile Wetroom & Rainfall Shower', costLow: 2400, costHigh: 4500, extraWeeks: 0.5, description: 'Tanked waterproof wetroom floor tray with concealed thermostatic mixer.' },
    { key: 'freestanding_bath', label: 'Designer Freestanding Double-Ended Bath', costLow: 1800, costHigh: 3800, extraWeeks: 0.5, description: 'Stone composite or acrylic freestanding bath with floor-mounted mixer tap.' },
    { key: 'double_vanity_unit', label: 'Wall-Hung Double Basin Vanity with Storage', costLow: 1400, costHigh: 3200, extraWeeks: 0.5, description: 'Twin basin wall-hung drawer unit with soft-close drawers.' },
    { key: 'wall_hung_wc', label: 'Concealed Cistern & Wall-Hung WC Unit', costLow: 1100, costHigh: 2200, extraWeeks: 0.5, description: 'Geberit frame with concealed dual-flush cistern and rimless pan.' },
    { key: 'electric_ufh', label: 'Electric Underfloor Heating Mat & Smart Thermostat', costLow: 900, costHigh: 1600, extraWeeks: 0.5, description: 'Heated floor cable system controlled via Wi-Fi touchscreen thermostat.' },
    { key: 'full_porcelain_tiling', label: 'Full Floor-to-Ceiling Porcelain Tiling', costLow: 2200, costHigh: 4500, extraWeeks: 0.5, description: 'Complete wall waterproofing, mitred tile corners and epoxy grouting.' },
    { key: 'plumbing_reconfiguration', label: 'Soil Pipe & Supply Line Reconfiguration', costLow: 1200, costHigh: 2600, extraWeeks: 0.5, description: 'Relocating waste runs, soil pipe stack, and hot/cold feeds.' },
    { key: 'illuminated_recesses', label: 'LED Lit Shower Niches & Anti-Fog Mirror', costLow: 800, costHigh: 1600, extraWeeks: 0.5, description: 'Recessed illuminated shelf in shower and heated LED mirror cabinet.' },
    { key: 'inline_extractor', label: 'High-Power Inline Centrifugal Extraction Fan', costLow: 450, costHigh: 900, extraWeeks: 0.5, description: 'Quiet loft-mounted timer fan preventing steam and condensation.' },
    { key: 'towel_radiator', label: 'Heated Designer Towel Rail System', costLow: 550, costHigh: 1100, extraWeeks: 0.5, description: 'Dual fuel radiator connected to central heating and electric summer element.' },
  ],

  'loft-conversion': [
    { key: 'ensuite_bathroom', label: 'Luxury Master Ensuite Shower Room', costLow: 7500, costHigh: 13500, extraWeeks: 1.5, description: 'Complete loft ensuite with shower, vanity, toilet, and hot water pump.' },
    { key: 'rear_dormer', label: 'Full-Width Rear Flat-Roof Dormer', costLow: 12000, costHigh: 22000, extraWeeks: 2, description: 'Maximizes head height and usable floor space across the rear roof slope.' },
    { key: 'velux_rooflights', label: 'Front Pitch Velux Solar / Manual Rooflights', costLow: 1800, costHigh: 3600, extraWeeks: 0.5, description: 'Pair of top-hung Velux roof windows with solar-powered blackout blinds.' },
    { key: 'juliette_balcony', label: 'French Doors with Frameless Glass Juliette Balcony', costLow: 2400, costHigh: 4200, extraWeeks: 0.5, description: 'Floor-to-ceiling opening doors with laminated glass safety balustrade.' },
    { key: 'fitted_wardrobes', label: 'Custom Eaves Fitted Wardrobes & Storage', costLow: 2500, costHigh: 5500, extraWeeks: 1, description: 'Bespoke angled joinery maximizing low-ceiling eaves space.' },
    { key: 'air_conditioning', label: 'Climate Control Air Conditioning Unit', costLow: 2200, costHigh: 3800, extraWeeks: 0.5, description: 'Whisper-quiet wall-mounted cooling and heating split unit for summer.' },
    { key: 'staircase_upgrade', label: 'Bespoke Hardwood Staircase & Spindles', costLow: 2800, costHigh: 4800, extraWeeks: 1, description: 'Matching existing hallway staircase design with continuous handrails.' },
    { key: 'acoustic_insulation', label: 'High-Performance Acoustic Floor Soundproofing', costLow: 1400, costHigh: 2800, extraWeeks: 0.5, description: 'Dense mineral wool between joists and acoustic resilient isolation strips.' },
    { key: 'smart_lighting_circuits', label: 'Integrated Dimmable LED Spotlighting', costLow: 1200, costHigh: 2400, extraWeeks: 0.5, description: 'Fire-rated recessed warm white LED downlights with 2-way switching.' },
    { key: 'eaves_storage_access', label: 'Insulated Hatch Doors & Flooring to Eaves', costLow: 850, costHigh: 1800, extraWeeks: 0.5, description: 'Boarded low-level roof storage with draught-sealed insulated access doors.' },
  ],

  'garage-conversion': [
    { key: 'front_infill_masonry', label: 'Matching Brick Infill with Double Glazed Window', costLow: 2400, costHigh: 4200, extraWeeks: 1, description: 'Removing garage door and building matching cavity brickwork with window.' },
    { key: 'subfloor_insulation_dpc', label: 'Damp-Proof Membrane & Insulated Screed Floor', costLow: 1800, costHigh: 3400, extraWeeks: 0.5, description: 'Lifting cold garage slab to house floor level with 100mm PIR insulation.' },
    { key: 'partition_walls', label: 'Sound-Insulated Stud Partition Walls', costLow: 1400, costHigh: 2800, extraWeeks: 0.5, description: 'Creating dividing wall between home office and front storage area.' },
    { key: 'ensuite_wc_addition', label: 'Ground Floor WC or Shower Room Addition', costLow: 4500, costHigh: 8500, extraWeeks: 1, description: 'Small cloakroom toilet with electric shower and extract fan.' },
    { key: 'underfloor_heating', label: 'Electric / Water Underfloor Heating', costLow: 1600, costHigh: 3200, extraWeeks: 0.5, description: 'Even warmth embedded in screed, freeing up wall space for furniture.' },
    { key: 'bespoke_storage_joinery', label: 'Built-in Storage Cupboards & Utility Units', costLow: 2200, costHigh: 4500, extraWeeks: 0.5, description: 'Custom fitted floor-to-ceiling cabinets for coats, boots and tech.' },
    { key: 'consumer_unit_extension', label: 'Dedicated Electrical Sub-Panel / Fuse Box', costLow: 850, costHigh: 1600, extraWeeks: 0.5, description: 'Independent circuit protection with ample power sockets and USB outlets.' },
    { key: 'full_plaster_decorating', label: 'Smooth Plaster Skim & Full Decoration', costLow: 1400, costHigh: 2600, extraWeeks: 0.5, description: 'Full drylining, acoustic insulation, skimming and painted finish.' },
    { key: 'garden_door_installation', label: 'External Glazed Door into Rear Garden', costLow: 1600, costHigh: 2800, extraWeeks: 0.5, description: 'New side or rear doorway for direct garden access.' },
    { key: 'ethernet_data_cabling', label: 'Hardwired Cat6 Ethernet for Home Office Use', costLow: 650, costHigh: 1200, extraWeeks: 0.5, description: 'Reliable high-speed data connection straight to main broadband router.' },
  ],

  'garden-room': [
    { key: 'acoustic_soundproofing', label: 'Premium Acoustic Insulation Package', costLow: 1600, costHigh: 3200, extraWeeks: 0.5, description: 'High-density acoustic acoustic slabs and sound-bloc plasterboard.' },
    { key: 'air_con_climate_control', label: 'Year-Round Heating & Air Conditioning Split Unit', costLow: 2200, costHigh: 3600, extraWeeks: 0.5, description: 'Wall-mounted inverter heat pump for cool summers and warm winters.' },
    { key: 'composite_cladding', label: 'Maintenance-Free Cedar / Anthracite Composite Cladding', costLow: 2400, costHigh: 4800, extraWeeks: 0.5, description: 'Rot-proof, UV-stable exterior cladding requiring zero staining or painting.' },
    { key: 'slimline_sliding_doors', label: '3m+ Slimline Aluminum Sliding Glass Doors', costLow: 4200, costHigh: 7200, extraWeeks: 1, description: 'Floor-to-ceiling glass entrance doors with high security multi-point locks.' },
    { key: 'cat6_data_trench', label: 'Armoured Underground Power & Cat6 Data Cable', costLow: 1500, costHigh: 2800, extraWeeks: 0.5, description: 'Trenching supply from main house with consumer unit in studio.' },
    { key: 'wc_shower_pod', label: 'Internal WC, Sink & Shower Wetroom Addition', costLow: 5500, costHigh: 9500, extraWeeks: 1.5, description: 'Saniflo waste pump connection, vanity unit and instantaneous shower.' },
    { key: 'overhanging_canopy', label: 'Integrated External Soffit LED Downlighting Canopy', costLow: 950, costHigh: 1800, extraWeeks: 0.5, description: 'Front roof overhang providing weather shelter and ambient evening lighting.' },
    { key: 'timber_deck_veranda', label: 'Adjoining Composite Veranda / Decking Platform', costLow: 1800, costHigh: 3600, extraWeeks: 0.5, description: 'Matching front terrace connecting garden studio to garden pathway.' },
    { key: 'green_sedum_roof', label: 'Eco Sedum Living Green Roof System', costLow: 1800, costHigh: 3400, extraWeeks: 0.5, description: 'Flowering succulent roof blanket providing insulation and biodiversity.' },
    { key: 'full_decorating', label: 'Internal Skimming, Painting & Oak Laminate Flooring', costLow: 1600, costHigh: 3000, extraWeeks: 0.5, description: 'Complete interior residential finish with skirtings and flooring.' },
  ],

  driveway: [
    { key: 'resin_bound_surface', label: 'UV-Stable Resin-Bound Aggregate Surface', costLow: 2800, costHigh: 5400, extraWeeks: 0.5, description: 'Seamless, permeable, weed-resistant decorative stone resin surface.' },
    { key: 'block_paving_border', label: 'Contrasting Granite / Block Paving Edging', costLow: 1200, costHigh: 2400, extraWeeks: 0.5, description: 'Setts border providing crisp boundary definition and structural restraint.' },
    { key: 'aco_drainage_channel', label: 'Permeable Sub-Base & ACO Linear Drainage', costLow: 950, costHigh: 1800, extraWeeks: 0.5, description: 'SuDS-compliant drainage channels preventing surface water runoff.' },
    { key: 'dropped_kerb_prep', label: 'Council Dropped Kerb Specification Preparation', costLow: 1400, costHigh: 2800, extraWeeks: 0.5, description: 'Excavation and asphalt pavement crossing built to council highways standard.' },
    { key: 'ev_charging_point', label: '7kW Electric Vehicle (EV) Fast Charging Point', costLow: 950, costHigh: 1600, extraWeeks: 0.5, description: 'Dedicated wall or post-mounted Type 2 smart EV home charging unit.' },
    { key: 'retaining_wall_brickwork', label: 'Low Decorative Retaining Walls & Pillars', costLow: 1800, costHigh: 3800, extraWeeks: 0.5, description: 'Matching facing brickwork dwarf walls and copings along boundary.' },
    { key: 'integrated_ground_lights', label: 'Flush Integrated Driveway LED Uplighters', costLow: 850, costHigh: 1600, extraWeeks: 0.5, description: 'Drive-over stainless steel ground spotlights with dusk-to-dawn sensor.' },
    { key: 'security_post_bollards', label: 'Retractable Telescopic Security Bollards', costLow: 900, costHigh: 1800, extraWeeks: 0.5, description: 'Key-locked steel bollards providing anti-theft vehicle security.' },
    { key: 'permeable_soakaway', label: 'Heavy-Duty Stormwater Soakaway Crate System', costLow: 1200, costHigh: 2200, extraWeeks: 0.5, description: 'Underground cellular soakaway tanks handling high volume rainwater.' },
    { key: 'front_entrance_porch', label: 'Matching Entrance Threshold Steps', costLow: 800, costHigh: 1600, extraWeeks: 0.5, description: 'Bullnose paving steps matching driveway aggregate finish.' },
  ],

  landscaping: [
    { key: 'porcelain_patio_slabs', label: 'Non-Slip R11 Vitrified Porcelain Patio Slabs', costLow: 3500, costHigh: 7200, extraWeeks: 1, description: 'Frost-proof 20mm outdoor porcelain on solid wet mortar bed with primer.' },
    { key: 'hardwood_composite_decking', label: 'Raised Composite / Hardwood Sun Deck', costLow: 2800, costHigh: 5800, extraWeeks: 1, description: 'Treated timber frame with hidden clip fasteners and non-slip boards.' },
    { key: 'raised_rendered_planters', label: 'Rendered White Masonry Planters & Steps', costLow: 2200, costHigh: 4500, extraWeeks: 0.5, description: 'Built-in tiered planting beds with smooth silicone monocouche render.' },
    { key: 'premium_turfing', label: 'High-Grade Rolled Lawn Turf or Luxury AstroTurf', costLow: 1400, costHigh: 3200, extraWeeks: 0.5, description: 'Cultivated weed-free turf on rotovated and enriched topsoil.' },
    { key: 'garden_ambient_lighting', label: 'Low-Voltage Spike & Wall Ambient Lighting', costLow: 1200, costHigh: 2400, extraWeeks: 0.5, description: 'Warm white LED spotlights on trees, shrubs and boundary fencing.' },
    { key: 'timber_slat_fencing', label: 'Contemporary Horizontal Cedar Slat Fencing', costLow: 2400, costHigh: 4800, extraWeeks: 0.5, description: 'Modern slatted privacy panels with concrete slotted posts.' },
    { key: 'integrated_pergola', label: 'Aluminum Louvred or Timber Garden Pergola', costLow: 2500, costHigh: 5500, extraWeeks: 0.5, description: 'Shaded dining zone structure with optional opening roof louvres.' },
    { key: 'retaining_timber_sleepers', label: 'Treated Oak Retaining Sleeper Walls', costLow: 1400, costHigh: 2800, extraWeeks: 0.5, description: 'Heavyweight oak sleeper terrace walls and integrated steps.' },
    { key: 'outdoor_kitchen_prep', label: 'Gas, Water & Electrical Lines for BBQ Kitchen', costLow: 1800, costHigh: 3600, extraWeeks: 0.5, description: 'Underground service trench to garden dining zone.' },
    { key: 'automated_irrigation', label: 'Sub-Surface Micro-Drip Garden Irrigation', costLow: 850, costHigh: 1700, extraWeeks: 0.5, description: 'Automated timer drip watering line for flower beds and borders.' },
  ],

  other: [
    { key: 'structural_steel_rsj', label: 'Structural Steel Beams (RSJ) & Padstones', costLow: 3500, costHigh: 6500, extraWeeks: 1, description: 'Fabricated steel beams and engineering calculations.' },
    { key: 'loadbearing_wall_removal', label: 'Load-Bearing Internal Wall Knockthrough', costLow: 3200, costHigh: 5800, extraWeeks: 1, description: 'Careful masonry removal with acrow props and load transfer.' },
    { key: 'underpinning_foundations', label: 'Foundation Underpinning & Ground Remediation', costLow: 6500, costHigh: 14000, extraWeeks: 2, description: 'Sequential mass concrete underpinning bays inspected by structural engineer.' },
    { key: 'chimney_breast_removal', label: 'Chimney Breast Removal & Steel Support', costLow: 2400, costHigh: 4500, extraWeeks: 0.5, description: 'Removal of ground/first floor breast with gallow brackets in loft.' },
    { key: 'french_bifold_doors', label: 'Structural External Opening & Bifold Doors', costLow: 4500, costHigh: 7500, extraWeeks: 1, description: 'Creating new wider garden aperture with reinforced catnic lintel.' },
    { key: 'full_house_rewire', label: 'Electrical Consumer Unit & Rewiring Work', costLow: 4500, costHigh: 8500, extraWeeks: 1, description: 'NICEIC certified electrical upgrades and distribution.' },
    { key: 'central_heating_upgrade', label: 'High-Capacity Boiler / Megaflo Cylinder', costLow: 3800, costHigh: 6800, extraWeeks: 0.5, description: 'Gas Safe certified boiler replacement and high pressure cylinder.' },
    { key: 'full_plaster_skim', label: 'Professional Surface Plastering Throughout', costLow: 2400, costHigh: 4800, extraWeeks: 0.5, description: 'Smooth finish plaster over existing or new plasterboard.' },
    { key: 'underfloor_heating', label: 'Underfloor Heating Installation', costLow: 2200, costHigh: 4200, extraWeeks: 0.5, description: 'Zoned thermostat warm water underfloor heating system.' },
    { key: 'full_decorating', label: 'Full Interior Decorating & Painting', costLow: 1800, costHigh: 3600, extraWeeks: 0.5, description: 'Complete mist coat, emulsion and gloss/satin woodwork.' },
  ],
};

// Flat dictionary for global calculation lookup
export const ADDON_FEATURE_COSTS: Record<string, { label: string; costLow: number; costHigh: number; extraWeeks: number }> =
  Object.values(PROJECT_SPECIFIC_ADDONS).reduce((acc, list) => {
    list.forEach((item) => {
      acc[item.key] = {
        label: item.label,
        costLow: item.costLow,
        costHigh: item.costHigh,
        extraWeeks: item.extraWeeks,
      };
    });
    return acc;
  }, {} as Record<string, { label: string; costLow: number; costHigh: number; extraWeeks: number }>);
