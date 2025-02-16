"use client";

import { useEffect, useState } from 'react';
import { Match, MatchData } from '@/types/match';
import { OddsData } from '@/types/odds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/date';

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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
        {/* Match Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Match Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col items-center space-y-2">
                <img 
                  src={matchData.match.homeTeam.logo} 
                  alt={matchData.match.homeTeam.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="font-medium text-lg">{matchData.match.homeTeam.name}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold mb-2">vs</span>
                <span className="text-sm text-gray-500">{formatDate(matchData.match.datetime)}</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <img 
                  src={matchData.match.awayTeam.logo} 
                  alt={matchData.match.awayTeam.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="font-medium text-lg">{matchData.match.awayTeam.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Odds */}
        {odds && (
          <Card>
            <CardHeader>
              <CardTitle>Current Odds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Home Win</p>
                  <p className="text-xl font-bold">{odds.homeWin.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Draw</p>
                  <p className="text-xl font-bold">{odds.draw.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Away Win</p>
                  <p className="text-xl font-bold">{odds.awayWin.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TODO: Add Team Stats */}
        {/* TODO: Add H2H Stats */}
        {/* TODO: Add Prediction Section */}
      </div>
    </div>
  );
}
