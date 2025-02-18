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
      ...homeForm,
      
      // Add away team form
      ...awayForm,
      
      // Add head-to-head stats
      ...h2h,

      // Match result (if available)
      result: match.result || '',
      homeScore: match.homeScore || 0,
      awayScore: match.awayScore || 0
    };
  }

  // We'll add more methods in the next chunks
}
