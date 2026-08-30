/**
 * GOOGLE ANALYTICS 4 TYPES
 */

export interface Ga4ReportOptions {
  startDate?: string;
  endDate?: string;
  dimensions?: string[];
  metrics?: string[];
  period?: '7d' | '28d' | '3m' | '6m' | '12m';
}

export interface Ga4RunReportResponse {
  rows?: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
}
