"use client";

import { useEffect, useState } from 'react';
import { MatchData } from '@/types/match';
import { OddsData } from '@/types/odds';
import { Card, CardContent } from '@/components/ui/card';
import { MatchOverview } from '@/components/matches/match-overview';
import { MatchOdds } from '@/components/matches/match-odds';
import { TeamStatsCard } from '@/components/stats/team-stats-card';

interface MatchDetailsProps {
  params: {
    id: string;
  };
}

export default function MatchDetailsPage({ params }: MatchDetailsProps) {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [matchResponse, oddsResponse] = await Promise.all([
          fetch(`/api/matches/${params.id}`),
          fetch(`/api/odds?matchId=${params.id}`)
        ]);

        if (!matchResponse.ok) throw new Error('Failed to fetch match data');
        if (!oddsResponse.ok) throw new Error('Failed to fetch odds data');

        const matchData = await matchResponse.json();
        const oddsData = await oddsResponse.json();

        setMatchData(matchData);
        setOdds(oddsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!matchData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <MatchOverview match={matchData.match} />
        
        {odds && <MatchOdds odds={odds} />}

        <div className="grid md:grid-cols-2 gap-6">
          <TeamStatsCard 
            stats={matchData.teamStats.home}
            teamName={matchData.match.homeTeam.name}
          />
          <TeamStatsCard 
            stats={matchData.teamStats.away}
            teamName={matchData.match.awayTeam.name}
          />
        </div>
      </div>
    </div>
  );
}
