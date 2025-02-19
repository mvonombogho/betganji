import { NextResponse } from 'next/server';
import { NotificationQueueProcessor } from '@/lib/notifications/queue-processor';
import { logger } from '@/lib/logging/logger';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // Verify cron secret to ensure this is a legitimate cron job
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Process notifications
    const processedCount = await NotificationQueueProcessor.processPendingNotifications();

    // Log success
    logger.info('Notification cron job completed', { processedCount });

    return NextResponse.json({
      success: true,
      processedCount
    });
  } catch (error) {
    // Log error
    logger.error('Notification cron job failed', error as Error);

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
