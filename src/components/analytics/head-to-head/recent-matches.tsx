import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface RecentMatchesProps {
  matches: Match[];
  team1Id: string;
  className?: string;
}

export function RecentMatches({ 
  matches, 
  team1Id,
  className = '' 
}: RecentMatchesProps) {
  const getResultClass = (match: Match) => {
    const isTeam1Home = match.homeTeamId === team1Id;
    const team1Score = isTeam1Home ? match.homeScore : match.awayScore;
    const team2Score = isTeam1Home ? match.awayScore : match.homeScore;

    if (team1Score > team2Score) return 'bg-green-100 text-green-800';
    if (team1Score < team2Score) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Meetings</CardTitle>
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
                  {match.homeTeamId === team1Id
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
