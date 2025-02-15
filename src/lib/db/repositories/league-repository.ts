import { prisma } from '@/lib/prisma';
import { QueryBuilder } from '../query-builder';
import { getCachedData, CACHE_KEYS, CACHE_DURATIONS } from '@/lib/cache';
import { DateRange } from '@/types/common';

export class LeagueRepository {
  async getLeagueStats(leagueId: string, userId: string, dateRange?: DateRange) {
    const cacheKey = CACHE_KEYS.LEAGUE_STATS(leagueId);
    
    return getCachedData(
      cacheKey,
      async () => {
        const query = new QueryBuilder()
          .select({
            id: true,
            result: true,
            predictions: {
              where: { userId },
              select: {
                result: true,
                bet: {
                  select: {
                    stake: true,
                    odds: true,
                    profit: true,
                  }
                }
              }
            }
          })
          .where({ leagueId, status: 'FINISHED' })
          .dateRange('datetime', dateRange?.start, dateRange?.end)
          .build();

        return prisma.match.findMany(query);
      },
      CACHE_DURATIONS.LEAGUE_STATS
    );
  }

  async getLeaguePerformance(leagueId: string, dateRange?: DateRange) {
    const cacheKey = CACHE_KEYS.LEAGUE_PERFORMANCE(leagueId);
    
    return getCachedData(
      cacheKey,
      async () => {
        const query = new QueryBuilder()
          .select({
            datetime: true,
            _count: {
              predictions: true
            }
          })
          .where({ leagueId, status: 'FINISHED' })
          .dateRange('datetime', dateRange?.start, dateRange?.end)
          .orderBy('datetime', 'asc')
          .build();

        return prisma.match.groupBy(query);
      },
      CACHE_DURATIONS.LEAGUE_PERFORMANCE
    );
  }

  async getLeagueMatches(leagueId: string, dateRange?: DateRange) {
    const cacheKey = CACHE_KEYS.LEAGUE_MATCHES(leagueId);
    
    return getCachedData(
      cacheKey,
      async () => {
        const query = new QueryBuilder()
          .select({
            id: true,
            datetime: true,
            status: true,
            result: true,
            homeScore: true,
            awayScore: true,
            homeTeam: {
              select: {
                id: true,
                name: true
              }
            },
            awayTeam: {
              select: {
                id: true,
                name: true
              }
            },
            predictions: {
              select: {
                result: true,
                confidence: true
              }
            },
            odds: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          })
          .where({ leagueId })
          .dateRange('datetime', dateRange?.start, dateRange?.end)
          .orderBy('datetime', 'desc')
          .build();

        return prisma.match.findMany(query);
      },
      CACHE_DURATIONS.LEAGUE_MATCHES
    );
  }

  async getLeaguePredictions(
    leagueId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
    dateRange?: DateRange
  ) {
    const query = new QueryBuilder()
      .where({
        userId,
        match: {
          leagueId,
          datetime: dateRange ? {
            gte: dateRange.start,
            lte: dateRange.end
          } : undefined
        }
      })
      .select({
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
              select: { name: true }
            },
            awayTeam: {
              select: { name: true }
            }
          }
        },
        bet: {
          select: {
            stake: true,
            odds: true,
            profit: true
          }
        }
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
      .build();

    const [predictions, total] = await Promise.all([
      prisma.prediction.findMany(query),
      prisma.prediction.count({ where: query.where })
    ]);

    return {
      predictions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}