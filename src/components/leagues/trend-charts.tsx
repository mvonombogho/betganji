import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartsProps {
  goalsData: {
    date: string;
    goals: number;
  }[];
  resultsData: {
    name: string;
    value: number;
  }[];
  monthlyData: {
    month: string;
    wins: number;
    draws: number;
    losses: number;
  }[];
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

export const MonthlyPerformanceChart: React.FC<{ data: TrendChartsProps['monthlyData'] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart 
      data={data} 
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip 
        formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
      />
      <Legend />
      <Bar dataKey="wins" fill="#3b82f6" stackId="a" />
      <Bar dataKey="draws" fill="#10b981" stackId="a" />
      <Bar dataKey="losses" fill="#ef4444" stackId="a" />
    </BarChart>
  </ResponsiveContainer>
);