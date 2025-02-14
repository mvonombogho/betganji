import { createContext, useContext, useState, useCallback } from 'react';

interface Bet {
  id: string;
  matchId: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  bettingSite: string;
  reasoning?: string;
  createdAt: string;
  settledAt?: string;
}

interface BetContextType {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  updateBet: (id: string, updates: Partial<Bet>) => void;
  refreshBets: () => Promise<void>;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export function BetProvider({ children }: { children: React.ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);

  const refreshBets = useCallback(async () => {
    try {
      const response = await fetch('/api/bets');
      if (!response.ok) throw new Error('Failed to fetch bets');
      const data = await response.json();
      setBets(data);
    } catch (error) {
      console.error('Error refreshing bets:', error);
    }
  }, []);

  const addBet = useCallback((bet: Bet) => {
    setBets(prev => [bet, ...prev]);
  }, []);

  const updateBet = useCallback((id: string, updates: Partial<Bet>) => {
    setBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, ...updates } : bet
    ));
  }, []);

  return (
    <BetContext.Provider value={{ bets, addBet, updateBet, refreshBets }}>
      {children}
    </BetContext.Provider>
  );
}

export function useBets() {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBets must be used within a BetProvider');
  }
  return context;
}