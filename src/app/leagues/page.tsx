'use client';

import { useEffect, useState } from 'react';
import { LeagueFilter } from '@/components/leagues/league-filter';
import { LeagueStatsCard } from '@/components/leagues/league-stats-card';
import { LeaguePerformanceChart } from '@/components/leagues/league-performance-chart';
import { LeagueMatchesTable } from '@/components/leagues/league-matches-table';
import { LeaguePredictionsTable } from '@/components/leagues/league-predictions-table';
import { LeaguePredictionsSummary } from '@/components/leagues/league-predictions-summary';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Pagination } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface League {
  id: string;
  name: string;
  country: string;
  _count: {
    matches: number;
    teams: number;
  };
}

interface DateRange {
  from: Date;
  to: Date;
}

interface PaginationState {
  page: number;
  totalPages: number;
  total: number;
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [stats, setStats] = useState<any>();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchLeagueData();
    }
  }, [selectedLeague, dateRange, pagination.page]);

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues');
      if (!response.ok) throw new Error('Failed to fetch leagues');
      const data = await response.json();
      setLeagues(data);
      if (data.length > 0) {
        setSelectedLeague(data[0].id);
      }
    } catch (err) {
      setError('Failed to load leagues');
      toast({
        title: 'Error',
        description: 'Failed to load leagues. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeagueData = async () => {
    setIsLoading(true);
    try {
      const dateParams = dateRange 
        ? `&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}` 
        : '';

      // Fetch all data in parallel
      const [statsRes, performanceRes, matchesRes, predictionsRes] = await Promise.all([
        fetch(`/api/leagues/${selectedLeague}/stats${dateParams}`),
        fetch(`/api/leagues/${selectedLeague}/performance${dateParams}`),
        fetch(`/api/leagues/${selectedLeague}/matches${dateParams}`),
        fetch(`/api/leagues/${selectedLeague}/predictions?page=${pagination.page}&limit=10${dateParams}`)
      ]);

      if (!statsRes.ok || !performanceRes.ok || !matchesRes.ok || !predictionsRes.ok) {
        throw new Error('Failed to fetch league data');
      }

      const [statsData, performanceData, matchesData, predictionsData] = await Promise.all([
        statsRes.json(),
        performanceRes.json(),
        matchesRes.json(),
        predictionsRes.json()
      ]);

      setStats(statsData);
      setPerformanceData(performanceData);
      setMatches(matchesData);
      setPredictions(predictionsData.predictions);
      setPagination({
        page: predictionsData.pagination.page,
        totalPages: predictionsData.pagination.totalPages,
        total: predictionsData.pagination.total
      });
      setError(undefined);
    } catch (err) {
      setError('Failed to load league data');
      toast({
        title: 'Error',
        description: 'Failed to load league data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const selectedLeagueData = leagues.find(l => l.id === selectedLeague);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">League Analysis</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <LeagueFilter
            leagues={leagues}
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
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
              data={performanceData}
              leagueName={selectedLeagueData.name}
            />
          </div>
          
          <Tabs defaultValue="matches" className="w-full">
            <TabsList>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="matches">
              <Card className="p-4">
                <LeagueMatchesTable matches={matches} />
              </Card>
            </TabsContent>
            <TabsContent value="predictions">
              <Card className="p-4">
                <LeaguePredictionsTable predictions={predictions} />
                <div className="mt-4">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="teams">
              <Card className="p-4">
                {/* Will implement teams grid in next iteration */}
                <p>Coming soon...</p>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}