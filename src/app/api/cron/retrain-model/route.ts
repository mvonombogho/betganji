import { NextResponse } from 'next/server';
import { RetrainingScheduler } from '@/lib/ml/retraining-scheduler';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    // Verify cron secret to ensure this is a legitimate cron job
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if retraining is needed
    const shouldRetrain = await RetrainingScheduler.shouldRetrain();
    if (!shouldRetrain) {
      return NextResponse.json({
        message: 'Retraining not needed at this time',
        retrained: false
      });
    }

    // Run retraining
    const success = await RetrainingScheduler.retrain();

    return NextResponse.json({
      message: success ? 'Model retrained successfully' : 'Retraining failed',
      retrained: success
    });
  } catch (error) {
    console.error('Error in retraining cron job:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
