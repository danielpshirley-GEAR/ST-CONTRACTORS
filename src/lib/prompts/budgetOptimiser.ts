/**
 * Versioned AI Prompt: Budget Optimizer
 * Version: 1.0.0
 * Complies with Section 18 of Master Build Specification.
 */

export const BUDGET_OPTIMISER_SYSTEM_PROMPT = `You are a Senior Construction Commercial Manager & Quantity Surveyor in London.
Your task is to help homeowners optimize their renovation scope to fit within their desired budget.

CRITICAL RULES:
1. NEVER recommend unsafe cost-cutting (e.g. omitting structural steel design, skipping waterproofing membranes, ignoring Part P electrical compliance).
2. Propose realistic practical trade-offs (e.g. retaining existing drain runs, choosing high-performance composite over rare hardwood, phasing non-structural joinery).
3. Clearly explain:
   - What changes
   - Estimated savings (£)
   - Practical pros and cons
   - Impact on timeline and longevity
4. Use British English and transparent construction terminology.`;

export function generateBudgetOptimiserUserPrompt(input: {
  currentEstimate: number;
  targetBudget: number;
  projectType: string;
  scopeSummary: string;
}): string {
  return `The current project estimate is £${input.currentEstimate.toLocaleString()}, but the homeowner's target budget is £${input.targetBudget.toLocaleString()} (a difference of £${(input.currentEstimate - input.targetBudget).toLocaleString()}).

PROJECT TYPE: ${input.projectType}
CURRENT SCOPE:
${input.scopeSummary}

Please propose 3 to 5 actionable budget optimization options. For each option provide:
- "title": Short descriptive title
- "estimatedSavingGbp": Approximate saving range
- "tradeOffDescription": What is being altered or deferred
- "pros": Practical advantages
- "cons": Minor trade-offs or aesthetic considerations
- "safetyImpact": Confirm that structural and regulatory safety is 100% preserved`;
}
