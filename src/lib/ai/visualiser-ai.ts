/**
 * AI Project Design & Scope Builder - Multimodal & LLM Intelligence Engine
 * Complies with BUILD_SPEC.md and Phase 7C Specification (Items 1, 9, 10, 11, 27).
 */

import { executeAIRequest } from './provider';
import { executeVisionRequest } from './vision-provider';
import {
  ProjectCategoryType,
  PropertyEra,
  PropertyBuildingType,
  UploadedAsset,
  UploadedAssetCategory,
  SystemAssumption,
  MissingInfoItem,
  FinishTier,
  ProjectState,
} from '@/types/visualiser-scope';
import {
  StructuredBriefExtractionSchema,
  StructuredChangeResponseSchema,
  UploadedAssetAnalysisSchema,
  AIChatResponseSchema,
  ValidatedStructuredBriefExtraction,
  ValidatedStructuredChangeResponse,
  ValidatedUploadedAssetAnalysis,
  ValidatedAIChatResponse,
} from './visualiser-schemas';
import { VISUALISER_MODELS, recordAITelemetry } from '@/config/ai-models';

export type StructuredBriefExtraction = ValidatedStructuredBriefExtraction;
export type StructuredChangeOperation = ValidatedStructuredChangeResponse['operations'][number];

/**
 * 1. LLM Structured Brief Interpreter with Zod Validation & 1-Call Self-Repair
 */
export async function interpretHomeownerBriefWithAI(input: {
  briefText: string;
  dimensions?: { length?: number; width?: number; height?: number; area?: number };
  propertyType?: string;
  propertyEra?: string;
  location?: string;
  budget?: number;
  desiredCompletion?: string;
  imageAnalyses?: UploadedAsset[];
}): Promise<StructuredBriefExtraction> {
  const systemPrompt = `You are the ST CONTRACTORS Master Construction Project Planning & Scope AI for London & South East England.
Your job is to read homeowner descriptions and extract a strict, structured project scope JSON.

CRITICAL ZERO-ASSUMPTION & ACCURACY RULES:
1. NEVER default to 'kitchen-renovation' unless the user specifically requested kitchen work.
2. If the project is about a bedroom/decorating/driveway/joinery/door/cinema/living room, classify it accurately. If ambiguous or unrecognized, classify as 'unknown' and prompt for clarification.
3. If property era or type is not stated, set era to 'not_provided' and type to 'not_provided'. NEVER invent Victorian or terraced.
4. Dimensions: If not given, leave lengthM, widthM, heightM, areaM2 as undefined. NEVER invent 5m x 4m dimensions.
5. Storeys: If not given, do not invent.
6. Design choices (worktop, flooring, glazing, cabinetry): If not stated, do not invent.
7. Output strict JSON conforming to the requested schema. No markdown wrapping outside the JSON block.`;

  const userPrompt = `Analyze this homeowner project brief:
Brief: "${input.briefText}"
Provided Dimensions: ${JSON.stringify(input.dimensions || {})}
Property Type: ${input.propertyType || 'Not specified'}
Property Era: ${input.propertyEra || 'Not specified'}
Location: ${input.location || 'Not specified'}
Budget: ${input.budget ? '£' + input.budget : 'Not specified'}

Return a valid JSON object matching the StructuredBriefExtraction schema.`;

  try {
    const aiResult = await executeAIRequest({
      role: 'project_planner',
      systemPrompt,
      userPrompt,
      temperature: 0.1,
      maxTokens: 3000,
    });

    const parsedJson = extractJsonFromText(aiResult.text);
    const validation = StructuredBriefExtractionSchema.safeParse(parsedJson);

    if (validation.success) {
      return validation.data;
    }

    // Attempt 1 Structured Self-Repair Call (Item 10)
    console.warn('[Brief AI] Validation failed. Attempting 1 structured repair call. Issues:', validation.error.format());
    const repairPrompt = `The previously generated JSON failed runtime schema validation:
Issues: ${JSON.stringify(validation.error.issues)}

Original JSON:
${JSON.stringify(parsedJson)}

Please return the corrected JSON conforming strictly to the StructuredBriefExtraction schema.`;

    const repairResult = await executeAIRequest({
      role: 'project_planner',
      systemPrompt: 'You are a JSON schema repair agent. Return only valid corrected JSON.',
      userPrompt: repairPrompt,
      temperature: 0.0,
      maxTokens: 3000,
    });

    const repairedJson = extractJsonFromText(repairResult.text);
    const repairValidation = StructuredBriefExtractionSchema.safeParse(repairedJson);

    if (repairValidation.success) {
      return repairValidation.data;
    }

    console.warn('[Brief AI] Repair also failed. Falling back to deterministic brief extractor.');
    return extractBriefDeterministically(input);
  } catch (err) {
    console.warn('[Brief AI] AI extraction threw an error, falling back to deterministic extraction:', err);
    return extractBriefDeterministically(input);
  }
}

/**
 * 2. Conversational Project Change Mutation Parser with Zod Validation & Self-Repair
 */
export async function parseProjectChangeWithAI(
  changeText: string,
  currentState: ProjectState
): Promise<ValidatedStructuredChangeResponse> {
  const systemPrompt = `You are the ST CONTRACTORS Change Engine AI.
Translate the user's conversational modification request into atomic operations.
If the user requests visual changes (e.g. "make cabinets navy", "change floor to pale oak"), flag requiresVisualRegeneration = true and provide visualModificationPrompt.
Output strict JSON conforming to StructuredChangeResponseSchema.`;

  const userPrompt = `Current Project Summary:
Project Types: ${currentState.projectTypes.join(', ')}
Spaces: ${currentState.spaces.map((s) => `${s.name} (${s.lengthM.value || '?'}m x ${s.widthM.value || '?'}m)`).join(', ')}
Current Finishes: Cabinetry: ${currentState.visualConcept.cabinetryColor || 'None'}, Flooring: ${currentState.visualConcept.flooringType || 'None'}, Glazing: ${currentState.visualConcept.glazingType || 'None'}

User Modification Request: "${changeText}"

Return JSON matching StructuredChangeResponseSchema.`;

  try {
    const aiResult = await executeAIRequest({
      role: 'project_planner',
      systemPrompt,
      userPrompt,
      temperature: 0.1,
      maxTokens: 2000,
    });

    const parsedJson = extractJsonFromText(aiResult.text);
    const validation = StructuredChangeResponseSchema.safeParse(parsedJson);

    if (validation.success) {
      return validation.data;
    }

    // 1-call repair
    const repairResult = await executeAIRequest({
      role: 'project_planner',
      systemPrompt: 'Repair this JSON to match StructuredChangeResponseSchema.',
      userPrompt: `Errors: ${JSON.stringify(validation.error.issues)}\nOriginal: ${JSON.stringify(parsedJson)}`,
      temperature: 0.0,
      maxTokens: 2000,
    });

    const repairedJson = extractJsonFromText(repairResult.text);
    const repairValidation = StructuredChangeResponseSchema.safeParse(repairedJson);

    if (repairValidation.success) {
      return repairValidation.data;
    }

    return generateDeterministicChangeOperations(changeText, currentState);
  } catch (err) {
    console.warn('[Change AI] Change parsing failed, using deterministic engine:', err);
    return generateDeterministicChangeOperations(changeText, currentState);
  }
}

/**
 * 3. Multimodal Asset Analysis using Real Image Pixels
 */
export async function analyzeUploadedAsset(
  asset: { url: string; filename: string },
  context?: { briefText?: string }
): Promise<UploadedAsset> {
  const assetId = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  try {
    const systemPrompt = `You are the ST CONTRACTORS Senior Estimator & Architectural Surveyor Vision AI.
Perform deep technical inspection of this uploaded image based STRICTLY ON PIXEL CONTENT.
Categorize into one of: 'existing_condition', 'inspiration', 'floor_plan', 'drawing', 'sketch', 'material_reference', 'product_reference', 'exterior', 'site_condition', 'defect_issue', 'boundary_context', 'product_cutsheet', 'other'.
Do NOT rely on the filename. Examine the actual image pixels.
Return strict JSON matching UploadedAssetAnalysisSchema.`;

    const userPrompt = `Inspect this image carefully. Extract all visible architectural, structural, and finish details.
Context: ${context?.briefText || 'Residential construction/renovation'}`;

    const visionResult = await executeVisionRequest({
      imageData: asset.url,
      filename: asset.filename,
      systemPrompt,
      userPrompt,
    });

    return {
      id: assetId,
      url: asset.url,
      filename: asset.filename,
      classifiedCategory: visionResult.analysis.classifiedCategory,
      classificationConfidence: visionResult.analysis.classificationConfidence,
      visibleSpaces: visionResult.analysis.visibleSpaces,
      visibleDoors: visionResult.analysis.visibleDoors,
      visibleWindows: visionResult.analysis.visibleWindows,
      visibleOpenings: visionResult.analysis.visibleOpenings,
      visibleFixtures: visionResult.analysis.visibleFixtures,
      visibleMaterials: visionResult.analysis.visibleMaterials,
      visibleFlooring: visionResult.analysis.visibleFlooring,
      visibleWallFinishes: visionResult.analysis.visibleWallFinishes,
      architecturalFeatures: visionResult.analysis.architecturalFeatures,
      approximateLayout: visionResult.analysis.approximateLayout,
      likelyPropertyCharacteristics: visionResult.analysis.likelyPropertyCharacteristics,
      existingConditions: visionResult.analysis.existingConditions,
      possibleConstraints: visionResult.analysis.possibleConstraints,
      textVisibleInDrawing: visionResult.analysis.textVisibleInDrawing,
      dimensionsVisibleInDrawing: visionResult.analysis.dimensionsVisibleInDrawing,
      uncertainties: visionResult.analysis.uncertainties,
      extractedDetails: visionResult.analysis.extractedDetails,
    };
  } catch (err) {
    console.warn('[Asset AI] Multimodal vision call failed, falling back to deterministic analysis:', err);
    return analyzeUploadedAssetDeterministically(asset);
  }
}

/**
 * 4. Context-Grounded Project Technical Chat Assistant with Zod Validation
 */
export async function askVisualiserAI(input: {
  question: string;
  projectState: ProjectState;
}): Promise<ValidatedAIChatResponse> {
  const systemPrompt = `You are the ST CONTRACTORS Technical Construction Advisory AI.
Answer the homeowner's technical question based STRICTLY on UK Building Regulations, party wall legislation, structural engineering practice, and practical site sequencing.
SAFETY RULES:
- Gas safety: must be Gas Safe registered engineer.
- Electrical work: Part P certified electrician.
- Structural steel/foundations: requires chartered structural engineer.
- Do NOT make unverified claims.
Output strict JSON matching AIChatResponseSchema.`;

  const userPrompt = `Project Type: ${input.projectState.projectTypes.join(', ')}
Spaces: ${input.projectState.spaces.map((s) => s.name).join(', ')}
Property: ${input.projectState.property.era.value}, ${input.projectState.property.type.value}
Question: "${input.question}"

Return JSON matching AIChatResponseSchema.`;

  try {
    const aiResult = await executeAIRequest({
      role: 'builder_questions',
      systemPrompt,
      userPrompt,
      temperature: 0.2,
      maxTokens: 1500,
    });

    const parsedJson = extractJsonFromText(aiResult.text);
    const validation = AIChatResponseSchema.safeParse(parsedJson);

    if (validation.success) {
      return validation.data;
    }

    return generateGroundedDeterministicAnswer(input.question, input.projectState);
  } catch (err) {
    console.warn('[Chat AI] Chat failed, using deterministic response:', err);
    return generateGroundedDeterministicAnswer(input.question, input.projectState);
  }
}

function extractJsonFromText(text: string): any {
  if (!text) return {};
  const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const substring = clean.substring(firstBrace, lastBrace + 1);
    return JSON.parse(substring);
  }
  return JSON.parse(clean);
}

export function extractBriefDeterministically(input: {
  briefText: string;
  dimensions?: { length?: number; width?: number; height?: number; area?: number };
  propertyType?: string;
  propertyEra?: string;
  location?: string;
  budget?: number;
  desiredCompletion?: string;
}): StructuredBriefExtraction {
  const text = input.briefText.toLowerCase();

  const types: ProjectCategoryType[] = [];
  if (text.includes('extension') || text.includes('rear') || text.includes('side return')) types.push('extension');
  if (text.includes('kitchen') || text.includes('cabinet') || text.includes('worktop') || text.includes('island')) types.push('kitchen-renovation');
  if (text.includes('bathroom') || text.includes('shower') || text.includes('ensuite') || text.includes('bath')) types.push('bathroom-renovation');
  if (text.includes('loft') || text.includes('dormer') || text.includes('attic')) types.push('loft-conversion');
  if (text.includes('driveway') || text.includes('paving') || text.includes('permeable')) types.push('driveway');
  if (text.includes('wardrobe') || text.includes('joinery') || text.includes('cabinetry') || text.includes('fitted')) types.push('joinery');
  if (text.includes('bedroom') || text.includes('baby') || text.includes('nursery')) types.push('bedroom');
  if (text.includes('decorat') || text.includes('paint') || text.includes('wallpaper')) types.push('decorating');
  if (text.includes('door') || text.includes('front door') || text.includes('entrance door')) types.push('door-replacement');
  if (text.includes('cinema') || text.includes('media room')) types.push('cinema-room');
  if (text.includes('living room') || text.includes('lounge') || text.includes('sitting room')) types.push('living-room');

  if (types.length === 0) types.push('unknown');

  const hasStructural = text.includes('knock through') || text.includes('remove wall') || text.includes('rsj') || text.includes('steel') || text.includes('load bearing') || text.includes('open plan');

  return {
    projectTypes: types,
    confidence: types.includes('unknown') ? 30 : 85,
    interpretedIntent: input.briefText,
    spaces: [
      {
        name: types[0] === 'driveway' ? 'Driveway' : types[0] === 'bathroom-renovation' ? 'Main Bathroom' : types[0] === 'bedroom' ? 'Master Bedroom' : types[0] === 'kitchen-renovation' ? 'Kitchen Space' : 'Primary Project Area',
        lengthM: input.dimensions?.length,
        widthM: input.dimensions?.width,
        heightM: input.dimensions?.height,
        areaM2: input.dimensions?.area,
        isPrimary: true,
        desiredChanges: [input.briefText],
        fixtures: [],
        constraints: [],
      },
    ],
    property: {
      type: (input.propertyType as PropertyBuildingType) || 'not_provided',
      era: (input.propertyEra as PropertyEra) || 'not_provided',
      location: input.location,
    },
    hasStructuralAlteration: hasStructural,
    materialsRequested: [],
    fixturesRequested: [],
    featuresToRetain: [],
    featuresToRemove: [],
    assumedFinishTier: 'enhanced',
    confirmedFacts: [`Homeowner initial brief: "${input.briefText}"`],
    assumptions: [],
    missingInformation: [
      {
        field: 'dimensions',
        question: 'What are the approximate dimensions (length and width) of the room or area?',
        category: 'Dimensions',
        scopeImpact: 5,
        costImpact: 5,
        feasibilityImpact: 3,
        visualImpact: 4,
        quantityImpact: 5,
        userEffort: 2,
      },
    ],
  };
}

export function generateDeterministicChangeOperations(
  changeText: string,
  currentState: ProjectState
): ValidatedStructuredChangeResponse {
  const text = changeText.toLowerCase();
  const ops: StructuredChangeOperation[] = [];

  if (text.includes('navy')) {
    ops.push({
      operationType: 'CHANGE_CABINETRY',
      cabinetryColor: 'Deep Navy Blue',
      description: 'Update cabinetry finish to deep navy blue with brushed hardware accents',
    });
  }

  if (text.includes('oak') || text.includes('wood') || text.includes('parquet')) {
    ops.push({
      operationType: 'CHANGE_FLOORING',
      flooringType: 'Pale Natural European Oak Herringbone',
      description: 'Update flooring to natural pale European oak with micro-bevel edges',
    });
  }

  if (ops.length === 0) {
    ops.push({
      operationType: 'GENERAL_MODIFICATION',
      description: changeText,
    });
  }

  return {
    operations: ops,
    summaryOfChange: `Applied requested modification: "${changeText}"`,
    affectedModules: ['visualConcept', 'specificationTree'],
    requiresVisualRegeneration: true,
    visualModificationPrompt: changeText,
  };
}

export function analyzeUploadedAssetDeterministically(asset: { url: string; filename: string }): UploadedAsset {
  const name = asset.filename.toLowerCase();
  let category: UploadedAssetCategory = 'inspiration';

  if (name.includes('plan') || name.includes('cad') || name.includes('drawing')) category = 'floor_plan';
  else if (name.includes('site') || name.includes('existing') || name.includes('before') || name.includes('current')) category = 'existing_condition';
  else if (name.includes('tile') || name.includes('marble') || name.includes('sample') || name.includes('swatch')) category = 'material_reference';

  return {
    id: `asset-${Date.now()}`,
    url: asset.url,
    filename: asset.filename,
    classifiedCategory: category,
    classificationConfidence: 70,
    visibleMaterials: [],
    extractedDetails: { visibleFeatures: ['Uploaded reference image'] },
  };
}

export function generateGroundedDeterministicAnswer(question: string, state: ProjectState): ValidatedAIChatResponse {
  return {
    answer: `For your ${state.projectTypes.join(' & ')} project, ST CONTRACTORS coordinates all structural calculations, Building Control submissions, and trade sequencing to ensure full compliance and durability.`,
    relevantStages: ['Design & Engineering', 'Strip-Out', 'Installation'],
    safetyNotes: ['All structural modifications require Building Control sign-off and chartered engineer calculations.'],
    actionType: 'consultation',
    suggestedAction: 'Book a free project consultation with our engineering team',
  };
}
