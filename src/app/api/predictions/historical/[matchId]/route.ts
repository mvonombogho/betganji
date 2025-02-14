import { NextResponse } from 'next/server';
import { getHistoricalPredictions } from '@/lib/data/services/prediction-service';

export async function GET(request: Request, { params }: { params: { matchId: string } }) {
  try {
    const matchId = params.matchId;
    const historicalData = await getHistoricalPredictions(matchId);
    
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical predictions' },
      { status: 500 }
    );
  }
}