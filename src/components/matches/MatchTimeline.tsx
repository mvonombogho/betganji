import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimelineEvent } from '@/types/match';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';

interface MatchTimelineProps {
  matchId: string;
  initialEvents?: TimelineEvent[];
}

export default function MatchTimeline({ 
  matchId, 
  initialEvents = [] 
}: MatchTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribe = subscribe(SOCKET_EVENTS.MATCH_TIMELINE, (data) => {
      if (data.matchId === matchId) {
        setEvents(prev => [...prev, data.event]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [matchId, subscribe]);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'GOAL':
        return '⚽';
      case 'YELLOW_CARD':
        return '🟨';
      case 'RED_CARD':
        return '🟥';
      case 'SUBSTITUTION':
        return '🔄';
      case 'PENALTY_MISSED':
        return '❌';
      case 'PENALTY_SCORED':
        return '⚽';
      case 'VAR':
        return '📺';
      default:
        return '•';
    }
  };

  return (
    <ScrollArea className="h-48 rounded-md border p-4">
      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No events yet
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`flex items-center space-x-2 text-sm ${event.team === 'home' ? 'justify-start' : 'justify-end'}`}
            >
              {event.team === 'home' && (
                <>
                  <span className="min-w-[30px] text-right">{event.minute}'</span>
                  <span>{getEventIcon(event.type)}</span>
                  <span className="font-medium">{event.playerName}</span>
                  {event.additionalInfo && (
                    <span className="text-muted-foreground">({event.additionalInfo})</span>
                  )}
                </>
              )}
              {event.team === 'away' && (
                <>
                  {event.additionalInfo && (
                    <span className="text-muted-foreground">({event.additionalInfo})</span>
                  )}
                  <span className="font-medium">{event.playerName}</span>
                  <span>{getEventIcon(event.type)}</span>
                  <span className="min-w-[30px] text-left">{event.minute}'</span>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}