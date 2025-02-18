import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyStats {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface PerformanceChartProps {
  data: DailyStats[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    // Calculate 7-day moving average
    const window = 7;
    return data.map((item, index) => {
      const start = Math.max(0, index - window + 1);
      const windowData = data.slice(start, index + 1);
      const average = windowData.reduce((sum, d) => sum + d.accuracy, 0) / windowData.length;
      
      return {
        ...item,
        movingAverage: Number(average.toFixed(1))
      };
    });
  }, [data]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            interval="preserveStartEnd"
            className="text-gray-600"
          />
          <YAxis 
            domain={[0, 100]}
            unit="%"
            className="text-gray-600"
          />
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']}
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
            name="7-Day Average"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
