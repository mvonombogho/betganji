import React from 'react';
import { BaseTrendsContainer } from './base-container';
import { TrendsChart } from './trends-chart';
import { TrendsSummary } from './trends-summary';

interface DailyTrend {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface PredictionTrendsProps {
  data: DailyTrend[];
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function PredictionTrends({ 
  data, 
  timeRange,
  onTimeRangeChange,
  className = '',
  isLoading = false
}: PredictionTrendsProps) {
  if (isLoading) {
    return (
      <BaseTrendsContainer
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        className={className}
      >
        <div className="h-72 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </BaseTrendsContainer>
    );
  }

  return (
    <BaseTrendsContainer
      timeRange={timeRange}
      onTimeRangeChange={onTimeRangeChange}
      className={className}
    >
      <TrendsChart data={data} />
      <TrendsSummary data={data} />
    </BaseTrendsContainer>
  );
}

// Export sub-components for flexibility
export { BaseTrendsContainer } from './base-container';
export { TrendsChart } from './trends-chart';
export { TrendsSummary } from './trends-summary';
