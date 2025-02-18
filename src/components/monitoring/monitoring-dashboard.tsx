import React, { useEffect, useState } from 'react';
import { StatsCard } from './stats-card';
import { PerformanceChart } from './performance-chart';
import { TimeRangeSelector } from './time-range-selector';
import { Users, Target, Calendar, TrendingUp } from 'lucide-react';

interface DashboardMetrics {
  activeUsers: number;
  predictionAccuracy: number;
  totalPredictions: number;
  processedMatches: number;
}

interface HistoricalMetric {
  timestamp: string;
  accuracy: number;
  users: number;
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalMetric[]>([]);
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchMetrics(),
          fetchHistoricalData()
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Error loading current metrics');
      console.error('Error fetching metrics:', err);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/monitoring/history?days=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch historical data');

      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Error loading historical data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-4 text-gray-500">
        No metrics available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Monitoring</h1>
        <TimeRangeSelector 
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>
      
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

      <PerformanceChart 
        data={historicalData}
        timeRange={timeRange}
      />
    </div>
  );
}
