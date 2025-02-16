import { Match, TeamStats, H2HStats } from '@/types/match';

export class APIFootballClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.API_FOOTBALL_KEY || '';
    this.baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
  }

  async getMatches(date: string): Promise<Match[]> {
    try {
      const response = await fetch(`${this.baseUrl}/fixtures?date=${date}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      return this.transformMatches(data.response);
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async getTeamStats(teamId: string): Promise<TeamStats> {
    try {
      const response = await fetch(`${this.baseUrl}/teams/statistics?team=${teamId}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team stats');
      }

      const data = await response.json();
      return this.transformTeamStats(data.response);
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  }

  async getH2H(teamId1: string, teamId2: string): Promise<H2HStats> {
    try {
      const response = await fetch(`${this.baseUrl}/fixtures/headtohead?h2h=${teamId1}-${teamId2}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch H2H stats');
      }

      const data = await response.json();
      return this.transformH2HStats(data.response);
    } catch (error) {
      console.error('Error fetching H2H stats:', error);
      throw error;
    }
  }

  private transformMatches(data: any[]): Match[] {
    return data.map(match => ({
      id: match.fixture.id.toString(),
      homeTeam: {
        id: match.teams.home.id.toString(),
        name: match.teams.home.name,
        logo: match.teams.home.logo
      },
      awayTeam: {
        id: match.teams.away.id.toString(),
        name: match.teams.away.name,
        logo: match.teams.away.logo
      },
      competition: {
        id: match.league.id.toString(),
        name: match.league.name,
        country: match.league.country
      },
      datetime: new Date(match.fixture.date),
      status: match.fixture.status.short
    }));
  }

  private transformTeamStats(data: any): TeamStats {
    // Implementation of team stats transformation
    return {
      // Transform API response to TeamStats type
    } as TeamStats;
  }

  private transformH2HStats(data: any): H2HStats {
    // Implementation of H2H stats transformation
    return {
      // Transform API response to H2HStats type
    } as H2HStats;
  }
}