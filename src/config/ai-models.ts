/**
 * Centralized AI Model Configuration & Provider Router
 * Complies with Phase 7C Specification (Items 27, 28, 36).
 * 
 * Centralizes all model identifiers and provider mappings to prevent obsolescence
 * and provide runtime observability telemetry without exposing credentials.
 */

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

export type VisualiserAIRole =
  | 'visualiser_interpret'
  | 'visualiser_vision'
  | 'visualiser_change'
  | 'visualiser_chat'
  | 'visualiser_image_gen';

export interface ModelConfig {
  provider: AIProvider;
  model: string;
  fallbackProvider?: AIProvider;
  fallbackModel?: string;
  maxTokens: number;
  temperature: number;
  costPer1kInputTokensGbp: number;
  costPer1kOutputTokensGbp: number;
}

export const VISUALISER_MODELS: Record<VisualiserAIRole, ModelConfig> = {
  visualiser_interpret: {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o',
    maxTokens: 3000,
    temperature: 0.1, // High deterministic precision for JSON
    costPer1kInputTokensGbp: 0.001,
    costPer1kOutputTokensGbp: 0.003,
  },
  visualiser_vision: {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 2500,
    temperature: 0.2,
    costPer1kInputTokensGbp: 0.0005,
    costPer1kOutputTokensGbp: 0.0015,
  },
  visualiser_change: {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 2000,
    temperature: 0.1,
    costPer1kInputTokensGbp: 0.0005,
    costPer1kOutputTokensGbp: 0.0015,
  },
  visualiser_chat: {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 1500,
    temperature: 0.3,
    costPer1kInputTokensGbp: 0.0005,
    costPer1kOutputTokensGbp: 0.0015,
  },
  visualiser_image_gen: {
    provider: 'openai',
    model: 'dall-e-3',
    fallbackProvider: 'gemini',
    fallbackModel: 'imagen-3.0-generate-002',
    maxTokens: 1024,
    temperature: 0.7,
    costPer1kInputTokensGbp: 0.03, // Per image standard
    costPer1kOutputTokensGbp: 0.03,
  },
};

export interface AIOperationTelemetry {
  role: VisualiserAIRole;
  provider: AIProvider;
  model: string;
  success: boolean;
  latencyMs: number;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  estimatedCostGbp: number;
  fallbackUsed: boolean;
  error?: string;
  timestamp: string;
}

const telemetryLog: AIOperationTelemetry[] = [];

/**
 * Records telemetry metrics for an AI operation without exposing secret keys
 */
export function recordAITelemetry(record: AIOperationTelemetry): void {
  telemetryLog.push(record);
  if (telemetryLog.length > 200) {
    telemetryLog.shift();
  }
  
  if (!record.success) {
    console.warn(`[AI Telemetry] Operation ${record.role} failed on ${record.provider}/${record.model} (Latency: ${record.latencyMs}ms). Fallback: ${record.fallbackUsed}`, record.error);
  }
}

/**
 * Returns anonymized recent telemetry summaries
 */
export function getRecentAITelemetry(): readonly AIOperationTelemetry[] {
  return telemetryLog;
}
