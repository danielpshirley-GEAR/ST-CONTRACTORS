/**
 * GOOGLE SEARCH CONSOLE TYPES
 */

export interface SearchConsoleRawRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsolePerformanceOptions {
  startDate?: string;
  endDate?: string;
  dimensions?: Array<'query' | 'page' | 'device' | 'country' | 'date'>;
  rowLimit?: number;
  startRow?: number;
  period?: '7d' | '28d' | '3m' | '6m' | '12m' | 'custom';
}

export interface SearchConsoleUrlInspectionData {
  inspectionResult: {
    indexStatusResult?: {
      verdict?: 'PASS' | 'FAIL' | 'NEUTRAL';
      coverageState?: string;
      crawledAs?: string;
      lastCrawlTime?: string;
      indexingState?: string;
      canonicalUrl?: string;
    };
    mobileUsabilityResult?: {
      verdict?: 'PASS' | 'FAIL';
    };
  };
}
