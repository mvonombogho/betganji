import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
}

interface BasicStatsProps {
  stats: TeamStats;
  className?: string;
}

export function BasicStats({ stats, className = '' }: BasicStatsProps) {
  const totalGames = stats.wins + stats.draws + stats.losses;
  const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-green-600">Win Rate</div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.goalsScored}
            </div>
            <div className="text-sm text-blue-600">Goals Scored</div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.goalsConceded}
            </div>
            <div className="text-sm text-red-600">Goals Conceded</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-semibold">{stats.wins}</div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-semibold">{stats.draws}</div>
            <div className="text-sm text-gray-600">Draws</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="font-semibold">{stats.losses}</div>
            <div className="text-sm text-gray-600">Losses</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
