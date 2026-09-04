
import {
  ProjectState,
  VisualConceptState,
  VisualConceptHistoryItem,
  FinishTier,
} from '@/types/visualiser-scope';
import { VISUALISER_MODELS, recordAITelemetry } from '@/config/ai-models';

export interface GenerateVisualOptions {
  state: ProjectState;
  customPromptOverride?: string;
  sourceImageUrl?: string;
  modificationInstruction?: string;
}

export interface VisualGenerationOutput {
  imageUrl: string;
  generationId: string;
  generationVersion: number;
  provider: string;
  model?: string;
  prompt: string;
  timestamp: string;
  conceptType: 'conceptual_interpretation' | 'image_to_image_transformation';
  disclaimer: string;
  visualHistoryItem: VisualConceptHistoryItem;
  appliedModifications: string[];
}

export function constructVisualPrompt(state: ProjectState, modificationInstruction?: string): string {
  const primaryType = state.projectTypes[0] || 'kitchen-renovation';
  const primarySpace = state.spaces.find((s) => s.isPrimary) || state.spaces[0];
  const tier = state.visualConcept.architecturalStyle || state.property.era.value || 'contemporary';
  
  const width = primarySpace?.widthM?.value;
  const length = primarySpace?.lengthM?.value;
  const dimensionNote = width && length ? 'Room dimensions: ' + length + 'm length by ' + width + 'm width.' : '';

  const cabinets = state.visualConcept.cabinetryColor || 'Warm Off-White';
  const worktops = state.visualConcept.worktopType || 'Calacatta Gold Polished Quartz';
  const flooring = state.visualConcept.flooringType || 'Prime European Oak Herringbone';
  const glazing = state.visualConcept.glazingType || 'Slimline black aluminium architectural sliders';

  let basePrompt = 'Photorealistic architectural interior photography of a bespoke high-end London residential ' + primaryType.replace('-', ' ') + '. Style: refined ' + tier + ', premium British craftmanship. ' + dimensionNote + ' Finishes: ' + cabinets + ' cabinetry, ' + worktops + ' worktops, ' + flooring + ' flooring, ' + glazing + '. Natural soft morning daylight pouring through full-height architectural glazing, subtle warm recessed LED cove lighting, clean architectural lines, clutter-free, shot on Hasselblad 35mm lens, high resolution 8k.';

  if (modificationInstruction) {
    basePrompt += ' Modification applied: ' + modificationInstruction + '. Ensure this specific change is prominently rendered while maintaining all other room geometry and architectural features.';
  }

  return basePrompt;
}

export async function generateVisualConcept(options: GenerateVisualOptions): Promise<VisualGenerationOutput> {
  const startTime = Date.now();
  const config = VISUALISER_MODELS.visualiser_image_gen;
  const nextVersion = (options.state.visualConcept.generationVersion || 0) + 1;
  const generationId = 'gen-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const timestamp = new Date().toISOString();

  const prompt = options.customPromptOverride || constructVisualPrompt(options.state, options.modificationInstruction);
  const isImageToImage = Boolean(options.sourceImageUrl || options.state.visualConcept.sourceImage);
  const conceptType = isImageToImage ? 'image_to_image_transformation' : 'conceptual_interpretation';

  const appliedMods: string[] = options.modificationInstruction
    ? [...(options.state.visualConcept.refinementsHistory || []), options.modificationInstruction]
    : options.state.visualConcept.refinementsHistory || [];

  let generatedUrl = '';
  let providerUsed = 'Architectural Render Engine';
  let modelUsed = config.model;

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + openaiKey,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        generatedUrl = data.data?.[0]?.url || '';
        providerUsed = 'OpenAI DALL-E 3';
        modelUsed = 'dall-e-3';
      }
    } catch (err) {
      console.warn('[Visual Generator] DALL-E generation failed, falling back to architectural render SVG', err);
    }
  }

  if (!generatedUrl) {
    generatedUrl = generateArchitecturalConceptSvg(options.state, prompt, nextVersion, options.modificationInstruction);
    providerUsed = 'ST Contractors Architectural Engine';
    modelUsed = 'concept-vector-v2';
  }

  const historyItem: VisualConceptHistoryItem = {
    id: generationId,
    version: nextVersion,
    imageUrl: generatedUrl,
    sourceImageUrl: options.sourceImageUrl || options.state.visualConcept.sourceImage,
    prompt,
    modifications: appliedMods,
    provider: providerUsed,
    model: modelUsed,
    timestamp,
    conceptType,
  };

  recordAITelemetry({
    role: 'visualiser_image_gen',
    provider: config.provider,
    model: modelUsed,
    success: true,
    latencyMs: Date.now() - startTime,
    estimatedCostGbp: 0.03,
    fallbackUsed: providerUsed !== 'OpenAI DALL-E 3',
    timestamp,
  });

  return {
    imageUrl: generatedUrl,
    generationId,
    generationVersion: nextVersion,
    provider: providerUsed,
    model: modelUsed,
    prompt,
    timestamp,
    conceptType,
    disclaimer: 'CONCEPT VISUALISATION — Indicative spatial and finish design interpretation. Not a structural working drawing.',
    visualHistoryItem: historyItem,
    appliedModifications: appliedMods,
  };
}

export function generateArchitecturalConceptSvg(
  state: ProjectState,
  prompt: string,
  version: number,
  modification?: string
): string {
  const type = state.projectTypes[0] || 'kitchen-renovation';
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
    '<rect x="40" y="40" width="380" height="110" rx="12" fill="#020617" fill-opacity="0.85" stroke="#334155" stroke-width="1" />' +
    '<text x="60" y="70" fill="#FFAA40" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" letter-spacing="1">CONCEPT VISUALISATION • V' + version + '</text>' +
    '<text x="60" y="95" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700">' + type.toUpperCase().replace('-', ' ') + '</text>' +
    '<text x="60" y="122" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="11">Palette: ' + (state.visualConcept.cabinetryColor || 'Custom') + ' • ' + (state.visualConcept.flooringType || 'Oak') + '</text>' +
    '<rect x="760" y="720" width="400" height="44" rx="8" fill="#020617" fill-opacity="0.9" stroke="#334155" stroke-width="1" />' +
    '<text x="775" y="747" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600">ST CONTRACTORS DESIGN ENGINE</text>' +
    '<text x="1050" y="747" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="10">INDICATIVE CONCEPT</text>' +
    '</svg>';

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
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
