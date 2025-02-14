import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface PlacedBet {
  id: string;
  matchId: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  bettingSite: string;
  reasoning: string;
  createdAt: string;
  settledAt?: string;
}

export default function BetHistory() {
  const [bets, setBets] = useState<PlacedBet[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const query = filter !== 'all' ? `?status=${filter}` : '';
        const response = await fetch(`/api/bets${query}`);
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
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-500';
      case 'lost':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'void':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calculateTotalProfit = () => {
    return bets.reduce((total, bet) => {
      if (bet.status === 'won') return total + (bet.potentialWin - bet.stake);
      if (bet.status === 'lost') return total - bet.stake;
      return total;
    }, 0);
  };

  if (isLoading) {
    return <div>Loading bet history...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bet History</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between text-sm">
          <span>Total Profit/Loss:</span>
          <span className={`font-bold ${calculateTotalProfit() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {calculateTotalProfit().toFixed(2)}
          </span>
        </div>

        <div className="space-y-4">
          {bets.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No bets found
            </p>
          ) : (
            bets.map((bet) => (
              <Card key={bet.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{bet.selection}</p>
                    <p className="text-sm text-muted-foreground">
                      {bet.bettingSite} - {new Date(bet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(bet.status)}>
                    {bet.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stake</p>
                    <p>{bet.stake.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Odds</p>
                    <p>{bet.odds.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Potential Win</p>
                    <p>{bet.potentialWin.toFixed(2)}</p>
                  </div>
                </div>
                {bet.reasoning && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Note: {bet.reasoning}
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}