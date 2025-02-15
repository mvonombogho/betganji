import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeagueModelConfig from '@/components/leagues/league-model-config';
import LeagueComparisonChart from '@/components/leagues/league-comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeagueStatsService } from '@/lib/data/services/league-stats.service';
import { LeaguePredictionEngine } from '@/lib/ai/prediction/league-model';

interface LeagueAnalysisPageProps {
  params: {
    id: string;
  };
}

async function getLeagueData(leagueId: string) {
  const statsService = new LeagueStatsService();
  const predictionEngine = new LeaguePredictionEngine(leagueId, '2023-24');

  await predictionEngine.initialize();

  const [
    leagueStats,
    comparisonData,
    predictionModel
  ] = await Promise.all([
    statsService.getLeaguePerformance(leagueId, '2023-24'),
    statsService.getComparisonData([leagueId]),
    predictionEngine.getModel()
  ]);

  return {
    leagueStats,
    comparisonData,
    predictionModel
  };
}

export default async function LeagueAnalysisPage({ params }: LeagueAnalysisPageProps) {
  const { leagueStats, comparisonData, predictionModel } = await getLeagueData(params.id);

  const handleModelUpdate = async (updatedModel: any) => {
    'use server';
    const engine = new LeaguePredictionEngine(params.id, '2023-24');
    await engine.updateModel(updatedModel);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">League Analysis</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Prediction Model</TabsTrigger>
          <TabsTrigger value="comparison">League Comparison</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {leagueStats.predictionAccuracy.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {predictionModel.totalPredictions} predictions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {leagueStats.averageGoals.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Per match
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Home Win Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(leagueStats.homeWinRatio * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Home team advantage
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <LeagueModelConfig
            model={predictionModel}
            onUpdateModel={handleModelUpdate}
          />
        </TabsContent>

        <TabsContent value="comparison">
          <LeagueComparisonChart data={comparisonData} />
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Goals Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add a line chart for goals trend */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add a pie chart for results distribution */}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add a bar chart for monthly performance */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}