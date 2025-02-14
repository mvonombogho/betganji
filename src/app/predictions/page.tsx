import React from 'react';
import { Metadata } from 'next';
import PredictionList from '@/components/predictions/prediction-list';
import EnhancedPrediction from '@/components/predictions/enhanced-prediction';
import { getPredictions } from '@/lib/data/services/prediction-service';

export const metadata: Metadata = {
  title: 'Predictions | BetGanji',
  description: 'View and analyze soccer predictions'
};

export default async function PredictionsPage() {
  const predictions = await getPredictions();
  const selectedPrediction = predictions[0]; // Most recent prediction

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Predictions</h1>
      </div>

      {selectedPrediction && (
        <EnhancedPrediction 
          matchId={selectedPrediction.matchId} 
          prediction={selectedPrediction} 
        />
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Predictions</h2>
        <PredictionList predictions={predictions} />
      </div>
    </div>
  );
}