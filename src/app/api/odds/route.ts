import { NextRequest } from 'next/server';
import { oddsService } from '@/lib/data/services/odds-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sportKey = searchParams.get('sportKey');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    if (!sportKey) {
      return Response.json({ success: false, error: 'Sport key is required' }, { status: 400 });
    }

    let data;
    if (fromDate && toDate) {
      data = await oddsService.getHistoricalOdds(sportKey, fromDate, toDate);
    } else {
      data = await oddsService.getLatestOdds(sportKey);
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching odds:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch odds data' },
      { status: 500 }
    );
  }
}