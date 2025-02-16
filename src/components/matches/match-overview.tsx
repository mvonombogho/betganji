import { Match } from '@/types/match';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/date';

interface MatchOverviewProps {
  match: Match;
}

export function MatchOverview({ match }: MatchOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          {/* Home Team */}
          <div className="flex flex-col items-center space-y-2">
            <img 
              src={match.homeTeam.logo} 
              alt={match.homeTeam.name}
              className="w-16 h-16 object-contain"
            />
            <span className="font-medium text-lg">{match.homeTeam.name}</span>
          </div>

          {/* Match Info */}
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold mb-2">vs</span>
            <span className="text-sm text-gray-500">{formatDate(match.datetime)}</span>
            <span className="text-sm font-medium mt-2">{match.competition.name}</span>
            <span className="text-xs text-gray-500">{match.status}</span>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center space-y-2">
            <img 
              src={match.awayTeam.logo} 
              alt={match.awayTeam.name}
              className="w-16 h-16 object-contain"
            />
            <span className="font-medium text-lg">{match.awayTeam.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
