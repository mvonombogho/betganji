const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchFromAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'apikey': API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Odds API error:', error);
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getMatchOdds(matchId: string) {
  // Convert our match ID to the odds API format
  const endpoint = `/sports/soccer/events/${matchId}/odds`;
  return fetchFromAPI(endpoint);
}

export async function getLatestOdds() {
  const endpoint = '/sports/soccer/odds?regions=uk&markets=h2h';
  return fetchFromAPI(endpoint);
}

export function transformOdds(apiOdds: any) {
  // Find the average odds from different bookmakers
  const bookmakers = apiOdds.bookmakers || [];
  if (bookmakers.length === 0) return null;

  let totalHome = 0;
  let totalDraw = 0;
  let totalAway = 0;
  let count = 0;

  bookmakers.forEach((bookmaker: any) => {
    const markets = bookmaker.markets.find((m: any) => m.key === 'h2h');
    if (markets && markets.outcomes) {
      const outcomes = markets.outcomes;
      const home = outcomes.find((o: any) => o.name === apiOdds.home_team);
      const away = outcomes.find((o: any) => o.name === apiOdds.away_team);
      const draw = outcomes.find((o: any) => o.name === 'Draw');

      if (home && away && draw) {
        totalHome += home.price;
        totalDraw += draw.price;
        totalAway += away.price;
        count++;
      }
    }
  });

  if (count === 0) return null;

  return {
    homeWin: totalHome / count,
    draw: totalDraw / count,
    awayWin: totalAway / count,
    timestamp: new Date(),
  };
}
