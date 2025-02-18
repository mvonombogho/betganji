import prisma from '@/lib/prisma';

export class HeadToHeadAnalytics {
  /**
   * Get historical head-to-head matches between two teams
   */
  static async getH2HStats(team1Id: string, team2Id: string, limit: number = 10) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          {
            AND: [
              { homeTeamId: team1Id },
              { awayTeamId: team2Id }
            ]
          },
          {
            AND: [
              { homeTeamId: team2Id },
              { awayTeamId: team1Id }
            ]
          }
        ],
        status: 'COMPLETED'
      },
      orderBy: {
        datetime: 'desc'
      },
      take: limit,
      include: {
        competition: true,
        homeTeam: true,
        awayTeam: true
      }
    });

    // Calculate stats for team1
    const stats = matches.reduce((acc, match) => {
      const isTeam1Home = match.homeTeamId === team1Id;
      const team1Score = isTeam1Home ? match.homeScore : match.awayScore;
      const team2Score = isTeam1Home ? match.awayScore : match.homeScore;

      if (team1Score > team2Score) acc.team1Wins++;
      else if (team1Score < team2Score) acc.team2Wins++;
      else acc.draws++;

      acc.team1Goals += team1Score;
      acc.team2Goals += team2Score;

      // Track scoring patterns
      if (isTeam1Home) {
        acc.team1HomeGoals += team1Score;
        acc.team1HomeGames++;
      } else {
        acc.team1AwayGoals += team1Score;
        acc.team1AwayGames++;
      }

      return acc;
    }, {
      team1Wins: 0,
      team2Wins: 0,
      draws: 0,
      team1Goals: 0,
      team2Goals: 0,
      team1HomeGoals: 0,
      team1AwayGoals: 0,
      team1HomeGames: 0,
      team1AwayGames: 0
    });

    return {
      matches,
      stats
    };
  }
}
