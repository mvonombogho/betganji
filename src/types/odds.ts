export interface OddsData {
  id: string;
  matchId: string;
  provider: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  timestamp: Date;
  // Additional markets can be added here
}

export interface OddsHistory {
  matchId: string;
  odds: OddsData[];
}

export interface OddsMovement {
  type: 'homeWin' | 'draw' | 'awayWin';
  oldValue: number;
  newValue: number;
  timestamp: Date;
}

export interface MarketOdds {
  market: string;
  selections: {
    name: string;
    price: number;
  }[];
}

export type OddsFormat = 'decimal' | 'fractional' | 'american';

export interface OddsProvider {
  id: string;
  name: string;
  priority: number;
  isLive: boolean;
}
