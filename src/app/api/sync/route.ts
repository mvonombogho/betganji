import { NextResponse } from 'next/server';
import { syncMatches, syncLiveScores } from '@/lib/services/sync-service';

// This endpoint should be called by a cron job every hour
export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    
    // Validate API key for cron job
    if (apiKey !== process.env.CRON_API_KEY) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Sync matches and live scores
    const [matchesResult, scoresResult] = await Promise.all([
      syncMatches(),
      syncLiveScores(),
    ]);

    if (!matchesResult.success || !scoresResult.success) {
      throw new Error('Sync failed');
    }

    return NextResponse.json({
      message: 'Sync completed successfully',
    });

  } catch (error) {
    console.error('Sync error:', error);
    return new NextResponse(
      'Sync failed',
      { status: 500 }
    );
  }
}
