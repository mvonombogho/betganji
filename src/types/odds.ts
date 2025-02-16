export interface OddsData {
  id: string;
  matchId: string;
  provider: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  timestamp: Date;
}

export interface OddsHistory {
  matchId: string;
  odds: OddsData[];
}
