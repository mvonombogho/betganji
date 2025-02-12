'use client'

import Link from "next/link"
import { format } from "date-fns"
import { Match } from "@/types/match"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MatchCardProps {
  match: Match
  showOdds?: boolean
}

const statusColors = {
  scheduled: "bg-blue-500",
  live: "bg-green-500",
  finished: "bg-gray-500",
  cancelled: "bg-red-500",
} as const

export function MatchCard({ match, showOdds = true }: MatchCardProps) {
  const bestOdds = match.odds?.[0]

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {match.competition.name}
            </span>
            <Badge 
              variant="secondary" 
              className={statusColors[match.status]}
            >
              {match.status.toUpperCase()}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {format(match.kickoff, "MMM d, HH:mm")}
          </span>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
              <div className="text-right">
                <p className="font-semibold">{match.homeTeam.name}</p>
                {match.score && (
                  <p className="text-xl font-bold">{match.score.homeScore}</p>
                )}
              </div>
              <div className="text-center text-muted-foreground text-sm">
                vs
              </div>
              <div>
                <p className="font-semibold">{match.awayTeam.name}</p>
                {match.score && (
                  <p className="text-xl font-bold">{match.score.awayScore}</p>
                )}
              </div>
            </div>
            
            {showOdds && bestOdds && (
              <div className="grid grid-cols-3 gap-2 text-sm text-center pt-2 border-t">
                <div>
                  <p className="text-muted-foreground">Home</p>
                  <p className="font-medium">{bestOdds.homeWin.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Draw</p>
                  <p className="font-medium">{bestOdds.draw.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Away</p>
                  <p className="font-medium">{bestOdds.awayWin.toFixed(2)}</p>
                </div>
              </div>
            )}
            
            {match.stats && match.status === 'live' && (
              <div className="grid grid-cols-3 gap-2 text-sm text-center pt-2 border-t">
                <div>
                  <p className="text-muted-foreground">Possession</p>
                  <p className="font-medium">{match.stats.possession?.home}% - {match.stats.possession?.away}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shots</p>
                  <p className="font-medium">{match.stats.shots?.home} - {match.stats.shots?.away}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Corners</p>
                  <p className="font-medium">{match.stats.corners?.home} - {match.stats.corners?.away}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}