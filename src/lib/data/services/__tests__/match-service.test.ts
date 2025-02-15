import { MatchService } from '../match-service';
import { FootballDataClient } from '../../providers/soccer/football-data';
import { prisma } from '@/lib/prisma';
import { Match, MatchStatus } from '@/types/match';

// Mock the dependencies
jest.mock('../../providers/soccer/football-data');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    match: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn()
    }
  }
}));

describe('MatchService', () => {
  let service: MatchService;
  let mockFootballDataClient: jest.Mocked<FootballDataClient>;

  const mockMatch: Match = {
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
    status: MatchStatus.SCHEDULED
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MatchService();
    mockFootballDataClient = FootballDataClient as jest.Mocked<typeof FootballDataClient>;
  });

  describe('getMatches', () => {
    it('fetches and merges matches with database data', async () => {
      // Setup API response
      mockFootballDataClient.prototype.getMatches.mockResolvedValue([mockMatch]);

      // Setup database response
      const mockDbMatch = {
        ...mockMatch,
        odds: [{
          id: 'odds1',
          matchId: '1',
          provider: 'Test Provider',
          homeWin: 2.5,
          draw: 3.2,
          awayWin: 2.8,
          timestamp: '2025-02-15T12:00:00Z'
        }],
        predictions: [{
          id: 'pred1',
          matchId: '1',
          result: 'HOME_WIN',
          confidence: 0.75,
          insights: {},
          createdAt: '2025-02-15T12:00:00Z'
        }]
      };

      (prisma.match.findMany as jest.Mock).mockResolvedValue([mockDbMatch]);

      const matches = await service.getMatches('2025-02-15');

      expect(matches).toHaveLength(1);
      expect(matches[0]).toEqual({
        ...mockMatch,
        odds: mockDbMatch.odds,
        predictions: mockDbMatch.predictions
      });
    });

    it('handles API errors gracefully', async () => {
      mockFootballDataClient.prototype.getMatches.mockRejectedValue(new Error('API Error'));

      await expect(service.getMatches('2025-02-15')).rejects.toThrow('Failed to fetch matches');
    });
  });

  describe('syncMatchesToDatabase', () => {
    it('syncs matches to database successfully', async () => {
      (prisma.match.upsert as jest.Mock).mockResolvedValue(mockMatch);

      await service.syncMatchesToDatabase([mockMatch]);

      expect(prisma.match.upsert).toHaveBeenCalledWith({
        where: { id: mockMatch.id },
        update: expect.any(Object),
        create: expect.any(Object)
      });
    });

    it('handles database errors gracefully', async () => {
      (prisma.match.upsert as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(service.syncMatchesToDatabase([mockMatch]))
        .rejects.toThrow('Failed to sync matches to database');
    });
  });

  describe('getMatchById', () => {
    it('returns match with related data', async () => {
      const mockDbMatch = {
        ...mockMatch,
        datetime: new Date(mockMatch.datetime),
        odds: [],
        predictions: [],
        homeTeam: mockMatch.homeTeam,
        awayTeam: mockMatch.awayTeam,
        competition: mockMatch.competition
      };

      (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockDbMatch);

      const match = await service.getMatchById('1');

      expect(match).toEqual({
        ...mockMatch,
        odds: [],
        predictions: []
      });
    });

    it('returns null for non-existent match', async () => {
      (prisma.match.findUnique as jest.Mock).mockResolvedValue(null);

      const match = await service.getMatchById('999');
      expect(match).toBeNull();
    });

    it('handles database errors gracefully', async () => {
      (prisma.match.findUnique as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(service.getMatchById('1'))
        .rejects.toThrow('Failed to fetch match details');
    });
  });
});