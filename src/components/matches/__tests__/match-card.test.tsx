import { render, screen, fireEvent } from '@testing-library/react';
import { MatchCard } from '../match-card';
import { Match, MatchStatus } from '@/types/match';

const mockMatch: Match = {
  id: '1',
  homeTeam: {
    id: 'home1',
    name: 'Home Team',
    shortName: 'HOME',
    tla: 'HOM'
  },
  awayTeam: {
    id: 'away1',
    name: 'Away Team',
    shortName: 'AWAY',
    tla: 'AWY'
  },
  competition: {
    id: 'comp1',
    name: 'Test League',
    code: 'TL'
  },
  datetime: '2025-02-15T15:00:00Z',
  status: MatchStatus.SCHEDULED,
  odds: {
    id: 'odds1',
    matchId: '1',
    provider: 'Test Provider',
    homeWin: 2.5,
    draw: 3.2,
    awayWin: 2.8,
    timestamp: '2025-02-15T12:00:00Z'
  }
};

describe('MatchCard', () => {
  it('renders match details correctly', () => {
    render(<MatchCard match={mockMatch} />);

    // Check team names
    expect(screen.getByText('Home Team')).toBeInTheDocument();
    expect(screen.getByText('Away Team')).toBeInTheDocument();

    // Check competition name
    expect(screen.getByText('Test League')).toBeInTheDocument();

    // Check status
    expect(screen.getByText('SCHEDULED')).toBeInTheDocument();

    // Check odds
    expect(screen.getByText('2.50')).toBeInTheDocument();
    expect(screen.getByText('3.20')).toBeInTheDocument();
    expect(screen.getByText('2.80')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<MatchCard match={mockMatch} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Home Team'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays prediction badge when predictions are available', () => {
    const matchWithPrediction = {
      ...mockMatch,
      predictions: [{
        id: 'pred1',
        matchId: '1',
        result: 'HOME_WIN',
        confidence: 0.75,
        insights: {},
        createdAt: '2025-02-15T12:00:00Z'
      }]
    };

    render(<MatchCard match={matchWithPrediction} />);
    expect(screen.getByText('Prediction Available')).toBeInTheDocument();
  });

  it('applies correct status color based on match status', () => {
    const liveMatch = {
      ...mockMatch,
      status: MatchStatus.LIVE
    };

    render(<MatchCard match={liveMatch} />);
    const statusBadge = screen.getByText('LIVE');
    expect(statusBadge).toHaveClass('bg-red-500');
  });
});