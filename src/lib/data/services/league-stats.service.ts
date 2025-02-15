import { prisma } from '@/lib/db/prisma';
import { LeagueStats, TeamPerformance, MatchTrend } from '@/types/league';

export class LeagueStatsService {
  async getLeaguePerformance(leagueId: string, seasonId: string): Promise<LeagueStats> {
    const matches = await prisma.match.findMany({
      where: {
        competitionId: leagueId,
        season: seasonId,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        predictions: true,
      },
    });

    // Calculate average goals per match
    const totalGoals = matches.reduce((sum, match) => 
      sum + (match.homeScore || 0) + (match.awayScore || 0), 0);
    const averageGoals = totalGoals / matches.length;

    // Calculate home vs away win ratio
    const homeWins = matches.filter(m => (m.homeScore || 0) > (m.awayScore || 0)).length;
    const awayWins = matches.filter(m => (m.awayScore || 0) > (m.homeScore || 0)).length;
    const homeWinRatio = homeWins / matches.length;

    // Calculate prediction accuracy for the league
    const predictedMatches = matches.filter(m => m.predictions.length > 0);
    const correctPredictions = predictedMatches.filter(m => {
      const prediction = m.predictions[0];
      const actualResult = (m.homeScore || 0) > (m.awayScore || 0) ? 'HOME_WIN' :
        (m.homeScore || 0) < (m.awayScore || 0) ? 'AWAY_WIN' : 'DRAW';
      return prediction.result === actualResult;
    });
    const predictionAccuracy = correctPredictions.length / predictedMatches.length;

    return {
      averageGoals,
      homeWinRatio,
      predictionAccuracy,
      totalMatches: matches.length,
      seasonId,
      leagueId,
    };
  }

  async getTeamPerformanceTrends(teamId: string, seasonId: string): Promise<TeamPerformance> {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeamId: teamId },
          { awayTeamId: teamId }
        ],
        season: seasonId,
      },
      orderBy: {
        datetime: 'asc',
      },
    });

    // Calculate form trend (last 5 matches)
    const recentForm = matches.slice(-5).map(match => {
      const isHome = match.homeTeamId === teamId;
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      
      return {
        matchId: match.id,
        result: (teamScore || 0) > (opponentScore || 0) ? 'W' :
                (teamScore || 0) < (opponentScore || 0) ? 'L' : 'D',
        goalsScored: teamScore || 0,
        goalsConceded: opponentScore || 0,
        date: match.datetime,
      };
    });

    // Calculate goal scoring trend
    const scoringTrend = this.calculateScoringTrend(matches, teamId);

    return {
      teamId,
      seasonId,
      recentForm,
      scoringTrend,
      totalMatches: matches.length,
    };
  }

  async getMatchTrends(leagueId: string, seasonId: string): Promise<MatchTrend[]> {
    const matches = await prisma.match.findMany({
      where: {
        competitionId: leagueId,
        season: seasonId,
      },
      orderBy: {
        datetime: 'asc',
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // Group matches by month
    const monthlyTrends = matches.reduce((acc, match) => {
      const month = match.datetime.getMonth();
      const year = match.datetime.getFullYear();
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          period: key,
          totalMatches: 0,
          averageGoals: 0,
          homeWinPercentage: 0,
          matches: [],
        };
      }

      acc[key].matches.push(match);
      acc[key].totalMatches++;

      return acc;
    }, {} as Record<string, MatchTrend>);

    // Calculate trends for each month
    return Object.values(monthlyTrends).map(trend => {
      const totalGoals = trend.matches.reduce((sum, match) => 
        sum + (match.homeScore || 0) + (match.awayScore || 0), 0);
      
      const homeWins = trend.matches.filter(m => 
        (m.homeScore || 0) > (m.awayScore || 0)).length;

      return {
        period: trend.period,
        totalMatches: trend.totalMatches,
        averageGoals: totalGoals / trend.totalMatches,
        homeWinPercentage: (homeWins / trend.totalMatches) * 100,
      };
    });
  }

  private calculateScoringTrend(matches: any[], teamId: string) {
    return matches.map(match => {
      const isHome = match.homeTeamId === teamId;
      return {
        matchId: match.id,
        goalsScored: isHome ? match.homeScore : match.awayScore,
        date: match.datetime,
      };
    });
  }
}