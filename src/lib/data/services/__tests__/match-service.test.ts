import { matchService } from '../match-service'
import { prismaMock } from '../../../__mocks__/prisma'

describe('MatchService', () => {
  describe('getMatches', () => {
    it('should return matches for a given date', async () => {
      const mockMatches = [
        {
          id: '1',
          homeTeam: { id: '1', name: 'Team A' },
          awayTeam: { id: '2', name: 'Team B' },
          datetime: new Date(),
          status: 'SCHEDULED'
        }
      ]

      prismaMock.match.findMany.mockResolvedValue(mockMatches)

      const result = await matchService.getMatches('2024-02-15')
      expect(result).toEqual(mockMatches)
      expect(prismaMock.match.findMany).toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      prismaMock.match.findMany.mockRejectedValue(new Error('Database error'))

      await expect(matchService.getMatches('2024-02-15')).rejects.toThrow('Failed to fetch matches')
    })
  })
})