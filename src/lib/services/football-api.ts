const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function fetchFromAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Football API error:', error);
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getUpcomingMatches() {
  const endpoint = '/matches?status=SCHEDULED&limit=50';
  return fetchFromAPI(endpoint);
}

export async function getLiveMatches() {
  const endpoint = '/matches?status=LIVE';
  return fetchFromAPI(endpoint);
}

export async function getMatchDetails(matchId: string) {
  const endpoint = `/matches/${matchId}`;
  return fetchFromAPI(endpoint);
}

export async function getTeamStatistics(teamId: string) {
  const endpoint = `/teams/${teamId}/matches?limit=10&status=FINISHED`;
  return fetchFromAPI(endpoint);
}

export async function getCompetitions() {
  const endpoint = '/competitions';
  return fetchFromAPI(endpoint);
}
