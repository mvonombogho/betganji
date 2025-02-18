export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface MatchAlert {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  datetime: Date;
  competition: string;
}

export interface PredictionResult {
  id: string;
  match: {
    homeTeam: string;
    awayTeam: string;
  };
  prediction: string;
  actualResult: string;
  accuracy: number;
}