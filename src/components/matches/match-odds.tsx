import { OddsData } from '@/types/odds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchOddsSkeleton } from './match-odds-skeleton';

interface MatchOddsProps {
  odds?: OddsData;
  isLoading?: boolean;
}

export function MatchOdds({ odds, isLoading = false }: MatchOddsProps) {
  if (isLoading || !odds) {
    return <MatchOddsSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Home Win</p>
            <p className="text-xl font-bold">{odds.homeWin.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Draw</p>
            <p className="text-xl font-bold">{odds.draw.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Away Win</p>
            <p className="text-xl font-bold">{odds.awayWin.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-right">
          Provider: {odds.provider}
        </div>
      </CardContent>
    </Card>
  );
}
