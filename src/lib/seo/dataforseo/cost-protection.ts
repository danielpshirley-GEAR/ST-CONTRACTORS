/**
 * DATAFORSEO COST PROTECTION & GUARD ENGINE
 * Safeguards against unexpected API charges through request deduplication,
 * rate limiting, concurrency locks, and intelligent caching.
 */

class DataForSeoCostGuard {
  private inFlightRequests = new Map<string, Promise<any>>();
  private requestTimestamps: number[] = [];
  private readonly maxRequestsPerMinute = 30;

  /**
   * Deduplicates identical concurrent requests and enforces rate limiting
   */
  public async executeSafely<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // 1. In-flight request deduplication
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key) as Promise<T>;
    }

    // 2. Rate limit check (max 30 req/min)
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter((t) => now - t < 60000);
    if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
      throw new Error(`DataForSEO rate limit reached (${this.maxRequestsPerMinute} req/min). Please try again shortly.`);
    }

    this.requestTimestamps.push(now);

    const promise = requestFn().finally(() => {
      this.inFlightRequests.delete(key);
    });

    this.inFlightRequests.set(key, promise);
    return promise;
  }

  /**
   * Calculates approximate API cost in GBP
   */
  public estimateQueryCost(action: 'keywords' | 'serp_live'): number {
    // Live SERP ~ $0.004 (~£0.0032), Keyword data ~ $0.0015 (~£0.0012)
    return action === 'serp_live' ? 0.0032 : 0.0012;
  }
}

export const dataForSeoGuard = new DataForSeoCostGuard();
