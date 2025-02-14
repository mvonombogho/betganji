import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BetSelection {
  id: string;
  matchId: string;
  selection: string;
  odds: number;
  status: string;
  result?: string;
}

interface Bet {
  id: string;
  totalOdds: number;
  stake: number;
  potentialWin: number;
  status: string;
  selections: BetSelection[];
  createdAt: string;
  settledAt?: string;
}

export default function BetHistory() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch('/api/bets');
        if (!response.ok) throw new Error('Failed to fetch bets');
        const data = await response.json();
        setBets(data);
      } catch (error) {
        console.error('Error fetching bets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'partially_won': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading bet history...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bet History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bets.length === 0 ? (
            <p className="text-center text-muted-foreground">No bets placed yet</p>
          ) : (
            bets.map((bet) => (
              <Card key={bet.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      Stake: ${bet.stake.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Potential Win: ${bet.potentialWin.toFixed(2)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(bet.status)}>
                    {bet.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {bet.selections.map((selection) => (
                    <div key={selection.id} className="text-sm border-t pt-2">
                      <p>{selection.selection}</p>
                      <p className="text-muted-foreground">
                        Odds: {selection.odds}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Placed: {new Date(bet.createdAt).toLocaleString()}
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}