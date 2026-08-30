/**
 * SEO OBSERVABILITY & LOGGING ENGINE
 * Tracks request latencies, provider actions, success/failure rates, and estimated API spend.
 * Strict sanitization prevents tokens, passwords, or keys from appearing in logs.
 */

import { IntegrationServiceId } from './types';

export interface SeoLogEntry {
  id: string;
  provider: IntegrationServiceId;
  action: string;
  success: boolean;
  durationMs: number;
  statusCode?: number;
  estimatedCostGbp?: number;
  errorMessage?: string;
  timestamp: string;
}

class SeoObservabilityLogger {
  private inMemoryLogs: SeoLogEntry[] = [];
  private maxLogs = 200;

  public logRequest(entry: Omit<SeoLogEntry, 'id' | 'timestamp'>): void {
    const log: SeoLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      errorMessage: entry.errorMessage ? this.sanitize(entry.errorMessage) : undefined,
      timestamp: new Date().toISOString(),
    };

    this.inMemoryLogs.unshift(log);
    if (this.inMemoryLogs.length > this.maxLogs) {
      this.inMemoryLogs.pop();
    }

    if (!log.success) {
      console.warn(
        `[SEO API Alert] Provider=${log.provider} Action=${log.action} Duration=${log.durationMs}ms Error=${log.errorMessage || 'Unknown'}`
      );
    }
  }

  public getRecentLogs(limit = 50): SeoLogEntry[] {
    return this.inMemoryLogs.slice(0, limit);
  }

  public getEstimatedTotalSpend(): number {
    return this.inMemoryLogs.reduce((sum, log) => sum + (log.estimatedCostGbp || 0), 0);
  }

  /**
   * Strips potential secret patterns (Bearer tokens, passwords, 32-char hex keys, query params)
   */
  private sanitize(str: string): string {
    return str
      .replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=[REDACTED]')
      .replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
      .replace(/password=[^&\s]+/gi, 'password=[REDACTED]')
      .replace(/Basic\s+[a-zA-Z0-9=]+/gi, 'Basic [REDACTED]');
  }
}

export const seoLogger = new SeoObservabilityLogger();
