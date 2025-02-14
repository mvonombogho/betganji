import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeamStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  failedToScore: number;
  form: string[];
  predictedMatches: number;
  predictionAccuracy: number;
}

interface Team {
  id: string;
  name: string;
  country: string;
  logo?: string;
  stats: TeamStats;
}

interface LeagueTeamsGridProps {
  teams: Team[];
}

export function LeagueTeamsGrid({ teams }: LeagueTeamsGridProps) {
  const getWinRate = (stats: TeamStats) => {
    return ((stats.wins / stats.totalMatches) * 100).toFixed(1);
  };

  const getGoalDifference = (stats: TeamStats) => {
    const diff = stats.goalsFor - stats.goalsAgainst;
    return diff > 0 ? `+${diff}` : diff;
  };

  const getFormBadgeVariant = (result: string) => {
    switch (result) {
      case 'W': return 'success';
      case 'D': return 'warning';
      case 'L': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Card key={team.id} className="overflow-hidden">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-4">
              {team.logo && (
                <img 
                  src={team.logo}
                  alt={`${team.name} logo`}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div>
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <CardDescription>{team.country}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Form */}
              <div>
                <p className="text-sm font-medium mb-2">Recent Form</p>
                <div className="flex space-x-1">
                  {team.stats.form.map((result, index) => (
                    <Badge 
                      key={index}
                      variant={getFormBadgeVariant(result)}
                    >
                      {result}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-lg font-semibold">{getWinRate(team.stats)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goal Difference</p>
                  <p className="text-lg font-semibold">{getGoalDifference(team.stats)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clean Sheets</p>
                  <p className="text-lg font-semibold">{team.stats.cleanSheets}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed to Score</p>
                  <p className="text-lg font-semibold">{team.stats.failedToScore}</p>
                </div>
              </div>

              {/* Prediction Stats */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Matches</p>
                    <p className="text-lg font-semibold">{team.stats.predictedMatches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                    <p className="text-lg font-semibold">
                      {team.stats.predictionAccuracy.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}