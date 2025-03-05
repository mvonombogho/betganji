import { Prediction, PredictionInsights, PredictionResult, PredictionType } from '@/types/prediction';
import { mockMatches } from './matches';
import { mockUsers } from './users';

// Create IDs for mock data
const createId = () => Math.random().toString(36).substring(2, 15);

// Helper function to create realistic prediction insights
const createInsights = (confidence: number): PredictionInsights => {
  return {
    factors: [
      {
        name: 'Recent Form',
        impact: Math.random() * 5,
        description: 'Analysis of the last 5 matches for each team'
      },
      {
        name: 'Head to Head',
        impact: Math.random() * 5,
        description: 'Historical performance between these teams'
      },
      {
        name: 'Home Advantage',
        impact: Math.random() * 5,
        description: 'Statistical advantage of playing at home'
      },
      {
        name: 'Team Strength',
        impact: Math.random() * 5,
        description: 'Overall team quality and current squad status'
      },
      {
        name: 'Recent Injuries',
        impact: Math.random() * 5,
        description: 'Key player injuries and their impact'
      }
    ],
    riskLevel: confidence > 70 ? 'LOW' : confidence > 40 ? 'MEDIUM' : 'HIGH',
    confidenceScore: confidence,
    additionalNotes: `This prediction is based on comprehensive analysis of historical data, current form, and team news. The ${confidence > 70 ? 'high' : confidence > 40 ? 'moderate' : 'low'} confidence level reflects the ${confidence > 70 ? 'strong' : confidence > 40 ? 'reasonable' : 'uncertain'} indicators in our model.`,
    recommendedBets: [
      {
        market: 'Match Result',
        selection: confidence > 60 ? 'HOME_WIN' : confidence > 40 ? 'DRAW' : 'AWAY_WIN',
        odds: 1.8 + Math.random(),
        stake: 10,
        reasoning: 'Based on current form and historical performance'
      }
    ]
  };
};

// Generate predictions for matches
export const mockPredictions: Prediction[] = [];

// Helper function to determine prediction result based on match outcome
const determinePredictionResult = (
  match: any, 
  predictionType: PredictionType
): PredictionResult => {
  if (match.status !== 'FINISHED') return 'PENDING';
  
  switch (predictionType) {
    case 'HOME_WIN':
      return (match.homeScore! > match.awayScore!) ? 'WIN' : 'LOSS';
    case 'DRAW':
      return (match.homeScore === match.awayScore) ? 'WIN' : 'LOSS';
    case 'AWAY_WIN':
      return (match.homeScore! < match.awayScore!) ? 'WIN' : 'LOSS';
    case 'OVER_2_5':
      return ((match.homeScore! + match.awayScore!) > 2.5) ? 'WIN' : 'LOSS';
    case 'UNDER_2_5':
      return ((match.homeScore! + match.awayScore!) < 2.5) ? 'WIN' : 'LOSS';
    case 'BTTS_YES':
      return (match.homeScore! > 0 && match.awayScore! > 0) ? 'WIN' : 'LOSS';
    case 'BTTS_NO':
      return (match.homeScore! === 0 || match.awayScore! === 0) ? 'WIN' : 'LOSS';
    default:
      return 'PENDING';
  }
};

// Create predictions for the matches
mockMatches.forEach((match, index) => {
  // Only create predictions for some matches
  if (index % 3 !== 0) return;
  
  // Create prediction types
  const predictionTypes: PredictionType[] = ['HOME_WIN', 'DRAW', 'AWAY_WIN', 'OVER_2_5', 'UNDER_2_5', 'BTTS_YES', 'BTTS_NO'];
  
  // Create a prediction with a random type
  const predictionType = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];
  const confidence = Math.floor(Math.random() * 50) + 50; // 50-100
  const odds = 1.5 + (Math.random() * 3);
  
  // Assign to a random user
  const userIndex = Math.floor(Math.random() * mockUsers.length);
  
  mockPredictions.push({
    id: createId(),
    userId: mockUsers[userIndex].id,
    matchId: match.id,
    prediction: predictionType,
    confidence: confidence,
    stake: Math.floor(Math.random() * 50) + 10, // 10-60
    odds: parseFloat(odds.toFixed(2)),
    result: determinePredictionResult(match, predictionType),
    reasoning: `Based on our AI analysis, there's a ${confidence}% chance of this outcome.`,
    aiSuggestion: `Our AI model strongly suggests a ${confidence > 70 ? 'high' : confidence > 50 ? 'medium' : 'small'} stake on this selection.`,
    insights: createInsights(confidence),
    createdAt: new Date(new Date(match.datetime).getTime() - 86400000).toISOString(), // 1 day before match
    updatedAt: new Date(new Date(match.datetime).getTime() - 86400000).toISOString(),
  });
});

// Utility functions
export const getPredictionById = (id: string): Prediction | undefined => {
  return mockPredictions.find(prediction => prediction.id === id);
};

export const getPredictionsForMatch = (matchId: string): Prediction[] => {
  return mockPredictions.filter(prediction => prediction.matchId === matchId);
};

export const getUserPredictions = (userId: string): Prediction[] => {
  return mockPredictions.filter(prediction => prediction.userId === userId);
};

export const getSuccessfulPredictions = (): Prediction[] => {
  return mockPredictions.filter(prediction => prediction.result === 'WIN');
};

export const getFailedPredictions = (): Prediction[] => {
  return mockPredictions.filter(prediction => prediction.result === 'LOSS');
};

export const getPendingPredictions = (): Prediction[] => {
  return mockPredictions.filter(prediction => prediction.result === 'PENDING');
};

// Calculate success rate
export const calculateSuccessRate = (userId?: string): number => {
  const userPredictions = userId 
    ? mockPredictions.filter(p => p.userId === userId && (p.result === 'WIN' || p.result === 'LOSS'))
    : mockPredictions.filter(p => p.result === 'WIN' || p.result === 'LOSS');
  
  if (userPredictions.length === 0) return 0;
  
  const wins = userPredictions.filter(p => p.result === 'WIN').length;
  return parseFloat((wins / userPredictions.length * 100).toFixed(2));
};
