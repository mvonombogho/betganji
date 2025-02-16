import { Prediction, PredictionInsights } from '@/types/prediction';
import { DeepseekClient } from '@/lib/ai/deepseek/client';
import { PredictionEngine } from '@/lib/ai/prediction/engine';
import { matchService } from './match-service';
import { oddsService } from './odds-service';

class PredictionService {
  private deepseek: DeepseekClient;
  private engine: PredictionEngine;

  constructor() {
    this.deepseek = new DeepseekClient();
    this.engine = new PredictionEngine();
  }

  async createPrediction(data: {
    matchId: string;
    result: { home: number; away: number };
    confidence: number;
    notes?: string;
  }): Promise<Prediction> {
    // Gather all necessary data for analysis
    const [match, odds] = await Promise.all([
      matchService.getMatches().then(matches => 
        matches.find(m => m.id === data.matchId)
      ),
      oddsService.getLiveOdds(data.matchId)
    ]);

    if (!match) {
      throw new Error('Match not found');
    }

    // Generate AI insights
    const insights = await this.generateInsights({
      match,
      odds,
      prediction: data
    });

    // Create the prediction record
    const prediction: Prediction = {
      id: crypto.randomUUID(),
      matchId: data.matchId,
      result: data.result,
      confidence: data.confidence,
      notes: data.notes,
      insights,
      createdAt: new Date().toISOString(),
      match
    };

    // Here you would typically save to your database
    console.log('Created prediction:', prediction);

    return prediction;
  }

  private async generateInsights(data: {
    match: any;
    odds: any;
    prediction: any;
  }): Promise<PredictionInsights> {
    try {
      // Use the prediction engine to analyze the prediction
      const initialInsights = await this.engine.analyzePrediction(
        data.match,
        data.odds
      );

      // Enhance insights with DeepSeek analysis
      const enhancedInsights = await this.deepseek.generatePrediction(
        JSON.stringify({
          match: data.match,
          odds: data.odds,
          prediction: data.prediction,
          initialInsights
        })
      );

      return {
        ...initialInsights,
        ...enhancedInsights
      };
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return {
        factors: [],
        riskLevel: 'MEDIUM',
        confidenceScore: data.prediction.confidence,
        additionalNotes: 'Failed to generate detailed insights.'
      };
    }
  }

  async getPredictionHistory(): Promise<Prediction[]> {
    // Here you would typically fetch from your database
    // This is a mock implementation
    return [];
  }
}

export const predictionService = new PredictionService();
