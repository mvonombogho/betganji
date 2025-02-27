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
