export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'

export interface Team {
  id: string
  name: string
  shortName?: string
  logo?: string
  venue?: string
}

export interface Competition {
  id: string
  name: string
  country: string
  logo?: string
}

export interface MatchScore {
  homeScore: number | null
  awayScore: number | null
  homeHalfScore?: number
  awayHalfScore?: number
}

export interface MatchOdds {
  homeWin: number
  draw: number
  awayWin: number
  provider: string
  lastUpdated: Date
}

export interface H2HStats {
  totalGames: number
  homeWins: number
  draws: number
  awayWins: number
  homeGoals: number
  awayGoals: number
  lastMeetings: Match[]
}

export interface Match {
  id: string
  competition: Competition
  homeTeam: Team
  awayTeam: Team
  kickoff: Date
  status: MatchStatus
  score?: MatchScore
  odds?: MatchOdds[]
  venue: string
  referee?: string
  weather?: {
    temperature?: number
    condition?: string
  }
  h2h?: H2HStats
  stats?: {
    possession?: {
      home: number
      away: number
    }
    shots?: {
      home: number
      away: number
    }
    shotsOnTarget?: {
      home: number
      away: number
    }
    corners?: {
      home: number
      away: number
    }
  }
}