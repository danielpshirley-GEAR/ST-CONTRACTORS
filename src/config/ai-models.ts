/**
 * Centralized AI Model Configuration & Capability-Based Provider Router
 * Complies with Phase 7E Specification (Items 1, 2, 3, 4, 18, 19).
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
  // OpenAI Modern Series
  'gpt-4o': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gpt-4o-mini': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gpt-image-2': ['IMAGE_GENERATION', 'IMAGE_EDITING'],
  'gpt-image-1': ['IMAGE_GENERATION', 'IMAGE_EDITING'],
  
  // Gemini Modern Series
  'gemini-2.5-pro': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gemini-2.5-flash': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gemini-2.0-flash': ['TEXT_GENERATION', 'VISION_ANALYSIS'],
  'gemini-2.5-flash-image': ['IMAGE_GENERATION'],
};

export const VISUALISER_MODELS: Record<VisualiserAIRole, ModelConfig> = {
  visualiser_interpret: {
    provider: 'gemini',
    model: 'gemini-2.5-pro',
    requiredCapability: 'TEXT_GENERATION',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o',
    maxTokens: 3000,
    temperature: 0.1, // High deterministic precision for structured JSON
    costPer1kInputTokensGbp: 0.001,
    costPer1kOutputTokensGbp: 0.003,
  },
  visualiser_vision: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    requiredCapability: 'VISION_ANALYSIS',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 2500,
    temperature: 0.2,
    costPer1kInputTokensGbp: 0.0003,
    costPer1kOutputTokensGbp: 0.001,
  },
  visualiser_change: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    requiredCapability: 'TEXT_GENERATION',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 2000,
    temperature: 0.1,
    costPer1kInputTokensGbp: 0.0003,
    costPer1kOutputTokensGbp: 0.001,
  },
  visualiser_chat: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    requiredCapability: 'TEXT_GENERATION',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-4o-mini',
    maxTokens: 1500,
    temperature: 0.3,
    costPer1kInputTokensGbp: 0.0003,
    costPer1kOutputTokensGbp: 0.001,
  },
  visualiser_image_gen: {
    provider: 'openai',
    model: 'gpt-image-2',
    requiredCapability: 'IMAGE_GENERATION',
    fallbackProvider: 'gemini',
    fallbackModel: 'gemini-2.5-flash-image',
    maxTokens: 1024,
    temperature: 0.7,
    costPer1kInputTokensGbp: 0.03, // Per image standard
    costPer1kOutputTokensGbp: 0.03,
  },
  visualiser_image_edit: {
    provider: 'openai',
    model: 'gpt-image-2',
    requiredCapability: 'IMAGE_EDITING',
    fallbackProvider: 'openai',
    fallbackModel: 'gpt-image-1',
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

export interface ProviderHealthReport {
  timestamp: string;
  openaiConfigured: boolean;
  geminiConfigured: boolean;
  anthropicConfigured: boolean;
  roles: Record<
    VisualiserAIRole,
    {
      primaryProvider: AIProvider;
      primaryModel: string;
      fallbackProvider?: AIProvider;
      fallbackModel?: string;
      status: 'healthy' | 'degraded_no_key' | 'offline';
    }
  >;
}

/**
 * Evaluates provider configuration health without exposing keys or credentials
 */
export function getProviderHealthReport(): ProviderHealthReport {
  const openaiKey = !!process.env.OPENAI_API_KEY;
  const geminiKey = !!process.env.GEMINI_API_KEY;
  const anthropicKey = !!process.env.ANTHROPIC_API_KEY;

  const rolesHealth: ProviderHealthReport['roles'] = {} as any;

  (Object.keys(VISUALISER_MODELS) as VisualiserAIRole[]).forEach((role) => {
    const config = VISUALISER_MODELS[role];
    const primaryHasKey =
      (config.provider === 'openai' && openaiKey) ||
      (config.provider === 'gemini' && geminiKey) ||
      (config.provider === 'anthropic' && anthropicKey);

    const fallbackHasKey =
      !config.fallbackProvider ||
      (config.fallbackProvider === 'openai' && openaiKey) ||
      (config.fallbackProvider === 'gemini' && geminiKey) ||
      (config.fallbackProvider === 'anthropic' && anthropicKey);

    let status: 'healthy' | 'degraded_no_key' | 'offline' = 'offline';
    if (primaryHasKey) {
      status = 'healthy';
    } else if (fallbackHasKey && config.fallbackProvider) {
      status = 'degraded_no_key';
    }

    rolesHealth[role] = {
      primaryProvider: config.provider,
      primaryModel: config.model,
      fallbackProvider: config.fallbackProvider,
      fallbackModel: config.fallbackModel,
      status,
    };
  });

  return {
    timestamp: new Date().toISOString(),
    openaiConfigured: openaiKey,
    geminiConfigured: geminiKey,
    anthropicConfigured: anthropicKey,
    roles: rolesHealth,
  };
}
