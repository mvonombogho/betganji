'use client';

import React from 'react';
import { useServices } from '@/contexts/ServiceContext';
import { useData } from '@/contexts/data-context';

export function MockToggle() {
  const { useMockServices, toggleMockServices } = useServices();
  const { refreshAll } = useData();
  
  const handleToggle = async () => {
    toggleMockServices();
    // Give time for the toggle to complete
    setTimeout(() => {
      refreshAll();
    }, 100);
  };
  
  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-100 p-3 rounded-md shadow-md border border-yellow-300">
      <div className="text-sm font-medium mb-2">Developer Controls</div>
      <div className="flex items-center">
        <span className="mr-2 text-sm">Mock Services:</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={useMockServices}
            onChange={handleToggle}
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer ${useMockServices ? 'bg-blue-600' : 'bg-gray-200'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}></div>
        </label>
      </div>
      <div className="mt-2">
        <button
          onClick={() => refreshAll()}
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
