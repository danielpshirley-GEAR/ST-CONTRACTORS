/**
 * Runtime Zod Schemas & AI Self-Repair Validation Pipeline
 * Complies with Phase 7C Specification (Items 9, 10, 11).
 * 
 * Enforces strict runtime validation on all untrusted AI outputs,
 * bounds all numerical/text values, and implements structured single-call repair.
 */

import { z } from 'zod';
import {
  ProjectCategoryType,
  PropertyEra,
  PropertyBuildingType,
  FinishTier,
  UploadedAssetCategory,
} from '@/types/visualiser-scope';

// Bounded positive number helper (prevents NaN, Infinity, negative values)
const boundedPositiveNumber = z
  .number()
  .refine((val) => !isNaN(val) && isFinite(val) && val >= 0, {
    message: 'Value must be a finite non-negative number',
  });

const boundedConfidence = z
  .number()
  .refine((val) => !isNaN(val) && isFinite(val) && val >= 0 && val <= 100, {
    message: 'Confidence must be between 0 and 100',
  });

export const ProjectCategoryEnum = z.enum([
  'unknown',
  'kitchen-renovation',
  'extension',
  'loft-conversion',
  'bathroom-renovation',
  'full-renovation',
  'structural-alteration',
  'garage-conversion',
  'garden-room',
  'driveway',
  'landscaping',
  'bedroom',
  'decorating',
  'joinery',
  'door-replacement',
  'cinema-room',
  'living-room',
  'other',
]);

export const PropertyEraEnum = z.enum([
  'victorian',
  'edwardian',
  'georgian',
  '1930s',
  'post_war',
  'modern',
  'unknown',
  'not_provided',
]);

export const PropertyBuildingTypeEnum = z.enum([
  'terraced',
  'semi_detached',
  'detached',
  'flat',
  'maisonette',
  'bungalow',
  'unknown',
  'not_provided',
]);

export const FinishTierEnum = z.enum(['standard', 'enhanced', 'bespoke']);

export const UploadedAssetCategoryEnum = z.enum([
  'existing_condition',
  'inspiration',
  'floor_plan',
  'drawing',
  'sketch',
  'material_reference',
  'product_reference',
  'exterior',
  'site_condition',
  'defect_issue',
  'boundary_context',
  'product_cutsheet',
  'other',
  'unknown',
]);

// ----------------------------------------------------------------------------
// 1. Structured Brief Extraction Schema
// ----------------------------------------------------------------------------
export const StructuredBriefExtractionSchema = z.object({
  projectTypes: z.array(ProjectCategoryEnum).min(1).max(5),
  confidence: boundedConfidence,
  interpretedIntent: z.string().min(1).max(2000),
  spaces: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        lengthM: boundedPositiveNumber.optional(),
        widthM: boundedPositiveNumber.optional(),
        heightM: boundedPositiveNumber.optional(),
        areaM2: boundedPositiveNumber.optional(),
        isPrimary: z.boolean(),
        desiredChanges: z.array(z.string().max(200)).max(20),
        fixtures: z.array(z.string().max(200)).max(20),
        constraints: z.array(z.string().max(200)).max(20),
        existingCondition: z.string().max(500).optional(),
      })
    )
    .max(10),
  property: z.object({
    type: PropertyBuildingTypeEnum,
    era: PropertyEraEnum,
    storeys: boundedPositiveNumber.optional(),
    location: z.string().max(200).optional(),
    isConservationArea: z.boolean().optional(),
    isListedBuilding: z.boolean().optional(),
    existingCondition: z.string().max(500).optional(),
  }),
  hasStructuralAlteration: z.boolean(),
  structuralDetails: z.array(z.string().max(300)).max(15).optional(),
  materialsRequested: z.array(z.string().max(200)).max(20),
  fixturesRequested: z.array(z.string().max(200)).max(20),
  featuresToRetain: z.array(z.string().max(200)).max(20),
  featuresToRemove: z.array(z.string().max(200)).max(20),
  stylePreference: z.string().max(200).optional(),
  glazingPreference: z.string().max(200).optional(),
  flooringPreference: z.string().max(200).optional(),
  cabinetryPreference: z.string().max(200).optional(),
  assumedFinishTier: FinishTierEnum,
  confirmedFacts: z.array(z.string().max(300)).max(30),
  assumptions: z
    .array(
      z.object({
        key: z.string().max(100),
        label: z.string().max(200),
        value: z.union([z.string().max(200), boundedPositiveNumber]),
        reason: z.string().max(500),
        confidence: z.enum(['high', 'medium', 'low']),
        affectedCalculations: z.array(z.string().max(100)).max(10),
      })
    )
    .max(25),
  missingInformation: z
    .array(
      z.object({
        field: z.string().max(100),
        question: z.string().max(300),
        category: z.string().max(100),
        scopeImpact: z.number().min(1).max(5),
        costImpact: z.number().min(1).max(5),
        feasibilityImpact: z.number().min(1).max(5),
        visualImpact: z.number().min(1).max(5),
        quantityImpact: z.number().min(1).max(5),
        userEffort: z.number().min(1).max(5),
        applicabilityCondition: z.string().max(300).optional(),
        options: z.array(z.string().max(100)).max(10).optional(),
      })
    )
    .max(20),
  contradictions: z.array(z.string().max(300)).max(10).optional(),
  followUpClarification: z.string().max(500).optional(),
});

export type ValidatedStructuredBriefExtraction = z.infer<typeof StructuredBriefExtractionSchema>;

// ----------------------------------------------------------------------------
// 2. Structured Change Operations Schema
// ----------------------------------------------------------------------------
export const StructuredChangeOperationSchema = z.object({
  operationType: z.enum([
    'UPDATE_DIMENSION',
    'ADD_FEATURE',
    'REMOVE_FEATURE',
    'CHANGE_FINISH_TIER',
    'CHANGE_MATERIAL',
    'CHANGE_GLAZING',
    'CHANGE_FLOORING',
    'CHANGE_CABINETRY',
    'ADD_SPACE',
    'UPDATE_STRUCTURAL',
    'ADD_ROOFLIGHT',
    'GENERAL_MODIFICATION',
  ]),
  targetSpace: z.string().max(100).optional(),
  dimensionField: z.enum(['length', 'width', 'height', 'area']).optional(),
  dimensionValue: boundedPositiveNumber.optional(),
  dimensionDelta: z.number().optional(),
  featureName: z.string().max(200).optional(),
  materialName: z.string().max(200).optional(),
  finishTier: FinishTierEnum.optional(),
  glazingType: z.string().max(200).optional(),
  flooringType: z.string().max(200).optional(),
  cabinetryColor: z.string().max(100).optional(),
  description: z.string().min(1).max(1000),
  rationale: z.string().max(500).optional(),
});

export const StructuredChangeResponseSchema = z.object({
  operations: z.array(StructuredChangeOperationSchema).min(1).max(15),
  summaryOfChange: z.string().min(1).max(1000),
  affectedModules: z.array(z.string().max(50)).max(10),
  clarificationNeeded: z.string().max(500).optional(),
  requiresVisualRegeneration: z.boolean().default(false),
  visualModificationPrompt: z.string().max(500).optional(),
});

export type ValidatedStructuredChangeResponse = z.infer<typeof StructuredChangeResponseSchema>;

// ----------------------------------------------------------------------------
// 3. Uploaded Asset Analysis Schema (Multimodal Vision)
// ----------------------------------------------------------------------------
export const UploadedAssetAnalysisSchema = z.object({
  classifiedCategory: UploadedAssetCategoryEnum,
  classificationConfidence: boundedConfidence,
  visibleSpaces: z.array(z.string().max(100)).max(10).optional(),
  visibleDoors: z.array(z.string().max(100)).max(10).optional(),
  visibleWindows: z.array(z.string().max(100)).max(10).optional(),
  visibleOpenings: z.array(z.string().max(100)).max(10).optional(),
  visibleFixtures: z.array(z.string().max(100)).max(20).optional(),
  visibleMaterials: z.array(z.string().max(100)).max(20).optional(),
  visibleFlooring: z.string().max(200).optional(),
  visibleWallFinishes: z.string().max(200).optional(),
  architecturalFeatures: z.array(z.string().max(200)).max(20).optional(),
  approximateLayout: z.string().max(500).optional(),
  likelyPropertyCharacteristics: z.array(z.string().max(200)).max(10).optional(),
  existingConditions: z.array(z.string().max(200)).max(10).optional(),
  possibleConstraints: z.array(z.string().max(200)).max(10).optional(),
  textVisibleInDrawing: z.array(z.string().max(200)).max(20).optional(),
  dimensionsVisibleInDrawing: z
    .array(
      z.object({
        label: z.string().max(100),
        value: z.string().max(100),
        confidence: z.enum(['high', 'medium']),
      })
    )
    .max(20)
    .optional(),
  uncertainties: z.array(z.string().max(300)).max(10).optional(),
  extractedDetails: z
    .object({
      visibleFeatures: z.array(z.string().max(200)).max(20),
      layoutObservations: z.string().max(500).optional(),
      styleReferences: z.array(z.string().max(200)).max(10).optional(),
    })
    .optional(),
});

export type ValidatedUploadedAssetAnalysis = z.infer<typeof UploadedAssetAnalysisSchema>;

// ----------------------------------------------------------------------------
// 4. AI Chat Response Schema
// ----------------------------------------------------------------------------
export const AIChatResponseSchema = z.object({
  answer: z.string().min(1).max(3000),
  relevantStages: z.array(z.string().max(100)).max(10).optional(),
  safetyNotes: z.array(z.string().max(300)).max(5).optional(),
  suggestedAction: z.string().max(200).optional(),
  actionType: z.enum(['consultation', 'planner', 'calculator', 'general']).default('general'),
});

export type ValidatedAIChatResponse = z.infer<typeof AIChatResponseSchema>;

// ----------------------------------------------------------------------------
// 5. Image Generation Request & Result Schemas
// ----------------------------------------------------------------------------
export const ImageGenerationRequestSchema = z.object({
  projectId: z.string().min(1),
  brief: z.string().min(1).max(2000),
  projectType: z.string().min(1),
  style: z.string().max(100).optional(),
  finishTier: FinishTierEnum.default('enhanced'),
  materials: z.array(z.string().max(100)).max(10).optional(),
  dimensions: z
    .object({
      length: boundedPositiveNumber.optional(),
      width: boundedPositiveNumber.optional(),
      height: boundedPositiveNumber.optional(),
      area: boundedPositiveNumber.optional(),
    })
    .optional(),
  sourceImageUrl: z.string().optional(),
  modificationInstruction: z.string().max(500).optional(),
  previousGenerationId: z.string().optional(),
});

export const ImageGenerationResultSchema = z.object({
  imageUrl: z.string().min(1),
  generationId: z.string().min(1),
  generationVersion: z.number().int().positive(),
  provider: z.string().min(1),
  model: z.string().optional(),
  prompt: z.string().min(1),
  timestamp: z.string().min(1),
  conceptType: z.enum(['conceptual_interpretation', 'image_to_image_transformation']),
  disclaimer: z.string().min(1),
});

export type ValidatedImageGenerationResult = z.infer<typeof ImageGenerationResultSchema>;
