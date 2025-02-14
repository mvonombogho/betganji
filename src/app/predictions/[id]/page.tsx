import React from 'react';
import { notFound } from 'next/navigation';
import EnhancedPrediction from '@/components/predictions/enhanced-prediction';
import { getPrediction } from '@/lib/data/services/prediction-service';
import { MatchDetails } from '@/components/matches/match-details';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const prediction = await getPrediction(params.id);
  if (!prediction) return { title: 'Prediction Not Found' };

  return {
    title: `${prediction.match.homeTeam.name} vs ${prediction.match.awayTeam.name} Prediction | BetGanji`,
    description: `Soccer prediction analysis for ${prediction.match.homeTeam.name} vs ${prediction.match.awayTeam.name}`
  };
}

export default async function PredictionPage({ params }: { params: { id: string } }) {
  const prediction = await getPrediction(params.id);
  if (!prediction) notFound();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prediction Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Match Information</CardTitle>
          </CardHeader>
          <CardContent>
            <MatchDetails match={prediction.match} />
          </CardContent>
        </Card>

        <EnhancedPrediction 
          matchId={prediction.matchId} 
          prediction={prediction} 
        />
      </div>
    </div>
  );
}