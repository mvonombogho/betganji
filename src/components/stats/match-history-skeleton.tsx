import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface MatchHistorySkeletonProps {
  matchCount?: number;
}

export function MatchHistorySkeleton({ matchCount = 5 }: MatchHistorySkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(matchCount)].map((_, index) => (
            <div 
              key={index}
              className="p-3 bg-gray-50 rounded-lg space-y-3"
            >
              {/* Match metadata */}
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>

              {/* Teams and score */}
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="px-4 py-1 bg-white rounded">
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
