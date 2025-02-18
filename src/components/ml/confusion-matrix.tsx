import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfusionMatrixProps {
  matrix: number[][];
  labels: string[];
  className?: string;
}

export function ConfusionMatrix({ matrix, labels, className = '' }: ConfusionMatrixProps) {
  // Calculate total predictions for percentages
  const totals = matrix.map(row => row.reduce((a, b) => a + b, 0));

  // Get color intensity based on value
  const getColor = (value: number, total: number) => {
    const percentage = (value / total) * 100;
    if (percentage === 0) return 'bg-gray-50';
    if (percentage < 25) return 'bg-blue-50';
    if (percentage < 50) return 'bg-blue-100';
    if (percentage < 75) return 'bg-blue-200';
    return 'bg-blue-300';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Confusion Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Actual ↓ / Predicted →</th>
                {labels.map(label => (
                  <th key={label} className="px-4 py-2 text-center">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium">{labels[i]}</td>
                  {row.map((value, j) => (
                    <td 
                      key={j}
                      className={`px-4 py-2 text-center ${getColor(value, totals[i])}`}
                    >
                      <div className="font-bold">{value}</div>
                      <div className="text-xs text-gray-600">
                        {((value / totals[i]) * 100).toFixed(1)}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
