import prisma from '@/lib/prisma';
import { TrainingPipeline } from './training-pipeline';

export class RetrainingScheduler {
  private static readonly MIN_MATCHES_FOR_RETRAINING = 50;
  private static readonly RETRAINING_INTERVAL_DAYS = 7;

  /**
   * Check if model needs retraining
   */
  static async shouldRetrain(): Promise<boolean> {
    try {
      // Check last training date
      const lastTraining = await prisma.modelTraining.findFirst({
        orderBy: {
          completedAt: 'desc'
        }
      });

      if (!lastTraining) return true;

      const daysSinceLastTraining = Math.floor(
        (Date.now() - lastTraining.completedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastTraining < this.RETRAINING_INTERVAL_DAYS) {
        return false;
      }

      // Check number of new matches since last training
      const newMatchesCount = await prisma.match.count({
        where: {
          status: 'COMPLETED',
          datetime: {
            gt: lastTraining.completedAt
          }
        }
      });

      return newMatchesCount >= this.MIN_MATCHES_FOR_RETRAINING;
    } catch (error) {
      console.error('Error checking retraining status:', error);
      return false;
    }
  }

  /**
   * Get matches for retraining
   */
  private static async getTrainingMatches(): Promise<string[]> {
    const matches = await prisma.match.findMany({
      where: {
        status: 'COMPLETED'
      },
      orderBy: {
        datetime: 'desc'
      },
      take: 1000, // Last 1000 matches
      select: {
        id: true
      }
    });

    return matches.map(m => m.id);
  }

  /**
   * Run retraining process
   */
  static async retrain(): Promise<boolean> {
    try {
      const pipeline = new TrainingPipeline();
      const matchIds = await this.getTrainingMatches();

      // Start training
      const trainingResult = await pipeline.trainModel(matchIds);

      if (trainingResult.success) {
        // Record training completion
        await prisma.modelTraining.create({
          data: {
            completedAt: new Date(),
            accuracy: trainingResult.metrics?.accuracy || 0,
            matchesUsed: matchIds.length
          }
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during retraining:', error);
      return false;
    }
  }
}
