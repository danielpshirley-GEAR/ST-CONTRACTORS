/**
 * Construction Platform Database Schema Definition
 * Conforms to Master Build Specification, Unified Project Profile, and Customer Portal.
 */

import {
  ComprehensivePlannerInput,
  ProjectScopeItem,
  RecommendedWorkItem,
  FullProjectQuoteEstimate,
} from '../ai/types';
import { LeadScoreResult } from '../pricing/types';
import { UnifiedProjectProfile } from '@/types/project-profile';
import { ConstructionKnowledgeRecord } from '@/types/knowledge-bank';

export * from '@/types/project-profile';
export * from '@/types/knowledge-bank';

export type CrmStage =
  | 'new'
  | 'attempting_contact'
  | 'contacted'
  | 'consultation_booked'
  | 'consultation_completed'
  | 'site_visit_booked'
  | 'site_visit_completed'
  | 'preparing_quote'
  | 'quote_sent'
  | 'follow_up'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'future_opportunity';

export type CustomerProjectStatus =
  | 'ESTIMATE_SAVED'
  | 'CONSULTATION_REQUESTED'
  | 'SITE_SURVEY_SCHEDULED'
  | 'ARCHITECTURAL_DRAWINGS'
  | 'FORMAL_QUOTE_ISSUED'
  | 'CONTRACT_SIGNED'
  | 'CONSTRUCTION_ACTIVE'
  | 'PROJECT_COMPLETED';

export type TimelineStageStatus = 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';

export interface ProjectTimelineStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  status: TimelineStageStatus;
  estimatedWeeks?: string;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface DbCustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  postcode?: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'project_manager';
  createdAt: string;
  updatedAt: string;
}

export interface DbProject {
  id: string;
  userId?: string;
  leadId?: string;
  referenceCode: string; // e.g. ST-2026-8942
  title: string;
  status?: CustomerProjectStatus;
  inputData: ComprehensivePlannerInput;
  scopeItems: ProjectScopeItem[];
  recommendations: RecommendedWorkItem[];
  estimateResult: FullProjectQuoteEstimate;
  timelineStages?: ProjectTimelineStage[];
  unifiedProfile?: UnifiedProjectProfile;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbSavedCalculation {
  id: string;
  userId: string;
  calculatorSlug: string;
  calculatorTitle: string;
  category: string;
  inputs: Record<string, any>;
  outputs: {
    primaryQuantity: string;
    unit: string;
    priceRange?: string;
    breakdown?: Array<{ label: string; value: string }>;
    assumptions?: string[];
  };
  savedAt: string;
}

export interface DbCustomerDocument {
  id: string;
  userId: string;
  projectId?: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // e.g. 'image/png', 'application/pdf'
  category:
    | 'ARCHITECTURAL_DRAWING'
    | 'PLANNING_NOTICE'
    | 'SITE_PHOTO'
    | 'QUOTE_DOCUMENT'
    | 'STRUCTURAL_CALCULATION'
    | 'OTHER';
  fileUrl: string;
  notes?: string;
  uploadedAt: string;
}

export interface DbLeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface DbLead {
  id: string;
  projectId: string;
  referenceCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  projectType: string;
  budgetRange: string;
  estimatedValue: number;
  timeline: string;
  score: number; // 0 - 100
  scoreBand: 'HOT' | 'HIGH' | 'MEDIUM' | 'EARLY';
  scoreFactors: LeadScoreResult['factors'];
  stage: CrmStage;
  source: string;
  preferredContactMethod: 'phone' | 'email';
  consultationType: 'consultation' | 'callback' | 'site_visit';
  requestedDate?: string;
  requestedTimeSlot?: string;
  customerDescription?: string;
  notesHistory: DbLeadNote[];
  attribution?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    landingPage?: string;
    referrer?: string;
  };
  wonContractValue?: number;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbConsultation {
  id: string;
  userId?: string;
  leadId?: string;
  projectId?: string;
  referenceCode: string;
  type: 'consultation' | 'callback' | 'site_visit';
  requestedDate?: string;
  requestedTimeSlot?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  assignedSurveyor?: string;
  notes?: string;
  createdAt: string;
}

export interface DbAnalyticsEvent {
  id: string;
  sessionId: string;
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DbContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode?: string;
  projectType?: string;
  message: string;
  createdAt: string;
}
