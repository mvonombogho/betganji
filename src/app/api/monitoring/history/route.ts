import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { MetricsHistoryService } from '@/lib/monitoring/metrics-history-service';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');

    const history = await MetricsHistoryService.getHistoricalMetrics(days);
    
    // Format data for the chart
    const formattedHistory = history.map(record => ({
      timestamp: record.timestamp.toISOString(),
      accuracy: record.predictionAccuracy,
      users: record.activeUsers,
      predictions: record.totalPredictions,
      matches: record.processedMatches
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error('Error fetching metrics history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}