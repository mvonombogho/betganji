import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function TeamStatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Form Section */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
