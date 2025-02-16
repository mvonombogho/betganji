import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

interface MatchPageProps {
  params: { id: string };
}

async function getMatchDetails(id: string) {
  try {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        odds: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });

    return match;
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
}

export default async function MatchPage({ params }: MatchPageProps) {
  const match = await getMatchDetails(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Match Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-sm text-gray-500 mb-2">
          {new Date(match.datetime).toLocaleString()}
        </div>
        <div className="flex justify-between items-center text-xl font-bold">
          <span>{match.homeTeam.name}</span>
          <span>vs</span>
          <span>{match.awayTeam.name}</span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Odds Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Current Odds</h2>
          {match.odds[0] ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">Home Win</div>
                <div className="text-xl font-bold">{match.odds[0].homeWin.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Draw</div>
                <div className="text-xl font-bold">{match.odds[0].draw.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Away Win</div>
                <div className="text-xl font-bold">{match.odds[0].awayWin.toFixed(2)}</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No odds available</p>
          )}
        </div>

        {/* Prediction Section Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Get AI Prediction</h2>
          <p className="text-gray-500">Prediction form will be added here</p>
        </div>
      </div>
    </div>
  );
}
