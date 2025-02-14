import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useNotifications } from '@/hooks/useNotifications';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import MatchTimeline from './MatchTimeline';
import MatchStats from './MatchStats';
import LiveOddsDisplay from '../odds/LiveOddsDisplay';
import type { LiveScore, LiveMatchStats, MatchStatus, TimelineEvent } from '@/types/match';
import type { LiveOdds } from '@/types/odds';

interface LiveMatchCardProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialScore?: LiveScore;
  initialStatus?: MatchStatus;
  initialEvents?: TimelineEvent[];
  initialStats?: LiveMatchStats;
  initialOdds?: LiveOdds;
}

export default function LiveMatchCard({
  matchId,
  homeTeam,
  awayTeam,
  initialScore = { home: 0, away: 0 },
  initialStatus = 'NOT_STARTED',
  initialEvents = [],
  initialStats,
  initialOdds
}: LiveMatchCardProps) {
  const [score, setScore] = useState<LiveScore>(initialScore);
  const [status, setStatus] = useState<MatchStatus>(initialStatus);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const { subscribe } = useSocket();
  const { supported, permission, requestPermission, notificationService } = useNotifications();

  const matchDetails = `${homeTeam} vs ${awayTeam}`;

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

    const unsubscribeTimeline = subscribe(SOCKET_EVENTS.MATCH_TIMELINE, async (data) => {
      if (data.matchId === matchId && notificationsEnabled) {
        await notificationService.notifyMatchEvent(data.event, matchDetails);
      }
    });

    const unsubscribeOdds = subscribe(SOCKET_EVENTS.ODDS_UPDATE, async (data) => {
      if (data.matchId === matchId && notificationsEnabled && data.significant) {
        await notificationService.notifyOddsChange(
          matchDetails,
          data.type,
          data.oldOdds,
          data.newOdds
        );
      }
    });

    return () => {
      unsubscribeScore();
      unsubscribeStatus();
      unsubscribeTimeline();
      unsubscribeOdds();
    };
  }, [matchId, subscribe, notificationsEnabled, matchDetails, notificationService]);

  const toggleNotifications = async () => {
    if (!supported) return;

    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        await notificationService.notify(
          `🔔 Match Notifications Enabled`,
          {
            body: `You'll receive notifications for ${matchDetails}`,
            icon: '/favicon.ico'
          }
        );
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(status)}>
              {status.replace(/_/g, ' ')}
            </Badge>
            {isLive && (
              <Badge variant="outline" className="animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
          
          {supported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              disabled={permission === 'denied'}
              title={permission === 'denied' ? 'Notifications blocked' : 'Toggle notifications'}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
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

        {initialOdds && (
          <div className="mb-4">
            <LiveOddsDisplay 
              matchId={matchId} 
              initialOdds={initialOdds} 
            />
          </div>
        )}

        <Separator className="my-4" />
        
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline">
            <MatchTimeline 
              matchId={matchId} 
              initialEvents={initialEvents} 
            />
          </TabsContent>
          <TabsContent value="stats">
            <MatchStats 
              matchId={matchId} 
              initialStats={initialStats} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}