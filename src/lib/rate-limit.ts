import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();
  const window = 60 * 1000; // 1 minute window
  const limit = 3; // 3 requests per window

  const key = `ratelimit:${identifier}`;
  const windowStart = Math.floor(now / window) * window;

  const [count] = await redis
    .pipeline()
    .incr(key)
    .expire(key, 60)
    .exec();

  const remaining = Math.max(0, limit - (count as number));
  const reset = windowStart + window;

  return {
    success: (count as number) <= limit,
    limit,
    remaining,
    reset,
  };
}
