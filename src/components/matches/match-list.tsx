import React from 'react';
import { Match } from '@prisma/client';
import { MatchCard } from './match-card';

interface MatchListProps {
  matches: Array<Match & {
    homeTeam: { name: string; logo?: string | null };
    awayTeam: { name: string; logo?: string | null };
    odds: Array<{
      homeWin: number;
      draw: number;
      awayWin: number;
    }>;
  }>;
}

export function MatchList({ matches }: MatchListProps) {
  if (!matches.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matches found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          odds={match.odds[0]}
        />
      ))}
    </div>
  );
}
