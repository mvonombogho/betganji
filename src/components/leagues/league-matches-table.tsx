import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Match {
  id: string;
  datetime: Date;
  homeTeam: { name: string };
  awayTeam: { name: string };
  status: string;
  result?: string;
  predictions: Array<{
    result: string;
    confidence: number;
  }>;
  odds: Array<{
    homeWin: number;
    draw: number;
    awayWin: number;
  }>;
}

interface LeagueMatchesTableProps {
  matches: Match[];
}

export function LeagueMatchesTable({ matches }: LeagueMatchesTableProps) {
  const getResultBadgeColor = (status: string, isCorrect?: boolean) => {
    if (status !== 'FINISHED') return 'secondary';
    return isCorrect ? 'success' : 'destructive';
  };

  const formatResult = (result?: string) => {
    switch (result) {
      case 'HOME_WIN': return 'Home Win';
      case 'AWAY_WIN': return 'Away Win';
      case 'DRAW': return 'Draw';
      default: return '-';
    }
  };

  const getOddsForResult = (odds: Match['odds'][0], result: string) => {
    if (!odds) return '-';
    switch (result) {
      case 'HOME_WIN': return odds.homeWin.toFixed(2);
      case 'DRAW': return odds.draw.toFixed(2);
      case 'AWAY_WIN': return odds.awayWin.toFixed(2);
      default: return '-';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prediction</TableHead>
            <TableHead>Odds</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                {format(new Date(match.datetime), 'MMM dd, HH:mm')}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{match.homeTeam.name}</span>
                  <span>{match.awayTeam.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{match.status}</Badge>
              </TableCell>
              <TableCell>
                {match.predictions[0] ? (
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">
                      {formatResult(match.predictions[0].result)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {match.predictions[0].confidence}% confidence
                    </span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {match.predictions[0] && match.odds[0] ? (
                  getOddsForResult(match.odds[0], match.predictions[0].result)
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {match.result ? (
                  <Badge
                    variant={getResultBadgeColor(
                      match.status,
                      match.predictions[0]?.result === match.result
                    )}
                  >
                    {formatResult(match.result)}
                  </Badge>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}