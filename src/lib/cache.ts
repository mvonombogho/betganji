import { redis } from './redis';

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  duration: number = 300 // 5 minutes default
): Promise<T> {
  try {
    // Try to get data from cache
    const cachedData = await redis.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch fresh data
    const freshData = await fetchFn();

    // Store in cache
    await redis.set(key, freshData, {
      ex: duration
    });

    return freshData;
  } catch (error) {
    // If Redis fails, fallback to direct fetch
    console.error('Cache error:', error);
    return fetchFn();
  }
}

export async function invalidateCache(keys: string[]) {
  try {
    await Promise.all(keys.map(key => redis.del(key)));
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  duration: number = 300
) {
  try {
    await redis.set(key, data, {
      ex: duration
    });
  } catch (error) {
    console.error('Failed to set cache:', error);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return redis.get<T>(key);
  } catch (error) {
    console.error('Failed to get cache:', error);
    return null;
  }
}

export async function prefetchCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  duration: number = 300
) {
  try {
    const freshData = await fetchFn();
    await setCache(key, freshData, duration);
    return freshData;
  } catch (error) {
    console.error('Failed to prefetch cache:', error);
    return null;
  }
}