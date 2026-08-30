/**
 * Construction Knowledge Bank Types
 * Proprietary repository of verified builder observations, site failure modes, London structural realities, and trade sequencing.
 * Complies with Section 32 of the Definitive Master Build Specification.
 */

import { ProjectType, PropertyType } from './index';

export type KnowledgeCategory =
  | 'structural'
  | 'm_and_e'
  | 'planning_regs'
  | 'materials'
  | 'trade_sequencing'
  | 'common_pitfalls'
  | 'london_specifics'
  | 'cost_drivers';

export interface ConstructionKnowledgeRecord {
  id: string;
  category: KnowledgeCategory;
  title: string;
  serviceSlugs: ProjectType[];
  propertyTypes: PropertyType[];
  propertyEras: ('victorian' | 'edwardian' | 'georgian' | '1930s' | 'post_war' | 'modern')[];
  boroughs?: string[];

  // Problem & Diagnosis
  problemSummary: string;
  rootCause: string;
  howIdentifiedOnSite: string;
  warningSignsForHomeowners: string[];

  // Solution & Real Trade Practice
  tradeSolution: string;
  whyThisSolution: string;
  alternativesConsidered?: string[];
  recommendedMaterials: string[];
  materialsToAvoid: string[];
  tradeSequence: string[];

  // Cost, Risk & Timeline Impacts
  estimatedCostImpact: string; // e.g. "+£2,500 - £4,000" or "Saves £1,800"
  estimatedDelayImpact?: string; // e.g. "+1-2 weeks"
  riskIfIgnored: string;

  // Builder Observation & Real Quotes
  builderObservationQuote?: string;
  surveyorInspectionChecklist: string[];
  frequentlyAskedCustomerQuestion?: string;
  verifiedBuilderAnswer?: string;

  // Verification & Editorial Governance
  verifiedBy: string; // e.g. 'Senior Site Director - 24 yrs exp'
  approvedForPublicContent: boolean;
  isInternalOnly: boolean;
  dateAdded: string;
  lastVerified: string;
}
