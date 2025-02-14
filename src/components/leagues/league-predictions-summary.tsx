import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Line } from 'recharts';

interface PredictionStats {
  totalPredictions: number;
  successfulPredictions: number;
  averageConfidence: number;
  profitLoss: number;
  roi: number;
  streakData: {
    date: string;
    successRate: number;
    profit: number;
  }[];
}

interface LeaguePredictionsSummaryProps {
  stats: PredictionStats;
}

export function LeaguePredictionsSummary({ stats }: LeaguePredictionsSummaryProps) {
  const successRate = (stats.successfulPredictions / stats.totalPredictions) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.successfulPredictions} correct out of {stats.totalPredictions} predictions
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{stats.averageConfidence.toFixed(1)}%</div>
            <Progress value={stats.averageConfidence} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${stats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss.toFixed(2)} units
            </div>
            <p className="text-xs text-muted-foreground">
              ROI: {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(2)}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24">
            <Line
              data={stats.streakData}
              dataKey="successRate"
              stroke="#8884d8"
              dot={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}