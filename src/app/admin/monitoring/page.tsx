import React from 'react';
import { Metadata } from 'next';
import { ErrorMonitor } from '@/components/monitoring/error-monitor';
import { RequestMonitor } from '@/components/monitoring/request-monitor';
import { HybridPerformance } from '@/components/analytics/hybrid-performance';
import { SystemHealth } from '@/components/monitoring/system-health';

export const metadata: Metadata = {
  title: 'System Monitoring - BetGanji',
  description: 'System monitoring and performance dashboard'
};

export default async function MonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">System Monitoring</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* System Health Overview */}
        <SystemHealth />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Error and Request Monitoring */}
          <div className="space-y-6">
            <ErrorMonitor />
            <RequestMonitor />
          </div>

          {/* Performance Metrics */}
          <div className="space-y-6">
            <HybridPerformance 
              stats={await getPerformanceStats()} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

async function getPerformanceStats() {
  // This will be implemented to fetch actual stats
  return {
    totalPredictions: 0,
    mlAccuracy: 0,
    hybridAccuracy: 0,
    averageAdjustment: 0,
    adjustmentAccuracy: 0,
    byConfidenceLevel: {
      high: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      low: { total: 0, correct: 0 }
    }
  };
}
