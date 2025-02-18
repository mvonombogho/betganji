import prisma from '@/lib/prisma';

export class MLDataProcessor {
  /**
   * Prepare historical match data for training
   */
  static async prepareTrainingData(daysBack: number = 365) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const matches = await prisma.match.findMany({
      where: {
        status: 'COMPLETED',
        datetime: {
          gte: startDate
        }
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true
      },
      orderBy: {
        datetime: 'asc'
      }
    });

    const features = await Promise.all(
      matches.map(async match => {
        // Get team form (last 5 matches)
        const [homeForm, awayForm] = await Promise.all([
          this.getTeamForm(match.homeTeamId, match.datetime),
          this.getTeamForm(match.awayTeamId, match.datetime)
        ]);

        // Get head-to-head history
        const h2h = await this.getHeadToHead(
          match.homeTeamId,
          match.awayTeamId,
          match.datetime
        );

        return {
          // Match info
          matchId: match.id,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          competition: match.competition.name,
          datetime: match.datetime,

          // Features
          homeFormWins: homeForm.wins,
          homeFormDraws: homeForm.draws,
          homeFormLosses: homeForm.losses,
          homeFormGoalsScored: homeForm.goalsScored,
          homeFormGoalsConceded: homeForm.goalsConceded,

          awayFormWins: awayForm.wins,
          awayFormDraws: awayForm.draws,
          awayFormLosses: awayForm.losses,
          awayFormGoalsScored: awayForm.goalsScored,
          awayFormGoalsConceded: awayForm.goalsConceded,

          h2hHomeWins: h2h.homeWins,
          h2hAwayWins: h2h.awayWins,
          h2hDraws: h2h.draws,
          h2hHomeGoals: h2h.homeGoals,
          h2hAwayGoals: h2h.awayGoals,

          // Target variables
          result: match.result,
          homeScore: match.homeScore,
          awayScore: match.awayScore
        };
      })
    );

    return features;
  }

  private static async getTeamForm(teamId: string, beforeDate: Date) {
    const lastMatches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeamId: teamId },
          { awayTeamId: teamId }
        ],
        status: 'COMPLETED',
        datetime: {
          lt: beforeDate
        }
      },
      orderBy: {
        datetime: 'desc'
      },
      take: 5
    });

    return lastMatches.reduce((acc, match) => {
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
  }

  private static async getHeadToHead(
    homeTeamId: string,
    awayTeamId: string,
    beforeDate: Date
  ) {
    const h2hMatches = await prisma.match.findMany({
      where: {
        OR: [
          {
            homeTeamId,
            awayTeamId
          },
          {
            homeTeamId: awayTeamId,
            awayTeamId: homeTeamId
          }
        ],
        status: 'COMPLETED',
        datetime: {
          lt: beforeDate
        }
      },
      orderBy: {
        datetime: 'desc'
      },
      take: 5
    });

    return h2hMatches.reduce((acc, match) => {
      if (match.homeTeamId === homeTeamId) {
        if (match.homeScore > match.awayScore) acc.homeWins++;
        else if (match.homeScore < match.awayScore) acc.awayWins++;
        else acc.draws++;
        acc.homeGoals += match.homeScore;
        acc.awayGoals += match.awayScore;
      } else {
        if (match.homeScore > match.awayScore) acc.awayWins++;
        else if (match.homeScore < match.awayScore) acc.homeWins++;
        else acc.draws++;
        acc.homeGoals += match.awayScore;
        acc.awayGoals += match.homeScore;
      }
      return acc;
    }, {
      homeWins: 0,
      awayWins: 0,
      draws: 0,
      homeGoals: 0,
      awayGoals: 0
    });
  }
}
