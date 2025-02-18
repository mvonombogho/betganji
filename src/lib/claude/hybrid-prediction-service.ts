import { CalibratedModel } from '../ml/calibrated-model';
import { ClaudeMatchAnalyzer } from './match-analyzer';
import type { Match } from '@prisma/client';

export interface HybridPrediction {
  result: string;
  confidence: number;
  mlConfidence: number;
  claudeAdjustment: number;
  analysis: {
    factors: string[];
    reasoning: string;
    recommendations: string[];
  };
}

export class HybridPredictionService {
  private mlModel: CalibratedModel;

  constructor(mlModel: CalibratedModel) {
    this.mlModel = mlModel;
  }

  /**
   * Get combined prediction using both ML and Claude
   */
  async getPrediction(match: Match): Promise<HybridPrediction> {
    try {
      // Get ML model prediction
      const mlPrediction = await this.mlModel.predictWithCalibration(
        // ... feature extraction for the match
      );

      // Get predicted result
      const predictedResult = this.getResultFromProbabilities(mlPrediction);
      const mlConfidence = Math.max(...mlPrediction) * 100;

      // Get Claude's analysis
      const claudeAnalysis = await ClaudeMatchAnalyzer.analyzeMatch(match, {
        predictedResult,
        confidence: mlConfidence
      });

      // Combine confidences
      const adjustedConfidence = this.combineConfidences(
        mlConfidence,
        claudeAnalysis.confidenceAdjustment
      );

      return {
        result: predictedResult,
        confidence: adjustedConfidence,
        mlConfidence,
        claudeAdjustment: claudeAnalysis.confidenceAdjustment,
        analysis: {
          factors: claudeAnalysis.qualitativeFactors,
          reasoning: claudeAnalysis.reasoning,
          recommendations: claudeAnalysis.recommendations
        }
      };
    } catch (error) {
      console.error('Error in hybrid prediction:', error);
      throw error;
    }
  }

  private getResultFromProbabilities(probabilities: number[]): string {
    const results = ['HOME_WIN', 'DRAW', 'AWAY_WIN'];
    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    return results[maxIndex];
  }

  private combineConfidences(mlConfidence: number, claudeAdjustment: number): number {
    // Apply Claude's adjustment to ML confidence
    const adjustedConfidence = mlConfidence * (1 + claudeAdjustment);
    
    // Ensure confidence stays within 0-100 range
    return Math.min(100, Math.max(0, adjustedConfidence));
  }
}
