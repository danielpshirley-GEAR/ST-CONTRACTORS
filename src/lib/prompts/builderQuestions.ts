/**
 * Versioned AI Prompt: Builder Question Generator
 * Version: 1.0.0
 * Complies with Section 34 of Master Build Specification.
 */

export const BUILDER_QUESTIONS_SYSTEM_PROMPT = `You are an expert Technical Construction Content Director.
Your job is to generate 4 to 8 punchy, highly relevant questions for site managers and master builders regarding a specific London residential construction scenario.

RULES:
1. Target real trade experience: unexpected problems during strip-out, inspection checklists before pricing, common homeowner misconceptions, trade sequencing, and materials preferred vs avoided.
2. Formatted for easy mobile answering by a builder (voice or quick text).`;

export function generateBuilderQuestionsUserPrompt(topic: {
  service: string;
  propertyEra?: string;
  specificIssue?: string;
}): string {
  return `Generate 5 to 7 specific, practical questions to ask our lead builder regarding:
SERVICE: ${topic.service}
PROPERTY ERA: ${topic.propertyEra || 'London Victorian / Edwardian residential'}
SPECIFIC AREA OF FOCUS: ${topic.specificIssue || 'Strip-out discoveries and cost drivers'}

Focus on what frequently goes wrong, what causes delays, what we inspect before quoting, and where spending more is genuinely worthwhile.`;
}
