/**
 * SEO ENVIRONMENT CONFIGURATION & VALIDATION
 * Safe server-side environment checks. Never leaks credentials to logs or clients.
 */

import { IntegrationServiceId, IntegrationStatus } from './types';

export interface EnvValidationResult {
  serviceId: IntegrationServiceId;
  name: string;
  isConfigured: boolean;
  status: IntegrationStatus;
  missingVars: string[];
  configuredVars: string[];
}

export function getValidatedSeoConfig(): Record<IntegrationServiceId, EnvValidationResult> {
  // Google Search Console & OAuth
  const gscClientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID;
  const gscClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET;
  const gscSiteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  const gscConfigured = Boolean(gscClientId && gscClientSecret);

  // Google Analytics 4
  const ga4PropId = process.env.GA4_PROPERTY_ID || process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  const ga4Configured = Boolean(ga4PropId);

  // DataForSEO
  const dfLogin = process.env.DATAFORSEO_LOGIN;
  const dfPassword = process.env.DATAFORSEO_PASSWORD;
  const dfBaseUrl = process.env.DATAFORSEO_BASE_URL || 'https://api.dataforseo.com';
  const dfConfigured = Boolean(dfLogin && dfPassword);

  // PageSpeed Insights
  const pageSpeedKey = process.env.PAGESPEED_API_KEY || process.env.PAGESPEED_INSIGHTS_API_KEY;
  const pageSpeedConfigured = Boolean(pageSpeedKey);

  // Google Maps / Geocoding
  const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
  const mapsConfigured = Boolean(mapsKey);

  // Gemini AI
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiConfigured = Boolean(geminiKey);

  // Google Business Profile
  const gbpEnabled = process.env.GBP_ENABLED === 'true';
  const gbpAccountId = process.env.GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID;
  const gbpConfigured = gbpEnabled && Boolean(gbpAccountId);

  return {
    gsc: {
      serviceId: 'gsc',
      name: 'Google Search Console & OAuth',
      isConfigured: gscConfigured,
      status: gscConfigured ? 'connected' : 'not_configured',
      missingVars: [
        ...(!gscClientId ? ['GOOGLE_CLIENT_ID'] : []),
        ...(!gscClientSecret ? ['GOOGLE_CLIENT_SECRET'] : []),
      ],
      configuredVars: [
        ...(gscClientId ? ['GOOGLE_CLIENT_ID'] : []),
        ...(gscClientSecret ? ['GOOGLE_CLIENT_SECRET'] : []),
        ...(gscSiteUrl ? ['GOOGLE_SEARCH_CONSOLE_SITE_URL'] : []),
      ],
    },
    ga4: {
      serviceId: 'ga4',
      name: 'Google Analytics 4 Data API',
      isConfigured: ga4Configured,
      status: ga4Configured ? 'connected' : 'not_configured',
      missingVars: !ga4PropId ? ['GA4_PROPERTY_ID'] : [],
      configuredVars: ga4PropId ? ['GA4_PROPERTY_ID'] : [],
    },
    dataforseo: {
      serviceId: 'dataforseo',
      name: 'DataForSEO API',
      isConfigured: dfConfigured,
      status: dfConfigured ? 'connected' : 'not_configured',
      missingVars: [
        ...(!dfLogin ? ['DATAFORSEO_LOGIN'] : []),
        ...(!dfPassword ? ['DATAFORSEO_PASSWORD'] : []),
      ],
      configuredVars: [
        ...(dfLogin ? ['DATAFORSEO_LOGIN'] : []),
        ...(dfPassword ? ['DATAFORSEO_PASSWORD'] : []),
        ...(dfBaseUrl ? ['DATAFORSEO_BASE_URL'] : []),
      ],
    },
    pagespeed: {
      serviceId: 'pagespeed',
      name: 'Google PageSpeed Insights API',
      isConfigured: pageSpeedConfigured,
      status: pageSpeedConfigured ? 'connected' : 'not_configured',
      missingVars: !pageSpeedKey ? ['PAGESPEED_API_KEY'] : [],
      configuredVars: pageSpeedKey ? ['PAGESPEED_API_KEY'] : [],
    },
    maps: {
      serviceId: 'maps',
      name: 'Google Maps / Geocoding API',
      isConfigured: mapsConfigured,
      status: mapsConfigured ? 'connected' : 'not_configured',
      missingVars: !mapsKey ? ['GOOGLE_MAPS_API_KEY'] : [],
      configuredVars: mapsKey ? ['GOOGLE_MAPS_API_KEY'] : [],
    },
    gemini: {
      serviceId: 'gemini',
      name: 'Google Gemini AI Assistant',
      isConfigured: geminiConfigured,
      status: geminiConfigured ? 'connected' : 'not_configured',
      missingVars: !geminiKey ? ['GEMINI_API_KEY'] : [],
      configuredVars: geminiKey ? ['GEMINI_API_KEY'] : [],
    },
    gbp: {
      serviceId: 'gbp',
      name: 'Google Business Profile API',
      isConfigured: gbpConfigured,
      status: !gbpEnabled ? 'disabled' : gbpConfigured ? 'connected' : 'not_configured',
      missingVars: !gbpAccountId ? ['GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID'] : [],
      configuredVars: [
        ...(gbpAccountId ? ['GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID'] : []),
        'GBP_ENABLED',
      ],
    },
  };
}
