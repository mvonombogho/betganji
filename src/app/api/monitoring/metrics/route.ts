import { NextResponse } from 'next/server';
import { metrics } from '@/lib/monitoring/metrics';

export async function GET() {
  try {
    const metricsData = await metrics.register.metrics();
    return new NextResponse(metricsData, {
      headers: {
        'Content-Type': metrics.register.contentType,
      },
    });
  } catch (error) {
    console.error('Error collecting metrics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
