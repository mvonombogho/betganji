import { prisma } from '@/lib/db/prisma';
import { startOfMonth, endOfMonth, parseISO, format } from 'date-fns';

export class TrendAnalysisService {
  constructor(
    private leagueId: string,
    private seasonId: string
  ) {}

  async getGoalsTrend(months: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const matches = await prisma.match.findMany({
      where: {
        competitionId: this.leagueId,
        season: this.seasonId,
        datetime: {
          gte: startDate,
          lte: endDate,
        },
        status: 'FINISHED',
      },
      orderBy: {
        datetime: 'asc',
      },
    });

    // Calculate moving average over 5 matches
    const movingAverageWindow = 5;
    const goalsTrend = matches.map((match, index) => {
      const totalGoals = (match.homeScore || 0) + (match.awayScore || 0);
      
      // Calculate moving average
      let average = totalGoals;
      if (index >= movingAverageWindow - 1) {
        const windowMatches = matches.slice(index - movingAverageWindow + 1, index + 1);
        const windowGoals = windowMatches.reduce((sum, m) => 
          sum + (m.homeScore || 0) + (m.awayScore || 0), 0);
        average = windowGoals / movingAverageWindow;
      }

      return {
        date: match.datetime.toISOString(),
        goals: totalGoals,
        average: parseFloat(average.toFixed(2)),
      };
    });

    return goalsTrend;
  }

  async getResultsDistribution() {
    const matches = await prisma.match.findMany({
      where: {
        competitionId: this.leagueId,
        season: this.seasonId,
        status: 'FINISHED',
      },
    });

    const total = matches.length;
    const homeWins = matches.filter(m => (m.homeScore || 0) > (m.awayScore || 0)).length;
    const awayWins = matches.filter(m => (m.homeScore || 0) < (m.awayScore || 0)).length;
    const draws = matches.filter(m => (m.homeScore || 0) === (m.awayScore || 0)).length;

    return [
      {
        name: 'Home Wins',
        value: homeWins,
        total,
        color: '#3b82f6'
      },
      {
        name: 'Away Wins',
        value: awayWins,
        total,
        color: '#ef4444'
      },
      {
        name: 'Draws',
        value: draws,
        total,
        color: '#10b981'
      }
    ];
  }

  async getMonthlyPerformance(months: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const matches = await prisma.match.findMany({
      where: {
        competitionId: this.leagueId,
        season: this.seasonId,
        datetime: {
          gte: startDate,
          lte: endDate,
        },
        status: 'FINISHED',
      },
    });

    // Group matches by month
    const monthlyStats = matches.reduce((acc, match) => {
      const monthKey = format(match.datetime, 'MMM yyyy');
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          wins: 0,
          draws: 0,
          losses: 0
        };
      }

      // Count results
      if ((match.homeScore || 0) > (match.awayScore || 0)) {
        acc[monthKey].wins++;
      } else if ((match.homeScore || 0) < (match.awayScore || 0)) {
        acc[monthKey].losses++;
      } else {
        acc[monthKey].draws++;
      }

      return acc;
    }, {} as Record<string, { month: string; wins: number; draws: number; losses: number; }>);

    return Object.values(monthlyStats);
  }

  async getLeaguePerformanceMetrics() {
    const matches = await prisma.match.findMany({
      where: {
        competitionId: this.leagueId,
        season: this.seasonId,
        status: 'FINISHED',
      },
      include: {
        predictions: true,
      },
    });

    const totalMatches = matches.length;
    const matchesWithPredictions = matches.filter(m => m.predictions.length > 0);
    const correctPredictions = matchesWithPredictions.filter(m => {
      const prediction = m.predictions[0];
      const actualResult = (m.homeScore || 0) > (m.awayScore || 0) ? 'HOME_WIN' :
        (m.homeScore || 0) < (m.awayScore || 0) ? 'AWAY_WIN' : 'DRAW';
      return prediction.result === actualResult;
    });

    return {
      totalMatches,
      averageGoals: matches.reduce((sum, m) => 
        sum + (m.homeScore || 0) + (m.awayScore || 0), 0) / totalMatches,
      predictionAccuracy: correctPredictions.length / matchesWithPredictions.length * 100,
      homeWinPercentage: matches.filter(m => 
        (m.homeScore || 0) > (m.awayScore || 0)).length / totalMatches * 100,
    };
  }
}