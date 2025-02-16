import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { MatchHeader } from '@/components/matches/match-header';
import { PredictionForm } from '@/components/predictions/prediction-form';

interface MatchPageProps {
  params: {
    id: string;
  };
}

async function getMatch(id: string) {
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
        predictions: {
          orderBy: {
            createdAt: 'desc',
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
  const match = await getMatch(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <MatchHeader 
        homeTeam={match.homeTeam.name}
        awayTeam={match.awayTeam.name}
        kickoff={match.datetime}
        status={match.status}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Odds</h2>
          {match.odds[0] ? (
            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
              <div className="text-center">
                <div className="text-sm text-gray-500">Home Win</div>
                <div className="text-xl font-bold">{match.odds[0].homeWin.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Draw</div>
                <div className="text-xl font-bold">{match.odds[0].draw.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Away Win</div>
                <div className="text-xl font-bold">{match.odds[0].awayWin.toFixed(2)}</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No odds available</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Get Prediction</h2>
          <PredictionForm matchId={match.id} currentOdds={match.odds[0]} />
        </div>
      </div>
    </div>
  );
}
