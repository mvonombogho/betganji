import { NextResponse } from 'next/server';
import { OddsController } from '@/lib/controllers/odds-controller';

/**
 * Get Odds for Match API endpoint
 * Retrieves the latest odds for a specific match
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id;
    
    // Get the odds for this match
    const odds = await OddsController.getOddsForMatch(matchId);
    
    return NextResponse.json(odds, { status: 200 });
  } catch (error) {
    console.error('Error fetching odds for match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch odds for match' },
      { status: 500 }
    );
  }
}
