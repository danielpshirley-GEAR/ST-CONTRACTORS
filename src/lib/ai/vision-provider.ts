/**
 * Real Multimodal Vision Provider
 * Complies with Phase 7C Specification (Items 1, 2, 3).
 * 
 * Directly supplies image pixels (Base64 inline data or secure data URI)
 * to vision-capable AI models (Gemini / OpenAI) with strict SSRF protection.
 */

import { validateAndExtractImagePayload } from '@/lib/security/image-security';
import { VISUALISER_MODELS, recordAITelemetry, AIProvider } from '@/config/ai-models';
import { UploadedAssetAnalysisSchema, ValidatedUploadedAssetAnalysis } from './visualiser-schemas';

export interface VisionExecutionOptions {
  imageData: string; // Base64 Data URI or authenticated upload URL
  filename?: string;
  systemPrompt?: string;
  userPrompt: string;
}

export interface VisionExecutionResult {
  analysis: ValidatedUploadedAssetAnalysis;
  provider: AIProvider;
  model: string;
  executionTimeMs: number;
  tokensUsed?: { prompt: number; completion: number; total: number };
  estimatedCostGbp: number;
  isFallback: boolean;
}

/**
 * Executes a genuine multimodal vision inspection using image pixel bytes
 */
export async function executeVisionRequest(options: VisionExecutionOptions): Promise<VisionExecutionResult> {
  const startTime = Date.now();
  const config = VISUALISER_MODELS.visualiser_vision;

  // 1. SSRF & Payload Security Check
  const validatedImage = validateAndExtractImagePayload(options.imageData);
  if (!validatedImage.isValid && validatedImage.sourceType !== 'authenticated_upload') {
    throw new Error(`Image security validation failed: ${validatedImage.error || 'Invalid image'}`);
  }

  // Attempt primary provider (Gemini / OpenAI)
  try {
    const result = await callVisionProvider(config.provider, config.model, options, validatedImage);
    const latency = Date.now() - startTime;
    recordAITelemetry({
      role: 'visualiser_vision',
      provider: config.provider,
      model: config.model,
      success: true,
      latencyMs: latency,
      tokensUsed: result.tokensUsed,
      estimatedCostGbp: result.estimatedCostGbp,
      fallbackUsed: false,
      timestamp: new Date().toISOString(),
    });
    return {
      ...result,
      executionTimeMs: latency,
      isFallback: false,
    };
  } catch (primaryError) {
    console.warn(`[Vision Provider] Primary provider (${config.provider}/${config.model}) failed. Attempting fallback...`, primaryError);
    
    if (config.fallbackProvider && config.fallbackModel) {
      try {
        const fallbackResult = await callVisionProvider(
          config.fallbackProvider,
          config.fallbackModel,
          options,
          validatedImage
        );
        const latency = Date.now() - startTime;
        recordAITelemetry({
          role: 'visualiser_vision',
          provider: config.fallbackProvider,
          model: config.fallbackModel,
          success: true,
          latencyMs: latency,
          tokensUsed: fallbackResult.tokensUsed,
          estimatedCostGbp: fallbackResult.estimatedCostGbp,
          fallbackUsed: true,
          timestamp: new Date().toISOString(),
        });
        return {
          ...fallbackResult,
          executionTimeMs: latency,
          isFallback: true,
        };
      } catch (fallbackError) {
        console.error('[Vision Provider] Fallback vision provider also failed:', fallbackError);
      }
    }

    recordAITelemetry({
      role: 'visualiser_vision',
      provider: config.provider,
      model: config.model,
      success: false,
      latencyMs: Date.now() - startTime,
      estimatedCostGbp: 0,
      fallbackUsed: false,
      error: (primaryError as Error).message,
      timestamp: new Date().toISOString(),
    });

    throw new Error(`Vision execution failed: ${(primaryError as Error).message}`);
  }
}

/**
 * Provider-specific multimodal delivery
 */
async function callVisionProvider(
  provider: AIProvider,
  model: string,
  options: VisionExecutionOptions,
  validatedImage: ReturnType<typeof validateAndExtractImagePayload>
): Promise<{
  analysis: ValidatedUploadedAssetAnalysis;
  provider: AIProvider;
  model: string;
  tokensUsed?: { prompt: number; completion: number; total: number };
  estimatedCostGbp: number;
}> {
  // 1. Google Gemini Multimodal Call (inlineData Base64)
  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const parts: any[] = [];
    if (options.systemPrompt) {
      parts.push({ text: `SYSTEM DIRECTIVE: ${options.systemPrompt}\n\n` });
    }
    parts.push({ text: options.userPrompt });

    // Inject base64 image pixels directly
    if (validatedImage.base64Data) {
      parts.push({
        inlineData: {
          mimeType: validatedImage.mimeType,
          data: validatedImage.base64Data,
        },
      });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2500,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini Vision API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsedJson = JSON.parse(rawText);
    
    // Strict Zod schema validation
    const parsed = UploadedAssetAnalysisSchema.parse(parsedJson);
    const totalTokens = data.usageMetadata?.totalTokenCount || 500;

    return {
      analysis: parsed,
      provider: 'gemini',
      model,
      tokensUsed: {
        prompt: data.usageMetadata?.promptTokenCount || 0,
        completion: data.usageMetadata?.candidatesTokenCount || 0,
        total: totalTokens,
      },
      estimatedCostGbp: totalTokens * 0.000001 * 0.78,
    };
  }

  // 2. OpenAI Multimodal Call (image_url Data URI)
  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const userContent: any[] = [{ type: 'text', text: options.userPrompt }];

    if (validatedImage.dataUri) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: validatedImage.dataUri,
          detail: 'high',
        },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
          { role: 'user', content: userContent },
        ],
        temperature: 0.1,
        max_tokens: 2500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI Vision API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '{}';
    const parsedJson = JSON.parse(rawText);
    
    // Strict Zod validation
    const parsed = UploadedAssetAnalysisSchema.parse(parsedJson);
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;

    return {
      analysis: parsed,
      provider: 'openai',
      model,
      tokensUsed: {
        prompt: promptTokens,
        completion: completionTokens,
        total: promptTokens + completionTokens,
      },
      estimatedCostGbp: (promptTokens * 0.000005 + completionTokens * 0.000015) * 0.78,
    };
  }

  throw new Error(`Unsupported vision provider: ${provider}`);
}
