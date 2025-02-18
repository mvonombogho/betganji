export interface MatchFeatures {
  // Match information
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  datetime: Date;

  // Home team form
  homeFormWins: number;
  homeFormDraws: number;
  homeFormLosses: number;
  homeFormGoalsScored: number;
  homeFormGoalsConceded: number;

  // Away team form
  awayFormWins: number;
  awayFormDraws: number;
  awayFormLosses: number;
  awayFormGoalsScored: number;
  awayFormGoalsConceded: number;

  // Head-to-head history
  h2hHomeWins: number;
  h2hAwayWins: number;
  h2hDraws: number;
  h2hHomeGoals: number;
  h2hAwayGoals: number;

  // Target variables
  result: string;
  homeScore: number;
  awayScore: number;
}

export interface ModelPrediction {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedResult: string;
  confidence: number;
}
