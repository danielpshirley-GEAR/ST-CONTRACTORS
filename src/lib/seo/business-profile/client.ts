/**
 * GOOGLE BUSINESS PROFILE CLIENT
 * Server-side OAuth client for Google My Business / Business Profile API.
 * Disabled by default until GBP_ENABLED=true and OAuth token acquired.
 */

import { seoLogger } from '../observability';

export class GoogleBusinessProfileClient {
  private isEnabled: boolean;
  private accountId?: string;

  constructor() {
    this.isEnabled = process.env.GBP_ENABLED === 'true';
    this.accountId = process.env.GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID;
  }

  public isConfigured(): boolean {
    return this.isEnabled && Boolean(this.accountId);
  }

  public async ping(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
    const start = Date.now();
    if (!this.isEnabled) {
      return {
        ok: true,
        message: 'Google Business Profile disabled (GBP_ENABLED=false)',
        latencyMs: Date.now() - start,
      };
    }

    if (!this.accountId) {
      return {
        ok: false,
        message: 'Credentials missing (GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID)',
        latencyMs: Date.now() - start,
      };
    }

    return {
      ok: true,
      message: `Configured for account ${this.accountId}`,
      latencyMs: Date.now() - start,
    };
  }
}

export const googleBusinessProfileClient = new GoogleBusinessProfileClient();
