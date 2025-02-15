import { prisma } from '@/lib/db/prisma';
import { MatchService } from '../match-service';
import { Match } from '@prisma/client';

// Mock Prisma client
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    match: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('MatchService', () => {
  let matchService: MatchService;

  beforeEach(() => {
    matchService = new MatchService(prisma);
    jest.clearAllMocks();
  });

  describe('getMatches', () => {
    it('should return matches for a given date', async () => {
      const mockMatches = [
        {
          id: '1',
          homeTeam: { name: 'Team A' },
          awayTeam: { name: 'Team B' },
          datetime: new Date(),
          status: 'SCHEDULED',
        },
      ];

      (prisma.match.findMany as jest.Mock).mockResolvedValue(mockMatches);

      const date = '2024-02-15';
      const result = await matchService.getMatches(date);

      expect(result).toEqual(mockMatches);
      expect(prisma.match.findMany).toHaveBeenCalledWith({
        where: {
          datetime: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        include: {
          homeTeam: true,
          awayTeam: true,
          odds: true,
          predictions: true,
        },
      });
    });

    it('should handle errors gracefully', async () => {
      (prisma.match.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const date = '2024-02-15';
      await expect(matchService.getMatches(date)).rejects.toThrow('Failed to fetch matches');
    });
  });

  describe('getMatchById', () => {
    it('should return a match by id', async () => {
      const mockMatch = {
        id: '1',
        homeTeam: { name: 'Team A' },
        awayTeam: { name: 'Team B' },
        datetime: new Date(),
        status: 'SCHEDULED',
      };

      (prisma.match.findUnique as jest.Mock).mockResolvedValue(mockMatch);

      const result = await matchService.getMatchById('1');

      expect(result).toEqual(mockMatch);
      expect(prisma.match.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          homeTeam: true,
          awayTeam: true,
          odds: true,
          predictions: true,
        },
      });
    });

    it('should return null for non-existent match', async () => {
      (prisma.match.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await matchService.getMatchById('999');

      expect(result).toBeNull();
    });
  });
});