import { OddsData } from '@/types/odds';

export class OddsAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ODDS_API_KEY || '';
    this.baseUrl = 'https://api.the-odds-api.com/v4';
  }

  async getLiveOdds(matchId: string): Promise<OddsData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sports/soccer/odds?apiKey=${this.apiKey}&game_id=${matchId}&markets=h2h&regions=eu`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch live odds');
      }

      const data = await response.json();
      return this.transformOddsData(data, matchId);
    } catch (error) {
      console.error('Error fetching live odds:', error);
      throw error;
    }
  }

  private transformOddsData(data: any, matchId: string): OddsData {
    const bookmaker = data.bookmakers[0];
    const markets = bookmaker.markets.find((m: any) => m.key === 'h2h');

    return {
      id: `${matchId}-${bookmaker.key}-${Date.now()}`,
      matchId,
      provider: bookmaker.key,
      homeWin: markets.outcomes.find((o: any) => o.name === data.home_team).price,
      draw: markets.outcomes.find((o: any) => o.name === 'Draw').price,
      awayWin: markets.outcomes.find((o: any) => o.name === data.away_team).price,
      timestamp: new Date()
    };
  }
}
