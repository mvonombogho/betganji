import { OddsData } from '@/types/odds';
import { mockMatches } from './matches';

// Create IDs for mock data
const createId = () => Math.random().toString(36).substring(2, 15);

// Define a few odds providers
const providers = ['Betfair', 'Bet365', 'William Hill', 'Unibet', 'Betway'];

// Helper function to generate reasonable odds based on team strength
// Higher number = less likely to win (higher odds)
const generateOdds = (homeStrength: number, awayStrength: number) => {
  // Base odds
  const homeWinBase = 1 + (homeStrength / 5) * 2;
  const awayWinBase = 1 + (awayStrength / 5) * 2;
  const drawBase = 3 + (Math.abs(homeStrength - awayStrength) / 5);

  // Add some randomness
  const randomFactor = 0.2;
  const homeWin = parseFloat((homeWinBase + (Math.random() * randomFactor * 2 - randomFactor)).toFixed(2));
  const awayWin = parseFloat((awayWinBase + (Math.random() * randomFactor * 2 - randomFactor)).toFixed(2));
  const draw = parseFloat((drawBase + (Math.random() * randomFactor * 2 - randomFactor)).toFixed(2));

  return { homeWin, draw, awayWin };
};

// Generate odds for each match and each provider
export const mockOdds: OddsData[] = [];

mockMatches.forEach(match => {
  // Randomly assign strength values to teams (1-10)
  const homeStrength = Math.floor(Math.random() * 5) + 5; // 5-10
  const awayStrength = Math.floor(Math.random() * 5) + 5; // 5-10

  // Generate odds for each provider
  providers.forEach(provider => {
    const odds = generateOdds(homeStrength, awayStrength);
    
    mockOdds.push({
      id: createId(),
      matchId: match.id,
      provider,
      homeWin: odds.homeWin,
      draw: odds.draw,
      awayWin: odds.awayWin,
      timestamp: new Date().toISOString(),
    });
  });
});

// Utility functions
export const getOddsForMatch = (matchId: string): OddsData[] => {
  return mockOdds.filter(odds => odds.matchId === matchId);
};

export const getOddsByProvider = (provider: string): OddsData[] => {
  return mockOdds.filter(odds => odds.provider === provider);
};

export const getBestOddsForMatch = (matchId: string): OddsData | undefined => {
  const matchOdds = getOddsForMatch(matchId);
  
  if (matchOdds.length === 0) return undefined;
  
  // Find best homeWin odds
  const bestHomeWin = Math.max(...matchOdds.map(o => o.homeWin));
  // Find best draw odds
  const bestDraw = Math.max(...matchOdds.map(o => o.draw));
  // Find best awayWin odds
  const bestAwayWin = Math.max(...matchOdds.map(o => o.awayWin));
  
  // Create a composite "best odds" entry
  return {
    id: 'best-odds',
    matchId,
    provider: 'Best Odds',
    homeWin: bestHomeWin,
    draw: bestDraw,
    awayWin: bestAwayWin,
    timestamp: new Date().toISOString(),
  };
};

// Get average odds across all providers
export const getAverageOddsForMatch = (matchId: string): OddsData | undefined => {
  const matchOdds = getOddsForMatch(matchId);
  
  if (matchOdds.length === 0) return undefined;
  
  const avgHomeWin = parseFloat((matchOdds.reduce((sum, odd) => sum + odd.homeWin, 0) / matchOdds.length).toFixed(2));
  const avgDraw = parseFloat((matchOdds.reduce((sum, odd) => sum + odd.draw, 0) / matchOdds.length).toFixed(2));
  const avgAwayWin = parseFloat((matchOdds.reduce((sum, odd) => sum + odd.awayWin, 0) / matchOdds.length).toFixed(2));
  
  return {
    id: 'average-odds',
    matchId,
    provider: 'Average',
    homeWin: avgHomeWin,
    draw: avgDraw,
    awayWin: avgAwayWin,
    timestamp: new Date().toISOString(),
  };
};
