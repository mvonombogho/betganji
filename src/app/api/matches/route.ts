import { NextResponse } from 'next/server';
import { MatchService } from '@/lib/data/services/match-service';

const matchService = new MatchService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const matches = await matchService.getMatches(date);
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error in matches API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
