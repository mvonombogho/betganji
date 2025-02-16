"use client";

import { useMatchDetails } from '@/hooks/use-match-details';
import { MatchOverview } from '@/components/matches/match-overview';
import { MatchOdds } from '@/components/matches/match-odds';
import { TeamStatsCard } from '@/components/stats/team-stats-card';
import { H2HStatsContainer } from '@/components/stats/h2h-stats';
import { ErrorMessage } from '@/components/ui/error-message';

interface MatchDetailsProps {
  params: {
    id: string;
  };
}

export default function MatchDetailsPage({ params }: MatchDetailsProps) {
  const {
    matchData,
    odds,
    h2hStats,
    loading,
    errors,
    hasError
  } = useMatchDetails(params.id);

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

        {/* To be continued in next chunk... */}
      </div>
    </div>
  );
}
