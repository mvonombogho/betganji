import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { ClaudeClient } from '@/lib/ai/claude/client';
import { prisma } from '@/lib/db';

const claude = new ClaudeClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { matchId } = body;

    if (!matchId) {
      return Response.json({ error: 'Match ID is required' }, { status: 400 });
    }

    // Get match data with related information
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
        odds: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    if (!match) {
      return Response.json({ error: 'Match not found' }, { status: 404 });
    }

    // Get the prediction from Claude
    const insights = await claude.generatePrediction({
      match,
      odds: match.odds[0],
    });

    // Save the prediction
    const prediction = await prisma.prediction.create({
      data: {
        userId: session.user.id,
        matchId,
        prediction: insights.recommendedBets[0]?.type || 'NO_BET',
        confidence: insights.confidenceScore,
        reasoning: insights.factors.join('\n'),
        aiSuggestion: JSON.stringify(insights),
      },
    });

    return Response.json({
      success: true,
      prediction,
      insights,
    });

  } catch (error) {
    console.error('Error generating prediction:', error);
    return Response.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    const where = matchId 
      ? { userId: session.user.id, matchId }
      : { userId: session.user.id };

    const predictions = await prisma.prediction.findMany({
      where,
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({
      success: true,
      predictions,
    });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    return Response.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
