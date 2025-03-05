import { Match, MatchStatus } from '@/types/match';
import { mockTeams } from './teams';

// Create IDs for mock data
const createId = () => Math.random().toString(36).substring(2, 15);

// Create dates for upcoming matches
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

// Generate a match between two teams
const createMatch = (
  homeTeamIndex: number,
  awayTeamIndex: number,
  datetime: Date,
  status: MatchStatus = 'SCHEDULED',
  homeScore?: number,
  awayScore?: number
): Match => {
  const homeTeam = mockTeams[homeTeamIndex];
  const awayTeam = mockTeams[awayTeamIndex];
  
  return {
    id: createId(),
    homeTeam,
    awayTeam,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    datetime: datetime.toISOString(),
    status,
    homeScore,
    awayScore,
    competition: homeTeam.league,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Create a mix of past, live, and upcoming matches
export const mockMatches: Match[] = [
  // Past matches (FINISHED)
  createMatch(0, 1, new Date(today.getTime() - 86400000 * 3), 'FINISHED', 2, 1),
  createMatch(2, 3, new Date(today.getTime() - 86400000 * 3), 'FINISHED', 0, 0),
  createMatch(4, 5, new Date(today.getTime() - 86400000 * 4), 'FINISHED', 3, 1),
  createMatch(6, 7, new Date(today.getTime() - 86400000 * 4), 'FINISHED', 1, 2),
  createMatch(8, 9, new Date(today.getTime() - 86400000 * 5), 'FINISHED', 0, 2),
  createMatch(10, 11, new Date(today.getTime() - 86400000 * 5), 'FINISHED', 1, 1),
  createMatch(12, 13, new Date(today.getTime() - 86400000 * 6), 'FINISHED', 4, 2),
  
  // Today's matches (mix of IN_PLAY and FINISHED)
  createMatch(7, 6, new Date(today.setHours(13, 0, 0, 0)), 'FINISHED', 2, 2),
  createMatch(9, 8, new Date(today.setHours(15, 0, 0, 0)), 'FINISHED', 1, 0),
  createMatch(1, 0, new Date(today.setHours(17, 0, 0, 0)), 'IN_PLAY', 1, 1),
  createMatch(3, 2, new Date(today.setHours(19, 0, 0, 0)), 'IN_PLAY', 0, 2),
  createMatch(11, 10, new Date(today.setHours(20, 0, 0, 0)), 'SCHEDULED'),
  
  // Upcoming matches (SCHEDULED)
  createMatch(5, 4, tomorrow, 'SCHEDULED'),
  createMatch(13, 12, tomorrow, 'SCHEDULED'),
  createMatch(14, 2, tomorrow, 'SCHEDULED'),
  createMatch(3, 14, dayAfterTomorrow, 'SCHEDULED'),
  createMatch(6, 8, dayAfterTomorrow, 'SCHEDULED'),
  createMatch(10, 1, dayAfterTomorrow, 'SCHEDULED'),
  createMatch(0, 4, nextWeek, 'SCHEDULED'),
  createMatch(7, 9, nextWeek, 'SCHEDULED'),
  createMatch(11, 13, nextWeek, 'SCHEDULED'),
];

// Utility functions
export const getUpcomingMatches = (): Match[] => {
  return mockMatches.filter(match => match.status === 'SCHEDULED');
};

export const getLiveMatches = (): Match[] => {
  return mockMatches.filter(match => match.status === 'IN_PLAY');
};

export const getFinishedMatches = (): Match[] => {
  return mockMatches.filter(match => match.status === 'FINISHED');
};

export const getMatchById = (id: string): Match | undefined => {
  return mockMatches.find(match => match.id === id);
};

export const getMatchesByTeam = (teamId: string): Match[] => {
  return mockMatches.filter(
    match => match.homeTeamId === teamId || match.awayTeamId === teamId
  );
};

export const getMatchesByCompetition = (competition: string): Match[] => {
  return mockMatches.filter(match => match.competition === competition);
};
