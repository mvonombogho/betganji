import prisma from '@/lib/prisma';
import type { MatchFeatures } from '@/types/ml';

export class FeatureExtractor {
  // ... previous methods remain the same ...

  /**
   * Get head-to-head statistics between two teams
   */
  private static async getH2HStats(
    homeTeamId: string,
    awayTeamId: string,
    lastNMatches: number = 5
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
        status: 'COMPLETED'
      },
      orderBy: {
        datetime: 'desc'
      },
      take: lastNMatches
    });

    return h2hMatches.reduce((stats, match) => {
      // Determine if the reference team was home or away
      const isReferenceTeamHome = match.homeTeamId === homeTeamId;

      // Update wins/losses based on the result
      if (isReferenceTeamHome) {
        if (match.homeScore > match.awayScore) stats.homeWins++;
        else if (match.homeScore < match.awayScore) stats.awayWins++;
        else stats.draws++;

        stats.homeGoals += match.homeScore;
        stats.awayGoals += match.awayScore;
      } else {
        if (match.homeScore < match.awayScore) stats.homeWins++;
        else if (match.homeScore > match.awayScore) stats.awayWins++;
        else stats.draws++;

        stats.homeGoals += match.awayScore;
        stats.awayGoals += match.homeScore;
      }

      return stats;
    }, {
      homeWins: 0,
      awayWins: 0,
      draws: 0,
      homeGoals: 0,
      awayGoals: 0
    });
  }

  /**
   * Extract features for multiple matches (for training)
   */
  static async extractBatchFeatures(matchIds: string[]) {
    const features = await Promise.all(
      matchIds.map(id => this.extractMatchFeatures(id))
    );

    return features.filter(f => f !== null) as MatchFeatures[];
  }
}
