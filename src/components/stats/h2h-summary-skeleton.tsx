import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function H2HSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Team 1 Stats */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div>
          </div>

          {/* Draws */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div>
          </div>

          {/* Team 2 Stats */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
