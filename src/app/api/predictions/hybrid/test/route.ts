import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CalibratedModel } from '@/lib/ml/calibrated-model';
import { HybridPredictionService } from '@/lib/claude/hybrid-prediction-service';
import { ModelPersistence } from '@/lib/ml/model-persistence';

export async function POST(req: Request) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get match ID and test parameters
    const { matchId, includeAnalysis = true } = await req.json();
    if (!matchId) {
      return new NextResponse('Match ID is required', { status: 400 });
    }

    // Get match with recent history
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: {
          include: {
            homeMatches: {
              take: 5,
              orderBy: { datetime: 'desc' }
            },
            awayMatches: {
              take: 5,
              orderBy: { datetime: 'desc' }
            }
          }
        },
        awayTeam: {
          include: {
            homeMatches: {
              take: 5,
              orderBy: { datetime: 'desc' }
            },
            awayMatches: {
              take: 5,
              orderBy: { datetime: 'desc' }
            }
          }
        },
        competition: true
      }
    });

    if (!match) {
      return new NextResponse('Match not found', { status: 404 });
    }

    // Initialize model and services
    const model = new CalibratedModel();
    const modelLoaded = await ModelPersistence.loadModel(model);
    if (!modelLoaded) {
      return new NextResponse('Model not trained', { status: 400 });
    }

    const predictionService = new HybridPredictionService(model);

    // Get predictions with timing information
    const startTime = Date.now();
    const prediction = await predictionService.getPrediction(match);
    const endTime = Date.now();

    // Prepare response with detailed information
    const response = {
      prediction: {
        result: prediction.result,
        confidence: prediction.confidence,
        mlConfidence: prediction.mlConfidence,
        claudeAdjustment: prediction.claudeAdjustment
      },
      timing: {
        total: endTime - startTime,
        // Add more detailed timing if needed
      },
      modelInfo: await ModelPersistence.getModelMetadata()
    };

    if (includeAnalysis) {
      response['analysis'] = prediction.analysis;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in hybrid prediction test:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
