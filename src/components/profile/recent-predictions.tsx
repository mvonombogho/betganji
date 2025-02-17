import Link from 'next/link';

interface Prediction {
  id: string;
  matchId: string;
  prediction: string;
  confidence: number;
  isCorrect: boolean | null;
  createdAt: Date;
  match: {
    homeTeam: { name: string };
    awayTeam: { name: string };
    datetime: Date;
  };
}

interface RecentPredictionsProps {
  predictions: Prediction[];
}

export function RecentPredictions({ predictions }: RecentPredictionsProps) {
  if (!predictions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No predictions made yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <Link
          key={prediction.id}
          href={`/matches/${prediction.matchId}`}
          className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
        >
          {/* Match Info */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium">
                {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(prediction.match.datetime).toLocaleDateString()}
              </div>
            </div>
            <PredictionStatus isCorrect={prediction.isCorrect} />
          </div>

          {/* Prediction Details */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Predicted: {prediction.prediction.replace('_', ' ')}
            </span>
            <span className="text-gray-500">
              {(prediction.confidence * 100).toFixed(1)}% confidence
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function PredictionStatus({ isCorrect }: { isCorrect: boolean | null }) {
  if (isCorrect === null) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        Pending
      </span>
    );
  }

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        isCorrect
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isCorrect ? 'Correct' : 'Incorrect'}
    </span>
  );
}
