import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cache keys
export const CACHE_KEYS = {
  LEAGUE_STATS: (leagueId: string) => `league:${leagueId}:stats`,
  LEAGUE_PERFORMANCE: (leagueId: string) => `league:${leagueId}:performance`,
  LEAGUE_MATCHES: (leagueId: string) => `league:${leagueId}:matches`,
  LEAGUE_TEAMS: (leagueId: string) => `league:${leagueId}:teams`,
  USER_PREDICTIONS: (userId: string) => `user:${userId}:predictions`,
};

// Default cache durations (in seconds)
export const CACHE_DURATIONS = {
  LEAGUE_STATS: 300, // 5 minutes
  LEAGUE_PERFORMANCE: 300,
  LEAGUE_MATCHES: 60, // 1 minute
  LEAGUE_TEAMS: 3600, // 1 hour
  USER_PREDICTIONS: 300,
};