import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DateRange } from '@/types/common';

interface QueryOptions {
  dateRange?: DateRange;
  page?: number;
  limit?: number;
}

// League Queries
export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: async () => {
      const response = await fetch('/api/leagues');
      if (!response.ok) throw new Error('Failed to fetch leagues');
      return response.json();
    },
  });
}

export function useLeagueStats(leagueId: string | undefined, options?: QueryOptions) {
  return useQuery({
    queryKey: ['league', leagueId, 'stats', options?.dateRange],
    queryFn: async () => {
      if (!leagueId) return null;
      const dateParams = options?.dateRange
        ? `?from=${options.dateRange.from.toISOString()}&to=${options.dateRange.to.toISOString()}`
        : '';
      const response = await fetch(`/api/leagues/${leagueId}/stats${dateParams}`);
      if (!response.ok) throw new Error('Failed to fetch league stats');
      return response.json();
    },
    enabled: !!leagueId,
  });
}

export function useLeaguePerformance(leagueId: string | undefined, options?: QueryOptions) {
  return useQuery({
    queryKey: ['league', leagueId, 'performance', options?.dateRange],
    queryFn: async () => {
      if (!leagueId) return null;
      const dateParams = options?.dateRange
        ? `?from=${options.dateRange.from.toISOString()}&to=${options.dateRange.to.toISOString()}`
        : '';
      const response = await fetch(`/api/leagues/${leagueId}/performance${dateParams}`);
      if (!response.ok) throw new Error('Failed to fetch league performance');
      return response.json();
    },
    enabled: !!leagueId,
  });
}

export function useLeagueMatches(leagueId: string | undefined, options?: QueryOptions) {
  return useQuery({
    queryKey: ['league', leagueId, 'matches', options?.dateRange],
    queryFn: async () => {
      if (!leagueId) return null;
      const dateParams = options?.dateRange
        ? `?from=${options.dateRange.from.toISOString()}&to=${options.dateRange.to.toISOString()}`
        : '';
      const response = await fetch(`/api/leagues/${leagueId}/matches${dateParams}`);
      if (!response.ok) throw new Error('Failed to fetch league matches');
      return response.json();
    },
    enabled: !!leagueId,
  });
}

export function useLeaguePredictions(leagueId: string | undefined, options?: QueryOptions) {
  return useQuery({
    queryKey: ['league', leagueId, 'predictions', options?.dateRange, options?.page],
    queryFn: async () => {
      if (!leagueId) return null;
      const params = new URLSearchParams();
      if (options?.dateRange) {
        params.set('from', options.dateRange.from.toISOString());
        params.set('to', options.dateRange.to.toISOString());
      }
      if (options?.page) params.set('page', options.page.toString());
      if (options?.limit) params.set('limit', options.limit.toString());
      
      const response = await fetch(`/api/leagues/${leagueId}/predictions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch league predictions');
      return response.json();
    },
    enabled: !!leagueId,
    keepPreviousData: true,
  });
}

export function useLeagueTeams(leagueId: string | undefined, options?: QueryOptions) {
  return useQuery({
    queryKey: ['league', leagueId, 'teams', options?.dateRange],
    queryFn: async () => {
      if (!leagueId) return null;
      const dateParams = options?.dateRange
        ? `?from=${options.dateRange.from.toISOString()}&to=${options.dateRange.to.toISOString()}`
        : '';
      const response = await fetch(`/api/leagues/${leagueId}/teams${dateParams}`);
      if (!response.ok) throw new Error('Failed to fetch league teams');
      return response.json();
    },
    enabled: !!leagueId,
  });
}

// Prefetching utilities
export function prefetchLeagueData(
  queryClient: ReturnType<typeof useQueryClient>,
  leagueId: string,
  options?: QueryOptions
) {
  const dateParams = options?.dateRange
    ? `?from=${options.dateRange.from.toISOString()}&to=${options.dateRange.to.toISOString()}`
    : '';

  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['league', leagueId, 'stats', options?.dateRange],
      queryFn: () => fetch(`/api/leagues/${leagueId}/stats${dateParams}`).then(res => res.json()),
    }),
    queryClient.prefetchQuery({
      queryKey: ['league', leagueId, 'performance', options?.dateRange],
      queryFn: () => fetch(`/api/leagues/${leagueId}/performance${dateParams}`).then(res => res.json()),
    }),
    queryClient.prefetchQuery({
      queryKey: ['league', leagueId, 'matches', options?.dateRange],
      queryFn: () => fetch(`/api/leagues/${leagueId}/matches${dateParams}`).then(res => res.json()),
    }),
  ]);
}