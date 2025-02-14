import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { League } from '@/types/league';

interface LeagueStatsProps {
  league: League;
}

export default function LeagueStats({ league }: LeagueStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{league.predictionSuccessRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{league.totalPredictions}</div>
              <div className="text-sm text-gray-500">Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{league.averageGoalsPerMatch}</div>
              <div className="text-sm text-gray-500">Avg Goals</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={league.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predictions" fill="#8884d8" name="Predictions" />
                <Bar dataKey="successRate" fill="#82ca9d" name="Success Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}