import React from 'react';
import { Card } from '@/components/ui/card';

interface ChartLoadingProps {
  type?: 'bar' | 'line' | 'pie';
}

const ChartLoading: React.FC<ChartLoadingProps> = ({ type = 'line' }) => {
  return (
    <Card className="w-full h-[300px] p-4">
      <div className="animate-pulse space-y-4">
        {/* Chart Title Skeleton */}
        <div className="h-4 w-1/3 bg-muted rounded"></div>

        {/* Chart Area Skeleton */}
        <div className="h-[200px] w-full flex items-end justify-between gap-2">
          {type === 'line' && (
            <svg className="w-full h-full">
              <path
                d="M0 150 Q50 100 100 120 T200 80 T300 110 T400 70"
                className="stroke-muted stroke-2 fill-none"
              />
            </svg>
          )}

          {type === 'bar' && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-muted rounded"
                  style={{
                    height: `${Math.random() * 100 + 20}px`,
                  }}
                ></div>
              ))}
            </>
          )}

          {type === 'pie' && (
            <div className="w-40 h-40 rounded-full border-8 border-muted mx-auto">
              <div className="w-full h-full rounded-full bg-muted-foreground/5"></div>
            </div>
          )}
        </div>

        {/* Legend Skeleton */}
        <div className="flex justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChartLoading;