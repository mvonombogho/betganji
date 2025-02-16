import { OddsData, OddsHistory } from '@/types/odds';

export class OddsClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.ODDS_API_URL || 'https://api.odds-provider.com';
    this.apiKey = process.env.ODDS_API_KEY || '';
  }

  async getLiveOdds(matchId: string): Promise<OddsData> {
    try {
      const response = await fetch(`${this.baseUrl}/odds/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch odds: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live odds:', error);
      throw error;
    }
  }

  async getHistoricalOdds(matchId: string): Promise<OddsHistory> {
    try {
      const response = await fetch(`${this.baseUrl}/odds/${matchId}/history`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch historical odds: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching historical odds:', error);
      throw error;
    }
  }
}
