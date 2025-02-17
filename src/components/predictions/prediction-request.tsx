"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PredictionRequestProps {
  matchId: string;
  onPredictionComplete?: () => void;
}

export function PredictionRequest({ matchId, onPredictionComplete }: PredictionRequestProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState<{
    prediction: string;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const requestPrediction = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to generate prediction');
      }

      const data = await response.json();
      setPrediction(data);
      onPredictionComplete?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
        <p className="text-sm text-gray-500 mt-2">
          Analyzing match data and generating prediction...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
        <Button
          onClick={() => setError('')}
          variant="outline"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (prediction) {
    return (
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="font-medium text-blue-900 mb-1">
          Prediction: {prediction.prediction.replace('_', ' ')}
        </div>
        <div className="text-sm text-blue-800 mb-2">
          Confidence: {(prediction.confidence * 100).toFixed(1)}%
        </div>
        <p className="text-sm text-blue-700">
          {prediction.reasoning}
        </p>
        <Button
          onClick={() => setPrediction(null)}
          variant="outline"
          className="mt-4"
        >
          Get New Prediction
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <Button onClick={requestPrediction}>
        Get AI Prediction
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        Our AI will analyze team stats, form, and odds to generate a prediction
      </p>
    </div>
  );
}
