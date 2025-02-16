"use client";

import { useState, useEffect } from 'react';
import { MatchList } from '@/components/matches/match-list';
import { Match } from '@/types/match';
import { getDateString, addDays } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchMatches();
  }, [date]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/matches?date=${getDateString(date)}`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      // You might want to add error state handling here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Matches</h1>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setDate(addDays(date, -1))}
          >
            Previous Day
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            onClick={() => setDate(addDays(date, 1))}
          >
            Next Day
          </Button>
        </div>
      </div>

      <MatchList matches={matches} isLoading={isLoading} />
    </div>
  );
}
