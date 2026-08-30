/**
 * UNIFIED INTEGRATION HEALTH CHECK RUNNER
 * Tests all 7 integrations with lightweight ping requests. Never leaks secrets.
 */

import { IntegrationHealthCheckResult } from './types';
import { searchConsoleClient } from './search-console';
import { googleAnalyticsClient } from './analytics';
import { dataForSeoClient } from './dataforseo';
import { pageSpeedClient } from './pagespeed';
import { geocodingClient } from './geocoding';
import { geminiClient } from './gemini';
import { googleBusinessProfileClient } from './business-profile';

export async function checkAllIntegrationHealth(): Promise<IntegrationHealthCheckResult[]> {
  const [gsc, ga4, df, ps, maps, gemini, gbp] = await Promise.all([
    searchConsoleClient.ping(),
    googleAnalyticsClient.ping(),
    dataForSeoClient.ping(),
    pageSpeedClient.ping(),
    geocodingClient.ping(),
    geminiClient.ping(),
    googleBusinessProfileClient.ping(),
  ]);

  const results: IntegrationHealthCheckResult[] = [
    {
      serviceId: 'gsc',
      name: 'Google Search Console API',
      status: gsc.ok ? 'PASS' : 'NOT_CONFIGURED',
      latencyMs: gsc.latencyMs,
      message: gsc.message,
      timestamp: new Date().toISOString(),
      troubleshooting: !gsc.ok
        ? {
            likelyReason: 'GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not provided in environment',
            recommendedFix: 'Add Google OAuth credentials in .env.local to enable real-time search queries',
            docsUrl: 'https://developers.google.com/webmaster-tools',
          }
        : undefined,
    },
    {
      serviceId: 'ga4',
      name: 'Google Analytics 4 Data API',
      status: ga4.ok ? 'PASS' : 'NOT_CONFIGURED',
      latencyMs: ga4.latencyMs,
      message: ga4.message,
      timestamp: new Date().toISOString(),
      troubleshooting: !ga4.ok
        ? {
            likelyReason: 'GA4_PROPERTY_ID not provided in environment',
            recommendedFix: 'Add your 9-digit Google Analytics Property ID in .env.local',
            docsUrl: 'https://developers.google.com/analytics/devguides/reporting/data/v1',
          }
        : undefined,
    },
    {
      serviceId: 'dataforseo',
      name: 'DataForSEO API',
      status: df.ok ? 'PASS' : 'NOT_CONFIGURED',
      latencyMs: df.latencyMs,
      message: df.message,
      timestamp: new Date().toISOString(),
      troubleshooting: !df.ok
        ? {
            likelyReason: 'DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD not set',
            recommendedFix: 'Add DataForSEO credentials to .env.local (supports sandbox.dataforseo.com for free development testing)',
            docsUrl: 'https://dataforseo.com/apis/serp-api',
          }
        : undefined,
    },
    {
      serviceId: 'pagespeed',
      name: 'Google PageSpeed Insights API',
      status: ps.ok ? 'PASS' : 'NOT_CONFIGURED',
      latencyMs: ps.latencyMs,
      message: ps.message,
      timestamp: new Date().toISOString(),
      troubleshooting: !ps.ok
        ? {
            likelyReason: 'PAGESPEED_API_KEY not configured',
            recommendedFix: 'Create a free PageSpeed Insights API key in Google Cloud Console',
            docsUrl: 'https://developers.google.com/speed/docs/insights/v5/get-started',
          }
        : undefined,
    },
    {
      serviceId: 'maps',
      name: 'Google Maps / Geocoding API',
      status: maps.ok ? 'PASS' : 'NOT_CONFIGURED',
      latencyMs: maps.latencyMs,
      message: maps.message,
      timestamp: new Date().toISOString(),
      troubleshooting: !maps.ok
        ? {
            likelyReason: 'GOOGLE_MAPS_API_KEY not configured',
            recommendedFix: 'Generate a restricted Google Geocoding API key for backend postcode resolution',
            docsUrl: 'https://developers.google.com/maps/documentation/geocoding',
          }
        : undefined,
    },
    {
      serviceId: 'gemini',
      name: 'Google Gemini AI Assistant',
      status: gemini.ok ? 'PASS' : 'NOT_CONFIGURED',
      latencyMs: gemini.latencyMs,
      message: gemini.message,
      timestamp: new Date().toISOString(),
      troubleshooting: !gemini.ok
        ? {
            likelyReason: 'GEMINI_API_KEY not provided',
            recommendedFix: 'Get a Gemini API Key from Google AI Studio and place it in .env.local',
            docsUrl: 'https://ai.google.dev',
          }
        : undefined,
    },
    {
      serviceId: 'gbp',
      name: 'Google Business Profile API',
      status: process.env.GBP_ENABLED === 'true' ? (gbp.ok ? 'PASS' : 'NOT_CONFIGURED') : 'DISABLED',
      latencyMs: gbp.latencyMs,
      message: gbp.message,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        likelyReason: 'Google Business Profile is kept disabled (GBP_ENABLED=false) until authorized',
        recommendedFix: 'Set GBP_ENABLED=true and provide GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID when ready',
      },
    },
  ];

  return results;
}
