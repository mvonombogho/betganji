export type PredictionStatus = 'pending' | 'won' | 'lost' | 'void'
export type PredictionType = 'match_result' | 'over_under' | 'both_teams_to_score'

export interface Prediction {
  id: string
  matchId: string
  userId: string
  type: PredictionType
  prediction: string
  odds: number
  stake?: number
  confidence: number
  status: PredictionStatus
  result?: string
  analysis: string
  createdAt: Date
  updatedAt: Date
}

export interface PredictionFormData {
  matchId: string
  type: PredictionType
  prediction: string
  odds: number
  stake?: number
  confidence: number
  analysis: string
}

export interface PredictionStats {
  totalPredictions: number
  wonPredictions: number
  lostPredictions: number
  voidPredictions: number
  winRate: number
  averageOdds: number
  profit: number
  roi: number
}