import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyTrend {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
  movingAverage?: number;
}

interface TrendsChartProps {
  data: DailyTrend[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  // Calculate 7-day moving average
  const chartData = data.map((day, index) => {
    const window = data.slice(Math.max(0, index - 6), index + 1);
    const avgAccuracy = window.reduce((sum, d) => sum + d.accuracy, 0) / window.length;

    return {
      ...day,
      movingAverage: Number(avgAccuracy.toFixed(1))
    };
  });

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <YAxis 
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value: number) => [
              `${value}%`, 
              value === chartData[0].accuracy ? 'Accuracy' : '7-day Average'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0'
            }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#8884d8"
            dot={false}
            name="Daily Accuracy"
          />
          <Line
            type="monotone"
            dataKey="movingAverage"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            name="7-day Average"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
