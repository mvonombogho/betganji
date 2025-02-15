import { FootballDataClient } from '../football-data';
import { MatchStatus } from '@/types/match';

// Mock fetch globally
global.fetch = jest.fn();

describe('FootballDataClient', () => {
  let client: FootballDataClient;

  beforeEach(() => {
    client = new FootballDataClient();
    jest.clearAllMocks();
  });

  describe('getMatches', () => {
    const mockMatchesResponse = {
      matches: [
        {
          id: 1,
          homeTeam: {
            id: 1,
            name: 'Home Team',
            shortName: 'HOME',
            tla: 'HOM'
          },
          awayTeam: {
            id: 2,
            name: 'Away Team',
            shortName: 'AWAY',
            tla: 'AWY'
          },
          competition: {
            id: 1,
            name: 'Test League',
            code: 'TL'
          },
          utcDate: '2025-02-15T15:00:00Z',
          status: MatchStatus.SCHEDULED
        }
      ]
    };

    it('fetches and transforms matches correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMatchesResponse)
      });

      const date = '2025-02-15';
      const matches = await client.getMatches(date);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/matches?dateFrom=${date}&dateTo=${date}`),
        expect.any(Object)
      );

      expect(matches).toHaveLength(1);
      expect(matches[0]).toEqual({
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
      });
    });

    it('handles API errors correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429
      });

      await expect(client.getMatches('2025-02-15')).rejects.toThrow('Football Data API error: 429');
    });
  });

  describe('getTeamStats', () => {
    const mockTeamStatsResponse = {
      matches: [
        {
          id: 1,
          homeTeam: { id: 1, name: 'Test Team' },
          awayTeam: { id: 2, name: 'Opponent' },
          score: { fullTime: { home: 2, away: 1 } },
          competition: { id: 1, name: 'Test League' },
          utcDate: '2025-02-15T15:00:00Z'
        }
      ]
    };

    it('calculates team stats correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTeamStatsResponse)
      });

      const stats = await client.getTeamStats('1');

      expect(stats.form).toBe('W');
      expect(stats.recentMatches).toHaveLength(1);
      expect(stats.recentMatches[0]).toEqual({
        id: '1',
        homeTeam: {
          id: '1',
          name: 'Test Team',
          score: 2
        },
        awayTeam: {
          id: '2',
          name: 'Opponent',
          score: 1
        },
        competition: {
          id: '1',
          name: 'Test League'
        },
        date: '2025-02-15T15:00:00Z'
      });
    });
  });

  describe('getH2H', () => {
    const mockH2HResponse = {
      matches: [
        {
          id: 1,
          homeTeam: { id: 1, name: 'Team 1' },
          awayTeam: { id: 2, name: 'Team 2' },
          score: { fullTime: { home: 2, away: 1 } },
          competition: { id: 1, name: 'Test League' },
          utcDate: '2025-02-15T15:00:00Z'
        }
      ]
    };

    it('calculates H2H stats correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockH2HResponse)
      });

      const h2h = await client.getH2H('1', '2');

      expect(h2h.stats).toEqual({
        team1Wins: 1,
        team2Wins: 0,
        draws: 0,
        totalMatches: 1
      });
      expect(h2h.matches).toHaveLength(1);
    });
  });
});