import { render, screen } from '@/utils/test-utils';
import { PredictionCard } from '../PredictionCard';

describe('PredictionCard', () => {
  const mockPrediction = {
    id: 'pred_123',
    matchId: 'match_123',
    result: 'home_win',
    confidence: 75,
    insights: {
      keyFactors: [
        'Strong home form',
        'Better head-to-head record',
        'Superior attacking stats',
      ],
      riskAnalysis: 'Medium risk due to recent injury concerns',
      confidenceExplanation: 'Based on historical performance and current form',
      additionalNotes: 'Weather conditions might affect play style',
    },
    createdAt: new Date('2025-02-15T12:00:00Z'),
  };

  const mockInsights = {
    specificFactors: ['Player form', 'Tactical matchup'],
    variables: ['Weather', 'Injuries'],
    recommendedApproach: 'Monitor pre-match updates',
    alternativeScenarios: 'Consider draw if key player injured',
  };

  it('renders prediction details correctly', () => {
    render(
      <PredictionCard
        prediction={mockPrediction}
        insights={mockInsights}
      />
    );

    // Check basic elements
    expect(screen.getByText(/match prediction/i)).toBeInTheDocument();
    expect(screen.getByText(/75% confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/home win/i)).toBeInTheDocument();

    // Check key factors
    mockPrediction.insights.keyFactors.forEach(factor => {
      expect(screen.getByText(factor)).toBeInTheDocument();
    });

    // Check risk analysis
    expect(screen.getByText(mockPrediction.insights.riskAnalysis)).toBeInTheDocument();

    // Check additional notes
    expect(screen.getByText(mockPrediction.insights.additionalNotes)).toBeInTheDocument();

    // Check insights
    expect(screen.getByText(mockInsights.recommendedApproach)).toBeInTheDocument();
    expect(screen.getByText(mockInsights.alternativeScenarios)).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    render(
      <PredictionCard
        prediction={mockPrediction}
        insights={mockInsights}
        isLoading={true}
      />
    );

    // Check for loading skeleton elements
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    expect(screen.queryByText(/75% confidence/i)).not.toBeInTheDocument();
  });

  it('renders different confidence levels with appropriate styling', () => {
    const { rerender } = render(
      <PredictionCard
        prediction={{ ...mockPrediction, confidence: 85 }}
        insights={mockInsights}
      />
    );

    // High confidence
    const highConfidenceBadge = screen.getByText(/85% confidence/i);
    expect(highConfidenceBadge).toHaveClass('bg-green-100');

    // Medium confidence
    rerender(
      <PredictionCard
        prediction={{ ...mockPrediction, confidence: 65 }}
        insights={mockInsights}
      />
    );
    const mediumConfidenceBadge = screen.getByText(/65% confidence/i);
    expect(mediumConfidenceBadge).toHaveClass('bg-yellow-100');

    // Low confidence
    rerender(
      <PredictionCard
        prediction={{ ...mockPrediction, confidence: 45 }}
        insights={mockInsights}
      />
    );
    const lowConfidenceBadge = screen.getByText(/45% confidence/i);
    expect(lowConfidenceBadge).toHaveClass('bg-red-100');
  });

  it('renders correct icon based on prediction result', () => {
    const { rerender } = render(
      <PredictionCard
        prediction={mockPrediction}
        insights={mockInsights}
      />
    );

    // Home win
    expect(screen.getByTestId('home-win-icon')).toBeInTheDocument();

    // Away win
    rerender(
      <PredictionCard
        prediction={{ ...mockPrediction, result: 'away_win' }}
        insights={mockInsights}
      />
    );
    expect(screen.getByTestId('away-win-icon')).toBeInTheDocument();

    // Draw
    rerender(
      <PredictionCard
        prediction={{ ...mockPrediction, result: 'draw' }}
        insights={mockInsights}
      />
    );
    expect(screen.getByTestId('draw-icon')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(
      <PredictionCard
        prediction={mockPrediction}
        insights={mockInsights}
      />
    );

    const formattedDate = new Date('2025-02-15T12:00:00Z').toLocaleString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('renders all sections of insights', () => {
    render(
      <PredictionCard
        prediction={mockPrediction}
        insights={mockInsights}
      />
    );

    // Check section headings
    expect(screen.getByText(/key factors/i)).toBeInTheDocument();
    expect(screen.getByText(/risk analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/additional insights/i)).toBeInTheDocument();

    // Check insight content
    mockInsights.specificFactors.forEach(factor => {
      expect(screen.getByText(factor)).toBeInTheDocument();
    });
    mockInsights.variables.forEach(variable => {
      expect(screen.getByText(variable)).toBeInTheDocument();
    });
  });
});
