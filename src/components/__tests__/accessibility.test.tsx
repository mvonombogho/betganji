import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import MatchCard from '../matches/match-card';
import PredictionForm from '../predictions/prediction-form';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  const mockMatch = {
    id: '1',
    homeTeam: { id: '1', name: 'Arsenal' },
    awayTeam: { id: '2', name: 'Chelsea' },
    datetime: new Date('2024-02-15T15:00:00Z').toISOString(),
    status: 'SCHEDULED'
  };

  const mockOdds = {
    homeWin: 2.1,
    draw: 3.4,
    awayWin: 3.8
  };

  describe('MatchCard', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <MatchCard 
          match={mockMatch}
          odds={mockOdds}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('PredictionForm', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <PredictionForm 
          match={mockMatch}
          odds={mockOdds}
          onSubmit={async () => {}}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle error states accessibly', async () => {
      const { container } = render(
        <PredictionForm 
          match={mockMatch}
          odds={mockOdds}
          error="Failed to submit prediction"
          onSubmit={async () => {}}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});