import { Match } from './match';

export interface Prediction {
  id: string;
  matchId: string;
  result: {
    home: number;
    away: number;
  };
  confidence: number;
  notes?: string;
  insights?: PredictionInsights;
  createdAt: string;
  match?: Match;
}

export interface PredictionInsights {
  factors: AnalysisFactor[];
  recommendedBets?: RecommendedBet[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  additionalNotes?: string;
}

export interface AnalysisFactor {
  name: string;
  impact: number; // -1 to 1
  description: string;
}

export interface RecommendedBet {
  market: string;
  selection: string;
  odds: number;
  stake: number;
  confidence: number;
}
