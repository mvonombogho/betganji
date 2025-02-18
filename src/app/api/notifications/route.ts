import { NextResponse } from 'next/server';
import { emailService } from '@/lib/email/email-service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { type, data } = await req.json();
    const userEmail = session.user.email;

    if (!userEmail) {
      return new NextResponse('User email not found', { status: 400 });
    }

    switch (type) {
      case 'match-alert':
        await emailService.sendMatchAlert(userEmail, data);
        break;
      case 'prediction-result':
        await emailService.sendPredictionResult(userEmail, data);
        break;
      default:
        return new NextResponse('Invalid notification type', { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}