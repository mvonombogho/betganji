import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H2HMatch } from '@/types/h2h';
import { formatDate } from '@/lib/utils/date';

interface MatchHistoryProps {
  matches: H2HMatch[];
  limit?: number;
}

export function MatchHistory({ matches, limit = 5 }: MatchHistoryProps) {
  const recentMatches = matches.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMatches.map((match) => (
            <div 
              key={match.id}
              className="p-3 bg-gray-50 rounded-lg space-y-2"
            >
              <div className="flex justify-between text-sm text-gray-500">
                <span>{match.competition}</span>
                <span>{formatDate(match.date)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">{match.homeTeam.name}</span>
                <div className="px-4 py-1 bg-white rounded">
                  <span className="font-bold">
                    {match.homeTeam.score} - {match.awayTeam.score}
                  </span>
                </div>
                <span className="font-medium">{match.awayTeam.name}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
