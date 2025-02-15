import { Match, MatchStatus } from '@/types/match';

export const createMockMatch = (overrides?: Partial<Match>): Match => ({
  id: '1',
  homeTeam: {
    id: '1',
    name: 'Home Team',
    shortName: 'HOME',
    tla: 'HOM'
  },
  awayTeam: {
    id: '2',
    name: 'Away Team',
    shortName: 'AWAY',
    tla: 'AWY'
  },
  competition: {
    id: '1',
    name: 'Test League',
    code: 'TL'
  },
  datetime: '2025-02-15T15:00:00Z',
  status: MatchStatus.SCHEDULED,
  ...overrides
});

export const createMockMatches = (count: number): Match[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockMatch({
      id: String(index + 1),
      homeTeam: {
        id: String(index * 2 + 1),
        name: `Home Team ${index + 1}`,
        shortName: `HOME${index + 1}`,
        tla: `HT${index + 1}`
      },
      awayTeam: {
        id: String(index * 2 + 2),
        name: `Away Team ${index + 1}`,
        shortName: `AWAY${index + 1}`,
        tla: `AT${index + 1}`
      }
    })
  );
};

export const mockDateString = '2025-02-15';
export const mockISOString = '2025-02-15T15:00:00Z';

export const mockPrismaMatch = (match: Match) => ({
  ...match,
  datetime: new Date(match.datetime),
  homeTeam: {
    connect: { id: match.homeTeam.id }
  },
  awayTeam: {
    connect: { id: match.awayTeam.id }
  },
  competition: {
    connect: { id: match.competition.id }
  }
});

export const mockOdds = {
  id: 'odds1',
  matchId: '1',
  provider: 'Test Provider',
  homeWin: 2.5,
  draw: 3.2,
  awayWin: 2.8,
  timestamp: '2025-02-15T12:00:00Z'
};

export const mockPrediction = {
  id: 'pred1',
  matchId: '1',
  result: 'HOME_WIN',
  confidence: 0.75,
  insights: {},
  createdAt: '2025-02-15T12:00:00Z'
};

export const mockSession = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  },
  expires: '2025-03-15T15:00:00Z'
};