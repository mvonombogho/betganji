import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { 
  scheduleReport, 
  unscheduleReport, 
  REPORT_SCHEDULES 
} from '@/lib/queue';
import { z } from 'zod';

const preferencesSchema = z.object({
  dailyReports: z.boolean(),
  weeklyReports: z.boolean(),
  monthlyReports: z.boolean(),
  emailTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  timezone: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const preferences = await prisma.reportPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(preferences || {
      dailyReports: false,
      weeklyReports: false,
      monthlyReports: false,
      emailTime: '00:00',
      timezone: 'UTC',
    });
  } catch (error) {
    console.error('Failed to get report preferences:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = preferencesSchema.parse(body);

    // Get existing preferences
    const existingPreferences = await prisma.reportPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // Update preferences
    const preferences = await prisma.reportPreferences.upsert({
      where: {
        userId: session.user.id,
      },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
    });

    // Update scheduled reports
    await handleScheduleUpdates(
      session.user.id,
      existingPreferences,
      preferences,
      validatedData.emailTime,
      validatedData.timezone
    );

    return NextResponse.json(preferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }
    console.error('Failed to update report preferences:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function handleScheduleUpdates(
  userId: string,
  oldPrefs: any,
  newPrefs: any,
  emailTime: string,
  timezone: string
) {
  const [hours, minutes] = emailTime.split(':').map(Number);
  
  // Helper to create cron expression
  const createCronExpression = (baseCron: string) => {
    const [cronMinutes, cronHours, ...rest] = baseCron.split(' ');
    return `${minutes} ${hours} ${rest.join(' ')}`;
  };

  // Handle daily reports
  if (newPrefs.dailyReports !== oldPrefs?.dailyReports) {
    if (newPrefs.dailyReports) {
      await scheduleReport(
        userId,
        'daily',
        createCronExpression(REPORT_SCHEDULES.DAILY)
      );
    } else {
      await unscheduleReport(userId, 'daily');
    }
  }

  // Handle weekly reports
  if (newPrefs.weeklyReports !== oldPrefs?.weeklyReports) {
    if (newPrefs.weeklyReports) {
      await scheduleReport(
        userId,
        'weekly',
        createCronExpression(REPORT_SCHEDULES.WEEKLY)
      );
    } else {
      await unscheduleReport(userId, 'weekly');
    }
  }

  // Handle monthly reports
  if (newPrefs.monthlyReports !== oldPrefs?.monthlyReports) {
    if (newPrefs.monthlyReports) {
      await scheduleReport(
        userId,
        'monthly',
        createCronExpression(REPORT_SCHEDULES.MONTHLY)
      );
    } else {
      await unscheduleReport(userId, 'monthly');
    }
  }
}