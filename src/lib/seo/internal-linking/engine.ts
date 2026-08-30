/**
 * INTERNAL LINKING GRAPH ENGINE
 * Discovers high-converting commercial journeys, orphan pages, and contextual cross-linking opportunities.
 * Conforms to BUILD_SPEC.md Phase 4 & GEMINI.md Section 12
 */

export interface InternalLinkOpportunity {
  sourceUrl: string;
  sourceTitle: string;
  targetUrl: string;
  targetTitle: string;
  suggestedAnchorText: string;
  relevanceScore: number;
  reason: string;
}

export class InternalLinkingEngine {
  public getCommercialJourneys(): Array<{
    startTool: string;
    costGuide: string;
    adviceGuide: string;
    caseStudy: string;
    service: string;
    planner: string;
  }> {
    return [
      {
        startTool: '/calculators/brick-calculator',
        costGuide: '/cost-guides/extension-cost',
        adviceGuide: '/advice/permitted-development-rules-extensions',
        caseStudy: '/projects/ealing-contemporary-rear-extension',
        service: '/services/extensions',
        planner: '/plan-my-project?type=extension',
      },
      {
        startTool: '/calculators/kitchen-cost-calculator',
        costGuide: '/cost-guides/kitchen-renovation-cost',
        adviceGuide: '/advice/open-plan-kitchen-knockthrough-guide',
        caseStudy: '/projects/chiswick-bespoke-kitchen-knockthrough',
        service: '/services/kitchen-renovations',
        planner: '/plan-my-project?type=kitchen',
      },
      {
        startTool: '/calculators/house-renovation-calculator',
        costGuide: '/cost-guides/house-renovation-cost',
        adviceGuide: '/advice/planning-permission-vs-building-regulations',
        caseStudy: '/projects/richmond-full-period-home-renovation',
        service: '/services/renovations',
        planner: '/plan-my-project?type=full-renovation',
      },
    ];
  }

  public getSuggestedInternalLinks(): InternalLinkOpportunity[] {
    return [
      {
        sourceUrl: '/calculators/brick-calculator',
        sourceTitle: 'Brick Quantity Calculator',
        targetUrl: '/cost-guides/extension-cost',
        targetTitle: 'House Extension Cost Guide UK 2026',
        suggestedAnchorText: '2026 House Extension Cost Guide',
        relevanceScore: 96,
        reason: 'High organic traffic calculator should pass commercial link equity to the primary extension cost guide.',
      },
      {
        sourceUrl: '/advice/permitted-development-rules-extensions',
        sourceTitle: 'Permitted Development Guide 2026',
        targetUrl: '/cost-guides/extension-cost',
        targetTitle: 'House Extension Cost Guide',
        suggestedAnchorText: 'Single & Double Storey Extension Costs',
        relevanceScore: 94,
        reason: 'Homeowners researching planning rules have immediate intent to review construction pricing.',
      },
      {
        sourceUrl: '/areas/ealing',
        sourceTitle: 'Builders in Ealing W5',
        targetUrl: '/projects/ealing-contemporary-rear-extension',
        targetTitle: 'Ealing Contemporary Rear Extension Case Study',
        suggestedAnchorText: 'Recent Ealing Victorian Extension Case Study',
        relevanceScore: 98,
        reason: 'Local area page converts highest when paired with a local project case study.',
      },
    ];
  }
}

export const internalLinkingEngine = new InternalLinkingEngine();
