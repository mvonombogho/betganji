import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OddsTrendProps {
  data: Array<{
    timestamp: Date;
    homeWin: number;
    draw: number;
    awayWin: number;
  }>;
}

export function OddsTrend({ data }: OddsTrendProps) {
  const chartData = data.map(item => ({
    timestamp: new Date(item.timestamp).toLocaleDateString(),
    'Home Win': item.homeWin,
    'Draw': item.draw,
    'Away Win': item.awayWin
  }));

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="timestamp" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Home Win" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Draw" 
            stroke="#9ca3af" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Away Win" 
            stroke="#dc2626" 
            strokeWidth={2} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
