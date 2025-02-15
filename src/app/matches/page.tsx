'use client';

import { useState, useEffect } from 'react';
import { Match } from '@/types/match';
import { MatchList } from '@/components/matches/match-list';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchMatches = async (date: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matches?date=${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load matches. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchMatches(today);
  }, []);

  const handleMatchSelect = (match: Match) => {
    router.push(`/predictions/${match.id}`);
  };

  const handleDateChange = (date: string) => {
    fetchMatches(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Soccer Matches</h1>
          <p className="text-gray-500 mt-2">
            Browse matches and make predictions
          </p>
        </div>

        <MatchList
          matches={matches}
          onMatchSelect={handleMatchSelect}
          onDateChange={handleDateChange}
        />
      </div>
    </div>
  );
}