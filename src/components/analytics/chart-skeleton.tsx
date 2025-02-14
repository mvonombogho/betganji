import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartSkeletonProps {
  className?: string;
}

export function ChartSkeleton({ className = '' }: ChartSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-center gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-16" />
        ))}
      </div>
    </div>
  );
}