/**
 * GOOGLE PAGESPEED TYPES
 */

export interface PageSpeedApiLighthouseResult {
  categories: {
    performance?: { score: number };
    accessibility?: { score: number };
    'best-practices'?: { score: number };
    seo?: { score: number };
  };
  audits: {
    'largest-contentful-paint'?: { numericValue: number; displayValue: string };
    'cumulative-layout-shift'?: { numericValue: number; displayValue: string };
    'first-contentful-paint'?: { numericValue: number; displayValue: string };
    'speed-index'?: { numericValue: number; displayValue: string };
    'interactive'?: { numericValue: number; displayValue: string };
  };
}
