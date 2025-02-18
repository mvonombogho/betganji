import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FormMatch {
  id: string;
  result: 'W' | 'D' | 'L';
  date: string;
  goalsScored: number;
  goalsConceded: number;
}

interface FormTrendChartProps {
  matches: FormMatch[];
}

export function FormTrendChart({ matches }: FormTrendChartProps) {
  // Convert match results to points (W=3, D=1, L=0) and calculate running average
  const chartData = matches.map((match, index) => {
    const points = match.result === 'W' ? 3 : match.result === 'D' ? 1 : 0;
    const lastFive = matches.slice(Math.max(0, index - 4), index + 1);
    const avgPoints = lastFive.reduce((acc, m) => {
      return acc + (m.result === 'W' ? 3 : m.result === 'D' ? 1 : 0);
    }, 0) / lastFive.length;

    return {
      date: match.date,
      points,
      avgPoints: Number(avgPoints.toFixed(1)),
      goalsScored: match.goalsScored,
      goalsConceded: match.goalsConceded
    };
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            className="text-gray-600"
          />
          <YAxis className="text-gray-600" />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0'
            }}
          />
          <Line
            type="monotone"
            dataKey="avgPoints"
            stroke="#8884d8"
            strokeWidth={2}
            name="Avg Points (5 games)"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="goalsScored"
            stroke="#82ca9d"
            name="Goals Scored"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
