import { Match } from '@/types/match';

/**
 * Fetches all matches from the database
 */
export async function fetchMatches(): Promise<Match[]> {
  try {
    const response = await fetch('/api/matches');
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchMatches:', error);
    throw error;
  }
}

/**
 * Fetches a single match by ID
 */
export async function fetchMatchById(matchId: string): Promise<Match> {
  try {
    const response = await fetch(`/api/matches/${matchId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch match with ID: ${matchId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchMatchById for ID ${matchId}:`, error);
    throw error;
  }
}

/**
 * Updates match scores for multiple matches
 */
export async function updateMatchScores(matchIds: string[]): Promise<Match[]> {
  try {
    const response = await fetch('/api/matches/update-scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchIds }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update match scores');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in updateMatchScores:', error);
    throw error;
  }
}

/**
 * Fetches upcoming matches
 */
export async function fetchUpcomingMatches(): Promise<Match[]> {
  try {
    const response = await fetch('/api/matches/upcoming');
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming matches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchUpcomingMatches:', error);
    throw error;
  }
}

/**
 * Fetches matches by date range
 */
export async function fetchMatchesByDateRange(
  startDate: string,
  endDate: string
): Promise<Match[]> {
  try {
    const response = await fetch(
      `/api/matches/date-range?start=${startDate}&end=${endDate}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch matches by date range');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchMatchesByDateRange:', error);
    throw error;
  }
}

/**
 * Fetches matches by competition
 */
export async function fetchMatchesByCompetition(
  competitionId: string
): Promise<Match[]> {
  try {
    const response = await fetch(`/api/matches/competition/${competitionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch matches for competition: ${competitionId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchMatchesByCompetition for ID ${competitionId}:`, error);
    throw error;
  }
}
