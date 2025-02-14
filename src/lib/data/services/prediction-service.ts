import prisma from '@/lib/db';
import { analyzePatterns } from '@/lib/ai/prediction/analyzer';
import { Prediction, HistoricalData, LeagueStats } from '@/types/prediction';

export async function getPredictions(): Promise<Prediction[]> {
  return prisma.prediction.findMany({
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getPrediction(id: string): Promise<Prediction | null> {
  return prisma.prediction.findUnique({
    where: { id },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true
        }
      }
    }
  });
}

export async function getHistoricalPredictions(matchId: string): Promise<HistoricalData> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      competition: true,
      predictions: true
    }
  });

  if (!match) throw new Error('Match not found');

  const teamPredictions = await prisma.prediction.findMany({
    where: {
      OR: [
        { match: { homeTeamId: match.homeTeam.id } },
        { match: { awayTeamId: match.awayTeam.id } }
      ]
    },
    include: {
      match: true
    }
  });

  const accuracy = calculatePredictionAccuracy(teamPredictions);
  
  return {
    accuracy,
    totalPredictions: teamPredictions.length,
    recentTrend: calculateRecentTrend(teamPredictions)
  };
}

export async function getLeagueStats(leagueId: string): Promise<LeagueStats> {
  const predictions = await prisma.prediction.findMany({
    where: {
      match: {
        competitionId: leagueId
      }
    },
    include: {
      match: true
    }
  });

  return {
    totalPredictions: predictions.length,
    successRate: calculatePredictionAccuracy(predictions),
    averageConfidence: calculateAverageConfidence(predictions)
  };
}

function calculatePredictionAccuracy(predictions: Prediction[]): number {
  if (predictions.length === 0) return 0;
  const correctPredictions = predictions.filter(p => p.result === p.match.result).length;
  return Number(((correctPredictions / predictions.length) * 100).toFixed(1));
}

function calculateAverageConfidence(predictions: Prediction[]): number {
  if (predictions.length === 0) return 0;
  const totalConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0);
  return Number((totalConfidence / predictions.length).toFixed(1));
}

function calculateRecentTrend(predictions: Prediction[]) {
  const sortedPredictions = predictions
    .sort((a, b) => new Date(b.match.datetime).getTime() - new Date(a.match.datetime).getTime())
    .slice(0, 5);

  return {
    wins: sortedPredictions.filter(p => p.result === p.match.result).length,
    total: sortedPredictions.length
  };
}