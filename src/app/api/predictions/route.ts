import { NextResponse } from 'next/server';
import { generatePrediction } from '@/lib/services/prediction-service';
import { getServerSession } from '@/lib/auth/verify';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { matchId } = await req.json();

    if (!matchId) {
      return new NextResponse('Match ID is required', { status: 400 });
    }

    // Check for existing recent prediction
    const existingPrediction = await prisma.prediction.findFirst({
      where: {
        matchId,
        userId: session.userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes
        },
      },
    });

    if (existingPrediction) {
      return NextResponse.json(existingPrediction);
    }

    // Generate new prediction
    const prediction = await generatePrediction(matchId, session.userId);
    return NextResponse.json(prediction);

  } catch (error) {
    console.error('Prediction error:', error);
    return new NextResponse(
      'Failed to generate prediction',
      { status: 500 }
    );
  }
}
