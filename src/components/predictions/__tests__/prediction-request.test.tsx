import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PredictionRequest } from '../prediction-request';

// Mock fetch
global.fetch = jest.fn();

describe('PredictionRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<PredictionRequest matchId="match123" />);

    expect(screen.getByText('Get AI Prediction')).toBeInTheDocument();
    expect(screen.getByText(/Our AI will analyze/)).toBeInTheDocument();
  });

  it('shows loading state when requesting prediction', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          prediction: 'WIN_HOME',
          confidence: 0.8,
          reasoning: 'Test reasoning',
        }),
      })
    );

    render(<PredictionRequest matchId="match123" />);

    // Click the prediction button
    fireEvent.click(screen.getByText('Get AI Prediction'));

    // Check loading state
    expect(await screen.findByText(/Analyzing match data/)).toBeInTheDocument();
  });

  it('displays prediction when API call succeeds', async () => {
    // Mock successful API response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          prediction: 'WIN_HOME',
          confidence: 0.8,
          reasoning: 'Test reasoning',
        }),
      })
    );

    render(<PredictionRequest matchId="match123" />);

    // Click the prediction button
    fireEvent.click(screen.getByText('Get AI Prediction'));

    // Check prediction display
    await waitFor(() => {
      expect(screen.getByText('Prediction: WIN HOME')).toBeInTheDocument();
      expect(screen.getByText('Confidence: 80.0%')).toBeInTheDocument();
      expect(screen.getByText('Test reasoning')).toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('API Error'),
      })
    );

    render(<PredictionRequest matchId="match123" />);

    // Click the prediction button
    fireEvent.click(screen.getByText('Get AI Prediction'));

    // Check error display
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('calls onPredictionComplete callback after successful prediction', async () => {
    const onPredictionComplete = jest.fn();

    // Mock successful API response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          prediction: 'WIN_HOME',
          confidence: 0.8,
          reasoning: 'Test reasoning',
        }),
      })
    );

    render(
      <PredictionRequest
        matchId="match123"
        onPredictionComplete={onPredictionComplete}
      />
    );

    // Click the prediction button
    fireEvent.click(screen.getByText('Get AI Prediction'));

    // Check if callback was called
    await waitFor(() => {
      expect(onPredictionComplete).toHaveBeenCalled();
    });
  });
});
