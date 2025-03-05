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
