/**
 * HIGH-EFFICIENCY SEO CACHE ENGINE
 * In-memory & deterministic fallback caching with customizable TTLs per provider.
 * Prevents redundant third-party API spend and eliminates duplicate requests.
 */

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttlMs: number;
  source: 'live' | 'fallback';
}

class SeoMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  public get<T>(key: string): { data: T; isFresh: boolean; cachedAt: number } | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isFresh = Date.now() - entry.cachedAt < entry.ttlMs;
    return {
      data: entry.data,
      isFresh,
      cachedAt: entry.cachedAt,
    };
  }

  public set<T>(key: string, data: T, ttlMs: number, source: 'live' | 'fallback' = 'live'): void {
    this.cache.set(key, {
      data,
      cachedAt: Date.now(),
      ttlMs,
      source,
    });
  }

  public invalidate(keyOrPrefix: string): void {
    Array.from(this.cache.keys()).forEach((key) => {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const seoCache = new SeoMemoryCache();

// Recommended TTLs
export const SEO_CACHE_TTLS = {
  SEARCH_CONSOLE_QUERIES: 1000 * 60 * 60 * 2, // 2 hours
  ANALYTICS_CONVERSIONS: 1000 * 60 * 60 * 2, // 2 hours
  DATAFORSEO_KEYWORDS: 1000 * 60 * 60 * 24 * 7, // 7 days
  DATAFORSEO_SERP: 1000 * 60 * 60 * 24 * 2, // 48 hours
  PAGESPEED_AUDIT: 1000 * 60 * 60 * 24, // 24 hours
  GEOCODING_LOCATION: 1000 * 60 * 60 * 24 * 90, // 90 days
  AI_CONTENT_BRIEF: 1000 * 60 * 60 * 24 * 30, // 30 days
};
