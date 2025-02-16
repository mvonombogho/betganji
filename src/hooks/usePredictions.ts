import { useState, useEffect } from 'react';
import { Prediction } from '@/types/prediction';
import { predictionService } from '@/lib/data/services/prediction-service';

export const usePredictions = (matchId?: string) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        const history = await predictionService.getPredictionHistory();
        setPredictions(
          matchId 
            ? history.filter(p => p.matchId === matchId)
            : history
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch predictions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();

    // Listen for real-time updates
    const handlePredictionUpdate = (event: CustomEvent<Prediction>) => {
      setPredictions(current => {
        const updated = [...current];
        const index = updated.findIndex(p => p.id === event.detail.id);
        
        if (index !== -1) {
          updated[index] = event.detail;
        } else if (!matchId || event.detail.matchId === matchId) {
          updated.push(event.detail);
        }
        
        return updated;
      });
    };

    window.addEventListener('predictionUpdate', handlePredictionUpdate as EventListener);

    return () => {
      window.removeEventListener('predictionUpdate', handlePredictionUpdate as EventListener);
    };
  }, [matchId]);

  const createPrediction = async (data: {
    matchId: string;
    result: { home: number; away: number };
    confidence: number;
    notes?: string;
  }) => {
    try {
      setError(null);
      const prediction = await predictionService.createPrediction(data);
      setPredictions(current => [...current, prediction]);
      return prediction;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create prediction'));
      throw err;
    }
  };

  return {
    predictions,
    isLoading,
    error,
    createPrediction
  };
};
