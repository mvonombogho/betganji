import { NextResponse } from 'next/server';
import { getDataController } from '@/lib/services/data-controller';
import { auth } from '@/lib/auth';

// Only allow POST requests
export async function POST() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize the data controller
    const dataController = getDataController();
    dataController.initialize({ refreshIntervalMinutes: 5 });

    return NextResponse.json({
      success: true,
      message: 'Data service initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing data service:', error);
    return NextResponse.json(
      { error: 'Failed to initialize data service' },
      { status: 500 }
    );
  }
}
