import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import type { LiveOdds } from '@/types/odds';

interface LiveOddsDisplayProps {
  matchId: string;
  initialOdds: LiveOdds;
}

export default function LiveOddsDisplay({
  matchId,
  initialOdds
}: LiveOddsDisplayProps) {
  const [odds, setOdds] = useState<LiveOdds>(initialOdds);
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribe = subscribe(SOCKET_EVENTS.ODDS_UPDATE, (data) => {
      if (data.matchId === matchId) {
        setOdds(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [matchId, subscribe]);

  const renderTrend = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className={odds.status === 'suspended' ? 'opacity-75' : ''}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">{odds.provider}</p>
          {odds.status === 'suspended' && (
            <Badge variant="secondary">Suspended</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Home Win */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">{odds.home.toFixed(2)}</span>
              {renderTrend(odds.movements?.home.trend)}
            </div>
            <span className="text-sm text-muted-foreground">Home</span>
          </div>

          {/* Draw */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">{odds.draw.toFixed(2)}</span>
              {renderTrend(odds.movements?.draw.trend)}
            </div>
            <span className="text-sm text-muted-foreground">Draw</span>
          </div>

          {/* Away Win */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">{odds.away.toFixed(2)}</span>
              {renderTrend(odds.movements?.away.trend)}
            </div>
            <span className="text-sm text-muted-foreground">Away</span>
          </div>
        </div>

        <div className="mt-2 text-xs text-right text-muted-foreground">
          Last updated: {new Date(odds.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}