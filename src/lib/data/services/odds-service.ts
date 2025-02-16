import { OddsAPIClient } from '../providers/odds/odds-api';
import { OddsData } from '@/types/odds';
import { prisma } from '@/lib/prisma';

export class OddsService {
  private apiClient: OddsAPIClient;
  private cache: Map<string, { data: OddsData; timestamp: number }>;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiClient = new OddsAPIClient();
    this.cache = new Map();
  }

  async getMatchOdds(matchId: string): Promise<OddsData> {
    try {
      // Check cache first
      const cached = this.cache.get(matchId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // Get latest odds from API
      const liveOdds = await this.apiClient.getLiveOdds(matchId);

      // Update cache
      this.cache.set(matchId, {
        data: liveOdds,
        timestamp: Date.now()
      });

      // Store in database
      await this.storeOdds(liveOdds);

      return liveOdds;
    } catch (error) {
      console.error('Error in getMatchOdds:', error);
      
      // If API fails, try to get latest odds from database
      const latestOdds = await prisma.odds.findFirst({
        where: { matchId },
        orderBy: { timestamp: 'desc' }
      });

      if (!latestOdds) {
        throw new Error('No odds data available');
      }

      return latestOdds;
    }
  }

  private async storeOdds(odds: OddsData): Promise<void> {
    try {
      await prisma.odds.create({
        data: odds
      });
    } catch (error) {
      console.error('Error storing odds:', error);
      // Don't throw error here as this is a background operation
    }
  }
}
