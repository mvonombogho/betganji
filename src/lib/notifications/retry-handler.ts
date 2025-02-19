import prisma from '@/lib/prisma';
import { logger } from '../logging/logger';

export class NotificationRetryHandler {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAYS = [5, 15, 30]; // minutes

  /**
   * Handle failed notification
   */
  static async handleFailure(notificationId: string, error: string) {
    try {
      // Get notification details
      const notification = await prisma.notificationQueue.findUnique({
        where: { id: notificationId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      const retryCount = notification.retryCount || 0;

      // Check if we should retry
      if (retryCount >= this.MAX_RETRIES) {
        // Mark as permanently failed
        await prisma.notificationQueue.update({
          where: { id: notificationId },
          data: {
            status: 'FAILED_PERMANENT',
            error: `Max retries exceeded. Last error: ${error}`
          }
        });

        logger.warn('Notification permanently failed', {
          notificationId,
          error,
          retryCount
        });

        return false;
      }

      // Schedule retry
      const delayMinutes = this.RETRY_DELAYS[retryCount];
      const retryTime = new Date();
      retryTime.setMinutes(retryTime.getMinutes() + delayMinutes);

      await prisma.notificationQueue.update({
        where: { id: notificationId },
        data: {
          status: 'PENDING',
          retryCount: retryCount + 1,
          scheduledFor: retryTime,
          error: `Retry ${retryCount + 1}/${this.MAX_RETRIES}. Previous error: ${error}`
        }
      });

      logger.info('Notification retry scheduled', {
        notificationId,
        retryCount: retryCount + 1,
        retryTime
      });

      return true;
    } catch (error) {
      logger.error('Error handling notification failure', error as Error, {
        notificationId
      });
      return false;
    }
  }

  /**
   * Clean up permanently failed notifications
   */
  static async cleanupFailedNotifications(olderThanDays: number = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await prisma.notificationQueue.deleteMany({
        where: {
          status: 'FAILED_PERMANENT',
          updatedAt: {
            lt: cutoffDate
          }
        }
      });

      logger.info('Cleaned up failed notifications', {
        deletedCount: result.count
      });

      return result.count;
    } catch (error) {
      logger.error('Error cleaning up failed notifications', error as Error);
      return 0;
    }
  }
}
