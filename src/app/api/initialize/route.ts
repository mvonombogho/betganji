import { NextResponse } from 'next/server';
import { DataController } from '@/lib/controllers/data-controller';

/**
 * Initialize API endpoint
 * Initializes all application data at startup
 */
export async function GET() {
  try {
    const initData = await DataController.initialize();
    
    return NextResponse.json(initData, { status: 200 });
  } catch (error) {
    console.error('Error initializing data:', error);
    return NextResponse.json(
      { error: 'Failed to initialize application data' },
      { status: 500 }
    );
  }
}
