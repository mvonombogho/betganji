/**
 * Represents a single match in the head-to-head history
 */
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

/**
 * Basic summary statistics for head-to-head matches
 */
export interface H2HSummary {
  totalMatches: number;
  team1Wins: number;
  team2Wins: number;
  draws: number;
  team1Goals: number;
  team2Goals: number;
}
