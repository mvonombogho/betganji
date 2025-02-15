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
    average: number;
  }[];
  resultsData: {
    name: string;
    value: number;
    color: string;
  }[];
  monthlyData: {
    month: string;
    wins: number;
    draws: number;
    losses: number;
  }[];
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

export const GoalsTrendChart: React.FC<{ data: TrendChartsProps['goalsData'] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
      <XAxis 
        dataKey="date" 
        className="text-sm"
        tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { month: 'short' })}
      />
      <YAxis className="text-sm" />
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-background border rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium">
                  {new Date(label).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Goals: <span className="font-medium text-primary">{payload[0].value}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Average: <span className="font-medium text-emerald-500">
                    {Number(payload[1].value).toFixed(2)}
                  </span>
                </p>
              </div>
            );
          }
          return null;
        }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="goals"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 8 }}
        name="Goals Scored"
      />
      <Line
        type="monotone"
        dataKey="average"
        stroke="#10b981"
        strokeWidth={2}
        strokeDasharray="5 5"
        dot={false}
        name="Moving Average"
      />
    </LineChart>
  </ResponsiveContainer>
);

export const ResultsDistributionChart: React.FC<{ data: TrendChartsProps['resultsData'] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color || COLORS[index % COLORS.length]} 
          />
        ))}
      </Pie>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
              <div className="bg-background border rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium mb-1">
                  {data.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.value} matches ({((data.value / data.total) * 100).toFixed(1)}%)
                </p>
              </div>
            );
          }
          return null;
        }}
      />
      <Legend 
        formatter={(value, entry) => (
          <span className="text-sm">
            {value} ({((entry.payload.value / entry.payload.total) * 100).toFixed(1)}%)
          </span>
        )}
      />
    </PieChart>
  </ResponsiveContainer>
);

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