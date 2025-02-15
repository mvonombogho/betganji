import { Match } from '@/types/match';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils/date';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
}

export function MatchCard({ match, onClick }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
      case 'IN_PLAY':
        return 'bg-red-500';
      case 'FINISHED':
        return 'bg-green-500';
      case 'SCHEDULED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm text-gray-500">
            {match.competition.name}
          </CardTitle>
          <Badge className={`${getStatusColor(match.status)}`}>
            {match.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Teams */}
          <div className="grid grid-cols-3 items-center gap-2">
            <div className="text-right font-semibold">
              {match.homeTeam.name}
            </div>
            <div className="text-center text-2xl font-bold">
              vs
            </div>
            <div className="text-left font-semibold">
              {match.awayTeam.name}
            </div>
          </div>

          {/* Match Info */}
          <div className="text-center text-sm text-gray-500">
            {formatDateTime(match.datetime)}
          </div>

          {/* Odds (if available) */}
          {match.odds && (
            <div className="grid grid-cols-3 gap-2 text-sm pt-2 border-t">
              <div className="text-center">
                <div className="font-medium">Home</div>
                <div>{match.odds.homeWin.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Draw</div>
                <div>{match.odds.draw.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Away</div>
                <div>{match.odds.awayWin.toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Prediction Badge (if available) */}
          {match.predictions && match.predictions.length > 0 && (
            <div className="text-center pt-2">
              <Badge variant="secondary" className="bg-purple-100">
                Prediction Available
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}