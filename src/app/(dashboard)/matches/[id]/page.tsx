import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Match } from "@/types/match"
import { Button } from "@/components/ui/button"
import { MatchDetailHeader } from "@/components/matches/match-detail-header"
import { MatchOdds } from "@/components/matches/match-odds"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

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
    },
    {
      homeWin: 2.0,
      draw: 3.5,
      awayWin: 3.7,
      provider: "Bet365",
      lastUpdated: new Date(Date.now() - 3600000)
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
  weather: {
    temperature: 18,
    condition: "Clear"
  }
}

interface MatchDetailPageProps {
  params: {
    id: string
  }
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  // In a real app, fetch match data using the ID
  const match = demoMatch
  
  if (!match) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/matches">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to matches
        </Link>
      </Button>

      <MatchDetailHeader match={match} />

      <div className="grid gap-6 md:grid-cols-2">
        <MatchOdds match={match} />

        <div className="space-y-6">
          {match.h2h && (
            <Card>
              <CardHeader>
                <CardTitle>Head to Head Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      {match.h2h.homeWins}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {match.homeTeam.name} wins
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {match.h2h.draws}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Draws
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {match.h2h.awayWins}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {match.awayTeam.name} wins
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Games</span>
                      <span className="font-medium">{match.h2h.totalGames}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Goals</span>
                      <span className="font-medium">
                        {match.h2h.homeGoals + match.h2h.awayGoals}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Goals/Game</span>
                      <span className="font-medium">
                        {((match.h2h.homeGoals + match.h2h.awayGoals) / match.h2h.totalGames).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Match Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">Venue</TableCell>
                    <TableCell className="text-right font-medium">
                      {match.venue}
                    </TableCell>
                  </TableRow>
                  {match.referee && (
                    <TableRow>
                      <TableCell className="text-muted-foreground">Referee</TableCell>
                      <TableCell className="text-right font-medium">
                        {match.referee}
                      </TableCell>
                    </TableRow>
                  )}
                  {match.weather && (
                    <TableRow>
                      <TableCell className="text-muted-foreground">Weather</TableCell>
                      <TableCell className="text-right font-medium">
                        {match.weather.condition}, {match.weather.temperature}°C
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}