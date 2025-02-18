import prisma from '@/lib/prisma';

export class PredictionAnalytics {
  /**
   * Get prediction success rate by competition
   */
  static async getSuccessRateByCompetition() {
    const predictions = await prisma.prediction.findMany({
      where: {
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
      }
    });

    const competitionStats = predictions.reduce((acc, prediction) => {
      const competitionId = prediction.match.competition.id;
      const competitionName = prediction.match.competition.name;
      
      if (!acc[competitionId]) {
        acc[competitionId] = {
          name: competitionName,
          total: 0,
          correct: 0,
          successRate: 0
        };
      }

      acc[competitionId].total++;
      if (prediction.result === prediction.match.result) {
        acc[competitionId].correct++;
      }

      return acc;
    }, {});

    // Calculate success rates
    return Object.values(competitionStats).map(stat => ({
      ...stat,
      successRate: (stat.correct / stat.total) * 100
    }));
  }

  /**
   * Get prediction performance trends over time
   */
  static async getPerformanceTrends(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const predictions = await prisma.prediction.findMany({
      where: {
        match: {
          status: 'COMPLETED',
          datetime: {
            gte: startDate
          }
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
    const dailyStats = predictions.reduce((acc, prediction) => {
      const date = prediction.createdAt.toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          total: 0,
          correct: 0,
          accuracy: 0
        };
      }

      acc[date].total++;
      if (prediction.result === prediction.match.result) {
        acc[date].correct++;
      }

      return acc;
    }, {});

    // Calculate daily accuracy
    return Object.values(dailyStats).map(stat => ({
      ...stat,
      accuracy: (stat.correct / stat.total) * 100
    }));
  }

  /**
   * Analyze prediction accuracy by confidence score
   */
  static async getConfidenceScoreAnalysis() {
    const predictions = await prisma.prediction.findMany({
      where: {
        match: {
          status: 'COMPLETED'
        }
      },
      include: {
        match: true
      }
    });

    // Group predictions by confidence score ranges
    const confidenceRanges = {
      'Very High (90-100%)': { min: 90, max: 100 },
      'High (70-89%)': { min: 70, max: 89 },
      'Medium (50-69%)': { min: 50, max: 69 },
      'Low (0-49%)': { min: 0, max: 49 }
    };

    const analysis = Object.entries(confidenceRanges).reduce((acc, [range, { min, max }]) => {
      const rangePredictions = predictions.filter(
        p => p.confidence >= min && p.confidence <= max
      );

      const correct = rangePredictions.filter(
        p => p.result === p.match.result
      ).length;

      acc[range] = {
        total: rangePredict ions.length,
        correct,
        accuracy: rangePredict ions.length > 0 
          ? (correct / rangePredict ions.length) * 100
          : 0
      };

      return acc;
    }, {});

    return analysis;
  }
}
