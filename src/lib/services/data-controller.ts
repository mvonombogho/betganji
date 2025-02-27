import { getDataRefresher } from './data-refresher';

/**
 * Data controller for managing data refresh operations
 * This is used for initializing and controlling the data refresher service
 */
export class DataController {
  private static instance: DataController;
  private isInitialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the DataController
   */
  public static getInstance(): DataController {
    if (!DataController.instance) {
      DataController.instance = new DataController();
    }
    return DataController.instance;
  }

  /**
   * Initialize the data services (call this on app startup)
   */
  public initialize(options?: { refreshIntervalMinutes?: number }): void {
    if (this.isInitialized) {
      console.log('DataController already initialized');
      return;
    }

    console.log('Initializing DataController...');

    // Setup data refresher with options
    const refresher = getDataRefresher(options?.refreshIntervalMinutes);
    
    // Start the auto-refresh cycle
    refresher.start();

    // Mark as initialized
    this.isInitialized = true;
    console.log('DataController initialized successfully');
  }

  /**
   * Manually trigger a data refresh
   */
  public async refreshAllData(): Promise<void> {
    const refresher = getDataRefresher();
    await refresher.refreshData();
  }

  /**
   * Change the refresh interval
   */
  public setRefreshInterval(minutes: number): void {
    const refresher = getDataRefresher();
    refresher.setInterval(minutes);
  }

  /**
   * Get the last data refresh timestamp
   */
  public getLastRefreshed(): Date {
    const refresher = getDataRefresher();
    return refresher.getLastRefreshed();
  }

  /**
   * Shut down the data services (call this on app shutdown)
   */
  public shutdown(): void {
    if (!this.isInitialized) {
      return;
    }

    console.log('Shutting down DataController...');

    // Stop the data refresher
    const refresher = getDataRefresher();
    refresher.stop();

    this.isInitialized = false;
    console.log('DataController shutdown complete');
  }
}

// Export a convenience function to get the instance
export function getDataController(): DataController {
  return DataController.getInstance();
}
