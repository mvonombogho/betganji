export interface LiveScore {
  home: number;
  away: number;
}

export interface LiveMatchStats {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: number;
    away: number;
  };
  shotsOnTarget: {
    home: number;
    away: number;
  };
  corners: {
    home: number;
    away: number;
  };
}

export type MatchStatus = 
  | 'NOT_STARTED'
  | 'FIRST_HALF'
  | 'HALF_TIME'
  | 'SECOND_HALF'
  | 'EXTRA_TIME'
  | 'PENALTIES'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED';

export type TimelineEventType =
  | 'GOAL'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'PENALTY_MISSED'
  | 'PENALTY_SCORED'
  | 'VAR';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  minute: number;
  team: 'home' | 'away';
  playerName: string;
  additionalInfo?: string;
}