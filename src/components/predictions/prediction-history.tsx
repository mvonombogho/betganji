import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prediction } from '@/types/prediction';
import { Match } from '@/types/match';

interface PredictionHistoryProps {
  predictions: Array<Prediction & { match: Match }>;
  isLoading?: boolean;
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ 
  predictions,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPredictionOutcome = (prediction: Prediction, match: Match) => {
    if (match.status !== 'FINISHED' || !match.score) return 'PENDING';

    const predictedWinner = prediction.result.home > prediction.result.away ? 'HOME' :
                           prediction.result.home < prediction.result.away ? 'AWAY' : 'DRAW';

    const actualWinner = match.score.home > match.score.away ? 'HOME' :
                        match.score.home < match.score.away ? 'AWAY' : 'DRAW';

    return predictedWinner === actualWinner ? 'CORRECT' : 'INCORRECT';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction) => {
            const outcome = getPredictionOutcome(prediction, prediction.match);
            
            return (
              <div key={prediction.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(prediction.match.datetime).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={outcome === 'CORRECT' ? 'success' : 
                            outcome === 'INCORRECT' ? 'destructive' : 'default'}
                  >
                    {outcome}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium">Predicted Score</p>
                    <p>
                      {prediction.result.home} - {prediction.result.away}
                    </p>
                  </div>
                  {prediction.match.score && (
                    <div>
                      <p className="text-sm font-medium">Actual Score</p>
                      <p>
                        {prediction.match.score.home} - {prediction.match.score.away}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Confidence: {prediction.confidence}%</span>
                  {prediction.notes && (
                    <span>Notes: {prediction.notes}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionHistory;