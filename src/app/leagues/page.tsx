'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useLeagues,
  useLeagueStats,
  useLeaguePerformance,
  useLeagueMatches,
  useLeaguePredictions,
  useLeagueTeams,
  prefetchLeagueData,
} from '@/lib/query/leagues';
import { LeagueFilter } from '@/components/leagues/league-filter';
import { LeagueStatsCard } from '@/components/leagues/league-stats-card';
import { LeaguePerformanceChart } from '@/components/leagues/league-performance-chart';
import { LeagueMatchesTable } from '@/components/leagues/league-matches-table';
import { LeaguePredictionsTable } from '@/components/leagues/league-predictions-table';
import { LeaguePredictionsSummary } from '@/components/leagues/league-predictions-summary';
import { LeagueTeamsGrid } from '@/components/leagues/league-teams-grid';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from '@/types/common';

export default function LeaguesPage() {
  const [selectedLeague, setSelectedLeague] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [activeTab, setActiveTab] = useState('matches');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leagues
  const { 
    data: leagues,
    isLoading: isLoadingLeagues,
    error: leaguesError
  } = useLeagues();

  // League data queries
  const { 
    data: stats,
    isLoading: isLoadingStats,
  } = useLeagueStats(selectedLeague, { dateRange });

  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
  } = useLeaguePerformance(selectedLeague, { dateRange });

  const {
    data: matches,
    isLoading: isLoadingMatches,
  } = useLeagueMatches(selectedLeague, { 
    dateRange,
    enabled: activeTab === 'matches'
  });

  const {
    data: predictionsData,
    isLoading: isLoadingPredictions,
  } = useLeaguePredictions(selectedLeague, {
    dateRange,
    page,
    limit: 10,
    enabled: activeTab === 'predictions'
  });

  const {
    data: teams,
    isLoading: isLoadingTeams,
  } = useLeagueTeams(selectedLeague, {
    dateRange,
    enabled: activeTab === 'teams'
  });

  // Handle league selection
  const handleLeagueChange = async (leagueId: string) => {
    setSelectedLeague(leagueId);
    // Prefetch data for the selected league
    try {
      await prefetchLeagueData(queryClient, leagueId, { dateRange });
    } catch (error) {
      console.error('Failed to prefetch league data:', error);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'predictions') {
      setPage(1);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Check for loading states
  const isLoading = isLoadingLeagues || isLoadingStats || isLoadingPerformance ||
    (activeTab === 'matches' && isLoadingMatches) ||
    (activeTab === 'predictions' && isLoadingPredictions) ||
    (activeTab === 'teams' && isLoadingTeams);

  // Handle errors
  if (leaguesError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load leagues. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  const selectedLeagueData = leagues?.find(l => l.id === selectedLeague);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">League Analysis</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <LeagueFilter
            leagues={leagues || []}
            selectedLeague={selectedLeague}
            onLeagueChange={handleLeagueChange}
          />
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-96" />
        </div>
      ) : selectedLeagueData && stats ? (
        <>
          <LeaguePredictionsSummary stats={stats} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <LeagueStatsCard
              stats={stats}
              leagueName={selectedLeagueData.name}
            />
            <LeaguePerformanceChart
              data={performanceData || []}
              leagueName={selectedLeagueData.name}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="matches">
              <Card className="p-4">
                <LeagueMatchesTable matches={matches || []} />
              </Card>
            </TabsContent>
            <TabsContent value="predictions">
              <Card className="p-4">
                <LeaguePredictionsTable predictions={predictionsData?.predictions || []} />
                {predictionsData && predictionsData.pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={page}
                      totalPages={predictionsData.pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </Card>
            </TabsContent>
            <TabsContent value="teams">
              <Card className="p-4">
                <LeagueTeamsGrid teams={teams || []} />
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}