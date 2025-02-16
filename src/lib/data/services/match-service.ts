import { Match, TeamStats, H2HStats } from '@/types/match';
import { APIFootballClient } from '@/lib/data/providers/soccer/api-football';

class MatchService {
  private apiClient: APIFootballClient;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiClient = new APIFootballClient();
    this.cache = new Map();
  }

  async getMatches(date?: string): Promise<Match[]> {
    const cacheKey = `matches-${date || 'today'}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached as Match[];
    }

    const matches = await this.apiClient.getMatches(date || new Date().toISOString());
    this.setCache(cacheKey, matches);
    return matches;
  }

  async getH2H(team1Id: string, team2Id: string): Promise<H2HStats> {
    const cacheKey = `h2h-${team1Id}-${team2Id}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as H2HStats;
    }

    const h2hStats = await this.apiClient.getH2H(team1Id, team2Id);
    this.setCache(cacheKey, h2hStats);
    return h2hStats;
  }

  async getTeamStats(teamId: string): Promise<TeamStats> {
    const cacheKey = `team-stats-${teamId}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as TeamStats;
    }

    const teamStats = await this.apiClient.getTeamStats(teamId);
    this.setCache(cacheKey, teamStats);
    return teamStats;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export const matchService = new MatchService();
