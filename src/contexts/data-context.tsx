"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Match } from '@/types/match';
import { Prediction } from '@/types/prediction';

type DataContextType = {
  matches: Match[];
  predictions: Array<Prediction & { match: Match }>;
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refreshing: boolean;
  refreshMatches: () => Promise<void>;
  refreshPredictions: () => Promise<void>;
  refreshAll: () => Promise<void>;
  initializeData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Array<Prediction & { match: Match }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshMatches = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/matches/refresh');
      
      if (!response.ok) {
        throw new Error('Failed to refresh matches');
      }
      
      const data = await response.json();
      setMatches(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const refreshPredictions = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/predictions/refresh');
      
      if (!response.ok) {
        throw new Error('Failed to refresh predictions');
      }
      
      const data = await response.json();
      setPredictions(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        refreshMatches(),
        refreshPredictions()
      ]);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  }, [refreshMatches, refreshPredictions]);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/initialize');
      
      if (!response.ok) {
        throw new Error('Failed to initialize data');
      }
      
      const data = await response.json();
      setMatches(data.matches || []);
      setPredictions(data.predictions || []);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

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
    loading,
    error,
    lastRefresh,
    refreshing,
    refreshMatches,
    refreshPredictions,
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
