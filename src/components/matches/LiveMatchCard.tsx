import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import MatchTimeline from './MatchTimeline';
import type { LiveScore, LiveMatchStats, MatchStatus, TimelineEvent } from '@/types/match';

interface LiveMatchCardProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialScore?: LiveScore;
  initialStatus?: MatchStatus;
  initialEvents?: TimelineEvent[];
}

export default function LiveMatchCard({
  matchId,
  homeTeam,
  awayTeam,
  initialScore = { home: 0, away: 0 },
  initialStatus = 'NOT_STARTED',
  initialEvents = []
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

  const isLive = status === 'FIRST_HALF' || status === 'SECOND_HALF' || 
                 status === 'EXTRA_TIME' || status === 'PENALTIES';

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Badge variant={getStatusColor(status)}>
            {status.replace(/_/g, ' ')}
          </Badge>
          {isLive && (
            <Badge variant="outline" className="animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
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

        <Separator className="my-4" />
        
        <MatchTimeline 
          matchId={matchId} 
          initialEvents={initialEvents} 
        />
      </CardContent>
    </Card>
  );
}