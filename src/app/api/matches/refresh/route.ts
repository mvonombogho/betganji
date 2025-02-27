import { NextResponse } from 'next/server';
import { DataController } from '@/lib/controllers/data-controller';

/**
 * Refresh Matches API endpoint
 * Updates match data from external APIs
 */
export async function GET() {
  try {
    const matches = await DataController.refreshMatches();
    
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('Error refreshing matches:', error);
    return NextResponse.json(
      { error: 'Failed to refresh match data' },
      { status: 500 }
    );
  }
}
