import { MatchListSkeleton } from '@/components/ui/loading-skeleton';

export default function MatchesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Matches</h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search skeleton */}
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
          </div>
          {/* Sort buttons skeleton */}
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Filter buttons skeleton */}
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>

        <MatchListSkeleton />
      </div>
    </div>
  );
}
