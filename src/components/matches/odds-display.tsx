import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface OddsDisplayProps {
  currentOdds: {
    homeWin: number;
    draw: number;
    awayWin: number;
    timestamp: Date;
    provider: string;
  };
  historicalOdds?: Array<{
    homeWin: number;
    draw: number;
    awayWin: number;
    timestamp: Date;
    provider: string;
  }>;
}

export function OddsDisplay({ currentOdds, historicalOdds }: OddsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Latest Odds</h3>
          <span className="text-sm text-gray-500">
            {currentOdds.provider}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Home Win</div>
            <div className="text-2xl font-bold">{currentOdds.homeWin.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Draw</div>
            <div className="text-2xl font-bold">{currentOdds.draw.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Away Win</div>
            <div className="text-2xl font-bold">{currentOdds.awayWin.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
