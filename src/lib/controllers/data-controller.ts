import { DataRefresher } from '../services/data-refresher';
import { updateMatchScores } from '../data/services/match-service';
import { settlePredictions } from '../data/services/prediction-service';

/**
 * Controller to handle data refresh and update operations
 */
export class DataController {
  /**
   * Refreshes match data
   */
  static async refreshMatches() {
    try {
      return await DataRefresher.refreshMatches();
    } catch (error) {
      console.error('Error in refreshMatches controller:', error);
      throw error;
    }
  }

  /**
   * Refreshes prediction data
   */
  static async refreshPredictions() {
    try {
      return await DataRefresher.refreshPredictions();
    } catch (error) {
      console.error('Error in refreshPredictions controller:', error);
      throw error;
    }
  }

  /**
   * Refreshes all data and performs necessary updates
   */
  static async refreshAllData() {
    try {
      // Refresh all data
      const { matches, predictions } = await DataRefresher.refreshAll();
      
      // Check for updates needed
      const { 
        matchesNeedingUpdate, 
        predictionsNeedingSettlement 
      } = await DataRefresher.checkForUpdates();
      
      // Process any detected updates
      if (matchesNeedingUpdate.length > 0) {
        await updateMatchScores(matchesNeedingUpdate);
      }
      
      if (predictionsNeedingSettlement.length > 0) {
        await settlePredictions(predictionsNeedingSettlement);
      }
      
      return { 
        matches, 
        predictions,
        updatesProcessed: {
          matches: matchesNeedingUpdate.length,
          predictions: predictionsNeedingSettlement.length
        }
      };
    } catch (error) {
      console.error('Error in refreshAllData controller:', error);
      throw error;
    }
  }

  /**
   * Initialize application data
   */
  static async initialize() {
    try {
      // Initialize data
      const data = await DataRefresher.initialize();
      
      // Check for any updates needed at startup
      const { 
        matchesNeedingUpdate, 
        predictionsNeedingSettlement 
      } = await DataRefresher.checkForUpdates();
      
      // Process any detected updates
      if (matchesNeedingUpdate.length > 0) {
        await updateMatchScores(matchesNeedingUpdate);
      }
      
      if (predictionsNeedingSettlement.length > 0) {
        await settlePredictions(predictionsNeedingSettlement);
      }
      
      return {
        ...data,
        initialUpdatesProcessed: {
          matches: matchesNeedingUpdate.length,
          predictions: predictionsNeedingSettlement.length
        }
      };
    } catch (error) {
      console.error('Error in initialize controller:', error);
      throw error;
    }
  }

  /**
   * Check for and process any pending updates
   */
  static async processUpdates() {
    try {
      const { 
        matchesNeedingUpdate, 
        predictionsNeedingSettlement 
      } = await DataRefresher.checkForUpdates();
      
      // Process any detected updates
      if (matchesNeedingUpdate.length > 0) {
        await updateMatchScores(matchesNeedingUpdate);
      }
      
      if (predictionsNeedingSettlement.length > 0) {
        await settlePredictions(predictionsNeedingSettlement);
      }
      
      return {
        updatesProcessed: {
          matches: matchesNeedingUpdate.length,
          predictions: predictionsNeedingSettlement.length
        }
      };
    } catch (error) {
      console.error('Error in processUpdates controller:', error);
      throw error;
    }
  }
}
