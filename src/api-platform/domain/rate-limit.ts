export class RateLimit {
  apiKey: string;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  window: number; // Window size in seconds

  constructor(partial: Partial<RateLimit>) {
    Object.assign(this, partial);
    this.window = this.window || 3600; // Default 1 hour
  }

  static readonly DEFAULT_LIMIT = 1000;
  static readonly DEFAULT_WINDOW = 3600; // 1 hour in seconds

  isExceeded(): boolean {
    return this.remaining <= 0;
  }

  decrement(): void {
    if (this.remaining > 0) {
      this.remaining -= 1;
    }
  }

  resetCounter(): void {
    this.remaining = this.limit;
    this.reset = Math.floor(Date.now() / 1000) + this.window;
  }

  shouldReset(): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now >= this.reset;
  }

  getResetDate(): Date {
    return new Date(this.reset * 1000);
  }

  getRemainingSeconds(): number {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, this.reset - now);
  }

  getHeaders(): Record<string, string> {
    return {
      "X-RateLimit-Limit": this.limit.toString(),
      "X-RateLimit-Remaining": this.remaining.toString(),
      "X-RateLimit-Reset": this.reset.toString(),
    };
  }

  static createNew(apiKey: string, limit?: number, window?: number): RateLimit {
    const actualLimit = limit || RateLimit.DEFAULT_LIMIT;
    const actualWindow = window || RateLimit.DEFAULT_WINDOW;

    return new RateLimit({
      apiKey,
      limit: actualLimit,
      remaining: actualLimit,
      reset: Math.floor(Date.now() / 1000) + actualWindow,
      window: actualWindow,
    });
  }
}
