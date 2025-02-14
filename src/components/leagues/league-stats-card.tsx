import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LeagueStats } from '@/lib/services/league-service';

interface LeagueStatsCardProps {
  stats: LeagueStats;
  leagueName: string;
}

export function LeagueStatsCard({ stats, leagueName }: LeagueStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{leagueName} Statistics</CardTitle>
        <CardDescription>Overall performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Matches</p>
            <p className="text-2xl font-bold">{stats.totalMatches}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Predicted Matches</p>
            <p className="text-2xl font-bold">{stats.predictedMatches}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Odds</p>
            <p className="text-2xl font-bold">{stats.avgOdds.toFixed(2)}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <p className="text-sm text-muted-foreground">Profit/Loss</p>
            <p className={`text-2xl font-bold ${stats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss.toFixed(2)} units
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}