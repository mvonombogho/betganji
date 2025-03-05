import { Team } from '@/types/match';

// Create IDs for mock data
const createId = () => Math.random().toString(36).substring(2, 15);

export const mockTeams: Team[] = [
  {
    id: createId(),
    name: 'Manchester United',
    league: 'Premier League',
    country: 'England',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Manchester City',
    league: 'Premier League',
    country: 'England',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Liverpool',
    league: 'Premier League',
    country: 'England',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Chelsea',
    league: 'Premier League',
    country: 'England',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Arsenal',
    league: 'Premier League',
    country: 'England',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Tottenham Hotspur',
    league: 'Premier League',
    country: 'England',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Barcelona',
    league: 'La Liga',
    country: 'Spain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Real Madrid',
    league: 'La Liga',
    country: 'Spain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Atletico Madrid',
    league: 'La Liga',
    country: 'Spain',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Bayern Munich',
    league: 'Bundesliga',
    country: 'Germany',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Borussia Dortmund',
    league: 'Bundesliga',
    country: 'Germany',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Juventus',
    league: 'Serie A',
    country: 'Italy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'AC Milan',
    league: 'Serie A',
    country: 'Italy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Inter Milan',
    league: 'Serie A',
    country: 'Italy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: createId(),
    name: 'Paris Saint-Germain',
    league: 'Ligue 1',
    country: 'France',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get team by name utility
export const getTeamByName = (name: string): Team | undefined => {
  return mockTeams.find(team => team.name === name);
};

// Group teams by league utility
export const getTeamsByLeague = (league: string): Team[] => {
  return mockTeams.filter(team => team.league === league);
};
