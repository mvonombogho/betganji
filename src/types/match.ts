export interface Team {
  id: string;
  name: string;
  shortName?: string;
  tla?: string;
  score?: number;
}

export interface Competition {
  id: string;
  name: string;
  code?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  datetime: string;
  status: MatchStatus;
  odds?: Odds;
  predictions?: Prediction[];
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  IN_PLAY = 'IN_PLAY',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  POSTPONED = 'POSTPONED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

export interface TeamStats {
  form: string; // Last 5 matches: W-L-D format
  recentMatches: RecentMatch[];
}

export interface RecentMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  date: string;
}

export interface H2HStats {
  matches: RecentMatch[];
  stats: {
    team1Wins: number;
    team2Wins: number;
    draws: number;
    totalMatches: number;
  };
}

export interface Odds {
  id: string;
  matchId: string;
  provider: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  timestamp: string;
}

export interface Prediction {
  id: string;
  matchId: string;
  result: string;
  confidence: number;
  insights: Record<string, any>;
  createdAt: string;
}