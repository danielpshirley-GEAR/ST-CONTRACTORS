import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/auth';
import { IntegrationsDashboardView } from '@/components/admin/IntegrationsDashboardView';
import { IntegrationServiceInfo } from '@/lib/seo/types';
import { searchConsoleClient } from '@/lib/seo/search-console';
import { googleAnalyticsClient } from '@/lib/seo/analytics';
import { dataForSeoClient } from '@/lib/seo/dataforseo';
import { pageSpeedClient } from '@/lib/seo/pagespeed';
import { geocodingClient } from '@/lib/seo/geocoding';
import { geminiClient } from '@/lib/seo/gemini';
import { googleBusinessProfileClient } from '@/lib/seo/business-profile';

export default async function AdminIntegrationsPage() {
  const session = await verifyAdminAuth();

  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }

  const isGbpEnabled = process.env.GBP_ENABLED === 'true';

  const services: IntegrationServiceInfo[] = [
    {
      id: 'gsc',
      name: 'Google Search Console & OAuth API',
      category: 'search_console',
      status: searchConsoleClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'GOOGLE_SEARCH_CONSOLE_SITE_URL'],
      description: 'Fetches search queries, impressions, CTR, average rankings, and URL indexing inspection data.',
      configuredEnvVarsCount: searchConsoleClient.isConfigured() ? 4 : 0,
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4 (GA4) Data API',
      category: 'analytics',
      status: googleAnalyticsClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['GA4_PROPERTY_ID'],
      description: 'Tracks organic landing page conversions through to calculator completions and consultation bookings.',
      configuredEnvVarsCount: googleAnalyticsClient.isConfigured() ? 1 : 0,
    },
    {
      id: 'dataforseo',
      name: 'DataForSEO API',
      category: 'keyword_data',
      status: dataForSeoClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD', 'DATAFORSEO_BASE_URL'],
      description: 'Live keyword search volume discovery, CPC rates, search intent classification, and SERP competitor audits.',
      configuredEnvVarsCount: dataForSeoClient.isConfigured() ? 3 : 0,
    },
    {
      id: 'pagespeed',
      name: 'Google PageSpeed Insights API',
      category: 'performance',
      status: pageSpeedClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['PAGESPEED_API_KEY'],
      description: 'Automated Core Web Vitals monitoring (LCP, FID/INP, CLS) for high-intent SEO pages.',
      configuredEnvVarsCount: pageSpeedClient.isConfigured() ? 1 : 0,
    },
    {
      id: 'maps',
      name: 'Google Maps / Geocoding API',
      category: 'maps',
      status: geocodingClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['GOOGLE_MAPS_API_KEY'],
      description: 'Postcode resolution, service radius verification, and regional construction pricing tier assignment.',
      configuredEnvVarsCount: geocodingClient.isConfigured() ? 1 : 0,
    },
    {
      id: 'gemini',
      name: 'Google Gemini AI SEO Assistant',
      category: 'ai',
      status: geminiClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['GEMINI_API_KEY'],
      description: 'AI keyword clustering, search intent analysis, and structured draft content brief generator.',
      configuredEnvVarsCount: geminiClient.isConfigured() ? 1 : 0,
    },
    {
      id: 'gbp',
      name: 'Google Business Profile API',
      category: 'search_console',
      status: !isGbpEnabled ? 'disabled' : googleBusinessProfileClient.isConfigured() ? 'connected' : 'not_configured',
      requiredEnvVars: ['GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID', 'GOOGLE_BUSINESS_PROFILE_LOCATION_ID', 'GBP_ENABLED'],
      description: 'Optional sync for Google reviews, local contractor ratings, and business hours.',
      configuredEnvVarsCount: googleBusinessProfileClient.isConfigured() ? 3 : 0,
    },
  ];

  return <IntegrationsDashboardView initialServices={services} />;
}
