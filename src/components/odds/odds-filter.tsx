import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface OddsFilterProps {
  onFilterChange: (filters: OddsFilters) => void;
}

export interface OddsFilters {
  minOdds?: number;
  maxOdds?: number;
  search?: string;
}

export function OddsFilter({ onFilterChange }: OddsFilterProps) {
  const [filters, setFilters] = useState<OddsFilters>({});

  const handleChange = (name: keyof OddsFilters, value: string) => {
    const newFilters = {
      ...filters,
      [name]: name === 'search' ? value : Number(value) || undefined
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-5">
      <div className="space-y-2">
        <Label htmlFor="search">Search Teams</Label>
        <Input
          id="search"
          placeholder="Team name..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="minOdds">Min Odds</Label>
        <Input
          id="minOdds"
          type="number"
          step="0.1"
          min="1"
          placeholder="Min odds..."
          value={filters.minOdds || ''}
          onChange={(e) => handleChange('minOdds', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxOdds">Max Odds</Label>
        <Input
          id="maxOdds"
          type="number"
          step="0.1"
          min="1"
          placeholder="Max odds..."
          value={filters.maxOdds || ''}
          onChange={(e) => handleChange('maxOdds', e.target.value)}
        />
      </div>
      <div className="flex items-end">
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}