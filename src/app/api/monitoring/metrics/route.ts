import { NextResponse } from 'next/server';
import { metricsService } from '@/lib/monitoring/metrics-service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const metrics = await metricsService.getMetrics();
    
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Dashboard-specific metrics endpoint
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get current timestamp
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch dashboard metrics from database
    const dashboardMetrics = {
      activeUsers: await prisma.user.count({
        where: {
          lastActivityAt: {
            gte: oneDayAgo
          }
        }
      }),
      predictionAccuracy: await calculatePredictionAccuracy(),
      totalPredictions: await prisma.prediction.count(),
      processedMatches: await prisma.match.count({
        where: {
          status: 'COMPLETED'
        }
      })
    };

    return NextResponse.json(dashboardMetrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function calculatePredictionAccuracy() {
  const predictions = await prisma.prediction.findMany({
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

  if (predictions.length === 0) return 0;

  const correctPredictions = predictions.filter(
    p => p.result === p.match.result
  ).length;

  return (correctPredictions / predictions.length) * 100;
}
