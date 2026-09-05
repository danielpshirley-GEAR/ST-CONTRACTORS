/**
 * Real Multimodal Visual Concept Generator & Sequential Image-to-Image Editor
 * Complies with Phase 7D Specification (Items 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14).
 * 
 * Features:
 * 1. Zero visual design defaults (no silent kitchen, quartz, oak herringbone, or sliders).
 * 2. Real Image-to-Image editing with source pixel delivery to OpenAI / Gemini image models.
 * 3. Sequential revision chaining (v1 -> v2 -> v3) preserving visual and specification state.
 * 4. Distinct labeling: 'image_to_image_transformation' only when real image pixels participate.
 * 5. Architectural Placeholder SVG with transparent fallback notice when AI is offline.
 */

import {
  ProjectState,
  VisualConceptState,
  VisualConceptHistoryItem,
  FinishTier,
} from '@/types/visualiser-scope';
import {
  VISUALISER_MODELS,
  recordAITelemetry,
  validateModelCapability,
} from '@/config/ai-models';
import { validateAndExtractImagePayload } from '@/lib/security/image-security';
import {
  persistGeneratedImageAsset,
  resolveEditableImageAsset,
} from '@/lib/storage/visual-asset-store';

export interface GenerateVisualOptions {
  state: ProjectState;
  customPromptOverride?: string;
  sourceImageUrl?: string;
  sourceVersion?: number;
  modificationInstruction?: string;
  restartFromOriginal?: boolean;
  targetBranchId?: string;
}

export interface VisualGenerationOutput {
  imageUrl: string;
  assetId: string;
  generationId: string;
  generationVersion: number;
  sourceVersion?: number;
  sourceAssetId?: string;
  branchId?: string;
  provider: string;
  model?: string;
  prompt: string;
  timestamp: string;
  conceptType: 'conceptual_interpretation' | 'image_to_image_transformation';
  disclaimer: string;
  visualHistoryItem: VisualConceptHistoryItem;
  appliedModifications: string[];
  isFallback: boolean;
}

/**
 * Constructs a photorealistic visual prompt built purely from confirmed facts and explicit user selections.
 * Strictly adheres to Zero-Assumption Rule (Items 3, 4, 5).
 */
export function constructVisualPrompt(state: ProjectState, modificationInstruction?: string): string {
  // 1. Project Type & Space (No silent kitchen fallback)
  const rawType = state.projectTypes[0];
  const isUnknown = !rawType || rawType === 'unknown' || rawType === 'other';
  const projectDescription = isUnknown
    ? (state.interpretedIntent || state.originalBrief || 'residential renovation and architectural space alteration')
    : rawType.replace(/-/g, ' ');

  const primarySpace = state.spaces.find((s) => s.isPrimary) || state.spaces[0];
  const spaceName = primarySpace?.name || 'renovated interior';

  // 2. Confirmed Dimensions (Only if present)
  const width = primarySpace?.widthM?.value;
  const length = primarySpace?.lengthM?.value;
  const dimensionClause = width && length
    ? ` Spatial geometry: ${length}m length by ${width}m width.`
    : '';

  // 3. Architectural Style / Era (Only if confirmed)
  const eraVal = state.property?.era?.value;
  const styleVal = state.visualConcept?.architecturalStyle;
  let styleClause = '';
  if (styleVal) {
    styleClause = ` Architectural style: ${styleVal}.`;
  } else if (eraVal && eraVal !== 'unknown' && eraVal !== 'not_provided') {
    styleClause = ` Architectural era context: British ${eraVal} residential character.`;
  }

  // 4. Confirmed / Chosen Finishes (ZERO silent defaults)
  const finishDetails: string[] = [];
  if (state.visualConcept?.cabinetryColor) {
    finishDetails.push(`${state.visualConcept.cabinetryColor} cabinetry`);
  }
  if (state.visualConcept?.worktopType) {
    finishDetails.push(`${state.visualConcept.worktopType} worktops`);
  }
  if (state.visualConcept?.flooringType) {
    finishDetails.push(`${state.visualConcept.flooringType} flooring`);
  }
  if (state.visualConcept?.glazingType) {
    finishDetails.push(`${state.visualConcept.glazingType} glazing`);
  }
  if (state.visualConcept?.lightingType) {
    finishDetails.push(`${state.visualConcept.lightingType} lighting`);
  }

  const finishesClause = finishDetails.length > 0
    ? ` Specified finishes: ${finishDetails.join(', ')}.`
    : '';

  // 5. Construct Core Architectural Prompt with structural fidelity directives
  let basePrompt = `Professional architectural interior photography of a high-end London residential ${projectDescription} (${spaceName}).${styleClause}${dimensionClause}${finishesClause} Maintain exact room geometry, window and door placements, structural ceiling heights, and existing architectural character. Clean architectural lines, authentic natural ambient lighting, clutter-free, premium British craftsmanship, shot on Hasselblad 35mm lens, 8k resolution.`;

  // 6. Conversational Modification Directive
  if (modificationInstruction) {
    basePrompt += ` Modification requested: "${modificationInstruction}". Render this specific alteration prominently while strictly preserving camera angle, window and door positions, and unchanged surrounding room features.`;
  }

  return basePrompt;
}

/**
 * Generates an initial or refined visual concept using real AI image generation / editing
 * Strictly implements sequential source priority (V1 -> V2 -> V3) and persistent asset normalization.
 */
export async function generateVisualConcept(options: GenerateVisualOptions): Promise<VisualGenerationOutput> {
  const startTime = Date.now();
  const nextVersion = (options.state.visualConcept.generationVersion || 0) + 1;
  const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const prompt = options.customPromptOverride || constructVisualPrompt(options.state, options.modificationInstruction);

  // Sequential Source Resolution (Phase 7E Item 5 & 9)
  // Priority:
  // 1. Explicit restart from original homeowner photo
  // 2. Explicitly selected visual version in options
  // 3. Latest successful generated concept in visual history (v2 uses v1, v3 uses v2)
  // 4. Original homeowner source photo for initial v1 generation
  const history = options.state.visualConcept.visualHistory || [];
  let sourceImageToUse: string | undefined;
  let sourceVersion: number | undefined;
  let sourceAssetId: string | undefined;
  let branchId: string | undefined = options.targetBranchId;

  if (options.restartFromOriginal) {
    sourceImageToUse = options.state.visualConcept.sourceImage;
    sourceVersion = 0;
    sourceAssetId = 'source-homeowner-photo';
    branchId = `branch-v0-${Date.now()}`;
  } else if (options.sourceImageUrl) {
    sourceImageToUse = options.sourceImageUrl;
    const match = history.find((h) => h.imageUrl === options.sourceImageUrl);
    sourceVersion = options.sourceVersion ?? match?.version;
    sourceAssetId = match?.assetId;
  } else if (history.length > 0) {
    // Sequential edit: Use latest visual in history (v2 uses v1, v3 uses v2)
    const latest = history[history.length - 1];
    sourceImageToUse = latest.imageUrl;
    sourceVersion = latest.version;
    sourceAssetId = latest.assetId;
    branchId = latest.branchId || branchId;
  } else if (options.state.visualConcept.generatedConceptImage) {
    sourceImageToUse = options.state.visualConcept.generatedConceptImage;
    sourceVersion = options.state.visualConcept.generationVersion;
    sourceAssetId = options.state.visualConcept.currentAssetId;
  } else {
    // Initial generation: Use homeowner photo if available
    sourceImageToUse = options.state.visualConcept.sourceImage;
    sourceVersion = undefined;
  }

  const appliedMods: string[] = options.modificationInstruction
    ? [...(options.state.visualConcept.refinementsHistory || []), options.modificationInstruction]
    : options.state.visualConcept.refinementsHistory || [];

  let rawGeneratedPayload: string | Buffer = '';
  let providerUsed = '';
  let modelUsed = '';
  let isImageToImage = false;
  let isFallback = false;

  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Attempt Genuine Image-to-Image Editing using resolveEditableImageAsset (Phase 7E Items 6, 7)
  if (sourceImageToUse) {
    try {
      const resolvedSource = await resolveEditableImageAsset(sourceImageToUse);
      if (resolvedSource.isValid && resolvedSource.imageBuffer && openaiKey) {
        const editConfig = VISUALISER_MODELS.visualiser_image_edit;
        
        // Prepare multipart form data for OpenAI Image Edit API
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(resolvedSource.imageBuffer)], { type: resolvedSource.mimeType || 'image/png' });
        formData.append('image', blob, 'source-image.png');
        formData.append('prompt', prompt);
        formData.append('n', '1');
        formData.append('size', '1024x1024');
        formData.append('model', editConfig.model);

        const editRes = await fetch('https://api.openai.com/v1/images/edits', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
          },
          body: formData,
        });

        if (editRes.ok) {
          const editData = await editRes.json();
          if (editData.data?.[0]?.url) {
            rawGeneratedPayload = editData.data[0].url;
            providerUsed = `OpenAI Image Edit (${editConfig.model})`;
            modelUsed = editConfig.model;
            isImageToImage = true;
          } else if (editData.data?.[0]?.b64_json) {
            rawGeneratedPayload = `data:image/png;base64,${editData.data[0].b64_json}`;
            providerUsed = `OpenAI Image Edit (${editConfig.model})`;
            modelUsed = editConfig.model;
            isImageToImage = true;
          }
        } else {
          console.warn('[Visual Generator] OpenAI Image Edit returned error status:', editRes.status, await editRes.text());
        }
      }
    } catch (err) {
      console.warn('[Visual Generator] Image Edit call failed, falling back to text-to-image:', err);
    }
  }

  // 2. Primary Text-to-Image Generation if edit not applicable or failed
  if (!rawGeneratedPayload && openaiKey) {
    try {
      const genConfig = VISUALISER_MODELS.visualiser_image_gen;
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: genConfig.model,
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.[0]?.url) {
          rawGeneratedPayload = data.data[0].url;
          providerUsed = `OpenAI (${genConfig.model})`;
          modelUsed = genConfig.model;
        } else if (data.data?.[0]?.b64_json) {
          rawGeneratedPayload = `data:image/png;base64,${data.data[0].b64_json}`;
          providerUsed = `OpenAI (${genConfig.model})`;
          modelUsed = genConfig.model;
        }
      } else {
        console.warn('[Visual Generator] OpenAI image generation returned error:', await res.text());
      }
    } catch (err) {
      console.warn('[Visual Generator] OpenAI image generation failed:', err);
    }
  }

  // 3. Fallback to Gemini Image Model if configured and OpenAI failed
  if (!rawGeneratedPayload && geminiKey) {
    try {
      const genConfig = VISUALISER_MODELS.visualiser_image_gen;
      const geminiModel = genConfig.fallbackModel || 'gemini-2.5-flash-image';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
      
      const geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const inlineBytes = geminiData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
        if (inlineBytes) {
          rawGeneratedPayload = `data:image/png;base64,${inlineBytes}`;
          providerUsed = `Google Gemini (${geminiModel})`;
          modelUsed = geminiModel;
        }
      }
    } catch (err) {
      console.warn('[Visual Generator] Google Gemini image generation failed:', err);
    }
  }

  // 4. Degraded Fallback: Architectural Placeholder Concept SVG (Items 13, 14)
  if (!rawGeneratedPayload) {
    rawGeneratedPayload = generateArchitecturalConceptSvg(options.state, prompt, nextVersion, options.modificationInstruction);
    providerUsed = 'ST Contractors Architectural Engine';
    modelUsed = 'architectural-placeholder-svg-v2';
    isFallback = true;
    isImageToImage = false; // NEVER label SVG fallback as image-to-image
  }

  // 5. Normalise and Store in Persistent Asset Store (Phase 7E Item 6)
  let persistedAsset;
  try {
    persistedAsset = await persistGeneratedImageAsset({
      imagePayload: rawGeneratedPayload,
      version: nextVersion,
      prompt,
      projectId: options.state.projectId,
      sourceVersion,
      sourceAssetId,
      branchId,
    });
  } catch (persistErr) {
    console.warn('[Visual Generator] Asset persistence error, using raw payload:', persistErr);
    persistedAsset = {
      assetId: `ast-${Date.now()}`,
      assetUrl: typeof rawGeneratedPayload === 'string' ? rawGeneratedPayload : '',
      mimeType: 'image/png',
      byteSize: 0,
      version: nextVersion,
      prompt,
      sourceVersion,
      sourceAssetId,
      branchId,
      timestamp,
    };
  }

  const finalImageUrl = persistedAsset.assetUrl;
  const conceptType: 'conceptual_interpretation' | 'image_to_image_transformation' =
    isImageToImage ? 'image_to_image_transformation' : 'conceptual_interpretation';

  const disclaimer = isFallback
    ? 'ARCHITECTURAL PLACEHOLDER CONCEPT — AI visual generation was unavailable. This simplified diagram is provided so you can continue building the project scope.'
    : 'CONCEPT VISUALISATION — Indicative spatial and finish design interpretation. Not a structural working drawing.';

  const historyItem: VisualConceptHistoryItem = {
    id: generationId,
    version: nextVersion,
    assetId: persistedAsset.assetId,
    imageUrl: finalImageUrl,
    sourceImageUrl: isImageToImage ? sourceImageToUse : undefined,
    sourceVersion,
    sourceAssetId,
    branchId,
    prompt,
    modifications: appliedMods,
    provider: providerUsed,
    model: modelUsed,
    timestamp,
    conceptType,
  };

  recordAITelemetry({
    role: isImageToImage ? 'visualiser_image_edit' : 'visualiser_image_gen',
    provider: providerUsed.includes('OpenAI') ? 'openai' : providerUsed.includes('Google') || providerUsed.includes('Gemini') ? 'gemini' : 'openai',
    model: modelUsed,
    capability: isImageToImage ? 'IMAGE_EDITING' : 'IMAGE_GENERATION',
    success: !isFallback,
    latencyMs: Date.now() - startTime,
    estimatedCostGbp: isFallback ? 0 : 0.03,
    fallbackUsed: isFallback,
    timestamp,
  });

  return {
    imageUrl: finalImageUrl,
    assetId: persistedAsset.assetId,
    generationId,
    generationVersion: nextVersion,
    sourceVersion,
    sourceAssetId,
    branchId,
    provider: providerUsed,
    model: modelUsed,
    prompt,
    timestamp,
    conceptType,
    disclaimer,
    visualHistoryItem: historyItem,
    appliedModifications: appliedMods,
    isFallback,
  };
}

/**
 * Sequential modification helper for conversational refinements
 */
export async function modifyVisualConcept(
  state: ProjectState,
  modification: string
): Promise<VisualGenerationOutput> {
  return generateVisualConcept({
    state,
    modificationInstruction: modification,
  });
}

/**
 * High-fidelity architectural concept SVG generator fallback
 */
export function generateArchitecturalConceptSvg(
  state: ProjectState,
  prompt: string,
  version: number,
  modification?: string
): string {
  const rawType = state.projectTypes[0];
  const typeTitle = !rawType || rawType === 'unknown' ? 'Residential Project' : rawType.toUpperCase().replace(/-/g, ' ');

  const cabinetColor = state.visualConcept.cabinetryColor?.toLowerCase().includes('navy')
    ? '#1e293b'
    : state.visualConcept.cabinetryColor?.toLowerCase().includes('green')
    ? '#14532d'
    : state.visualConcept.cabinetryColor?.toLowerCase().includes('black')
    ? '#09090b'
    : '#334155';

  const floorPattern = state.visualConcept.flooringType?.toLowerCase().includes('oak')
    ? '#b45309'
    : '#78716c';

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">' +
    '<defs>' +
    '<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#0f172a" />' +
    '<stop offset="50%" stop-color="#1e293b" />' +
    '<stop offset="100%" stop-color="#020617" />' +
    '</linearGradient>' +
    '<linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
    '<stop offset="0%" stop-color="#FFAA40" stop-opacity="0.25" />' +
    '<stop offset="100%" stop-color="#FFAA40" stop-opacity="0" />' +
    '</linearGradient>' +
    '<pattern id="floorGrid" width="40" height="20" patternUnits="userSpaceOnUse">' +
    '<path d="M 0 10 L 20 0 L 40 10 L 20 20 Z" fill="none" stroke="' + floorPattern + '" stroke-width="0.75" stroke-opacity="0.35" />' +
    '</pattern>' +
    '</defs>' +
    '<rect width="1200" height="800" fill="url(#bgGrad)" />' +
    '<polygon points="150,120 1050,120 900,480 300,480" fill="#1e293b" opacity="0.6" />' +
    '<polygon points="0,0 150,120 300,480 0,800" fill="#0f172a" opacity="0.9" />' +
    '<polygon points="1200,0 1050,120 900,480 1200,800" fill="#0f172a" opacity="0.9" />' +
    '<rect x="350" y="160" width="500" height="280" rx="8" fill="#020617" stroke="#475569" stroke-width="2" />' +
    '<line x1="600" y1="160" x2="600" y2="440" stroke="#475569" stroke-width="3" />' +
    '<line x1="475" y1="160" x2="475" y2="440" stroke="#334155" stroke-width="1.5" />' +
    '<line x1="725" y1="160" x2="725" y2="440" stroke="#334155" stroke-width="1.5" />' +
    '<polygon points="300,480 900,480 1200,800 0,800" fill="url(#floorGrid)" />' +
    '<polygon points="420,520 780,520 840,680 360,680" fill="' + cabinetColor + '" stroke="#64748b" stroke-width="2" />' +
    '<polygon points="400,500 800,500 780,520 420,520" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />' +
    '<rect x="40" y="40" width="460" height="110" rx="12" fill="#020617" fill-opacity="0.85" stroke="#334155" stroke-width="1" />' +
    '<text x="60" y="70" fill="#FFAA40" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" letter-spacing="1">ARCHITECTURAL PLACEHOLDER CONCEPT • V' + version + '</text>' +
    '<text x="60" y="95" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700">' + typeTitle + '</text>' +
    '<text x="60" y="122" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="11">Palette: ' + (state.visualConcept.cabinetryColor || 'Unspecified') + ' • ' + (state.visualConcept.flooringType || 'Unspecified') + '</text>' +
    '<rect x="700" y="720" width="460" height="44" rx="8" fill="#020617" fill-opacity="0.9" stroke="#334155" stroke-width="1" />' +
    '<text x="715" y="747" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600">ST CONTRACTORS DESIGN ENGINE</text>' +
    '<text x="960" y="747" fill="#FFAA40" font-family="system-ui, -apple-system, sans-serif" font-size="10">SIMPLIFIED DIAGRAM</text>' +
    '</svg>';

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
