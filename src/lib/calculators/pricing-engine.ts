/**
 * PRICING ENGINE
 * Centralized construction pricing rules, benchmark trade labor rates, and material costs.
 * Conforms to GEMINI.md Section 8 & BUILD_SPEC.md Section 23.
 */

import { PricingResult } from './types';

export interface RegionalRate {
  regionCode: string;
  name: string;
  multiplier: number;
}

export const REGIONAL_MULTIPLIERS: Record<string, number> = {
  london_south_east: 1.18,
  south_west: 1.02,
  midlands: 0.98,
  north_west: 0.94,
  north_east_yorkshire: 0.92,
  scotland_wales: 0.95,
  national_average: 1.0,
};

export const FINISH_MULTIPLIERS: Record<string, number> = {
  essential: 0.85,
  standard: 1.0,
  premium: 1.28,
  luxury: 1.65,
};

// ----------------------------------------------------------------------------
// BENCHMARK MATERIAL UNIT PRICES (2025/2026 UK Industry Averages)
// ----------------------------------------------------------------------------
export const MATERIAL_PRICES = {
  // Bricks & Blocks
  facingBrickPer1000: { low: 750, high: 1100 }, // £0.75 - £1.10 per brick
  buildingSandBag25kg: { low: 3.5, high: 4.8 },
  cementBag25kg: { low: 6.5, high: 8.5 },
  aeratedBlockPerUnit: { low: 2.1, high: 3.2 },
  denseConcreteBlockPerUnit: { low: 1.8, high: 2.8 },
  
  // Concrete
  readyMixConcreteM3: { low: 120, high: 165 },
  preMixConcreteBag20kg: { low: 5.5, high: 7.2 },
  ballastTonne: { low: 45, high: 60 },

  // Tiles & Flooring
  ceramicTileM2: { low: 18, high: 35 },
  porcelainTileM2: { low: 32, high: 65 },
  luxuryPorcelainTileM2: { low: 70, high: 140 },
  tileAdhesiveBag20kg: { low: 18, high: 26 },
  tileGroutBag5kg: { low: 12, high: 18 },

  // Paint & Decorating
  tradeEmulsion5L: { low: 26, high: 42 },
  premiumPaint5L: { low: 55, high: 95 },

  // Plaster & Drylining
  plasterboardSheet24x12: { low: 9.5, high: 13.5 },
  thistleMultiFinish25kg: { low: 9.2, high: 12.8 },
  scrimTapeRoll: { low: 4.5, high: 6.5 },

  // Patio & Paving
  outdoorPorcelainSlabM2: { low: 38, high: 68 },
  sandstonePavingM2: { low: 28, high: 48 },
  motType1BulkBag850kg: { low: 52, high: 68 },
  sharpSandBulkBag850kg: { low: 48, high: 62 },

  // Decking & Fencing
  timberDeckBoardM: { low: 3.8, high: 5.5 },
  compositeDeckBoardM: { low: 9.5, high: 16.5 },
  c24JoistTimberLinearM: { low: 4.2, high: 6.0 },
  fencePanel6ft: { low: 32, high: 52 },
  slottedConcretePost: { low: 22, high: 32 },
  postcreteBag20kg: { low: 6.2, high: 7.8 },

  // Landscaping
  decorativeGravelBulkBag850kg: { low: 75, high: 125 },
  cultivatedTurfRollM2: { low: 4.5, high: 7.0 },
  topsoilBulkBag850kg: { low: 65, high: 95 },
};

// ----------------------------------------------------------------------------
// TRADE LABOUR BENCHMARKS (Daily output rates & day rates)
// ----------------------------------------------------------------------------
export const LABOUR_RATES = {
  bricklayerDayRate: { low: 240, high: 320 }, // ~400-500 bricks laid/day
  plastererDayRate: { low: 220, high: 300 }, // ~35m2 skimmed/day
  tilerDayRate: { low: 220, high: 310 }, // ~10-15m2 tiled/day
  decoratorDayRate: { low: 180, high: 260 }, // ~40m2 painted/day
  landscaperDayRate: { low: 200, high: 280 }, // ~8-12m2 patio/day
  fencerDayRate: { low: 200, high: 280 }, // ~5-8 bays fenced/day
  generalLabourerDayRate: { low: 140, high: 190 },
};

// ----------------------------------------------------------------------------
// PRICING CALCULATION HELPERS
// ----------------------------------------------------------------------------

export function calculateTradeCostRange(
  materialsBaseLow: number,
  materialsBaseHigh: number,
  labourDaysLow: number,
  labourDaysHigh: number,
  tradeDayRate: { low: number; high: number } = LABOUR_RATES.bricklayerDayRate,
  options: {
    finishLevel?: string;
    region?: string;
    includeContingency?: boolean;
  } = {}
): PricingResult {
  const finishMult = FINISH_MULTIPLIERS[options.finishLevel || 'standard'] || 1.0;
  const regionMult = REGIONAL_MULTIPLIERS[options.region || 'national_average'] || 1.0;

  const matLow = Math.round(materialsBaseLow * finishMult * regionMult);
  const matHigh = Math.round(materialsBaseHigh * finishMult * regionMult);

  const labLow = Math.round(labourDaysLow * tradeDayRate.low * regionMult);
  const labHigh = Math.round(labourDaysHigh * tradeDayRate.high * regionMult);

  const rawLow = matLow + labLow;
  const rawHigh = matHigh + labHigh;

  const contingencyPct = options.includeContingency !== false ? 10 : 0;
  const contLow = Math.round(rawLow * (contingencyPct / 100));
  const contHigh = Math.round(rawHigh * (contingencyPct / 100));

  // Round totals to nearest £50 for clean presentation
  const totalCostLow = Math.round((rawLow + contLow) / 50) * 50;
  const totalCostHigh = Math.round((rawHigh + contHigh) / 50) * 50;

  return {
    materialsCostLow: matLow,
    materialsCostHigh: matHigh,
    labourCostLow: labLow,
    labourCostHigh: labHigh,
    totalCostLow,
    totalCostHigh,
    currency: 'GBP (£)',
    contingencyIncluded: contingencyPct,
  };
}

// ----------------------------------------------------------------------------
// PROJECT-LEVEL PRICING BENCHMARKS (m2 guide rates)
// ----------------------------------------------------------------------------
export const PROJECT_M2_GUIDE_RATES = {
  // House Extension (£1,850 - £2,600/m2 single storey standard)
  extensionSingleStorey: { low: 1850, high: 2450 },
  extensionSideReturn: { low: 2100, high: 2850 },
  extensionDoubleStorey: { low: 1650, high: 2250 },
  extensionWraparound: { low: 2200, high: 2950 },

  // Loft Conversion
  loftVelux: { low: 1100, high: 1550 },
  loftRearDormer: { low: 1450, high: 1950 },
  loftHipToGable: { low: 1650, high: 2250 },
  loftMansard: { low: 1850, high: 2550 },

  // Renovations
  kitchenFullRenovation: { low: 8500, high: 19500 },
  bathroomFullRenovation: { low: 5500, high: 13500 },
  fullHouseRenovationM2: { low: 850, high: 1450 },
  garageConversion: { low: 9500, high: 17500 },
  gardenStudioM2: { low: 1400, high: 2100 },
  drivewayBlockPavingM2: { low: 85, high: 135 },
  drivewayResinM2: { low: 95, high: 150 },
};
