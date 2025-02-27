"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, Share2, Save } from 'lucide-react';
import { Match } from '@/types/match';
import { Odds } from '@/types/odds';
import { Prediction } from '@/types/prediction';
import { PredictionForm } from './prediction-form';
import { PredictionInsightsCard } from './prediction-insights-card';

interface MatchPredictionViewProps {
  match: Match;
  currentOdds?: Odds;
  prediction?: Prediction;
  className?: string;
}

export function MatchPredictionView({ 
  match, 
  currentOdds, 
  prediction,
  className = ""
}: MatchPredictionViewProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'insights'>(prediction?.insights ? 'insights' : 'form');
  const [showFullInsights, setShowFullInsights] = useState(false);

  const isPastMatch = new Date(match.datetime) < new Date();
  const hasStarted = match.status === 'LIVE' || match.status === 'FINISHED';

  const handleSharePrediction = async () => {
    if (!prediction) return;
    
    try {
      const shareData = {
        title: `BetGanji Prediction: ${match.homeTeam.name} vs ${match.awayTeam.name}`,
        text: `Check out my BetGanji AI prediction for ${match.homeTeam.name} vs ${match.awayTeam.name}. Confidence: ${prediction.confidence}%`,
        url: `${window.location.origin}/matches/${match.id}`
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing prediction:', error);
    }
  };

  const toggleFullInsights = () => {
    setShowFullInsights(!showFullInsights);
  };

  // If there's no prediction and the match is past/started, show notice
  if (!prediction && (isPastMatch || hasStarted)) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Match Prediction</CardTitle>
          <CardDescription>AI-powered match insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle size={24} />
            <p>
              {isPastMatch
                ? "No prediction was made for this past match"
                : "No prediction was made before this match started"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If there's a prediction, show insights and actions
  if (prediction?.insights) {
    return (
      <Card className={className}>
        <CardHeader className="pb-0">
          <CardTitle>Match Prediction</CardTitle>
          <CardDescription>
            Generated on {new Date(prediction.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="insights" value={activeTab} onValueChange={(value) => setActiveTab(value as 'form' | 'insights')}>
          <div className="px-6 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
              {!isPastMatch && !hasStarted && (
                <TabsTrigger value="form" className="flex-1">New Prediction</TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="insights" className="pt-4 px-0">
            <div className="px-6 pb-6">
              <div className="flex flex-col-reverse gap-4 md:flex-row">
                <div className="flex-1">
                  <PredictionInsightsCard 
                    insights={prediction.insights} 
                    matchId={match.id}
                    onLoadMore={toggleFullInsights}
                  />
                </div>
                
                <div className="w-full md:w-64 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Predicted Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">{match.homeTeam.name}</p>
                          <p className="text-3xl font-bold">{prediction.result.home}</p>
                        </div>
                        
                        <div className="text-xl font-light text-gray-400">vs</div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-500">{match.awayTeam.name}</p>
                          <p className="text-3xl font-bold">{prediction.result.away}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full flex gap-2"
                      onClick={handleSharePrediction}
                    >
                      <Share2 size={16} />
                      <span>Share Prediction</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full flex gap-2"
                    >
                      <Save size={16} />
                      <span>Save for Later</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="form">
            <div className="p-6">
              <PredictionForm match={match} currentOdds={currentOdds} />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    );
  }

  // Default case: show prediction form
  return (
    <div className={className}>
      <PredictionForm match={match} currentOdds={currentOdds} />
    </div>
  );
}
