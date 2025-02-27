"use client";

import React, { useState } from 'react';
import { useData } from '@/contexts/data-context';
import { PredictionAccuracyDashboard } from '@/components/predictions/prediction-accuracy-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function AccuracyDashboardPage() {
  const { 
    predictions, 
    loading, 
    error, 
    refreshPredictions, 
    refreshing,
    lastRefresh
  } = useData();
  
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  // Filter predictions based on date range if set
  const filteredPredictions = React.useMemo(() => {
    if (!dateRange.from && !dateRange.to) return predictions;
    
    return predictions.filter(prediction => {
      const predictionDate = new Date(prediction.createdAt);
      
      if (dateRange.from && dateRange.to) {
        return predictionDate >= dateRange.from && predictionDate <= dateRange.to;
      }
      
      if (dateRange.from) {
        return predictionDate >= dateRange.from;
      }
      
      if (dateRange.to) {
        return predictionDate <= dateRange.to;
      }
      
      return true;
    });
  }, [predictions, dateRange]);

  const handleRefresh = async () => {
    try {
      await refreshPredictions();
    } catch (error) {
      console.error('Error refreshing prediction data:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Prediction Accuracy</h1>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Prediction Accuracy</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error Loading Prediction Data
            </CardTitle>
            <CardDescription>
              There was an error loading the prediction data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Prediction Accuracy</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <CalendarDateRangePicker 
            date={dateRange} 
            onDateChange={setDateRange}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lastRefresh && (
          <div className="flex justify-end items-center">
            <Badge variant="outline" className="text-xs">
              Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}
            </Badge>
          </div>
        )}
        
        <PredictionAccuracyDashboard predictions={filteredPredictions} />
        
        <Card>
          <CardHeader>
            <CardTitle>About AI Prediction Accuracy</CardTitle>
            <CardDescription>Understanding prediction accuracy metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This dashboard displays the accuracy of predictions made by our DeepSeek R1 AI model.
              The model analyzes various factors including team form, head-to-head records, and current odds
              to generate match predictions.
            </p>
            
            <h3 className="font-medium text-lg">How Accuracy is Calculated</h3>
            <p>
              A prediction is considered accurate if the model correctly predicts the match outcome
              (home win, away win, or draw). The accuracy percentage represents the number of correct
              predictions divided by the total number of predictions for completed matches.
            </p>
            
            <h3 className="font-medium text-lg">Understanding Confidence Levels</h3>
            <p>
              The confidence level represents the model's certainty in its prediction.
              Ideally, higher confidence levels should correlate with higher accuracy rates.
              This correlation indicates the model is well-calibrated.
            </p>
            
            <h3 className="font-medium text-lg">Competition Analysis</h3>
            <p>
              Different competitions may show varying levels of predictability.
              The competition analysis helps identify which leagues or tournaments 
              the AI model predicts most accurately.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}