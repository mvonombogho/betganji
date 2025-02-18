import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceChart } from './confidence-chart';
import { ConfidenceInsights } from './confidence-insights';

interface ConfidenceRange {
  range: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface ConfidenceAnalysisProps {
  data: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
  isLoading?: boolean;
}

export function ConfidenceAnalysis({ data, isLoading = false }: ConfidenceAnalysisProps) {
  // Transform data into array format for easier rendering
  const ranges = Object.entries(data).map(([range, stats]) => ({
    range,
    ...stats
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Confidence ranges grid */}
          <div className="grid gap-4">
            {ranges.map((range) => (
              <div 
                key={range.range}
                className="border rounded-lg p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{range.range}</h3>
                  <div 
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${range.accuracy >= 80 ? 'bg-green-100 text-green-800' :
                        range.accuracy >= 60 ? 'bg-blue-100 text-blue-800' :
                        range.accuracy >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}
                  >
                    {range.accuracy.toFixed(1)}% Accurate
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {range.correct} correct out of {range.total} predictions
                </div>
              </div>
            ))}
          </div>

          {/* Confidence distribution chart */}
          <ConfidenceChart data={ranges} />

          {/* Insights section */}
          <ConfidenceInsights data={ranges} />
        </div>
      </CardContent>
    </Card>
  );
}
