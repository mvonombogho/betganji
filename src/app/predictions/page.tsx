'use client';

import React from 'react';
import { PredictionCard } from '@/components/predictions/PredictionCard';
import { usePrediction } from '@/hooks/usePrediction';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PredictionsPage() {
  const {
    prediction,
    insights,
    isLoading,
    error,
    generatePrediction
  } = usePrediction();

  const handleGeneratePrediction = async () => {
    // Example match data - in a real app, this would come from your match selection
    const matchData = {
      id: 'match_123',
      homeTeam: {
        name: 'Manchester United',
        recentForm: [
          { result: 'W', opponent: 'Arsenal' },
          { result: 'D', opponent: 'Liverpool' },
          { result: 'W', opponent: 'Newcastle' },
          { result: 'L', opponent: 'Manchester City' },
          { result: 'W', opponent: 'Tottenham' }
        ],
        stats: {
          goalsScored: 2.1,
          goalsConceded: 1.2,
          cleanSheets: 8,
          formRating: 7.5
        }
      },
      awayTeam: {
        name: 'Chelsea',
        recentForm: [
          { result: 'L', opponent: 'Arsenal' },
          { result: 'W', opponent: 'Brighton' },
          { result: 'W', opponent: 'Brentford' },
          { result: 'D', opponent: 'Newcastle' },
          { result: 'L', opponent: 'Manchester City' }
        ],
        stats: {
          goalsScored: 1.8,
          goalsConceded: 1.4,
          cleanSheets: 6,
          formRating: 6.8
        }
      },
      competition: {
        name: 'Premier League'
      },
      datetime: new Date().toISOString(),
      h2h: [
        {
          homeTeam: 'Manchester United',
          awayTeam: 'Chelsea',
          homeScore: 2,
          awayScore: 1,
          date: '2024-12-01'
        },
        {
          homeTeam: 'Chelsea',
          awayTeam: 'Manchester United',
          homeScore: 0,
          awayScore: 2,
          date: '2024-05-15'
        },
        {
          homeTeam: 'Manchester United',
          awayTeam: 'Chelsea',
          homeScore: 1,
          awayScore: 1,
          date: '2023-12-10'
        }
      ]
    };

    const oddsData = {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8
    };

    await generatePrediction(matchData, oddsData);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Match Predictions</h1>
        <Button
          onClick={handleGeneratePrediction}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Prediction'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      {prediction && insights ? (
        <PredictionCard
          prediction={prediction}
          insights={insights}
          isLoading={isLoading}
        />
      ) : !error && (
        <Card className="p-8 text-center text-gray-500">
          Click the button above to generate a prediction for the selected match.
        </Card>
      )}
    </div>
  );
}
