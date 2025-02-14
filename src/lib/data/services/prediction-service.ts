import prisma from '@/lib/db';
import { analyzePatterns } from '@/lib/ai/prediction/analyzer';

export async function getHistoricalPredictions(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      competition: true,
      predictions: true
    }
  });

  const teamPredictions = await prisma.prediction.findMany({
    where: {
      OR: [
        { match: { homeTeamId: match.homeTeamId } },
        { match: { awayTeamId: match.awayTeamId } }
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

export async function getLeagueStats(leagueId: string) {
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

function calculatePredictionAccuracy(predictions) {
  const correctPredictions = predictions.filter(p => p.result === p.match.result).length;
  return (correctPredictions / predictions.length) * 100;
}

function calculateAverageConfidence(predictions) {
  const totalConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0);
  return totalConfidence / predictions.length;
}

function calculateRecentTrend(predictions) {
  const sortedPredictions = predictions
    .sort((a, b) => b.match.datetime - a.match.datetime)
    .slice(0, 5);

  return {
    wins: sortedPredictions.filter(p => p.result === p.match.result).length,
    total: sortedPredictions.length
  };
}