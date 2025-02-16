import { OddsClient } from '@/lib/data/providers/odds/odds-api';
import { BetfairClient } from '@/lib/data/providers/odds/betfair';
import { OddsData, OddsHistory } from '@/types/odds';

class OddsService {
  private oddsApi: OddsClient;
  private betfair: BetfairClient;
  private subscribers: Map<string, Set<(odds: OddsData) => void>>;

  constructor() {
    this.oddsApi = new OddsClient();
    this.betfair = new BetfairClient();
    this.subscribers = new Map();
  }

  async getLiveOdds(matchId: string): Promise<OddsData> {
    try {
      // Try primary provider first
      const odds = await this.oddsApi.getLiveOdds(matchId);
      return odds;
    } catch (error) {
      // Fallback to secondary provider
      console.warn('Primary odds provider failed, using fallback', error);
      return this.betfair.getLiveOdds(matchId);
    }
  }

  async getHistoricalOdds(matchId: string): Promise<OddsHistory> {
    try {
      return await this.oddsApi.getHistoricalOdds(matchId);
    } catch (error) {
      console.error('Failed to fetch historical odds', error);
      throw error;
    }
  }

  subscribeToOddsUpdates(matchId: string, callback: (odds: OddsData) => void): () => void {
    if (!this.subscribers.has(matchId)) {
      this.subscribers.set(matchId, new Set());
    }

    const matchSubscribers = this.subscribers.get(matchId)!;
    matchSubscribers.add(callback);

    // Set up WebSocket connection for real-time updates
    this.setupRealtimeUpdates(matchId);

    // Return cleanup function
    return () => {
      matchSubscribers.delete(callback);
      if (matchSubscribers.size === 0) {
        this.subscribers.delete(matchId);
        this.cleanupRealtimeUpdates(matchId);
      }
    };
  }

  private setupRealtimeUpdates(matchId: string) {
    // Implementation of WebSocket or other real-time connection
    // This is a placeholder for the actual implementation
    console.log(`Setting up real-time updates for match ${matchId}`);
  }

  private cleanupRealtimeUpdates(matchId: string) {
    // Cleanup WebSocket or other real-time connection
    console.log(`Cleaning up real-time updates for match ${matchId}`);
  }

  private notifySubscribers(matchId: string, odds: OddsData) {
    const subscribers = this.subscribers.get(matchId);
    if (subscribers) {
      subscribers.forEach(callback => callback(odds));
    }
  }
}

export const oddsService = new OddsService();
