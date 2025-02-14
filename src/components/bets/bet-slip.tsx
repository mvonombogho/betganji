import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Selection {
  matchId: string;
  selection: string;
  odds: number;
}

interface BetSlipProps {
  selections: Selection[];
  onRemoveSelection: (matchId: string) => void;
  onClearSlip: () => void;
}

export default function BetSlip({ selections, onRemoveSelection, onClearSlip }: BetSlipProps) {
  const [stake, setStake] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = parseFloat(stake) * totalOdds;

  const handleSubmit = async () => {
    if (!stake || parseFloat(stake) <= 0) {
      toast.error('Please enter a valid stake');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selections,
          stake: parseFloat(stake)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      toast.success('Bet placed successfully');
      onClearSlip();
      setStake('');
    } catch (error) {
      toast.error('Failed to place bet');
      console.error('Error placing bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bet Slip</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selections.length === 0 ? (
          <p className="text-center text-muted-foreground">No selections added</p>
        ) : (
          <>
            {selections.map((selection) => (
              <div key={selection.matchId} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{selection.selection}</p>
                  <p className="text-sm text-muted-foreground">Odds: {selection.odds}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSelection(selection.matchId)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Enter stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Odds:</span>
              <span>{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Potential Win:</span>
              <span>{potentialWin.toFixed(2)}</span>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={selections.length === 0 || !stake || isSubmitting}
        >
          {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
        </Button>
        {selections.length > 0 && (
          <Button
            variant="outline"
            onClick={onClearSlip}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}