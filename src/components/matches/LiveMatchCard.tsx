import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import type { LiveScore, LiveMatchStats, MatchStatus } from '@/types/match';

interface LiveMatchCardProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialScore?: LiveScore;
  initialStatus?: MatchStatus;
}

export default function LiveMatchCard({
  matchId,
  homeTeam,
  awayTeam,
  initialScore = { home: 0, away: 0 },
  initialStatus = 'NOT_STARTED'
}: LiveMatchCardProps) {
  const [score, setScore] = useState<LiveScore>(initialScore);
  const [status, setStatus] = useState<MatchStatus>(initialStatus);
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

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case 'FIRST_HALF':
      case 'SECOND_HALF':
      case 'EXTRA_TIME':
      case 'PENALTIES':
        return 'destructive';
      case 'FINISHED':
        return 'default';
      case 'POSTPONED':
      case 'CANCELLED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Badge variant={getStatusColor(status)}>
            {status.replace(/_/g, ' ')}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-left flex-1">
            <p className="font-semibold text-lg truncate">{homeTeam}</p>
            <p className="text-3xl font-bold">{score.home}</p>
          </div>
          
          <div className="text-center px-4">
            <p className="text-sm text-muted-foreground">VS</p>
          </div>
          
          <div className="text-right flex-1">
            <p className="font-semibold text-lg truncate">{awayTeam}</p>
            <p className="text-3xl font-bold">{score.away}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}