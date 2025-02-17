interface UserStatsProps {
  stats: {
    totalPredictions: number;
    completedPredictions: number;
    correctPredictions: number;
    accuracy: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Predictions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500 mb-1">Total Predictions</div>
        <div className="text-2xl font-bold">{stats.totalPredictions}</div>
        <div className="text-xs text-gray-400 mt-1">
          All-time predictions made
        </div>
      </div>

      {/* Completed Predictions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500 mb-1">Completed</div>
        <div className="text-2xl font-bold">{stats.completedPredictions}</div>
        <div className="text-xs text-gray-400 mt-1">
          Predictions with results
        </div>
      </div>

      {/* Correct Predictions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500 mb-1">Correct</div>
        <div className="text-2xl font-bold text-green-600">
          {stats.correctPredictions}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Accurate predictions
        </div>
      </div>

      {/* Accuracy */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500 mb-1">Success Rate</div>
        <div className="text-2xl font-bold">
          {stats.accuracy.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Overall accuracy
        </div>
      </div>

      {/* Progress Bar */}
      <div className="col-span-full bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-500 mb-2">Prediction Accuracy</div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${stats.accuracy}%` }}
          />
        </div>
      </div>
    </div>
  );
}
