import { useRouter, useSearchParams } from 'next/navigation';
import { SUPPORTED_SPORTS } from '@/lib/data/constants/sports';
import { Button } from '@/components/ui/button';

export function SportsSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSport = searchParams.get('sportKey') || 'soccer_epl';

  return (
    <div className="mb-6 space-x-2 overflow-x-auto whitespace-nowrap pb-2">
      {SUPPORTED_SPORTS.map((sport) => (
        <Button
          key={sport.key}
          variant={currentSport === sport.key ? 'default' : 'outline'}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('sportKey', sport.key);
            router.push(`/odds?${params.toString()}`);
          }}
          className="min-w-fit"
        >
          {sport.name}
        </Button>
      ))}
    </div>
  );
}