const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

interface ApiMatch {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
  };
  utcDate: string;
  status: string;
  score?: {
    fullTime: {
      home: number;
      away: number;
    };
  };
  competition: {
    name: string;
    area: {
      name: string;
    };
  };
}

async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'X-Auth-Token': API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`Football API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getMatches(dateFrom?: string, dateTo?: string) {
  const dateParams = dateFrom && dateTo ? `?dateFrom=${dateFrom}&dateTo=${dateTo}` : '';
  const data = await fetchFromAPI(`/matches${dateParams}`);
  return data.matches as ApiMatch[];
}

export async function getMatchById(id: string) {
  const data = await fetchFromAPI(`/matches/${id}`);
  return data as ApiMatch;
}

export async function getTeamMatches(teamId: string, limit: number = 5) {
  const data = await fetchFromAPI(`/teams/${teamId}/matches?limit=${limit}`);
  return data.matches as ApiMatch[];
}

// Function to sync matches with our database
export async function syncMatches(matches: ApiMatch[]) {
  for (const match of matches) {
    // Check if teams exist, create if not
    const homeTeam = await prisma.team.upsert({
      where: { externalId: match.homeTeam.id.toString() },
      update: { name: match.homeTeam.name },
      create: {
        externalId: match.homeTeam.id.toString(),
        name: match.homeTeam.name,
      },
    });

    const awayTeam = await prisma.team.upsert({
      where: { externalId: match.awayTeam.id.toString() },
      update: { name: match.awayTeam.name },
      create: {
        externalId: match.awayTeam.id.toString(),
        name: match.awayTeam.name,
      },
    });

    // Create or update match
    await prisma.match.upsert({
      where: { externalId: match.id.toString() },
      update: {
        status: match.status as any,
        homeScore: match.score?.fullTime.home,
        awayScore: match.score?.fullTime.away,
      },
      create: {
        externalId: match.id.toString(),
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        competition: `${match.competition.area.name} - ${match.competition.name}`,
        datetime: new Date(match.utcDate),
        status: match.status as any,
        homeScore: match.score?.fullTime.home,
        awayScore: match.score?.fullTime.away,
      },
    });
  }
}
