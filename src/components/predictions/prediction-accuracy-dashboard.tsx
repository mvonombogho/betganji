"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Prediction } from '@/types/prediction';
import { Match } from '@/types/match';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionAccuracyDashboardProps {
  predictions: Array<Prediction & { match: Match }>;
  className?: string;
}

export function PredictionAccuracyDashboard({ 
  predictions,
  className = ""
}: PredictionAccuracyDashboardProps) {
  // Calculate accuracy stats
  const stats = useMemo(() => {
    // Only include finished matches with scores
    const finishedPredictions = predictions.filter(
      p => p.match.status === 'FINISHED' && p.match.score
    );

    // Calculate correct predictions using the same logic as before
    const correctPredictions = finishedPredictions.filter(p => {
      if (!p.match.score) return false;
      
      const predictedWinner = p.result.home > p.result.away ? 'HOME' :
                             p.result.home < p.result.away ? 'AWAY' : 'DRAW';
                             
      const actualWinner = p.match.score.home > p.match.score.away ? 'HOME' :
                          p.match.score.home < p.match.score.away ? 'AWAY' : 'DRAW';
                          
      return predictedWinner === actualWinner;
    });

    // Group predictions by confidence level
    const confidenceBuckets = {
      '90-100': { total: 0, correct: 0 },
      '80-89': { total: 0, correct: 0 },
      '70-79': { total: 0, correct: 0 },
      '60-69': { total: 0, correct: 0 },
      '50-59': { total: 0, correct: 0 },
      'below-50': { total: 0, correct: 0 },
    };

    finishedPredictions.forEach(p => {
      const isCorrect = correctPredictions.includes(p);
      const confidence = p.confidence;
      
      if (confidence >= 90) {
        confidenceBuckets['90-100'].total++;
        if (isCorrect) confidenceBuckets['90-100'].correct++;
      } else if (confidence >= 80) {
        confidenceBuckets['80-89'].total++;
        if (isCorrect) confidenceBuckets['80-89'].correct++;
      } else if (confidence >= 70) {
        confidenceBuckets['70-79'].total++;
        if (isCorrect) confidenceBuckets['70-79'].correct++;
      } else if (confidence >= 60) {
        confidenceBuckets['60-69'].total++;
        if (isCorrect) confidenceBuckets['60-69'].correct++;
      } else if (confidence >= 50) {
        confidenceBuckets['50-59'].total++;
        if (isCorrect) confidenceBuckets['50-59'].correct++;
      } else {
        confidenceBuckets['below-50'].total++;
        if (isCorrect) confidenceBuckets['below-50'].correct++;
      }
    });

    // Group predictions by league/competition
    const leagueStats = finishedPredictions.reduce((acc, p) => {
      const leagueName = p.match.competition.name;
      const isCorrect = correctPredictions.includes(p);
      
      if (!acc[leagueName]) {
        acc[leagueName] = { total: 0, correct: 0 };
      }
      
      acc[leagueName].total++;
      if (isCorrect) acc[leagueName].correct++;
      
      return acc;
    }, {} as Record<string, { total: number; correct: number }>);

    // Prepare data for charts
    const confidenceChartData = Object.entries(confidenceBuckets).map(([range, data]) => ({
      range,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
    })).filter(item => item.total > 0);

    const leagueChartData = Object.entries(leagueStats).map(([league, data]) => ({
      league,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
    })).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

    // Calculate totals
    const total = finishedPredictions.length;
    const correct = correctPredictions.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      total,
      correct,
      accuracy,
      confidenceChartData,
      leagueChartData,
    };
  }, [predictions]);

  // Return empty state if no finished predictions
  if (stats.total === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Prediction Accuracy</CardTitle>
          <CardDescription>
            Track the performance of DeepSeek R1 predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            No finished matches with predictions yet. Check back after your predictions have been settled.
          </p>
        </CardContent>
      </Card>
    );
  }
