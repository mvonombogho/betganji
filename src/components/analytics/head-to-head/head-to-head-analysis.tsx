import React from 'react';
import { HistoricalRecord } from './historical-record';
import { RecentMatches } from './recent-matches';
import { ScoringPatterns } from './scoring-patterns';

interface Match {
  id: string;
  homeTeamId: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  homeScore: number;
  awayScore: number;
  datetime: string;
  competition: {
    name: string;
  };
}

interface H2HStats {
  team1Wins: number;
  team2Wins: number;
  draws: number;
  team1Goals: number;
  team2Goals: number;
  team1HomeGoals: number;
  team1AwayGoals: number;
  team1HomeGames: number;
  team1AwayGames: number;
}

interface HeadToHeadAnalysisProps {
  matches: Match[];
  stats: H2HStats;
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  className?: string;
  isLoading?: boolean;
}

export function HeadToHeadAnalysis({ 
  matches, 
  stats, 
  team1Id,
  team2Id,
  team1Name,
  team2Name,
  className = '',
  isLoading = false
}: HeadToHeadAnalysisProps) {
  if (isLoading) {
    return (
      <div className={`${className} space-y-6`}>
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-96 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoricalRecord
          stats={stats}
          team1Name={team1Name}
          team2Name={team2Name}
        />
        <ScoringPatterns
          stats={stats}
          team1Name={team1Name}
          team2Name={team2Name}
        />
      </div>

      <RecentMatches
        matches={matches}
        team1Id={team1Id}
      />
    </div>
  );
}
