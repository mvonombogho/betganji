import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OddsHistory } from '@/types/odds';
import { Skeleton } from '@/components/ui/skeleton';

interface OddsChartProps {
  history: OddsHistory;
  isLoading?: boolean;
}

const OddsChart: React.FC<OddsChartProps> = ({ history, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Odds History</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = history.history.map(entry => ({
    timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    homeWin: entry.homeWin,
    draw: entry.draw,
    awayWin: entry.awayWin
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Odds History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="homeWin" 
                name="Home Win"
                stroke="#2563eb" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="draw" 
                name="Draw"
                stroke="#9333ea" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="awayWin" 
                name="Away Win"
                stroke="#dc2626" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OddsChart;