import { http, HttpResponse } from 'msw'

export const handlers = [
  // Matches endpoint
  http.get('/api/matches', () => {
    return HttpResponse.json([
      {
        id: '1',
        homeTeam: { id: '1', name: 'Arsenal' },
        awayTeam: { id: '2', name: 'Chelsea' },
        datetime: '2024-02-15T15:00:00Z',
        status: 'SCHEDULED'
      }
    ])
  }),

  // Predictions endpoint
  http.post('/api/predictions', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: '1',
      matchId: body.matchId,
      result: body.result,
      confidence: 0.85,
      insights: {
        key_factors: ['Recent form', 'Head-to-head record'],
        analysis: 'Strong home team performance expected'
      },
      createdAt: new Date().toISOString()
    }, { status: 201 })
  }),

  // Odds endpoint
  http.get('/api/odds/:matchId', ({ params }) => {
    const { matchId } = params
    return HttpResponse.json({
      id: '1',
      matchId,
      provider: 'BETFAIR',
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8,
      timestamp: new Date().toISOString()
    })
  })
]
