/**
 * Centralized AI Model Configuration & Capability-Based Provider Router
 * Complies with Phase 7D Specification (Items 11, 12).
 * 
 * Centralizes all model identifiers, capability matrices, and provider routing
 * to guarantee that requests are dispatched only to models with genuine capability support.
 */

export type AICapability =
  | 'TEXT_GENERATION'
  | 'VISION_ANALYSIS'
  | 'IMAGE_GENERATION'
  | 'IMAGE_EDITING';

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

export type VisualiserAIRole =
  | 'visualiser_interpret'
  | 'visualiser_vision'
  | 'visualiser_change'
  | 'visualiser_chat'
  | 'visualiser_image_gen'
  | 'visualiser_image_edit';

export interface ModelConfig {
  provider: AIProvider;
  model: string;
  requiredCapability: AICapability;
  fallbackProvider?: AIProvider;
  fallbackModel?: string;
  maxTokens: number;
  temperature: number;
  costPer1kInputTokensGbp: number;
  costPer1kOutputTokensGbp: number;
}

export const PROVIDER_CAPABILITIES: Record<string, AICapability[]> = {
  // OpenAI
  'gpt-4o': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gpt-4o-mini': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'dall-e-3': ['IMAGE_GENERATION'],
  'dall-e-2': ['IMAGE_GENERATION', 'IMAGE_EDITING'],
  
  // Gemini
  'gemini-1.5-pro': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gemini-1.5-flash': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'imagen-3.0-generate-002': ['IMAGE_GENERATION'],
};

export const VISUALISER_MODELS: Record<VisualiserAIRole, ModelConfig> = {
  visualiser_interpret: {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    requiredCapability: 'TEXT_GENERATION',
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
    requiredCapability: 'VISION_ANALYSIS',
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
    requiredCapability: 'TEXT_GENERATION',
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
    requiredCapability: 'TEXT_GENERATION',
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
    requiredCapability: 'IMAGE_GENERATION',
    fallbackProvider: 'gemini',
    fallbackModel: 'imagen-3.0-generate-002',
    maxTokens: 1024,
    temperature: 0.7,
    costPer1kInputTokensGbp: 0.03, // Per image standard
    costPer1kOutputTokensGbp: 0.03,
  },
  visualiser_image_edit: {
    provider: 'openai',
    model: 'dall-e-2',
    requiredCapability: 'IMAGE_EDITING',
    fallbackProvider: 'openai',
    fallbackModel: 'dall-e-3',
    maxTokens: 1024,
    temperature: 0.7,
    costPer1kInputTokensGbp: 0.03,
    costPer1kOutputTokensGbp: 0.03,
  },
};

/**
 * Validates whether a given model supports the required capability
 */
export function validateModelCapability(model: string, capability: AICapability): boolean {
  const supported = PROVIDER_CAPABILITIES[model] || [];
  return supported.includes(capability);
}

export interface AIOperationTelemetry {
  role: VisualiserAIRole;
  provider: AIProvider;
  model: string;
  capability: AICapability;
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
    console.warn(`[AI Telemetry] Operation failed: ${record.role} on ${record.provider}:${record.model} (${record.error || 'Unknown error'})`);
  }
}

/**
 * Retrieves the telemetry event log
 */
export function getAITelemetryLog(): readonly AIOperationTelemetry[] {
  return telemetryLog;
}
