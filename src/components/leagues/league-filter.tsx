import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface League {
  id: string;
  name: string;
  country: string;
}

interface LeagueFilterProps {
  leagues: League[];
  selectedLeague?: string;
  onLeagueChange: (leagueId: string) => void;
}

export function LeagueFilter({ leagues, selectedLeague, onLeagueChange }: LeagueFilterProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="league-select">Select League</Label>
      <Select value={selectedLeague} onValueChange={onLeagueChange}>
        <SelectTrigger id="league-select" className="w-full">
          <SelectValue placeholder="Choose a league" />
        </SelectTrigger>
        <SelectContent>
          {leagues.map((league) => (
            <SelectItem key={league.id} value={league.id}>
              <div className="flex items-center gap-2">
                <span>{league.country}</span>
                <span>-</span>
                <span>{league.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}