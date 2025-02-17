import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getTeamStats, getHeadToHead } from '@/lib/services/stats-service';
import { TeamPerformance } from '@/components/analysis/team-performance';
import { HeadToHead } from '@/components/analysis/head-to-head';
import { OddsAnalysis } from '@/components/analysis/odds-analysis';
import { MatchStatsCard } from '@/components/analysis/match-stats-card';

async function getMatchAnalysis(id: string) {
  // Get match details
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      odds: {
        orderBy: {
          timestamp: 'desc',
        },
      },
    },
  });

  if (!match) return null;

  // Get team stats
  const [homeStats, awayStats] = await Promise.all([
    getTeamStats(match.homeTeamId),
    getTeamStats(match.awayTeamId),
  ]);

  // Get head-to-head history
  const h2hMatches = await getHeadToHead(match.homeTeamId, match.awayTeamId);

  return {
    match,
    homeStats,
    awayStats,
    h2hMatches,
  };
}

export default async function MatchAnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  const analysis = await getMatchAnalysis(params.id);

  if (!analysis) {
    notFound();
  }

  const { match, homeStats, awayStats, h2hMatches } = analysis;
  const currentOdds = match.odds[0];

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

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MatchStatsCard
          title="Average Goals (Home)"
          value={(homeStats.stats.goalsScored / 5).toFixed(1)}
          subtitle="Last 5 matches"
        />
        <MatchStatsCard
          title="Win Rate (Home)"
          value={`${((homeStats.stats.wins / 5) * 100).toFixed(0)}%`}
          subtitle="Last 5 matches"
        />
        <MatchStatsCard
          title="Average Goals (Away)"
          value={(awayStats.stats.goalsScored / 5).toFixed(1)}
          subtitle="Last 5 matches"
        />
        <MatchStatsCard
          title="Win Rate (Away)"
          value={`${((awayStats.stats.wins / 5) * 100).toFixed(0)}%`}
          subtitle="Last 5 matches"
        />
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeamPerformance
          name={match.homeTeam.name}
          recentForm={homeStats.recentForm}
          stats={homeStats.stats}
        />
        <TeamPerformance
          name={match.awayTeam.name}
          recentForm={awayStats.recentForm}
          stats={awayStats.stats}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HeadToHead
          matches={h2hMatches}
          team1Name={match.homeTeam.name}
          team2Name={match.awayTeam.name}
        />
        {currentOdds && (
          <OddsAnalysis
            currentOdds={currentOdds}
            historicalOdds={match.odds.slice(1)}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
          />
        )}
      </div>
    </div>
  );
}
