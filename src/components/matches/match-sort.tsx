"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SortAsc, SortDesc } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Date', value: 'datetime' },
  { label: 'Home Odds', value: 'homeOdds' },
  { label: 'Away Odds', value: 'awayOdds' }
];

export function MatchSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'datetime';
  const currentOrder = searchParams.get('order') || 'asc';

  const handleSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // If clicking the same sort option, toggle order
    if (sortValue === currentSort) {
      params.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sort', sortValue);
      params.set('order', 'asc');
    }

    router.push(`/matches?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      {SORT_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={currentSort === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort(option.value)}
          className="flex items-center gap-1"
        >
          {option.label}
          {currentSort === option.value && (
            currentOrder === 'asc' ? 
              <SortAsc className="h-4 w-4" /> : 
              <SortDesc className="h-4 w-4" />
          )}
        </Button>
      ))}
    </div>
  );
}
