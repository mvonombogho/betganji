import { type OddsData } from '@/types/odds';

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4';

export class OddsService {
  async getLatestOdds(sportKey: string): Promise<OddsData[]> {
    const response = await fetch(
      `${ODDS_API_BASE_URL}/sports/${sportKey}/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h,spreads,totals&dateFormat=iso`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch odds: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOddsData(data);
  }

  async getHistoricalOdds(sportKey: string, fromDate: string, toDate: string): Promise<OddsData[]> {
    const response = await fetch(
      `${ODDS_API_BASE_URL}/sports/${sportKey}/odds/historical/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&dateFormat=iso&from=${fromDate}&to=${toDate}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch historical odds: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformOddsData(data);
  }

  private transformOddsData(rawData: any[]): OddsData[] {
    return rawData.map(item => ({
      id: item.id,
      sportKey: item.sport_key,
      sportTitle: item.sport_title,
      homeTeam: item.home_team,
      awayTeam: item.away_team,
      commenceTime: new Date(item.commence_time),
      bookmakers: item.bookmakers.map((bookmaker: any) => ({
        key: bookmaker.key,
        title: bookmaker.title,
        lastUpdate: new Date(bookmaker.last_update),
        markets: bookmaker.markets.map((market: any) => ({
          key: market.key,
          outcomes: market.outcomes.map((outcome: any) => ({
            name: outcome.name,
            price: outcome.price,
          })),
        })),
      })),
    }));
  }
}

export const oddsService = new OddsService();