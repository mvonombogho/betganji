import Link from 'next/link';
import { formatDate } from '@/lib/utils';

type Prediction = {
  id: string;
  prediction: string;
  confidence: number;
  isCorrect: boolean | null;
  match: {
    homeTeam: { name: string };
    awayTeam: { name: string };
    datetime: Date;
  };
};

interface RecentPredictionsProps {
  predictions: Prediction[];
}

function getPredictionStatus(isCorrect: boolean | null) {
  if (isCorrect === null) {
    return {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800'
    };
  }

  return isCorrect
    ? { label: 'Correct', color: 'bg-green-100 text-green-800' }
    : { label: 'Incorrect', color: 'bg-red-100 text-red-800' };
}

export function RecentPredictions({ predictions }: RecentPredictionsProps) {
  if (!predictions.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Predictions</h2>
        <p className="text-gray-500">No predictions made yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent Predictions</h2>
      
      <div className="space-y-4">
        {predictions.map((prediction) => {
          const status = getPredictionStatus(prediction.isCorrect);
          
          return (
            <Link
              key={prediction.id}
              href={`/predictions/${prediction.id}`}
              className="block p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">
                    {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(prediction.match.datetime)}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Predicted: {prediction.prediction.replace('_', ' ')}
                </span>
                <span className="text-gray-500">
                  {(prediction.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/predictions"
        className="block text-center text-sm text-blue-600 hover:text-blue-500 mt-4"
      >
        View all predictions →
      </Link>
    </div>
  );
}
