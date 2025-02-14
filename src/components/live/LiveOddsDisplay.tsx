import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';

interface Odds {
  home: number;
  draw: number;
  away: number;
}

interface LiveOddsDisplayProps {
  matchId: string;
  initialOdds: Odds;
}

export default function LiveOddsDisplay({
  matchId,
  initialOdds
}: LiveOddsDisplayProps) {
  const [odds, setOdds] = useState<Odds>(initialOdds);
  const [isSuspended, setIsSuspended] = useState(false);
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribeOdds = subscribe(SOCKET_EVENTS.ODDS_UPDATE, (data) => {
      if (data.matchId === matchId) {
        setOdds(data.odds);
      }
    });

    const unsubscribeSuspended = subscribe(SOCKET_EVENTS.ODDS_SUSPENDED, (data) => {
      if (data.matchId === matchId) {
        setIsSuspended(true);
      }
    });

    const unsubscribeRestored = subscribe(SOCKET_EVENTS.ODDS_RESTORED, (data) => {
      if (data.matchId === matchId) {
        setIsSuspended(false);
      }
    });

    return () => {
      unsubscribeOdds();
      unsubscribeSuspended();
      unsubscribeRestored();
    };
  }, [matchId, subscribe]);

  return (
    <Card className={`w-full max-w-md ${isSuspended ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        {isSuspended && (
          <div className="text-center text-red-500 mb-2">
            Odds Suspended
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Home</p>
            <p className="text-lg font-bold">{odds.home.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Draw</p>
            <p className="text-lg font-bold">{odds.draw.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Away</p>
            <p className="text-lg font-bold">{odds.away.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}