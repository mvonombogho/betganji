import { useState } from 'react';
import { MatchData, OddsData, Prediction, PredictionInsights } from '@/types';

interface UsePredictionReturn {
  prediction: Prediction | null;
  insights: PredictionInsights | null;
  isLoading: boolean;
  error: Error | null;
  generatePrediction: (matchData: MatchData, oddsData: OddsData) => Promise<void>;
}

export function usePrediction(): UsePredictionReturn {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [insights, setInsights] = useState<PredictionInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generatePrediction = async (matchData: MatchData, oddsData: OddsData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/predictions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchData, oddsData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    insights,
    isLoading,
    error,
    generatePrediction,
  };
}
