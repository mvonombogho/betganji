import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Match } from "@/types/match"
import { Button } from "@/components/ui/button"
import { MatchDetailHeader } from "@/components/matches/match-detail-header"
import { MatchOdds } from "@/components/matches/match-odds"
import { MatchLineups } from "@/components/matches/match-lineups"
import { MatchCommentary } from "@/components/matches/match-commentary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Demo data - replace with actual data fetching
const demoMatch: Match = {
  id: "1",
  competition: {
    id: "1",
    name: "Premier League",
    country: "England"
  },
  homeTeam: {
    id: "1",
    name: "Manchester United",
    venue: "Old Trafford"
  },
  awayTeam: {
    id: "2",
    name: "Arsenal",
    venue: "Emirates Stadium"
  },
  kickoff: new Date(),
  status: "live",
  venue: "Old Trafford",
  referee: "Michael Oliver",
  weather: {
    temperature: 18,
    condition: "Clear"
  },
  score: {
    homeScore: 2,
    awayScore: 1,
    homeHalfScore: 1,
    awayHalfScore: 0
  },
  stats: {
    possession: {
      home: 55,
      away: 45
    },
    shots: {
      home: 12,
      away: 8
    },
    corners: {
      home: 6,
      away: 4
    }
  },
  odds: [
    {
      homeWin: 1.95,
      draw: 3.4,
      awayWin: 3.8,
      provider: "Betfair",
      lastUpdated: new Date()
    }
  ],
  h2h: {
    totalGames: 10,
    homeWins: 4,
    draws: 3,
    awayWins: 3,
    homeGoals: 15,
    awayGoals: 12,
    lastMeetings: []
  },