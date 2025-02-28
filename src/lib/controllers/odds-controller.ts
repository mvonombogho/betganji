import { Odds } from '@/types/odds';
import { fetchLatestOdds, updateOdds } from '../data/services/odds-service';
import { fetchUpcomingMatches } from '../data/services/match-service';
import { oddsAPI } from '../data/providers/odds/odds-api';

/**
 * Controller to handle odds-related operations
 * Simplified to use only The Odds API
 */
export class OddsController {
  /**
   * Refreshes odds data from The Odds API
   */
  static async refreshOdds(): Promise<Odds[]> {
    try {
      // Fetch upcoming matches for which we need to update odds
      const upcomingMatches = await fetchUpcomingMatches();
      
      // Create an array to store all odds
      const allOdds: Odds[] = [];
      
      // For each match, fetch the latest odds from The Odds API
      for (const match of upcomingMatches) {
        try {
          const oddsData = await oddsAPI.getLiveOdds(match.id);
          
          // Add to the array
          if (oddsData) {
            allOdds.push(oddsData);
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
   * Gets the best available odds for a match
   * Since we're only using one provider, this just returns the latest odds
   */
  static async getBestOddsForMatch(matchId: string): Promise<Odds | null> {
    try {
      const allOdds = await this.getOddsForMatch(matchId);
      
      if (allOdds.length === 0) {
        return null;
      }
      
      // Sort by timestamp (newest first)
      const sortedOdds = allOdds.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Return the most recent odds
      return sortedOdds[0];
    } catch (error) {
      console.error(`Error getting best odds for match ${matchId}:`, error);
      throw error;
    }
  }
}
