import { Match } from '@/types/match';
import { OddsData } from '@/types/odds';
import { Prediction, PredictionInsights, PredictionType } from '@/types/prediction';
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
  authenticateUser,
  MockUser
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

/**
 * Mock implementation of the PredictionService
 */
export class MockPredictionService {
  async getPredictions(): Promise<Prediction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPredictions;
  }
  
  async getPredictionById(id: string): Promise<Prediction | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getPredictionById(id) || null;
  }
  
  async getPredictionsForMatch(matchId: string): Promise<Prediction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getPredictionsForMatch(matchId);
  }
  
  async getUserPredictions(userId: string): Promise<Prediction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getUserPredictions(userId);
  }
  
  async getSuccessfulPredictions(): Promise<Prediction[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    return getSuccessfulPredictions();
  }
  
  async getFailedPredictions(): Promise<Prediction[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    return getFailedPredictions();
  }
  
  async getPendingPredictions(): Promise<Prediction[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    return getPendingPredictions();
  }
  
  async calculateSuccessRate(userId?: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return calculateSuccessRate(userId);
  }
  
  async createPrediction(data: {
    userId: string;
    matchId: string;
    prediction: PredictionType;
    confidence: number;
    stake?: number;
    reasoning?: string;
  }): Promise<Prediction> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const match = getMatchById(data.matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    
    const newPrediction: Prediction = {
      id: Math.random().toString(36).substring(2, 15),
      userId: data.userId,
      matchId: data.matchId,
      prediction: data.prediction,
      confidence: data.confidence,
      stake: data.stake,
      odds: 2.0 + Math.random(),
      result: 'PENDING',
      reasoning: data.reasoning || 'No reasoning provided',
      aiSuggestion: 'This is a mock AI suggestion',
      insights: {
        factors: [
          {
            name: 'Recent Form',
            impact: Math.random() * 5,
            description: 'Analysis of recent form'
          },
          {
            name: 'Head to Head',
            impact: Math.random() * 5,
            description: 'Historical performance between these teams'
          }
        ],
        riskLevel: data.confidence > 70 ? 'LOW' : data.confidence > 40 ? 'MEDIUM' : 'HIGH',
        confidenceScore: data.confidence,
        additionalNotes: 'This is a mock prediction',
        recommendedBets: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock predictions
    mockPredictions.push(newPrediction);
    
    return newPrediction;
  }
}

/**
 * Mock implementation of the UserService
 */
export class MockUserService {
  async getUserById(id: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getUserById(id) || null;
  }
  
  async getUserByEmail(email: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getUserByEmail(email) || null;
  }
  
  async login(email: string, password: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return authenticateUser(email, password);
  }
  
  async register(data: {
    email: string;
    name: string;
    password: string;
  }): Promise<MockUser> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const existingUser = getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: MockUser = {
      id: Math.random().toString(36).substring(2, 15),
      email: data.email,
      name: data.name,
      password: data.password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock users
    mockUsers.push(newUser);
    
    return newUser;
  }
  
  async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
  }): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return null;
    }
    
    // Update user data
    if (data.name) {
      mockUsers[userIndex].name = data.name;
    }
    
    if (data.email) {
      // Check if email is already in use
      const existingUser = getUserByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use');
      }
      
      mockUsers[userIndex].email = data.email;
    }
    
    mockUsers[userIndex].updatedAt = new Date().toISOString();
    
    return mockUsers[userIndex];
  }
  
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return false;
    }
    
    // Verify current password
    if (mockUsers[userIndex].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    mockUsers[userIndex].password = newPassword;
    mockUsers[userIndex].updatedAt = new Date().toISOString();
    
    return true;
  }
}
