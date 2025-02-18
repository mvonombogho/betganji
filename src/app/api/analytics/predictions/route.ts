import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PredictionAnalytics } from '@/lib/analytics/prediction-analytics';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const days = searchParams.get('days');

    let data;
    switch (type) {
      case 'competition':
        data = await PredictionAnalytics.getSuccessRateByCompetition();
        break;
      case 'trends':
        data = await PredictionAnalytics.getPerformanceTrends(days ? parseInt(days) : 30);
        break;
      case 'confidence':
        data = await PredictionAnalytics.getConfidenceScoreAnalysis();
        break;
      default:
        return new NextResponse('Invalid analytics type', { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching prediction analytics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
