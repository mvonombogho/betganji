import { Match } from '@/types/match';
import { Prediction } from '@/types/prediction';

/**
 * Fetches all predictions with their associated matches
 */
export async function fetchPredictions(): Promise<Array<Prediction & { match: Match }>> {
  try {
    const response = await fetch('/api/predictions');
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchPredictions:', error);
    throw error;
  }
}

/**
 * Fetches a single prediction by ID
 */
export async function fetchPredictionById(predictionId: string): Promise<Prediction & { match: Match }> {
  try {
    const response = await fetch(`/api/predictions/${predictionId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch prediction with ID: ${predictionId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchPredictionById for ID ${predictionId}:`, error);
    throw error;
  }
}

/**
 * Creates a new prediction for a match
 */
export async function createPrediction(
  matchId: string,
  data: Omit<Prediction, 'id' | 'matchId' | 'createdAt' | 'updatedAt'>
): Promise<Prediction & { match: Match }> {
  try {
    const response = await fetch('/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchId,
        ...data,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create prediction');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createPrediction:', error);
    throw error;
  }
}

/**
 * Settles predictions for matches that have been completed
 */
export async function settlePredictions(predictionIds: string[]): Promise<Array<Prediction & { match: Match }>> {
  try {
    const response = await fetch('/api/predictions/settle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ predictionIds }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to settle predictions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in settlePredictions:', error);
    throw error;
  }
}

/**
 * Fetches predictions for a specific match
 */
export async function fetchPredictionsByMatch(
  matchId: string
): Promise<Array<Prediction & { match: Match }>> {
  try {
    const response = await fetch(`/api/predictions/match/${matchId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch predictions for match: ${matchId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchPredictionsByMatch for match ID ${matchId}:`, error);
    throw error;
  }
}

/**
 * Fetches predictions that were correct (for accuracy analysis)
 */
export async function fetchCorrectPredictions(): Promise<Array<Prediction & { match: Match }>> {
  try {
    const response = await fetch('/api/predictions/correct');
    
    if (!response.ok) {
      throw new Error('Failed to fetch correct predictions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchCorrectPredictions:', error);
    throw error;
  }
}

/**
 * Fetches prediction accuracy statistics
 */
export async function fetchPredictionStats(): Promise<{
  total: number;
  correct: number;
  accuracy: number;
  byCompetition: Record<string, { total: number; correct: number; accuracy: number }>;
  byConfidence: Record<string, { total: number; correct: number; accuracy: number }>;
}> {
  try {
    const response = await fetch('/api/predictions/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch prediction statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchPredictionStats:', error);
    throw error;
  }
}
