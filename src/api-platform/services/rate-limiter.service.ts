import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { RateLimit } from "../domain/rate-limit";

@Injectable()
export class RateLimiterService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async checkLimit(apiKey: string, limit?: number): Promise<RateLimit> {
    const key = this.getRateLimitKey(apiKey);
    const cached = await this.cacheManager.get<RateLimit>(key);

    if (cached) {
      const rateLimit = new RateLimit(cached);

      // Check if window expired
      if (rateLimit.shouldReset()) {
        rateLimit.resetCounter();
        await this.cacheManager.set(key, rateLimit, rateLimit.window * 1000);
      }

      return rateLimit;
    }

    // Create new rate limit
    const rateLimit = RateLimit.createNew(apiKey, limit);
    await this.cacheManager.set(key, rateLimit, rateLimit.window * 1000);

    return rateLimit;
  }

  async incrementCounter(apiKey: string): Promise<RateLimit> {
    const rateLimit = await this.checkLimit(apiKey);

    if (!rateLimit.isExceeded()) {
      rateLimit.decrement();
      const key = this.getRateLimitKey(apiKey);
      await this.cacheManager.set(key, rateLimit, rateLimit.window * 1000);
    }

    return rateLimit;
  }

  async getRemainingQuota(apiKey: string): Promise<number> {
    const rateLimit = await this.checkLimit(apiKey);
    return rateLimit.remaining;
  }

  async resetCounter(apiKey: string): Promise<void> {
    const key = this.getRateLimitKey(apiKey);
    await this.cacheManager.del(key);
  }

  private getRateLimitKey(apiKey: string): string {
    const hour = Math.floor(Date.now() / 3600000);
    return `rate_limit:${apiKey}:${hour}`;
  }
}
