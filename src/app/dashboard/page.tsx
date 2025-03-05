'use client';

import React from 'react';
import { useData } from '@/contexts/data-context';
import Link from 'next/link';

export default function DashboardPage() {
  const { matches, predictions, odds, loading, error, lastRefresh, refreshAll } = useData();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refreshAll}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Group upcoming matches by date
  const upcomingMatches = matches
    .filter(match => match.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  
  // Get live matches
  const liveMatches = matches.filter(match => match.status === 'IN_PLAY');
  
  // Get recent predictions
  const recentPredictions = predictions
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">BetGanji Dashboard</h1>
        <button
          onClick={refreshAll}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
      
      {lastRefresh && (
        <p className="text-sm text-gray-500 mb-6">
          Last updated: {new Date(lastRefresh).toLocaleString()}
        </p>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Stats Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
              <p className="text-sm text-blue-600 dark:text-blue-300">Total Matches</p>
              <p className="text-2xl font-bold">{matches.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-300">Predictions</p>
              <p className="text-2xl font-bold">{predictions.length}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-md">
              <p className="text-sm text-purple-600 dark:text-purple-300">Live Matches</p>
              <p className="text-2xl font-bold">{liveMatches.length}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
              <p className="text-sm text-amber-600 dark:text-amber-300">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingMatches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Matches</h2>
            <Link href="/matches" className="text-blue-600 hover:text-blue-500 text-sm">
              View All
            </Link>
          </div>
          
          {liveMatches.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No live matches at the moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveMatches.map(match => (
                <Link 
                  href={`/matches/${match.id}`} 
                  key={match.id}
                  className="block bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-3 transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      <span className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</span>
                    </div>
                    <div className="text-lg font-bold">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {match.competition} • Live
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Matches</h2>
            <Link href="/matches" className="text-blue-600 hover:text-blue-500 text-sm">
              View All
            </Link>
          </div>
          
          {upcomingMatches.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No upcoming matches scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.slice(0, 5).map(match => (
                <Link 
                  href={`/matches/${match.id}`} 
                  key={match.id}
                  className="block bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-3 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{match.homeTeam.name} vs {match.awayTeam.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(match.datetime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {match.competition} • {new Date(match.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Predictions</h2>
            <Link href="/predictions" className="text-blue-600 hover:text-blue-500 text-sm">
              View All
            </Link>
          </div>
          
          {recentPredictions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">No predictions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPredictions.map(prediction => {
                // Find the match associated with this prediction
                const match = matches.find(m => m.id === prediction.matchId);
                
                if (!match) return null;
                
                return (
                  <Link 
                    href={`/predictions/${prediction.id}`} 
                    key={prediction.id}
                    className="block bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-3 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        prediction.result === 'WIN' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                          : prediction.result === 'LOSS' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {prediction.result}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {prediction.prediction.replace('_', ' ')} • Confidence: {prediction.confidence}%
                      </div>
                      <div className="text-sm font-medium">
                        {prediction.odds && `${prediction.odds}x`}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">About BetGanji</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            BetGanji is an AI-powered sports prediction platform that leverages advanced machine learning models to analyze soccer matches and provide betting insights.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This dashboard is running with mock data for demonstration purposes. Use the toggle in the bottom right corner to switch between mock and real data services.
          </p>
        </div>
      </div>
    </div>
  );
}
