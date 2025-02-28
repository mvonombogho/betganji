/**
 * OddsAPI Provider
 * 
 * This module provides integration with The Odds API service
 * Documentation: https://the-odds-api.com/
 */

import { OddsData } from '@/types/odds';

/**
 * Interface for OddsAPI Client
 */
export interface OddsAPIClient {
  getLiveOdds(matchId: string): Promise<OddsData>;
  getHistoricalOdds(matchId: string): Promise<OddsData[]>;
}

/**
 * OddsAPI implementation
 * Fetches odds data from The Odds API service
 */
export class OddsAPI implements OddsAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ODDS_API_KEY || '';
    this.baseUrl = 'https://api.the-odds-api.com/v4';
    
    if (!this.apiKey) {
      console.warn('ODDS_API_KEY not set. Odds API functionality will not work.');
    }
  }

  /**
   * Get current live odds for a specific match
   */
  async getLiveOdds(matchId: string): Promise<OddsData> {
    try {
      // Map our internal matchId to the format expected by The Odds API
      // This would typically involve looking up the match in our database
      // and getting its external ID or constructing the request correctly
      
      const response = await fetch(
        `${this.baseUrl}/sports/soccer/odds?apiKey=${this.apiKey}&regions=us,uk,eu&markets=h2h&oddsFormat=decimal&eventIds=${matchId}`
      );
      
      if (!response.ok) {
        throw new Error(`OddsAPI error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the API response to our internal OddsData format
      return this.transformOddsResponse(data);
    } catch (error) {
      console.error(`Error fetching live odds for match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Get historical odds for a specific match
   */
  async getHistoricalOdds(matchId: string): Promise<OddsData[]> {
    try {
      // Note: The Odds API may not provide historical odds out of the box
      // This would typically require storing odds data over time in our own database
      // For now, we'll return a placeholder implementation
      
      console.warn('Historical odds are not directly available from The Odds API');
      
      // Here we would typically query our database for stored historical odds
      return [];
    } catch (error) {
      console.error(`Error fetching historical odds for match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Transform odds data from The Odds API format to our internal format
   */
  private transformOddsResponse(apiResponse: any): OddsData {
    // Implement the transformation from the API's response format to our internal format
    // This is a placeholder implementation
    
    if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
      throw new Error('Invalid response from The Odds API');
    }
    
    const matchData = apiResponse[0]; // We expect a single match in the response
    
    // Extract the first bookmaker's odds
    const bookmaker = matchData.bookmakers && matchData.bookmakers.length > 0 
      ? matchData.bookmakers[0] 
      : null;
    
    if (!bookmaker) {
      throw new Error('No bookmaker data found in the response');
    }
    
    // Extract the H2H (head-to-head) market
    const h2hMarket = bookmaker.markets.find((market: any) => market.key === 'h2h');
    
    if (!h2hMarket) {
      throw new Error('No H2H market found in the response');
    }
    
    // Map outcomes to our format
    const homeOutcome = h2hMarket.outcomes.find((o: any) => o.name === matchData.home_team);
    const awayOutcome = h2hMarket.outcomes.find((o: any) => o.name === matchData.away_team);
    const drawOutcome = h2hMarket.outcomes.find((o: any) => o.name === 'Draw');
    
    return {
      matchId: matchData.id,
      provider: bookmaker.key,
      homeWin: homeOutcome ? homeOutcome.price : 0,
      awayWin: awayOutcome ? awayOutcome.price : 0,
      draw: drawOutcome ? drawOutcome.price : 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const oddsAPI = new OddsAPI();
