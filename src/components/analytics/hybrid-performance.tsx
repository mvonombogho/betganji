import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, LineChart } from 'lucide-react';
import type { HybridPerformanceStats } from '@/lib/analytics/hybrid-performance-tracker';

interface HybridPerformanceProps {
  stats: HybridPerformanceStats;
  className?: string;
}

export function HybridPerformance({ stats, className = '' }: HybridPerformanceProps) {
  const getPerformanceColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Hybrid Prediction Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Performance */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">ML Accuracy</span>
                <Activity className="h-4 w-4 text-gray-500" />
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(stats.mlAccuracy)}`}>
                {stats.mlAccuracy.toFixed(1)}%
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Hybrid Accuracy</span>
                <Brain className="h-4 w-4 text-gray-500" />
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(stats.hybridAccuracy)}`}>
                {stats.hybridAccuracy.toFixed(1)}%
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Adjustment Impact</span>
                <LineChart className="h-4 w-4 text-gray-500" />
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(stats.adjustmentAccuracy)}`}>
                {stats.adjustmentAccuracy.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Confidence Level Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Performance by Confidence Level</h3>
            {Object.entries(stats.byConfidenceLevel).map(([level, data]) => {
              const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{level}</span>
                    <span className={getPerformanceColor(accuracy)}>
                      {accuracy.toFixed(1)}% ({data.correct}/{data.total})
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        accuracy >= 70 ? 'bg-green-500' :
                        accuracy >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="text-sm text-gray-600">
            Based on {stats.totalPredictions} predictions with an average adjustment of
            {' '}{(stats.averageAdjustment * 100).toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
