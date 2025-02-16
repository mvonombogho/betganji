import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function MatchOddsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Home Win */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>

          {/* Draw */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>

          {/* Away Win */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Provider info */}
        <div className="mt-4 flex justify-end">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
