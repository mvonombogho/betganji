import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { homeScore, awayScore } = await req.json();

    // Determine match result
    let result;
    if (homeScore > awayScore) {
      result = 'HOME_WIN';
    } else if (awayScore > homeScore) {
      result = 'AWAY_WIN';
    } else {
      result = 'DRAW';
    }

    // Update match with result
    const match = await prisma.match.update({
      where: { id: params.id },
      data: {
        status: 'FINISHED',
        result,
        homeScore,
        awayScore,
      },
    });

    // Update prediction accuracy
    await prisma.prediction.updateMany({
      where: { matchId: params.id },
      data: {
        isCorrect: {
          set: prisma.prediction.fields.prediction.equals(result)
        }
      }
    });

    return NextResponse.json({ match });

  } catch (error) {
    console.error('Match result update error:', error);
    return new NextResponse(
      'Failed to update match result',
      { status: 500 }
    );
  }
}
