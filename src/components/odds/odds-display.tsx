import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OddsData } from '@/types/odds';
import { Skeleton } from '@/components/ui/skeleton';

interface OddsDisplayProps {
  odds: OddsData;
  isLoading?: boolean;
  showDetails?: boolean;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({ 
  odds, 
  isLoading,
  showDetails = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Odds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Home Win</p>
            <p className="text-xl font-bold">{odds.homeWin.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Draw</p>
            <p className="text-xl font-bold">{odds.draw.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Away Win</p>
            <p className="text-xl font-bold">{odds.awayWin.toFixed(2)}</p>
          </div>
        </div>

        {showDetails && odds.markets && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Additional Markets</h4>
            <div className="space-y-4">
              {odds.markets.map(market => (
                <div key={market.id} className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">{market.name}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {market.selections.map(selection => (
                      <div key={selection.id} className="flex justify-between">
                        <span className="text-sm">{selection.name}</span>
                        <span className="text-sm font-medium">{selection.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OddsDisplay;
