'use client'

import { Match } from "@/types/match"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MatchLineupsProps {
  match: Match
}

function TeamLineup({ lineup, teamName }: { lineup: Match['lineups']['home'], teamName: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{teamName}</h3>
        <p className="text-sm text-muted-foreground">Formation: {lineup.formation}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Starting XI</h4>
          <div className="space-y-2">
            {lineup.startingXI.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between py-2 px-3 bg-accent rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-6">{player.number}</span>
                  <span>{player.name}</span>
                  {player.isCaptain && (
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      (C)
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {player.position}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Substitutes</h4>
          <div className="space-y-2">
            {lineup.substitutes.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-6">{player.number}</span>
                  <span>{player.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {player.position}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Coach:</span>
            <span>{lineup.coach.name}</span>
            {lineup.coach.nationality && (
              <span className="text-sm text-muted-foreground">
                ({lineup.coach.nationality})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MatchLineups({ match }: MatchLineupsProps) {
  if (!match.lineups) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Lineups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Lineups are not yet available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Lineups</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">{match.homeTeam.name}</TabsTrigger>
            <TabsTrigger value="away">{match.awayTeam.name}</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <TeamLineup lineup={match.lineups.home} teamName={match.homeTeam.name} />
          </TabsContent>
          <TabsContent value="away">
            <TeamLineup lineup={match.lineups.away} teamName={match.awayTeam.name} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}