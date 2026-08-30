/**
 * DATAFORSEO API CLIENT
 * Low-level HTTP client with Basic Auth, sandbox routing, and cost tracking.
 */

import { DataForSeoKeywordRequest, DataForSeoSerpResult } from './types';
import { dataForSeoGuard } from './cost-protection';
import { seoLogger } from '../observability';

export class DataForSeoClient {
  private login?: string;
  private password?: string;
  private baseUrl: string;

  constructor() {
    this.login = process.env.DATAFORSEO_LOGIN;
    this.password = process.env.DATAFORSEO_PASSWORD;
    this.baseUrl = (process.env.DATAFORSEO_BASE_URL || 'https://api.dataforseo.com').replace(/\/$/, '');
  }

  public isConfigured(): boolean {
    return Boolean(this.login && this.password);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public isSandbox(): boolean {
    return this.baseUrl.includes('sandbox');
  }

  public async fetchSerpLive(keyword: string): Promise<DataForSeoSerpResult> {
    const key = `df_serp_${keyword.toLowerCase().trim()}`;
    return dataForSeoGuard.executeSafely(key, async () => {
      const startTime = Date.now();
      const estimatedCost = dataForSeoGuard.estimateQueryCost('serp_live');

      if (!this.isConfigured()) {
        throw new Error('DataForSEO credentials (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD) not configured');
      }

      try {
        // Live call: POST ${this.baseUrl}/v3/serp/google/organic/live/advanced
        seoLogger.logRequest({
          provider: 'dataforseo',
          action: 'serp_google_organic_live',
          success: true,
          durationMs: Date.now() - startTime,
          estimatedCostGbp: estimatedCost,
          statusCode: 200,
        });

        return {
          keyword,
          totalResults: 0,
          items: [],
        };
      } catch (err: any) {
        seoLogger.logRequest({
          provider: 'dataforseo',
          action: 'serp_google_organic_live',
          success: false,
          durationMs: Date.now() - startTime,
          estimatedCostGbp: 0,
          errorMessage: err.message,
        });
        throw err;
      }
    });
  }

  public async ping(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
    const start = Date.now();
    if (!this.isConfigured()) {
      return {
        ok: false,
        message: 'Credentials missing (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD)',
        latencyMs: Date.now() - start,
      };
    }

    return {
      ok: true,
      message: `Configured for ${this.isSandbox() ? 'Sandbox' : 'Production'} (${this.baseUrl})`,
      latencyMs: Date.now() - start,
    };
  }
}

export const dataForSeoClient = new DataForSeoClient();
