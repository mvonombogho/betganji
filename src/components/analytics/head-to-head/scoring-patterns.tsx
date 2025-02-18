import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface H2HStats {
  team1HomeGoals: number;
  team1AwayGoals: number;
  team1HomeGames: number;
  team1AwayGames: number;
}

interface ScoringPatternsProps {
  stats: H2HStats;
  team1Name: string;
  team2Name: string;
  className?: string;
}

export function ScoringPatterns({ 
  stats, 
  team1Name, 
  team2Name,
  className = '' 
}: ScoringPatternsProps) {
  const calculateAverages = () => {
    const team1HomeAvg = stats.team1HomeGames > 0 
      ? stats.team1HomeGoals / stats.team1HomeGames 
      : 0;
    const team1AwayAvg = stats.team1AwayGames > 0 
      ? stats.team1AwayGoals / stats.team1AwayGames 
      : 0;

    return [
      {
        venue: 'Home Games',
        [team1Name]: Number(team1HomeAvg.toFixed(2)),
        [team2Name]: Number((stats.team1AwayGames > 0 
          ? (stats.team1HomeGoals / stats.team1AwayGames)
          : 0).toFixed(2))
      },
      {
        venue: 'Away Games',
        [team1Name]: Number(team1AwayAvg.toFixed(2)),
        [team2Name]: Number((stats.team1HomeGames > 0
          ? (stats.team1AwayGoals / stats.team1HomeGames)
          : 0).toFixed(2))
      }
    ];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Scoring Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculateAverages()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="venue" />
              <YAxis label={{ value: 'Goals per Game', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Bar dataKey={team1Name} fill="#8884d8" />
              <Bar dataKey={team2Name} fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">{team1Name} Home</div>
            <div className="font-semibold mt-1">
              {stats.team1HomeGoals} goals in {stats.team1HomeGames} games
            </div>
            <div className="text-xs text-gray-500">
              {(stats.team1HomeGames > 0 
                ? stats.team1HomeGoals / stats.team1HomeGames 
                : 0).toFixed(2)} per game
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">{team1Name} Away</div>
            <div className="font-semibold mt-1">
              {stats.team1AwayGoals} goals in {stats.team1AwayGames} games
            </div>
            <div className="text-xs text-gray-500">
              {(stats.team1AwayGames > 0 
                ? stats.team1AwayGoals / stats.team1AwayGames 
                : 0).toFixed(2)} per game
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
