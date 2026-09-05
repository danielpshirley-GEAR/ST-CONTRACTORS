/**
 * Multi-AI Provider Architecture & Model Router
 * Supports OpenAI, Anthropic Claude, and Google Gemini.
 * Complies with Sections 38, 39, 40, and 41 of the Master Build Specification.
 */

export type AIProviderName = 'openai' | 'anthropic' | 'gemini';

export type AIRole =
  | 'research'
  | 'project_planner'
  | 'writer'
  | 'editor'
  | 'factcheck'
  | 'seo'
  | 'budget_optimiser'
  | 'builder_questions';

export interface AIExecutionOptions {
  role: AIRole;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  preferredProvider?: AIProviderName;
  fallbackProvider?: AIProviderName;
  modelOverride?: string;
}

export interface AIExecutionResult {
  text: string;
  provider: AIProviderName;
  model: string;
  role: AIRole;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostGbp?: number;
  executionTimeMs: number;
  isFallback: boolean;
  timestamp: string;
}

/**
 * Resolves the configured provider for a given AI role
 */
export function getProviderForRole(role: AIRole): AIProviderName {
  const envKey = `AI_${role.toUpperCase()}_PROVIDER`;
  const configured = process.env[envKey] as AIProviderName | undefined;
  if (configured && ['openai', 'anthropic', 'gemini'].includes(configured)) {
    return configured;
  }

  // Defaults per spec
  switch (role) {
    case 'research':
    case 'seo':
      return 'gemini';
    case 'editor':
      return 'anthropic';
    case 'project_planner':
    case 'writer':
    case 'factcheck':
    case 'budget_optimiser':
    case 'builder_questions':
    default:
      return 'openai';
  }
}

/**
 * Resolves the model name for a provider and role
 */
export function getModelForProvider(provider: AIProviderName, role: AIRole): string {
  switch (provider) {
    case 'openai':
      return role === 'project_planner' || role === 'editor' ? 'gpt-4o' : 'gpt-4o-mini';
    case 'anthropic':
      return 'claude-3-5-sonnet-20241022';
    case 'gemini':
      return role === 'research' || role === 'seo' || role === 'project_planner' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    default:
      return 'gpt-4o-mini';
  }
}

/**
 * Universal Multi-Provider AI Caller
 * Implements server-side calls with error-handling, fallback cascading, and traceability.
 */
export async function executeAIRequest(options: AIExecutionOptions): Promise<AIExecutionResult> {
  const startTime = Date.now();
  const primaryProvider = options.preferredProvider || getProviderForRole(options.role);
  const fallbackProvider = options.fallbackProvider || (primaryProvider === 'openai' ? 'gemini' : 'openai');

  try {
    const result = await callProvider(primaryProvider, options);
    return {
      ...result,
      executionTimeMs: Date.now() - startTime,
      isFallback: false,
      timestamp: new Date().toISOString(),
    };
  } catch (primaryError) {
    console.warn(`[AI Engine] Primary provider (${primaryProvider}) failed for role "${options.role}". Attempting fallback (${fallbackProvider}). Error:`, primaryError);
    try {
      const fallbackResult = await callProvider(fallbackProvider, options);
      return {
        ...fallbackResult,
        executionTimeMs: Date.now() - startTime,
        isFallback: true,
        timestamp: new Date().toISOString(),
      };
    } catch (fallbackError) {
      console.error(`[AI Engine] Fallback provider (${fallbackProvider}) also failed for role "${options.role}". Error:`, fallbackError);
      throw new Error(`AI execution failed across all configured providers: ${(fallbackError as Error).message}`);
    }
  }
}

/**
 * Provider-specific network execution with API key protection
 */
async function callProvider(
  provider: AIProviderName,
  options: AIExecutionOptions
): Promise<Omit<AIExecutionResult, 'executionTimeMs' | 'isFallback' | 'timestamp'>> {
  const model = options.modelOverride || getModelForProvider(provider, options.role);
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 2000;

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured in server environment');
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
          { role: 'user', content: options.userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;

    return {
      text,
      provider: 'openai',
      model,
      role: options.role,
      tokensUsed: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      estimatedCostGbp: ((promptTokens * 0.000005) + (completionTokens * 0.000015)) * 0.78,
    };
  }

  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured in server environment');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        system: options.systemPrompt || '',
        messages: [{ role: 'user', content: options.userPrompt }],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const promptTokens = data.usage?.input_tokens || 0;
    const completionTokens = data.usage?.output_tokens || 0;

    return {
      text,
      provider: 'anthropic',
      model,
      role: options.role,
      tokensUsed: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      estimatedCostGbp: ((promptTokens * 0.000003) + (completionTokens * 0.000015)) * 0.78,
    };
  }

  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in server environment');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              ...(options.systemPrompt ? [{ text: `SYSTEM INSTRUCTIONS: ${options.systemPrompt}\n\n` }] : []),
              { text: options.userPrompt },
            ],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const totalTokens = data.usageMetadata?.totalTokenCount || 0;

    return {
      text,
      provider: 'gemini',
      model,
      role: options.role,
      tokensUsed: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens,
      },
      estimatedCostGbp: (totalTokens * 0.000001) * 0.78,
    };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}
