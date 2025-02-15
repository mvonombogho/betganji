import { Match, TeamStats, H2HStats } from '@/types/match';
import { FootballDataClient } from '../providers/soccer/football-data';
import { prisma } from '@/lib/prisma';

export class MatchService {
  private footballDataClient: FootballDataClient;

  constructor() {
    this.footballDataClient = new FootballDataClient();
  }

  async getMatches(date: string): Promise<Match[]> {
    try {
      // Get matches from the API
      const matches = await this.footballDataClient.getMatches(date);

      // Get existing matches from the database
      const existingMatches = await prisma.match.findMany({
        where: {
          id: {
            in: matches.map(m => m.id)
          }
        },
        include: {
          odds: true,
          predictions: true
        }
      });

      // Create a map for quick lookup
      const existingMatchMap = new Map(
        existingMatches.map(m => [m.id, m])
      );

      // Merge API data with database data
      return matches.map(match => {
        const existingMatch = existingMatchMap.get(match.id);
        if (existingMatch) {
          return {
            ...match,
            odds: existingMatch.odds,
            predictions: existingMatch.predictions
          };
        }
        return match;
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw new Error('Failed to fetch matches');
    }
  }

  async getTeamStats(teamId: string): Promise<TeamStats> {
    try {
      return await this.footballDataClient.getTeamStats(teamId);
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw new Error('Failed to fetch team statistics');
    }
  }

  async getH2H(teamId1: string, teamId2: string): Promise<H2HStats> {
    try {
      return await this.footballDataClient.getH2H(teamId1, teamId2);
    } catch (error) {
      console.error('Error fetching H2H stats:', error);
      throw new Error('Failed to fetch head-to-head statistics');
    }
  }

  async syncMatchesToDatabase(matches: Match[]): Promise<void> {
    try {
      for (const match of matches) {
        await prisma.match.upsert({
          where: { id: match.id },
          update: {
            datetime: new Date(match.datetime),
            status: match.status,
            homeTeam: { connect: { id: match.homeTeam.id } },
            awayTeam: { connect: { id: match.awayTeam.id } },
            competition: { connect: { id: match.competition.id } }
          },
          create: {
            id: match.id,
            datetime: new Date(match.datetime),
            status: match.status,
            homeTeam: { connect: { id: match.homeTeam.id } },
            awayTeam: { connect: { id: match.awayTeam.id } },
            competition: { connect: { id: match.competition.id } }
          }
        });
      }
    } catch (error) {
      console.error('Error syncing matches to database:', error);
      throw new Error('Failed to sync matches to database');
    }
  }

  async getMatchById(id: string): Promise<Match | null> {
    try {
      const match = await prisma.match.findUnique({
        where: { id },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
          odds: true,
          predictions: true
        }
      });

      if (!match) return null;

      // Transform the database model to Match type
      return {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competition: match.competition,
        datetime: match.datetime.toISOString(),
        status: match.status,
        odds: match.odds,
        predictions: match.predictions
      };
    } catch (error) {
      console.error('Error fetching match by ID:', error);
      throw new Error('Failed to fetch match details');
    }
  }
}