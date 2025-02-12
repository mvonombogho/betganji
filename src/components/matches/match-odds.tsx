'use client'

import { Match } from "@/types/match"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

interface MatchOddsProps {
  match: Match
}

export function MatchOdds({ match }: MatchOddsProps) {
  if (!match.odds?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Betting Odds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No odds available for this match yet
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group odds by provider
  const oddsByProvider = match.odds.reduce((acc, odds) => {
    if (!acc[odds.provider]) {
      acc[odds.provider] = []
    }
    acc[odds.provider].push(odds)
    return acc
  }, {} as Record<string, typeof match.odds>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betting Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(oddsByProvider).map(([provider, odds]) => {
            const latestOdds = odds[0]

            return (
              <div key={provider}>
                <h3 className="text-sm font-medium mb-2">
                  {provider}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Home Win
                        </p>
                        <p className="text-2xl font-bold">
                          {latestOdds.homeWin.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Draw
                        </p>
                        <p className="text-2xl font-bold">
                          {latestOdds.draw.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Away Win
                        </p>
                        <p className="text-2xl font-bold">
                          {latestOdds.awayWin.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {odds.length > 1 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Odds History</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Home</TableHead>
                          <TableHead className="text-right">Draw</TableHead>
                          <TableHead className="text-right">Away</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {odds.map((odd, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(odd.lastUpdated, { 
                                addSuffix: true 
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {odd.homeWin.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {odd.draw.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {odd.awayWin.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}