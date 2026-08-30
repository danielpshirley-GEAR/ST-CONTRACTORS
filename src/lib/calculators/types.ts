/**
 * Core Calculator Engine Type Definitions
 * Conforms to GEMINI.md Section 7 & BUILD_SPEC.md Section 21
 */

export type CalculatorCategory = 'trade_material' | 'project_cost';

export type UnitType = 'm' | 'mm' | 'cm' | 'ft' | 'in' | 'm2' | 'sqft' | 'm3' | 'cuyd' | 'qty';

export interface CalculatorInputDefinition {
  id: string;
  label: string;
  helperText?: string;
  type: 'number' | 'select' | 'radio' | 'slider';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: UnitType;
  options?: { value: string | number; label: string; desc?: string }[];
}

export interface MaterialBreakdownItem {
  name: string;
  quantity: number;
  unit: string;
  formattedQuantity: string;
  notes?: string;
}

export interface PricingResult {
  materialsCostLow: number;
  materialsCostHigh: number;
  labourCostLow: number;
  labourCostHigh: number;
  totalCostLow: number;
  totalCostHigh: number;
  currency: string;
  contingencyIncluded: number; // percentage e.g. 10
}

export interface CalculationResult {
  primaryValue: number;
  primaryUnit: string;
  formattedPrimary: string;
  primaryLabel: string;
  materials: MaterialBreakdownItem[];
  wasteAppliedPercent: number;
  wasteUnitsCount: number;
  assumptions: string[];
  pricing?: PricingResult;
  projectStageRecommendations?: string[];
}

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CostBenchmarkRow {
  item: string;
  unitCost: string;
  notes: string;
}

export interface ContentSection {
  title: string;
  paragraphs?: string[];
  points?: { title: string; desc: string }[];
}

export interface CalculatorDefinition {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  tagline: string;
  description: string;
  category: CalculatorCategory;
  badge: string;
  inputs: CalculatorInputDefinition[];
  defaultWastePercent: number;
  allowedWasteOptions: number[]; // e.g. [5, 10, 15, 20]
  calculate: (inputs: Record<string, any>, wastePercent: number) => CalculationResult;
  pricingEstimate?: (quantityResult: CalculationResult, inputs: Record<string, any>) => PricingResult;
  assumptions: string[];
  faqs: CalculatorFaq[];
  howItWorks?: ContentSection;
  costBenchmarkTable?: {
    title: string;
    description: string;
    rows: CostBenchmarkRow[];
  };
  commonMistakes?: ContentSection;
  buildingRegulations?: ContentSection;
  relatedCalculators: string[]; // slugs
  relatedProjectType?: 'extension' | 'kitchen' | 'bathroom' | 'loft' | 'garden' | 'driveway' | 'full-renovation' | 'other';
  relatedServices?: { title: string; href: string; desc: string }[];
  commercialCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
