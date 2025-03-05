import { Match } from '@/types/match';
import { OddsData } from '@/types/odds';
import { Prediction, PredictionInsights } from '@/types/prediction';
import { 
  mockMatches, 
  getMatchById, 
  getUpcomingMatches, 
  getLiveMatches, 
  getFinishedMatches,
  getMatchesByTeam,
  getMatchesByCompetition
} from './matches';
import {
  mockOdds,
  getOddsForMatch,
  getBestOddsForMatch,
  getAverageOddsForMatch
} from './odds';
import {
  mockPredictions,
  getPredictionById,
  getPredictionsForMatch,
  getUserPredictions,
  getSuccessfulPredictions,
  getFailedPredictions,
  getPendingPredictions,
  calculateSuccessRate
} from './predictions';
import {
  mockUsers,
  getUserById,
  getUserByEmail,
  authenticateUser
} from './users';

/**
 * Mock implementation of the MatchService
 */
export class MockMatchService {
  async getMatches(date?: string): Promise<Match[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (date) {
      const targetDate = new Date(date);
      return mockMatches.filter(match => {
        const matchDate = new Date(match.datetime);
        return (
          matchDate.getFullYear() === targetDate.getFullYear() &&
          matchDate.getMonth() === targetDate.getMonth() &&
          matchDate.getDate() === targetDate.getDate()
        );
      });
    }
    
    return mockMatches;
  }
  
  async getMatchById(id: string): Promise<Match | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getMatchById(id) || null;
  }
  
  async getUpcomingMatches(): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getUpcomingMatches();
  }
  
  async getLiveMatches(): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getLiveMatches();
  }
  
  async getFinishedMatches(): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getFinishedMatches();
  }
  
  async getMatchesByTeam(teamId: string): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getMatchesByTeam(teamId);
  }
  
  async getMatchesByCompetition(competition: string): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getMatchesByCompetition(competition);
  }
}

/**
 * Mock implementation of the OddsService
 */
export class MockOddsService {
  async getOddsForMatch(matchId: string): Promise<OddsData[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getOddsForMatch(matchId);
  }
  
  async getBestOddsForMatch(matchId: string): Promise<OddsData | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getBestOddsForMatch(matchId) || null;
  }
  
  async getAverageOddsForMatch(matchId: string): Promise<OddsData | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getAverageOddsForMatch(matchId) || null;
  }
  
  async getLiveOdds(matchId: string): Promise<OddsData[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    // For mock purposes, we'll just return the regular odds
    return getOddsForMatch(matchId);
  }
}
