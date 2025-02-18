import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
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

interface RecentMatchesProps {
  matches: Match[];
  teamId: string;
  className?: string;
}

export function RecentMatches({ matches, teamId, className = '' }: RecentMatchesProps) {
  const getResultClass = (match: Match) => {
    const isHome = match.homeTeamId === teamId;
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;

    if (teamScore > opponentScore) return 'bg-green-100 text-green-800';
    if (teamScore < opponentScore) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matches.map((match) => (
            <div 
              key={match.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm text-gray-500">
                  {new Date(match.datetime).toLocaleDateString()}
                </div>
                <div className="font-medium">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </div>
                <div className="text-sm text-gray-500">
                  {match.competition.name}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-lg font-semibold">
                  {match.homeScore} - {match.awayScore}
                </div>
                <div className={`px-2 py-1 rounded text-sm font-medium ${getResultClass(match)}`}>
                  {match.homeTeamId === teamId
                    ? match.homeScore > match.awayScore ? 'W'
                      : match.homeScore < match.awayScore ? 'L' : 'D'
                    : match.awayScore > match.homeScore ? 'W'
                      : match.awayScore < match.homeScore ? 'L' : 'D'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
