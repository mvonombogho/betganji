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
