import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerformancePatternsProps {
  data: {
    byTime: {
      hour: number;
      winRate: number;
      totalBets: number;
    }[];
    byDay: {
      day: string;
      winRate: number;
      totalBets: number;
    }[];
    byOddsRange: {
      range: string;
      winRate: number;
      totalBets: number;
    }[];
    byStake: {
      range: string;
      winRate: number;
      totalBets: number;
      roi: number;
    }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PerformancePatterns({ data }: PerformancePatternsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="time">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="time">Time</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="odds">Odds</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
          </TabsList>

          <TabsContent value="time" className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="winRate" fill="#8884d8" name="Win Rate (%)" />
                <Bar dataKey="totalBets" fill="#82ca9d" name="Total Bets" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="day" className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="winRate" fill="#8884d8" name="Win Rate (%)" />
                <Bar dataKey="totalBets" fill="#82ca9d" name="Total Bets" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="odds" className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byOddsRange}
                  dataKey="totalBets"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.byOddsRange.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="stake" className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byStake}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="winRate" fill="#8884d8" name="Win Rate (%)" />
                <Bar yAxisId="right" dataKey="roi" fill="#82ca9d" name="ROI (%)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}