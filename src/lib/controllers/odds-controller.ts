import { Odds } from '@/types/odds';
import { fetchLatestOdds, updateOdds } from '../data/services/odds-service';
import { fetchUpcomingMatches } from '../data/services/match-service';

/**
 * Controller to handle odds-related operations
 */
export class OddsController {
  /**
   * Refreshes odds data from external bookmakers
   */
  static async refreshOdds(): Promise<Odds[]> {
    try {
      // Fetch upcoming matches for which we need to update odds
      const upcomingMatches = await fetchUpcomingMatches();
      
      // Create an array to store all odds
      const allOdds: Odds[] = [];
      
      // For each match, fetch the latest odds from providers
      for (const match of upcomingMatches) {
        try {
          const matchOdds = await fetchLatestOdds(match.id);
          
          // Add to the array
          if (matchOdds && matchOdds.length > 0) {
            allOdds.push(...matchOdds);
          }
        } catch (error) {
          console.error(`Error fetching odds for match ${match.id}:`, error);
          // Continue with the next match
        }
      }
      
      // Update odds in the database
      if (allOdds.length > 0) {
        await updateOdds(allOdds);
      }
      
      return allOdds;
    } catch (error) {
      console.error('Error in refreshOdds controller:', error);
      throw error;
    }
  }
  
  /**
   * Fetches odds for a specific match
   */
  static async getOddsForMatch(matchId: string): Promise<Odds[]> {
    try {
      // Fetch the latest odds for this match
      const odds = await fetchLatestOdds(matchId);
      return odds;
    } catch (error) {
      console.error(`Error getting odds for match ${matchId}:`, error);
      throw error;
    }
  }
  
  /**
   * Compares odds across different bookmakers for a match
   */
  static async compareOddsForMatch(matchId: string): Promise<Record<string, Odds>> {
    try {
      // Fetch the latest odds for this match from all providers
      const allOdds = await fetchLatestOdds(matchId);
      
      // Group by provider
      const oddsComparison: Record<string, Odds> = {};
      
      allOdds.forEach(odds => {
        oddsComparison[odds.provider] = odds;
      });
      
      return oddsComparison;
    } catch (error) {
      console.error(`Error comparing odds for match ${matchId}:`, error);
      throw error;
    }
  }
}
