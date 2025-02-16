import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPrediction } from '@/lib/claude';
import { getServerSession } from '@/lib/auth/verify';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { matchId, odds } = await req.json();

    // Get match data
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      return new NextResponse('Match not found', { status: 404 });
    }

    // Get recent form (simplified for now)
    const prediction = await getPrediction({
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeForm: ['W', 'D', 'W'], // This should be fetched from actual data
      awayForm: ['L', 'W', 'D'], // This should be fetched from actual data
      odds: {
        homeWin: odds.homeWin,
        draw: odds.draw,
        awayWin: odds.awayWin,
      },
    });

    // Save prediction
    const savedPrediction = await prisma.prediction.create({
      data: {
        matchId,
        userId: session.userId,
        prediction: prediction.outcome,
        confidence: prediction.confidence,
        reasoning: prediction.reasoning,
      },
    });

    return NextResponse.json({ prediction: savedPrediction });

  } catch (error) {
    console.error('Prediction error:', error);
    return new NextResponse(
      'Internal server error', 
      { status: 500 }
    );
  }
}
