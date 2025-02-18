import React from 'react';

interface VenueStats {
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

interface VenueSummaryProps {
  homeStats: VenueStats;
  awayStats: VenueStats;
}

export function VenueSummary({ homeStats, awayStats }: VenueSummaryProps) {
  const calculateWinRate = (stats: VenueStats) => {
    const totalGames = stats.wins + stats.draws + stats.losses;
    return totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Home Record</h3>
        <div className="text-2xl font-bold">
          {homeStats.wins}W {homeStats.draws}D {homeStats.losses}L
        </div>
        <div className="text-sm text-gray-600">
          {calculateWinRate(homeStats).toFixed(1)}% Win Rate
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">Away Record</h3>
        <div className="text-2xl font-bold">
          {awayStats.wins}W {awayStats.draws}D {awayStats.losses}L
        </div>
        <div className="text-sm text-gray-600">
          {calculateWinRate(awayStats).toFixed(1)}% Win Rate
        </div>
      </div>
    </div>
  );
}
