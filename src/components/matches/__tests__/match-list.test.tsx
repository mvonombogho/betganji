import { render, screen, waitFor } from '@testing-library/react'
import MatchList from '../match-list'

describe('MatchList', () => {
  it('should render matches', async () => {
    render(<MatchList date="2024-02-15" />)

    await waitFor(() => {
      expect(screen.getByText('Arsenal vs Chelsea')).toBeInTheDocument()
    })
  })

  it('should show loading state', () => {
    render(<MatchList date="2024-02-15" />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should handle errors', async () => {
    server.use(
      http.get('/api/matches', () => {
        return HttpResponse.error()
      })
    )

    render(<MatchList date="2024-02-15" />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
