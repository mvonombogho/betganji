import { NextResponse } from 'next/server';
import { OddsController } from '@/lib/controllers/odds-controller';

/**
 * Refresh Odds API endpoint
 * Updates odds data from external bookmakers
 */
export async function GET() {
  try {
    const odds = await OddsController.refreshOdds();
    
    return NextResponse.json(odds, { status: 200 });
  } catch (error) {
    console.error('Error refreshing odds:', error);
    return NextResponse.json(
      { error: 'Failed to refresh odds data' },
      { status: 500 }
    );
  }
}
