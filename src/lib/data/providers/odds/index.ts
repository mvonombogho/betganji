/**
 * Odds Provider Adapter
 * 
 * This module adapts and combines multiple odds providers into a unified interface
 */

import { OddsData } from '@/types/odds';
import { oddsAPI } from './odds-api';
import { betfair } from './betfair';

/**
 * OddsProvider Interface
 */
export interface OddsProvider {
  getLiveOdds(matchId: string): Promise<OddsData[]>;
  getHistoricalOdds(matchId: string): Promise<OddsData[]>;
  getBestOdds(matchId: string): Promise<OddsData>;
}

/**
 * OddsAdapter implementation
 * Combines multiple odds providers into a unified interface
 */
export class OddsAdapter implements OddsProvider {
  /**
   * Get live odds from all configured providers
   */
  async getLiveOdds(matchId: string): Promise<OddsData[]> {
    const results: OddsData[] = [];
    const errors: Error[] = [];
    
    // Try to get odds from The Odds API
    try {
      const oddsApiData = await oddsAPI.getLiveOdds(matchId);
      results.push(oddsApiData);
    } catch (error) {
      console.error('Error getting odds from OddsAPI:', error);
      errors.push(error as Error);
    }
    
    // Try to get odds from Betfair
    try {
      const betfairData = await betfair.getLiveOdds(matchId);
      results.push(betfairData);
    } catch (error) {
      console.error('Error getting odds from Betfair:', error);
      errors.push(error as Error);
    }
    
    // If all providers failed, throw an error
    if (results.length === 0 && errors.length > 0) {
      throw new Error(`All odds providers failed: ${errors.map(e => e.message).join(', ')}`);
    }
    
    return results;
  }

  /**
   * Get historical odds from all configured providers
   */
  async getHistoricalOdds(matchId: string): Promise<OddsData[]> {
    const results: OddsData[] = [];
    
    // Try to get historical odds from The Odds API
    try {
      const oddsApiData = await oddsAPI.getHistoricalOdds(matchId);
      results.push(...oddsApiData);
    } catch (error) {
      console.error('Error getting historical odds from OddsAPI:', error);
    }
    
    // Try to get historical odds from Betfair
    try {
      const betfairData = await betfair.getHistoricalOdds(matchId);
      results.push(...betfairData);
    } catch (error) {
      console.error('Error getting historical odds from Betfair:', error);
    }
    
    // Sort by timestamp (newest first)
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Get the best available odds across all providers
   */
  async getBestOdds(matchId: string): Promise<OddsData> {
    // Get odds from all providers
    const allOdds = await this.getLiveOdds(matchId);
    
    if (allOdds.length === 0) {
      throw new Error(`No odds available for match ${matchId}`);
    }
    
    // Initialize with the first set of odds
    let bestHomeWin = allOdds[0].homeWin;
    let bestAwayWin = allOdds[0].awayWin;
    let bestDraw = allOdds[0].draw;
    let homeProvider = allOdds[0].provider;
    let awayProvider = allOdds[0].provider;
    let drawProvider = allOdds[0].provider;
    
    // Find the best odds for each outcome
    for (const odds of allOdds) {
      if (odds.homeWin > bestHomeWin) {
        bestHomeWin = odds.homeWin;
        homeProvider = odds.provider;
      }
      
      if (odds.awayWin > bestAwayWin) {
        bestAwayWin = odds.awayWin;
        awayProvider = odds.provider;
      }
      
      if (odds.draw > bestDraw) {
        bestDraw = odds.draw;
        drawProvider = odds.provider;
      }
    }
    
    // Return the best odds
    return {
      matchId,
      provider: 'best', // Indicates these are the best odds from multiple providers
      homeWin: bestHomeWin,
      awayWin: bestAwayWin,
      draw: bestDraw,
      timestamp: new Date().toISOString(),
      // Include provider info
      meta: {
        homeProvider,
        awayProvider,
        drawProvider
      }
    };
  }
}

// Export singleton instance
export const oddsProvider = new OddsAdapter();
