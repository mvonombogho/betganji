import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}

export function ConfidenceAnalysis({ data }: ConfidenceAnalysisProps) {
  // Transform data into array format for easier rendering
  const ranges = Object.entries(data).map(([range, stats]) => ({
    range,
    ...stats
  }));

  // Color scale for accuracy
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-100 text-green-800';
    if (accuracy >= 60) return 'bg-blue-100 text-blue-800';
    if (accuracy >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {ranges.map((range) => (
            <div 
              key={range.range}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{range.range}</h3>
                <div 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getAccuracyColor(range.accuracy)}`}
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
      </CardContent>
    </Card>
  );
}
