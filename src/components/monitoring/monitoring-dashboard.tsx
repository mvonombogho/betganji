import React, { useEffect, useState } from 'react';
import { StatsCard } from './stats-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Users, Target, Calendar, TrendingUp } from 'lucide-react';

interface DashboardMetrics {
  activeUsers: number;
  predictionAccuracy: number;
  totalPredictions: number;
  processedMatches: number;
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    // Refresh metrics every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Error loading metrics');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading metrics...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!metrics) {
    return <div>No metrics available</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Users"
          value={metrics.activeUsers}
          icon={<Users className="h-4 w-4" />}
          description="Users active in the last 24 hours"
        />
        
        <StatsCard
          title="Prediction Accuracy"
          value={`${metrics.predictionAccuracy.toFixed(1)}%`}
          icon={<Target className="h-4 w-4" />}
          description="Average accuracy of predictions"
        />
        
        <StatsCard
          title="Total Predictions"
          value={metrics.totalPredictions}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Number of predictions made"
        />
        
        <StatsCard
          title="Processed Matches"
          value={metrics.processedMatches}
          icon={<Calendar className="h-4 w-4" />}
          description="Total matches analyzed"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Performance History</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[]} // TODO: Add historical performance data
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#8884d8"
                name="Prediction Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
