import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Ban } from 'lucide-react';

interface BetSettlementProps {
  betId: string;
  onSettled: () => void;
}

export default function BetSettlement({ betId, onSettled }: BetSettlementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'won' | 'lost' | 'void'>('won');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSettle = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bets/${betId}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to settle bet');

      onSettled();
      setIsOpen(false);
    } catch (error) {
      console.error('Error settling bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Settle Bet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle Bet</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as 'won' | 'lost' | 'void')}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="won" id="won" />
              <Label htmlFor="won" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Won
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Lost
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="void" id="void" />
              <Label htmlFor="void" className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-gray-500" />
                Void
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          onClick={handleSettle}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Settling...' : 'Confirm Settlement'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}