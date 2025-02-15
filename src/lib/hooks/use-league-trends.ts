import { useQuery } from '@tanstack/react-query';
import { TrendAnalysisService } from '@/lib/data/services/trend-analysis.service';

export function useLeagueTrends(leagueId: string, seasonId: string, months: number = 6) {
  const trendService = new TrendAnalysisService(leagueId, seasonId);

  const { data: goalsTrend, isLoading: isGoalsLoading, error: goalsError } = useQuery({
    queryKey: ['league-goals-trend', leagueId, seasonId, months],
    queryFn: () => trendService.getGoalsTrend(months),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  const { data: resultsDistribution, isLoading: isResultsLoading, error: resultsError } = useQuery({
    queryKey: ['league-results-distribution', leagueId, seasonId],
    queryFn: () => trendService.getResultsDistribution(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: monthlyPerformance, isLoading: isMonthlyLoading, error: monthlyError } = useQuery({
    queryKey: ['league-monthly-performance', leagueId, seasonId, months],
    queryFn: () => trendService.getMonthlyPerformance(months),
    staleTime: 5 * 60 * 1000,
  });

  const { data: performanceMetrics, isLoading: isMetricsLoading, error: metricsError } = useQuery({
    queryKey: ['league-performance-metrics', leagueId, seasonId],
    queryFn: () => trendService.getLeaguePerformanceMetrics(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: {
      goalsTrend,
      resultsDistribution,
      monthlyPerformance,
      performanceMetrics,
    },
    isLoading: {
      goals: isGoalsLoading,
      results: isResultsLoading,
      monthly: isMonthlyLoading,
      metrics: isMetricsLoading,
    },
    error: {
      goals: goalsError,
      results: resultsError,
      monthly: monthlyError,
      metrics: metricsError,
    },
    isError: !!(goalsError || resultsError || monthlyError || metricsError),
    isLoading: isGoalsLoading || isResultsLoading || isMonthlyLoading || isMetricsLoading,
  };
}