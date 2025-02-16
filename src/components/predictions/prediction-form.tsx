import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Match } from '@/types/match';
import { OddsData } from '@/types/odds';

interface PredictionFormProps {
  match: Match;
  odds?: OddsData;
  onSubmit: (data: PredictionFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface PredictionFormData {
  matchId: string;
  predictedScore: {
    home: number;
    away: number;
  };
  confidence: number;
  notes?: string;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  match,
  odds,
  onSubmit,
  isLoading
}) => {
  const [homeScore, setHomeScore] = React.useState<number>(0);
  const [awayScore, setAwayScore] = React.useState<number>(0);
  const [confidence, setConfidence] = React.useState<number>(50);
  const [notes, setNotes] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: PredictionFormData = {
      matchId: match.id,
      predictedScore: {
        home: homeScore,
        away: awayScore
      },
      confidence,
      notes: notes.trim() || undefined
    };

    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{match.homeTeam.name}</label>
              <Input
                type="number"
                min={0}
                value={homeScore}
                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>
            <div className="text-xl font-bold">-</div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">{match.awayTeam.name}</label>
              <Input
                type="number"
                min={0}
                value={awayScore}
                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confidence ({confidence}%)</label>
            <Input
              type="range"
              min={0}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              placeholder="Add any additional notes or reasoning..."
            />
          </div>

          {odds && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium mb-2">Current Odds</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>Home: {odds.homeWin.toFixed(2)}</div>
                <div>Draw: {odds.draw.toFixed(2)}</div>
                <div>Away: {odds.awayWin.toFixed(2)}</div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Submitting...' : 'Submit Prediction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;