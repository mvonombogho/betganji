import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsCardProps {
  title: string;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  loading,
  error,
  onRetry,
  children,
  className = ''
}: AnalyticsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LoadingState
          loading={loading}
          error={error}
          retry={onRetry}
          loadingMessage="Loading analytics..."
        >
          {loading ? <AnalyticsCardSkeleton /> : children}
        </LoadingState>
      </CardContent>
    </Card>
  );
}

function AnalyticsCardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}