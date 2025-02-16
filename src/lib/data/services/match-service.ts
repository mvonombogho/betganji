import { APIFootballClient } from '../providers/soccer/api-football';
import { Match, MatchData, TeamStats, H2HStats } from '@/types/match';
import { prisma } from '@/lib/prisma';

export class MatchService {
  private apiClient: APIFootballClient;

  constructor() {
    this.apiClient = new APIFootballClient();
  }

  async getMatches(date: string): Promise<Match[]> {
    try {
      // First try to get matches from database
      const dbMatches = await prisma.match.findMany({
        where: {
          datetime: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          }
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true
        }
      });

      if (dbMatches.length > 0) {
        return dbMatches;
      }

      // If no matches in DB, fetch from API
      const apiMatches = await this.apiClient.getMatches(date);

      // Store matches in database
      await this.storeMatches(apiMatches);

      return apiMatches;
    } catch (error) {
      console.error('Error in getMatches:', error);
      throw error;
    }
  }

  async getMatchData(matchId: string): Promise<MatchData> {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true
        }
      });

      if (!match) {
        throw new Error('Match not found');
      }

      const [homeTeamStats, awayTeamStats, h2hStats] = await Promise.all([
        this.apiClient.getTeamStats(match.homeTeam.id),
        this.apiClient.getTeamStats(match.awayTeam.id),
        this.apiClient.getH2H(match.homeTeam.id, match.awayTeam.id)
      ]);

      return {
        match,
        teamStats: {
          home: homeTeamStats,
          away: awayTeamStats
        },
        h2h: h2hStats
      };
    } catch (error) {
      console.error('Error in getMatchData:', error);
      throw error;
    }
  }

  private async storeMatches(matches: Match[]): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        for (const match of matches) {
          await tx.match.upsert({
            where: { id: match.id },
            update: {
              datetime: match.datetime,
              status: match.status
            },
            create: {
              id: match.id,
              datetime: match.datetime,
              status: match.status,
              homeTeam: {
                connectOrCreate: {
                  where: { id: match.homeTeam.id },
                  create: match.homeTeam
                }
              },
              awayTeam: {
                connectOrCreate: {
                  where: { id: match.awayTeam.id },
                  create: match.awayTeam
                }
              },
              competition: {
                connectOrCreate: {
                  where: { id: match.competition.id },
                  create: match.competition
                }
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Error storing matches:', error);
      throw error;
    }
  }
}