"use client";

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { OddsChart } from './odds-chart';

interface LiveOddsProps {
  matchId: string;
  initialOdds: Array<{
    timestamp: Date;
    homeWin: number;
    draw: number;
    awayWin: number;
  }>;
  homeTeam: string;
  awayTeam: string;
}

export function LiveOdds({ matchId, initialOdds, homeTeam, awayTeam }: LiveOddsProps) {
  const [oddsHistory, setOddsHistory] = useState(initialOdds);
  const [currentOdds, setCurrentOdds] = useState(initialOdds[0]);
  const { onOddsUpdate } = useWebSocket();

  useEffect(() => {
    const unsubscribe = onOddsUpdate((payload) => {
      if (payload.matchId === matchId) {
        setOddsHistory(prev => [...prev, payload.odds]);
        setCurrentOdds(payload.odds);
      }
    });

    return () => unsubscribe();
  }, [matchId, onOddsUpdate]);

  return (
    <div className="space-y-4">
      {/* Current Odds Display */}
      <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{homeTeam}</div>
          <div className="text-2xl font-bold text-blue-600">
            {currentOdds.homeWin.toFixed(2)}
          </div>
          {oddsHistory.length > 1 && (
            <Movement
              current={currentOdds.homeWin}
              previous={oddsHistory[oddsHistory.length - 2].homeWin}
            />
          )}
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Draw</div>
          <div className="text-2xl font-bold text-gray-600">
            {currentOdds.draw.toFixed(2)}
          </div>
          {oddsHistory.length > 1 && (
            <Movement
              current={currentOdds.draw}
              previous={oddsHistory[oddsHistory.length - 2].draw}
            />
          )}
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">{awayTeam}</div>
          <div className="text-2xl font-bold text-red-600">
            {currentOdds.awayWin.toFixed(2)}
          </div>
          {oddsHistory.length > 1 && (
            <Movement
              current={currentOdds.awayWin}
              previous={oddsHistory[oddsHistory.length - 2].awayWin}
            />
          )}
        </div>
      </div>

      {/* Odds Chart */}
      <OddsChart 
        data={oddsHistory}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />

      <div className="text-xs text-gray-400 text-right">
        Last updated: {new Date(currentOdds.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

function Movement({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return null;

  const isUp = diff > 0;
  return (
    <div className={`text-xs ${isUp ? 'text-green-500' : 'text-red-500'}`}>
      {isUp ? '↑' : '↓'} {Math.abs(diff).toFixed(2)}
    </div>
  );
}
