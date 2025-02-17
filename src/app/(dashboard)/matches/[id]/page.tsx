import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { TeamPerformance } from '@/components/analysis/team-performance';
import { HeadToHead } from '@/components/analysis/head-to-head';
import { LiveOdds } from '@/components/odds/live-odds';
import { PredictionRequest } from '@/components/predictions/prediction-request';

async function getMatchDetails(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      odds: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 10, // Get last 10 odds for the chart
      },
    },
  });

  if (!match) {
    notFound();
  }

  // Get team stats
  const [homeStats, awayStats] = await Promise.all([
    getTeamStats(match.homeTeamId),
    getTeamStats(match.awayTeamId),
  ]);

  return {
    match,
    homeStats,
    awayStats,
  };
}

export default async function MatchPage({ params }: { params: { id: string } }) {
  const { match, homeStats, awayStats } = await getMatchDetails(params.id);

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h1>
        <p className="text-gray-500">
          {new Date(match.datetime).toLocaleString()}
        </p>
      </div>

      {/* Live Odds Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Match Odds</h2>
        <LiveOdds
          matchId={match.id}
          initialOdds={match.odds.reverse()} // Reverse to get chronological order
          homeTeam={match.homeTeam.name}
          awayTeam={match.awayTeam.name}
        />
      </div>

      {/* Team Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeamPerformance
          name={match.homeTeam.name}
          stats={homeStats}
        />
        <TeamPerformance
          name={match.awayTeam.name}
          stats={awayStats}
        />
      </div>

      {/* Prediction Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Get AI Prediction</h2>
        <PredictionRequest matchId={match.id} />
      </div>
    </div>
  );
}
