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
}
