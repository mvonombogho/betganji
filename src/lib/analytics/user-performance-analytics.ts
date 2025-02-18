import prisma from '@/lib/prisma';

export class UserPerformanceAnalytics {
  /**
   * Get user's overall prediction performance
   */
  static async getOverallPerformance(userId: string) {
    const predictions = await prisma.prediction.findMany({
      where: {
        userId,
        match: {
          status: 'COMPLETED'
        }
      },
      include: {
        match: {
          include: {
            competition: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate overall stats
    const stats = predictions.reduce((acc, pred) => {
      const isCorrect = pred.result === pred.match.result;
      
      acc.total++;
      if (isCorrect) acc.correct++;
      
      // Track by confidence level
      const confidenceLevel = this.getConfidenceLevel(pred.confidence);
      acc.byConfidence[confidenceLevel].total++;
      if (isCorrect) acc.byConfidence[confidenceLevel].correct++;
      
      // Track by competition
      const compId = pred.match.competition.id;
      if (!acc.byCompetition[compId]) {
        acc.byCompetition[compId] = {
          name: pred.match.competition.name,
          total: 0,
          correct: 0
        };
      }
      acc.byCompetition[compId].total++;
      if (isCorrect) acc.byCompetition[compId].correct++;

      return acc;
    }, {
      total: 0,
      correct: 0,
      byConfidence: {
        high: { total: 0, correct: 0 },    // 80-100%
        medium: { total: 0, correct: 0 },   // 50-79%
        low: { total: 0, correct: 0 }       // 0-49%
      },
      byCompetition: {}
    });

    return {
      predictions,
      stats
    };
  }

  /**
   * Get user's prediction trends over time
   */
  static async getPredictionTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const predictions = await prisma.prediction.findMany({
      where: {
        userId,
        match: {
          status: 'COMPLETED'
        },
        createdAt: {
          gte: startDate
        }
      },
      include: {
        match: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by date
    const trends = predictions.reduce((acc, pred) => {
      const date = pred.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          correct: 0,
          accuracy: 0
        };
      }

      acc[date].total++;
      if (pred.result === pred.match.result) {
        acc[date].correct++;
      }
      acc[date].accuracy = (acc[date].correct / acc[date].total) * 100;

      return acc;
    }, {});

    return Object.values(trends);
  }

  private static getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
    if (confidence >= 80) return 'high';
    if (confidence >= 50) return 'medium';
    return 'low';
  }
}
