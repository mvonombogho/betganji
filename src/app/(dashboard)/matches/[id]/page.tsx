// Previous imports and data remain the same...

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
        <div className="space-y-6">
          <MatchOdds match={match} />
          <MatchLineups match={match} />
        </div>

        <div className="space-y-6">
          <MatchCommentary match={match} />

          <Card>
            <CardHeader>
              <CardTitle>Match Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Competition</dt>
                  <dd className="font-medium">{match.competition.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Venue</dt>
                  <dd className="font-medium">{match.venue}</dd>
                </div>
                {match.referee && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Referee</dt>
                    <dd className="font-medium">{match.referee}</dd>
                  </div>
                )}
                {match.weather && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Weather</dt>
                    <dd className="font-medium">
                      {match.weather.condition}, {match.weather.temperature}°C
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {match.h2h && (
            <Card>
              <CardHeader>
                <CardTitle>Head to Head</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <p className="text-2xl font-bold">
                      {match.h2h.homeWins}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {match.homeTeam.name}
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
                      {match.awayTeam.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Games
                    </span>
                    <span className="font-medium">
                      {match.h2h.totalGames}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Goals
                    </span>
                    <span className="font-medium">
                      {match.h2h.homeGoals + match.h2h.awayGoals}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average Goals/Game
                    </span>
                    <span className="font-medium">
                      {((match.h2h.homeGoals + match.h2h.awayGoals) / 
                        match.h2h.totalGames).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}