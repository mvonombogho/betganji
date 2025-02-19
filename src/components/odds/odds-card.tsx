import React from 'react';
import { type OddsData } from '@/types/odds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/date';

interface OddsCardProps {
  odds: OddsData;
}

export const OddsCard: React.FC<OddsCardProps> = ({ odds }) => {
  const bestOdds = odds.bookmakers.reduce((best, bookmaker) => {
    const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
    if (!h2hMarket) return best;

    h2hMarket.outcomes.forEach(outcome => {
      const currentBest = best[outcome.name] || 0;
      if (outcome.price > currentBest) {
        best[outcome.name] = outcome.price;
      }
    });

    return best;
  }, {} as Record<string, number>);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {odds.homeTeam} vs {odds.awayTeam}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {formatDate(odds.commenceTime)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-medium">{odds.homeTeam}</p>
            <p className="text-lg font-bold text-green-600">
              {bestOdds[odds.homeTeam]?.toFixed(2) || '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium">Draw</p>
            <p className="text-lg font-bold text-green-600">
              {bestOdds['Draw']?.toFixed(2) || '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium">{odds.awayTeam}</p>
            <p className="text-lg font-bold text-green-600">
              {bestOdds[odds.awayTeam]?.toFixed(2) || '-'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Best odds from {odds.bookmakers.length} bookmakers
          </p>
        </div>
      </CardContent>
    </Card>
  );
};