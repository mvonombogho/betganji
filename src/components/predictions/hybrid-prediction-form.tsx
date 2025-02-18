import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfidenceAdjustment } from './confidence-adjustment';
import { ClaudeAnalysis } from './claude-analysis';

interface HybridPredictionFormProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  onPredictionComplete?: () => void;
  className?: string;
}

export function HybridPredictionForm({ 
  matchId,
  homeTeam,
  awayTeam,
  onPredictionComplete,
  className = ''
}: HybridPredictionFormProps) {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{
    result: string;
    mlConfidence: number;
    claudeAdjustment: number;
    finalConfidence: number;
    analysis: {
      factors: string[];
      reasoning: string;
      recommendations: string[];
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predictions/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId })
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      onPredictionComplete?.();
    } catch (err) {
      setError('Error getting prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Get Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center font-medium">
              {homeTeam} vs {awayTeam}
            </div>

            <Button
              onClick={getPrediction}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Get Prediction'}
            </Button>

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {prediction && (
        <>
          <ConfidenceAdjustment 
            mlConfidence={prediction.mlConfidence}
            claudeAdjustment={prediction.claudeAdjustment}
            finalConfidence={prediction.finalConfidence}
          />

          <ClaudeAnalysis analysis={prediction.analysis} />
        </>
      )}
    </div>
  );
}
