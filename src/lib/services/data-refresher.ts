import { Match } from '@/types/match';
import { getMatchesForDate } from '@/lib/data/services/match-service';
import { getOddsForMatch } from '@/lib/data/services/odds-service';
import prisma from '@/lib/db';

/**
 * Service for refreshing match data at regular intervals
 * This is a simplified implementation for personal use
 */
export class DataRefresher {
  private refreshInterval: NodeJS.Timeout | null = null;
  private intervalMinutes: number = 5; // Default 5 minute intervals
  private isRefreshing: boolean = false;
  private lastRefreshed: Date = new Date(0);

  constructor(intervalMinutes?: number) {
    if (intervalMinutes) {
      this.intervalMinutes = intervalMinutes;
    }
  }

  /**
   * Start the automatic refresh cycle
   */
  public start(): void {
    if (this.refreshInterval) {
      return; // Already running
    }
    
    console.log(`Starting data refresher with ${this.intervalMinutes} minute intervals`);
    
    // Do an initial refresh
    this.refreshData();
    
    // Set up the interval
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, this.intervalMinutes * 60 * 1000);
  }

  /**
   * Stop the automatic refresh cycle
   */
  public stop(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Data refresher stopped');
    }
  }

  /**
   * Change the refresh interval
   */
  public setInterval(minutes: number): void {
    this.intervalMinutes = minutes;
    
    if (this.refreshInterval) {
      this.stop();
      this.start();
    }
  }

  /**
   * Manually trigger a data refresh
   */
  public async refreshData(): Promise<void> {
    if (this.isRefreshing) {
      console.log('Refresh already in progress, skipping');
      return;
    }
    
    this.isRefreshing = true;
    try {
      console.log('Refreshing match data...');
      
      // Get today's date and yesterday's date (to catch any matches that finished late)
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Get matches for today and yesterday
      const todayMatches = await getMatchesForDate(today);
      const yesterdayMatches = await getMatchesForDate(yesterday);
      const allMatches = [...todayMatches, ...yesterdayMatches];
      
      console.log(`Found ${allMatches.length} matches to refresh`);
      
      // Update each match and its odds
      for (const match of allMatches) {
        await this.updateMatch(match);
      }
      
      this.lastRefreshed = new Date();
      console.log(`Data refresh completed at ${this.lastRefreshed.toISOString()}`);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Get the timestamp of the last refresh
   */
  public getLastRefreshed(): Date {
    return this.lastRefreshed;
  }

  /**
   * Update a single match and its associated data
   */
  private async updateMatch(match: Match): Promise<void> {
    try {
      // Focus on live or scheduled matches
      if (match.status === 'LIVE' || match.status === 'SCHEDULED') {
        // Update match data from API
        const updatedMatch = await this.fetchLatestMatchData(match.id);
        
        if (updatedMatch) {
          // Update in database
          await prisma.match.update({
            where: { id: match.id },
            data: {
              status: updatedMatch.status,
              // Update score if available
              ...(updatedMatch.score && {
                score: {
                  home: updatedMatch.score.home,
                  away: updatedMatch.score.away
                }
              })
            }
          });
          
          // Update odds for ongoing matches
          if (match.status === 'LIVE') {
            const latestOdds = await this.fetchLatestOdds(match.id);
            if (latestOdds) {
              await prisma.odds.create({
                data: {
                  matchId: match.id,
                  provider: latestOdds.provider,
                  homeWin: latestOdds.homeWin,
                  draw: latestOdds.draw,
                  awayWin: latestOdds.awayWin,
                  timestamp: new Date()
                }
              });
            }
          }
        }
      }
      
      // If match is finished, check predictions accuracy
      if (match.status === 'FINISHED' && match.score) {
        await this.updatePredictionAccuracy(match);
      }
    } catch (error) {
      console.error(`Error updating match ${match.id}:`, error);
    }
  }

  /**
   * Fetch latest match data from the external API
   */
  private async fetchLatestMatchData(matchId: string): Promise<Match | null> {
    // This would normally call your external API
    // Simplified mock implementation for now
    return null;
  }

  /**
   * Fetch latest odds data from the external API
   */
  private async fetchLatestOdds(matchId: string): Promise<{
    provider: string;
    homeWin: number;
    draw: number;
    awayWin: number;
  } | null> {
    // This would normally call your external odds API
    // Simplified mock implementation for now
    return null;
  }

  /**
   * Update the accuracy status of predictions for a finished match
   */
  private async updatePredictionAccuracy(match: Match): Promise<void> {
    if (!match.score) return;
    
    // Get all predictions for this match
    const predictions = await prisma.prediction.findMany({
      where: { matchId: match.id }
    });
    
    // Calculate actual result
    const actualResult = match.score.home > match.score.away ? 'HOME_WIN' :
                        match.score.home < match.score.away ? 'AWAY_WIN' : 'DRAW';
    
    // Update each prediction with accuracy
    for (const prediction of predictions) {
      const predictedHome = prediction.result.home;
      const predictedAway = prediction.result.away;
      
      const predictedResult = predictedHome > predictedAway ? 'HOME_WIN' :
                             predictedHome < predictedAway ? 'AWAY_WIN' : 'DRAW';
      
      const isCorrect = predictedResult === actualResult;
      
      // Update prediction with accuracy result
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: {
          accuracy: isCorrect ? 'CORRECT' : 'INCORRECT',
          // You might want to add more accuracy metrics here
        }
      });
    }
  }
}

// Singleton instance
let dataRefresher: DataRefresher | null = null;

export function getDataRefresher(intervalMinutes?: number): DataRefresher {
  if (!dataRefresher) {
    dataRefresher = new DataRefresher(intervalMinutes);
  }
  return dataRefresher;
}
