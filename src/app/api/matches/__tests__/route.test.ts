import { GET } from '../route'
import { prismaMock } from '@/lib/__mocks__/prisma'

describe('/api/matches', () => {
  it('should return matches for the given date', async () => {
    const mockMatches = [
      {
        id: '1',
        homeTeam: { id: '1', name: 'Arsenal' },
        awayTeam: { id: '2', name: 'Chelsea' },
        datetime: new Date('2024-02-15T15:00:00Z'),
        status: 'SCHEDULED'
      }
    ]

    prismaMock.match.findMany.mockResolvedValue(mockMatches)

    const url = new URL('http://localhost:3000/api/matches?date=2024-02-15')
    const response = await GET({ url } as Request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockMatches)
  })

  it('should handle errors gracefully', async () => {
    prismaMock.match.findMany.mockRejectedValue(new Error('Database error'))

    const url = new URL('http://localhost:3000/api/matches?date=2024-02-15')
    const response = await GET({ url } as Request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })
})
