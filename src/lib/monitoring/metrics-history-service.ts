import prisma from '@/lib/prisma';

export class MetricsHistoryService {
  /**
   * Records current metrics to history
   */
  static async recordMetrics(metrics: {
    activeUsers: number;
    predictionAccuracy: number;
    totalPredictions: number;
    processedMatches: number;
  }) {
    return await prisma.metricsHistory.create({
      data: metrics
    });
  }

  /**
   * Fetches historical metrics for the specified time range
   */
  static async getHistoricalMetrics(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.metricsHistory.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });
  }

  /**
   * Cleans up old metrics data
   */
  static async cleanupOldMetrics(retentionDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    return await prisma.metricsHistory.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate
        }
      }
    });
  }
}
