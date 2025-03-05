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
