import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Prediction {
  id: string;
  match: {
    datetime: Date;
    homeTeam: { name: string };
    awayTeam: { name: string };
    status: string;
    result?: string;
  };
  result: string;
  confidence: number;
  stake?: number;
  odds: number;
  profit?: number;
  reasoning?: string;
  createdAt: Date;
}

interface LeaguePredictionsTableProps {
  predictions: Prediction[];
}

export function LeaguePredictionsTable({ predictions }: LeaguePredictionsTableProps) {
  const formatResult = (result: string) => {
    switch (result) {
      case 'HOME_WIN': return 'Home Win';
      case 'AWAY_WIN': return 'Away Win';
      case 'DRAW': return 'Draw';
      default: return result;
    }
  };

  const getResultBadgeVariant = (prediction: Prediction) => {
    if (prediction.match.status !== 'FINISHED') return 'secondary';
    return prediction.result === prediction.match.result ? 'success' : 'destructive';
  };

  const calculateROI = (stake?: number, profit?: number) => {
    if (!stake || !profit) return null;
    return ((profit / stake) * 100).toFixed(2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Prediction</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
            <TableHead className="text-right">Odds</TableHead>
            <TableHead className="text-right">Stake</TableHead>
            <TableHead className="text-right">Profit/Loss</TableHead>
            <TableHead className="text-right">ROI</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {predictions.map((prediction) => (
            <TableRow key={prediction.id}>
              <TableCell>
                {format(new Date(prediction.match.datetime), 'MMM dd, HH:mm')}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{prediction.match.homeTeam.name}</span>
                  <span>vs</span>
                  <span>{prediction.match.awayTeam.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getResultBadgeVariant(prediction)}>
                  {formatResult(prediction.result)}
                </Badge>
                {prediction.reasoning && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {prediction.reasoning}
                  </p>
                )}
              </TableCell>
              <TableCell className="text-right">
                {prediction.confidence}%
              </TableCell>
              <TableCell className="text-right">
                {prediction.odds.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {prediction.stake ? `${prediction.stake.toFixed(2)} units` : '-'}
              </TableCell>
              <TableCell className="text-right">
                {prediction.profit ? (
                  <span className={prediction.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {prediction.profit >= 0 ? '+' : ''}{prediction.profit.toFixed(2)}
                  </span>
                ) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {calculateROI(prediction.stake, prediction.profit) ? (
                  <span>{calculateROI(prediction.stake, prediction.profit)}%</span>
                ) : '-'}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {prediction.match.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}