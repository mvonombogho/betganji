import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CalibratedModel } from '@/lib/ml/calibrated-model';
import { HybridPredictionService } from '@/lib/claude/hybrid-prediction-service';
import { ModelPersistence } from '@/lib/ml/model-persistence';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get match ID from request
    const { matchId } = await req.json();
    if (!matchId) {
      return new NextResponse('Match ID is required', { status: 400 });
    }

    // Get match details
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true
      }
    });

    if (!match) {
      return new NextResponse('Match not found', { status: 404 });
    }

    // Initialize model and services
    const model = new CalibratedModel();
    
    // Load trained model
    const modelLoaded = await ModelPersistence.loadModel(model);
    if (!modelLoaded) {
      return new NextResponse('Model not trained', { status: 400 });
    }

    // Create hybrid prediction service
    const predictionService = new HybridPredictionService(model);

    // Get hybrid prediction
    const prediction = await predictionService.getPrediction(match);

    // Save prediction to database
    const savedPrediction = await prisma.prediction.create({
      data: {
        matchId,
        userId: session.user.id,
        predictedResult: prediction.result,
        confidence: prediction.confidence,
        mlConfidence: prediction.mlConfidence,
        claudeAdjustment: prediction.claudeAdjustment,
        analysis: prediction.analysis,
        modelVersion: await ModelPersistence.getModelVersion()
      }
    });

    return NextResponse.json({
      success: true,
      prediction: savedPrediction
    });
  } catch (error) {
    console.error('Error in hybrid prediction:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
