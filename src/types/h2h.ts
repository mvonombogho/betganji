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

/**
 * Recent form analysis for head-to-head matches
 */
export interface H2HForm {
  lastFiveResults: string[];
  averageGoalsScored: number;
  averageGoalsConceded: number;
  cleanSheets: number;
  goallessDraws: number;
}

/**
 * Complete head-to-head statistics between two teams
 */
export interface H2HStats {
  // Team identifiers
  team1Id: string;
  team2Id: string;
  
  // Match history
  matches: H2HMatch[];
  
  // Statistical summaries
  summary: H2HSummary;
  
  // Form analysis
  team1Form: H2HForm;
  team2Form: H2HForm;
  
  // Additional context
  lastMatch?: H2HMatch;
  venue?: {
    team1HomeWins: number;
    team2HomeWins: number;
    draws: number;
  };
}
