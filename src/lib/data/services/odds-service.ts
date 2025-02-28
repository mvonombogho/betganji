import { Odds } from '@/types/odds';

/**
 * Fetches the latest odds for a match from all providers
 */
export async function fetchLatestOdds(matchId: string): Promise<Odds[]> {
  try {
    const response = await fetch(`/api/odds/match/${matchId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch odds for match ID: ${matchId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchLatestOdds for match ${matchId}:`, error);
    throw error;
  }
}

/**
 * Updates odds for multiple matches
 */
export async function updateOdds(odds: Odds[]): Promise<Odds[]> {
  try {
    const response = await fetch('/api/odds/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ odds }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update odds');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in updateOdds:', error);
    throw error;
  }
}

/**
 * Fetches odds history for a match
 */
export async function fetchOddsHistory(
  matchId: string,
  provider?: string
): Promise<Odds[]> {
  try {
    let url = `/api/odds/history/${matchId}`;
    if (provider) {
      url += `?provider=${encodeURIComponent(provider)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch odds history for match: ${matchId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchOddsHistory for match ${matchId}:`, error);
    throw error;
  }
}

/**
 * Fetches best available odds for a match
 * Returns the best odds from all providers for each outcome
 */
export async function fetchBestOdds(matchId: string): Promise<{
  homeWin: { value: number; provider: string };
  draw: { value: number; provider: string };
  awayWin: { value: number; provider: string };
}> {
  try {
    const response = await fetch(`/api/odds/best/${matchId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch best odds for match: ${matchId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchBestOdds for match ${matchId}:`, error);
    throw error;
  }
}

/**
 * Fetches odds movement data for a match
 */
export async function fetchOddsMovement(
  matchId: string,
  provider?: string
): Promise<{
  homeWin: Array<{ timestamp: string; value: number }>;
  draw: Array<{ timestamp: string; value: number }>;
  awayWin: Array<{ timestamp: string; value: number }>;
}> {
  try {
    let url = `/api/odds/movement/${matchId}`;
    if (provider) {
      url += `?provider=${encodeURIComponent(provider)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch odds movement for match: ${matchId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchOddsMovement for match ${matchId}:`, error);
    throw error;
  }
}
