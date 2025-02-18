import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueStatsGrid } from './venue-stats-grid';
import { VenueSummary } from './venue-summary';
import { VenueComparisonChart } from './venue-comparison-chart';

interface VenueStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

interface VenueStatsProps {
  home: {
    stats: VenueStats;
  };
  away: {
    stats: VenueStats;
  };
  className?: string;
  isLoading?: boolean;
}

export function VenueStats({ 
  home, 
  away, 
  className = '',
  isLoading = false 
}: VenueStatsProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Home/Away Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <VenueSummary 
            homeStats={home.stats} 
            awayStats={away.stats} 
          />

          <VenueStatsGrid 
            homeStats={home.stats} 
            awayStats={away.stats} 
          />

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Performance Comparison</h3>
            <VenueComparisonChart 
              home={home} 
              away={away} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
