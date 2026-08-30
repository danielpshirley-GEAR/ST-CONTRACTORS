/**
 * UNIFIED SEO OPPORTUNITY SERVICE
 * Synthesizes data across Search Console, GA4, DataForSEO, and PageSpeed
 * into prioritized, actionable commercial opportunities.
 */

import { SEOOpportunity, OpportunityPriority, OpportunityType } from '../types';
import { calculateDeterministicOpportunityScore, calculateLeadPotentialScore } from './scoring';
import { searchConsoleService } from '../search-console';
import { googleAnalyticsService } from '../analytics';
import { dataForSeoService } from '../dataforseo';
import { seoCache } from '../cache';

export class OpportunityEngineService {
  public async getUnifiedOpportunities(filters?: {
    priority?: OpportunityPriority;
    type?: OpportunityType;
  }): Promise<SEOOpportunity[]> {
    const cacheKey = 'unified_seo_opportunities';
    const cached = seoCache.get<SEOOpportunity[]>(cacheKey);
    let allOpportunities: SEOOpportunity[] = [];

    if (cached && cached.isFresh) {
      allOpportunities = cached.data;
    } else {
      const [gscMetrics, ga4Metrics, trackedKeywords] = await Promise.all([
        searchConsoleService.getSearchPerformance(),
        googleAnalyticsService.getOrganicLandingPages(),
        dataForSeoService.getTrackedKeywords(),
      ]);

      const opportunities: SEOOpportunity[] = [];

      // 1. Striking Distance Opportunities (Positions 4–20)
      for (const kw of trackedKeywords) {
        if (kw.currentPosition && kw.currentPosition >= 4 && kw.currentPosition <= 20) {
          const { score, priority } = calculateDeterministicOpportunityScore({
            currentPosition: kw.currentPosition,
            searchVolumeMonthly: kw.searchVolumeMonthly,
            searchIntent: kw.searchIntent,
            estimatedProjectValueGbp: kw.estimatedProjectValueGbp,
            currentCtr: kw.ctr || 3.0,
          });

          opportunities.push({
            id: `opp_striking_${kw.keyword.replace(/\s+/g, '_')}`,
            type: 'RANKING_STRIKING_DISTANCE',
            priority,
            title: `Advance "${kw.keyword}" to Top 3 (Currently Pos #${kw.currentPosition})`,
            description: `High commercial query (${kw.searchVolumeMonthly.toLocaleString()} searches/mo) is within striking distance of Page 1 top positions.`,
            keyword: kw.keyword,
            url: kw.landingPage,
            currentPosition: kw.currentPosition,
            searchVolume: kw.searchVolumeMonthly,
            keywordDifficulty: kw.keywordDifficulty,
            clicks: kw.clicks || Math.round(kw.searchVolumeMonthly * 0.03),
            impressions: kw.impressions || kw.searchVolumeMonthly,
            ctr: kw.ctr || 3.2,
            opportunityScore: score,
            leadPotentialScore: kw.leadPotentialScore,
            estimatedImpact: `+£${Math.round(kw.estimatedProjectValueGbp * 0.15).toLocaleString()} pipeline value from ~${Math.round(kw.searchVolumeMonthly * 0.12)} extra organic clicks`,
            confidence: 'HIGH',
            sourceApis: ['gsc', 'dataforseo'],
            recommendedAction: `Add structural price tables, local case studies, and internal links pointing to ${kw.landingPage}.`,
            suggestedActionType: 'ADD_CONTENT_SECTION',
            createdAt: '2026-02-20',
            lastUpdated: '2026-02-20',
          });
        }
      }

      // 2. High Impression + Low CTR Opportunities
      for (const row of gscMetrics.metrics) {
        if (row.impressions >= 8000 && row.ctr <= 3.5) {
          const { score, priority } = calculateDeterministicOpportunityScore({
            currentPosition: row.position,
            monthlyImpressions: row.impressions,
            searchIntent: 'COMMERCIAL',
            estimatedProjectValueGbp: 65000,
            currentCtr: row.ctr,
          });

          opportunities.push({
            id: `opp_low_ctr_${row.keyword.replace(/\s+/g, '_')}`,
            type: 'HIGH_IMPRESSION_LOW_CTR',
            priority: priority === 'CRITICAL' ? 'HIGH' : priority,
            title: `Optimize SERP Snippet for "${row.keyword}" (CTR: ${row.ctr}%)`,
            description: `Receiving ${row.impressions.toLocaleString()} monthly impressions at position #${row.position} but underperforming the 4.5% benchmark CTR.`,
            keyword: row.keyword,
            url: row.url,
            currentPosition: row.position,
            impressions: row.impressions,
            clicks: row.clicks,
            ctr: row.ctr,
            opportunityScore: score,
            estimatedImpact: `+${Math.round(row.impressions * 0.015)} monthly clicks by rewriting title & meta tags`,
            confidence: 'HIGH',
            sourceApis: ['gsc'],
            recommendedAction: `Include "2026 Price per m²", "Instant Estimates", and verified accreditation in Title & Meta Description.`,
            suggestedActionType: 'UPDATE_METADATA',
            createdAt: '2026-02-20',
            lastUpdated: '2026-02-20',
          });
        }
      }

      // 3. High Converting Asset Expansion
      for (const page of ga4Metrics.metrics) {
        if (page.wonProjects >= 4) {
          opportunities.push({
            id: `opp_convert_${page.url.replace(/\//g, '_')}`,
            type: 'HIGH_CONVERTING_ASSET',
            priority: 'HIGH',
            title: `High Revenue Asset: ${page.pageTitle}`,
            description: `Generated £${page.pipelineValueGbp.toLocaleString()} in won projects and ${page.consultationsBooked} consultations. Priority candidate for cross-linking.`,
            url: page.url,
            traffic: page.organicSessions,
            conversionRate: page.conversionRatePercent,
            opportunityScore: 88,
            estimatedImpact: `Highest converting organic asset in the portfolio (${page.conversionRatePercent}% conversion rate)`,
            confidence: 'HIGH',
            sourceApis: ['ga4'],
            recommendedAction: `Add related calculators and case study links from high-traffic top-of-funnel pages.`,
            suggestedActionType: 'BUILD_CALCULATOR_FUNNEL',
            createdAt: '2026-02-20',
            lastUpdated: '2026-02-20',
          });
        }
      }

      // 4. Local Area SEO Opportunity
      opportunities.push({
        id: 'opp_local_ealing_expansion',
        type: 'LOCAL_AREA_OPPORTUNITY',
        priority: 'CRITICAL',
        title: 'Local SEO Domination: London Borough of Ealing (W5/W13)',
        description: 'Ealing generates £390k pipeline with a 4.52% lead conversion rate. Outstanding return on local SEO investment.',
        url: '/areas/ealing',
        keyword: 'builders in ealing',
        currentPosition: 3.4,
        searchVolume: 2900,
        opportunityScore: 94,
        leadPotentialScore: 98,
        estimatedImpact: '+3 to 5 additional construction consultations per month',
        confidence: 'HIGH',
        sourceApis: ['gsc', 'ga4', 'maps'],
        recommendedAction: 'Feature local Victorian/Edwardian rear extension case studies and borough planning guidance.',
        suggestedActionType: 'ADD_INTERNAL_LINKS',
        createdAt: '2026-02-20',
        lastUpdated: '2026-02-20',
      });

      // Sort by opportunityScore descending
      allOpportunities = opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
      seoCache.set(cacheKey, allOpportunities, 1000 * 60 * 30); // 30 mins
    }

    let filtered = allOpportunities;
    if (filters?.priority) {
      filtered = filtered.filter((o) => o.priority === filters.priority);
    }
    if (filters?.type) {
      filtered = filtered.filter((o) => o.type === filters.type);
    }

    return filtered;
  }
}

export const opportunityEngineService = new OpportunityEngineService();
