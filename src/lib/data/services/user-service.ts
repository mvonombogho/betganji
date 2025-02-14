import prisma from '@/lib/db';

export async function getUserDashboardSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dashboardSettings: true
    }
  });

  return user?.dashboardSettings ? JSON.parse(user.dashboardSettings) : null;
}

export async function updateUserDashboardSettings(userId: string, settings: any) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      dashboardSettings: JSON.stringify(settings)
    }
  });
}

export async function getUserPreferences(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      preferences: true
    }
  });

  return user?.preferences ? JSON.parse(user.preferences) : {
    theme: 'system',
    notifications: {
      predictions: true,
      matches: true,
      bankroll: true
    },
    currency: 'USD',
    timezone: 'UTC'
  };
}

export async function updateUserPreferences(userId: string, preferences: any) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      preferences: JSON.stringify(preferences)
    }
  });
}