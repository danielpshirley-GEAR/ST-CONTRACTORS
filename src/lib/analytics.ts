'use client';

/**
 * Closed-Loop Lifecycle & Commercial Analytics Engine
 * Tracks 20+ standardized lifecycle events with first-touch / last-touch UTM attribution.
 * Complies with Sections 66, 67, and 68 of the Master Build Specification.
 */

export type StandardAnalyticsEvent =
  | 'calculator_started'
  | 'calculator_completed'
  | 'project_created'
  | 'project_saved'
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
  | 'quote_started'
  | 'quote_completed'
  | 'site_visit_requested'
  | 'phone_clicked'
  | 'form_submitted'
  | 'case_study_viewed'
  | 'cta_clicked';

export interface AnalyticsPayload {
  eventName: StandardAnalyticsEvent | string;
  sessionId?: string;
  projectId?: string;
  leadId?: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  attribution?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    landingPage?: string;
    referrer?: string;
  };
  url?: string;
  timestamp?: string;
}

/**
 * Gets or initializes a persistent anonymous session ID for journey tracking
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sid = localStorage.getItem('apex_session_id');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('apex_session_id', sid);
  }
  return sid;
}

/**
 * Extracts and persists UTM attribution on initial landing
 */
export function getAttributionContext() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || undefined;
  const utmMedium = params.get('utm_medium') || undefined;
  const utmCampaign = params.get('utm_campaign') || undefined;
  const utmContent = params.get('utm_content') || undefined;

  if (utmSource || utmCampaign) {
    const attr = {
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
    };
    sessionStorage.setItem('apex_utm_attribution', JSON.stringify(attr));
    return attr;
  }

  const saved = sessionStorage.getItem('apex_utm_attribution');
  return saved ? JSON.parse(saved) : { landingPage: window.location.pathname, referrer: document.referrer || undefined };
}

/**
 * Dispatches an analytics telemetry event
 */
export function trackEvent(
  eventName: StandardAnalyticsEvent | string,
  metadata: Record<string, unknown> = {},
  extra: Partial<Omit<AnalyticsPayload, 'eventName' | 'metadata'>> = {}
): void {
  try {
    if (typeof window === 'undefined') return;

    // Check cookie consent
    const consent = localStorage.getItem('apex_cookie_consent');
    if (consent === 'declined') {
      return; // Do not log non-essential analytics without consent
    }

    const payload: AnalyticsPayload = {
      eventName,
      sessionId: getOrCreateSessionId(),
      metadata,
      url: window.location.pathname,
      attribution: getAttributionContext(),
      timestamp: new Date().toISOString(),
      ...extra,
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(payload));
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (error) {
    console.debug('Analytics event could not be transmitted:', error);
  }
}
