import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { Match } from './match-drill-down';

interface RecentMatchesTableProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
}

export default function RecentMatchesTable({
  matches,
  onMatchSelect,
}: RecentMatchesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Match</TableHead>
              <TableHead className="text-center">Result</TableHead>
              <TableHead className="text-center">Prediction</TableHead>
              <TableHead className="text-center">Odds</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">
                  {format(new Date(match.datetime), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{match.homeTeam}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center font-medium">
                    {match.homeScore} - {match.awayScore}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span 
                    className={
                      match.predictionAccuracy >= 80
                        ? 'text-green-500 font-medium'
                        : match.predictionAccuracy >= 60
                        ? 'text-yellow-500 font-medium'
                        : 'text-red-500 font-medium'
                    }
                  >
                    {match.predictionAccuracy.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col text-sm">
                    <span>H: {match.odds.homeWin.toFixed(2)}</span>
                    <span>D: {match.odds.draw.toFixed(2)}</span>
                    <span>A: {match.odds.awayWin.toFixed(2)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMatchSelect(match)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}