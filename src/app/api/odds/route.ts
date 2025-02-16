import { NextResponse } from 'next/server';
import { OddsService } from '@/lib/data/services/odds-service';

const oddsService = new OddsService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    const odds = await oddsService.getMatchOdds(matchId);
    return NextResponse.json(odds);
  } catch (error) {
    console.error('Error in odds API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
