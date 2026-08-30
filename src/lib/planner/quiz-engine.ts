/**
 * Dynamic Project Quiz Engine
 * Strictly enforces project type isolation and dynamic conditional branching.
 * Every question belongs to designated project_types.
 */

export type ProjectType =
  | 'bathroom'
  | 'kitchen'
  | 'extension'
  | 'loft'
  | 'garden'
  | 'driveway'
  | 'full-renovation'
  | 'other';

export interface QuizSubOption {
  id: string;
  label: string;
  desc?: string;
  icon?: string;
}

export interface QuizOption {
  id: string;
  label: string;
  desc?: string;
  icon?: string;
  subOptions?: QuizSubOption[];
}

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'dimension_input'
  | 'free_text'
  | 'property_and_postcode'
  | 'timeline_and_stage';

export interface QuizQuestion {
  id: string;
  projectTypes: (ProjectType | 'all')[];
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuizOption[];
  condition?: (answers: Record<string, any>) => boolean;
  placeholder?: string;
}

export const PROJECT_TYPE_OPTIONS: QuizOption[] = [
  { id: 'bathroom', label: 'Bathroom / Wetroom', desc: 'Family bathrooms, ensuites, walk-in wetrooms & cloakrooms', icon: '🛁' },
  { id: 'kitchen', label: 'Kitchen & Knockthrough', desc: 'New kitchen cabinetry, worktops, islands & wall knockthroughs', icon: '🍳' },
  { id: 'extension', label: 'House Extension', desc: 'Single or double storey rear, side return, or wraparound extensions', icon: '🏗️' },
  { id: 'loft', label: 'Loft Conversion', desc: 'Rear dormer, mansard, hip-to-gable, or Velux master suites', icon: '📐' },
  { id: 'garden', label: 'Garden & Landscaping', desc: 'Porcelain patios, composite decking, garden studios & landscaping', icon: '🌿' },
  { id: 'driveway', label: 'Driveway & Entrance', desc: 'Resin-bound, block paving, tarmac & dropped kerbs', icon: '🛣️' },
  { id: 'full-renovation', label: 'Full House Renovation', desc: 'Complete property modernisation, layout alterations & turnkey fit-out', icon: '🏡' },
  { id: 'other', label: 'Structural / Other', desc: 'Wall knockthroughs, RSJ steel beams, garage conversions & repairs', icon: '🔨' },
];

/**
 * Master catalog of all tagged questions.
 * Strictly filtered by active projectType so irrelevant questions NEVER appear.
 */
export const MASTER_QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // 1. BATHROOM QUESTIONS (projectTypes: ['bathroom'])
  // =========================================================================
  {
    id: 'bathroom_scope',
    projectTypes: ['bathroom'],
    title: 'What are you looking to do with your bathroom?',
    subtitle: 'Select the primary scope of your bathroom project.',
    type: 'single_choice',
    options: [
      { id: 'full_renovation', label: 'Full bathroom renovation', desc: 'Strip out existing suite, replumb, tile & fit new bathroom', icon: '🛁' },
      { id: 'replace_elements', label: 'Replace a few key fixtures', desc: 'Update specific items (e.g. shower, vanity, toilet, or tiles)', icon: '🚿' },
      { id: 'create_new_bathroom', label: 'Create an entirely new bathroom', desc: 'Converting a cupboard, under-stairs space, or part of a bedroom', icon: '✨' },
      { id: 'not_sure', label: 'Not sure yet / Need guidance', desc: 'Explore layout possibilities and indicative costs with our team', icon: '💡' },
    ],
  },
  {
    id: 'bathroom_features',
    projectTypes: ['bathroom'],
    title: 'What fixtures & items would you like included?',
    subtitle: 'Select all features you want in your new bathroom space.',
    type: 'multiple_choice',
    options: [
      {
        id: 'walkin_shower',
        label: 'Walk-in rainfall shower',
        desc: 'Floor-level wetroom tray with frameless glass screen',
        subOptions: [
          { id: 'shower_walkin_wetroom', label: 'Walk-in Wetroom with Fluted/Clear Glass' },
          { id: 'shower_rainfall_ceiling', label: 'Ceiling-Mounted Rainfall Shower Head' },
          { id: 'shower_concealed_valve', label: 'Concealed Thermostatic Valve & Handset' },
          { id: 'shower_sliding_enclosure', label: 'Frameless Sliding Shower Enclosure' },
          { id: 'shower_other', label: 'Other / Custom Shower' },
        ],
      },
      {
        id: 'freestanding_bath',
        label: 'Freestanding feature bathtub',
        desc: 'Statement stone or acrylic bath with floor-mounted mixer tap',
        subOptions: [
          { id: 'bath_freestanding_stone', label: 'Freestanding Stone / Acrylic Statement Bath' },
          { id: 'bath_floor_mounted_tap', label: 'Floor-Mounted Standpipe Mixer Tap' },
          { id: 'bath_shower_combo', label: 'Standard Fitted Bath with Shower & Screen Over' },
          { id: 'bath_double_ended', label: 'Deep Double-Ended Acrylic Bath' },
          { id: 'bath_other', label: 'Other / Custom Bath' },
        ],
      },
      {
        id: 'standard_bath',
        label: 'Standard bath with shower over',
        desc: 'Space-saving family bath with glass shower screen',
        subOptions: [
          { id: 'bath_standard_acrylic', label: 'Reinforced Acrylic Bath with Glass Screen' },
          { id: 'bath_shower_over_valve', label: 'Thermostatic Shower Mixer over Bath' },
          { id: 'bath_other', label: 'Other / Custom Bath' },
        ],
      },
      {
        id: 'toilet',
        label: 'Toilet with concealed cistern',
        desc: 'Wall-hung or back-to-wall pan with hidden frame & flush plate',
        subOptions: [
          { id: 'toilet_wall_hung', label: 'Wall-Hung Pan with Concealed Cistern Frame' },
          { id: 'toilet_back_to_wall', label: 'Back-to-Wall Pan with Fitted Furniture Unit' },
          { id: 'toilet_smart_bidet', label: 'Japanese Smart Heated Bidet Toilet' },
          { id: 'toilet_black_flush_plate', label: 'Designer Flush Plate (Matt Black / Brass)' },
          { id: 'toilet_other', label: 'Other / Custom Toilet' },
        ],
      },
      {
        id: 'vanity_sink',
        label: 'Vanity unit with sink & drawers',
        desc: 'Wall-mounted or floorstanding vanity with soft-close storage',
        subOptions: [
          { id: 'vanity_wall_hung_drawers', label: 'Wall-Hung Vanity with Soft-Close Drawers' },
          { id: 'vanity_double_twin', label: 'Double / Twin Basin Vanity Unit' },
          { id: 'vanity_countertop_bowl', label: 'Countertop Stone / Ceramic Bowl Basin' },
          { id: 'vanity_brass_black_tap', label: 'Brushed Brass / Matt Black Monobloc Tap' },
          { id: 'vanity_other', label: 'Other / Custom Vanity' },
        ],
      },
      {
        id: 'full_tiling',
        label: 'Floor-to-ceiling wall & floor tiling',
        desc: 'High-durability porcelain or ceramic tiling with waterproof tanking',
        subOptions: [
          { id: 'tiling_full_porcelain', label: 'Floor-to-Ceiling Italian Porcelain Tiling' },
          { id: 'tiling_herringbone_metro', label: 'Herringbone Metro Tiles with Contrast Grout' },
          { id: 'tiling_feature_fluted', label: 'Feature Textured / Fluted Accent Wall' },
          { id: 'tiling_waterproof_tanking', label: 'Full Waterproof Tanking Membrane in Wet Zones' },
          { id: 'tiling_other', label: 'Other / Custom Tiling' },
        ],
      },
      {
        id: 'underfloor_heating',
        label: 'Electric underfloor heating mat',
        desc: 'Warm floor matting under bathroom tiles with digital thermostat',
        subOptions: [
          { id: 'heating_electric_ufh', label: 'Electric Underfloor Warm Floor Cable Mat' },
          { id: 'heating_touchscreen_thermostat', label: 'Smart WiFi / Touchscreen Digital Thermostat' },
          { id: 'heating_other', label: 'Other / Custom Underfloor Heating' },
        ],
      },
      {
        id: 'towel_rail',
        label: 'Designer heated towel rail',
        desc: 'Dual-fuel heated ladder towel radiator',
        subOptions: [
          { id: 'heating_dual_fuel_rail', label: 'Designer Dual-Fuel Heated Towel Rail' },
          { id: 'heating_matt_black_rail', label: 'Contemporary Matt Black / Brass Heated Rail' },
          { id: 'heating_rail_other', label: 'Other / Custom Towel Rail' },
        ],
      },
      {
        id: 'lighting_extractor',
        label: 'LED spotlights & quiet extractor fan',
        desc: 'Waterproof IP65 ceiling downlights & quiet inline ventilation',
        subOptions: [
          { id: 'light_ip65_led_spots', label: 'IP65 Fire-Rated Warm LED Downlights' },
          { id: 'light_extractor_inline', label: 'High-Power Quiet Inline Loft Extractor Fan' },
          { id: 'light_mirror_cabinet_led', label: 'Anti-Fog Demister Illuminated Mirror Cabinet' },
          { id: 'light_shower_niche_led', label: 'Recessed Waterproof LED Shower Shampoo Niche' },
          { id: 'light_other', label: 'Other / Custom Lighting & Extraction' },
        ],
      },
      {
        id: 'built_in_storage',
        label: 'Built-in wall niches or cabinets',
        desc: 'Illuminated shampoo recess niches or bespoke mirror cabinets',
        subOptions: [
          { id: 'storage_shower_niche', label: 'Recessed Tiled Wall Shower Niche' },
          { id: 'storage_recessed_cabinet', label: 'Recessed Mirrored Wall Cabinet' },
          { id: 'storage_other', label: 'Other / Custom Storage' },
        ],
      },
      {
        id: 'other_bathroom_feature',
        label: 'Other / Custom Feature',
        desc: 'Any other bespoke bathroom additions or specific fixtures',
      },
    ],
  },
  {
    id: 'bathroom_layout_change',
    projectTypes: ['bathroom'],
    title: 'Are you changing the bathroom layout?',
    subtitle: 'Keeping fixtures in their existing positions reduces plumbing alterations.',
    type: 'single_choice',
    options: [
      { id: 'keep_same', label: 'Keep layout the same', desc: 'New fittings stay in existing plumbing locations', icon: '🔄' },
      { id: 'change_layout', label: 'Yes, changing the layout', desc: 'Moving toilet, shower, bath or vanity to new positions', icon: '📐' },
      { id: 'not_sure', label: 'Not sure / Want advice on best layout', desc: 'Our architectural team will recommend the optimal layout', icon: '❓' },
    ],
  },
  {
    id: 'bathroom_moved_fixtures',
    projectTypes: ['bathroom'],
    title: 'Which fixtures are you planning to move?',
    subtitle: 'Moving waste pipes and soil stacks requires specific plumbing routes.',
    type: 'multiple_choice',
    condition: (answers) => answers.bathroom_layout_change === 'change_layout',
    options: [
      { id: 'move_toilet', label: 'Moving the toilet / soil pipe', desc: 'Extending or rerouting the 110mm main soil waste stack', icon: '🚻' },
      { id: 'move_shower_bath', label: 'Moving the shower or bath', desc: 'Altering hot/cold water feeds and gravity shower waste lines', icon: '🚿' },
      { id: 'move_sink', label: 'Moving the sink / basin', desc: 'Extending copper feeds and waste connection', icon: '🚰' },
      { id: 'complete_reconfig', label: 'Complete whole-room reconfiguration', desc: 'Stripping back to subfloor and installing all new plumbing routes', icon: '🏗️' },
    ],
  },
  {
    id: 'bathroom_size',
    projectTypes: ['bathroom'],
    title: 'Roughly how big is the bathroom?',
    subtitle: 'Choose a standard room size or enter approximate measurements.',
    type: 'dimension_input',
    options: [
      { id: 'small', label: 'Compact / Ensuite', desc: 'Approx. 1.5m × 2.0m (3 m²)', icon: '📐' },
      { id: 'medium', label: 'Standard Family Bathroom', desc: 'Approx. 2.0m × 2.5m (5 m²)', icon: '🛁' },
      { id: 'large', label: 'Spacious Master Bathroom', desc: 'Approx. 3.0m × 3.0m+ (9 m²+)', icon: '✨' },
      { id: 'exact', label: 'I know the measurements', desc: 'Enter length and width in meters', icon: '📏' },
      { id: 'not_sure', label: "I'm not sure", desc: 'We will assume standard 5m² family bathroom', icon: '❓' },
    ],
  },
  {
    id: 'bathroom_finish',
    projectTypes: ['bathroom'],
    title: 'What level of finish are you looking for?',
    subtitle: 'This determines the quality of sanitaryware, brassware, and tiling materials.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Recognized UK trade brands, chrome fittings & clean ceramic tiling', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Italian porcelain, brushed brass/black Hansgrohe fittings, walk-in wetroom', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Imported bookmatched marble, bespoke vanity joinery & digital shower controls', icon: '💎' },
    ],
  },
  {
    id: 'bathroom_notes',
    projectTypes: ['bathroom'],
    title: "Anything else you'd like us to know about your bathroom?",
    subtitle: 'Add any specific wishes, preferred brands, or storage ideas.',
    type: 'free_text',
    placeholder: "e.g. I'd like a walk-in shower instead of the bath, niche lighting in the shower wall, and good storage for towels...",
  },

  // =========================================================================
  // 2. KITCHEN QUESTIONS (projectTypes: ['kitchen'])
  // =========================================================================
  {
    id: 'kitchen_scope',
    projectTypes: ['kitchen'],
    title: 'What are you looking to do with your kitchen?',
    subtitle: 'Select the primary scope of your kitchen project.',
    type: 'single_choice',
    options: [
      { id: 'full_renovation', label: 'Full kitchen renovation', desc: 'Complete strip out, new cabinetry, solid worktops & appliances', icon: '🍳' },
      { id: 'open_plan_knockthrough', label: 'Kitchen knockthrough into dining room', desc: 'Removing wall to create an open-plan kitchen living space + new kitchen', icon: '🏗️' },
      { id: 'reface_upgrade', label: 'Upgrade units & worktops', desc: 'New worktops, sink, and cabinetry in existing layout', icon: '✨' },
      { id: 'not_sure', label: 'Not sure yet', desc: 'Explore kitchen design possibilities and budget tiers', icon: '💡' },
    ],
  },
  {
    id: 'kitchen_wall_removal',
    projectTypes: ['kitchen'],
    title: 'Are you planning to remove or move any walls?',
    subtitle: 'Removing dividing walls creates spacious open-plan kitchen dining areas.',
    type: 'single_choice',
    options: [
      { id: 'remove_wall', label: 'Yes, remove wall between kitchen & diner', desc: 'Opening up kitchen into dining or living room', icon: '🔨' },
      { id: 'no_walls', label: 'No, keep existing room walls as they are', desc: 'Kitchen remains in its current separate room footprint', icon: '🧱' },
      { id: 'not_sure', label: 'Not sure if the wall is load-bearing', desc: 'Our structural engineer will assess the wall and advise', icon: '❓' },
    ],
  },
  {
    id: 'kitchen_flush_steel',
    projectTypes: ['kitchen'],
    title: 'Do you want a hidden flush-ceiling steel beam (RSJ)?',
    subtitle: 'A flush beam creates a flat, uninterrupted ceiling without a visible downstand bulkhead.',
    type: 'single_choice',
    condition: (answers) => answers.kitchen_wall_removal === 'remove_wall',
    options: [
      { id: 'flush_steel', label: 'Yes, hidden flush ceiling beam', desc: 'Steel beam slotted into joists for a flat seamless ceiling', icon: '📏' },
      { id: 'standard_rsj', label: 'Standard steel beam below ceiling is fine', desc: 'Cost-effective structural steel with plasterboard bulkhead', icon: '🏗️' },
      { id: 'not_sure', label: 'Not sure / Need builder recommendation', desc: 'We will inspect joist directions and advise on site', icon: '❓' },
    ],
  },
  {
    id: 'kitchen_features',
    projectTypes: ['kitchen'],
    title: 'What key features would you like in your kitchen?',
    subtitle: 'Select all cabinetry, worktop, and specialist features to include.',
    type: 'multiple_choice',
    options: [
      {
        id: 'worktops',
        label: 'Solid Worktops & Splashbacks',
        desc: 'Laser-templated 20mm/30mm durable solid stone surfaces',
        icon: '💎',
        subOptions: [
          { id: 'worktop_quartz_30mm', label: '30mm Solid Quartz (Calacatta / Marble Look)' },
          { id: 'worktop_granite_natural', label: 'Natural Granite Worktops' },
          { id: 'worktop_dekton_porcelain', label: 'Dekton / Ultra-Compact Porcelain Surface' },
          { id: 'worktop_solid_oak', label: 'Solid Oak / Hardwood Timber Worktop' },
          { id: 'worktop_full_splashback', label: 'Full-Height Matching Stone Splashback' },
          { id: 'worktop_other', label: 'Other / Custom Worktop' },
        ],
      },
      {
        id: 'sink_and_taps',
        label: 'Kitchen Sink & Designer Taps',
        desc: 'Undermount sinks, boiling water taps & pull-out sprays',
        icon: '🚰',
        subOptions: [
          { id: 'sink_quooker_boiling_tap', label: 'Quooker / 100°C Instant Boiling Water Tap' },
          { id: 'sink_undermount_stone', label: 'Undermount Composite / Stainless Sink' },
          { id: 'sink_belfast_ceramic', label: 'Traditional Belfast / Butler Ceramic Sink' },
          { id: 'sink_pullout_spray_tap', label: 'Pull-Out Flexible Spray Tap (Brass / Black / Chrome)' },
          { id: 'sink_waste_disposal', label: 'Insinkerator Waste Disposal Unit' },
          { id: 'sink_other', label: 'Other / Custom Sink or Tap' },
        ],
      },
      {
        id: 'flooring',
        label: 'Kitchen & Dining Flooring',
        desc: 'High-traffic durable flooring matching the living space',
        icon: '🪵',
        subOptions: [
          { id: 'floor_engineered_oak', label: 'Engineered Oak Hardwood (Plank or Herringbone)' },
          { id: 'floor_porcelain_tiles', label: 'Large-Format Porcelain Floor Tiles (60×60 / 120×60)' },
          { id: 'floor_lvt_amtico', label: 'Luxury Vinyl Tile (Amtico / Karndean LVT)' },
          { id: 'floor_polished_concrete', label: 'Polished Concrete / Microcement Screed' },
          { id: 'floor_other', label: 'Other / Custom Flooring' },
        ],
      },
      {
        id: 'windows_doors',
        label: 'Windows, Glazing & Patio Doors',
        desc: 'Bi-fold doors, kitchen window above sink & skylights',
        icon: '🪟',
        subOptions: [
          { id: 'doors_bifold_3m', label: '3m Aluminium Bi-Fold Doors (Flush Threshold)' },
          { id: 'doors_bifold_5m', label: '5m Panoramic Multi-Panel Bi-Fold Doors' },
          { id: 'doors_slim_sliding', label: 'Ultra-Slimline Sliding Glass Doors (20mm)' },
          { id: 'doors_crittall_steel', label: 'Crittall / Steel-Look Heritage French Doors' },
          { id: 'window_above_sink', label: 'New Kitchen Window above Sink' },
          { id: 'roof_flat_skylight', label: 'Frameless Flat Glass Rooflight' },
          { id: 'doors_other', label: 'Other / Custom Glazing' },
        ],
      },
      {
        id: 'kitchen_island',
        label: 'Central Kitchen Island',
        desc: 'Feature multi-cabinet island with breakfast bar seating',
        icon: '🍳',
        subOptions: [
          { id: 'island_breakfast_bar', label: 'Breakfast Bar Seating Overhang' },
          { id: 'island_waterfall_edge', label: 'Mitred Waterfall Quartz Ends' },
          { id: 'island_induction_hob', label: 'Induction Hob with Downdraft on Island' },
          { id: 'island_prep_sink', label: 'Secondary Island Prep Sink & Boiling Tap' },
          { id: 'island_wine_cooler', label: 'Integrated Dual-Zone Wine Cooler Recess' },
          { id: 'island_other', label: 'Other / Custom Island' },
        ],
      },
      {
        id: 'integrated_appliances',
        label: 'Integrated Appliance Package',
        desc: 'Pyrolytic oven, induction hob, integrated dishwasher & fridge',
        icon: '⚡',
        subOptions: [
          { id: 'appliance_induction_downdraft', label: 'Induction Hob with Integrated Downdraft Extractor' },
          { id: 'appliance_twin_ovens', label: 'Twin Eye-Level Pyrolytic Ovens / Combi-Microwave' },
          { id: 'appliance_dishwasher_quiet', label: 'Fully Integrated Quiet Dishwasher' },
          { id: 'appliance_fridge_freezer', label: 'Integrated 70/30 Fridge Freezer / American Style' },
          { id: 'appliance_coffee_machine', label: 'Built-in Bean-to-Cup Coffee Machine' },
          { id: 'appliance_other', label: 'Other / Custom Appliances' },
        ],
      },
      {
        id: 'cabinetry_storage',
        label: 'Cabinetry Style & Pantries',
        desc: 'Modern Shaker or Handleless units with larder pantries',
        icon: '📦',
        subOptions: [
          { id: 'cabinet_modern_shaker', label: 'Modern Shaker Painted Cabinetry' },
          { id: 'cabinet_handleless_flat', label: 'Handleless J-Pull Contemporary Flat Units' },
          { id: 'cabinet_larder_pantry', label: 'Double-Door Floor-to-Ceiling Larder Pantry' },
          { id: 'cabinet_corner_pullouts', label: 'Corner Carousel / LeMans Magic Pullouts' },
          { id: 'cabinet_integrated_bins', label: 'Concealed Pullout Multi-Compartment Bins' },
          { id: 'cabinet_other', label: 'Other / Custom Cabinetry' },
        ],
      },
      {
        id: 'heating',
        label: 'Underfloor Heating & Radiators',
        desc: 'Warm floor system with digital zoning eliminating radiators',
        icon: '♨️',
        subOptions: [
          { id: 'heat_water_ufh', label: 'Water (Hydronic) Underfloor Heating in Screed' },
          { id: 'heat_electric_ufh', label: 'Electric Underfloor Heating Mat under Tiles' },
          { id: 'heat_vertical_radiator', label: 'Contemporary High-Output Vertical Radiators' },
          { id: 'heat_other', label: 'Other / Custom Heating' },
        ],
      },
      {
        id: 'lighting_electrical',
        label: 'Lighting & Power Points',
        desc: 'Dimmable spotlights, island pendants & pop-up sockets',
        icon: '💡',
        subOptions: [
          { id: 'light_led_downlights', label: 'Fire-Rated Dimmable Ceiling LED Downlights' },
          { id: 'light_undercabinet_strips', label: 'Concealed Under-Cabinet Warm LED Task Strips' },
          { id: 'light_island_pendants', label: 'Feature Pendant Lighting Drops over Island' },
          { id: 'light_popup_sockets', label: 'Flush Worktop Pop-Up Power & USB Points' },
          { id: 'light_other', label: 'Other / Custom Lighting' },
        ],
      },
      {
        id: 'utility_room',
        label: 'Dedicated Utility Room',
        desc: 'Separate cabinetry housing washing machine, dryer and sink',
        icon: '🧺',
        subOptions: [
          { id: 'utility_washer_dryer_stack', label: 'Stacked Washing Machine & Dryer Housing' },
          { id: 'utility_belfast_sink', label: 'Deep Utility Belfast Sink & Storage' },
          { id: 'utility_boot_bench', label: 'Boot Bench with Shoe Storage & Coat Hooks' },
          { id: 'utility_other', label: 'Other / Custom Utility' },
        ],
      },
    ],
  },
  {
    id: 'kitchen_size',
    projectTypes: ['kitchen'],
    title: 'Roughly how big is the kitchen space?',
    subtitle: 'Choose an approximate size or enter measurements in meters.',
    type: 'dimension_input',
    options: [
      { id: 'small', label: 'Compact Kitchen', desc: 'Under 12 m² (approx. 3m × 3.5m)', icon: '📐' },
      { id: 'medium', label: 'Standard Kitchen / Diner', desc: 'Approx. 15–22 m² (approx. 4m × 5m)', icon: '🍳' },
      { id: 'large', label: 'Large Open-Plan Kitchen Living', desc: 'Approx. 25–40 m² (approx. 5m × 7m)', icon: '✨' },
      { id: 'expansive', label: 'Expansive Kitchen Zone', desc: '40 m²+ (Large wraparound or open-plan ground floor)', icon: '🏡' },
      { id: 'exact', label: 'I know the measurements', desc: 'Enter length and width in meters', icon: '📏' },
      { id: 'not_sure', label: "I'm not sure", desc: 'We will assume standard 20m² kitchen diner', icon: '❓' },
    ],
  },
  {
    id: 'kitchen_finish',
    projectTypes: ['kitchen'],
    title: 'What level of finish are you looking for?',
    subtitle: 'This calibrates cabinetry craftsmanship, worktop materials, and appliance brands.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Solid UK trade cabinetry, durable quartz or laminate, Bosch/Neff appliances', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Bespoke painted cabinetry, 30mm Quartz waterfall island, Miele appliances, oak/porcelain flooring', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Handmade in-frame timber cabinetry, imported marble, bespoke brassware & integrated wine cellar', icon: '💎' },
    ],
  },
  {
    id: 'kitchen_notes',
    projectTypes: ['kitchen'],
    title: "Anything else you'd like us to know about your kitchen ideas?",
    subtitle: 'Mention any specific appliance brands, larder units, or layout ideas.',
    type: 'free_text',
    placeholder: "e.g. We want an island with an induction hob with built-in extractor, double larder cupboard, and warm timber shelving...",
  },

  // =========================================================================
  // 3. EXTENSION QUESTIONS (projectTypes: ['extension'])
  // =========================================================================
  {
    id: 'extension_type',
    projectTypes: ['extension'],
    title: 'What type of extension are you planning?',
    subtitle: 'Select the architectural format of your proposed extension.',
    type: 'single_choice',
    options: [
      { id: 'rear_single', label: 'Single-storey rear extension', desc: 'Extending out 3m to 6m into the rear garden', icon: '🏗️' },
      { id: 'side_return', label: 'Side return extension', desc: 'Infilling the unused side alley of a Victorian or Edwardian terrace', icon: '📐' },
      { id: 'wraparound', label: 'Wraparound extension (Side + Rear)', desc: 'Maximising ground floor area by combining rear and side extensions', icon: '✨' },
      { id: 'double_storey', label: 'Double-storey extension', desc: 'Ground floor living space plus additional 1st-floor bedrooms & bathrooms', icon: '🏢' },
      { id: 'not_sure', label: 'Not sure which is best for our plot', desc: 'Our architect will review your boundary and advise on feasibility', icon: '💡' },
    ],
  },
  {
    id: 'extension_rooms',
    projectTypes: ['extension'],
    title: 'What new spaces will be inside the extension?',
    subtitle: 'Select all rooms and zones being created or enlarged.',
    type: 'multiple_choice',
    options: [
      { id: 'open_plan_kitchen', label: 'Open-plan kitchen, dining & living space', desc: 'Bright family living hub with garden views', icon: '🍳' },
      { id: 'utility_room', label: 'Dedicated utility / laundry boot room', desc: 'Separate room housing washing machine, boiler & sink', icon: '🧺' },
      { id: 'downstairs_wc', label: 'Downstairs guest WC / cloakroom', desc: 'Convenient ground floor toilet & vanity', icon: '🚻' },
      { id: 'home_office', label: 'Home office / study zone', desc: 'Dedicated quiet workspace overlooking garden', icon: '💻' },
      { id: 'playroom_snug', label: 'Playroom or cosy TV snug', desc: 'Separate living zone for children or evening relaxation', icon: '🛋️' },
      { id: 'extra_bedrooms', label: 'Extra 1st-floor bedrooms & bathroom', desc: 'For double storey extensions adding master suite or bedrooms upstairs', icon: '🛏️' },
    ],
  },
  {
    id: 'extension_glazing',
    projectTypes: ['extension'],
    title: 'What doors would you like opening into the garden?',
    subtitle: 'Select your preferred patio glazing system.',
    type: 'single_choice',
    options: [
      { id: 'bifold_doors_3m', label: '3m Aluminium Bi-Fold Doors', desc: '3-panel folding doors with ultra-low flush garden threshold', icon: '🚪' },
      { id: 'bifold_doors_5m', label: '5m Panoramic Bi-Fold Doors', desc: 'Full-width multi-panel glass wall opening completely to patio', icon: '✨' },
      { id: 'slim_sliding_doors', label: 'Ultra-Slimline Sliding Glass Doors', desc: 'Minimalist 20mm sightlines with oversized floor-to-ceiling glass', icon: '🪟' },
      { id: 'crittall_doors', label: 'Crittall / Steel-Look Heritage Doors', desc: 'Black acoustic aluminium French doors with industrial glazing bars', icon: '🖤' },
      { id: 'standard_french', label: 'Standard French Doors & Windows', desc: 'Classic double glazed patio doors with side view panels', icon: '🪟' },
    ],
  },
  {
    id: 'extension_rooflights',
    projectTypes: ['extension'],
    title: 'Would you like rooflights in the extension ceiling?',
    subtitle: 'Rooflights bring daylight deep into the centre of your home.',
    type: 'single_choice',
    options: [
      { id: 'flat_skylight', label: 'Frameless Flat Glass Rooflights', desc: 'Clean architectural solar-control glass on insulated kerbs', icon: '☀️' },
      { id: 'roof_lantern', label: 'Architectural Aluminium Roof Lantern', desc: 'High-pitch pyramid glass lantern creating a dramatic central feature', icon: '💎' },
      { id: 'pitched_velux', label: 'Pitched roof with Velux roof windows', desc: 'Sloped tiled roof with solar-powered opening Velux windows', icon: '🌤️' },
      { id: 'solid_roof', label: 'Solid insulated roof (No rooflights)', desc: 'Standard insulated ceiling with spotlighting only', icon: '🏠' },
    ],
  },
  {
    id: 'extension_knockthrough',
    projectTypes: ['extension'],
    title: 'Are you knocking through existing walls into the house?',
    subtitle: 'Structural knockthroughs require temporary propping and RSJ steel beams.',
    type: 'single_choice',
    options: [
      { id: 'full_knockthrough', label: 'Yes, full open knockthrough with RSJ steels', desc: 'Removing existing rear wall to create one continuous open space', icon: '🔨' },
      { id: 'partial_opening', label: 'Partial opening (Keeping some walls/doors)', desc: 'Creating a widened opening or double door connection', icon: '🚪' },
      { id: 'not_sure', label: 'Not sure / Need builder advice', desc: 'Our structural engineer will review drawings and advise', icon: '❓' },
    ],
  },
  {
    id: 'extension_patio_connection',
    projectTypes: ['extension'],
    title: 'Will you be adding a flush outdoor patio or cladding?',
    subtitle: 'Connecting the interior floor to an outdoor porcelain patio creates seamless living.',
    type: 'multiple_choice',
    options: [
      { id: 'flush_porcelain_patio', label: 'Flush porcelain patio (matching floor level)', desc: '20mm non-slip vitrified porcelain tiles laid flush with bifold track', icon: '🪴' },
      { id: 'k_rend_render', label: 'Silicone weatherproof render (K-Rend / Weber)', desc: 'Crisp through-coloured exterior render on extension facade', icon: '🏠' },
      { id: 'cedar_timber_cladding', label: 'Western Red Cedar / Composite slatted cladding', desc: 'Contemporary exterior slatted architectural timber cladding', icon: '🪵' },
      { id: 'wet_underfloor_heating', label: 'Water (Hydronic) underfloor heating throughout', desc: 'Piped warm water heating in subfloor screed', icon: '♨️' },
    ],
  },
  {
    id: 'extension_size',
    projectTypes: ['extension'],
    title: 'Roughly what size extension are you planning?',
    subtitle: 'Choose an approximate size or specify measurements in meters.',
    type: 'dimension_input',
    options: [
      { id: 'compact', label: 'Compact Extension', desc: 'Approx. 3.0m × 4.0m (12 m²)', icon: '📐' },
      { id: 'standard', label: 'Standard Rear Extension', desc: 'Approx. 4.0m × 6.0m (24 m²)', icon: '🏗️' },
      { id: 'large', label: 'Large Rear / Wraparound', desc: 'Approx. 5.0m × 7.0m (35 m²)', icon: '✨' },
      { id: 'double', label: 'Double Storey Extension', desc: 'Approx. 50–80 m² total across 2 floors', icon: '🏢' },
      { id: 'exact', label: 'I know the measurements', desc: 'Enter length and width in meters', icon: '📏' },
      { id: 'not_sure', label: "I'm not sure", desc: 'We will assume standard 24m² rear extension', icon: '❓' },
    ],
  },
  {
    id: 'extension_finish',
    projectTypes: ['extension'],
    title: 'What level of finish are you looking for?',
    subtitle: 'This determines the quality of flooring, fixtures, and interior joinery.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Quality recognized UK brands, engineered flooring, clean white paint finish', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Engineered oak flooring, 30mm Quartz worktops, Hansgrohe brassware, flush patio', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Imported stone, bespoke architectural joinery, Crittall glass, smart scene lighting', icon: '💎' },
    ],
  },
  {
    id: 'extension_notes',
    projectTypes: ['extension'],
    title: "Anything else you'd like us to know about your extension?",
    subtitle: 'Add any specific ideas, drainage notes, or garden requirements.',
    type: 'free_text',
    placeholder: "e.g. We want an open-plan kitchen diner with 4m bifold doors, flush porcelain patio outside, and underfloor heating throughout...",
  },

  // =========================================================================
  // 4. LOFT CONVERSION QUESTIONS (projectTypes: ['loft'])
  // =========================================================================
  {
    id: 'loft_type',
    projectTypes: ['loft'],
    title: 'What type of loft conversion are you planning?',
    subtitle: 'Dormers maximise head height while Velux conversions preserve roof slope.',
    type: 'single_choice',
    options: [
      { id: 'rear_dormer', label: 'Rear flat-roof dormer (Most Popular)', desc: 'Maximises internal head height and floor space across the roof', icon: '📐' },
      { id: 'hip_to_gable', label: 'Hip-to-gable dormer', desc: 'Extends sloping hipped roof to a vertical gable for semi-detached houses', icon: '🏠' },
      { id: 'mansard', label: 'Mansard conversion', desc: 'Architectural 72-degree rear roof pitch (common in London terraces)', icon: '🏛️' },
      { id: 'velux_only', label: 'Velux rooflight conversion', desc: 'Preserves existing roof shape, installing top-hung roof windows', icon: '🌤️' },
      { id: 'not_sure', label: 'Not sure which roof type my house has', desc: 'Our team will review your roof structure and advise', icon: '💡' },
    ],
  },
  {
    id: 'loft_rooms',
    projectTypes: ['loft'],
    title: 'What rooms are you creating in the loft?',
    subtitle: 'Select all spaces you want to fit in the new loft level.',
    type: 'multiple_choice',
    options: [
      { id: 'master_bedroom', label: 'Master bedroom suite', desc: 'Spacious double bedroom with fitted wardrobes', icon: '🛏️' },
      { id: 'ensuite_shower', label: 'Ensuite shower room & toilet', desc: 'Compact luxury ensuite with walk-in shower, basin & toilet', icon: '🚿' },
      { id: 'dressing_room', label: 'Walk-in dressing room / Wardrobes', desc: 'Dedicated eaves storage or fitted wardrobe dressing area', icon: '👔' },
      { id: 'home_office', label: 'Quiet home office / study', desc: 'Dedicated workspace with high natural daylight', icon: '💻' },
      { id: 'two_bedrooms', label: 'Two separate bedrooms & bathroom', desc: 'Divided floorplan creating 2 kids/guest rooms & shared bath', icon: '🚪' },
    ],
  },
  {
    id: 'loft_glazing',
    projectTypes: ['loft'],
    title: 'What windows and balcony features would you like?',
    subtitle: 'Select glazing options for the dormer and front roof pitch.',
    type: 'multiple_choice',
    options: [
      { id: 'french_juliette', label: 'French doors with Juliette glass balcony', desc: 'Floor-to-ceiling opening doors with clear glass safety barrier', icon: '🚪' },
      { id: 'velux_skylights', label: 'Velux solar-powered roof windows', desc: 'Opening rooflights on front pitch with acoustic rain sensors', icon: '🌤️' },
      { id: 'dormer_windows', label: 'Standard casement / sash dormer windows', desc: 'Double glazed energy-rated windows matching existing house', icon: '🪟' },
    ],
  },
  {
    id: 'loft_stairs',
    projectTypes: ['loft'],
    title: 'Where will the new staircase be positioned?',
    subtitle: 'Building Regulations require permanent staircase access with 2m headroom.',
    type: 'single_choice',
    options: [
      { id: 'above_existing', label: 'Directly above existing main staircase', desc: 'Standard configuration retaining all 1st floor bedrooms', icon: '🪜' },
      { id: 'reconfigure_bedroom', label: 'Taking a section of a 1st-floor bedroom', desc: 'Required when hallway width is too tight for direct staircase rise', icon: '🚪' },
      { id: 'not_sure', label: 'Not sure / Need builder assessment', desc: 'We will measure your landing and headroom on site', icon: '❓' },
    ],
  },
  {
    id: 'loft_finish',
    projectTypes: ['loft'],
    title: 'What level of finish are you looking for?',
    subtitle: 'Calibrates insulation grade, ensuite sanitaryware, and joinery.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Clean plaster finish, standard ensuite fittings, radiator heating', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Super-insulated Part L spec, luxury walk-in ensuite, bespoke eaves wardrobes', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Full bespoke joinery dressing room, air conditioning, marble ensuite & Juliette balcony', icon: '💎' },
    ],
  },
  {
    id: 'loft_notes',
    projectTypes: ['loft'],
    title: "Anything else you'd like us to know about your loft conversion?",
    subtitle: 'Mention any chimney stacks, water tank positions, or specific wishes.',
    type: 'free_text',
    placeholder: "e.g. We want a master bedroom with French doors & Juliette balcony, a compact ensuite shower, and built-in eaves storage...",
  },

  // =========================================================================
  // 5. GARDEN & LANDSCAPING QUESTIONS (projectTypes: ['garden'])
  // =========================================================================
  {
    id: 'garden_scope',
    projectTypes: ['garden'],
    title: 'What garden & outdoor work are you planning?',
    subtitle: 'Select all features you want included in your landscaping estimate.',
    type: 'multiple_choice',
    options: [
      { id: 'porcelain_patio', label: 'Porcelain / Natural stone patio', desc: 'Vitrified R11 non-slip outdoor porcelain paving on mortar bed', icon: '🪴' },
      { id: 'composite_decking', label: 'Composite or hardwood decking', desc: 'Low-maintenance rot-proof garden decking terrace with hidden clips', icon: '🪵' },
      { id: 'garden_studio', label: 'Insulated contemporary garden studio', desc: 'Year-round garden office / gym with power and double glazing', icon: '🏡' },
      { id: 'new_lawn', label: 'New cultivated lawn turf / artificial grass', desc: 'Rotovated topsoil enriched with organic matter & freshly laid turf', icon: '🌱' },
      { id: 'fencing_screens', label: 'Boundary fencing & slatted cedar screens', desc: 'Contemporary horizontal slatted timber fencing or acoustic panels', icon: '🧱' },
      { id: 'retaining_walls', label: 'Retaining walls & multi-level steps', desc: 'Rendered blockwork or sleeper retaining walls for sloped gardens', icon: '🪜' },
      { id: 'garden_drainage', label: 'Sub-base drainage & ACO soakaways', desc: 'Linear drainage channels preventing standing water near house', icon: '🚰' },
      { id: 'outdoor_lighting', label: 'Outdoor ambient lighting & power sockets', desc: 'Waterproof IP66 sockets, spike spotlights & step illumination', icon: '💡' },
    ],
  },
  {
    id: 'garden_ground_condition',
    projectTypes: ['garden'],
    title: 'Are there level changes or heavy clearance required?',
    subtitle: 'Ground excavation and waste removal influence site preparation costs.',
    type: 'single_choice',
    options: [
      { id: 'flat_easy', label: 'Mostly flat, straightforward site access', desc: 'Standard excavation and preparation', icon: '🚜' },
      { id: 'sloped_terracing', label: 'Sloped garden requiring excavation & terracing', desc: 'Stepped levels, retaining walls and soil removal', icon: '⛰️' },
      { id: 'heavy_clearance', label: 'Heavy overgrowth, old concrete or shed removal', desc: 'Demolition of existing structures and green waste clearance', icon: '🔨' },
      { id: 'not_sure', label: 'Not sure', desc: 'Our landscaping team will inspect the site levels', icon: '❓' },
    ],
  },
  {
    id: 'garden_size',
    projectTypes: ['garden'],
    title: 'Roughly how big is your garden space?',
    subtitle: 'Choose an approximate area or enter measurements.',
    type: 'dimension_input',
    options: [
      { id: 'small', label: 'Compact Garden / Courtyard', desc: 'Under 50 m² (e.g. 5m × 8m)', icon: '🪴' },
      { id: 'medium', label: 'Standard Suburban Garden', desc: 'Approx. 50–150 m² (e.g. 8m × 15m)', icon: '🌳' },
      { id: 'large', label: 'Spacious Garden', desc: '150 m²+ (e.g. 12m × 20m+)', icon: '🏡' },
      { id: 'exact', label: 'I know the measurements', desc: 'Enter length and width in meters', icon: '📏' },
      { id: 'not_sure', label: "I'm not sure", desc: 'We will assume standard 80m² garden', icon: '❓' },
    ],
  },
  {
    id: 'garden_finish',
    projectTypes: ['garden'],
    title: 'What level of finish are you looking for?',
    subtitle: 'Calibrates paving materials, timber grades, and lighting spec.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Classic sandstone/concrete paving, standard turf, timber lap fencing', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Italian porcelain paving, composite decking, slatted cedar fencing, outdoor lighting', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Large-format porcelain, bespoke outdoor kitchen, insulated garden room & automated lighting', icon: '💎' },
    ],
  },
  {
    id: 'garden_notes',
    projectTypes: ['garden'],
    title: "Anything else you'd like us to know about your garden?",
    subtitle: 'Mention any trees, drainage issues, or garden room ideas.',
    type: 'free_text',
    placeholder: "e.g. We want a porcelain patio area with steps down to a new lawn, and contemporary slatted cedar fencing along both sides...",
  },

  // =========================================================================
  // 6. DRIVEWAY QUESTIONS (projectTypes: ['driveway'])
  // =========================================================================
  {
    id: 'driveway_surface',
    projectTypes: ['driveway'],
    title: 'What type of driveway surface are you looking for?',
    subtitle: 'Select your preferred paving or driveway finish.',
    type: 'single_choice',
    options: [
      { id: 'resin_bound', label: 'Resin-bound gravel (Most Popular)', desc: 'Seamless, modern, permeable SUDS-compliant surface with UV resin', icon: '🛣️' },
      { id: 'block_paving', label: 'Block paving / Tegula sets', desc: 'Classic durable herringbone pattern with contrasting edge borders', icon: '🧱' },
      { id: 'tarmac_granite', label: 'Tarmacadam with granite set borders', desc: 'Hardwearing black SMA tarmac with natural granite stone kerbs', icon: '🚗' },
      { id: 'gravel_grids', label: 'Stabilised gravel with cellular grids', desc: 'Cost-effective natural gravel locked in cellular grids preventing ruts', icon: '🪨' },
      { id: 'not_sure', label: 'Not sure / Need recommendation', desc: 'We will inspect sub-base and recommend the best surface for your vehicle use', icon: '💡' },
    ],
  },
  {
    id: 'driveway_features',
    projectTypes: ['driveway'],
    title: 'What additional driveway features are needed?',
    subtitle: 'Select all drainage, boundary, and electrical charging additions.',
    type: 'multiple_choice',
    options: [
      { id: 'dropped_kerb', label: 'Dropped kerb council crossover assistance', desc: 'Creating legal vehicle access from the road across the public footway', icon: '🚗' },
      { id: 'brick_piers_walls', label: 'Front boundary wall & brick piers', desc: 'Matching brickwork front wall with stone pier caps & railings', icon: '🧱' },
      { id: 'drainage_channel', label: 'Permeable ACO linear drainage channels', desc: 'Interceptors preventing rainwater runoff onto the public highway', icon: '🚰' },
      { id: 'ev_charger', label: 'Electric vehicle (EV) charging point ducting', desc: 'Underground armoured cable conduit for 7kW / 22kW EV car charger', icon: '⚡' },
      { id: 'driveway_lighting', label: 'Recessed ground drive lights / Post lights', desc: 'Low-voltage automated entrance illumination', icon: '💡' },
    ],
  },
  {
    id: 'driveway_size',
    projectTypes: ['driveway'],
    title: 'Roughly how big is the driveway area?',
    subtitle: 'Approximate vehicle capacity or square meters.',
    type: 'dimension_input',
    options: [
      { id: 'small', label: '1 Car Driveway', desc: 'Under 25 m² (approx. 3.5m × 6m)', icon: '🚗' },
      { id: 'medium', label: '2 Car Driveway', desc: 'Approx. 25–50 m² (approx. 6m × 7m)', icon: '🚙' },
      { id: 'large', label: '3+ Car Driveway & Turning Area', desc: '50 m²+ (approx. 8m × 10m+)', icon: '🏎️' },
      { id: 'exact', label: 'I know the measurements', desc: 'Enter length and width in meters', icon: '📏' },
      { id: 'not_sure', label: "I'm not sure", desc: 'We will assume standard 35m² 2-car driveway', icon: '❓' },
    ],
  },
  {
    id: 'driveway_finish',
    projectTypes: ['driveway'],
    title: 'What level of finish are you looking for?',
    subtitle: 'Calibrates aggregate grade, kerb edging stone, and sub-base specification.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Standard block paving or basic tarmac, concrete edging kerbs', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'UV-stable resin-bound marble aggregate with silver granite set borders', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Natural granite cobbles, automated electric sliding gates & integrated ground lighting', icon: '💎' },
    ],
  },
  {
    id: 'driveway_notes',
    projectTypes: ['driveway'],
    title: "Anything else you'd like us to know about your driveway?",
    subtitle: 'Mention any dropped kerb status, tree roots, or boundary walls.',
    type: 'free_text',
    placeholder: "e.g. We want resin-bound gravel with granite set borders, an ACO drainage channel, and ducting for an EV charger...",
  },

  // =========================================================================
  // 7. FULL HOUSE RENOVATION QUESTIONS (projectTypes: ['full-renovation'])
  // =========================================================================
  {
    id: 'renovation_scope',
    projectTypes: ['full-renovation'],
    title: 'What is the overall scope of the house renovation?',
    subtitle: 'Select how deep the renovation works will go.',
    type: 'single_choice',
    options: [
      { id: 'complete_back_to_brick', label: 'Complete back-to-brick gut renovation', desc: 'Stripping back to structural masonry, all new plumbing, electrics, plastering & fit-out', icon: '🏚️' },
      { id: 'refurbishment', label: 'Major interior refurbishment', desc: 'New kitchen, bathrooms, flooring, joinery, and full redecoration throughout', icon: '🏡' },
      { id: 'renovation_plus_extension', label: 'Full renovation plus new extension / loft', desc: 'Complete house overhaul combined with new ground floor extension or loft suite', icon: '🏗️' },
      { id: 'not_sure', label: 'Not sure / Exploring feasibility', desc: 'Our estimators will walk through the property and create a phased plan', icon: '💡' },
    ],
  },
  {
    id: 'renovation_rooms',
    projectTypes: ['full-renovation'],
    title: 'Which areas are included in the refurbishment?',
    subtitle: 'Select all zones included in the scope of work.',
    type: 'multiple_choice',
    options: [
      { id: 'kitchen_dining', label: 'Kitchen & Dining Areas', desc: 'New kitchen cabinetry, worktops, island & dining layout', icon: '🍳' },
      { id: 'all_bathrooms', label: 'All Bathrooms & Ensuites', desc: 'Master bathroom, ensuites, and ground floor cloakrooms', icon: '🛁' },
      { id: 'living_reception', label: 'Living Rooms & Receptions', desc: 'Flooring, plaster skimming, joinery & lighting', icon: '🛋️' },
      { id: 'bedrooms', label: 'All Bedrooms', desc: 'New plaster, skirting, bespoke fitted wardrobes & doors', icon: '🛏️' },
      { id: 'hallway_stairs', label: 'Hallway, Stairs & Landing', desc: 'New balustrades, staircase refurbishment & entrance flooring', icon: '🪜' },
      { id: 'utility_room', label: 'Dedicated Utility Room', desc: 'Bespoke laundry room with appliance stack & storage', icon: '🧺' },
      { id: 'exterior_windows', label: 'Exterior Facade & New Windows', desc: 'New double/triple glazed windows, external render & front door', icon: '🪟' },
    ],
  },
  {
    id: 'renovation_structural',
    projectTypes: ['full-renovation'],
    title: 'Are you altering the internal layout or knocking through walls?',
    subtitle: 'Open-plan living spaces require structural RSJ steel beams.',
    type: 'single_choice',
    options: [
      { id: 'major_layout_changes', label: 'Yes, major layout changes & RSJ steels', desc: 'Removing load-bearing dividing walls for open-plan living', icon: '🔨' },
      { id: 'minor_changes', label: 'Minor layout changes only', desc: 'Moving non-structural partition walls and doorways', icon: '🚪' },
      { id: 'keep_layout', label: 'Keep original room layouts as they are', desc: 'Renovating within existing room footprints', icon: '🧱' },
      { id: 'not_sure', label: 'Not sure / Need layout advice', desc: 'Our architect will create layout options for your space', icon: '❓' },
    ],
  },
  {
    id: 'renovation_systems',
    projectTypes: ['full-renovation'],
    title: 'Heating, electrical & plumbing overhaul',
    subtitle: 'Select infrastructure and energy efficiency upgrades.',
    type: 'multiple_choice',
    options: [
      { id: 'full_rewire', label: 'Full electrical rewire & consumer unit upgrade', desc: 'Complete new cabling, sockets, lighting circuits and Part P certificate', icon: '🔌' },
      { id: 'wet_underfloor_heating', label: 'Water underfloor heating across ground floor', desc: 'Warm water screed heating connected to boiler, eliminating wall radiators', icon: '♨️' },
      { id: 'boiler_megaflo', label: 'System boiler & Megaflo unvented hot water cylinder', desc: 'Mains-pressure hot water supplying all showers simultaneously', icon: '🔥' },
      { id: 'smart_lighting', label: 'Architectural LED lighting & scene dimmers', desc: 'Concealed coffer LEDs, feature pendant circuits & smart switches', icon: '💡' },
    ],
  },
  {
    id: 'renovation_size',
    projectTypes: ['full-renovation'],
    title: 'What is the approximate size of the property?',
    subtitle: 'Number of bedrooms and floor area estimate.',
    type: 'dimension_input',
    options: [
      { id: 'small', label: '2 Bedroom Property', desc: 'Under 90 m²', icon: '🏠' },
      { id: 'medium', label: '3 Bedroom House', desc: 'Approx. 90–140 m²', icon: '🏡' },
      { id: 'large', label: '4 Bedroom House', desc: 'Approx. 140–200 m²', icon: '🏘️' },
      { id: 'expansive', label: '5+ Bedroom Executive Home', desc: '200 m²+', icon: '🏛️' },
      { id: 'exact', label: 'I know the floor area', desc: 'Enter total floor area in square meters', icon: '📏' },
      { id: 'not_sure', label: "I'm not sure", desc: 'We will assume standard 120m² 3-bed house', icon: '❓' },
    ],
  },
  {
    id: 'renovation_finish',
    projectTypes: ['full-renovation'],
    title: 'What level of finish are you looking for?',
    subtitle: 'This calibrates flooring, kitchen/bathroom tiers, and joinery materials.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Clean trade fittings, quality laminate/engineered wood, standard paint finish', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Engineered oak flooring, Italian porcelain, 30mm Quartz, Hansgrohe brassware, bespoke skirtings', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Imported marble, handmade bespoke joinery, Crittall doors, smart home automation', icon: '💎' },
    ],
  },
  {
    id: 'renovation_notes',
    projectTypes: ['full-renovation'],
    title: "Anything else you'd like us to know about your renovation?",
    subtitle: 'Mention any period features to restore, chimney removals, or specific wishes.',
    type: 'free_text',
    placeholder: "e.g. Victorian terrace full renovation, knocking through kitchen/dining, restoring original cornicing, and fitting a new master ensuite...",
  },

  // =========================================================================
  // 8. STRUCTURAL / OTHER QUESTIONS (projectTypes: ['other'])
  // =========================================================================
  {
    id: 'other_scope',
    projectTypes: ['other'],
    title: 'What specific building work are you planning?',
    subtitle: 'Select the primary focus of your project.',
    type: 'single_choice',
    options: [
      { id: 'structural_rsj', label: 'Load-bearing wall knockthrough & RSJ steels', desc: 'Removing internal wall to open up space with structural calculation signoff', icon: '🔨' },
      { id: 'garage_conversion', label: 'Garage conversion into living room / gym', desc: 'Converting integral or detached garage into warm habitable space', icon: '🚗' },
      { id: 'external_render', label: 'External wall insulation & silicone render', desc: 'Breathable K-Rend / Weber monocouche render on external facades', icon: '🏠' },
      { id: 'chimney_removal', label: 'Chimney breast removal & making good', desc: 'Safe removal of chimney stack/breast with structural gallow brackets', icon: '🧱' },
      { id: 'general_carpentry', label: 'General building repairs, joinery & carpentry', desc: 'Custom joinery, flooring, drylining & structural repairs', icon: '🛠️' },
    ],
  },
  {
    id: 'other_finish',
    projectTypes: ['other'],
    title: 'What level of finish are you looking for?',
    subtitle: 'Select your preferred specification tier.',
    type: 'single_choice',
    options: [
      { id: 'standard', label: 'Standard Quality', desc: 'Solid trade standard materials and clean finish', icon: '⭐' },
      { id: 'premium', label: 'Premium Architectural', desc: 'Higher specification materials with architectural attention to detail', icon: '🌟' },
      { id: 'luxury', label: 'Bespoke Luxury', desc: 'Top-tier bespoke materials and handcrafted execution', icon: '💎' },
    ],
  },
  {
    id: 'other_notes',
    projectTypes: ['other'],
    title: "Anything else you'd like us to know?",
    subtitle: 'Provide as much detail as possible about the work required.',
    type: 'free_text',
    placeholder: "e.g. We want to remove a 3.5m load-bearing wall between kitchen and living room with a flush steel beam...",
  },

  // =========================================================================
  // 9. FINAL PROPERTY CONTEXT (ALL PROJECTS)
  // =========================================================================
  {
    id: 'property_and_postcode',
    projectTypes: ['all'],
    title: 'Where is the property located?',
    subtitle: 'Your postcode and property type allow us to calculate localized London build rates.',
    type: 'property_and_postcode',
  },

  // =========================================================================
  // 10. FINAL TIMELINE & READINESS (ALL PROJECTS)
  // =========================================================================
  {
    id: 'timeline_and_stage',
    projectTypes: ['all'],
    title: 'When would you ideally like to start?',
    subtitle: 'Help us understand your timeline so our team can schedule resources.',
    type: 'timeline_and_stage',
  },
];

/**
 * Returns the exact list of questions for the selected project type.
 * Automatically filters out any question not belonging to this projectType,
 * and evaluates conditional visibility predicates.
 */
export function getQuestionsForProject(
  projectType: ProjectType,
  currentAnswers: Record<string, any>
): QuizQuestion[] {
  return MASTER_QUIZ_QUESTIONS.filter((q) => {
    // 1. Check if question belongs to active projectType or 'all'
    const belongsToProject = q.projectTypes.includes(projectType) || q.projectTypes.includes('all');
    if (!belongsToProject) return false;

    // 2. Check conditional visibility predicate if present
    if (q.condition && !q.condition(currentAnswers)) {
      return false;
    }

    return true;
  });
}
