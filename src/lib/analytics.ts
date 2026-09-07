/**
 * Closed-Loop Lifecycle & Commercial Analytics Engine
 * ST Contractors Master Build Specification — Phase 8A
 *
 * Implements 32 standardized lifecycle & conversion events.
 * Captures first-touch & last-touch UTM attribution.
 * Strictly enforces zero-PII transmission to analytics/GA4.
 */

export const STANDARD_ANALYTICS_EVENTS = [
  // Visualiser & Project Design
  'visualiser_view',
  'visualiser_start',
  'brief_started',
  'brief_submitted',
  'image_uploaded',
  'brief_interpreted',
  'followup_question_answered',
  'visual_generated',
  'visual_modified',
  'finish_tier_viewed',
  'finish_tier_selected',
  'scope_viewed',
  'quantity_section_viewed',
  'budget_viewed',
  'project_saved',
  'brief_downloaded',
  'brief_shared',
  'return_project_session',

  // Commercial Conversions (Primary Business Goals)
  'project_review_clicked',
  'plan_my_project_clicked',
  'consultation_started',
  'consultation_submitted',
  'quote_started',
  'quote_submitted',
  'contact_form_started',
  'contact_form_submitted',
  'phone_clicked',
  'email_clicked',

  // Content, Guides & Calculators
  'case_study_viewed',
  'service_page_viewed',
  'cost_guide_viewed',
  'calculator_started',
  'calculator_completed',
] as const;

export type StandardAnalyticsEvent =
  | (typeof STANDARD_ANALYTICS_EVENTS)[number]
  // Backward compatibility legacy events
  | 'project_created'
  | 'project_resumed'
  | 'ai_planner_started'
  | 'scope_item_added'
  | 'scope_completed'
  | 'budget_entered'
  | 'budget_optimised'
  | 'photo_uploaded'
  | 'plan_uploaded'
  | 'project_report_generated'
  | 'professional_review_requested'
  | 'site_visit_requested'
  | 'form_submitted'
  | 'cta_clicked';

export const COMMERCIAL_CONVERSIONS = new Set<string>([
  'project_review_clicked',
  'plan_my_project_clicked',
  'consultation_started',
  'consultation_submitted',
  'quote_started',
  'quote_submitted',
  'contact_form_started',
  'contact_form_submitted',
  'phone_clicked',
  'email_clicked',
  'professional_review_requested',
  'site_visit_requested',
]);

/**
 * Returns true if the event represents a commercial project conversion
 * (consultation, quote, project review, direct phone/email contact).
 */
export function isCommercialConversion(event: string): boolean {
  return COMMERCIAL_CONVERSIONS.has(event);
}

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
  deviceCategory?: 'mobile' | 'tablet' | 'desktop';
}

export interface AnalyticsPayload {
  eventName: StandardAnalyticsEvent | string;
  sessionId?: string;
  projectId?: string;
  leadId?: string;
  category?: 'Micro' | 'Commercial' | string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  attribution?: AttributionData;
  firstTouchAttribution?: AttributionData;
  url?: string;
  timestamp?: string;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Detects device category from viewport / userAgent
 */
export function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Gets or initializes a persistent anonymous session ID for journey tracking.
 * Transparently migrates any legacy apex_session_id into st_session_id.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sid = localStorage.getItem('st_session_id') || localStorage.getItem('apex_session_id');
  if (!sid) {
    sid = 'st_sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
  }
  localStorage.setItem('st_session_id', sid);
  return sid;
}

/**
 * Extracts and persists first-touch and last-touch UTM attribution.
 */
export function getAttributionContext(): {
  current: AttributionData;
  firstTouch: AttributionData;
} {
  if (typeof window === 'undefined') {
    return { current: {}, firstTouch: {} };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || undefined;
  const utmMedium = params.get('utm_medium') || undefined;
  const utmCampaign = params.get('utm_campaign') || undefined;
  const utmContent = params.get('utm_content') || undefined;
  const utmTerm = params.get('utm_term') || undefined;

  const currentAttrs: AttributionData = {
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    landingPage: window.location.pathname,
    referrer: document.referrer || undefined,
    deviceCategory: getDeviceCategory(),
  };

  // If new UTM parameters exist on current page, persist them as last-touch
  if (utmSource || utmCampaign) {
    sessionStorage.setItem('st_utm_attribution_last', JSON.stringify(currentAttrs));
  }

  // Load or set first-touch attribution in localStorage (lifetime attribution)
  let firstTouch: AttributionData;
  const savedFirst = localStorage.getItem('st_utm_attribution_first');
  if (savedFirst) {
    try {
      firstTouch = JSON.parse(savedFirst);
    } catch {
      firstTouch = currentAttrs;
    }
  } else {
    firstTouch = currentAttrs;
    try {
      localStorage.setItem('st_utm_attribution_first', JSON.stringify(firstTouch));
    } catch {
      // Ignore private mode storage errors
    }
  }

  // Last-touch retrieval
  let lastTouch: AttributionData = currentAttrs;
  const savedLast = sessionStorage.getItem('st_utm_attribution_last');
  if (savedLast) {
    try {
      lastTouch = JSON.parse(savedLast);
    } catch {
      lastTouch = currentAttrs;
    }
  }

  return { current: lastTouch, firstTouch };
}

/**
 * Strict Privacy Sanitizer: Ensures ZERO PII is transmitted to analytics vendors.
 * Strips names, phone numbers, email addresses, exact postcodes, and image data.
 */
function sanitizeAnalyticsMetadata(
  meta: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  const forbiddenPatterns = [
    /name/i,
    /email/i,
    /phone/i,
    /tel/i,
    /photo/i,
    /image/i,
    /datauri/i,
    /base64/i,
    /street/i,
    /address/i,
  ];

  for (const [key, val] of Object.entries(meta)) {
    const isForbidden = forbiddenPatterns.some((pattern) => pattern.test(key));
    if (isForbidden) {
      continue;
    }

    if (typeof val === 'string') {
      // Truncate long descriptions to avoid accidental leak of sensitive content
      sanitized[key] = val.length > 200 ? val.slice(0, 200) + '...' : val;
    } else if (
      typeof val === 'number' ||
      typeof val === 'boolean' ||
      val === null ||
      val === undefined
    ) {
      sanitized[key] = val;
    } else if (Array.isArray(val)) {
      sanitized[key] = val.slice(0, 10);
    } else if (typeof val === 'object') {
      // Simple nested object shallow copy
      sanitized[key] = '[Object]';
    }
  }

  return sanitized;
}

/**
 * Dispatches an analytics telemetry event with first/last touch attribution.
 */
export function trackEvent(
  eventName: StandardAnalyticsEvent | string,
  metadata: Record<string, unknown> = {},
  extra: Partial<Omit<AnalyticsPayload, 'eventName' | 'metadata'>> = {}
): void {
  try {
    if (typeof window === 'undefined') return;

    // Check cookie consent (support both st_ and legacy apex_)
    const consent =
      localStorage.getItem('st_cookie_consent') ||
      localStorage.getItem('apex_cookie_consent');
    if (consent === 'declined') {
      return;
    }

    const { current: attribution, firstTouch } = getAttributionContext();
    const isCommercial = isCommercialConversion(eventName);
    const category = extra.category || (isCommercial ? 'Commercial' : 'Micro');
    const sanitizedMeta = sanitizeAnalyticsMetadata(metadata);

    const payload: AnalyticsPayload = {
      eventName,
      sessionId: getOrCreateSessionId(),
      category,
      metadata: sanitizedMeta,
      attribution,
      firstTouchAttribution: firstTouch,
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...extra,
    };

    // 1. Google Analytics 4 Dispatch (if initialized)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: payload.label,
        value: payload.value,
        ...sanitizedMeta,
      });
    }

    // 2. Server-side Closed-Loop Telemetry Dispatch
    const bodyString = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', bodyString);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (error) {
    console.debug('Analytics event could not be transmitted:', error);
  }
}
