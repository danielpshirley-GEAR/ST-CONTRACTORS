/**
 * Versioned AI Prompt: Project Planner & Scoping Engine
 * Version: 1.0.0
 * Complies with Section 42 of Master Build Specification.
 */

export const PROJECT_PLANNER_SYSTEM_PROMPT = `You are the Lead Project Planning Director for a premier residential design and build construction company in London and South East England.
Your role is to translate homeowner requirements into realistic, preliminary scopes of work and identify essential statutory considerations.

CRITICAL RULES:
1. Use British English (e.g. joists, screed, RSJ steel, Party Wall Act, Building Regulations).
2. Never present preliminary estimates as a legally binding or guaranteed contractor quotation. Always state prices as indicative guide ranges.
3. Incorporate real London construction realities (Victorian/Edwardian solid walls, Thames Water build-over rules, suspended joist deflection, unvented cylinders for 2+ bathrooms, skip permits, and conservation areas).
4. Clearly distinguish between:
   - CONFIRMED USER SCOPE
   - STATUTORY REQUIREMENTS (Building Control, Party Wall, Gas Safe, Part P)
   - RECOMMENDED BEST PRACTICES (Subfloor insulation, uncoupling membranes, acoustic dampening)
5. Format your output cleanly as structured JSON conforming to the requested schema.`;

export function generateProjectPlannerUserPrompt(input: {
  projectType: string;
  propertyType?: string;
  propertyEra?: string;
  description: string;
  targetBudget?: number;
  rooms?: string[];
}): string {
  return `Please analyze the following homeowner project and generate an itemized preliminary scope of work:

PROJECT TYPE: ${input.projectType}
PROPERTY TYPE: ${input.propertyType || 'Victorian Terrace / Edwardian Semi (London typical)'}
PROPERTY ERA: ${input.propertyEra || 'Period Victorian (pre-1914)'}
HOMEOWNER GOALS / DESCRIPTION: "${input.description}"
TARGET BUDGET: ${input.targetBudget ? `£${input.targetBudget.toLocaleString()}` : 'To be estimated'}
ROOMS SELECTED: ${input.rooms?.join(', ') || 'All relevant areas'}

Generate a JSON object with:
1. "scopeItems": Array of preliminary trade items (Strip-out, Structural, M&E First Fix, Drylining/Plastering, Second Fix Joinery, Finishes) with trade name and estimated labor days.
2. "statutoryChecklist": Statutory alerts (Party Wall, Thames Water Build-Over, Building Regs Part P/G3).
3. "thingsYouMayHaveForgotten": Contextual recommendations (e.g. joist strengthening, unvented cylinder, subfloor insulation).
4. "readinessAssessment": What info is missing to make this project contract-ready.`;
}
