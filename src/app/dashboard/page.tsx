'use client';

import React, { useEffect } from 'react';
import { useData } from '@/contexts/data-context';
import Link from 'next/link';

export default function DashboardPage() {
  const { matches, predictions, odds, loading, error, lastRefresh, refreshAll } = useData();
  
  // Force data refresh when component mounts
  useEffect(() => {
    console.log('Dashboard mounted - refreshing data');
    refreshAll();
  }, [refreshAll]);
  
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

  console.log('Dashboard rendering with data:', { matches, predictions, odds });
