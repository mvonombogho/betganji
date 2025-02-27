import { NextRequest, NextResponse } from 'next/server';
import { DeepseekClient } from '@/lib/ai/deepseek/client';
import { generateMatchPrompt } from '@/lib/ai/deepseek/prompts';
import { PredictionEngine } from '@/lib/ai/prediction/engine';
import { getMatchById } from '@/lib/data/services/match-service';
import { getOddsForMatch } from '@/lib/data/services/odds-service';
import { PredictionInsights } from '@/types/prediction';
import prisma from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/lib/auth';

// Input validation schema
const predictionRequestSchema = z.object({
  matchId: z.string().uuid(),
  odds: z.object({
    homeWin: z.number(),
    draw: z.number(),
    awayWin: z.number(),
  }).optional(),
  options: z.object({
    confidenceThreshold: z.number().min(0).max(100).default(75),
    includeDetailedAnalysis: z.boolean().default(false),
    notes: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the request
    const body = await req.json();
    const validation = predictionRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.format() }, 
        { status: 400 }
      );
    }

    const { matchId, odds: providedOdds, options } = validation.data;

    // Get match data
    const match = await getMatchById(matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Check if match has already started or finished
    const matchDate = new Date(match.datetime);
    const now = new Date();
    
    if (matchDate < now || match.status === 'LIVE' || match.status === 'FINISHED') {
      return NextResponse.json(
        { error: 'Cannot create predictions for matches that have already started or finished' },
        { status: 400 }
      );
    }

    // Get odds data (use provided odds or fetch the latest)
    const oddsData = providedOdds || await getOddsForMatch(matchId);
    if (!oddsData) {
      return NextResponse.json(
        { error: 'No odds data available for this match' },
        { status: 400 }
      );
    }

    // Check if a prediction already exists
    const existingPrediction = await prisma.prediction.findFirst({
      where: {
        matchId,
        userId: session.user.id,
      },
    });

    // Process with the prediction engine
    const engine = new PredictionEngine();
    const predictionInsights = await engine.analyzePrediction(match, oddsData);

    // Format the prediction result
    const homeScore = Math.round(predictionInsights.factors.find(f => 
      f.name.includes('Home') && f.name.includes('Score'))?.impact * 3 || 1);
    
    const awayScore = Math.round(predictionInsights.factors.find(f => 
      f.name.includes('Away') && f.name.includes('Score'))?.impact * 3 || 0);

    // Save the prediction
    const prediction = await prisma.prediction.upsert({
      where: {
        id: existingPrediction?.id || '',
      },
      update: {
        result: {
          home: homeScore,
          away: awayScore,
        },
        confidence: predictionInsights.confidenceScore,
        notes: options?.notes,
        insights: predictionInsights as any,
        updatedAt: new Date(),
      },
      create: {
        matchId,
        userId: session.user.id,
        result: {
          home: homeScore,
          away: awayScore,
        },
        confidence: predictionInsights.confidenceScore,
        notes: options?.notes,
        insights: predictionInsights as any,
      },
    });

    return NextResponse.json({
      success: true,
      prediction: {
        ...prediction,
        insights: predictionInsights,
      },
    });
  } catch (error) {
    console.error('Error generating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Get all predictions for the current user
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get('matchId');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Build the query
    const query: any = { userId: session.user.id };
    if (matchId) query.matchId = matchId;

    // Get predictions with match data
    const predictions = await prisma.prediction.findMany({
      where: query,
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
            competition: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions', details: (error as Error).message },
      { status: 500 }
    );
  }
}
