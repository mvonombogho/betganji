import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DailyStats {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface PerformanceSummaryProps {
  data: DailyStats[];
}

export function PerformanceSummary({ data }: PerformanceSummaryProps) {
  const calculateStats = () => {
    if (data.length === 0) return null;

    const currentAccuracy = data[data.length - 1].accuracy;
    const firstAccuracy = data[0].accuracy;
    const accuracyChange = currentAccuracy - firstAccuracy;

    const totalPredictions = data.reduce((sum, day) => sum + day.total, 0);
    const totalCorrect = data.reduce((sum, day) => sum + day.correct, 0);
    const averageAccuracy = (totalCorrect / totalPredictions) * 100;

    return {
      currentAccuracy,
      accuracyChange,
      totalPredictions,
      averageAccuracy
    };
  };

  const stats = calculateStats();
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-500">Current Accuracy</div>
        <div className="text-2xl font-bold mt-1">
          {stats.currentAccuracy.toFixed(1)}%
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-500">Accuracy Trend</div>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-2xl font-bold">
            {Math.abs(stats.accuracyChange).toFixed(1)}%
          </span>
          {stats.accuracyChange > 0 ? (
            <TrendingUp className="text-green-500 h-5 w-5" />
          ) : (
            <TrendingDown className="text-red-500 h-5 w-5" />
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-500">Total Predictions</div>
        <div className="text-2xl font-bold mt-1">
          {stats.totalPredictions}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Avg: {stats.averageAccuracy.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
