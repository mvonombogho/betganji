export interface MatchOdds {
  matchId: string;
  provider: string;
  home: number;
  draw: number;
  away: number;
  timestamp: string;
  status: 'active' | 'suspended';
}

export interface OddsMovement {
  previous: number;
  current: number;
  trend: 'up' | 'down' | 'stable';
}

export interface LiveOdds extends MatchOdds {
  movements?: {
    home: OddsMovement;
    draw: OddsMovement;
    away: OddsMovement;
  };
}