import prisma from '@/lib/prisma';

export interface HybridPerformanceStats {
  totalPredictions: number;
  mlAccuracy: number;
  hybridAccuracy: number;
  averageAdjustment: number;
  adjustmentAccuracy: number;
  byConfidenceLevel: {
    high: { total: number; correct: number; };
    medium: { total: number; correct: number; };
    low: { total: number; correct: number; };
  };
}

export class HybridPerformanceTracker {
  /**
   * Track a new prediction
   */
  static async trackPrediction(data: {
    matchId: string;
    predictedResult: string;
    mlConfidence: number;
    claudeAdjustment: number;
    finalConfidence: number;
  }) {
    await prisma.predictionPerformance.create({
      data: {
        matchId: data.matchId,
        predictedResult: data.predictedResult,
        mlConfidence: data.mlConfidence,
        claudeAdjustment: data.claudeAdjustment,
        finalConfidence: data.finalConfidence,
        wasCorrect: null, // Will be updated when match completes
        adjustmentHelpful: null // Will be updated when match completes
      }
    });
  }

  /**
   * Update prediction performance after match completion
   */
  static async updatePredictionResult(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { result: true }
    });

    if (!match?.result) return;

    const predictions = await prisma.predictionPerformance.findMany({
      where: { matchId }
    });

    await Promise.all(predictions.map(pred => {
      const wasCorrect = pred.predictedResult === match.result;
      const mlResult = this.getResultFromConfidence(pred.mlConfidence);
      const adjustmentHelpful = (
        wasCorrect && mlResult !== match.result
      ) || (
        !wasCorrect && mlResult === match.result
      );

      return prisma.predictionPerformance.update({
        where: { id: pred.id },
        data: {
          wasCorrect,
          adjustmentHelpful
        }
      });
    }));
  }

  /**
   * Get performance statistics
   */
  static async getPerformanceStats(days: number = 30): Promise<HybridPerformanceStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const predictions = await prisma.predictionPerformance.findMany({
      where: {
        createdAt: { gte: startDate },
        wasCorrect: { not: null }
      }
    });

    const stats = predictions.reduce((acc, pred) => {
      // Count total predictions
      acc.totalPredictions++;

      // Track correct predictions
      if (pred.wasCorrect) {
        acc.correctPredictions++;
      }

      // Track ML vs Hybrid accuracy
      const mlResult = this.getResultFromConfidence(pred.mlConfidence);
      if (mlResult === pred.predictedResult) {
        acc.mlCorrect++;
      }

      // Track adjustments
      acc.totalAdjustment += Math.abs(pred.claudeAdjustment);
      if (pred.adjustmentHelpful) {
        acc.helpfulAdjustments++;
      }

      // Track by confidence level
      const level = this.getConfidenceLevel(pred.finalConfidence);
      acc.byConfidence[level].total++;
      if (pred.wasCorrect) {
        acc.byConfidence[level].correct++;
      }

      return acc;
    }, {
      totalPredictions: 0,
      correctPredictions: 0,
      mlCorrect: 0,
      totalAdjustment: 0,
      helpfulAdjustments: 0,
      byConfidence: {
        high: { total: 0, correct: 0 },
        medium: { total: 0, correct: 0 },
        low: { total: 0, correct: 0 }
      }
    });

    return {
      totalPredictions: stats.totalPredictions,
      mlAccuracy: (stats.mlCorrect / stats.totalPredictions) * 100,
      hybridAccuracy: (stats.correctPredictions / stats.totalPredictions) * 100,
      averageAdjustment: stats.totalAdjustment / stats.totalPredictions,
      adjustmentAccuracy: (stats.helpfulAdjustments / stats.totalPredictions) * 100,
      byConfidenceLevel: stats.byConfidence
    };
  }

  private static getResultFromConfidence(confidence: number): string {
    return confidence >= 50 ? 'WIN' : 'LOSS';
  }

  private static getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
    if (confidence >= 80) return 'high';
    if (confidence >= 50) return 'medium';
    return 'low';
  }
}
