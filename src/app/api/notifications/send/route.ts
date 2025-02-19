import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NotificationTriggers } from '@/lib/notifications/notification-triggers';

export async function POST(req: Request) {
  try {
    // Verify admin or system authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { type, data } = await req.json();

    let success = false;

    switch (type) {
      case 'password-reset':
        success = await NotificationTriggers.triggerPasswordReset(
          data.userId,
          data.resetToken
        );
        break;

      case 'match-alert':
        success = await NotificationTriggers.triggerMatchAlerts(
          data.matchId
        );
        break;

      case 'prediction-result':
        success = await NotificationTriggers.triggerPredictionResults(
          data.matchId
        );
        break;

      default:
        return new NextResponse('Invalid notification type', { status: 400 });
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
