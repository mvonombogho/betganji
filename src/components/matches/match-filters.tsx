"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Upcoming', value: 'SCHEDULED' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Finished', value: 'FINISHED' }
];

export function MatchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || '';

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    router.push(`/matches?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {STATUS_FILTERS.map((filter) => (
        <Button
          key={filter.value}
          variant={currentStatus === filter.value ? 'default' : 'outline'}
          onClick={() => handleStatusChange(filter.value)}
          className="h-8"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
