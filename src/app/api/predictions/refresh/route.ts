import { NextResponse } from 'next/server';
import { DataController } from '@/lib/controllers/data-controller';

/**
 * Refresh Predictions API endpoint
 * Updates prediction data and checks for settlement
 */
export async function GET() {
  try {
    const predictions = await DataController.refreshPredictions();
    
    // Process any predictions that need to be settled
    await DataController.processUpdates();
    
    return NextResponse.json(predictions, { status: 200 });
  } catch (error) {
    console.error('Error refreshing predictions:', error);
    return NextResponse.json(
      { error: 'Failed to refresh prediction data' },
      { status: 500 }
    );
  }
}
