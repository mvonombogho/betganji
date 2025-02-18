import React from 'react';

interface DailyTrend {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface TrendsSummaryProps {
  data: DailyTrend[];
}

export function TrendsSummary({ data }: TrendsSummaryProps) {
  const calculateStats = () => {
    if (data.length === 0) return null;

    const totalPredictions = data.reduce((sum, day) => sum + day.total, 0);
    const totalCorrect = data.reduce((sum, day) => sum + day.correct, 0);
    const averageAccuracy = (totalCorrect / totalPredictions) * 100;

    const lastDay = data[data.length - 1];
    const firstDay = data[0];
    const accuracyChange = lastDay.accuracy - firstDay.accuracy;

    return {
      totalPredictions,
      averageAccuracy,
      accuracyChange
    };
  };

  const stats = calculateStats();
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Total Predictions</div>
        <div className="text-xl font-bold mt-1">
          {stats.totalPredictions}
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Average Accuracy</div>
        <div className="text-xl font-bold mt-1">
          {stats.averageAccuracy.toFixed(1)}%
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Trend</div>
        <div className={`text-xl font-bold mt-1 ${stats.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stats.accuracyChange >= 0 ? '+' : ''}{stats.accuracyChange.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
