import { NextResponse } from 'next/server';
import { MatchService } from '@/lib/data/services/match-service';

const matchService = new MatchService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchData = await matchService.getMatchData(params.id);
    return NextResponse.json(matchData);
  } catch (error) {
    console.error('Error in match details API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match details' },
      { status: 500 }
    );
  }
}
