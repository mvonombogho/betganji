import { oddsService } from '../odds-service'
import { prismaMock } from '../../../__mocks__/prisma'

describe('OddsService', () => {
  describe('getLiveOdds', () => {
    it('should return live odds for a match', async () => {
      const mockOdds = {
        id: '1',
        matchId: '1',
        provider: 'BETFAIR',
        homeWin: 2.0,
        draw: 3.0,
        awayWin: 4.0,
        timestamp: new Date()
      }

      prismaMock.odds.findFirst.mockResolvedValue(mockOdds)

      const result = await oddsService.getLiveOdds('1')
      expect(result).toEqual(mockOdds)
      expect(prismaMock.odds.findFirst).toHaveBeenCalledWith({
        where: { matchId: '1' },
        orderBy: { timestamp: 'desc' }
      })
    })

    it('should return null when no odds are found', async () => {
      prismaMock.odds.findFirst.mockResolvedValue(null)

      const result = await oddsService.getLiveOdds('1')
      expect(result).toBeNull()
    })
  })
})