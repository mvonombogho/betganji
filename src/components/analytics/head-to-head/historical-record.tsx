import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface H2HStats {
  team1Wins: number;
  team2Wins: number;
  draws: number;
  team1Goals: number;
  team2Goals: number;
}

interface HistoricalRecordProps {
  stats: H2HStats;
  team1Name: string;
  team2Name: string;
  className?: string;
}

export function HistoricalRecord({ 
  stats, 
  team1Name, 
  team2Name, 
  className = '' 
}: HistoricalRecordProps) {
  const totalMatches = stats.team1Wins + stats.team2Wins + stats.draws;
  
  const calculatePercentage = (value: number) => {
    return totalMatches > 0 ? (value / totalMatches) * 100 : 0;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Head-to-Head Record</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-blue-600">
              {stats.team1Wins}
            </div>
            <div className="text-sm text-gray-600 mt-1">{team1Name}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-gray-600">
              {stats.draws}
            </div>
            <div className="text-sm text-gray-600 mt-1">Draws</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-red-600">
              {stats.team2Wins}
            </div>
            <div className="text-sm text-gray-600 mt-1">{team2Name}</div>
          </div>
        </div>

        {/* Win percentage bar */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full flex">
            <div 
              className="bg-blue-500 transition-all duration-500"
              style={{ width: `${calculatePercentage(stats.team1Wins)}%` }}
            />
            <div 
              className="bg-gray-400 transition-all duration-500"
              style={{ width: `${calculatePercentage(stats.draws)}%` }}
            />
            <div 
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${calculatePercentage(stats.team2Wins)}%` }}
            />
          </div>
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Total Goals</div>
            <div className="font-semibold mt-1">
              {stats.team1Goals} - {stats.team2Goals}
            </div>
            <div className="text-xs text-gray-500">
              Avg: {((stats.team1Goals + stats.team2Goals) / totalMatches).toFixed(1)} per game
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Win Rate</div>
            <div className="font-semibold mt-1">
              {calculatePercentage(stats.team1Wins).toFixed(1)}% - {calculatePercentage(stats.team2Wins).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {calculatePercentage(stats.draws).toFixed(1)}% draws
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
