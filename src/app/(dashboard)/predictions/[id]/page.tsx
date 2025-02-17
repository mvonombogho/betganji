import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

async function getPredictionDetails(id: string) {
  const prediction = await prisma.prediction.findUnique({
    where: { id },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          odds: {
            orderBy: {
              timestamp: 'desc'
            },
            take: 1
          }
        }
      }
    }
  });

  if (!prediction) {
    notFound();
  }

  return prediction;
}

function getPredictionStatus(prediction: Awaited<ReturnType<typeof getPredictionDetails>>) {
  if (prediction.match.status !== 'FINISHED') {
    return {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800'
    };
  }

  if (prediction.isCorrect === true) {
    return {
      label: 'Correct',
      color: 'bg-green-100 text-green-800'
    };
  }

  if (prediction.isCorrect === false) {
    return {
      label: 'Incorrect',
      color: 'bg-red-100 text-red-800'
    };
  }

  return {
    label: 'Unknown',
    color: 'bg-gray-100 text-gray-800'
  };
}

export default async function PredictionPage({
  params
}: {
  params: { id: string }
}) {
  const prediction = await getPredictionDetails(params.id);
  const status = getPredictionStatus(prediction);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prediction Details</h1>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
          {status.label}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Match Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Match Information</h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Teams</div>
              <div className="font-medium">
                {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Match Date</div>
              <div className="font-medium">
                {formatDate(prediction.match.datetime)}
              </div>
            </div>

            {prediction.match.status === 'FINISHED' && (
              <div>
                <div className="text-sm text-gray-500">Final Score</div>
                <div className="font-medium">
                  {prediction.match.homeScore} - {prediction.match.awayScore}
                </div>
              </div>
            )}

            {prediction.match.odds[0] && (
              <div>
                <div className="text-sm text-gray-500">Match Odds</div>
                <div className="grid grid-cols-3 gap-4 mt-1">
                  <div>
                    <div className="text-xs text-gray-500">Home</div>
                    <div className="font-medium">{prediction.match.odds[0].homeWin.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Draw</div>
                    <div className="font-medium">{prediction.match.odds[0].draw.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Away</div>
                    <div className="font-medium">{prediction.match.odds[0].awayWin.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Prediction Analysis</h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Predicted Outcome</div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-1">
                {prediction.prediction.replace('_', ' ')}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Confidence Level</div>
              <div className="font-medium">
                {(prediction.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">AI Reasoning</div>
              <div className="mt-1 text-gray-700">
                {prediction.reasoning}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Prediction Made</div>
              <div className="font-medium">
                {formatDate(prediction.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
