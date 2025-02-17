import { formatDate } from '@/lib/utils';

type Prediction = {
  id: string;
  prediction: string;
  confidence: number;
  reasoning: string;
  createdAt: Date;
  match: {
    homeTeam: { name: string };
    awayTeam: { name: string };
    datetime: Date;
  };
};

interface PredictionListProps {
  predictions: Prediction[];
}

export function PredictionList({ predictions }: PredictionListProps) {
  if (!predictions.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No predictions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <div
          key={prediction.id}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">
                {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
              </h3>
              <p className="text-sm text-gray-500">
                Match date: {formatDate(prediction.match.datetime)}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {prediction.prediction.replace('_', ' ')}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Confidence: {(prediction.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Reasoning:</p>
            <p>{prediction.reasoning}</p>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Predicted on: {formatDate(prediction.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
