import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Match {
  id: string;
  datetime: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  predictionAccuracy: number;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

interface MatchDetailsProps {
  match: Match;
  onClose: () => void;
}

function MatchDetails({ match, onClose }: MatchDetailsProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {match.homeTeam} vs {match.awayTeam}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Match Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {match.homeScore} - {match.awayScore}
            </div>
            <div className="text-sm text-muted-foreground text-center mt-1">
              {format(new Date(match.datetime), 'dd MMMM yyyy, HH:mm')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              {match.predictionAccuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground text-center mt-1">
              Model confidence
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Betting Odds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{match.odds.homeWin.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Home Win</div>
              </div>
              <div>
                <div className="text-lg font-bold">{match.odds.draw.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Draw</div>
              </div>
              <div>
                <div className="text-lg font-bold">{match.odds.awayWin.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Away Win</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </DialogContent>
  );
}

export { MatchDetails };
export type { Match };