import { Match, MatchData, OddsData, Prediction, PredictionInsights } from '@/types';
import { DeepseekClient } from '../deepseek/client';
import { generateMatchPrompt, generateInsightsPrompt } from '../deepseek/prompts';

export class PredictionEngine {
  private deepseek: DeepseekClient;

  constructor() {
    this.deepseek = new DeepseekClient();
  }

  async analyzePrediction(matchData: MatchData, oddsData: OddsData): Promise<Prediction> {
    try {
      const prompt = generateMatchPrompt(matchData, oddsData);
      const response = await this.deepseek.generatePrediction(prompt);
      
      return this.parsePredictionResponse(response, matchData.id);
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw new Error('Failed to generate prediction');
    }
  }

  async generateInsights(prediction: Prediction): Promise<PredictionInsights> {
    try {
      const prompt = generateInsightsPrompt(prediction);
      const response = await this.deepseek.generatePrediction(prompt);
      
      return this.parseInsightsResponse(response);
    } catch (error) {
      console.error('Error generating insights:', error);
      throw new Error('Failed to generate insights');
    }
  }

  private parsePredictionResponse(response: any, matchId: string): Prediction {
    // Parse and validate the model's response
    const prediction: Prediction = {
      id: `pred_${Date.now()}`,
      matchId,
      result: response.result,
      confidence: response.confidence,
      insights: response.insights,
      createdAt: new Date(),
    };

    return prediction;
  }

  private parseInsightsResponse(response: any): PredictionInsights {
    // Parse and structure the insights
    return {
      keyFactors: response.keyFactors,
      riskAnalysis: response.riskAnalysis,
      confidenceExplanation: response.confidenceExplanation,
      additionalNotes: response.additionalNotes,
    };
  }
}

export const predictionEngine = new PredictionEngine();
