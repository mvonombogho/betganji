import prisma from '@/lib/db';
import { League } from '@/types/league';

export async function getLeagues(): Promise<League[]> {
  const leagues = await prisma.competition.findMany({
    include: {
      matches: {
        include: {
          predictions: true
        }
      }
    }
  });

  return leagues.map(transformLeague);
}

export async function getLeague(id: string): Promise<League | null> {
  const league = await prisma.competition.findUnique({
    where: { id },
    include: {
      matches: {
        include: {
          predictions: true,
          homeTeam: true,
          awayTeam: true
        }
      }
    }
  });

  if (!league) return null;
  return transformLeague(league);
}

function transformLeague(competition: any): League {
  const predictions = competition.matches.flatMap((m: any) => m.predictions);
  const successfulPredictions = predictions.filter((p: any) => p.result === p.match?.result);

  const monthlyStats = calculateMonthlyStats(competition.matches);

  return {
    id: competition.id,
    name: competition.name,
    country: competition.country,
    currentSeason: competition.season,
    description: competition.description,
    teamCount: getUniqueTeamCount(competition.matches),
    predictionSuccessRate: predictions.length > 0
      ? Number(((successfulPredictions.length / predictions.length) * 100).toFixed(1))
      : 0,
    totalPredictions: predictions.length,
    averageGoalsPerMatch: calculateAverageGoals(competition.matches),
    monthlyStats
  };
}

function getUniqueTeamCount(matches: any[]): number {
  const teamIds = new Set();
  matches.forEach(match => {
    teamIds.add(match.homeTeam?.id);
    teamIds.add(match.awayTeam?.id);
  });
  return teamIds.size;
}

function calculateAverageGoals(matches: any[]): number {
  if (matches.length === 0) return 0;
  const totalGoals = matches.reduce((sum, match) => {
    return sum + (match.homeScore || 0) + (match.awayScore || 0);
  }, 0);
  return Number((totalGoals / matches.length).toFixed(1));
}

function calculateMonthlyStats(matches: any[]) {
  const monthlyData: { [key: string]: { predictions: number, successful: number } } = {};

  matches.forEach(match => {
    const date = new Date(match.datetime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { predictions: 0, successful: 0 };
    }

    const predictions = match.predictions || [];
    monthlyData[monthKey].predictions += predictions.length;
    monthlyData[monthKey].successful += predictions.filter((p: any) => 
      p.result === match.result
    ).length;
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      predictions: data.predictions,
      successRate: data.predictions > 0
        ? Number(((data.successful / data.predictions) * 100).toFixed(1))
        : 0
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}