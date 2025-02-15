import { NextResponse } from 'next/server';
import { predictionEngine } from '@/lib/ai/prediction/engine';
import { MatchData, OddsData } from '@/types';

export async function POST(req: Request) {
  try {
    const { matchData, oddsData } = await req.json();

    // Validate input data
    if (!matchData || !oddsData) {
      return new NextResponse('Missing required data', { status: 400 });
    }

    // Generate prediction
    const prediction = await predictionEngine.analyzePrediction(
      matchData as MatchData,
      oddsData as OddsData
    );

    // Generate additional insights
    const insights = await predictionEngine.generateInsights(prediction);

    // Combine the results
    const response = {
      prediction,
      insights,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating prediction:', error);
    return new NextResponse('Error generating prediction', { status: 500 });
  }
}
