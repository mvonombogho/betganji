import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ManualBetSlipProps {
  matchId: string;
  prediction: string;
  onSubmit: (data: any) => Promise<void>;
}

const BOOKMAKERS = [
  'Bet365',
  'Betway',
  'Betfair',
  '1xBet',
  'William Hill',
  'Other'
];

export default function ManualBetSlip({
  matchId,
  prediction,
  onSubmit
}: ManualBetSlipProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    matchId,
    prediction,
    bookmaker: '',
    odds: '',
    stake: '',
    notes: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        odds: parseFloat(formData.odds),
        stake: parseFloat(formData.stake)
      });
      
      // Reset form except matchId and prediction
      setFormData(prev => ({
        ...prev,
        bookmaker: '',
        odds: '',
        stake: '',
        notes: ''
      }));
    } catch (error) {
      console.error('Error submitting bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const potentialWin = parseFloat(formData.odds) * parseFloat(formData.stake) || 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Record Bet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Bookmaker</Label>
            <Select 
              value={formData.bookmaker}
              onValueChange={(value) => handleChange('bookmaker', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bookmaker" />
              </SelectTrigger>
              <SelectContent>
                {BOOKMAKERS.map((bookie) => (
                  <SelectItem key={bookie} value={bookie}>
                    {bookie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Odds</Label>
            <Input
              type="number"
              step="0.01"
              min="1.01"
              placeholder="Enter odds"
              value={formData.odds}
              onChange={(e) => handleChange('odds', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Stake</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter stake"
              value={formData.stake}
              onChange={(e) => handleChange('stake', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Input
              placeholder="Add any notes about this bet"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Potential Win:</span>
            <span>{potentialWin.toFixed(2)}</span>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Recording...' : 'Record Bet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}