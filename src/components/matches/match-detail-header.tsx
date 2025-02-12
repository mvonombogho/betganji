'use client'

import { formatDistanceToNow, format } from "date-fns"
import { Match } from "@/types/match"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface MatchDetailHeaderProps {
  match: Match
}

const statusColors = {
  scheduled: "bg-blue-500",
  live: "bg-green-500",
  finished: "bg-gray-500",
  cancelled: "bg-red-500",
} as const

export function MatchDetailHeader({ match }: MatchDetailHeaderProps) {
  const isLive = match.status === 'live'
  const isScheduled = match.status === 'scheduled'
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
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
          <p className="text-sm text-muted-foreground mt-1">
            {match.venue} • {format(match.kickoff, "MMMM d, yyyy")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {isScheduled && (
              `Starts ${formatDistanceToNow(match.kickoff, { addSuffix: true })}`
            )}
            {isLive && "LIVE"}
          </p>
          <p className="text-sm font-medium mt-1">
            {format(match.kickoff, "HH:mm")}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="text-right">
              <p className="text-2xl font-bold">{match.homeTeam.name}</p>
              {match.score && (
                <p className="text-4xl font-bold mt-2">
                  {match.score.homeScore}
                </p>
              )}
            </div>
            <div className="text-center text-2xl font-bold text-muted-foreground">
              VS
            </div>
            <div>
              <p className="text-2xl font-bold">{match.awayTeam.name}</p>
              {match.score && (
                <p className="text-4xl font-bold mt-2">
                  {match.score.awayScore}
                </p>
              )}
            </div>
          </div>

          {isLive && match.stats && (
            <div className="grid grid-cols-3 gap-8 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Possession</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="font-bold">{match.stats.possession?.home}%</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-bold">{match.stats.possession?.away}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Shots</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="font-bold">{match.stats.shots?.home}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-bold">{match.stats.shots?.away}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Corners</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="font-bold">{match.stats.corners?.home}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-bold">{match.stats.corners?.away}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}