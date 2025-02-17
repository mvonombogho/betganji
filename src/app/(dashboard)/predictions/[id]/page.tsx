import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

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

export default async function PredictionPage({
  params
}: {
  params: { id: string }
}) {
  const prediction = await getPredictionDetails(params.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prediction Details</h1>
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
