import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import type { LiveMatchStats } from '@/types/match';

interface MatchStatsProps {
  matchId: string;
  initialStats?: LiveMatchStats;
}

export default function MatchStats({
  matchId,
  initialStats = {
    possession: { home: 50, away: 50 },
    shots: { home: 0, away: 0 },
    shotsOnTarget: { home: 0, away: 0 },
    corners: { home: 0, away: 0 }
  }
}: MatchStatsProps) {
  const [stats, setStats] = useState<LiveMatchStats>(initialStats);
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubscribe = subscribe(SOCKET_EVENTS.MATCH_UPDATE, (data) => {
      if (data.matchId === matchId && data.stats) {
        setStats(data.stats);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [matchId, subscribe]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{stats.possession.home}%</span>
          <span className="text-muted-foreground">Possession</span>
          <span>{stats.possession.away}%</span>
        </div>
        <Progress value={stats.possession.home} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{stats.shots.home}</span>
          <span className="text-muted-foreground">Shots</span>
          <span>{stats.shots.away}</span>
        </div>
        <Progress 
          value={stats.shots.home / (stats.shots.home + stats.shots.away) * 100 || 50} 
          className="h-2" 
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{stats.shotsOnTarget.home}</span>
          <span className="text-muted-foreground">Shots on Target</span>
          <span>{stats.shotsOnTarget.away}</span>
        </div>
        <Progress 
          value={stats.shotsOnTarget.home / (stats.shotsOnTarget.home + stats.shotsOnTarget.away) * 100 || 50} 
          className="h-2" 
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{stats.corners.home}</span>
          <span className="text-muted-foreground">Corners</span>
          <span>{stats.corners.away}</span>
        </div>
        <Progress 
          value={stats.corners.home / (stats.corners.home + stats.corners.away) * 100 || 50} 
          className="h-2" 
        />
      </div>
    </div>
  );
}