import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';

interface LiveScore {
  home: number;
  away: number;
}

interface LiveMatchCardProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialScore?: LiveScore;
}

export default function LiveMatchCard({
  matchId,
  homeTeam,
  awayTeam,
  initialScore = { home: 0, away: 0 }
}: LiveMatchCardProps) {
  const [score, setScore] = useState<LiveScore>(initialScore);
  const [status, setStatus] = useState<string>('LIVE');
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribeScore = subscribe(SOCKET_EVENTS.MATCH_SCORE, (data) => {
      if (data.matchId === matchId) {
        setScore(data.score);
      }
    });

    const unsubscribeStatus = subscribe(SOCKET_EVENTS.MATCH_STATUS, (data) => {
      if (data.matchId === matchId) {
        setStatus(data.status);
      }
    });

    return () => {
      unsubscribeScore();
      unsubscribeStatus();
    };
  }, [matchId, subscribe]);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Badge variant={status === 'LIVE' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="font-semibold">{homeTeam}</p>
            <p className="text-2xl font-bold">{score.home}</p>
          </div>
          
          <div className="text-center px-4">
            <p className="text-sm text-muted-foreground">VS</p>
          </div>
          
          <div className="text-right">
            <p className="font-semibold">{awayTeam}</p>
            <p className="text-2xl font-bold">{score.away}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}