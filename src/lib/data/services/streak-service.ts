import prisma from '@/lib/db';
import { format } from 'date-fns';

export async function getStreakAnalysis(userId: string) {
  const bets = await prisma.bet.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      prediction: true
    }
  });

  // Calculate current streak
  let currentStreak = { type: 'win', count: 0 };
  for (const bet of bets) {
    if (bet.status === 'WON') {
      if (currentStreak.type === 'win') {
        currentStreak.count++;
      } else {
        break;
      }
    } else {
      if (currentStreak.type === 'loss') {
        currentStreak.count++;
      } else {
        currentStreak = { type: 'loss', count: 1 };
      }
    }
  }

  // Calculate longest streaks
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;

  bets.forEach(bet => {
    if (bet.status === 'WON') {
      currentWinStreak++;
      currentLossStreak = 0;
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
    }
  });

  // Get recent results
  const recentResults = bets.slice(0, 10).map(bet => ({
    date: format(bet.createdAt, 'MMM d, yyyy'),
    result: bet.status as 'WON' | 'LOST',
    profit: bet.status === 'WON' ? bet.potentialReturn - bet.stake : -bet.stake,
    odds: bet.odds
  }));

  return {
    currentStreak,
    longestWinStreak,
    longestLossStreak,
    recentResults
  };
}

export async function getWinRateByConditions(userId: string) {
  const bets = await prisma.bet.findMany({
    where: {
      userId
    },
    include: {
      prediction: {
        include: {
          match: true
        }
      }
    }
  });

  // Win rate by odds range
  const oddsBuckets = new Map();
  bets.forEach(bet => {
    const oddsRange = Math.floor(bet.odds);
    if (!oddsBuckets.has(oddsRange)) {
      oddsBuckets.set(oddsRange, { total: 0, won: 0 });
    }
    const bucket = oddsBuckets.get(oddsRange);
    bucket.total++;
    if (bet.status === 'WON') bucket.won++;
  });

  const winRateByOdds = Array.from(oddsBuckets.entries()).map(([range, data]) => ({
    range: `${range.toFixed(1)}-${(range + 0.9).toFixed(1)}`,
    winRate: (data.won / data.total) * 100,
    totalBets: data.total
  }));

  return {
    winRateByOdds
  };
}