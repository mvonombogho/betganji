export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  datetime: string;
  status: MatchStatus;
  score?: Score;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
}

export interface Competition {
  id: string;
  name: string;
  country: string;
  logo?: string;
}

export interface Score {
  home: number;
  away: number;
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';

export interface TeamStats {
  id: string;
  recentForm: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface H2HStats {
  matches: Match[];
  summary: {
    totalMatches: number;
    wins: {
      team1: number;
      team2: number;
    };
    draws: number;
    goalsScored: {
      team1: number;
      team2: number;
    };
  };
}
