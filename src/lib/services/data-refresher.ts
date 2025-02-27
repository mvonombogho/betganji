import { Match } from '@/types/match';
import { Prediction } from '@/types/prediction';
import { fetchMatches } from '../data/services/match-service';
import { fetchPredictions } from '../data/services/prediction-service';

/**
 * Service to handle data refreshing operations
 */
export class DataRefresher {
  /**
   * Refreshes match data from API sources
   */
  static async refreshMatches(): Promise<Match[]> {
    try {
      // This would interact with your data providers to get fresh data
      const matches = await fetchMatches();
      return matches;
    } catch (error) {
      console.error('Error refreshing matches:', error);
      throw error;
    }
  }

  /**
   * Refreshes prediction data and joins with match data
   */
  static async refreshPredictions(): Promise<Array<Prediction & { match: Match }>> {
    try {
      // Get fresh prediction data with match data joined
      const predictions = await fetchPredictions();
      return predictions;
    } catch (error) {
      console.error('Error refreshing predictions:', error);
      throw error;
    }
  }

  /**
   * Refreshes all data (matches and predictions)
   */
  static async refreshAll(): Promise<{
    matches: Match[];
    predictions: Array<Prediction & { match: Match }>;
  }> {
    try {
      // Run both refresh operations concurrently
      const [matches, predictions] = await Promise.all([
        this.refreshMatches(),
        this.refreshPredictions()
      ]);

      return { matches, predictions };
    } catch (error) {
      console.error('Error refreshing all data:', error);
      throw error;
    }
  }

  /**
   * Checks for matches that need to be updated (finished but not marked)
   */
  static async checkForUpdates(): Promise<{
    matchesNeedingUpdate: string[];
    predictionsNeedingSettlement: string[];
  }> {
    try {
      const matches = await this.refreshMatches();
      const predictions = await this.refreshPredictions();

      // Find matches that are finished but not marked as such in our database
      const matchesNeedingUpdate = matches
        .filter(match => match.status === 'FINISHED' && !match.processed)
        .map(match => match.id);

      // Find predictions for finished matches that haven't been settled
      const predictionsNeedingSettlement = predictions
        .filter(pred => 
          pred.match.status === 'FINISHED' && 
          pred.match.score &&
          !pred.settled
        )
        .map(pred => pred.id);

      return {
        matchesNeedingUpdate,
        predictionsNeedingSettlement
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      throw error;
    }
  }

  /**
   * Initialize the application with initial data
   */
  static async initialize(): Promise<{
    matches: Match[];
    predictions: Array<Prediction & { match: Match }>;
  }> {
    try {
      // Get initial data for the application
      return await this.refreshAll();
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }
}
