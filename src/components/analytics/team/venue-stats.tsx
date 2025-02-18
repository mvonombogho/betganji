import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Globe } from 'lucide-react';

interface VenueStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

interface VenueStatsProps {
  home: {
    stats: VenueStats;
  };
  away: {
    stats: VenueStats;
  };
  className?: string;
}

export function VenueStats({ home, away, className = '' }: VenueStatsProps) {
  const calculateWinRate = (stats: VenueStats) => {
    const totalGames = stats.wins + stats.draws + stats.losses;
    return totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
  };

  const StatBox = ({ title, homeValue, awayValue }: { 
    title: string;
    homeValue: string | number;
    awayValue: string | number;
  }) => (
    <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
      <div className="text-center border-r border-gray-200">
        <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </div>
        <div className="font-semibold">{homeValue}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
          <Globe className="w-4 h-4 mr-1" />
          Away
        </div>
        <div className="font-semibold">{awayValue}</div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Home/Away Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatBox 
          title="Win Rate"
          homeValue={`${calculateWinRate(home.stats).toFixed(1)}%`}
          awayValue={`${calculateWinRate(away.stats).toFixed(1)}%`}
        />

        <StatBox 
          title="Goals Scored"
          homeValue={home.stats.goalsScored}
          awayValue={away.stats.goalsScored}
        />

        <StatBox 
          title="Goals Conceded"
          homeValue={home.stats.goalsConceded}
          awayValue={away.stats.goalsConceded}
        />

        <StatBox 
          title="Clean Sheets"
          homeValue={home.stats.cleanSheets}
          awayValue={away.stats.cleanSheets}
        />

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Record Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Home:</span>
                <span className="font-medium">
                  {home.stats.wins}W {home.stats.draws}D {home.stats.losses}L
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Away:</span>
                <span className="font-medium">
                  {away.stats.wins}W {away.stats.draws}D {away.stats.losses}L
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
