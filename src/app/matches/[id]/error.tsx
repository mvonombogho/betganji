"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function MatchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Match page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        
        <div className="mb-6 text-gray-600">
          {error.message || 'Failed to load match details'}
        </div>

        <div className="space-y-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="ml-4"
          >
            Return home
          </Button>
        </div>
      </div>
    </div>
  );
}
