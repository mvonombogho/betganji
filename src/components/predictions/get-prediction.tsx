"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

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

type PredictionState = {
  status: 'idle' | 'loading' | 'error' | 'success';
  error?: string;
  data?: {
    outcome: string;
    confidence: number;
    reasoning: string;
  };
};

export function GetPrediction({ matchId, homeTeam, awayTeam, odds }: GetPredictionProps) {
  const [predictionState, setPredictionState] = useState<PredictionState>({
    status: 'idle'
  });

  const handleGetPrediction = async () => {
    try {
      setPredictionState({ status: 'loading' });

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          odds,
        }),
      });

      if (!response.ok) {
        throw new Error(response.status === 429 
          ? 'Too many requests. Please try again later.'
          : 'Failed to get prediction');
      }

      const data = await response.json();
      setPredictionState({
        status: 'success',
        data: {
          outcome: data.prediction.prediction,
          confidence: data.prediction.confidence,
          reasoning: data.prediction.reasoning,
        }
      });
    } catch (err) {
      setPredictionState({
        status: 'error',
        error: err instanceof Error ? err.message : 'An error occurred'
      });
    }
  };

  const retry = () => {
    handleGetPrediction();
  };

  if (predictionState.status === 'loading') {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
        <p className="mt-2 text-sm text-gray-500">Analyzing match data...</p>
      </div>
    );
  }

  if (predictionState.status === 'error') {
    return (
      <ErrorMessage 
        message={predictionState.error || 'Failed to get prediction'}
        retry={retry}
      />
    );
  }

  if (predictionState.status === 'success' && predictionState.data) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-md">
          <div className="font-semibold mb-2">
            Prediction: {predictionState.data.outcome.replace('_', ' ')}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Confidence: {(predictionState.data.confidence * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            {predictionState.data.reasoning}
          </div>
        </div>
        <Button
          onClick={() => setPredictionState({ status: 'idle' })}
          variant="outline"
          className="w-full"
        >
          Get New Prediction
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGetPrediction}
        className="w-full"
      >
        Get AI Prediction
      </Button>
      <p className="text-xs text-gray-500 text-center">
        Our AI will analyze the match data and current odds
      </p>
    </div>
  );
}
