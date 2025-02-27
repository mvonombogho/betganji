"use client";

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDataService = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/init', {
          method: 'POST',
        });
        
        if (response.ok) {
          setIsInitialized(true);
          // Success but quietly - no need to notify user of background service
        } else {
          throw new Error('Failed to initialize data service');
        }
      } catch (error) {
        console.error('Error initializing data service:', error);
        toast({
          title: 'Data Service Error',
          description: 'Failed to initialize the data service. Some features may not work properly.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeDataService();

    // Cleanup on unmount (in case app is closed)
    return () => {
      // Could add a cleanup API endpoint if needed
    };
  }, [toast]);

  return (
    <>
      {children}
    </>
  );
}
