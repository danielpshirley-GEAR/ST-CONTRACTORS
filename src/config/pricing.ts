export interface PricingRule {
  category: string;
  item: string;
  unit: string;
  baseMaterialPrice: number;
  baseLabourPrice: number;
  currency: string;
  notes?: string;
  lastUpdated: string;
}

export const centralPricingData: {
  version: string;
  lastUpdated: string;
  regionMultipliers: Record<string, number>;
  finishMultipliers: Record<string, number>;
  rules: PricingRule[];
} = {
  version: '1.0.0',
  lastUpdated: '2026-08-24',
  regionMultipliers: {
    'london-central': 1.25,
    'london-west': 1.15,
    'london-southwest': 1.15,
    'surrey': 1.10,
    'standard-uk': 1.0,
  },
  finishMultipliers: {
    essential: 0.85,
    standard: 1.0,
    premium: 1.35,
    luxury: 1.85,
  },
  rules: [
    {
      category: 'extensions',
      item: 'Single Storey Rear Extension (Shell & Core)',
      unit: 'm2',
      baseMaterialPrice: 1100,
      baseLabourPrice: 950,
      currency: 'GBP',
      notes: 'Includes standard strip foundations, cavity block/brick, flat EPDM/fibreglass roof',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'extensions',
      item: 'Double Storey Extension (Shell & Core)',
      unit: 'm2',
      baseMaterialPrice: 1500,
      baseLabourPrice: 1350,
      currency: 'GBP',
      notes: 'Includes deep trench footings, two-storey cavity masonry, pitched tiled roof',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'loft-conversions',
      item: 'Rear Dormer Loft Conversion',
      unit: 'm2',
      baseMaterialPrice: 950,
      baseLabourPrice: 850,
      currency: 'GBP',
      notes: 'Includes structural steel floor, timber dormer frame, EPDM roof, Velux windows',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'renovations',
      item: 'Full House Renovation',
      unit: 'm2',
      baseMaterialPrice: 650,
      baseLabourPrice: 750,
      currency: 'GBP',
      notes: 'Full rewire, replumb, replaster, flooring, and basic decorative overhaul',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'kitchens',
      item: 'Kitchen Renovation & Fit-Out',
      unit: 'room',
      baseMaterialPrice: 12000,
      baseLabourPrice: 6000,
      currency: 'GBP',
      notes: 'Standard quality units, quartz worktop, integrated appliances and fitting',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'bathrooms',
      item: 'Luxury Bathroom Renovation',
      unit: 'room',
      baseMaterialPrice: 6500,
      baseLabourPrice: 4500,
      currency: 'GBP',
      notes: 'Full tanking, porcelain tiling, concealed thermostatic valve and sanitaryware',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'materials',
      item: 'Facing Bricks (Standard UK metric 215x102.5x65mm)',
      unit: '1000 bricks',
      baseMaterialPrice: 850,
      baseLabourPrice: 700,
      currency: 'GBP',
      notes: 'Class B engineering or quality facing brick with pointing',
      lastUpdated: '2026-08-24',
    },
    {
      category: 'materials',
      item: 'C25/30 Ready-Mix Concrete',
      unit: 'm3',
      baseMaterialPrice: 135,
      baseLabourPrice: 45,
      currency: 'GBP',
      notes: 'Standard foundation / slab mix',
      lastUpdated: '2026-08-24',
    },
  ],
};
