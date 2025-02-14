import prisma from '@/lib/db';
import { getHours, format } from 'date-fns';

export async function getPerformancePatterns(userId: string) {
  const bets = await prisma.bet.findMany({
    where: {
      userId
    },
    include: {
      prediction: true
    }
  });

  return {
    byTime: analyzeTimePatterns(bets),
    byDay: analyzeDayPatterns(bets),
    byOddsRange: analyzeOddsPatterns(bets),
    byStake: analyzeStakePatterns(bets)
  };
}

function analyzeTimePatterns(bets: any[]) {
  const hourlyData = new Map();

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyData.set(i, { total: 0, won: 0 });
  }

  bets.forEach(bet => {
    const hour = getHours(bet.createdAt);
    const data = hourlyData.get(hour);
    data.total++;
    if (bet.status === 'WON') data.won++;
  });

  return Array.from(hourlyData.entries()).map(([hour, data]) => ({
    hour,
    winRate: data.total > 0 ? (data.won / data.total) * 100 : 0,
    totalBets: data.total
  }));
}

function analyzeDayPatterns(bets: any[]) {
  const dayData = new Map([
    ['Monday', { total: 0, won: 0 }],
    ['Tuesday', { total: 0, won: 0 }],
    ['Wednesday', { total: 0, won: 0 }],
    ['Thursday', { total: 0, won: 0 }],
    ['Friday', { total: 0, won: 0 }],
    ['Saturday', { total: 0, won: 0 }],
    ['Sunday', { total: 0, won: 0 }]
  ]);

  bets.forEach(bet => {
    const day = format(bet.createdAt, 'EEEE');
    const data = dayData.get(day);
    if (data) {
      data.total++;
      if (bet.status === 'WON') data.won++;
    }
  });

  return Array.from(dayData.entries()).map(([day, data]) => ({
    day,
    winRate: data.total > 0 ? (data.won / data.total) * 100 : 0,
    totalBets: data.total
  }));
}

function analyzeOddsPatterns(bets: any[]) {
  const oddsRanges = new Map();

  bets.forEach(bet => {
    const range = Math.floor(bet.odds);
    const key = `${range.toFixed(1)}-${(range + 0.9).toFixed(1)}`;
    
    if (!oddsRanges.has(key)) {
      oddsRanges.set(key, { total: 0, won: 0 });
    }
    
    const data = oddsRanges.get(key);
    data.total++;
    if (bet.status === 'WON') data.won++;
  });

  return Array.from(oddsRanges.entries())
    .map(([range, data]) => ({
      range,
      winRate: data.total > 0 ? (data.won / data.total) * 100 : 0,
      totalBets: data.total
    }))
    .sort((a, b) => {
      const aMin = parseFloat(a.range.split('-')[0]);
      const bMin = parseFloat(b.range.split('-')[0]);
      return aMin - bMin;
    });
}

function analyzeStakePatterns(bets: any[]) {
  const stakeRanges = new Map();
  const maxStake = Math.max(...bets.map(bet => bet.stake));
  const rangeSize = maxStake / 5; // Divide into 5 ranges

  bets.forEach(bet => {
    const rangeIndex = Math.floor(bet.stake / rangeSize);
    const key = `${(rangeIndex * rangeSize).toFixed(0)}-${((rangeIndex + 1) * rangeSize).toFixed(0)}`;
    
    if (!stakeRanges.has(key)) {
      stakeRanges.set(key, { total: 0, won: 0, profit: 0, investment: 0 });
    }
    
    const data = stakeRanges.get(key);
    data.total++;
    data.investment += bet.stake;
    if (bet.status === 'WON') {
      data.won++;
      data.profit += bet.potentialReturn - bet.stake;
    } else {
      data.profit -= bet.stake;
    }
  });

  return Array.from(stakeRanges.entries())
    .map(([range, data]) => ({
      range,
      winRate: data.total > 0 ? (data.won / data.total) * 100 : 0,
      totalBets: data.total,
      roi: data.investment > 0 ? (data.profit / data.investment) * 100 : 0
    }))
    .sort((a, b) => {
      const aMin = parseFloat(a.range.split('-')[0]);
      const bMin = parseFloat(b.range.split('-')[0]);
      return aMin - bMin;
    });
}