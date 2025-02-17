"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export function MatchSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    router.push(`/matches?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search teams or competitions..."
        className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
