/**
 * GOOGLE GEOCODING API CLIENT
 * Low-level server-side client for Google Geocoding web service.
 */

import { seoLogger } from '../observability';

export class GeocodingClient {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  public async ping(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
    const start = Date.now();
    if (!this.isConfigured()) {
      return {
        ok: false,
        message: 'Credentials missing (GOOGLE_MAPS_API_KEY)',
        latencyMs: Date.now() - start,
      };
    }

    return {
      ok: true,
      message: 'API Key configured for backend geocoding',
      latencyMs: Date.now() - start,
    };
  }
}

export const geocodingClient = new GeocodingClient();
