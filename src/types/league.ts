export interface LeagueStats {
  averageGoals: number;
  homeWinRatio: number;
  predictionAccuracy: number;
  totalMatches: number;
  seasonId: string;
  leagueId: string;
}

export interface FormEntry {
  matchId: string;
  result: 'W' | 'D' | 'L';
  goalsScored: number;
  goalsConceded: number;
  date: Date;
}

export interface ScoringEntry {
  matchId: string;
  goalsScored: number;
  date: Date;
}

export interface TeamPerformance {
  teamId: string;
  seasonId: string;
  recentForm: FormEntry[];
  scoringTrend: ScoringEntry[];
  totalMatches: number;
}

export interface MatchTrend {
  period: string;
  totalMatches: number;
  averageGoals: number;
  homeWinPercentage: number;
}

export interface LeagueComparison {
  leagueId: string;
  seasonId: string;
  averageGoalsPerMatch: number;
  averageCardsPerMatch: number;
  homeWinPercentage: number;
  awayWinPercentage: number;
  drawPercentage: number;
  cleanSheetPercentage: number;
  bttsPercentage: number; // Both teams to score
  over25GoalsPercentage: number; // Over 2.5 goals
}

export interface TeamStrength {
  attack: number;
  defense: number;
  homeAdvantage: number;
  formTrend: number;
  injuryImpact: number;
}

export interface MatchPredictionFactors {
  homeTeamStrength: TeamStrength;
  awayTeamStrength: TeamStrength;
  headToHead: {
    totalMatches: number;
    homeWins: number;
    awayWins: number;
    draws: number;
    averageGoals: number;
  };
  recentForm: {
    homeTeamForm: FormEntry[];
    awayTeamForm: FormEntry[];
  };
  leagueContext: {
    homeTeamPosition: number;
    awayTeamPosition: number;
    homeTeamGoalDifference: number;
    awayTeamGoalDifference: number;
  };
}

export interface LeaguePredictionModel {
  leagueId: string;
  seasonId: string;
  accuracy: number;
  totalPredictions: number;
  successfulPredictions: number;
  modelFeatures: {
    useHistoricalData: boolean;
    useFormData: boolean;
    useHeadToHead: boolean;
    useTeamStrength: boolean;
    useLeaguePosition: boolean;
  };
  weights: {
    historicalWeight: number;
    formWeight: number;
    headToHeadWeight: number;
    teamStrengthWeight: number;
    leaguePositionWeight: number;
  };
}