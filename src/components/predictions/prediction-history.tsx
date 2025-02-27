"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronRight, Info, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Prediction } from '@/types/prediction';
import { Match } from '@/types/match';
import Link from 'next/link';

interface PredictionHistoryProps {
  predictions: Array<Prediction & { match: Match }>;
  isLoading?: boolean;
  className?: string;
}

type PredictionOutcome = 'CORRECT' | 'INCORRECT' | 'PENDING';
type FilterOption = 'all' | 'correct' | 'incorrect' | 'pending';
type SortOption = 'newest' | 'oldest' | 'confidence' | 'league';

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ 
  predictions,
  isLoading,
  className = ""
}) => {
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [activeTab, setActiveTab] = useState<'all' | 'summary'>('all');

  // Calculate prediction outcome
  const getPredictionOutcome = (prediction: Prediction, match: Match): PredictionOutcome => {
    if (match.status !== 'FINISHED' || !match.score) return 'PENDING';

    const predictedWinner = prediction.result.home > prediction.result.away ? 'HOME' :
                          prediction.result.home < prediction.result.away ? 'AWAY' : 'DRAW';

    const actualWinner = match.score.home > match.score.away ? 'HOME' :
                        match.score.home < match.score.away ? 'AWAY' : 'DRAW';

    return predictedWinner === actualWinner ? 'CORRECT' : 'INCORRECT';
  };

  // Prepare prediction data with outcomes
  const predictionsWithOutcome = useMemo(() => {
    return predictions.map(prediction => ({
      ...prediction,
      outcome: getPredictionOutcome(prediction, prediction.match)
    }));
  }, [predictions]);

  // Filter and sort predictions
  const filteredPredictions = useMemo(() => {
    // Apply filters
    let filtered = [...predictionsWithOutcome];
    
    if (filterOption !== 'all') {
      filtered = filtered.filter(p => p.outcome.toLowerCase() === filterOption);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'confidence':
          return b.confidence - a.confidence;
        case 'league':
          return a.match.competition.name.localeCompare(b.match.competition.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [predictionsWithOutcome, filterOption, sortOption]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = predictionsWithOutcome.length;
    const correct = predictionsWithOutcome.filter(p => p.outcome === 'CORRECT').length;
    const incorrect = predictionsWithOutcome.filter(p => p.outcome === 'INCORRECT').length;
    const pending = predictionsWithOutcome.filter(p => p.outcome === 'PENDING').length;
    
    const accuracy = total - pending > 0 
      ? Math.round((correct / (correct + incorrect)) * 100) 
      : 0;
    
    return { total, correct, incorrect, pending, accuracy };
  }, [predictionsWithOutcome]);

  // Loading state UI
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state UI
  if (predictions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
          <CardDescription>No predictions made yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Start making predictions to see your history and track performance
            </p>
            <Link href="/matches">
              <Button>Find Matches to Predict</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main component UI
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Prediction History</CardTitle>
        <CardDescription>
          {summaryStats.total} predictions • {summaryStats.accuracy}% accuracy rate
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'summary')}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All Predictions</TabsTrigger>
            <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="pt-2">
          <div className="px-6 mb-4 flex flex-col sm:flex-row gap-2">
            <Select value={filterOption} onValueChange={(value) => setFilterOption(value as FilterOption)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Predictions</SelectItem>
                <SelectItem value="correct">Correct</SelectItem>
                <SelectItem value="incorrect">Incorrect</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="confidence">Highest Confidence</SelectItem>
                <SelectItem value="league">League</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CardContent>
            <div className="space-y-4">
              {filteredPredictions.map((prediction) => (
                <Link key={prediction.id} href={`/matches/${prediction.matchId}`}>
                  <div className="border p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={prediction.outcome === 'CORRECT' ? 'success' : 
                                prediction.outcome === 'INCORRECT' ? 'destructive' : 'outline'}
                        className="flex gap-1 items-center"
                      >
                        {prediction.outcome === 'CORRECT' && <CheckCircle size={14} />}
                        {prediction.outcome === 'INCORRECT' && <XCircle size={14} />}
                        {prediction.outcome === 'PENDING' && <Clock size={14} />}
                        {prediction.outcome}
                      </Badge>
                    </div>

                    <h4 className="font-medium mb-1 pr-24">
                      {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {new Date(prediction.match.datetime).toLocaleDateString()} • {prediction.match.competition.name}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Predicted</p>
                        <p className="text-lg">
                          {prediction.result.home} - {prediction.result.away}
                        </p>
                      </div>
                      
                      {prediction.match.score && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Actual</p>
                          <p className="text-lg">
                            {prediction.match.score.home} - {prediction.match.score.away}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-blue-50">
                        {prediction.confidence}% Confidence
                      </Badge>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="summary">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-medium text-green-800 mb-1">Correct</h3>
                <p className="text-3xl font-bold text-green-700">{summaryStats.correct}</p>
                <p className="text-sm text-green-600 mt-1">
                  {summaryStats.correct > 0 
                    ? `${Math.round((summaryStats.correct / summaryStats.total) * 100)}% of all predictions` 
                    : 'No correct predictions yet'}
                </p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="text-lg font-medium text-red-800 mb-1">Incorrect</h3>
                <p className="text-3xl font-bold text-red-700">{summaryStats.incorrect}</p>
                <p className="text-sm text-red-600 mt-1">
                  {summaryStats.incorrect > 0 
                    ? `${Math.round((summaryStats.incorrect / summaryStats.total) * 100)}% of all predictions` 
                    : 'No incorrect predictions yet'}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-1">Pending</h3>
                <p className="text-3xl font-bold text-blue-700">{summaryStats.pending}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {summaryStats.pending > 0 
                    ? `${Math.round((summaryStats.pending / summaryStats.total) * 100)}% of all predictions` 
                    : 'No pending predictions'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border mb-6">
              <h3 className="text-lg font-medium mb-3">Accuracy Trend</h3>
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-500">
                  Accuracy visualization will be implemented in the next update
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-lg font-medium mb-3">Competition Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(
                  predictionsWithOutcome.reduce((acc, prediction) => {
                    const league = prediction.match.competition.name;
                    if (!acc[league]) {
                      acc[league] = { total: 0, correct: 0, incorrect: 0, pending: 0 };
                    }
                    
                    acc[league].total += 1;
                    if (prediction.outcome === 'CORRECT') acc[league].correct += 1;
                    if (prediction.outcome === 'INCORRECT') acc[league].incorrect += 1;
                    if (prediction.outcome === 'PENDING') acc[league].pending += 1;
                    
                    return acc;
                  }, {} as Record<string, { total: number; correct: number; incorrect: number; pending: number }>)
                ).map(([league, stats]) => (
                  <div key={league} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="font-medium">{league}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {stats.correct}
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {stats.incorrect}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {stats.pending}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PredictionHistory;
