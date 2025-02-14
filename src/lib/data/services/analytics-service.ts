import prisma from '@/lib/db';
import { startOfDay, endOfDay, format } from 'date-fns';

export async function getROIAnalysis(userId: string, startDate: Date, endDate: Date) {
  const bets = await prisma.bet.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate)
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      prediction: true
    }
  });

  const investment = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const returns = bets.reduce((sum, bet) => sum + (bet.status === 'WON' ? bet.potentialReturn : 0), 0);
  const wonBets = bets.filter(bet => bet.status === 'WON').length;

  // Calculate daily profits and cumulative ROI
  const profitsByDay = new Map();
  bets.forEach(bet => {
    const date = format(bet.createdAt, 'yyyy-MM-dd');
    const profit = bet.status === 'WON' ? bet.potentialReturn - bet.stake : -bet.stake;
    
    if (!profitsByDay.has(date)) {
      profitsByDay.set(date, { profit: 0, investment: 0 });
    }
    
    const dayData = profitsByDay.get(date);
    dayData.profit += profit;
    dayData.investment += bet.stake;
  });

  let cumulativeInvestment = 0;
  let cumulativeReturns = 0;
  const profitHistory = Array.from(profitsByDay.entries()).map(([date, data]) => {
    cumulativeInvestment += data.investment;
    cumulativeReturns += data.profit;
    const cumulativeROI = ((cumulativeReturns) / cumulativeInvestment) * 100;

    return {
      date,
      profit: data.profit,
      cumulativeROI: Number(cumulativeROI.toFixed(2))
    };
  });

  return {
    investment,
    returns,
    bets: bets.length,
    winRate: (wonBets / bets.length) * 100,
    profitHistory
  };
}

export async function getLeaguePerformance(userId: string, leagueId: string) {
  const bets = await prisma.bet.findMany({
    where: {
      userId,
      prediction: {
        match: {
          competitionId: leagueId
        }
      }
    },
    include: {
      prediction: {
        include: {
          match: true
        }
      }
    }
  });

  return {
    totalBets: bets.length,
    wonBets: bets.filter(bet => bet.status === 'WON').length,
    investment: bets.reduce((sum, bet) => sum + bet.stake, 0),
    returns: bets.reduce((sum, bet) => sum + (bet.status === 'WON' ? bet.potentialReturn : 0), 0)
  };
}