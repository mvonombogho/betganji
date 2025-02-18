import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConfidenceChartProps {
  data: Array<{
    range: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
}

export function ConfidenceChart({ data }: ConfidenceChartProps) {
  // Sort data by confidence range (assuming ranges are in descending order)
  const sortedData = [...data].sort((a, b) => {
    const aNum = parseInt(a.range.split('-')[0]);
    const bNum = parseInt(b.range.split('-')[0]);
    return bNum - aNum;
  });

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="range" 
            className="text-gray-600"
          />
          <YAxis
            domain={[0, 100]}
            unit="%"
            className="text-gray-600"
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0'
            }}
          />
          <Bar 
            dataKey="accuracy" 
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
