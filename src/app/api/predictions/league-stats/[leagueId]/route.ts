import { NextResponse } from 'next/server';
import { getLeagueStats } from '@/lib/data/services/prediction-service';

export async function GET(request: Request, { params }: { params: { leagueId: string } }) {
  try {
    const leagueId = params.leagueId;
    const leagueStats = await getLeagueStats(leagueId);
    
    return NextResponse.json(leagueStats);
  } catch (error) {
    console.error('Error fetching league stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch league statistics' },
      { status: 500 }
    );
  }
}