'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoalsTrendChart, ResultsDistributionChart, MonthlyPerformanceChart } from '@/components/leagues/trend-charts';
import ChartErrorBoundary from '@/components/leagues/chart-error-boundary';
import ChartLoading from '@/components/leagues/chart-loading';
import { useLeagueTrends } from '@/lib/hooks/use-league-trends';

interface LeagueAnalysisPageProps {
  params: {
    id: string;
  };
}

export default function LeagueAnalysisPage({ params }: LeagueAnalysisPageProps) {
  const [timeRange, setTimeRange] = useState<number>(6); // 6 months default
  const { data, isLoading, error, isError } = useLeagueTrends(params.id, '2023-24', timeRange);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(parseInt(value));
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">League Analysis</h1>
        <Select value={timeRange.toString()} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data?.performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.performanceMetrics.predictionAccuracy.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Based on recent predictions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.performanceMetrics.averageGoals.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Per match
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Home Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data.performanceMetrics.homeWinPercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Home team advantage
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="goals">Goals Trend</TabsTrigger>
          <TabsTrigger value="results">Results Distribution</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          {isLoading.goals ? (
            <ChartLoading type="line" />
          ) : error.goals ? (
            <ChartErrorBoundary 
              error={error.goals} 
              title="Unable to load goals trend"
            />
          ) : data?.goalsTrend ? (
            <GoalsTrendChart data={data.goalsTrend} />
          ) : null}
        </TabsContent>

        <TabsContent value="results">
          {isLoading.results ? (
            <ChartLoading type="pie" />
          ) : error.results ? (
            <ChartErrorBoundary 
              error={error.results} 
              title="Unable to load results distribution"
            />
          ) : data?.resultsDistribution ? (
            <ResultsDistributionChart data={data.resultsDistribution} />
          ) : null}
        </TabsContent>

        <TabsContent value="monthly">
          {isLoading.monthly ? (
            <ChartLoading type="bar" />
          ) : error.monthly ? (
            <ChartErrorBoundary 
              error={error.monthly} 
              title="Unable to load monthly performance"
            />
          ) : data?.monthlyPerformance ? (
            <MonthlyPerformanceChart data={data.monthlyPerformance} />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}