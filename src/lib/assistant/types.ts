/**
 * AI Construction Assistant Type Definitions (Phase 6 & 11)
 * Conforms to BUILD_SPEC.md & GEMINI.md Section 13 (AI Rules)
 */

import { ProjectType } from '@/lib/planner/quiz-engine';

export interface ExtractedRoom {
  name: string;
  sizeCategory?: 'small' | 'medium' | 'large';
  dimensions?: {
    length?: number;
    width?: number;
    areaM2?: number;
  };
  purpose: string;
}

export interface ExtractedWorkItem {
  category: 'Structural & Groundworks' | 'Building Envelope' | 'Plumbing & Electrics' | 'Fit-Out & Joinery' | 'Compliance & Approvals';
  workTitle: string;
  description: string;
  tradeRequired: string;
  structuralImplication?: string;
  estimatedCostRange?: string;
}

export interface MissingQuestion {
  id: string;
  question: string;
  reason: string;
  options?: string[];
}

export interface PotentialConsideration {
  topic: string;
  consideration: string;
  regulatoryRef?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CustomSpecificationOption {
  tier: 'Essential' | 'Architectural Premium' | 'Luxury Master';
  title: string;
  priceImpact: string;
  description: string;
  highlights: string[];
  isRecommended?: boolean;
}

export interface TradePhaseBreakdown {
  phase: number;
  title: string;
  estimatedWeeks: string;
  estimatedCostRange: string;
  items: string[];
}

export interface ThingToConsider {
  category: 'Structural & Engineering' | 'Planning & Legal' | 'Drainage & Utilities' | 'Living & Logistics';
  title: string;
  explanation: string;
  impactLevel: 'high' | 'medium' | 'low';
}

export interface ExtractedProject {
  projectType: ProjectType;
  projectTypeDisplay: string;
  originalDescription: string;
  generalDescription: string;
  costEstimate: {
    low: number;
    high: number;
    formatted: string;
    benchmarkPerM2: string;
    notes: string;
  };
  customSpecifications: CustomSpecificationOption[];
  thingsToConsider: ThingToConsider[];
  tradePhaseBreakdown: TradePhaseBreakdown[];
  projectRequirements: string[];
  rooms: ExtractedRoom[];
  likelyWorks: ExtractedWorkItem[];
  missingQuestions: MissingQuestion[];
  potentialConsiderations: PotentialConsideration[];
  initialAnswers: Record<string, any>;
  summary: string;
  estimatedTimelineWeeks: {
    min: number;
    max: number;
  };
}

export interface AssistantAnalysisResponse {
  success: boolean;
  project?: ExtractedProject;
  error?: string;
}
