import prisma from '@/lib/prisma';
import { NotificationSettings } from './notification-settings';
import { emailService } from '../email/email-service';
import { logger } from '../logging/logger';

interface QueuedNotification {
  userId: string;
  type: string;
  data: any;
  scheduledFor: Date;
}

export class NotificationScheduler {
  /**
   * Queue a notification based on user preferences
   */
  static async queueNotification(
    userId: string,
    type: string,
    data: any
  ) {
    try {
      // Get user's notification preferences
      const preferences = await NotificationSettings.getUserPreferences(userId);

      // Skip if notification type is disabled
      if (!preferences[type as keyof typeof preferences]) {
        return null;
      }

      // Calculate scheduled time based on frequency
      const scheduledFor = this.getScheduledTime(preferences.emailFrequency);

      // Queue notification
      const queued = await prisma.notificationQueue.create({
        data: {
          userId,
          type,
          data,
          scheduledFor,
          status: 'PENDING'
        }
      });

      logger.info('Notification queued', { userId, type, scheduledFor });
      return queued;
    } catch (error) {
      logger.error('Error queueing notification', error as Error, { userId, type });
      throw error;
    }
  }

  /**
   * Process due notifications
   */
  static async processQueue() {
    try {
      // Get all due notifications
      const dueNotifications = await prisma.notificationQueue.findMany({
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

      // Group notifications by user and frequency
      const grouped = this.groupNotifications(dueNotifications);

      // Process each group
      for (const [userId, userNotifications] of Object.entries(grouped)) {
        await this.processUserNotifications(userId, userNotifications);
      }

      logger.info('Notification queue processed', { 
        processed: dueNotifications.length 
      });
    } catch (error) {
      logger.error('Error processing notification queue', error as Error);
      throw error;
    }
  }

  private static getScheduledTime(frequency: 'instant' | 'daily' | 'weekly'): Date {
    const now = new Date();

    switch (frequency) {
      case 'instant':
        return now;

      case 'daily':
        // Schedule for next 9 AM
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;

      case 'weekly':
        // Schedule for next Monday 9 AM
        const nextMonday = new Date(now);
        nextMonday.setDate(nextMonday.getDate() + (8 - nextMonday.getDay()));
        nextMonday.setHours(9, 0, 0, 0);
        return nextMonday;
    }
  }

  private static groupNotifications(notifications: any[]) {
    return notifications.reduce((acc, notification) => {
      const { userId } = notification;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(notification);
      return acc;
    }, {} as Record<string, any[]>);
  }

  private static async processUserNotifications(userId: string, notifications: any[]) {
    try {
      // Group by notification type
      const matchAlerts = notifications.filter(n => n.type === 'match-alert');
      const predictionResults = notifications.filter(n => n.type === 'prediction-result');

      // Send consolidated emails
      if (matchAlerts.length > 0) {
        await this.sendConsolidatedMatchAlerts(userId, matchAlerts);
      }

      if (predictionResults.length > 0) {
        await this.sendConsolidatedPredictionResults(userId, predictionResults);
      }

      // Mark notifications as processed
      await prisma.notificationQueue.updateMany({
        where: {
          id: {
            in: notifications.map(n => n.id)
          }
        },
        data: {
          status: 'COMPLETED',
          processedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Error processing user notifications', error as Error, { userId });
      throw error;
    }
  }

  private static async sendConsolidatedMatchAlerts(userId: string, alerts: any[]) {
    // Implementation for consolidated match alerts
  }

  private static async sendConsolidatedPredictionResults(userId: string, results: any[]) {
    // Implementation for consolidated prediction results
  }
}
