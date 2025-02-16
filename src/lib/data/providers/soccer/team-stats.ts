import { TeamStats } from '@/types/team-stats';

export class TeamStatsProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.API_FOOTBALL_KEY || '';
    this.baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
  }

  async getTeamStats(teamId: string): Promise<TeamStats> {
    try {
      const [statsResponse, fixturesResponse] = await Promise.all([
        fetch(`${this.baseUrl}/teams/statistics?team=${teamId}`, {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        }),
        fetch(`${this.baseUrl}/fixtures?team=${teamId}&last=5`, {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        })
      ]);

      if (!statsResponse.ok || !fixturesResponse.ok) {
        throw new Error('Failed to fetch team stats');
      }

      const [statsData, fixturesData] = await Promise.all([
        statsResponse.json(),
        fixturesResponse.json()
      ]);

      return this.transformTeamStats(statsData.response, fixturesData.response, teamId);
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  }

  private transformTeamStats(statsData: any, fixturesData: any[], teamId: string): TeamStats {
    const stats = statsData;
    
    // Calculate form from last 5 matches
    const form = fixturesData.map(match => {
      const isHome = match.teams.home.id.toString() === teamId;
      const teamScore = isHome ? match.goals.home : match.goals.away;
      const opponentScore = isHome ? match.goals.away : match.goals.home;

      if (teamScore > opponentScore) return 'W';
      if (teamScore < opponentScore) return 'L';
      return 'D';
    });

    return {
      teamId,
      lastMatches: {
        total: stats.fixtures.played.total || 0,
        wins: stats.fixtures.wins.total || 0,
        draws: stats.fixtures.draws.total || 0,
        losses: stats.fixtures.loses.total || 0
      },
      goalsScored: {
        total: stats.goals.for.total.total || 0,
        average: parseFloat(stats.goals.for.average.total) || 0,
        home: stats.goals.for.total.home,
        away: stats.goals.for.total.away
      },
      goalsConceded: {
        total: stats.goals.against.total.total || 0,
        average: parseFloat(stats.goals.against.average.total) || 0,
        home: stats.goals.against.total.home,
        away: stats.goals.against.total.away
      },
      cleanSheets: stats.clean_sheet.total || 0,
      failedToScore: stats.failed_to_score.total || 0,
      form
    };
  }
}
