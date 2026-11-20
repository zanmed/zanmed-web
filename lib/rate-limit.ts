import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const globalRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, "10 m"),
      prefix: "rl:global",
      analytics: true,
    })
  : undefined;

export const publicPageRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(120, "1 m"),
      prefix: "rl:public",
      analytics: true,
    })
  : undefined;

export const uploadAuthRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(20, "10 m"),
      prefix: "rl:upload",
      analytics: true,
    })
  : undefined;

export const authRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(5, "15 m"),
      prefix: "rl:auth",
      analytics: true,
    })
  : undefined;

class SimpleRateLimiter {
  private readonly store = new Map<
    string,
    {
      count: number;
      reset: number;
    }
  >();

  private readonly max: number;
  private readonly window: number;
  private readonly name: string;

  constructor(max: number, windowMs: number, name: string) {
    this.max = max;
    this.window = windowMs;
    this.name = name;

    if (typeof window === "undefined") {
      setInterval(() => {
        const now = Date.now();

        for (const [key, record] of this.store.entries()) {
          if (now >= record.reset) {
            this.store.delete(key);
          }
        }
      }, 300_000);
    }
  }

  async limit(key: string) {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now >= record.reset) {
      const reset = now + this.window;

      this.store.set(key, {
        count: 1,
        reset,
      });

      return {
        success: true,
        limit: this.max,
        remaining: Math.max(0, this.max - 1),
        reset,
      };
    }

    if (record.count >= this.max) {
      console.warn(`[RateLimit:${this.name}] BLOCKED key=${key}`);

      return {
        success: false,
        limit: this.max,
        remaining: 0,
        reset: record.reset,
      };
    }

    record.count += 1;

    return {
      success: true,
      limit: this.max,
      remaining: Math.max(0, this.max - record.count),
      reset: record.reset,
    };
  }
}

export const fallbackGlobalRateLimiter = new SimpleRateLimiter(
  10,
  10 * 60 * 1000,
  "global",
);

export const fallbackPublicPageRateLimiter = new SimpleRateLimiter(
  120,
  60 * 1000,
  "public",
);

export const fallbackUploadAuthRateLimiter = new SimpleRateLimiter(
  20,
  10 * 60 * 1000,
  "upload",
);

export const fallbackAuthRateLimiter = new SimpleRateLimiter(
  5,
  15 * 60 * 1000,
  "auth",
);
