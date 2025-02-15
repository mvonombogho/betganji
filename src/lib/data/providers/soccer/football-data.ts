import { Match, TeamStats, H2HStats } from '@/types/match';

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

export class FootballDataClient {
  private async fetchWithAuth(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': API_KEY!,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Football Data API error: ${response.status}`);
    }

    return response.json();
  }

  async getMatches(date: string): Promise<Match[]> {
    const data = await this.fetchWithAuth(`/matches?dateFrom=${date}&dateTo=${date}`);
    
    return data.matches.map((match: any) => ({
      id: match.id.toString(),
      homeTeam: {
        id: match.homeTeam.id.toString(),
        name: match.homeTeam.name,
        shortName: match.homeTeam.shortName,
        tla: match.homeTeam.tla,
      },
      awayTeam: {
        id: match.awayTeam.id.toString(),
        name: match.awayTeam.name,
        shortName: match.awayTeam.shortName,
        tla: match.awayTeam.tla,
      },
      competition: {
        id: match.competition.id.toString(),
        name: match.competition.name,
        code: match.competition.code,
      },
      datetime: match.utcDate,
      status: match.status,
    }));
  }

  async getTeamStats(teamId: string): Promise<TeamStats> {
    const data = await this.fetchWithAuth(`/teams/${teamId}/matches?limit=10`);
    
    return {
      form: data.matches.slice(-5).map((match: any) => {
        const isHomeTeam = match.homeTeam.id.toString() === teamId;
        const teamScore = isHomeTeam ? match.score.fullTime.home : match.score.fullTime.away;
        const opponentScore = isHomeTeam ? match.score.fullTime.away : match.score.fullTime.home;
        
        if (teamScore > opponentScore) return 'W';
        if (teamScore < opponentScore) return 'L';
        return 'D';
      }).join(''),
      recentMatches: data.matches.map((match: any) => ({
        id: match.id.toString(),
        homeTeam: {
          id: match.homeTeam.id.toString(),
          name: match.homeTeam.name,
          score: match.score.fullTime.home,
        },
        awayTeam: {
          id: match.awayTeam.id.toString(),
          name: match.awayTeam.name,
          score: match.score.fullTime.away,
        },
        competition: {
          id: match.competition.id.toString(),
          name: match.competition.name,
        },
        date: match.utcDate,
      })),
    };
  }

  async getH2H(teamId1: string, teamId2: string): Promise<H2HStats> {
    const data = await this.fetchWithAuth(`/teams/${teamId1}/matches?limit=100`);
    
    const h2hMatches = data.matches.filter((match: any) => 
      match.homeTeam.id.toString() === teamId2 || match.awayTeam.id.toString() === teamId2
    );

    let team1Wins = 0;
    let team2Wins = 0;
    let draws = 0;

    h2hMatches.forEach((match: any) => {
      const team1IsHome = match.homeTeam.id.toString() === teamId1;
      const team1Score = team1IsHome ? match.score.fullTime.home : match.score.fullTime.away;
      const team2Score = team1IsHome ? match.score.fullTime.away : match.score.fullTime.home;

      if (team1Score > team2Score) team1Wins++;
      else if (team1Score < team2Score) team2Wins++;
      else draws++;
    });

    return {
      matches: h2hMatches.map((match: any) => ({
        id: match.id.toString(),
        homeTeam: {
          id: match.homeTeam.id.toString(),
          name: match.homeTeam.name,
          score: match.score.fullTime.home,
        },
        awayTeam: {
          id: match.awayTeam.id.toString(),
          name: match.awayTeam.name,
          score: match.score.fullTime.away,
        },
        competition: {
          id: match.competition.id.toString(),
          name: match.competition.name,
        },
        date: match.utcDate,
      })),
      stats: {
        team1Wins,
        team2Wins,
        draws,
        totalMatches: h2hMatches.length,
      },
    };
  }
}