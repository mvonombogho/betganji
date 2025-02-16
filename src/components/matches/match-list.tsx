import React from 'react';
import Link from 'next/link';
import { Match, Team, Odds } from '@prisma/client';

type MatchWithRelations = Match & {
  homeTeam: Team;
  awayTeam: Team;
  odds: Odds[];
};

interface MatchListProps {
  matches: MatchWithRelations[];
}

export function MatchList({ matches }: MatchListProps) {
  if (!matches.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming matches found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <Link 
          key={match.id} 
          href={`/matches/${match.id}`}
          className="block"
        >
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {new Date(match.datetime).toLocaleDateString()}
              </span>
              <span className="px-2 py-1 text-xs rounded bg-gray-100">
                {match.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{match.homeTeam.name}</span>
                <span className="text-lg font-semibold">
                  {match.odds[0]?.homeWin.toFixed(2) || '-'}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-500">
                <span>Draw</span>
                <span className="text-lg font-semibold">
                  {match.odds[0]?.draw.toFixed(2) || '-'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">{match.awayTeam.name}</span>
                <span className="text-lg font-semibold">
                  {match.odds[0]?.awayWin.toFixed(2) || '-'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
