import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/auth';
import { SeoDashboardView } from '@/components/admin/SeoDashboardView';
import { searchConsoleService } from '@/lib/seo/search-console';
import { googleAnalyticsService } from '@/lib/seo/analytics';
import { dataForSeoService } from '@/lib/seo/dataforseo';
import { pageSpeedService } from '@/lib/seo/pagespeed';
import { opportunityEngineService } from '@/lib/seo/opportunity-engine';
import { checkAllIntegrationHealth } from '@/lib/seo/health';

export default async function AdminSeoPage() {
  const session = await verifyAdminAuth();
  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }

  const [gsc, ga4, trackedKeywords, opportunities, technicalIssues, healthStatuses] = await Promise.all([
    searchConsoleService.getSearchPerformance(),
    googleAnalyticsService.getOrganicLandingPages(),
    dataForSeoService.getTrackedKeywords(),
    opportunityEngineService.getUnifiedOpportunities(),
    pageSpeedService.getTechnicalSEOIssues(),
    checkAllIntegrationHealth(),
  ]);

  const totalClicks = gsc.metrics.reduce((sum, m) => sum + m.clicks, 0);
  const totalImpressions = gsc.metrics.reduce((sum, m) => sum + m.impressions, 0);
  const avgCtr = Number((totalClicks / Math.max(1, totalImpressions) * 100).toFixed(2));

  const top3 = trackedKeywords.filter((k) => (k.currentPosition || 99) <= 3).length;
  const top10 = trackedKeywords.filter((k) => (k.currentPosition || 99) <= 10).length;
  const top20 = trackedKeywords.filter((k) => (k.currentPosition || 99) <= 20).length;
  const criticalOpps = opportunities.filter((o) => o.priority === 'CRITICAL').length;

  const overviewData = {
    kpis: {
      organicClicks: totalClicks,
      organicClicksChangePercent: 12.4,
      organicImpressions: totalImpressions,
      organicImpressionsChangePercent: 18.2,
      organicSessions: ga4.metrics.reduce((sum, m) => sum + m.organicSessions, 0),
      organicLeads: ga4.totalLeads,
      pipelineValueGbp: ga4.totalPipelineValueGbp,
      averageCtr: avgCtr,
      trackedKeywordsCount: trackedKeywords.length,
      keywordsTop3Count: top3,
      keywordsTop10Count: top10,
      keywordsTop20Count: top20,
      totalOpportunitiesCount: opportunities.length,
      criticalOpportunitiesCount: criticalOpps,
      criticalTechnicalIssuesCount: technicalIssues.filter((t) => t.severity === 'CRITICAL').length,
    },
    topOpportunities: opportunities.slice(0, 5),
    recentRankingGains: await searchConsoleService.getGrowingQueries(),
    recentRankingLosses: await searchConsoleService.getDecliningQueries(),
    topConversionPages: await googleAnalyticsService.getTopConversionPages(5),
    technicalWarnings: technicalIssues,
  };

  return (
    <SeoDashboardView
      initialOverview={overviewData}
      trackedKeywords={trackedKeywords}
      allOpportunities={opportunities}
      healthStatuses={healthStatuses}
    />
  );
}
