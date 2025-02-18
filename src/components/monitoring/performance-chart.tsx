import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

interface PerformanceChartProps {
  data: Array<{
    timestamp: string;
    accuracy: number;
    users: number;
  }>;
  timeRange: string;
}

export function PerformanceChart({ data, timeRange }: PerformanceChartProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return timeRange === '7' 
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              className="text-gray-600"
            />
            <YAxis 
              yAxisId="accuracy"
              domain={[0, 100]}
              className="text-gray-600"
            />
            <YAxis 
              yAxisId="users"
              orientation="right"
              className="text-gray-600"
            />
            <Tooltip 
              labelFormatter={formatDate}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0'
              }}
            />
            <Legend />
            <Line
              yAxisId="accuracy"
              type="monotone"
              dataKey="accuracy"
              stroke="#8884d8"
              name="Prediction Accuracy (%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="users"
              type="monotone"
              dataKey="users"
              stroke="#82ca9d"
              name="Active Users"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
