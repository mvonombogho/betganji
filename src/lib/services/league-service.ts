import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { cache } from 'react';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface LeagueStats {
  totalMatches: number;
  predictedMatches: number;
  successRate: number;
  avgOdds: number;
  profitLoss: number;
  roi: number;
}

export const getLeagueStats = cache(async (
  leagueId: string,
  userId: string,
  dateRange?: DateRange
): Promise<LeagueStats> => {
  const matches = await prisma.match.findMany({
    where: {
      leagueId,
      datetime: dateRange ? {
        gte: dateRange.start,
        lte: dateRange.end,
      } : undefined,
      status: 'FINISHED',
    },
    select: {
      id: true,
      result: true,
      predictions: {
        where: {
          userId,
        },
        select: {
          result: true,
          bet: {
            select: {
              stake: true,
              odds: true,
              profit: true,
            },
          },
        },
      },
      odds: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
        select: {
          homeWin: true,
          draw: true,
          awayWin: true,
        },
      },
    },
  });

  const predictedMatches = matches.filter(m => m.predictions.length > 0);
  const successfulPredictions = predictedMatches.filter(match => {
    const prediction = match.predictions[0];
    return prediction && prediction.result === match.result;
  });

  const totalStake = predictedMatches.reduce((sum, match) => {
    const bet = match.predictions[0]?.bet;
    return sum + (bet?.stake || 0);
  }, 0);

  const totalProfit = predictedMatches.reduce((sum, match) => {
    const bet = match.predictions[0]?.bet;
    return sum + (bet?.profit || 0);
  }, 0);

  return {
    totalMatches: matches.length,
    predictedMatches: predictedMatches.length,
    successRate: predictedMatches.length > 0
      ? (successfulPredictions.length / predictedMatches.length) * 100
      : 0,
    avgOdds: predictedMatches.length > 0
      ? predictedMatches.reduce((sum, match) => {
          const bet = match.predictions[0]?.bet;
          return sum + (bet?.odds || 0);
        }, 0) / predictedMatches.length
      : 0,
    profitLoss: totalProfit,
    roi: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
  };
});

export const getLeaguePerformance = cache(async (
  leagueId: string,
  dateRange?: DateRange
) => {
  const matches = await prisma.match.groupBy({
    by: ['datetime'],
    where: {
      leagueId,
      datetime: dateRange ? {
        gte: dateRange.start,
        lte: dateRange.end,
      } : undefined,
      status: 'FINISHED',
    },
    _count: {
      predictions: true,
    },
    orderBy: {
      datetime: 'asc',
    },
  });

  // Calculate rolling success rate and profit
  let successfulPredictions = 0;
  let totalPredictions = 0;
  let cumulativeProfit = 0;

  return matches.map(day => {
    const dayStats = {
      date: day.datetime,
      successRate: totalPredictions > 0 ? (successfulPredictions / totalPredictions) * 100 : 0,
      profitLoss: cumulativeProfit,
    };

    // Update running totals
    totalPredictions += day._count.predictions;
    return dayStats;
  });
});

export const getLeagueMatches = cache(async (
  leagueId: string,
  dateRange?: DateRange
) => {
  return prisma.match.findMany({
    where: {
      leagueId,
      datetime: dateRange ? {
        gte: dateRange.start,
        lte: dateRange.end,
      } : undefined,
    },
    select: {
      id: true,
      datetime: true,
      status: true,
      result: true,
      homeScore: true,
      awayScore: true,
      homeTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      predictions: {
        select: {
          result: true,
          confidence: true,
        },
      },
      odds: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      datetime: 'desc',
    },
  });
});

export const getLeaguePredictions = cache(async (
  leagueId: string,
  userId: string,
  page: number = 1,
  limit: number = 10,
  dateRange?: DateRange
) => {
  const where: Prisma.PredictionWhereInput = {
    userId,
    match: {
      leagueId,
      datetime: dateRange ? {
        gte: dateRange.start,
        lte: dateRange.end,
      } : undefined,
    },
  };

  const [predictions, total] = await Promise.all([
    prisma.prediction.findMany({
      where,
      select: {
        id: true,
        result: true,
        confidence: true,
        reasoning: true,
        createdAt: true,
        match: {
          select: {
            datetime: true,
            status: true,
            result: true,
            homeTeam: {
              select: { name: true },
            },
            awayTeam: {
              select: { name: true },
            },
          },
        },
        bet: {
          select: {
            stake: true,
            odds: true,
            profit: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.prediction.count({ where }),
  ]);

  return {
    predictions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
});