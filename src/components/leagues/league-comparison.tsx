import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeagueComparison } from '@/types/league';

interface LeagueComparisonChartProps {
  data: LeagueComparison[];
  selectedMetric?: keyof LeagueComparison;
}

const metricLabels: Record<string, string> = {
  averageGoalsPerMatch: 'Average Goals',
  averageCardsPerMatch: 'Average Cards',
  homeWinPercentage: 'Home Wins %',
  awayWinPercentage: 'Away Wins %',
  drawPercentage: 'Draws %',
  cleanSheetPercentage: 'Clean Sheets %',
  bttsPercentage: 'Both Teams Scored %',
  over25GoalsPercentage: 'Over 2.5 Goals %'
};

const LeagueComparisonChart: React.FC<LeagueComparisonChartProps> = ({ 
  data,
  selectedMetric = 'averageGoalsPerMatch'
}) => {
  const [metric, setMetric] = useState(selectedMetric);

  const chartData = data.map(league => ({
    name: league.leagueId,
    value: league[metric as keyof LeagueComparison],
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>League Comparison</CardTitle>
        <Select
          value={metric}
          onValueChange={(value: string) => setMetric(value as keyof LeagueComparison)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(metricLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)}`,
                  metricLabels[metric]
                ]}
              />
              <Legend />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                name={metricLabels[metric]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueComparisonChart;