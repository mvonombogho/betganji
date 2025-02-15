import { GET, GET_BY_ID } from '../route';
import { MatchService } from '@/lib/data/services/match-service';
import { getServerSession } from 'next-auth/next';
import { Match, MatchStatus } from '@/types/match';

// Mock the dependencies
jest.mock('next-auth/next');
jest.mock('@/lib/data/services/match-service');

describe('Matches API', () => {
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
  });

  describe('GET handler', () => {
    it('returns unauthorized when no session exists', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new Request('http://localhost/api/matches');
      const response = await GET(request);

      expect(response.status).toBe(401);
      expect(await response.text()).toBe('Unauthorized');
    });

    it('returns matches for authenticated users', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (MatchService.prototype.getMatches as jest.Mock).mockResolvedValue([mockMatch]);

      const request = new Request('http://localhost/api/matches?date=2025-02-15');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([mockMatch]);
    });

    it('uses current date when no date parameter is provided', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (MatchService.prototype.getMatches as jest.Mock).mockResolvedValue([mockMatch]);

      const request = new Request('http://localhost/api/matches');
      await GET(request);

      const today = new Date().toISOString().split('T')[0];
      expect(MatchService.prototype.getMatches).toHaveBeenCalledWith(today);
    });

    it('handles service errors gracefully', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (MatchService.prototype.getMatches as jest.Mock).mockRejectedValue(new Error('Service error'));

      const request = new Request('http://localhost/api/matches');
      const response = await GET(request);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe('Internal Server Error');
    });
  });

  describe('GET_BY_ID handler', () => {
    it('returns unauthorized when no session exists', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new Request('http://localhost/api/matches?id=1');
      const response = await GET_BY_ID(request);

      expect(response.status).toBe(401);
      expect(await response.text()).toBe('Unauthorized');
    });

    it('returns bad request when no id is provided', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const request = new Request('http://localhost/api/matches');
      const response = await GET_BY_ID(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Match ID is required');
    });

    it('returns match details for valid id', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (MatchService.prototype.getMatchById as jest.Mock).mockResolvedValue(mockMatch);

      const request = new Request('http://localhost/api/matches?id=1');
      const response = await GET_BY_ID(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockMatch);
    });

    it('returns 404 for non-existent match', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (MatchService.prototype.getMatchById as jest.Mock).mockResolvedValue(null);

      const request = new Request('http://localhost/api/matches?id=999');
      const response = await GET_BY_ID(request);

      expect(response.status).toBe(404);
      expect(await response.text()).toBe('Match not found');
    });

    it('handles service errors gracefully', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (MatchService.prototype.getMatchById as jest.Mock).mockRejectedValue(new Error('Service error'));

      const request = new Request('http://localhost/api/matches?id=1');
      const response = await GET_BY_ID(request);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe('Internal Server Error');
    });
  });
});