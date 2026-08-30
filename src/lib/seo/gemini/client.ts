/**
 * GEMINI API CLIENT
 * Low-level server-side client for Google Gemini Pro / Flash API.
 */

import { seoLogger } from '../observability';

export class GeminiClient {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  public async ping(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
    const start = Date.now();
    if (!this.isConfigured()) {
      return {
        ok: false,
        message: 'Credentials missing (GEMINI_API_KEY)',
        latencyMs: Date.now() - start,
      };
    }

    return {
      ok: true,
      message: 'Gemini AI API key configured for server-side reasoning',
      latencyMs: Date.now() - start,
    };
  }
}

export const geminiClient = new GeminiClient();
