import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PredictionList } from '@/components/predictions/prediction-list';
import { getLeaguePredictions } from '@/lib/data/services/prediction-service';

interface LeaguePredictionsProps {
  leagueId: string;
}

export default async function LeaguePredictions({ leagueId }: LeaguePredictionsProps) {
  const predictions = await getLeaguePredictions(leagueId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <PredictionList predictions={predictions} />
      </CardContent>
    </Card>
  );
}