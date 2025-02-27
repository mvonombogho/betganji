import { NextRequest, NextResponse } from 'next/server';
import { getDataController } from '@/lib/services/data-controller';
import { auth } from '@/lib/auth';

/**
 * API route for manually triggering data refreshes
 * GET - Get last refresh timestamp
 * POST - Trigger manual refresh
 * PUT - Update refresh interval
 */

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataController = getDataController();
    const lastRefreshed = dataController.getLastRefreshed();

    return NextResponse.json({
      lastRefreshed,
      formattedTime: lastRefreshed.toISOString()
    });
  } catch (error) {
    console.error('Error getting refresh status:', error);
    return NextResponse.json(
      { error: 'Failed to get refresh status' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataController = getDataController();
    await dataController.refreshAllData();

    return NextResponse.json({
      success: true,
      message: 'Data refresh triggered successfully',
      lastRefreshed: dataController.getLastRefreshed().toISOString()
    });
  } catch (error) {
    console.error('Error triggering data refresh:', error);
    return NextResponse.json(
      { error: 'Failed to trigger data refresh' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { intervalMinutes } = body;

    // Validate the input
    if (!intervalMinutes || typeof intervalMinutes !== 'number' || intervalMinutes < 1) {
      return NextResponse.json(
        { error: 'Invalid interval. Must be a number greater than 0.' },
        { status: 400 }
      );
    }

    const dataController = getDataController();
    dataController.setRefreshInterval(intervalMinutes);

    return NextResponse.json({
      success: true,
      message: `Refresh interval updated to ${intervalMinutes} minutes`
    });
  } catch (error) {
    console.error('Error updating refresh interval:', error);
    return NextResponse.json(
      { error: 'Failed to update refresh interval' },
      { status: 500 }
    );
  }
}
