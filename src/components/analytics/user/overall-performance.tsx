import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Percent, Award } from 'lucide-react';

interface ConfidenceStats {
  total: number;
  correct: number;
}

interface CompetitionStats {
  name: string;
  total: number;
  correct: number;
}

interface PerformanceStats {
  total: number;
  correct: number;
  byConfidence: {
    high: ConfidenceStats;
    medium: ConfidenceStats;
    low: ConfidenceStats;
  };
  byCompetition: {
    [key: string]: CompetitionStats;
  };
}

interface OverallPerformanceProps {
  stats: PerformanceStats;
  className?: string;
}

export function OverallPerformance({ stats, className = '' }: OverallPerformanceProps) {
  const overallAccuracy = stats.total > 0
    ? (stats.correct / stats.total) * 100
    : 0;

  const bestCompetition = Object.values(stats.byCompetition)
    .filter(comp => comp.total >= 5) // Minimum 5 predictions
    .reduce((best, current) => {
      const currentAccuracy = (current.correct / current.total) * 100;
      const bestAccuracy = (best?.correct || 0) / (best?.total || 1) * 100;
      return currentAccuracy > bestAccuracy ? current : best;
    }, null as CompetitionStats | null);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Overall Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-blue-600">
                <Target className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {overallAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600">
                  Overall Accuracy
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-600">
              {stats.correct} correct out of {stats.total} predictions
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-green-600">
                <Percent className="h-8 w-8" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {stats.total > 0
                    ? ((stats.byConfidence.high.correct / stats.byConfidence.high.total) * 100).toFixed(1)
                    : '0.0'}%
                </div>
                <div className="text-sm text-green-600">
                  High Confidence Accuracy
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600">
              {stats.byConfidence.high.correct} correct out of {stats.byConfidence.high.total} predictions
            </div>
          </div>

          {bestCompetition && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-purple-600">
                  <Award className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {((bestCompetition.correct / bestCompetition.total) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-600">
                    Best Competition
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-purple-600">
                {bestCompetition.name}: {bestCompetition.correct} out of {bestCompetition.total}
              </div>
            </div>
          )}
        </div>

        {/* Confidence Level Breakdown */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Confidence Level Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(stats.byConfidence).map(([level, data]) => {
              const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              return (
                <div key={level} className="flex items-center">
                  <div className="w-24 text-sm capitalize">{level}</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm">
                    {accuracy.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
