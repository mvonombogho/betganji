import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionCardProps {
  loading?: boolean;
  error?: Error | null;
  prediction?: any;
  onRetry?: () => void;
}

export function PredictionCard({ loading, error, prediction, onRetry }: PredictionCardProps) {
  return (
    <Card>
      <LoadingState
        loading={loading}
        error={error}
        retry={onRetry}
        loadingMessage="Loading prediction..."
      >
        {loading ? (
          <PredictionCardSkeleton />
        ) : prediction ? (
          <>
            <CardHeader>
              <CardTitle className="text-lg">
                {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Confidence</span>
                  <span className="text-sm">{prediction.confidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Prediction</span>
                  <span className="text-sm">{prediction.result}</span>
                </div>
                {prediction.insights && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {prediction.insights.rationale}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        ) : null}
      </LoadingState>
    </Card>
  );
}

function PredictionCardSkeleton() {
  return (
    <>
      <CardHeader>
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="pt-4 border-t">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </div>
        </div>
      </CardContent>
    </>
  );
}