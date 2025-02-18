import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Award, Percent, TrendingUp } from 'lucide-react';
import type { ModelMetrics } from '@/lib/ml/metrics';

interface MetricsSummaryProps {
  metrics: ModelMetrics;
  className?: string;
}

export function MetricsSummary({ metrics, className = '' }: MetricsSummaryProps) {
  const StatBox = ({ 
    title, 
    value, 
    icon: Icon,
    description
  }: { 
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
  }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {description && (
        <div className="mt-2 text-sm text-gray-500">{description}</div>
      )}
    </div>
  );

  // Find best performing class
  const bestClass = Object.entries(metrics.classAccuracies)
    .reduce((a, b) => a[1] > b[1] ? a : b);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Model Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox
            title="Overall Accuracy"
            value={`${(metrics.accuracy * 100).toFixed(1)}%`}
            icon={Target}
            description="Percentage of correct predictions"
          />

          <StatBox
            title="F1 Score"
            value={(metrics.f1Score * 100).toFixed(1)}
            icon={Award}
            description="Harmonic mean of precision and recall"
          />

          <StatBox
            title="Best Class"
            value={`${(bestClass[1] * 100).toFixed(1)}%`}
            icon={TrendingUp}
            description={`Best performance: ${bestClass[0]}`}
          />

          <StatBox
            title="Precision"
            value={`${(metrics.precision * 100).toFixed(1)}%`}
            icon={Percent}
            description="Accuracy of positive predictions"
          />
        </div>

        {/* Class-wise Performance */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Performance by Outcome</h3>
          <div className="space-y-2">
            {Object.entries(metrics.classAccuracies).map(([className, accuracy]) => (
              <div key={className} className="flex items-center">
                <div className="w-32 text-sm">{className}</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${accuracy * 100}%` }}
                  />
                </div>
                <div className="w-16 text-right text-sm">
                  {(accuracy * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
