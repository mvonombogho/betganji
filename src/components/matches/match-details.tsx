import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Match } from '@/types';

interface MatchDetailsProps {
  match: Match;
}

export function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">{match.homeTeam.name}</div>
        <div className="text-sm">vs</div>
        <div className="text-lg font-semibold">{match.awayTeam.name}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium">Date</div>
          <div>{format(new Date(match.datetime), 'PPP')}</div>
        </div>

        <div>
          <div className="font-medium">Time</div>
          <div>{format(new Date(match.datetime), 'p')}</div>
        </div>

        <div>
          <div className="font-medium">Competition</div>
          <div>{match.competition.name}</div>
        </div>

        <div>
          <div className="font-medium">Status</div>
          <div className="capitalize">{match.status.toLowerCase()}</div>
        </div>
      </div>

      {match.venue && (
        <div>
          <div className="font-medium">Venue</div>
          <div className="text-sm">{match.venue}</div>
        </div>
      )}
    </div>
  );
}