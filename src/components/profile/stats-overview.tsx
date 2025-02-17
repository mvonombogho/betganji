interface StatsOverviewProps {
  stats: {
    totalPredictions: number;
    correctPredictions: number;
    pendingPredictions: number;
    accuracy: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {/* Total Predictions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-500">Total Predictions</div>
        <div className="text-2xl font-bold mt-1">
          {stats.totalPredictions}
        </div>
      </div>

      {/* Correct Predictions */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="text-sm text-green-600">Correct</div>
        <div className="text-2xl font-bold text-green-700 mt-1">
          {stats.correctPredictions}
        </div>
      </div>

      {/* Pending Predictions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-sm text-blue-600">Pending</div>
        <div className="text-2xl font-bold text-blue-700 mt-1">
          {stats.pendingPredictions}
        </div>
      </div>

      {/* Accuracy */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="text-sm text-purple-600">Accuracy</div>
        <div className="text-2xl font-bold text-purple-700 mt-1">
          {stats.accuracy.toFixed(1)}%
        </div>
      </div>

      {/* Accuracy Progress Bar */}
      <div className="col-span-full mt-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${stats.accuracy}%` }}
          />
        </div>
      </div>
    </div>
  );
}
