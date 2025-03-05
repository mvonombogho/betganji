'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { 
  MockMatchService,
  MockOddsService,
  MockPredictionService,
  MockUserService
} from '@/lib/mock/service';

// Service interfaces
interface MatchService {
  getMatches: (date?: string) => Promise<any[]>;
  getMatchById: (id: string) => Promise<any | null>;
  getUpcomingMatches: () => Promise<any[]>;
  getLiveMatches: () => Promise<any[]>;
  getFinishedMatches: () => Promise<any[]>;
}

interface OddsService {
  getOddsForMatch: (matchId: string) => Promise<any[]>;
  getBestOddsForMatch: (matchId: string) => Promise<any | null>;
  getAverageOddsForMatch: (matchId: string) => Promise<any | null>;
  getLiveOdds: (matchId: string) => Promise<any[]>;
}

interface PredictionService {
  getPredictions: () => Promise<any[]>;
  getPredictionById: (id: string) => Promise<any | null>;
  getPredictionsForMatch: (matchId: string) => Promise<any[]>;
  getUserPredictions: (userId: string) => Promise<any[]>;
  createPrediction: (data: any) => Promise<any>;
}

interface UserService {
  getUserById: (id: string) => Promise<any | null>;
  getUserByEmail: (email: string) => Promise<any | null>;
  login: (email: string, password: string) => Promise<any | null>;
  register: (data: any) => Promise<any>;
  updateProfile: (userId: string, data: any) => Promise<any | null>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface ServiceContextType {
  matchService: MatchService;
  oddsService: OddsService;
  predictionService: PredictionService;
  userService: UserService;
  useMockServices: boolean;
  toggleMockServices: () => void;
}

// Create the context
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Create provider component
export function ServiceProvider({ children }: { children: ReactNode }) {
  // Always use mock services for now
  const [useMockServices, setUseMockServices] = React.useState(true);

  // Create instances of mock services
  const mockMatchService = new MockMatchService();
  const mockOddsService = new MockOddsService();
  const mockPredictionService = new MockPredictionService();
  const mockUserService = new MockUserService();

  // Force services to always use mock implementation
  const services = {
    matchService: mockMatchService,
    oddsService: mockOddsService,
    predictionService: mockPredictionService,
    userService: mockUserService,
    useMockServices: true, // Always true
    toggleMockServices: () => {
      console.log('Mock services are always enabled in development mode');
      // We won't actually toggle, but maintain the function for interface consistency
    },
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

// Custom hook to use the service context
export function useServices() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
