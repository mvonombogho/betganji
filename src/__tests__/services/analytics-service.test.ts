import { getROIAnalysis, getLeaguePerformance } from '@/lib/data/services/analytics-service';
import prisma from '@/lib/db';

jest.mock('@/lib/db', () => ({
  bet: {
    findMany: jest.fn()
  }
}));

describe('Analytics Service', () => {
  const userId = 'user-1';
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-02-01');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getROIAnalysis', () => {
    const mockBets = [
      {
        id: '1',
        stake: 100,
        potentialReturn: 190,
        status: 'WON',
        createdAt: new Date('2024-01-15'),
        prediction: { result: 'HOME_WIN' }
      },
      {
        id: '2',
        stake: 100,
        potentialReturn: 190,
        status: 'LOST',
        createdAt: new Date('2024-01-16'),
        prediction: { result: 'AWAY_WIN' }
      }
    ];

    it('calculates ROI correctly', async () => {
      (prisma.bet.findMany as jest.Mock).mockResolvedValue(mockBets);

      const analysis = await getROIAnalysis(userId, startDate, endDate);

      expect(analysis).toEqual({
        investment: 200,
        returns: 190,
        bets: 2,
        winRate: 50,
        profitHistory: expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(String),
            profit: expect.any(Number),
            cumulativeROI: expect.any(Number)
          })
        ])
      });
    });

    it('handles empty bet history', async () => {
      (prisma.bet.findMany as jest.Mock).mockResolvedValue([]);

      const analysis = await getROIAnalysis(userId, startDate, endDate);

      expect(analysis).toEqual({
        investment: 0,
        returns: 0,
        bets: 0,
        winRate: 0,
        profitHistory: []
      });
    });
  });

  describe('getLeaguePerformance', () => {
    const leagueId = 'league-1';
    const mockBets = [
      {
        stake: 100,
        potentialReturn: 190,
        status: 'WON',
        prediction: {
          match: { competitionId: leagueId }
        }
      }
    ];

    it('calculates league performance metrics', async () => {
      (prisma.bet.findMany as jest.Mock).mockResolvedValue(mockBets);

      const performance = await getLeaguePerformance(userId, leagueId);

      expect(performance).toEqual({
        totalBets: 1,
        wonBets: 1,
        investment: 100,
        returns: 190
      });
    });

    it('handles no bets for league', async () => {
      (prisma.bet.findMany as jest.Mock).mockResolvedValue([]);

      const performance = await getLeaguePerformance(userId, leagueId);

      expect(performance).toEqual({
        totalBets: 0,
        wonBets: 0,
        investment: 0,
        returns: 0
      });
    });
  });
});