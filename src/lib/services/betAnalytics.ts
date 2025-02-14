import type { PlacedBet } from '@/types/bet';

export interface BetStats {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  voidBets: number;
  pendingBets: number;
  winRate: number;
  totalStake: number;
  totalReturns: number;
  totalProfit: number;
  roi: number;
}

export interface BookmakerStats {
  name: string;
  bets: number;
  wonBets: number;
  profit: number;
  roi: number;
}

export function calculateBetStats(bets: PlacedBet[]): BetStats {
  const stats = bets.reduce(
    (acc, bet) => {
      acc.totalBets++;
      acc.totalStake += bet.stake;

      switch (bet.status) {
        case 'won':
          acc.wonBets++;
          acc.totalReturns += bet.potentialWin;
          break;
        case 'lost':
          acc.lostBets++;
          break;
        case 'void':
          acc.voidBets++;
          acc.totalReturns += bet.stake;
          break;
        case 'pending':
          acc.pendingBets++;
          break;
      }

      return acc;
    },
    {
      totalBets: 0,
      wonBets: 0,
      lostBets: 0,
      voidBets: 0,
      pendingBets: 0,
      totalStake: 0,
      totalReturns: 0
    }
  );

  const settledBets = stats.totalBets - stats.pendingBets - stats.voidBets;
  const winRate = settledBets > 0 ? (stats.wonBets / settledBets) * 100 : 0;
  const totalProfit = stats.totalReturns - stats.totalStake;
  const roi = stats.totalStake > 0 ? (totalProfit / stats.totalStake) * 100 : 0;

  return {
    ...stats,
    winRate,
    totalProfit,
    roi
  };
}

export function calculateBookmakerStats(bets: PlacedBet[]): BookmakerStats[] {
  const bookmakerMap = new Map<string, BookmakerStats>();

  bets.forEach(bet => {
    const current = bookmakerMap.get(bet.bettingSite) || {
      name: bet.bettingSite,
      bets: 0,
      wonBets: 0,
      profit: 0,
      roi: 0
    };

    current.bets++;
    
    if (bet.status === 'won') {
      current.wonBets++;
      current.profit += bet.potentialWin - bet.stake;
    } else if (bet.status === 'lost') {
      current.profit -= bet.stake;
    }

    current.roi = (current.profit / (current.bets * bet.stake)) * 100;
    
    bookmakerMap.set(bet.bettingSite, current);
  });

  return Array.from(bookmakerMap.values());
}

export function calculateMonthlyPerformance(bets: PlacedBet[]) {
  const monthlyMap = new Map<string, {
    profit: number;
    bets: number;
    wonBets: number;
  }>();

  bets.forEach(bet => {
    const date = new Date(bet.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const current = monthlyMap.get(monthKey) || {
      profit: 0,
      bets: 0,
      wonBets: 0
    };

    current.bets++;
    
    if (bet.status === 'won') {
      current.wonBets++;
      current.profit += bet.potentialWin - bet.stake;
    } else if (bet.status === 'lost') {
      current.profit -= bet.stake;
    }

    monthlyMap.set(monthKey, current);
  });

  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      ...data,
      winRate: (data.wonBets / data.bets) * 100
    }));
}