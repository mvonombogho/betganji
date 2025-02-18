import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompetitionStats {
  name: string;
  total: number;
  correct: number;
  successRate: number;
}

interface CompetitionSuccessRatesProps {
  data: CompetitionStats[];
}

export function CompetitionSuccessRates({ data }: CompetitionSuccessRatesProps) {
  // Sort competitions by success rate
  const sortedData = [...data].sort((a, b) => b.successRate - a.successRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rate by Competition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Success Rate']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Bar 
                dataKey="successRate" 
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
                label={{ 
                  position: 'right',
                  formatter: (value: number) => `${value.toFixed(1)}%`
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {sortedData.map(stat => (
            <div 
              key={stat.name}
              className="flex justify-between items-center text-sm"
            >
              <span className="font-medium">{stat.name}</span>
              <div className="text-gray-600">
                {stat.correct} / {stat.total} correct
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
