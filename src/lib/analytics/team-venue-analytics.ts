import prisma from '@/lib/prisma';

export class TeamVenueAnalytics {
  /**
   * Get home and away performance statistics for a team
   */
  static async getVenueStats(teamId: string, lastNMatches: number = 10) {
    const homeMatches = await prisma.match.findMany({
      where: {
        homeTeamId: teamId,
        status: 'COMPLETED'
      },
      take: lastNMatches,
      orderBy: {
        datetime: 'desc'
      },
      include: {
        competition: true
      }
    });

    const awayMatches = await prisma.match.findMany({
      where: {
        awayTeamId: teamId,
        status: 'COMPLETED'
      },
      take: lastNMatches,
      orderBy: {
        datetime: 'desc'
      },
      include: {
        competition: true
      }
    });

    const homeStats = this.calculateVenueStats(homeMatches, true);
    const awayStats = this.calculateVenueStats(awayMatches, false);

    return {
      home: {
        matches: homeMatches,
        stats: homeStats
      },
      away: {
        matches: awayMatches,
        stats: awayStats
      }
    };
  }

  private static calculateVenueStats(matches: any[], isHome: boolean) {
    return matches.reduce((acc, match) => {
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > opponentScore) acc.wins++;
      else if (teamScore < opponentScore) acc.losses++;
      else acc.draws++;

      acc.goalsScored += teamScore;
      acc.goalsConceded += opponentScore;
      acc.cleanSheets += opponentScore === 0 ? 1 : 0;

      return acc;
    }, {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0,
      cleanSheets: 0
    });
  }
}
