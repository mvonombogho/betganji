import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPrediction } from '@/lib/claude';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Get client IP or unique identifier
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';

    // Check rate limit
    const rateLimitResult = await rateLimit(ip);

    // Set rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    if (!rateLimitResult.success) {
      return new NextResponse(
        'Too many requests. Please try again later.',
        {
          status: 429,
          headers,
        }
      );
    }

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
      return new NextResponse('Match not found', { 
        status: 404,
        headers,
      });
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

    return NextResponse.json(
      { prediction: savedPrediction },
      { headers }
    );

  } catch (error) {
    console.error('Prediction error:', error);
    return new NextResponse(
      'Failed to generate prediction', 
      { status: 500 }
    );
  }
}
