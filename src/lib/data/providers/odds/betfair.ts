/**
 * Betfair Provider
 * 
 * This module provides integration with Betfair Exchange API
 * Documentation: https://developer.betfair.com/
 */

import { OddsData } from '@/types/odds';

/**
 * Interface for Betfair Client
 */
export interface BetfairClient {
  getLiveOdds(matchId: string): Promise<OddsData>;
  getHistoricalOdds(matchId: string): Promise<OddsData[]>;
}

/**
 * Betfair API implementation
 * Fetches odds data from Betfair Exchange
 */
export class Betfair implements BetfairClient {
  private apiKey: string;
  private username: string;
  private password: string;
  private baseUrl: string;
  private sessionToken: string | null;

  constructor() {
    this.apiKey = process.env.BETFAIR_API_KEY || '';
    this.username = process.env.BETFAIR_USERNAME || '';
    this.password = process.env.BETFAIR_PASSWORD || '';
    this.baseUrl = 'https://api.betfair.com/exchange/betting/rest/v1.0';
    this.sessionToken = null;
    
    if (!this.apiKey || !this.username || !this.password) {
      console.warn('Betfair API credentials not fully set. Betfair functionality will not work.');
    }
  }

  /**
   * Get current live odds for a specific match
   */
  async getLiveOdds(matchId: string): Promise<OddsData> {
    try {
      // Ensure we have a valid session
      await this.ensureSession();
      
      // Map our internal matchId to Betfair's event ID
      // This would typically involve looking up the match in our database
      // and getting its Betfair event ID
      
      // Get market data for the match
      const marketData = await this.getMarketData(matchId);
      
      // Get price data for the market
      const priceData = await this.getPriceData(marketData.marketId);
      
      // Transform to our internal format
      return this.transformOddsResponse(matchId, marketData, priceData);
    } catch (error) {
      console.error(`Error fetching Betfair live odds for match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get historical odds for a specific match
   * Note: Betfair doesn't provide direct historical odds API
   */
  async getHistoricalOdds(matchId: string): Promise<OddsData[]> {
    try {
      console.warn('Historical odds are not directly available from Betfair API');
      
      // Here we would typically query our database for stored historical odds
      return [];
    } catch (error) {
      console.error(`Error fetching historical Betfair odds for match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Ensure we have a valid Betfair session
   */
  private async ensureSession(): Promise<void> {
    if (this.sessionToken) {
      return; // Already have a session
    }
    
    try {
      const response = await fetch(
        'https://identitysso-cert.betfair.com/api/certlogin', 
        {
          method: 'POST',
          headers: {
            'X-Application': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
        }
      );
      
      if (!response.ok) {
        throw new Error(`Betfair login error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'SUCCESS') {
        throw new Error(`Betfair login failed: ${data.error}`);
      }
      
      this.sessionToken = data.token;
    } catch (error) {
      console.error('Error establishing Betfair session:', error);
      throw error;
    }
  }

  /**
   * Get market data for a match
   */
  private async getMarketData(matchId: string): Promise<any> {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would query Betfair's API to get market data
      
      return {
        marketId: 'mock_market_id',
        eventId: matchId,
        marketName: 'Match Odds',
        runners: [
          { selectionId: 1, runnerName: 'Home Team' },
          { selectionId: 2, runnerName: 'Away Team' },
          { selectionId: 3, runnerName: 'Draw' }
        ]
      };
    } catch (error) {
      console.error(`Error getting Betfair market data for match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get price data for a market
   */
  private async getPriceData(marketId: string): Promise<any> {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would query Betfair's API to get price data
      
      return {
        marketId,
        runners: [
          { 
            selectionId: 1, 
            availableToBack: [{ price: 2.5, size: 100 }],
            availableToLay: [{ price: 2.55, size: 100 }]
          },
          { 
            selectionId: 2, 
            availableToBack: [{ price: 3.0, size: 100 }],
            availableToLay: [{ price: 3.05, size: 100 }]
          },
          { 
            selectionId: 3, 
            availableToBack: [{ price: 3.2, size: 100 }],
            availableToLay: [{ price: 3.25, size: 100 }]
          }
        ]
      };
    } catch (error) {
      console.error(`Error getting Betfair price data for market ${marketId}:`, error);
      throw error;
    }
  }

  /**
   * Transform Betfair data to our internal format
   */
  private transformOddsResponse(matchId: string, marketData: any, priceData: any): OddsData {
    // This is a placeholder transformation
    // In a real implementation, you would map Betfair's response to our internal format
    
    // Find the runners in the price data
    const homeRunner = priceData.runners.find((r: any) => r.selectionId === 1);
    const awayRunner = priceData.runners.find((r: any) => r.selectionId === 2);
    const drawRunner = priceData.runners.find((r: any) => r.selectionId === 3);
    
    // Get the best available back prices (highest odds available to back)
    const homeOdds = homeRunner?.availableToBack?.[0]?.price || 0;
    const awayOdds = awayRunner?.availableToBack?.[0]?.price || 0;
    const drawOdds = drawRunner?.availableToBack?.[0]?.price || 0;
    
    return {
      matchId,
      provider: 'betfair',
      homeWin: homeOdds,
      awayWin: awayOdds,
      draw: drawOdds,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const betfair = new Betfair();
