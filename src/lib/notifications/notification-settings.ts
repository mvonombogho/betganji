import prisma from '@/lib/prisma';

export interface NotificationPreferences {
  matchAlerts: boolean;
  predictionResults: boolean;
  passwordReset: boolean;
  emailFrequency: 'instant' | 'daily' | 'weekly';
}

export class NotificationSettings {
  /**
   * Get user's notification preferences
   */
  static async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const settings = await prisma.notificationSettings.findUnique({
      where: { userId }
    });

    // Return default settings if none exist
    if (!settings) {
      return {
        matchAlerts: true,
        predictionResults: true,
        passwordReset: true,
        emailFrequency: 'instant'
      };
    }

    return {
      matchAlerts: settings.matchAlerts,
      predictionResults: settings.predictionResults,
      passwordReset: settings.passwordReset,
      emailFrequency: settings.emailFrequency as 'instant' | 'daily' | 'weekly'
    };
  }

  /**
   * Update user's notification preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ) {
    return prisma.notificationSettings.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences
      }
    });
  }

  /**
   * Check if user should receive a specific notification
   */
  static async shouldNotifyUser(
    userId: string,
    notificationType: keyof Omit<NotificationPreferences, 'emailFrequency'>
  ): Promise<boolean> {
    const settings = await this.getUserPreferences(userId);
    return settings[notificationType];
  }

  /**
   * Get users who should receive a specific notification
   */
  static async getUsersForNotification(
    notificationType: keyof Omit<NotificationPreferences, 'emailFrequency'>
  ) {
    return prisma.user.findMany({
      where: {
        notificationSettings: {
          [notificationType]: true
        }
      },
      select: {
        id: true,
        email: true,
        notificationSettings: true
      }
    });
  }
}
