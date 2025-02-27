"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, Share2 } from 'lucide-react';
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
