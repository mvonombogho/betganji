import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLeagueTrends } from '@/lib/hooks/use-league-trends';
import ChartLoading from './chart-loading';
import ChartErrorBoundary from './chart-error-boundary';

interface ComparativeAnalysisProps {
  primaryLeagueId: string;
  availableLeagues: Array<{
    id: string;
    name: string;
  }>;
}

export default function ComparativeAnalysis({
  primaryLeagueId,
  availableLeagues,
}: ComparativeAnalysisProps) {
  const [comparisonLeagueId, setComparisonLeagueId] = useState<string>('');
  const [metric, setMetric] = useState<string>('goals');

  const primaryLeagueData = useLeagueTrends(primaryLeagueId, '2023-24');
  const comparisonLeagueData = useLeagueTrends(comparisonLeagueId, '2023-24');

  const metrics = [
    { id: 'goals', name: 'Goals per Match' },
    { id: 'wins', name: 'Win Rate' },
    { id: 'accuracy', name: 'Prediction Accuracy' },
    { id: 'cards', name: 'Cards per Match' },
  ];

  const getMetricData = (metric: string) => {
    switch (metric) {
      case 'goals':
        return {
          primary: primaryLeagueData.data?.goalsTrend,
          comparison: comparisonLeagueData.data?.goalsTrend,
        };
      case 'wins':
        return {
          primary: primaryLeagueData.data?.monthlyPerformance,
          comparison: comparisonLeagueData.data?.monthlyPerformance,
        };
      default:
        return { primary: [], comparison: [] };
    }
  };

  const renderChart = () => {
    if (primaryLeagueData.isLoading || (comparisonLeagueId && comparisonLeagueData.isLoading)) {
      return <ChartLoading type="line" />;
    }

    if (primaryLeagueData.error) {
      return <ChartErrorBoundary error={primaryLeagueData.error} />;
    }

    const data = getMetricData(metric);
    if (!data.primary) return null;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data.primary}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { month: 'short' })}
          />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium mb-1">
                      {new Date(label).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    {payload.map((item: any) => (
                      <p key={item.name} className="text-sm text-muted-foreground">
                        {item.name}: {item.value.toFixed(2)}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            dataKey="value"
            name={availableLeagues.find(l => l.id === primaryLeagueId)?.name}
            fill="#3b82f6"
            barSize={20}
          />
          {comparisonLeagueId && data.comparison && (
            <Line
              type="monotone"
              data={data.comparison}
              dataKey="value"
              name={availableLeagues.find(l => l.id === comparisonLeagueId)?.name}
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Comparative Analysis</CardTitle>
          <div className="flex gap-4">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={comparisonLeagueId} onValueChange={setComparisonLeagueId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Compare with..." />
              </SelectTrigger>
              <SelectContent>
                {availableLeagues
                  .filter(league => league.id !== primaryLeagueId)
                  .map(league => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        {primaryLeagueData.data?.performanceMetrics && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Average Goals</p>
              <p className="text-2xl font-bold">
                {primaryLeagueData.data.performanceMetrics.averageGoals.toFixed(2)}
              </p>
              {comparisonLeagueData.data?.performanceMetrics && (
                <p className="text-sm text-muted-foreground">
                  vs {comparisonLeagueData.data.performanceMetrics.averageGoals.toFixed(2)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Home Win Rate</p>
              <p className="text-2xl font-bold">
                {primaryLeagueData.data.performanceMetrics.homeWinPercentage.toFixed(1)}%
              </p>
              {comparisonLeagueData.data?.performanceMetrics && (
                <p className="text-sm text-muted-foreground">
                  vs {comparisonLeagueData.data.performanceMetrics.homeWinPercentage.toFixed(1)}%
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
              <p className="text-2xl font-bold">
                {primaryLeagueData.data.performanceMetrics.predictionAccuracy.toFixed(1)}%
              </p>
              {comparisonLeagueData.data?.performanceMetrics && (
                <p className="text-sm text-muted-foreground">
                  vs {comparisonLeagueData.data.performanceMetrics.predictionAccuracy.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}