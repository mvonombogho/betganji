import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { LeagueService } from '@/lib/services/league-service';

export async function GET(
  request: Request,
  { params }: { params: { leagueId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const timeRange = from && to ? {
      start: new Date(from),
      end: new Date(to)
    } : undefined;

    const leagueService = new LeagueService();
    const performance = await leagueService.getLeaguePerformance(
      params.leagueId,
      timeRange
    );

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Failed to fetch league performance:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}