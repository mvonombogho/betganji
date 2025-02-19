import { emailService } from '../email/email-service';
import { logger } from '../logging/logger';
import prisma from '@/lib/prisma';

export class NotificationTriggers {
  /**
   * Trigger password reset notification
   */
  static async triggerPasswordReset(userId: string, resetToken: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user?.email) {
        throw new Error('User email not found');
      }

      await emailService.sendPasswordReset(user.email, resetToken);
      
      // Log success
      logger.info('Password reset email sent', { userId });
      return true;
    } catch (error) {
      logger.error('Failed to send password reset email', error as Error, { userId });
      return false;
    }
  }

  /**
   * Trigger match alert notifications
   */
  static async triggerMatchAlerts(matchId: string) {
    try {
      // Get match details
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
          predictions: {
            include: {
              user: true
            }
          }
        }
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Get users who have enabled match alerts
      const users = await prisma.user.findMany({
        where: {
          notificationSettings: {
            matchAlerts: true
          }
        }
      });

      // Send alerts
      const results = await Promise.all(
        users.map(user => {
          const userPrediction = match.predictions.find(p => p.userId === user.id);
          
          return emailService.sendMatchAlert(user.email, {
            homeTeam: match.homeTeam.name,
            awayTeam: match.awayTeam.name,
            competition: match.competition.name,
            datetime: match.datetime.toISOString(),
            prediction: userPrediction?.predictedResult || 'No prediction yet',
            confidence: userPrediction?.confidence || 0
          });
        })
      );

      // Log results
      logger.info('Match alerts sent', { 
        matchId, 
        sentCount: results.filter(Boolean).length,
        failedCount: results.filter(r => !r).length
      });

      return true;
    } catch (error) {
      logger.error('Failed to send match alerts', error as Error, { matchId });
      return false;
    }
  }

  /**
   * Trigger prediction result notifications
   */
  static async triggerPredictionResults(matchId: string) {
    try {
      // Get completed match with predictions
      const match = await prisma.match.findUnique({
        where: { 
          id: matchId,
          status: 'COMPLETED'
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          predictions: {
            include: {
              user: true
            }
          }
        }
      });

      if (!match) {
        throw new Error('Completed match not found');
      }

      // Send results to users who made predictions
      const results = await Promise.all(
        match.predictions.map(async prediction => {
          // Skip if user has disabled prediction notifications
          const settings = await prisma.notificationSettings.findUnique({
            where: { userId: prediction.userId }
          });
          
          if (!settings?.predictionResults) return null;

          const wasCorrect = prediction.predictedResult === match.result;

          return emailService.sendPredictionResult(prediction.user.email, {
            homeTeam: match.homeTeam.name,
            awayTeam: match.awayTeam.name,
            prediction: prediction.predictedResult,
            result: match.result!,
            wasCorrect,
            analysis: prediction.analysis?.reasoning || ''
          });
        })
      );

      // Log results
      logger.info('Prediction results sent', { 
        matchId, 
        sentCount: results.filter(Boolean).length,
        failedCount: results.filter(r => !r).length
      });

      return true;
    } catch (error) {
      logger.error('Failed to send prediction results', error as Error, { matchId });
      return false;
    }
  }
}
