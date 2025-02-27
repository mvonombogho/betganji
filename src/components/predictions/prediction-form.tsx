"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Brain, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Match } from '@/types/match';
import { Odds } from '@/types/odds';
import { PredictionInsights } from '@/types/prediction';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PredictionFormProps {
  match: Match;
  currentOdds?: Odds;
  className?: string;
}

export function PredictionForm({ match, currentOdds, className = "" }: PredictionFormProps) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [notes, setNotes] = useState('');
  const [predictionData, setPredictionData] = useState<PredictionInsights | null>(null);

  const getPrediction = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess(false);
      setPredictionData(null);

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.id,
          odds: currentOdds,
          options: {
            confidenceThreshold: confidenceLevel,
            includeDetailedAnalysis: showDetails,
            notes: notes.trim() || undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get prediction');
      }

      const data = await response.json();
      setPredictionData(data.prediction.insights);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if match is in the past
  const matchDate = new Date(match.datetime);
  const isPastMatch = matchDate < new Date();

  // Check if the match has already started or finished
  const hasStarted = match.status === 'LIVE' || match.status === 'FINISHED';

  if (!currentOdds) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Prediction</CardTitle>
          <CardDescription>Get match insights powered by DeepSeek R1</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle size={24} />
            <p>Cannot generate prediction without odds data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPastMatch || hasStarted) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Prediction</CardTitle>
          <CardDescription>Get match insights powered by DeepSeek R1</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle size={24} />
            <p>
              {isPastMatch 
                ? "Predictions cannot be generated for past matches" 
                : "Predictions cannot be generated for matches that have already started"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain size={20} className="text-purple-500" />
          <span>AI Prediction</span>
        </CardTitle>
        <CardDescription>
          Get match insights powered by DeepSeek R1
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md flex items-start gap-2">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {success && !isLoading && predictionData && (
          <div className="p-3 bg-green-50 text-green-800 rounded-md flex items-start gap-2">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Prediction generated successfully!</p>
              <p className="text-sm mt-1">
                Risk Level: <span className="font-medium">{predictionData.riskLevel}</span> | 
                Confidence: <span className="font-medium">{predictionData.confidenceScore}%</span>
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Confidence Threshold</Label>
              <span className="text-sm text-gray-500">{confidenceLevel}%</span>
            </div>
            <Slider 
              value={[confidenceLevel]} 
              onValueChange={(values) => setConfidenceLevel(values[0])}
              min={50}
              max={90}
              step={5}
            />
            <p className="text-xs text-gray-500">
              Higher thresholds produce more conservative predictions
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="detailed-analysis" 
              checked={showDetails} 
              onCheckedChange={setShowDetails}
            />
            <Label htmlFor="detailed-analysis" className="cursor-pointer">
              Include detailed analysis
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle size={16} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-60 text-xs">
                    Provides in-depth insights including key factors, recommended bets, and detailed reasoning
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Context (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Add any additional information you think might be relevant..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20 resize-none"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={getPrediction}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="mr-2 animate-spin" />
              Analyzing with DeepSeek R1...
            </>
          ) : (
            <>Get AI Prediction</>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Our AI analyzes team performance, historical data, and current odds
        </p>
      </CardFooter>
    </Card>
  );
}
