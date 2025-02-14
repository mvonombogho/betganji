export const SOCKET_EVENTS = {
  // Match events
  MATCH_UPDATE: 'match:update',
  MATCH_STATUS: 'match:status',
  MATCH_SCORE: 'match:score',
  MATCH_TIMELINE: 'match:timeline',
  
  // Odds events
  ODDS_UPDATE: 'odds:update',
  ODDS_SUSPENDED: 'odds:suspended',
  ODDS_RESTORED: 'odds:restored',
  
  // Bet events
  BET_SETTLED: 'bet:settled',
  BET_VOIDED: 'bet:voided',
  
  // System events
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_ERROR: 'system:error',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];