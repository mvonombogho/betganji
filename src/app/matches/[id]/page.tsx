"use client";

import { useMatchDetails } from '@/hooks/use-match-details';
import { Metadata } from 'next';
import { MatchOverview } from '@/components/matches/match-overview';
import { MatchOdds } from '@/components/matches/match-odds';
import { TeamStatsCard } from '@/components/stats/team-stats-card';
import { H2HStatsContainer } from '@/components/stats/h2h-stats';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate } from '@/lib/utils/date';

interface MatchDetailsProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Match Details | BetGanji',
  description: 'Detailed match statistics, odds, and predictions'
};

export default function MatchDetailsPage({ params }: MatchDetailsProps) {
  const {
    matchData,
    odds,
    h2hStats,
    loading,
    errors,
    hasError
  } = useMatchDetails(params.id);

  // Update page title when match data is loaded
  useEffect(() => {
    if (matchData) {
      const { homeTeam, awayTeam, datetime } = matchData.match;
      const title = `${homeTeam.name} vs ${awayTeam.name} | ${formatDate(datetime)}`;
      document.title = title;
    }
  }, [matchData]);

  // Critical error - match data failed to load
  if (errors.match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={errors.match} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        {/* Match Overview Section */}
        <MatchOverview 
          match={matchData?.match}
          isLoading={loading.match}
        />

        {/* Match Odds Section */}
        <MatchOdds 
          odds={odds}
          isLoading={loading.odds}
          error={errors.odds}
        />

        {/* Team Stats Section */}
        {(matchData || loading.match) && (
          <div className="grid md:grid-cols-2 gap-6">
            <TeamStatsCard 
              stats={matchData?.teamStats.home}
              teamName={matchData?.match.homeTeam.name || 'Home Team'}
              isLoading={loading.match}
            />
            <TeamStatsCard 
              stats={matchData?.teamStats.away}
              teamName={matchData?.match.awayTeam.name || 'Away Team'}
              isLoading={loading.match}
            />
          </div>
        )}

        {/* H2H Stats Section */}
        {matchData && (
          <H2HStatsContainer 
            stats={h2hStats}
            team1Name={matchData.match.homeTeam.name}
            team2Name={matchData.match.awayTeam.name}
            isLoading={loading.h2h}
            error={errors.h2h}
          />
        )}
      </div>
    </div>
  );
}
