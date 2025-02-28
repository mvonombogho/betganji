/**
 * Odds Provider
 * 
 * Simplified to use only The Odds API
 */

import { OddsData } from '@/types/odds';
import { oddsAPI } from './odds-api';

/**
 * OddsProvider Interface
 */
export interface OddsProvider {
  getLiveOdds(matchId: string): Promise<OddsData>;
  getHistoricalOdds(matchId: string): Promise<OddsData[]>;
}

/**
 * OddsProvider implementation
 * Single provider implementation using The Odds API
 */
export class OddsProvider {
  /**
   * Get live odds from The Odds API
   */
  async getLiveOdds(matchId: string): Promise<OddsData> {
    try {
      return await oddsAPI.getLiveOdds(matchId);
    } catch (error) {
      console.error('Error getting odds from The Odds API:', error);
      throw error;
    }
  }

  /**
   * Get historical odds
   * Note: The Odds API doesn't provide historical odds, so this would rely on our database
   */
  async getHistoricalOdds(matchId: string): Promise<OddsData[]> {
    try {
      return await oddsAPI.getHistoricalOdds(matchId);
    } catch (error) {
      console.error('Error getting historical odds:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const oddsProvider = new OddsProvider();
