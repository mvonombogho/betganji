import { render, screen, fireEvent } from '@testing-library/react';
import { MatchList } from '../match-list';
import { Match, MatchStatus } from '@/types/match';

const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: { id: 'home1', name: 'Home Team 1' },
    awayTeam: { id: 'away1', name: 'Away Team 1' },
    competition: { id: 'comp1', name: 'Premier League' },
    datetime: '2025-02-15T15:00:00Z',
    status: MatchStatus.SCHEDULED
  },
  {
    id: '2',
    homeTeam: { id: 'home2', name: 'Home Team 2' },
    awayTeam: { id: 'away2', name: 'Away Team 2' },
    competition: { id: 'comp2', name: 'La Liga' },
    datetime: '2025-02-15T17:00:00Z',
    status: MatchStatus.LIVE
  }
];

describe('MatchList', () => {
  const mockOnMatchSelect = jest.fn();
  const mockOnDateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all matches initially', () => {
    render(
      <MatchList
        matches={mockMatches}
        onMatchSelect={mockOnMatchSelect}
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText('Home Team 1')).toBeInTheDocument();
    expect(screen.getByText('Home Team 2')).toBeInTheDocument();
    expect(screen.getByText('Premier League')).toBeInTheDocument();
    expect(screen.getByText('La Liga')).toBeInTheDocument();
  });

  it('filters matches by competition', () => {
    render(
      <MatchList
        matches={mockMatches}
        onMatchSelect={mockOnMatchSelect}
        onDateChange={mockOnDateChange}
      />
    );

    // Open competition select
    fireEvent.click(screen.getByRole('combobox', { name: /select competition/i }));
    
    // Select Premier League
    fireEvent.click(screen.getByText('Premier League'));

    // Should only show Premier League match
    expect(screen.getByText('Home Team 1')).toBeInTheDocument();
    expect(screen.queryByText('Home Team 2')).not.toBeInTheDocument();
  });

  it('filters matches by status', () => {
    render(
      <MatchList
        matches={mockMatches}
        onMatchSelect={mockOnMatchSelect}
        onDateChange={mockOnDateChange}
      />
    );

    // Open status select
    fireEvent.click(screen.getByRole('combobox', { name: /select status/i }));
    
    // Select LIVE
    fireEvent.click(screen.getByText('Live'));

    // Should only show live match
    expect(screen.queryByText('Home Team 1')).not.toBeInTheDocument();
    expect(screen.getByText('Home Team 2')).toBeInTheDocument();
  });

  it('calls onMatchSelect when a match is clicked', () => {
    render(
      <MatchList
        matches={mockMatches}
        onMatchSelect={mockOnMatchSelect}
        onDateChange={mockOnDateChange}
      />
    );

    fireEvent.click(screen.getByText('Home Team 1'));
    expect(mockOnMatchSelect).toHaveBeenCalledWith(mockMatches[0]);
  });

  it('shows no matches message when filtered results are empty', () => {
    render(
      <MatchList
        matches={[]}
        onMatchSelect={mockOnMatchSelect}
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText('No matches found for the selected filters')).toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', () => {
    render(
      <MatchList
        matches={mockMatches}
        onMatchSelect={mockOnMatchSelect}
        onDateChange={mockOnDateChange}
      />
    );

    // Apply a filter first
    fireEvent.click(screen.getByRole('combobox', { name: /select competition/i }));
    fireEvent.click(screen.getByText('Premier League'));

    // Click reset
    fireEvent.click(screen.getByText('Reset Filters'));

    // Should show all matches again
    expect(screen.getByText('Home Team 1')).toBeInTheDocument();
    expect(screen.getByText('Home Team 2')).toBeInTheDocument();
  });
});