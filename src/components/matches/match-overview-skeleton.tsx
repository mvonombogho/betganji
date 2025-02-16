export function MatchOverviewSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header loading state */}
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
      </div>
      
      {/* Teams and score loading state */}
      <div className="flex justify-between items-center">
        {/* Home team */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Match info */}
        <div className="flex flex-col items-center space-y-2">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
