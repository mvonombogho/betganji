import prisma from '@/lib/prisma';
import type { MatchFeatures } from '@/types/ml';

export class FeatureExtractor {
  /**
   * Extract features for a single match
   */
  static async extractMatchFeatures(matchId: string): Promise<MatchFeatures | null> {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true
      }
    });

    if (!match) return null;

    // Get team forms
    const [homeForm, awayForm] = await Promise.all([
      this.getTeamForm(match.homeTeamId),
      this.getTeamForm(match.awayTeamId)
    ]);

    // Get head-to-head history
    const h2h = await this.getH2HStats(match.homeTeamId, match.awayTeamId);

    return {
      matchId: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      competition: match.competition.name,
      datetime: match.datetime,
      
      // Add home team form
      homeFormWins: homeForm.wins,
      homeFormDraws: homeForm.draws,
      homeFormLosses: homeForm.losses,
      homeFormGoalsScored: homeForm.goalsScored,
      homeFormGoalsConceded: homeForm.goalsConceded,
      
      // Add away team form
      awayFormWins: awayForm.wins,
      awayFormDraws: awayForm.draws,
      awayFormLosses: awayForm.losses,
      awayFormGoalsScored: awayForm.goalsScored,
      awayFormGoalsConceded: awayForm.goalsConceded,
      
      // Add head-to-head stats
      h2hHomeWins: h2h.homeWins,
      h2hAwayWins: h2h.awayWins,
      h2hDraws: h2h.draws,
      h2hHomeGoals: h2h.homeGoals,
      h2hAwayGoals: h2h.awayGoals,

      // Match result (if available)
      result: match.result || '',
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0
    };
  }

  /**
   * Get team's recent form
   */
  private static async getTeamForm(teamId: string, lastNMatches: number = 5) {
    const recentMatches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeamId: teamId },
          { awayTeamId: teamId }
        ],
        status: 'COMPLETED'
      },
      orderBy: {
        datetime: 'desc'
      },
      take: lastNMatches
    });

    return recentMatches.reduce((stats, match) => {
      const isHome = match.homeTeamId === teamId;
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      // Update stats based on match result
      if (teamScore > opponentScore) stats.wins++;
      else if (teamScore < opponentScore) stats.losses++;
      else stats.draws++;

      stats.goalsScored += teamScore;
      stats.goalsConceded += opponentScore;

      return stats;
    }, {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsConceded: 0
    });
  }

  // We'll add the H2H stats method next
}
