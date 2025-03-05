"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Match } from '@/types/match';
import { Prediction } from '@/types/prediction';
import { OddsData } from '@/types/odds';
import { useServices } from './ServiceContext';

type DataContextType = {
  matches: Match[];
  predictions: Prediction[];
  odds: OddsData[];
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refreshing: boolean;
  refreshMatches: () => Promise<void>;
  refreshPredictions: () => Promise<void>;
  refreshOdds: () => Promise<void>;
  refreshAll: () => Promise<void>;
  initializeData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { matchService, predictionService, oddsService, useMockServices } = useServices();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [odds, setOdds] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshMatches = useCallback(async () => {
    try {
      setRefreshing(true);
      
      if (useMockServices) {
        // Use mock service
        const data = await matchService.getMatches();
        setMatches(data);
      } else {
        // Use API
        const response = await fetch('/api/matches/refresh');
        if (!response.ok) {
          throw new Error('Failed to refresh matches');
        }
        const data = await response.json();
        setMatches(data);
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [matchService, useMockServices]);

  const refreshPredictions = useCallback(async () => {
    try {
      setRefreshing(true);
      
      if (useMockServices) {
        // Use mock service
        const data = await predictionService.getPredictions();
        setPredictions(data);
      } else {
        // Use API
        const response = await fetch('/api/predictions/refresh');
        if (!response.ok) {
          throw new Error('Failed to refresh predictions');
        }
        const data = await response.json();
        setPredictions(data);
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [predictionService, useMockServices]);

  const refreshOdds = useCallback(async () => {
    try {
      setRefreshing(true);
      
      if (useMockServices) {
        // For mock services, we'll combine all odds from all matches
        const allMatches = await matchService.getMatches();
        const allOdds: OddsData[] = [];
        
        for (const match of allMatches) {
          const matchOdds = await oddsService.getOddsForMatch(match.id);
          allOdds.push(...matchOdds);
        }
        
        setOdds(allOdds);
      } else {
        // Use API
        const response = await fetch('/api/odds/refresh');
        if (!response.ok) {
          throw new Error('Failed to refresh odds');
        }
        const data = await response.json();
        setOdds(data);
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [matchService, oddsService, useMockServices]);

  const refreshAll = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        refreshMatches(),
        refreshPredictions(),
        refreshOdds()
      ]);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshPredictions, refreshOdds]);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (useMockServices) {
        // Use mock services
        const matchesData = await matchService.getMatches();
        const predictionsData = await predictionService.getPredictions();
        
        // For mock services, we'll combine all odds from all matches
        const allOdds: OddsData[] = [];
        for (const match of matchesData) {
          const matchOdds = await oddsService.getOddsForMatch(match.id);
          allOdds.push(...matchOdds);
        }
        
        setMatches(matchesData);
        setPredictions(predictionsData);
        setOdds(allOdds);
      } else {
        // Use API
        const response = await fetch('/api/initialize');
        if (!response.ok) {
          throw new Error('Failed to initialize data');
        }
        const data = await response.json();
        setMatches(data.matches || []);
        setPredictions(data.predictions || []);
        setOdds(data.odds || []);
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [matchService, predictionService, oddsService, useMockServices]);

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
    
    // Setup automatic refresh every hour
    const refreshInterval = setInterval(() => {
      refreshAll();
    }, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(refreshInterval);
  }, [initializeData, refreshAll]);

  const value = {
    matches,
    predictions,
    odds,
    loading,
    error,
    lastRefresh,
    refreshing,
    refreshMatches,
    refreshPredictions,
    refreshOdds,
    refreshAll,
    initializeData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
