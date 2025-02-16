"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Odds } from '@prisma/client';

interface PredictionFormProps {
  matchId: string;
  currentOdds: Odds | undefined;
}

export function PredictionForm({ matchId, currentOdds }: PredictionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getPrediction = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          odds: currentOdds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      router.refresh();

      // Show prediction result
      alert(`Prediction: ${data.prediction.outcome}\nConfidence: ${(data.prediction.confidence * 100).toFixed(1)}%\n\nReasoning: ${data.prediction.reasoning}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentOdds) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500">Cannot generate prediction without odds data</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={getPrediction}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Analyzing...' : 'Get AI Prediction'}
      </Button>

      <p className="mt-2 text-xs text-gray-500 text-center">
        Our AI will analyze the match data and current odds to provide a prediction
      </p>
    </div>
  );
}
