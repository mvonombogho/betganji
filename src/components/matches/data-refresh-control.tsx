"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DataRefreshControlProps {
  className?: string;
}

export function DataRefreshControl({ className = "" }: DataRefreshControlProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [loading, setLoading] = useState(true);

  // Format the last refreshed time
  const formatLastRefreshed = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get the initial refresh status
  useEffect(() => {
    fetchRefreshStatus();
    const intervalId = setInterval(fetchRefreshStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Fetch the last refresh timestamp
  const fetchRefreshStatus = async () => {
    try {
      const response = await fetch('/api/refresh');
      
      if (response.ok) {
        const data = await response.json();
        setLastRefreshed(data.formattedTime);
      }
    } catch (error) {
      console.error('Error fetching refresh status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger a manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLastRefreshed(data.lastRefreshed);
        toast({
          title: 'Data Refreshed',
          description: 'Match data has been successfully updated.',
          variant: 'success',
        });
      } else {
        throw new Error('Failed to refresh data');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Something went wrong while refreshing data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update the refresh interval
  const handleUpdateInterval = async () => {
    try {
      const response = await fetch('/api/refresh', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intervalMinutes }),
      });
      
      if (response.ok) {
        toast({
          title: 'Interval Updated',
          description: `Auto-refresh interval set to ${intervalMinutes} minutes.`,
        });
      } else {
        throw new Error('Failed to update refresh interval');
      }
    } catch (error) {
      console.error('Error updating interval:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update the refresh interval.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Data Refresh Controls</CardTitle>
        <CardDescription>
          Manage automatic data updates for matches and odds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>
              {loading ? 'Loading...' : (
                lastRefreshed 
                  ? `Last updated: ${formatLastRefreshed(lastRefreshed)}` 
                  : 'No recent updates'
              )}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Now'}</span>
          </Button>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="interval">Auto-refresh interval (minutes)</Label>
          <div className="flex gap-2">
            <Input
              id="interval"
              type="number"
              min="1"
              max="60"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(parseInt(e.target.value) || 5)}
              className="w-24"
            />
            <Button variant="secondary" onClick={handleUpdateInterval}>
              Update
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-gray-500">
        <p>
          Auto-refresh helps keep match data, scores, and odds up to date.
        </p>
      </CardFooter>
    </Card>
  );
}
