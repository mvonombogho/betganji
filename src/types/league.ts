export interface League {
  id: string;
  name: string;
  country: string;
  currentSeason: string;
  description?: string;
  teamCount: number;
  predictionSuccessRate: number;
  totalPredictions: number;
  averageGoalsPerMatch: number;
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: string;
  predictions: number;
  successRate: number;
}