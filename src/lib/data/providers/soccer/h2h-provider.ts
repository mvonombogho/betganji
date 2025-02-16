import { H2HMatch, H2HStats, H2HForm } from '@/types/h2h';

export class H2HProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.API_FOOTBALL_KEY || '';
    this.baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
  }

  async getH2HStats(team1Id: string, team2Id: string): Promise<H2HStats> {
    try {
      const response = await fetch(
        `${this.baseUrl}/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=10`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch H2H stats');
      }

      const data = await response.json();
      return this.transformH2HData(data.response, team1Id, team2Id);
    } catch (error) {
      console.error('Error fetching H2H stats:', error);
      throw error;
    }
  }

  private transformH2HData(data: any[], team1Id: string, team2Id: string): H2HStats {
    // Transform matches
    const matches: H2HMatch[] = data.map(match => ({
      id: match.fixture.id.toString(),
      date: new Date(match.fixture.date),
      competition: match.league.name,
      homeTeam: {
        id: match.teams.home.id.toString(),
        name: match.teams.home.name,
        score: match.goals.home
      },
      awayTeam: {
        id: match.teams.away.id.toString(),
        name: match.teams.away.name,
        score: match.goals.away
      }
    }));

    // Calculate team1 stats
    const team1Form = this.calculateTeamForm(matches, team1Id);
    const team2Form = this.calculateTeamForm(matches, team2Id);

    // Calculate summary
    const summary = this.calculateSummary(matches, team1Id, team2Id);

    return {
      team1Id,
      team2Id,
      matches,
      summary,
      team1Form,
      team2Form,
      lastMatch: matches[0],
      venue: this.calculateVenueStats(matches, team1Id, team2Id)
    };
  }

  private calculateTeamForm(matches: H2HMatch[], teamId: string): H2HForm {
    const lastFive = matches.slice(0, 5);
    let goalsScored = 0;
    let goalsConceded = 0;
    let cleanSheets = 0;
    let goallessDraws = 0;

    const results = lastFive.map(match => {
      const isHome = match.homeTeam.id === teamId;
      const teamScore = isHome ? match.homeTeam.score : match.awayTeam.score;
      const opponentScore = isHome ? match.awayTeam.score : match.homeTeam.score;

      goalsScored += teamScore;
      goalsConceded += opponentScore;

      if (opponentScore === 0) cleanSheets++;
      if (teamScore === 0 && opponentScore === 0) goallessDraws++;

      if (teamScore > opponentScore) return 'W';
      if (teamScore < opponentScore) return 'L';
      return 'D';
    });

    return {
      lastFiveResults: results,
      averageGoalsScored: goalsScored / lastFive.length,
      averageGoalsConceded: goalsConceded / lastFive.length,
      cleanSheets,
      goallessDraws
    };
  }

  private calculateSummary(matches: H2HMatch[], team1Id: string, team2Id: string) {
    return matches.reduce(
      (acc, match) => {
        const team1IsHome = match.homeTeam.id === team1Id;
        const team1Score = team1IsHome ? match.homeTeam.score : match.awayTeam.score;
        const team2Score = team1IsHome ? match.awayTeam.score : match.homeTeam.score;

        acc.team1Goals += team1Score;
        acc.team2Goals += team2Score;

        if (team1Score > team2Score) acc.team1Wins++;
        else if (team2Score > team1Score) acc.team2Wins++;
        else acc.draws++;

        return acc;
      },
      {
        totalMatches: matches.length,
        team1Wins: 0,
        team2Wins: 0,
        draws: 0,
        team1Goals: 0,
        team2Goals: 0
      }
    );
  }

  private calculateVenueStats(matches: H2HMatch[], team1Id: string, team2Id: string) {
    return matches.reduce(
      (acc, match) => {
        if (match.homeTeam.id === team1Id) {
          if (match.homeTeam.score > match.awayTeam.score) acc.team1HomeWins++;
          else if (match.homeTeam.score < match.awayTeam.score) acc.team2HomeWins++;
          else acc.draws++;
        } else if (match.homeTeam.id === team2Id) {
          if (match.homeTeam.score > match.awayTeam.score) acc.team2HomeWins++;
          else if (match.homeTeam.score < match.awayTeam.score) acc.team1HomeWins++;
          else acc.draws++;
        }
        return acc;
      },
      { team1HomeWins: 0, team2HomeWins: 0, draws: 0 }
    );
  }
}
