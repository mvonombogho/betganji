import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Match, TeamStats } from '@/types/match';
import { OddsData } from '@/types/odds';

interface MatchCardProps {
  match: Match;
  odds?: OddsData;
  isLoading?: boolean;
  teamStats?: {
    home: TeamStats;
    away: TeamStats;
  };
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  odds,
  isLoading,
  teamStats
}) => {
  if (isLoading) {
    return (
      <Card className="w-full p-4">
        <CardContent>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full p-4 hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-semibold">{match.homeTeam.name}</h3>
            {teamStats?.home && (
              <p className="text-sm text-gray-600">
                Form: {teamStats.home.recentForm}
              </p>
            )}
          </div>
          <div className="mx-4 text-lg font-bold">
            {match.status === 'SCHEDULED' ? 'VS' : `${match.score?.home ?? 0} - ${match.score?.away ?? 0}`}
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-semibold">{match.awayTeam.name}</h3>
            {teamStats?.away && (
              <p className="text-sm text-gray-600">
                Form: {teamStats.away.recentForm}
              </p>
            )}
          </div>
        </div>
        {odds && (
          <div className="mt-4 flex justify-around text-sm">
            <div>Home: {odds.homeWin.toFixed(2)}</div>
            <div>Draw: {odds.draw.toFixed(2)}</div>
            <div>Away: {odds.awayWin.toFixed(2)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;