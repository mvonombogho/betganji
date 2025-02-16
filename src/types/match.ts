export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  datetime: Date;
  status: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface Competition {
  id: string;
  name: string;
  country: string;
}

export interface TeamStats {
  teamId: string;
  lastMatches: {
    total: number;
    wins: number;
    draws: number;
    losses: number;
  };
  goalsScored: {
    total: number;
    average: number;
    home?: number;
    away?: number;
  };
  goalsConceded: {
    total: number;
    average: number;
    home?: number;
    away?: number;
  };
  cleanSheets: number;
  failedToScore: number;
  form: string[]; // Last 5 results: W, L, D, etc.
  homeAdvantage?: {
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
  };
  awayPerformance?: {
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
  };
}

export interface H2HStats {
  matches: H2HMatch[];
  summary: {
    totalMatches: number;
    team1Wins: number;
    team2Wins: number;
    draws: number;
    team1Goals: number;
    team2Goals: number;
  };
  recentForm: {
    lastFiveResults: string[];
    averageGoalsScored: number;
    averageGoalsConceded: number;
  };
}

export interface H2HMatch {
  id: string;
  date: Date;
  competition: string;
  homeTeam: {
    id: string;
    name: string;
    score: number;
  };
  awayTeam: {
    id: string;
    name: string;
    score: number;
  };
}

export interface MatchData {
  match: Match;
  teamStats: {
    home: TeamStats;
    away: TeamStats;
  };
  h2h: H2HStats;
}
