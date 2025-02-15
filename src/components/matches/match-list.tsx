import { Match } from '@/types/match';
import { MatchCard } from './match-card';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MatchListProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
  onDateChange: (date: string) => void;
}

export function MatchList({ matches, onMatchSelect, onDateChange }: MatchListProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [competition, setCompetition] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  // Get unique competitions from matches
  const competitions = Array.from(
    new Set(matches.map((match) => match.competition.name))
  );

  // Filter matches based on selected filters
  const filteredMatches = matches.filter((match) => {
    const matchCompetition = competition === 'all' || match.competition.name === competition;
    const matchStatus = status === 'all' || match.status === status;
    return matchCompetition && matchStatus;
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateChange(newDate.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-4 rounded-lg">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date.toLocaleDateString() : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select
          value={competition}
          onValueChange={setCompetition}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Competitions</SelectItem>
            {competitions.map((comp) => (
              <SelectItem key={comp} value={comp}>
                {comp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="LIVE">Live</SelectItem>
            <SelectItem value="IN_PLAY">In Play</SelectItem>
            <SelectItem value="FINISHED">Finished</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          onClick={() => {
            setCompetition('all');
            setStatus('all');
          }}
          className="ml-auto"
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Match Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onClick={() => onMatchSelect(match)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No matches found for the selected filters
        </div>
      )}
    </div>
  );
}