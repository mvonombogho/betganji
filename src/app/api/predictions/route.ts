import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPrediction } from '@/lib/claude';

export async function POST(req: Request) {
  try {
    const { matchId, odds } = await req.json();

    // Get match details
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

    // Get prediction from Claude AI
    const prediction = await getPrediction({
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      odds: {
        homeWin: odds.homeWin,
        draw: odds.draw,
        awayWin: odds.awayWin,
      },
    });

    // Save prediction to database
    const savedPrediction = await prisma.prediction.create({
      data: {
        matchId,
        prediction: prediction.outcome,
        confidence: prediction.confidence,
        reasoning: prediction.reasoning,
      },
    });

    return NextResponse.json({ prediction: savedPrediction });

  } catch (error) {
    console.error('Prediction error:', error);
    return new NextResponse(
      'Failed to generate prediction', 
      { status: 500 }
    );
  }
}
