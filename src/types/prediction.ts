import { Match } from './match';

export interface Prediction {
  id: string;
  matchId: string;
  match: Match;
  result: string;
  confidence: number;
  patterns?: PredictionPattern[];
  createdAt: Date;
  insights?: PredictionInsights;
}

export interface PredictionPattern {
  type: 'positive' | 'negative';
  description: string;
}

export interface PredictionInsights {
  rationale: string;
  keyFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface HistoricalData {
  accuracy: number;
  totalPredictions: number;
  recentTrend: {
    wins: number;
    total: number;
  };
}

export interface LeagueStats {
  totalPredictions: number;
  successRate: number;
  averageConfidence: number;
}