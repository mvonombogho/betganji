import { NextResponse } from 'next/server';
import { MetricsHistoryService } from '@/lib/monitoring/metrics-history-service';
import prisma from '@/lib/prisma';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // Verify cron secret to ensure this is a legitimate cron job
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Calculate current metrics
    const [activeUsers, predictions, matches] = await Promise.all([
      // Get active users in last 24 hours
      prisma.user.count({
        where: {
          lastActivityAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Get total predictions
      prisma.prediction.count(),

      // Get completed matches
      prisma.match.count({
        where: {
          status: 'COMPLETED'
        }
      })
    ]);

    // Calculate prediction accuracy
    const completedPredictions = await prisma.prediction.findMany({
      where: {
        match: {
          status: 'COMPLETED'
        }
      },
      select: {
        result: true,
        match: {
          select: {
            result: true
          }
        }
      }
    });

    const accuracy = completedPredictions.length > 0
      ? (completedPredictions.filter(p => p.result === p.match.result).length / completedPredictions.length) * 100
      : 0;

    // Record metrics
    await MetricsHistoryService.recordMetrics({
      activeUsers,
      predictionAccuracy: accuracy,
      totalPredictions: predictions,
      processedMatches: matches
    });

    // Clean up old metrics (keep last 30 days)
    await MetricsHistoryService.cleanupOldMetrics(30);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording metrics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
