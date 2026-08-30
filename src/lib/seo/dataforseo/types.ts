/**
 * DATAFORSEO TYPES
 */

export interface DataForSeoKeywordRequest {
  keyword: string;
  locationCode?: number; // 2826 = United Kingdom
  languageCode?: string; // en
}

export interface DataForSeoSerpItem {
  type: string;
  rankGroup: number;
  rankAbsolute: number;
  domain: string;
  title: string;
  url: string;
  description?: string;
  breadcrumb?: string;
}

export interface DataForSeoSerpResult {
  keyword: string;
  totalResults: number;
  items: DataForSeoSerpItem[];
  paaQuestions?: string[];
  featuredSnippet?: {
    domain: string;
    snippet: string;
  };
}
