import Link from 'next/link';
import { Match, Prediction } from '@prisma/client';

type PredictionWithMatch = Prediction & {
  match: Match & {
    homeTeam: { name: string };
    awayTeam: { name: string };
  };
};

interface PredictionHistoryProps {
  predictions: PredictionWithMatch[];
}

export function PredictionHistory({ predictions }: PredictionHistoryProps) {
  if (!predictions.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No predictions made yet
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

          <div className="flex justify-between text-sm">
            <div className="text-gray-600">
              Predicted: {prediction.prediction.replace('_', ' ')}
            </div>
            <div className="text-gray-500">
              {(prediction.confidence * 100).toFixed(1)}% confidence
            </div>
          </div>

          {prediction.reasoning && (
            <div className="mt-2 text-sm text-gray-600 line-clamp-2">
              {prediction.reasoning}
            </div>
          )}

          <div className="mt-2 text-xs text-gray-400">
            Made on: {new Date(prediction.createdAt).toLocaleString()}
          </div>
        </Link>
      ))}
    </div>
  );
}

function PredictionStatus({ isCorrect }: { isCorrect: boolean | null }) {
  if (isCorrect === null) {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
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
