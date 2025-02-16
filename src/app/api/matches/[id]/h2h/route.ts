import { NextResponse } from 'next/server';
import { H2HProvider } from '@/lib/data/providers/soccer/h2h-provider';
import { MatchService } from '@/lib/data/services/match-service';

const h2hProvider = new H2HProvider();
const matchService = new MatchService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First get the match details to get team IDs
    const match = await matchService.getMatch(params.id);
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Then fetch H2H stats
    const h2hStats = await h2hProvider.getH2HStats(
      match.homeTeam.id,
      match.awayTeam.id
    );

    return NextResponse.json(h2hStats);
  } catch (error) {
    console.error('Error in H2H API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch H2H stats' },
      { status: 500 }
    );
  }
}
