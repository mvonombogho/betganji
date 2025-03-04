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
      console.log('Refreshing matches...');
      
      if (useMockServices) {
        // Use mock service
        const data = await matchService.getMatches();
        console.log('Mock matches data:', data);
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
      console.error('Error refreshing matches:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [matchService, useMockServices]);

  const refreshPredictions = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing predictions...');
      
      if (useMockServices) {
        // Use mock service
        const data = await predictionService.getPredictions();
        console.log('Mock predictions data:', data);
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
      console.error('Error refreshing predictions:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [predictionService, useMockServices]);

  const refreshOdds = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing odds...');
      
      if (useMockServices) {
        // For mock services, we'll combine all odds from all matches
        const allOdds: OddsData[] = [];
        
        for (const match of matches) {
          const matchOdds = await oddsService.getOddsForMatch(match.id);
          console.log(`Mock odds for match ${match.id}:`, matchOdds);
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
      console.error('Error refreshing odds:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [matches, oddsService, useMockServices]);

  const refreshAll = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      console.log('Refreshing all data...');
      
      // Execute in sequence rather than parallel to avoid potential race conditions
      await refreshMatches();
      await refreshPredictions();
      await refreshOdds();
      
      setLastRefresh(new Date());
      console.log('All data refreshed successfully');
    } catch (err) {
      console.error('Failed to refresh all data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshPredictions, refreshOdds]);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Initializing data...');
      
      if (useMockServices) {
        // Use mock services
        console.log('Using mock services for initialization');
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
        
        console.log('Mock data initialized:', { 
          matches: matchesData.length, 
          predictions: predictionsData.length, 
          odds: allOdds.length 
        });
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
      console.error('Failed to initialize data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [matchService, predictionService, oddsService, useMockServices]);

  // Initialize data on component mount
  useEffect(() => {
    console.log('DataProvider mounted - initializing data');
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
