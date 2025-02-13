export type BetType = 'single' | 'multiple' | 'system'
export type BetStatus = 'pending' | 'won' | 'lost' | 'void'
export type StakeUnit = 'fixed' | 'percentage'

export interface BankrollConfig {
  initialCapital: number
  currentBalance: number
  currency: string
  maxStakePerBet: number         // Maximum stake for a single bet
  maxStakePerDay: number         // Maximum total stakes per day
  stakeUnit: StakeUnit          // Whether stakes are fixed amounts or % of bankroll
  stopLoss: number              // Daily stop loss limit
  targetProfit: number          // Daily profit target
}

export interface BettingSite {
  id: string
  name: string
  currentBalance: number
  totalDeposited: number
  totalWithdrawn: number
}

export interface PlacedBet {
  id: string
  userId: string
  matchId: string
  type: BetType
  selection: string           // e.g., "Home Win", "Over 2.5"
  odds: number
  stake: number
  potentialWin: number
  status: BetStatus
  bettingSite: string        // Which site the bet was placed on
  reasoning: string          // Why this bet was chosen
  confidenceLevel: number    // 1-10 scale
  result?: string
  profitLoss?: number
  placedAt: Date
  settledAt?: Date
}

export interface BettingStats {
  totalBets: number
  wonBets: number
  lostBets: number
  voidBets: number
  winRate: number
  averageOdds: number
  totalStaked: number
  totalReturns: number
  profit: number
  roi: number
  averageStake: number
  biggestWin: number
  biggestLoss: number
  currentStreak: number
  bestStreak: number
  worstStreak: number
}

export interface DailyStats {
  date: Date
  betsPlaced: number
  totalStaked: number
  totalReturns: number
  profitLoss: number
  roi: number
}

export interface BankrollHistory {
  date: Date
  balance: number
  change: number
  reason: string  // e.g., "Bet Settlement", "Manual Adjustment"
}