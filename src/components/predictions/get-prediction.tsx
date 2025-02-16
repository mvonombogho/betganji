"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GetPredictionProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export function GetPrediction({ matchId, homeTeam, awayTeam, odds }: GetPredictionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState<{
    outcome: string;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const handleGetPrediction = async () => {
    try {
      setIsLoading(true);
      setError('');
      setPrediction(null);

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          odds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction({
        outcome: data.prediction.prediction,
        confidence: data.prediction.confidence,
        reasoning: data.prediction.reasoning,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {prediction ? (
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-md">
            <div className="font-semibold mb-1">
              Prediction: {prediction.outcome.replace('_', ' ')}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Confidence: {(prediction.confidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              {prediction.reasoning}
            </div>
          </div>
          <Button
            onClick={() => setPrediction(null)}
            variant="outline"
            className="w-full"
          >
            Get New Prediction
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleGetPrediction}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : 'Get AI Prediction'}
        </Button>
      )}
    </div>
  );
}
