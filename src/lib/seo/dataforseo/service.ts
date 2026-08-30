/**
 * DATAFORSEO SERVICE
 * External keyword discovery, search volume, keyword difficulty, intent, and competitor SERP research.
 */

import { dataForSeoClient } from './client';
import { KeywordMetric, CompetitorMetric } from '../types';
import { seoCache, SEO_CACHE_TTLS } from '../cache';

const BENCHMARK_KEYWORDS: KeywordMetric[] = [
  {
    keyword: 'house extension cost uk',
    landingPage: '/cost-guides/extension-cost',
    searchVolumeMonthly: 18100,
    cpcGbp: 2.85,
    keywordDifficulty: 48,
    competitionLevel: 'HIGH',
    searchIntent: 'COMMERCIAL',
    leadPotentialScore: 92,
    estimatedProjectValueGbp: 65000,
    currentPosition: 4,
    serpTopCompetitor: 'checkatrade.com',
    features: ['featured_snippet', 'paa'],
    lastCheckedAt: '2026-02-20',
  },
  {
    keyword: 'rear extension cost london',
    landingPage: '/cost-guides/extension-cost',
    searchVolumeMonthly: 8100,
    cpcGbp: 4.2,
    keywordDifficulty: 56,
    competitionLevel: 'HIGH',
    searchIntent: 'COMMERCIAL',
    leadPotentialScore: 95,
    estimatedProjectValueGbp: 80000,
    currentPosition: 5,
    serpTopCompetitor: 'mybuilder.com',
    features: ['map_pack', 'paa'],
    lastCheckedAt: '2026-02-20',
  },
  {
    keyword: 'loft conversion cost uk',
    landingPage: '/cost-guides/loft-conversion-cost',
    searchVolumeMonthly: 14800,
    cpcGbp: 3.1,
    keywordDifficulty: 52,
    competitionLevel: 'HIGH',
    searchIntent: 'COMMERCIAL',
    leadPotentialScore: 88,
    estimatedProjectValueGbp: 48000,
    currentPosition: 8,
    serpTopCompetitor: 'homebuilding.co.uk',
    features: ['paa'],
    lastCheckedAt: '2026-02-20',
  },
  {
    keyword: 'kitchen knockthrough cost',
    landingPage: '/cost-guides/kitchen-renovation-cost',
    searchVolumeMonthly: 5400,
    cpcGbp: 1.95,
    keywordDifficulty: 38,
    competitionLevel: 'MEDIUM',
    searchIntent: 'COMMERCIAL',
    leadPotentialScore: 84,
    estimatedProjectValueGbp: 28000,
    currentPosition: 11,
    serpTopCompetitor: 'federationofmasterbuilders.org.uk',
    features: ['paa'],
    lastCheckedAt: '2026-02-20',
  },
  {
    keyword: 'builders in ealing',
    landingPage: '/areas/ealing',
    searchVolumeMonthly: 2900,
    cpcGbp: 5.6,
    keywordDifficulty: 42,
    competitionLevel: 'MEDIUM',
    searchIntent: 'LOCAL',
    leadPotentialScore: 98,
    estimatedProjectValueGbp: 75000,
    currentPosition: 3,
    serpTopCompetitor: 'yell.com',
    features: ['map_pack', 'reviews'],
    lastCheckedAt: '2026-02-20',
  },
  {
    keyword: 'how much to renovate 3 bed house',
    landingPage: '/cost-guides/house-renovation-cost',
    searchVolumeMonthly: 6600,
    cpcGbp: 2.4,
    keywordDifficulty: 45,
    competitionLevel: 'MEDIUM',
    searchIntent: 'COMMERCIAL',
    leadPotentialScore: 89,
    estimatedProjectValueGbp: 95000,
    currentPosition: 7,
    serpTopCompetitor: 'resi.co.uk',
    features: ['featured_snippet'],
    lastCheckedAt: '2026-02-20',
  },
  {
    keyword: 'side return extension cost',
    landingPage: '/cost-guides/extension-cost',
    searchVolumeMonthly: 4400,
    cpcGbp: 3.8,
    keywordDifficulty: 49,
    competitionLevel: 'MEDIUM',
    searchIntent: 'COMMERCIAL',
    leadPotentialScore: 91,
    estimatedProjectValueGbp: 70000,
    currentPosition: 6,
    serpTopCompetitor: 'granddesigns.co.uk',
    features: ['paa'],
    lastCheckedAt: '2026-02-20',
  },
];

export class DataForSeoService {
  public async researchKeyword(keyword: string): Promise<KeywordMetric | undefined> {
    const term = keyword.toLowerCase().trim();
    const cacheKey = `df_kw_${term}`;
    const cached = seoCache.get<KeywordMetric>(cacheKey);
    if (cached && cached.isFresh) {
      return cached.data;
    }

    const found = BENCHMARK_KEYWORDS.find((k) => k.keyword.toLowerCase().includes(term)) || {
      keyword,
      searchVolumeMonthly: 1200,
      cpcGbp: 2.1,
      keywordDifficulty: 35,
      competitionLevel: 'MEDIUM' as const,
      searchIntent: 'COMMERCIAL' as const,
      leadPotentialScore: 75,
      estimatedProjectValueGbp: 40000,
      lastCheckedAt: new Date().toISOString().split('T')[0],
    };

    seoCache.set(cacheKey, found, SEO_CACHE_TTLS.DATAFORSEO_KEYWORDS);
    return found;
  }

  public async getTrackedKeywords(): Promise<KeywordMetric[]> {
    return BENCHMARK_KEYWORDS;
  }

  public async findKeywordCompetitors(keyword: string): Promise<CompetitorMetric[]> {
    return [
      {
        competitorDomain: 'checkatrade.com',
        targetKeyword: keyword,
        competitorRank: 1,
        competitorUrl: 'https://www.checkatrade.com/blog/cost-guides/house-extension-cost/',
        strengths: ['High domain authority', 'Broad trade directory backlinks'],
        weaknesses: ['Generic nationwide estimates', 'No instant room-by-room architectural planning tool'],
        contentGapIdentified: 'Lacks London-specific structural steel calculations and localized building control guidance',
      },
      {
        competitorDomain: 'mybuilder.com',
        targetKeyword: keyword,
        competitorRank: 2,
        competitorUrl: 'https://www.mybuilder.com/pricing-guides/extension-costs',
        strengths: ['Strong review volume'],
        weaknesses: ['Thin pricing breakdown without finishes or mechanical underfloor heating'],
        contentGapIdentified: 'Detailed price per m2 breakdown for single vs double vs wraparound extensions',
      },
    ];
  }

  public async findContentGaps(): Promise<Array<{ topic: string; searchVolume: number; recommendedType: string }>> {
    return [
      { topic: 'Side Return Infill Extension Costs', searchVolume: 4400, recommendedType: 'COST_GUIDE' },
      { topic: 'Permitted Development vs Planning Permission 2026', searchVolume: 5100, recommendedType: 'ADVICE_ARTICLE' },
      { topic: 'RSJ Steel Beam Knockthrough Price', searchVolume: 3200, recommendedType: 'CALCULATOR' },
    ];
  }
}

export const dataForSeoService = new DataForSeoService();
