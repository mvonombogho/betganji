"use client";

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OddsChartProps {
  data: Array<{
    timestamp: Date;
    homeWin: number;
    draw: number;
    awayWin: number;
  }>;
  homeTeam: string;
  awayTeam: string;
}

export function OddsChart({ data, homeTeam, awayTeam }: OddsChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString(),
      [homeTeam]: item.homeWin,
      'Draw': item.draw,
      [awayTeam]: item.awayWin,
    }));
  }, [data, homeTeam, awayTeam]);

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg shadow-sm">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="timestamp" 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
            domain={['auto', 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={homeTeam} 
            stroke="#2563EB" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Draw" 
            stroke="#6B7280" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey={awayTeam} 
            stroke="#DC2626" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
