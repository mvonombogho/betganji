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
  // Add team statistics fields
}

export interface H2HStats {
  // Add head-to-head statistics fields
}

export interface MatchData {
  match: Match;
  teamStats: {
    home: TeamStats;
    away: TeamStats;
  };
  h2h: H2HStats;
}