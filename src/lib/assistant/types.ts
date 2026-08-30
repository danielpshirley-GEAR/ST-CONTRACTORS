/**
 * AI Construction Assistant Type Definitions (Phase 6)
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

export interface ExtractedProject {
  projectType: ProjectType;
  projectTypeDisplay: string;
  originalDescription: string;
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
