import React from 'react';
import { Home, Globe } from 'lucide-react';

interface VenueStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

interface VenueStatsGridProps {
  homeStats: VenueStats;
  awayStats: VenueStats;
}

export function VenueStatsGrid({ homeStats, awayStats }: VenueStatsGridProps) {
  const StatBox = ({ title, homeValue, awayValue }: { 
    title: string;
    homeValue: string | number;
    awayValue: string | number;
  }) => (
    <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
      <div className="text-center border-r border-gray-200">
        <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </div>
        <div className="font-semibold">{homeValue}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-1 flex items-center justify-center">
          <Globe className="w-4 h-4 mr-1" />
          Away
        </div>
        <div className="font-semibold">{awayValue}</div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-4">
      <StatBox 
        title="Goals Scored"
        homeValue={homeStats.goalsScored}
        awayValue={awayStats.goalsScored}
      />
      
      <StatBox 
        title="Goals Conceded"
        homeValue={homeStats.goalsConceded}
        awayValue={awayStats.goalsConceded}
      />
      
      <StatBox 
        title="Clean Sheets"
        homeValue={homeStats.cleanSheets}
        awayValue={awayStats.cleanSheets}
      />
    </div>
  );
}
