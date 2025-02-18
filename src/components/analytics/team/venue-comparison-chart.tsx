import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VenueStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

interface VenueComparisonChartProps {
  home: {
    stats: VenueStats;
  };
  away: {
    stats: VenueStats;
  };
}

export function VenueComparisonChart({ home, away }: VenueComparisonChartProps) {
  const calculateWinRate = (stats: VenueStats) => {
    const totalGames = stats.wins + stats.draws + stats.losses;
    return totalGames > 0 ? Number((stats.wins / totalGames * 100).toFixed(1)) : 0;
  };

  const calculateGoalsPerGame = (stats: VenueStats) => {
    const totalGames = stats.wins + stats.draws + stats.losses;
    return totalGames > 0 ? Number((stats.goalsScored / totalGames).toFixed(1)) : 0;
  };

  const data = [
    {
      name: 'Win Rate',
      home: calculateWinRate(home.stats),
      away: calculateWinRate(away.stats),
      unit: '%'
    },
    {
      name: 'Goals/Game',
      home: calculateGoalsPerGame(home.stats),
      away: calculateGoalsPerGame(away.stats),
      unit: ''
    },
    {
      name: 'Clean Sheets',
      home: home.stats.cleanSheets,
      away: away.stats.cleanSheets,
      unit: ''
    }
  ];

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `${value}${props.payload.unit}`,
              name === 'home' ? 'Home' : 'Away'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0'
            }}
          />
          <Legend />
          <Bar 
            dataKey="home" 
            fill="#8884d8" 
            name="Home"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="away" 
            fill="#82ca9d" 
            name="Away"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
