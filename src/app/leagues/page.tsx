'use client';

import { useEffect, useState } from 'react';
import { LeagueFilter } from '@/components/leagues/league-filter';
import { LeagueStatsCard } from '@/components/leagues/league-stats-card';
import { LeaguePerformanceChart } from '@/components/leagues/league-performance-chart';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface League {
  id: string;
  name: string;
  country: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [stats, setStats] = useState<any>();
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchLeagueData();
    }
  }, [selectedLeague, dateRange]);

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues');
      const data = await response.json();
      setLeagues(data);
      if (data.length > 0) {
        setSelectedLeague(data[0].id);
      }
    } catch (err) {
      setError('Failed to load leagues');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeagueData = async () => {
    setIsLoading(true);
    try {
      // Fetch league stats
      const statsResponse = await fetch(`/api/leagues/${selectedLeague}/stats${dateRange ? 
        `?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}` : ''}`);
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch performance data
      const performanceResponse = await fetch(`/api/leagues/${selectedLeague}/performance${dateRange ? 
        `?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}` : ''}`);
      const performanceData = await performanceResponse.json();
      setPerformanceData(performanceData);
    } catch (err) {
      setError('Failed to load league data');
    } finally {
      setIsLoading(false);
    }
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
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : selectedLeagueData && stats ? (
        <>
          <LeagueStatsCard
            stats={stats}
            leagueName={selectedLeagueData.name}
          />
          <LeaguePerformanceChart
            data={performanceData}
            leagueName={selectedLeagueData.name}
          />
          
          <Tabs defaultValue="matches">
            <TabsList>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            <TabsContent value="matches">
              <Card className="p-4">
                {/* Match table component will go here */}
              </Card>
            </TabsContent>
            <TabsContent value="predictions">
              <Card className="p-4">
                {/* Predictions table component will go here */}
              </Card>
            </TabsContent>
            <TabsContent value="teams">
              <Card className="p-4">
                {/* Teams grid component will go here */}
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}