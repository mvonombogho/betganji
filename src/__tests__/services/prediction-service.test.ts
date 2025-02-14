import { getHistoricalPredictions, getLeagueStats } from '@/lib/data/services/prediction-service';
import prisma from '@/lib/db';

jest.mock('@/lib/db', () => ({
  match: {
    findUnique: jest.fn(),
    findMany: jest.fn()
  },
  prediction: {
    findMany: jest.fn()
  }
}));

describe('Prediction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHistoricalPredictions', () => {
    const matchId = 'match-1';
    const mockMatch = {
      id: matchId,
      homeTeam: { id: 'team-1' },
      awayTeam: { id: 'team-2' },
      competition: { id: 'league-1' },
      predictions: []
    };

    const mockPredictions = [
      {
        result: 'HOME_WIN',
        match: { result: 'HOME_WIN', datetime: new Date() }
      },
      {
        result: 'AWAY_WIN',
        match: { result: 'HOME_WIN', datetime: new Date() }
      }
    ];

    it('calculates historical stats correctly', async () => {
      (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockMatch);
      (prisma.prediction.findMany as jest.Mock).mockResolvedValue(mockPredictions);

      const history = await getHistoricalPredictions(matchId);

      expect(history).toEqual({
        accuracy: 50,
        totalPredictions: 2,
        recentTrend: expect.objectContaining({
          wins: expect.any(Number),
          total: expect.any(Number)
        })
      });
    });

    it('handles match not found', async () => {
      (prisma.match.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getHistoricalPredictions(matchId)).rejects.toThrow('Match not found');
    });

    it('handles no predictions', async () => {
      (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockMatch);
      (prisma.prediction.findMany as jest.Mock).mockResolvedValue([]);

      const history = await getHistoricalPredictions(matchId);

      expect(history).toEqual({
        accuracy: 0,
        totalPredictions: 0,
        recentTrend: {
          wins: 0,
          total: 0
        }
      });
    });
  });

  describe('getLeagueStats', () => {
    const leagueId = 'league-1';
    const mockPredictions = [
      {
        confidence: 80,
        result: 'HOME_WIN',
        match: { result: 'HOME_WIN' }
      },
      {
        confidence: 70,
        result: 'DRAW',
        match: { result: 'DRAW' }
      }
    ];

    it('calculates league stats correctly', async () => {
      (prisma.prediction.findMany as jest.Mock).mockResolvedValue(mockPredictions);

      const stats = await getLeagueStats(leagueId);

      expect(stats).toEqual({
        totalPredictions: 2,
        successRate: 100,
        averageConfidence: 75
      });
    });

    it('handles no predictions for league', async () => {
      (prisma.prediction.findMany as jest.Mock).mockResolvedValue([]);

      const stats = await getLeagueStats(leagueId);

      expect(stats).toEqual({
        totalPredictions: 0,
        successRate: 0,
        averageConfidence: 0
      });
    });
  });
});