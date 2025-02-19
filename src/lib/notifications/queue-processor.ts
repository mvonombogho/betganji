import prisma from '@/lib/prisma';
import { logger } from '../logging/logger';
import { emailService } from '../email/email-service';

export class NotificationQueueProcessor {
  /**
   * Process pending notifications
   */
  static async processPendingNotifications() {
    try {
      // Get due notifications
      const notifications = await prisma.notificationQueue.findMany({
        where: {
          status: 'PENDING',
          scheduledFor: {
            lte: new Date()
          }
        },
        include: {
          user: true
        }
      });

      logger.info(`Processing ${notifications.length} notifications`);

      // Process notifications in batches
      const batchSize = 10;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        await Promise.all(batch.map(this.processNotification));
      }

      return notifications.length;
    } catch (error) {
      logger.error('Error processing notifications', error as Error);
      throw error;
    }
  }

  /**
   * Process a single notification
   */
  private static async processNotification(notification: any) {
    try {
      // Send notification based on type
      let success = false;

      switch (notification.type) {
        case 'MATCH_ALERT':
          success = await emailService.sendMatchAlert(
            notification.user.email,
            notification.data
          );
          break;

        case 'PREDICTION_RESULT':
          success = await emailService.sendPredictionResult(
            notification.user.email,
            notification.data
          );
          break;
      }

      // Update notification status
      await prisma.notificationQueue.update({
        where: { id: notification.id },
        data: {
          status: success ? 'COMPLETED' : 'FAILED',
          processedAt: new Date(),
          error: success ? null : 'Failed to send email'
        }
      });

      return success;
    } catch (error) {
      logger.error('Error processing notification', error as Error, {
        notificationId: notification.id
      });

      // Update notification status
      await prisma.notificationQueue.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          processedAt: new Date(),
          error: (error as Error).message
        }
      });

      return false;
    }
  }
}
