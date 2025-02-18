import prisma from '@/lib/prisma';

export class TeamAnalytics {
  /**
   * Get basic team performance stats
   */
  static async getTeamStats(teamId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeamId: teamId },
          { awayTeamId: teamId }
        ],
        status: 'COMPLETED'
      },
      take: 10,
      orderBy: {
        datetime: 'desc'
      }
    });

    // Calculate basic stats
    const stats = matches.reduce((acc, match) => {
      const isHome = match.homeTeamId === teamId;
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > opponentScore) acc.wins++;
      else if (teamScore < opponentScore) acc.losses++;
      else acc.draws++;

      acc.goalsScored += teamScore;
      acc.goalsConceded += opponentScore;

      return acc;
    }, {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0
    });

    return {
      recentMatches: matches,
      stats
    };
  }
}
